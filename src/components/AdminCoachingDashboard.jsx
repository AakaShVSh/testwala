

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  Button,
  Icon,
  Spinner,
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
  Grid,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Switch,
  VStack,
  HStack,
  Badge,
  Tooltip,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaSearch,
  FaTrash,
  FaEye,
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaGlobe,
  FaWhatsapp,
  FaExternalLinkAlt,
  FaGraduationCap,
  FaUsers,
  FaClipboardList,
  FaSync,
  FaChevronLeft,
  FaShieldAlt,
  FaBell,
  FaCalendarAlt,
  FaStopwatch,
  FaTrophy,
  FaLayerGroup,
  FaChartBar,
  FaToggleOn,
  FaToggleOff,
  FaLock,
  FaEyeSlash,
  FaRegEye,
} from "react-icons/fa";
import { MdSchool, MdQuiz } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { socket, joinAdminRoom } from "../services/socket";
import { useAuth } from "../context/AuthContext";

/* ─── Design tokens ─────────────────────────────────────────────────────── */
const C = {
  navy: "#0b1e3d",
  navyMid: "#132952",
  navyLt: "#1a3a6e",
  blue: "#2563eb",
  blueDk: "#1e40af",
  teal: "#0d9488",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  purple: "#7c3aed",
  muted: "#64748b",
  text: "#0f172a",
  sub: "#475569",
  border: "#e2e8f0",
  surface: "#f8fafc",
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "—";
const fmtDuration = (s) => {
  if (!s && s !== 0) return "—";
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
};
const scoreColor = (p) => (p >= 70 ? C.green : p >= 40 ? C.amber : C.red);
const scoreBg = (p) => (p >= 70 ? "#f0fdf4" : p >= 40 ? "#fffbeb" : "#fef2f2");

/* ─── Status badge ───────────────────────────────────────────────────────── */
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
  }[status] || { bg: "#f1f5f9", color: C.muted, icon: FaClock, label: status };
  return (
    <Flex
      align="center"
      gap={1.5}
      bg={cfg.bg}
      color={cfg.color}
      px={2.5}
      py="4px"
      borderRadius="full"
      fontSize="11px"
      fontWeight={700}
      w="fit-content"
    >
      <Icon as={cfg.icon} fontSize="10px" />
      {cfg.label}
    </Flex>
  );
};

/* ─── Info row ───────────────────────────────────────────────────────────── */
const InfoRow = ({ label, value, link }) => {
  if (!value) return null;
  return (
    <Flex
      justify="space-between"
      align="flex-start"
      py={2.5}
      borderBottom="1px solid #f1f5f9"
      _last={{ borderBottom: "none" }}
    >
      <Text
        fontSize="12px"
        color={C.muted}
        fontWeight={600}
        flexShrink={0}
        mr={3}
      >
        {label}
      </Text>
      {link ? (
        <Text
          as="a"
          href={value}
          target="_blank"
          fontSize="12px"
          color={C.blue}
          fontWeight={700}
          textAlign="right"
          textDecoration="underline"
        >
          {value} <Icon as={FaExternalLinkAlt} fontSize="9px" />
        </Text>
      ) : (
        <Text
          fontSize="12px"
          color={C.text}
          fontWeight={700}
          textAlign="right"
          maxW="60%"
        >
          {value}
        </Text>
      )}
    </Flex>
  );
};

