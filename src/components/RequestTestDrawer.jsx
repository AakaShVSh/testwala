import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Stack,
  Divider,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Collapse,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaClipboardList,
  FaUpload,
  FaFilePdf,
  FaFileImage,
  FaFileExcel,
  FaTrash,
  FaCheck,
  FaClock,
  FaTimesCircle,
  FaCheckCircle,
  FaHourglass,
  FaLink,
  FaRedo,
  FaInfoCircle,
  FaBell,
  FaEye,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt,
  FaWhatsapp,
  FaShareAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { socket } from "../services/socket";
import { useAuth } from "../context/AuthContext";

const EXAM_TYPES = [
  "SSC",
  "UPSC",
  "BANK",
  "RAILWAY",
  "STATE",
  "DEFENCE",
  "OTHER",
];
const SUBJECTS = [
  "math",
  "english",
  "gs",
  "vocabulary",
  "reasoning",
  "mathtwo",
  "science",
  "history",
  "geography",
  "polity",
  "economics",
];
const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
  { value: "mixed", label: "Mixed (Recommended)" },
];
const OPTION_LABELS = ["A", "B", "C", "D"];

// ── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    pending: {
      bg: "#fef9c3",
      color: "#a16207",
      icon: FaHourglass,
      label: "Pending",
    },
    processing: {
      bg: "#eff6ff",
      color: "#1d4ed8",
      icon: FaClock,
      label: "Processing",
    },
    completed: {
      bg: "#dcfce7",
      color: "#15803d",
      icon: FaCheckCircle,
      label: "Ready",
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

const FileIcon = ({ type }) => {
  const map = { pdf: FaFilePdf, image: FaFileImage, excel: FaFileExcel };
  const colors = { pdf: "#ef4444", image: "#8b5cf6", excel: "#16a34a" };
  const Ic = map[type] || FaClipboardList;
  return <Icon as={Ic} color={colors[type] || "#64748b"} fontSize="18px" />;
};

// ═══════════════════════════════════════════════════════════════════
// TEST DETAIL MODAL — shows full test: questions, options, answer key, share links
// ═══════════════════════════════════════════════════════════════════
function TestDetailModal({ isOpen, onClose, test, requestTitle }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [expandedQ, setExpandedQ] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!test) return null;

  const shareUrl = `${window.location.origin}/tests/${test.slug || test._id}`;
  const whatsappMsg = `📚 *${test.title}*\n\n🎯 Exam: ${test.examType || ""}\n⏱ Time: ${test.timeLimitMin} minutes\n❓ Questions: ${test.questions?.length || test.totalMarks}\n\n👉 Take the test: ${shareUrl}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
      toast({ title: "Link copied!", status: "success", duration: 2000 });
    });
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`,
      "_blank",
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(6px)" bg="rgba(0,0,0,.6)" />
      <ModalContent
        borderRadius="20px"
        fontFamily="'Sora',sans-serif"
        mx={{ base: 2, md: 6 }}
        my={{ base: 0, md: 6 }}
        maxH="90vh"
      >
        {/* Header */}
        <Box
          bg="linear-gradient(135deg,#0f1e3a 0%,#1e3a5f 50%,#2d5fa8 100%)"
          px={7}
          pt={7}
          pb={6}
          borderRadius="20px 20px 0 0"
        >
          <Flex align="flex-start" justify="space-between" gap={4}>
            <Box flex={1} minW={0}>
              {/* NEW badge */}
              <Flex align="center" gap={2} mb={2}>
                <Flex
                  align="center"
                  gap={1.5}
                  bg="rgba(34,197,94,.2)"
                  border="1px solid rgba(34,197,94,.4)"
                  px={3}
                  py="4px"
                  borderRadius="full"
                >
                  <Icon as={FaCheckCircle} color="#4ade80" fontSize="10px" />
                  <Text fontSize="10px" fontWeight={800} color="#4ade80">
                    TEST READY
                  </Text>
                </Flex>
              </Flex>
              <Text
                fontSize={{ base: "20px", md: "26px" }}
                fontWeight={800}
                color="white"
                letterSpacing="-0.5px"
                lineHeight="1.2"
                mb={2}
              >
                {test.title}
              </Text>
              <Flex flexWrap="wrap" gap={3} align="center">
                {test.examType && (
                  <Text
                    fontSize="12px"
                    color="rgba(255,255,255,.6)"
                    fontWeight={600}
                  >
                    🎯 {test.examType}
                  </Text>
                )}
                <Text fontSize="12px" color="rgba(255,255,255,.6)">
                  ⏱ {test.timeLimitMin} minutes
                </Text>
                <Text fontSize="12px" color="rgba(255,255,255,.6)">
                  ❓ {test.questions?.length || test.totalMarks || 0} questions
                </Text>
                <Flex
                  align="center"
                  gap={1.5}
                  bg={
                    test.visibility === "private"
                      ? "rgba(239,68,68,.2)"
                      : "rgba(34,197,94,.2)"
                  }
                  px={2}
                  py="3px"
                  borderRadius="full"
                >
                  <Text
                    fontSize="10px"
                    fontWeight={700}
                    color={
                      test.visibility === "private" ? "#fca5a5" : "#4ade80"
                    }
                  >
                    {test.visibility === "private" ? "🔒 Private" : "🌐 Public"}
                  </Text>
                </Flex>
              </Flex>
            </Box>
            <ModalCloseButton
              position="static"
              color="white"
              _hover={{ bg: "rgba(255,255,255,.15)" }}
              borderRadius="8px"
              mt={1}
            />
          </Flex>

          {/* Share row */}
          <Box mt={5} bg="rgba(0,0,0,.3)" borderRadius="14px" p={4}>
            <Text
              fontSize="11px"
              fontWeight={700}
              color="rgba(255,255,255,.5)"
              textTransform="uppercase"
              letterSpacing="1px"
              mb={3}
            >
              Share with students
            </Text>
            <Flex gap={2} flexWrap={{ base: "wrap", sm: "nowrap" }}>
              <Box
                flex={1}
                bg="rgba(0,0,0,.4)"
                borderRadius="10px"
                px={4}
                py="10px"
                fontFamily="monospace"
                fontSize="12px"
                color="rgba(255,255,255,.8)"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                minW={0}
              >
                {shareUrl}
              </Box>
              <Button
                flexShrink={0}
                h="40px"
                px={4}
                borderRadius="10px"
                bg={copied ? "#22c55e" : "white"}
                color={copied ? "white" : "#1e3a5f"}
                fontWeight={700}
                fontSize="12px"
                leftIcon={
                  <Icon as={copied ? FaCheck : FaLink} fontSize="11px" />
                }
                onClick={handleCopy}
                _hover={{ opacity: 0.9 }}
                transition="all .2s"
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button
                flexShrink={0}
                h="40px"
                px={4}
                borderRadius="10px"
                bg="#25d366"
                color="white"
                fontWeight={700}
                fontSize="12px"
                leftIcon={<Icon as={FaWhatsapp} fontSize="13px" />}
                onClick={handleWhatsApp}
                _hover={{ bg: "#1ebe5d" }}
              >
                WhatsApp
              </Button>
              <Button
                flexShrink={0}
                h="40px"
                px={4}
                borderRadius="10px"
                bg="rgba(255,255,255,.1)"
                color="white"
                fontWeight={700}
                fontSize="12px"
                leftIcon={<Icon as={FaExternalLinkAlt} fontSize="11px" />}
                onClick={() => navigate(`/tests/${test.slug || test._id}`)}
                _hover={{ bg: "rgba(255,255,255,.2)" }}
              >
                Open
              </Button>
            </Flex>
          </Box>
        </Box>

        {/* Questions */}
        <ModalBody px={{ base: 4, md: 7 }} py={6}>
          {test.questions && test.questions.length > 0 ? (
            <Box>
              <Flex align="center" justify="space-between" mb={5}>
                <Text
                  fontSize="11px"
                  fontWeight={800}
                  color="#94a3b8"
                  textTransform="uppercase"
                  letterSpacing="2px"
                >
                  Questions & Answer Key ({test.questions.length})
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  fontSize="11px"
                  color="#64748b"
                  onClick={() => setExpandedQ(expandedQ !== null ? null : -1)}
                >
                  {expandedQ !== null ? "Collapse all" : "Expand all"}
                </Button>
              </Flex>

              <Stack spacing={3}>
                {test.questions.map((q, qi) => {
                  const isOpen = expandedQ === qi || expandedQ === -1;
                  return (
                    <Box
                      key={qi}
                      bg="white"
                      borderRadius="14px"
                      border="1px solid #e2e8f0"
                      boxShadow={isOpen ? "0 2px 12px rgba(0,0,0,.06)" : "none"}
                      overflow="hidden"
                      transition="all .2s"
                    >
                      {/* Question header — always visible */}
                      <Flex
                        align="flex-start"
                        gap={3}
                        px={5}
                        py={4}
                        cursor="pointer"
                        onClick={() => setExpandedQ(isOpen ? null : qi)}
                        _hover={{ bg: "#f8fafc" }}
                        transition="bg .15s"
                      >
                        {/* Q number */}
                        <Flex
                          w="28px"
                          h="28px"
                          flexShrink={0}
                          bg="#f1f5f9"
                          borderRadius="8px"
                          align="center"
                          justify="center"
                          fontSize="11px"
                          fontWeight={800}
                          color="#64748b"
                        >
                          {qi + 1}
                        </Flex>
                        <Text
                          flex={1}
                          fontSize="14px"
                          fontWeight={600}
                          color="#0f172a"
                          lineHeight={1.6}
                          mt="2px"
                        >
                          {q.qus}
                        </Text>
                        {/* Correct answer pill — always visible */}
                        <Flex
                          align="center"
                          gap={1.5}
                          bg="#dcfce7"
                          color="#15803d"
                          px={3}
                          py="4px"
                          borderRadius="full"
                          flexShrink={0}
                          fontSize="11px"
                          fontWeight={700}
                        >
                          <Icon as={FaCheckCircle} fontSize="9px" />
                          Ans: {OPTION_LABELS[q.answer] || q.answer}
                        </Flex>
                        <Icon
                          as={isOpen ? FaChevronUp : FaChevronDown}
                          fontSize="11px"
                          color="#94a3b8"
                          mt="6px"
                          flexShrink={0}
                        />
                      </Flex>

                      {/* Options + explanation — collapsible */}
                      <Collapse in={isOpen} animateOpacity>
                        <Box px={5} pb={4} pt={0}>
                          <Flex
                            flexWrap="wrap"
                            gap={2}
                            mb={q.explanation ? 3 : 0}
                          >
                            {(q.options || []).map((opt, oi) => {
                              const isCorrect = oi === q.answer;
                              return (
                                <Flex
                                  key={oi}
                                  align="center"
                                  gap={2}
                                  w={{ base: "100%", sm: "calc(50% - 4px)" }}
                                  bg={isCorrect ? "#f0fdf4" : "#f8fafc"}
                                  border="1.5px solid"
                                  borderColor={
                                    isCorrect ? "#16a34a" : "#e2e8f0"
                                  }
                                  borderRadius="10px"
                                  px={3}
                                  py="8px"
                                >
                                  <Flex
                                    w="22px"
                                    h="22px"
                                    flexShrink={0}
                                    align="center"
                                    justify="center"
                                    borderRadius="6px"
                                    bg={isCorrect ? "#16a34a" : "#e2e8f0"}
                                    fontSize="10px"
                                    fontWeight={800}
                                    color={isCorrect ? "white" : "#64748b"}
                                  >
                                    {OPTION_LABELS[oi]}
                                  </Flex>
                                  <Text
                                    fontSize="13px"
                                    color={isCorrect ? "#15803d" : "#374151"}
                                    fontWeight={isCorrect ? 700 : 500}
                                    lineHeight={1.4}
                                  >
                                    {opt}
                                  </Text>
                                  {isCorrect && (
                                    <Icon
                                      as={FaCheckCircle}
                                      color="#16a34a"
                                      fontSize="11px"
                                      ml="auto"
                                      flexShrink={0}
                                    />
                                  )}
                                </Flex>
                              );
                            })}
                          </Flex>

                          {q.explanation && (
                            <Box
                              bg="#fffbeb"
                              border="1px solid #fde68a"
                              borderRadius="10px"
                              px={4}
                              py={3}
                            >
                              <Text
                                fontSize="10px"
                                fontWeight={800}
                                color="#92400e"
                                textTransform="uppercase"
                                letterSpacing=".6px"
                                mb={1}
                              >
                                Explanation
                              </Text>
                              <Text
                                fontSize="13px"
                                color="#78350f"
                                lineHeight={1.7}
                              >
                                {q.explanation}
                              </Text>
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </Box>
                  );
                })}
              </Stack>
            </Box>
          ) : (
            <Flex
              justify="center"
              align="center"
              py={10}
              direction="column"
              gap={3}
            >
              <Icon as={FaClipboardList} fontSize="36px" color="#e2e8f0" />
              <Text fontSize="14px" color="#94a3b8">
                Question details not available
              </Text>
              <Button
                leftIcon={<FaExternalLinkAlt />}
                size="sm"
                onClick={() => navigate(`/tests/${test.slug || test._id}`)}
                bg="#4a72b8"
                color="white"
                borderRadius="9px"
                fontWeight={700}
              >
                View Full Test
              </Button>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════════
// NOTIFICATION BELL — shows unread count, opens notification panel
// ═══════════════════════════════════════════════════════════════════
export function NotificationBell() {
  const { user } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const {
    isOpen: testOpen,
    onOpen: openTest,
    onClose: closeTest,
  } = useDisclosure();
  const [selectedRequestTitle, setSelectedRequestTitle] = useState("");

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const res = await apiFetch("/notifications/mine");
      setNotifications(res.data ?? []);
      setUnread(res.unreadCount ?? 0);
    } catch (_) {}
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;
    loadNotifications();

    // Join personal notification room
    const room = `user:${user._id}`;
    socket.emit("join-user", room);

    // Listen for new notifications
    const handleNew = ({ notification }) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnread((prev) => prev + 1);
      // Toast for test_ready
      if (notification.type === "test_ready") {
        toast({
          title: notification.title,
          description: notification.body,
          status: "success",
          duration: 8000,
          isClosable: true,
          position: "top-right",
        });
      } else if (notification.type === "request_processing") {
        toast({
          title: notification.title,
          status: "info",
          duration: 4000,
          position: "top-right",
        });
      } else if (notification.type === "request_rejected") {
        toast({
          title: notification.title,
          description: notification.body,
          status: "warning",
          duration: 6000,
          isClosable: true,
          position: "top-right",
        });
      }
    };

    socket.on("notification:new", handleNew);
    return () => {
      socket.emit("leave-user", room);
      socket.off("notification:new", handleNew);
    };
  }, [user?._id, loadNotifications]);

  const markAllRead = async () => {
    try {
      await apiFetch("/notifications/read-all", { method: "PATCH" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnread(0);
    } catch (_) {}
  };

  const markRead = async (id) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
      );
      setUnread((prev) => Math.max(0, prev - 1));
    } catch (_) {}
  };

  const handleNotifClick = (notif) => {
    if (!notif.isRead) markRead(notif._id);
    if (notif.type === "test_ready" && notif.testId) {
      setSelectedTest(notif.testId);
      setSelectedRequestTitle(notif.title);
      openTest();
    }
  };

  const notifIcon = (type) => {
    if (type === "test_ready")
      return { icon: FaCheckCircle, color: "#16a34a", bg: "#dcfce7" };
    if (type === "request_rejected")
      return { icon: FaTimesCircle, color: "#dc2626", bg: "#fee2e2" };
    if (type === "request_processing")
      return { icon: FaClock, color: "#2563eb", bg: "#eff6ff" };
    if (type === "coaching_approved")
      return { icon: FaCheckCircle, color: "#16a34a", bg: "#dcfce7" };
    return { icon: FaBell, color: "#4a72b8", bg: "#eff6ff" };
  };

  if (!user) return null;

  return (
    <>
      {/* Bell button */}
      <Box
        position="relative"
        cursor="pointer"
        onClick={() => {
          onOpen();
          loadNotifications();
        }}
      >
        <Flex
          w="38px"
          h="38px"
          align="center"
          justify="center"
          borderRadius="10px"
          bg="#f8fafc"
          border="1px solid #e2e8f0"
          _hover={{ bg: "#f1f5f9" }}
          transition="all .15s"
        >
          <Icon as={FaBell} fontSize="15px" color="#475569" />
        </Flex>
        {unread > 0 && (
          <Flex
            position="absolute"
            top="-6px"
            right="-6px"
            minW="18px"
            h="18px"
            bg="#ef4444"
            borderRadius="full"
            align="center"
            justify="center"
            px={1}
            border="2px solid white"
          >
            <Text fontSize="9px" fontWeight={800} color="white" lineHeight="1">
              {unread > 9 ? "9+" : unread}
            </Text>
          </Flex>
        )}
      </Box>

      {/* Notification panel drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="sm">
        <DrawerOverlay backdropFilter="blur(2px)" bg="rgba(0,0,0,.3)" />
        <DrawerContent fontFamily="'Sora',sans-serif">
          <DrawerCloseButton top={4} right={4} />
          <DrawerHeader px={6} pt={6} pb={4} borderBottom="1px solid #f1f5f9">
            <Flex align="center" justify="space-between" pr={8}>
              <Box>
                <Text fontSize="16px" fontWeight={800} color="#0f172a">
                  Notifications
                </Text>
                {unread > 0 && (
                  <Text fontSize="12px" color="#64748b" mt="1px">
                    {unread} unread
                  </Text>
                )}
              </Box>
              {unread > 0 && (
                <Button
                  size="xs"
                  variant="ghost"
                  fontSize="11px"
                  color="#4a72b8"
                  fontWeight={700}
                  onClick={markAllRead}
                  borderRadius="7px"
                  _hover={{ bg: "#eff6ff" }}
                >
                  Mark all read
                </Button>
              )}
            </Flex>
          </DrawerHeader>

          <DrawerBody px={0} py={0} overflowY="auto">
            {loading ? (
              <Flex justify="center" py={10}>
                <Spinner color="#4a72b8" />
              </Flex>
            ) : notifications.length === 0 ? (
              <Flex direction="column" align="center" py={16} px={6} gap={3}>
                <Flex
                  w="56px"
                  h="56px"
                  bg="#f1f5f9"
                  borderRadius="full"
                  align="center"
                  justify="center"
                >
                  <Icon as={FaBell} fontSize="22px" color="#cbd5e1" />
                </Flex>
                <Text fontSize="14px" fontWeight={700} color="#94a3b8">
                  No notifications yet
                </Text>
                <Text fontSize="12px" color="#cbd5e1" textAlign="center">
                  You'll be notified when your test requests are ready
                </Text>
              </Flex>
            ) : (
              <Box>
                {notifications.map((n, idx) => {
                  const ic = notifIcon(n.type);
                  const isTestReady = n.type === "test_ready" && n.testId;
                  return (
                    <Flex
                      key={n._id}
                      px={5}
                      py={4}
                      gap={3}
                      bg={n.isRead ? "white" : "#f8faff"}
                      borderBottom="1px solid #f1f5f9"
                      borderLeft={
                        n.isRead ? "3px solid transparent" : "3px solid #4a72b8"
                      }
                      cursor={isTestReady ? "pointer" : "default"}
                      onClick={() => handleNotifClick(n)}
                      _hover={{
                        bg: isTestReady
                          ? "#f0f7ff"
                          : n.isRead
                            ? "white"
                            : "#f8faff",
                      }}
                      transition="bg .15s"
                      align="flex-start"
                    >
                      {/* Icon */}
                      <Flex
                        w="36px"
                        h="36px"
                        flexShrink={0}
                        borderRadius="10px"
                        bg={ic.bg}
                        align="center"
                        justify="center"
                      >
                        <Icon as={ic.icon} color={ic.color} fontSize="14px" />
                      </Flex>

                      {/* Content */}
                      <Box flex={1} minW={0}>
                        <Flex
                          align="flex-start"
                          justify="space-between"
                          gap={2}
                          mb={1}
                        >
                          <Text
                            fontSize="13px"
                            fontWeight={n.isRead ? 600 : 800}
                            color="#0f172a"
                            lineHeight={1.4}
                          >
                            {n.title}
                          </Text>
                          {!n.isRead && (
                            <Box
                              w="7px"
                              h="7px"
                              bg="#4a72b8"
                              borderRadius="full"
                              flexShrink={0}
                              mt="4px"
                            />
                          )}
                        </Flex>
                        {n.body && (
                          <Text
                            fontSize="12px"
                            color="#64748b"
                            lineHeight={1.6}
                            noOfLines={3}
                            mb={2}
                          >
                            {n.body}
                          </Text>
                        )}
                        <Flex align="center" gap={2} flexWrap="wrap">
                          <Text fontSize="10px" color="#94a3b8">
                            {new Date(n.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </Text>
                          {isTestReady && (
                            <Flex
                              align="center"
                              gap={1}
                              bg="#eff6ff"
                              color="#2563eb"
                              px={2}
                              py="2px"
                              borderRadius="full"
                              fontSize="10px"
                              fontWeight={700}
                            >
                              <Icon as={FaEye} fontSize="9px" />
                              View test
                            </Flex>
                          )}
                        </Flex>
                      </Box>
                    </Flex>
                  );
                })}
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Test detail modal */}
      <TestDetailModal
        isOpen={testOpen}
        onClose={closeTest}
        test={selectedTest}
        requestTitle={selectedRequestTitle}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// REQUEST TEST DRAWER
