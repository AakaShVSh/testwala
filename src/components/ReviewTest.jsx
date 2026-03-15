// /**
//  * ReviewTest.jsx
//  *
//  * One-question-at-a-time review mode.
//  * Reads ALL data from useLocation().state — sent by ResultPage navigate().
//  */

// import React, { useState } from "react";
// import { Box, Flex, Text, Badge, Icon, VStack, Button } from "@chakra-ui/react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaFlag,
//   FaCircle,
//   FaChartBar,
// } from "react-icons/fa";
// import { FiAlertCircle } from "react-icons/fi";

// const STATUS_CFG = {
//   correct: {
//     label: "Correct",
//     color: "#16a34a",
//     bg: "#f0fdf4",
//     border: "#bbf7d0",
//     icon: FaCheckCircle,
//   },
//   incorrect: {
//     label: "Incorrect",
//     color: "#ef4444",
//     bg: "#fef2f2",
//     border: "#fecaca",
//     icon: FaTimesCircle,
//   },
//   markedAnswered: {
//     label: "Marked & Answered",
//     color: "#7c3aed",
//     bg: "#f5f3ff",
//     border: "#ddd6fe",
//     icon: FaFlag,
//   },
//   markedSkipped: {
//     label: "Marked (Skipped)",
//     color: "#d97706",
//     bg: "#fffbeb",
//     border: "#fde68a",
//     icon: FaFlag,
//   },
//   skipped: {
//     label: "Not Attempted",
//     color: "#64748b",
//     bg: "#f8fafc",
//     border: "#e2e8f0",
//     icon: FaCircle,
//   },
//   answered: {
//     label: "Answered",
//     color: "#2563eb",
//     bg: "#eff6ff",
//     border: "#bfdbfe",
//     icon: FaCheckCircle,
//   },
//   notVisited: {
//     label: "Not Visited",
//     color: "#94a3b8",
//     bg: "#f8fafc",
//     border: "#e2e8f0",
//     icon: FaCircle,
//   },
// };

// const SIDEBAR_COLORS = {
//   correct: { bg: "#16a34a", color: "white" },
//   incorrect: { bg: "#ef4444", color: "white" },
//   markedAnswered: { bg: "#7c3aed", color: "white" },
//   markedSkipped: { bg: "#d97706", color: "white" },
//   skipped: { bg: "#e2e8f0", color: "#64748b" },
//   answered: { bg: "#2563eb", color: "white" },
//   notVisited: { bg: "#f1f5f9", color: "#94a3b8" },
// };

// function getStatus(
//   index,
//   {
//     correctQus,
//     wrongansqus,
//     markedAndAnswer,
//     markedNotAnswer,
//     notAnswer,
//     answeredQuestion,
//   },
// ) {
//   if (correctQus.includes(index)) return "correct";
//   if (wrongansqus.includes(index)) return "incorrect";
//   if (markedAndAnswer.includes(index)) return "markedAnswered";
//   if (markedNotAnswer.includes(index)) return "markedSkipped";
//   if (notAnswer.includes(index)) return "skipped";
//   if (answeredQuestion.includes(index)) return "answered";
//   return "notVisited";
// }

// function QuestionView({ question, index, allAnswers, statusArrays }) {
//   if (!question) return null;
//   const status = getStatus(index, statusArrays);
//   const cfg = STATUS_CFG[status];
//   const userAnswerIdx = allAnswers[index] ?? allAnswers[String(index)];
//   const correctIdx =
//     typeof question.answer === "number" ? question.answer : question.answer - 1;

//   return (
//     <Box
//       bg={cfg.bg}
//       border="1.5px solid"
//       borderColor={cfg.border}
//       borderRadius="16px"
//       overflow="hidden"
//       boxShadow="0 4px 16px rgba(0,0,0,.06)"
//     >
//       <Flex
//         align="center"
//         justify="space-between"
//         px={5}
//         py={3}
//         bg="white"
//         borderBottom="1px solid"
//         borderColor={cfg.border}
//       >
//         <Flex align="center" gap={3}>
//           <Flex
//             w="28px"
//             h="28px"
//             bg={cfg.bg}
//             borderRadius="full"
//             align="center"
//             justify="center"
//             border="1.5px solid"
//             borderColor={cfg.border}
//           >
//             <Text fontSize="12px" fontWeight={800} color={cfg.color}>
//               {index + 1}
//             </Text>
//           </Flex>
//           <Badge
//             px={3}
//             py={1}
//             borderRadius="full"
//             fontSize="11px"
//             fontWeight={700}
//             bg={cfg.bg}
//             color={cfg.color}
//             border="1px solid"
//             borderColor={cfg.border}
//           >
//             <Flex align="center" gap={1.5}>
//               <Icon as={cfg.icon} fontSize="11px" />
//               {cfg.label}
//             </Flex>
//           </Badge>
//         </Flex>
//         <Text fontSize="12px" color="#94a3b8" fontWeight={600}>
//           Q {index + 1}
//         </Text>
//       </Flex>

