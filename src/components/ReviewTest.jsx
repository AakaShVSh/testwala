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







/**
 * ReviewTest.jsx
 * Layout mirrors TakeTest exactly:
 *  - Dark navy gradient header (same height, same style)
 *  - Progress strip below header
 *  - Question panel (scrollable) on the left / center
 *  - Dark navy sidebar on the RIGHT (same 272px, same colors)
 *  - Fixed bottom action bar with Prev / Back to Results / Next
 *  - Mobile: hamburger opens right drawer
 */
import React, { useState } from "react";
import {
  Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton,
  DrawerContent, DrawerOverlay, Flex, Grid, Text, VStack, HStack,
  useDisclosure, useMediaQuery, Icon, Badge,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaArrowRight, FaCheckCircle, FaTimesCircle,
  FaFlag, FaCircle, FaChartBar, FaStopwatch, FaListUl,
} from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";

// ── Design tokens (same as TakeTest) ──────────────────────────────
const C = {
  navy: "#0b1e3d", navyMid: "#132952", blue: "#2563eb",
  green: "#16a34a", red: "#dc2626", purple: "#7c3aed",
  amber: "#d97706", muted: "#64748b", text: "#0f172a",
};

// ── Helpers ───────────────────────────────────────────────────────
const fmtQTime = (s) => {
  if (!s && s !== 0) return null;
  if (s === 0) return "< 1s";
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

// ── Status config ─────────────────────────────────────────────────
const STATUS_CFG = {
  correct:        { label: "Correct",          color: C.green,   bg: "#f0fdf4", border: "#bbf7d0", icon: FaCheckCircle },
  incorrect:      { label: "Incorrect",         color: C.red,     bg: "#fef2f2", border: "#fecaca", icon: FaTimesCircle },
  markedAnswered: { label: "Marked & Answered", color: C.purple,  bg: "#f5f3ff", border: "#ddd6fe", icon: FaFlag       },
  markedSkipped:  { label: "Marked (Skipped)",  color: C.amber,   bg: "#fffbeb", border: "#fde68a", icon: FaFlag       },
  skipped:        { label: "Not Attempted",     color: C.muted,   bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle     },
  answered:       { label: "Answered",          color: C.blue,    bg: "#eff6ff", border: "#bfdbfe", icon: FaCheckCircle},
  notVisited:     { label: "Not Visited",       color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle     },
};

// Sidebar cell colors — mirrors TakeTest STATUS_STYLE
const CELL_STYLE = {
  correct:        { bg: C.green,   color: "white", radius: "10px 10px 3px 3px" },
  incorrect:      { bg: C.red,     color: "white", radius: "3px 3px 10px 10px" },
  markedAnswered: { bg: C.amber,   color: "white", radius: "50%" },
  markedSkipped:  { bg: C.purple,  color: "white", radius: "50%" },
  skipped:        { bg: "white",   color: C.muted, radius: "6px" },
  answered:       { bg: C.blue,    color: "white", radius: "10px 10px 3px 3px" },
  notVisited:     { bg: "white",   color: C.muted, radius: "6px" },
};

function getStatus(i, { correctQus, wrongansqus, markedAndAnswer, markedNotAnswer, notAnswer, answeredQuestion }) {
  if (correctQus.includes(i))       return "correct";
  if (wrongansqus.includes(i))      return "incorrect";
  if (markedAndAnswer.includes(i))  return "markedAnswered";
  if (markedNotAnswer.includes(i))  return "markedSkipped";
  if (notAnswer.includes(i))        return "skipped";
  if (answeredQuestion.includes(i)) return "answered";
  return "notVisited";
}

// ── Legend item (same as TakeTest LegendItem) ─────────────────────
function LegendItem({ status, label, count }) {
  const s = CELL_STYLE[status];
  return (
    <Flex align="center" gap={2}>
      <Center w="20px" h="20px" bg={s.bg} borderRadius={s.radius}
        border={status === "notVisited" || status === "skipped" ? "1px solid rgba(255,255,255,.25)" : "none"}>
        <Text fontSize="8px" fontWeight={900} color={s.color}>{count}</Text>
      </Center>
      <Text fontSize="11px" color="rgba(255,255,255,.6)" fontWeight={500}>{label}</Text>
    </Flex>
  );
}

// ── Question card (the main content area) ─────────────────────────
function QuestionCard({ question, index, allAnswers, statusArrays, questionTimes }) {
  if (!question) return null;
  const status = getStatus(index, statusArrays);
  const cfg = STATUS_CFG[status];
  const userAnswerIdx = allAnswers[index] ?? allAnswers[String(index)];
  const correctIdx = typeof question.answer === "number" ? question.answer : question.answer - 1;
  const timeStr = fmtQTime(questionTimes?.[index] ?? questionTimes?.[String(index)] ?? null);
  const letters = ["A", "B", "C", "D", "E", "F"];

  return (
    <Box>
      {/* Question text card — white, same as TakeTest */}
      <Box bg="white" borderRadius="16px" border="1px solid #e8eef7"
        p={{ base: 4, md: 6 }} mb={4} boxShadow="0 2px 12px rgba(0,0,0,.04)">
        <Flex align="flex-start" gap={3}>
          <Flex w="28px" h="28px" bg="#eff6ff" borderRadius="8px" flexShrink={0}
            align="center" justify="center" mt="2px">
            <Text fontSize="11px" fontWeight={900} color={C.blue}>{index + 1}</Text>
          </Flex>
          <Text fontSize="15px" lineHeight="1.8" color={C.text} fontWeight={500} flex={1}>
            {question.qus}
          </Text>
        </Flex>
      </Box>

      {/* Options */}
      <VStack spacing={3} align="stretch" mb={4}>
        {question.options?.map((opt, i) => {
          const isCorrect  = i === correctIdx;
          const isUserPick = userAnswerIdx === i;
          const isWrong    = isUserPick && !isCorrect;
          // colour logic: correct=green, wrong pick=red, user+correct=blue, else grey
          const borderColor = isCorrect ? "#86efac" : isWrong ? "#fca5a5" : "#e2e8f0";
          const bgColor     = isCorrect ? "#f0fdf4"  : isWrong ? "#fef2f2"  : "white";
          const circleBg    = isCorrect ? C.green    : isWrong ? C.red      : "#f1f5f9";
          const circleColor = isCorrect || isWrong ? "white" : C.muted;

          return (
            <Box key={i} p={4} borderRadius="14px"
              border="1.5px solid" borderColor={borderColor} bg={bgColor}
              boxShadow="0 1px 4px rgba(0,0,0,.04)">
              <Flex align="center" gap={4}>
                {/* Letter circle */}
                <Center w="34px" h="34px" borderRadius="10px" flexShrink={0}
                  bg={circleBg} color={circleColor} fontSize="13px" fontWeight={900}>
                  {isCorrect
                    ? <Icon as={FaCheckCircle} fontSize="14px" />
                    : isWrong
                      ? <Icon as={FaTimesCircle} fontSize="14px" />
                      : letters[i]}
                </Center>
                {/* Text */}
                <Text fontSize="14px" fontWeight={isCorrect || isUserPick ? 700 : 500}
                  color={isCorrect ? C.green : isWrong ? C.red : C.text} flex={1} lineHeight="1.5">
                  {opt}
                </Text>
                {/* Tags */}
                <Flex gap={2} flexShrink={0} flexWrap="wrap" justify="flex-end">
                  {isCorrect && (
                    <Badge bg="#f0fdf4" color={C.green} fontSize="10px" fontWeight={700}
                      border="1px solid #bbf7d0" px={2.5} py={0.5} borderRadius="full">
                      ✓ Correct
                    </Badge>
                  )}
                  {isUserPick && isCorrect && (
                    <Badge bg="#eff6ff" color={C.blue} fontSize="10px" fontWeight={700}
                      border="1px solid #bfdbfe" px={2.5} py={0.5} borderRadius="full">
                      Your Answer
                    </Badge>
                  )}
                  {isWrong && (
                    <Badge bg="#fef2f2" color={C.red} fontSize="10px" fontWeight={700}
                      border="1px solid #fecaca" px={2.5} py={0.5} borderRadius="full">
                      ✗ Your Answer
                    </Badge>
                  )}
                </Flex>
              </Flex>
            </Box>
          );
        })}
      </VStack>

      {/* Answer summary + time row */}
      <Flex gap={6} align="center" px={5} py={3} bg="white" borderRadius="12px"
        border="1px solid #f1f5f9" mb={question.explanation ? 4 : 0} flexWrap="wrap">
        <Box>
          <Text fontSize="10px" color="#94a3b8" fontWeight={700}
            textTransform="uppercase" letterSpacing=".8px" mb={1}>Your Answer</Text>
          <Text fontSize="14px" fontWeight={800}
            color={status === "correct" ? C.green : status === "incorrect" ? C.red : "#94a3b8"}>
            {userAnswerIdx !== undefined && userAnswerIdx !== null
              ? (question.options?.[userAnswerIdx] || "—") : "Not Attempted"}
          </Text>
        </Box>
        <Box>
          <Text fontSize="10px" color="#94a3b8" fontWeight={700}
            textTransform="uppercase" letterSpacing=".8px" mb={1}>Correct Answer</Text>
          <Text fontSize="14px" fontWeight={800} color={C.green}>
            {question.options?.[correctIdx] || "—"}
          </Text>
        </Box>
        {timeStr && (
          <Flex align="center" gap={1.5} ml="auto" bg="#f8fafc" px={3} py={1.5}
            borderRadius="full" border="1px solid #e2e8f0">
            <Icon as={FaStopwatch} fontSize="11px" color="#64748b" />
            <Text fontSize="12px" fontWeight={700} color="#374151">{timeStr}</Text>
          </Flex>
        )}
      </Flex>

      {/* Explanation */}
      {question.explanation && (
        <Box mt={4} p={5} bg="#eff6ff" borderRadius="12px" borderLeft="4px solid #4a72b8">
          <Flex align="center" gap={2} mb={1.5}>
            <Icon as={FiAlertCircle} color="#4a72b8" fontSize="14px" />
            <Text fontSize="11px" fontWeight={800} color="#1e3a5f"
              textTransform="uppercase" letterSpacing=".8px">Explanation</Text>
          </Flex>
          <Text fontSize="14px" color="#1e3a5f" lineHeight="1.8">{question.explanation}</Text>
        </Box>
      )}
    </Box>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function ReviewTest() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const s = location.state || {};

  const questions        = s.questions || [];
  const allAnswers       = s.allAnswers || {};
  const questionTimes    = s.questionTimes || {};
  const correctQus       = s.correctQus || [];
  const wrongansqus      = s.wrongansqus || [];
  const answeredQuestion = s.answeredQuestion || [];
  const notAnswer        = s.notAnswer || [];
  const markedAndAnswer  = s.markedAndAnswer || [];
  const markedNotAnswer  = s.markedNotAnswer || [];
  const testTitle        = s.testTitle || "Test Review";

  const statusArrays = { correctQus, wrongansqus, markedAndAnswer, markedNotAnswer, notAnswer, answeredQuestion };
  const [current, setCurrent] = useState(0);

  // Counts for legend
  const counts = {
    correct:        correctQus.length,
    incorrect:      wrongansqus.length,
    answered:       answeredQuestion.length,
    skipped:        notAnswer.length,
    markedAnswered: markedAndAnswer.length,
    markedSkipped:  markedNotAnswer.length,
    notVisited:     questions.length - (correctQus.length + wrongansqus.length + answeredQuestion.length + notAnswer.length + markedAndAnswer.length + markedNotAnswer.length),
  };

  // Progress: visited = everything except notVisited
  const visited = questions.length - Math.max(0, counts.notVisited);
  const progressPct = questions.length > 0 ? Math.round((visited / questions.length) * 100) : 0;

  if (!questions.length) {
    return (
      <Flex minH="100vh" align="center" justify="center" direction="column" gap={4}
        bg="#f8fafc" fontFamily="'DM Sans',sans-serif">
        <Icon as={FaChartBar} fontSize="52px" color="#e2e8f0" />
        <Text fontSize="18px" fontWeight={700} color="#374151">No review data found</Text>
        <Button onClick={() => navigate(-1)} leftIcon={<Icon as={FaArrowLeft} />}
          bg="#4a72b8" color="white" borderRadius="10px" fontWeight={700}
          h="44px" px={6} _hover={{ bg: "#3b5fa0" }}>
          Go Back
        </Button>
      </Flex>
    );
  }

  // ── Sidebar component (reused in both desktop + drawer) ──────────
  const Sidebar = () => (
    <Flex direction="column" h="100%" overflow="hidden">
      {/* Header */}
      <Box px={5} py={4} borderBottom="1px solid rgba(255,255,255,.09)" flexShrink={0}>
        <Text fontSize="12px" fontWeight={800} color="white" textTransform="uppercase" letterSpacing="1px">
          Navigator
        </Text>
        <Text fontSize="11px" color="rgba(255,255,255,.4)" mt={0.5}>
          {testTitle} · {questions.length} Qs
        </Text>
      </Box>

      {/* Progress */}
      <Box px={5} py={3} borderBottom="1px solid rgba(255,255,255,.07)" flexShrink={0}>
        <Flex justify="space-between" mb={1.5}>
          <Text fontSize="10px" color="rgba(255,255,255,.45)" fontWeight={700}
            textTransform="uppercase" letterSpacing=".8px">Reviewed</Text>
          <Text fontSize="10px" color="rgba(255,255,255,.75)" fontWeight={800}>
            {visited}/{questions.length}
          </Text>
        </Flex>
        <Box h="5px" bg="rgba(255,255,255,.1)" borderRadius="full" overflow="hidden">
          <Box h="100%" bg="linear-gradient(90deg,#14b8a6,#38bdf8)"
            w={`${progressPct}%`} borderRadius="full" transition="width .5s ease" />
        </Box>
      </Box>

      {/* Legend */}
      <Box px={5} py={3} borderBottom="1px solid rgba(255,255,255,.07)" flexShrink={0}>
        <Grid templateColumns="1fr 1fr" gap={1.5}>
          {[
            { key: "correct",        label: "Correct"       },
            { key: "incorrect",      label: "Wrong"         },
            { key: "skipped",        label: "Not Attempted" },
            { key: "markedAnswered", label: "Marked & Ans." },
            { key: "markedSkipped",  label: "Marked Skip"   },
            { key: "notVisited",     label: "Not Visited"   },
          ].map(({ key, label }) => (
            <LegendItem key={key} status={key} label={label} count={counts[key] ?? 0} />
          ))}
        </Grid>
      </Box>

      {/* Question palette grid */}
      <Box flex={1} overflowY="auto" px={5} py={4}
        css={{ "&::-webkit-scrollbar": { width: "3px" },
               "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,.15)", borderRadius: "3px" } }}>
        <Grid templateColumns="repeat(5,1fr)" gap={2}>
          {questions.map((_, i) => {
            const st  = getStatus(i, statusArrays);
            const cs  = CELL_STYLE[st];
            const cur = i === current;
            return (
              <Center key={i} w="100%" h="36px" cursor="pointer"
                onClick={() => { setCurrent(i); if (isMobile) onClose(); }}
                bg={cur ? "rgba(255,255,255,.28)" : cs.bg}
                color={cur ? "white" : cs.color}
                borderRadius={cs.radius}
                border={cur ? "2px solid white" : (st === "notVisited" || st === "skipped") ? "1px solid rgba(255,255,255,.18)" : "none"}
                fontSize="10px" fontWeight={900}
                transform={cur ? "scale(1.1)" : "scale(1)"}
                boxShadow={cur ? "0 0 0 3px rgba(255,255,255,.25)" : "none"}
                transition="all .15s"
                _hover={{ opacity: .85, transform: cur ? "scale(1.1)" : "scale(1.04)" }}>
                {i + 1}
              </Center>
            );
          })}
        </Grid>
      </Box>

      {/* Back to results button at bottom */}
      <Box px={5} py={4} borderTop="1px solid rgba(255,255,255,.09)" flexShrink={0}>
        <Button w="full" h="44px" borderRadius="12px"
          bg="rgba(255,255,255,.12)" color="white"
          border="1px solid rgba(255,255,255,.2)"
          fontWeight={700} fontSize="13px"
          onClick={() => navigate(-1)}
          _hover={{ bg: "rgba(255,255,255,.2)" }}
          transition="all .15s">
          ← Back to Results
        </Button>
      </Box>
    </Flex>
  );

  return (
    <Box h="100vh" display="flex" flexDirection="column"
      bg="#f0f4fa" fontFamily="'DM Sans',sans-serif" position="relative">

      {/* ── Header (identical to TakeTest) ── */}
      <Flex
        bg="linear-gradient(135deg,#0b1e3d 0%,#132952 60%,#1a3a6e 100%)"
        px={{ base: 3, md: 5 }} h={{ base: "56px", md: "62px" }}
        align="center" justify="space-between" flexShrink={0}
        boxShadow="0 2px 16px rgba(11,30,61,.5)" position="relative" zIndex={10}>

        {/* Brand / title */}
        <Flex align="center" gap={3}>
          <Box w="30px" h="30px" bg="linear-gradient(135deg,#2563eb,#7c3aed)" borderRadius="8px"
            display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
            <Text fontSize="15px">📋</Text>
          </Box>
          <Box display={{ base: "none", sm: "block" }}>
            <Text fontSize="13px" fontWeight={900} color="white" letterSpacing="-0.3px" lineHeight="1.1">
              {testTitle}
            </Text>
            <Text fontSize="10px" color="rgba(255,255,255,.38)" fontWeight={600}
              textTransform="uppercase" letterSpacing=".8px">
              Review Mode
            </Text>
          </Box>
        </Flex>

        {/* Question counter pill */}
        <Flex align="center" gap={2.5}
          bg="rgba(255,255,255,.09)" border="1px solid rgba(255,255,255,.13)"
          borderRadius="12px" px={4} py={2}>
          <Text fontSize="17px" fontWeight={900} letterSpacing="1px" lineHeight="1"
            color="white" fontFamily="'JetBrains Mono',monospace">
            {String(current + 1).padStart(2,"0")} / {String(questions.length).padStart(2,"0")}
          </Text>
        </Flex>

        {/* Right: mobile menu + back button */}
        <HStack spacing={2}>
          <Button
            size="sm" h="32px" px={3} borderRadius="8px"
            bg="rgba(255,255,255,.09)" color="rgba(255,255,255,.75)"
            border="1px solid rgba(255,255,255,.12)" fontWeight={700} fontSize="11px"
            leftIcon={<Icon as={FaArrowLeft} fontSize="10px" />}
            onClick={() => navigate(-1)}
            _hover={{ bg: "rgba(255,255,255,.15)" }}
            display={{ base: "none", md: "flex" }}>
            Results
          </Button>
          {isMobile && (
            <Button onClick={onOpen} h="32px" w="32px" p={0} minW="32px" borderRadius="8px"
              bg="rgba(255,255,255,.09)" border="1px solid rgba(255,255,255,.12)"
              _hover={{ bg: "rgba(255,255,255,.16)" }}>
              <Icon as={FaListUl} color="white" fontSize="12px" />
            </Button>
          )}
        </HStack>
      </Flex>

      {/* ── Progress strip ── */}
      <Box h="3px" bg="rgba(37,99,235,.12)" flexShrink={0}>
        <Box h="100%" bg="linear-gradient(90deg,#2563eb,#0d9488)"
          w={`${progressPct}%`} transition="width .6s ease"
          boxShadow="0 0 8px rgba(37,99,235,.45)" />
      </Box>

      {/* ── Body ── */}
      <Flex flex={1} overflow="hidden">

        {/* ── Question panel ── */}
        <Flex direction="column" flex={1} overflow="hidden">

          {/* Sub-header: Q number + status badge */}
          <Flex px={{ base: 4, md: 6 }} py={3} bg="white" align="center"
            justify="space-between" borderBottom="1px solid #e8eef7" flexShrink={0}>
            <Flex align="center" gap={3}>
              <Box bg="linear-gradient(135deg,#2563eb,#1e40af)" px={3} py={1} borderRadius="8px">
                <Text fontSize="12px" fontWeight={900} color="white" letterSpacing=".3px">
                  Q {current + 1} / {questions.length}
                </Text>
              </Box>
              {/* Status badge */}
              {(() => {
                const st = getStatus(current, statusArrays);
                const cfg = STATUS_CFG[st];
                return (
                  <Badge px={2.5} py={0.5} borderRadius="6px" fontSize="10px" fontWeight={800}
                    color={cfg.color} bg={cfg.bg}>
                    <Flex align="center" gap={1.5}>
                      <Icon as={cfg.icon} fontSize="10px" />{cfg.label}
                    </Flex>
                  </Badge>
                );
              })()}
            </Flex>
          </Flex>

          {/* Scrollable question content */}
          <Box flex={1} overflowY="auto" px={{ base: 4, md: 6 }} py={5}
            css={{ "&::-webkit-scrollbar": { width: "4px" },
                   "&::-webkit-scrollbar-thumb": { background: "#e2e8f0", borderRadius: "4px" } }}>
            <QuestionCard
              question={questions[current]}
              index={current}
              allAnswers={allAnswers}
              statusArrays={statusArrays}
              questionTimes={questionTimes}
            />
          </Box>

          {/* ── Bottom navigation bar ── */}
          <Box px={{ base: 4, md: 6 }} py={{ base: 3, md: 4 }} bg="white"
            borderTop="1px solid #e8eef7" flexShrink={0}>
            <Flex justify="space-between" align="center" gap={3}>
              <Button h="40px" px={4} borderRadius="11px"
                bg="#f1f5f9" color={C.muted} fontWeight={700} fontSize="12px"
                leftIcon={<Icon as={FaArrowLeft} fontSize="10px" />}
                isDisabled={current === 0}
                onClick={() => setCurrent(c => Math.max(0, c - 1))}
                _hover={{ bg: "#e2e8f0" }} _disabled={{ opacity: .4 }}>
                Prev
              </Button>

              {/* Question dot nav */}
              <Flex gap={1.5} flexWrap="wrap" justify="center" flex={1} overflow="hidden">
                {questions.slice(
                  Math.max(0, current - 4),
                  Math.min(questions.length, current + 5)
                ).map((_, relIdx) => {
                  const i  = Math.max(0, current - 4) + relIdx;
                  const st = getStatus(i, statusArrays);
                  const cs = CELL_STYLE[st];
                  const cur = i === current;
                  return (
                    <Center key={i} w="28px" h="28px" cursor="pointer"
                      borderRadius={cs.radius} fontSize="9px" fontWeight={900}
                      bg={cur ? C.blue : cs.bg} color={cur ? "white" : cs.color}
                      border={(st === "notVisited" || st === "skipped") ? "1px solid #cbd5e1" : "none"}
                      boxShadow={cur ? "0 0 0 2px rgba(37,99,235,.4)" : "none"}
                      onClick={() => setCurrent(i)}>
                      {i + 1}
                    </Center>
                  );
                })}
              </Flex>

              <Button h="40px" px={4} borderRadius="11px"
                bg="linear-gradient(135deg,#2563eb,#1e40af)" color="white"
                fontWeight={800} fontSize="12px"
                rightIcon={<Icon as={FaArrowRight} fontSize="10px" />}
                isDisabled={current === questions.length - 1}
                onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
                _hover={{ opacity: .9, transform: "translateY(-1px)", boxShadow: "0 6px 20px rgba(37,99,235,.35)" }}
                _disabled={{ opacity: .4 }}
                transition="all .15s">
                Next
              </Button>
            </Flex>
          </Box>
        </Flex>

        {/* ── Desktop sidebar (RIGHT, dark navy — identical to TakeTest) ── */}
        {!isMobile && (
          <Box w="272px" flexShrink={0}
            bg="linear-gradient(180deg,#0b1e3d 0%,#132952 100%)"
            borderLeft="1px solid rgba(255,255,255,.06)"
            display="flex" flexDirection="column" overflow="hidden">
            <Sidebar />
          </Box>
        )}
      </Flex>

      {/* ── Mobile drawer ── */}
      {isMobile && (
        <Drawer onClose={onClose} isOpen={isOpen} size="xs" placement="right">
          <DrawerOverlay backdropFilter="blur(4px)" />
          <DrawerContent bg="linear-gradient(180deg,#0b1e3d,#132952)" borderLeft="none">
            <DrawerCloseButton color="white" top={4} right={4} />
            <DrawerBody p={0} pt={10}>
              <Sidebar />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </Box>
  );
}