// ═══════════════════════════════════════════════════════════════════
export function RequestTestDrawer({
  isOpen,
  onClose,
  coachingId,
  coachingExamTypes = [],
  onSubmitted,
}) {
  const toast = useToast();
  const fileRef = useRef();
  const [busy, setBusy] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [errs, setErrs] = useState({});

  const [form, setForm] = useState({
    title: "",
    examType: coachingExamTypes[0] || "",
    subject: "",
    totalQuestions: 20,
    timeLimitMin: 30,
    difficulty: "mixed",
    visibility: "public",
    instructions: "",
  });

  useEffect(() => {
    if (coachingExamTypes.length && !form.examType)
      setForm((p) => ({ ...p, examType: coachingExamTypes[0] }));
  }, [coachingExamTypes]);

  const sf = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrs((p) => ({ ...p, [k]: "" }));
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const newAttachments = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: `${file.name} too large (max 10MB)`,
          status: "warning",
          duration: 3000,
        });
        continue;
      }
      const fileType = file.type.includes("pdf")
        ? "pdf"
        : file.type.includes("image")
          ? "image"
          : file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
            ? "excel"
            : "other";
      const fileData = await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = (ev) => resolve(ev.target.result.split(",")[1]);
        r.readAsDataURL(file);
      });
      newAttachments.push({
        fileName: file.name,
        fileType,
        fileData,
        size: file.size,
      });
    }
    setAttachments((prev) => [...prev, ...newAttachments]);
    setUploading(false);
    e.target.value = "";
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Test title is required";
    if (!form.examType) e.examType = "Select exam type";
    if (form.totalQuestions < 5 || form.totalQuestions > 200)
      e.totalQuestions = "Must be 5–200";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrs(e);
      return;
    }
    setBusy(true);
    try {
      const res = await apiFetch("/test-requests/create", {
        method: "POST",
        body: JSON.stringify({
          coachingId,
          ...form,
          totalQuestions: Number(form.totalQuestions),
          timeLimitMin: Number(form.timeLimitMin),
          attachments,
        }),
      });
      toast({
        title: "Test request submitted!",
        description: "We'll notify you when it's ready.",
        status: "success",
        duration: 5000,
      });
      onSubmitted?.(res.data);
      onClose();
      setForm({
        title: "",
        examType: coachingExamTypes[0] || "",
        subject: "",
        totalQuestions: 20,
        timeLimitMin: 30,
        difficulty: "mixed",
        visibility: "public",
        instructions: "",
      });
      setAttachments([]);
    } catch (err) {
      toast({ title: err.message, status: "error", duration: 4000 });
    } finally {
      setBusy(false);
    }
  };

  const LabelStyle = {
    fontSize: "12px",
    fontWeight: 700,
    color: "#374151",
    mb: 1,
    textTransform: "uppercase",
    letterSpacing: ".8px",
  };
  const InputStyle = {
    borderRadius: "10px",
    h: "44px",
    fontSize: "14px",
    borderColor: "#e2e8f0",
    _focus: { borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" },
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="lg">
      <DrawerOverlay backdropFilter="blur(4px)" bg="rgba(0,0,0,.45)" />
      <DrawerContent
        borderLeftRadius="20px"
        overflow="hidden"
        fontFamily="'Sora',sans-serif"
      >
        <DrawerCloseButton top={4} right={4} zIndex={10} color="white" />
        <DrawerHeader
          px={7}
          pt={7}
          pb={5}
          bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)"
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
              <Icon as={FaClipboardList} fontSize="18px" />
            </Flex>
            <Box>
              <Text fontSize="18px" fontWeight={800} lineHeight="1.2">
                Request a Test
              </Text>
              <Text fontSize="12px" color="rgba(255,255,255,.6)" mt="2px">
                Our team will create it and notify you
              </Text>
            </Box>
          </Flex>
        </DrawerHeader>
        <DrawerBody px={7} py={6} overflowY="auto">
          <Stack spacing={5}>
            <Box
              bg="#eff6ff"
              border="1px solid #bfdbfe"
              borderRadius="12px"
              p={4}
            >
              <Flex gap={2} align="flex-start">
                <Icon
                  as={FaInfoCircle}
                  color="#2563eb"
                  mt="2px"
                  flexShrink={0}
                />
                <Text fontSize="12px" color="#1e40af" lineHeight={1.7}>
                  Upload your study material (PDF, images, Excel) and tell us
                  what you need. You'll get a <strong>notification</strong> with
                  the full test once it's ready.
                </Text>
              </Flex>
            </Box>

            <Text
              fontSize="11px"
              fontWeight={800}
              color="#94a3b8"
              textTransform="uppercase"
              letterSpacing="2px"
            >
              Test Details
            </Text>

            <FormControl isRequired isInvalid={!!errs.title}>
              <FormLabel {...LabelStyle}>Test Title</FormLabel>
              <Input
                value={form.title}
                onChange={sf("title")}
                placeholder="e.g. SSC CGL Quantitative Mock 1"
                {...InputStyle}
                borderColor={errs.title ? "red.400" : "#e2e8f0"}
              />
              <FormErrorMessage>{errs.title}</FormErrorMessage>
            </FormControl>

            <Flex gap={3} direction={{ base: "column", sm: "row" }}>
              <FormControl flex={1} isRequired isInvalid={!!errs.examType}>
                <FormLabel {...LabelStyle}>Exam Type</FormLabel>
                <Select
                  value={form.examType}
                  onChange={sf("examType")}
                  borderRadius="10px"
                  h="44px"
                  fontSize="14px"
                  borderColor={errs.examType ? "red.400" : "#e2e8f0"}
                >
                  <option value="">Select…</option>
                  {coachingExamTypes.length > 0 && (
                    <optgroup label="Your Coaching">
                      {coachingExamTypes.map((e) => (
                        <option key={e} value={e}>
                          {e}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Other">
                    {EXAM_TYPES.filter(
                      (e) => !coachingExamTypes.includes(e),
                    ).map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </optgroup>
                </Select>
                <FormErrorMessage>{errs.examType}</FormErrorMessage>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel {...LabelStyle}>Subject</FormLabel>
                <Select
                  value={form.subject}
                  onChange={sf("subject")}
                  borderRadius="10px"
                  h="44px"
                  fontSize="14px"
                  borderColor="#e2e8f0"
                >
                  <option value="">Any / Mixed</option>
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>

            <Flex gap={3} direction={{ base: "column", sm: "row" }}>
              <FormControl flex={1} isInvalid={!!errs.totalQuestions}>
                <FormLabel {...LabelStyle}>No. of Questions</FormLabel>
                <Input
                  type="number"
                  value={form.totalQuestions}
                  onChange={sf("totalQuestions")}
                  min={5}
                  max={200}
                  {...InputStyle}
                  borderColor={errs.totalQuestions ? "red.400" : "#e2e8f0"}
                />
                <FormErrorMessage>{errs.totalQuestions}</FormErrorMessage>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel {...LabelStyle}>Time Limit (min)</FormLabel>
                <Input
                  type="number"
                  value={form.timeLimitMin}
                  onChange={sf("timeLimitMin")}
                  min={5}
                  max={180}
                  {...InputStyle}
                />
              </FormControl>
            </Flex>

            <Flex gap={3} direction={{ base: "column", sm: "row" }}>
              <FormControl flex={1}>
                <FormLabel {...LabelStyle}>Difficulty</FormLabel>
                <Select
                  value={form.difficulty}
                  onChange={sf("difficulty")}
                  borderRadius="10px"
                  h="44px"
                  fontSize="14px"
                  borderColor="#e2e8f0"
                >
                  {DIFFICULTIES.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel {...LabelStyle}>Access</FormLabel>
                <Select
                  value={form.visibility}
                  onChange={sf("visibility")}
                  borderRadius="10px"
                  h="44px"
                  fontSize="14px"
                  borderColor="#e2e8f0"
                >
                  <option value="public">🌐 Public</option>
                  <option value="private">🔒 Private</option>
                </Select>
              </FormControl>
            </Flex>

            <FormControl>
              <FormLabel {...LabelStyle}>
                Instructions for Admin{" "}
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
                placeholder="Topics to cover, which pages to use, style of questions…"
                borderRadius="10px"
                fontSize="14px"
                rows={3}
                resize="vertical"
                borderColor="#e2e8f0"
                _focus={{
                  borderColor: "#4a72b8",
                  boxShadow: "0 0 0 1px #4a72b8",
                }}
              />
            </FormControl>

            <Divider />

            <Box>
              <Flex justify="space-between" align="center" mb={3}>
                <Text
                  fontSize="11px"
                  fontWeight={800}
                  color="#94a3b8"
                  textTransform="uppercase"
                  letterSpacing="2px"
                >
                  Study Material
                </Text>
                <Text fontSize="11px" color="#94a3b8">
                  PDF, Images, Excel • max 10MB
                </Text>
              </Flex>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />
              <Box
                border="2px dashed"
                borderColor={attachments.length ? "#4a72b8" : "#e2e8f0"}
                borderRadius="14px"
                p={6}
                textAlign="center"
                cursor="pointer"
                bg={attachments.length ? "#f0f7ff" : "#f8fafc"}
                onClick={() => fileRef.current?.click()}
                transition="all .2s"
                _hover={{ borderColor: "#4a72b8", bg: "#f0f7ff" }}
              >
                {uploading ? (
                  <Spinner color="#4a72b8" />
                ) : (
                  <>
                    <Icon
                      as={FaUpload}
                      fontSize="28px"
                      color="#94a3b8"
                      display="block"
                      mx="auto"
                      mb={2}
                    />
                    <Text fontSize="14px" fontWeight={600} color="#374151">
                      Click to upload files
                    </Text>
                    <Text fontSize="12px" color="#94a3b8" mt={1}>
                      PDF chapters, question screenshots, Excel sheets
                    </Text>
                  </>
                )}
              </Box>
              {attachments.length > 0 && (
                <Stack mt={3} spacing={2}>
                  {attachments.map((f, i) => (
                    <Flex
                      key={i}
                      align="center"
                      gap={3}
                      p={3}
                      bg="white"
                      borderRadius="10px"
                      border="1px solid #e2e8f0"
                    >
                      <FileIcon type={f.fileType} />
                      <Box flex={1} minW={0}>
                        <Text
                          fontSize="13px"
                          fontWeight={600}
                          color="#0f172a"
                          noOfLines={1}
                        >
                          {f.fileName}
                        </Text>
                        <Text fontSize="11px" color="#94a3b8">
                          {f.fileType.toUpperCase()} •{" "}
                          {(f.size / 1024).toFixed(0)} KB
                        </Text>
                      </Box>
                      <Box
                        as="button"
                        onClick={() =>
                          setAttachments((prev) =>
                            prev.filter((_, j) => j !== i),
                          )
                        }
                        p={2}
                        borderRadius="6px"
                        color="#ef4444"
                        _hover={{ bg: "#fef2f2" }}
                      >
                        <Icon as={FaTrash} fontSize="11px" />
                      </Box>
                    </Flex>
                  ))}
                </Stack>
              )}
            </Box>

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
              onClick={handleSubmit}
              leftIcon={<FaPlus />}
              _hover={{
                opacity: 0.9,
                transform: "translateY(-1px)",
                boxShadow: "0 8px 24px rgba(74,114,184,.35)",
              }}
              transition="all .2s"
            >
              Submit Test Request
            </Button>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MY TEST REQUESTS — coaching dashboard panel with full test preview
// ═══════════════════════════════════════════════════════════════════
export function MyTestRequests({ coachingId, coachingExamTypes }) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const {
    isOpen: testOpen,
    onOpen: openTest,
    onClose: closeTest,
  } = useDisclosure();
  const {
    isOpen: detailOpen,
    onOpen: openDetail,
    onClose: closeDetail,
  } = useDisclosure();
  const [selectedReq, setSelectedReq] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    apiFetch("/test-requests/mine")
      .then((r) => setRequests(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Real-time: when admin sends the test
  useEffect(() => {
    const handleTestCreated = ({ testRequestId, test }) => {
      setRequests((prev) =>
        prev.map((r) =>
          r._id?.toString() === testRequestId?.toString()
            ? { ...r, status: "completed", createdTestId: test }
            : r,
        ),
      );
    };
    socket.on("test:created", handleTestCreated);
    return () => socket.off("test:created", handleTestCreated);
  }, []);

  const openTestDetail = (req) => {
    if (req.createdTestId) {
      setSelectedTest(req.createdTestId);
      setSelectedTitle(req.title);
      openTest();
    }
  };

  const copyLink = (test) => {
    const url = `${window.location.origin}/tests/${test.slug || test._id}`;
    navigator.clipboard
      .writeText(url)
      .then(() =>
        toast({ title: "Link copied!", status: "success", duration: 2000 }),
      );
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={5}>
        <Box>
          <Text
            fontSize="11px"
            fontWeight={800}
            color="#94a3b8"
            textTransform="uppercase"
            letterSpacing="2px"
          >
            Test Requests
          </Text>
          <Text fontSize="13px" color="#64748b" mt={1}>
            Request admin to create tests • Get notified when ready
          </Text>
        </Box>
        <Flex gap={2}>
          <Button
            size="sm"
            variant="ghost"
            onClick={load}
            leftIcon={<FaRedo />}
            borderRadius="9px"
            fontSize="12px"
            color="#64748b"
          >
            Refresh
          </Button>
          <Button
            size="sm"
            leftIcon={<FaPlus />}
            onClick={onOpen}
            bg="#4a72b8"
            color="white"
            borderRadius="9px"
            fontWeight={700}
            fontSize="12px"
            _hover={{ bg: "#3b5fa0" }}
          >
            New Request
          </Button>
        </Flex>
      </Flex>

      {loading ? (
        <Flex justify="center" py={10}>
          <Spinner color="#4a72b8" />
        </Flex>
      ) : requests.length === 0 ? (
        <Box
          py={12}
          textAlign="center"
          bg="white"
          borderRadius="14px"
          border="1px solid #e2e8f0"
        >
          <Icon
            as={FaClipboardList}
            fontSize="40px"
            color="#e2e8f0"
            display="block"
            mx="auto"
            mb={3}
          />
          <Text fontSize="14px" fontWeight={700} color="#94a3b8" mb={4}>
            No test requests yet
          </Text>
          <Button
            onClick={onOpen}
            leftIcon={<FaPlus />}
            bg="#4a72b8"
            color="white"
            borderRadius="10px"
            fontWeight={700}
            fontSize="13px"
            _hover={{ bg: "#3b5fa0" }}
            size="sm"
          >
            Request Your First Test
          </Button>
        </Box>
      ) : (
        <Stack spacing={3}>
          {requests.map((r) => {
            const isReady = r.status === "completed" && r.createdTestId;
            return (
              <Box
                key={r._id}
                bg="white"
                borderRadius="14px"
                border="1.5px solid"
                borderColor={isReady ? "#16a34a" : "#e2e8f0"}
                overflow="hidden"
                transition="all .2s"
                boxShadow={isReady ? "0 4px 20px rgba(22,163,74,.1)" : "none"}
              >
                {/* Ready banner */}
                {isReady && (
                  <Box
                    bg="linear-gradient(135deg,#dcfce7,#bbf7d0)"
                    px={5}
                    py={2}
                    borderBottom="1px solid #86efac"
                  >
                    <Flex align="center" gap={2}>
                      <Icon
                        as={FaCheckCircle}
                        color="#15803d"
                        fontSize="12px"
                      />
                      <Text fontSize="12px" fontWeight={800} color="#15803d">
                        Test ready! Click below to view questions and share link
                      </Text>
                    </Flex>
                  </Box>
                )}

                <Flex
                  px={5}
                  py={4}
                  align="center"
                  gap={4}
                  flexWrap={{ base: "wrap", md: "nowrap" }}
                >
                  <Box flex={3} minW={0}>
                    <Text
                      fontSize="14px"
                      fontWeight={700}
                      color="#0f172a"
                      noOfLines={1}
                    >
                      {r.title}
                    </Text>
                    <Flex gap={2} mt={1} flexWrap="wrap">
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
                    </Flex>
                    <Text fontSize="11px" color="#94a3b8" mt={1}>
                      {r.totalQuestions} questions • {r.timeLimitMin}min •{" "}
                      {new Date(r.createdAt).toLocaleDateString("en-IN")}
                    </Text>
                  </Box>

                  <Box flexShrink={0}>
                    <StatusBadge status={r.status} />
                  </Box>

                  <Flex gap={2} flexShrink={0} flexWrap="wrap">
                    {isReady ? (
                      <>
                        <Button
                          size="sm"
                          leftIcon={<FaEye />}
                          onClick={() => openTestDetail(r)}
                          bg="#1e3a5f"
                          color="white"
                          borderRadius="9px"
                          fontWeight={700}
                          fontSize="12px"
                          _hover={{ bg: "#162d4a" }}
                        >
                          View Test
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<FaLink />}
                          onClick={() => copyLink(r.createdTestId)}
                          bg="#dcfce7"
                          color="#15803d"
                          borderRadius="9px"
                          fontWeight={700}
                          fontSize="12px"
                          _hover={{ bg: "#bbf7d0" }}
                        >
                          Copy Link
                        </Button>
                      </>
                    ) : r.status === "rejected" ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedReq(r);
                          openDetail();
                        }}
                        bg="#fef2f2"
                        color="#dc2626"
                        borderRadius="9px"
                        fontWeight={700}
                        fontSize="12px"
                        _hover={{ bg: "#fee2e2" }}
                      >
                        See Reason
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedReq(r);
                          openDetail();
                        }}
                        bg="#f0f7ff"
                        color="#4a72b8"
                        borderRadius="9px"
                        fontWeight={700}
                        fontSize="12px"
                        _hover={{ bg: "#dbeafe" }}
                      >
                        Details
                      </Button>
                    )}
                  </Flex>
                </Flex>
              </Box>
            );
          })}
        </Stack>
      )}

      {/* Request form drawer */}
      <RequestTestDrawer
        isOpen={isOpen}
        onClose={onClose}
        coachingId={coachingId}
        coachingExamTypes={coachingExamTypes}
        onSubmitted={() => {
          onClose();
          load();
        }}
      />

      {/* Full test detail modal */}
      <TestDetailModal
        isOpen={testOpen}
        onClose={closeTest}
        test={selectedTest}
        requestTitle={selectedTitle}
      />

      {/* Simple request info modal for pending/processing/rejected */}
      <Modal isOpen={detailOpen} onClose={closeDetail} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" bg="rgba(0,0,0,.5)" />
        <ModalContent borderRadius="16px" fontFamily="'Sora',sans-serif" mx={4}>
          {selectedReq && (
            <>
              <ModalHeader
                px={6}
                pt={6}
                pb={4}
                fontSize="16px"
                fontWeight={800}
              >
                <Flex justify="space-between" align="center">
                  <Text noOfLines={1}>{selectedReq.title}</Text>
                  <ModalCloseButton position="static" />
                </Flex>
                <Flex mt={2}>
                  <StatusBadge status={selectedReq.status} />
                </Flex>
              </ModalHeader>
              <ModalBody px={6} pb={6}>
                <Stack spacing={3}>
                  {[
                    ["Exam Type", selectedReq.examType],
                    ["Subject", selectedReq.subject || "Mixed"],
                    ["Questions", selectedReq.totalQuestions],
                    ["Time Limit", `${selectedReq.timeLimitMin} minutes`],
                    ["Difficulty", selectedReq.difficulty],
                    ["Access", selectedReq.visibility],
                    [
                      "Submitted",
                      new Date(selectedReq.createdAt).toLocaleDateString(
                        "en-IN",
                        { day: "2-digit", month: "long", year: "numeric" },
                      ),
                    ],
                  ].map(([label, val]) => (
                    <Flex
                      key={label}
                      justify="space-between"
                      py={2}
                      borderBottom="1px solid #f1f5f9"
                    >
                      <Text fontSize="13px" color="#94a3b8" fontWeight={600}>
                        {label}
                      </Text>
                      <Text
                        fontSize="13px"
                        color="#0f172a"
                        fontWeight={700}
                        textTransform="capitalize"
                      >
                        {val}
                      </Text>
                    </Flex>
                  ))}
                  {selectedReq.instructions && (
                    <Box
                      bg="#f8fafc"
                      borderRadius="10px"
                      p={3}
                      border="1px solid #e2e8f0"
                    >
                      <Text
                        fontSize="11px"
                        fontWeight={700}
                        color="#94a3b8"
                        textTransform="uppercase"
                        letterSpacing=".6px"
                        mb={1}
                      >
                        Your Instructions
                      </Text>
                      <Text fontSize="13px" color="#374151" lineHeight={1.7}>
                        {selectedReq.instructions}
                      </Text>
                    </Box>
                  )}
                  {selectedReq.status === "rejected" &&
                    selectedReq.adminNote && (
                      <Box
                        bg="#fef2f2"
                        border="1px solid #fecaca"
                        borderRadius="10px"
                        p={3}
                      >
                        <Text
                          fontSize="11px"
                          fontWeight={700}
                          color="#dc2626"
                          textTransform="uppercase"
                          letterSpacing=".6px"
                          mb={1}
                        >
                          Rejection Reason
                        </Text>
                        <Text fontSize="13px" color="#7f1d1d" lineHeight={1.7}>
                          {selectedReq.adminNote}
                        </Text>
                      </Box>
                    )}
                  {selectedReq.status === "processing" && (
                    <Box
                      bg="#eff6ff"
                      border="1px solid #bfdbfe"
                      borderRadius="10px"
                      p={3}
                    >
                      <Text fontSize="13px" color="#1e40af" lineHeight={1.7}>
                        ⏳ Our team is currently working on your test. You'll be
                        notified when it's ready!
                      </Text>
                    </Box>
                  )}
                  {selectedReq.status === "pending" && (
                    <Box
                      bg="#fffbeb"
                      border="1px solid #fde68a"
                      borderRadius="10px"
                      p={3}
                    >
                      <Text fontSize="13px" color="#92400e" lineHeight={1.7}>
                        📋 Your request is in the queue. Admin will start
                        working on it soon.
                      </Text>
                    </Box>
                  )}
                </Stack>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Box>
  );
}