//       <Box px={5} py={5}>
//         <Text
//           fontSize="15px"
//           fontWeight={600}
//           color="#1e293b"
//           mb={5}
//           lineHeight="1.7"
//         >
//           {question.qus}
//         </Text>

//         <VStack spacing={2} align="stretch" mb={5}>
//           {question.options?.map((opt, i) => {
//             const isCorrect = i === correctIdx;
//             const isUserPick = userAnswerIdx === i;
//             const isWrong = isUserPick && !isCorrect;
//             return (
//               <Flex
//                 key={i}
//                 align="center"
//                 gap={3}
//                 px={4}
//                 py={3}
//                 borderRadius="10px"
//                 border="1.5px solid"
//                 borderColor={
//                   isCorrect ? "#86efac" : isWrong ? "#fca5a5" : "#e2e8f0"
//                 }
//                 bg={isCorrect ? "#f0fdf4" : isWrong ? "#fef2f2" : "white"}
//               >
//                 <Flex
//                   w="26px"
//                   h="26px"
//                   borderRadius="full"
//                   flexShrink={0}
//                   align="center"
//                   justify="center"
//                   fontWeight={800}
//                   fontSize="11px"
//                   bg={isCorrect ? "#16a34a" : isWrong ? "#ef4444" : "#f1f5f9"}
//                   color={isCorrect || isWrong ? "white" : "#64748b"}
//                 >
//                   {String.fromCharCode(65 + i)}
//                 </Flex>
//                 <Text
//                   flex={1}
//                   fontSize="13px"
//                   color="#374151"
//                   fontWeight={isCorrect || isUserPick ? 600 : 400}
//                 >
//                   {opt}
//                 </Text>
//                 <Flex gap={1.5} flexShrink={0}>
//                   {isCorrect && (
//                     <Badge
//                       bg="#f0fdf4"
//                       color="#16a34a"
//                       fontSize="10px"
//                       fontWeight={700}
//                       border="1px solid #bbf7d0"
//                       px={2}
//                       py={0.5}
//                       borderRadius="full"
//                     >
//                       ✓ Correct
//                     </Badge>
//                   )}
//                   {isUserPick && isCorrect && (
//                     <Badge
//                       bg="#eff6ff"
//                       color="#2563eb"
//                       fontSize="10px"
//                       fontWeight={700}
//                       border="1px solid #bfdbfe"
//                       px={2}
//                       py={0.5}
//                       borderRadius="full"
//                     >
//                       Your Answer
//                     </Badge>
//                   )}
//                   {isWrong && (
//                     <Badge
//                       bg="#fef2f2"
//                       color="#ef4444"
//                       fontSize="10px"
//                       fontWeight={700}
//                       border="1px solid #fecaca"
//                       px={2}
//                       py={0.5}
//                       borderRadius="full"
//                     >
//                       ✗ Your Answer
//                     </Badge>
//                   )}
//                 </Flex>
//               </Flex>
//             );
//           })}
//         </VStack>

//         <Flex gap={6} mb={question.explanation ? 4 : 0} flexWrap="wrap">
//           <Box>
//             <Text
//               fontSize="11px"
//               color="#94a3b8"
//               fontWeight={600}
//               textTransform="uppercase"
//               mb={1}
//             >
//               Your Answer
//             </Text>
//             <Text
//               fontSize="13px"
//               fontWeight={700}
//               color={
//                 status === "correct"
//                   ? "#16a34a"
//                   : status === "incorrect"
//                     ? "#ef4444"
//                     : "#94a3b8"
//               }
//             >
//               {userAnswerIdx !== undefined && userAnswerIdx !== null
//                 ? question.options?.[userAnswerIdx] || "—"
//                 : "Not Attempted"}
//             </Text>
//           </Box>
//           <Box>
//             <Text
//               fontSize="11px"
//               color="#94a3b8"
//               fontWeight={600}
//               textTransform="uppercase"
//               mb={1}
//             >
//               Correct Answer
//             </Text>
//             <Text fontSize="13px" fontWeight={700} color="#16a34a">
//               {question.options?.[correctIdx] || "—"}
//             </Text>
//           </Box>
//         </Flex>

//         {question.explanation && (
//           <Box
//             mt={4}
//             p={4}
//             bg="#eff6ff"
//             borderRadius="10px"
//             borderLeft="3px solid #4a72b8"
//           >
//             <Flex align="center" gap={2} mb={1.5}>
//               <Icon as={FiAlertCircle} color="#4a72b8" fontSize="14px" />
//               <Text
//                 fontSize="11px"
//                 fontWeight={700}
//                 color="#1e3a5f"
//                 textTransform="uppercase"
//               >
//                 Explanation
//               </Text>
//             </Flex>
//             <Text fontSize="13px" color="#1e3a5f" lineHeight="1.7">
//               {question.explanation}
//             </Text>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

