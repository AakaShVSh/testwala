// /**
//  * ResultPage.jsx
//  *
//  * Student view  — unchanged UX
//  * Owner view    — extra banner + "All Attempts" panel listing every retake
//  *                 Each retake row is clickable and reloads this page with
//  *                 that attempt's full data.
//  *
//  * state.viewingAs === "owner"  →  owner mode
//  * state.studentId + state.testId →  used to fetch all attempts
//  * state.resultId                →  the currently shown attempt (_id)
//  */
// import React, { useState } from "react";
// import {
//   Box, Flex, Text, Badge, Progress, Icon, Grid,
//   Tabs, TabList, TabPanels, Tab, TabPanel, VStack, Spinner,
// } from "@chakra-ui/react";
// import { Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS, ArcElement, CategoryScale, LinearScale,
//   PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend,
// } from "chart.js";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   FaArrowLeft, FaTrophy, FaClock, FaCheckCircle, FaTimesCircle,
//   FaFlag, FaCircle, FaChartBar, FaStopwatch, FaShieldAlt,
//   FaUser, FaRedoAlt, FaCalendarAlt, FaExternalLinkAlt,
// } from "react-icons/fa";
// import { FiAlertCircle, FiTarget, FiAward } from "react-icons/fi";
// import { apiFetch } from "../services/api";

// ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, Legend);

// // ─── helpers ────────────────────────────────────────────────────────────────
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
//   return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
// };
// const pctColor = (p) => p >= 70 ? "#16a34a" : p >= 40 ? "#d97706" : "#ef4444";
// const pctBg    = (p) => p >= 70 ? "#f0fdf4" : p >= 40 ? "#fffbeb" : "#fef2f2";
// const pctLabel = (p) => p >= 80 ? "Excellent 🌟" : p >= 60 ? "Good 👍" : p >= 40 ? "Average 📈" : "Needs Work 💪";

// // ─── QuestionCard ────────────────────────────────────────────────────────────
// function QuestionCard({
//   question, index, allAnswers, correctQus, wrongansqus,
//   markedAndAnswer, markedNotAnswer, notAnswer, answeredQuestion,
//   questionTimes, isOwnerView,
// }) {
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
//     correct:        { label: "Correct",          color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: FaCheckCircle },
//     incorrect:      { label: "Incorrect",         color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: FaTimesCircle },
//     markedAnswered: { label: "Marked & Answered", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: FaFlag       },
//     markedSkipped:  { label: "Marked (Skipped)",  color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: FaFlag       },
//     skipped:        { label: "Not Attempted",     color: "#64748b", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle     },
//     answered:       { label: "Answered",          color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: FaCheckCircle},
//     notVisited:     { label: "Not Visited",       color: "#94a3b8", bg: "#f8fafc", border: "#e2e8f0", icon: FaCircle     },
//   };

//   const status = getStatus();
//   const cfg = STATUS[status];
//   const userAnswerIdx  = allAnswers[index] ?? allAnswers[String(index)];
//   const userAnswerText = (userAnswerIdx !== undefined && userAnswerIdx !== null) ? question.options?.[userAnswerIdx] : null;
//   const correctIdx  = typeof question.answer === "number" ? question.answer : question.answer - 1;
//   const correctText = question.options?.[correctIdx];
//   const timeTaken   = questionTimes?.[index] ?? questionTimes?.[String(index)] ?? null;
//   const timeStr     = fmtQTime(timeTaken);
//   const answerLabel = isOwnerView ? "Student's Answer" : "Your Answer";

//   return (
//     <Box bg="white" borderRadius="14px" border="1.5px solid" borderColor={cfg.border} overflow="hidden" mb={3} boxShadow="0 2px 8px rgba(0,0,0,.04)">
//       <Flex align="center" justify="space-between" px={5} py={3} borderBottom="1px solid" borderColor={cfg.border} bg={cfg.bg}>
//         <Flex align="center" gap={3}>
//           <Flex w="28px" h="28px" bg="white" borderRadius="full" align="center" justify="center" border="1.5px solid" borderColor={cfg.border}>
//             <Text fontSize="12px" fontWeight={800} color={cfg.color}>{index + 1}</Text>
//           </Flex>
//           <Badge px={3} py={1} borderRadius="full" fontSize="11px" fontWeight={700} bg="white" color={cfg.color} border="1px solid" borderColor={cfg.border}>
//             <Flex align="center" gap={1.5}><Icon as={cfg.icon} fontSize="11px" />{cfg.label}</Flex>
//           </Badge>
//         </Flex>
//         <Flex align="center" gap={2}>
//           {timeStr && (
//             <Flex align="center" gap={1.5} bg="white" px={3} py="4px" borderRadius="full" border="1px solid #e2e8f0">
//               <Icon as={FaStopwatch} fontSize="10px" color="#64748b" />
//               <Text fontSize="11px" fontWeight={700} color="#374151">{timeStr}</Text>
//             </Flex>
//           )}
//           {status === "correct" && (
//             <Badge bg="#f0fdf4" color="#16a34a" border="1px solid #bbf7d0" fontSize="11px" fontWeight={700} px={3} py={1} borderRadius="full">+1 pt</Badge>
//           )}
//         </Flex>
//       </Flex>
//       <Box px={5} py={4}>
//         <Text fontSize="14px" fontWeight={600} color="#1e293b" mb={4} lineHeight="1.7">{question.qus}</Text>
//         <VStack spacing={2} align="stretch" mb={4}>
//           {question.options?.map((opt, i) => {
//             const isCorrect   = i === correctIdx;
//             const isUserPick  = userAnswerIdx === i;
//             const isWrongPick = isUserPick && !isCorrect;
//             return (
//               <Flex key={i} align="center" gap={3} px={4} py={3} borderRadius="10px" border="1.5px solid" borderColor={isCorrect ? "#86efac" : isWrongPick ? "#fca5a5" : "#e2e8f0"} bg={isCorrect ? "#f0fdf4" : isWrongPick ? "#fef2f2" : "white"}>
//                 <Flex w="26px" h="26px" borderRadius="full" flexShrink={0} align="center" justify="center" fontWeight={800} fontSize="11px" bg={isCorrect ? "#16a34a" : isWrongPick ? "#ef4444" : "#f1f5f9"} color={isCorrect || isWrongPick ? "white" : "#64748b"}>{String.fromCharCode(65 + i)}</Flex>
//                 <Text flex={1} fontSize="13px" color="#374151" fontWeight={(isCorrect || isUserPick) ? 600 : 400}>{opt}</Text>
//                 <Flex gap={1.5} flexShrink={0}>
//                   {isCorrect && <Badge bg="#f0fdf4" color="#16a34a" fontSize="10px" fontWeight={700} border="1px solid #bbf7d0" px={2} py={0.5} borderRadius="full">✓ Correct Answer</Badge>}
//                   {isUserPick && isCorrect && <Badge bg="#eff6ff" color="#2563eb" fontSize="10px" fontWeight={700} border="1px solid #bfdbfe" px={2} py={0.5} borderRadius="full">{answerLabel}</Badge>}
//                   {isWrongPick && <Badge bg="#fef2f2" color="#ef4444" fontSize="10px" fontWeight={700} border="1px solid #fecaca" px={2} py={0.5} borderRadius="full">✗ {answerLabel}</Badge>}
//                 </Flex>
//               </Flex>
//             );
//           })}
//         </VStack>
//         <Flex gap={6} mb={question.explanation ? 3 : 0} flexWrap="wrap">
//           <Box>
//             <Text fontSize="11px" color="#94a3b8" fontWeight={600} textTransform="uppercase" mb={1}>{answerLabel}</Text>
//             <Text fontSize="13px" fontWeight={700} color={status === "correct" ? "#16a34a" : status === "incorrect" ? "#ef4444" : "#94a3b8"}>{userAnswerText || "Not Attempted"}</Text>
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

// // ── AllAttemptsPanel ─────────────────────────────────────────────────────────
// // Receives allAttempts from location.state — no extra API call.
// // Only rendered when allAttempts.length > 1.
// // Labels: idx 0 → "1st Attempt", idx 1 → "Retake 1", idx 2 → "Retake 2", …
// function AllAttemptsPanel({ allAttempts, currentResultId, questions, navigate,
//   testTitle, studentName, studentId, testId, backUrl }) {
//   const [loadingId, setLoadingId] = useState(null);
//   const attempts = allAttempts || [];

//   if (attempts.length <= 1) return null;

//   const attemptLabel = (idx) => idx === 0 ? "1st Attempt" : `Retake ${idx}`;

//   const handleSelectAttempt = async (attempt) => {
//     if (String(attempt._id) === String(currentResultId)) return;
//     setLoadingId(attempt._id);
//     try {
//       const res = await apiFetch(`/results/${attempt._id}`);
//       const r = res.data || res;
//       const toArr = (v) => Array.isArray(v) ? v : [];
//       const originalQs = Array.isArray(r.testId?.questions) ? r.testId.questions
//                : Array.isArray(questions) ? questions : [];
//       const shuffledQs = Array.isArray(r.shuffledQuestions) && r.shuffledQuestions.length > 0
//                ? r.shuffledQuestions : [];

//       navigate("/test-result", {
//         replace: true,
//         state: {
//           viewingAs: "owner",
//           studentName, studentId, testId, testTitle,
//           backUrl,
//           allAttempts,
//           currentAttemptId: String(attempt._id),
//           resultId: String(attempt._id),
//           score: r.correct ?? (Array.isArray(r.correctQus) ? r.correctQus.length : 0) ?? 0,
//           totalQuestions: originalQs.length || r.totalQuestions || 0,
//           scorePercentage: r.scorePercentage ?? r.percentage ?? 0,
//           percentile: r.percentile ?? null,
//           timeTaken: r.timeTakenSec ?? r.timeTaken ?? 0,
//           shuffledQuestions: shuffledQs,
//           questions: originalQs,
//           allAnswers:       (r.allAnswers && typeof r.allAnswers === "object") ? r.allAnswers : {},
//           questionTimes:    (r.questionTimes && typeof r.questionTimes === "object") ? r.questionTimes : {},
//           correctQus:       toArr(r.correctQus),
//           wrongansqus:      toArr(r.wrongansqus).length      ? toArr(r.wrongansqus)      : toArr(r.wrongQus),
//           answeredQuestion: toArr(r.answeredQuestion).length ? toArr(r.answeredQuestion) : toArr(r.answeredQus).length ? toArr(r.answeredQus) : toArr(r.answered),
//           notAnswer:        toArr(r.notAnswer).length        ? toArr(r.notAnswer)        : toArr(r.notAnsweredQus).length ? toArr(r.notAnsweredQus) : toArr(r.skipped),
//           markedAndAnswer:  toArr(r.markedAndAnswer).length  ? toArr(r.markedAndAnswer)  : toArr(r.markedAndAnswered),
//           markedNotAnswer:  toArr(r.markedNotAnswer).length  ? toArr(r.markedNotAnswer)  : toArr(r.markedNotAnswered),
//         },
//       });
//     } catch {
//       // silently stay on current attempt
//     } finally {
//       setLoadingId(null);
//     }
//   };

