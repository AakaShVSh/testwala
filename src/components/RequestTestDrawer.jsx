/**
 * src/components/RequestTestDrawer.jsx
 *
 * FIXES:
 * 1. Joins coaching socket room on mount, leaves on unmount
 * 2. Listens for "test:created" → auto-refreshes requests list without reload
 * 3. Listens for "notification:new" → shows toast immediately
 * 4. NotificationBell polls + listens via socket for real-time badge updates
 */
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  Spinner,
  Badge,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Stack,
  useToast,
  useDisclosure,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
} from "@chakra-ui/react";
import {
  FaPaperPlane,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaExternalLinkAlt,
  FaBell,
  FaClipboardList,
  FaLink,
  FaCheck,
  FaHourglass,
  FaSyncAlt,
} from "react-icons/fa";
import { apiFetch } from "../services/api";
import {
  socket,
  joinCoachingRoom,
  leaveCoachingRoom,
} from "../services/socket";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ── Status config ─────────────────────────────────────────────────────────
const STATUS_CFG = {
  pending: {
    icon: FaHourglass,
    color: "#a16207",
    bg: "#fef9c3",
    label: "Pending",
  },
  processing: {
    icon: FaClock,
    color: "#1d4ed8",
    bg: "#eff6ff",
    label: "Processing",
  },
  completed: {
    icon: FaCheckCircle,
    color: "#15803d",
    bg: "#dcfce7",
    label: "Completed",
  },
  rejected: {
    icon: FaTimesCircle,
    color: "#dc2626",
    bg: "#fee2e2",
    label: "Rejected",
  },
};

function StatusPill({ status }) {
  const c = STATUS_CFG[status] || STATUS_CFG.pending;
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
}