// export default function ReviewTest() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const s = location.state || {};

//   const questions = s.questions || [];
//   const allAnswers = s.allAnswers || {};
//   const correctQus = s.correctQus || [];
//   const wrongansqus = s.wrongansqus || [];
//   const answeredQuestion = s.answeredQuestion || [];
//   const notAnswer = s.notAnswer || [];
//   const markedAndAnswer = s.markedAndAnswer || [];
//   const markedNotAnswer = s.markedNotAnswer || [];
//   const testTitle = s.testTitle || "Test Review";

//   const statusArrays = {
//     correctQus,
//     wrongansqus,
//     markedAndAnswer,
//     markedNotAnswer,
//     notAnswer,
//     answeredQuestion,
//   };
//   const [current, setCurrent] = useState(0);

//   if (!questions.length) {
//     return (
//       <Flex
//         minH="100vh"
//         align="center"
//         justify="center"
//         direction="column"
//         gap={4}
//         bg="#f8fafc"
//         fontFamily="'Sora',sans-serif"
//       >
//         <Icon as={FaChartBar} fontSize="48px" color="#e2e8f0" />
//         <Text fontSize="16px" fontWeight={700} color="#374151">
//           No review data found
//         </Text>
//         <Text fontSize="13px" color="#94a3b8" mb={2}>
//           Please submit a test first
//         </Text>
//         <Button
//           onClick={() => navigate(-1)}
//           leftIcon={<Icon as={FaArrowLeft} />}
//           bg="#4a72b8"
//           color="white"
//           borderRadius="10px"
//           fontWeight={700}
//           _hover={{ bg: "#3b5fa0" }}
//         >
//           Go Back
//         </Button>
//       </Flex>
//     );
//   }

//   return (
//     <Box minH="100vh" bg="#f1f5f9" fontFamily="'Sora',sans-serif">
//       <Box
//         bg="linear-gradient(135deg,#0f1e3a,#1e3a5f,#2d5fa8)"
//         px={{ base: 4, md: 8 }}
//         py={5}
//       >
//         <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
//           <Flex align="center" gap={3}>
//             <Box
//               cursor="pointer"
//               onClick={() => navigate(-1)}
//               color="rgba(255,255,255,.5)"
//               _hover={{ color: "white" }}
//             >
//               <Icon as={FaArrowLeft} fontSize="14px" />
//             </Box>
//             <Box>
//               <Text
//                 fontSize={{ base: "15px", md: "18px" }}
//                 fontWeight={800}
//                 color="white"
//                 noOfLines={1}
//               >
//                 {testTitle}
//               </Text>
//               <Text fontSize="12px" color="rgba(255,255,255,.5)">
//                 Review Mode · Q{current + 1} of {questions.length}
//               </Text>
//             </Box>
//           </Flex>
//           <Flex
//             px={4}
//             py={2}
//             bg="rgba(255,255,255,.12)"
//             borderRadius="10px"
//             border="1px solid rgba(255,255,255,.2)"
//             align="center"
//           >
//             <Text fontSize="12px" fontWeight={700} color="white">
//               {current + 1} / {questions.length}
//             </Text>
//           </Flex>
//         </Flex>
//       </Box>

