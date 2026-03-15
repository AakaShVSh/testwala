




// /**
//  * ResultPage.jsx — reads ALL data from useLocation().state
//  * Now shows per-question time taken inside each QuestionCard
//  */
// import {
//   Box, Flex, Text, Badge, Progress, Icon, Grid, GridItem,
//   Tabs, TabList, TabPanels, Tab, TabPanel, VStack, HStack,
//   Divider, useToast,
// } from "@chakra-ui/react";
// import { Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS, ArcElement, CategoryScale, LinearScale,
//   PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend,
// } from "chart.js";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   FaArrowLeft, FaTrophy, FaClock, FaCheckCircle, FaTimesCircle,
//   FaFlag, FaCircle, FaChartBar, FaStopwatch,
// } from "react-icons/fa";
// import { FiAlertCircle, FiTarget, FiAward } from "react-icons/fi";

// ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

// const fmtTime = (s) => {
//   if (!s && s !== 0) return "—";
//   const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
//   if (h > 0) return `${h}h ${m}m ${sec}s`;
//   if (m > 0) return `${m}m ${sec}s`;
//   return `${sec}s`;
// };

// const fmtQTime = (s) => {
//   if (!s && s !== 0) return null;
//   if (s === 0) return "< 1s";
//   const m = Math.floor(s / 60), sec = s % 60;
//   if (m > 0) return `${m}m ${sec}s`;
//   return `${sec}s`;
// };

// const pctColor = (p) => p >= 70 ? "#16a34a" : p >= 40 ? "#d97706" : "#ef4444";
// const pctBg    = (p) => p >= 70 ? "#f0fdf4" : p >= 40 ? "#fffbeb" : "#fef2f2";
// const pctLabel = (p) => p >= 80 ? "Excellent 🌟" : p >= 60 ? "Good 👍" : p >= 40 ? "Average 📈" : "Needs Work 💪";

// // ── QuestionCard ──────────────────────────────────────────────────
// function QuestionCard({ question, index, allAnswers, correctQus, wrongansqus,
//   markedAndAnswer, markedNotAnswer, notAnswer, answeredQuestion, questionTimes }) {
//   if (!question) return null;

//   const getStatus = () => {
//     if (correctQus.includes(index))       return "correct";
//     if (wrongansqus.includes(index))      return "incorrect";
//     if (markedAndAnswer.includes(index))  return "markedAnswered";
//     if (markedNotAnswer.includes(index))  return "markedSkipped";
//     if (notAnswer.includes(index))        return "skipped";
//     if (answeredQuestion.includes(index)) return "answered";
//     return "notVisited";
//   };

//   const STATUS = {
//     correct:        { label: "Correct",           color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: FaCheckCircle },
//     incorrect:      { label: "Incorrect",          color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: FaTimesCircle },
//     markedAnswered: { label: "Marked & Answered",  color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: FaFlag       },
//     markedSkipped:  { label: "Marked (Skipped)",   color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: FaFlag       },
//     skipped:        { label: "Not Attempted",      color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle     },
//     answered:       { label: "Answered",           color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: FaCheckCircle},
//     notVisited:     { label: "Not Visited",        color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle     },
//   };

//   const status = getStatus();
//   const cfg = STATUS[status];
//   const userAnswerIdx = allAnswers[index] ?? allAnswers[String(index)];
//   const userAnswerText = userAnswerIdx !== undefined && userAnswerIdx !== null ? question.options?.[userAnswerIdx] : null;
//   const correctIdx = typeof question.answer === "number" ? question.answer : question.answer - 1;
//   const correctText = question.options?.[correctIdx];
//   const timeTaken = questionTimes?.[index] ?? questionTimes?.[String(index)] ?? null;
//   const timeStr = fmtQTime(timeTaken);

//   return (
//     <Box bg="white" borderRadius="14px" border="1.5px solid" borderColor={cfg.border}
//       overflow="hidden" mb={3} boxShadow="0 2px 8px rgba(0,0,0,.04)">
//       {/* Header */}
//       <Flex align="center" justify="space-between" px={5} py={3}
//         borderBottom="1px solid" borderColor={cfg.border} bg={cfg.bg}>
//         <Flex align="center" gap={3}>
//           <Flex w="28px" h="28px" bg="white" borderRadius="full" align="center" justify="center"
//             border="1.5px solid" borderColor={cfg.border}>
//             <Text fontSize="12px" fontWeight={800} color={cfg.color}>{index + 1}</Text>
//           </Flex>
//           <Badge px={3} py={1} borderRadius="full" fontSize="11px" fontWeight={700}
//             bg="white" color={cfg.color} border="1px solid" borderColor={cfg.border}>
//             <Flex align="center" gap={1.5}>
//               <Icon as={cfg.icon} fontSize="11px" />{cfg.label}
//             </Flex>
//           </Badge>
//         </Flex>
//         <Flex align="center" gap={2}>
//           {/* Per-question time badge */}
//           {timeStr && (
//             <Flex align="center" gap={1.5} bg="white" px={3} py="4px"
//               borderRadius="full" border="1px solid #e2e8f0">
//               <Icon as={FaStopwatch} fontSize="10px" color="#64748b" />
//               <Text fontSize="11px" fontWeight={700} color="#374151">{timeStr}</Text>
//             </Flex>
//           )}
//           {status === "correct" && (
//             <Badge bg="#f0fdf4" color="#16a34a" border="1px solid #bbf7d0"
//               fontSize="11px" fontWeight={700} px={3} py={1} borderRadius="full">+1 pt</Badge>
//           )}
//         </Flex>
//       </Flex>

//       <Box px={5} py={4}>
//         <Text fontSize="14px" fontWeight={600} color="#1e293b" mb={4} lineHeight="1.7">
//           {question.qus}
//         </Text>

