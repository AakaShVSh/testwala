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
 * ReviewTest.jsx — one-question-at-a-time review mode
 * Fixed: excess whitespace removed, compact layout, per-question time shown
 */
import React, { useState } from "react";
import { Box, Flex, Text, Badge, Icon, VStack, Button, Grid } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaArrowRight, FaCheckCircle, FaTimesCircle,
  FaFlag, FaCircle, FaChartBar, FaStopwatch,
} from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";

const fmtQTime = (s) => {
  if (!s && s !== 0) return null;
  if (s === 0) return "< 1s";
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};

const STATUS_CFG = {
  correct:        { label: "Correct",          color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: FaCheckCircle },
  incorrect:      { label: "Incorrect",         color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: FaTimesCircle },
  markedAnswered: { label: "Marked & Answered", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: FaFlag       },
  markedSkipped:  { label: "Marked (Skipped)",  color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: FaFlag       },
  skipped:        { label: "Not Attempted",     color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle     },
  answered:       { label: "Answered",          color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: FaCheckCircle},
  notVisited:     { label: "Not Visited",       color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle     },
};

const SIDEBAR_COLORS = {
  correct:        { bg: "#16a34a", color: "white"   },
  incorrect:      { bg: "#ef4444", color: "white"   },
  markedAnswered: { bg: "#7c3aed", color: "white"   },
  markedSkipped:  { bg: "#d97706", color: "white"   },
  skipped:        { bg: "#e2e8f0", color: "#64748b" },
  answered:       { bg: "#2563eb", color: "white"   },
  notVisited:     { bg: "#f1f5f9", color: "#94a3b8" },
};

function getStatus(index, { correctQus, wrongansqus, markedAndAnswer, markedNotAnswer, notAnswer, answeredQuestion }) {
  if (correctQus.includes(index))       return "correct";
  if (wrongansqus.includes(index))      return "incorrect";
  if (markedAndAnswer.includes(index))  return "markedAnswered";
  if (markedNotAnswer.includes(index))  return "markedSkipped";
  if (notAnswer.includes(index))        return "skipped";
  if (answeredQuestion.includes(index)) return "answered";
  return "notVisited";
}

