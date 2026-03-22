
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Input,
//   Button,
//   Icon,
//   Spinner,
//   Badge,
//   Select,
//   Textarea,
//   useToast,
//   Stack,
//   Divider,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalCloseButton,
//   useDisclosure,
//   InputGroup,
//   InputLeftElement,
//   AlertDialog,
//   AlertDialogOverlay,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogBody,
//   AlertDialogFooter,
// } from "@chakra-ui/react";
// import {
//   FaSearch,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaClock,
//   FaEye,
//   FaRobot,
//   FaPlus,
//   FaTrash,
//   FaClipboardList,
//   FaFilePdf,
//   FaFileImage,
//   FaFileExcel,
//   FaDownload,
//   FaCheck,
//   FaPaperPlane,
//   FaHourglass,
//   FaExpand,
//   FaTimes,
//   FaLayerGroup,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { apiFetch } from "../services/api";
// import { useAuth } from "../context/AuthContext";

// const StatusBadge = ({ status }) => {
//   const cfg = {
//     pending: {
//       bg: "#fef9c3",
//       color: "#a16207",
//       icon: FaHourglass,
//       label: "Pending",
//     },
//     processing: {
//       bg: "#eff6ff",
//       color: "#1d4ed8",
//       icon: FaClock,
//       label: "Processing",
//     },
//     completed: {
//       bg: "#dcfce7",
//       color: "#15803d",
//       icon: FaCheckCircle,
//       label: "Completed",
//     },
//     rejected: {
//       bg: "#fee2e2",
//       color: "#dc2626",
//       icon: FaTimesCircle,
//       label: "Rejected",
//     },
//   };
//   const c = cfg[status] || cfg.pending;
//   return (
//     <Flex
//       align="center"
//       gap={1.5}
//       bg={c.bg}
//       color={c.color}
//       px={3}
//       py="4px"
//       borderRadius="full"
//       fontSize="11px"
//       fontWeight={700}
//       w="fit-content"
//     >
//       <Icon as={c.icon} fontSize="10px" />
//       {c.label}
//     </Flex>
//   );
// };

// const FileIcon = ({ type, size = "16px" }) => {
//   const map = { pdf: FaFilePdf, image: FaFileImage, excel: FaFileExcel };
//   const colors = { pdf: "#ef4444", image: "#8b5cf6", excel: "#16a34a" };
//   const Ic = map[type] || FaClipboardList;
//   return <Icon as={Ic} color={colors[type] || "#64748b"} fontSize={size} />;
// };

// const downloadFile = (att) => {
//   try {
//     const mimeMap = {
//       pdf: "application/pdf",
//       image: "image/jpeg",
//       excel:
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     };
//     const mime = mimeMap[att.fileType] || "application/octet-stream";
//     const byteChars = atob(att.fileData);
//     const byteArrays = [];
//     for (let offset = 0; offset < byteChars.length; offset += 512) {
//       const slice = byteChars.slice(offset, offset + 512);
//       byteArrays.push(
//         new Uint8Array(slice.length).map((_, i) => slice.charCodeAt(i)),
//       );
//     }
//     const blob = new Blob(byteArrays, { type: mime });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download =
//       att.fileName ||
//       `attachment.${att.fileType === "image" ? "jpg" : att.fileType}`;
//     a.click();
//     URL.revokeObjectURL(url);
//   } catch {
//     window.open(
//       `data:application/octet-stream;base64,${att.fileData}`,
//       "_blank",
//     );
//   }
// };

// function FilePreviewModal({ attachment, isOpen, onClose }) {
//   if (!attachment) return null;
//   const { fileType, fileData, fileName } = attachment;
//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       size="5xl"
//       isCentered
//       scrollBehavior="inside"
//     >
//       <ModalOverlay backdropFilter="blur(6px)" bg="rgba(0,0,0,.7)" />
//       <ModalContent
//         borderRadius="16px"
//         overflow="hidden"
//         fontFamily="'Sora',sans-serif"
//         maxH="90vh"
//         mx={4}
//       >
//         <ModalHeader
//           px={6}
//           py={4}
//           bg="linear-gradient(135deg,#0f1e3a,#1e3a5f)"
//           color="white"
//           borderRadius="16px 16px 0 0"
//         >
//           <Flex align="center" justify="space-between">
//             <Flex align="center" gap={3}>
//               <FileIcon type={fileType} size="20px" />
//               <Box>
//                 <Text
//                   fontSize="14px"
//                   fontWeight={800}
//                   noOfLines={1}
//                   maxW="500px"
//                 >
//                   {fileName}
//                 </Text>
//                 <Text
//                   fontSize="11px"
//                   color="rgba(255,255,255,.5)"
//                   textTransform="uppercase"
//                 >
//                   {fileType} file
//                 </Text>
//               </Box>
//             </Flex>
//             <Flex gap={2}>
//               <Button
//                 size="sm"
//                 h="34px"
//                 px={4}
//                 bg="rgba(255,255,255,.12)"
//                 color="white"
//                 borderRadius="8px"
//                 fontWeight={700}
//                 fontSize="12px"
//                 leftIcon={<Icon as={FaDownload} fontSize="11px" />}
//                 onClick={() => downloadFile(attachment)}
//                 _hover={{ bg: "rgba(255,255,255,.2)" }}
//               >
//                 Download
//               </Button>
//               <Button
//                 size="sm"
//                 h="34px"
//                 w="34px"
//                 p={0}
//                 bg="rgba(255,255,255,.12)"
//                 color="white"
//                 borderRadius="8px"
//                 onClick={onClose}
//                 _hover={{ bg: "rgba(255,255,255,.2)" }}
//               >
//                 <Icon as={FaTimes} fontSize="12px" />
//               </Button>
//             </Flex>
//           </Flex>
//         </ModalHeader>
//         <ModalBody
//           p={0}
//           bg="#0f172a"
//           minH="400px"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           {fileType === "image" && (
//             <Box w="100%" textAlign="center" p={4}>
//               <img
//                 src={`data:image/jpeg;base64,${fileData}`}
//                 alt={fileName}
//                 style={{
//                   maxWidth: "100%",
//                   maxHeight: "75vh",
//                   objectFit: "contain",
//                   borderRadius: "8px",
//                   boxShadow: "0 8px 32px rgba(0,0,0,.4)",
//                 }}
//               />
//             </Box>
//           )}
//           {fileType === "pdf" && (
//             <Box w="100%" h="75vh">
//               <iframe
//                 src={`data:application/pdf;base64,${fileData}`}
//                 width="100%"
//                 height="100%"
//                 style={{ border: "none", borderRadius: "0 0 16px 16px" }}
//                 title={fileName}
//               />
//             </Box>
//           )}
//           {fileType === "excel" && (
//             <Flex
//               direction="column"
//               align="center"
//               gap={5}
//               py={16}
//               color="white"
//             >
//               <Icon as={FaFileExcel} fontSize="64px" color="#16a34a" />
//               <Box textAlign="center">
//                 <Text fontSize="16px" fontWeight={700} mb={2}>
//                   {fileName}
//                 </Text>
//                 <Text fontSize="13px" color="rgba(255,255,255,.5)" mb={6}>
//                   Excel files cannot be previewed in the browser.
//                 </Text>
//                 <Button
//                   h="46px"
//                   px={8}
//                   borderRadius="12px"
//                   bg="#16a34a"
//                   color="white"
//                   fontWeight={800}
//                   leftIcon={<Icon as={FaDownload} />}
//                   onClick={() => downloadFile(attachment)}
//                   _hover={{ bg: "#15803d" }}
//                 >
//                   Download to View
//                 </Button>
//               </Box>
//             </Flex>
//           )}
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// }

// function QuestionRow({ q, idx, onChange, onDelete }) {
//   const sf = (k) => (e) => onChange(idx, { ...q, [k]: e.target.value });
//   const sfOpt = (oi) => (e) => {
//     const opts = [...(q.options || ["", "", "", ""])];
//     opts[oi] = e.target.value;
//     onChange(idx, { ...q, options: opts });
//   };
//   return (
//     <Box
//       bg="#f8fafc"
//       borderRadius="12px"
//       border="1px solid #e2e8f0"
//       p={4}
//       mb={3}
//     >
//       <Flex justify="space-between" align="flex-start" mb={2}>
//         <Text
//           fontSize="11px"
//           fontWeight={800}
//           color="#94a3b8"
//           textTransform="uppercase"
//           letterSpacing=".8px"
//         >
//           Q{idx + 1}
//         </Text>
//         <Box
//           as="button"
//           onClick={() => onDelete(idx)}
//           p="4px"
//           borderRadius="6px"
//           color="#ef4444"
//           _hover={{ bg: "#fef2f2" }}
//         >
//           <Icon as={FaTrash} fontSize="11px" />
//         </Box>
//       </Flex>
//       <Textarea
//         value={q.qus || ""}
//         onChange={sf("qus")}
//         placeholder="Question text…"
//         borderRadius="8px"
//         fontSize="13px"
//         rows={2}
//         resize="vertical"
//         mb={3}
//         borderColor="#e2e8f0"
//         _focus={{ borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" }}
//       />
//       <Flex gap={2} flexWrap="wrap" mb={3}>
//         {(q.options || ["", "", "", ""]).map((opt, oi) => (
//           <Flex key={oi} align="center" gap={2} flex="1" minW="48%">
//             <Flex
//               w="22px"
//               h="22px"
//               bg={q.answer === oi ? "#dcfce7" : "#f1f5f9"}
//               color={q.answer === oi ? "#15803d" : "#64748b"}
//               borderRadius="6px"
//               align="center"
//               justify="center"
//               fontSize="10px"
//               fontWeight={800}
//               flexShrink={0}
//               cursor="pointer"
//               border={
//                 q.answer === oi
//                   ? "1.5px solid #15803d"
//                   : "1.5px solid transparent"
//               }
//               onClick={() => onChange(idx, { ...q, answer: oi })}
//             >
//               {["A", "B", "C", "D"][oi]}
//             </Flex>
//             <Input
//               value={opt}
//               onChange={sfOpt(oi)}
//               placeholder={`Option ${["A", "B", "C", "D"][oi]}…`}
//               borderRadius="8px"
//               h="36px"
//               fontSize="13px"
//               borderColor={q.answer === oi ? "#16a34a" : "#e2e8f0"}
//               bg={q.answer === oi ? "#f0fdf4" : "white"}
//               _focus={{ borderColor: "#4a72b8" }}
//             />
//           </Flex>
//         ))}
//       </Flex>
//       <Input
//         value={q.explanation || ""}
//         onChange={sf("explanation")}
//         placeholder="Explanation (optional)…"
//         borderRadius="8px"
//         h="36px"
//         fontSize="12px"
//         borderColor="#e2e8f0"
//         color="#64748b"
//         _focus={{ borderColor: "#4a72b8" }}
//       />
//     </Box>
//   );
// }

// // ── Per-section question editor panel ─────────────────────────────────────────
// function SectionEditor({
//   section,
//   sectionIdx,
//   sectionQuestions,
//   setSectionQuestions,
//   fullRequest,
//   aiLoading,
//   setAiLoading,
//   toast,
// }) {
//   const sq = sectionQuestions[sectionIdx] || { questions: [] };
//   const setSecQ = (qs) =>
//     setSectionQuestions((prev) =>
//       prev.map((s, i) => (i === sectionIdx ? { questions: qs } : s)),
//     );

//   const generateSectionAI = async () => {
//     setAiLoading(true);
//     try {
//       const systemPrompt = `You are an expert question paper setter for Indian competitive exams.
// Generate exactly ${section.totalQuestions} high-quality MCQs for the subject: ${section.subject}.
// Exam: ${fullRequest.examType}. Difficulty: ${fullRequest.difficulty}.
// Return ONLY valid JSON array, no markdown: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]`;

