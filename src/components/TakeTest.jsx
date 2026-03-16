// import React, { useEffect, useState, useRef } from "react";
// import {
//   Box,
//   Button,
//   Center,
//   Drawer,
//   DrawerBody,
//   DrawerCloseButton,
//   DrawerContent,
//   DrawerHeader,
//   DrawerOverlay,
//   Flex,
//   Grid,
//   Text,
//   useDisclosure,
//   useMediaQuery,
//   VStack,
//   HStack,
//   useToast,
//   AlertDialog,
//   AlertDialogBody,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogContent,
//   AlertDialogOverlay,
//   Badge,
//   Icon,
// } from "@chakra-ui/react";
// import ModalPause from "./ModalPause";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { resultsAPI } from "../services/api";
// import { socket } from "../services/socket";
// import ReportQuestionDropdown from "./ReportQuestionDropdown";
// import {
//   FaEraser,
//   FaChevronRight,
//   FaChevronLeft,
//   FaCheckCircle,
//   FaExclamationTriangle,
//   FaListUl,
//   FaExpand,
//   FaPaperPlane,
//   FaBookmark,
//   FaClock,
//   FaStopwatch,
// } from "react-icons/fa";

// const C = {
//   navy: "#0b1e3d",
//   navyMid: "#132952",
//   blue: "#2563eb",
//   teal: "#0d9488",
//   green: "#16a34a",
//   red: "#dc2626",
//   purple: "#7c3aed",
//   amber: "#d97706",
//   muted: "#64748b",
//   text: "#0f172a",
// };

// const getQStatus = (
//   i,
//   { answeredQuestion, markedAndAnswer, markedNotAnswer, notAnswer },
// ) => {
//   if (markedAndAnswer.includes(i)) return "markedAnswered";
//   if (markedNotAnswer.includes(i)) return "marked";
//   if (answeredQuestion.includes(i)) return "answered";
//   if (notAnswer.includes(i)) return "skipped";
//   return "unvisited";
// };

// const STATUS_STYLE = {
//   answered: {
//     bg: "#16a34a",
//     color: "white",
//     radius: "10px 10px 3px 3px",
//     label: "Answered",
//   },
//   skipped: {
//     bg: "#dc2626",
//     color: "white",
//     radius: "3px 3px 10px 10px",
//     label: "Not Answered",
//   },
//   marked: { bg: "#7c3aed", color: "white", radius: "50%", label: "Marked" },
//   markedAnswered: {
//     bg: "#d97706",
//     color: "white",
//     radius: "50%",
//     label: "Marked & Ans.",
//   },
//   unvisited: {
//     bg: "white",
//     color: C.muted,
//     radius: "6px",
//     label: "Not Visited",
//   },
// };

// function LegendItem({ status, count }) {
//   const s = STATUS_STYLE[status];
//   return (
//     <Flex align="center" gap={2}>
//       <Center
//         w="20px"
//         h="20px"
//         bg={s.bg}
//         borderRadius={s.radius}
//         border={
//           status === "unvisited" ? "1px solid rgba(255,255,255,.25)" : "none"
//         }
//       >
//         <Text fontSize="8px" fontWeight={900} color={s.color}>
//           {count}
//         </Text>
//       </Center>
//       <Text fontSize="11px" color="rgba(255,255,255,.6)" fontWeight={500}>
//         {s.label}
//       </Text>
//     </Flex>
//   );
// }

// function TimerWidget({ h, m, s, isCountdown }) {
//   const pad = (n) => String(n).padStart(2, "0");
//   const remSec = h * 3600 + m * 60 + s;
//   const urgent = isCountdown && remSec <= 300;
//   return (
//     <Flex
//       align="center"
//       gap={2.5}
//       bg={urgent ? "rgba(220,38,38,.18)" : "rgba(255,255,255,.09)"}
//       border="1px solid"
//       borderColor={urgent ? "rgba(220,38,38,.35)" : "rgba(255,255,255,.13)"}
//       borderRadius="12px"
//       px={4}
//       py={2}
//     >
//       <Icon
//         as={FaClock}
//         fontSize="12px"
//         color={urgent ? "#fca5a5" : "rgba(255,255,255,.45)"}
//       />
//       <Box>
//         <Text
//           fontSize="17px"
//           fontWeight={900}
//           letterSpacing="2.5px"
//           lineHeight="1"
//           color={urgent ? "#fca5a5" : "white"}
//           fontFamily="'JetBrains Mono',monospace"
//         >
//           {`${pad(h)}:${pad(m)}:${pad(s)}`}
//         </Text>
//         <Text
//           fontSize="9px"
//           fontWeight={700}
//           color="rgba(255,255,255,.35)"
//           textTransform="uppercase"
//           letterSpacing="1px"
//         >
//           {isCountdown ? "remaining" : "elapsed"}
//         </Text>
//       </Box>
//     </Flex>
//   );
// }

// // ── Per-question timer badge (counts UP from 0) ──────────────────
// function QuestionTimer({ elapsed }) {
//   const pad = (n) => String(n).padStart(2, "0");
//   const m = Math.floor(elapsed / 60);
//   const s = elapsed % 60;
//   const hot = elapsed > 120; // turns amber after 2 min
//   return (
//     <Flex
//       align="center"
//       gap={1.5}
//       bg={hot ? "rgba(217,119,6,.12)" : "rgba(37,99,235,.08)"}
//       border="1px solid"
//       borderColor={hot ? "rgba(217,119,6,.3)" : "rgba(37,99,235,.15)"}
//       borderRadius="8px"
//       px={3}
//       py="5px"
//     >
//       <Icon as={FaStopwatch} fontSize="10px" color={hot ? C.amber : C.blue} />
//       <Text
//         fontSize="12px"
//         fontWeight={800}
//         color={hot ? C.amber : C.blue}
//         fontFamily="'JetBrains Mono',monospace"
//       >
//         {m > 0 ? `${m}m ${pad(s)}s` : `${s}s`}
//       </Text>
//     </Flex>
//   );
// }

// const TakeTest = ({ handleFullScreen }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const toast = useToast();
//   const { user } = useAuth();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [isMobile] = useMediaQuery("(max-width: 768px)");

//   const quest = location.state?.quest ?? [];
//   const testMeta = location.state?.testMeta ?? {};

//   // question is the SHUFFLED array — this order is what the student sees.
//   // We store this exact array in the result (shuffledQuestions) so ResultPage
//   // can map allAnswers indices back to the correct questions.
//   const [question] = useState(() => [...quest].sort(() => Math.random() - 0.5));
//   const [currentquestion, setcurrentquestion] = useState(0);
//   const [answeredQuestion, setAnsweredQuestion] = useState([]);
//   const [markedAndAnswer, setMarkedAndAnswer] = useState([]);
//   const [markedNotAnswer, setMarkedNotAnswer] = useState([]);
//   const [notAnswer, setNotAnswer] = useState([]);
//   const [answer, setans] = useState(null);
//   const [wrongans, setwrong] = useState(0);
//   const [wrongansqus, setwrongansqus] = useState([]);
//   const [allAns, setAllAns] = useState({});
//   const allAnsRef = useRef({});
//   const [mark, setMark] = useState(0);
//   const [correctQus, setcorrectQus] = useState([]);
//   const [correctAns, setCorrectAns] = useState([]);
//   const [animKey, setAnimKey] = useState(0);

//   // ── Per-question time tracking ─────────────────────────────────
//   const questionTimesRef = useRef({});
//   const qStartTimeRef = useRef(Date.now());
//   const [qElapsed, setQElapsed] = useState(0);

//   const timeLimitMin = Number(testMeta?.timeLimitMin) || 0;
//   const isCountdown = timeLimitMin > 0;
//   const totalTimeInSeconds = timeLimitMin * 60;

//   const [hour, sethour] = useState(0);
//   const [min, setmin] = useState(0);
//   const [sec, setsec] = useState(0);
//   const [reversehour, setreversehour] = useState(() =>
//     Math.floor(totalTimeInSeconds / 3600),
//   );
//   const [reversemin, setreversemin] = useState(() =>
//     Math.floor((totalTimeInSeconds % 3600) / 60),
//   );
//   const [reversesec, setreversesec] = useState(() => totalTimeInSeconds % 60);

//   const [isFullscreenActive, setIsFullscreenActive] = useState(true);
//   const [hasExitedFullscreen, setHasExitedFullscreen] = useState(false);
//   const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
//   const cancelSubmitRef = useRef();
//   const giveMarkRef = useRef(null);

//   const totalAnswered = answeredQuestion.length + markedAndAnswer.length;
//   const progressPct =
//     question.length > 0
//       ? Math.round((totalAnswered / question.length) * 100)
//       : 0;
//   const unvisited =
//     question.length -
//     (markedAndAnswer.length +
//       markedNotAnswer.length +
//       answeredQuestion.length +
//       notAnswer.length);

//   useEffect(() => {
//     allAnsRef.current = allAns;
//   }, [allAns]);

//   // ── Per-question stopwatch (1-second tick) ─────────────────────
//   useEffect(() => {
//     const t = setInterval(() => {
//       const elapsed = Math.floor((Date.now() - qStartTimeRef.current) / 1000);
//       setQElapsed(elapsed);
//     }, 1000);
//     return () => clearInterval(t);
//   }, [currentquestion]);

//   const saveQuestionTime = (leavingIdx) => {
//     const spent = Math.floor((Date.now() - qStartTimeRef.current) / 1000);
//     questionTimesRef.current[leavingIdx] =
//       (questionTimesRef.current[leavingIdx] || 0) + spent;
//   };

//   // ── Fullscreen & security ──────────────────────────────────────
//   useEffect(() => {
//     let requesting = false;
//     const requestFS = async () => {
//       if (requesting) return;
//       requesting = true;
//       const el = document.documentElement;
//       try {
//         if (el.requestFullscreen) await el.requestFullscreen();
//         else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
//         else if (el.msRequestFullscreen) await el.msRequestFullscreen();
//         setIsFullscreenActive(true);
//       } catch {
//         if (hasExitedFullscreen)
//           toast({
//             title: "Fullscreen Required",
//             status: "warning",
//             position: "top",
//           });
//       } finally {
//         requesting = false;
//       }
//     };
//     const onFSChange = () => {
//       const active = !!(
//         document.fullscreenElement ||
//         document.webkitFullscreenElement ||
//         document.msFullscreenElement
//       );
//       if (!active && isFullscreenActive) {
//         setIsFullscreenActive(false);
//         setHasExitedFullscreen(true);
//       } else if (active) setIsFullscreenActive(true);
//     };
//     const onClick = () => {
//       if (!isFullscreenActive && hasExitedFullscreen && !isMobile) requestFS();
//     };
//     const onPop = (e) => {
//       e.preventDefault();
//       window.history.pushState(null, "", window.location.href);
//     };
//     const onBefore = (e) => {
//       e.preventDefault();
//       e.returnValue = "Leave test?";
//       return e.returnValue;
//     };
//     document.addEventListener("fullscreenchange", onFSChange);
//     document.addEventListener("webkitfullscreenchange", onFSChange);
//     document.addEventListener("click", onClick);
//     window.history.pushState(null, "", window.location.href);
//     window.addEventListener("popstate", onPop);
//     window.addEventListener("beforeunload", onBefore);
//     return () => {
//       document.removeEventListener("fullscreenchange", onFSChange);
//       document.removeEventListener("webkitfullscreenchange", onFSChange);
//       document.removeEventListener("click", onClick);
//       window.removeEventListener("popstate", onPop);
//       window.removeEventListener("beforeunload", onBefore);
//     };
//   }, [isMobile, isFullscreenActive, hasExitedFullscreen, toast]);