//   const currentIdx = attempts.findIndex((a) => String(a._id) === String(currentResultId));

//   return (
//     <Box
//       bg="white" borderRadius="16px" border="1px solid #e2e8f0"
//       boxShadow="0 2px 12px rgba(0,0,0,.05)" overflow="hidden" mb={5}
//     >
//       {/* Header */}
//       <Flex
//         px={5} py={4} align="center" gap={3}
//         borderBottom="1px solid #f1f5f9"
//         bg="linear-gradient(90deg,#fafbff,#fff)"
//         flexWrap="wrap"
//       >
//         <Flex
//           w="36px" h="36px" bg="#f0f7ff" borderRadius="10px"
//           align="center" justify="center" flexShrink={0}
//           border="1px solid #dbeafe"
//         >
//           <Icon as={FaRedoAlt} color="#2563eb" fontSize="13px" />
//         </Flex>
//         <Box>
//           <Text fontSize="14px" fontWeight={800} color="#0f172a" lineHeight="1.2">
//             Attempt History
//           </Text>
//           <Text fontSize="11px" color="#94a3b8" mt="2px">
//             {attempts.length} attempt{attempts.length !== 1 ? "s" : ""} total
//             {currentIdx >= 0 && (
//               <Text as="span" color="#2563eb" fontWeight={600}>
//                 {" "}· Viewing {attemptLabel(currentIdx)}
//               </Text>
//             )}
//           </Text>
//         </Box>
//         <Flex
//           ml="auto" align="center" gap={1.5}
//           bg="#fefce8" border="1px solid #fde68a"
//           px={3} py="4px" borderRadius="full" flexShrink={0}
//         >
//           <Icon as={FaTrophy} fontSize="9px" color="#92400e" />
//           <Text fontSize="11px" fontWeight={700} color="#92400e">
//             1st Attempt counts in leaderboard
//           </Text>
//         </Flex>
//       </Flex>

//       {/* Attempt rows */}
//       {attempts.map((attempt, idx) => {
//         const pct       = attempt.scorePercentage ?? 0;
//         const isCurrent = String(attempt._id) === String(currentResultId);
//         const isFirst   = idx === 0;
//         const isLoading = String(loadingId) === String(attempt._id);
//         const label     = attemptLabel(idx);
//         const date      = attempt.createdAt
//           ? new Date(attempt.createdAt).toLocaleDateString("en-IN",
//               { day: "2-digit", month: "short", year: "numeric" })
//           : null;
//         const time      = attempt.createdAt
//           ? new Date(attempt.createdAt).toLocaleTimeString("en-IN",
//               { hour: "2-digit", minute: "2-digit" })
//           : null;

//         // colour scheme per row type
//         const rowBg        = isCurrent ? "#eff6ff" : "white";
//         const accentColor  = isFirst   ? "#d97706" : "#7c3aed";
//         const accentBg     = isFirst   ? "#fefce8" : "#f5f3ff";
//         const accentBorder = isFirst   ? "#fde68a" : "#ddd6fe";
//         const borderLeft   = isCurrent
//           ? `3px solid ${isFirst ? "#d97706" : "#2563eb"}`
//           : "3px solid transparent";

//         return (
//           <Flex
//             key={attempt._id}
//             px={5} py={{ base: 3, sm: 4 }}
//             align="center" gap={4}
//             borderBottom={idx < attempts.length - 1 ? "1px solid #f8fafc" : "none"}
//             bg={rowBg}
//             borderLeft={borderLeft}
//             cursor={isCurrent ? "default" : "pointer"}
//             _hover={!isCurrent ? { bg: "#f8faff" } : {}}
//             transition="background .15s"
//             onClick={() => !isCurrent && !isLoading && handleSelectAttempt(attempt)}
//             opacity={isLoading ? 0.65 : 1}
//             flexWrap={{ base: "wrap", sm: "nowrap" }}
//           >
//             {/* Label pill */}
//             <Flex
//               align="center" gap={2} flexShrink={0}
//               bg={isCurrent ? (isFirst ? "#fef3c7" : "#eff6ff") : accentBg}
//               border="1px solid"
//               borderColor={isCurrent ? (isFirst ? "#fbbf24" : "#bfdbfe") : accentBorder}
//               px={3} py="5px" borderRadius="full" minW="110px" justify="center"
//             >
//               {isFirst
//                 ? <Icon as={FaTrophy} fontSize="10px" color={isCurrent ? "#d97706" : "#92400e"} />
//                 : <Icon as={FaRedoAlt} fontSize="10px" color={isCurrent ? "#2563eb" : "#7c3aed"} />
//               }
//               <Text
//                 fontSize="11px" fontWeight={800} whiteSpace="nowrap"
//                 color={isCurrent ? (isFirst ? "#92400e" : "#1d4ed8") : accentColor}
//               >
//                 {label}
//               </Text>
//             </Flex>

//             {/* Score */}
//             <Box minW="52px" flexShrink={0}>
//               <Text fontSize="17px" fontWeight={800} color={pctColor(pct)} lineHeight="1">
//                 {pct.toFixed(0)}%
//               </Text>
//               <Text fontSize="10px" color="#94a3b8" mt="1px">
//                 {attempt.correct ?? 0}/{attempt.totalQuestions ?? "—"} correct
//               </Text>
//             </Box>

//             {/* Progress bar */}
//             <Box flex={1} minW={0}>
//               <Progress
//                 value={pct} size="xs"
//                 colorScheme={pct >= 60 ? "green" : pct >= 40 ? "yellow" : "red"}
//                 borderRadius="full"
//               />
//             </Box>

//             {/* Date + time */}
//             {date && (
//               <Flex align="center" gap={1.5} flexShrink={0}
//                 display={{ base: "none", sm: "flex" }}>
//                 <Icon as={FaCalendarAlt} fontSize="10px" color="#94a3b8" />
//                 <Text fontSize="11px" color="#64748b">{date}</Text>
//                 <Text fontSize="11px" color="#94a3b8">{time}</Text>
//               </Flex>
//             )}

//             {/* Duration */}
//             <Flex align="center" gap={1.5} flexShrink={0}
//               display={{ base: "none", md: "flex" }}>
//               <Icon as={FaClock} fontSize="10px" color="#94a3b8" />
//               <Text fontSize="11px" color="#64748b">
//                 {fmtTime(attempt.timeTakenSec ?? 0)}
//               </Text>
//             </Flex>

//             {/* Status badges + action */}
//             <Flex gap={2} flexShrink={0} align="center">
//               {isCurrent && (
//                 <Badge
//                   bg={isFirst ? "#fef3c7" : "#eff6ff"}
//                   color={isFirst ? "#92400e" : "#1d4ed8"}
//                   border="1px solid"
//                   borderColor={isFirst ? "#fbbf24" : "#bfdbfe"}
//                   fontSize="9px" fontWeight={800} px={2} py={0.5} borderRadius="full"
//                 >
//                   Viewing
//                 </Badge>
//               )}
//               {isLoading
//                 ? <Spinner size="xs" color="#4a72b8" />
//                 : !isCurrent
//                   ? <Icon as={FaExternalLinkAlt} fontSize="10px" color="#94a3b8" />
//                   : null
//               }
//             </Flex>
//           </Flex>
//         );
//       })}
//     </Box>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function ResultPage() {
//   const location = useLocation();
//   const navigate  = useNavigate();
//   const s = location.state || {};

//   // owner-view metadata
//   const isOwnerView  = s.viewingAs === "owner";
//   const studentName  = s.studentName || null;
//   const studentId    = s.studentId   || null;
//   const testId       = s.testId      || null;
//   const currentResultId = s.currentAttemptId || s.resultId || null;
//   const backUrl      = s.backUrl || null;    // e.g. /tests/slug?tab=leaderboard
//   const allAttempts  = Array.isArray(s.allAttempts) ? s.allAttempts : [];

//   const testTitle     = s.testTitle || s.category || s.subject || "Test";
//   const score         = s.score ?? 0;
//   const totalQuestions= s.totalQuestions ?? 0;
//   const scorePercentage = s.scorePercentage ?? (totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0);
//   const percentile    = s.percentile ?? null;
//   const timeTaken     = s.timeTaken ?? 0;