//         <VStack spacing={2} align="stretch" mb={4}>
//           {question.options?.map((opt, i) => {
//             const isCorrect = i === correctIdx;
//             const isUserPick = userAnswerIdx === i;
//             const isWrongPick = isUserPick && !isCorrect;
//             return (
//               <Flex key={i} align="center" gap={3} px={4} py={3} borderRadius="10px"
//                 border="1.5px solid"
//                 borderColor={isCorrect ? "#86efac" : isWrongPick ? "#fca5a5" : "#e2e8f0"}
//                 bg={isCorrect ? "#f0fdf4" : isWrongPick ? "#fef2f2" : "white"}>
//                 <Flex w="26px" h="26px" borderRadius="full" flexShrink={0} align="center"
//                   justify="center" fontWeight={800} fontSize="11px"
//                   bg={isCorrect ? "#16a34a" : isWrongPick ? "#ef4444" : "#f1f5f9"}
//                   color={isCorrect || isWrongPick ? "white" : "#64748b"}>
//                   {String.fromCharCode(65 + i)}
//                 </Flex>
//                 <Text flex={1} fontSize="13px" color="#374151" fontWeight={isCorrect || isUserPick ? 600 : 400}>{opt}</Text>
//                 <Flex gap={1.5} flexShrink={0}>
//                   {isCorrect && (
//                     <Badge bg="#f0fdf4" color="#16a34a" fontSize="10px" fontWeight={700}
//                       border="1px solid #bbf7d0" px={2} py={0.5} borderRadius="full">✓ Correct Answer</Badge>
//                   )}
//                   {isUserPick && isCorrect && (
//                     <Badge bg="#eff6ff" color="#2563eb" fontSize="10px" fontWeight={700}
//                       border="1px solid #bfdbfe" px={2} py={0.5} borderRadius="full">Your Answer</Badge>
//                   )}
//                   {isWrongPick && (
//                     <Badge bg="#fef2f2" color="#ef4444" fontSize="10px" fontWeight={700}
//                       border="1px solid #fecaca" px={2} py={0.5} borderRadius="full">✗ Your Answer</Badge>
//                   )}
//                 </Flex>
//               </Flex>
//             );
//           })}
//         </VStack>

//         <Flex gap={6} mb={question.explanation ? 3 : 0} flexWrap="wrap">
//           <Box>
//             <Text fontSize="11px" color="#94a3b8" fontWeight={600} textTransform="uppercase" mb={1}>Your Answer</Text>
//             <Text fontSize="13px" fontWeight={700}
//               color={status === "correct" ? "#16a34a" : status === "incorrect" ? "#ef4444" : "#94a3b8"}>
//               {userAnswerText || "Not Attempted"}
//             </Text>
//           </Box>
//           <Box>
//             <Text fontSize="11px" color="#94a3b8" fontWeight={600} textTransform="uppercase" mb={1}>Correct Answer</Text>
//             <Text fontSize="13px" fontWeight={700} color="#16a34a">{correctText || "—"}</Text>
//           </Box>
//         </Flex>

//         {question.explanation && (
//           <Box mt={3} p={4} bg="#eff6ff" borderRadius="10px" borderLeft="3px solid #4a72b8">
//             <Flex align="center" gap={2} mb={1.5}>
//               <Icon as={FiAlertCircle} color="#4a72b8" fontSize="14px" />
//               <Text fontSize="11px" fontWeight={700} color="#1e3a5f" textTransform="uppercase">Explanation</Text>
//             </Flex>
//             <Text fontSize="13px" color="#1e3a5f" lineHeight="1.7">{question.explanation}</Text>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

// function StatBox({ label, value, sub, color, bg, border, icon }) {
//   return (
//     <Box bg={bg} border="1.5px solid" borderColor={border} borderRadius="14px" p={4}>
//       <Flex align="center" gap={2} mb={2}>
//         <Icon as={icon} color={color} fontSize="14px" />
//         <Text fontSize="11px" fontWeight={700} color={color} textTransform="uppercase">{label}</Text>
//       </Flex>
//       <Text fontSize="26px" fontWeight={900} color={color} lineHeight={1}>{value}</Text>
//       {sub && <Text fontSize="11px" color={color} opacity={0.7} mt={1}>{sub}</Text>}
//     </Box>
//   );
// }

// export default function ResultPage() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const s = location.state || {};

//   const testTitle     = s.testTitle || s.category || s.subject || "Test";
//   const score         = s.score ?? 0;
//   const totalQuestions= s.totalQuestions ?? 0;
//   const scorePercentage = s.scorePercentage ?? (totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0);
//   const percentile    = s.percentile ?? null;
//   const timeTaken     = s.timeTaken ?? 0;

//   const questions        = s.questions || [];
//   const allAnswers       = s.allAnswers || {};
//   const questionTimes    = s.questionTimes || {};   // ← per-question times
//   const correctQus       = s.correctQus || [];
//   const wrongansqus      = s.wrongansqus || [];
//   const answeredQuestion = s.answeredQuestion || [];
//   const notAnswer        = s.notAnswer || [];
//   const markedAndAnswer  = s.markedAndAnswer || [];
//   const markedNotAnswer  = s.markedNotAnswer || [];

//   const correctCount  = correctQus.length;
//   const wrongCount    = wrongansqus.length;
//   const skippedCount  = notAnswer.length;
//   const markedCount   = markedAndAnswer.length + markedNotAnswer.length;
//   const accuracy      = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
//   const pct           = Math.round(scorePercentage);
//   const allIndices    = questions.map((_, i) => i);
//   const markedAll     = [...markedAndAnswer, ...markedNotAnswer];

//   const donut = {
//     labels: ["Correct", "Wrong", "Skipped"],
//     datasets: [{ data: [correctCount, wrongCount, skippedCount],
//       backgroundColor: ["#4ade80","#f87171","#cbd5e1"], borderWidth: 0, cutout: "72%" }],
//   };
//   const donutOpts = { responsive: true, maintainAspectRatio: false,
//     plugins: { legend: { display: false }, tooltip: { padding: 10 } } };

//   const TABS = [
//     { label: "All",      count: totalQuestions,          indices: allIndices       },
//     { label: "Correct",  count: correctCount,            indices: correctQus       },
//     { label: "Wrong",    count: wrongCount,              indices: wrongansqus      },
//     { label: "Skipped",  count: skippedCount,            indices: notAnswer        },
//     { label: "Marked",   count: markedCount,             indices: markedAll        },
//     { label: "Answered", count: answeredQuestion.length, indices: answeredQuestion },
//   ];

//   if (!s.score && !s.questions) {
//     return (
//       <Flex minH="100vh" align="center" justify="center" direction="column" gap={4}
//         bg="#f8fafc" fontFamily="'Sora',sans-serif">
//         <Icon as={FaChartBar} fontSize="48px" color="#e2e8f0" />
//         <Text fontSize="16px" fontWeight={700} color="#374151">No result data found</Text>
//         <Text fontSize="13px" color="#94a3b8" mb={2}>Please take a test first</Text>
//         <Box as="button" px={6} py={3} bg="#4a72b8" color="white" borderRadius="10px"
//           fontWeight={700} fontSize="14px" onClick={() => navigate("/coaching")}>
//           Browse Tests
//         </Box>
//       </Flex>
//     );
//   }