//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "claude-sonnet-4-20250514",
//           max_tokens: 6000,
//           system: systemPrompt,
//           messages: [
//             {
//               role: "user",
//               content: `Generate ${section.totalQuestions} MCQs for ${section.subject}`,
//             },
//           ],
//         }),
//       });
//       const data = await response.json();
//       const text = data.content?.map((c) => c.text || "").join("") || "";
//       const clean = text.replace(/```json|```/g, "").trim();
//       const match = clean.match(/\[[\s\S]*\]/);
//       const parsed = match ? JSON.parse(match[0]) : JSON.parse(clean);
//       const normalised = parsed.map((q) => ({
//         qus: q.qus || q.question || "",
//         options:
//           Array.isArray(q.options) && q.options.length === 4
//             ? q.options
//             : ["Option A", "Option B", "Option C", "Option D"],
//         answer: typeof q.answer === "number" ? q.answer : 0,
//         explanation: q.explanation || "",
//       }));
//       setSecQ(normalised);
//       toast({
//         title: `✅ ${normalised.length} questions for ${section.subject}!`,
//         status: "success",
//         duration: 3000,
//       });
//     } catch (err) {
//       toast({
//         title: `AI Error: ${err.message}`,
//         status: "error",
//         duration: 4000,
//       });
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   return (
//     <Box
//       mb={6}
//       bg="#f8fafc"
//       borderRadius="14px"
//       border="1px solid #e2e8f0"
//       overflow="hidden"
//     >
//       {/* Section header */}
//       <Flex
//         align="center"
//         justify="space-between"
//         px={5}
//         py={3}
//         bg="white"
//         borderBottom="1px solid #e2e8f0"
//       >
//         <Flex align="center" gap={2}>
//           <Flex
//             w="26px"
//             h="26px"
//             bg="#eff6ff"
//             borderRadius="7px"
//             align="center"
//             justify="center"
//           >
//             <Text fontSize="11px" fontWeight={900} color="#2563eb">
//               {sectionIdx + 1}
//             </Text>
//           </Flex>
//           <Text
//             fontSize="13px"
//             fontWeight={800}
//             color="#0f172a"
//             textTransform="capitalize"
//           >
//             {section.subject || `Section ${sectionIdx + 1}`}
//           </Text>
//           <Text fontSize="11px" color="#94a3b8">
//             · {section.totalQuestions} questions requested
//           </Text>
//         </Flex>
//         <Flex align="center" gap={2}>
//           <Text
//             fontSize="11px"
//             fontWeight={700}
//             color={
//               sq.questions.length >= section.totalQuestions
//                 ? "#16a34a"
//                 : "#d97706"
//             }
//           >
//             {sq.questions.length}/{section.totalQuestions} added
//           </Text>
//           <Button
//             size="xs"
//             leftIcon={<Icon as={FaRobot} fontSize="9px" />}
//             onClick={generateSectionAI}
//             isLoading={aiLoading}
//             bg="#f5f3ff"
//             color="#7c3aed"
//             borderRadius="7px"
//             fontWeight={700}
//             fontSize="11px"
//             _hover={{ bg: "#ede9fe" }}
//           >
//             AI Generate
//           </Button>
//           <Button
//             size="xs"
//             leftIcon={<Icon as={FaPlus} fontSize="9px" />}
//             onClick={() =>
//               setSecQ([
//                 ...sq.questions,
//                 {
//                   qus: "",
//                   options: ["", "", "", ""],
//                   answer: 0,
//                   explanation: "",
//                 },
//               ])
//             }
//             bg="#eff6ff"
//             color="#2563eb"
//             borderRadius="7px"
//             fontWeight={700}
//             fontSize="11px"
//             _hover={{ bg: "#dbeafe" }}
//           >
//             Add
//           </Button>
//         </Flex>
//       </Flex>

//       <Box p={4}>
//         {sq.questions.length === 0 ? (
//           <Box
//             py={8}
//             textAlign="center"
//             bg="white"
//             borderRadius="10px"
//             border="2px dashed #e2e8f0"
//           >
//             <Text fontSize="13px" color="#94a3b8">
//               No questions yet — use AI Generate or Add manually
//             </Text>
//           </Box>
//         ) : (
//           sq.questions.map((q, qi) => (
//             <QuestionRow
//               key={qi}
//               q={q}
//               idx={qi}
//               onChange={(i, updated) =>
//                 setSecQ(sq.questions.map((qq, ii) => (ii === i ? updated : qq)))
//               }
//               onDelete={(i) =>
//                 setSecQ(sq.questions.filter((_, ii) => ii !== i))
//               }
//             />
//           ))
//         )}
//       </Box>
//     </Box>
//   );
// }

// export default function AdminTestRequestsPage() {
//   const navigate = useNavigate();
//   const toast = useToast();
//   const cancelRef = useRef();
//   const { user, loading: authLoading } = useAuth();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const {
//     isOpen: rejectOpen,
//     onOpen: openReject,
//     onClose: closeReject,
//   } = useDisclosure();
//   const {
//     isOpen: previewOpen,
//     onOpen: openPreview,
//     onClose: closePreview,
//   } = useDisclosure();

//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState("pending");
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState(null);
//   const [fullRequest, setFullRequest] = useState(null);
//   const [loadingDetail, setLoadingDetail] = useState(false);
//   const [previewFile, setPreviewFile] = useState(null);

//   // Flat question state (non-sectioned)
//   const [questions, setQuestions] = useState([]);
//   // Per-section question state (sectioned)
//   const [sectionQuestions, setSectionQuestions] = useState([]);

//   const [adminNote, setAdminNote] = useState("");
//   const [rejectReason, setRejectReason] = useState("");
//   const [acting, setActing] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiPrompt, setAiPrompt] = useState("");

//   useEffect(() => {
//     if (!authLoading && user && !user.isAdmin) navigate("/");
//   }, [user, authLoading, navigate]);

//   const loadRequests = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (statusFilter) params.set("status", statusFilter);
//       if (search.trim()) params.set("search", search.trim());
//       const res = await apiFetch(`/test-requests/admin/all?${params}`);
//       setRequests(res.data ?? []);
//     } catch (err) {
//       toast({ title: err.message, status: "error", duration: 3000 });
//     } finally {
//       setLoading(false);
//     }
//   }, [statusFilter, search]);

//   useEffect(() => {
//     if (!authLoading && user?.isAdmin) loadRequests();
//   }, [loadRequests, authLoading, user]);

//   const handlePreviewFile = (att) => {
//     setPreviewFile(att);
//     openPreview();
//   };

//   const openDetail = async (req) => {
//     setSelected(req);
//     setQuestions([]);
//     setSectionQuestions([]);
//     setAdminNote("");
//     setAiPrompt("");
//     onOpen();
//     setLoadingDetail(true);
//     try {
//       const res = await apiFetch(`/test-requests/admin/${req._id}`);
//       setFullRequest(res.data);

//       // Initialise section question buckets
//       if (res.data.isSectioned && res.data.sections?.length) {
//         setSectionQuestions(res.data.sections.map(() => ({ questions: [] })));
//       }

//       setAiPrompt(
//         `Create ${res.data.totalQuestions} multiple choice questions for ${res.data.examType} exam.` +
//           (res.data.subject ? ` Subject: ${res.data.subject}.` : "") +
//           ` Difficulty: ${res.data.difficulty}.` +
//           (res.data.instructions
//             ? ` Special instructions: ${res.data.instructions}`
//             : ""),
//       );
//       if (req.status === "pending") {
//         await apiFetch(`/test-requests/admin/${req._id}/processing`, {
//           method: "PATCH",
//         });
//         setRequests((prev) =>
//           prev.map((r) =>
//             r._id === req._id ? { ...r, status: "processing" } : r,
//           ),
//         );
//       }
//     } catch (err) {
//       toast({ title: "Failed to load request details", status: "error" });
//     } finally {
//       setLoadingDetail(false);
//     }
//   };

//   // ── AI generation (flat / non-sectioned) ─────────────────────────────────
//   const generateWithAI = async () => {
//     if (!fullRequest) return;
//     setAiLoading(true);
//     try {
//       const systemPrompt = `You are an expert question paper setter for Indian competitive exams.
// Generate exactly ${fullRequest.totalQuestions} high-quality multiple choice questions.
// Format: Return ONLY valid JSON array, no markdown, no explanation outside JSON.
// Each question: { "qus": "question text", "options": ["A text","B text","C text","D text"], "answer": 0, "explanation": "brief explanation" }
// answer is 0-indexed (0=A, 1=B, 2=C, 3=D).`;

//       const userContent =
//         aiPrompt +
//         (fullRequest.attachments?.length
//           ? `\n\nNote: The coach has uploaded ${fullRequest.attachments.length} file(s) as reference material.`
//           : "");

//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "claude-sonnet-4-20250514",
//           max_tokens: 8000,
//           system: systemPrompt,
//           messages: [{ role: "user", content: userContent }],
//         }),
//       });
//       const data = await response.json();
//       const text = data.content?.map((c) => c.text || "").join("") || "";
//       const clean = text.replace(/```json|```/g, "").trim();
//       let parsed;
//       try {
//         parsed = JSON.parse(clean);
//       } catch {
//         const m = clean.match(/\[[\s\S]*\]/);
//         if (m) parsed = JSON.parse(m[0]);
//         else throw new Error("Could not parse AI response as JSON");
//       }
//       if (!Array.isArray(parsed) || !parsed.length)
//         throw new Error("AI returned empty questions");
//       const normalised = parsed.map((q) => ({
//         qus: q.qus || q.question || "",
//         options:
//           Array.isArray(q.options) && q.options.length === 4
//             ? q.options
//             : ["Option A", "Option B", "Option C", "Option D"],
//         answer: typeof q.answer === "number" ? q.answer : 0,
//         explanation: q.explanation || "",
//       }));
//       setQuestions(normalised);
//       toast({
//         title: `✅ ${normalised.length} questions generated!`,
//         description: "Review and edit before sending.",
//         status: "success",
//         duration: 4000,
//       });
//     } catch (err) {
//       toast({
//         title: `AI Error: ${err.message}`,
//         status: "error",
//         duration: 5000,
//       });
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const generateFromFile = async (attachment) => {
//     if (!fullRequest) return;
//     setAiLoading(true);
//     try {
//       let messages;
//       if (attachment.fileType === "image") {
//         messages = [
//           {
//             role: "user",
//             content: [
//               {
//                 type: "image",
//                 source: {
//                   type: "base64",
//                   media_type: "image/jpeg",
//                   data: attachment.fileData,
//                 },
//               },
//               {
//                 type: "text",
//                 text: `Based on this study material, create ${fullRequest.totalQuestions} MCQs for ${fullRequest.examType} exam. Difficulty: ${fullRequest.difficulty}. Return ONLY JSON array: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]`,
//               },
//             ],
//           },
//         ];
//       } else if (attachment.fileType === "pdf") {
//         messages = [
//           {
//             role: "user",
//             content: [
//               {
//                 type: "document",
//                 source: {
//                   type: "base64",
//                   media_type: "application/pdf",
//                   data: attachment.fileData,
//                 },
//               },
//               {
//                 type: "text",
//                 text: `Based on this PDF, create ${fullRequest.totalQuestions} MCQs for ${fullRequest.examType} exam. Difficulty: ${fullRequest.difficulty}. ${fullRequest.instructions || ""}. Return ONLY JSON array: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]`,
//               },
//             ],
//           },
//         ];
//       } else {
//         toast({
//           title: "For Excel files, use the AI prompt instead",
//           status: "info",
//         });
//         setAiLoading(false);
//         return;
//       }
//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "claude-sonnet-4-20250514",
//           max_tokens: 8000,
//           messages,
//         }),
//       });
//       const data = await response.json();
//       const text = data.content?.map((c) => c.text || "").join("") || "";
//       const clean = text.replace(/```json|```/g, "").trim();
//       const match = clean.match(/\[[\s\S]*\]/);
//       const parsed = match ? JSON.parse(match[0]) : JSON.parse(clean);
//       const normalised = parsed.map((q) => ({
//         qus: q.qus || q.question || "",
//         options:
//           Array.isArray(q.options) && q.options.length === 4
//             ? q.options
//             : ["Option A", "Option B", "Option C", "Option D"],
//         answer: typeof q.answer === "number" ? q.answer : 0,
//         explanation: q.explanation || "",
//       }));
//       setQuestions(normalised);
//       toast({
//         title: `✅ ${normalised.length} questions generated from file!`,
//         status: "success",
//         duration: 4000,
//       });
//     } catch (err) {
//       toast({
//         title: `Error: ${err.message}`,
//         status: "error",
//         duration: 5000,
//       });
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const addBlankQuestion = () =>
//     setQuestions((p) => [
//       ...p,
//       { qus: "", options: ["", "", "", ""], answer: 0, explanation: "" },
//     ]);
//   const updateQuestion = (idx, updated) =>
//     setQuestions((p) => p.map((q, i) => (i === idx ? updated : q)));
//   const deleteQuestion = (idx) =>
//     setQuestions((p) => p.filter((_, i) => i !== idx));

//   // ── Send test ──────────────────────────────────────────────────────────────
//   const handleSendTest = async () => {
//     if (!selected) return;
//     const isSectioned = fullRequest?.isSectioned === true;

//     if (isSectioned) {
//       // Validate each section
//       for (let sIdx = 0; sIdx < (fullRequest.sections?.length || 0); sIdx++) {
//         const sq = sectionQuestions[sIdx];
//         if (!sq || sq.questions.length === 0) {
//           toast({
//             title: `Section "${fullRequest.sections[sIdx]?.subject || sIdx + 1}" has no questions`,
//             status: "warning",
//           });
//           return;
//         }
//         const invalid = sq.questions.findIndex(
//           (q) => !q.qus?.trim() || q.options.some((o) => !o?.trim()),
//         );
//         if (invalid !== -1) {
//           toast({
//             title: `Section "${fullRequest.sections[sIdx]?.subject}" — Q${invalid + 1} is incomplete`,
//             status: "warning",
//           });
//           return;
//         }
//       }
//     } else {
//       if (!questions.length) {
//         toast({
//           title: "Add at least 1 question before sending",
//           status: "warning",
//         });
//         return;
//       }
//       const invalid = questions.findIndex(
//         (q) => !q.qus?.trim() || q.options.some((o) => !o?.trim()),
//       );
//       if (invalid !== -1) {
//         toast({
//           title: `Question ${invalid + 1} is incomplete`,
//           status: "warning",
//         });
//         return;
//       }
//     }

//     setActing(true);
//     try {
//       const body = isSectioned
//         ? {
//             sections: sectionQuestions.map((sq, i) => ({
//               name: fullRequest.sections[i]?.subject || `Section ${i + 1}`,
//               subject: fullRequest.sections[i]?.subject || "",
//               questions: sq.questions,
//             })),
//             adminNote,
//           }
//         : { questions, adminNote };

//       const res = await apiFetch(
//         `/test-requests/admin/${selected._id}/create-test`,
//         {
//           method: "POST",
//           body: JSON.stringify(body),
//         },
//       );
//       toast({ title: res.message, status: "success", duration: 5000 });
//       onClose();
//       loadRequests();
//     } catch (err) {
//       toast({ title: err.message, status: "error", duration: 4000 });
//     } finally {
//       setActing(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!selected || !rejectReason.trim()) {
//       toast({ title: "Please provide a rejection reason", status: "warning" });
//       return;
//     }
//     setActing(true);
//     try {
//       await apiFetch(`/test-requests/admin/${selected._id}/reject`, {
//         method: "PATCH",
//         body: JSON.stringify({ adminNote: rejectReason }),
//       });
//       toast({ title: "Request rejected", status: "info", duration: 3000 });
//       closeReject();
//       onClose();
//       loadRequests();
//     } catch (err) {
//       toast({ title: err.message, status: "error" });
//     } finally {
//       setActing(false);
//     }
//   };

//   const isSectionedRequest = fullRequest?.isSectioned === true;
//   const totalSectionQCount = sectionQuestions.reduce(
//     (s, sq) => s + (sq.questions?.length || 0),
//     0,
//   );

//   if (authLoading)
//     return (
//       <Flex minH="80vh" align="center" justify="center">
//         <Spinner size="xl" color="#4a72b8" thickness="4px" />
//       </Flex>
//     );
//   if (!user?.isAdmin) return null;

//   return (
//     <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
//       {/* Header */}
//       <Box
//         bg="linear-gradient(135deg,#0f1e3a 0%,#1e3a5f 50%,#2d5fa8 100%)"
//         px={{ base: 4, md: 8 }}
//         pt={{ base: 8, md: 12 }}
//         pb={{ base: 10, md: 16 }}
//       >
//         <Box maxW="1100px" mx="auto">
//           <Text
//             fontSize="11px"
//             fontWeight={800}
//             color="rgba(255,255,255,.45)"
//             textTransform="uppercase"
//             letterSpacing="3px"
//             mb={2}
//           >
//             Admin Panel
//           </Text>
//           <Text
//             fontSize={{ base: "24px", md: "36px" }}
//             fontWeight={800}
//             color="white"
//             letterSpacing="-1px"
//             mb={2}
//           >
//             Test Creation Requests
//           </Text>
//           <Text fontSize="14px" color="rgba(255,255,255,.55)">
//             Review coaching requests and create tests using AI or manually
//           </Text>
//         </Box>
//       </Box>

//       <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
//         {/* Filters */}
//         <Flex gap={3} mb={6} flexWrap={{ base: "wrap", md: "nowrap" }}>
//           <InputGroup flex={1}>
//             <InputLeftElement pointerEvents="none" h="full" pl={3}>
//               <Icon as={FaSearch} color="gray.400" fontSize="13px" />
//             </InputLeftElement>
//             <Input
//               placeholder="Search by title or exam…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && loadRequests()}
//               bg="white"
//               borderRadius="10px"
//               h="42px"
//               fontSize="14px"
//               pl="38px"
//               border="1px solid #e2e8f0"
//               _focus={{
//                 borderColor: "#4a72b8",
//                 boxShadow: "0 0 0 1px #4a72b8",
//               }}
//             />
//           </InputGroup>
//           <Select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             bg="white"
//             borderRadius="10px"
//             h="42px"
//             minW="160px"
//             maxW="160px"
//             fontSize="13px"
//             fontWeight={600}
//             border="1px solid #e2e8f0"
//           >
//             <option value="">All Statuses</option>
//             <option value="pending">⏳ Pending</option>
//             <option value="processing">🔄 Processing</option>
//             <option value="completed">✅ Completed</option>
//             <option value="rejected">❌ Rejected</option>
//           </Select>
//           <Button
//             onClick={loadRequests}
//             bg="#4a72b8"
//             color="white"
//             borderRadius="10px"
//             h="42px"
//             px={5}
//             fontSize="13px"
//             fontWeight={700}
//             _hover={{ bg: "#3b5fa0" }}
//           >
//             Search
//           </Button>
//         </Flex>

//         {/* Table */}
//         {loading ? (
//           <Flex justify="center" py={20}>
//             <Spinner color="#4a72b8" thickness="3px" size="xl" />
//           </Flex>
//         ) : requests.length === 0 ? (
//           <Box
//             py={20}
//             textAlign="center"
//             bg="white"
//             borderRadius="16px"
//             border="1px solid #e2e8f0"
//           >
//             <Icon
//               as={FaClipboardList}
//               fontSize="48px"
//               color="#e2e8f0"
//               display="block"
//               mx="auto"
//               mb={4}
//             />
//             <Text fontSize="15px" fontWeight={700} color="#94a3b8">
//               No requests found
//             </Text>
//           </Box>
//         ) : (
//           <Box
//             bg="white"
//             borderRadius="16px"
//             border="1px solid #e2e8f0"
//             overflow="hidden"
//           >
//             <Flex
//               px={6}
//               py={3}
//               bg="#f8fafc"
//               borderBottom="1px solid #e2e8f0"
//               display={{ base: "none", md: "flex" }}
//             >
//               {[
//                 ["Request", 3],
//                 ["Coaching", 2],
//                 ["Details", 2],
//                 ["Date", 2],
//                 ["Status", 2],
//                 ["", 1],
//               ].map(([h, f]) => (
//                 <Text
//                   key={h}
//                   flex={f}
//                   fontSize="11px"
//                   fontWeight={700}
//                   color="#94a3b8"
//                   textTransform="uppercase"
//                   letterSpacing=".8px"
//                 >
//                   {h}
//                 </Text>
//               ))}
//             </Flex>

//             {requests.map((r, idx) => (
//               <Flex
//                 key={r._id}
//                 px={6}
//                 py={4}
//                 align="center"
//                 gap={3}
//                 borderBottom={
//                   idx < requests.length - 1 ? "1px solid #f1f5f9" : "none"
//                 }
//                 transition="background .15s"
//                 _hover={{ bg: "#f8faff" }}
//                 flexWrap={{ base: "wrap", md: "nowrap" }}
//               >
//                 <Box flex={3} minW={0}>
//                   <Flex align="center" gap={2}>
//                     <Text
//                       fontSize="14px"
//                       fontWeight={700}
//                       color="#0f172a"
//                       noOfLines={1}
//                     >
//                       {r.title}
//                     </Text>
//                     {r.isSectioned && (
//                       <Flex
//                         align="center"
//                         gap={1}
//                         bg="#eff6ff"
//                         color="#2563eb"
//                         px={2}
//                         py="1px"
//                         borderRadius="full"
//                         fontSize="9px"
//                         fontWeight={700}
//                         flexShrink={0}
//                       >
//                         <Icon as={FaLayerGroup} fontSize="8px" />
//                         {r.sections?.length || 0}s
//                       </Flex>
//                     )}
//                   </Flex>
//                   <Flex gap={1.5} mt={1} flexWrap="wrap">
//                     <Text
//                       fontSize="9px"
//                       fontWeight={700}
//                       bg="#eff6ff"
//                       color="#2563eb"
//                       px={2}
//                       py="2px"
//                       borderRadius="full"
//                     >
//                       {r.examType}
//                     </Text>
//                     {!r.isSectioned && r.subject && (
//                       <Text
//                         fontSize="9px"
//                         fontWeight={700}
//                         bg="#f1f5f9"
//                         color="#475569"
//                         px={2}
//                         py="2px"
//                         borderRadius="full"
//                         textTransform="capitalize"
//                       >
//                         {r.subject}
//                       </Text>
//                     )}
//                     {r.attachmentCount > 0 && (
//                       <Text
//                         fontSize="9px"
//                         fontWeight={700}
//                         bg="#f5f3ff"
//                         color="#7c3aed"
//                         px={2}
//                         py="2px"
//                         borderRadius="full"
//                       >
//                         {r.attachmentCount} file
//                         {r.attachmentCount > 1 ? "s" : ""}
//                       </Text>
//                     )}
//                   </Flex>
//                 </Box>
//                 <Box flex={2} display={{ base: "none", md: "block" }} minW={0}>
//                   <Text
//                     fontSize="13px"
//                     fontWeight={600}
//                     color="#374151"
//                     noOfLines={1}
//                   >
//                     {r.coachingId?.name || "—"}
//                   </Text>
//                   <Text fontSize="11px" color="#94a3b8">
//                     {r.coachingId?.city || ""}
//                   </Text>
//                 </Box>
//                 <Box flex={2} display={{ base: "none", md: "block" }}>
//                   <Text fontSize="12px" color="#64748b">
//                     {r.isSectioned
//                       ? `${r.sections?.length || 0} sections · ${r.totalQuestions}Q`
//                       : `${r.totalQuestions} Q · ${r.timeLimitMin}min · ${r.difficulty}`}
//                   </Text>
//                   <Text
//                     fontSize="11px"
//                     color="#94a3b8"
//                     textTransform="capitalize"
//                   >
//                     {r.visibility}
//                   </Text>
//                 </Box>
//                 <Box flex={2} display={{ base: "none", md: "block" }}>
//                   <Text fontSize="12px" color="#94a3b8">
//                     {new Date(r.createdAt).toLocaleDateString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </Text>
//                 </Box>
//                 <Box flex={2}>
//                   <StatusBadge status={r.status} />
//                 </Box>
//                 <Flex flex={1} justify="flex-end">
//                   <Button
//                     size="sm"
//                     leftIcon={
//                       r.status === "completed" ? <FaCheck /> : <FaEye />
//                     }
//                     onClick={() => openDetail(r)}
//                     bg={r.status === "completed" ? "#f0fdf4" : "#f0f7ff"}
//                     color={r.status === "completed" ? "#15803d" : "#4a72b8"}
//                     borderRadius="8px"
//                     fontSize="12px"
//                     fontWeight={700}
//                     _hover={{ opacity: 0.8 }}
//                     h="32px"
//                   >
//                     {r.status === "completed" ? "Done" : "Open"}
//                   </Button>
//                 </Flex>
//               </Flex>
//             ))}
//           </Box>
//         )}
//       </Box>

//       {/* ── Detail / Build Test Modal ──────────────────────────────────────── */}
//       <Modal
//         isOpen={isOpen}
//         onClose={onClose}
//         size="full"
//         scrollBehavior="inside"
//       >
//         <ModalOverlay />
//         <ModalContent
//           borderRadius={{ base: 0, md: "16px" }}
//           fontFamily="'Sora',sans-serif"
//           maxW={{ base: "100%", md: "95vw" }}
//           mx="auto"
//           my={{ base: 0, md: 4 }}
//         >
//           <ModalHeader
//             px={7}
//             pt={7}
//             pb={5}
//             bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)"
//             color="white"
//             borderRadius={{ base: 0, md: "16px 16px 0 0" }}
//           >
//             <Flex align="center" justify="space-between">
//               <Box>
//                 <Flex align="center" gap={2}>
//                   <Text fontSize="18px" fontWeight={800} lineHeight={1.2}>
//                     {selected?.title}
//                   </Text>
//                   {isSectionedRequest && (
//                     <Flex
//                       align="center"
//                       gap={1}
//                       bg="rgba(56,189,248,.2)"
//                       color="#38bdf8"
//                       px={2}
//                       py="2px"
//                       borderRadius="full"
//                       fontSize="11px"
//                       fontWeight={700}
//                     >
//                       <Icon as={FaLayerGroup} fontSize="10px" />
//                       {fullRequest?.sections?.length} Sections
//                     </Flex>
//                   )}
//                 </Flex>
//                 <Flex gap={2} mt={2} flexWrap="wrap" align="center">
//                   {selected && <StatusBadge status={selected.status} />}
//                   <Text fontSize="11px" color="rgba(255,255,255,.5)">
//                     from {selected?.coachingId?.name || "coaching"}
//                   </Text>
//                 </Flex>
//               </Box>
//               <ModalCloseButton
//                 position="static"
//                 color="white"
//                 _hover={{ bg: "rgba(255,255,255,.15)" }}
//                 borderRadius="8px"
//               />
//             </Flex>
//           </ModalHeader>

//           <ModalBody px={0} py={0}>
//             {loadingDetail ? (
//               <Flex justify="center" py={20}>
//                 <Spinner color="#4a72b8" size="xl" />
//               </Flex>
//             ) : (
//               <Flex h="full" direction={{ base: "column", lg: "row" }}>
//                 {/* LEFT PANEL — request info + attachments */}
//                 <Box
//                   w={{ base: "100%", lg: "340px" }}
//                   flexShrink={0}
//                   borderRight={{ base: "none", lg: "1px solid #e2e8f0" }}
//                   borderBottom={{ base: "1px solid #e2e8f0", lg: "none" }}
//                   p={6}
//                   overflowY="auto"
//                   maxH={{ lg: "calc(100vh - 200px)" }}
//                 >
//                   <Text
//                     fontSize="11px"
//                     fontWeight={800}
//                     color="#94a3b8"
//                     textTransform="uppercase"
//                     letterSpacing="2px"
//                     mb={4}
//                   >
//                     Request Details
//                   </Text>

//                   <Stack spacing={3} mb={6}>
//                     {fullRequest &&
//                       [
//                         ["Exam Type", fullRequest.examType],
//                         [
//                           "Type",
//                           isSectionedRequest
//                             ? "Sectioned Test"
//                             : "Standard Test",
//                         ],
//                         ...(!isSectionedRequest
//                           ? [["Subject", fullRequest.subject || "Any/Mixed"]]
//                           : []),
//                         ["Questions Needed", fullRequest.totalQuestions],
//                         ["Time Limit", `${fullRequest.timeLimitMin} minutes`],
//                         ["Difficulty", fullRequest.difficulty],
//                         ["Visibility", fullRequest.visibility],
//                         ["Submitted By", fullRequest.requestedBy?.Name],
//                         [
//                           "Submitted At",
//                           new Date(fullRequest.createdAt).toLocaleString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                               hour12: true,
//                             },
//                           ),
//                         ],
//                       ].map(([label, val]) => (
//                         <Flex
//                           key={label}
//                           justify="space-between"
//                           py={2}
//                           borderBottom="1px solid #f1f5f9"
//                         >
//                           <Text
//                             fontSize="12px"
//                             color="#94a3b8"
//                             fontWeight={600}
//                           >
//                             {label}
//                           </Text>
//                           <Text
//                             fontSize="12px"
//                             color="#0f172a"
//                             fontWeight={700}
//                             textTransform="capitalize"
//                             textAlign="right"
//                             maxW="60%"
//                           >
//                             {val}
//                           </Text>
//                         </Flex>
//                       ))}
//                   </Stack>

//                   {/* Section breakdown */}
//                   {isSectionedRequest && fullRequest.sections?.length > 0 && (
//                     <Box mb={5}>
//                       <Text
//                         fontSize="11px"
//                         fontWeight={800}
//                         color="#94a3b8"
//                         textTransform="uppercase"
//                         letterSpacing="2px"
//                         mb={3}
//                       >
//                         Sections Requested
//                       </Text>
//                       <Stack spacing={2}>
//                         {fullRequest.sections.map((sec, i) => (
//                           <Flex
//                             key={i}
//                             align="center"
//                             justify="space-between"
//                             bg="#f0f7ff"
//                             borderRadius="8px"
//                             border="1px solid #bfdbfe"
//                             px={3}
//                             py={2}
//                           >
//                             <Flex align="center" gap={2}>
//                               <Flex
//                                 w="20px"
//                                 h="20px"
//                                 bg="#2563eb"
//                                 borderRadius="5px"
//                                 align="center"
//                                 justify="center"
//                               >
//                                 <Text
//                                   fontSize="9px"
//                                   fontWeight={900}
//                                   color="white"
//                                 >
//                                   {i + 1}
//                                 </Text>
//                               </Flex>
//                               <Text
//                                 fontSize="12px"
//                                 fontWeight={700}
//                                 color="#1e40af"
//                                 textTransform="capitalize"
//                               >
//                                 {sec.subject}
//                               </Text>
//                             </Flex>
//                             <Text
//                               fontSize="11px"
//                               color="#2563eb"
//                               fontWeight={600}
//                             >
//                               {sec.totalQuestions} Q
//                             </Text>
//                           </Flex>
//                         ))}
//                       </Stack>
//                     </Box>
//                   )}

//                   {fullRequest?.instructions && (
//                     <Box
//                       bg="#fffbeb"
//                       border="1px solid #fde68a"
//                       borderRadius="10px"
//                       p={3}
//                       mb={5}
//                     >
//                       <Text
//                         fontSize="10px"
//                         fontWeight={800}
//                         color="#92400e"
//                         textTransform="uppercase"
//                         letterSpacing=".6px"
//                         mb={1}
//                       >
//                         Instructions
//                       </Text>
//                       <Text fontSize="12px" color="#78350f" lineHeight={1.7}>
//                         {fullRequest.instructions}
//                       </Text>
//                     </Box>
//                   )}

//                   {/* Attachments */}
//                   {fullRequest?.attachments?.length > 0 && (
//                     <Box>
//                       <Text
//                         fontSize="11px"
//                         fontWeight={800}
//                         color="#94a3b8"
//                         textTransform="uppercase"
//                         letterSpacing="2px"
//                         mb={3}
//                       >
//                         Uploaded Files ({fullRequest.attachments.length})
//                       </Text>
//                       <Stack spacing={3}>
//                         {fullRequest.attachments.map((att, i) => (
//                           <Box
//                             key={i}
//                             bg="#f8fafc"
//                             borderRadius="12px"
//                             border="1px solid #e2e8f0"
//                             overflow="hidden"
//                           >
//                             <Flex
//                               align="center"
//                               gap={2}
//                               px={3}
//                               py={3}
//                               cursor="pointer"
//                               _hover={{ bg: "#f0f7ff" }}
//                               transition="background .15s"
//                               onClick={() => handlePreviewFile(att)}
//                               borderBottom="1px solid #e2e8f0"
//                             >
//                               <FileIcon type={att.fileType} size="18px" />
//                               <Box flex={1} minW={0}>
//                                 <Text
//                                   fontSize="12px"
//                                   fontWeight={700}
//                                   color="#0f172a"
//                                   noOfLines={1}
//                                 >
//                                   {att.fileName}
//                                 </Text>
//                                 <Text fontSize="10px" color="#94a3b8">
//                                   {att.fileType?.toUpperCase()} · click to
//                                   preview
//                                 </Text>
//                               </Box>
//                               <Icon
//                                 as={FaExpand}
//                                 fontSize="10px"
//                                 color="#94a3b8"
//                                 flexShrink={0}
//                               />
//                             </Flex>
//                             {att.fileType === "image" && (
//                               <Box
//                                 cursor="pointer"
//                                 onClick={() => handlePreviewFile(att)}
//                                 overflow="hidden"
//                                 maxH="160px"
//                                 position="relative"
//                                 _hover={{ opacity: 0.85 }}
//                                 transition="opacity .15s"
//                               >
//                                 <img
//                                   src={`data:image/jpeg;base64,${att.fileData}`}
//                                   alt={att.fileName}
//                                   style={{
//                                     width: "100%",
//                                     maxHeight: "160px",
//                                     objectFit: "cover",
//                                     background: "#f1f5f9",
//                                     display: "block",
//                                   }}
//                                 />
//                               </Box>
//                             )}
//                             {att.fileType === "pdf" && (
//                               <Box
//                                 cursor="pointer"
//                                 onClick={() => handlePreviewFile(att)}
//                                 h="80px"
//                                 overflow="hidden"
//                                 position="relative"
//                                 _hover={{ opacity: 0.85 }}
//                                 transition="opacity .15s"
//                               >
//                                 <iframe
//                                   src={`data:application/pdf;base64,${att.fileData}`}
//                                   width="100%"
//                                   height="400px"
//                                   style={{
//                                     border: "none",
//                                     pointerEvents: "none",
//                                     marginTop: "-10px",
//                                   }}
//                                   title={att.fileName}
//                                 />
//                                 <Box
//                                   position="absolute"
//                                   inset={0}
//                                   bg="transparent"
//                                 />
//                               </Box>
//                             )}
//                             <Flex gap={2} p={3}>
//                               <Button
//                                 size="xs"
//                                 flex={1}
//                                 h="30px"
//                                 leftIcon={<Icon as={FaEye} fontSize="10px" />}
//                                 onClick={() => handlePreviewFile(att)}
//                                 bg="#eff6ff"
//                                 color="#2563eb"
//                                 borderRadius="7px"
//                                 fontWeight={700}
//                                 fontSize="11px"
//                                 _hover={{ bg: "#dbeafe" }}
//                               >
//                                 View
//                               </Button>
//                               <Button
//                                 size="xs"
//                                 flex={1}
//                                 h="30px"
//                                 leftIcon={
//                                   <Icon as={FaDownload} fontSize="10px" />
//                                 }
//                                 onClick={() => downloadFile(att)}
//                                 bg="#f0fdf4"
//                                 color="#15803d"
//                                 borderRadius="7px"
//                                 fontWeight={700}
//                                 fontSize="11px"
//                                 _hover={{ bg: "#dcfce7" }}
//                               >
//                                 Download
//                               </Button>
//                               {!isSectionedRequest && (
//                                 <Button
//                                   size="xs"
//                                   flex={1}
//                                   h="30px"
//                                   leftIcon={
//                                     <Icon as={FaRobot} fontSize="10px" />
//                                   }
//                                   onClick={() => generateFromFile(att)}
//                                   isLoading={aiLoading}
//                                   bg="#f5f3ff"
//                                   color="#7c3aed"
//                                   borderRadius="7px"
//                                   fontWeight={700}
//                                   fontSize="11px"
//                                   _hover={{ bg: "#ede9fe" }}
//                                 >
//                                   AI
//                                 </Button>
//                               )}
//                             </Flex>
//                           </Box>
//                         ))}
//                       </Stack>
//                     </Box>
//                   )}
//                 </Box>

//                 {/* RIGHT PANEL — AI + question editor */}
//                 <Box
//                   flex={1}
//                   p={6}
//                   overflowY="auto"
//                   maxH={{ lg: "calc(100vh - 200px)" }}
//                 >
//                   {/* AI prompt — only shown for non-sectioned, or as general reference */}
//                   {!isSectionedRequest && (
//                     <Box
//                       bg="linear-gradient(135deg,#f5f3ff,#ede9fe)"
//                       border="1px solid #c4b5fd"
//                       borderRadius="14px"
//                       p={5}
//                       mb={6}
//                     >
//                       <Flex align="center" gap={2} mb={3}>
//                         <Icon as={FaRobot} color="#7c3aed" fontSize="16px" />
//                         <Text fontSize="13px" fontWeight={800} color="#4c1d95">
//                           AI Question Generator
//                         </Text>
//                       </Flex>
//                       <Textarea
//                         value={aiPrompt}
//                         onChange={(e) => setAiPrompt(e.target.value)}
//                         placeholder="Describe what questions you want to generate…"
//                         borderRadius="10px"
//                         fontSize="13px"
//                         rows={3}
//                         resize="vertical"
//                         mb={3}
//                         bg="white"
//                         borderColor="#c4b5fd"
//                         _focus={{
//                           borderColor: "#7c3aed",
//                           boxShadow: "0 0 0 1px #7c3aed",
//                         }}
//                       />
//                       <Button
//                         leftIcon={<FaRobot />}
//                         onClick={generateWithAI}
//                         isLoading={aiLoading}
//                         loadingText="Generating questions…"
//                         bg="#7c3aed"
//                         color="white"
//                         borderRadius="10px"
//                         fontWeight={800}
//                         fontSize="13px"
//                         h="42px"
//                         _hover={{ bg: "#6d28d9" }}
//                         w={{ base: "full", sm: "auto" }}
//                       >
//                         Generate {fullRequest?.totalQuestions || 20} Questions
//                         with AI
//                       </Button>
//                       {questions.length > 0 && (
//                         <Text
//                           fontSize="12px"
//                           color="#6d28d9"
//                           mt={2}
//                           fontWeight={600}
//                         >
//                           ✓ {questions.length} questions ready — review below
//                           before sending
//                         </Text>
//                       )}
//                     </Box>
//                   )}

//                   {/* SECTIONED: per-section editors */}
//                   {isSectionedRequest ? (
//                     <Box>
//                       <Flex align="center" gap={2} mb={5}>
//                         <Icon
//                           as={FaLayerGroup}
//                           color="#2563eb"
//                           fontSize="16px"
//                         />
//                         <Text fontSize="15px" fontWeight={800} color="#0f172a">
//                           Section Question Editors
//                         </Text>
//                         <Text fontSize="12px" color="#94a3b8">
//                           · {totalSectionQCount} questions added across{" "}
//                           {fullRequest?.sections?.length} sections
//                         </Text>
//                       </Flex>
//                       {fullRequest?.sections?.map((sec, sIdx) => (
//                         <SectionEditor
//                           key={sIdx}
//                           section={sec}
//                           sectionIdx={sIdx}
//                           sectionQuestions={sectionQuestions}
//                           setSectionQuestions={setSectionQuestions}
//                           fullRequest={fullRequest}
//                           aiLoading={aiLoading}
//                           setAiLoading={setAiLoading}
//                           toast={toast}
//                         />
//                       ))}
//                     </Box>
//                   ) : (
//                     /* NON-SECTIONED: flat editor */
//                     <Box>
//                       <Flex justify="space-between" align="center" mb={4}>
//                         <Text
//                           fontSize="11px"
//                           fontWeight={800}
//                           color="#94a3b8"
//                           textTransform="uppercase"
//                           letterSpacing="2px"
//                         >
//                           Questions ({questions.length})
//                         </Text>
//                         <Button
//                           size="sm"
//                           leftIcon={<FaPlus />}
//                           onClick={addBlankQuestion}
//                           variant="outline"
//                           borderRadius="8px"
//                           fontSize="12px"
//                           fontWeight={700}
//                           borderColor="#4a72b8"
//                           color="#4a72b8"
//                         >
//                           Add Manually
//                         </Button>
//                       </Flex>
//                       {questions.length === 0 ? (
//                         <Box
//                           py={12}
//                           textAlign="center"
//                           bg="#f8fafc"
//                           borderRadius="14px"
//                           border="2px dashed #e2e8f0"
//                         >
//                           <Icon
//                             as={FaClipboardList}
//                             fontSize="36px"
//                             color="#e2e8f0"
//                             display="block"
//                             mx="auto"
//                             mb={3}
//                           />
//                           <Text
//                             fontSize="14px"
//                             color="#94a3b8"
//                             fontWeight={600}
//                           >
//                             No questions yet — use AI or add manually
//                           </Text>
//                         </Box>
//                       ) : (
//                         questions.map((q, idx) => (
//                           <QuestionRow
//                             key={idx}
//                             q={q}
//                             idx={idx}
//                             onChange={updateQuestion}
//                             onDelete={deleteQuestion}
//                           />
//                         ))
//                       )}
//                     </Box>
//                   )}
//                 </Box>
//               </Flex>
//             )}
//           </ModalBody>

//           {selected?.status !== "completed" && (
//             <ModalFooter
//               px={7}
//               py={5}
//               borderTop="1px solid #f1f5f9"
//               gap={3}
//               flexWrap="wrap"
//             >
//               <Textarea
//                 value={adminNote}
//                 onChange={(e) => setAdminNote(e.target.value)}
//                 placeholder="Optional note for the coaching…"
//                 borderRadius="10px"
//                 fontSize="13px"
//                 rows={2}
//                 resize="none"
//                 flex={1}
//                 minW={{ base: "100%", md: "300px" }}
//                 borderColor="#e2e8f0"
//                 _focus={{
//                   borderColor: "#4a72b8",
//                   boxShadow: "0 0 0 1px #4a72b8",
//                 }}
//               />
//               <Flex gap={3} flexShrink={0}>
//                 <Button
//                   h="46px"
//                   borderRadius="12px"
//                   bg="#fee2e2"
//                   color="#dc2626"
//                   fontWeight={700}
//                   fontSize="13px"
//                   leftIcon={<FaTimesCircle />}
//                   onClick={() => {
//                     setRejectReason("");
//                     openReject();
//                   }}
//                   _hover={{ bg: "#fecaca" }}
//                 >
//                   Reject
//                 </Button>
//                 <Button
//                   h="46px"
//                   borderRadius="12px"
//                   bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
//                   color="white"
//                   fontWeight={800}
//                   fontSize="14px"
//                   leftIcon={<FaPaperPlane />}
//                   isLoading={acting}
//                   loadingText="Sending…"
//                   isDisabled={
//                     isSectionedRequest
//                       ? sectionQuestions.some((sq) => sq.questions.length === 0)
//                       : questions.length === 0
//                   }
//                   onClick={handleSendTest}
//                   _hover={{ opacity: 0.9 }}
//                   px={8}
//                 >
//                   {isSectionedRequest
//                     ? `Send Test (${totalSectionQCount} Q, ${fullRequest?.sections?.length} sections)`
//                     : `Send Test (${questions.length} Q)`}
//                 </Button>
//               </Flex>
//             </ModalFooter>
//           )}
//         </ModalContent>
//       </Modal>

//       <FilePreviewModal
//         attachment={previewFile}
//         isOpen={previewOpen}
//         onClose={closePreview}
//       />

//       {/* Reject dialog */}
//       <AlertDialog
//         isOpen={rejectOpen}
//         leastDestructiveRef={cancelRef}
//         onClose={closeReject}
//         isCentered
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent
//             mx={4}
//             borderRadius="16px"
//             fontFamily="'Sora',sans-serif"
//           >
//             <AlertDialogHeader fontSize="16px" fontWeight={800}>
//               Reject Request
//             </AlertDialogHeader>
//             <AlertDialogBody>
//               <Text fontSize="14px" color="#475569" mb={3}>
//                 Provide a reason so the coaching knows what to change:
//               </Text>
//               <Textarea
//                 value={rejectReason}
//                 onChange={(e) => setRejectReason(e.target.value)}
//                 placeholder="e.g. Please provide more specific topic details…"
//                 borderRadius="10px"
//                 rows={3}
//                 fontSize="13px"
//                 borderColor="#e2e8f0"
//                 _focus={{
//                   borderColor: "#ef4444",
//                   boxShadow: "0 0 0 1px #ef4444",
//                 }}
//               />
//             </AlertDialogBody>
//             <AlertDialogFooter gap={3}>
//               <Button
//                 ref={cancelRef}
//                 onClick={closeReject}
//                 variant="ghost"
//                 borderRadius="10px"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 bg="#ef4444"
//                 color="white"
//                 borderRadius="10px"
//                 fontWeight={700}
//                 _hover={{ bg: "#dc2626" }}
//                 isLoading={acting}
//                 onClick={handleReject}
//                 leftIcon={<FaTimesCircle />}
//               >
//                 Reject Request
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </Box>
//   );
// }





// ----------------------down




// /**
//  * AdminTestRequestsPage.jsx
//  * Test-creation requests from coaching owners.
//  * AI question generation (flat + per-section), file preview, send/reject.
//  * Now uses AdminNavPage for consistent layout.
//  */
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Box, Flex, Text, Input, Button, Icon, Spinner, Badge, Select,
//   Textarea, useToast, Stack, Divider, Modal, ModalOverlay, ModalContent,
//   ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure,
//   InputGroup, InputLeftElement, AlertDialog, AlertDialogOverlay,
//   AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
//   Grid,
// } from "@chakra-ui/react";
// import {
//   FaSearch, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaRobot,
//   FaPlus, FaTrash, FaClipboardList, FaFilePdf, FaFileImage, FaFileExcel,
//   FaDownload, FaCheck, FaPaperPlane, FaHourglass, FaExpand, FaTimes,
//   FaLayerGroup, FaSyncAlt,
// } from "react-icons/fa";
// import { apiFetch } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import AdminNavPage from "./AdminNavPage";

// const StatusBadge = ({ status }) => {
//   const cfg = {
//     pending:    { bg: "#fef9c3", color: "#a16207", icon: FaHourglass,    label: "Pending" },
//     processing: { bg: "#eff6ff", color: "#1d4ed8", icon: FaClock,        label: "Processing" },
//     completed:  { bg: "#dcfce7", color: "#15803d", icon: FaCheckCircle,  label: "Completed" },
//     rejected:   { bg: "#fee2e2", color: "#dc2626", icon: FaTimesCircle,  label: "Rejected" },
//   };
//   const c = cfg[status] || cfg.pending;
//   return (
//     <Flex align="center" gap={1.5} bg={c.bg} color={c.color} px={3} py="4px" borderRadius="full" fontSize="11px" fontWeight={700} w="fit-content">
//       <Icon as={c.icon} fontSize="10px" />{c.label}
//     </Flex>
//   );
// };

// const FileIcon = ({ type, size = "16px" }) => {
//   const map = { pdf: FaFilePdf, image: FaFileImage, excel: FaFileExcel };
//   const colors = { pdf: "#ef4444", image: "#8b5cf6", excel: "#16a34a" };
//   const Ic = map[type] || FaClipboardList;
//   return <Icon as={Ic} color={colors[type] || "#64748b"} fontSize={size} />;
// };

// const downloadFile = (att) => {
//   try {
//     const mimeMap = { pdf: "application/pdf", image: "image/jpeg", excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
//     const mime = mimeMap[att.fileType] || "application/octet-stream";
//     const byteChars = atob(att.fileData);
//     const byteArrays = [];
//     for (let offset = 0; offset < byteChars.length; offset += 512) {
//       const slice = byteChars.slice(offset, offset + 512);
//       byteArrays.push(new Uint8Array(slice.length).map((_, i) => slice.charCodeAt(i)));
//     }
//     const blob = new Blob(byteArrays, { type: mime });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = att.fileName || `attachment.${att.fileType === "image" ? "jpg" : att.fileType}`;
//     a.click();
//     URL.revokeObjectURL(url);
//   } catch {
//     window.open(`data:application/octet-stream;base64,${att.fileData}`, "_blank");
//   }
// };

// function FilePreviewModal({ attachment, isOpen, onClose }) {
//   if (!attachment) return null;
//   const { fileType, fileData, fileName } = attachment;
//   return (
//     <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered scrollBehavior="inside">
//       <ModalOverlay backdropFilter="blur(6px)" bg="rgba(0,0,0,.7)" />
//       <ModalContent borderRadius="16px" overflow="hidden" fontFamily="'Sora',sans-serif" maxH="90vh" mx={4}>
//         <ModalHeader px={6} py={4} bg="linear-gradient(135deg,#0f1e3a,#1e3a5f)" color="white" borderRadius="16px 16px 0 0">
//           <Flex align="center" justify="space-between">
//             <Flex align="center" gap={3}>
//               <FileIcon type={fileType} size="20px" />
//               <Box>
//                 <Text fontSize="14px" fontWeight={800} noOfLines={1} maxW="500px">{fileName}</Text>
//                 <Text fontSize="11px" color="rgba(255,255,255,.5)" textTransform="uppercase">{fileType} file</Text>
//               </Box>
//             </Flex>
//             <Flex gap={2}>
//               <Button size="sm" h="34px" px={4} bg="rgba(255,255,255,.12)" color="white" borderRadius="8px" fontWeight={700} fontSize="12px"
//                 leftIcon={<Icon as={FaDownload} fontSize="11px" />} onClick={() => downloadFile(attachment)} _hover={{ bg: "rgba(255,255,255,.2)" }}>
//                 Download
//               </Button>
//               <Button size="sm" h="34px" w="34px" p={0} bg="rgba(255,255,255,.12)" color="white" borderRadius="8px" onClick={onClose} _hover={{ bg: "rgba(255,255,255,.2)" }}>
//                 <Icon as={FaTimes} fontSize="12px" />
//               </Button>
//             </Flex>
//           </Flex>
//         </ModalHeader>
//         <ModalBody p={0} bg="#0f172a" minH="400px" display="flex" alignItems="center" justifyContent="center">
//           {fileType === "image" && (
//             <Box w="100%" textAlign="center" p={4}>
//               <img src={`data:image/jpeg;base64,${fileData}`} alt={fileName} style={{ maxWidth: "100%", maxHeight: "75vh", objectFit: "contain", borderRadius: "8px" }} />
//             </Box>
//           )}
//           {fileType === "pdf" && (
//             <Box w="100%" h="75vh">
//               <iframe src={`data:application/pdf;base64,${fileData}`} width="100%" height="100%" style={{ border: "none" }} title={fileName} />
//             </Box>
//           )}
//           {fileType === "excel" && (
//             <Flex direction="column" align="center" gap={5} py={16} color="white">
//               <Icon as={FaFileExcel} fontSize="64px" color="#16a34a" />
//               <Box textAlign="center">
//                 <Text fontSize="16px" fontWeight={700} mb={6}>{fileName}</Text>
//                 <Button h="46px" px={8} borderRadius="12px" bg="#16a34a" color="white" fontWeight={800}
//                   leftIcon={<Icon as={FaDownload} />} onClick={() => downloadFile(attachment)} _hover={{ bg: "#15803d" }}>
//                   Download to View
//                 </Button>
//               </Box>
//             </Flex>
//           )}
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// }

// function QuestionRow({ q, idx, onChange, onDelete }) {
//   const sf = (k) => (e) => onChange(idx, { ...q, [k]: e.target.value });
//   const sfOpt = (oi) => (e) => { const opts = [...(q.options || ["", "", "", ""])]; opts[oi] = e.target.value; onChange(idx, { ...q, options: opts }); };
//   return (
//     <Box bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0" p={4} mb={3}>
//       <Flex justify="space-between" align="flex-start" mb={2}>
//         <Text fontSize="11px" fontWeight={800} color="#94a3b8" textTransform="uppercase" letterSpacing=".8px">Q{idx + 1}</Text>
//         <Box as="button" onClick={() => onDelete(idx)} p="4px" borderRadius="6px" color="#ef4444" _hover={{ bg: "#fef2f2" }}>
//           <Icon as={FaTrash} fontSize="11px" />
//         </Box>
//       </Flex>
//       <Textarea value={q.qus || ""} onChange={sf("qus")} placeholder="Question text…" borderRadius="8px" fontSize="13px" rows={2} resize="vertical" mb={3} borderColor="#e2e8f0" _focus={{ borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" }} />
//       <Flex gap={2} flexWrap="wrap" mb={3}>
//         {(q.options || ["", "", "", ""]).map((opt, oi) => (
//           <Flex key={oi} align="center" gap={2} flex="1" minW="48%">
//             <Flex w="22px" h="22px" bg={q.answer === oi ? "#dcfce7" : "#f1f5f9"} color={q.answer === oi ? "#15803d" : "#64748b"}
//               borderRadius="6px" align="center" justify="center" fontSize="10px" fontWeight={800} flexShrink={0}
//               cursor="pointer" border={q.answer === oi ? "1.5px solid #15803d" : "1.5px solid transparent"}
//               onClick={() => onChange(idx, { ...q, answer: oi })}>
//               {["A", "B", "C", "D"][oi]}
//             </Flex>
//             <Input value={opt} onChange={sfOpt(oi)} placeholder={`Option ${["A", "B", "C", "D"][oi]}…`} borderRadius="8px" h="36px" fontSize="13px" borderColor={q.answer === oi ? "#16a34a" : "#e2e8f0"} bg={q.answer === oi ? "#f0fdf4" : "white"} _focus={{ borderColor: "#4a72b8" }} />
//           </Flex>
//         ))}
//       </Flex>
//       <Input value={q.explanation || ""} onChange={sf("explanation")} placeholder="Explanation (optional)…" borderRadius="8px" h="36px" fontSize="12px" borderColor="#e2e8f0" color="#64748b" _focus={{ borderColor: "#4a72b8" }} />
//     </Box>
//   );
// }

// function SectionEditor({ section, sectionIdx, sectionQuestions, setSectionQuestions, fullRequest, aiLoading, setAiLoading, toast }) {
//   const sq = sectionQuestions[sectionIdx] || { questions: [] };
//   const setSecQ = (qs) => setSectionQuestions((prev) => prev.map((s, i) => i === sectionIdx ? { questions: qs } : s));

//   const generateSectionAI = async () => {
//     setAiLoading(true);
//     try {
//       const systemPrompt = `You are an expert question paper setter for Indian competitive exams. Generate exactly ${section.totalQuestions} high-quality MCQs for the subject: ${section.subject}. Exam: ${fullRequest.examType}. Difficulty: ${fullRequest.difficulty}. Return ONLY valid JSON array, no markdown: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]`;
//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 6000, system: systemPrompt, messages: [{ role: "user", content: `Generate ${section.totalQuestions} MCQs for ${section.subject}` }] }),
//       });
//       const data = await response.json();
//       const text = data.content?.map((c) => c.text || "").join("") || "";
//       const clean = text.replace(/```json|```/g, "").trim();
//       const match = clean.match(/\[[\s\S]*\]/);
//       const parsed = match ? JSON.parse(match[0]) : JSON.parse(clean);
//       const normalised = parsed.map((q) => ({ qus: q.qus || q.question || "", options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"], answer: typeof q.answer === "number" ? q.answer : 0, explanation: q.explanation || "" }));
//       setSecQ(normalised);
//       toast({ title: `✅ ${normalised.length} questions for ${section.subject}!`, status: "success", duration: 3000 });
//     } catch (err) {
//       toast({ title: `AI Error: ${err.message}`, status: "error", duration: 4000 });
//     } finally { setAiLoading(false); }
//   };

//   return (
//     <Box mb={6} bg="#f8fafc" borderRadius="14px" border="1px solid #e2e8f0" overflow="hidden">
//       <Flex align="center" justify="space-between" px={5} py={3} bg="white" borderBottom="1px solid #e2e8f0">
//         <Flex align="center" gap={2}>
//           <Flex w="26px" h="26px" bg="#eff6ff" borderRadius="7px" align="center" justify="center">
//             <Text fontSize="11px" fontWeight={900} color="#2563eb">{sectionIdx + 1}</Text>
//           </Flex>
//           <Text fontSize="13px" fontWeight={800} color="#0f172a" textTransform="capitalize">{section.subject || `Section ${sectionIdx + 1}`}</Text>
//           <Text fontSize="11px" color="#94a3b8">· {section.totalQuestions} questions requested</Text>
//         </Flex>
//         <Flex align="center" gap={2}>
//           <Text fontSize="11px" fontWeight={700} color={sq.questions.length >= section.totalQuestions ? "#16a34a" : "#d97706"}>{sq.questions.length}/{section.totalQuestions} added</Text>
//           <Button size="xs" leftIcon={<Icon as={FaRobot} fontSize="9px" />} onClick={generateSectionAI} isLoading={aiLoading} bg="#f5f3ff" color="#7c3aed" borderRadius="7px" fontWeight={700} fontSize="11px" _hover={{ bg: "#ede9fe" }}>AI Generate</Button>
//           <Button size="xs" leftIcon={<Icon as={FaPlus} fontSize="9px" />} onClick={() => setSecQ([...sq.questions, { qus: "", options: ["", "", "", ""], answer: 0, explanation: "" }])} bg="#eff6ff" color="#2563eb" borderRadius="7px" fontWeight={700} fontSize="11px" _hover={{ bg: "#dbeafe" }}>Add</Button>
//         </Flex>
//       </Flex>
//       <Box p={4}>
//         {sq.questions.length === 0 ? (
//           <Box py={8} textAlign="center" bg="white" borderRadius="10px" border="2px dashed #e2e8f0">
//             <Text fontSize="13px" color="#94a3b8">No questions yet — use AI Generate or Add manually</Text>
//           </Box>
//         ) : sq.questions.map((q, qi) => (
//           <QuestionRow key={qi} q={q} idx={qi}
//             onChange={(i, updated) => setSecQ(sq.questions.map((qq, ii) => ii === i ? updated : qq))}
//             onDelete={(i) => setSecQ(sq.questions.filter((_, ii) => ii !== i))}
//           />
//         ))}
//       </Box>
//     </Box>
//   );
// }

// export default function AdminTestRequestsPage() {
//   const toast = useToast();
//   const cancelRef = useRef();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const { isOpen: rejectOpen, onOpen: openReject, onClose: closeReject } = useDisclosure();
//   const { isOpen: previewOpen, onOpen: openPreview, onClose: closePreview } = useDisclosure();

//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState("pending");
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState(null);
//   const [fullRequest, setFullRequest] = useState(null);
//   const [loadingDetail, setLoadingDetail] = useState(false);
//   const [previewFile, setPreviewFile] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [sectionQuestions, setSectionQuestions] = useState([]);
//   const [adminNote, setAdminNote] = useState("");
//   const [rejectReason, setRejectReason] = useState("");
//   const [acting, setActing] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiPrompt, setAiPrompt] = useState("");

//   const loadRequests = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (statusFilter) params.set("status", statusFilter);
//       if (search.trim()) params.set("search", search.trim());
//       const res = await apiFetch(`/test-requests/admin/all?${params}`);
//       setRequests(res.data ?? []);
//     } catch (err) { toast({ title: err.message, status: "error", duration: 3000 }); }
//     finally { setLoading(false); }
//   }, [statusFilter, search]);

//   useEffect(() => { loadRequests(); }, [loadRequests]);

//   const openDetail = async (req) => {
//     setSelected(req); setQuestions([]); setSectionQuestions([]); setAdminNote(""); setAiPrompt(""); onOpen(); setLoadingDetail(true);
//     try {
//       const res = await apiFetch(`/test-requests/admin/${req._id}`);
//       setFullRequest(res.data);
//       if (res.data.isSectioned && res.data.sections?.length) setSectionQuestions(res.data.sections.map(() => ({ questions: [] })));
//       setAiPrompt(`Create ${res.data.totalQuestions} multiple choice questions for ${res.data.examType} exam.${res.data.subject ? ` Subject: ${res.data.subject}.` : ""} Difficulty: ${res.data.difficulty}.${res.data.instructions ? ` Special instructions: ${res.data.instructions}` : ""}`);
//       if (req.status === "pending") {
//         await apiFetch(`/test-requests/admin/${req._id}/processing`, { method: "PATCH" });
//         setRequests((prev) => prev.map((r) => r._id === req._id ? { ...r, status: "processing" } : r));
//       }
//     } catch { toast({ title: "Failed to load request details", status: "error" }); }
//     finally { setLoadingDetail(false); }
//   };

//   const generateWithAI = async () => {
//     if (!fullRequest) return;
//     setAiLoading(true);
//     try {
//       const systemPrompt = `You are an expert question paper setter for Indian competitive exams. Generate exactly ${fullRequest.totalQuestions} high-quality multiple choice questions. Format: Return ONLY valid JSON array, no markdown, no explanation outside JSON. Each question: { "qus": "question text", "options": ["A text","B text","C text","D text"], "answer": 0, "explanation": "brief explanation" } answer is 0-indexed (0=A, 1=B, 2=C, 3=D).`;
//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8000, system: systemPrompt, messages: [{ role: "user", content: aiPrompt }] }),
//       });
//       const data = await response.json();
//       const text = data.content?.map((c) => c.text || "").join("") || "";
//       const clean = text.replace(/```json|```/g, "").trim();
//       let parsed;
//       try { parsed = JSON.parse(clean); } catch { const m = clean.match(/\[[\s\S]*\]/); if (m) parsed = JSON.parse(m[0]); else throw new Error("Could not parse AI response as JSON"); }
//       if (!Array.isArray(parsed) || !parsed.length) throw new Error("AI returned empty questions");
//       const normalised = parsed.map((q) => ({ qus: q.qus || q.question || "", options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"], answer: typeof q.answer === "number" ? q.answer : 0, explanation: q.explanation || "" }));
//       setQuestions(normalised);
//       toast({ title: `✅ ${normalised.length} questions generated!`, description: "Review and edit before sending.", status: "success", duration: 4000 });
//     } catch (err) { toast({ title: `AI Error: ${err.message}`, status: "error", duration: 5000 }); }
//     finally { setAiLoading(false); }
//   };

//   const generateFromFile = async (attachment) => {
//     if (!fullRequest) return;
//     setAiLoading(true);
//     try {
//       let messages;
//       if (attachment.fileType === "image") {
//         messages = [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: attachment.fileData } }, { type: "text", text: `Based on this study material, create ${fullRequest.totalQuestions} MCQs for ${fullRequest.examType} exam. Difficulty: ${fullRequest.difficulty}. Return ONLY JSON array: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]` }] }];
//       } else if (attachment.fileType === "pdf") {
//         messages = [{ role: "user", content: [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: attachment.fileData } }, { type: "text", text: `Based on this PDF, create ${fullRequest.totalQuestions} MCQs for ${fullRequest.examType} exam. Difficulty: ${fullRequest.difficulty}. ${fullRequest.instructions || ""}. Return ONLY JSON array: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]` }] }];
//       } else { toast({ title: "For Excel files, use the AI prompt instead", status: "info" }); setAiLoading(false); return; }
//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST", headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8000, messages }),
//       });
//       const data = await response.json();
//       const text = data.content?.map((c) => c.text || "").join("") || "";
//       const clean = text.replace(/```json|```/g, "").trim();
//       const match = clean.match(/\[[\s\S]*\]/);
//       const parsed = match ? JSON.parse(match[0]) : JSON.parse(clean);
//       const normalised = parsed.map((q) => ({ qus: q.qus || q.question || "", options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"], answer: typeof q.answer === "number" ? q.answer : 0, explanation: q.explanation || "" }));
//       setQuestions(normalised);
//       toast({ title: `✅ ${normalised.length} questions generated from file!`, status: "success", duration: 4000 });
//     } catch (err) { toast({ title: `Error: ${err.message}`, status: "error", duration: 5000 }); }
//     finally { setAiLoading(false); }
//   };

//   const handleSendTest = async () => {
//     if (!selected) return;
//     const isSectioned = fullRequest?.isSectioned === true;
//     if (isSectioned) {
//       for (let sIdx = 0; sIdx < (fullRequest.sections?.length || 0); sIdx++) {
//         const sq = sectionQuestions[sIdx];
//         if (!sq || sq.questions.length === 0) { toast({ title: `Section "${fullRequest.sections[sIdx]?.subject || sIdx + 1}" has no questions`, status: "warning" }); return; }
//         const invalid = sq.questions.findIndex((q) => !q.qus?.trim() || q.options.some((o) => !o?.trim()));
//         if (invalid !== -1) { toast({ title: `Section "${fullRequest.sections[sIdx]?.subject}" — Q${invalid + 1} is incomplete`, status: "warning" }); return; }
//       }
//     } else {
//       if (!questions.length) { toast({ title: "Add at least 1 question before sending", status: "warning" }); return; }
//       const invalid = questions.findIndex((q) => !q.qus?.trim() || q.options.some((o) => !o?.trim()));
//       if (invalid !== -1) { toast({ title: `Question ${invalid + 1} is incomplete`, status: "warning" }); return; }
//     }
//     setActing(true);
//     try {
//       const body = isSectioned
//         ? { sections: sectionQuestions.map((sq, i) => ({ name: fullRequest.sections[i]?.subject || `Section ${i + 1}`, subject: fullRequest.sections[i]?.subject || "", questions: sq.questions })), adminNote }
//         : { questions, adminNote };
//       const res = await apiFetch(`/test-requests/admin/${selected._id}/create-test`, { method: "POST", body: JSON.stringify(body) });
//       toast({ title: res.message, status: "success", duration: 5000 });
//       onClose();
//       loadRequests();
//     } catch (err) { toast({ title: err.message, status: "error", duration: 4000 }); }
//     finally { setActing(false); }
//   };

//   const handleReject = async () => {
//     if (!selected || !rejectReason.trim()) { toast({ title: "Please provide a rejection reason", status: "warning" }); return; }
//     setActing(true);
//     try {
//       await apiFetch(`/test-requests/admin/${selected._id}/reject`, { method: "PATCH", body: JSON.stringify({ adminNote: rejectReason }) });
//       toast({ title: "Request rejected", status: "info", duration: 3000 });
//       closeReject(); onClose(); loadRequests();
//     } catch (err) { toast({ title: err.message, status: "error" }); }
//     finally { setActing(false); }
//   };

//   const isSectionedRequest = fullRequest?.isSectioned === true;
//   const totalSectionQCount = sectionQuestions.reduce((s, sq) => s + (sq.questions?.length || 0), 0);

//   return (
//     <AdminNavPage title="Test Creation Requests" subtitle="Admin Panel">
//       {/* Filters */}
//       <Flex gap={3} mb={5} flexWrap={{ base: "wrap", md: "nowrap" }}>
//         <InputGroup flex={1}>
//           <InputLeftElement pointerEvents="none" h="full" pl={3}>
//             <Icon as={FaSearch} color="gray.400" fontSize="13px" />
//           </InputLeftElement>
//           <Input placeholder="Search by title or exam…" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadRequests()}
//             bg="white" borderRadius="10px" h="42px" fontSize="14px" pl="38px" border="1px solid #e2e8f0" _focus={{ borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" }} />
//         </InputGroup>
//         <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} bg="white" borderRadius="10px" h="42px" minW="160px" maxW="160px" fontSize="13px" fontWeight={600} border="1px solid #e2e8f0">
//           <option value="">All Statuses</option>
//           <option value="pending">⏳ Pending</option>
//           <option value="processing">🔄 Processing</option>
//           <option value="completed">✅ Completed</option>
//           <option value="rejected">❌ Rejected</option>
//         </Select>
//         <Button onClick={loadRequests} bg="#4a72b8" color="white" borderRadius="10px" h="42px" px={5} fontSize="13px" fontWeight={700}
//           leftIcon={<Icon as={FaSyncAlt} fontSize="11px" />} _hover={{ opacity: 0.9 }}>Search</Button>
//       </Flex>

//       {/* Table */}
//       {loading ? (
//         <Flex justify="center" py={20}><Spinner color="#4a72b8" thickness="3px" size="xl" /></Flex>
//       ) : requests.length === 0 ? (
//         <Box py={20} textAlign="center" bg="white" borderRadius="16px" border="1px solid #e2e8f0">
//           <Icon as={FaClipboardList} fontSize="48px" color="#e2e8f0" display="block" mx="auto" mb={4} />
//           <Text fontSize="15px" fontWeight={700} color="#94a3b8">No requests found</Text>
//         </Box>
//       ) : (
//         <Box bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden">
//           <Flex px={6} py={3} bg="#f8fafc" borderBottom="1px solid #e2e8f0" display={{ base: "none", md: "flex" }}>
//             {[["Request", 3], ["Coaching", 2], ["Details", 2], ["Date", 2], ["Status", 2], ["", 1]].map(([h, f]) => (
//               <Text key={h} flex={f} fontSize="11px" fontWeight={700} color="#94a3b8" textTransform="uppercase" letterSpacing=".8px">{h}</Text>
//             ))}
//           </Flex>
//           {requests.map((r, idx) => (
//             <Flex key={r._id} px={6} py={4} align="center" gap={3}
//               borderBottom={idx < requests.length - 1 ? "1px solid #f1f5f9" : "none"}
//               transition="background .15s" _hover={{ bg: "#f8faff" }} flexWrap={{ base: "wrap", md: "nowrap" }}>
//               <Box flex={3} minW={0}>
//                 <Flex align="center" gap={2}>
//                   <Text fontSize="14px" fontWeight={700} color="#0f172a" noOfLines={1}>{r.title}</Text>
//                   {r.isSectioned && (
//                     <Flex align="center" gap={1} bg="#eff6ff" color="#2563eb" px={2} py="1px" borderRadius="full" fontSize="9px" fontWeight={700} flexShrink={0}>
//                       <Icon as={FaLayerGroup} fontSize="8px" />{r.sections?.length || 0}s
//                     </Flex>
//                   )}
//                 </Flex>
//                 <Flex gap={1.5} mt={1} flexWrap="wrap">
//                   <Text fontSize="9px" fontWeight={700} bg="#eff6ff" color="#2563eb" px={2} py="2px" borderRadius="full">{r.examType}</Text>
//                   {!r.isSectioned && r.subject && <Text fontSize="9px" fontWeight={700} bg="#f1f5f9" color="#475569" px={2} py="2px" borderRadius="full" textTransform="capitalize">{r.subject}</Text>}
//                   {r.attachmentCount > 0 && <Text fontSize="9px" fontWeight={700} bg="#f5f3ff" color="#7c3aed" px={2} py="2px" borderRadius="full">{r.attachmentCount} file{r.attachmentCount > 1 ? "s" : ""}</Text>}
//                 </Flex>
//               </Box>
//               <Box flex={2} display={{ base: "none", md: "block" }} minW={0}>
//                 <Text fontSize="13px" fontWeight={600} color="#374151" noOfLines={1}>{r.coachingId?.name || "—"}</Text>
//                 <Text fontSize="11px" color="#94a3b8">{r.coachingId?.city || ""}</Text>
//               </Box>
//               <Box flex={2} display={{ base: "none", md: "block" }}>
//                 <Text fontSize="12px" color="#64748b">
//                   {r.isSectioned ? `${r.sections?.length || 0} sections · ${r.totalQuestions}Q` : `${r.totalQuestions} Q · ${r.timeLimitMin}min · ${r.difficulty}`}
//                 </Text>
//               </Box>
//               <Box flex={2} display={{ base: "none", md: "block" }}>
//                 <Text fontSize="12px" color="#94a3b8">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</Text>
//               </Box>
//               <Box flex={2}><StatusBadge status={r.status} /></Box>
//               <Flex flex={1} justify="flex-end">
//                 <Button size="sm" leftIcon={r.status === "completed" ? <FaCheck /> : <FaEye />} onClick={() => openDetail(r)}
//                   bg={r.status === "completed" ? "#f0fdf4" : "#f0f7ff"} color={r.status === "completed" ? "#15803d" : "#4a72b8"}
//                   borderRadius="8px" fontSize="12px" fontWeight={700} _hover={{ opacity: 0.8 }} h="32px">
//                   {r.status === "completed" ? "Done" : "Open"}
//                 </Button>
//               </Flex>
//             </Flex>
//           ))}
//         </Box>
//       )}

//       {/* Build Test Modal */}
//       <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
//         <ModalOverlay />
//         <ModalContent borderRadius={{ base: 0, md: "16px" }} fontFamily="'Sora',sans-serif" maxW={{ base: "100%", md: "95vw" }} mx="auto" my={{ base: 0, md: 4 }}>
//           <ModalHeader px={7} pt={7} pb={5} bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)" color="white" borderRadius={{ base: 0, md: "16px 16px 0 0" }}>
//             <Flex align="center" justify="space-between">
//               <Box>
//                 <Flex align="center" gap={2}>
//                   <Text fontSize="18px" fontWeight={800} lineHeight={1.2}>{selected?.title}</Text>
//                   {isSectionedRequest && (
//                     <Flex align="center" gap={1} bg="rgba(56,189,248,.2)" color="#38bdf8" px={2} py="2px" borderRadius="full" fontSize="11px" fontWeight={700}>
//                       <Icon as={FaLayerGroup} fontSize="10px" />{fullRequest?.sections?.length} Sections
//                     </Flex>
//                   )}
//                 </Flex>
//                 <Flex gap={2} mt={2} flexWrap="wrap" align="center">
//                   {selected && <StatusBadge status={selected.status} />}
//                   <Text fontSize="11px" color="rgba(255,255,255,.5)">from {selected?.coachingId?.name || "coaching"}</Text>
//                 </Flex>
//               </Box>
//               <ModalCloseButton position="static" color="white" _hover={{ bg: "rgba(255,255,255,.15)" }} borderRadius="8px" />
//             </Flex>
//           </ModalHeader>

//           <ModalBody px={0} py={0}>
//             {loadingDetail ? (
//               <Flex justify="center" py={20}><Spinner color="#4a72b8" size="xl" /></Flex>
//             ) : (
//               <Flex h="full" direction={{ base: "column", lg: "row" }}>
//                 {/* Left: request info + attachments */}
//                 <Box w={{ base: "100%", lg: "340px" }} flexShrink={0} borderRight={{ base: "none", lg: "1px solid #e2e8f0" }} borderBottom={{ base: "1px solid #e2e8f0", lg: "none" }} p={6} overflowY="auto" maxH={{ lg: "calc(100vh - 200px)" }}>
//                   <Text fontSize="11px" fontWeight={800} color="#94a3b8" textTransform="uppercase" letterSpacing="2px" mb={4}>Request Details</Text>
//                   <Stack spacing={3} mb={6}>
//                     {fullRequest && [
//                       ["Exam Type", fullRequest.examType],
//                       ["Type", isSectionedRequest ? "Sectioned Test" : "Standard Test"],
//                       ...(!isSectionedRequest ? [["Subject", fullRequest.subject || "Any/Mixed"]] : []),
//                       ["Questions Needed", fullRequest.totalQuestions],
//                       ["Time Limit", `${fullRequest.timeLimitMin} minutes`],
//                       ["Difficulty", fullRequest.difficulty],
//                       ["Visibility", fullRequest.visibility],
//                       ["Submitted By", fullRequest.requestedBy?.Name],
//                       ["Submitted At", new Date(fullRequest.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })],
//                     ].map(([label, val]) => (
//                       <Flex key={label} justify="space-between" py={2} borderBottom="1px solid #f1f5f9">
//                         <Text fontSize="12px" color="#94a3b8" fontWeight={600}>{label}</Text>
//                         <Text fontSize="12px" color="#0f172a" fontWeight={700} textTransform="capitalize" textAlign="right" maxW="60%">{val}</Text>
//                       </Flex>
//                     ))}
//                   </Stack>

//                   {isSectionedRequest && fullRequest.sections?.length > 0 && (
//                     <Box mb={5}>
//                       <Text fontSize="11px" fontWeight={800} color="#94a3b8" textTransform="uppercase" letterSpacing="2px" mb={3}>Sections Requested</Text>
//                       <Stack spacing={2}>
//                         {fullRequest.sections.map((sec, i) => (
//                           <Flex key={i} align="center" justify="space-between" bg="#f0f7ff" borderRadius="8px" border="1px solid #bfdbfe" px={3} py={2}>
//                             <Flex align="center" gap={2}>
//                               <Flex w="20px" h="20px" bg="#2563eb" borderRadius="5px" align="center" justify="center"><Text fontSize="9px" fontWeight={900} color="white">{i + 1}</Text></Flex>
//                               <Text fontSize="12px" fontWeight={700} color="#1e40af" textTransform="capitalize">{sec.subject}</Text>
//                             </Flex>
//                             <Text fontSize="11px" color="#2563eb" fontWeight={600}>{sec.totalQuestions} Q</Text>
//                           </Flex>
//                         ))}
//                       </Stack>
//                     </Box>
//                   )}

//                   {fullRequest?.instructions && (
//                     <Box bg="#fffbeb" border="1px solid #fde68a" borderRadius="10px" p={3} mb={5}>
//                       <Text fontSize="10px" fontWeight={800} color="#92400e" textTransform="uppercase" letterSpacing=".6px" mb={1}>Instructions</Text>
//                       <Text fontSize="12px" color="#78350f" lineHeight={1.7}>{fullRequest.instructions}</Text>
//                     </Box>
//                   )}

//                   {fullRequest?.attachments?.length > 0 && (
//                     <Box>
//                       <Text fontSize="11px" fontWeight={800} color="#94a3b8" textTransform="uppercase" letterSpacing="2px" mb={3}>Uploaded Files ({fullRequest.attachments.length})</Text>
//                       <Stack spacing={3}>
//                         {fullRequest.attachments.map((att, i) => (
//                           <Box key={i} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0" overflow="hidden">
//                             <Flex align="center" gap={2} px={3} py={3} cursor="pointer" _hover={{ bg: "#f0f7ff" }} transition="background .15s" onClick={() => { setPreviewFile(att); openPreview(); }} borderBottom="1px solid #e2e8f0">
//                               <FileIcon type={att.fileType} size="18px" />
//                               <Box flex={1} minW={0}>
//                                 <Text fontSize="12px" fontWeight={700} color="#0f172a" noOfLines={1}>{att.fileName}</Text>
//                                 <Text fontSize="10px" color="#94a3b8">{att.fileType?.toUpperCase()} · click to preview</Text>
//                               </Box>
//                               <Icon as={FaExpand} fontSize="10px" color="#94a3b8" flexShrink={0} />
//                             </Flex>
//                             {att.fileType === "image" && (
//                               <Box cursor="pointer" onClick={() => { setPreviewFile(att); openPreview(); }} overflow="hidden" maxH="160px" _hover={{ opacity: 0.85 }} transition="opacity .15s">
//                                 <img src={`data:image/jpeg;base64,${att.fileData}`} alt={att.fileName} style={{ width: "100%", maxHeight: "160px", objectFit: "cover", background: "#f1f5f9", display: "block" }} />
//                               </Box>
//                             )}
//                             <Flex gap={2} p={3}>
//                               <Button size="xs" flex={1} h="30px" leftIcon={<Icon as={FaEye} fontSize="10px" />} onClick={() => { setPreviewFile(att); openPreview(); }} bg="#eff6ff" color="#2563eb" borderRadius="7px" fontWeight={700} fontSize="11px" _hover={{ bg: "#dbeafe" }}>View</Button>
//                               <Button size="xs" flex={1} h="30px" leftIcon={<Icon as={FaDownload} fontSize="10px" />} onClick={() => downloadFile(att)} bg="#f0fdf4" color="#15803d" borderRadius="7px" fontWeight={700} fontSize="11px" _hover={{ bg: "#dcfce7" }}>Download</Button>
//                               {!isSectionedRequest && <Button size="xs" flex={1} h="30px" leftIcon={<Icon as={FaRobot} fontSize="10px" />} onClick={() => generateFromFile(att)} isLoading={aiLoading} bg="#f5f3ff" color="#7c3aed" borderRadius="7px" fontWeight={700} fontSize="11px" _hover={{ bg: "#ede9fe" }}>AI</Button>}
//                             </Flex>
//                           </Box>
//                         ))}
//                       </Stack>
//                     </Box>
//                   )}
//                 </Box>

//                 {/* Right: AI + question editor */}
//                 <Box flex={1} p={6} overflowY="auto" maxH={{ lg: "calc(100vh - 200px)" }}>
//                   {!isSectionedRequest && (
//                     <Box bg="linear-gradient(135deg,#f5f3ff,#ede9fe)" border="1px solid #c4b5fd" borderRadius="14px" p={5} mb={6}>
//                       <Flex align="center" gap={2} mb={3}>
//                         <Icon as={FaRobot} color="#7c3aed" fontSize="16px" />
//                         <Text fontSize="13px" fontWeight={800} color="#4c1d95">AI Question Generator</Text>
//                       </Flex>
//                       <Textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Describe what questions you want to generate…" borderRadius="10px" fontSize="13px" rows={3} resize="vertical" mb={3} bg="white" borderColor="#c4b5fd" _focus={{ borderColor: "#7c3aed", boxShadow: "0 0 0 1px #7c3aed" }} />
//                       <Button leftIcon={<FaRobot />} onClick={generateWithAI} isLoading={aiLoading} loadingText="Generating questions…" bg="#7c3aed" color="white" borderRadius="10px" fontWeight={800} fontSize="13px" h="42px" _hover={{ bg: "#6d28d9" }} w={{ base: "full", sm: "auto" }}>
//                         Generate {fullRequest?.totalQuestions || 20} Questions with AI
//                       </Button>
//                       {questions.length > 0 && <Text fontSize="12px" color="#6d28d9" mt={2} fontWeight={600}>✓ {questions.length} questions ready — review below before sending</Text>}
//                     </Box>
//                   )}

//                   {isSectionedRequest ? (
//                     <Box>
//                       <Flex align="center" gap={2} mb={5}>
//                         <Icon as={FaLayerGroup} color="#2563eb" fontSize="16px" />
//                         <Text fontSize="15px" fontWeight={800} color="#0f172a">Section Question Editors</Text>
//                         <Text fontSize="12px" color="#94a3b8">· {totalSectionQCount} questions added across {fullRequest?.sections?.length} sections</Text>
//                       </Flex>
//                       {fullRequest?.sections?.map((sec, sIdx) => (
//                         <SectionEditor key={sIdx} section={sec} sectionIdx={sIdx} sectionQuestions={sectionQuestions} setSectionQuestions={setSectionQuestions} fullRequest={fullRequest} aiLoading={aiLoading} setAiLoading={setAiLoading} toast={toast} />
//                       ))}
//                     </Box>
//                   ) : (
//                     <Box>
//                       <Flex justify="space-between" align="center" mb={4}>
//                         <Text fontSize="11px" fontWeight={800} color="#94a3b8" textTransform="uppercase" letterSpacing="2px">Questions ({questions.length})</Text>
//                         <Button size="sm" leftIcon={<FaPlus />} onClick={() => setQuestions((p) => [...p, { qus: "", options: ["", "", "", ""], answer: 0, explanation: "" }])} variant="outline" borderRadius="8px" fontSize="12px" fontWeight={700} borderColor="#4a72b8" color="#4a72b8">Add Manually</Button>
//                       </Flex>
//                       {questions.length === 0 ? (
//                         <Box py={12} textAlign="center" bg="#f8fafc" borderRadius="14px" border="2px dashed #e2e8f0">
//                           <Icon as={FaClipboardList} fontSize="36px" color="#e2e8f0" display="block" mx="auto" mb={3} />
//                           <Text fontSize="14px" color="#94a3b8" fontWeight={600}>No questions yet — use AI or add manually</Text>
//                         </Box>
//                       ) : questions.map((q, idx) => (
//                         <QuestionRow key={idx} q={q} idx={idx} onChange={(i, u) => setQuestions((p) => p.map((qq, ii) => ii === i ? u : qq))} onDelete={(i) => setQuestions((p) => p.filter((_, ii) => ii !== i))} />
//                       ))}
//                     </Box>
//                   )}
//                 </Box>
//               </Flex>
//             )}
//           </ModalBody>

//           {selected?.status !== "completed" && (
//             <ModalFooter px={7} py={5} borderTop="1px solid #f1f5f9" gap={3} flexWrap="wrap">
//               <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Optional note for the coaching…" borderRadius="10px" fontSize="13px" rows={2} resize="none" flex={1} minW={{ base: "100%", md: "300px" }} borderColor="#e2e8f0" _focus={{ borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" }} />
//               <Flex gap={3} flexShrink={0}>
//                 <Button h="46px" borderRadius="12px" bg="#fee2e2" color="#dc2626" fontWeight={700} fontSize="13px" leftIcon={<FaTimesCircle />} onClick={() => { setRejectReason(""); openReject(); }} _hover={{ bg: "#fecaca" }}>Reject</Button>
//                 <Button h="46px" borderRadius="12px" bg="linear-gradient(135deg,#4a72b8,#1e3a5f)" color="white" fontWeight={800} fontSize="14px" leftIcon={<FaPaperPlane />}
//                   isLoading={acting} loadingText="Sending…"
//                   isDisabled={isSectionedRequest ? sectionQuestions.some((sq) => sq.questions.length === 0) : questions.length === 0}
//                   onClick={handleSendTest} _hover={{ opacity: 0.9 }} px={8}>
//                   {isSectionedRequest ? `Send Test (${totalSectionQCount} Q, ${fullRequest?.sections?.length} sections)` : `Send Test (${questions.length} Q)`}
//                 </Button>
//               </Flex>
//             </ModalFooter>
//           )}
//         </ModalContent>
//       </Modal>

//       <FilePreviewModal attachment={previewFile} isOpen={previewOpen} onClose={closePreview} />

//       {/* Reject dialog */}
//       <AlertDialog isOpen={rejectOpen} leastDestructiveRef={cancelRef} onClose={closeReject} isCentered>
//         <AlertDialogOverlay>
//           <AlertDialogContent mx={4} borderRadius="16px" fontFamily="'Sora',sans-serif">
//             <AlertDialogHeader fontSize="16px" fontWeight={800}>Reject Request</AlertDialogHeader>
//             <AlertDialogBody>
//               <Text fontSize="14px" color="#475569" mb={3}>Provide a reason so the coaching knows what to change:</Text>
//               <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Please provide more specific topic details…" borderRadius="10px" rows={3} fontSize="13px" borderColor="#e2e8f0" _focus={{ borderColor: "#ef4444", boxShadow: "0 0 0 1px #ef4444" }} />
//             </AlertDialogBody>
//             <AlertDialogFooter gap={3}>
//               <Button ref={cancelRef} onClick={closeReject} variant="ghost" borderRadius="10px">Cancel</Button>
//               <Button bg="#ef4444" color="white" borderRadius="10px" fontWeight={700} _hover={{ bg: "#dc2626" }} isLoading={acting} onClick={handleReject} leftIcon={<FaTimesCircle />}>Reject Request</Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </AdminNavPage>
//   );
// }











// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Input,
//   Button,
//   Icon,
//   Spinner,
//   Badge,
//   Select,
//   Textarea,
//   useToast,
//   Stack,
//   Divider,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   ModalCloseButton,
//   useDisclosure,
//   InputGroup,
//   InputLeftElement,
//   AlertDialog,
//   AlertDialogOverlay,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogBody,
//   AlertDialogFooter,
// } from "@chakra-ui/react";
// import {
//   FaSearch,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaClock,
//   FaEye,
//   FaRobot,
//   FaPlus,
//   FaTrash,
//   FaClipboardList,
//   FaFilePdf,
//   FaFileImage,
//   FaFileExcel,
//   FaDownload,
//   FaCheck,
//   FaPaperPlane,
//   FaHourglass,
//   FaExpand,
//   FaTimes,
//   FaLayerGroup,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { apiFetch } from "../services/api";
// import { useAuth } from "../context/AuthContext";

// const StatusBadge = ({ status }) => {
//   const cfg = {
//     pending: {
//       bg: "#fef9c3",
//       color: "#a16207",
//       icon: FaHourglass,
//       label: "Pending",
//     },
//     processing: {
//       bg: "#eff6ff",
//       color: "#1d4ed8",
//       icon: FaClock,
//       label: "Processing",
//     },
//     completed: {
//       bg: "#dcfce7",
//       color: "#15803d",
//       icon: FaCheckCircle,
//       label: "Completed",
//     },
//     rejected: {
//       bg: "#fee2e2",
//       color: "#dc2626",
//       icon: FaTimesCircle,
//       label: "Rejected",
//     },
//   };
//   const c = cfg[status] || cfg.pending;
//   return (
//     <Flex
//       align="center"
//       gap={1.5}
//       bg={c.bg}
//       color={c.color}
//       px={3}
//       py="4px"
//       borderRadius="full"
//       fontSize="11px"
//       fontWeight={700}
//       w="fit-content"
//     >
//       <Icon as={c.icon} fontSize="10px" />
//       {c.label}
//     </Flex>
//   );
// };

// const FileIcon = ({ type, size = "16px" }) => {
//   const map = { pdf: FaFilePdf, image: FaFileImage, excel: FaFileExcel };
//   const colors = { pdf: "#ef4444", image: "#8b5cf6", excel: "#16a34a" };
//   const Ic = map[type] || FaClipboardList;
//   return <Icon as={Ic} color={colors[type] || "#64748b"} fontSize={size} />;
// };

// const downloadFile = (att) => {
//   try {
//     const mimeMap = {
//       pdf: "application/pdf",
//       image: "image/jpeg",
//       excel:
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     };
//     const mime = mimeMap[att.fileType] || "application/octet-stream";
//     const byteChars = atob(att.fileData);
//     const byteArrays = [];
//     for (let offset = 0; offset < byteChars.length; offset += 512) {
//       const slice = byteChars.slice(offset, offset + 512);
//       byteArrays.push(
//         new Uint8Array(slice.length).map((_, i) => slice.charCodeAt(i)),
//       );
//     }
//     const blob = new Blob(byteArrays, { type: mime });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download =
//       att.fileName ||
//       `attachment.${att.fileType === "image" ? "jpg" : att.fileType}`;
//     a.click();
//     URL.revokeObjectURL(url);
//   } catch {
//     window.open(
//       `data:application/octet-stream;base64,${att.fileData}`,
//       "_blank",
//     );
//   }
// };

// function FilePreviewModal({ attachment, isOpen, onClose }) {
//   if (!attachment) return null;
//   const { fileType, fileData, fileName } = attachment;
//   return (
//     <Modal
//       isOpen={isOpen}
//       onClose={onClose}
//       size="5xl"
//       isCentered
//       scrollBehavior="inside"
//     >
//       <ModalOverlay backdropFilter="blur(6px)" bg="rgba(0,0,0,.7)" />
//       <ModalContent
//         borderRadius="16px"
//         overflow="hidden"
//         fontFamily="'Sora',sans-serif"
//         maxH="90vh"
//         mx={4}
//       >
//         <ModalHeader
//           px={6}
//           py={4}
//           bg="linear-gradient(135deg,#0f1e3a,#1e3a5f)"
//           color="white"
//           borderRadius="16px 16px 0 0"
//         >
//           <Flex align="center" justify="space-between">
//             <Flex align="center" gap={3}>
//               <FileIcon type={fileType} size="20px" />
//               <Box>
//                 <Text
//                   fontSize="14px"
//                   fontWeight={800}
//                   noOfLines={1}
//                   maxW="500px"
//                 >
//                   {fileName}
//                 </Text>
//                 <Text
//                   fontSize="11px"
//                   color="rgba(255,255,255,.5)"
//                   textTransform="uppercase"
//                 >
//                   {fileType} file
//                 </Text>
//               </Box>
//             </Flex>
//             <Flex gap={2}>
//               <Button
//                 size="sm"
//                 h="34px"
//                 px={4}
//                 bg="rgba(255,255,255,.12)"
//                 color="white"
//                 borderRadius="8px"
//                 fontWeight={700}
//                 fontSize="12px"
//                 leftIcon={<Icon as={FaDownload} fontSize="11px" />}
//                 onClick={() => downloadFile(attachment)}
//                 _hover={{ bg: "rgba(255,255,255,.2)" }}
//               >
//                 Download
//               </Button>
//               <Button
//                 size="sm"
//                 h="34px"
//                 w="34px"
//                 p={0}
//                 bg="rgba(255,255,255,.12)"
//                 color="white"
//                 borderRadius="8px"
//                 onClick={onClose}
//                 _hover={{ bg: "rgba(255,255,255,.2)" }}
//               >
//                 <Icon as={FaTimes} fontSize="12px" />
//               </Button>
//             </Flex>
//           </Flex>
//         </ModalHeader>
//         <ModalBody
//           p={0}
//           bg="#0f172a"
//           minH="400px"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           {fileType === "image" && (
//             <Box w="100%" textAlign="center" p={4}>
//               <img
//                 src={`data:image/jpeg;base64,${fileData}`}
//                 alt={fileName}
//                 style={{
//                   maxWidth: "100%",
//                   maxHeight: "75vh",
//                   objectFit: "contain",
//                   borderRadius: "8px",
//                   boxShadow: "0 8px 32px rgba(0,0,0,.4)",
//                 }}
//               />
//             </Box>
//           )}
//           {fileType === "pdf" && (
//             <Box w="100%" h="75vh">
//               <iframe
//                 src={`data:application/pdf;base64,${fileData}`}
//                 width="100%"
//                 height="100%"
//                 style={{ border: "none", borderRadius: "0 0 16px 16px" }}
//                 title={fileName}
//               />
//             </Box>
//           )}
//           {fileType === "excel" && (
//             <Flex
//               direction="column"
//               align="center"
//               gap={5}
//               py={16}
//               color="white"
//             >
//               <Icon as={FaFileExcel} fontSize="64px" color="#16a34a" />
//               <Box textAlign="center">
//                 <Text fontSize="16px" fontWeight={700} mb={2}>
//                   {fileName}
//                 </Text>
//                 <Text fontSize="13px" color="rgba(255,255,255,.5)" mb={6}>
//                   Excel files cannot be previewed in the browser.
//                 </Text>
//                 <Button
//                   h="46px"
//                   px={8}
//                   borderRadius="12px"
//                   bg="#16a34a"
//                   color="white"
//                   fontWeight={800}
//                   leftIcon={<Icon as={FaDownload} />}
//                   onClick={() => downloadFile(attachment)}
//                   _hover={{ bg: "#15803d" }}
//                 >
//                   Download to View
//                 </Button>
//               </Box>
//             </Flex>
//           )}
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// }

// function QuestionRow({ q, idx, onChange, onDelete }) {
//   const sf = (k) => (e) => onChange(idx, { ...q, [k]: e.target.value });
//   const sfOpt = (oi) => (e) => {
//     const opts = [...(q.options || ["", "", "", ""])];
//     opts[oi] = e.target.value;
//     onChange(idx, { ...q, options: opts });
//   };
//   return (
//     <Box
//       bg="#f8fafc"
//       borderRadius="12px"
//       border="1px solid #e2e8f0"
//       p={4}
//       mb={3}
//     >
//       <Flex justify="space-between" align="flex-start" mb={2}>
//         <Text
//           fontSize="11px"
//           fontWeight={800}
//           color="#94a3b8"
//           textTransform="uppercase"
//           letterSpacing=".8px"
//         >
//           Q{idx + 1}
//         </Text>
//         <Box
//           as="button"
//           onClick={() => onDelete(idx)}
//           p="4px"
//           borderRadius="6px"
//           color="#ef4444"
//           _hover={{ bg: "#fef2f2" }}
//         >
//           <Icon as={FaTrash} fontSize="11px" />
//         </Box>
//       </Flex>
//       <Textarea
//         value={q.qus || ""}
//         onChange={sf("qus")}
//         placeholder="Question text…"
//         borderRadius="8px"
//         fontSize="13px"
//         rows={2}
//         resize="vertical"
//         mb={3}
//         borderColor="#e2e8f0"
//         _focus={{ borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" }}
//       />
//       <Flex gap={2} flexWrap="wrap" mb={3}>
//         {(q.options || ["", "", "", ""]).map((opt, oi) => (
//           <Flex key={oi} align="center" gap={2} flex="1" minW="48%">
//             <Flex
//               w="22px"
//               h="22px"
//               bg={q.answer === oi ? "#dcfce7" : "#f1f5f9"}
//               color={q.answer === oi ? "#15803d" : "#64748b"}
//               borderRadius="6px"
//               align="center"
//               justify="center"
//               fontSize="10px"
//               fontWeight={800}
//               flexShrink={0}
//               cursor="pointer"
//               border={
//                 q.answer === oi
//                   ? "1.5px solid #15803d"
//                   : "1.5px solid transparent"
//               }
//               onClick={() => onChange(idx, { ...q, answer: oi })}
//             >
//               {["A", "B", "C", "D"][oi]}
//             </Flex>
//             <Input
//               value={opt}
//               onChange={sfOpt(oi)}
//               placeholder={`Option ${["A", "B", "C", "D"][oi]}…`}
//               borderRadius="8px"
//               h="36px"
//               fontSize="13px"
//               borderColor={q.answer === oi ? "#16a34a" : "#e2e8f0"}
//               bg={q.answer === oi ? "#f0fdf4" : "white"}
//               _focus={{ borderColor: "#4a72b8" }}
//             />
//           </Flex>
//         ))}
//       </Flex>
//       <Input
//         value={q.explanation || ""}
//         onChange={sf("explanation")}
//         placeholder="Explanation (optional)…"
//         borderRadius="8px"
//         h="36px"
//         fontSize="12px"
//         borderColor="#e2e8f0"
//         color="#64748b"
//         _focus={{ borderColor: "#4a72b8" }}
//       />
//     </Box>
//   );
// }

// // ── Per-section question editor panel ─────────────────────────────────────────
// function SectionEditor({
//   section,
//   sectionIdx,
//   sectionQuestions,
//   setSectionQuestions,
//   fullRequest,
//   aiLoading,
//   setAiLoading,
//   toast,
// }) {
//   const sq = sectionQuestions[sectionIdx] || { questions: [] };
//   const setSecQ = (qs) =>
//     setSectionQuestions((prev) =>
//       prev.map((s, i) => (i === sectionIdx ? { questions: qs } : s)),
//     );

//   const generateSectionAI = async () => {
//     setAiLoading(true);
//     try {
//       const systemPrompt = `You are an expert question paper setter for Indian competitive exams.
// Generate exactly ${section.totalQuestions} high-quality MCQs for the subject: ${section.subject}.
// Exam: ${fullRequest.examType}. Difficulty: ${fullRequest.difficulty}.
// Return ONLY valid JSON array, no markdown: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]`;

//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "claude-sonnet-4-20250514",
//           max_tokens: 6000,
//           system: systemPrompt,
//           messages: [
//             {
//               role: "user",
//               content: `Generate ${section.totalQuestions} MCQs for ${section.subject}`,
//             },
//           ],
//         }),
//       });
//       const data = await response.json();
//       const text = data.content?.map((c) => c.text || "").join("") || "";
//       const clean = text.replace(/```json|```/g, "").trim();
//       const match = clean.match(/\[[\s\S]*\]/);
//       const parsed = match ? JSON.parse(match[0]) : JSON.parse(clean);
//       const normalised = parsed.map((q) => ({
//         qus: q.qus || q.question || "",
//         options:
//           Array.isArray(q.options) && q.options.length === 4
//             ? q.options
//             : ["Option A", "Option B", "Option C", "Option D"],
//         answer: typeof q.answer === "number" ? q.answer : 0,
//         explanation: q.explanation || "",
//       }));
//       setSecQ(normalised);
//       toast({
//         title: `✅ ${normalised.length} questions for ${section.subject}!`,
//         status: "success",
//         duration: 3000,
//       });
//     } catch (err) {
//       toast({
//         title: `AI Error: ${err.message}`,
//         status: "error",
//         duration: 4000,
//       });
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   return (
//     <Box
//       mb={6}
//       bg="#f8fafc"
//       borderRadius="14px"
//       border="1px solid #e2e8f0"
//       overflow="hidden"
//     >
//       {/* Section header */}
//       <Flex
//         align="center"
//         justify="space-between"
//         px={5}
//         py={3}
//         bg="white"
//         borderBottom="1px solid #e2e8f0"
//       >
//         <Flex align="center" gap={2}>
//           <Flex
//             w="26px"
//             h="26px"
//             bg="#eff6ff"
//             borderRadius="7px"
//             align="center"
//             justify="center"
//           >
//             <Text fontSize="11px" fontWeight={900} color="#2563eb">
//               {sectionIdx + 1}
//             </Text>
//           </Flex>
//           <Text
//             fontSize="13px"
//             fontWeight={800}
//             color="#0f172a"
//             textTransform="capitalize"
//           >
//             {section.subject || `Section ${sectionIdx + 1}`}
//           </Text>
//           <Text fontSize="11px" color="#94a3b8">
//             · {section.totalQuestions} questions requested
//           </Text>
//         </Flex>
//         <Flex align="center" gap={2}>
//           <Text
//             fontSize="11px"
//             fontWeight={700}
//             color={
//               sq.questions.length >= section.totalQuestions
//                 ? "#16a34a"
//                 : "#d97706"
//             }
//           >
//             {sq.questions.length}/{section.totalQuestions} added
//           </Text>
//           <Button
//             size="xs"
//             leftIcon={<Icon as={FaRobot} fontSize="9px" />}
//             onClick={generateSectionAI}
//             isLoading={aiLoading}
//             bg="#f5f3ff"
//             color="#7c3aed"
//             borderRadius="7px"
//             fontWeight={700}
//             fontSize="11px"
//             _hover={{ bg: "#ede9fe" }}
//           >
//             AI Generate
//           </Button>
//           <Button
//             size="xs"
//             leftIcon={<Icon as={FaPlus} fontSize="9px" />}
//             onClick={() =>
//               setSecQ([
//                 ...sq.questions,
//                 {
//                   qus: "",
//                   options: ["", "", "", ""],
//                   answer: 0,
//                   explanation: "",
//                 },
//               ])
//             }
//             bg="#eff6ff"
//             color="#2563eb"
//             borderRadius="7px"
//             fontWeight={700}
//             fontSize="11px"
//             _hover={{ bg: "#dbeafe" }}
//           >
//             Add
//           </Button>
//         </Flex>
//       </Flex>

//       <Box p={4}>
//         {sq.questions.length === 0 ? (
//           <Box
//             py={8}
//             textAlign="center"
//             bg="white"
//             borderRadius="10px"
//             border="2px dashed #e2e8f0"
//           >
//             <Text fontSize="13px" color="#94a3b8">
//               No questions yet — use AI Generate or Add manually
//             </Text>
//           </Box>
//         ) : (
//           sq.questions.map((q, qi) => (
//             <QuestionRow
//               key={qi}
//               q={q}
//               idx={qi}
//               onChange={(i, updated) =>
//                 setSecQ(sq.questions.map((qq, ii) => (ii === i ? updated : qq)))
//               }
//               onDelete={(i) =>
//                 setSecQ(sq.questions.filter((_, ii) => ii !== i))
//               }
//             />
//           ))
//         )}
//       </Box>
//     </Box>
//   );
// }

// export default function AdminTestRequestsPage() {
//   const navigate = useNavigate();
//   const toast = useToast();
//   const cancelRef = useRef();
//   const { user, loading: authLoading } = useAuth();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const {
//     isOpen: rejectOpen,
//     onOpen: openReject,
//     onClose: closeReject,
//   } = useDisclosure();
//   const {
//     isOpen: previewOpen,
//     onOpen: openPreview,
//     onClose: closePreview,
//   } = useDisclosure();

//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [statusFilter, setStatusFilter] = useState("pending");
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState(null);
//   const [fullRequest, setFullRequest] = useState(null);
//   const [loadingDetail, setLoadingDetail] = useState(false);
//   const [previewFile, setPreviewFile] = useState(null);

//   // Flat question state (non-sectioned)
//   const [questions, setQuestions] = useState([]);
//   // Per-section question state (sectioned)
//   const [sectionQuestions, setSectionQuestions] = useState([]);

//   const [adminNote, setAdminNote] = useState("");
//   const [rejectReason, setRejectReason] = useState("");
//   const [acting, setActing] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [aiPrompt, setAiPrompt] = useState("");

//   useEffect(() => {
//     if (!authLoading && user && !user.isAdmin) navigate("/");
//   }, [user, authLoading, navigate]);

//   const loadRequests = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = new URLSearchParams();
//       if (statusFilter) params.set("status", statusFilter);
//       if (search.trim()) params.set("search", search.trim());
//       const res = await apiFetch(`/test-requests/admin/all?${params}`);
//       setRequests(res.data ?? []);
//     } catch (err) {
//       toast({ title: err.message, status: "error", duration: 3000 });
//     } finally {
//       setLoading(false);
//     }
//   }, [statusFilter, search]);

//   useEffect(() => {
//     if (!authLoading && user?.isAdmin) loadRequests();
//   }, [loadRequests, authLoading, user]);

//   const handlePreviewFile = (att) => {
//     setPreviewFile(att);
//     openPreview();
//   };

//   const openDetail = async (req) => {
//     setSelected(req);
//     setQuestions([]);
//     setSectionQuestions([]);
//     setAdminNote("");
//     setAiPrompt("");
//     onOpen();
//     setLoadingDetail(true);
//     try {
//       const res = await apiFetch(`/test-requests/admin/${req._id}`);
//       setFullRequest(res.data);

//       // Initialise section question buckets
//       if (res.data.isSectioned && res.data.sections?.length) {
//         setSectionQuestions(res.data.sections.map(() => ({ questions: [] })));
//       }

//       setAiPrompt(
//         `Create ${res.data.totalQuestions} multiple choice questions for ${res.data.examType} exam.` +
//           (res.data.subject ? ` Subject: ${res.data.subject}.` : "") +
//           ` Difficulty: ${res.data.difficulty}.` +
//           (res.data.instructions
//             ? ` Special instructions: ${res.data.instructions}`
//             : ""),
//       );
//       if (req.status === "pending") {
//         await apiFetch(`/test-requests/admin/${req._id}/processing`, {
//           method: "PATCH",
//         });
//         setRequests((prev) =>
//           prev.map((r) =>
//             r._id === req._id ? { ...r, status: "processing" } : r,
//           ),
//         );
//       }
//     } catch (err) {
//       toast({ title: "Failed to load request details", status: "error" });
//     } finally {
//       setLoadingDetail(false);
//     }
//   };

//   // ── AI generation (flat / non-sectioned) ─────────────────────────────────
//   const generateWithAI = async () => {
//     if (!fullRequest) return;
//     setAiLoading(true);
//     try {
//       const systemPrompt = `You are an expert question paper setter for Indian competitive exams.
// Generate exactly ${fullRequest.totalQuestions} high-quality multiple choice questions.
// Format: Return ONLY valid JSON array, no markdown, no explanation outside JSON.
// Each question: { "qus": "question text", "options": ["A text","B text","C text","D text"], "answer": 0, "explanation": "brief explanation" }
// answer is 0-indexed (0=A, 1=B, 2=C, 3=D).`;

//       const userContent =
//         aiPrompt +
//         (fullRequest.attachments?.length
//           ? `\n\nNote: The coach has uploaded ${fullRequest.attachments.length} file(s) as reference material.`
//           : "");

//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "claude-sonnet-4-20250514",
//           max_tokens: 8000,
//           system: systemPrompt,
//           messages: [{ role: "user", content: userContent }],
//         }),
//       });
//       const data = await response.json();
//       const text = data.content?.map((c) => c.text || "").join("") || "";
//       const clean = text.replace(/```json|```/g, "").trim();
//       let parsed;
//       try {
//         parsed = JSON.parse(clean);
//       } catch {
//         const m = clean.match(/\[[\s\S]*\]/);
//         if (m) parsed = JSON.parse(m[0]);
//         else throw new Error("Could not parse AI response as JSON");
//       }
//       if (!Array.isArray(parsed) || !parsed.length)
//         throw new Error("AI returned empty questions");
//       const normalised = parsed.map((q) => ({
//         qus: q.qus || q.question || "",
//         options:
//           Array.isArray(q.options) && q.options.length === 4
//             ? q.options
//             : ["Option A", "Option B", "Option C", "Option D"],
//         answer: typeof q.answer === "number" ? q.answer : 0,
//         explanation: q.explanation || "",
//       }));
//       setQuestions(normalised);
//       toast({
//         title: `✅ ${normalised.length} questions generated!`,
//         description: "Review and edit before sending.",
//         status: "success",
//         duration: 4000,
//       });
//     } catch (err) {
//       toast({
//         title: `AI Error: ${err.message}`,
//         status: "error",
//         duration: 5000,
//       });
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const generateFromFile = async (attachment) => {
//     if (!fullRequest) return;
//     setAiLoading(true);
//     try {
//       let messages;
//       if (attachment.fileType === "image") {
//         messages = [
//           {
//             role: "user",
//             content: [
//               {
//                 type: "image",
//                 source: {
//                   type: "base64",
//                   media_type: "image/jpeg",
//                   data: attachment.fileData,
//                 },
//               },
//               {
//                 type: "text",
//                 text: `Based on this study material, create ${fullRequest.totalQuestions} MCQs for ${fullRequest.examType} exam. Difficulty: ${fullRequest.difficulty}. Return ONLY JSON array: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]`,
//               },
//             ],
//           },
//         ];
//       } else if (attachment.fileType === "pdf") {
//         messages = [
//           {
//             role: "user",
//             content: [
//               {
//                 type: "document",
//                 source: {
//                   type: "base64",
//                   media_type: "application/pdf",
//                   data: attachment.fileData,
//                 },
//               },
//               {
//                 type: "text",
//                 text: `Based on this PDF, create ${fullRequest.totalQuestions} MCQs for ${fullRequest.examType} exam. Difficulty: ${fullRequest.difficulty}. ${fullRequest.instructions || ""}. Return ONLY JSON array: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]`,
//               },
//             ],
//           },
//         ];
//       } else {
//         toast({
//           title: "For Excel files, use the AI prompt instead",
//           status: "info",
//         });
//         setAiLoading(false);
//         return;
//       }
//       const response = await fetch("https://api.anthropic.com/v1/messages", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           model: "claude-sonnet-4-20250514",
//           max_tokens: 8000,
//           messages,
//         }),
//       });
//       const data = await response.json();
//       const text = data.content?.map((c) => c.text || "").join("") || "";
//       const clean = text.replace(/```json|```/g, "").trim();
//       const match = clean.match(/\[[\s\S]*\]/);
//       const parsed = match ? JSON.parse(match[0]) : JSON.parse(clean);
//       const normalised = parsed.map((q) => ({
//         qus: q.qus || q.question || "",
//         options:
//           Array.isArray(q.options) && q.options.length === 4
//             ? q.options
//             : ["Option A", "Option B", "Option C", "Option D"],
//         answer: typeof q.answer === "number" ? q.answer : 0,
//         explanation: q.explanation || "",
//       }));
//       setQuestions(normalised);
//       toast({
//         title: `✅ ${normalised.length} questions generated from file!`,
//         status: "success",
//         duration: 4000,
//       });
//     } catch (err) {
//       toast({
//         title: `Error: ${err.message}`,
//         status: "error",
//         duration: 5000,
//       });
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   const addBlankQuestion = () =>
//     setQuestions((p) => [
//       ...p,
//       { qus: "", options: ["", "", "", ""], answer: 0, explanation: "" },
//     ]);
//   const updateQuestion = (idx, updated) =>
//     setQuestions((p) => p.map((q, i) => (i === idx ? updated : q)));
//   const deleteQuestion = (idx) =>
//     setQuestions((p) => p.filter((_, i) => i !== idx));

//   // ── Send test ──────────────────────────────────────────────────────────────
//   const handleSendTest = async () => {
//     if (!selected) return;
//     const isSectioned = fullRequest?.isSectioned === true;

//     if (isSectioned) {
//       // Validate each section
//       for (let sIdx = 0; sIdx < (fullRequest.sections?.length || 0); sIdx++) {
//         const sq = sectionQuestions[sIdx];
//         if (!sq || sq.questions.length === 0) {
//           toast({
//             title: `Section "${fullRequest.sections[sIdx]?.subject || sIdx + 1}" has no questions`,
//             status: "warning",
//           });
//           return;
//         }
//         const invalid = sq.questions.findIndex(
//           (q) => !q.qus?.trim() || q.options.some((o) => !o?.trim()),
//         );
//         if (invalid !== -1) {
//           toast({
//             title: `Section "${fullRequest.sections[sIdx]?.subject}" — Q${invalid + 1} is incomplete`,
//             status: "warning",
//           });
//           return;
//         }
//       }
//     } else {
//       if (!questions.length) {
//         toast({
//           title: "Add at least 1 question before sending",
//           status: "warning",
//         });
//         return;
//       }
//       const invalid = questions.findIndex(
//         (q) => !q.qus?.trim() || q.options.some((o) => !o?.trim()),
//       );
//       if (invalid !== -1) {
//         toast({
//           title: `Question ${invalid + 1} is incomplete`,
//           status: "warning",
//         });
//         return;
//       }
//     }

//     setActing(true);
//     try {
//       const body = isSectioned
//         ? {
//             sections: sectionQuestions.map((sq, i) => ({
//               name: fullRequest.sections[i]?.subject || `Section ${i + 1}`,
//               subject: fullRequest.sections[i]?.subject || "",
//               questions: sq.questions,
//             })),
//             adminNote,
//           }
//         : { questions, adminNote };

//       const res = await apiFetch(
//         `/test-requests/admin/${selected._id}/create-test`,
//         {
//           method: "POST",
//           body: JSON.stringify(body),
//         },
//       );
//       toast({ title: res.message, status: "success", duration: 5000 });
//       onClose();
//       loadRequests();
//     } catch (err) {
//       toast({ title: err.message, status: "error", duration: 4000 });
//     } finally {
//       setActing(false);
//     }
//   };

//   const handleReject = async () => {
//     if (!selected || !rejectReason.trim()) {
//       toast({ title: "Please provide a rejection reason", status: "warning" });
//       return;
//     }
//     setActing(true);
//     try {
//       await apiFetch(`/test-requests/admin/${selected._id}/reject`, {
//         method: "PATCH",
//         body: JSON.stringify({ adminNote: rejectReason }),
//       });
//       toast({ title: "Request rejected", status: "info", duration: 3000 });
//       closeReject();
//       onClose();
//       loadRequests();
//     } catch (err) {
//       toast({ title: err.message, status: "error" });
//     } finally {
//       setActing(false);
//     }
//   };

//   const isSectionedRequest = fullRequest?.isSectioned === true;
//   const totalSectionQCount = sectionQuestions.reduce(
//     (s, sq) => s + (sq.questions?.length || 0),
//     0,
//   );

//   if (authLoading)
//     return (
//       <Flex minH="80vh" align="center" justify="center">
//         <Spinner size="xl" color="#4a72b8" thickness="4px" />
//       </Flex>
//     );
//   if (!user?.isAdmin) return null;

//   return (
//     <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
//       {/* Header */}
//       <Box
//         bg="linear-gradient(135deg,#0f1e3a 0%,#1e3a5f 50%,#2d5fa8 100%)"
//         px={{ base: 4, md: 8 }}
//         pt={{ base: 8, md: 12 }}
//         pb={{ base: 10, md: 16 }}
//       >
//         <Box maxW="1100px" mx="auto">
//           <Text
//             fontSize="11px"
//             fontWeight={800}
//             color="rgba(255,255,255,.45)"
//             textTransform="uppercase"
//             letterSpacing="3px"
//             mb={2}
//           >
//             Admin Panel
//           </Text>
//           <Text
//             fontSize={{ base: "24px", md: "36px" }}
//             fontWeight={800}
//             color="white"
//             letterSpacing="-1px"
//             mb={2}
//           >
//             Test Creation Requests
//           </Text>
//           <Text fontSize="14px" color="rgba(255,255,255,.55)">
//             Review coaching requests and create tests using AI or manually
//           </Text>
//         </Box>
//       </Box>

//       <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
//         {/* Filters */}
//         <Flex gap={3} mb={6} flexWrap={{ base: "wrap", md: "nowrap" }}>
//           <InputGroup flex={1}>
//             <InputLeftElement pointerEvents="none" h="full" pl={3}>
//               <Icon as={FaSearch} color="gray.400" fontSize="13px" />
//             </InputLeftElement>
//             <Input
//               placeholder="Search by title or exam…"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               onKeyDown={(e) => e.key === "Enter" && loadRequests()}
//               bg="white"
//               borderRadius="10px"
//               h="42px"
//               fontSize="14px"
//               pl="38px"
//               border="1px solid #e2e8f0"
//               _focus={{
//                 borderColor: "#4a72b8",
//                 boxShadow: "0 0 0 1px #4a72b8",
//               }}
//             />
//           </InputGroup>
//           <Select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             bg="white"
//             borderRadius="10px"
//             h="42px"
//             minW="160px"
//             maxW="160px"
//             fontSize="13px"
//             fontWeight={600}
//             border="1px solid #e2e8f0"
//           >
//             <option value="">All Statuses</option>
//             <option value="pending">⏳ Pending</option>
//             <option value="processing">🔄 Processing</option>
//             <option value="completed">✅ Completed</option>
//             <option value="rejected">❌ Rejected</option>
//           </Select>
//           <Button
//             onClick={loadRequests}
//             bg="#4a72b8"
//             color="white"
//             borderRadius="10px"
//             h="42px"
//             px={5}
//             fontSize="13px"
//             fontWeight={700}
//             _hover={{ bg: "#3b5fa0" }}
//           >
//             Search
//           </Button>
//         </Flex>

//         {/* Table */}
//         {loading ? (
//           <Flex justify="center" py={20}>
//             <Spinner color="#4a72b8" thickness="3px" size="xl" />
//           </Flex>
//         ) : requests.length === 0 ? (
//           <Box
//             py={20}
//             textAlign="center"
//             bg="white"
//             borderRadius="16px"
//             border="1px solid #e2e8f0"
//           >
//             <Icon
//               as={FaClipboardList}
//               fontSize="48px"
//               color="#e2e8f0"
//               display="block"
//               mx="auto"
//               mb={4}
//             />
//             <Text fontSize="15px" fontWeight={700} color="#94a3b8">
//               No requests found
//             </Text>
//           </Box>
//         ) : (
//           <Box
//             bg="white"
//             borderRadius="16px"
//             border="1px solid #e2e8f0"
//             overflow="hidden"
//           >
//             <Flex
//               px={6}
//               py={3}
//               bg="#f8fafc"
//               borderBottom="1px solid #e2e8f0"
//               display={{ base: "none", md: "flex" }}
//             >
//               {[
//                 ["Request", 3],
//                 ["Coaching", 2],
//                 ["Details", 2],
//                 ["Date", 2],
//                 ["Status", 2],
//                 ["", 1],
//               ].map(([h, f]) => (
//                 <Text
//                   key={h}
//                   flex={f}
//                   fontSize="11px"
//                   fontWeight={700}
//                   color="#94a3b8"
//                   textTransform="uppercase"
//                   letterSpacing=".8px"
//                 >
//                   {h}
//                 </Text>
//               ))}
//             </Flex>

//             {requests.map((r, idx) => (
//               <Flex
//                 key={r._id}
//                 px={6}
//                 py={4}
//                 align="center"
//                 gap={3}
//                 borderBottom={
//                   idx < requests.length - 1 ? "1px solid #f1f5f9" : "none"
//                 }
//                 transition="background .15s"
//                 _hover={{ bg: "#f8faff" }}
//                 flexWrap={{ base: "wrap", md: "nowrap" }}
//               >
//                 <Box flex={3} minW={0}>
//                   <Flex align="center" gap={2}>
//                     <Text
//                       fontSize="14px"
//                       fontWeight={700}
//                       color="#0f172a"
//                       noOfLines={1}
//                     >
//                       {r.title}
//                     </Text>
//                     {r.isSectioned && (
//                       <Flex
//                         align="center"
//                         gap={1}
//                         bg="#eff6ff"
//                         color="#2563eb"
//                         px={2}
//                         py="1px"
//                         borderRadius="full"
//                         fontSize="9px"
//                         fontWeight={700}
//                         flexShrink={0}
//                       >
//                         <Icon as={FaLayerGroup} fontSize="8px" />
//                         {r.sections?.length || 0}s
//                       </Flex>
//                     )}
//                   </Flex>
//                   <Flex gap={1.5} mt={1} flexWrap="wrap">
//                     <Text
//                       fontSize="9px"
//                       fontWeight={700}
//                       bg="#eff6ff"
//                       color="#2563eb"
//                       px={2}
//                       py="2px"
//                       borderRadius="full"
//                     >
//                       {r.examType}
//                     </Text>
//                     {!r.isSectioned && r.subject && (
//                       <Text
//                         fontSize="9px"
//                         fontWeight={700}
//                         bg="#f1f5f9"
//                         color="#475569"
//                         px={2}
//                         py="2px"
//                         borderRadius="full"
//                         textTransform="capitalize"
//                       >
//                         {r.subject}
//                       </Text>
//                     )}
//                     {r.attachmentCount > 0 && (
//                       <Text
//                         fontSize="9px"
//                         fontWeight={700}
//                         bg="#f5f3ff"
//                         color="#7c3aed"
//                         px={2}
//                         py="2px"
//                         borderRadius="full"
//                       >
//                         {r.attachmentCount} file
//                         {r.attachmentCount > 1 ? "s" : ""}
//                       </Text>
//                     )}
//                   </Flex>
//                 </Box>
//                 <Box flex={2} display={{ base: "none", md: "block" }} minW={0}>
//                   <Text
//                     fontSize="13px"
//                     fontWeight={600}
//                     color="#374151"
//                     noOfLines={1}
//                   >
//                     {r.coachingId?.name || "—"}
//                   </Text>
//                   <Text fontSize="11px" color="#94a3b8">
//                     {r.coachingId?.city || ""}
//                   </Text>
//                 </Box>
//                 <Box flex={2} display={{ base: "none", md: "block" }}>
//                   <Text fontSize="12px" color="#64748b">
//                     {r.isSectioned
//                       ? `${r.sections?.length || 0} sections · ${r.totalQuestions}Q`
//                       : `${r.totalQuestions} Q · ${r.timeLimitMin}min · ${r.difficulty}`}
//                   </Text>
//                   <Text
//                     fontSize="11px"
//                     color="#94a3b8"
//                     textTransform="capitalize"
//                   >
//                     {r.visibility}
//                   </Text>
//                 </Box>
//                 <Box flex={2} display={{ base: "none", md: "block" }}>
//                   <Text fontSize="12px" color="#94a3b8">
//                     {new Date(r.createdAt).toLocaleDateString("en-IN", {
//                       day: "2-digit",
//                       month: "short",
//                       year: "numeric",
//                     })}
//                   </Text>
//                 </Box>
//                 <Box flex={2}>
//                   <StatusBadge status={r.status} />
//                 </Box>
//                 <Flex flex={1} justify="flex-end">
//                   <Button
//                     size="sm"
//                     leftIcon={
//                       r.status === "completed" ? <FaCheck /> : <FaEye />
//                     }
//                     onClick={() => openDetail(r)}
//                     bg={r.status === "completed" ? "#f0fdf4" : "#f0f7ff"}
//                     color={r.status === "completed" ? "#15803d" : "#4a72b8"}
//                     borderRadius="8px"
//                     fontSize="12px"
//                     fontWeight={700}
//                     _hover={{ opacity: 0.8 }}
//                     h="32px"
//                   >
//                     {r.status === "completed" ? "Done" : "Open"}
//                   </Button>
//                 </Flex>
//               </Flex>
//             ))}
//           </Box>
//         )}
//       </Box>

//       {/* ── Detail / Build Test Modal ──────────────────────────────────────── */}
//       <Modal
//         isOpen={isOpen}
//         onClose={onClose}
//         size="full"
//         scrollBehavior="inside"
//       >
//         <ModalOverlay />
//         <ModalContent
//           borderRadius={{ base: 0, md: "16px" }}
//           fontFamily="'Sora',sans-serif"
//           maxW={{ base: "100%", md: "95vw" }}
//           mx="auto"
//           my={{ base: 0, md: 4 }}
//         >
//           <ModalHeader
//             px={7}
//             pt={7}
//             pb={5}
//             bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)"
//             color="white"
//             borderRadius={{ base: 0, md: "16px 16px 0 0" }}
//           >
//             <Flex align="center" justify="space-between">
//               <Box>
//                 <Flex align="center" gap={2}>
//                   <Text fontSize="18px" fontWeight={800} lineHeight={1.2}>
//                     {selected?.title}
//                   </Text>
//                   {isSectionedRequest && (
//                     <Flex
//                       align="center"
//                       gap={1}
//                       bg="rgba(56,189,248,.2)"
//                       color="#38bdf8"
//                       px={2}
//                       py="2px"
//                       borderRadius="full"
//                       fontSize="11px"
//                       fontWeight={700}
//                     >
//                       <Icon as={FaLayerGroup} fontSize="10px" />
//                       {fullRequest?.sections?.length} Sections
//                     </Flex>
//                   )}
//                 </Flex>
//                 <Flex gap={2} mt={2} flexWrap="wrap" align="center">
//                   {selected && <StatusBadge status={selected.status} />}
//                   <Text fontSize="11px" color="rgba(255,255,255,.5)">
//                     from {selected?.coachingId?.name || "coaching"}
//                   </Text>
//                 </Flex>
//               </Box>
//               <ModalCloseButton
//                 position="static"
//                 color="white"
//                 _hover={{ bg: "rgba(255,255,255,.15)" }}
//                 borderRadius="8px"
//               />
//             </Flex>
//           </ModalHeader>

//           <ModalBody px={0} py={0}>
//             {loadingDetail ? (
//               <Flex justify="center" py={20}>
//                 <Spinner color="#4a72b8" size="xl" />
//               </Flex>
//             ) : (
//               <Flex h="full" direction={{ base: "column", lg: "row" }}>
//                 {/* LEFT PANEL — request info + attachments */}
//                 <Box
//                   w={{ base: "100%", lg: "340px" }}
//                   flexShrink={0}
//                   borderRight={{ base: "none", lg: "1px solid #e2e8f0" }}
//                   borderBottom={{ base: "1px solid #e2e8f0", lg: "none" }}
//                   p={6}
//                   overflowY="auto"
//                   maxH={{ lg: "calc(100vh - 200px)" }}
//                 >
//                   <Text
//                     fontSize="11px"
//                     fontWeight={800}
//                     color="#94a3b8"
//                     textTransform="uppercase"
//                     letterSpacing="2px"
//                     mb={4}
//                   >
//                     Request Details
//                   </Text>

//                   <Stack spacing={3} mb={6}>
//                     {fullRequest &&
//                       [
//                         ["Exam Type", fullRequest.examType],
//                         [
//                           "Type",
//                           isSectionedRequest
//                             ? "Sectioned Test"
//                             : "Standard Test",
//                         ],
//                         ...(!isSectionedRequest
//                           ? [["Subject", fullRequest.subject || "Any/Mixed"]]
//                           : []),
//                         ["Questions Needed", fullRequest.totalQuestions],
//                         ["Time Limit", `${fullRequest.timeLimitMin} minutes`],
//                         ["Difficulty", fullRequest.difficulty],
//                         ["Visibility", fullRequest.visibility],
//                         ["Submitted By", fullRequest.requestedBy?.Name],
//                         [
//                           "Submitted At",
//                           new Date(fullRequest.createdAt).toLocaleString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                               hour12: true,
//                             },
//                           ),
//                         ],
//                       ].map(([label, val]) => (
//                         <Flex
//                           key={label}
//                           justify="space-between"
//                           py={2}
//                           borderBottom="1px solid #f1f5f9"
//                         >
//                           <Text
//                             fontSize="12px"
//                             color="#94a3b8"
//                             fontWeight={600}
//                           >
//                             {label}
//                           </Text>
//                           <Text
//                             fontSize="12px"
//                             color="#0f172a"
//                             fontWeight={700}
//                             textTransform="capitalize"
//                             textAlign="right"
//                             maxW="60%"
//                           >
//                             {val}
//                           </Text>
//                         </Flex>
//                       ))}
//                   </Stack>

//                   {/* Section breakdown */}
//                   {isSectionedRequest && fullRequest.sections?.length > 0 && (
//                     <Box mb={5}>
//                       <Text
//                         fontSize="11px"
//                         fontWeight={800}
//                         color="#94a3b8"
//                         textTransform="uppercase"
//                         letterSpacing="2px"
//                         mb={3}
//                       >
//                         Sections Requested
//                       </Text>
//                       <Stack spacing={2}>
//                         {fullRequest.sections.map((sec, i) => (
//                           <Flex
//                             key={i}
//                             align="center"
//                             justify="space-between"
//                             bg="#f0f7ff"
//                             borderRadius="8px"
//                             border="1px solid #bfdbfe"
//                             px={3}
//                             py={2}
//                           >
//                             <Flex align="center" gap={2}>
//                               <Flex
//                                 w="20px"
//                                 h="20px"
//                                 bg="#2563eb"
//                                 borderRadius="5px"
//                                 align="center"
//                                 justify="center"
//                               >
//                                 <Text
//                                   fontSize="9px"
//                                   fontWeight={900}
//                                   color="white"
//                                 >
//                                   {i + 1}
//                                 </Text>
//                               </Flex>
//                               <Text
//                                 fontSize="12px"
//                                 fontWeight={700}
//                                 color="#1e40af"
//                                 textTransform="capitalize"
//                               >
//                                 {sec.subject}
//                               </Text>
//                             </Flex>
//                             <Text
//                               fontSize="11px"
//                               color="#2563eb"
//                               fontWeight={600}
//                             >
//                               {sec.totalQuestions} Q
//                             </Text>
//                           </Flex>
//                         ))}
//                       </Stack>
//                     </Box>
//                   )}

//                   {fullRequest?.instructions && (
//                     <Box
//                       bg="#fffbeb"
//                       border="1px solid #fde68a"
//                       borderRadius="10px"
//                       p={3}
//                       mb={5}
//                     >
//                       <Text
//                         fontSize="10px"
//                         fontWeight={800}
//                         color="#92400e"
//                         textTransform="uppercase"
//                         letterSpacing=".6px"
//                         mb={1}
//                       >
//                         Instructions
//                       </Text>
//                       <Text fontSize="12px" color="#78350f" lineHeight={1.7}>
//                         {fullRequest.instructions}
//                       </Text>
//                     </Box>
//                   )}

//                   {/* Attachments */}
//                   {fullRequest?.attachments?.length > 0 && (
//                     <Box>
//                       <Text
//                         fontSize="11px"
//                         fontWeight={800}
//                         color="#94a3b8"
//                         textTransform="uppercase"
//                         letterSpacing="2px"
//                         mb={3}
//                       >
//                         Uploaded Files ({fullRequest.attachments.length})
//                       </Text>
//                       <Stack spacing={3}>
//                         {fullRequest.attachments.map((att, i) => (
//                           <Box
//                             key={i}
//                             bg="#f8fafc"
//                             borderRadius="12px"
//                             border="1px solid #e2e8f0"
//                             overflow="hidden"
//                           >
//                             <Flex
//                               align="center"
//                               gap={2}
//                               px={3}
//                               py={3}
//                               cursor="pointer"
//                               _hover={{ bg: "#f0f7ff" }}
//                               transition="background .15s"
//                               onClick={() => handlePreviewFile(att)}
//                               borderBottom="1px solid #e2e8f0"
//                             >
//                               <FileIcon type={att.fileType} size="18px" />
//                               <Box flex={1} minW={0}>
//                                 <Text
//                                   fontSize="12px"
//                                   fontWeight={700}
//                                   color="#0f172a"
//                                   noOfLines={1}
//                                 >
//                                   {att.fileName}
//                                 </Text>
//                                 <Text fontSize="10px" color="#94a3b8">
//                                   {att.fileType?.toUpperCase()} · click to
//                                   preview
//                                 </Text>
//                               </Box>
//                               <Icon
//                                 as={FaExpand}
//                                 fontSize="10px"
//                                 color="#94a3b8"
//                                 flexShrink={0}
//                               />
//                             </Flex>
//                             {att.fileType === "image" && (
//                               <Box
//                                 cursor="pointer"
//                                 onClick={() => handlePreviewFile(att)}
//                                 overflow="hidden"
//                                 maxH="160px"
//                                 position="relative"
//                                 _hover={{ opacity: 0.85 }}
//                                 transition="opacity .15s"
//                               >
//                                 <img
//                                   src={`data:image/jpeg;base64,${att.fileData}`}
//                                   alt={att.fileName}
//                                   style={{
//                                     width: "100%",
//                                     maxHeight: "160px",
//                                     objectFit: "cover",
//                                     background: "#f1f5f9",
//                                     display: "block",
//                                   }}
//                                 />
//                               </Box>
//                             )}
//                             {att.fileType === "pdf" && (
//                               <Box
//                                 cursor="pointer"
//                                 onClick={() => handlePreviewFile(att)}
//                                 h="80px"
//                                 overflow="hidden"
//                                 position="relative"
//                                 _hover={{ opacity: 0.85 }}
//                                 transition="opacity .15s"
//                               >
//                                 <iframe
//                                   src={`data:application/pdf;base64,${att.fileData}`}
//                                   width="100%"
//                                   height="400px"
//                                   style={{
//                                     border: "none",
//                                     pointerEvents: "none",
//                                     marginTop: "-10px",
//                                   }}
//                                   title={att.fileName}
//                                 />
//                                 <Box
//                                   position="absolute"
//                                   inset={0}
//                                   bg="transparent"
//                                 />
//                               </Box>
//                             )}
//                             <Flex gap={2} p={3}>
//                               <Button
//                                 size="xs"
//                                 flex={1}
//                                 h="30px"
//                                 leftIcon={<Icon as={FaEye} fontSize="10px" />}
//                                 onClick={() => handlePreviewFile(att)}
//                                 bg="#eff6ff"
//                                 color="#2563eb"
//                                 borderRadius="7px"
//                                 fontWeight={700}
//                                 fontSize="11px"
//                                 _hover={{ bg: "#dbeafe" }}
//                               >
//                                 View
//                               </Button>
//                               <Button
//                                 size="xs"
//                                 flex={1}
//                                 h="30px"
//                                 leftIcon={
//                                   <Icon as={FaDownload} fontSize="10px" />
//                                 }
//                                 onClick={() => downloadFile(att)}
//                                 bg="#f0fdf4"
//                                 color="#15803d"
//                                 borderRadius="7px"
//                                 fontWeight={700}
//                                 fontSize="11px"
//                                 _hover={{ bg: "#dcfce7" }}
//                               >
//                                 Download
//                               </Button>
//                               {!isSectionedRequest && (
//                                 <Button
//                                   size="xs"
//                                   flex={1}
//                                   h="30px"
//                                   leftIcon={
//                                     <Icon as={FaRobot} fontSize="10px" />
//                                   }
//                                   onClick={() => generateFromFile(att)}
//                                   isLoading={aiLoading}
//                                   bg="#f5f3ff"
//                                   color="#7c3aed"
//                                   borderRadius="7px"
//                                   fontWeight={700}
//                                   fontSize="11px"
//                                   _hover={{ bg: "#ede9fe" }}
//                                 >
//                                   AI
//                                 </Button>
//                               )}
//                             </Flex>
//                           </Box>
//                         ))}
//                       </Stack>
//                     </Box>
//                   )}
//                 </Box>

//                 {/* RIGHT PANEL — AI + question editor */}
//                 <Box
//                   flex={1}
//                   p={6}
//                   overflowY="auto"
//                   maxH={{ lg: "calc(100vh - 200px)" }}
//                 >
//                   {/* AI prompt — only shown for non-sectioned, or as general reference */}
//                   {!isSectionedRequest && (
//                     <Box
//                       bg="linear-gradient(135deg,#f5f3ff,#ede9fe)"
//                       border="1px solid #c4b5fd"
//                       borderRadius="14px"
//                       p={5}
//                       mb={6}
//                     >
//                       <Flex align="center" gap={2} mb={3}>
//                         <Icon as={FaRobot} color="#7c3aed" fontSize="16px" />
//                         <Text fontSize="13px" fontWeight={800} color="#4c1d95">
//                           AI Question Generator
//                         </Text>
//                       </Flex>
//                       <Textarea
//                         value={aiPrompt}
//                         onChange={(e) => setAiPrompt(e.target.value)}
//                         placeholder="Describe what questions you want to generate…"
//                         borderRadius="10px"
//                         fontSize="13px"
//                         rows={3}
//                         resize="vertical"
//                         mb={3}
//                         bg="white"
//                         borderColor="#c4b5fd"
//                         _focus={{
//                           borderColor: "#7c3aed",
//                           boxShadow: "0 0 0 1px #7c3aed",
//                         }}
//                       />
//                       <Button
//                         leftIcon={<FaRobot />}
//                         onClick={generateWithAI}
//                         isLoading={aiLoading}
//                         loadingText="Generating questions…"
//                         bg="#7c3aed"
//                         color="white"
//                         borderRadius="10px"
//                         fontWeight={800}
//                         fontSize="13px"
//                         h="42px"
//                         _hover={{ bg: "#6d28d9" }}
//                         w={{ base: "full", sm: "auto" }}
//                       >
//                         Generate {fullRequest?.totalQuestions || 20} Questions
//                         with AI
//                       </Button>
//                       {questions.length > 0 && (
//                         <Text
//                           fontSize="12px"
//                           color="#6d28d9"
//                           mt={2}
//                           fontWeight={600}
//                         >
//                           ✓ {questions.length} questions ready — review below
//                           before sending
//                         </Text>
//                       )}
//                     </Box>
//                   )}

//                   {/* SECTIONED: per-section editors */}
//                   {isSectionedRequest ? (
//                     <Box>
//                       <Flex align="center" gap={2} mb={5}>
//                         <Icon
//                           as={FaLayerGroup}
//                           color="#2563eb"
//                           fontSize="16px"
//                         />
//                         <Text fontSize="15px" fontWeight={800} color="#0f172a">
//                           Section Question Editors
//                         </Text>
//                         <Text fontSize="12px" color="#94a3b8">
//                           · {totalSectionQCount} questions added across{" "}
//                           {fullRequest?.sections?.length} sections
//                         </Text>
//                       </Flex>
//                       {fullRequest?.sections?.map((sec, sIdx) => (
//                         <SectionEditor
//                           key={sIdx}
//                           section={sec}
//                           sectionIdx={sIdx}
//                           sectionQuestions={sectionQuestions}
//                           setSectionQuestions={setSectionQuestions}
//                           fullRequest={fullRequest}
//                           aiLoading={aiLoading}
//                           setAiLoading={setAiLoading}
//                           toast={toast}
//                         />
//                       ))}
//                     </Box>
//                   ) : (
//                     /* NON-SECTIONED: flat editor */
//                     <Box>
//                       <Flex justify="space-between" align="center" mb={4}>
//                         <Text
//                           fontSize="11px"
//                           fontWeight={800}
//                           color="#94a3b8"
//                           textTransform="uppercase"
//                           letterSpacing="2px"
//                         >
//                           Questions ({questions.length})
//                         </Text>
//                         <Button
//                           size="sm"
//                           leftIcon={<FaPlus />}
//                           onClick={addBlankQuestion}
//                           variant="outline"
//                           borderRadius="8px"
//                           fontSize="12px"
//                           fontWeight={700}
//                           borderColor="#4a72b8"
//                           color="#4a72b8"
//                         >
//                           Add Manually
//                         </Button>
//                       </Flex>
//                       {questions.length === 0 ? (
//                         <Box
//                           py={12}
//                           textAlign="center"
//                           bg="#f8fafc"
//                           borderRadius="14px"
//                           border="2px dashed #e2e8f0"
//                         >
//                           <Icon
//                             as={FaClipboardList}
//                             fontSize="36px"
//                             color="#e2e8f0"
//                             display="block"
//                             mx="auto"
//                             mb={3}
//                           />
//                           <Text
//                             fontSize="14px"
//                             color="#94a3b8"
//                             fontWeight={600}
//                           >
//                             No questions yet — use AI or add manually
//                           </Text>
//                         </Box>
//                       ) : (
//                         questions.map((q, idx) => (
//                           <QuestionRow
//                             key={idx}
//                             q={q}
//                             idx={idx}
//                             onChange={updateQuestion}
//                             onDelete={deleteQuestion}
//                           />
//                         ))
//                       )}
//                     </Box>
//                   )}
//                 </Box>
//               </Flex>
//             )}
//           </ModalBody>

//           {selected?.status !== "completed" && (
//             <ModalFooter
//               px={7}
//               py={5}
//               borderTop="1px solid #f1f5f9"
//               gap={3}
//               flexWrap="wrap"
//             >
//               <Textarea
//                 value={adminNote}
//                 onChange={(e) => setAdminNote(e.target.value)}
//                 placeholder="Optional note for the coaching…"
//                 borderRadius="10px"
//                 fontSize="13px"
//                 rows={2}
//                 resize="none"
//                 flex={1}
//                 minW={{ base: "100%", md: "300px" }}
//                 borderColor="#e2e8f0"
//                 _focus={{
//                   borderColor: "#4a72b8",
//                   boxShadow: "0 0 0 1px #4a72b8",
//                 }}
//               />
//               <Flex gap={3} flexShrink={0}>
//                 <Button
//                   h="46px"
//                   borderRadius="12px"
//                   bg="#fee2e2"
//                   color="#dc2626"
//                   fontWeight={700}
//                   fontSize="13px"
//                   leftIcon={<FaTimesCircle />}
//                   onClick={() => {
//                     setRejectReason("");
//                     openReject();
//                   }}
//                   _hover={{ bg: "#fecaca" }}
//                 >
//                   Reject
//                 </Button>
//                 <Button
//                   h="46px"
//                   borderRadius="12px"
//                   bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
//                   color="white"
//                   fontWeight={800}
//                   fontSize="14px"
//                   leftIcon={<FaPaperPlane />}
//                   isLoading={acting}
//                   loadingText="Sending…"
//                   isDisabled={
//                     isSectionedRequest
//                       ? sectionQuestions.some((sq) => sq.questions.length === 0)
//                       : questions.length === 0
//                   }
//                   onClick={handleSendTest}
//                   _hover={{ opacity: 0.9 }}
//                   px={8}
//                 >
//                   {isSectionedRequest
//                     ? `Send Test (${totalSectionQCount} Q, ${fullRequest?.sections?.length} sections)`
//                     : `Send Test (${questions.length} Q)`}
//                 </Button>
//               </Flex>
//             </ModalFooter>
//           )}
//         </ModalContent>
//       </Modal>

//       <FilePreviewModal
//         attachment={previewFile}
//         isOpen={previewOpen}
//         onClose={closePreview}
//       />

//       {/* Reject dialog */}
//       <AlertDialog
//         isOpen={rejectOpen}
//         leastDestructiveRef={cancelRef}
//         onClose={closeReject}
//         isCentered
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent
//             mx={4}
//             borderRadius="16px"
//             fontFamily="'Sora',sans-serif"
//           >
//             <AlertDialogHeader fontSize="16px" fontWeight={800}>
//               Reject Request
//             </AlertDialogHeader>
//             <AlertDialogBody>
//               <Text fontSize="14px" color="#475569" mb={3}>
//                 Provide a reason so the coaching knows what to change:
//               </Text>
//               <Textarea
//                 value={rejectReason}
//                 onChange={(e) => setRejectReason(e.target.value)}
//                 placeholder="e.g. Please provide more specific topic details…"
//                 borderRadius="10px"
//                 rows={3}
//                 fontSize="13px"
//                 borderColor="#e2e8f0"
//                 _focus={{
//                   borderColor: "#ef4444",
//                   boxShadow: "0 0 0 1px #ef4444",
//                 }}
//               />
//             </AlertDialogBody>
//             <AlertDialogFooter gap={3}>
//               <Button
//                 ref={cancelRef}
//                 onClick={closeReject}
//                 variant="ghost"
//                 borderRadius="10px"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 bg="#ef4444"
//                 color="white"
//                 borderRadius="10px"
//                 fontWeight={700}
//                 _hover={{ bg: "#dc2626" }}
//                 isLoading={acting}
//                 onClick={handleReject}
//                 leftIcon={<FaTimesCircle />}
//               >
//                 Reject Request
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </Box>
//   );
// }










/**
 * AdminTestRequestsPage.jsx
 * Test-creation requests from coaching owners.
 * AI question generation (flat + per-section), file preview, send/reject.
 * Now uses AdminNavPage for consistent layout.
 */
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box, Flex, Text, Input, Button, Icon, Spinner, Badge, Select,
  Textarea, useToast, Stack, Divider, Modal, ModalOverlay, ModalContent,
  ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure,
  InputGroup, InputLeftElement, AlertDialog, AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
  Grid,
} from "@chakra-ui/react";
import {
  FaSearch, FaCheckCircle, FaTimesCircle, FaClock, FaEye, FaRobot,
  FaPlus, FaTrash, FaClipboardList, FaFilePdf, FaFileImage, FaFileExcel,
  FaDownload, FaCheck, FaPaperPlane, FaHourglass, FaExpand, FaTimes,
  FaLayerGroup, FaSyncAlt,
} from "react-icons/fa";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import AdminNavPage from "./AdminNavPage";

const StatusBadge = ({ status }) => {
  const cfg = {
    pending:    { bg: "#fef9c3", color: "#a16207", icon: FaHourglass,    label: "Pending" },
    processing: { bg: "#eff6ff", color: "#1d4ed8", icon: FaClock,        label: "Processing" },
    completed:  { bg: "#dcfce7", color: "#15803d", icon: FaCheckCircle,  label: "Completed" },
    rejected:   { bg: "#fee2e2", color: "#dc2626", icon: FaTimesCircle,  label: "Rejected" },
  };
  const c = cfg[status] || cfg.pending;
  return (
    <Flex align="center" gap={1.5} bg={c.bg} color={c.color} px={3} py="4px" borderRadius="full" fontSize="11px" fontWeight={700} w="fit-content">
      <Icon as={c.icon} fontSize="10px" />{c.label}
    </Flex>
  );
};

const FileIcon = ({ type, size = "16px" }) => {
  const map = { pdf: FaFilePdf, image: FaFileImage, excel: FaFileExcel };
  const colors = { pdf: "#ef4444", image: "#8b5cf6", excel: "#16a34a" };
  const Ic = map[type] || FaClipboardList;
  return <Icon as={Ic} color={colors[type] || "#64748b"} fontSize={size} />;
};

const downloadFile = (att) => {
  try {
    const mimeMap = { pdf: "application/pdf", image: "image/jpeg", excel: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" };
    const mime = mimeMap[att.fileType] || "application/octet-stream";
    const byteChars = atob(att.fileData);
    const byteArrays = [];
    for (let offset = 0; offset < byteChars.length; offset += 512) {
      const slice = byteChars.slice(offset, offset + 512);
      byteArrays.push(new Uint8Array(slice.length).map((_, i) => slice.charCodeAt(i)));
    }
    const blob = new Blob(byteArrays, { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = att.fileName || `attachment.${att.fileType === "image" ? "jpg" : att.fileType}`;
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    window.open(`data:application/octet-stream;base64,${att.fileData}`, "_blank");
  }
};

function FilePreviewModal({ attachment, isOpen, onClose }) {
  if (!attachment) return null;
  const { fileType, fileData, fileName } = attachment;
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(6px)" bg="rgba(0,0,0,.7)" />
      <ModalContent borderRadius="16px" overflow="hidden" fontFamily="'Sora',sans-serif" maxH="90vh" mx={4}>
        <ModalHeader px={6} py={4} bg="linear-gradient(135deg,#0f1e3a,#1e3a5f)" color="white" borderRadius="16px 16px 0 0">
          <Flex align="center" justify="space-between">
            <Flex align="center" gap={3}>
              <FileIcon type={fileType} size="20px" />
              <Box>
                <Text fontSize="14px" fontWeight={800} noOfLines={1} maxW="500px">{fileName}</Text>
                <Text fontSize="11px" color="rgba(255,255,255,.5)" textTransform="uppercase">{fileType} file</Text>
              </Box>
            </Flex>
            <Flex gap={2}>
              <Button size="sm" h="34px" px={4} bg="rgba(255,255,255,.12)" color="white" borderRadius="8px" fontWeight={700} fontSize="12px"
                leftIcon={<Icon as={FaDownload} fontSize="11px" />} onClick={() => downloadFile(attachment)} _hover={{ bg: "rgba(255,255,255,.2)" }}>
                Download
              </Button>
              <Button size="sm" h="34px" w="34px" p={0} bg="rgba(255,255,255,.12)" color="white" borderRadius="8px" onClick={onClose} _hover={{ bg: "rgba(255,255,255,.2)" }}>
                <Icon as={FaTimes} fontSize="12px" />
              </Button>
            </Flex>
          </Flex>
        </ModalHeader>
        <ModalBody p={0} bg="#0f172a" minH="400px" display="flex" alignItems="center" justifyContent="center">
          {fileType === "image" && (
            <Box w="100%" textAlign="center" p={4}>
              <img src={`data:image/jpeg;base64,${fileData}`} alt={fileName} style={{ maxWidth: "100%", maxHeight: "75vh", objectFit: "contain", borderRadius: "8px" }} />
            </Box>
          )}
          {fileType === "pdf" && (
            <Box w="100%" h="75vh">
              <iframe src={`data:application/pdf;base64,${fileData}`} width="100%" height="100%" style={{ border: "none" }} title={fileName} />
            </Box>
          )}
          {fileType === "excel" && (
            <Flex direction="column" align="center" gap={5} py={16} color="white">
              <Icon as={FaFileExcel} fontSize="64px" color="#16a34a" />
              <Box textAlign="center">
                <Text fontSize="16px" fontWeight={700} mb={6}>{fileName}</Text>
                <Button h="46px" px={8} borderRadius="12px" bg="#16a34a" color="white" fontWeight={800}
                  leftIcon={<Icon as={FaDownload} />} onClick={() => downloadFile(attachment)} _hover={{ bg: "#15803d" }}>
                  Download to View
                </Button>
              </Box>
            </Flex>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function QuestionRow({ q, idx, onChange, onDelete }) {
  const sf = (k) => (e) => onChange(idx, { ...q, [k]: e.target.value });
  const sfOpt = (oi) => (e) => { const opts = [...(q.options || ["", "", "", ""])]; opts[oi] = e.target.value; onChange(idx, { ...q, options: opts }); };
  return (
    <Box bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0" p={4} mb={3}>
      <Flex justify="space-between" align="flex-start" mb={2}>
        <Text fontSize="11px" fontWeight={800} color="#94a3b8" textTransform="uppercase" letterSpacing=".8px">Q{idx + 1}</Text>
        <Box as="button" onClick={() => onDelete(idx)} p="4px" borderRadius="6px" color="#ef4444" _hover={{ bg: "#fef2f2" }}>
          <Icon as={FaTrash} fontSize="11px" />
        </Box>
      </Flex>
      <Textarea value={q.qus || ""} onChange={sf("qus")} placeholder="Question text…" borderRadius="8px" fontSize="13px" rows={2} resize="vertical" mb={3} borderColor="#e2e8f0" _focus={{ borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" }} />
      <Flex gap={2} flexWrap="wrap" mb={3}>
        {(q.options || ["", "", "", ""]).map((opt, oi) => (
          <Flex key={oi} align="center" gap={2} flex="1" minW="48%">
            <Flex w="22px" h="22px" bg={q.answer === oi ? "#dcfce7" : "#f1f5f9"} color={q.answer === oi ? "#15803d" : "#64748b"}
              borderRadius="6px" align="center" justify="center" fontSize="10px" fontWeight={800} flexShrink={0}
              cursor="pointer" border={q.answer === oi ? "1.5px solid #15803d" : "1.5px solid transparent"}
              onClick={() => onChange(idx, { ...q, answer: oi })}>
              {["A", "B", "C", "D"][oi]}
            </Flex>
            <Input value={opt} onChange={sfOpt(oi)} placeholder={`Option ${["A", "B", "C", "D"][oi]}…`} borderRadius="8px" h="36px" fontSize="13px" borderColor={q.answer === oi ? "#16a34a" : "#e2e8f0"} bg={q.answer === oi ? "#f0fdf4" : "white"} _focus={{ borderColor: "#4a72b8" }} />
          </Flex>
        ))}
      </Flex>
      <Input value={q.explanation || ""} onChange={sf("explanation")} placeholder="Explanation (optional)…" borderRadius="8px" h="36px" fontSize="12px" borderColor="#e2e8f0" color="#64748b" _focus={{ borderColor: "#4a72b8" }} />
    </Box>
  );
}

function SectionEditor({ section, sectionIdx, sectionQuestions, setSectionQuestions, fullRequest, aiLoading, setAiLoading, toast }) {
  const sq = sectionQuestions[sectionIdx] || { questions: [] };
  const setSecQ = (qs) => setSectionQuestions((prev) => prev.map((s, i) => i === sectionIdx ? { questions: qs } : s));

  const generateSectionAI = async () => {
    setAiLoading(true);
    try {
      const systemPrompt = `You are an expert question paper setter for Indian competitive exams. Generate exactly ${section.totalQuestions} high-quality MCQs for the subject: ${section.subject}. Exam: ${fullRequest.examType}. Difficulty: ${fullRequest.difficulty}. Return ONLY valid JSON array, no markdown: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 6000, system: systemPrompt, messages: [{ role: "user", content: `Generate ${section.totalQuestions} MCQs for ${section.subject}` }] }),
      });
      const data = await response.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const match = clean.match(/\[[\s\S]*\]/);
      const parsed = match ? JSON.parse(match[0]) : JSON.parse(clean);
      const normalised = parsed.map((q) => ({ qus: q.qus || q.question || "", options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"], answer: typeof q.answer === "number" ? q.answer : 0, explanation: q.explanation || "" }));
      setSecQ(normalised);
      toast({ title: `✅ ${normalised.length} questions for ${section.subject}!`, status: "success", duration: 3000 });
    } catch (err) {
      toast({ title: `AI Error: ${err.message}`, status: "error", duration: 4000 });
    } finally { setAiLoading(false); }
  };

  return (
    <Box mb={6} bg="#f8fafc" borderRadius="14px" border="1px solid #e2e8f0" overflow="hidden">
      <Flex align="center" justify="space-between" px={5} py={3} bg="white" borderBottom="1px solid #e2e8f0">
        <Flex align="center" gap={2}>
          <Flex w="26px" h="26px" bg="#eff6ff" borderRadius="7px" align="center" justify="center">
            <Text fontSize="11px" fontWeight={900} color="#2563eb">{sectionIdx + 1}</Text>
          </Flex>
          <Text fontSize="13px" fontWeight={800} color="#0f172a" textTransform="capitalize">{section.subject || `Section ${sectionIdx + 1}`}</Text>
          <Text fontSize="11px" color="#94a3b8">· {section.totalQuestions} questions requested</Text>
        </Flex>
        <Flex align="center" gap={2}>
          <Text fontSize="11px" fontWeight={700} color={sq.questions.length >= section.totalQuestions ? "#16a34a" : "#d97706"}>{sq.questions.length}/{section.totalQuestions} added</Text>
          <Button size="xs" leftIcon={<Icon as={FaRobot} fontSize="9px" />} onClick={generateSectionAI} isLoading={aiLoading} bg="#f5f3ff" color="#7c3aed" borderRadius="7px" fontWeight={700} fontSize="11px" _hover={{ bg: "#ede9fe" }}>AI Generate</Button>
          <Button size="xs" leftIcon={<Icon as={FaPlus} fontSize="9px" />} onClick={() => setSecQ([...sq.questions, { qus: "", options: ["", "", "", ""], answer: 0, explanation: "" }])} bg="#eff6ff" color="#2563eb" borderRadius="7px" fontWeight={700} fontSize="11px" _hover={{ bg: "#dbeafe" }}>Add</Button>
        </Flex>
      </Flex>
      <Box p={4}>
        {sq.questions.length === 0 ? (
          <Box py={8} textAlign="center" bg="white" borderRadius="10px" border="2px dashed #e2e8f0">
            <Text fontSize="13px" color="#94a3b8">No questions yet — use AI Generate or Add manually</Text>
          </Box>
        ) : sq.questions.map((q, qi) => (
          <QuestionRow key={qi} q={q} idx={qi}
            onChange={(i, updated) => setSecQ(sq.questions.map((qq, ii) => ii === i ? updated : qq))}
            onDelete={(i) => setSecQ(sq.questions.filter((_, ii) => ii !== i))}
          />
        ))}
      </Box>
    </Box>
  );
}

export default function AdminTestRequestsPage() {
  const toast = useToast();
  const cancelRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: rejectOpen, onOpen: openReject, onClose: closeReject } = useDisclosure();
  const { isOpen: previewOpen, onOpen: openPreview, onClose: closePreview } = useDisclosure();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [fullRequest, setFullRequest] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [sectionQuestions, setSectionQuestions] = useState([]);
  const [adminNote, setAdminNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [acting, setActing] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await apiFetch(`/test-requests/admin/all?${params}`);
      setRequests(res.data ?? []);
    } catch (err) { toast({ title: err.message, status: "error", duration: 3000 }); }
    finally { setLoading(false); }
  }, [statusFilter, search]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const openDetail = async (req) => {
    setSelected(req); setQuestions([]); setSectionQuestions([]); setAdminNote(""); setAiPrompt(""); onOpen(); setLoadingDetail(true);
    try {
      const res = await apiFetch(`/test-requests/admin/${req._id}`);
      setFullRequest(res.data);
      if (res.data.isSectioned && res.data.sections?.length) setSectionQuestions(res.data.sections.map(() => ({ questions: [] })));
      setAiPrompt(`Create ${res.data.totalQuestions} multiple choice questions for ${res.data.examType} exam.${res.data.subject ? ` Subject: ${res.data.subject}.` : ""} Difficulty: ${res.data.difficulty}.${res.data.instructions ? ` Special instructions: ${res.data.instructions}` : ""}`);
      if (req.status === "pending") {
        await apiFetch(`/test-requests/admin/${req._id}/processing`, { method: "PATCH" });
        setRequests((prev) => prev.map((r) => r._id === req._id ? { ...r, status: "processing" } : r));
      }
    } catch { toast({ title: "Failed to load request details", status: "error" }); }
    finally { setLoadingDetail(false); }
  };

  const generateWithAI = async () => {
    if (!fullRequest) return;
    setAiLoading(true);
    try {
      const systemPrompt = `You are an expert question paper setter for Indian competitive exams. Generate exactly ${fullRequest.totalQuestions} high-quality multiple choice questions. Format: Return ONLY valid JSON array, no markdown, no explanation outside JSON. Each question: { "qus": "question text", "options": ["A text","B text","C text","D text"], "answer": 0, "explanation": "brief explanation" } answer is 0-indexed (0=A, 1=B, 2=C, 3=D).`;
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8000, system: systemPrompt, messages: [{ role: "user", content: aiPrompt }] }),
      });
      const data = await response.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      let parsed;
      try { parsed = JSON.parse(clean); } catch { const m = clean.match(/\[[\s\S]*\]/); if (m) parsed = JSON.parse(m[0]); else throw new Error("Could not parse AI response as JSON"); }
      if (!Array.isArray(parsed) || !parsed.length) throw new Error("AI returned empty questions");
      const normalised = parsed.map((q) => ({ qus: q.qus || q.question || "", options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"], answer: typeof q.answer === "number" ? q.answer : 0, explanation: q.explanation || "" }));
      setQuestions(normalised);
      toast({ title: `✅ ${normalised.length} questions generated!`, description: "Review and edit before sending.", status: "success", duration: 4000 });
    } catch (err) { toast({ title: `AI Error: ${err.message}`, status: "error", duration: 5000 }); }
    finally { setAiLoading(false); }
  };

  const generateFromFile = async (attachment) => {
    if (!fullRequest) return;
    setAiLoading(true);
    try {
      let messages;
      if (attachment.fileType === "image") {
        messages = [{ role: "user", content: [{ type: "image", source: { type: "base64", media_type: "image/jpeg", data: attachment.fileData } }, { type: "text", text: `Based on this study material, create ${fullRequest.totalQuestions} MCQs for ${fullRequest.examType} exam. Difficulty: ${fullRequest.difficulty}. Return ONLY JSON array: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]` }] }];
      } else if (attachment.fileType === "pdf") {
        messages = [{ role: "user", content: [{ type: "document", source: { type: "base64", media_type: "application/pdf", data: attachment.fileData } }, { type: "text", text: `Based on this PDF, create ${fullRequest.totalQuestions} MCQs for ${fullRequest.examType} exam. Difficulty: ${fullRequest.difficulty}. ${fullRequest.instructions || ""}. Return ONLY JSON array: [{ "qus": "...", "options": ["A","B","C","D"], "answer": 0, "explanation": "..." }]` }] }];
      } else { toast({ title: "For Excel files, use the AI prompt instead", status: "info" }); setAiLoading(false); return; }
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 8000, messages }),
      });
      const data = await response.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const match = clean.match(/\[[\s\S]*\]/);
      const parsed = match ? JSON.parse(match[0]) : JSON.parse(clean);
      const normalised = parsed.map((q) => ({ qus: q.qus || q.question || "", options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"], answer: typeof q.answer === "number" ? q.answer : 0, explanation: q.explanation || "" }));
      setQuestions(normalised);
      toast({ title: `✅ ${normalised.length} questions generated from file!`, status: "success", duration: 4000 });
    } catch (err) { toast({ title: `Error: ${err.message}`, status: "error", duration: 5000 }); }
    finally { setAiLoading(false); }
  };

  const handleSendTest = async () => {
    if (!selected) return;
    const isSectioned = fullRequest?.isSectioned === true;
    if (isSectioned) {
      for (let sIdx = 0; sIdx < (fullRequest.sections?.length || 0); sIdx++) {
        const sq = sectionQuestions[sIdx];
        if (!sq || sq.questions.length === 0) { toast({ title: `Section "${fullRequest.sections[sIdx]?.subject || sIdx + 1}" has no questions`, status: "warning" }); return; }
        const invalid = sq.questions.findIndex((q) => !q.qus?.trim() || q.options.some((o) => !o?.trim()));
        if (invalid !== -1) { toast({ title: `Section "${fullRequest.sections[sIdx]?.subject}" — Q${invalid + 1} is incomplete`, status: "warning" }); return; }
      }
    } else {
      if (!questions.length) { toast({ title: "Add at least 1 question before sending", status: "warning" }); return; }
      const invalid = questions.findIndex((q) => !q.qus?.trim() || q.options.some((o) => !o?.trim()));
      if (invalid !== -1) { toast({ title: `Question ${invalid + 1} is incomplete`, status: "warning" }); return; }
    }
    setActing(true);
    try {
      const body = isSectioned
        ? { sections: sectionQuestions.map((sq, i) => ({ name: fullRequest.sections[i]?.subject || `Section ${i + 1}`, subject: fullRequest.sections[i]?.subject || "", questions: sq.questions })), adminNote }
        : { questions, adminNote };
      const res = await apiFetch(`/test-requests/admin/${selected._id}/create-test`, { method: "POST", body: JSON.stringify(body) });
      toast({ title: res.message, status: "success", duration: 5000 });
      onClose();
      loadRequests();
    } catch (err) { toast({ title: err.message, status: "error", duration: 4000 }); }
    finally { setActing(false); }
  };

  const handleReject = async () => {
    if (!selected || !rejectReason.trim()) { toast({ title: "Please provide a rejection reason", status: "warning" }); return; }
    setActing(true);
    try {
      await apiFetch(`/test-requests/admin/${selected._id}/reject`, { method: "PATCH", body: JSON.stringify({ adminNote: rejectReason }) });
      toast({ title: "Request rejected", status: "info", duration: 3000 });
      closeReject(); onClose(); loadRequests();
    } catch (err) { toast({ title: err.message, status: "error" }); }
    finally { setActing(false); }
  };

  const isSectionedRequest = fullRequest?.isSectioned === true;
  const totalSectionQCount = sectionQuestions.reduce((s, sq) => s + (sq.questions?.length || 0), 0);

  return (
    <AdminNavPage title="Test Creation Requests" subtitle="Admin Panel">
      {/* Filters */}
      <Flex gap={3} mb={5} flexWrap={{ base: "wrap", md: "nowrap" }}>
        <InputGroup flex={1}>
          <InputLeftElement pointerEvents="none" h="full" pl={3}>
            <Icon as={FaSearch} color="gray.400" fontSize="13px" />
          </InputLeftElement>
          <Input placeholder="Search by title or exam…" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && loadRequests()}
            bg="white" borderRadius="10px" h="42px" fontSize="14px" pl="38px" border="1px solid #e2e8f0" _focus={{ borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" }} />
        </InputGroup>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} bg="white" borderRadius="10px" h="42px" minW="160px" maxW="160px" fontSize="13px" fontWeight={600} border="1px solid #e2e8f0">
          <option value="">All Statuses</option>
          <option value="pending">⏳ Pending</option>
          <option value="processing">🔄 Processing</option>
          <option value="completed">✅ Completed</option>
          <option value="rejected">❌ Rejected</option>
        </Select>
        <Button onClick={loadRequests} bg="#4a72b8" color="white" borderRadius="10px" h="42px" px={5} fontSize="13px" fontWeight={700}
          leftIcon={<Icon as={FaSyncAlt} fontSize="11px" />} _hover={{ opacity: 0.9 }}>Search</Button>
      </Flex>

      {/* Table */}
      {loading ? (
        <Flex justify="center" py={20}><Spinner color="#4a72b8" thickness="3px" size="xl" /></Flex>
      ) : requests.length === 0 ? (
        <Box py={20} textAlign="center" bg="white" borderRadius="16px" border="1px solid #e2e8f0">
          <Icon as={FaClipboardList} fontSize="48px" color="#e2e8f0" display="block" mx="auto" mb={4} />
          <Text fontSize="15px" fontWeight={700} color="#94a3b8">No requests found</Text>
        </Box>
      ) : (
        <Box bg="white" borderRadius="16px" border="1px solid #e2e8f0" overflow="hidden">
          <Flex px={6} py={3} bg="#f8fafc" borderBottom="1px solid #e2e8f0" display={{ base: "none", md: "flex" }}>
            {[["Request", 3], ["Coaching", 2], ["Details", 2], ["Date", 2], ["Status", 2], ["", 1]].map(([h, f]) => (
              <Text key={h} flex={f} fontSize="11px" fontWeight={700} color="#94a3b8" textTransform="uppercase" letterSpacing=".8px">{h}</Text>
            ))}
          </Flex>
          {requests.map((r, idx) => (
            <Flex key={r._id} px={6} py={4} align="center" gap={3}
              borderBottom={idx < requests.length - 1 ? "1px solid #f1f5f9" : "none"}
              transition="background .15s" _hover={{ bg: "#f8faff" }} flexWrap={{ base: "wrap", md: "nowrap" }}>
              <Box flex={3} minW={0}>
                <Flex align="center" gap={2}>
                  <Text fontSize="14px" fontWeight={700} color="#0f172a" noOfLines={1}>{r.title}</Text>
                  {r.isSectioned && (
                    <Flex align="center" gap={1} bg="#eff6ff" color="#2563eb" px={2} py="1px" borderRadius="full" fontSize="9px" fontWeight={700} flexShrink={0}>
                      <Icon as={FaLayerGroup} fontSize="8px" />{r.sections?.length || 0}s
                    </Flex>
                  )}
                </Flex>
                <Flex gap={1.5} mt={1} flexWrap="wrap">
                  <Text fontSize="9px" fontWeight={700} bg="#eff6ff" color="#2563eb" px={2} py="2px" borderRadius="full">{r.examType}</Text>
                  {!r.isSectioned && r.subject && <Text fontSize="9px" fontWeight={700} bg="#f1f5f9" color="#475569" px={2} py="2px" borderRadius="full" textTransform="capitalize">{r.subject}</Text>}
                  {r.attachmentCount > 0 && <Text fontSize="9px" fontWeight={700} bg="#f5f3ff" color="#7c3aed" px={2} py="2px" borderRadius="full">{r.attachmentCount} file{r.attachmentCount > 1 ? "s" : ""}</Text>}
                </Flex>
              </Box>
              <Box flex={2} display={{ base: "none", md: "block" }} minW={0}>
                <Text fontSize="13px" fontWeight={600} color="#374151" noOfLines={1}>{r.coachingId?.name || "—"}</Text>
                <Text fontSize="11px" color="#94a3b8">{r.coachingId?.city || ""}</Text>
              </Box>
              <Box flex={2} display={{ base: "none", md: "block" }}>
                <Text fontSize="12px" color="#64748b">
                  {r.isSectioned ? `${r.sections?.length || 0} sections · ${r.totalQuestions}Q` : `${r.totalQuestions} Q · ${r.timeLimitMin}min · ${r.difficulty}`}
                </Text>
              </Box>
              <Box flex={2} display={{ base: "none", md: "block" }}>
                <Text fontSize="12px" color="#94a3b8">{new Date(r.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</Text>
              </Box>
              <Box flex={2}><StatusBadge status={r.status} /></Box>
              <Flex flex={1} justify="flex-end">
                <Button size="sm" leftIcon={r.status === "completed" ? <FaCheck /> : <FaEye />} onClick={() => openDetail(r)}
                  bg={r.status === "completed" ? "#f0fdf4" : "#f0f7ff"} color={r.status === "completed" ? "#15803d" : "#4a72b8"}
                  borderRadius="8px" fontSize="12px" fontWeight={700} _hover={{ opacity: 0.8 }} h="32px">
                  {r.status === "completed" ? "Done" : "Open"}
                </Button>
              </Flex>
            </Flex>
          ))}
        </Box>
      )}

      {/* Build Test Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent borderRadius={{ base: 0, md: "16px" }} fontFamily="'Sora',sans-serif" maxW={{ base: "100%", md: "95vw" }} mx="auto" my={{ base: 0, md: 4 }}>
          <ModalHeader px={7} pt={7} pb={5} bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)" color="white" borderRadius={{ base: 0, md: "16px 16px 0 0" }}>
            <Flex align="center" justify="space-between">
              <Box>
                <Flex align="center" gap={2}>
                  <Text fontSize="18px" fontWeight={800} lineHeight={1.2}>{selected?.title}</Text>
                  {isSectionedRequest && (
                    <Flex align="center" gap={1} bg="rgba(56,189,248,.2)" color="#38bdf8" px={2} py="2px" borderRadius="full" fontSize="11px" fontWeight={700}>
                      <Icon as={FaLayerGroup} fontSize="10px" />{fullRequest?.sections?.length} Sections
                    </Flex>
                  )}
                </Flex>
                <Flex gap={2} mt={2} flexWrap="wrap" align="center">
                  {selected && <StatusBadge status={selected.status} />}
                  <Text fontSize="11px" color="rgba(255,255,255,.5)">from {selected?.coachingId?.name || "coaching"}</Text>
                </Flex>
              </Box>
              <ModalCloseButton position="static" color="white" _hover={{ bg: "rgba(255,255,255,.15)" }} borderRadius="8px" />
            </Flex>
          </ModalHeader>

          <ModalBody px={0} py={0}>
            {loadingDetail ? (
              <Flex justify="center" py={20}><Spinner color="#4a72b8" size="xl" /></Flex>
            ) : (
              <Flex h="full" direction={{ base: "column", lg: "row" }}>
                {/* Left: request info + attachments */}
                <Box w={{ base: "100%", lg: "340px" }} flexShrink={0} borderRight={{ base: "none", lg: "1px solid #e2e8f0" }} borderBottom={{ base: "1px solid #e2e8f0", lg: "none" }} p={6} overflowY="auto" maxH={{ lg: "calc(100vh - 200px)" }}>
                  <Text fontSize="11px" fontWeight={800} color="#94a3b8" textTransform="uppercase" letterSpacing="2px" mb={4}>Request Details</Text>
                  <Stack spacing={3} mb={6}>
                    {fullRequest && [
                      ["Exam Type", fullRequest.examType],
                      ["Type", isSectionedRequest ? "Sectioned Test" : "Standard Test"],
                      ...(!isSectionedRequest ? [["Subject", fullRequest.subject || "Any/Mixed"]] : []),
                      ["Questions Needed", fullRequest.totalQuestions],
                      ["Time Limit", `${fullRequest.timeLimitMin} minutes`],
                      ["Difficulty", fullRequest.difficulty],
                      ["Visibility", fullRequest.visibility],
                      ["Submitted By", fullRequest.requestedBy?.Name],
                      ["Submitted At", new Date(fullRequest.createdAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })],
                    ].map(([label, val]) => (
                      <Flex key={label} justify="space-between" py={2} borderBottom="1px solid #f1f5f9">
                        <Text fontSize="12px" color="#94a3b8" fontWeight={600}>{label}</Text>
                        <Text fontSize="12px" color="#0f172a" fontWeight={700} textTransform="capitalize" textAlign="right" maxW="60%">{val}</Text>
                      </Flex>
                    ))}
                  </Stack>

                  {isSectionedRequest && fullRequest.sections?.length > 0 && (
                    <Box mb={5}>
                      <Text fontSize="11px" fontWeight={800} color="#94a3b8" textTransform="uppercase" letterSpacing="2px" mb={3}>Sections Requested</Text>
                      <Stack spacing={2}>
                        {fullRequest.sections.map((sec, i) => (
                          <Flex key={i} align="center" justify="space-between" bg="#f0f7ff" borderRadius="8px" border="1px solid #bfdbfe" px={3} py={2}>
                            <Flex align="center" gap={2}>
                              <Flex w="20px" h="20px" bg="#2563eb" borderRadius="5px" align="center" justify="center"><Text fontSize="9px" fontWeight={900} color="white">{i + 1}</Text></Flex>
                              <Text fontSize="12px" fontWeight={700} color="#1e40af" textTransform="capitalize">{sec.subject}</Text>
                            </Flex>
                            <Text fontSize="11px" color="#2563eb" fontWeight={600}>{sec.totalQuestions} Q</Text>
                          </Flex>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  {fullRequest?.instructions && (
                    <Box bg="#fffbeb" border="1px solid #fde68a" borderRadius="10px" p={3} mb={5}>
                      <Text fontSize="10px" fontWeight={800} color="#92400e" textTransform="uppercase" letterSpacing=".6px" mb={1}>Instructions</Text>
                      <Text fontSize="12px" color="#78350f" lineHeight={1.7}>{fullRequest.instructions}</Text>
                    </Box>
                  )}

                  {fullRequest?.attachments?.length > 0 && (
                    <Box>
                      <Text fontSize="11px" fontWeight={800} color="#94a3b8" textTransform="uppercase" letterSpacing="2px" mb={3}>Uploaded Files ({fullRequest.attachments.length})</Text>
                      <Stack spacing={3}>
                        {fullRequest.attachments.map((att, i) => (
                          <Box key={i} bg="#f8fafc" borderRadius="12px" border="1px solid #e2e8f0" overflow="hidden">
                            <Flex align="center" gap={2} px={3} py={3} cursor="pointer" _hover={{ bg: "#f0f7ff" }} transition="background .15s" onClick={() => { setPreviewFile(att); openPreview(); }} borderBottom="1px solid #e2e8f0">
                              <FileIcon type={att.fileType} size="18px" />
                              <Box flex={1} minW={0}>
                                <Text fontSize="12px" fontWeight={700} color="#0f172a" noOfLines={1}>{att.fileName}</Text>
                                <Text fontSize="10px" color="#94a3b8">{att.fileType?.toUpperCase()} · click to preview</Text>
                              </Box>
                              <Icon as={FaExpand} fontSize="10px" color="#94a3b8" flexShrink={0} />
                            </Flex>
                            {att.fileType === "image" && (
                              <Box cursor="pointer" onClick={() => { setPreviewFile(att); openPreview(); }} overflow="hidden" maxH="160px" _hover={{ opacity: 0.85 }} transition="opacity .15s">
                                <img src={`data:image/jpeg;base64,${att.fileData}`} alt={att.fileName} style={{ width: "100%", maxHeight: "160px", objectFit: "cover", background: "#f1f5f9", display: "block" }} />
                              </Box>
                            )}
                            <Flex gap={2} p={3}>
                              <Button size="xs" flex={1} h="30px" leftIcon={<Icon as={FaEye} fontSize="10px" />} onClick={() => { setPreviewFile(att); openPreview(); }} bg="#eff6ff" color="#2563eb" borderRadius="7px" fontWeight={700} fontSize="11px" _hover={{ bg: "#dbeafe" }}>View</Button>
                              <Button size="xs" flex={1} h="30px" leftIcon={<Icon as={FaDownload} fontSize="10px" />} onClick={() => downloadFile(att)} bg="#f0fdf4" color="#15803d" borderRadius="7px" fontWeight={700} fontSize="11px" _hover={{ bg: "#dcfce7" }}>Download</Button>
                              {!isSectionedRequest && <Button size="xs" flex={1} h="30px" leftIcon={<Icon as={FaRobot} fontSize="10px" />} onClick={() => generateFromFile(att)} isLoading={aiLoading} bg="#f5f3ff" color="#7c3aed" borderRadius="7px" fontWeight={700} fontSize="11px" _hover={{ bg: "#ede9fe" }}>AI</Button>}
                            </Flex>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </Box>

                {/* Right: AI + question editor */}
                <Box flex={1} p={6} overflowY="auto" maxH={{ lg: "calc(100vh - 200px)" }}>
                  {!isSectionedRequest && (
                    <Box bg="linear-gradient(135deg,#f5f3ff,#ede9fe)" border="1px solid #c4b5fd" borderRadius="14px" p={5} mb={6}>
                      <Flex align="center" gap={2} mb={3}>
                        <Icon as={FaRobot} color="#7c3aed" fontSize="16px" />
                        <Text fontSize="13px" fontWeight={800} color="#4c1d95">AI Question Generator</Text>
                      </Flex>
                      <Textarea value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="Describe what questions you want to generate…" borderRadius="10px" fontSize="13px" rows={3} resize="vertical" mb={3} bg="white" borderColor="#c4b5fd" _focus={{ borderColor: "#7c3aed", boxShadow: "0 0 0 1px #7c3aed" }} />
                      <Button leftIcon={<FaRobot />} onClick={generateWithAI} isLoading={aiLoading} loadingText="Generating questions…" bg="#7c3aed" color="white" borderRadius="10px" fontWeight={800} fontSize="13px" h="42px" _hover={{ bg: "#6d28d9" }} w={{ base: "full", sm: "auto" }}>
                        Generate {fullRequest?.totalQuestions || 20} Questions with AI
                      </Button>
                      {questions.length > 0 && <Text fontSize="12px" color="#6d28d9" mt={2} fontWeight={600}>✓ {questions.length} questions ready — review below before sending</Text>}
                    </Box>
                  )}

                  {isSectionedRequest ? (
                    <Box>
                      <Flex align="center" gap={2} mb={5}>
                        <Icon as={FaLayerGroup} color="#2563eb" fontSize="16px" />
                        <Text fontSize="15px" fontWeight={800} color="#0f172a">Section Question Editors</Text>
                        <Text fontSize="12px" color="#94a3b8">· {totalSectionQCount} questions added across {fullRequest?.sections?.length} sections</Text>
                      </Flex>
                      {fullRequest?.sections?.map((sec, sIdx) => (
                        <SectionEditor key={sIdx} section={sec} sectionIdx={sIdx} sectionQuestions={sectionQuestions} setSectionQuestions={setSectionQuestions} fullRequest={fullRequest} aiLoading={aiLoading} setAiLoading={setAiLoading} toast={toast} />
                      ))}
                    </Box>
                  ) : (
                    <Box>
                      <Flex justify="space-between" align="center" mb={4}>
                        <Text fontSize="11px" fontWeight={800} color="#94a3b8" textTransform="uppercase" letterSpacing="2px">Questions ({questions.length})</Text>
                        <Button size="sm" leftIcon={<FaPlus />} onClick={() => setQuestions((p) => [...p, { qus: "", options: ["", "", "", ""], answer: 0, explanation: "" }])} variant="outline" borderRadius="8px" fontSize="12px" fontWeight={700} borderColor="#4a72b8" color="#4a72b8">Add Manually</Button>
                      </Flex>
                      {questions.length === 0 ? (
                        <Box py={12} textAlign="center" bg="#f8fafc" borderRadius="14px" border="2px dashed #e2e8f0">
                          <Icon as={FaClipboardList} fontSize="36px" color="#e2e8f0" display="block" mx="auto" mb={3} />
                          <Text fontSize="14px" color="#94a3b8" fontWeight={600}>No questions yet — use AI or add manually</Text>
                        </Box>
                      ) : questions.map((q, idx) => (
                        <QuestionRow key={idx} q={q} idx={idx} onChange={(i, u) => setQuestions((p) => p.map((qq, ii) => ii === i ? u : qq))} onDelete={(i) => setQuestions((p) => p.filter((_, ii) => ii !== i))} />
                      ))}
                    </Box>
                  )}
                </Box>
              </Flex>
            )}
          </ModalBody>

          {selected?.status !== "completed" && (
            <ModalFooter px={7} py={5} borderTop="1px solid #f1f5f9" gap={3} flexWrap="wrap">
              <Textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Optional note for the coaching…" borderRadius="10px" fontSize="13px" rows={2} resize="none" flex={1} minW={{ base: "100%", md: "300px" }} borderColor="#e2e8f0" _focus={{ borderColor: "#4a72b8", boxShadow: "0 0 0 1px #4a72b8" }} />
              <Flex gap={3} flexShrink={0}>
                <Button h="46px" borderRadius="12px" bg="#fee2e2" color="#dc2626" fontWeight={700} fontSize="13px" leftIcon={<FaTimesCircle />} onClick={() => { setRejectReason(""); openReject(); }} _hover={{ bg: "#fecaca" }}>Reject</Button>
                <Button h="46px" borderRadius="12px" bg="linear-gradient(135deg,#4a72b8,#1e3a5f)" color="white" fontWeight={800} fontSize="14px" leftIcon={<FaPaperPlane />}
                  isLoading={acting} loadingText="Sending…"
                  isDisabled={isSectionedRequest ? sectionQuestions.some((sq) => sq.questions.length === 0) : questions.length === 0}
                  onClick={handleSendTest} _hover={{ opacity: 0.9 }} px={8}>
                  {isSectionedRequest ? `Send Test (${totalSectionQCount} Q, ${fullRequest?.sections?.length} sections)` : `Send Test (${questions.length} Q)`}
                </Button>
              </Flex>
            </ModalFooter>
          )}
        </ModalContent>
      </Modal>

      <FilePreviewModal attachment={previewFile} isOpen={previewOpen} onClose={closePreview} />

      {/* Reject dialog */}
      <AlertDialog isOpen={rejectOpen} leastDestructiveRef={cancelRef} onClose={closeReject} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent mx={4} borderRadius="16px" fontFamily="'Sora',sans-serif">
            <AlertDialogHeader fontSize="16px" fontWeight={800}>Reject Request</AlertDialogHeader>
            <AlertDialogBody>
              <Text fontSize="14px" color="#475569" mb={3}>Provide a reason so the coaching knows what to change:</Text>
              <Textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="e.g. Please provide more specific topic details…" borderRadius="10px" rows={3} fontSize="13px" borderColor="#e2e8f0" _focus={{ borderColor: "#ef4444", boxShadow: "0 0 0 1px #ef4444" }} />
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button ref={cancelRef} onClick={closeReject} variant="ghost" borderRadius="10px">Cancel</Button>
              <Button bg="#ef4444" color="white" borderRadius="10px" fontWeight={700} _hover={{ bg: "#dc2626" }} isLoading={acting} onClick={handleReject} leftIcon={<FaTimesCircle />}>Reject Request</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminNavPage>
  );
}