function QuestionView({ question, index, allAnswers, statusArrays, questionTimes }) {
  if (!question) return null;
  const status = getStatus(index, statusArrays);
  const cfg = STATUS_CFG[status];
  const userAnswerIdx = allAnswers[index] ?? allAnswers[String(index)];
  const correctIdx = typeof question.answer === "number" ? question.answer : question.answer - 1;
  const timeTaken = questionTimes?.[index] ?? questionTimes?.[String(index)] ?? null;
  const timeStr = fmtQTime(timeTaken);

  return (
    <Box bg={cfg.bg} border="1.5px solid" borderColor={cfg.border}
      borderRadius="14px" overflow="hidden" boxShadow="0 2px 12px rgba(0,0,0,.05)">
      {/* Card header */}
      <Flex align="center" justify="space-between" px={5} py={3} bg="white"
        borderBottom="1px solid" borderColor={cfg.border}>
        <Flex align="center" gap={3}>
          <Flex w="26px" h="26px" bg={cfg.bg} borderRadius="full" align="center" justify="center"
            border="1.5px solid" borderColor={cfg.border}>
            <Text fontSize="11px" fontWeight={800} color={cfg.color}>{index + 1}</Text>
          </Flex>
          <Badge px={3} py={1} borderRadius="full" fontSize="11px" fontWeight={700}
            bg={cfg.bg} color={cfg.color} border="1px solid" borderColor={cfg.border}>
            <Flex align="center" gap={1.5}>
              <Icon as={cfg.icon} fontSize="10px" />{cfg.label}
            </Flex>
          </Badge>
        </Flex>
        {/* Per-question time */}
        {timeStr && (
          <Flex align="center" gap={1.5} bg="#f8fafc" px={3} py="4px"
            borderRadius="full" border="1px solid #e2e8f0">
            <Icon as={FaStopwatch} fontSize="10px" color="#64748b" />
            <Text fontSize="11px" fontWeight={700} color="#374151">{timeStr}</Text>
          </Flex>
        )}
      </Flex>

      <Box px={5} py={4}>
        {/* Question text */}
        <Text fontSize="14px" fontWeight={600} color="#1e293b" mb={4} lineHeight="1.7">
          {question.qus}
        </Text>

        {/* Options */}
        <VStack spacing={2} align="stretch" mb={4}>
          {question.options?.map((opt, i) => {
            const isCorrect  = i === correctIdx;
            const isUserPick = userAnswerIdx === i;
            const isWrong    = isUserPick && !isCorrect;
            return (
              <Flex key={i} align="center" gap={3} px={4} py="10px" borderRadius="9px"
                border="1.5px solid"
                borderColor={isCorrect ? "#86efac" : isWrong ? "#fca5a5" : "#e2e8f0"}
                bg={isCorrect ? "#f0fdf4" : isWrong ? "#fef2f2" : "white"}>
                <Flex w="24px" h="24px" borderRadius="full" flexShrink={0} align="center"
                  justify="center" fontWeight={800} fontSize="10px"
                  bg={isCorrect ? "#16a34a" : isWrong ? "#ef4444" : "#f1f5f9"}
                  color={isCorrect || isWrong ? "white" : "#64748b"}>
                  {String.fromCharCode(65 + i)}
                </Flex>
                <Text flex={1} fontSize="13px" color="#374151" fontWeight={isCorrect || isUserPick ? 600 : 400}>
                  {opt}
                </Text>
                <Flex gap={1.5} flexShrink={0}>
                  {isCorrect && (
                    <Badge bg="#f0fdf4" color="#16a34a" fontSize="10px" fontWeight={700}
                      border="1px solid #bbf7d0" px={2} py={0.5} borderRadius="full">✓ Correct</Badge>
                  )}
                  {isUserPick && isCorrect && (
                    <Badge bg="#eff6ff" color="#2563eb" fontSize="10px" fontWeight={700}
                      border="1px solid #bfdbfe" px={2} py={0.5} borderRadius="full">Your Answer</Badge>
                  )}
                  {isWrong && (
                    <Badge bg="#fef2f2" color="#ef4444" fontSize="10px" fontWeight={700}
                      border="1px solid #fecaca" px={2} py={0.5} borderRadius="full">✗ Your Answer</Badge>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </VStack>

        {/* Answer summary */}
        <Flex gap={6} mb={question.explanation ? 3 : 0} flexWrap="wrap">
          <Box>
            <Text fontSize="10px" color="#94a3b8" fontWeight={700} textTransform="uppercase" mb={1}>Your Answer</Text>
            <Text fontSize="13px" fontWeight={700}
              color={status === "correct" ? "#16a34a" : status === "incorrect" ? "#ef4444" : "#94a3b8"}>
              {userAnswerIdx !== undefined && userAnswerIdx !== null
                ? (question.options?.[userAnswerIdx] || "—") : "Not Attempted"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="10px" color="#94a3b8" fontWeight={700} textTransform="uppercase" mb={1}>Correct Answer</Text>
            <Text fontSize="13px" fontWeight={700} color="#16a34a">{question.options?.[correctIdx] || "—"}</Text>
          </Box>
        </Flex>

        {/* Explanation */}
        {question.explanation && (
          <Box mt={3} p={3} bg="#eff6ff" borderRadius="9px" borderLeft="3px solid #4a72b8">
            <Flex align="center" gap={2} mb={1}>
              <Icon as={FiAlertCircle} color="#4a72b8" fontSize="13px" />
              <Text fontSize="10px" fontWeight={700} color="#1e3a5f" textTransform="uppercase">Explanation</Text>
            </Flex>
            <Text fontSize="13px" color="#1e3a5f" lineHeight="1.7">{question.explanation}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default function ReviewTest() {
  const location = useLocation();
  const navigate = useNavigate();
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

  if (!questions.length) {
    return (
      <Flex minH="100vh" align="center" justify="center" direction="column" gap={4}
        bg="#f8fafc" fontFamily="'Sora',sans-serif">
        <Icon as={FaChartBar} fontSize="48px" color="#e2e8f0" />
        <Text fontSize="16px" fontWeight={700} color="#374151">No review data found</Text>
        <Button onClick={() => navigate(-1)} leftIcon={<Icon as={FaArrowLeft} />}
          bg="#4a72b8" color="white" borderRadius="10px" fontWeight={700} _hover={{ bg: "#3b5fa0" }}>
          Go Back
        </Button>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="#f1f5f9" fontFamily="'Sora',sans-serif">
      {/* Header */}
      <Box bg="linear-gradient(135deg,#0f1e3a,#1e3a5f,#2d5fa8)" px={{ base: 4, md: 8 }} py={4}>
        <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
          <Flex align="center" gap={3}>
            <Box cursor="pointer" onClick={() => navigate(-1)}
              color="rgba(255,255,255,.5)" _hover={{ color: "white" }}>
              <Icon as={FaArrowLeft} fontSize="14px" />
            </Box>
            <Box>
              <Text fontSize={{ base: "14px", md: "17px" }} fontWeight={800} color="white" noOfLines={1}>{testTitle}</Text>
              <Text fontSize="11px" color="rgba(255,255,255,.5)">Review Mode · Q{current + 1} of {questions.length}</Text>
            </Box>
          </Flex>
          <Flex px={3} py={1.5} bg="rgba(255,255,255,.12)" borderRadius="9px"
            border="1px solid rgba(255,255,255,.2)" align="center">
            <Text fontSize="12px" fontWeight={700} color="white">{current + 1} / {questions.length}</Text>
          </Flex>
        </Flex>
      </Box>

      <Box maxW="1200px" mx="auto" px={{ base: 3, md: 8 }} py={5}>
        <Flex gap={5} align="flex-start" direction={{ base: "column", lg: "row" }}>

          {/* ── Compact Sidebar ── */}
          <Box w={{ base: "100%", lg: "200px" }} flexShrink={0} bg="white" borderRadius="14px"
            border="1px solid #e2e8f0" boxShadow="0 2px 8px rgba(0,0,0,.04)" p={4}
            position={{ base: "static", lg: "sticky" }} top="16px">
            {/* Mini legend */}
            <Text fontSize="10px" fontWeight={700} color="#94a3b8" textTransform="uppercase"
              letterSpacing=".8px" mb={2}>Legend</Text>
            <VStack align="stretch" spacing={1} mb={3}>
              {[
                { key: "correct",        label: "Correct"      },
                { key: "incorrect",      label: "Wrong"        },
                { key: "skipped",        label: "Skipped"      },
                { key: "markedAnswered", label: "Marked & Ans" },
                { key: "markedSkipped",  label: "Marked Skip"  },
              ].map(({ key, label }) => (
                <Flex key={key} align="center" gap={2}>
                  <Box w="9px" h="9px" borderRadius="3px" bg={SIDEBAR_COLORS[key].bg} flexShrink={0}
                    border={key === "skipped" ? "1px solid #cbd5e1" : "none"} />
                  <Text fontSize="11px" color="#64748b">{label}</Text>
                </Flex>
              ))}
            </VStack>
            {/* Question grid */}
            <Text fontSize="10px" fontWeight={700} color="#94a3b8" textTransform="uppercase"
              letterSpacing=".8px" mb={2}>Questions</Text>
            <Grid templateColumns="repeat(5,1fr)" gap={1}>
              {questions.map((_, i) => {
                const st = getStatus(i, statusArrays);
                const sc = SIDEBAR_COLORS[st] || SIDEBAR_COLORS.notVisited;
                const isActive = i === current;
                return (
                  <Flex key={i} w="28px" h="28px" align="center" justify="center"
                    borderRadius="7px" cursor="pointer" fontSize="10px" fontWeight={700}
                    bg={isActive ? "#0f1e3a" : sc.bg} color={isActive ? "white" : sc.color}
                    border={isActive ? "2px solid #4a72b8" : "none"}
                    boxShadow={isActive ? "0 0 0 2px rgba(74,114,184,.3)" : "none"}
                    onClick={() => setCurrent(i)} transition="all .12s" _hover={{ opacity: .8 }}>
                    {i + 1}
                  </Flex>
                );
              })}
            </Grid>
          </Box>

          {/* ── Question + Nav ── */}
          <Box flex={1} minW={0}>
            <QuestionView question={questions[current]} index={current}
              allAnswers={allAnswers} statusArrays={statusArrays} questionTimes={questionTimes} />

            {/* Navigation buttons */}
            <Flex justify="space-between" mt={4} gap={3}>
              <Button leftIcon={<Icon as={FaArrowLeft} />} isDisabled={current === 0}
                onClick={() => setCurrent(c => Math.max(0, c - 1))}
                variant="outline" borderRadius="10px" fontWeight={700} fontSize="13px"
                borderColor="#e2e8f0" color="#374151" _hover={{ bg: "#f8fafc" }} h="40px" px={4}>
                Previous
              </Button>
              <Button onClick={() => navigate(-1)} bg="#f1f5f9" color="#64748b"
                borderRadius="10px" fontWeight={700} fontSize="13px"
                _hover={{ bg: "#e2e8f0" }} h="40px" px={4}>
                Back to Results
              </Button>
              <Button rightIcon={<Icon as={FaArrowRight} />} isDisabled={current === questions.length - 1}
                onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
                bg="#4a72b8" color="white" borderRadius="10px" fontWeight={700} fontSize="13px"
                _hover={{ bg: "#3b5fa0" }} h="40px" px={4}>
                Next
              </Button>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}