//   return (
//     <Box minH="100vh" bg="#f1f5f9" fontFamily="'Sora',sans-serif">
//       {/* Top bar */}
//       <Box bg="linear-gradient(135deg,#0f1e3a,#1e3a5f,#2d5fa8)" px={{ base: 4, md: 8 }} py={5}>
//         <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
//           <Flex align="center" gap={3}>
//             <Box cursor="pointer" onClick={() => navigate("/")} color="rgba(255,255,255,.5)" _hover={{ color: "white" }}>
//               <Icon as={FaArrowLeft} fontSize="14px" />
//             </Box>
//             <Box>
//               <Text fontSize={{ base: "15px", md: "18px" }} fontWeight={800} color="white" noOfLines={1}>{testTitle}</Text>
//               <Text fontSize="12px" color="rgba(255,255,255,.5)">Test Result</Text>
//             </Box>
//           </Flex>
//           <Box px={4} py={2} bg="rgba(255,255,255,.1)" borderRadius="10px"
//             border="1px solid rgba(255,255,255,.15)" cursor="pointer"
//             onClick={() => navigate("/Review-Test", {
//               state: { testTitle, questions, allAnswers, questionTimes, correctQus, wrongansqus,
//                 answeredQuestion, notAnswer, markedAndAnswer, markedNotAnswer, score, totalQuestions, scorePercentage, timeTaken },
//             })}
//             _hover={{ bg: "rgba(255,255,255,.15)" }}>
//             <Text fontSize="12px" fontWeight={700} color="white">Review Test</Text>
//           </Box>
//         </Flex>
//       </Box>

//       <Box maxW="1200px" mx="auto" px={{ base: 3, md: 8 }} py={6}>
//         {/* Score Hero */}
//         <Box bg="white" borderRadius="20px" border="1px solid #e2e8f0"
//           boxShadow="0 4px 24px rgba(0,0,0,.06)" overflow="hidden" mb={5}>
//           <Box h="5px" bg={pctBg(pct)}>
//             <Box h="100%" w={`${pct}%`} bg={pctColor(pct)} borderRadius="full" style={{ transition: "width 1s ease" }} />
//           </Box>
//           <Flex direction={{ base: "column", md: "row" }} align="center"
//             px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }} gap={{ base: 6, md: 10 }}>
//             <Box flexShrink={0} position="relative" w="160px" h="160px">
//               <Doughnut data={donut} options={donutOpts} />
//               <Flex position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)"
//                 direction="column" align="center">
//                 <Text fontSize="28px" fontWeight={900} color={pctColor(pct)} lineHeight={1}>{pct}%</Text>
//                 <Text fontSize="11px" color="#94a3b8" fontWeight={600} mt={0.5}>Score</Text>
//               </Flex>
//             </Box>
//             <Box flex={1} w="100%">
//               <Flex align="center" gap={3} mb={1} flexWrap="wrap">
//                 <Text fontSize={{ base: "22px", md: "28px" }} fontWeight={900} color="#0f172a">
//                   {score} / {totalQuestions}
//                 </Text>
//                 <Badge px={3} py={1} borderRadius="full" fontSize="12px" fontWeight={700}
//                   bg={pctBg(pct)} color={pctColor(pct)}>{pctLabel(pct)}</Badge>
//               </Flex>
//               {percentile !== null && (
//                 <Flex align="center" gap={2} mb={4}>
//                   <Flex align="center" gap={1.5} px={3} py={1.5} bg="#fefce8" border="1px solid #fde68a" borderRadius="10px">
//                     <Icon as={FaTrophy} color="#d97706" fontSize="13px" />
//                     <Text fontSize="13px" fontWeight={700} color="#92400e">
//                       Percentile: {typeof percentile === "number" ? `${percentile.toFixed(1)}%` : percentile}
//                     </Text>
//                   </Flex>
//                   <Text fontSize="12px" color="#94a3b8">
//                     Better than {typeof percentile === "number" ? `${percentile.toFixed(0)}%` : percentile} of all students
//                   </Text>
//                 </Flex>
//               )}
//               <Grid templateColumns={{ base: "repeat(2,1fr)", sm: "repeat(4,1fr)" }} gap={3}>
//                 {[
//                   { label: "Correct", value: correctCount, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: FaCheckCircle },
//                   { label: "Wrong",   value: wrongCount,   color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: FaTimesCircle },
//                   { label: "Skipped", value: skippedCount, color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle      },
//                   { label: "Marked",  value: markedCount,  color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: FaFlag        },
//                 ].map(s => <StatBox key={s.label} {...s} />)}
//               </Grid>
//             </Box>
//           </Flex>
//         </Box>

//         {/* Details row */}
//         <Grid templateColumns={{ base: "1fr", md: "repeat(3,1fr)" }} gap={4} mb={5}>
//           <Box bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="0 2px 12px rgba(0,0,0,.04)" p={5}>
//             <Flex align="center" gap={2} mb={4}>
//               <Flex w="36px" h="36px" bg="#eff6ff" borderRadius="10px" align="center" justify="center">
//                 <Icon as={FaClock} color="#4a72b8" fontSize="16px" />
//               </Flex>
//               <Text fontSize="14px" fontWeight={800} color="#0f172a">Time Details</Text>
//             </Flex>
//             <VStack align="stretch" spacing={3}>
//               <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Time Taken</Text><Text fontSize="13px" fontWeight={700} color="#374151">{fmtTime(timeTaken)}</Text></Flex>
//               {totalQuestions > 0 && timeTaken > 0 && (
//                 <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Per Question (avg)</Text><Text fontSize="13px" fontWeight={700} color="#374151">{fmtTime(Math.round(timeTaken / totalQuestions))}</Text></Flex>
//               )}
//               <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Total Questions</Text><Text fontSize="13px" fontWeight={700} color="#374151">{totalQuestions}</Text></Flex>
//             </VStack>
//           </Box>

//           <Box bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="0 2px 12px rgba(0,0,0,.04)" p={5}>
//             <Flex align="center" gap={2} mb={4}>
//               <Flex w="36px" h="36px" bg="#f0fdf4" borderRadius="10px" align="center" justify="center">
//                 <Icon as={FiTarget} color="#16a34a" fontSize="16px" />
//               </Flex>
//               <Text fontSize="14px" fontWeight={800} color="#0f172a">Accuracy</Text>
//             </Flex>
//             <Text fontSize="36px" fontWeight={900} color={pctColor(accuracy)} lineHeight={1} mb={2}>{accuracy.toFixed(1)}%</Text>
//             <Box bg="#f1f5f9" borderRadius="full" h="8px" mb={3}>
//               <Box h="100%" w={`${accuracy}%`} bg={pctColor(accuracy)} borderRadius="full" style={{ transition: "width 1s ease" }} />
//             </Box>
//             <VStack align="stretch" spacing={2}>
//               <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Answered</Text><Text fontSize="13px" fontWeight={700} color="#374151">{answeredQuestion.length}</Text></Flex>
//               <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Completion</Text><Text fontSize="13px" fontWeight={700} color="#374151">{totalQuestions > 0 ? Math.round((answeredQuestion.length / totalQuestions) * 100) : 0}%</Text></Flex>
//             </VStack>
//           </Box>