/* ─── Delete confirm ─────────────────────────────────────────────────────── */
function ConfirmDialog({
  isOpen,
  onClose,
  title,
  body,
  confirmLabel = "Delete",
  confirmColor = C.red,
  onConfirm,
  loading,
}) {
  const ref = useRef();
  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={ref}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay backdropFilter="blur(4px)" bg="rgba(0,0,0,.5)">
        <AlertDialogContent
          mx={4}
          borderRadius="16px"
          fontFamily="'DM Sans',sans-serif"
        >
          <AlertDialogHeader fontSize="16px" fontWeight={800} color={C.text}>
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text fontSize="13px" color={C.sub}>
              {body}
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter gap={3}>
            <Button
              ref={ref}
              onClick={onClose}
              variant="ghost"
              borderRadius="10px"
              fontWeight={700}
            >
              Cancel
            </Button>
            <Button
              bg={confirmColor}
              color="white"
              borderRadius="10px"
              fontWeight={800}
              isLoading={loading}
              onClick={onConfirm}
              _hover={{ opacity: 0.85 }}
            >
              {confirmLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   TEST SUBMISSIONS MODAL
══════════════════════════════════════════════════════════════════════════ */
function TestSubmissionsModal({ test, isOpen, onClose }) {
  const toast = useToast();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!isOpen || !test) return;
    setLoading(true);
    setResults([]);
    setSearch("");
    apiFetch(`/results/test/${test._id}`)
      .then((res) => setResults(res.data ?? []))
      .catch((e) => toast({ title: e.message, status: "error" }))
      .finally(() => setLoading(false));
  }, [isOpen, test]);

  const filtered = results.filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.studentId?.Name?.toLowerCase().includes(q) ||
      r.studentId?.Email?.toLowerCase().includes(q)
    );
  });

  const avgScore = results.length
    ? Math.round(
        results.reduce((s, r) => s + (r.percentage || 0), 0) / results.length,
      )
    : 0;
  const avgTime = results.length
    ? Math.round(
        results.reduce((s, r) => s + (r.timeTaken ?? r.timeTakenSec ?? 0), 0) /
          results.length,
      )
    : 0;
  const topScore = results.length
    ? Math.max(...results.map((r) => r.percentage || 0))
    : 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent
        borderRadius="20px"
        overflow="hidden"
        fontFamily="'DM Sans',sans-serif"
        mx={4}
        maxH="90vh"
      >
        <ModalHeader
          px={7}
          pt={6}
          pb={5}
          bg={`linear-gradient(135deg,${C.navy},${C.navyLt})`}
          color="white"
        >
          <Flex align="center" justify="space-between">
            <Box>
              <Text fontSize="16px" fontWeight={800}>
                Submissions
              </Text>
              <Text
                fontSize="11px"
                color="rgba(255,255,255,.45)"
                mt={0.5}
                noOfLines={1}
              >
                {test?.title} · {results.length} total
              </Text>
            </Box>
            <ModalCloseButton
              position="static"
              color="white"
              _hover={{ bg: "rgba(255,255,255,.15)" }}
              borderRadius="8px"
            />
          </Flex>
        </ModalHeader>

        <ModalBody px={6} py={5}>
          {/* Stats */}
          {results.length > 0 && (
            <Grid
              templateColumns={{ base: "repeat(2,1fr)", md: "repeat(4,1fr)" }}
              gap={3}
              mb={5}
            >
              {[
                {
                  label: "Attempts",
                  value: results.length,
                  color: C.blue,
                  bg: "#eff6ff",
                  icon: FaUsers,
                },
                {
                  label: "Avg Score",
                  value: `${avgScore}%`,
                  color: C.green,
                  bg: "#f0fdf4",
                  icon: FaChartBar,
                },
                {
                  label: "Avg Time",
                  value: fmtDuration(avgTime),
                  color: C.amber,
                  bg: "#fffbeb",
                  icon: FaStopwatch,
                },
                {
                  label: "Top Score",
                  value: `${topScore}%`,
                  color: C.purple,
                  bg: "#f5f3ff",
                  icon: FaTrophy,
                },
              ].map((s) => (
                <Box
                  key={s.label}
                  bg={s.bg}
                  borderRadius="12px"
                  p={3}
                  border={`1px solid ${s.color}22`}
                >
                  <Flex align="center" gap={2} mb={1}>
                    <Icon as={s.icon} color={s.color} fontSize="12px" />
                    <Text
                      fontSize="10px"
                      fontWeight={700}
                      color={s.color}
                      textTransform="uppercase"
                      letterSpacing=".5px"
                    >
                      {s.label}
                    </Text>
                  </Flex>
                  <Text
                    fontSize="22px"
                    fontWeight={900}
                    color={s.color}
                    lineHeight={1}
                  >
                    {s.value}
                  </Text>
                </Box>
              ))}
            </Grid>
          )}

          {/* Search */}
          <InputGroup mb={4}>
            <InputLeftElement pointerEvents="none" h="full" pl={3}>
              <Icon as={FaSearch} color="gray.400" fontSize="12px" />
            </InputLeftElement>
            <Input
              placeholder="Search student name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              bg="white"
              borderRadius="10px"
              h="40px"
              fontSize="13px"
              pl="38px"
              border="1px solid #e2e8f0"
              _focus={{ borderColor: C.blue }}
            />
          </InputGroup>

          {loading ? (
            <Flex justify="center" py={12}>
              <Spinner color={C.blue} size="lg" />
            </Flex>
          ) : filtered.length === 0 ? (
            <Box py={12} textAlign="center">
              <Icon
                as={FaUsers}
                fontSize="36px"
                color="#e2e8f0"
                display="block"
                mx="auto"
                mb={3}
              />
              <Text fontSize="13px" color={C.muted}>
                No submissions yet
              </Text>
            </Box>
          ) : (
            <Box
              bg="white"
              borderRadius="14px"
              border="1px solid #e2e8f0"
              overflow="hidden"
            >
              <Flex px={5} py={3} bg="#f8fafc" borderBottom="1px solid #e2e8f0">
                {[
                  ["#", 0.4],
                  ["Student", 3],
                  ["Score", 1.5],
                  ["Time Taken", 1.5],
                  ["Submitted At", 2],
                  ["Percentile", 1.5],
                ].map(([h, f]) => (
                  <Text
                    key={h}
                    flex={f}
                    fontSize="10px"
                    fontWeight={800}
                    color={C.muted}
                    textTransform="uppercase"
                    letterSpacing=".8px"
                  >
                    {h}
                  </Text>
                ))}
              </Flex>
              {filtered
                .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
                .map((sub, i) => {
                  const pct = sub.percentage || 0;
                  const time = sub.timeTaken ?? sub.timeTakenSec ?? 0;
                  const correct =
                    sub.score ??
                    (Array.isArray(sub.correctQus) ? sub.correctQus.length : 0);
                  return (
                    <Flex
                      key={sub._id}
                      px={5}
                      py={3.5}
                      align="center"
                      borderBottom={
                        i < filtered.length - 1 ? "1px solid #f8fafc" : "none"
                      }
                      _hover={{ bg: "#f8faff" }}
                      transition="background .12s"
                    >
                      <Text
                        flex={0.4}
                        fontSize="11px"
                        fontWeight={800}
                        color={C.muted}
                      >
                        {i + 1}
                      </Text>
                      <Box flex={3} minW={0}>
                        <Text
                          fontSize="13px"
                          fontWeight={700}
                          color={C.text}
                          noOfLines={1}
                        >
                          {sub.studentId?.Name || "Unknown"}
                        </Text>
                        <Text fontSize="11px" color={C.muted} noOfLines={1}>
                          {sub.studentId?.Email || "—"}
                        </Text>
                      </Box>
                      <Box flex={1.5}>
                        <Flex align="center" gap={2}>
                          <Box
                            w="36px"
                            h="24px"
                            borderRadius="6px"
                            bg={scoreBg(pct)}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Text
                              fontSize="10px"
                              fontWeight={900}
                              color={scoreColor(pct)}
                            >
                              {pct}%
                            </Text>
                          </Box>
                          <Text fontSize="11px" color={C.muted}>
                            {correct}/{sub.totalQuestions}
                          </Text>
                        </Flex>
                      </Box>
                      <Box flex={1.5}>
                        <Flex align="center" gap={1.5}>
                          <Icon
                            as={FaStopwatch}
                            fontSize="9px"
                            color={C.muted}
                          />
                          <Text fontSize="12px" fontWeight={600} color={C.sub}>
                            {fmtDuration(time)}
                          </Text>
                        </Flex>
                      </Box>
                      <Box flex={2}>
                        <Text fontSize="11px" color={C.sub}>
                          {fmtDateTime(sub.createdAt)}
                        </Text>
                      </Box>
                      <Box flex={1.5}>
                        {sub.percentile != null ? (
                          <Flex
                            align="center"
                            gap={1}
                            bg="#fefce8"
                            borderRadius="6px"
                            px={2}
                            py="2px"
                            w="fit-content"
                          >
                            <Icon
                              as={FaTrophy}
                              fontSize="9px"
                              color="#d97706"
                            />
                            <Text
                              fontSize="11px"
                              fontWeight={700}
                              color="#92400e"
                            >
                              {typeof sub.percentile === "number"
                                ? `${sub.percentile.toFixed(1)}%`
                                : sub.percentile}
                            </Text>
                          </Flex>
                        ) : (
                          <Text fontSize="11px" color={C.muted}>
                            —
                          </Text>
                        )}
                      </Box>
                    </Flex>
                  );
                })}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   COACHING DETAIL VIEW
══════════════════════════════════════════════════════════════════════════ */
function CoachingDetail({ coaching, onBack, onUpdate }) {
  const toast = useToast();
  const {
    isOpen: editOpen,
    onOpen: openEdit,
    onClose: closeEdit,
  } = useDisclosure();
  const {
    isOpen: delOpen,
    onOpen: openDel,
    onClose: closeDel,
  } = useDisclosure();
  const {
    isOpen: subsOpen,
    onOpen: openSubs,
    onClose: closeSubs,
  } = useDisclosure();

  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [testsLoading, setTestsLoading] = useState(false);
  const [stuLoading, setStuLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [acting, setActing] = useState(false);
  const [editNote, setEditNote] = useState(coaching.adminNote || "");
  const [editStatus, setEditStatus] = useState(coaching.status);
  const [testViewLog, setTestViewLog] = useState([]); // coaching-viewed-test log

  // Load tests for this coaching
  useEffect(() => {
    if (coaching.status !== "approved") return;
    setTestsLoading(true);
    apiFetch(`/tests?coachingId=${coaching._id}`)
      .then((r) => setTests(r.data ?? []))
      .catch(() => {})
      .finally(() => setTestsLoading(false));
  }, [coaching._id, coaching.status]);

  // Load students for this coaching
  useEffect(() => {
    if (coaching.status !== "approved") return;
    setStuLoading(true);
    apiFetch(`/coaching/students`)
      .then((r) => setStudents(r.data ?? []))
      .catch(() => {})
      .finally(() => setStuLoading(false));
  }, [coaching._id, coaching.status]);

  // Socket: listen for coaching viewed test event
  useEffect(() => {
    const onTestViewed = ({
      coachingId,
      testId,
      testTitle,
      viewedAt,
      coachingName,
    }) => {
      if (coachingId !== coaching._id.toString()) return;
      const entry = {
        testId,
        testTitle,
        viewedAt: viewedAt || new Date().toISOString(),
        coachingName,
      };
      setTestViewLog((p) => [entry, ...p].slice(0, 20));
      toast({
        title: `👁️ "${coachingName || coaching.name}" viewed "${testTitle}"`,
        description: fmtDateTime(entry.viewedAt),
        status: "info",
        duration: 6000,
        isClosable: true,
        position: "top-right",
      });
    };
    socket.on("coaching:test-viewed", onTestViewed);
    return () => socket.off("coaching:test-viewed", onTestViewed);
  }, [coaching._id, coaching.name, toast]);

  const saveEdit = async () => {
    setActing(true);
    try {
      const endpoint =
        editStatus === "approved"
          ? `/admin/coaching/${coaching._id}/approve`
          : `/admin/coaching/${coaching._id}/reject`;
      const res = await apiFetch(endpoint, {
        method: "PATCH",
        body: JSON.stringify({ adminNote: editNote }),
      });
      toast({ title: "Updated!", status: "success", duration: 3000 });
      onUpdate({ ...coaching, status: editStatus, adminNote: editNote });
      closeEdit();
    } catch (e) {
      toast({ title: e.message, status: "error" });
    } finally {
      setActing(false);
    }
  };

  const deleteCoaching = async () => {
    setActing(true);
    try {
      await apiFetch(`/coaching/${coaching._id}`, { method: "DELETE" });
      toast({
        title: "Coaching deactivated",
        status: "success",
        duration: 3000,
      });
      onBack();
    } catch (e) {
      toast({ title: e.message, status: "error" });
    } finally {
      setActing(false);
    }
  };

  const openTestSubs = (t) => {
    setSelectedTest(t);
    openSubs();
  };

  return (
    <Box>
      {/* Back button */}
      <Flex align="center" gap={3} mb={6}>
        <Button
          leftIcon={<Icon as={FaChevronLeft} fontSize="11px" />}
          onClick={onBack}
          variant="ghost"
          borderRadius="10px"
          fontWeight={700}
          fontSize="13px"
          color={C.muted}
          _hover={{ bg: "#f1f5f9" }}
        >
          All Coachings
        </Button>
        <Text fontSize="11px" color={C.muted}>
          ›
        </Text>
        <Text fontSize="13px" fontWeight={700} color={C.text} noOfLines={1}>
          {coaching.name}
        </Text>
      </Flex>

      {/* Hero card */}
      <Box
        bg="white"
        borderRadius="20px"
        border="1px solid #e2e8f0"
        boxShadow="0 4px 20px rgba(0,0,0,.05)"
        overflow="hidden"
        mb={5}
      >
        <Box bg={`linear-gradient(135deg,${C.navy},${C.navyLt})`} px={7} py={6}>
          <Flex
            align="flex-start"
            justify="space-between"
            gap={4}
            flexWrap="wrap"
          >
            <Box>
              <Flex align="center" gap={3} mb={2}>
                <Flex
                  w="48px"
                  h="48px"
                  bg="rgba(255,255,255,.12)"
                  borderRadius="14px"
                  align="center"
                  justify="center"
                  fontSize="20px"
                  fontWeight={900}
                  color="white"
                  flexShrink={0}
                >
                  {coaching.name?.[0]?.toUpperCase()}
                </Flex>
                <Box>
                  <Text
                    fontSize={{ base: "18px", md: "22px" }}
                    fontWeight={900}
                    color="white"
                    letterSpacing="-.5px"
                  >
                    {coaching.name}
                  </Text>
                  <Flex align="center" gap={2} mt={1} flexWrap="wrap">
                    <StatusBadge status={coaching.status} />
                    {coaching.isActive && (
                      <Flex
                        align="center"
                        gap={1.5}
                        bg="rgba(34,197,94,.15)"
                        border="1px solid rgba(34,197,94,.3)"
                        px={2.5}
                        py="3px"
                        borderRadius="full"
                      >
                        <Box
                          w="5px"
                          h="5px"
                          bg="#22c55e"
                          borderRadius="full"
                          style={{ animation: "pulse 2s infinite" }}
                        />
                        <Text fontSize="10px" fontWeight={700} color="#4ade80">
                          Active
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                </Box>
              </Flex>
              {coaching.description && (
                <Text
                  fontSize="13px"
                  color="rgba(255,255,255,.55)"
                  mt={2}
                  maxW="600px"
                  lineHeight={1.7}
                >
                  {coaching.description}
                </Text>
              )}
            </Box>
            <HStack spacing={2} flexShrink={0}>
              <Button
                size="sm"
                h="36px"
                px={4}
                bg="rgba(255,255,255,.12)"
                color="white"
                borderRadius="10px"
                fontWeight={700}
                fontSize="12px"
                leftIcon={<Icon as={FaEdit} fontSize="10px" />}
                onClick={openEdit}
                _hover={{ bg: "rgba(255,255,255,.2)" }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                h="36px"
                w="36px"
                p={0}
                bg="rgba(220,38,38,.2)"
                color="#fca5a5"
                borderRadius="10px"
                onClick={openDel}
                _hover={{ bg: "rgba(220,38,38,.3)" }}
              >
                <Icon as={FaTrash} fontSize="11px" />
              </Button>
            </HStack>
          </Flex>
        </Box>

        {/* Quick stats strip */}
        <Flex borderTop="1px solid #f1f5f9" flexWrap="wrap">
          {[
            {
              label: "Registered",
              value: fmtDate(coaching.createdAt),
              icon: FaCalendarAlt,
            },
            {
              label: "Reviewed At",
              value: fmtDate(coaching.reviewedAt),
              icon: FaCheckCircle,
            },
            {
              label: "City",
              value: coaching.city || "—",
              icon: FaMapMarkerAlt,
            },
            {
              label: "Exams",
              value: coaching.examTypes?.join(", ") || "—",
              icon: FaClipboardList,
            },
            {
              label: "Students",
              value: coaching.studentCount || "—",
              icon: FaUsers,
            },
          ].map(({ label, value, icon }) => (
            <Box
              key={label}
              flex="1"
              minW="120px"
              px={5}
              py={4}
              borderRight="1px solid #f1f5f9"
              _last={{ borderRight: "none" }}
            >
              <Flex align="center" gap={1.5} mb={1}>
                <Icon as={icon} fontSize="10px" color={C.muted} />
                <Text
                  fontSize="10px"
                  color={C.muted}
                  fontWeight={700}
                  textTransform="uppercase"
                  letterSpacing=".6px"
                >
                  {label}
                </Text>
              </Flex>
              <Text
                fontSize="13px"
                fontWeight={800}
                color={C.text}
                noOfLines={1}
              >
                {value}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>

      {/* Tabs: Details / Tests / Students / Test View Log */}
      <Tabs colorScheme="blue" variant="unstyled">
        <Box
          bg="white"
          borderRadius="14px"
          border="1px solid #e2e8f0"
          px={4}
          pt={4}
          pb={0}
          mb={4}
          boxShadow="0 1px 4px rgba(0,0,0,.03)"
        >
          <Flex
            gap={1}
            overflowX="auto"
            css={{ "&::-webkit-scrollbar": { display: "none" } }}
          >
            {["Details", "Tests", "Students", "Test View Log"].map((t) => (
              <Tab
                key={t}
                px={4}
                py={2}
                borderRadius="10px 10px 0 0"
                fontSize="13px"
                fontWeight={700}
                color={C.muted}
                whiteSpace="nowrap"
                mb={0}
                _selected={{
                  bg: "#eff6ff",
                  color: C.blue,
                  borderBottom: "2px solid " + C.blue,
                }}
                _hover={{ bg: "#f8fafc" }}
              >
                {t}
                {t === "Test View Log" && testViewLog.length > 0 && (
                  <Box
                    as="span"
                    ml={1.5}
                    w="18px"
                    h="18px"
                    bg={C.blue}
                    color="white"
                    borderRadius="full"
                    fontSize="9px"
                    fontWeight={900}
                    display="inline-flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {testViewLog.length}
                  </Box>
                )}
              </Tab>
            ))}
          </Flex>
        </Box>

        <TabPanels>
          {/* ── Details tab ── */}
          <TabPanel px={0} py={0}>
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <Box
                bg="white"
                borderRadius="16px"
                border="1px solid #e2e8f0"
                p={5}
                boxShadow="0 1px 4px rgba(0,0,0,.03)"
              >
                <Text
                  fontSize="11px"
                  fontWeight={800}
                  color={C.muted}
                  textTransform="uppercase"
                  letterSpacing="1.5px"
                  mb={3}
                >
                  Contact & Location
                </Text>
                <InfoRow label="Full Address" value={coaching.fullAddress} />
                <InfoRow label="City" value={coaching.city} />
                <InfoRow label="State" value={coaching.state} />
                <InfoRow label="Pincode" value={coaching.pincode} />
                <InfoRow label="Landmark" value={coaching.landmark} />
                <InfoRow label="Email" value={coaching.email} />
                <InfoRow label="Phone" value={coaching.phone} />
                <InfoRow label="WhatsApp" value={coaching.whatsapp} />
                <InfoRow label="Website" value={coaching.website} link />
              </Box>
              <VStack spacing={4} align="stretch">
                <Box
                  bg="white"
                  borderRadius="16px"
                  border="1px solid #e2e8f0"
                  p={5}
                  boxShadow="0 1px 4px rgba(0,0,0,.03)"
                >
                  <Text
                    fontSize="11px"
                    fontWeight={800}
                    color={C.muted}
                    textTransform="uppercase"
                    letterSpacing="1.5px"
                    mb={3}
                  >
                    Owner
                  </Text>
                  <Flex
                    w="44px"
                    h="44px"
                    bg={`linear-gradient(135deg,${C.blue},${C.navyLt})`}
                    borderRadius="12px"
                    align="center"
                    justify="center"
                    fontSize="18px"
                    fontWeight={900}
                    color="white"
                    mb={3}
                  >
                    {coaching.owner?.Name?.[0]?.toUpperCase() || "?"}
                  </Flex>
                  <Text fontSize="15px" fontWeight={700} color={C.text}>
                    {coaching.owner?.Name || "—"}
                  </Text>
                  <Text fontSize="12px" color={C.muted} mt={0.5}>
                    {coaching.owner?.Email || "—"}
                  </Text>
                  {coaching.owner?.Phone && (
                    <Text fontSize="12px" color={C.muted}>
                      {coaching.owner.Phone}
                    </Text>
                  )}
                  <Text fontSize="11px" color={C.muted} mt={1}>
                    Joined {fmtDate(coaching.owner?.createdAt)}
                  </Text>
                </Box>
                <Box
                  bg="white"
                  borderRadius="16px"
                  border="1px solid #e2e8f0"
                  p={5}
                  boxShadow="0 1px 4px rgba(0,0,0,.03)"
                >
                  <Text
                    fontSize="11px"
                    fontWeight={800}
                    color={C.muted}
                    textTransform="uppercase"
                    letterSpacing="1.5px"
                    mb={3}
                  >
                    Institute Info
                  </Text>
                  <InfoRow
                    label="Est. Year"
                    value={coaching.establishedYear?.toString()}
                  />
                  <InfoRow label="Students" value={coaching.studentCount} />
                  <InfoRow
                    label="Reg. No."
                    value={coaching.registrationNumber}
                  />
                  <Box mt={3}>
                    <Text
                      fontSize="11px"
                      color={C.muted}
                      fontWeight={700}
                      textTransform="uppercase"
                      letterSpacing=".6px"
                      mb={2}
                    >
                      Exam Types
                    </Text>
                    <Flex flexWrap="wrap" gap={1.5}>
                      {coaching.examTypes?.map((ex) => (
                        <Box
                          key={ex}
                          bg="#eff6ff"
                          color="#2563eb"
                          px={2.5}
                          py="4px"
                          borderRadius="full"
                          fontSize="11px"
                          fontWeight={700}
                        >
                          {ex}
                        </Box>
                      ))}
                      {coaching.customExamTypes?.map((ex) => (
                        <Box
                          key={ex}
                          bg="#f0fdf4"
                          color={C.green}
                          px={2.5}
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
                </Box>
                {coaching.adminNote && (
                  <Box
                    bg={coaching.status === "rejected" ? "#fef2f2" : "#f0fdf4"}
                    border={`1px solid ${coaching.status === "rejected" ? "#fecaca" : "#bbf7d0"}`}
                    borderRadius="12px"
                    p={4}
                  >
                    <Text
                      fontSize="11px"
                      fontWeight={800}
                      color={coaching.status === "rejected" ? C.red : C.green}
                      textTransform="uppercase"
                      letterSpacing=".6px"
                      mb={1}
                    >
                      Admin Note
                    </Text>
                    <Text
                      fontSize="13px"
                      color={
                        coaching.status === "rejected" ? "#7f1d1d" : "#166534"
                      }
                      lineHeight={1.7}
                    >
                      {coaching.adminNote}
                    </Text>
                    {coaching.reviewedBy && (
                      <Text fontSize="11px" color={C.muted} mt={2}>
                        By {coaching.reviewedBy?.Name || "Admin"} ·{" "}
                        {fmtDateTime(coaching.reviewedAt)}
                      </Text>
                    )}
                  </Box>
                )}
              </VStack>
            </Grid>
          </TabPanel>

          {/* ── Tests tab ── */}
          <TabPanel px={0} py={0}>
            {coaching.status !== "approved" ? (
              <Box
                py={12}
                textAlign="center"
                bg="white"
                borderRadius="16px"
                border="1px solid #e2e8f0"
              >
                <Text fontSize="13px" color={C.muted}>
                  Tests are only visible for approved coachings
                </Text>
              </Box>
            ) : testsLoading ? (
              <Flex justify="center" py={12}>
                <Spinner color={C.blue} />
              </Flex>
            ) : tests.length === 0 ? (
              <Box
                py={12}
                textAlign="center"
                bg="white"
                borderRadius="16px"
                border="1px solid #e2e8f0"
              >
                <Icon
                  as={MdQuiz}
                  fontSize="40px"
                  color="#e2e8f0"
                  display="block"
                  mx="auto"
                  mb={3}
                />
                <Text fontSize="13px" color={C.muted}>
                  No tests found for this coaching
                </Text>
              </Box>
            ) : (
              <Box
                bg="white"
                borderRadius="16px"
                border="1px solid #e2e8f0"
                overflow="hidden"
              >
                <Flex
                  px={5}
                  py={3}
                  bg="#f8fafc"
                  borderBottom="1px solid #e2e8f0"
                  display={{ base: "none", md: "flex" }}
                >
                  {[
                    ["Test", 4],
                    ["Type", 2],
                    ["Limit", 1.5],
                    ["Sections", 1.5],
                    ["Attempts", 1.5],
                    ["Created", 2],
                    ["", 1.5],
                  ].map(([h, f]) => (
                    <Text
                      key={h}
                      flex={f}
                      fontSize="10px"
                      fontWeight={800}
                      color={C.muted}
                      textTransform="uppercase"
                      letterSpacing=".8px"
                    >
                      {h}
                    </Text>
                  ))}
                </Flex>
                {tests.map((t, idx) => (
                  <Flex
                    key={t._id}
                    px={5}
                    py={4}
                    align="center"
                    gap={3}
                    borderBottom={
                      idx < tests.length - 1 ? "1px solid #f1f5f9" : "none"
                    }
                    _hover={{ bg: "#f8faff" }}
                    transition="background .12s"
                    flexWrap={{ base: "wrap", md: "nowrap" }}
                  >
                    <Box flex={4} minW={0}>
                      <Flex align="center" gap={2}>
                        <Text
                          fontSize="13px"
                          fontWeight={700}
                          color={C.text}
                          noOfLines={1}
                        >
                          {t.title}
                        </Text>
                        {t.visibility === "private" && (
                          <Icon
                            as={FaLock}
                            fontSize="10px"
                            color={C.muted}
                            flexShrink={0}
                          />
                        )}
                      </Flex>
                      <Flex gap={1} mt={0.5}>
                        <Text
                          fontSize="9px"
                          fontWeight={700}
                          bg="#eff6ff"
                          color="#2563eb"
                          px={2}
                          py="1px"
                          borderRadius="full"
                        >
                          {t.examType}
                        </Text>
                        {t.subject && (
                          <Text
                            fontSize="9px"
                            fontWeight={700}
                            bg="#f1f5f9"
                            color={C.sub}
                            px={2}
                            py="1px"
                            borderRadius="full"
                          >
                            {t.subject}
                          </Text>
                        )}
                      </Flex>
                    </Box>
                    <Box flex={2} display={{ base: "none", md: "block" }}>
                      <Text fontSize="12px" color={C.sub}>
                        {t.examType}
                      </Text>
                    </Box>
                    <Box flex={1.5} display={{ base: "none", md: "block" }}>
                      <Text fontSize="12px" fontWeight={700} color={C.sub}>
                        {t.timeLimitMin}m
                      </Text>
                    </Box>
                    <Box flex={1.5} display={{ base: "none", md: "block" }}>
                      {t.isSectioned ? (
                        <Flex
                          align="center"
                          gap={1}
                          bg="#eff6ff"
                          color="#2563eb"
                          px={2}
                          py="3px"
                          borderRadius="full"
                          w="fit-content"
                        >
                          <Icon as={FaLayerGroup} fontSize="9px" />
                          <Text fontSize="10px" fontWeight={700}>
                            {t.sections?.length || 0}s
                          </Text>
                        </Flex>
                      ) : (
                        <Text fontSize="12px" color={C.muted}>
                          —
                        </Text>
                      )}
                    </Box>
                    <Box flex={1.5}>
                      <Text
                        fontSize="13px"
                        fontWeight={700}
                        color={C.blue}
                        cursor="pointer"
                        _hover={{ textDecoration: "underline" }}
                        onClick={() => openTestSubs(t)}
                      >
                        {t.totalAttempts || 0} students
                      </Text>
                    </Box>
                    <Box flex={2} display={{ base: "none", md: "block" }}>
                      <Text fontSize="11px" color={C.muted}>
                        {fmtDate(t.createdAt)}
                      </Text>
                    </Box>
                    <Flex flex={1.5} justify="flex-end">
                      <Button
                        size="sm"
                        h="30px"
                        px={3}
                        bg="#f0f7ff"
                        color="#4a72b8"
                        borderRadius="8px"
                        fontSize="11px"
                        fontWeight={700}
                        leftIcon={<Icon as={FaUsers} fontSize="9px" />}
                        onClick={() => openTestSubs(t)}
                        _hover={{ bg: "#dbeafe" }}
                      >
                        View
                      </Button>
                    </Flex>
                  </Flex>
                ))}
              </Box>
            )}
          </TabPanel>

          {/* ── Students tab ── */}
          <TabPanel px={0} py={0}>
            {coaching.status !== "approved" ? (
              <Box
                py={12}
                textAlign="center"
                bg="white"
                borderRadius="16px"
                border="1px solid #e2e8f0"
              >
                <Text fontSize="13px" color={C.muted}>
                  Students visible only for approved coachings
                </Text>
              </Box>
            ) : stuLoading ? (
              <Flex justify="center" py={12}>
                <Spinner color={C.blue} />
              </Flex>
            ) : students.length === 0 ? (
              <Box
                py={12}
                textAlign="center"
                bg="white"
                borderRadius="16px"
                border="1px solid #e2e8f0"
              >
                <Icon
                  as={FaUsers}
                  fontSize="40px"
                  color="#e2e8f0"
                  display="block"
                  mx="auto"
                  mb={3}
                />
                <Text fontSize="13px" color={C.muted}>
                  No students have attempted tests yet
                </Text>
              </Box>
            ) : (
              <Box
                bg="white"
                borderRadius="16px"
                border="1px solid #e2e8f0"
                overflow="hidden"
              >
                <Flex
                  px={5}
                  py={3}
                  bg="#f8fafc"
                  borderBottom="1px solid #e2e8f0"
                  display={{ base: "none", md: "flex" }}
                >
                  {[
                    ["#", 0.5],
                    ["Student", 3],
                    ["Tests Taken", 1.5],
                    ["Avg Score", 1.5],
                    ["Last Attempt", 2],
                  ].map(([h, f]) => (
                    <Text
                      key={h}
                      flex={f}
                      fontSize="10px"
                      fontWeight={800}
                      color={C.muted}
                      textTransform="uppercase"
                      letterSpacing=".8px"
                    >
                      {h}
                    </Text>
                  ))}
                </Flex>
                {students.map((s, i) => (
                  <Flex
                    key={s._id}
                    px={5}
                    py={3.5}
                    align="center"
                    gap={3}
                    borderBottom={
                      i < students.length - 1 ? "1px solid #f8fafc" : "none"
                    }
                    _hover={{ bg: "#f8faff" }}
                    transition="background .12s"
                    flexWrap={{ base: "wrap", md: "nowrap" }}
                  >
                    <Text
                      flex={0.5}
                      fontSize="11px"
                      fontWeight={800}
                      color={C.muted}
                    >
                      {i + 1}
                    </Text>
                    <Box flex={3} minW={0}>
                      <Text
                        fontSize="13px"
                        fontWeight={700}
                        color={C.text}
                        noOfLines={1}
                      >
                        {s.Name}
                      </Text>
                      <Text fontSize="11px" color={C.muted} noOfLines={1}>
                        {s.Email}
                      </Text>
                    </Box>
                    <Box flex={1.5}>
                      <Text fontSize="13px" fontWeight={700} color={C.blue}>
                        {s.totalTests}
                      </Text>
                    </Box>
                    <Box flex={1.5}>
                      <Box
                        w="fit-content"
                        px={2.5}
                        py="3px"
                        borderRadius="7px"
                        bg={scoreBg(s.avgPercentage)}
                      >
                        <Text
                          fontSize="12px"
                          fontWeight={800}
                          color={scoreColor(s.avgPercentage)}
                        >
                          {s.avgPercentage}%
                        </Text>
                      </Box>
                    </Box>
                    <Box flex={2}>
                      <Text fontSize="11px" color={C.muted}>
                        {fmtDateTime(s.lastAttempt)}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Box>
            )}
          </TabPanel>

          {/* ── Test View Log tab ── */}
          <TabPanel px={0} py={0}>
            <Box
              bg="white"
              borderRadius="16px"
              border="1px solid #e2e8f0"
              boxShadow="0 1px 4px rgba(0,0,0,.03)"
              overflow="hidden"
            >
              <Flex
                px={5}
                py={4}
                borderBottom="1px solid #f1f5f9"
                align="center"
                gap={3}
              >
                <Icon as={FaRegEye} color={C.blue} fontSize="16px" />
                <Box>
                  <Text fontSize="14px" fontWeight={800} color={C.text}>
                    Test View Activity
                  </Text>
                  <Text fontSize="11px" color={C.muted}>
                    Live feed — fires when coaching owner views a test you sent
                    them
                  </Text>
                </Box>
              </Flex>
              {testViewLog.length === 0 ? (
                <Box py={12} textAlign="center">
                  <Icon
                    as={FaEyeSlash}
                    fontSize="36px"
                    color="#e2e8f0"
                    display="block"
                    mx="auto"
                    mb={3}
                  />
                  <Text fontSize="13px" color={C.muted}>
                    No views recorded yet
                  </Text>
                  <Text fontSize="11px" color={C.muted} mt={1}>
                    You'll see activity here when the coaching views a test
                  </Text>
                </Box>
              ) : (
                testViewLog.map((entry, i) => (
                  <Flex
                    key={i}
                    px={5}
                    py={4}
                    align="center"
                    gap={4}
                    borderBottom={
                      i < testViewLog.length - 1 ? "1px solid #f8fafc" : "none"
                    }
                  >
                    <Flex
                      w="34px"
                      h="34px"
                      bg="#eff6ff"
                      borderRadius="10px"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      <Icon as={FaRegEye} color={C.blue} fontSize="14px" />
                    </Flex>
                    <Box flex={1} minW={0}>
                      <Text
                        fontSize="13px"
                        fontWeight={700}
                        color={C.text}
                        noOfLines={1}
                      >
                        Viewed "{entry.testTitle}"
                      </Text>
                      <Text fontSize="11px" color={C.muted}>
                        {fmtDateTime(entry.viewedAt)}
                      </Text>
                    </Box>
                    <Box bg="#eff6ff" px={2.5} py="4px" borderRadius="7px">
                      <Text fontSize="10px" fontWeight={700} color={C.blue}>
                        New
                      </Text>
                    </Box>
                  </Flex>
                ))
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Edit status modal */}
      <Modal isOpen={editOpen} onClose={closeEdit} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent
          borderRadius="20px"
          overflow="hidden"
          fontFamily="'DM Sans',sans-serif"
          mx={4}
        >
          <ModalHeader
            px={6}
            pt={6}
            pb={5}
            bg={`linear-gradient(135deg,${C.navy},${C.navyLt})`}
            color="white"
          >
            <Flex align="center" justify="space-between">
              <Text fontSize="15px" fontWeight={800}>
                Edit Coaching Status
              </Text>
              <ModalCloseButton
                position="static"
                color="white"
                _hover={{ bg: "rgba(255,255,255,.15)" }}
                borderRadius="8px"
              />
            </Flex>
          </ModalHeader>
          <ModalBody px={6} py={5}>
            <Text fontSize="12px" fontWeight={700} color={C.sub} mb={1.5}>
              Status
            </Text>
            <Select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
              borderRadius="10px"
              h="40px"
              fontSize="13px"
              borderColor="#e2e8f0"
              mb={4}
              _focus={{ borderColor: C.blue }}
            >
              <option value="pending">⏳ Pending</option>
              <option value="approved">✅ Approved</option>
              <option value="rejected">❌ Rejected</option>
            </Select>
            <Text fontSize="12px" fontWeight={700} color={C.sub} mb={1.5}>
              Admin Note
            </Text>
            <Textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="Note for the coaching owner…"
              borderRadius="10px"
              fontSize="13px"
              rows={3}
              borderColor="#e2e8f0"
              _focus={{ borderColor: C.blue, boxShadow: `0 0 0 1px ${C.blue}` }}
            />
          </ModalBody>
          <ModalFooter px={6} py={5} borderTop="1px solid #f1f5f9" gap={3}>
            <Button
              onClick={closeEdit}
              variant="ghost"
              borderRadius="10px"
              fontWeight={700}
            >
              Cancel
            </Button>
            <Button
              bg={`linear-gradient(135deg,${C.blue},${C.blueDk})`}
              color="white"
              borderRadius="12px"
              fontWeight={800}
              h="44px"
              px={7}
              isLoading={acting}
              onClick={saveEdit}
              _hover={{ opacity: 0.9 }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ConfirmDialog
        isOpen={delOpen}
        onClose={closeDel}
        loading={acting}
        title="Deactivate Coaching?"
        body={`This will deactivate "${coaching.name}". The coaching and its tests will be hidden from students.`}
        confirmLabel="Deactivate"
        confirmColor="#dc2626"
        onConfirm={deleteCoaching}
      />

      <TestSubmissionsModal
        test={selectedTest}
        isOpen={subsOpen}
        onClose={closeSubs}
      />
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   COACHING LIST VIEW
══════════════════════════════════════════════════════════════════════════ */
function CoachingList({ onSelect }) {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (statusFilter) p.set("status", statusFilter);
      if (search.trim()) p.set("search", search.trim());
      const res = await apiFetch(`/admin/coaching/requests?${p}`);
      let data = res.data ?? [];
      // Client-side exam + city filter (backend doesn't support these yet)
      if (examFilter)
        data = data.filter((c) => c.examTypes?.includes(examFilter));
      if (cityFilter.trim())
        data = data.filter((c) =>
          c.city?.toLowerCase().includes(cityFilter.toLowerCase()),
        );
      setList(data);
    } catch (e) {
      toast({ title: e.message, status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, examFilter, cityFilter, search, toast]);

  useEffect(() => {
    load();
  }, [load]);

  // Socket: live new coaching request
  useEffect(() => {
    const cleanup = joinAdminRoom();
    const onNew = ({ coaching }) => {
      if (!statusFilter || statusFilter === "pending")
        setList((p) => [coaching, ...p]);
      toast({
        title: "📬 New coaching request!",
        description: coaching.name,
        status: "info",
        duration: 7000,
        isClosable: true,
        position: "top-right",
      });
    };
    socket.on("coaching:new-request", onNew);
    return () => {
      cleanup();
      socket.off("coaching:new-request", onNew);
    };
  }, [statusFilter, toast]);

  const counts = {
    all: list.length,
    pending: list.filter((r) => r.status === "pending").length,
    approved: list.filter((r) => r.status === "approved").length,
    rejected: list.filter((r) => r.status === "rejected").length,
  };

  const EXAM_OPTIONS = [
    "SSC",
    "UPSC",
    "BANK",
    "RAILWAY",
    "STATE",
    "DEFENCE",
    "OTHER",
  ];

  return (
    <Box>
      {/* Stat cards */}
      <Grid
        templateColumns={{ base: "repeat(2,1fr)", md: "repeat(4,1fr)" }}
        gap={4}
        mb={6}
      >
        {[
          {
            key: "",
            label: "Total",
            value: counts.all,
            color: C.blue,
            bg: "#eff6ff",
          },
          {
            key: "pending",
            label: "Pending",
            value: counts.pending,
            color: C.amber,
            bg: "#fffbeb",
          },
          {
            key: "approved",
            label: "Approved",
            value: counts.approved,
            color: C.green,
            bg: "#f0fdf4",
          },
          {
            key: "rejected",
            label: "Rejected",
            value: counts.rejected,
            color: C.red,
            bg: "#fef2f2",
          },
        ].map((s) => (
          <Box
            key={s.key}
            bg={s.bg}
            borderRadius="14px"
            p={4}
            border={`1.5px solid ${s.color}28`}
            cursor="pointer"
            onClick={() => setStatusFilter(s.key)}
            outline={statusFilter === s.key ? `2px solid ${s.color}` : "none"}
            outlineOffset="2px"
            transition="all .15s"
          >
            <Text
              fontSize="10px"
              fontWeight={700}
              color={s.color}
              textTransform="uppercase"
              letterSpacing=".6px"
              mb={1}
            >
              {s.label}
            </Text>
            <Text
              fontSize="30px"
              fontWeight={900}
              color={s.color}
              lineHeight={1}
            >
              {s.value}
            </Text>
          </Box>
        ))}
      </Grid>

      {/* Filters */}
      <Flex gap={3} mb={5} flexWrap={{ base: "wrap", md: "nowrap" }}>
        <InputGroup flex={1} minW="180px">
          <InputLeftElement pointerEvents="none" h="full" pl={3}>
            <Icon as={FaSearch} color="gray.400" fontSize="12px" />
          </InputLeftElement>
          <Input
            placeholder="Search name, city, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            bg="white"
            borderRadius="10px"
            h="42px"
            fontSize="13px"
            pl="38px"
            border="1px solid #e2e8f0"
            _focus={{ borderColor: C.blue, boxShadow: `0 0 0 1px ${C.blue}` }}
          />
        </InputGroup>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          bg="white"
          borderRadius="10px"
          h="42px"
          minW="140px"
          maxW="140px"
          fontSize="13px"
          fontWeight={600}
          border="1px solid #e2e8f0"
        >
          <option value="">All Status</option>
          <option value="pending">⏳ Pending</option>
          <option value="approved">✅ Approved</option>
          <option value="rejected">❌ Rejected</option>
        </Select>
        <Select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          bg="white"
          borderRadius="10px"
          h="42px"
          minW="130px"
          maxW="130px"
          fontSize="13px"
          fontWeight={600}
          border="1px solid #e2e8f0"
        >
          <option value="">All Exams</option>
          {EXAM_OPTIONS.map((ex) => (
            <option key={ex} value={ex}>
              {ex}
            </option>
          ))}
        </Select>
        <Input
          placeholder="Filter by city…"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          bg="white"
          borderRadius="10px"
          h="42px"
          w="140px"
          minW="140px"
          fontSize="13px"
          border="1px solid #e2e8f0"
          _focus={{ borderColor: C.blue, boxShadow: `0 0 0 1px ${C.blue}` }}
        />
        <Button
          onClick={load}
          bg={C.navy}
          color="white"
          borderRadius="10px"
          h="42px"
          px={5}
          fontSize="13px"
          fontWeight={700}
          leftIcon={<Icon as={FaSync} fontSize="11px" />}
          _hover={{ opacity: 0.9 }}
        >
          Refresh
        </Button>
      </Flex>

      {/* Table */}
      {loading ? (
        <Flex justify="center" py={16}>
          <Spinner color={C.blue} thickness="3px" size="xl" />
        </Flex>
      ) : list.length === 0 ? (
        <Box
          py={16}
          textAlign="center"
          bg="white"
          borderRadius="16px"
          border="1px solid #e2e8f0"
        >
          <Icon
            as={FaBuilding}
            fontSize="40px"
            color="#e2e8f0"
            display="block"
            mx="auto"
            mb={3}
          />
          <Text fontSize="14px" color={C.muted} fontWeight={600}>
            No coaching found
          </Text>
        </Box>
      ) : (
        <Box
          bg="white"
          borderRadius="16px"
          border="1px solid #e2e8f0"
          overflow="hidden"
        >
          {/* Header */}
          <Flex
            px={5}
            py={3}
            bg="#f8fafc"
            borderBottom="1px solid #e2e8f0"
            display={{ base: "none", lg: "flex" }}
          >
            {[
              ["Coaching", 3],
              ["Owner", 2],
              ["Location", 2],
              ["Exam Types", 2],
              ["Registered", 1.5],
              ["Status", 1.5],
              ["", 1],
            ].map(([h, f]) => (
              <Text
                key={h}
                flex={f}
                fontSize="10px"
                fontWeight={800}
                color={C.muted}
                textTransform="uppercase"
                letterSpacing=".8px"
              >
                {h}
              </Text>
            ))}
          </Flex>

          {list.map((r, idx) => (
            <Flex
              key={r._id}
              px={5}
              py={4}
              align="center"
              gap={3}
              borderBottom={
                idx < list.length - 1 ? "1px solid #f1f5f9" : "none"
              }
              _hover={{ bg: "#f8faff", cursor: "pointer" }}
              transition="background .15s"
              onClick={() => onSelect(r)}
              flexWrap={{ base: "wrap", lg: "nowrap" }}
            >
              <Box flex={3} minW={0}>
                <Flex align="center" gap={2}>
                  <Flex
                    w="32px"
                    h="32px"
                    bg={`linear-gradient(135deg,${C.blue},${C.navyLt})`}
                    borderRadius="9px"
                    align="center"
                    justify="center"
                    fontSize="13px"
                    fontWeight={900}
                    color="white"
                    flexShrink={0}
                  >
                    {r.name?.[0]?.toUpperCase()}
                  </Flex>
                  <Box minW={0}>
                    <Text
                      fontSize="13px"
                      fontWeight={700}
                      color={C.text}
                      noOfLines={1}
                    >
                      {r.name}
                    </Text>
                    {r.isActive && (
                      <Flex align="center" gap={1} mt={0.5}>
                        <Box w="5px" h="5px" bg="#22c55e" borderRadius="full" />
                        <Text fontSize="9px" fontWeight={700} color="#22c55e">
                          Active
                        </Text>
                      </Flex>
                    )}
                  </Box>
                </Flex>
              </Box>
              <Box flex={2} minW={0} display={{ base: "none", lg: "block" }}>
                <Text
                  fontSize="12px"
                  fontWeight={600}
                  color="#374151"
                  noOfLines={1}
                >
                  {r.owner?.Name || "—"}
                </Text>
                <Text fontSize="10px" color={C.muted} noOfLines={1}>
                  {r.owner?.Email || "—"}
                </Text>
              </Box>
              <Box flex={2} display={{ base: "none", lg: "block" }}>
                <Text fontSize="12px" color={C.muted} noOfLines={1}>
                  {[r.city, r.state].filter(Boolean).join(", ") || "—"}
                </Text>
              </Box>
              <Box flex={2} display={{ base: "none", lg: "block" }}>
                <Flex gap={1} flexWrap="wrap">
                  {r.examTypes?.slice(0, 3).map((ex) => (
                    <Text
                      key={ex}
                      fontSize="9px"
                      fontWeight={700}
                      bg="#eff6ff"
                      color="#2563eb"
                      px={2}
                      py="1px"
                      borderRadius="full"
                    >
                      {ex}
                    </Text>
                  ))}
                  {(r.examTypes?.length || 0) > 3 && (
                    <Text fontSize="9px" color={C.muted}>
                      +{r.examTypes.length - 3}
                    </Text>
                  )}
                </Flex>
              </Box>
              <Box flex={1.5} display={{ base: "none", lg: "block" }}>
                <Text fontSize="11px" color={C.muted}>
                  {fmtDate(r.createdAt)}
                </Text>
              </Box>
              <Box flex={1.5}>
                <StatusBadge status={r.status} />
              </Box>
              <Flex flex={1} justify="flex-end">
                <Button
                  size="sm"
                  h="30px"
                  px={3}
                  bg="#f0f7ff"
                  color="#4a72b8"
                  borderRadius="8px"
                  fontSize="11px"
                  fontWeight={700}
                  leftIcon={<Icon as={FaEye} fontSize="9px" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(r);
                  }}
                  _hover={{ bg: "#dbeafe" }}
                >
                  Open
                </Button>
              </Flex>
            </Flex>
          ))}
        </Box>
      )}
    </Box>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════ */
export default function AdminCoachingDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { user, loading: authLoading } = useAuth();
  const [selectedCoaching, setSelectedCoaching] = useState(null);

  useEffect(() => {
    if (!authLoading && user && !user.isAdmin) navigate("/");
  }, [user, authLoading, navigate]);

  if (authLoading)
    return (
      <Flex minH="80vh" align="center" justify="center">
        <Spinner size="xl" color={C.blue} thickness="4px" />
      </Flex>
    );
  if (!user?.isAdmin) return null;

  return (
    <Box
      minH="100vh"
      bg={C.surface}
      fontFamily="'DM Sans','Segoe UI',sans-serif"
    >
      {/* Page header */}
      <Box
        bg={`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 55%,${C.navyLt} 100%)`}
        px={{ base: 4, md: 8 }}
        pt={{ base: 8, md: 10 }}
        pb={{ base: 8, md: 12 }}
      >
        <Box maxW="1200px" mx="auto">
          <Flex align="center" gap={2} mb={3}>
            <Icon
              as={FaShieldAlt}
              color="rgba(255,255,255,.35)"
              fontSize="12px"
            />
            <Text
              fontSize="10px"
              fontWeight={800}
              color="rgba(255,255,255,.35)"
              textTransform="uppercase"
              letterSpacing="3px"
            >
              Admin Panel
            </Text>
            <Flex
              align="center"
              gap={1.5}
              bg="rgba(34,197,94,.15)"
              border="1px solid rgba(34,197,94,.3)"
              px={2.5}
              py="3px"
              borderRadius="full"
              ml={2}
            >
              <Box
                w="5px"
                h="5px"
                bg="#22c55e"
                borderRadius="full"
                style={{ animation: "pulse 2s infinite" }}
              />
              <Text fontSize="10px" fontWeight={700} color="#4ade80">
                Live
              </Text>
            </Flex>
          </Flex>
          <Text
            fontSize={{ base: "22px", md: "30px" }}
            fontWeight={900}
            color="white"
            letterSpacing="-1px"
            mb={1}
          >
            {selectedCoaching ? selectedCoaching.name : "Coaching Management"}
          </Text>
          <Text fontSize="13px" color="rgba(255,255,255,.4)">
            {selectedCoaching
              ? "View details, tests, students and activity"
              : "Full control — approvals, details, tests, students"}
          </Text>
        </Box>
      </Box>

      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        {selectedCoaching ? (
          <CoachingDetail
            coaching={selectedCoaching}
            onBack={() => setSelectedCoaching(null)}
            onUpdate={(updated) => setSelectedCoaching(updated)}
          />
        ) : (
          <CoachingList onSelect={(c) => setSelectedCoaching(c)} />
        )}
      </Box>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.55; transform: scale(1.15); }
        }
      `}</style>
    </Box>
  );
}