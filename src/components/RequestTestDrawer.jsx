// ═══════════════════════════════════════════════════════════════
// RequestTestDrawer.jsx
// ═══════════════════════════════════════════════════════════════

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
  Badge,
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
} from "@chakra-ui/react";
import {
  FaPlus,
  FaTrash,
  FaUpload,
  FaFilePdf,
  FaFileImage,
  FaFileExcel,
  FaFileAlt,
  FaClipboardList,
  FaEye,
  FaLink,
  FaWhatsapp,
  FaExternalLinkAlt,
  FaCheck,
  FaChevronDown,
  FaChevronUp,
  FaPaperPlane,
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaRedo,
} from "react-icons/fa";
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
  "science",
  "history",
  "geography",
  "polity",
  "economics",
  "mathtwo",
];
const OPTION_LABELS = ["A", "B", "C", "D"];

const STATUS_STYLE = {
  pending: {
    bg: "#fffbeb",
    color: "#d97706",
    label: "⏳ Pending",
    border: "#fde68a",
  },
  processing: {
    bg: "#eff6ff",
    color: "#2563eb",
    label: "🔄 Processing",
    border: "#bfdbfe",
  },
  completed: {
    bg: "#f0fdf4",
    color: "#16a34a",
    label: "✅ Completed",
    border: "#bbf7d0",
  },
  rejected: {
    bg: "#fef2f2",
    color: "#dc2626",
    label: "❌ Rejected",
    border: "#fecaca",
  },
};