//           <Box bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="0 2px 12px rgba(0,0,0,.04)" p={5}>
//             <Flex align="center" gap={2} mb={4}>
//               <Flex w="36px" h="36px" bg="#fefce8" borderRadius="10px" align="center" justify="center">
//                 <Icon as={FiAward} color="#d97706" fontSize="16px" />
//               </Flex>
//               <Text fontSize="14px" fontWeight={800} color="#0f172a">Ranking</Text>
//             </Flex>
//             {percentile !== null ? (
//               <>
//                 <Text fontSize="36px" fontWeight={900} color="#d97706" lineHeight={1} mb={1}>
//                   {typeof percentile === "number" ? `${percentile.toFixed(1)}%` : percentile}
//                 </Text>
//                 <Text fontSize="12px" color="#94a3b8" mb={3}>Percentile Score</Text>
//                 <Box bg="#fef9c3" borderRadius="10px" px={3} py={2}>
//                   <Text fontSize="12px" fontWeight={600} color="#92400e">
//                     🏆 You scored better than {typeof percentile === "number" ? `${percentile.toFixed(0)}%` : percentile} of all students
//                   </Text>
//                 </Box>
//               </>
//             ) : (
//               <>
//                 <Text fontSize="14px" color="#94a3b8" mb={3}>Percentile available after more students attempt.</Text>
//                 <Box bg={pctBg(pct)} borderRadius="10px" px={3} py={2}>
//                   <Text fontSize="12px" fontWeight={600} color={pctColor(pct)}>Your score: {pct}% — {pctLabel(pct)}</Text>
//                 </Box>
//               </>
//             )}
//           </Box>
//         </Grid>

//         {/* Legend */}
//         <Box bg="white" borderRadius="14px" border="1px solid #e2e8f0" boxShadow="0 2px 8px rgba(0,0,0,.04)" px={5} py={4} mb={5}>
//           <Text fontSize="12px" fontWeight={700} color="#64748b" textTransform="uppercase" letterSpacing=".8px" mb={3}>
//             Question Status Legend
//           </Text>
//           <Flex gap={3} flexWrap="wrap">
//             {[
//               { label: "Correct",        color: "#16a34a", bg: "#f0fdf4" },
//               { label: "Incorrect",      color: "#ef4444", bg: "#fef2f2" },
//               { label: "Marked & Ans",   color: "#7c3aed", bg: "#f5f3ff" },
//               { label: "Marked (Skip)",  color: "#d97706", bg: "#fffbeb" },
//               { label: "Skipped",        color: "#64748b", bg: "#f8fafc" },
//               { label: "Answered",       color: "#2563eb", bg: "#eff6ff" },
//             ].map(l => (
//               <Flex key={l.label} align="center" gap={1.5} px={3} py={1.5} bg={l.bg} borderRadius="full">
//                 <Box w="8px" h="8px" bg={l.color} borderRadius="full" />
//                 <Text fontSize="11px" fontWeight={600} color={l.color}>{l.label}</Text>
//               </Flex>
//             ))}
//           </Flex>
//         </Box>

//         {/* Question tabs */}
//         <Box bg="white" borderRadius="20px" border="1px solid #e2e8f0"
//           boxShadow="0 4px 24px rgba(0,0,0,.06)" overflow="hidden">
//           <Tabs colorScheme="blue" variant="unstyled">
//             <Box px={{ base: 3, md: 6 }} pt={{ base: 4, md: 6 }} borderBottom="1px solid #f1f5f9">
//               <Flex gap={1} overflowX="auto" pb={3}
//                 css={{ "&::-webkit-scrollbar": { height: "3px" }, "&::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: "10px" } }}>
//                 {TABS.map(t => (
//                   <Tab key={t.label} px={4} py={2} borderRadius="10px" fontSize="12px" fontWeight={700}
//                     color="#64748b" whiteSpace="nowrap"
//                     _selected={{ bg: "#eff6ff", color: "#4a72b8" }} _hover={{ bg: "#f8fafc" }}>
//                     {t.label}
//                     <Box as="span" ml={1.5} px={2} py={0.5} bg="rgba(0,0,0,.06)" borderRadius="full" fontSize="11px">{t.count}</Box>
//                   </Tab>
//                 ))}
//               </Flex>
//             </Box>
//             <TabPanels>
//               {TABS.map(t => (
//                 <TabPanel key={t.label} px={{ base: 3, md: 6 }} py={5}>
//                   {t.indices.length === 0 ? (
//                     <Box textAlign="center" py={16}>
//                       <Icon as={FaChartBar} fontSize="40px" color="#e2e8f0" display="block" mx="auto" mb={3} />
//                       <Text fontSize="14px" color="#94a3b8">No questions in this category</Text>
//                     </Box>
//                   ) : (
//                     t.indices.map(idx => (
//                       <QuestionCard key={idx} index={idx} question={questions[idx]}
//                         allAnswers={allAnswers} correctQus={correctQus} wrongansqus={wrongansqus}
//                         answeredQuestion={answeredQuestion} notAnswer={notAnswer}
//                         markedAndAnswer={markedAndAnswer} markedNotAnswer={markedNotAnswer}
//                         questionTimes={questionTimes} />
//                     ))
//                   )}
//                 </TabPanel>
//               ))}
//             </TabPanels>
//           </Tabs>
//         </Box>

//         <Flex justify="center" gap={4} mt={6} flexWrap="wrap">
//           <Box as="button" px={6} py={3} bg="#0f1e3a" color="white" borderRadius="12px"
//             fontWeight={700} fontSize="13px" onClick={() => navigate("/coaching")}
//             _hover={{ opacity: .9 }} transition="opacity .2s">
//             Browse More Tests
//           </Box>
//           <Box as="button" px={6} py={3} bg="white" color="#4a72b8" border="1.5px solid #4a72b8"
//             borderRadius="12px" fontWeight={700} fontSize="13px" onClick={() => navigate("/UserTestData")}
//             _hover={{ bg: "#eff6ff" }} transition="all .2s">
//             My Results
//           </Box>
//         </Flex>
//       </Box>
//     </Box>
//   );
// }








// ------------------------------------------

/**
 * ResultPage.jsx — reads ALL data from useLocation().state
 * Now shows per-question time taken inside each QuestionCard.
 * Added: owner-view banner when state.viewingAs === "owner"
 */