//   useEffect(() => {
//     const h = (e) => {
//       e.preventDefault();
//       return false;
//     };
//     document.addEventListener("contextmenu", h);
//     return () => document.removeEventListener("contextmenu", h);
//   }, []);

//   useEffect(() => {
//     const h = (e) => {
//       if (e.key === "F11" || e.key === "Escape") e.preventDefault();
//       if (e.altKey && e.key === "F4") e.preventDefault();
//       if (e.ctrlKey && e.key === "w") e.preventDefault();
//     };
//     document.addEventListener("keydown", h);
//     return () => document.removeEventListener("keydown", h);
//   }, []);

//   // ── Test-level timer ──────────────────────────────────────────
//   useEffect(() => {
//     const t = setTimeout(() => {
//       if (isCountdown) {
//         const rem = reversehour * 3600 + reversemin * 60 + reversesec;
//         if (rem <= 0) {
//           toast({ title: "Time's Up!", status: "warning", position: "top" });
//           giveMarkRef.current?.();
//           return;
//         }
//         if (reversesec > 0) setreversesec((s) => s - 1);
//         else if (reversemin > 0) {
//           setreversemin((m) => m - 1);
//           setreversesec(59);
//         } else if (reversehour > 0) {
//           setreversehour((h) => h - 1);
//           setreversemin(59);
//           setreversesec(59);
//         }
//       } else {
//         if (sec < 59) setsec((s) => s + 1);
//         else {
//           setsec(0);
//           if (min < 59) setmin((m) => m + 1);
//           else {
//             setmin(0);
//             sethour((h) => h + 1);
//           }
//         }
//       }
//     }, 1000);
//     return () => clearTimeout(t);
//   }, [hour, min, sec, reversehour, reversemin, reversesec, isCountdown]);

//   // ── Navigation ────────────────────────────────────────────────
//   const goToQuestion = (idx) => {
//     saveQuestionTime(currentquestion);
//     qStartTimeRef.current = Date.now();
//     setQElapsed(0);
//     setcurrentquestion(idx);
//     const savedIndex = allAnsRef.current[idx];
//     setans(
//       savedIndex !== undefined
//         ? (question[idx]?.options?.[savedIndex] ?? null)
//         : null,
//     );
//     setAnimKey((k) => k + 1);
//   };

//   const handlequestion = (con) => {
//     if (con === "svn") {
//       if (
//         answer !== null &&
//         allAnsRef.current[currentquestion] !== undefined &&
//         !answeredQuestion.includes(currentquestion)
//       ) {
//         if (markedNotAnswer.includes(currentquestion))
//           markedNotAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
//         if (notAnswer.includes(currentquestion))
//           notAnswer.splice(notAnswer.indexOf(currentquestion), 1);
//         if (markedAndAnswer.includes(currentquestion))
//           markedAndAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
//         setAnsweredQuestion([...answeredQuestion, currentquestion]);
//         if (question.length - 1 > currentquestion)
//           goToQuestion(currentquestion + 1);
//       } else if (
//         allAnsRef.current[currentquestion] === undefined &&
//         answer === null
//       ) {
//         if (!notAnswer.includes(currentquestion)) {
//           if (markedNotAnswer.includes(currentquestion))
//             markedNotAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
//           if (markedAndAnswer.includes(currentquestion))
//             markedAndAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
//           if (answeredQuestion.includes(currentquestion))
//             answeredQuestion.splice(
//               answeredQuestion.indexOf(currentquestion),
//               1,
//             );
//           setNotAnswer([...notAnswer, currentquestion]);
//         }
//       }
//       if (question.length - 1 > currentquestion)
//         goToQuestion(currentquestion + 1);
//     } else {
//       if (
//         answer !== null &&
//         allAnsRef.current[currentquestion] !== undefined &&
//         !answeredQuestion.includes(currentquestion)
//       ) {
//         if (markedNotAnswer.includes(currentquestion))
//           markedNotAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
//         if (notAnswer.includes(currentquestion))
//           notAnswer.splice(notAnswer.indexOf(currentquestion), 1);
//         if (markedAndAnswer.includes(currentquestion))
//           markedAndAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
//         setAnsweredQuestion([...answeredQuestion, currentquestion]);
//       } else if (
//         answer === null &&
//         allAnsRef.current[currentquestion] === undefined &&
//         !notAnswer.includes(currentquestion) &&
//         currentquestion !== con
//       ) {
//         if (markedNotAnswer.includes(currentquestion))
//           markedNotAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
//         if (markedAndAnswer.includes(currentquestion))
//           markedAndAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
//         if (answeredQuestion.includes(currentquestion))
//           answeredQuestion.splice(answeredQuestion.indexOf(currentquestion), 1);
//         setNotAnswer([...notAnswer, currentquestion]);
//       }
//       if (con !== isNaN) goToQuestion(con);
//     }
//   };

//   const markedQuestion = () => {
//     if (allAnsRef.current[currentquestion] === undefined && answer !== null)
//       setAllAns((p) => {
//         const n = {
//           ...p,
//           [currentquestion]:
//             question[currentquestion]?.options?.indexOf(answer),
//         };
//         allAnsRef.current = n;
//         return n;
//       });
//     if (
//       allAnsRef.current[currentquestion] !== undefined &&
//       !markedAndAnswer.includes(currentquestion)
//     ) {
//       if (answeredQuestion.includes(currentquestion))
//         answeredQuestion.splice(answeredQuestion.indexOf(currentquestion), 1);
//       if (markedNotAnswer.includes(currentquestion))
//         notAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
//       if (notAnswer.includes(currentquestion))
//         notAnswer.splice(notAnswer.indexOf(currentquestion), 1);
//       setMarkedAndAnswer([...markedAndAnswer, currentquestion]);
//       setans(null);
//     } else if (
//       allAnsRef.current[currentquestion] === undefined &&
//       !markedNotAnswer.includes(currentquestion)
//     ) {
//       setAllAns((p) => {
//         const u = { ...p };
//         delete u[currentquestion];
//         allAnsRef.current = u;
//         return u;
//       });
//       if (answeredQuestion.includes(currentquestion))
//         answeredQuestion.splice(answeredQuestion.indexOf(currentquestion), 1);
//       if (markedAndAnswer.includes(currentquestion))
//         notAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
//       if (notAnswer.includes(currentquestion))
//         notAnswer.splice(notAnswer.indexOf(currentquestion), 1);
//       setMarkedNotAnswer([...markedNotAnswer, currentquestion]);
//     }
//     if (question.length - 1 > currentquestion)
//       goToQuestion(currentquestion + 1);
//   };

//   const handleAnswer = (optionText, optionIndex) => {
//     setans(optionText);
//     const isCorrect = question[currentquestion].answer === optionIndex;
//     if (isCorrect && !correctAns.includes(currentquestion)) {
//       if (wrongansqus.includes(currentquestion)) {
//         setwrong((w) => w - 1);
//         wrongansqus.splice(wrongansqus.indexOf(currentquestion), 1);
//       }
//       setMark((m) => m + 1);
//       setcorrectQus((p) => [...p, currentquestion]);
//       setCorrectAns((p) => [...p, currentquestion]);
//     } else if (!isCorrect && correctAns.includes(currentquestion)) {
//       correctAns.splice(correctAns.indexOf(currentquestion), 1);
//       correctQus.splice(correctQus.indexOf(currentquestion), 1);
//       setMark((m) => m - 1);
//       setwrong((w) => w + 1);
//     }
//     if (
//       !isCorrect &&
//       !correctAns.includes(currentquestion) &&
//       !wrongansqus.includes(currentquestion)
//     ) {
//       setwrong((w) => w + 1);
//       setwrongansqus((p) => [...p, currentquestion]);
//     }
//     setAllAns((p) => {
//       const n = { ...p, [currentquestion]: optionIndex };
//       allAnsRef.current = n;
//       return n;
//     });
//   };

//   const handleClearAnswer = (qi) => {
//     if (answeredQuestion.includes(currentquestion))
//       answeredQuestion.splice(answeredQuestion.indexOf(currentquestion), 1);
//     if (markedAndAnswer.includes(currentquestion))
//       markedAndAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
//     if (markedNotAnswer.includes(currentquestion))
//       markedNotAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
//     setAllAns((p) => {
//       const u = { ...p };
//       delete u[qi];
//       allAnsRef.current = u;
//       return u;
//     });
//     if (!notAnswer.includes(currentquestion))
//       setNotAnswer([...notAnswer, currentquestion]);
//     setans(null);
//   };

//   const giveMark = async () => {
//     // Save final question's time before submitting
//     saveQuestionTime(currentquestion);

//     try {
//       const subject = testMeta?.subject || "";
//       const category = testMeta?.category || subject;
//       const timeTaken = isCountdown
//         ? totalTimeInSeconds -
//           (reversehour * 3600 + reversemin * 60 + reversesec)
//         : hour * 3600 + min * 60 + sec;
//       const scorePercentage =
//         question.length > 0 ? Math.round((mark / question.length) * 100) : 0;
//       let apiPercentile = null,
//         savedResultId = null;

//       if (testMeta?.testId) {
//         try {
//           const res = await resultsAPI.submit({
//             testId: testMeta.testId,
//             score: mark,
//             totalQuestions: question.length,
//             wrongAnswers: wrongans,
//             timeTaken,
//             allAnswers: allAnsRef.current,
//             questionTimes: questionTimesRef.current,
//             correctQus,
//             wrongQus: wrongansqus,
//             answeredQus: answeredQuestion,
//             notAnsweredQus: notAnswer,
//             markedAndAnswered: markedAndAnswer,
//             markedNotAnswered: markedNotAnswer,
//             // ── Store the shuffled question order ──────────────────────────
//             // allAnswers indices are based on this shuffled array.
//             // The backend saves this so ResultPage can reconstruct the correct
//             // answer↔question mapping when the owner views the result.
//             shuffledQuestions: question,
//           });
//           apiPercentile = res.data?.percentile ?? res.percentile ?? null;
//           savedResultId = res.data?._id ?? res._id ?? null;
//           const coachingId = res.data?.coachingId ?? null;
//           if (coachingId)
//             socket.emit("test:submitted", {
//               coachingId: coachingId.toString(),
//               testId: testMeta.testId,
//             });
//         } catch (err) {
//           console.error("Save result error:", err);
//         }
//       }

//       if (document.exitFullscreen) document.exitFullscreen();
//       else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//       if (handleFullScreen) handleFullScreen(false);

//       navigate("/test-result", {
//         replace: true,
//         state: {
//           testId: testMeta?.testId,
//           testTitle: testMeta?.testTitle || testMeta?.category || subject,
//           subject,
//           category,
//           score: mark,
//           totalQuestions: question.length,
//           scorePercentage,
//           percentile: apiPercentile,
//           savedResultId,
//           timeTaken,
//           // Pass the shuffled array so the student's own ResultPage also uses
//           // the correct question order (same as what was shown during the test)
//           shuffledQuestions: question,
//           questions: question,
//           allAnswers: allAnsRef.current,
//           questionTimes: { ...questionTimesRef.current },
//           correctQus,
//           wrongansqus,
//           answeredQuestion,
//           notAnswer,
//           markedAndAnswer,
//           markedNotAnswer,
//           wrongans,
//         },
//       });
//     } catch (error) {
//       console.error("Submit error:", error);
//       navigate("/test-result", { replace: true });
//     }
//   };