// ═══════════════════════════════════════════════════════════════
// REQUEST TEST DRAWER
// ═══════════════════════════════════════════════════════════════
export default function RequestTestDrawer({
  isOpen,
  onClose,
  coachingId,
  coachingExamTypes,
  currentUser,
}) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    examType: "",
    subject: "",
    totalQuestions: 20,
    timeLimitMin: 30,
    difficulty: "mixed",
    visibility: "public",
    instructions: "",
  });

  const sf = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const submit = async () => {
    if (!form.title.trim() || !form.examType) {
      toast({ title: "Title and exam type are required", status: "warning" });
      return;
    }
    setBusy(true);
    try {
      await apiFetch("/test-requests/create", {
        method: "POST",
        body: JSON.stringify({ ...form, coachingId }),
      });
      toast({
        title: "Request submitted! ✅",
        description: "Admin will create your test soon. You'll get notified.",
        status: "success",
        duration: 5000,
      });
      onClose();
      setForm({
        title: "",
        examType: "",
        subject: "",
        totalQuestions: 20,
        timeLimitMin: 30,
        difficulty: "mixed",
        visibility: "public",
        instructions: "",
      });
    } catch (err) {
      toast({ title: err.message, status: "error" });
    } finally {
      setBusy(false);
    }
  };

  const LS = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#374151",
    mb: 1,
    textTransform: "uppercase",
    letterSpacing: ".8px",
  };
  const IS = {
    borderRadius: "10px",
    h: "44px",
    fontSize: "14px",
    borderColor: "#e2e8f0",
    _focus: { borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" },
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
      <DrawerOverlay backdropFilter="blur(4px)" />
      <DrawerContent
        borderLeftRadius="20px"
        overflow="hidden"
        fontFamily="'Sora',sans-serif"
      >
        <DrawerCloseButton top={4} right={4} color="white" />
        <DrawerHeader
          px={7}
          pt={7}
          pb={5}
          bg="linear-gradient(135deg,#1e3a5f,#4a72b8)"
          color="white"
        >
          <Flex align="center" gap={3}>
            <Flex
              w="42px"
              h="42px"
              bg="rgba(255,255,255,.15)"
              borderRadius="12px"
              align="center"
              justify="center"
            >
              <Icon as={FaPaperPlane} fontSize="18px" />
            </Flex>
            <Box>
              <Text fontSize="17px" fontWeight={800}>
                Request a Test
              </Text>
              <Text fontSize="12px" color="rgba(255,255,255,.6)" mt="2px">
                Admin will create it within 24h
              </Text>
            </Box>
          </Flex>
        </DrawerHeader>

        <DrawerBody px={7} py={6} overflowY="auto">
          <Stack spacing={4}>
            <Box
              bg="#eff6ff"
              border="1px solid #bfdbfe"
              borderRadius="12px"
              p={4}
            >
              <Text fontSize="12px" color="#1e40af" lineHeight={1.7}>
                💡 <strong>Tip:</strong> Be specific about topics, difficulty,
                and any special requirements. You can also attach study
                material.
              </Text>
            </Box>

            <FormControl isRequired>
              <FormLabel {...LS}>Test Title</FormLabel>
              <Input
                value={form.title}
                onChange={sf("title")}
                placeholder="e.g. SSC CGL Reasoning Mock Test"
                {...IS}
              />
            </FormControl>

            <Flex gap={3}>
              <FormControl flex={1} isRequired>
                <FormLabel {...LS}>Exam Type</FormLabel>
                <Select value={form.examType} onChange={sf("examType")} {...IS}>
                  <option value="">Select…</option>
                  {(coachingExamTypes?.length
                    ? coachingExamTypes
                    : [
                        "SSC",
                        "UPSC",
                        "BANK",
                        "RAILWAY",
                        "STATE",
                        "DEFENCE",
                        "OTHER",
                      ]
                  ).map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel {...LS}>Subject</FormLabel>
                <Input
                  value={form.subject}
                  onChange={sf("subject")}
                  placeholder="e.g. Reasoning"
                  {...IS}
                />
              </FormControl>
            </Flex>

            <Flex gap={3}>
              <FormControl flex={1}>
                <FormLabel {...LS}>Questions</FormLabel>
                <Select
                  value={form.totalQuestions}
                  onChange={sf("totalQuestions")}
                  {...IS}
                >
                  {[10, 15, 20, 25, 30, 40, 50, 60, 75, 100].map((n) => (
                    <option key={n} value={n}>
                      {n} questions
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel {...LS}>Time Limit</FormLabel>
                <Select
                  value={form.timeLimitMin}
                  onChange={sf("timeLimitMin")}
                  {...IS}
                >
                  {[10, 15, 20, 30, 45, 60, 90, 120].map((n) => (
                    <option key={n} value={n}>
                      {n} minutes
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <Flex gap={3}>
              <FormControl flex={1}>
                <FormLabel {...LS}>Difficulty</FormLabel>
                <Select
                  value={form.difficulty}
                  onChange={sf("difficulty")}
                  {...IS}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </Select>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel {...LS}>Visibility</FormLabel>
                <Select
                  value={form.visibility}
                  onChange={sf("visibility")}
                  {...IS}
                >
                  <option value="public">🌐 Public</option>
                  <option value="private">🔒 Private</option>
                </Select>
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel {...LS}>
                Special Instructions{" "}
                <Text
                  as="span"
                  color="#94a3b8"
                  textTransform="none"
                  fontWeight={400}
                >
                  (optional)
                </Text>
              </FormLabel>
              <Textarea
                value={form.instructions}
                onChange={sf("instructions")}
                placeholder="Any specific topics, chapters, previous year pattern, notes for admin…"
                borderRadius="10px"
                fontSize="14px"
                rows={4}
                resize="vertical"
                borderColor="#e2e8f0"
                _focus={{
                  borderColor: "#4a72b8",
                  boxShadow: "0 0 0 1px #4a72b8",
                }}
              />
            </FormControl>

            <Button
              h="50px"
              borderRadius="12px"
              mt={2}
              bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
              color="white"
              fontWeight={800}
              fontSize="14px"
              isLoading={busy}
              loadingText="Submitting…"
              onClick={submit}
              leftIcon={<FaPaperPlane />}
              _hover={{
                opacity: 0.9,
                transform: "translateY(-1px)",
                boxShadow: "0 8px 24px rgba(74,114,184,.35)",
              }}
              transition="all .2s"
            >
              Submit Request
            </Button>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// ═══════════════════════════════════════════════════════════════
// MY TEST REQUESTS — owner panel with live socket updates
// ═══════════════════════════════════════════════════════════════
export function MyTestRequests({ coachingId, onRequestTest }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch("/test-requests/mine");
      setRequests(res.data ?? []);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── Socket: join coaching room + listen for live events ─────────────────
  useEffect(() => {
    if (!coachingId) return;

    // Join the coaching room so we receive broadcasts
    joinCoachingRoom(coachingId);

    // "test:created" — admin finished building the test
    const onTestCreated = ({ testRequestId, test }) => {
      setRequests((prev) =>
        prev.map((r) =>
          r._id === testRequestId
            ? { ...r, status: "completed", createdTestId: test }
            : r,
        ),
      );
      toast({
        title: "🎉 Your test is ready!",
        description: `"${test?.title}" has been created. Share it with your students!`,
        status: "success",
        duration: 8000,
        isClosable: true,
      });
    };

    // "notification:new" — any notification for this coaching/user
    const onNotification = ({ notification }) => {
      toast({
        title: notification.title,
        description: notification.body,
        status: notification.type === "request_rejected" ? "error" : "info",
        duration: 7000,
        isClosable: true,
      });
      // Refresh the list so status badge updates
      load();
    };

    socket.on("test:created", onTestCreated);
    socket.on("notification:new", onNotification);

    return () => {
      leaveCoachingRoom(coachingId);
      socket.off("test:created", onTestCreated);
      socket.off("notification:new", onNotification);
    };
  }, [coachingId, load, toast]);

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2500);
    });
  };

  const getTestUrl = (test) => {
    if (!test) return null;
    const base = window.location.origin;
    if (test.accessToken && test.visibility === "private")
      return `${base}/tests/token/${test.accessToken}`;
    return `${base}/tests/${test.slug || test._id}`;
  };

  if (loading)
    return (
      <Flex justify="center" py={10}>
        <Spinner color="#4a72b8" size="lg" />
      </Flex>
    );

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Box>
          <Text
            fontSize="11px"
            fontWeight={800}
            color="#94a3b8"
            textTransform="uppercase"
            letterSpacing="2px"
            mb={1}
          >
            Test Requests
          </Text>
          <Text fontSize="13px" color="#64748b">
            {requests.length} request{requests.length !== 1 ? "s" : ""} total
          </Text>
        </Box>
        <Button
          leftIcon={<FaPaperPlane />}
          onClick={onRequestTest}
          bg="#4a72b8"
          color="white"
          borderRadius="10px"
          fontWeight={700}
          fontSize="13px"
          h="38px"
          px={4}
          _hover={{ bg: "#3b5fa0", transform: "translateY(-1px)" }}
          transition="all .15s"
        >
          New Request
        </Button>
      </Flex>

      {requests.length === 0 ? (
        <Box
          py={16}
          textAlign="center"
          bg="white"
          borderRadius="16px"
          border="1px solid #e2e8f0"
        >
          <Icon
            as={FaClipboardList}
            fontSize="48px"
            color="#e2e8f0"
            display="block"
            mx="auto"
            mb={4}
          />
          <Text fontSize="15px" fontWeight={700} color="#475569" mb={2}>
            No test requests yet
          </Text>
          <Text fontSize="13px" color="#94a3b8" mb={6}>
            Request a test from admin and it will appear here
          </Text>
          <Button
            leftIcon={<FaPaperPlane />}
            onClick={onRequestTest}
            bg="#4a72b8"
            color="white"
            borderRadius="10px"
            fontWeight={700}
            _hover={{ bg: "#3b5fa0" }}
          >
            Request First Test
          </Button>
        </Box>
      ) : (
        <Stack spacing={4}>
          {requests.map((r) => {
            const test = r.createdTestId;
            const testUrl = getTestUrl(test);

            return (
              <Box
                key={r._id}
                bg="white"
                borderRadius="16px"
                border="1px solid #e2e8f0"
                overflow="hidden"
                boxShadow="0 2px 12px rgba(0,0,0,.04)"
                transition="box-shadow .15s"
                _hover={{ boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}
              >
                {/* Header */}
                <Flex
                  px={5}
                  py={4}
                  align="center"
                  justify="space-between"
                  borderBottom="1px solid #f1f5f9"
                  flexWrap="wrap"
                  gap={3}
                >
                  <Box flex={1} minW={0}>
                    <Flex align="center" gap={2} mb={1} flexWrap="wrap">
                      <Text
                        fontSize="14px"
                        fontWeight={800}
                        color="#0f172a"
                        noOfLines={1}
                      >
                        {r.title}
                      </Text>
                      <StatusPill status={r.status} />
                    </Flex>
                    <Flex gap={2} flexWrap="wrap">
                      <Text
                        fontSize="10px"
                        fontWeight={700}
                        bg="#eff6ff"
                        color="#2563eb"
                        px={2}
                        py="2px"
                        borderRadius="full"
                      >
                        {r.examType}
                      </Text>
                      {r.subject && (
                        <Text
                          fontSize="10px"
                          fontWeight={700}
                          bg="#f1f5f9"
                          color="#475569"
                          px={2}
                          py="2px"
                          borderRadius="full"
                          textTransform="capitalize"
                        >
                          {r.subject}
                        </Text>
                      )}
                      <Text
                        fontSize="10px"
                        fontWeight={700}
                        bg="#f8fafc"
                        color="#64748b"
                        px={2}
                        py="2px"
                        borderRadius="full"
                      >
                        {r.totalQuestions}Q · {r.timeLimitMin}min
                      </Text>
                    </Flex>
                  </Box>
                  <Text fontSize="11px" color="#94a3b8" flexShrink={0}>
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </Flex>

                {/* Body */}
                <Box px={5} py={4}>
                  {r.status === "completed" && test ? (
                    <Box>
                      {/* Admin note */}
                      {r.adminNote && (
                        <Box
                          bg="#f0fdf4"
                          border="1px solid #bbf7d0"
                          borderRadius="10px"
                          p={3}
                          mb={4}
                        >
                          <Text
                            fontSize="11px"
                            fontWeight={800}
                            color="#15803d"
                            textTransform="uppercase"
                            letterSpacing=".6px"
                            mb={1}
                          >
                            Admin Note
                          </Text>
                          <Text
                            fontSize="13px"
                            color="#166534"
                            lineHeight={1.7}
                          >
                            {r.adminNote}
                          </Text>
                        </Box>
                      )}

                      {/* Test info */}
                      <Box
                        bg="#f8fafc"
                        borderRadius="10px"
                        border="1px solid #e2e8f0"
                        p={4}
                        mb={4}
                      >
                        <Flex align="center" gap={2} mb={3}>
                          <Icon
                            as={FaCheckCircle}
                            color="#16a34a"
                            fontSize="13px"
                          />
                          <Text
                            fontSize="13px"
                            fontWeight={700}
                            color="#0f172a"
                          >
                            {test.title}
                          </Text>
                          {test.visibility === "private" && (
                            <Badge fontSize="9px" colorScheme="orange">
                              PRIVATE
                            </Badge>
                          )}
                        </Flex>
                        <Flex gap={3} flexWrap="wrap" mb={4}>
                          {[
                            ["Questions", test.questions?.length ?? "—"],
                            ["Duration", `${test.timeLimitMin}min`],
                            ["Type", test.examType],
                          ].map(([l, v]) => (
                            <Box
                              key={l}
                              bg="white"
                              borderRadius="8px"
                              px={3}
                              py={2}
                              border="1px solid #e2e8f0"
                              textAlign="center"
                            >
                              <Text
                                fontSize="15px"
                                fontWeight={800}
                                color="#0f172a"
                              >
                                {v}
                              </Text>
                              <Text
                                fontSize="10px"
                                color="#94a3b8"
                                textTransform="uppercase"
                                letterSpacing=".6px"
                              >
                                {l}
                              </Text>
                            </Box>
                          ))}
                        </Flex>

                        {/* Share URL */}
                        {testUrl && (
                          <Box>
                            <Text
                              fontSize="11px"
                              fontWeight={700}
                              color="#94a3b8"
                              textTransform="uppercase"
                              letterSpacing=".8px"
                              mb={2}
                            >
                              Share Link
                            </Text>
                            <Flex
                              gap={2}
                              flexWrap={{ base: "wrap", sm: "nowrap" }}
                            >
                              <Box
                                flex={1}
                                bg="#f1f5f9"
                                borderRadius="8px"
                                px={3}
                                py="9px"
                                fontFamily="monospace"
                                fontSize="12px"
                                color="#475569"
                                overflow="hidden"
                                textOverflow="ellipsis"
                                whiteSpace="nowrap"
                              >
                                {testUrl}
                              </Box>
                              <Button
                                h="38px"
                                px={4}
                                borderRadius="8px"
                                flexShrink={0}
                                bg={copied === r._id ? "#22c55e" : "#4a72b8"}
                                color="white"
                                fontWeight={700}
                                fontSize="12px"
                                leftIcon={
                                  <Icon
                                    as={copied === r._id ? FaCheck : FaLink}
                                    fontSize="11px"
                                  />
                                }
                                onClick={() => handleCopy(testUrl, r._id)}
                                _hover={{ opacity: 0.9 }}
                              >
                                {copied === r._id ? "Copied!" : "Copy"}
                              </Button>
                            </Flex>
                          </Box>
                        )}
                      </Box>

                      {/* View test button */}
                      <Button
                        size="sm"
                        h="36px"
                        borderRadius="9px"
                        variant="outline"
                        borderColor="#4a72b8"
                        color="#4a72b8"
                        fontWeight={700}
                        fontSize="12px"
                        rightIcon={<FaExternalLinkAlt />}
                        onClick={() =>
                          navigate(`/tests/${test.slug || test._id}`)
                        }
                      >
                        Open Test Dashboard
                      </Button>
                    </Box>
                  ) : r.status === "rejected" ? (
                    <Box
                      bg="#fef2f2"
                      border="1px solid #fecaca"
                      borderRadius="10px"
                      p={4}
                    >
                      <Text
                        fontSize="11px"
                        fontWeight={800}
                        color="#dc2626"
                        textTransform="uppercase"
                        letterSpacing=".6px"
                        mb={1}
                      >
                        Rejection Reason
                      </Text>
                      <Text fontSize="13px" color="#7f1d1d" lineHeight={1.7}>
                        {r.adminNote || "No reason provided"}
                      </Text>
                    </Box>
                  ) : r.status === "processing" ? (
                    <Flex
                      align="center"
                      gap={3}
                      bg="#eff6ff"
                      borderRadius="10px"
                      border="1px solid #bfdbfe"
                      p={4}
                    >
                      <Spinner size="sm" color="#2563eb" />
                      <Box>
                        <Text fontSize="13px" fontWeight={700} color="#1e40af">
                          Admin is working on your test
                        </Text>
                        <Text fontSize="12px" color="#3b82f6">
                          You'll get notified as soon as it's ready
                        </Text>
                      </Box>
                    </Flex>
                  ) : (
                    <Flex
                      align="center"
                      gap={3}
                      bg="#fffbeb"
                      borderRadius="10px"
                      border="1px solid #fde68a"
                      p={4}
                    >
                      <Icon as={FaHourglass} color="#f59e0b" fontSize="14px" />
                      <Box>
                        <Text fontSize="13px" fontWeight={700} color="#92400e">
                          Waiting for admin review
                        </Text>
                        <Text fontSize="12px" color="#a16207">
                          Usually processed within 24 hours
                        </Text>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION BELL — Navbar component with real-time updates
// ═══════════════════════════════════════════════════════════════
export function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/notifications/mine");
      setNotifications(res.data ?? []);
      setUnread(res.unreadCount ?? 0);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // ── Socket: listen for new notifications in real-time ──────────────────
  useEffect(() => {
    const onNew = ({ notification }) => {
      // Add to list immediately
      setNotifications((prev) => [notification, ...prev]);
      setUnread((prev) => prev + 1);
      // Show toast
      toast({
        title: notification.title,
        description: notification.body,
        status: notification.type === "request_rejected" ? "error" : "success",
        duration: 8000,
        isClosable: true,
        position: "top-right",
      });
    };

    socket.on("notification:new", onNew);
    return () => socket.off("notification:new", onNew);
  }, [toast]);

  const markAllRead = async () => {
    try {
      await apiFetch("/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch {
      /* silent */
    }
  };

  const handleClick = async (n) => {
    if (!n.isRead) {
      await apiFetch(`/notifications/${n._id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((x) => (x._id === n._id ? { ...x, isRead: true } : x)),
      );
      setUnread((prev) => Math.max(0, prev - 1));
    }
    if (n.testId) {
      onClose();
      navigate(`/tests/${n.testId.slug || n.testId._id}`);
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-end"
    >
      <PopoverTrigger>
        <Box position="relative" cursor="pointer">
          <Flex
            w="36px"
            h="36px"
            align="center"
            justify="center"
            bg={isOpen ? "#f0f7ff" : "#f8fafc"}
            border="1px solid"
            borderColor={isOpen ? "#4a72b8" : "#e2e8f0"}
            borderRadius="10px"
            transition="all .15s"
            _hover={{ bg: "#f0f7ff", borderColor: "#4a72b8" }}
          >
            <Icon
              as={FaBell}
              fontSize="14px"
              color={isOpen ? "#4a72b8" : "#64748b"}
            />
          </Flex>
          {unread > 0 && (
            <Flex
              position="absolute"
              top="-5px"
              right="-5px"
              w="18px"
              h="18px"
              bg="#ef4444"
              borderRadius="full"
              align="center"
              justify="center"
              border="2px solid white"
            >
              <Text fontSize="9px" fontWeight={900} color="white">
                {unread > 9 ? "9+" : unread}
              </Text>
            </Flex>
          )}
        </Box>
      </PopoverTrigger>

      <PopoverContent
        w="360px"
        borderRadius="16px"
        overflow="hidden"
        border="1px solid #e2e8f0"
        boxShadow="0 12px 40px rgba(0,0,0,.12)"
        fontFamily="'Sora',sans-serif"
      >
        <PopoverArrow />
        <PopoverBody p={0}>
          {/* Header */}
          <Flex
            px={5}
            py={4}
            align="center"
            justify="space-between"
            borderBottom="1px solid #f1f5f9"
          >
            <Flex align="center" gap={2}>
              <Text fontSize="14px" fontWeight={800} color="#0f172a">
                Notifications
              </Text>
              {unread > 0 && (
                <Badge colorScheme="red" borderRadius="full" fontSize="10px">
                  {unread}
                </Badge>
              )}
            </Flex>
            {unread > 0 && (
              <Button
                size="xs"
                variant="ghost"
                color="#4a72b8"
                fontWeight={700}
                onClick={markAllRead}
              >
                Mark all read
              </Button>
            )}
          </Flex>

          {/* List */}
          <Box maxH="380px" overflowY="auto">
            {loading ? (
              <Flex justify="center" py={10}>
                <Spinner color="#4a72b8" size="md" />
              </Flex>
            ) : notifications.length === 0 ? (
              <Box py={12} textAlign="center">
                <Icon
                  as={FaBell}
                  fontSize="32px"
                  color="#e2e8f0"
                  display="block"
                  mx="auto"
                  mb={3}
                />
                <Text fontSize="13px" color="#94a3b8">
                  No notifications yet
                </Text>
              </Box>
            ) : (
              notifications.map((n, i) => (
                <Flex
                  key={n._id}
                  px={5}
                  py={4}
                  bg={n.isRead ? "white" : "#fafbff"}
                  borderBottom={
                    i < notifications.length - 1 ? "1px solid #f8fafc" : "none"
                  }
                  cursor="pointer"
                  gap={3}
                  align="flex-start"
                  _hover={{ bg: "#f0f7ff" }}
                  transition="background .1s"
                  onClick={() => handleClick(n)}
                >
                  {/* Dot */}
                  <Box
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    flexShrink={0}
                    mt="5px"
                    bg={n.isRead ? "#e2e8f0" : "#4a72b8"}
                  />
                  <Box flex={1} minW={0}>
                    <Text
                      fontSize="13px"
                      fontWeight={n.isRead ? 500 : 700}
                      color="#0f172a"
                      mb={0.5}
                    >
                      {n.title}
                    </Text>
                    <Text
                      fontSize="12px"
                      color="#64748b"
                      lineHeight={1.6}
                      noOfLines={2}
                    >
                      {n.body}
                    </Text>
                    <Text fontSize="10px" color="#94a3b8" mt={1}>
                      {new Date(n.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Box>
                  {n.testId && (
                    <Icon
                      as={FaExternalLinkAlt}
                      fontSize="10px"
                      color="#94a3b8"
                      flexShrink={0}
                      mt="4px"
                    />
                  )}
                </Flex>
              ))
            )}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