//   // Use shuffledQuestions if present — this is the exact order questions were
//   // shown during the test. allAnswers indices are based on this shuffled order.
//   // Fall back to questions (original order) for old results or student's own view.
//   const questions = Array.isArray(s.shuffledQuestions) && s.shuffledQuestions.length > 0
//     ? s.shuffledQuestions
//     : Array.isArray(s.questions) ? s.questions : [];
//   const allAnswers       = (s.allAnswers && typeof s.allAnswers === "object") ? s.allAnswers : {};
//   const questionTimes    = (s.questionTimes && typeof s.questionTimes === "object") ? s.questionTimes : {};
//   const correctQus       = Array.isArray(s.correctQus)       ? s.correctQus       : [];
//   const wrongansqus      = Array.isArray(s.wrongansqus)      ? s.wrongansqus      : [];
//   const answeredQuestion = Array.isArray(s.answeredQuestion)  ? s.answeredQuestion : [];
//   const notAnswer        = Array.isArray(s.notAnswer)         ? s.notAnswer        : [];
//   const markedAndAnswer  = Array.isArray(s.markedAndAnswer)   ? s.markedAndAnswer  : [];
//   const markedNotAnswer  = Array.isArray(s.markedNotAnswer)   ? s.markedNotAnswer  : [];

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
//     datasets: [{ data: [correctCount, wrongCount, skippedCount], backgroundColor: ["#4ade80", "#f87171", "#cbd5e1"], borderWidth: 0, cutout: "72%" }],
//   };
//   const donutOpts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { padding: 10 } } };

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
//       <Flex minH="100vh" align="center" justify="center" direction="column" gap={4} bg="#f8fafc" fontFamily="'Sora',sans-serif">
//         <Icon as={FaChartBar} fontSize="48px" color="#e2e8f0" />
//         <Text fontSize="16px" fontWeight={700} color="#374151">No result data found</Text>
//         <Text fontSize="13px" color="#94a3b8" mb={2}>Please take a test first</Text>
//         <Box as="button" px={6} py={3} bg="#4a72b8" color="white" borderRadius="10px" fontWeight={700} fontSize="14px" onClick={() => navigate("/coaching")}>Browse Tests</Box>
//       </Flex>
//     );
//   }

//   return (
//     <Box minH="100vh" bg="#f1f5f9" fontFamily="'Sora',sans-serif">

//       {/* ── Owner banner ─────────────────────────────────────────────────── */}
//       {isOwnerView && (
//         <Box bg="#1e3a5f" px={{ base: 4, md: 8 }} py={3}>
//           <Flex maxW="1200px" mx="auto" align="center" gap={3} flexWrap="wrap">
//             <Flex align="center" gap={2} bg="rgba(255,215,0,.15)" border="1px solid rgba(255,215,0,.3)" px={3} py="5px" borderRadius="full" flexShrink={0}>
//               <Icon as={FaShieldAlt} color="gold" fontSize="11px" />
//               <Text fontSize="11px" fontWeight={700} color="gold">Owner View</Text>
//             </Flex>
//             <Text fontSize="13px" color="rgba(255,255,255,.7)">Viewing result for</Text>
//             <Flex align="center" gap={2}>
//               <Icon as={FaUser} fontSize="11px" color="rgba(255,255,255,.5)" />
//               <Text fontSize="13px" fontWeight={700} color="white">{studentName || "Student"}</Text>
//             </Flex>
//             <Box ml="auto" cursor="pointer"
//               onClick={() => backUrl ? navigate(backUrl) : navigate(-1)}
//               color="rgba(255,255,255,.45)" _hover={{ color: "white" }} transition="color .15s">
//               <Flex align="center" gap={1.5}>
//                 <Icon as={FaArrowLeft} fontSize="11px" />
//                 <Text fontSize="12px" fontWeight={600}>Back to Leaderboard</Text>
//               </Flex>
//             </Box>
//           </Flex>
//         </Box>
//       )}

//       {/* ── Top bar ──────────────────────────────────────────────────────── */}
//       <Box bg="linear-gradient(135deg,#0f1e3a,#1e3a5f,#2d5fa8)" px={{ base: 4, md: 8 }} py={5}>
//         <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
//           <Flex align="center" gap={3}>
//             <Box cursor="pointer"
//               onClick={() => isOwnerView ? (backUrl ? navigate(backUrl) : navigate(-1)) : navigate("/")}
//               color="rgba(255,255,255,.5)" _hover={{ color: "white" }}>
//               <Icon as={FaArrowLeft} fontSize="14px" />
//             </Box>
//             <Box>
//               <Text fontSize={{ base: "15px", md: "18px" }} fontWeight={800} color="white" noOfLines={1}>{testTitle}</Text>
//               <Text fontSize="12px" color="rgba(255,255,255,.5)">
//                 {isOwnerView ? `${studentName || "Student"}'s Result` : "Test Result"}
//               </Text>
//             </Box>
//           </Flex>
//           {/* Review Test button — student only */}
//           {!isOwnerView && (
//             <Box px={4} py={2} bg="rgba(255,255,255,.1)" borderRadius="10px" border="1px solid rgba(255,255,255,.15)" cursor="pointer"
//               onClick={() => navigate("/Review-Test", { state: { testTitle, questions, allAnswers, questionTimes, correctQus, wrongansqus, answeredQuestion, notAnswer, markedAndAnswer, markedNotAnswer, score, totalQuestions, scorePercentage, timeTaken } })}
//               _hover={{ bg: "rgba(255,255,255,.15)" }}>
//               <Text fontSize="12px" fontWeight={700} color="white">Review Test</Text>
//             </Box>
//           )}
//         </Flex>
//       </Box>

//       <Box maxW="1200px" mx="auto" px={{ base: 3, md: 8 }} py={6}>

//         {/* ── Score Hero ───────────────────────────────────────────────────── */}
//         <Box bg="white" borderRadius="20px" border="1px solid #e2e8f0" boxShadow="0 4px 24px rgba(0,0,0,.06)" overflow="hidden" mb={5}>
//           <Box h="5px" bg={pctBg(pct)}>
//             <Box h="100%" w={`${pct}%`} bg={pctColor(pct)} borderRadius="full" style={{ transition: "width 1s ease" }} />
//           </Box>
//           <Flex direction={{ base: "column", md: "row" }} align="center" px={{ base: 5, md: 8 }} py={{ base: 6, md: 8 }} gap={{ base: 6, md: 10 }}>
//             <Box flexShrink={0} position="relative" w="160px" h="160px">
//               <Doughnut data={donut} options={donutOpts} />
//               <Flex position="absolute" top="50%" left="50%" transform="translate(-50%,-50%)" direction="column" align="center">
//                 <Text fontSize="28px" fontWeight={900} color={pctColor(pct)} lineHeight={1}>{pct}%</Text>
//                 <Text fontSize="11px" color="#94a3b8" fontWeight={600} mt={0.5}>Score</Text>
//               </Flex>
//             </Box>
//             <Box flex={1} w="100%">
//               <Flex align="center" gap={3} mb={1} flexWrap="wrap">
//                 <Text fontSize={{ base: "22px", md: "28px" }} fontWeight={900} color="#0f172a">{score} / {totalQuestions}</Text>
//                 <Badge px={3} py={1} borderRadius="full" fontSize="12px" fontWeight={700} bg={pctBg(pct)} color={pctColor(pct)}>{pctLabel(pct)}</Badge>
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
//                 ].map((st) => <StatBox key={st.label} {...st} />)}
//               </Grid>
//             </Box>
//           </Flex>
//         </Box>

//         {/* ── Details row ──────────────────────────────────────────────────── */}
//         <Grid templateColumns={{ base: "1fr", md: "repeat(3,1fr)" }} gap={4} mb={5}>
//           <Box bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="0 2px 12px rgba(0,0,0,.04)" p={5}>
//             <Flex align="center" gap={2} mb={4}>
//               <Flex w="36px" h="36px" bg="#eff6ff" borderRadius="10px" align="center" justify="center"><Icon as={FaClock} color="#4a72b8" fontSize="16px" /></Flex>
//               <Text fontSize="14px" fontWeight={800} color="#0f172a">Time Details</Text>
//             </Flex>
//             <VStack align="stretch" spacing={3}>
//               <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Time Taken</Text><Text fontSize="13px" fontWeight={700} color="#374151">{fmtTime(timeTaken)}</Text></Flex>
//               {totalQuestions > 0 && timeTaken > 0 && <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Per Question (avg)</Text><Text fontSize="13px" fontWeight={700} color="#374151">{fmtTime(Math.round(timeTaken / totalQuestions))}</Text></Flex>}
//               <Flex justify="space-between"><Text fontSize="13px" color="#64748b">Total Questions</Text><Text fontSize="13px" fontWeight={700} color="#374151">{totalQuestions}</Text></Flex>
//             </VStack>
//           </Box>

//           <Box bg="white" borderRadius="16px" border="1px solid #e2e8f0" boxShadow="0 2px 12px rgba(0,0,0,.04)" p={5}>
//             <Flex align="center" gap={2} mb={4}>
//               <Flex w="36px" h="36px" bg="#f0fdf4" borderRadius="10px" align="center" justify="center"><Icon as={FiTarget} color="#16a34a" fontSize="16px" /></Flex>
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
//               <Flex w="36px" h="36px" bg="#fefce8" borderRadius="10px" align="center" justify="center"><Icon as={FiAward} color="#d97706" fontSize="16px" /></Flex>
//               <Text fontSize="14px" fontWeight={800} color="#0f172a">Ranking</Text>
//             </Flex>
//             {percentile !== null ? (
//               <>
//                 <Text fontSize="36px" fontWeight={900} color="#d97706" lineHeight={1} mb={1}>{typeof percentile === "number" ? `${percentile.toFixed(1)}%` : percentile}</Text>
//                 <Text fontSize="12px" color="#94a3b8" mb={3}>Percentile Score</Text>
//                 <Box bg="#fef9c3" borderRadius="10px" px={3} py={2}>
//                   <Text fontSize="12px" fontWeight={600} color="#92400e">🏆 Better than {typeof percentile === "number" ? `${percentile.toFixed(0)}%` : percentile} of all students</Text>
//                 </Box>
//               </>
//             ) : (
//               <>
//                 <Text fontSize="14px" color="#94a3b8" mb={3}>Percentile available after more students attempt.</Text>
//                 <Box bg={pctBg(pct)} borderRadius="10px" px={3} py={2}>
//                   <Text fontSize="12px" fontWeight={600} color={pctColor(pct)}>Score: {pct}% — {pctLabel(pct)}</Text>
//                 </Box>
//               </>
//             )}
//           </Box>
//         </Grid>

//         {/* ── Attempt History (owner only, only when student has retaken) ──── */}
//         {isOwnerView && allAttempts.length > 1 && (
//           <AllAttemptsPanel
//             allAttempts={allAttempts}
//             currentResultId={currentResultId}
//             questions={questions}
//             navigate={navigate}
//             testTitle={testTitle}
//             studentName={studentName}
//             studentId={studentId}
//             testId={testId}
//             backUrl={backUrl}
//           />
//         )}