//   giveMarkRef.current = giveMark;

//   const enterFullscreen = async () => {
//     const el = document.documentElement;
//     try {
//       if (el.requestFullscreen) await el.requestFullscreen();
//       else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
//       setIsFullscreenActive(true);
//     } catch {
//       toast({ title: "Fullscreen Failed", status: "error", position: "top" });
//     }
//   };

//   const currentStatus = getQStatus(currentquestion, {
//     answeredQuestion,
//     markedAndAnswer,
//     markedNotAnswer,
//     notAnswer,
//   });
//   const letters = ["A", "B", "C", "D", "E", "F"];

//   const QuestionSidebar = () => (
//     <Flex direction="column" h="100%" overflow="hidden">
//       <Box
//         px={5}
//         py={4}
//         borderBottom="1px solid rgba(255,255,255,.09)"
//         flexShrink={0}
//       >
//         <Text
//           fontSize="12px"
//           fontWeight={800}
//           color="white"
//           textTransform="uppercase"
//           letterSpacing="1px"
//         >
//           Navigator
//         </Text>
//         <Text fontSize="11px" color="rgba(255,255,255,.4)" mt={0.5}>
//           {testMeta?.subject || "General"} · {question.length} Qs
//         </Text>
//       </Box>
//       <Box
//         px={5}
//         py={3}
//         borderBottom="1px solid rgba(255,255,255,.07)"
//         flexShrink={0}
//       >
//         <Flex justify="space-between" mb={1.5}>
//           <Text
//             fontSize="10px"
//             color="rgba(255,255,255,.45)"
//             fontWeight={700}
//             textTransform="uppercase"
//             letterSpacing=".8px"
//           >
//             Progress
//           </Text>
//           <Text fontSize="10px" color="rgba(255,255,255,.75)" fontWeight={800}>
//             {totalAnswered}/{question.length}
//           </Text>
//         </Flex>
//         <Box
//           h="5px"
//           bg="rgba(255,255,255,.1)"
//           borderRadius="full"
//           overflow="hidden"
//         >
//           <Box
//             h="100%"
//             bg="linear-gradient(90deg,#14b8a6,#38bdf8)"
//             w={`${progressPct}%`}
//             borderRadius="full"
//             transition="width .5s ease"
//           />
//         </Box>
//       </Box>
//       <Box
//         px={5}
//         py={3}
//         borderBottom="1px solid rgba(255,255,255,.07)"
//         flexShrink={0}
//       >
//         <Grid templateColumns="1fr 1fr" gap={1.5}>
//           {["answered", "skipped", "marked", "markedAnswered", "unvisited"].map(
//             (st) => (
//               <LegendItem
//                 key={st}
//                 status={st}
//                 count={
//                   st === "answered"
//                     ? answeredQuestion.length
//                     : st === "skipped"
//                       ? notAnswer.length
//                       : st === "marked"
//                         ? markedNotAnswer.length
//                         : st === "markedAnswered"
//                           ? markedAndAnswer.length
//                           : unvisited
//                 }
//               />
//             ),
//           )}
//         </Grid>
//       </Box>
//       <Box
//         flex={1}
//         overflowY="auto"
//         px={5}
//         py={4}
//         css={{
//           "&::-webkit-scrollbar": { width: "3px" },
//           "&::-webkit-scrollbar-thumb": {
//             background: "rgba(255,255,255,.15)",
//             borderRadius: "3px",
//           },
//         }}
//       >
//         <Grid templateColumns="repeat(5,1fr)" gap={2}>
//           {question.map((_, i) => {
//             const st = getQStatus(i, {
//               answeredQuestion,
//               markedAndAnswer,
//               markedNotAnswer,
//               notAnswer,
//             });
//             const s = STATUS_STYLE[st];
//             const cur = i === currentquestion;
//             return (
//               <Center
//                 key={i}
//                 w="100%"
//                 h="36px"
//                 cursor="pointer"
//                 onClick={() => {
//                   goToQuestion(i);
//                   if (isMobile) onClose();
//                 }}
//                 bg={cur ? "rgba(255,255,255,.28)" : s.bg}
//                 color={cur ? "white" : s.color}
//                 borderRadius={s.radius}
//                 border={
//                   cur
//                     ? "2px solid white"
//                     : st === "unvisited"
//                       ? "1px solid rgba(255,255,255,.18)"
//                       : "none"
//                 }
//                 fontSize="10px"
//                 fontWeight={900}
//                 transform={cur ? "scale(1.1)" : "scale(1)"}
//                 boxShadow={cur ? "0 0 0 3px rgba(255,255,255,.25)" : "none"}
//                 transition="all .15s"
//                 _hover={{
//                   opacity: 0.85,
//                   transform: cur ? "scale(1.1)" : "scale(1.04)",
//                 }}
//               >
//                 {i + 1}
//               </Center>
//             );
//           })}
//         </Grid>
//       </Box>
//       <Box
//         px={5}
//         py={4}
//         borderTop="1px solid rgba(255,255,255,.09)"
//         flexShrink={0}
//       >
//         <Button
//           w="full"
//           h="44px"
//           borderRadius="12px"
//           bg="linear-gradient(135deg,#0d9488,#0891b2)"
//           color="white"
//           fontWeight={800}
//           fontSize="13px"
//           leftIcon={<Icon as={FaPaperPlane} fontSize="12px" />}
//           onClick={() => setIsSubmitDialogOpen(true)}
//           _hover={{
//             opacity: 0.9,
//             transform: "translateY(-1px)",
//             boxShadow: "0 8px 24px rgba(13,148,136,.4)",
//           }}
//           transition="all .15s"
//         >
//           Submit Test
//         </Button>
//       </Box>
//     </Flex>
//   );

//   return (
//     <Box
//       h="100vh"
//       display="flex"
//       flexDirection="column"
//       bg="#f0f4fa"
//       fontFamily="'DM Sans',sans-serif"
//       position="relative"
//     >
//       {!isMobile && !isFullscreenActive && hasExitedFullscreen && (
//         <Box
//           position="fixed"
//           inset={0}
//           bg="rgba(11,30,61,.96)"
//           zIndex={9999}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           onClick={enterFullscreen}
//           cursor="pointer"
//         >
//           <VStack spacing={5} color="white" textAlign="center" p={8}>
//             <Text fontSize="52px" lineHeight="1">
//               ⚠️
//             </Text>
//             <Box>
//               <Text
//                 fontSize="26px"
//                 fontWeight={900}
//                 letterSpacing="-1px"
//                 mb={2}
//               >
//                 Fullscreen Required
//               </Text>
//               <Text
//                 fontSize="14px"
//                 color="rgba(255,255,255,.55)"
//                 maxW="360px"
//                 lineHeight="1.6"
//               >
//                 Stay in fullscreen mode to maintain exam integrity.
//               </Text>
//             </Box>
//             <Button
//               size="lg"
//               h="52px"
//               px={8}
//               borderRadius="14px"
//               bg="linear-gradient(135deg,#2563eb,#1e40af)"
//               color="white"
//               fontWeight={800}
//               leftIcon={<Icon as={FaExpand} />}
//               onClick={enterFullscreen}
//               _hover={{
//                 opacity: 0.9,
//                 transform: "translateY(-2px)",
//                 boxShadow: "0 12px 32px rgba(37,99,235,.4)",
//               }}
//               transition="all .2s"
//             >
//               Re-enter Fullscreen
//             </Button>
//           </VStack>
//         </Box>
//       )}

//       {/* Header */}
//       <Flex
//         bg="linear-gradient(135deg,#0b1e3d 0%,#132952 60%,#1a3a6e 100%)"
//         px={{ base: 3, md: 5 }}
//         h={{ base: "56px", md: "62px" }}
//         align="center"
//         justify="space-between"
//         flexShrink={0}
//         boxShadow="0 2px 16px rgba(11,30,61,.5)"
//         position="relative"
//         zIndex={10}
//       >
//         <Flex align="center" gap={3}>
//           <Box
//             w="30px"
//             h="30px"
//             bg="linear-gradient(135deg,#2563eb,#7c3aed)"
//             borderRadius="8px"
//             display="flex"
//             alignItems="center"
//             justifyContent="center"
//             flexShrink={0}
//           >
//             <Text fontSize="15px">📋</Text>
//           </Box>
//           <Box display={{ base: "none", sm: "block" }}>
//             <Text
//               fontSize="13px"
//               fontWeight={900}
//               color="white"
//               letterSpacing="-0.3px"
//               lineHeight="1.1"
//             >
//               {testMeta?.testTitle || "Test"}
//             </Text>
//             <Text
//               fontSize="10px"
//               color="rgba(255,255,255,.38)"
//               fontWeight={600}
//               textTransform="uppercase"
//               letterSpacing=".8px"
//             >
//               {testMeta?.subject || "General"}
//             </Text>
//           </Box>
//         </Flex>
//         <TimerWidget
//           h={isCountdown ? reversehour : hour}
//           m={isCountdown ? reversemin : min}
//           s={isCountdown ? reversesec : sec}
//           isCountdown={isCountdown}
//         />
//         <HStack spacing={2}>
//           {!isMobile && !isFullscreenActive && (
//             <Button
//               size="sm"
//               h="32px"
//               px={3}
//               borderRadius="8px"
//               bg="rgba(255,255,255,.09)"
//               color="rgba(255,255,255,.75)"
//               border="1px solid rgba(255,255,255,.12)"
//               fontWeight={700}
//               fontSize="11px"
//               leftIcon={<Icon as={FaExpand} fontSize="10px" />}
//               onClick={enterFullscreen}
//               _hover={{ bg: "rgba(255,255,255,.15)" }}
//             >
//               Fullscreen
//             </Button>
//           )}
//           <ModalPause
//             markedAndAnswer={markedAndAnswer}
//             question={question}
//             markedNotAnswer={markedNotAnswer}
//             notAnswer={notAnswer}
//             answered={answeredQuestion}
//           />
//           {isMobile && (
//             <Button
//               onClick={onOpen}
//               h="32px"
//               w="32px"
//               p={0}
//               minW="32px"
//               borderRadius="8px"
//               bg="rgba(255,255,255,.09)"
//               border="1px solid rgba(255,255,255,.12)"
//               _hover={{ bg: "rgba(255,255,255,.16)" }}
//             >
//               <Icon as={FaListUl} color="white" fontSize="12px" />
//             </Button>
//           )}
//         </HStack>
//       </Flex>

//       {/* Progress strip */}
//       <Box h="3px" bg="rgba(37,99,235,.12)" flexShrink={0}>
//         <Box
//           h="100%"
//           bg="linear-gradient(90deg,#2563eb,#0d9488)"
//           w={`${progressPct}%`}
//           transition="width .6s ease"
//           boxShadow="0 0 8px rgba(37,99,235,.45)"
//         />
//       </Box>