//       <Box maxW="1200px" mx="auto" px={{ base: 3, md: 8 }} py={6}>
//         <Flex
//           gap={6}
//           align="flex-start"
//           direction={{ base: "column", lg: "row" }}
//         >
//           {/* Sidebar */}
//           <Box
//             w={{ base: "100%", lg: "220px" }}
//             flexShrink={0}
//             bg="white"
//             borderRadius="16px"
//             border="1px solid #e2e8f0"
//             boxShadow="0 2px 12px rgba(0,0,0,.04)"
//             p={4}
//             position={{ base: "static", lg: "sticky" }}
//             top="20px"
//           >
//             <Text
//               fontSize="12px"
//               fontWeight={700}
//               color="#94a3b8"
//               textTransform="uppercase"
//               letterSpacing=".8px"
//               mb={3}
//             >
//               Questions
//             </Text>
//             <VStack align="stretch" spacing={1} mb={4}>
//               {[
//                 { key: "correct", label: "Correct" },
//                 { key: "incorrect", label: "Wrong" },
//                 { key: "skipped", label: "Skipped" },
//                 { key: "markedAnswered", label: "Marked & Ans" },
//                 { key: "markedSkipped", label: "Marked Skip" },
//               ].map(({ key, label }) => (
//                 <Flex key={key} align="center" gap={2}>
//                   <Box
//                     w="10px"
//                     h="10px"
//                     borderRadius="3px"
//                     bg={SIDEBAR_COLORS[key].bg}
//                     flexShrink={0}
//                     border={key === "skipped" ? "1px solid #cbd5e1" : "none"}
//                   />
//                   <Text fontSize="11px" color="#64748b">
//                     {label}
//                   </Text>
//                 </Flex>
//               ))}
//             </VStack>
//             <Flex flexWrap="wrap" gap={1.5}>
//               {questions.map((_, i) => {
//                 const st = getStatus(i, statusArrays);
//                 const sc = SIDEBAR_COLORS[st] || SIDEBAR_COLORS.notVisited;
//                 const isActive = i === current;
//                 return (
//                   <Flex
//                     key={i}
//                     w="32px"
//                     h="32px"
//                     align="center"
//                     justify="center"
//                     borderRadius="8px"
//                     cursor="pointer"
//                     fontSize="12px"
//                     fontWeight={700}
//                     bg={isActive ? "#0f1e3a" : sc.bg}
//                     color={isActive ? "white" : sc.color}
//                     border={isActive ? "2px solid #4a72b8" : "none"}
//                     boxShadow={
//                       isActive ? "0 0 0 2px rgba(74,114,184,.3)" : "none"
//                     }
//                     onClick={() => setCurrent(i)}
//                     transition="all .15s"
//                     _hover={{ opacity: 0.8 }}
//                   >
//                     {i + 1}
//                   </Flex>
//                 );
//               })}
//             </Flex>
//           </Box>

//           {/* Question */}
//           <Box flex={1} minW={0}>
//             <QuestionView
//               question={questions[current]}
//               index={current}
//               allAnswers={allAnswers}
//               statusArrays={statusArrays}
//             />
//             <Flex justify="space-between" mt={5} gap={3}>
//               <Button
//                 leftIcon={<Icon as={FaArrowLeft} />}
//                 isDisabled={current === 0}
//                 onClick={() => setCurrent((c) => Math.max(0, c - 1))}
//                 variant="outline"
//                 borderRadius="10px"
//                 fontWeight={700}
//                 fontSize="13px"
//                 borderColor="#e2e8f0"
//                 color="#374151"
//                 _hover={{ bg: "#f8fafc" }}
//               >
//                 Previous
//               </Button>
//               <Button
//                 onClick={() => navigate(-1)}
//                 bg="#f1f5f9"
//                 color="#64748b"
//                 borderRadius="10px"
//                 fontWeight={700}
//                 fontSize="13px"
//                 _hover={{ bg: "#e2e8f0" }}
//               >
//                 Back to Results
//               </Button>
//               <Button
//                 rightIcon={<Icon as={FaArrowRight} />}
//                 isDisabled={current === questions.length - 1}
//                 onClick={() =>
//                   setCurrent((c) => Math.min(questions.length - 1, c + 1))
//                 }
//                 bg="#4a72b8"
//                 color="white"
//                 borderRadius="10px"
//                 fontWeight={700}
//                 fontSize="13px"
//                 _hover={{ bg: "#3b5fa0" }}
//               >
//                 Next
//               </Button>
//             </Flex>
//           </Box>
//         </Flex>
//       </Box>
//     </Box>
//   );
// }

import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  Button,
  Grid,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
  FaCircle,
  FaChartBar,
  FaStopwatch,
  FaBars,
} from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";

/* ── helpers ─────────────────────────────────────────────────── */
const fmtTime = (s) => {
  if (!s && s !== 0) return null;
  if (s === 0) return "< 1s";
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
};

/* ── status config ────────────────────────────────────────────── */
const STATUS_MAP = {
  correct: {
    label: "Correct",
    color: "#15803d",
    bg: "#f0fdf4",
    border: "#86efac",
    cell: "#16a34a",
    icon: FaCheckCircle,
  },
  incorrect: {
    label: "Incorrect",
    color: "#b91c1c",
    bg: "#fef2f2",
    border: "#fca5a5",
    cell: "#ef4444",
    icon: FaTimesCircle,
  },
  markedAnswered: {
    label: "Marked & Answered",
    color: "#6d28d9",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    cell: "#7c3aed",
    icon: FaFlag,
  },
  markedSkipped: {
    label: "Marked (Skipped)",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fcd34d",
    cell: "#d97706",
    icon: FaFlag,
  },
  skipped: {
    label: "Not Attempted",
    color: "#475569",
    bg: "#f8fafc",
    border: "#cbd5e1",
    cell: "#94a3b8",
    icon: FaCircle,
  },
  answered: {
    label: "Answered",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#93c5fd",
    cell: "#2563eb",
    icon: FaCheckCircle,
  },
  notVisited: {
    label: "Not Visited",
    color: "#94a3b8",
    bg: "#f9fafb",
    border: "#e5e7eb",
    cell: "#d1d5db",
    icon: FaCircle,
  },
};