// ── File helpers ──────────────────────────────────────────────────────────────
const detectFileType = (file) => {
  if (file.type.includes("pdf")) return "pdf";
  if (file.type.includes("image")) return "image";
  if (file.name.match(/\.xlsx?$/i)) return "excel";
  return "other";
};
const toBase64 = (file) =>
  new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = (e) => res(e.target.result.split(",")[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
const FILE_ICONS = { pdf: FaFilePdf, image: FaFileImage, excel: FaFileExcel };
const FILE_COLORS = { pdf: "#ef4444", image: "#8b5cf6", excel: "#16a34a" };
const FileIcon = ({ type }) => {
  const Ic = FILE_ICONS[type] || FaFileAlt;
  return (
    <Icon as={Ic} color={FILE_COLORS[type] || "#64748b"} fontSize="18px" />
  );
};

// ═══════════════════════════════════════════════════════════════
// TEST DETAIL MODAL
// ═══════════════════════════════════════════════════════════════
function TestDetailModal({ test, isOpen, onClose }) {
  const toast = useToast();
  const [expanded, setExpanded] = useState({});
  if (!test) return null;

  // const shareUrl = test.accessToken
  //   ? `${window.location.origin}/tests/token/${test.accessToken}`
  //   : `${window.location.origin}/tests/${test.slug || test._id}`;

  const shareUrl =  `${window.location.origin}/tests/${test.slug || test._id}`;

  const copy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({ title: "Link copied!", status: "success", duration: 2000 });
  };
  const whatsapp = () =>
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`📝 ${test.title}\n${shareUrl}`)}`,
      "_blank",
    );
  const toggleQ = (i) => setExpanded((p) => ({ ...p, [i]: !p[i] }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" bg="rgba(0,0,0,.5)" />
      <ModalContent
        mx={4}
        borderRadius="20px"
        overflow="hidden"
        fontFamily="'Sora',sans-serif"
      >
        <ModalCloseButton top={4} right={4} zIndex={10} color="white" />
        <ModalHeader
          px={7}
          pt={7}
          pb={5}
          bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)"
          color="white"
        >
          <Text fontSize="18px" fontWeight={800} lineHeight="1.2" mb={1}>
            {test.title}
          </Text>
          <Flex gap={4} mt={2} flexWrap="wrap">
            {[
              ["📋", test.examType],
              ["⏱", `${test.timeLimitMin || 30} min`],
              [
                "❓",
                `${test.questions?.length || test.totalMarks || 0} questions`,
              ],
              ["🔐", test.visibility === "private" ? "Private" : "Public"],
            ].map(
              ([icon, val]) =>
                val && (
                  <Text
                    key={val}
                    fontSize="12px"
                    color="rgba(255,255,255,.7)"
                    fontWeight={600}
                  >
                    {icon} {val}
                  </Text>
                ),
            )}
          </Flex>
        </ModalHeader>

        <ModalBody px={7} py={6}>
          <Stack spacing={5}>
            {/* Share */}
            <Box
              bg="#f8fafc"
              borderRadius="14px"
              border="1px solid #e2e8f0"
              p={5}
            >
              <Text
                fontSize="11px"
                fontWeight={800}
                color="#94a3b8"
                textTransform="uppercase"
                letterSpacing="2px"
                mb={3}
              >
                Share with Students
              </Text>
              <Box
                bg="white"
                borderRadius="10px"
                border="1px solid #e2e8f0"
                px={4}
                py="12px"
                fontFamily="monospace"
                fontSize="12px"
                color="#374151"
                mb={3}
                wordBreak="break-all"
              >
                {shareUrl}
              </Box>
              <Flex gap={2} flexWrap="wrap">
                <Button
                  size="sm"
                  leftIcon={<FaLink />}
                  onClick={copy}
                  bg="#4a72b8"
                  color="white"
                  borderRadius="8px"
                  fontWeight={700}
                >
                  Copy Link
                </Button>
                <Button
                  size="sm"
                  leftIcon={<FaWhatsapp />}
                  onClick={whatsapp}
                  bg="#16a34a"
                  color="white"
                  borderRadius="8px"
                  fontWeight={700}
                >
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  leftIcon={<FaExternalLinkAlt />}
                  onClick={() => window.open(shareUrl, "_blank")}
                  variant="outline"
                  borderRadius="8px"
                  fontWeight={700}
                  borderColor="#e2e8f0"
                >
                  Open Test
                </Button>
              </Flex>
            </Box>

            {/* Questions */}
            {test.questions?.length > 0 && (
              <Box>
                <Text
                  fontSize="11px"
                  fontWeight={800}
                  color="#94a3b8"
                  textTransform="uppercase"
                  letterSpacing="2px"
                  mb={3}
                >
                  Questions ({test.questions.length})
                </Text>
                <Stack spacing={3}>
                  {test.questions.map((q, i) => (
                    <Box
                      key={i}
                      bg="#f8fafc"
                      borderRadius="12px"
                      border="1px solid #e2e8f0"
                      overflow="hidden"
                    >
                      <Flex
                        px={4}
                        py={3}
                        align="center"
                        gap={3}
                        cursor="pointer"
                        onClick={() => toggleQ(i)}
                        _hover={{ bg: "#f0f7ff" }}
                        transition="background .15s"
                      >
                        <Flex
                          w="24px"
                          h="24px"
                          flexShrink={0}
                          bg="#e2e8f0"
                          borderRadius="6px"
                          align="center"
                          justify="center"
                          fontSize="11px"
                          fontWeight={800}
                          color="#64748b"
                        >
                          {i + 1}
                        </Flex>
                        <Text
                          flex={1}
                          fontSize="13px"
                          fontWeight={600}
                          color="#0f172a"
                          noOfLines={expanded[i] ? undefined : 2}
                        >
                          {q.qus}
                        </Text>
                        <Icon
                          as={expanded[i] ? FaChevronUp : FaChevronDown}
                          fontSize="11px"
                          color="#94a3b8"
                          flexShrink={0}
                        />
                      </Flex>
                      {expanded[i] && (
                        <Box px={4} pb={4}>
                          <Stack spacing={2} mt={2}>
                            {q.options?.map((opt, oi) => (
                              <Flex
                                key={oi}
                                align="center"
                                gap={3}
                                bg={q.answer === oi ? "#f0fdf4" : "white"}
                                border="1px solid"
                                borderColor={
                                  q.answer === oi ? "#16a34a" : "#e2e8f0"
                                }
                                borderRadius="8px"
                                px={3}
                                py="8px"
                              >
                                <Flex
                                  w="20px"
                                  h="20px"
                                  flexShrink={0}
                                  bg={q.answer === oi ? "#dcfce7" : "#f1f5f9"}
                                  borderRadius="5px"
                                  align="center"
                                  justify="center"
                                  fontSize="10px"
                                  fontWeight={800}
                                  color={
                                    q.answer === oi ? "#15803d" : "#64748b"
                                  }
                                >
                                  {OPTION_LABELS[oi]}
                                </Flex>
                                <Text
                                  fontSize="13px"
                                  flex={1}
                                  color={
                                    q.answer === oi ? "#15803d" : "#374151"
                                  }
                                  fontWeight={q.answer === oi ? 700 : 400}
                                >
                                  {opt}
                                </Text>
                                {q.answer === oi && (
                                  <Icon
                                    as={FaCheck}
                                    fontSize="11px"
                                    color="#16a34a"
                                  />
                                )}
                              </Flex>
                            ))}
                          </Stack>
                          {q.explanation && (
                            <Box
                              mt={3}
                              bg="#fffbeb"
                              border="1px solid #fde68a"
                              borderRadius="8px"
                              px={3}
                              py="8px"
                            >
                              <Text
                                fontSize="11px"
                                fontWeight={800}
                                color="#d97706"
                                mb={1}
                              >
                                EXPLANATION
                              </Text>
                              <Text
                                fontSize="12px"
                                color="#92400e"
                                lineHeight={1.7}
                              >
                                {q.explanation}
                              </Text>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// ═══════════════════════════════════════════════════════════════
// NAMED EXPORT — MyTestRequests panel
// ═══════════════════════════════════════════════════════════════
export function MyTestRequests({ coachingId, onRequestTest }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selTest, setSelTest] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const load = useCallback(() => {
    apiFetch("/test-requests/mine")
      .then((r) => setRequests(r.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Live socket — when admin sends a test
  useEffect(() => {
    if (!coachingId) return;
    const room = `coaching:${coachingId}`;
    socket.emit("join-coaching", room);
    const handler = (data) => {
      load();
      toast({
        title: "🎉 Your test is ready!",
        description:
          data?.testTitle || "Admin has completed your test request.",
        status: "success",
        duration: 6000,
        isClosable: true,
      });
    };
    socket.on("test:created", handler);
    return () => {
      socket.off("test:created", handler);
      socket.emit("leave-coaching", room);
    };
  }, [coachingId, load]);

  const openTest = (req) => {
    setSelTest(req.createdTestId);
    onOpen();
  };

  if (loading)
    return (
      <Flex justify="center" py={10}>
        <Spinner color="#4a72b8" thickness="3px" />
      </Flex>
    );

  return (
    <Box fontFamily="'Sora',sans-serif">
      <Flex justify="space-between" align="center" mb={5}>
        <Text
          fontSize="11px"
          fontWeight={800}
          color="#94a3b8"
          textTransform="uppercase"
          letterSpacing="2px"
        >
          My Test Requests
        </Text>
        <Button
          size="sm"
          leftIcon={<FaPlus />}
          onClick={onRequestTest}
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

      {requests.length === 0 ? (
        <Box
          py={14}
          textAlign="center"
          bg="white"
          borderRadius="14px"
          border="1px solid #e2e8f0"
        >
          <Icon
            as={FaClipboardList}
            fontSize="42px"
            color="#e2e8f0"
            display="block"
            mx="auto"
            mb={3}
          />
          <Text fontSize="14px" fontWeight={700} color="#94a3b8" mb={2}>
            No requests yet
          </Text>
          <Text fontSize="13px" color="#94a3b8" mb={5} maxW="320px" mx="auto">
            Submit a request with your reference material — admin will build the
            test and send it back.
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
            Submit Test Request
          </Button>
        </Box>
      ) : (
        <Box
          bg="white"
          borderRadius="16px"
          border="1px solid #e2e8f0"
          overflow="hidden"
        >
          {/* Header row */}
          <Flex px={6} py={3} bg="#f8fafc" borderBottom="1px solid #e2e8f0">
            {[
              ["Request Title", 3],
              ["Exam", 1],
              ["Questions", 1],
              ["Status", 1.5],
            ].map(([h, f]) => (
              <Text
                key={h}
                flex={f}
                fontSize="11px"
                fontWeight={700}
                color="#94a3b8"
                textTransform="uppercase"
                letterSpacing=".8px"
                display={{ base: f > 1 ? "none" : "block", md: "block" }}
              >
                {h}
              </Text>
            ))}
            <Box w="110px" />
          </Flex>

          {requests.map((req, idx) => {
            const s = STATUS_STYLE[req.status] || STATUS_STYLE.pending;
            return (
              <Flex
                key={req._id}
                px={6}
                py={4}
                align="center"
                borderBottom={
                  idx < requests.length - 1 ? "1px solid #f1f5f9" : "none"
                }
                transition="background .15s"
                _hover={{ bg: "#f8faff" }}
              >
                <Box flex={3} minW={0}>
                  <Text
                    fontSize="14px"
                    fontWeight={700}
                    color="#0f172a"
                    noOfLines={1}
                  >
                    {req.title}
                  </Text>
                  <Text fontSize="11px" color="#94a3b8" mt="1px">
                    {new Date(req.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {req.attachments?.length > 0 &&
                      ` · ${req.attachments.length} file${req.attachments.length !== 1 ? "s" : ""} attached`}
                  </Text>
                  {req.status === "rejected" && req.adminNote && (
                    <Text fontSize="11px" color="#dc2626" mt={1} noOfLines={1}>
                      ⚠ {req.adminNote}
                    </Text>
                  )}
                </Box>

                <Text
                  flex={1}
                  fontSize="13px"
                  fontWeight={600}
                  color="#374151"
                  display={{ base: "none", md: "block" }}
                >
                  {req.examType || "—"}
                </Text>

                <Text
                  flex={1}
                  fontSize="13px"
                  fontWeight={600}
                  color="#374151"
                  display={{ base: "none", md: "block" }}
                >
                  {req.totalQuestions}
                </Text>

                <Box flex={1.5}>
                  <Box
                    display="inline-flex"
                    alignItems="center"
                    bg={s.bg}
                    color={s.color}
                    border={`1px solid ${s.border}`}
                    px={3}
                    py="3px"
                    borderRadius="full"
                    fontSize="11px"
                    fontWeight={700}
                  >
                    {s.label}
                  </Box>
                </Box>

                <Flex w="110px" justify="flex-end" gap={2}>
                  {req.status === "completed" && req.createdTestId && (
                    <Button
                      size="xs"
                      leftIcon={<FaEye />}
                      onClick={() => openTest(req)}
                      bg="#4a72b8"
                      color="white"
                      borderRadius="7px"
                      fontWeight={700}
                      fontSize="11px"
                      _hover={{ bg: "#3b5fa0" }}
                    >
                      View Test
                    </Button>
                  )}
                  {req.status === "processing" && (
                    <Flex align="center" gap={1}>
                      <Spinner size="xs" color="#2563eb" />
                      <Text fontSize="10px" color="#2563eb" fontWeight={600}>
                        Working…
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </Box>
      )}

      <TestDetailModal test={selTest} isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}

// ═══════════════════════════════════════════════════════════════
// DEFAULT EXPORT — RequestTestDrawer (submission form)
// ═══════════════════════════════════════════════════════════════
export default function RequestTestDrawer({
  isOpen,
  onClose,
  coachingId,
  coachingExamTypes = [],
  currentUser,
}) {
  const toast = useToast();
  const fileRef = useRef();
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState([]);
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

  const handleFiles = async (e) => {
    const picked = Array.from(e.target.files);
    e.target.value = "";
    const MAX = 10 * 1024 * 1024;
    const result = [];
    for (const file of picked) {
      if (file.size > MAX) {
        toast({
          title: `${file.name} exceeds 10 MB — skipped`,
          status: "warning",
          duration: 3000,
        });
        continue;
      }
      const type = detectFileType(file);
      const base64 = await toBase64(file);
      result.push({
        name: file.name,
        type,
        base64,
        size: file.size,
        mimeType: file.type,
      });
    }
    setFiles((p) => [...p, ...result]);
  };

  const removeFile = (i) => setFiles((p) => p.filter((_, j) => j !== i));

  const handleSubmit = async () => {
    const e = {};
    if (!form.title.trim()) e.title = "Give this request a title";
    if (!form.examType) e.examType = "Select an exam type";
    if (Object.keys(e).length) {
      setErrs(e);
      return;
    }

    setBusy(true);
    try {
      await apiFetch("/test-requests/create", {
        method: "POST",
        body: JSON.stringify({
          coachingId,
          requestedBy: currentUser._id,
          title: form.title.trim(),
          examType: form.examType,
          subject: form.subject || undefined,
          totalQuestions: Number(form.totalQuestions) || 20,
          timeLimitMin: Number(form.timeLimitMin) || 30,
          difficulty: form.difficulty,
          visibility: form.visibility,
          instructions: form.instructions.trim() || undefined,
          attachments: files.map((f) => ({
            fileName: f.name,
            fileType: f.type,
            fileData: f.base64,
          })),
        }),
      });
      toast({
        title: "Request sent to admin!",
        description: "You'll be notified when your test is ready.",
        status: "success",
        duration: 5000,
      });
      resetState();
      onClose();
    } catch (err) {
      toast({ title: err.message, status: "error", duration: 4000 });
    } finally {
      setBusy(false);
    }
  };

  const resetState = () => {
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
    setFiles([]);
    setErrs({});
  };

  const handleClose = () => {
    resetState();
    onClose();
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
    <Drawer isOpen={isOpen} onClose={handleClose} placement="right" size="lg">
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
              <Icon as={FaPaperPlane} fontSize="18px" />
            </Flex>
            <Box>
              <Text fontSize="18px" fontWeight={800} lineHeight="1.2">
                Request a Test
              </Text>
              <Text fontSize="12px" color="rgba(255,255,255,.6)" mt="2px">
                Upload your content · Admin will build the test for you
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
              <Text fontSize="12px" color="#1e40af" lineHeight={1.8}>
                📎 <strong>How it works:</strong> Fill in the details and attach
                any reference material (PDFs, screenshots, notes, Excel files).
                Admin will review them, create the test, and send it directly to
                your coaching.
              </Text>
            </Box>

            <FormControl isRequired isInvalid={!!errs.title}>
              <FormLabel {...LS}>Request Title</FormLabel>
              <Input
                value={form.title}
                onChange={sf("title")}
                placeholder="e.g. SSC CGL Mock — Reasoning + GA"
                {...IS}
                borderColor={errs.title ? "red.400" : "#e2e8f0"}
              />
              <FormErrorMessage>{errs.title}</FormErrorMessage>
            </FormControl>

            <Flex gap={3} direction={{ base: "column", sm: "row" }}>
              <FormControl flex={1} isRequired isInvalid={!!errs.examType}>
                <FormLabel {...LS}>Exam Type</FormLabel>
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
                      {coachingExamTypes.map((et) => (
                        <option key={et} value={et}>
                          {et}
                        </option>
                      ))}
                    </optgroup>
                  )}
                  <optgroup label="Others">
                    {EXAM_TYPES.filter(
                      (et) => !coachingExamTypes.includes(et),
                    ).map((et) => (
                      <option key={et} value={et}>
                        {et}
                      </option>
                    ))}
                  </optgroup>
                </Select>
                <FormErrorMessage>{errs.examType}</FormErrorMessage>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel {...LS}>Subject</FormLabel>
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
              <FormControl flex={1}>
                <FormLabel {...LS}>No. of Questions</FormLabel>
                <Input
                  type="number"
                  value={form.totalQuestions}
                  onChange={sf("totalQuestions")}
                  min={5}
                  max={200}
                  {...IS}
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel {...LS}>Time Limit (min)</FormLabel>
                <Input
                  type="number"
                  value={form.timeLimitMin}
                  onChange={sf("timeLimitMin")}
                  min={5}
                  max={180}
                  {...IS}
                />
              </FormControl>
            </Flex>

            <Flex gap={3} direction={{ base: "column", sm: "row" }}>
              <FormControl flex={1}>
                <FormLabel {...LS}>Difficulty</FormLabel>
                <Select
                  value={form.difficulty}
                  onChange={sf("difficulty")}
                  borderRadius="10px"
                  h="44px"
                  fontSize="14px"
                  borderColor="#e2e8f0"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                  <option value="mixed">Mixed</option>
                </Select>
              </FormControl>
              <FormControl flex={1}>
                <FormLabel {...LS}>Test Access</FormLabel>
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
              <FormLabel {...LS}>
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
                placeholder="Topics to cover, question style, syllabus focus, difficulty split…"
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

            {/* File upload */}
            <Box>
              <Flex justify="space-between" align="center" mb={1}>
                <Text {...LS} mb={0}>
                  Attach Reference Files
                </Text>
                <Text fontSize="11px" color="#94a3b8">
                  PDF · Images · Excel · max 10 MB
                </Text>
              </Flex>
              <Text fontSize="12px" color="#64748b" mb={3}>
                Upload chapter PDFs, question screenshots, handwritten notes or
                Excel sheets. Admin will use these to create your test.
              </Text>

              <input
                ref={fileRef}
                type="file"
                multiple
                accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg,.webp,.gif,.doc,.docx"
                style={{ display: "none" }}
                onChange={handleFiles}
              />

              <Box
                border="2px dashed"
                borderColor={files.length ? "#4a72b8" : "#e2e8f0"}
                borderRadius="14px"
                p={6}
                textAlign="center"
                cursor="pointer"
                bg={files.length ? "#f0f7ff" : "#f8fafc"}
                onClick={() => fileRef.current?.click()}
                transition="all .2s"
                _hover={{ borderColor: "#4a72b8", bg: "#f0f7ff" }}
              >
                <Icon
                  as={FaUpload}
                  fontSize="30px"
                  color="#94a3b8"
                  display="block"
                  mx="auto"
                  mb={2}
                />
                <Text fontSize="14px" fontWeight={600} color="#374151">
                  Click to attach files
                </Text>
                <Text fontSize="12px" color="#94a3b8" mt={1}>
                  PDFs · Images · Excel · Word docs
                </Text>
              </Box>

              {files.length > 0 && (
                <Stack mt={3} spacing={2}>
                  {files.map((f, i) => (
                    <Flex
                      key={i}
                      align="center"
                      gap={3}
                      bg="white"
                      borderRadius="10px"
                      border="1px solid #e2e8f0"
                      p={3}
                    >
                      <FileIcon type={f.type} />
                      <Box flex={1} minW={0}>
                        <Text
                          fontSize="12px"
                          fontWeight={600}
                          color="#0f172a"
                          noOfLines={1}
                        >
                          {f.name}
                        </Text>
                        <Text fontSize="10px" color="#94a3b8">
                          {f.type.toUpperCase()} · {(f.size / 1024).toFixed(0)}{" "}
                          KB
                        </Text>
                      </Box>
                      {f.type === "image" && (
                        <Box
                          w="48px"
                          h="36px"
                          borderRadius="6px"
                          overflow="hidden"
                          flexShrink={0}
                        >
                          <img
                            src={`data:${f.mimeType};base64,${f.base64}`}
                            alt={f.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                      )}
                      <Box
                        as="button"
                        onClick={() => removeFile(i)}
                        p={2}
                        borderRadius="6px"
                        color="#ef4444"
                        _hover={{ bg: "#fef2f2" }}
                      >
                        <Icon as={FaTrash} fontSize="11px" />
                      </Box>
                    </Flex>
                  ))}
                  <Button
                    size="xs"
                    leftIcon={<FaPlus />}
                    variant="ghost"
                    color="#4a72b8"
                    fontWeight={700}
                    alignSelf="flex-start"
                    onClick={() => fileRef.current?.click()}
                  >
                    Add More Files
                  </Button>
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
              leftIcon={<FaPaperPlane />}
              _hover={{
                opacity: 0.9,
                transform: "translateY(-1px)",
                boxShadow: "0 8px 24px rgba(74,114,184,.35)",
              }}
              transition="all .2s"
            >
              Submit Request to Admin
            </Button>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

// ═══════════════════════════════════════════════════════════════
// NAMED EXPORT — NotificationBell
// ═══════════════════════════════════════════════════════════════
export function NotificationBell() {
  const { user } = useAuth();
  const toast = useToast();
  const {
    isOpen: drawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();
  const {
    isOpen: testOpen,
    onOpen: openTest,
    onClose: closeTest,
  } = useDisclosure();

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selTest, setSelTest] = useState(null);

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await apiFetch("/notifications/mine");
      setNotifications(res.data ?? []);
      setUnread(res.unreadCount ?? 0);
    } catch (_) {
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Join user room + listen for live events
  useEffect(() => {
    if (!user?._id) return;
    loadNotifications();

    const room = `user:${user._id}`;
    socket.emit("join-user", room);

    const handleNew = ({ notification }) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnread((prev) => prev + 1);

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
      setSelTest(notif.testId);
      openTest();
    }
  };

  // Notification type → icon config
  const notifStyle = (type) => {
    switch (type) {
      case "test_ready":
        return { icon: FaCheckCircle, color: "#16a34a", bg: "#dcfce7" };
      case "request_rejected":
        return { icon: FaTimesCircle, color: "#dc2626", bg: "#fee2e2" };
      case "request_processing":
        return { icon: FaClock, color: "#2563eb", bg: "#eff6ff" };
      case "coaching_approved":
        return { icon: FaCheckCircle, color: "#16a34a", bg: "#dcfce7" };
      default:
        return { icon: FaBell, color: "#4a72b8", bg: "#eff6ff" };
    }
  };

  if (!user) return null;

  return (
    <>
      {/* ── Bell icon button ── */}
      <Box
        position="relative"
        cursor="pointer"
        onClick={() => {
          openDrawer();
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

      {/* ── Notification panel drawer ── */}
      <Drawer
        isOpen={drawerOpen}
        onClose={closeDrawer}
        placement="right"
        size="sm"
      >
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
                {notifications.map((n) => {
                  const ic = notifStyle(n.type);
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
                      transition="background .15s"
                      align="flex-start"
                    >
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

      {/* Test detail modal (opened from notification) */}
      <TestDetailModal test={selTest} isOpen={testOpen} onClose={closeTest} />
    </>
  );
}