//       <Flex flex={1} overflow="hidden">
//         <Flex direction="column" flex={1} overflow="hidden">
//           {/* Sub-header with question status + per-question timer */}
//           <Flex
//             px={{ base: 4, md: 6 }}
//             py={3}
//             bg="white"
//             align="center"
//             justify="space-between"
//             borderBottom="1px solid #e8eef7"
//             flexShrink={0}
//           >
//             <Flex align="center" gap={3}>
//               <Box
//                 bg="linear-gradient(135deg,#2563eb,#1e40af)"
//                 px={3}
//                 py={1}
//                 borderRadius="8px"
//               >
//                 <Text
//                   fontSize="12px"
//                   fontWeight={900}
//                   color="white"
//                   letterSpacing=".3px"
//                 >
//                   Q {currentquestion + 1} / {question.length}
//                 </Text>
//               </Box>
//               {currentStatus !== "unvisited" && (
//                 <Badge
//                   px={2.5}
//                   py={0.5}
//                   borderRadius="6px"
//                   fontSize="10px"
//                   fontWeight={800}
//                   color={STATUS_STYLE[currentStatus].bg}
//                   bg={STATUS_STYLE[currentStatus].bg + "18"}
//                 >
//                   {STATUS_STYLE[currentStatus].label}
//                 </Badge>
//               )}
//               <QuestionTimer elapsed={qElapsed} />
//             </Flex>
//             <ReportQuestionDropdown />
//           </Flex>

//           {/* Question + Options */}
//           <Box
//             flex={1}
//             overflowY="auto"
//             px={{ base: 4, md: 6 }}
//             py={6}
//             css={{
//               "&::-webkit-scrollbar": { width: "4px" },
//               "&::-webkit-scrollbar-thumb": {
//                 background: "#e2e8f0",
//                 borderRadius: "4px",
//               },
//             }}
//           >
//             <Box
//               bg="white"
//               borderRadius="16px"
//               border="1px solid #e8eef7"
//               p={{ base: 4, md: 6 }}
//               mb={5}
//               boxShadow="0 2px 12px rgba(0,0,0,.04)"
//             >
//               <Flex align="flex-start" gap={3}>
//                 <Flex
//                   w="28px"
//                   h="28px"
//                   bg="#eff6ff"
//                   borderRadius="8px"
//                   flexShrink={0}
//                   align="center"
//                   justify="center"
//                   mt="2px"
//                 >
//                   <Text fontSize="11px" fontWeight={900} color={C.blue}>
//                     {currentquestion + 1}
//                   </Text>
//                 </Flex>
//                 <Text
//                   fontSize="15px"
//                   lineHeight="1.8"
//                   color={C.text}
//                   fontWeight={500}
//                   flex={1}
//                 >
//                   {question[currentquestion]?.qus}
//                 </Text>
//               </Flex>
//             </Box>

//             <VStack spacing={3} align="stretch">
//               {question[currentquestion]?.options.map((opt, i) => {
//                 const sel = answer === opt;
//                 return (
//                   <Box
//                     key={`${animKey}-${i}`}
//                     p={4}
//                     borderRadius="14px"
//                     cursor="pointer"
//                     border="1.5px solid"
//                     borderColor={sel ? C.blue : "#e2e8f0"}
//                     bg={
//                       sel ? "linear-gradient(135deg,#eff6ff,#f0f9ff)" : "white"
//                     }
//                     boxShadow={
//                       sel
//                         ? "0 0 0 3px rgba(37,99,235,.1),0 4px 16px rgba(37,99,235,.08)"
//                         : "0 1px 4px rgba(0,0,0,.04)"
//                     }
//                     transition="all .15s"
//                     _hover={{
//                       borderColor: sel ? C.blue : "#94a3b8",
//                       transform: "translateY(-1px)",
//                       boxShadow: sel ? undefined : "0 4px 14px rgba(0,0,0,.07)",
//                     }}
//                     onClick={() => handleAnswer(opt, i)}
//                   >
//                     <Flex align="center" gap={4}>
//                       <Center
//                         w="34px"
//                         h="34px"
//                         borderRadius="10px"
//                         flexShrink={0}
//                         bg={sel ? C.blue : "#f1f5f9"}
//                         color={sel ? "white" : C.muted}
//                         fontSize="13px"
//                         fontWeight={900}
//                         transition="all .15s"
//                       >
//                         {sel ? (
//                           <Icon as={FaCheckCircle} fontSize="14px" />
//                         ) : (
//                           letters[i] || i + 1
//                         )}
//                       </Center>
//                       <Text
//                         fontSize="14px"
//                         fontWeight={sel ? 700 : 500}
//                         color={sel ? C.blue : C.text}
//                         lineHeight="1.5"
//                         flex={1}
//                       >
//                         {opt}
//                       </Text>
//                     </Flex>
//                   </Box>
//                 );
//               })}
//             </VStack>
//           </Box>

//           {/* Bottom bar */}
//           <Box
//             px={{ base: 4, md: 6 }}
//             py={{ base: 3, md: 4 }}
//             bg="white"
//             borderTop="1px solid #e8eef7"
//             flexShrink={0}
//           >
//             <Flex
//               justify="space-between"
//               align="center"
//               gap={3}
//               flexWrap="wrap"
//             >
//               <HStack spacing={2}>
//                 <Button
//                   h="40px"
//                   px={3}
//                   borderRadius="11px"
//                   bg="#f1f5f9"
//                   color={C.muted}
//                   fontWeight={700}
//                   fontSize="12px"
//                   leftIcon={<Icon as={FaChevronLeft} fontSize="10px" />}
//                   isDisabled={currentquestion === 0}
//                   onClick={() => goToQuestion(currentquestion - 1)}
//                   _hover={{ bg: "#e2e8f0" }}
//                   _disabled={{ opacity: 0.4 }}
//                 >
//                   Prev
//                 </Button>
//                 <Button
//                   h="40px"
//                   px={3}
//                   borderRadius="11px"
//                   bg="#faf5ff"
//                   color={C.purple}
//                   border="1px solid #e9d5ff"
//                   fontWeight={700}
//                   fontSize="12px"
//                   leftIcon={<Icon as={FaBookmark} fontSize="10px" />}
//                   onClick={markedQuestion}
//                   _hover={{ bg: "#f3e8ff" }}
//                 >
//                   Review
//                 </Button>
//                 <Button
//                   h="40px"
//                   px={3}
//                   borderRadius="11px"
//                   bg="#fff7ed"
//                   color={C.amber}
//                   border="1px solid #fed7aa"
//                   fontWeight={700}
//                   fontSize="12px"
//                   leftIcon={<Icon as={FaEraser} fontSize="10px" />}
//                   onClick={() => handleClearAnswer(currentquestion)}
//                   _hover={{ bg: "#ffedd5" }}
//                 >
//                   Clear
//                 </Button>
//               </HStack>
//               <HStack spacing={2}>
//                 <Button
//                   h="40px"
//                   px={5}
//                   borderRadius="11px"
//                   bg="linear-gradient(135deg,#2563eb,#1e40af)"
//                   color="white"
//                   fontWeight={800}
//                   fontSize="13px"
//                   rightIcon={<Icon as={FaChevronRight} fontSize="10px" />}
//                   onClick={() => handlequestion("svn")}
//                   _hover={{
//                     opacity: 0.9,
//                     transform: "translateY(-1px)",
//                     boxShadow: "0 6px 20px rgba(37,99,235,.35)",
//                   }}
//                   transition="all .15s"
//                 >
//                   Save & Next
//                 </Button>
//                 {!isMobile && (
//                   <Button
//                     h="40px"
//                     px={4}
//                     borderRadius="11px"
//                     bg="linear-gradient(135deg,#0d9488,#0891b2)"
//                     color="white"
//                     fontWeight={800}
//                     fontSize="13px"
//                     leftIcon={<Icon as={FaPaperPlane} fontSize="11px" />}
//                     onClick={() => setIsSubmitDialogOpen(true)}
//                     _hover={{
//                       opacity: 0.9,
//                       transform: "translateY(-1px)",
//                       boxShadow: "0 6px 20px rgba(13,148,136,.35)",
//                     }}
//                     transition="all .15s"
//                   >
//                     Submit
//                   </Button>
//                 )}
//               </HStack>
//             </Flex>
//             {isMobile && (
//               <Flex mt={3} gap={1.5} flexWrap="wrap" justify="center">
//                 {question.map((_, i) => {
//                   const st = getQStatus(i, {
//                     answeredQuestion,
//                     markedAndAnswer,
//                     markedNotAnswer,
//                     notAnswer,
//                   });
//                   const s = STATUS_STYLE[st];
//                   const cur = i === currentquestion;
//                   return (
//                     <Center
//                       key={i}
//                       w="26px"
//                       h="26px"
//                       cursor="pointer"
//                       borderRadius={s.radius}
//                       fontSize="9px"
//                       fontWeight={900}
//                       bg={cur ? C.blue : s.bg}
//                       color={cur ? "white" : s.color}
//                       border={st === "unvisited" ? "1px solid #cbd5e1" : "none"}
//                       boxShadow={cur ? `0 0 0 2px rgba(37,99,235,.4)` : "none"}
//                       onClick={() => goToQuestion(i)}
//                     >
//                       {i + 1}
//                     </Center>
//                   );
//                 })}
//               </Flex>
//             )}
//           </Box>
//         </Flex>

//         {!isMobile && (
//           <Box
//             w="272px"
//             flexShrink={0}
//             bg="linear-gradient(180deg,#0b1e3d 0%,#132952 100%)"
//             borderLeft="1px solid rgba(255,255,255,.06)"
//             display="flex"
//             flexDirection="column"
//             overflow="hidden"
//           >
//             <QuestionSidebar />
//           </Box>
//         )}
//       </Flex>

//       {isMobile && (
//         <Drawer onClose={onClose} isOpen={isOpen} size="xs" placement="right">
//           <DrawerOverlay backdropFilter="blur(4px)" />
//           <DrawerContent
//             bg="linear-gradient(180deg,#0b1e3d,#132952)"
//             borderLeft="none"
//           >
//             <DrawerCloseButton color="white" top={4} right={4} />
//             <DrawerBody p={0} pt={10}>
//               <QuestionSidebar />
//             </DrawerBody>
//           </DrawerContent>
//         </Drawer>
//       )}