import {
  Box, Flex, Text, Badge, Progress, Icon, Grid, GridItem,
  Tabs, TabList, TabPanels, Tab, TabPanel, VStack, HStack,
  Divider, useToast,
} from "@chakra-ui/react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, ArcElement, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend,
} from "chart.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft, FaTrophy, FaClock, FaCheckCircle, FaTimesCircle,
  FaFlag, FaCircle, FaChartBar, FaStopwatch, FaShieldAlt, FaUser,
} from "react-icons/fa";
import { FiAlertCircle, FiTarget, FiAward } from "react-icons/fi";

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

const fmtTime = (s) => {
  if (!s && s !== 0) return "—";
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
};

const fmtQTime = (s) => {
  if (!s && s !== 0) return null;
  if (s === 0) return "< 1s";
  const m = Math.floor(s / 60), sec = s % 60;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
};

const pctColor = (p) => p >= 70 ? "#16a34a" : p >= 40 ? "#d97706" : "#ef4444";
const pctBg    = (p) => p >= 70 ? "#f0fdf4" : p >= 40 ? "#fffbeb" : "#fef2f2";
const pctLabel = (p) => p >= 80 ? "Excellent 🌟" : p >= 60 ? "Good 👍" : p >= 40 ? "Average 📈" : "Needs Work 💪";