//         {/* ── Legend ───────────────────────────────────────────────────────── */}
//         <Box bg="white" borderRadius="14px" border="1px solid #e2e8f0" boxShadow="0 2px 8px rgba(0,0,0,.04)" px={5} py={4} mb={5} mt={5}>
//           <Text fontSize="12px" fontWeight={700} color="#64748b" textTransform="uppercase" letterSpacing=".8px" mb={3}>Question Status Legend</Text>
//           <Flex gap={3} flexWrap="wrap">
//             {[
//               { label: "Correct",       color: "#16a34a", bg: "#f0fdf4" },
//               { label: "Incorrect",     color: "#ef4444", bg: "#fef2f2" },
//               { label: "Marked & Ans",  color: "#7c3aed", bg: "#f5f3ff" },
//               { label: "Marked (Skip)", color: "#d97706", bg: "#fffbeb" },
//               { label: "Skipped",       color: "#64748b", bg: "#f8fafc" },
//               { label: "Answered",      color: "#2563eb", bg: "#eff6ff" },
//             ].map((l) => (
//               <Flex key={l.label} align="center" gap={1.5} px={3} py={1.5} bg={l.bg} borderRadius="full">
//                 <Box w="8px" h="8px" bg={l.color} borderRadius="full" />
//                 <Text fontSize="11px" fontWeight={600} color={l.color}>{l.label}</Text>
//               </Flex>
//             ))}
//           </Flex>
//         </Box>

//         {/* ── Question tabs ─────────────────────────────────────────────────── */}
//         <Box bg="white" borderRadius="20px" border="1px solid #e2e8f0" boxShadow="0 4px 24px rgba(0,0,0,.06)" overflow="hidden">
//           <Tabs colorScheme="blue" variant="unstyled">
//             <Box px={{ base: 3, md: 6 }} pt={{ base: 4, md: 6 }} borderBottom="1px solid #f1f5f9">
//               <Flex gap={1} overflowX="auto" pb={3} css={{ "&::-webkit-scrollbar": { height: "3px" }, "&::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: "10px" } }}>
//                 {TABS.map((t) => (
//                   <Tab key={t.label} px={4} py={2} borderRadius="10px" fontSize="12px" fontWeight={700} color="#64748b" whiteSpace="nowrap" _selected={{ bg: "#eff6ff", color: "#4a72b8" }} _hover={{ bg: "#f8fafc" }}>
//                     {t.label}
//                     <Box as="span" ml={1.5} px={2} py={0.5} bg="rgba(0,0,0,.06)" borderRadius="full" fontSize="11px">{t.count}</Box>
//                   </Tab>
//                 ))}
//               </Flex>
//             </Box>
//             <TabPanels>
//               {TABS.map((t) => (
//                 <TabPanel key={t.label} px={{ base: 3, md: 6 }} py={5}>
//                   {t.indices.length === 0 ? (
//                     <Box textAlign="center" py={16}>
//                       <Icon as={FaChartBar} fontSize="40px" color="#e2e8f0" display="block" mx="auto" mb={3} />
//                       <Text fontSize="14px" color="#94a3b8">No questions in this category</Text>
//                     </Box>
//                   ) : (
//                     t.indices.map((idx) => (
//                       <QuestionCard
//                         key={idx} index={idx} question={questions[idx]}
//                         allAnswers={allAnswers} correctQus={correctQus} wrongansqus={wrongansqus}
//                         answeredQuestion={answeredQuestion} notAnswer={notAnswer}
//                         markedAndAnswer={markedAndAnswer} markedNotAnswer={markedNotAnswer}
//                         questionTimes={questionTimes}
//                         isOwnerView={isOwnerView}
//                       />
//                     ))
//                   )}
//                 </TabPanel>
//               ))}
//             </TabPanels>
//           </Tabs>
//         </Box>

//         {/* ── Bottom actions ─────────────────────────────────────────────────── */}
//         <Flex justify="center" gap={4} mt={6} flexWrap="wrap">
//           {isOwnerView ? (
//             <Box as="button" px={6} py={3} bg="#0f1e3a" color="white" borderRadius="12px"
//               fontWeight={700} fontSize="13px"
//               onClick={() => backUrl ? navigate(backUrl) : navigate(-1)}
//               _hover={{ opacity: .9 }} transition="opacity .2s">
//               ← Back to Leaderboard
//             </Box>
//           ) : (
//             <>
//               <Box as="button" px={6} py={3} bg="#0f1e3a" color="white" borderRadius="12px" fontWeight={700} fontSize="13px" onClick={() => navigate("/coaching")} _hover={{ opacity: .9 }} transition="opacity .2s">Browse More Tests</Box>
//               <Box as="button" px={6} py={3} bg="white" color="#4a72b8" border="1.5px solid #4a72b8" borderRadius="12px" fontWeight={700} fontSize="13px" onClick={() => navigate("/UserTestData")} _hover={{ bg: "#eff6ff" }} transition="all .2s">My Results</Box>
//             </>
//           )}
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
  Badge,
  Progress,
  Icon,
  Grid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaTrophy,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
  FaCircle,
  FaChartBar,
  FaStopwatch,
  FaShieldAlt,
  FaUser,
  FaRedoAlt,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaLayerGroup,
} from "react-icons/fa";
import { FiAlertCircle, FiTarget, FiAward } from "react-icons/fi";
import { apiFetch } from "../services/api";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
);

const fmtTime = (s) => {
  if (!s && s !== 0) return "—";
  const h = Math.floor(s / 3600),
    m = Math.floor((s % 3600) / 60),
    sec = s % 60;
  if (h > 0) return `${h}h ${m}m ${sec}s`;
  if (m > 0) return `${m}m ${sec}s`;
  return `${sec}s`;
};
const fmtQTime = (s) => {
  if (!s && s !== 0) return null;
  if (s === 0) return "< 1s";
  const m = Math.floor(s / 60),
    sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};
const pctColor = (p) => (p >= 70 ? "#16a34a" : p >= 40 ? "#d97706" : "#ef4444");
const pctBg = (p) => (p >= 70 ? "#f0fdf4" : p >= 40 ? "#fffbeb" : "#fef2f2");
const pctLabel = (p) =>
  p >= 80
    ? "Excellent 🌟"
    : p >= 60
      ? "Good 👍"
      : p >= 40
        ? "Average 📈"
        : "Needs Work 💪";

// ── Section score card ────────────────────────────────────────────────────────
function SectionScoreCard({ section, index }) {
  const pct = section.percentage ?? 0;
  return (
    <Box
      bg="white"
      borderRadius="14px"
      border="1.5px solid #e2e8f0"
      boxShadow="0 2px 8px rgba(0,0,0,.04)"
      p={4}
      overflow="hidden"
    >
      <Box h="3px" bg={pctBg(pct)} mb={3}>
        <Box
          h="100%"
          w={`${pct}%`}
          bg={pctColor(pct)}
          borderRadius="full"
          style={{ transition: "width 1s ease" }}
        />
      </Box>
      <Flex align="center" gap={2} mb={2}>
        <Flex
          w="22px"
          h="22px"
          bg="#eff6ff"
          borderRadius="6px"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Text fontSize="10px" fontWeight={900} color="#2563eb">
            {index + 1}
          </Text>
        </Flex>
        <Text
          fontSize="13px"
          fontWeight={800}
          color="#0f172a"
          textTransform="capitalize"
          noOfLines={1}
        >
          {section.name || section.subject}
        </Text>
      </Flex>
      <Flex align="baseline" gap={2} mb={1}>
        <Text
          fontSize="28px"
          fontWeight={900}
          color={pctColor(pct)}
          lineHeight={1}
        >
          {pct}%
        </Text>
        <Text fontSize="12px" color="#64748b">
          {section.score}/{section.total} correct
        </Text>
      </Flex>
      <Badge
        px={2}
        py={0.5}
        borderRadius="full"
        fontSize="10px"
        fontWeight={700}
        bg={pctBg(pct)}
        color={pctColor(pct)}
      >
        {pctLabel(pct)}
      </Badge>
    </Box>
  );
}