//       <AlertDialog
//         isOpen={isSubmitDialogOpen}
//         leastDestructiveRef={cancelSubmitRef}
//         onClose={() => setIsSubmitDialogOpen(false)}
//         isCentered
//       >
//         <AlertDialogOverlay backdropFilter="blur(6px)">
//           <AlertDialogContent
//             mx={4}
//             borderRadius="20px"
//             overflow="hidden"
//             fontFamily="'DM Sans',sans-serif"
//             boxShadow="0 24px 64px rgba(0,0,0,.2)"
//           >
//             <Box bg="linear-gradient(135deg,#0b1e3d,#132952)" px={6} py={5}>
//               <Flex align="center" gap={3}>
//                 <Box
//                   w="38px"
//                   h="38px"
//                   bg="rgba(255,255,255,.1)"
//                   borderRadius="11px"
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="center"
//                 >
//                   <Icon as={FaPaperPlane} color="white" fontSize="15px" />
//                 </Box>
//                 <Box>
//                   <Text
//                     fontSize="16px"
//                     fontWeight={900}
//                     color="white"
//                     letterSpacing="-0.5px"
//                   >
//                     Submit Test?
//                   </Text>
//                   <Text fontSize="11px" color="rgba(255,255,255,.45)">
//                     This action cannot be undone
//                   </Text>
//                 </Box>
//               </Flex>
//             </Box>
//             <AlertDialogBody p={5}>
//               <Grid templateColumns="repeat(3,1fr)" gap={3} mb={4}>
//                 {[
//                   {
//                     label: "Total",
//                     value: question.length,
//                     color: C.blue,
//                     bg: "#eff6ff",
//                   },
//                   {
//                     label: "Answered",
//                     value: answeredQuestion.length,
//                     color: C.green,
//                     bg: "#f0fdf4",
//                   },
//                   {
//                     label: "Skipped",
//                     value: notAnswer.length,
//                     color: C.red,
//                     bg: "#fef2f2",
//                   },
//                   {
//                     label: "Marked",
//                     value: markedNotAnswer.length + markedAndAnswer.length,
//                     color: C.purple,
//                     bg: "#f5f3ff",
//                   },
//                   {
//                     label: "Unvisited",
//                     value: unvisited,
//                     color: C.muted,
//                     bg: "#f8fafc",
//                   },
//                 ].map(({ label, value, color, bg }) => (
//                   <Box
//                     key={label}
//                     bg={bg}
//                     borderRadius="12px"
//                     p={3}
//                     textAlign="center"
//                   >
//                     <Text
//                       fontSize="22px"
//                       fontWeight={900}
//                       color={color}
//                       letterSpacing="-1px"
//                       lineHeight="1"
//                     >
//                       {value}
//                     </Text>
//                     <Text
//                       fontSize="10px"
//                       color={C.muted}
//                       fontWeight={700}
//                       mt={1}
//                       textTransform="uppercase"
//                       letterSpacing=".5px"
//                     >
//                       {label}
//                     </Text>
//                   </Box>
//                 ))}
//               </Grid>
//               <Flex
//                 align="center"
//                 gap={2.5}
//                 bg="#fff7ed"
//                 borderRadius="10px"
//                 p={3}
//                 border="1px solid #fed7aa"
//               >
//                 <Icon
//                   as={FaExclamationTriangle}
//                   color={C.amber}
//                   fontSize="13px"
//                   flexShrink={0}
//                 />
//                 <Text
//                   fontSize="12px"
//                   color="#92400e"
//                   fontWeight={600}
//                   lineHeight="1.5"
//                 >
//                   Once submitted, answers cannot be changed.
//                 </Text>
//               </Flex>
//             </AlertDialogBody>
//             <AlertDialogFooter gap={3} px={5} pb={5}>
//               <Button
//                 ref={cancelSubmitRef}
//                 flex={1}
//                 h="46px"
//                 borderRadius="12px"
//                 bg="#f1f5f9"
//                 color={C.muted}
//                 fontWeight={700}
//                 onClick={() => setIsSubmitDialogOpen(false)}
//                 _hover={{ bg: "#e2e8f0" }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 flex={1}
//                 h="46px"
//                 borderRadius="12px"
//                 bg="linear-gradient(135deg,#0d9488,#0891b2)"
//                 color="white"
//                 fontWeight={800}
//                 leftIcon={<Icon as={FaPaperPlane} fontSize="12px" />}
//                 onClick={() => {
//                   setIsSubmitDialogOpen(false);
//                   giveMark();
//                 }}
//                 _hover={{
//                   opacity: 0.9,
//                   boxShadow: "0 8px 24px rgba(13,148,136,.4)",
//                 }}
//                 transition="all .15s"
//               >
//                 Submit Test
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </Box>
//   );
// };

// export default TakeTest;

import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Grid,
  Text,
  useDisclosure,
  useMediaQuery,
  VStack,
  HStack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  Icon,
} from "@chakra-ui/react";
import ModalPause from "./ModalPause";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resultsAPI } from "../services/api";
import ReportQuestionDropdown from "./ReportQuestionDropdown";
import {
  FaEraser,
  FaChevronRight,
  FaChevronLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaListUl,
  FaExpand,
  FaPaperPlane,
  FaBookmark,
  FaClock,
  FaStopwatch,
} from "react-icons/fa";

const C = {
  navy: "#0b1e3d",
  navyMid: "#132952",
  blue: "#2563eb",
  teal: "#0d9488",
  green: "#16a34a",
  red: "#dc2626",
  purple: "#7c3aed",
  amber: "#d97706",
  muted: "#64748b",
  text: "#0f172a",
};

const getQStatus = (
  i,
  { answeredQuestion, markedAndAnswer, markedNotAnswer, notAnswer },
) => {
  if (markedAndAnswer.includes(i)) return "markedAnswered";
  if (markedNotAnswer.includes(i)) return "marked";
  if (answeredQuestion.includes(i)) return "answered";
  if (notAnswer.includes(i)) return "skipped";
  return "unvisited";
};

const STATUS_STYLE = {
  answered: {
    bg: "#16a34a",
    color: "white",
    radius: "10px 10px 3px 3px",
    label: "Answered",
  },
  skipped: {
    bg: "#dc2626",
    color: "white",
    radius: "3px 3px 10px 10px",
    label: "Not Answered",
  },
  marked: { bg: "#7c3aed", color: "white", radius: "50%", label: "Marked" },
  markedAnswered: {
    bg: "#d97706",
    color: "white",
    radius: "50%",
    label: "Marked & Ans.",
  },
  unvisited: {
    bg: "white",
    color: C.muted,
    radius: "6px",
    label: "Not Visited",
  },
};

function LegendItem({ status, count }) {
  const s = STATUS_STYLE[status];
  return (
    <Flex align="center" gap={2}>
      <Center
        w="20px"
        h="20px"
        bg={s.bg}
        borderRadius={s.radius}
        border={
          status === "unvisited" ? "1px solid rgba(255,255,255,.25)" : "none"
        }
      >
        <Text fontSize="8px" fontWeight={900} color={s.color}>
          {count}
        </Text>
      </Center>
      <Text fontSize="11px" color="rgba(255,255,255,.6)" fontWeight={500}>
        {s.label}
      </Text>
    </Flex>
  );
}

function TimerWidget({ h, m, s, isCountdown }) {
  const pad = (n) => String(n).padStart(2, "0");
  const remSec = h * 3600 + m * 60 + s;
  const urgent = isCountdown && remSec <= 300;
  return (
    <Flex
      align="center"
      gap={2.5}
      bg={urgent ? "rgba(220,38,38,.18)" : "rgba(255,255,255,.09)"}
      border="1px solid"
      borderColor={urgent ? "rgba(220,38,38,.35)" : "rgba(255,255,255,.13)"}
      borderRadius="12px"
      px={4}
      py={2}
    >
      <Icon
        as={FaClock}
        fontSize="12px"
        color={urgent ? "#fca5a5" : "rgba(255,255,255,.45)"}
      />
      <Box>
        <Text
          fontSize="17px"
          fontWeight={900}
          letterSpacing="2.5px"
          lineHeight="1"
          color={urgent ? "#fca5a5" : "white"}
          fontFamily="'JetBrains Mono',monospace"
        >
          {`${pad(h)}:${pad(m)}:${pad(s)}`}
        </Text>
        <Text
          fontSize="9px"
          fontWeight={700}
          color="rgba(255,255,255,.35)"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          {isCountdown ? "remaining" : "elapsed"}
        </Text>
      </Box>
    </Flex>
  );
}

// ── Per-question timer badge (counts UP from 0) ──────────────────
function QuestionTimer({ elapsed }) {
  const pad = (n) => String(n).padStart(2, "0");
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  const hot = elapsed > 120; // turns amber after 2 min
  return (
    <Flex
      align="center"
      gap={1.5}
      bg={hot ? "rgba(217,119,6,.12)" : "rgba(37,99,235,.08)"}
      border="1px solid"
      borderColor={hot ? "rgba(217,119,6,.3)" : "rgba(37,99,235,.15)"}
      borderRadius="8px"
      px={3}
      py="5px"
    >
      <Icon as={FaStopwatch} fontSize="10px" color={hot ? C.amber : C.blue} />
      <Text
        fontSize="12px"
        fontWeight={800}
        color={hot ? C.amber : C.blue}
        fontFamily="'JetBrains Mono',monospace"
      >
        {m > 0 ? `${m}m ${pad(s)}s` : `${s}s`}
      </Text>
    </Flex>
  );
}

