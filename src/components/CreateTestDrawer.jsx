// ═══════════════════════════════════════════════
// CREATE TEST DRAWER  —  supports any file type
// Replaces the old Excel-only version in CoachingPage.jsx
// ═══════════════════════════════════════════════
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Progress,
} from "@chakra-ui/react";
import {
  FaPlus,
  FaTrash,
  FaCheck,
  FaRobot,
  FaUpload,
  FaFilePdf,
  FaFileImage,
  FaFileExcel,
  FaFileAlt,
  FaDownload,
  FaClipboardList,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { apiFetch } from "../services/api";

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

// ── Excel template download ───────────────────────────────────────────────
const downloadTemplate = () => {
  const headers = [
    "Question",
    "Option A",
    "Option B",
    "Option C",
    "Option D",
    "Answer (0-3)",
    "Explanation",
  ];
  const example = [
    "What is 2+2?",
    "3",
    "4",
    "5",
    "6",
    "1",
    "Basic addition: 2+2=4 = option B (index 1)",
  ];
  const ws = XLSX.utils.aoa_to_sheet([headers, example]);
  ws["!cols"] = [
    { wch: 50 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 20 },
    { wch: 14 },
    { wch: 35 },
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Questions");
  XLSX.writeFile(wb, "questions_template.xlsx");
};

// ── Parse Excel ───────────────────────────────────────────────────────────
const parseExcel = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const qs = rows
          .slice(1)
          .filter((r) => r[0])
          .map((r) => ({
            qus: String(r[0] || ""),
            options: [
              String(r[1] || ""),
              String(r[2] || ""),
              String(r[3] || ""),
              String(r[4] || ""),
            ],
            answer: (() => {
              const raw = parseInt(r[5]);
              if (isNaN(raw)) return 0;
              return raw >= 1 && raw <= 4
                ? raw - 1
                : Math.max(0, Math.min(3, raw));
            })(),
            explanation: String(r[6] || ""),
          }));
        resolve(qs);
      } catch (err) {
        reject(err);
      }
    };
    r.onerror = reject;
    r.readAsBinaryString(file);
  });