// ── QuestionCard ──────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  index,
  allAnswers,
  correctQus,
  wrongansqus,
  markedAndAnswer,
  markedNotAnswer,
  notAnswer,
  answeredQuestion,
  questionTimes,
  isOwnerView,
  sectionLabel,
}) {
  if (!question) return null;

  const getStatus = () => {
    if (correctQus.includes(index)) return "correct";
    if (wrongansqus.includes(index)) return "incorrect";
    if (markedAndAnswer.includes(index)) return "markedAnswered";
    if (markedNotAnswer.includes(index)) return "markedSkipped";
    if (notAnswer.includes(index)) return "skipped";
    if (answeredQuestion.includes(index)) return "answered";
    return "notVisited";
  };

  const STATUS = {
    correct: {
      label: "Correct",
      color: "#16a34a",
      bg: "#f0fdf4",
      border: "#bbf7d0",
      icon: FaCheckCircle,
    },
    incorrect: {
      label: "Incorrect",
      color: "#ef4444",
      bg: "#fef2f2",
      border: "#fecaca",
      icon: FaTimesCircle,
    },
    markedAnswered: {
      label: "Marked & Answered",
      color: "#7c3aed",
      bg: "#f5f3ff",
      border: "#ddd6fe",
      icon: FaFlag,
    },
    markedSkipped: {
      label: "Marked (Skipped)",
      color: "#d97706",
      bg: "#fffbeb",
      border: "#fde68a",
      icon: FaFlag,
    },
    skipped: {
      label: "Not Attempted",
      color: "#64748b",
      bg: "#f8fafc",
      border: "#e2e8f0",
      icon: FaCircle,
    },
    answered: {
      label: "Answered",
      color: "#2563eb",
      bg: "#eff6ff",
      border: "#bfdbfe",
      icon: FaCheckCircle,
    },
    notVisited: {
      label: "Not Visited",
      color: "#94a3b8",
      bg: "#f8fafc",
      border: "#e2e8f0",
      icon: FaCircle,
    },
  };

  const status = getStatus();
  const cfg = STATUS[status];
  const userAnswerIdx = allAnswers[index] ?? allAnswers[String(index)];
  const userAnswerText =
    userAnswerIdx !== undefined && userAnswerIdx !== null
      ? question.options?.[userAnswerIdx]
      : null;
  const correctIdx =
    typeof question.answer === "number" ? question.answer : question.answer - 1;
  const correctText = question.options?.[correctIdx];
  const timeTaken =
    questionTimes?.[index] ?? questionTimes?.[String(index)] ?? null;
  const timeStr = fmtQTime(timeTaken);
  const answerLabel = isOwnerView ? "Student's Answer" : "Your Answer";

  return (
    <Box
      bg="white"
      borderRadius="14px"
      border="1.5px solid"
      borderColor={cfg.border}
      overflow="hidden"
      mb={3}
      boxShadow="0 2px 8px rgba(0,0,0,.04)"
    >
      <Flex
        align="center"
        justify="space-between"
        px={5}
        py={3}
        borderBottom="1px solid"
        borderColor={cfg.border}
        bg={cfg.bg}
      >
        <Flex align="center" gap={3}>
          <Flex
            w="28px"
            h="28px"
            bg="white"
            borderRadius="full"
            align="center"
            justify="center"
            border="1.5px solid"
            borderColor={cfg.border}
          >
            <Text fontSize="12px" fontWeight={800} color={cfg.color}>
              {index + 1}
            </Text>
          </Flex>
          <Badge
            px={3}
            py={1}
            borderRadius="full"
            fontSize="11px"
            fontWeight={700}
            bg="white"
            color={cfg.color}
            border="1px solid"
            borderColor={cfg.border}
          >
            <Flex align="center" gap={1.5}>
              <Icon as={cfg.icon} fontSize="11px" />
              {cfg.label}
            </Flex>
          </Badge>
          {sectionLabel && (
            <Flex
              align="center"
              gap={1}
              bg="#eff6ff"
              color="#1e40af"
              px={2}
              py="2px"
              borderRadius="full"
              fontSize="10px"
              fontWeight={700}
            >
              <Icon as={FaLayerGroup} fontSize="9px" />
              {sectionLabel}
            </Flex>
          )}
        </Flex>
        <Flex align="center" gap={2}>
          {timeStr && (
            <Flex
              align="center"
              gap={1.5}
              bg="white"
              px={3}
              py="4px"
              borderRadius="full"
              border="1px solid #e2e8f0"
            >
              <Icon as={FaStopwatch} fontSize="10px" color="#64748b" />
              <Text fontSize="11px" fontWeight={700} color="#374151">
                {timeStr}
              </Text>
            </Flex>
          )}
          {status === "correct" && (
            <Badge
              bg="#f0fdf4"
              color="#16a34a"
              border="1px solid #bbf7d0"
              fontSize="11px"
              fontWeight={700}
              px={3}
              py={1}
              borderRadius="full"
            >
              +1 pt
            </Badge>
          )}
        </Flex>
      </Flex>
      <Box px={5} py={4}>
        <Text
          fontSize="14px"
          fontWeight={600}
          color="#1e293b"
          mb={4}
          lineHeight="1.7"
        >
          {question.qus}
        </Text>
        <VStack spacing={2} align="stretch" mb={4}>
          {question.options?.map((opt, i) => {
            const isCorrect = i === correctIdx;
            const isUserPick = userAnswerIdx === i;
            const isWrongPick = isUserPick && !isCorrect;
            return (
              <Flex
                key={i}
                align="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="10px"
                border="1.5px solid"
                borderColor={
                  isCorrect ? "#86efac" : isWrongPick ? "#fca5a5" : "#e2e8f0"
                }
                bg={isCorrect ? "#f0fdf4" : isWrongPick ? "#fef2f2" : "white"}
              >
                <Flex
                  w="26px"
                  h="26px"
                  borderRadius="full"
                  flexShrink={0}
                  align="center"
                  justify="center"
                  fontWeight={800}
                  fontSize="11px"
                  bg={
                    isCorrect ? "#16a34a" : isWrongPick ? "#ef4444" : "#f1f5f9"
                  }
                  color={isCorrect || isWrongPick ? "white" : "#64748b"}
                >
                  {String.fromCharCode(65 + i)}
                </Flex>
                <Text
                  flex={1}
                  fontSize="13px"
                  color="#374151"
                  fontWeight={isCorrect || isUserPick ? 600 : 400}
                >
                  {opt}
                </Text>
                <Flex gap={1.5} flexShrink={0}>
                  {isCorrect && (
                    <Badge
                      bg="#f0fdf4"
                      color="#16a34a"
                      fontSize="10px"
                      fontWeight={700}
                      border="1px solid #bbf7d0"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                    >
                      ✓ Correct Answer
                    </Badge>
                  )}
                  {isUserPick && isCorrect && (
                    <Badge
                      bg="#eff6ff"
                      color="#2563eb"
                      fontSize="10px"
                      fontWeight={700}
                      border="1px solid #bfdbfe"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                    >
                      {answerLabel}
                    </Badge>
                  )}
                  {isWrongPick && (
                    <Badge
                      bg="#fef2f2"
                      color="#ef4444"
                      fontSize="10px"
                      fontWeight={700}
                      border="1px solid #fecaca"
                      px={2}
                      py={0.5}
                      borderRadius="full"
                    >
                      ✗ {answerLabel}
                    </Badge>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </VStack>
        <Flex gap={6} mb={question.explanation ? 3 : 0} flexWrap="wrap">
          <Box>
            <Text
              fontSize="11px"
              color="#94a3b8"
              fontWeight={600}
              textTransform="uppercase"
              mb={1}
            >
              {answerLabel}
            </Text>
            <Text
              fontSize="13px"
              fontWeight={700}
              color={
                status === "correct"
                  ? "#16a34a"
                  : status === "incorrect"
                    ? "#ef4444"
                    : "#94a3b8"
              }
            >
              {userAnswerText || "Not Attempted"}
            </Text>
          </Box>
          <Box>
            <Text
              fontSize="11px"
              color="#94a3b8"
              fontWeight={600}
              textTransform="uppercase"
              mb={1}
            >
              Correct Answer
            </Text>
            <Text fontSize="13px" fontWeight={700} color="#16a34a">
              {correctText || "—"}
            </Text>
          </Box>
        </Flex>
        {question.explanation && (
          <Box
            mt={3}
            p={4}
            bg="#eff6ff"
            borderRadius="10px"
            borderLeft="3px solid #4a72b8"
          >
            <Flex align="center" gap={2} mb={1.5}>
              <Icon as={FiAlertCircle} color="#4a72b8" fontSize="14px" />
              <Text
                fontSize="11px"
                fontWeight={700}
                color="#1e3a5f"
                textTransform="uppercase"
              >
                Explanation
              </Text>
            </Flex>
            <Text fontSize="13px" color="#1e3a5f" lineHeight="1.7">
              {question.explanation}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

function StatBox({ label, value, sub, color, bg, border, icon }) {
  return (
    <Box
      bg={bg}
      border="1.5px solid"
      borderColor={border}
      borderRadius="14px"
      p={4}
    >
      <Flex align="center" gap={2} mb={2}>
        <Icon as={icon} color={color} fontSize="14px" />
        <Text
          fontSize="11px"
          fontWeight={700}
          color={color}
          textTransform="uppercase"
        >
          {label}
        </Text>
      </Flex>
      <Text fontSize="26px" fontWeight={900} color={color} lineHeight={1}>
        {value}
      </Text>
      {sub && (
        <Text fontSize="11px" color={color} opacity={0.7} mt={1}>
          {sub}
        </Text>
      )}
    </Box>
  );
}

function AllAttemptsPanel({
  allAttempts,
  currentResultId,
  questions,
  navigate,
  testTitle,
  studentName,
  studentId,
  testId,
  backUrl,
}) {
  const [loadingId, setLoadingId] = useState(null);
  const attempts = allAttempts || [];
  if (attempts.length <= 1) return null;
  const attemptLabel = (idx) => (idx === 0 ? "1st Attempt" : `Retake ${idx}`);

  const handleSelectAttempt = async (attempt) => {
    if (String(attempt._id) === String(currentResultId)) return;
    setLoadingId(attempt._id);
    try {
      const res = await apiFetch(`/results/${attempt._id}`);
      const r = res.data || res;
      const toArr = (v) => (Array.isArray(v) ? v : []);
      const originalQs = Array.isArray(r.testId?.questions)
        ? r.testId.questions
        : Array.isArray(questions)
          ? questions
          : [];
      const shuffledQs =
        Array.isArray(r.shuffledQuestions) && r.shuffledQuestions.length > 0
          ? r.shuffledQuestions
          : [];
      navigate("/test-result", {
        replace: true,
        state: {
          viewingAs: "owner",
          studentName,
          studentId,
          testId,
          testTitle,
          backUrl,
          allAttempts,
          currentAttemptId: String(attempt._id),
          resultId: String(attempt._id),
          isSectioned: r.testId?.isSectioned || false,
          sectionScores: toArr(r.sectionScores),
          score:
            r.correct ??
            (Array.isArray(r.correctQus) ? r.correctQus.length : 0) ??
            0,
          totalQuestions: originalQs.length || r.totalQuestions || 0,
          scorePercentage: r.scorePercentage ?? r.percentage ?? 0,
          percentile: r.percentile ?? null,
          timeTaken: r.timeTakenSec ?? r.timeTaken ?? 0,
          shuffledQuestions: shuffledQs,
          questions: originalQs,
          allAnswers:
            r.allAnswers && typeof r.allAnswers === "object"
              ? r.allAnswers
              : {},
          questionTimes:
            r.questionTimes && typeof r.questionTimes === "object"
              ? r.questionTimes
              : {},
          correctQus: toArr(r.correctQus),
          wrongansqus: toArr(r.wrongansqus).length
            ? toArr(r.wrongansqus)
            : toArr(r.wrongQus),
          answeredQuestion: toArr(r.answeredQuestion).length
            ? toArr(r.answeredQuestion)
            : toArr(r.answeredQus).length
              ? toArr(r.answeredQus)
              : toArr(r.answered),
          notAnswer: toArr(r.notAnswer).length
            ? toArr(r.notAnswer)
            : toArr(r.notAnsweredQus).length
              ? toArr(r.notAnsweredQus)
              : toArr(r.skipped),
          markedAndAnswer: toArr(r.markedAndAnswer).length
            ? toArr(r.markedAndAnswer)
            : toArr(r.markedAndAnswered),
          markedNotAnswer: toArr(r.markedNotAnswer).length
            ? toArr(r.markedNotAnswer)
            : toArr(r.markedNotAnswered),
        },
      });
    } catch {
      /* stay */
    } finally {
      setLoadingId(null);
    }
  };

  const currentIdx = attempts.findIndex(
    (a) => String(a._id) === String(currentResultId),
  );

  return (
    <Box
      bg="white"
      borderRadius="16px"
      border="1px solid #e2e8f0"
      boxShadow="0 2px 12px rgba(0,0,0,.05)"
      overflow="hidden"
      mb={5}
    >
      <Flex
        px={5}
        py={4}
        align="center"
        gap={3}
        borderBottom="1px solid #f1f5f9"
        bg="linear-gradient(90deg,#fafbff,#fff)"
        flexWrap="wrap"
      >
        <Flex
          w="36px"
          h="36px"
          bg="#f0f7ff"
          borderRadius="10px"
          align="center"
          justify="center"
          flexShrink={0}
          border="1px solid #dbeafe"
        >
          <Icon as={FaRedoAlt} color="#2563eb" fontSize="13px" />
        </Flex>
        <Box>
          <Text
            fontSize="14px"
            fontWeight={800}
            color="#0f172a"
            lineHeight="1.2"
          >
            Attempt History
          </Text>
          <Text fontSize="11px" color="#94a3b8" mt="2px">
            {attempts.length} attempt{attempts.length !== 1 ? "s" : ""} total
            {currentIdx >= 0 && (
              <Text as="span" color="#2563eb" fontWeight={600}>
                {" "}
                · Viewing {attemptLabel(currentIdx)}
              </Text>
            )}
          </Text>
        </Box>
        <Flex
          ml="auto"
          align="center"
          gap={1.5}
          bg="#fefce8"
          border="1px solid #fde68a"
          px={3}
          py="4px"
          borderRadius="full"
          flexShrink={0}
        >
          <Icon as={FaTrophy} fontSize="9px" color="#92400e" />
          <Text fontSize="11px" fontWeight={700} color="#92400e">
            1st Attempt counts in leaderboard
          </Text>
        </Flex>
      </Flex>

      {attempts.map((attempt, idx) => {
        const pct = attempt.scorePercentage ?? 0;
        const isCurrent = String(attempt._id) === String(currentResultId);
        const isFirst = idx === 0;
        const isLoading = String(loadingId) === String(attempt._id);
        const label = attemptLabel(idx);
        const date = attempt.createdAt
          ? new Date(attempt.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : null;
        const time = attempt.createdAt
          ? new Date(attempt.createdAt).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null;
        const rowBg = isCurrent ? "#eff6ff" : "white";
        const accentColor = isFirst ? "#d97706" : "#7c3aed";
        const accentBg = isFirst ? "#fefce8" : "#f5f3ff";
        const accentBorder = isFirst ? "#fde68a" : "#ddd6fe";
        const borderLeft = isCurrent
          ? `3px solid ${isFirst ? "#d97706" : "#2563eb"}`
          : "3px solid transparent";

        return (
          <Flex
            key={attempt._id}
            px={5}
            py={{ base: 3, sm: 4 }}
            align="center"
            gap={4}
            borderBottom={
              idx < attempts.length - 1 ? "1px solid #f8fafc" : "none"
            }
            bg={rowBg}
            borderLeft={borderLeft}
            cursor={isCurrent ? "default" : "pointer"}
            _hover={!isCurrent ? { bg: "#f8faff" } : {}}
            transition="background .15s"
            onClick={() =>
              !isCurrent && !isLoading && handleSelectAttempt(attempt)
            }
            opacity={isLoading ? 0.65 : 1}
            flexWrap={{ base: "wrap", sm: "nowrap" }}
          >
            <Flex
              align="center"
              gap={2}
              flexShrink={0}
              bg={isCurrent ? (isFirst ? "#fef3c7" : "#eff6ff") : accentBg}
              border="1px solid"
              borderColor={
                isCurrent ? (isFirst ? "#fbbf24" : "#bfdbfe") : accentBorder
              }
              px={3}
              py="5px"
              borderRadius="full"
              minW="110px"
              justify="center"
            >
              {isFirst ? (
                <Icon
                  as={FaTrophy}
                  fontSize="10px"
                  color={isCurrent ? "#d97706" : "#92400e"}
                />
              ) : (
                <Icon
                  as={FaRedoAlt}
                  fontSize="10px"
                  color={isCurrent ? "#2563eb" : "#7c3aed"}
                />
              )}
              <Text
                fontSize="11px"
                fontWeight={800}
                whiteSpace="nowrap"
                color={
                  isCurrent ? (isFirst ? "#92400e" : "#1d4ed8") : accentColor
                }
              >
                {label}
              </Text>
            </Flex>
            <Box minW="52px" flexShrink={0}>
              <Text
                fontSize="17px"
                fontWeight={800}
                color={pctColor(pct)}
                lineHeight="1"
              >
                {pct.toFixed(0)}%
              </Text>
              <Text fontSize="10px" color="#94a3b8" mt="1px">
                {attempt.correct ?? 0}/{attempt.totalQuestions ?? "—"} correct
              </Text>
            </Box>
            <Box flex={1} minW={0}>
              <Progress
                value={pct}
                size="xs"
                colorScheme={pct >= 60 ? "green" : pct >= 40 ? "yellow" : "red"}
                borderRadius="full"
              />
            </Box>
            {date && (
              <Flex
                align="center"
                gap={1.5}
                flexShrink={0}
                display={{ base: "none", sm: "flex" }}
              >
                <Icon as={FaCalendarAlt} fontSize="10px" color="#94a3b8" />
                <Text fontSize="11px" color="#64748b">
                  {date}
                </Text>
                <Text fontSize="11px" color="#94a3b8">
                  {time}
                </Text>
              </Flex>
            )}
            <Flex
              align="center"
              gap={1.5}
              flexShrink={0}
              display={{ base: "none", md: "flex" }}
            >
              <Icon as={FaClock} fontSize="10px" color="#94a3b8" />
              <Text fontSize="11px" color="#64748b">
                {fmtTime(attempt.timeTakenSec ?? 0)}
              </Text>
            </Flex>
            <Flex gap={2} flexShrink={0} align="center">
              {isCurrent && (
                <Badge
                  bg={isFirst ? "#fef3c7" : "#eff6ff"}
                  color={isFirst ? "#92400e" : "#1d4ed8"}
                  border="1px solid"
                  borderColor={isFirst ? "#fbbf24" : "#bfdbfe"}
                  fontSize="9px"
                  fontWeight={800}
                  px={2}
                  py={0.5}
                  borderRadius="full"
                >
                  Viewing
                </Badge>
              )}
              {isLoading ? (
                <Spinner size="xs" color="#4a72b8" />
              ) : !isCurrent ? (
                <Icon as={FaExternalLinkAlt} fontSize="10px" color="#94a3b8" />
              ) : null}
            </Flex>
          </Flex>
        );
      })}
    </Box>
  );
}

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const s = location.state || {};

  const isOwnerView = s.viewingAs === "owner";
  const studentName = s.studentName || null;
  const studentId = s.studentId || null;
  const testId = s.testId || null;
  const currentResultId = s.currentAttemptId || s.resultId || null;
  const backUrl = s.backUrl || null;
  const allAttempts = Array.isArray(s.allAttempts) ? s.allAttempts : [];

  // Sectioned data
  const isSectioned = s.isSectioned === true;
  const sectionScores = Array.isArray(s.sectionScores) ? s.sectionScores : [];
  const sectionMeta = Array.isArray(s.sectionMeta) ? s.sectionMeta : [];

  const testTitle = s.testTitle || s.category || s.subject || "Test";
  const score = s.score ?? 0;
  const totalQuestions = s.totalQuestions ?? 0;
  const scorePercentage =
    s.scorePercentage ??
    (totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0);
  const percentile = s.percentile ?? null;
  const timeTaken = s.timeTaken ?? 0;

  const questions =
    Array.isArray(s.shuffledQuestions) && s.shuffledQuestions.length > 0
      ? s.shuffledQuestions
      : Array.isArray(s.questions)
        ? s.questions
        : [];

  const allAnswers =
    s.allAnswers && typeof s.allAnswers === "object" ? s.allAnswers : {};
  const questionTimes =
    s.questionTimes && typeof s.questionTimes === "object"
      ? s.questionTimes
      : {};
  const correctQus = Array.isArray(s.correctQus) ? s.correctQus : [];
  const wrongansqus = Array.isArray(s.wrongansqus) ? s.wrongansqus : [];
  const answeredQuestion = Array.isArray(s.answeredQuestion)
    ? s.answeredQuestion
    : [];
  const notAnswer = Array.isArray(s.notAnswer) ? s.notAnswer : [];
  const markedAndAnswer = Array.isArray(s.markedAndAnswer)
    ? s.markedAndAnswer
    : [];
  const markedNotAnswer = Array.isArray(s.markedNotAnswer)
    ? s.markedNotAnswer
    : [];

  const correctCount = correctQus.length;
  const wrongCount = wrongansqus.length;
  const skippedCount = notAnswer.length;
  const markedCount = markedAndAnswer.length + markedNotAnswer.length;
  const accuracy =
    totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
  const pct = Math.round(scorePercentage);
  const allIndices = questions.map((_, i) => i);
  const markedAll = [...markedAndAnswer, ...markedNotAnswer];

  // Build a flat section label map: questionIndex → sectionName
  const sectionLabelMap = React.useMemo(() => {
    if (!isSectioned || !sectionMeta.length) return {};
    const map = {};
    let offset = 0;
    sectionMeta.forEach((sec) => {
      const count = sec.count || 0;
      for (let i = 0; i < count; i++) {
        map[offset + i] = sec.name || sec.subject || "";
      }
      offset += count;
    });
    return map;
  }, [isSectioned, sectionMeta]);

  const donut = {
    labels: ["Correct", "Wrong", "Skipped"],
    datasets: [
      {
        data: [correctCount, wrongCount, skippedCount],
        backgroundColor: ["#4ade80", "#f87171", "#cbd5e1"],
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };
  const donutOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { padding: 10 } },
  };

  const TABS = [
    { label: "All", count: totalQuestions, indices: allIndices },
    { label: "Correct", count: correctCount, indices: correctQus },
    { label: "Wrong", count: wrongCount, indices: wrongansqus },
    { label: "Skipped", count: skippedCount, indices: notAnswer },
    { label: "Marked", count: markedCount, indices: markedAll },
    {
      label: "Answered",
      count: answeredQuestion.length,
      indices: answeredQuestion,
    },
  ];

  if (!s.score && !s.questions) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        direction="column"
        gap={4}
        bg="#f8fafc"
        fontFamily="'Sora',sans-serif"
      >
        <Icon as={FaChartBar} fontSize="48px" color="#e2e8f0" />
        <Text fontSize="16px" fontWeight={700} color="#374151">
          No result data found
        </Text>
        <Text fontSize="13px" color="#94a3b8" mb={2}>
          Please take a test first
        </Text>
        <Box
          as="button"
          px={6}
          py={3}
          bg="#4a72b8"
          color="white"
          borderRadius="10px"
          fontWeight={700}
          fontSize="14px"
          onClick={() => navigate("/coaching")}
        >
          Browse Tests
        </Box>
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg="#f1f5f9" fontFamily="'Sora',sans-serif">
      {isOwnerView && (
        <Box bg="#1e3a5f" px={{ base: 4, md: 8 }} py={3}>
          <Flex maxW="1200px" mx="auto" align="center" gap={3} flexWrap="wrap">
            <Flex
              align="center"
              gap={2}
              bg="rgba(255,215,0,.15)"
              border="1px solid rgba(255,215,0,.3)"
              px={3}
              py="5px"
              borderRadius="full"
              flexShrink={0}
            >
              <Icon as={FaShieldAlt} color="gold" fontSize="11px" />
              <Text fontSize="11px" fontWeight={700} color="gold">
                Owner View
              </Text>
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
            <Box
              ml="auto"
              cursor="pointer"
              onClick={() => (backUrl ? navigate(backUrl) : navigate(-1))}
              color="rgba(255,255,255,.45)"
              _hover={{ color: "white" }}
              transition="color .15s"
            >
              <Flex align="center" gap={1.5}>
                <Icon as={FaArrowLeft} fontSize="11px" />
                <Text fontSize="12px" fontWeight={600}>
                  Back to Leaderboard
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Box>
      )}

      <Box
        bg="linear-gradient(135deg,#0f1e3a,#1e3a5f,#2d5fa8)"
        px={{ base: 4, md: 8 }}
        py={5}
      >
        <Flex maxW="1200px" mx="auto" align="center" justify="space-between">
          <Flex align="center" gap={3}>
            <Box
              cursor="pointer"
              onClick={() =>
                isOwnerView
                  ? backUrl
                    ? navigate(backUrl)
                    : navigate(-1)
                  : navigate("/")
              }
              color="rgba(255,255,255,.5)"
              _hover={{ color: "white" }}
            >
              <Icon as={FaArrowLeft} fontSize="14px" />
            </Box>
            <Box>
              <Flex align="center" gap={2}>
                <Text
                  fontSize={{ base: "15px", md: "18px" }}
                  fontWeight={800}
                  color="white"
                  noOfLines={1}
                >
                  {testTitle}
                </Text>
                {isSectioned && (
                  <Flex
                    align="center"
                    gap={1}
                    bg="rgba(56,189,248,.2)"
                    color="#38bdf8"
                    px={2}
                    py="2px"
                    borderRadius="full"
                    fontSize="10px"
                    fontWeight={700}
                    flexShrink={0}
                  >
                    <Icon as={FaLayerGroup} fontSize="9px" />
                    {sectionScores.length}s
                  </Flex>
                )}
              </Flex>
              <Text fontSize="12px" color="rgba(255,255,255,.5)">
                {isOwnerView
                  ? `${studentName || "Student"}'s Result`
                  : "Test Result"}
              </Text>
            </Box>
          </Flex>
          {!isOwnerView && (
            <Box
              px={4}
              py={2}
              bg="rgba(255,255,255,.1)"
              borderRadius="10px"
              border="1px solid rgba(255,255,255,.15)"
              cursor="pointer"
              onClick={() =>
                navigate("/Review-Test", {
                  state: {
                    testTitle,
                    questions,
                    allAnswers,
                    questionTimes,
                    correctQus,
                    wrongansqus,
                    answeredQuestion,
                    notAnswer,
                    markedAndAnswer,
                    markedNotAnswer,
                    score,
                    totalQuestions,
                    scorePercentage,
                    timeTaken,
                    isSectioned,
                    sectionMeta,
                  },
                })
              }
              _hover={{ bg: "rgba(255,255,255,.15)" }}
            >
              <Text fontSize="12px" fontWeight={700} color="white">
                Review Test
              </Text>
            </Box>
          )}
        </Flex>
      </Box>

      <Box maxW="1200px" mx="auto" px={{ base: 3, md: 8 }} py={6}>
        {/* Score Hero */}
        <Box
          bg="white"
          borderRadius="20px"
          border="1px solid #e2e8f0"
          boxShadow="0 4px 24px rgba(0,0,0,.06)"
          overflow="hidden"
          mb={5}
        >
          <Box h="5px" bg={pctBg(pct)}>
            <Box
              h="100%"
              w={`${pct}%`}
              bg={pctColor(pct)}
              borderRadius="full"
              style={{ transition: "width 1s ease" }}
            />
          </Box>
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            px={{ base: 5, md: 8 }}
            py={{ base: 6, md: 8 }}
            gap={{ base: 6, md: 10 }}
          >
            <Box flexShrink={0} position="relative" w="160px" h="160px">
              <Doughnut data={donut} options={donutOpts} />
              <Flex
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%,-50%)"
                direction="column"
                align="center"
              >
                <Text
                  fontSize="28px"
                  fontWeight={900}
                  color={pctColor(pct)}
                  lineHeight={1}
                >
                  {pct}%
                </Text>
                <Text fontSize="11px" color="#94a3b8" fontWeight={600} mt={0.5}>
                  Score
                </Text>
              </Flex>
            </Box>
            <Box flex={1} w="100%">
              <Flex align="center" gap={3} mb={1} flexWrap="wrap">
                <Text
                  fontSize={{ base: "22px", md: "28px" }}
                  fontWeight={900}
                  color="#0f172a"
                >
                  {score} / {totalQuestions}
                </Text>
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="12px"
                  fontWeight={700}
                  bg={pctBg(pct)}
                  color={pctColor(pct)}
                >
                  {pctLabel(pct)}
                </Badge>
              </Flex>
              {percentile !== null && (
                <Flex align="center" gap={2} mb={4}>
                  <Flex
                    align="center"
                    gap={1.5}
                    px={3}
                    py={1.5}
                    bg="#fefce8"
                    border="1px solid #fde68a"
                    borderRadius="10px"
                  >
                    <Icon as={FaTrophy} color="#d97706" fontSize="13px" />
                    <Text fontSize="13px" fontWeight={700} color="#92400e">
                      Percentile:{" "}
                      {typeof percentile === "number"
                        ? `${percentile.toFixed(1)}%`
                        : percentile}
                    </Text>
                  </Flex>
                  <Text fontSize="12px" color="#94a3b8">
                    Better than{" "}
                    {typeof percentile === "number"
                      ? `${percentile.toFixed(0)}%`
                      : percentile}
                    % of all students
                  </Text>
                </Flex>
              )}
              <Grid
                templateColumns={{ base: "repeat(2,1fr)", sm: "repeat(4,1fr)" }}
                gap={3}
              >
                {[
                  {
                    label: "Correct",
                    value: correctCount,
                    color: "#16a34a",
                    bg: "#f0fdf4",
                    border: "#bbf7d0",
                    icon: FaCheckCircle,
                  },
                  {
                    label: "Wrong",
                    value: wrongCount,
                    color: "#ef4444",
                    bg: "#fef2f2",
                    border: "#fecaca",
                    icon: FaTimesCircle,
                  },
                  {
                    label: "Skipped",
                    value: skippedCount,
                    color: "#64748b",
                    bg: "#f8fafc",
                    border: "#e2e8f0",
                    icon: FaCircle,
                  },
                  {
                    label: "Marked",
                    value: markedCount,
                    color: "#7c3aed",
                    bg: "#f5f3ff",
                    border: "#ddd6fe",
                    icon: FaFlag,
                  },
                ].map((st) => (
                  <StatBox key={st.label} {...st} />
                ))}
              </Grid>
            </Box>
          </Flex>
        </Box>

        {/* ── Section Scores (only for sectioned tests) ─────────────────────── */}
        {isSectioned && sectionScores.length > 0 && (
          <Box mb={5}>
            <Flex align="center" gap={2} mb={4}>
              <Icon as={FaLayerGroup} color="#2563eb" fontSize="16px" />
              <Text fontSize="16px" fontWeight={800} color="#0f172a">
                Section Breakdown
              </Text>
            </Flex>
            <Grid
              templateColumns={{
                base: "1fr",
                sm: "repeat(2,1fr)",
                md: "repeat(3,1fr)",
              }}
              gap={4}
            >
              {sectionScores.map((sec, i) => (
                <SectionScoreCard key={i} section={sec} index={i} />
              ))}
            </Grid>
          </Box>
        )}

        {/* Details row */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3,1fr)" }}
          gap={4}
          mb={5}
        >
          <Box
            bg="white"
            borderRadius="16px"
            border="1px solid #e2e8f0"
            boxShadow="0 2px 12px rgba(0,0,0,.04)"
            p={5}
          >
            <Flex align="center" gap={2} mb={4}>
              <Flex
                w="36px"
                h="36px"
                bg="#eff6ff"
                borderRadius="10px"
                align="center"
                justify="center"
              >
                <Icon as={FaClock} color="#4a72b8" fontSize="16px" />
              </Flex>
              <Text fontSize="14px" fontWeight={800} color="#0f172a">
                Time Details
              </Text>
            </Flex>
            <VStack align="stretch" spacing={3}>
              <Flex justify="space-between">
                <Text fontSize="13px" color="#64748b">
                  Time Taken
                </Text>
                <Text fontSize="13px" fontWeight={700} color="#374151">
                  {fmtTime(timeTaken)}
                </Text>
              </Flex>
              {totalQuestions > 0 && timeTaken > 0 && (
                <Flex justify="space-between">
                  <Text fontSize="13px" color="#64748b">
                    Per Question (avg)
                  </Text>
                  <Text fontSize="13px" fontWeight={700} color="#374151">
                    {fmtTime(Math.round(timeTaken / totalQuestions))}
                  </Text>
                </Flex>
              )}
              <Flex justify="space-between">
                <Text fontSize="13px" color="#64748b">
                  Total Questions
                </Text>
                <Text fontSize="13px" fontWeight={700} color="#374151">
                  {totalQuestions}
                </Text>
              </Flex>
            </VStack>
          </Box>

          <Box
            bg="white"
            borderRadius="16px"
            border="1px solid #e2e8f0"
            boxShadow="0 2px 12px rgba(0,0,0,.04)"
            p={5}
          >
            <Flex align="center" gap={2} mb={4}>
              <Flex
                w="36px"
                h="36px"
                bg="#f0fdf4"
                borderRadius="10px"
                align="center"
                justify="center"
              >
                <Icon as={FiTarget} color="#16a34a" fontSize="16px" />
              </Flex>
              <Text fontSize="14px" fontWeight={800} color="#0f172a">
                Accuracy
              </Text>
            </Flex>
            <Text
              fontSize="36px"
              fontWeight={900}
              color={pctColor(accuracy)}
              lineHeight={1}
              mb={2}
            >
              {accuracy.toFixed(1)}%
            </Text>
            <Box bg="#f1f5f9" borderRadius="full" h="8px" mb={3}>
              <Box
                h="100%"
                w={`${accuracy}%`}
                bg={pctColor(accuracy)}
                borderRadius="full"
                style={{ transition: "width 1s ease" }}
              />
            </Box>
            <VStack align="stretch" spacing={2}>
              <Flex justify="space-between">
                <Text fontSize="13px" color="#64748b">
                  Answered
                </Text>
                <Text fontSize="13px" fontWeight={700} color="#374151">
                  {answeredQuestion.length}
                </Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontSize="13px" color="#64748b">
                  Completion
                </Text>
                <Text fontSize="13px" fontWeight={700} color="#374151">
                  {totalQuestions > 0
                    ? Math.round(
                        (answeredQuestion.length / totalQuestions) * 100,
                      )
                    : 0}
                  %
                </Text>
              </Flex>
            </VStack>
          </Box>

          <Box
            bg="white"
            borderRadius="16px"
            border="1px solid #e2e8f0"
            boxShadow="0 2px 12px rgba(0,0,0,.04)"
            p={5}
          >
            <Flex align="center" gap={2} mb={4}>
              <Flex
                w="36px"
                h="36px"
                bg="#fefce8"
                borderRadius="10px"
                align="center"
                justify="center"
              >
                <Icon as={FiAward} color="#d97706" fontSize="16px" />
              </Flex>
              <Text fontSize="14px" fontWeight={800} color="#0f172a">
                Ranking
              </Text>
            </Flex>
            {percentile !== null ? (
              <>
                <Text
                  fontSize="36px"
                  fontWeight={900}
                  color="#d97706"
                  lineHeight={1}
                  mb={1}
                >
                  {typeof percentile === "number"
                    ? `${percentile.toFixed(1)}%`
                    : percentile}
                </Text>
                <Text fontSize="12px" color="#94a3b8" mb={3}>
                  Percentile Score
                </Text>
                <Box bg="#fef9c3" borderRadius="10px" px={3} py={2}>
                  <Text fontSize="12px" fontWeight={600} color="#92400e">
                    🏆 Better than{" "}
                    {typeof percentile === "number"
                      ? `${percentile.toFixed(0)}%`
                      : percentile}
                    % of all students
                  </Text>
                </Box>
              </>
            ) : (
              <>
                <Text fontSize="14px" color="#94a3b8" mb={3}>
                  Percentile available after more students attempt.
                </Text>
                <Box bg={pctBg(pct)} borderRadius="10px" px={3} py={2}>
                  <Text fontSize="12px" fontWeight={600} color={pctColor(pct)}>
                    Score: {pct}% — {pctLabel(pct)}
                  </Text>
                </Box>
              </>
            )}
          </Box>
        </Grid>

        {isOwnerView && allAttempts.length > 1 && (
          <AllAttemptsPanel
            allAttempts={allAttempts}
            currentResultId={currentResultId}
            questions={questions}
            navigate={navigate}
            testTitle={testTitle}
            studentName={studentName}
            studentId={studentId}
            testId={testId}
            backUrl={backUrl}
          />
        )}

        {/* Legend */}
        <Box
          bg="white"
          borderRadius="14px"
          border="1px solid #e2e8f0"
          boxShadow="0 2px 8px rgba(0,0,0,.04)"
          px={5}
          py={4}
          mb={5}
          mt={5}
        >
          <Text
            fontSize="12px"
            fontWeight={700}
            color="#64748b"
            textTransform="uppercase"
            letterSpacing=".8px"
            mb={3}
          >
            Question Status Legend
          </Text>
          <Flex gap={3} flexWrap="wrap">
            {[
              { label: "Correct", color: "#16a34a", bg: "#f0fdf4" },
              { label: "Incorrect", color: "#ef4444", bg: "#fef2f2" },
              { label: "Marked & Ans", color: "#7c3aed", bg: "#f5f3ff" },
              { label: "Marked (Skip)", color: "#d97706", bg: "#fffbeb" },
              { label: "Skipped", color: "#64748b", bg: "#f8fafc" },
              { label: "Answered", color: "#2563eb", bg: "#eff6ff" },
            ].map((l) => (
              <Flex
                key={l.label}
                align="center"
                gap={1.5}
                px={3}
                py={1.5}
                bg={l.bg}
                borderRadius="full"
              >
                <Box w="8px" h="8px" bg={l.color} borderRadius="full" />
                <Text fontSize="11px" fontWeight={600} color={l.color}>
                  {l.label}
                </Text>
              </Flex>
            ))}
          </Flex>
        </Box>

        {/* Question tabs */}
        <Box
          bg="white"
          borderRadius="20px"
          border="1px solid #e2e8f0"
          boxShadow="0 4px 24px rgba(0,0,0,.06)"
          overflow="hidden"
        >
          <Tabs colorScheme="blue" variant="unstyled">
            <Box
              px={{ base: 3, md: 6 }}
              pt={{ base: 4, md: 6 }}
              borderBottom="1px solid #f1f5f9"
            >
              <Flex
                gap={1}
                overflowX="auto"
                pb={3}
                css={{
                  "&::-webkit-scrollbar": { height: "3px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#cbd5e1",
                    borderRadius: "10px",
                  },
                }}
              >
                {TABS.map((t) => (
                  <Tab
                    key={t.label}
                    px={4}
                    py={2}
                    borderRadius="10px"
                    fontSize="12px"
                    fontWeight={700}
                    color="#64748b"
                    whiteSpace="nowrap"
                    _selected={{ bg: "#eff6ff", color: "#4a72b8" }}
                    _hover={{ bg: "#f8fafc" }}
                  >
                    {t.label}
                    <Box
                      as="span"
                      ml={1.5}
                      px={2}
                      py={0.5}
                      bg="rgba(0,0,0,.06)"
                      borderRadius="full"
                      fontSize="11px"
                    >
                      {t.count}
                    </Box>
                  </Tab>
                ))}
              </Flex>
            </Box>
            <TabPanels>
              {TABS.map((t) => (
                <TabPanel key={t.label} px={{ base: 3, md: 6 }} py={5}>
                  {t.indices.length === 0 ? (
                    <Box textAlign="center" py={16}>
                      <Icon
                        as={FaChartBar}
                        fontSize="40px"
                        color="#e2e8f0"
                        display="block"
                        mx="auto"
                        mb={3}
                      />
                      <Text fontSize="14px" color="#94a3b8">
                        No questions in this category
                      </Text>
                    </Box>
                  ) : (
                    t.indices.map((idx) => (
                      <QuestionCard
                        key={idx}
                        index={idx}
                        question={questions[idx]}
                        allAnswers={allAnswers}
                        correctQus={correctQus}
                        wrongansqus={wrongansqus}
                        answeredQuestion={answeredQuestion}
                        notAnswer={notAnswer}
                        markedAndAnswer={markedAndAnswer}
                        markedNotAnswer={markedNotAnswer}
                        questionTimes={questionTimes}
                        isOwnerView={isOwnerView}
                        sectionLabel={isSectioned ? sectionLabelMap[idx] : null}
                      />
                    ))
                  )}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>

        <Flex justify="center" gap={4} mt={6} flexWrap="wrap">
          {isOwnerView ? (
            <Box
              as="button"
              px={6}
              py={3}
              bg="#0f1e3a"
              color="white"
              borderRadius="12px"
              fontWeight={700}
              fontSize="13px"
              onClick={() => (backUrl ? navigate(backUrl) : navigate(-1))}
              _hover={{ opacity: 0.9 }}
              transition="opacity .2s"
            >
              ← Back to Leaderboard
            </Box>
          ) : (
            <>
              <Box
                as="button"
                px={6}
                py={3}
                bg="#0f1e3a"
                color="white"
                borderRadius="12px"
                fontWeight={700}
                fontSize="13px"
                onClick={() => navigate("/coaching")}
                _hover={{ opacity: 0.9 }}
                transition="opacity .2s"
              >
                Browse More Tests
              </Box>
              <Box
                as="button"
                px={6}
                py={3}
                bg="white"
                color="#4a72b8"
                border="1.5px solid #4a72b8"
                borderRadius="12px"
                fontWeight={700}
                fontSize="13px"
                onClick={() => navigate("/UserTestData")}
                _hover={{ bg: "#eff6ff" }}
                transition="all .2s"
              >
                My Results
              </Box>
            </>
          )}
        </Flex>
      </Box>
    </Box>
  );
}