function getStatus(i, sa) {
  if (sa.correctQus.includes(i)) return "correct";
  if (sa.wrongansqus.includes(i)) return "incorrect";
  if (sa.markedAndAnswer.includes(i)) return "markedAnswered";
  if (sa.markedNotAnswer.includes(i)) return "markedSkipped";
  if (sa.notAnswer.includes(i)) return "skipped";
  if (sa.answeredQuestion.includes(i)) return "answered";
  return "notVisited";
}

/* ── Sidebar ──────────────────────────────────────────────────── */
function Sidebar({ questions, current, setCurrent, sa, onClose }) {
  const LEGEND = [
    ["correct", "Correct"],
    ["incorrect", "Wrong"],
    ["skipped", "Not Attempted"],
    ["markedAnswered", "Marked & Ans."],
    ["markedSkipped", "Marked (Skip)"],
    ["notVisited", "Not Visited"],
  ];

  return (
    <Flex direction="column" h="100%" overflow="hidden">
      {/* Legend */}
      <Box px={4} pt={5} pb={4} borderBottom="1px solid #f1f5f9" flexShrink={0}>
        <Text
          fontSize="10px"
          fontWeight={800}
          color="#94a3b8"
          textTransform="uppercase"
          letterSpacing="1px"
          mb={3}
        >
          Legend
        </Text>
        <Grid templateColumns="1fr 1fr" gap={2}>
          {LEGEND.map(([key, label]) => (
            <Flex key={key} align="center" gap={2}>
              <Box
                w="10px"
                h="10px"
                borderRadius="3px"
                flexShrink={0}
                bg={STATUS_MAP[key].cell}
                border={
                  key === "skipped" || key === "notVisited"
                    ? "1.5px solid #cbd5e1"
                    : "none"
                }
              />
              <Text
                fontSize="11px"
                color="#475569"
                fontWeight={500}
                noOfLines={1}
              >
                {label}
              </Text>
            </Flex>
          ))}
        </Grid>
      </Box>

      {/* Question palette */}
      <Box
        px={4}
        py={4}
        flex={1}
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { width: "3px" },
          "&::-webkit-scrollbar-thumb": {
            background: "#e2e8f0",
            borderRadius: "4px",
          },
        }}
      >
        <Text
          fontSize="10px"
          fontWeight={800}
          color="#94a3b8"
          textTransform="uppercase"
          letterSpacing="1px"
          mb={3}
        >
          Questions
        </Text>
        <Grid templateColumns="repeat(5, 1fr)" gap={2}>
          {questions.map((_, i) => {
            const st = getStatus(i, sa);
            const cfg = STATUS_MAP[st];
            const active = i === current;
            return (
              <Center
                key={i}
                h="34px"
                borderRadius="6px"
                cursor="pointer"
                fontSize="11px"
                fontWeight={800}
                bg={active ? "#0f172a" : cfg.cell}
                color="white"
                opacity={!active && st === "notVisited" ? 0.35 : 1}
                border={active ? "2px solid #3b82f6" : "2px solid transparent"}
                boxShadow={active ? "0 0 0 3px rgba(59,130,246,.2)" : "none"}
                transition="all .12s"
                _hover={{ opacity: 1, transform: "scale(1.08)" }}
                onClick={() => {
                  setCurrent(i);
                  if (onClose) onClose();
                }}
              >
                {i + 1}
              </Center>
            );
          })}
        </Grid>
      </Box>
    </Flex>
  );
}