// ── File → base64 ─────────────────────────────────────────────────────────
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = (e) => resolve(e.target.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

// ── Detect file type ──────────────────────────────────────────────────────
const detectFileType = (file) => {
  if (file.type.includes("pdf")) return "pdf";
  if (file.type.includes("image")) return "image";
  if (file.name.match(/\.xlsx?$/i)) return "excel";
  return "other";
};

// ── Question row editor ───────────────────────────────────────────────────
function QuestionRow({ q, idx, onChange, onDelete }) {
  const sf = (k) => (e) => onChange(idx, { ...q, [k]: e.target.value });
  const sfO = (oi) => (e) => {
    const opts = [...(q.options || ["", "", "", ""])];
    opts[oi] = e.target.value;
    onChange(idx, { ...q, options: opts });
  };

  return (
    <Box
      bg="#f8fafc"
      borderRadius="12px"
      border="1px solid #e2e8f0"
      p={4}
      mb={3}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Text
          fontSize="11px"
          fontWeight={800}
          color="#94a3b8"
          textTransform="uppercase"
          letterSpacing=".8px"
        >
          Q{idx + 1}
        </Text>
        <Box
          as="button"
          onClick={() => onDelete(idx)}
          p="4px"
          borderRadius="6px"
          color="#ef4444"
          _hover={{ bg: "#fef2f2" }}
        >
          <Icon as={FaTrash} fontSize="11px" />
        </Box>
      </Flex>

      <Textarea
        value={q.qus || ""}
        onChange={sf("qus")}
        placeholder="Question text…"
        borderRadius="8px"
        fontSize="13px"
        rows={2}
        resize="vertical"
        mb={3}
        borderColor="#e2e8f0"
        _focus={{ borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" }}
      />

      <Flex gap={2} flexWrap="wrap" mb={3}>
        {(q.options || ["", "", "", ""]).map((opt, oi) => (
          <Flex key={oi} align="center" gap={2} flex="1" minW="48%">
            <Flex
              w="22px"
              h="22px"
              flexShrink={0}
              borderRadius="6px"
              cursor="pointer"
              bg={q.answer === oi ? "#dcfce7" : "#f1f5f9"}
              color={q.answer === oi ? "#15803d" : "#64748b"}
              border={
                q.answer === oi
                  ? "1.5px solid #15803d"
                  : "1.5px solid transparent"
              }
              align="center"
              justify="center"
              fontSize="10px"
              fontWeight={800}
              onClick={() => onChange(idx, { ...q, answer: oi })}
            >
              {OPTION_LABELS[oi]}
            </Flex>
            <Input
              value={opt}
              onChange={sfO(oi)}
              placeholder={`Option ${OPTION_LABELS[oi]}…`}
              borderRadius="8px"
              h="36px"
              fontSize="13px"
              borderColor={q.answer === oi ? "#16a34a" : "#e2e8f0"}
              bg={q.answer === oi ? "#f0fdf4" : "white"}
              _focus={{ borderColor: "#4a72b8" }}
            />
          </Flex>
        ))}
      </Flex>

      <Input
        value={q.explanation || ""}
        onChange={sf("explanation")}
        placeholder="Explanation (optional)…"
        borderRadius="8px"
        h="36px"
        fontSize="12px"
        borderColor="#e2e8f0"
        color="#64748b"
        _focus={{ borderColor: "#4a72b8" }}
      />
    </Box>
  );
}

// ── File icon ─────────────────────────────────────────────────────────────
const FileIcon = ({ type }) => {
  const map = { pdf: FaFilePdf, image: FaFileImage, excel: FaFileExcel };
  const colors = { pdf: "#ef4444", image: "#8b5cf6", excel: "#16a34a" };
  const Ic = map[type] || FaFileAlt;
  return <Icon as={Ic} color={colors[type] || "#64748b"} fontSize="18px" />;
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function CreateTestDrawer({
  isOpen,
  onClose,
  coachingId,
  coachingExamTypes = [],
  onCreated,
  currentUser,
}) {
  const toast = useToast();
  const fileRef = useRef();

  const [busy, setBusy] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [files, setFiles] = useState([]); // [{name, type, base64, size}]
  const [aiPrompt, setAiPrompt] = useState("");
  const [tabIdx, setTabIdx] = useState(0); // 0=AI/File  1=Manual  2=Excel

  const [form, setForm] = useState({
    title: "",
    examType: coachingExamTypes[0] || "",
    subject: "",
    timeLimitMin: 30,
    visibility: "public",
    password: "",
    totalQuestions: 20,
    difficulty: "mixed",
  });
  const [errs, setErrs] = useState({});

  useEffect(() => {
    if (coachingExamTypes.length && !form.examType)
      setForm((p) => ({ ...p, examType: coachingExamTypes[0] }));
  }, [coachingExamTypes]);

  const sf = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setErrs((p) => ({ ...p, [k]: "" }));
  };

  // ── Handle file picks ────────────────────────────────────────────────────
  const handleFiles = async (e) => {
    const picked = Array.from(e.target.files);
    e.target.value = "";
    const MAX = 10 * 1024 * 1024;
    const newFiles = [];
    for (const file of picked) {
      if (file.size > MAX) {
        toast({
          title: `${file.name} > 10 MB, skipped`,
          status: "warning",
          duration: 3000,
        });
        continue;
      }
      const type = detectFileType(file);
      const base64 = await toBase64(file);

      // Excel → parse immediately
      if (type === "excel") {
        try {
          const qs = await parseExcel(file);
          if (qs.length) {
            setQuestions(qs);
            toast({
              title: `✅ ${qs.length} questions loaded from Excel`,
              status: "success",
              duration: 3000,
            });
          }
        } catch {
          toast({ title: "Could not parse Excel", status: "error" });
        }
      }
      newFiles.push({ name: file.name, type, base64, size: file.size });
    }
    setFiles((p) => [...p, ...newFiles]);
  };

  const removeFile = (i) => setFiles((p) => p.filter((_, j) => j !== i));

  // ── AI generation from prompt ─────────────────────────────────────────────
  const generateFromPrompt = async () => {
    const n = Number(form.totalQuestions) || 20;
    const system = `You are an expert question-paper setter for Indian competitive exams.
Generate exactly ${n} high-quality multiple choice questions.
Return ONLY valid JSON array, no markdown, no commentary.
Each item: {"qus":"...","options":["A text","B text","C text","D text"],"answer":0,"explanation":"..."}
answer is 0-indexed (0=A,1=B,2=C,3=D). Keep questions clear and exam-appropriate.`;

    const prompt =
      aiPrompt.trim() ||
      `Create ${n} MCQs for ${form.examType || "SSC"} exam${form.subject ? ", subject: " + form.subject : ""}, difficulty: ${form.difficulty}.`;

    await runAI([{ role: "user", content: prompt }], system, n);
  };

  // ── AI generation from file ───────────────────────────────────────────────
  const generateFromFile = async (file) => {
    const n = Number(form.totalQuestions) || 20;
    let messages;

    if (file.type === "image") {
      messages = [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: file.base64,
              },
            },
            {
              type: "text",
              text: `Create ${n} MCQs from this study material for ${form.examType || "competitive"} exam. Return ONLY JSON array: [{"qus":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]`,
            },
          ],
        },
      ];
    } else if (file.type === "pdf") {
      messages = [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: file.base64,
              },
            },
            {
              type: "text",
              text: `Create ${n} MCQs from this PDF for ${form.examType || "competitive"} exam, difficulty: ${form.difficulty}. Return ONLY JSON array: [{"qus":"...","options":["A","B","C","D"],"answer":0,"explanation":"..."}]`,
            },
          ],
        },
      ];
    } else {
      toast({
        title: "Use AI prompt tab for Excel/other files",
        status: "info",
      });
      return;
    }

    await runAI(messages, undefined, n);
  };

  // ── Core AI call ──────────────────────────────────────────────────────────
  const runAI = async (messages, system, expectedCount) => {
    setAiLoading(true);
    setAiProgress(10);
    try {
      const body = {
        model: "claude-sonnet-4-20250514",
        max_tokens: 8000,
        messages,
      };
      if (system) body.system = system;

      setAiProgress(40);
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setAiProgress(80);

      const data = await response.json();

      if (data.error) throw new Error(data.error.message || "AI error");

      const text = data.content?.map((c) => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch {
        const match = clean.match(/\[[\s\S]*\]/);
        if (match) parsed = JSON.parse(match[0]);
        else throw new Error("Could not parse AI response");
      }
      if (!Array.isArray(parsed) || !parsed.length)
        throw new Error("AI returned no questions");

      const normalised = parsed.map((q) => ({
        qus: q.qus || q.question || "",
        options:
          Array.isArray(q.options) && q.options.length === 4
            ? q.options
            : ["Option A", "Option B", "Option C", "Option D"],
        answer: typeof q.answer === "number" ? q.answer : 0,
        explanation: q.explanation || "",
      }));

      setQuestions(normalised);
      setAiProgress(100);
      toast({
        title: `✅ ${normalised.length} questions generated!`,
        description: "Review below before creating the test.",
        status: "success",
        duration: 4000,
      });
      // Switch to manual tab so user can review / edit
      setTabIdx(1);
    } catch (err) {
      toast({
        title: `AI Error: ${err.message}`,
        status: "error",
        duration: 5000,
      });
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiProgress(0), 1000);
    }
  };

  // ── Question editor helpers ───────────────────────────────────────────────
  const addBlank = () =>
    setQuestions((p) => [
      ...p,
      { qus: "", options: ["", "", "", ""], answer: 0, explanation: "" },
    ]);

  const updateQ = (idx, updated) =>
    setQuestions((p) => p.map((q, i) => (i === idx ? updated : q)));

  const deleteQ = (idx) => setQuestions((p) => p.filter((_, i) => i !== idx));

  // ── Validate + submit ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const e = {};
    if (!form.title.trim()) e.title = "Test name is required";
    if (!questions.length) e.questions = "Add at least 1 question";
    const badIdx = questions.findIndex(
      (q) => !q.qus?.trim() || q.options.some((o) => !o?.trim()),
    );
    if (badIdx !== -1) e.questions = `Question ${badIdx + 1} is incomplete`;
    if (Object.keys(e).length) {
      setErrs(e);
      return;
    }

    setBusy(true);
    try {
      const payload = {
        title: form.title.trim(),
        coachingId,
        examType: form.examType || "OTHER",
        subject: form.subject || undefined,
        timeLimitMin: Number(form.timeLimitMin) || 30,
        visibility: form.visibility,
        createdBy: currentUser._id,
        inlineQuestions: questions,
        ...(form.visibility === "private" && form.password
          ? { password: form.password }
          : {}),
      };
      const res = await apiFetch("/tests/create", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast({ title: "Test created!", status: "success", duration: 3000 });
      onCreated(res.data);
      resetState();
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
      timeLimitMin: 30,
      visibility: "public",
      password: "",
      totalQuestions: 20,
      difficulty: "mixed",
    });
    setQuestions([]);
    setFiles([]);
    setAiPrompt("");
    setErrs({});
    setTabIdx(0);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // ────────────────────────────────────────────────────────────────────────
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
              <Icon as={FaClipboardList} fontSize="18px" />
            </Flex>
            <Box>
              <Text fontSize="18px" fontWeight={800} lineHeight="1.2">
                Create Test
              </Text>
              <Text fontSize="12px" color="rgba(255,255,255,.6)" mt="2px">
                AI-powered · PDF · Images · Excel · Manual
              </Text>
            </Box>
          </Flex>
        </DrawerHeader>

        <DrawerBody px={7} py={6} overflowY="auto">
          <Stack spacing={5}>
            {/* ── Basic fields ─────────────────────────────────────────── */}
            <FormControl isRequired isInvalid={!!errs.title}>
              <FormLabel
                fontSize="12px"
                fontWeight={700}
                color="#374151"
                mb={1}
                textTransform="uppercase"
                letterSpacing=".8px"
              >
                Test Name
              </FormLabel>
              <Input
                value={form.title}
                onChange={sf("title")}
                placeholder="e.g. SSC CGL Mock Test 1"
                borderRadius="10px"
                h="44px"
                fontSize="14px"
                borderColor={errs.title ? "red.400" : "#e2e8f0"}
                _focus={{
                  borderColor: "#4a72b8",
                  boxShadow: "0 0 0 1px #4a72b8",
                }}
              />
              <FormErrorMessage>{errs.title}</FormErrorMessage>
            </FormControl>

            <Flex gap={3} direction={{ base: "column", sm: "row" }}>
              <FormControl flex={1}>
                <FormLabel
                  fontSize="12px"
                  fontWeight={700}
                  color="#374151"
                  mb={1}
                  textTransform="uppercase"
                  letterSpacing=".8px"
                >
                  Exam Type
                </FormLabel>
                <Select
                  value={form.examType}
                  onChange={sf("examType")}
                  borderRadius="10px"
                  h="44px"
                  fontSize="14px"
                  borderColor="#e2e8f0"
                >
                  <option value="">Select…</option>
                  {coachingExamTypes.length > 0 && (
                    <optgroup label="This Coaching">
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
              </FormControl>
              <FormControl flex={1}>
                <FormLabel
                  fontSize="12px"
                  fontWeight={700}
                  color="#374151"
                  mb={1}
                  textTransform="uppercase"
                  letterSpacing=".8px"
                >
                  Subject
                </FormLabel>
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
                <FormLabel
                  fontSize="12px"
                  fontWeight={700}
                  color="#374151"
                  mb={1}
                  textTransform="uppercase"
                  letterSpacing=".8px"
                >
                  Time Limit (min)
                </FormLabel>
                <Input
                  type="number"
                  value={form.timeLimitMin}
                  onChange={sf("timeLimitMin")}
                  min={5}
                  max={180}
                  borderRadius="10px"
                  h="44px"
                  fontSize="14px"
                  borderColor="#e2e8f0"
                  _focus={{
                    borderColor: "#4a72b8",
                    boxShadow: "0 0 0 1px #4a72b8",
                  }}
                />
              </FormControl>
              <FormControl flex={1}>
                <FormLabel
                  fontSize="12px"
                  fontWeight={700}
                  color="#374151"
                  mb={1}
                  textTransform="uppercase"
                  letterSpacing=".8px"
                >
                  Access
                </FormLabel>
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

            {form.visibility === "private" && (
              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight={700}
                  color="#374151"
                  mb={1}
                  textTransform="uppercase"
                  letterSpacing=".8px"
                >
                  Test Password
                </FormLabel>
                <Input
                  value={form.password}
                  onChange={sf("password")}
                  placeholder="Students must enter this"
                  borderRadius="10px"
                  h="44px"
                  fontSize="14px"
                  borderColor="#e2e8f0"
                  _focus={{
                    borderColor: "#4a72b8",
                    boxShadow: "0 0 0 1px #4a72b8",
                  }}
                />
              </FormControl>
            )}

            <Divider />

            {/* ── Question input method tabs ──────────────────────────── */}
            <Box>
              <Text
                fontSize="11px"
                fontWeight={800}
                color="#94a3b8"
                textTransform="uppercase"
                letterSpacing="2px"
                mb={4}
              >
                Add Questions
              </Text>

              <Tabs
                index={tabIdx}
                onChange={setTabIdx}
                variant="soft-rounded"
                colorScheme="blue"
                size="sm"
              >
                <TabList mb={4} flexWrap="wrap" gap={1}>
                  <Tab fontSize="12px" fontWeight={700} borderRadius="8px">
                    🤖 AI + Files
                  </Tab>
                  <Tab fontSize="12px" fontWeight={700} borderRadius="8px">
                    ✏️ Manual
                  </Tab>
                  <Tab fontSize="12px" fontWeight={700} borderRadius="8px">
                    📊 Excel
                  </Tab>
                </TabList>

                <TabPanels>
                  {/* ── TAB 0: AI + any file ─────────────────────────── */}
                  <TabPanel p={0}>
                    {/* File upload area */}
                    <Box mb={4}>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Text
                          fontSize="12px"
                          fontWeight={700}
                          color="#374151"
                          textTransform="uppercase"
                          letterSpacing=".8px"
                        >
                          Upload Any File
                        </Text>
                        <Text fontSize="11px" color="#94a3b8">
                          PDF · Images · Excel · max 10 MB
                        </Text>
                      </Flex>

                      <input
                        ref={fileRef}
                        type="file"
                        multiple
                        accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg,.webp,.gif"
                        style={{ display: "none" }}
                        onChange={handleFiles}
                      />

                      <Box
                        border="2px dashed"
                        borderColor={files.length ? "#4a72b8" : "#e2e8f0"}
                        borderRadius="14px"
                        p={5}
                        textAlign="center"
                        cursor="pointer"
                        bg={files.length ? "#f0f7ff" : "#f8fafc"}
                        onClick={() => fileRef.current?.click()}
                        transition="all .2s"
                        _hover={{ borderColor: "#4a72b8", bg: "#f0f7ff" }}
                      >
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
                          PDF chapters · Question screenshots · Excel sheets
                        </Text>
                      </Box>

                      {/* Uploaded file list */}
                      {files.length > 0 && (
                        <Stack mt={3} spacing={2}>
                          {files.map((f, i) => (
                            <Box
                              key={i}
                              bg="white"
                              borderRadius="10px"
                              border="1px solid #e2e8f0"
                              p={3}
                            >
                              <Flex align="center" gap={3} mb={2}>
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
                                    {f.type.toUpperCase()} ·{" "}
                                    {(f.size / 1024).toFixed(0)} KB
                                  </Text>
                                </Box>
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
                              {/* Preview image */}
                              {f.type === "image" && (
                                <Box
                                  borderRadius="8px"
                                  overflow="hidden"
                                  mb={2}
                                >
                                  <img
                                    src={`data:image/jpeg;base64,${f.base64}`}
                                    alt={f.name}
                                    style={{
                                      width: "100%",
                                      maxHeight: "160px",
                                      objectFit: "contain",
                                      background: "#f1f5f9",
                                    }}
                                  />
                                </Box>
                              )}
                              {(f.type === "pdf" || f.type === "image") && (
                                <Button
                                  size="xs"
                                  leftIcon={<FaRobot />}
                                  onClick={() => generateFromFile(f)}
                                  isLoading={aiLoading}
                                  bg="#f5f3ff"
                                  color="#7c3aed"
                                  borderRadius="7px"
                                  fontWeight={700}
                                  fontSize="11px"
                                  w="full"
                                  _hover={{ bg: "#ede9fe" }}
                                >
                                  Generate questions from this file
                                </Button>
                              )}
                            </Box>
                          ))}
                        </Stack>
                      )}
                    </Box>

                    <Divider mb={4} />

                    {/* AI Prompt */}
                    <Box
                      bg="linear-gradient(135deg,#f5f3ff,#ede9fe)"
                      border="1px solid #c4b5fd"
                      borderRadius="14px"
                      p={4}
                    >
                      <Flex align="center" gap={2} mb={2}>
                        <Icon as={FaRobot} color="#7c3aed" fontSize="16px" />
                        <Text fontSize="13px" fontWeight={800} color="#4c1d95">
                          AI Generator
                        </Text>
                      </Flex>

                      <Flex
                        gap={3}
                        mb={3}
                        direction={{ base: "column", sm: "row" }}
                      >
                        <FormControl flex={1}>
                          <FormLabel
                            fontSize="11px"
                            fontWeight={700}
                            color="#6d28d9"
                            mb={1}
                          >
                            Questions count
                          </FormLabel>
                          <Input
                            type="number"
                            value={form.totalQuestions}
                            onChange={sf("totalQuestions")}
                            min={5}
                            max={100}
                            borderRadius="8px"
                            h="38px"
                            fontSize="13px"
                            bg="white"
                            borderColor="#c4b5fd"
                            _focus={{ borderColor: "#7c3aed" }}
                          />
                        </FormControl>
                        <FormControl flex={1}>
                          <FormLabel
                            fontSize="11px"
                            fontWeight={700}
                            color="#6d28d9"
                            mb={1}
                          >
                            Difficulty
                          </FormLabel>
                          <Select
                            value={form.difficulty}
                            onChange={sf("difficulty")}
                            borderRadius="8px"
                            h="38px"
                            fontSize="13px"
                            bg="white"
                            borderColor="#c4b5fd"
                          >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="mixed">Mixed</option>
                          </Select>
                        </FormControl>
                      </Flex>

                      <Textarea
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Describe what you want (topics, style, focus areas)…"
                        borderRadius="8px"
                        fontSize="13px"
                        rows={2}
                        resize="vertical"
                        mb={3}
                        bg="white"
                        borderColor="#c4b5fd"
                        _focus={{
                          borderColor: "#7c3aed",
                          boxShadow: "0 0 0 1px #7c3aed",
                        }}
                      />

                      {aiLoading && aiProgress > 0 && (
                        <Progress
                          value={aiProgress}
                          size="xs"
                          colorScheme="purple"
                          borderRadius="full"
                          mb={3}
                        />
                      )}

                      <Button
                        leftIcon={<FaRobot />}
                        onClick={generateFromPrompt}
                        isLoading={aiLoading}
                        loadingText="Generating…"
                        bg="#7c3aed"
                        color="white"
                        borderRadius="10px"
                        fontWeight={800}
                        fontSize="13px"
                        h="40px"
                        _hover={{ bg: "#6d28d9" }}
                        w="full"
                      >
                        Generate {form.totalQuestions} Questions with AI
                      </Button>

                      {questions.length > 0 && (
                        <Text
                          fontSize="12px"
                          color="#6d28d9"
                          mt={2}
                          fontWeight={600}
                        >
                          ✓ {questions.length} questions ready — review in
                          Manual tab
                        </Text>
                      )}
                    </Box>
                  </TabPanel>

                  {/* ── TAB 1: Manual editor ──────────────────────────── */}
                  <TabPanel p={0}>
                    <Flex justify="space-between" align="center" mb={4}>
                      <Text fontSize="13px" fontWeight={700} color="#374151">
                        {questions.length} question
                        {questions.length !== 1 ? "s" : ""}
                      </Text>
                      <Button
                        size="sm"
                        leftIcon={<FaPlus />}
                        onClick={addBlank}
                        variant="outline"
                        borderRadius="8px"
                        fontSize="12px"
                        fontWeight={700}
                        borderColor="#4a72b8"
                        color="#4a72b8"
                      >
                        Add Question
                      </Button>
                    </Flex>

                    {questions.length === 0 ? (
                      <Box
                        py={10}
                        textAlign="center"
                        bg="#f8fafc"
                        borderRadius="12px"
                        border="2px dashed #e2e8f0"
                      >
                        <Icon
                          as={FaClipboardList}
                          fontSize="32px"
                          color="#e2e8f0"
                          display="block"
                          mx="auto"
                          mb={2}
                        />
                        <Text
                          fontSize="13px"
                          color="#94a3b8"
                          fontWeight={600}
                          mb={3}
                        >
                          No questions yet
                        </Text>
                        <Button
                          size="sm"
                          leftIcon={<FaPlus />}
                          onClick={addBlank}
                          bg="#4a72b8"
                          color="white"
                          borderRadius="9px"
                          fontWeight={700}
                        >
                          Add First Question
                        </Button>
                      </Box>
                    ) : (
                      questions.map((q, idx) => (
                        <QuestionRow
                          key={idx}
                          q={q}
                          idx={idx}
                          onChange={updateQ}
                          onDelete={deleteQ}
                        />
                      ))
                    )}

                    {questions.length > 0 && (
                      <Button
                        size="sm"
                        leftIcon={<FaPlus />}
                        onClick={addBlank}
                        variant="outline"
                        borderRadius="8px"
                        fontSize="12px"
                        fontWeight={700}
                        borderColor="#4a72b8"
                        color="#4a72b8"
                        mt={2}
                        w="full"
                      >
                        Add Another Question
                      </Button>
                    )}
                  </TabPanel>

                  {/* ── TAB 2: Excel upload ───────────────────────────── */}
                  <TabPanel p={0}>
                    <Box
                      bg="#f0fdf4"
                      border="1px solid #bbf7d0"
                      borderRadius="10px"
                      p={4}
                      mb={4}
                    >
                      <Text
                        fontSize="11px"
                        fontWeight={700}
                        color="#15803d"
                        mb={2}
                      >
                        📋 EXCEL COLUMN ORDER:
                      </Text>
                      {[
                        "Question",
                        "Option A",
                        "Option B",
                        "Option C",
                        "Option D",
                        "Answer (0=A, 1=B, 2=C, 3=D)",
                        "Explanation (optional)",
                      ].map((col, i) => (
                        <Flex
                          key={col}
                          gap={2}
                          mb="2px"
                          fontFamily="monospace"
                          fontSize="11px"
                          color="#166534"
                        >
                          <Text color="#94a3b8" minW="16px">
                            {i + 1}.
                          </Text>
                          <Text fontWeight={600}>{col}</Text>
                        </Flex>
                      ))}
                    </Box>

                    <Flex justify="flex-end" mb={3}>
                      <Button
                        size="xs"
                        leftIcon={<FaDownload />}
                        variant="outline"
                        colorScheme="green"
                        borderRadius="8px"
                        fontSize="11px"
                        fontWeight={700}
                        onClick={downloadTemplate}
                      >
                        Download Template
                      </Button>
                    </Flex>

                    <input
                      ref={fileRef}
                      type="file"
                      accept=".xlsx,.xls"
                      style={{ display: "none" }}
                      onChange={handleFiles}
                    />

                    <Box
                      border="2px dashed"
                      borderColor={questions.length ? "#16a34a" : "#e2e8f0"}
                      borderRadius="12px"
                      p={6}
                      textAlign="center"
                      bg={questions.length ? "#f0fdf4" : "#f8fafc"}
                      cursor="pointer"
                      onClick={() => fileRef.current?.click()}
                      transition="all .2s"
                      _hover={{ borderColor: "#4a72b8", bg: "#f0f7ff" }}
                    >
                      {questions.length > 0 ? (
                        <>
                          <Icon
                            as={FaCheck}
                            fontSize="28px"
                            color="#16a34a"
                            display="block"
                            mx="auto"
                            mb={2}
                          />
                          <Text
                            fontSize="14px"
                            fontWeight={700}
                            color="#15803d"
                          >
                            {questions.length} questions loaded!
                          </Text>
                          <Text fontSize="12px" color="#94a3b8" mt={1}>
                            Click to replace with another file
                          </Text>
                        </>
                      ) : (
                        <>
                          <Icon
                            as={FaFileExcel}
                            fontSize="32px"
                            color="#94a3b8"
                            display="block"
                            mx="auto"
                            mb={2}
                          />
                          <Text
                            fontSize="14px"
                            fontWeight={600}
                            color="#374151"
                          >
                            Click to upload .xlsx file
                          </Text>
                          <Text fontSize="12px" color="#94a3b8" mt={1}>
                            Accepts .xlsx and .xls
                          </Text>
                        </>
                      )}
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>

            {errs.questions && (
              <Text fontSize="12px" color="red.500" fontWeight={600}>
                {errs.questions}
              </Text>
            )}

            {/* ── Submit ───────────────────────────────────────────────── */}
            <Button
              h="50px"
              borderRadius="12px"
              mt={2}
              bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
              color="white"
              fontWeight={800}
              fontSize="14px"
              isLoading={busy}
              loadingText="Creating…"
              onClick={handleSubmit}
              leftIcon={<FaPlus />}
              isDisabled={!questions.length}
              _hover={{
                opacity: 0.9,
                transform: "translateY(-1px)",
                boxShadow: "0 8px 24px rgba(74,114,184,.35)",
              }}
              transition="all .2s"
            >
              Create Test ({questions.length} Questions)
            </Button>
          </Stack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
