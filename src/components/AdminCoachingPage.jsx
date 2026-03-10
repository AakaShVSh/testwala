import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Icon,
  Spinner,
  Badge,
  Select,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Divider,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
  FaGlobe,
  FaWhatsapp,
  FaExternalLinkAlt,
  FaUser,
  FaBuilding,
  FaGraduationCap,
  FaFilter,
  FaEye,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    pending: {
      bg: "#fef9c3",
      color: "#a16207",
      icon: FaClock,
      label: "Pending",
    },
    approved: {
      bg: "#dcfce7",
      color: "#15803d",
      icon: FaCheckCircle,
      label: "Approved",
    },
    rejected: {
      bg: "#fee2e2",
      color: "#dc2626",
      icon: FaTimesCircle,
      label: "Rejected",
    },
  };
  const c = cfg[status] || cfg.pending;
  return (
    <Flex
      align="center"
      gap={1.5}
      bg={c.bg}
      color={c.color}
      px={3}
      py="4px"
      borderRadius="full"
      fontSize="11px"
      fontWeight={700}
      w="fit-content"
    >
      <Icon as={c.icon} fontSize="10px" />
      {c.label}
    </Flex>
  );
};

// ── Detail row ────────────────────────────────────────────────────────────────
const DRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <Flex align="flex-start" gap={3} py={2}>
      <Flex
        w="28px"
        h="28px"
        bg="#f1f5f9"
        borderRadius="7px"
        align="center"
        justify="center"
        flexShrink={0}
        mt="1px"
      >
        <Icon as={icon} fontSize="11px" color="#64748b" />
      </Flex>
      <Box flex={1} minW={0}>
        <Text
          fontSize="10px"
          color="#94a3b8"
          fontWeight={700}
          textTransform="uppercase"
          letterSpacing=".6px"
        >
          {label}
        </Text>
        <Text
          fontSize="13px"
          color="#1e293b"
          fontWeight={500}
          mt="2px"
          wordBreak="break-word"
        >
          {value}
        </Text>
      </Box>
    </Flex>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminCoachingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [acting, setActing] = useState(false);

  // ── Guard: redirect non-admins ──────────────────────────────────────────
  useEffect(() => {
    if (!authLoading && user && !user.isAdmin) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await apiFetch(`/admin/coaching/requests?${params}`);
      setRequests(res.data ?? []);
    } catch (err) {
      toast({ title: err.message, status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    if (!authLoading && user?.isAdmin) loadRequests();
  }, [loadRequests, authLoading, user]);

  const openDetail = (req) => {
    setSelected(req);
    setAdminNote(req.adminNote || "");
    onOpen();
  };

  const handleApprove = async () => {
    if (!selected) return;
    setActing(true);
    try {
      await apiFetch(`/admin/coaching/${selected._id}/approve`, {
        method: "PATCH",
        body: JSON.stringify({ adminNote }),
      });
      toast({
        title: `✅ "${selected.name}" approved and is now live!`,
        status: "success",
        duration: 4000,
      });
      onClose();
      loadRequests();
    } catch (err) {
      toast({ title: err.message, status: "error", duration: 4000 });
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    if (!selected) return;
    if (!adminNote.trim()) {
      toast({
        title: "Please provide a reason for rejection",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    setActing(true);
    try {
      await apiFetch(`/admin/coaching/${selected._id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ adminNote }),
      });
      toast({
        title: `"${selected.name}" rejected.`,
        status: "info",
        duration: 3000,
      });
      onClose();
      loadRequests();
    } catch (err) {
      toast({ title: err.message, status: "error", duration: 4000 });
    } finally {
      setActing(false);
    }
  };

  // Counts
  const counts = { pending: 0, approved: 0, rejected: 0 };
  requests.forEach((r) => {
    if (counts[r.status] !== undefined) counts[r.status]++;
  });

  if (authLoading) {
    return (
      <Flex minH="80vh" align="center" justify="center">
        <Spinner size="xl" color="#4a72b8" thickness="4px" />
      </Flex>
    );
  }

  if (!user?.isAdmin) return null;

  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
      {/* Header */}
      <Box
        bg="linear-gradient(135deg,#0f1e3a 0%,#1e3a5f 50%,#2d5fa8 100%)"
        px={{ base: 4, md: 8 }}
        pt={{ base: 8, md: 12 }}
        pb={{ base: 10, md: 16 }}
      >
        <Box maxW="1100px" mx="auto">
          <Text
            fontSize="11px"
            fontWeight={800}
            color="rgba(255,255,255,.45)"
            textTransform="uppercase"
            letterSpacing="3px"
            mb={2}
          >
            Admin Panel
          </Text>
          <Text
            fontSize={{ base: "24px", md: "36px" }}
            fontWeight={800}
            color="white"
            letterSpacing="-1px"
            mb={6}
          >
            Coaching Registrations
          </Text>

          {/* Stat pills */}
          <Flex gap={4} flexWrap="wrap">
            {[
              { label: "Pending Review", key: "pending", color: "#fbbf24" },
              { label: "Approved", key: "approved", color: "#4ade80" },
              { label: "Rejected", key: "rejected", color: "#f87171" },
            ].map((s) => (
              <Flex
                key={s.key}
                align="center"
                gap={3}
                bg="rgba(255,255,255,.1)"
                border="1px solid rgba(255,255,255,.15)"
                borderRadius="12px"
                px={4}
                py={3}
                cursor="pointer"
                onClick={() => setStatusFilter(s.key)}
                transition="all .15s"
                _hover={{ bg: "rgba(255,255,255,.16)" }}
                borderColor={
                  statusFilter === s.key
                    ? "rgba(255,255,255,.5)"
                    : "rgba(255,255,255,.15)"
                }
              >
                <Box w="8px" h="8px" borderRadius="full" bg={s.color} />
                <Box>
                  <Text
                    fontSize="22px"
                    fontWeight={800}
                    color="white"
                    lineHeight={1}
                  >
                    {s.key === statusFilter ? requests.length : "—"}
                  </Text>
                  <Text
                    fontSize="11px"
                    color="rgba(255,255,255,.55)"
                    fontWeight={600}
                  >
                    {s.label}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>

      <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        {/* Filters */}
        <Flex gap={3} mb={6} flexWrap={{ base: "wrap", md: "nowrap" }}>
          <InputGroup flex={1}>
            <InputLeftElement pointerEvents="none" h="full" pl={3}>
              <Icon as={FaSearch} color="gray.400" fontSize="13px" />
            </InputLeftElement>
            <Input
              placeholder="Search by name, city, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadRequests()}
              bg="white"
              borderRadius="10px"
              h="42px"
              fontSize="14px"
              pl="38px"
              border="1px solid #e2e8f0"
              _focus={{
                borderColor: "#4a72b8",
                boxShadow: "0 0 0 1px #4a72b8",
              }}
            />
          </InputGroup>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            bg="white"
            borderRadius="10px"
            h="42px"
            minW="160px"
            maxW="160px"
            fontSize="13px"
            fontWeight={600}
            border="1px solid #e2e8f0"
          >
            <option value="">All Statuses</option>
            <option value="pending">⏳ Pending</option>
            <option value="approved">✅ Approved</option>
            <option value="rejected">❌ Rejected</option>
          </Select>
          <Button
            onClick={loadRequests}
            bg="#4a72b8"
            color="white"
            borderRadius="10px"
            h="42px"
            px={5}
            fontSize="13px"
            fontWeight={700}
            _hover={{ bg: "#3b5fa0" }}
            flexShrink={0}
          >
            Search
          </Button>
        </Flex>

        {/* Table */}
        {loading ? (
          <Flex justify="center" py={20}>
            <Spinner color="#4a72b8" thickness="3px" size="xl" />
          </Flex>
        ) : requests.length === 0 ? (
          <Box
            py={20}
            textAlign="center"
            bg="white"
            borderRadius="16px"
            border="1px solid #e2e8f0"
          >
            <Icon
              as={FaBuilding}
              fontSize="48px"
              color="#e2e8f0"
              display="block"
              mx="auto"
              mb={4}
            />
            <Text fontSize="15px" fontWeight={700} color="#94a3b8">
              No {statusFilter || ""} requests found
            </Text>
          </Box>
        ) : (
          <Box
            bg="white"
            borderRadius="16px"
            border="1px solid #e2e8f0"
            overflow="hidden"
          >
            {/* Table header */}
            <Flex
              px={6}
              py={3}
              bg="#f8fafc"
              borderBottom="1px solid #e2e8f0"
              display={{ base: "none", md: "flex" }}
            >
              {["Coaching", "Owner", "Location", "Submitted", "Status", ""].map(
                (h, i) => (
                  <Text
                    key={h + i}
                    flex={i === 0 ? 3 : i === 5 ? 0 : 2}
                    w={i === 5 ? "90px" : undefined}
                    fontSize="11px"
                    fontWeight={700}
                    color="#94a3b8"
                    textTransform="uppercase"
                    letterSpacing=".8px"
                  >
                    {h}
                  </Text>
                ),
              )}
            </Flex>

            {requests.map((r, idx) => (
              <Flex
                key={r._id}
                px={6}
                py={4}
                align="center"
                borderBottom={
                  idx < requests.length - 1 ? "1px solid #f1f5f9" : "none"
                }
                transition="background .15s"
                _hover={{ bg: "#f8faff" }}
                gap={3}
                flexWrap={{ base: "wrap", md: "nowrap" }}
              >
                {/* Coaching name */}
                <Box flex={3} minW={0}>
                  <Text
                    fontSize="14px"
                    fontWeight={700}
                    color="#0f172a"
                    noOfLines={1}
                  >
                    {r.name}
                  </Text>
                  <Flex gap={1} mt={1} flexWrap="wrap">
                    {r.examTypes?.map((ex) => (
                      <Text
                        key={ex}
                        fontSize="9px"
                        fontWeight={700}
                        bg="#eff6ff"
                        color="#2563eb"
                        px={2}
                        py="2px"
                        borderRadius="full"
                      >
                        {ex}
                      </Text>
                    ))}
                  </Flex>
                </Box>

                {/* Owner */}
                <Box flex={2} minW={0} display={{ base: "none", md: "block" }}>
                  <Text
                    fontSize="13px"
                    fontWeight={600}
                    color="#374151"
                    noOfLines={1}
                  >
                    {r.owner?.Name || "—"}
                  </Text>
                  <Text fontSize="11px" color="#94a3b8" noOfLines={1}>
                    {r.owner?.Email || "—"}
                  </Text>
                </Box>

                {/* Location */}
                <Box flex={2} minW={0} display={{ base: "none", md: "block" }}>
                  <Text fontSize="13px" color="#64748b" noOfLines={1}>
                    {[r.city, r.state].filter(Boolean).join(", ") || "—"}
                  </Text>
                  {r.phone && (
                    <Text fontSize="11px" color="#94a3b8">
                      {r.phone}
                    </Text>
                  )}
                </Box>

                {/* Submitted */}
                <Box flex={2} display={{ base: "none", md: "block" }}>
                  <Text fontSize="12px" color="#94a3b8">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </Box>

                {/* Status */}
                <Box flex={2}>
                  <StatusBadge status={r.status} />
                </Box>

                {/* Action */}
                <Flex w="90px" justify="flex-end">
                  <Button
                    size="sm"
                    leftIcon={<FaEye />}
                    onClick={() => openDetail(r)}
                    bg="#f0f7ff"
                    color="#4a72b8"
                    borderRadius="8px"
                    fontSize="12px"
                    fontWeight={700}
                    _hover={{ bg: "#dbeafe" }}
                    h="32px"
                  >
                    Review
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Box>
        )}
      </Box>

      {/* ── Detail Modal ─────────────────────────────────────────────────── */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(4px)" bg="rgba(0,0,0,.5)" />
        <ModalContent
          borderRadius="20px"
          overflow="hidden"
          fontFamily="'Sora',sans-serif"
          mx={4}
        >
          {selected && (
            <>
              {/* Modal header */}
              <ModalHeader
                px={7}
                pt={7}
                pb={5}
                bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)"
                color="white"
              >
                <Flex align="center" justify="space-between">
                  <Box>
                    <Text fontSize="18px" fontWeight={800} lineHeight={1.2}>
                      {selected.name}
                    </Text>
                    <Flex align="center" gap={2} mt={2}>
                      <StatusBadge status={selected.status} />
                      <Text fontSize="11px" color="rgba(255,255,255,.5)">
                        Submitted{" "}
                        {new Date(selected.createdAt).toLocaleDateString(
                          "en-IN",
                        )}
                      </Text>
                    </Flex>
                  </Box>
                  <ModalCloseButton
                    position="static"
                    color="white"
                    _hover={{ bg: "rgba(255,255,255,.15)" }}
                    borderRadius="8px"
                  />
                </Flex>
              </ModalHeader>

              <ModalBody px={7} py={6}>
                {/* Two-column layout */}
                <Flex gap={6} flexWrap={{ base: "wrap", md: "nowrap" }}>
                  {/* Left — coaching details */}
                  <Box flex={1} minW={0}>
                    <Text
                      fontSize="11px"
                      fontWeight={800}
                      color="#94a3b8"
                      textTransform="uppercase"
                      letterSpacing="2px"
                      mb={3}
                    >
                      Coaching Details
                    </Text>

                    {selected.description && (
                      <Box
                        bg="#f8fafc"
                        borderRadius="10px"
                        p={3}
                        mb={3}
                        border="1px solid #e2e8f0"
                      >
                        <Text fontSize="13px" color="#475569" lineHeight={1.8}>
                          {selected.description}
                        </Text>
                      </Box>
                    )}

                    <DRow
                      icon={FaMapMarkerAlt}
                      label="Full Address"
                      value={selected.fullAddress}
                    />
                    <DRow
                      icon={FaMapMarkerAlt}
                      label="City"
                      value={selected.city}
                    />
                    <DRow
                      icon={FaMapMarkerAlt}
                      label="State"
                      value={selected.state}
                    />
                    <DRow
                      icon={FaMapMarkerAlt}
                      label="Pincode"
                      value={selected.pincode}
                    />
                    <DRow
                      icon={FaMapMarkerAlt}
                      label="Landmark"
                      value={selected.landmark}
                    />
                    <Divider my={2} borderColor="#f1f5f9" />
                    <DRow
                      icon={FaEnvelope}
                      label="Email"
                      value={selected.email}
                    />
                    <DRow icon={FaPhone} label="Phone" value={selected.phone} />
                    <DRow
                      icon={FaWhatsapp}
                      label="WhatsApp"
                      value={selected.whatsapp}
                    />
                    {selected.website && (
                      <Flex align="flex-start" gap={3} py={2}>
                        <Flex
                          w="28px"
                          h="28px"
                          bg="#f1f5f9"
                          borderRadius="7px"
                          align="center"
                          justify="center"
                          flexShrink={0}
                          mt="1px"
                        >
                          <Icon as={FaGlobe} fontSize="11px" color="#64748b" />
                        </Flex>
                        <Box>
                          <Text
                            fontSize="10px"
                            color="#94a3b8"
                            fontWeight={700}
                            textTransform="uppercase"
                            letterSpacing=".6px"
                          >
                            Website
                          </Text>
                          <Text
                            as="a"
                            href={selected.website}
                            target="_blank"
                            fontSize="13px"
                            color="#2563eb"
                            fontWeight={500}
                            mt="2px"
                            display="block"
                            textDecoration="underline"
                          >
                            {selected.website}
                            <Icon
                              as={FaExternalLinkAlt}
                              fontSize="9px"
                              ml={1}
                            />
                          </Text>
                        </Box>
                      </Flex>
                    )}
                    {selected.googleMapsUrl && (
                      <Flex align="flex-start" gap={3} py={2}>
                        <Flex
                          w="28px"
                          h="28px"
                          bg="#f1f5f9"
                          borderRadius="7px"
                          align="center"
                          justify="center"
                          flexShrink={0}
                          mt="1px"
                        >
                          <Icon
                            as={FaMapMarkerAlt}
                            fontSize="11px"
                            color="#64748b"
                          />
                        </Flex>
                        <Box>
                          <Text
                            fontSize="10px"
                            color="#94a3b8"
                            fontWeight={700}
                            textTransform="uppercase"
                            letterSpacing=".6px"
                          >
                            Google Maps
                          </Text>
                          <Text
                            as="a"
                            href={selected.googleMapsUrl}
                            target="_blank"
                            fontSize="13px"
                            color="#2563eb"
                            fontWeight={500}
                            mt="2px"
                            display="block"
                            textDecoration="underline"
                          >
                            View on Maps
                            <Icon
                              as={FaExternalLinkAlt}
                              fontSize="9px"
                              ml={1}
                            />
                          </Text>
                        </Box>
                      </Flex>
                    )}

                    <Divider my={2} borderColor="#f1f5f9" />
                    <DRow
                      icon={FaGraduationCap}
                      label="Established Year"
                      value={selected.establishedYear?.toString()}
                    />
                    <DRow
                      icon={FaUser}
                      label="Approx. Student Count"
                      value={selected.studentCount}
                    />
                    <DRow
                      icon={FaBuilding}
                      label="Registration No."
                      value={selected.registrationNumber}
                    />
                    {selected.additionalInfo && (
                      <Box
                        bg="#fffbeb"
                        border="1px solid #fde68a"
                        borderRadius="10px"
                        p={3}
                        mt={2}
                      >
                        <Text
                          fontSize="11px"
                          fontWeight={700}
                          color="#92400e"
                          mb={1}
                          textTransform="uppercase"
                          letterSpacing=".6px"
                        >
                          Additional Info
                        </Text>
                        <Text fontSize="13px" color="#78350f" lineHeight={1.7}>
                          {selected.additionalInfo}
                        </Text>
                      </Box>
                    )}

                    {/* Exam types */}
                    <Flex flexWrap="wrap" gap={2} mt={4}>
                      {selected.examTypes?.map((ex) => (
                        <Box
                          key={ex}
                          bg="#eff6ff"
                          color="#2563eb"
                          px={3}
                          py="4px"
                          borderRadius="full"
                          fontSize="11px"
                          fontWeight={700}
                        >
                          {ex}
                        </Box>
                      ))}
                    </Flex>
                  </Box>

                  {/* Right — owner details */}
                  <Box w={{ base: "100%", md: "220px" }} flexShrink={0}>
                    <Text
                      fontSize="11px"
                      fontWeight={800}
                      color="#94a3b8"
                      textTransform="uppercase"
                      letterSpacing="2px"
                      mb={3}
                    >
                      Owner
                    </Text>
                    <Box
                      bg="#f8fafc"
                      borderRadius="12px"
                      border="1px solid #e2e8f0"
                      p={4}
                      mb={4}
                    >
                      <Flex
                        w="44px"
                        h="44px"
                        bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
                        borderRadius="12px"
                        align="center"
                        justify="center"
                        fontSize="18px"
                        fontWeight={800}
                        color="white"
                        mb={3}
                      >
                        {selected.owner?.Name?.[0]?.toUpperCase() || "?"}
                      </Flex>
                      <Text fontSize="14px" fontWeight={700} color="#0f172a">
                        {selected.owner?.Name || "—"}
                      </Text>
                      <Text fontSize="12px" color="#64748b" mt={1}>
                        {selected.owner?.Email || "—"}
                      </Text>
                      {selected.owner?.Phone && (
                        <Text fontSize="12px" color="#64748b">
                          {selected.owner.Phone}
                        </Text>
                      )}
                      <Text fontSize="11px" color="#94a3b8" mt={2}>
                        Joined{" "}
                        {selected.owner?.createdAt
                          ? new Date(
                              selected.owner.createdAt,
                            ).toLocaleDateString("en-IN")
                          : "—"}
                      </Text>
                    </Box>

                    {/* Previous admin note */}
                    {selected.adminNote && (
                      <Box
                        bg={
                          selected.status === "rejected" ? "#fef2f2" : "#f0fdf4"
                        }
                        border={`1px solid ${selected.status === "rejected" ? "#fecaca" : "#bbf7d0"}`}
                        borderRadius="10px"
                        p={3}
                        mb={4}
                      >
                        <Text
                          fontSize="10px"
                          fontWeight={700}
                          color={
                            selected.status === "rejected"
                              ? "#dc2626"
                              : "#15803d"
                          }
                          textTransform="uppercase"
                          letterSpacing=".6px"
                          mb={1}
                        >
                          Admin Note
                        </Text>
                        <Text
                          fontSize="12px"
                          color={
                            selected.status === "rejected"
                              ? "#7f1d1d"
                              : "#166534"
                          }
                          lineHeight={1.6}
                        >
                          {selected.adminNote}
                        </Text>
                      </Box>
                    )}
                  </Box>
                </Flex>

                <Divider my={5} />

                {/* Admin action area */}
                {selected.status === "pending" && (
                  <Box>
                    <Text
                      fontSize="11px"
                      fontWeight={800}
                      color="#94a3b8"
                      textTransform="uppercase"
                      letterSpacing="2px"
                      mb={3}
                    >
                      Admin Decision
                    </Text>
                    <Textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="Optional note for approval, or required reason for rejection…"
                      borderRadius="10px"
                      fontSize="13px"
                      rows={3}
                      borderColor="#e2e8f0"
                      _focus={{
                        borderColor: "#4a72b8",
                        boxShadow: "0 0 0 1px #4a72b8",
                      }}
                    />
                  </Box>
                )}
              </ModalBody>

              <ModalFooter px={7} py={5} borderTop="1px solid #f1f5f9" gap={3}>
                {selected.status === "pending" ? (
                  <>
                    <Button
                      flex={1}
                      h="46px"
                      borderRadius="12px"
                      bg="#dcfce7"
                      color="#15803d"
                      fontWeight={800}
                      fontSize="14px"
                      leftIcon={<FaCheckCircle />}
                      isLoading={acting}
                      loadingText="Approving…"
                      onClick={handleApprove}
                      _hover={{ bg: "#bbf7d0" }}
                    >
                      Approve & Activate
                    </Button>
                    <Button
                      flex={1}
                      h="46px"
                      borderRadius="12px"
                      bg="#fee2e2"
                      color="#dc2626"
                      fontWeight={800}
                      fontSize="14px"
                      leftIcon={<FaTimesCircle />}
                      isLoading={acting}
                      loadingText="Rejecting…"
                      onClick={handleReject}
                      _hover={{ bg: "#fecaca" }}
                    >
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    borderRadius="10px"
                    fontWeight={700}
                    ml="auto"
                  >
                    Close
                  </Button>
                )}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
}