/* ── Question card ────────────────────────────────────────────── */
function QuestionCard({ question, index, allAnswers, sa, questionTimes }) {
  if (!question) return null;

  const st = getStatus(index, sa);
  const cfg = STATUS_MAP[st];
  const uid = allAnswers[index] ?? allAnswers[String(index)];
  const cid =
    typeof question.answer === "number" ? question.answer : question.answer - 1;
  const timeStr = fmtTime(
    questionTimes?.[index] ?? questionTimes?.[String(index)] ?? null,
  );

  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid #e5e7eb"
      overflow="hidden"
      boxShadow="0 1px 8px rgba(0,0,0,.05)"
    >
      {/* coloured top strip */}
      <Box h="3px" bg={cfg.cell} />

      {/* header */}
      <Flex
        align="center"
        justify="space-between"
        px={{ base: 4, md: 5 }}
        py={3}
        borderBottom="1px solid #f3f4f6"
      >
        <Flex align="center" gap={2.5}>
          <Center
            w="28px"
            h="28px"
            borderRadius="6px"
            bg={cfg.bg}
            border={`1px solid ${cfg.border}`}
            flexShrink={0}
          >
            <Text fontSize="12px" fontWeight={900} color={cfg.color}>
              {index + 1}
            </Text>
          </Center>
          <Flex
            align="center"
            gap={1.5}
            px={2.5}
            py="4px"
            borderRadius="20px"
            bg={cfg.bg}
            border={`1px solid ${cfg.border}`}
          >
            <Icon as={cfg.icon} fontSize="10px" color={cfg.color} />
            <Text fontSize="11px" fontWeight={700} color={cfg.color}>
              {cfg.label}
            </Text>
          </Flex>
        </Flex>

        {timeStr && (
          <Flex
            align="center"
            gap={1.5}
            px={2.5}
            py="4px"
            borderRadius="20px"
            bg="#f9fafb"
            border="1px solid #e5e7eb"
          >
            <Icon as={FaStopwatch} fontSize="9px" color="#6b7280" />
            <Text fontSize="11px" fontWeight={700} color="#374151">
              {timeStr}
            </Text>
          </Flex>
        )}
      </Flex>

      {/* body */}
      <Box px={{ base: 4, md: 5 }} pt={4} pb={5}>
        {/* question text */}
        <Text
          fontSize={{ base: "15px", md: "16px" }}
          fontWeight={600}
          color="#0f172a"
          lineHeight="1.8"
          mb={4}
        >
          {question.qus}
        </Text>

        {/* options */}
        <VStack spacing={2} align="stretch" mb={4}>
          {question.options?.map((opt, i) => {
            const isC = i === cid;
            const isU = uid === i;
            const isW = isU && !isC;
            return (
              <Flex
                key={i}
                align="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="8px"
                border="1.5px solid"
                borderColor={isC ? "#86efac" : isW ? "#fca5a5" : "#e5e7eb"}
                bg={isC ? "#f0fdf4" : isW ? "#fef2f2" : "#fafafa"}
              >
                <Center
                  w="28px"
                  h="28px"
                  borderRadius="6px"
                  flexShrink={0}
                  fontSize="11px"
                  fontWeight={900}
                  bg={isC ? "#16a34a" : isW ? "#ef4444" : "#f3f4f6"}
                  color={isC || isW ? "white" : "#6b7280"}
                >
                  {isC ? (
                    <Icon as={FaCheckCircle} fontSize="12px" />
                  ) : isW ? (
                    <Icon as={FaTimesCircle} fontSize="12px" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </Center>

                <Text
                  flex={1}
                  fontSize="14px"
                  color={isC ? "#15803d" : isW ? "#b91c1c" : "#374151"}
                  fontWeight={isC || isU ? 600 : 400}
                  lineHeight="1.5"
                >
                  {opt}
                </Text>

                <Flex gap={1.5} flexShrink={0}>
                  {isC && (
                    <Box
                      px={2}
                      py="2px"
                      borderRadius="4px"
                      fontSize="10px"
                      fontWeight={700}
                      bg="#dcfce7"
                      color="#15803d"
                      border="1px solid #bbf7d0"
                    >
                      ✓ Correct
                    </Box>
                  )}
                  {isU && isC && (
                    <Box
                      px={2}
                      py="2px"
                      borderRadius="4px"
                      fontSize="10px"
                      fontWeight={700}
                      bg="#dbeafe"
                      color="#1d4ed8"
                      border="1px solid #bfdbfe"
                    >
                      Your Answer
                    </Box>
                  )}
                  {isW && (
                    <Box
                      px={2}
                      py="2px"
                      borderRadius="4px"
                      fontSize="10px"
                      fontWeight={700}
                      bg="#fee2e2"
                      color="#b91c1c"
                      border="1px solid #fecaca"
                    >
                      ✗ Your Answer
                    </Box>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </VStack>

        {/* explanation */}
        {question.explanation && (
          <Box
            p={4}
            bg="#eff6ff"
            borderRadius="8px"
            borderLeft="3px solid #3b82f6"
          >
            <Flex align="center" gap={2} mb={1.5}>
              <Icon as={FiAlertCircle} color="#3b82f6" fontSize="13px" />
              <Text
                fontSize="10px"
                fontWeight={800}
                color="#1e40af"
                textTransform="uppercase"
                letterSpacing=".7px"
              >
                Explanation
              </Text>
            </Flex>
            <Text fontSize="13px" color="#1e3a5f" lineHeight="1.75">
              {question.explanation}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

/* ── Main page ────────────────────────────────────────────────── */
export default function ReviewTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLg] = useMediaQuery("(min-width: 1024px)");

  const d = location.state || {};
  const questions = d.questions || [];
  const allAnswers = d.allAnswers || {};
  const questionTimes = d.questionTimes || {};
  const testTitle = d.testTitle || "Test Review";

  const sa = {
    correctQus: d.correctQus || [],
    wrongansqus: d.wrongansqus || [],
    answeredQuestion: d.answeredQuestion || [],
    notAnswer: d.notAnswer || [],
    markedAndAnswer: d.markedAndAnswer || [],
    markedNotAnswer: d.markedNotAnswer || [],
  };

  const [cur, setCur] = useState(0);

  /* sliding dot window */
  const HALF = 3;
  let start = Math.max(0, cur - HALF);
  let end = Math.min(questions.length - 1, start + 6);
  if (end - start < 6) start = Math.max(0, end - 6);
  const dots = [];
  for (let i = start; i <= end; i++) dots.push(i);

  /* no data guard */
  if (!questions.length) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        direction="column"
        gap={3}
        bg="#f9fafb"
        fontFamily="'DM Sans',sans-serif"
      >
        <Icon as={FaChartBar} fontSize="44px" color="#d1d5db" />
        <Text fontSize="17px" fontWeight={700} color="#111827">
          No review data
        </Text>
        <Button
          onClick={() => navigate(-1)}
          bg="#111827"
          color="white"
          borderRadius="8px"
          fontWeight={700}
          h="42px"
          px={5}
          mt={1}
          _hover={{ bg: "#1f2937" }}
        >
          Go Back
        </Button>
      </Flex>
    );
  }

  const curSt = getStatus(cur, sa);
  const curCfg = STATUS_MAP[curSt];

  /* header height for sticky offset */
  const HDR = { base: "54px", md: "60px" };

  return (
    <Box bg="#f3f4f6" minH="100vh" fontFamily="'DM Sans',sans-serif">
      {/* ── Header ── */}
      <Box
        bg="linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)"
        boxShadow="0 1px 12px rgba(0,0,0,.3)"
        position="sticky"
        top={0}
        zIndex={50}
      >
        <Flex
          px={{ base: 4, md: 6, lg: 8 }}
          h={HDR}
          align="center"
          justify="space-between"
        >
          {/* left: back + title */}
          <Flex align="center" gap={3} flex={1} minW={0}>
            <Center
              w="32px"
              h="32px"
              borderRadius="8px"
              flexShrink={0}
              bg="rgba(255,255,255,.08)"
              border="1px solid rgba(255,255,255,.12)"
              cursor="pointer"
              onClick={() => navigate(-1)}
              _hover={{ bg: "rgba(255,255,255,.15)" }}
              transition="background .15s"
            >
              <Icon
                as={FaArrowLeft}
                color="rgba(255,255,255,.8)"
                fontSize="12px"
              />
            </Center>
            <Box minW={0}>
              <Text
                fontSize={{ base: "13px", md: "15px" }}
                fontWeight={800}
                color="white"
                noOfLines={1}
                letterSpacing="-0.2px"
              >
                {testTitle}
              </Text>
              <Text
                fontSize="10px"
                color="rgba(255,255,255,.4)"
                fontWeight={600}
                textTransform="uppercase"
                letterSpacing=".8px"
              >
                Review Mode
              </Text>
            </Box>
          </Flex>

          {/* center: counter */}
          <Box
            px={4}
            py="6px"
            borderRadius="8px"
            flexShrink={0}
            bg="rgba(255,255,255,.08)"
            border="1px solid rgba(255,255,255,.12)"
          >
            <Text
              fontSize="14px"
              fontWeight={900}
              color="white"
              letterSpacing="1.5px"
              fontFamily="'JetBrains Mono',monospace"
            >
              {String(cur + 1).padStart(2, "0")}/
              {String(questions.length).padStart(2, "0")}
            </Text>
          </Box>

          {/* right: hamburger (non-desktop) */}
          {!isLg && (
            <Center
              w="32px"
              h="32px"
              borderRadius="8px"
              flexShrink={0}
              ml={3}
              bg="rgba(255,255,255,.08)"
              border="1px solid rgba(255,255,255,.12)"
              cursor="pointer"
              onClick={onOpen}
              _hover={{ bg: "rgba(255,255,255,.15)" }}
              transition="background .15s"
            >
              <Icon as={FaBars} color="rgba(255,255,255,.8)" fontSize="12px" />
            </Center>
          )}
        </Flex>
      </Box>

      {/* ── Body ── */}
      <Flex>
        {/* Desktop sidebar */}
        {isLg && (
          <Box
            w="240px"
            flexShrink={0}
            bg="white"
            borderRight="1px solid #e5e7eb"
            position="sticky"
            top={HDR.md || "60px"}
            h={`calc(100vh - 60px)`}
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": { width: "3px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#e5e7eb",
                borderRadius: "4px",
              },
            }}
          >
            <Sidebar
              questions={questions}
              current={cur}
              setCurrent={setCur}
              sa={sa}
            />
          </Box>
        )}

        {/* Mobile/tablet sidebar drawer */}
        {!isLg && (
          <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
            <DrawerOverlay backdropFilter="blur(3px)" bg="rgba(0,0,0,.3)" />
            <DrawerContent bg="white" maxW="260px">
              <DrawerCloseButton top={3} right={3} color="#374151" />
              <DrawerBody p={0} pt={10}>
                <Sidebar
                  questions={questions}
                  current={cur}
                  setCurrent={setCur}
                  sa={sa}
                  onClose={onClose}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        {/* Main content */}
        <Box flex={1} minW={0}>
          {/* sticky sub-header */}
          <Flex
            px={{ base: 4, md: 6, lg: 8 }}
            py={3}
            bg="white"
            borderBottom="1px solid #e5e7eb"
            align="center"
            gap={3}
            position="sticky"
            top={HDR}
            zIndex={40}
          >
            <Box px={3} py="5px" borderRadius="6px" bg="#0f172a">
              <Text
                fontSize="11px"
                fontWeight={800}
                color="white"
                letterSpacing=".3px"
              >
                Q {cur + 1} / {questions.length}
              </Text>
            </Box>
            <Flex
              align="center"
              gap={1.5}
              px={2.5}
              py="4px"
              borderRadius="20px"
              bg={curCfg.bg}
              border={`1px solid ${curCfg.border}`}
            >
              <Icon as={curCfg.icon} fontSize="10px" color={curCfg.color} />
              <Text fontSize="11px" fontWeight={700} color={curCfg.color}>
                {curCfg.label}
              </Text>
            </Flex>
          </Flex>

          {/* question card */}
          <Box px={{ base: 3, md: 5, lg: 8 }} pt={5} pb={4}>
            <QuestionCard
              question={questions[cur]}
              index={cur}
              allAnswers={allAnswers}
              sa={sa}
              questionTimes={questionTimes}
            />
          </Box>

          {/* bottom nav */}
          <Box px={{ base: 3, md: 5, lg: 8 }} pb={8}>
            <Flex
              align="center"
              justify="space-between"
              gap={3}
              bg="white"
              borderRadius="10px"
              border="1px solid #e5e7eb"
              px={3}
              py={2.5}
              boxShadow="0 1px 6px rgba(0,0,0,.04)"
            >
              <Button
                leftIcon={<Icon as={FaArrowLeft} fontSize="10px" />}
                isDisabled={cur === 0}
                onClick={() => setCur((c) => Math.max(0, c - 1))}
                bg="#f3f4f6"
                color="#374151"
                borderRadius="8px"
                fontWeight={700}
                fontSize="13px"
                h="38px"
                px={4}
                border="1px solid #e5e7eb"
                _hover={{ bg: "#e9eaec" }}
                _disabled={{ opacity: 0.35 }}
                transition="all .12s"
              >
                Prev
              </Button>

              <Flex align="center" gap={1.5} justify="center" flex={1}>
                {dots.map((i) => {
                  const s = getStatus(i, sa);
                  const c = STATUS_MAP[s];
                  const active = i === cur;
                  return (
                    <Center
                      key={i}
                      w="28px"
                      h="28px"
                      borderRadius="6px"
                      cursor="pointer"
                      fontSize="10px"
                      fontWeight={800}
                      bg={active ? "#0f172a" : c.cell}
                      color="white"
                      opacity={!active && s === "notVisited" ? 0.3 : 1}
                      border={
                        active ? "2px solid #3b82f6" : "2px solid transparent"
                      }
                      boxShadow={
                        active ? "0 0 0 2px rgba(59,130,246,.2)" : "none"
                      }
                      onClick={() => setCur(i)}
                      transition="all .12s"
                      _hover={{ transform: "scale(1.1)", opacity: 1 }}
                    >
                      {i + 1}
                    </Center>
                  );
                })}
              </Flex>

              <Button
                onClick={() => navigate(-1)}
                bg="#f3f4f6"
                color="#374151"
                borderRadius="8px"
                fontWeight={700}
                fontSize="13px"
                h="38px"
                px={4}
                border="1px solid #e5e7eb"
                _hover={{ bg: "#e9eaec" }}
                transition="all .12s"
              >
                Results
              </Button>

              <Button
                rightIcon={<Icon as={FaArrowRight} fontSize="10px" />}
                isDisabled={cur === questions.length - 1}
                onClick={() =>
                  setCur((c) => Math.min(questions.length - 1, c + 1))
                }
                bg="#0f172a"
                color="white"
                borderRadius="8px"
                fontWeight={700}
                fontSize="13px"
                h="38px"
                px={4}
                _hover={{
                  bg: "#1e293b",
                  boxShadow: "0 3px 10px rgba(0,0,0,.2)",
                }}
                _disabled={{ opacity: 0.35 }}
                transition="all .12s"
              >
                Next
              </Button>
            </Flex>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}