const TakeTest = ({ handleFullScreen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const quest = location.state?.quest ?? [];
  const testMeta = location.state?.testMeta ?? {};

  // question is the SHUFFLED array — this order is what the student sees.
  // We store this exact array in the result (shuffledQuestions) so ResultPage
  // can map allAnswers indices back to the correct questions.
  const [question] = useState(() => [...quest].sort(() => Math.random() - 0.5));
  const [currentquestion, setcurrentquestion] = useState(0);
  const [answeredQuestion, setAnsweredQuestion] = useState([]);
  const [markedAndAnswer, setMarkedAndAnswer] = useState([]);
  const [markedNotAnswer, setMarkedNotAnswer] = useState([]);
  const [notAnswer, setNotAnswer] = useState([]);
  const [answer, setans] = useState(null);
  const [wrongans, setwrong] = useState(0);
  const [wrongansqus, setwrongansqus] = useState([]);
  const [allAns, setAllAns] = useState({});
  const allAnsRef = useRef({});
  const [mark, setMark] = useState(0);
  const [correctQus, setcorrectQus] = useState([]);
  const [correctAns, setCorrectAns] = useState([]);
  const [animKey, setAnimKey] = useState(0);

  // ── Per-question time tracking ─────────────────────────────────
  const questionTimesRef = useRef({});
  const qStartTimeRef = useRef(Date.now());
  const [qElapsed, setQElapsed] = useState(0);

  const timeLimitMin = Number(testMeta?.timeLimitMin) || 0;
  const isCountdown = timeLimitMin > 0;
  const totalTimeInSeconds = timeLimitMin * 60;

  const [hour, sethour] = useState(0);
  const [min, setmin] = useState(0);
  const [sec, setsec] = useState(0);
  const [reversehour, setreversehour] = useState(() =>
    Math.floor(totalTimeInSeconds / 3600),
  );
  const [reversemin, setreversemin] = useState(() =>
    Math.floor((totalTimeInSeconds % 3600) / 60),
  );
  const [reversesec, setreversesec] = useState(() => totalTimeInSeconds % 60);

  const [isFullscreenActive, setIsFullscreenActive] = useState(true);
  const [hasExitedFullscreen, setHasExitedFullscreen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const cancelSubmitRef = useRef();
  const giveMarkRef = useRef(null);

  const totalAnswered = answeredQuestion.length + markedAndAnswer.length;
  const progressPct =
    question.length > 0
      ? Math.round((totalAnswered / question.length) * 100)
      : 0;
  const unvisited =
    question.length -
    (markedAndAnswer.length +
      markedNotAnswer.length +
      answeredQuestion.length +
      notAnswer.length);

  useEffect(() => {
    allAnsRef.current = allAns;
  }, [allAns]);

  // ── Per-question stopwatch (1-second tick) ─────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      const elapsed = Math.floor((Date.now() - qStartTimeRef.current) / 1000);
      setQElapsed(elapsed);
    }, 1000);
    return () => clearInterval(t);
  }, [currentquestion]);

  const saveQuestionTime = (leavingIdx) => {
    const spent = Math.floor((Date.now() - qStartTimeRef.current) / 1000);
    questionTimesRef.current[leavingIdx] =
      (questionTimesRef.current[leavingIdx] || 0) + spent;
  };

  // ── Fullscreen & security ──────────────────────────────────────
  useEffect(() => {
    let requesting = false;
    const requestFS = async () => {
      if (requesting) return;
      requesting = true;
      const el = document.documentElement;
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) await el.msRequestFullscreen();
        setIsFullscreenActive(true);
      } catch {
        if (hasExitedFullscreen)
          toast({
            title: "Fullscreen Required",
            status: "warning",
            position: "top",
          });
      } finally {
        requesting = false;
      }
    };
    const onFSChange = () => {
      const active = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      if (!active && isFullscreenActive) {
        setIsFullscreenActive(false);
        setHasExitedFullscreen(true);
      } else if (active) setIsFullscreenActive(true);
    };
    const onClick = () => {
      if (!isFullscreenActive && hasExitedFullscreen && !isMobile) requestFS();
    };
    const onPop = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
    };
    const onBefore = (e) => {
      e.preventDefault();
      e.returnValue = "Leave test?";
      return e.returnValue;
    };
    document.addEventListener("fullscreenchange", onFSChange);
    document.addEventListener("webkitfullscreenchange", onFSChange);
    document.addEventListener("click", onClick);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", onPop);
    window.addEventListener("beforeunload", onBefore);
    return () => {
      document.removeEventListener("fullscreenchange", onFSChange);
      document.removeEventListener("webkitfullscreenchange", onFSChange);
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("beforeunload", onBefore);
    };
  }, [isMobile, isFullscreenActive, hasExitedFullscreen, toast]);

  useEffect(() => {
    const h = (e) => {
      e.preventDefault();
      return false;
    };
    document.addEventListener("contextmenu", h);
    return () => document.removeEventListener("contextmenu", h);
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "F11" || e.key === "Escape") e.preventDefault();
      if (e.altKey && e.key === "F4") e.preventDefault();
      if (e.ctrlKey && e.key === "w") e.preventDefault();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  // ── Test-level timer ──────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      if (isCountdown) {
        const rem = reversehour * 3600 + reversemin * 60 + reversesec;
        if (rem <= 0) {
          toast({ title: "Time's Up!", status: "warning", position: "top" });
          giveMarkRef.current?.();
          return;
        }
        if (reversesec > 0) setreversesec((s) => s - 1);
        else if (reversemin > 0) {
          setreversemin((m) => m - 1);
          setreversesec(59);
        } else if (reversehour > 0) {
          setreversehour((h) => h - 1);
          setreversemin(59);
          setreversesec(59);
        }
      } else {
        if (sec < 59) setsec((s) => s + 1);
        else {
          setsec(0);
          if (min < 59) setmin((m) => m + 1);
          else {
            setmin(0);
            sethour((h) => h + 1);
          }
        }
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [hour, min, sec, reversehour, reversemin, reversesec, isCountdown]);

  // ── Navigation ────────────────────────────────────────────────
  const goToQuestion = (idx) => {
    saveQuestionTime(currentquestion);
    qStartTimeRef.current = Date.now();
    setQElapsed(0);
    setcurrentquestion(idx);
    const savedIndex = allAnsRef.current[idx];
    setans(
      savedIndex !== undefined
        ? (question[idx]?.options?.[savedIndex] ?? null)
        : null,
    );
    setAnimKey((k) => k + 1);
  };

  const handlequestion = (con) => {
    if (con === "svn") {
      if (
        answer !== null &&
        allAnsRef.current[currentquestion] !== undefined &&
        !answeredQuestion.includes(currentquestion)
      ) {
        if (markedNotAnswer.includes(currentquestion))
          markedNotAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
        if (notAnswer.includes(currentquestion))
          notAnswer.splice(notAnswer.indexOf(currentquestion), 1);
        if (markedAndAnswer.includes(currentquestion))
          markedAndAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
        setAnsweredQuestion([...answeredQuestion, currentquestion]);
        if (question.length - 1 > currentquestion)
          goToQuestion(currentquestion + 1);
      } else if (
        allAnsRef.current[currentquestion] === undefined &&
        answer === null
      ) {
        if (!notAnswer.includes(currentquestion)) {
          if (markedNotAnswer.includes(currentquestion))
            markedNotAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
          if (markedAndAnswer.includes(currentquestion))
            markedAndAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
          if (answeredQuestion.includes(currentquestion))
            answeredQuestion.splice(
              answeredQuestion.indexOf(currentquestion),
              1,
            );
          setNotAnswer([...notAnswer, currentquestion]);
        }
      }
      if (question.length - 1 > currentquestion)
        goToQuestion(currentquestion + 1);
    } else {
      if (
        answer !== null &&
        allAnsRef.current[currentquestion] !== undefined &&
        !answeredQuestion.includes(currentquestion)
      ) {
        if (markedNotAnswer.includes(currentquestion))
          markedNotAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
        if (notAnswer.includes(currentquestion))
          notAnswer.splice(notAnswer.indexOf(currentquestion), 1);
        if (markedAndAnswer.includes(currentquestion))
          markedAndAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
        setAnsweredQuestion([...answeredQuestion, currentquestion]);
      } else if (
        answer === null &&
        allAnsRef.current[currentquestion] === undefined &&
        !notAnswer.includes(currentquestion) &&
        currentquestion !== con
      ) {
        if (markedNotAnswer.includes(currentquestion))
          markedNotAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
        if (markedAndAnswer.includes(currentquestion))
          markedAndAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
        if (answeredQuestion.includes(currentquestion))
          answeredQuestion.splice(answeredQuestion.indexOf(currentquestion), 1);
        setNotAnswer([...notAnswer, currentquestion]);
      }
      if (con !== isNaN) goToQuestion(con);
    }
  };

  const markedQuestion = () => {
    if (allAnsRef.current[currentquestion] === undefined && answer !== null)
      setAllAns((p) => {
        const n = {
          ...p,
          [currentquestion]:
            question[currentquestion]?.options?.indexOf(answer),
        };
        allAnsRef.current = n;
        return n;
      });
    if (
      allAnsRef.current[currentquestion] !== undefined &&
      !markedAndAnswer.includes(currentquestion)
    ) {
      if (answeredQuestion.includes(currentquestion))
        answeredQuestion.splice(answeredQuestion.indexOf(currentquestion), 1);
      if (markedNotAnswer.includes(currentquestion))
        notAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
      if (notAnswer.includes(currentquestion))
        notAnswer.splice(notAnswer.indexOf(currentquestion), 1);
      setMarkedAndAnswer([...markedAndAnswer, currentquestion]);
      setans(null);
    } else if (
      allAnsRef.current[currentquestion] === undefined &&
      !markedNotAnswer.includes(currentquestion)
    ) {
      setAllAns((p) => {
        const u = { ...p };
        delete u[currentquestion];
        allAnsRef.current = u;
        return u;
      });
      if (answeredQuestion.includes(currentquestion))
        answeredQuestion.splice(answeredQuestion.indexOf(currentquestion), 1);
      if (markedAndAnswer.includes(currentquestion))
        notAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
      if (notAnswer.includes(currentquestion))
        notAnswer.splice(notAnswer.indexOf(currentquestion), 1);
      setMarkedNotAnswer([...markedNotAnswer, currentquestion]);
    }
    if (question.length - 1 > currentquestion)
      goToQuestion(currentquestion + 1);
  };

  const handleAnswer = (optionText, optionIndex) => {
    setans(optionText);
    const isCorrect = question[currentquestion].answer === optionIndex;
    if (isCorrect && !correctAns.includes(currentquestion)) {
      if (wrongansqus.includes(currentquestion)) {
        setwrong((w) => w - 1);
        wrongansqus.splice(wrongansqus.indexOf(currentquestion), 1);
      }
      setMark((m) => m + 1);
      setcorrectQus((p) => [...p, currentquestion]);
      setCorrectAns((p) => [...p, currentquestion]);
    } else if (!isCorrect && correctAns.includes(currentquestion)) {
      correctAns.splice(correctAns.indexOf(currentquestion), 1);
      correctQus.splice(correctQus.indexOf(currentquestion), 1);
      setMark((m) => m - 1);
      setwrong((w) => w + 1);
    }
    if (
      !isCorrect &&
      !correctAns.includes(currentquestion) &&
      !wrongansqus.includes(currentquestion)
    ) {
      setwrong((w) => w + 1);
      setwrongansqus((p) => [...p, currentquestion]);
    }
    setAllAns((p) => {
      const n = { ...p, [currentquestion]: optionIndex };
      allAnsRef.current = n;
      return n;
    });
  };

  const handleClearAnswer = (qi) => {
    if (answeredQuestion.includes(currentquestion))
      answeredQuestion.splice(answeredQuestion.indexOf(currentquestion), 1);
    if (markedAndAnswer.includes(currentquestion))
      markedAndAnswer.splice(markedAndAnswer.indexOf(currentquestion), 1);
    if (markedNotAnswer.includes(currentquestion))
      markedNotAnswer.splice(markedNotAnswer.indexOf(currentquestion), 1);
    setAllAns((p) => {
      const u = { ...p };
      delete u[qi];
      allAnsRef.current = u;
      return u;
    });
    if (!notAnswer.includes(currentquestion))
      setNotAnswer([...notAnswer, currentquestion]);
    setans(null);
  };

  const giveMark = async () => {
    // Save final question's time before submitting
    saveQuestionTime(currentquestion);

    try {
      const subject = testMeta?.subject || "";
      const category = testMeta?.category || subject;
      const timeTaken = isCountdown
        ? totalTimeInSeconds -
          (reversehour * 3600 + reversemin * 60 + reversesec)
        : hour * 3600 + min * 60 + sec;
      const scorePercentage =
        question.length > 0 ? Math.round((mark / question.length) * 100) : 0;
      let apiPercentile = null,
        savedResultId = null;

      if (testMeta?.testId) {
        try {
          const res = await resultsAPI.submit({
            testId: testMeta.testId,
            score: mark,
            totalQuestions: question.length,
            wrongAnswers: wrongans,
            timeTaken,
            allAnswers: allAnsRef.current,
            questionTimes: questionTimesRef.current,
            correctQus,
            wrongQus: wrongansqus,
            answeredQus: answeredQuestion,
            notAnsweredQus: notAnswer,
            markedAndAnswered: markedAndAnswer,
            markedNotAnswered: markedNotAnswer,
            // ── Store the shuffled question order ──────────────────────────
            // allAnswers indices are based on this shuffled array.
            // The backend saves this so ResultPage can reconstruct the correct
            // answer↔question mapping when the owner views the result.
            shuffledQuestions: question,
          });
          apiPercentile = res.data?.percentile ?? res.percentile ?? null;
          savedResultId = res.data?._id ?? res._id ?? null;
          // NOTE: Do NOT emit any socket event here.
          // The backend emits "test:attempted" only on the student's first attempt.
          // Client-side emits would fire on every retake and pollute the leaderboard.
        } catch (err) {
          console.error("Save result error:", err);
        }
      }

      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      if (handleFullScreen) handleFullScreen(false);

      navigate("/test-result", {
        replace: true,
        state: {
          testId: testMeta?.testId,
          testTitle: testMeta?.testTitle || testMeta?.category || subject,
          subject,
          category,
          score: mark,
          totalQuestions: question.length,
          scorePercentage,
          percentile: apiPercentile,
          savedResultId,
          timeTaken,
          // Pass the shuffled array so the student's own ResultPage also uses
          // the correct question order (same as what was shown during the test)
          shuffledQuestions: question,
          questions: question,
          allAnswers: allAnsRef.current,
          questionTimes: { ...questionTimesRef.current },
          correctQus,
          wrongansqus,
          answeredQuestion,
          notAnswer,
          markedAndAnswer,
          markedNotAnswer,
          wrongans,
        },
      });
    } catch (error) {
      console.error("Submit error:", error);
      navigate("/test-result", { replace: true });
    }
  };

  giveMarkRef.current = giveMark;

  const enterFullscreen = async () => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      setIsFullscreenActive(true);
    } catch {
      toast({ title: "Fullscreen Failed", status: "error", position: "top" });
    }
  };

  const currentStatus = getQStatus(currentquestion, {
    answeredQuestion,
    markedAndAnswer,
    markedNotAnswer,
    notAnswer,
  });
  const letters = ["A", "B", "C", "D", "E", "F"];

  const QuestionSidebar = () => (
    <Flex direction="column" h="100%" overflow="hidden">
      <Box
        px={5}
        py={4}
        borderBottom="1px solid rgba(255,255,255,.09)"
        flexShrink={0}
      >
        <Text
          fontSize="12px"
          fontWeight={800}
          color="white"
          textTransform="uppercase"
          letterSpacing="1px"
        >
          Navigator
        </Text>
        <Text fontSize="11px" color="rgba(255,255,255,.4)" mt={0.5}>
          {testMeta?.subject || "General"} · {question.length} Qs
        </Text>
      </Box>
      <Box
        px={5}
        py={3}
        borderBottom="1px solid rgba(255,255,255,.07)"
        flexShrink={0}
      >
        <Flex justify="space-between" mb={1.5}>
          <Text
            fontSize="10px"
            color="rgba(255,255,255,.45)"
            fontWeight={700}
            textTransform="uppercase"
            letterSpacing=".8px"
          >
            Progress
          </Text>
          <Text fontSize="10px" color="rgba(255,255,255,.75)" fontWeight={800}>
            {totalAnswered}/{question.length}
          </Text>
        </Flex>
        <Box
          h="5px"
          bg="rgba(255,255,255,.1)"
          borderRadius="full"
          overflow="hidden"
        >
          <Box
            h="100%"
            bg="linear-gradient(90deg,#14b8a6,#38bdf8)"
            w={`${progressPct}%`}
            borderRadius="full"
            transition="width .5s ease"
          />
        </Box>
      </Box>
      <Box
        px={5}
        py={3}
        borderBottom="1px solid rgba(255,255,255,.07)"
        flexShrink={0}
      >
        <Grid templateColumns="1fr 1fr" gap={1.5}>
          {["answered", "skipped", "marked", "markedAnswered", "unvisited"].map(
            (st) => (
              <LegendItem
                key={st}
                status={st}
                count={
                  st === "answered"
                    ? answeredQuestion.length
                    : st === "skipped"
                      ? notAnswer.length
                      : st === "marked"
                        ? markedNotAnswer.length
                        : st === "markedAnswered"
                          ? markedAndAnswer.length
                          : unvisited
                }
              />
            ),
          )}
        </Grid>
      </Box>
      <Box
        flex={1}
        overflowY="auto"
        px={5}
        py={4}
        css={{
          "&::-webkit-scrollbar": { width: "3px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,.15)",
            borderRadius: "3px",
          },
        }}
      >
        <Grid templateColumns="repeat(5,1fr)" gap={2}>
          {question.map((_, i) => {
            const st = getQStatus(i, {
              answeredQuestion,
              markedAndAnswer,
              markedNotAnswer,
              notAnswer,
            });
            const s = STATUS_STYLE[st];
            const cur = i === currentquestion;
            return (
              <Center
                key={i}
                w="100%"
                h="36px"
                cursor="pointer"
                onClick={() => {
                  goToQuestion(i);
                  if (isMobile) onClose();
                }}
                bg={cur ? "rgba(255,255,255,.28)" : s.bg}
                color={cur ? "white" : s.color}
                borderRadius={s.radius}
                border={
                  cur
                    ? "2px solid white"
                    : st === "unvisited"
                      ? "1px solid rgba(255,255,255,.18)"
                      : "none"
                }
                fontSize="10px"
                fontWeight={900}
                transform={cur ? "scale(1.1)" : "scale(1)"}
                boxShadow={cur ? "0 0 0 3px rgba(255,255,255,.25)" : "none"}
                transition="all .15s"
                _hover={{
                  opacity: 0.85,
                  transform: cur ? "scale(1.1)" : "scale(1.04)",
                }}
              >
                {i + 1}
              </Center>
            );
          })}
        </Grid>
      </Box>
      <Box
        px={5}
        py={4}
        borderTop="1px solid rgba(255,255,255,.09)"
        flexShrink={0}
      >
        <Button
          w="full"
          h="44px"
          borderRadius="12px"
          bg="linear-gradient(135deg,#0d9488,#0891b2)"
          color="white"
          fontWeight={800}
          fontSize="13px"
          leftIcon={<Icon as={FaPaperPlane} fontSize="12px" />}
          onClick={() => setIsSubmitDialogOpen(true)}
          _hover={{
            opacity: 0.9,
            transform: "translateY(-1px)",
            boxShadow: "0 8px 24px rgba(13,148,136,.4)",
          }}
          transition="all .15s"
        >
          Submit Test
        </Button>
      </Box>
    </Flex>
  );

  return (
    <Box
      h="100vh"
      display="flex"
      flexDirection="column"
      bg="#f0f4fa"
      fontFamily="'DM Sans',sans-serif"
      position="relative"
    >
      {!isMobile && !isFullscreenActive && hasExitedFullscreen && (
        <Box
          position="fixed"
          inset={0}
          bg="rgba(11,30,61,.96)"
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={enterFullscreen}
          cursor="pointer"
        >
          <VStack spacing={5} color="white" textAlign="center" p={8}>
            <Text fontSize="52px" lineHeight="1">
              ⚠️
            </Text>
            <Box>
              <Text
                fontSize="26px"
                fontWeight={900}
                letterSpacing="-1px"
                mb={2}
              >
                Fullscreen Required
              </Text>
              <Text
                fontSize="14px"
                color="rgba(255,255,255,.55)"
                maxW="360px"
                lineHeight="1.6"
              >
                Stay in fullscreen mode to maintain exam integrity.
              </Text>
            </Box>
            <Button
              size="lg"
              h="52px"
              px={8}
              borderRadius="14px"
              bg="linear-gradient(135deg,#2563eb,#1e40af)"
              color="white"
              fontWeight={800}
              leftIcon={<Icon as={FaExpand} />}
              onClick={enterFullscreen}
              _hover={{
                opacity: 0.9,
                transform: "translateY(-2px)",
                boxShadow: "0 12px 32px rgba(37,99,235,.4)",
              }}
              transition="all .2s"
            >
              Re-enter Fullscreen
            </Button>
          </VStack>
        </Box>
      )}

      {/* Header */}
      <Flex
        bg="linear-gradient(135deg,#0b1e3d 0%,#132952 60%,#1a3a6e 100%)"
        px={{ base: 3, md: 5 }}
        h={{ base: "56px", md: "62px" }}
        align="center"
        justify="space-between"
        flexShrink={0}
        boxShadow="0 2px 16px rgba(11,30,61,.5)"
        position="relative"
        zIndex={10}
      >
        <Flex align="center" gap={3}>
          <Box
            w="30px"
            h="30px"
            bg="linear-gradient(135deg,#2563eb,#7c3aed)"
            borderRadius="8px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <Text fontSize="15px">📋</Text>
          </Box>
          <Box display={{ base: "none", sm: "block" }}>
            <Text
              fontSize="13px"
              fontWeight={900}
              color="white"
              letterSpacing="-0.3px"
              lineHeight="1.1"
            >
              {testMeta?.testTitle || "Test"}
            </Text>
            <Text
              fontSize="10px"
              color="rgba(255,255,255,.38)"
              fontWeight={600}
              textTransform="uppercase"
              letterSpacing=".8px"
            >
              {testMeta?.subject || "General"}
            </Text>
          </Box>
        </Flex>
        <TimerWidget
          h={isCountdown ? reversehour : hour}
          m={isCountdown ? reversemin : min}
          s={isCountdown ? reversesec : sec}
          isCountdown={isCountdown}
        />
        <HStack spacing={2}>
          {!isMobile && !isFullscreenActive && (
            <Button
              size="sm"
              h="32px"
              px={3}
              borderRadius="8px"
              bg="rgba(255,255,255,.09)"
              color="rgba(255,255,255,.75)"
              border="1px solid rgba(255,255,255,.12)"
              fontWeight={700}
              fontSize="11px"
              leftIcon={<Icon as={FaExpand} fontSize="10px" />}
              onClick={enterFullscreen}
              _hover={{ bg: "rgba(255,255,255,.15)" }}
            >
              Fullscreen
            </Button>
          )}
          <ModalPause
            markedAndAnswer={markedAndAnswer}
            question={question}
            markedNotAnswer={markedNotAnswer}
            notAnswer={notAnswer}
            answered={answeredQuestion}
          />
          {isMobile && (
            <Button
              onClick={onOpen}
              h="32px"
              w="32px"
              p={0}
              minW="32px"
              borderRadius="8px"
              bg="rgba(255,255,255,.09)"
              border="1px solid rgba(255,255,255,.12)"
              _hover={{ bg: "rgba(255,255,255,.16)" }}
            >
              <Icon as={FaListUl} color="white" fontSize="12px" />
            </Button>
          )}
        </HStack>
      </Flex>

      {/* Progress strip */}
      <Box h="3px" bg="rgba(37,99,235,.12)" flexShrink={0}>
        <Box
          h="100%"
          bg="linear-gradient(90deg,#2563eb,#0d9488)"
          w={`${progressPct}%`}
          transition="width .6s ease"
          boxShadow="0 0 8px rgba(37,99,235,.45)"
        />
      </Box>

      <Flex flex={1} overflow="hidden">
        <Flex direction="column" flex={1} overflow="hidden">
          {/* Sub-header with question status + per-question timer */}
          <Flex
            px={{ base: 4, md: 6 }}
            py={3}
            bg="white"
            align="center"
            justify="space-between"
            borderBottom="1px solid #e8eef7"
            flexShrink={0}
          >
            <Flex align="center" gap={3}>
              <Box
                bg="linear-gradient(135deg,#2563eb,#1e40af)"
                px={3}
                py={1}
                borderRadius="8px"
              >
                <Text
                  fontSize="12px"
                  fontWeight={900}
                  color="white"
                  letterSpacing=".3px"
                >
                  Q {currentquestion + 1} / {question.length}
                </Text>
              </Box>
              {currentStatus !== "unvisited" && (
                <Badge
                  px={2.5}
                  py={0.5}
                  borderRadius="6px"
                  fontSize="10px"
                  fontWeight={800}
                  color={STATUS_STYLE[currentStatus].bg}
                  bg={STATUS_STYLE[currentStatus].bg + "18"}
                >
                  {STATUS_STYLE[currentStatus].label}
                </Badge>
              )}
              <QuestionTimer elapsed={qElapsed} />
            </Flex>
            <ReportQuestionDropdown />
          </Flex>

          {/* Question + Options */}
          <Box
            flex={1}
            overflowY="auto"
            px={{ base: 4, md: 6 }}
            py={6}
            css={{
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#e2e8f0",
                borderRadius: "4px",
              },
            }}
          >
            <Box
              bg="white"
              borderRadius="16px"
              border="1px solid #e8eef7"
              p={{ base: 4, md: 6 }}
              mb={5}
              boxShadow="0 2px 12px rgba(0,0,0,.04)"
            >
              <Flex align="flex-start" gap={3}>
                <Flex
                  w="28px"
                  h="28px"
                  bg="#eff6ff"
                  borderRadius="8px"
                  flexShrink={0}
                  align="center"
                  justify="center"
                  mt="2px"
                >
                  <Text fontSize="11px" fontWeight={900} color={C.blue}>
                    {currentquestion + 1}
                  </Text>
                </Flex>
                <Text
                  fontSize="15px"
                  lineHeight="1.8"
                  color={C.text}
                  fontWeight={500}
                  flex={1}
                >
                  {question[currentquestion]?.qus}
                </Text>
              </Flex>
            </Box>

            <VStack spacing={3} align="stretch">
              {question[currentquestion]?.options.map((opt, i) => {
                const sel = answer === opt;
                return (
                  <Box
                    key={`${animKey}-${i}`}
                    p={4}
                    borderRadius="14px"
                    cursor="pointer"
                    border="1.5px solid"
                    borderColor={sel ? C.blue : "#e2e8f0"}
                    bg={
                      sel ? "linear-gradient(135deg,#eff6ff,#f0f9ff)" : "white"
                    }
                    boxShadow={
                      sel
                        ? "0 0 0 3px rgba(37,99,235,.1),0 4px 16px rgba(37,99,235,.08)"
                        : "0 1px 4px rgba(0,0,0,.04)"
                    }
                    transition="all .15s"
                    _hover={{
                      borderColor: sel ? C.blue : "#94a3b8",
                      transform: "translateY(-1px)",
                      boxShadow: sel ? undefined : "0 4px 14px rgba(0,0,0,.07)",
                    }}
                    onClick={() => handleAnswer(opt, i)}
                  >
                    <Flex align="center" gap={4}>
                      <Center
                        w="34px"
                        h="34px"
                        borderRadius="10px"
                        flexShrink={0}
                        bg={sel ? C.blue : "#f1f5f9"}
                        color={sel ? "white" : C.muted}
                        fontSize="13px"
                        fontWeight={900}
                        transition="all .15s"
                      >
                        {sel ? (
                          <Icon as={FaCheckCircle} fontSize="14px" />
                        ) : (
                          letters[i] || i + 1
                        )}
                      </Center>
                      <Text
                        fontSize="14px"
                        fontWeight={sel ? 700 : 500}
                        color={sel ? C.blue : C.text}
                        lineHeight="1.5"
                        flex={1}
                      >
                        {opt}
                      </Text>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          </Box>

          {/* Bottom bar */}
          <Box
            px={{ base: 4, md: 6 }}
            py={{ base: 3, md: 4 }}
            bg="white"
            borderTop="1px solid #e8eef7"
            flexShrink={0}
          >
            <Flex
              justify="space-between"
              align="center"
              gap={3}
              flexWrap="wrap"
            >
              <HStack spacing={2}>
                <Button
                  h="40px"
                  px={3}
                  borderRadius="11px"
                  bg="#f1f5f9"
                  color={C.muted}
                  fontWeight={700}
                  fontSize="12px"
                  leftIcon={<Icon as={FaChevronLeft} fontSize="10px" />}
                  isDisabled={currentquestion === 0}
                  onClick={() => goToQuestion(currentquestion - 1)}
                  _hover={{ bg: "#e2e8f0" }}
                  _disabled={{ opacity: 0.4 }}
                >
                  Prev
                </Button>
                <Button
                  h="40px"
                  px={3}
                  borderRadius="11px"
                  bg="#faf5ff"
                  color={C.purple}
                  border="1px solid #e9d5ff"
                  fontWeight={700}
                  fontSize="12px"
                  leftIcon={<Icon as={FaBookmark} fontSize="10px" />}
                  onClick={markedQuestion}
                  _hover={{ bg: "#f3e8ff" }}
                >
                  Review
                </Button>
                <Button
                  h="40px"
                  px={3}
                  borderRadius="11px"
                  bg="#fff7ed"
                  color={C.amber}
                  border="1px solid #fed7aa"
                  fontWeight={700}
                  fontSize="12px"
                  leftIcon={<Icon as={FaEraser} fontSize="10px" />}
                  onClick={() => handleClearAnswer(currentquestion)}
                  _hover={{ bg: "#ffedd5" }}
                >
                  Clear
                </Button>
              </HStack>
              <HStack spacing={2}>
                <Button
                  h="40px"
                  px={5}
                  borderRadius="11px"
                  bg="linear-gradient(135deg,#2563eb,#1e40af)"
                  color="white"
                  fontWeight={800}
                  fontSize="13px"
                  rightIcon={<Icon as={FaChevronRight} fontSize="10px" />}
                  onClick={() => handlequestion("svn")}
                  _hover={{
                    opacity: 0.9,
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(37,99,235,.35)",
                  }}
                  transition="all .15s"
                >
                  Save & Next
                </Button>
                {!isMobile && (
                  <Button
                    h="40px"
                    px={4}
                    borderRadius="11px"
                    bg="linear-gradient(135deg,#0d9488,#0891b2)"
                    color="white"
                    fontWeight={800}
                    fontSize="13px"
                    leftIcon={<Icon as={FaPaperPlane} fontSize="11px" />}
                    onClick={() => setIsSubmitDialogOpen(true)}
                    _hover={{
                      opacity: 0.9,
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 20px rgba(13,148,136,.35)",
                    }}
                    transition="all .15s"
                  >
                    Submit
                  </Button>
                )}
              </HStack>
            </Flex>
            {isMobile && (
              <Flex mt={3} gap={1.5} flexWrap="wrap" justify="center">
                {question.map((_, i) => {
                  const st = getQStatus(i, {
                    answeredQuestion,
                    markedAndAnswer,
                    markedNotAnswer,
                    notAnswer,
                  });
                  const s = STATUS_STYLE[st];
                  const cur = i === currentquestion;
                  return (
                    <Center
                      key={i}
                      w="26px"
                      h="26px"
                      cursor="pointer"
                      borderRadius={s.radius}
                      fontSize="9px"
                      fontWeight={900}
                      bg={cur ? C.blue : s.bg}
                      color={cur ? "white" : s.color}
                      border={st === "unvisited" ? "1px solid #cbd5e1" : "none"}
                      boxShadow={cur ? `0 0 0 2px rgba(37,99,235,.4)` : "none"}
                      onClick={() => goToQuestion(i)}
                    >
                      {i + 1}
                    </Center>
                  );
                })}
              </Flex>
            )}
          </Box>
        </Flex>

        {!isMobile && (
          <Box
            w="272px"
            flexShrink={0}
            bg="linear-gradient(180deg,#0b1e3d 0%,#132952 100%)"
            borderLeft="1px solid rgba(255,255,255,.06)"
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            <QuestionSidebar />
          </Box>
        )}
      </Flex>

      {isMobile && (
        <Drawer onClose={onClose} isOpen={isOpen} size="xs" placement="right">
          <DrawerOverlay backdropFilter="blur(4px)" />
          <DrawerContent
            bg="linear-gradient(180deg,#0b1e3d,#132952)"
            borderLeft="none"
          >
            <DrawerCloseButton color="white" top={4} right={4} />
            <DrawerBody p={0} pt={10}>
              <QuestionSidebar />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      <AlertDialog
        isOpen={isSubmitDialogOpen}
        leastDestructiveRef={cancelSubmitRef}
        onClose={() => setIsSubmitDialogOpen(false)}
        isCentered
      >
        <AlertDialogOverlay backdropFilter="blur(6px)">
          <AlertDialogContent
            mx={4}
            borderRadius="20px"
            overflow="hidden"
            fontFamily="'DM Sans',sans-serif"
            boxShadow="0 24px 64px rgba(0,0,0,.2)"
          >
            <Box bg="linear-gradient(135deg,#0b1e3d,#132952)" px={6} py={5}>
              <Flex align="center" gap={3}>
                <Box
                  w="38px"
                  h="38px"
                  bg="rgba(255,255,255,.1)"
                  borderRadius="11px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaPaperPlane} color="white" fontSize="15px" />
                </Box>
                <Box>
                  <Text
                    fontSize="16px"
                    fontWeight={900}
                    color="white"
                    letterSpacing="-0.5px"
                  >
                    Submit Test?
                  </Text>
                  <Text fontSize="11px" color="rgba(255,255,255,.45)">
                    This action cannot be undone
                  </Text>
                </Box>
              </Flex>
            </Box>
            <AlertDialogBody p={5}>
              <Grid templateColumns="repeat(3,1fr)" gap={3} mb={4}>
                {[
                  {
                    label: "Total",
                    value: question.length,
                    color: C.blue,
                    bg: "#eff6ff",
                  },
                  {
                    label: "Answered",
                    value: answeredQuestion.length,
                    color: C.green,
                    bg: "#f0fdf4",
                  },
                  {
                    label: "Skipped",
                    value: notAnswer.length,
                    color: C.red,
                    bg: "#fef2f2",
                  },
                  {
                    label: "Marked",
                    value: markedNotAnswer.length + markedAndAnswer.length,
                    color: C.purple,
                    bg: "#f5f3ff",
                  },
                  {
                    label: "Unvisited",
                    value: unvisited,
                    color: C.muted,
                    bg: "#f8fafc",
                  },
                ].map(({ label, value, color, bg }) => (
                  <Box
                    key={label}
                    bg={bg}
                    borderRadius="12px"
                    p={3}
                    textAlign="center"
                  >
                    <Text
                      fontSize="22px"
                      fontWeight={900}
                      color={color}
                      letterSpacing="-1px"
                      lineHeight="1"
                    >
                      {value}
                    </Text>
                    <Text
                      fontSize="10px"
                      color={C.muted}
                      fontWeight={700}
                      mt={1}
                      textTransform="uppercase"
                      letterSpacing=".5px"
                    >
                      {label}
                    </Text>
                  </Box>
                ))}
              </Grid>
              <Flex
                align="center"
                gap={2.5}
                bg="#fff7ed"
                borderRadius="10px"
                p={3}
                border="1px solid #fed7aa"
              >
                <Icon
                  as={FaExclamationTriangle}
                  color={C.amber}
                  fontSize="13px"
                  flexShrink={0}
                />
                <Text
                  fontSize="12px"
                  color="#92400e"
                  fontWeight={600}
                  lineHeight="1.5"
                >
                  Once submitted, answers cannot be changed.
                </Text>
              </Flex>
            </AlertDialogBody>
            <AlertDialogFooter gap={3} px={5} pb={5}>
              <Button
                ref={cancelSubmitRef}
                flex={1}
                h="46px"
                borderRadius="12px"
                bg="#f1f5f9"
                color={C.muted}
                fontWeight={700}
                onClick={() => setIsSubmitDialogOpen(false)}
                _hover={{ bg: "#e2e8f0" }}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                h="46px"
                borderRadius="12px"
                bg="linear-gradient(135deg,#0d9488,#0891b2)"
                color="white"
                fontWeight={800}
                leftIcon={<Icon as={FaPaperPlane} fontSize="12px" />}
                onClick={() => {
                  setIsSubmitDialogOpen(false);
                  giveMark();
                }}
                _hover={{
                  opacity: 0.9,
                  boxShadow: "0 8px 24px rgba(13,148,136,.4)",
                }}
                transition="all .15s"
              >
                Submit Test
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default TakeTest;