// ── QuestionCard ──────────────────────────────────────────────────
function QuestionCard({ question, index, allAnswers, correctQus, wrongansqus,
  markedAndAnswer, markedNotAnswer, notAnswer, answeredQuestion, questionTimes, isOwnerView }) {
  if (!question) return null;

  const getStatus = () => {
    if (correctQus.includes(index))       return "correct";
    if (wrongansqus.includes(index))      return "incorrect";
    if (markedAndAnswer.includes(index))  return "markedAnswered";
    if (markedNotAnswer.includes(index))  return "markedSkipped";
    if (notAnswer.includes(index))        return "skipped";
    if (answeredQuestion.includes(index)) return "answered";
    return "notVisited";
  };

  const STATUS = {
    correct:        { label: "Correct",           color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: FaCheckCircle },
    incorrect:      { label: "Incorrect",          color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: FaTimesCircle },
    markedAnswered: { label: "Marked & Answered",  color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: FaFlag       },
    markedSkipped:  { label: "Marked (Skipped)",   color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: FaFlag       },
    skipped:        { label: "Not Attempted",      color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle     },
    answered:       { label: "Answered",           color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: FaCheckCircle},
    notVisited:     { label: "Not Visited",        color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle     },
  };

  const status = getStatus();
  const cfg = STATUS[status];
  const userAnswerIdx = allAnswers[index] ?? allAnswers[String(index)];
  const userAnswerText = userAnswerIdx !== undefined && userAnswerIdx !== null ? question.options?.[userAnswerIdx] : null;
  const correctIdx = typeof question.answer === "number" ? question.answer : question.answer - 1;
  const correctText = question.options?.[correctIdx];
  const timeTaken = questionTimes?.[index] ?? questionTimes?.[String(index)] ?? null;
  const timeStr = fmtQTime(timeTaken);

  // label differs slightly for owner view
  const yourAnswerLabel = isOwnerView ? "Student's Answer" : "Your Answer";

  return (
    <Box bg="white" borderRadius="14px" border="1.5px solid" borderColor={cfg.border}
      overflow="hidden" mb={3} boxShadow="0 2px 8px rgba(0,0,0,.04)">
      {/* Header */}
      <Flex align="center" justify="space-between" px={5} py={3}
        borderBottom="1px solid" borderColor={cfg.border} bg={cfg.bg}>
        <Flex align="center" gap={3}>
          <Flex w="28px" h="28px" bg="white" borderRadius="full" align="center" justify="center"
            border="1.5px solid" borderColor={cfg.border}>
            <Text fontSize="12px" fontWeight={800} color={cfg.color}>{index + 1}</Text>
          </Flex>
          <Badge px={3} py={1} borderRadius="full" fontSize="11px" fontWeight={700}
            bg="white" color={cfg.color} border="1px solid" borderColor={cfg.border}>
            <Flex align="center" gap={1.5}>
              <Icon as={cfg.icon} fontSize="11px" />{cfg.label}
            </Flex>
          </Badge>
        </Flex>
        <Flex align="center" gap={2}>
          {timeStr && (
            <Flex align="center" gap={1.5} bg="white" px={3} py="4px"
              borderRadius="full" border="1px solid #e2e8f0">
              <Icon as={FaStopwatch} fontSize="10px" color="#64748b" />
              <Text fontSize="11px" fontWeight={700} color="#374151">{timeStr}</Text>
            </Flex>
          )}
          {status === "correct" && (
            <Badge bg="#f0fdf4" color="#16a34a" border="1px solid #bbf7d0"
              fontSize="11px" fontWeight={700} px={3} py={1} borderRadius="full">+1 pt</Badge>
          )}
        </Flex>
      </Flex>

      <Box px={5} py={4}>
        <Text fontSize="14px" fontWeight={600} color="#1e293b" mb={4} lineHeight="1.7">
          {question.qus}
        </Text>

        <VStack spacing={2} align="stretch" mb={4}>
          {question.options?.map((opt, i) => {
            const isCorrect = i === correctIdx;
            const isUserPick = userAnswerIdx === i;
            const isWrongPick = isUserPick && !isCorrect;
            return (
              <Flex key={i} align="center" gap={3} px={4} py={3} borderRadius="10px"
                border="1.5px solid"
                borderColor={isCorrect ? "#86efac" : isWrongPick ? "#fca5a5" : "#e2e8f0"}
                bg={isCorrect ? "#f0fdf4" : isWrongPick ? "#fef2f2" : "white"}>
                <Flex w="26px" h="26px" borderRadius="full" flexShrink={0} align="center"
                  justify="center" fontWeight={800} fontSize="11px"
                  bg={isCorrect ? "#16a34a" : isWrongPick ? "#ef4444" : "#f1f5f9"}
                  color={isCorrect || isWrongPick ? "white" : "#64748b"}>
                  {String.fromCharCode(65 + i)}
                </Flex>
                <Text flex={1} fontSize="13px" color="#374151" fontWeight={isCorrect || isUserPick ? 600 : 400}>{opt}</Text>
                <Flex gap={1.5} flexShrink={0}>
                  {isCorrect && (
                    <Badge bg="#f0fdf4" color="#16a34a" fontSize="10px" fontWeight={700}
                      border="1px solid #bbf7d0" px={2} py={0.5} borderRadius="full">✓ Correct Answer</Badge>
                  )}
                  {isUserPick && isCorrect && (
                    <Badge bg="#eff6ff" color="#2563eb" fontSize="10px" fontWeight={700}
                      border="1px solid #bfdbfe" px={2} py={0.5} borderRadius="full">
                      {isOwnerView ? "Student's Answer" : "Your Answer"}
                    </Badge>
                  )}
                  {isWrongPick && (
                    <Badge bg="#fef2f2" color="#ef4444" fontSize="10px" fontWeight={700}
                      border="1px solid #fecaca" px={2} py={0.5} borderRadius="full">
                      {isOwnerView ? "✗ Student's Answer" : "✗ Your Answer"}
                    </Badge>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </VStack>

        <Flex gap={6} mb={question.explanation ? 3 : 0} flexWrap="wrap">
          <Box>
            <Text fontSize="11px" color="#94a3b8" fontWeight={600} textTransform="uppercase" mb={1}>{yourAnswerLabel}</Text>
            <Text fontSize="13px" fontWeight={700}
              color={status === "correct" ? "#16a34a" : status === "incorrect" ? "#ef4444" : "#94a3b8"}>
              {userAnswerText || "Not Attempted"}
            </Text>
          </Box>
          <Box>
            <Text fontSize="11px" color="#94a3b8" fontWeight={600} textTransform="uppercase" mb={1}>Correct Answer</Text>
            <Text fontSize="13px" fontWeight={700} color="#16a34a">{correctText || "—"}</Text>
          </Box>
        </Flex>

        {question.explanation && (
          <Box mt={3} p={4} bg="#eff6ff" borderRadius="10px" borderLeft="3px solid #4a72b8">
            <Flex align="center" gap={2} mb={1.5}>
              <Icon as={FiAlertCircle} color="#4a72b8" fontSize="14px" />
              <Text fontSize="11px" fontWeight={700} color="#1e3a5f" textTransform="uppercase">Explanation</Text>
            </Flex>
            <Text fontSize="13px" color="#1e3a5f" lineHeight="1.7">{question.explanation}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function StatBox({ label, value, sub, color, bg, border, icon }) {
  return (
    <Box bg={bg} border="1.5px solid" borderColor={border} borderRadius="14px" p={4}>
      <Flex align="center" gap={2} mb={2}>
        <Icon as={icon} color={color} fontSize="14px" />
        <Text fontSize="11px" fontWeight={700} color={color} textTransform="uppercase">{label}</Text>
      </Flex>
      <Text fontSize="26px" fontWeight={900} color={color} lineHeight={1}>{value}</Text>
      {sub && <Text fontSize="11px" color={color} opacity={0.7} mt={1}>{sub}</Text>}
    </Box>
  );
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const s = location.state || {};

  // ── Owner-view flag ──────────────────────────────────────────────────────
  const isOwnerView  = s.viewingAs === "owner";
  const studentName  = s.studentName || null;

  const testTitle     = s.testTitle || s.category || s.subject || "Test";
  const score         = s.score ?? 0;
  const totalQuestions= s.totalQuestions ?? 0;
  const scorePercentage = s.scorePercentage ?? (totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0);
  const percentile    = s.percentile ?? null;
  const timeTaken     = s.timeTaken ?? 0;

  const questions        = s.questions || [];
  const allAnswers       = s.allAnswers || {};
  const questionTimes    = s.questionTimes || {};
  const correctQus       = s.correctQus || [];
  const wrongansqus      = s.wrongansqus || [];
  const answeredQuestion = s.answeredQuestion || [];
  const notAnswer        = s.notAnswer || [];
  const markedAndAnswer  = s.markedAndAnswer || [];
  const markedNotAnswer  = s.markedNotAnswer || [];

  const correctCount  = correctQus.length;
  const wrongCount    = wrongansqus.length;
  const skippedCount  = notAnswer.length;
  const markedCount   = markedAndAnswer.length + markedNotAnswer.length;
  const accuracy      = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
  const pct           = Math.round(scorePercentage);
  const allIndices    = questions.map((_, i) => i);
  const markedAll     = [...markedAndAnswer, ...markedNotAnswer];

  const donut = {
    labels: ["Correct", "Wrong", "Skipped"],
    datasets: [{ data: [correctCount, wrongCount, skippedCount],
      backgroundColor: ["#4ade80","#f87171","#cbd5e1"], borderWidth: 0, cutout: "72%" }],
  };
  const donutOpts = { responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { padding: 10 } } };

  const TABS = [
    { label: "All",      count: totalQuestions,          indices: allIndices       },
    { label: "Correct",  count: correctCount,            indices: correctQus       },
    { label: "Wrong",    count: wrongCount,              indices: wrongansqus      },
    { label: "Skipped",  count: skippedCount,            indices: notAnswer        },
    { label: "Marked",   count: markedCount,             indices: markedAll        },
    { label: "Answered", count: answeredQuestion.length, indices: answeredQuestion },
  ];

  if (!s.score && !s.questions) {
    return (
      <Flex minH="100vh" align="center" justify="center" direction="column" gap={4}
        bg="#f8fafc" fontFamily="'Sora',sans-serif">
        <Icon as={FaChartBar} fontSize="48px" color="#e2e8f0" />
        <Text fontSize="16px" fontWeight={700} color="#374151">No result data found</Text>
        <Text fontSize="13px" color="#94a3b8" mb={2}>Please take a test first</Text>
        <Box as="button" px={6} py={3} bg="#4a72b8" color="white" borderRadius="10px"
          fontWeight={700} fontSize="14px" onClick={() => navigate("/coaching")}>
          Browse Tests
        </Box>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="#f1f5f9" fontFamily="'Sora',sans-serif">

      {/* ── Owner-view banner ────────────────────────────────────────────── */}
      {isOwnerView && (
        <Box bg="#1e3a5f" px={{ base: 4, md: 8 }} py={3}>
          <Flex maxW="1200px" mx="auto" align="center" gap={3} flexWrap="wrap">
            <Flex
              align="center" gap={2}
              bg="rgba(255,215,0,.15)" border="1px solid rgba(255,215,0,.3)"
              px={3} py="5px" borderRadius="full" flexShrink={0}
            >
              <Icon as={FaShieldAlt} color="gold" fontSize="11px" />
              <Text fontSize="11px" fontWeight={700} color="gold">Owner View</Text>
            </Flex>
            <Text fontSize="13px" color="rgba(255,255,255,.7)">
              Viewing result for
            </Text>
            <Flex align="center" gap={2}>
              <Icon as={FaUser} fontSize="11px" color="rgba(255,255,255,.5)" />
              <Text fontSize="13px" fontWeight={700} color="white">
                {studentName || "Student"}
              </Text>
            </Flex>
            {/* back to leaderboard */}
            <Box
              ml="auto"
              cursor="pointer"
              onClick={() => navigate(-1)}
              color="rgba(255,255,255,.45)"
              _hover={{ color: "white" }}
              transition="color .15s"
            >
              <Flex align="center" gap={1.5}>
                <Icon as={FaArrowLeft} fontSize="11px" />
                <Text fontSize="12px" fontWeight={600}>Back to Leaderboard</Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      )}

      {/* Top bar */}
      <Box bg="linear-gradient(135deg,#0f1e3a,#1e3a5f,#2d5fa8)" px={{ base: 4, md: 8 }} py={5}>
        <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
          <Flex align="center" gap={3}>
            <Box
              cursor="pointer"
              onClick={() => navigate(isOwnerView ? -1 : "/")}
              color="rgba(255,255,255,.5)"
              _hover={{ color: "white" }}
            >
              <Icon as={FaArrowLeft} fontSize="14px" />
            </Box>
            <Box>
              <Text fontSize={{ base: "15px", md: "18px" }} fontWeight={800} color="white" noOfLines={1}>
                {testTitle}
              </Text>
              <Text fontSize="12px" color="rgba(255,255,255,.5)">
                {isOwnerView ? `${studentName || "Student"}'s Result` : "Test Result"}
              </Text>
            </Box>
          </Flex>
          {/* Only show Review button for the student's own result, not owner view */}
          {!isOwnerView && (
            <Box px={4} py={2} bg="rgba(255,255,255,.1)" borderRadius="10px"
              border="1px solid rgba(255,255,255,.15)" cursor="pointer"
              onClick={() => navigate("/Review-Test", {
                state: { testTitle, questions, allAnswers, questionTimes, correctQus, wrongansqus,
                  answeredQuestion, notAnswer, markedAndAnswer, markedNotAnswer, score, totalQuestions, scorePercentage, timeTaken },
              })}
              _hover={{ bg: "rgba(255,255,255,.15)" }}>
              <Text fontSize="12px" fontWeight={700} color="white">Review Test</Text>
            </Box>
          )}
        </Flex>
      </Box>

      <Box maxW="1200px" mx="auto" px={{ base: 3, md: 8 }} py={6}>
        {/* Score Hero */}
        <Box bg="white" borderRadius="20px" border="1px solid #e2e8f0"
          boxShadow="0 4px 24px rgba(0,0,0,.06)" overflow="hidden" mb={5}>
          <Box h="5px" bg={pctBg(pct)}>
            <Box h="100%" w={`${pct}%`} bg={pctColor(pct)} borderRadius="full" style={{ transition: "width 1s ease" }} />
          </Box>
          <Flex direction={{ base: "column", md: "row" }} align="center"
            px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }} gap={{ base: 6, md: 10 }}>
            <Box flexShrink={0} position="relative" w="160px" h="160px">
              <Doughnut data={donut} options={donutOpts} />
              <Flex position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)"
                direction="column" align="center">
                <Text fontSize="28px" fontWeight={900} color={pctColor(pct)} lineHeight={1}>{pct}%</Text>
                <Text fontSize="11px" color="#94a3b8" fontWeight={600} mt={0.5}>Score</Text>
              </Flex>
            </Box>
            <Box flex={1} w="100%">
              <Flex align="center" gap={3} mb={1} flexWrap="wrap">
                <Text fontSize={{ base: "22px", md: "28px" }} fontWeight={900} color="#0f172a">
                  {score} / {totalQuestions}
                </Text>
                <Badge px={3} py={1} borderRadius="full" fontSize="12px" fontWeight={700}
                  bg={pctBg(pct)} color={pctColor(pct)}>{pctLabel(pct)}</Badge>
              </Flex>
              {percentile !== null && (
                <Flex align="center" gap={2} mb={4}>
                  <Flex align="center" gap={1.5} px={3} py={1.5} bg="#fefce8" border="1px solid #fde68a" borderRadius="10px">
                    <Icon as={FaTrophy} color="#d97706" fontSize="13px" />
                    <Text fontSize="13px" fontWeight={700} color="#92400e">
                      Percentile: {typeof percentile === "number" ? `${percentile.toFixed(1)}%` : percentile}
                    </Text>
                  </Flex>
                  <Text fontSize="12px" color="#94a3b8">
                    Better than {typeof percentile === "number" ? `${percentile.toFixed(0)}%` : percentile} of all students
                  </Text>
                </Flex>
              )}
              <Grid templateColumns={{ base: "repeat(2,1fr)", sm: "repeat(4,1fr)" }} gap={3}>
                {[
                  { label: "Correct", value: correctCount, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: FaCheckCircle },
                  { label: "Wrong",   value: wrongCount,   color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: FaTimesCircle },
                  { label: "Skipped", value: skippedCount, color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle      },
                  { label: "Marked",  value: markedCount,  color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: FaFlag        },
                ].map(s => <StatBox key={s.label} {...s} />)}
              </Grid>
            </Box>
          </Flex>
        </Box>

        {/* Details row */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3,1fr)" }} gap={4} mb={5}>
          <Box bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="0 2px 12px rgba(0,0,0,.04)" p={5}>
            <Flex align="center" gap={2} mb={4}>
              <Flex w="36px" h="36px" bg="#eff6ff" borderRadius="10px" align="center" justify="center">
                <Icon as={FaClock} color="#4a72b8" fontSize="16px" />
              </Flex>
              <Text fontSize="14px" fontWeight={800} color="#0f172a">Time Details</Text>
            </Flex>
            <VStack align="stretch" spacing={3}>
              <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Time Taken</Text><Text fontSize="13px" fontWeight={700} color="#374151">{fmtTime(timeTaken)}</Text></Flex>
              {totalQuestions > 0 && timeTaken > 0 && (
                <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Per Question (avg)</Text><Text fontSize="13px" fontWeight={700} color="#374151">{fmtTime(Math.round(timeTaken / totalQuestions))}</Text></Flex>
              )}
              <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Total Questions</Text><Text fontSize="13px" fontWeight={700} color="#374151">{totalQuestions}</Text></Flex>
            </VStack>
          </Box>

          <Box bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="0 2px 12px rgba(0,0,0,.04)" p={5}>
            <Flex align="center" gap={2} mb={4}>
              <Flex w="36px" h="36px" bg="#f0fdf4" borderRadius="10px" align="center" justify="center">
                <Icon as={FiTarget} color="#16a34a" fontSize="16px" />
              </Flex>
              <Text fontSize="14px" fontWeight={800} color="#0f172a">Accuracy</Text>
            </Flex>
            <Text fontSize="36px" fontWeight={900} color={pctColor(accuracy)} lineHeight={1} mb={2}>{accuracy.toFixed(1)}%</Text>
            <Box bg="#f1f5f9" borderRadius="full" h="8px" mb={3}>
              <Box h="100%" w={`${accuracy}%`} bg={pctColor(accuracy)} borderRadius="full" style={{ transition: "width 1s ease" }} />
            </Box>
            <VStack align="stretch" spacing={2}>
              <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Answered</Text><Text fontSize="13px" fontWeight={700} color="#374151">{answeredQuestion.length}</Text></Flex>
              <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Completion</Text><Text fontSize="13px" fontWeight={700} color="#374151">{totalQuestions > 0 ? Math.round((answeredQuestion.length / totalQuestions) * 100) : 0}%</Text></Flex>
            </VStack>
          </Box>

          <Box bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="0 2px 12px rgba(0,0,0,.04)" p={5}>
            <Flex align="center" gap={2} mb={4}>
              <Flex w="36px" h="36px" bg="#fefce8" borderRadius="10px" align="center" justify="center">
                <Icon as={FiAward} color="#d97706" fontSize="16px" />
              </Flex>
              <Text fontSize="14px" fontWeight={800} color="#0f172a">Ranking</Text>
            </Flex>
            {percentile !== null ? (
              <>
                <Text fontSize="36px" fontWeight={900} color="#d97706" lineHeight={1} mb={1}>
                  {typeof percentile === "number" ? `${percentile.toFixed(1)}%` : percentile}
                </Text>
                <Text fontSize="12px" color="#94a3b8" mb={3}>Percentile Score</Text>
                <Box bg="#fef9c3" borderRadius="10px" px={3} py={2}>
                  <Text fontSize="12px" fontWeight={600} color="#92400e">
                    🏆 Better than {typeof percentile === "number" ? `${percentile.toFixed(0)}%` : percentile} of all students
                  </Text>
                </Box>
              </>
            ) : (
              <>
                <Text fontSize="14px" color="#94a3b8" mb={3}>Percentile available after more students attempt.</Text>
                <Box bg={pctBg(pct)} borderRadius="10px" px={3} py={2}>
                  <Text fontSize="12px" fontWeight={600} color={pctColor(pct)}>Score: {pct}% — {pctLabel(pct)}</Text>
                </Box>
              </>
            )}
          </Box>
        </Grid>

        {/* Legend */}
        <Box bg="white" borderRadius="14px" border="1px solid #e2e8f0" boxShadow="0 2px 8px rgba(0,0,0,.04)" px={5} py={4} mb={5}>
          <Text fontSize="12px" fontWeight={700} color="#64748b" textTransform="uppercase" letterSpacing=".8px" mb={3}>
            Question Status Legend
          </Text>
          <Flex gap={3} flexWrap="wrap">
            {[
              { label: "Correct",        color: "#16a34a", bg: "#f0fdf4" },
              { label: "Incorrect",      color: "#ef4444", bg: "#fef2f2" },
              { label: "Marked & Ans",   color: "#7c3aed", bg: "#f5f3ff" },
              { label: "Marked (Skip)",  color: "#d97706", bg: "#fffbeb" },
              { label: "Skipped",        color: "#64748b", bg: "#f8fafc" },
              { label: "Answered",       color: "#2563eb", bg: "#eff6ff" },
            ].map(l => (
              <Flex key={l.label} align="center" gap={1.5} px={3} py={1.5} bg={l.bg} borderRadius="full">
                <Box w="8px" h="8px" bg={l.color} borderRadius="full" />
                <Text fontSize="11px" fontWeight={600} color={l.color}>{l.label}</Text>
              </Flex>
            ))}
          </Flex>
        </Box>

        {/* Question tabs */}
        <Box bg="white" borderRadius="20px" border="1px solid #e2e8f0"
          boxShadow="0 4px 24px rgba(0,0,0,.06)" overflow="hidden">
          <Tabs colorScheme="blue" variant="unstyled">
            <Box px={{ base: 3, md: 6 }} pt={{ base: 4, md: 6 }} borderBottom="1px solid #f1f5f9">
              <Flex gap={1} overflowX="auto" pb={3}
                css={{ "&::-webkit-scrollbar": { height: "3px" }, "&::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: "10px" } }}>
                {TABS.map(t => (
                  <Tab key={t.label} px={4} py={2} borderRadius="10px" fontSize="12px" fontWeight={700}
                    color="#64748b" whiteSpace="nowrap"
                    _selected={{ bg: "#eff6ff", color: "#4a72b8" }} _hover={{ bg: "#f8fafc" }}>
                    {t.label}
                    <Box as="span" ml={1.5} px={2} py={0.5} bg="rgba(0,0,0,.06)" borderRadius="full" fontSize="11px">{t.count}</Box>
                  </Tab>
                ))}
              </Flex>
            </Box>
            <TabPanels>
              {TABS.map(t => (
                <TabPanel key={t.label} px={{ base: 3, md: 6 }} py={5}>
                  {t.indices.length === 0 ? (
                    <Box textAlign="center" py={16}>
                      <Icon as={FaChartBar} fontSize="40px" color="#e2e8f0" display="block" mx="auto" mb={3} />
                      <Text fontSize="14px" color="#94a3b8">No questions in this category</Text>
                    </Box>
                  ) : (
                    t.indices.map(idx => (
                      <QuestionCard key={idx} index={idx} question={questions[idx]}
                        allAnswers={allAnswers} correctQus={correctQus} wrongansqus={wrongansqus}
                        answeredQuestion={answeredQuestion} notAnswer={notAnswer}
                        markedAndAnswer={markedAndAnswer} markedNotAnswer={markedNotAnswer}
                        questionTimes={questionTimes}
                        isOwnerView={isOwnerView} />
                    ))
                  )}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>

        {/* Bottom actions — differ for owner vs student */}
        <Flex justify="center" gap={4} mt={6} flexWrap="wrap">
          {isOwnerView ? (
            <Box as="button" px={6} py={3} bg="#0f1e3a" color="white" borderRadius="12px"
              fontWeight={700} fontSize="13px" onClick={() => navigate(-1)}
              _hover={{ opacity: .9 }} transition="opacity .2s">
              ← Back to Leaderboard
            </Box>
          ) : (
            <>
              <Box as="button" px={6} py={3} bg="#0f1e3a" color="white" borderRadius="12px"
                fontWeight={700} fontSize="13px" onClick={() => navigate("/coaching")}
                _hover={{ opacity: .9 }} transition="opacity .2s">
                Browse More Tests
              </Box>
              <Box as="button" px={6} py={3} bg="white" color="#4a72b8" border="1.5px solid #4a72b8"
                borderRadius="12px" fontWeight={700} fontSize="13px" onClick={() => navigate("/UserTestData")}
                _hover={{ bg: "#eff6ff" }} transition="all .2s">
                My Results
              </Box>
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
}