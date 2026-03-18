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

//   const [isFullscreenActive, setIsFullscreenActive] = useState(false);
//   const [hasExitedFullscreen, setHasExitedFullscreen] = useState(false);
//   const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
//   const cancelSubmitRef = useRef();
//   const giveMarkRef = useRef(null);

//   // ── Request fullscreen on mount ────────────────────────────────
//   useEffect(() => {
//     if (isMobile) return; // skip fullscreen enforcement on mobile
//     const requestFS = async () => {
//       const el = document.documentElement;
//       try {
//         if (el.requestFullscreen) await el.requestFullscreen();
//         else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
//         else if (el.msRequestFullscreen) await el.msRequestFullscreen();
//         setIsFullscreenActive(true);
//       } catch {
//         // Browser blocked auto-fullscreen — user will see the overlay prompt
//         setIsFullscreenActive(false);
//       }
//     };
//     requestFS();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []); // run once on mount

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
//           // NOTE: Do NOT emit any socket event here.
//           // The backend emits "test:attempted" only on the student's first attempt.
//           // Client-side emits would fire on every retake and pollute the leaderboard.
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
//       {!isMobile && !isFullscreenActive && (
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

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
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
  AlertDialogContent,
  AlertDialogOverlay,
  Icon,
  IconButton,
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
  FaLayerGroup,
  FaFlag,
  FaStopwatch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import {
  MdOutlineBookmarkBorder,
  MdBookmark,
  MdOutlineReport,
} from "react-icons/md";

/* ─── Tokens ─────────────────────────────────────────────────────────────── */
const C = {
  bg: "#0b1e3d",
  bgCard: "#132952",
  bgElevated: "#1a3a6e",
  bgOption: "#0f2240",
  bgLine: "rgba(255,255,255,.07)",
  blue: "#2563eb",
  blueDk: "#1e40af",
  blueGlow: "rgba(37,99,235,.35)",
  teal: "#0d9488",
  tealDk: "#0f766e",
  tealGlow: "rgba(13,148,136,.35)",
  green: "#16a34a",
  greenBg: "rgba(22,163,74,.18)",
  red: "#dc2626",
  redBg: "rgba(220,38,38,.18)",
  purple: "#7c3aed",
  purpleBg: "rgba(124,58,237,.18)",
  amber: "#d97706",
  amberBg: "rgba(217,119,6,.18)",
  sky: "#38bdf8",
  textPrimary: "#f1f5f9",
  textSecondary: "rgba(255,255,255,.55)",
  textMuted: "rgba(255,255,255,.3)",
  border: "rgba(255,255,255,.09)",
  borderMid: "rgba(255,255,255,.14)",
};

const pad = (n) => String(n).padStart(2, "0");
const LETTERS = ["A", "B", "C", "D", "E", "F"];

const STATUS = {
  answered: {
    palBg: "#16a34a",
    palRadius: "10px 10px 3px 3px",
    dot: "#16a34a",
    label: "Answered",
  },
  skipped: {
    palBg: "#dc2626",
    palRadius: "3px 3px 10px 10px",
    dot: "#dc2626",
    label: "Not Answered",
  },
  marked: {
    palBg: "#7c3aed",
    palRadius: "50%",
    dot: "#7c3aed",
    label: "Marked",
  },
  markedAnswered: {
    palBg: "#d97706",
    palRadius: "50%",
    dot: "#d97706",
    label: "Marked & Ans.",
  },
  unvisited: {
    palBg: "transparent",
    palRadius: "8px",
    dot: "rgba(255,255,255,.3)",
    label: "Not Visited",
  },
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

const Bubble = ({ label, isCurrent, status, onClick }) => {
  const s = STATUS[status];
  return (
    <Center
      w="36px"
      h="36px"
      cursor="pointer"
      flexShrink={0}
      bg={isCurrent ? C.blue : s.palBg}
      borderRadius={isCurrent ? "10px" : s.palRadius}
      color={
        isCurrent ? "white" : status === "unvisited" ? C.textMuted : "white"
      }
      fontSize="11px"
      fontWeight={900}
      border={
        isCurrent
          ? "2px solid white"
          : status === "unvisited"
            ? `1px solid ${C.borderMid}`
            : "none"
      }
      boxShadow={isCurrent ? `0 4px 16px ${C.blueGlow}` : "none"}
      transform={isCurrent ? "scale(1.1)" : "scale(1)"}
      transition="all .14s cubic-bezier(.4,0,.2,1)"
      onClick={onClick}
      _active={{ transform: "scale(.92)", transition: "transform .07s" }}
    >
      {label}
    </Center>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════════════════ */
const TakeTest = ({ handleFullScreen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const quest = location.state?.quest ?? [];
  const testMeta = location.state?.testMeta ?? {};

  const isSectioned = testMeta?.isSectioned === true;
  const sectionMeta = Array.isArray(testMeta?.sections)
    ? testMeta.sections
    : [];

  /* Shuffle */
  const [question] = useState(() => {
    if (!isSectioned || !sectionMeta.length)
      return [...quest].sort(() => Math.random() - 0.5);
    let offset = 0;
    const result = [];
    sectionMeta.forEach((sec) => {
      const count = sec.count || 0;
      result.push(
        ...[...quest.slice(offset, offset + count)].sort(
          () => Math.random() - 0.5,
        ),
      );
      offset += count;
    });
    return result;
  });

  /* Section boundaries */
  const sectionBoundaries = useMemo(() => {
    if (!isSectioned || !sectionMeta.length) return [];
    const result = [];
    let offset = 0;
    sectionMeta.forEach((sec, sIdx) => {
      const count = sec.count || 0;
      for (let i = 0; i < count; i++)
        result.push({
          sectionIdx: sIdx,
          sectionName: sec.name || sec.subject || `Section ${sIdx + 1}`,
          localIdx: i,
          sectionStart: offset,
          sectionEnd: offset + count - 1,
        });
      offset += count;
    });
    return result;
  }, [isSectioned, sectionMeta]);

  /* Core state */
  const [currentQ, setCurrentQ] = useState(0);
  const [currentSec, setCurrentSec] = useState(0);
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

  /* ── Timer pause support ──────────────────────────────────────────────── */
  const [timerPaused, setTimerPaused] = useState(false);

  const questionTimesRef = useRef({});
  const qStartTimeRef = useRef(Date.now());
  const [qElapsed, setQElapsed] = useState(0);

  const timeLimitMin = Number(testMeta?.timeLimitMin) || 0;
  const isCountdown = timeLimitMin > 0;
  const totalTimeInSeconds = timeLimitMin * 60;

  const [hour, sethour] = useState(0);
  const [min, setmin] = useState(0);
  const [sec, setsec] = useState(0);
  const [rh, setrh] = useState(() => Math.floor(totalTimeInSeconds / 3600));
  const [rm, setrm] = useState(() =>
    Math.floor((totalTimeInSeconds % 3600) / 60),
  );
  const [rs, setrs] = useState(() => totalTimeInSeconds % 60);

  const [fsActive, setFsActive] = useState(false);
  const [hasExitedFs, setHasExitedFs] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const cancelRef = useRef();
  const giveMarkRef = useRef(null);

  /* Derived */
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
  const currentSecInfo = isSectioned && sectionBoundaries[currentQ];
  const localQNum = currentSecInfo ? currentSecInfo.localIdx + 1 : currentQ + 1;
  const secTotal = currentSecInfo
    ? sectionMeta[currentSecInfo.sectionIdx]?.count || 0
    : question.length;
  const currentStatus = getQStatus(currentQ, {
    answeredQuestion,
    markedAndAnswer,
    markedNotAnswer,
    notAnswer,
  });
  const timerH = isCountdown ? rh : hour;
  const timerM = isCountdown ? rm : min;
  const timerS = isCountdown ? rs : sec;
  const remSec = timerH * 3600 + timerM * 60 + timerS;
  const timerUrgent = isCountdown && remSec <= 300;
  const timerWarn = isCountdown && remSec <= 600 && !timerUrgent;
  const isMarked =
    markedNotAnswer.includes(currentQ) || markedAndAnswer.includes(currentQ);

  useEffect(() => {
    allAnsRef.current = allAns;
  }, [allAns]);

  /* Fullscreen on mount */
  useEffect(() => {
    if (isMobile) return;
    const el = document.documentElement;
    (async () => {
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        setFsActive(true);
      } catch {
        setFsActive(false);
      }
    })();
  }, []);

  /* Per-Q stopwatch — pauses when test is paused */
  useEffect(() => {
    if (timerPaused) return;
    const t = setInterval(
      () =>
        setQElapsed(Math.floor((Date.now() - qStartTimeRef.current) / 1000)),
      1000,
    );
    return () => clearInterval(t);
  }, [currentQ, timerPaused]);

  const saveQTime = (idx) => {
    const spent = Math.floor((Date.now() - qStartTimeRef.current) / 1000);
    questionTimesRef.current[idx] =
      (questionTimesRef.current[idx] || 0) + spent;
  };

  /* Security */
  useEffect(() => {
    let requesting = false;
    const requestFS = async () => {
      if (requesting) return;
      requesting = true;
      const el = document.documentElement;
      try {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
        setFsActive(true);
      } catch {
        if (hasExitedFs)
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
        document.fullscreenElement || document.webkitFullscreenElement
      );
      if (!active && fsActive) {
        setFsActive(false);
        setHasExitedFs(true);
      } else if (active) setFsActive(true);
    };
    const onClick = () => {
      if (!fsActive && hasExitedFs && !isMobile) requestFS();
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
  }, [isMobile, fsActive, hasExitedFs, toast]);

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

  /* Timer — respects pause */
  useEffect(() => {
    if (timerPaused) return;
    const t = setTimeout(() => {
      if (isCountdown) {
        const rem = rh * 3600 + rm * 60 + rs;
        if (rem <= 0) {
          toast({ title: "Time's Up!", status: "warning", position: "top" });
          giveMarkRef.current?.();
          return;
        }
        if (rs > 0) setrs((s) => s - 1);
        else if (rm > 0) {
          setrm((m) => m - 1);
          setrs(59);
        } else if (rh > 0) {
          setrh((h) => h - 1);
          setrm(59);
          setrs(59);
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
  }, [hour, min, sec, rh, rm, rs, isCountdown, timerPaused]);

  /* Navigation */
  const goToQuestion = useCallback(
    (idx) => {
      saveQTime(currentQ);
      qStartTimeRef.current = Date.now();
      setQElapsed(0);
      setCurrentQ(idx);
      if (isSectioned) setCurrentSec(sectionBoundaries[idx]?.sectionIdx ?? 0);
      const saved = allAnsRef.current[idx];
      setans(
        saved !== undefined ? (question[idx]?.options?.[saved] ?? null) : null,
      );
      setAnimKey((k) => k + 1);
    },
    [currentQ, isSectioned, sectionBoundaries, question],
  );

  const goToSection = (sIdx) => {
    if (!isSectioned || !sectionMeta[sIdx]) return;
    let offset = 0;
    for (let i = 0; i < sIdx; i++) offset += sectionMeta[i]?.count || 0;
    goToQuestion(offset);
  };

  const handleSaveNext = () => {
    if (
      answer !== null &&
      allAnsRef.current[currentQ] !== undefined &&
      !answeredQuestion.includes(currentQ)
    ) {
      if (markedNotAnswer.includes(currentQ))
        markedNotAnswer.splice(markedNotAnswer.indexOf(currentQ), 1);
      if (notAnswer.includes(currentQ))
        notAnswer.splice(notAnswer.indexOf(currentQ), 1);
      if (markedAndAnswer.includes(currentQ))
        markedAndAnswer.splice(markedAndAnswer.indexOf(currentQ), 1);
      setAnsweredQuestion([...answeredQuestion, currentQ]);
    } else if (
      allAnsRef.current[currentQ] === undefined &&
      answer === null &&
      !notAnswer.includes(currentQ)
    ) {
      if (markedNotAnswer.includes(currentQ))
        markedNotAnswer.splice(markedNotAnswer.indexOf(currentQ), 1);
      if (markedAndAnswer.includes(currentQ))
        markedAndAnswer.splice(markedAndAnswer.indexOf(currentQ), 1);
      if (answeredQuestion.includes(currentQ))
        answeredQuestion.splice(answeredQuestion.indexOf(currentQ), 1);
      setNotAnswer([...notAnswer, currentQ]);
    }
    if (question.length - 1 > currentQ) goToQuestion(currentQ + 1);
  };

  const markedQuestion = () => {
    if (allAnsRef.current[currentQ] === undefined && answer !== null)
      setAllAns((p) => {
        const n = {
          ...p,
          [currentQ]: question[currentQ]?.options?.indexOf(answer),
        };
        allAnsRef.current = n;
        return n;
      });
    if (
      allAnsRef.current[currentQ] !== undefined &&
      !markedAndAnswer.includes(currentQ)
    ) {
      if (answeredQuestion.includes(currentQ))
        answeredQuestion.splice(answeredQuestion.indexOf(currentQ), 1);
      if (markedNotAnswer.includes(currentQ))
        notAnswer.splice(markedNotAnswer.indexOf(currentQ), 1);
      if (notAnswer.includes(currentQ))
        notAnswer.splice(notAnswer.indexOf(currentQ), 1);
      setMarkedAndAnswer([...markedAndAnswer, currentQ]);
      setans(null);
    } else if (
      allAnsRef.current[currentQ] === undefined &&
      !markedNotAnswer.includes(currentQ)
    ) {
      setAllAns((p) => {
        const u = { ...p };
        delete u[currentQ];
        allAnsRef.current = u;
        return u;
      });
      if (answeredQuestion.includes(currentQ))
        answeredQuestion.splice(answeredQuestion.indexOf(currentQ), 1);
      if (markedAndAnswer.includes(currentQ))
        notAnswer.splice(markedAndAnswer.indexOf(currentQ), 1);
      if (notAnswer.includes(currentQ))
        notAnswer.splice(notAnswer.indexOf(currentQ), 1);
      setMarkedNotAnswer([...markedNotAnswer, currentQ]);
    }
    if (question.length - 1 > currentQ) goToQuestion(currentQ + 1);
  };

  const handleAnswer = (optionText, optionIndex) => {
    setans(optionText);
    const isCorrect = question[currentQ].answer === optionIndex;
    if (isCorrect && !correctAns.includes(currentQ)) {
      if (wrongansqus.includes(currentQ)) {
        setwrong((w) => w - 1);
        wrongansqus.splice(wrongansqus.indexOf(currentQ), 1);
      }
      setMark((m) => m + 1);
      setcorrectQus((p) => [...p, currentQ]);
      setCorrectAns((p) => [...p, currentQ]);
    } else if (!isCorrect && correctAns.includes(currentQ)) {
      correctAns.splice(correctAns.indexOf(currentQ), 1);
      correctQus.splice(correctQus.indexOf(currentQ), 1);
      setMark((m) => m - 1);
      setwrong((w) => w + 1);
    }
    if (
      !isCorrect &&
      !correctAns.includes(currentQ) &&
      !wrongansqus.includes(currentQ)
    ) {
      setwrong((w) => w + 1);
      setwrongansqus((p) => [...p, currentQ]);
    }
    setAllAns((p) => {
      const n = { ...p, [currentQ]: optionIndex };
      allAnsRef.current = n;
      return n;
    });
  };

  /**
   * FIX: handleClearAnswer
   *
   * Old bug: removing from markedAndAnswer/markedNotAnswer arrays but NOT
   * removing from allAns — so on submit, allAns[currentQ] still existed,
   * making ResultPage show it as "marked & answered".
   *
   * Fix: always delete allAns[currentQ], reset correctQus/wrongQus counts,
   * and move to notAnswer (not-attempted state).
   */
  const handleClearAnswer = () => {
    const idx = currentQ;

    // Remove from every status bucket
    if (answeredQuestion.includes(idx))
      answeredQuestion.splice(answeredQuestion.indexOf(idx), 1);
    if (markedAndAnswer.includes(idx))
      markedAndAnswer.splice(markedAndAnswer.indexOf(idx), 1);
    if (markedNotAnswer.includes(idx))
      markedNotAnswer.splice(markedNotAnswer.indexOf(idx), 1);

    // CRITICAL: wipe the stored answer so it doesn't appear as answered on submit
    setAllAns((prev) => {
      const next = { ...prev };
      delete next[idx];
      allAnsRef.current = next;
      return next;
    });

    // Undo score / wrong counts if this question was previously evaluated
    if (correctAns.includes(idx)) {
      correctAns.splice(correctAns.indexOf(idx), 1);
      correctQus.splice(correctQus.indexOf(idx), 1);
      setMark((m) => m - 1);
      setCorrectAns([...correctAns]);
      setcorrectQus([...correctQus]);
    }
    if (wrongansqus.includes(idx)) {
      wrongansqus.splice(wrongansqus.indexOf(idx), 1);
      setwrong((w) => w - 1);
      setwrongansqus([...wrongansqus]);
    }

    // Mark as "not answered" (red state)
    if (!notAnswer.includes(idx)) setNotAnswer([...notAnswer, idx]);

    // Clear the displayed selection
    setans(null);
  };

  const computeSectionScores = () => {
    if (!isSectioned || !sectionMeta.length) return [];
    let offset = 0;
    return sectionMeta.map((sec, sIdx) => {
      const count = sec.count || 0;
      let score = 0;
      for (let i = 0; i < count; i++) {
        const fi = offset + i;
        if (
          allAnsRef.current[fi] !== undefined &&
          allAnsRef.current[fi] === question[fi]?.answer
        )
          score++;
      }
      offset += count;
      return {
        name: sec.name || sec.subject || `Section ${sIdx + 1}`,
        subject: sec.subject || "",
        score,
        total: count,
        percentage: count > 0 ? Math.round((score / count) * 100) : 0,
      };
    });
  };

  /**
   * giveMark — the result state payload keys must EXACTLY match what
   * ResultPage and AllAttemptsPanel expect.
   *
   * ResultPage reads:   s.wrongansqus  (direct from navigate state)
   * AllAttemptsPanel reads: r.wrongQus (from DB via apiFetch)
   *
   * Both are handled: navigate state uses `wrongansqus`, DB field is `wrongQus`.
   */
  const giveMark = async () => {
    saveQTime(currentQ);
    try {
      const subject = testMeta?.subject || "";
      const category = testMeta?.category || subject;
      const timeTaken = isCountdown
        ? totalTimeInSeconds - (rh * 3600 + rm * 60 + rs)
        : hour * 3600 + min * 60 + sec;
      const scorePct =
        question.length > 0 ? Math.round((mark / question.length) * 100) : 0;
      const sectionScores = computeSectionScores();
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
            wrongQus: wrongansqus, // ← DB field name
            answeredQus: answeredQuestion,
            notAnsweredQus: notAnswer,
            markedAndAnswered: markedAndAnswer,
            markedNotAnswered: markedNotAnswer,
            shuffledQuestions: question,
            sectionScores,
          });
          apiPercentile = res.data?.percentile ?? res.percentile ?? null;
          savedResultId = res.data?._id ?? res._id ?? null;
        } catch (err) {
          console.error("Submit error:", err);
        }
      }

      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      if (handleFullScreen) handleFullScreen(false);

      navigate("/test-result", {
        replace: true,
        state: {
          testId: testMeta?.testId,
          testTitle: testMeta?.testTitle || category || subject,
          subject,
          category,
          score: mark,
          totalQuestions: question.length,
          scorePercentage: scorePct,
          percentile: apiPercentile,
          savedResultId,
          timeTaken,
          isSectioned,
          sectionMeta,
          sectionScores,
          shuffledQuestions: question,
          questions: question,
          allAnswers: { ...allAnsRef.current },
          questionTimes: { ...questionTimesRef.current },
          correctQus: [...correctQus],
          wrongansqus: [...wrongansqus], // ← ResultPage reads this key
          answeredQuestion: [...answeredQuestion],
          notAnswer: [...notAnswer],
          markedAndAnswer: [...markedAndAnswer],
          markedNotAnswer: [...markedNotAnswer],
          wrongans,
        },
      });
    } catch (err) {
      console.error(err);
      navigate("/test-result", { replace: true });
    }
  };

  giveMarkRef.current = giveMark;

  const enterFullscreen = async () => {
    const el = document.documentElement;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
      setFsActive(true);
    } catch {
      toast({ title: "Fullscreen Failed", status: "error", position: "top" });
    }
  };

  /* ── Navigator Drawer content ─────────────────────────────────────────── */
  const NavigatorContent = () => (
    <Flex direction="column" h="100%" overflow="hidden">
      <Flex
        px={5}
        pt={5}
        pb={4}
        align="center"
        justify="space-between"
        borderBottom={`1px solid ${C.bgLine}`}
        flexShrink={0}
      >
        <Box>
          <Text fontSize="14px" fontWeight={800} color={C.textPrimary}>
            Question Palette
          </Text>
          <Text fontSize="11px" color={C.textMuted} mt={0.5}>
            {totalAnswered}/{question.length} answered
          </Text>
        </Box>
        <IconButton
          icon={<Icon as={FaTimes} fontSize="13px" />}
          onClick={onClose}
          h="32px"
          w="32px"
          minW="32px"
          borderRadius="8px"
          bg="rgba(255,255,255,.07)"
          color={C.textSecondary}
          aria-label="Close"
          border={`1px solid ${C.border}`}
          _hover={{ bg: "rgba(255,255,255,.12)" }}
        />
      </Flex>

      {/* Progress */}
      <Box px={5} py={3} flexShrink={0} borderBottom={`1px solid ${C.bgLine}`}>
        <Flex justify="space-between" mb={1.5}>
          <Text
            fontSize="10px"
            fontWeight={700}
            color={C.textMuted}
            textTransform="uppercase"
            letterSpacing=".8px"
          >
            Progress
          </Text>
          <Text fontSize="10px" fontWeight={900} color={C.sky}>
            {progressPct}%
          </Text>
        </Flex>
        <Box
          h="4px"
          bg="rgba(255,255,255,.08)"
          borderRadius="full"
          overflow="hidden"
        >
          <Box
            h="100%"
            bg={`linear-gradient(90deg,${C.teal},${C.sky})`}
            w={`${progressPct}%`}
            borderRadius="full"
            transition="width .5s ease"
          />
        </Box>
      </Box>

      {/* Legend */}
      <Box px={5} py={3} flexShrink={0} borderBottom={`1px solid ${C.bgLine}`}>
        <Grid templateColumns="1fr 1fr" rowGap={2} columnGap={4}>
          {Object.entries(STATUS).map(([key, s]) => {
            const count =
              key === "answered"
                ? answeredQuestion.length
                : key === "skipped"
                  ? notAnswer.length
                  : key === "marked"
                    ? markedNotAnswer.length
                    : key === "markedAnswered"
                      ? markedAndAnswer.length
                      : unvisited;
            return (
              <Flex key={key} align="center" gap={2}>
                <Box
                  w="12px"
                  h="12px"
                  flexShrink={0}
                  bg={key === "unvisited" ? "transparent" : s.palBg}
                  border={
                    key === "unvisited" ? `1.5px solid ${C.borderMid}` : "none"
                  }
                  borderRadius={
                    s.palRadius === "50%"
                      ? "50%"
                      : key === "answered"
                        ? "4px 4px 1px 1px"
                        : key === "skipped"
                          ? "1px 1px 4px 4px"
                          : "3px"
                  }
                />
                <Text
                  fontSize="10px"
                  color={C.textSecondary}
                  fontWeight={500}
                  flex={1}
                  noOfLines={1}
                >
                  {s.label}
                </Text>
                <Text fontSize="10px" fontWeight={900} color={C.textPrimary}>
                  {count}
                </Text>
              </Flex>
            );
          })}
        </Grid>
      </Box>

      {/* Section tabs — only in drawer */}
      {isSectioned && sectionMeta.length > 0 && (
        <Box
          px={5}
          py={3}
          flexShrink={0}
          borderBottom={`1px solid ${C.bgLine}`}
        >
          <Text
            fontSize="9px"
            fontWeight={800}
            color={C.textMuted}
            textTransform="uppercase"
            letterSpacing="1px"
            mb={2}
          >
            Sections
          </Text>
          <Flex gap={1.5} flexWrap="wrap">
            {sectionMeta.map((sec, sIdx) => {
              const isActive = sIdx === currentSec;
              return (
                <Box
                  key={sIdx}
                  as="button"
                  onClick={() => {
                    goToSection(sIdx);
                    onClose();
                  }}
                  px={3}
                  py="6px"
                  borderRadius="8px"
                  fontSize="11px"
                  fontWeight={700}
                  bg={
                    isActive ? `rgba(56,189,248,.18)` : "rgba(255,255,255,.06)"
                  }
                  color={isActive ? C.sky : C.textSecondary}
                  border="1px solid"
                  borderColor={isActive ? "rgba(56,189,248,.35)" : C.border}
                  _hover={{ bg: "rgba(255,255,255,.1)" }}
                  transition="all .12s"
                  textTransform="capitalize"
                >
                  {sec.name || sec.subject || `S${sIdx + 1}`}
                </Box>
              );
            })}
          </Flex>
        </Box>
      )}

      {/* Palette */}
      <Box
        flex={1}
        overflowY="auto"
        px={5}
        py={4}
        css={{
          "&::-webkit-scrollbar": { width: "2px" },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255,255,255,.12)",
            borderRadius: "2px",
          },
        }}
      >
        {isSectioned && sectionMeta.length > 0 ? (
          sectionMeta.map((sec, sIdx) => {
            const secStart = sectionBoundaries.findIndex(
              (b) => b.sectionIdx === sIdx,
            );
            const secCount = sec.count || 0;
            const isActiveSec = sIdx === currentSec;
            return (
              <Box key={sIdx} mb={5}>
                <Flex align="center" gap={2} mb={3}>
                  {isActiveSec && (
                    <Box w="3px" h="10px" bg={C.sky} borderRadius="full" />
                  )}
                  <Text
                    fontSize="9px"
                    fontWeight={800}
                    letterSpacing="1px"
                    textTransform="uppercase"
                    color={isActiveSec ? C.sky : C.textMuted}
                  >
                    {sec.name || sec.subject || `Section ${sIdx + 1}`}
                  </Text>
                </Flex>
                <Grid templateColumns="repeat(5,1fr)" gap={2}>
                  {Array.from({ length: secCount }, (_, i) => {
                    const fi = secStart + i;
                    const st = getQStatus(fi, {
                      answeredQuestion,
                      markedAndAnswer,
                      markedNotAnswer,
                      notAnswer,
                    });
                    return (
                      <Bubble
                        key={fi}
                        label={i + 1}
                        isCurrent={fi === currentQ}
                        status={st}
                        onClick={() => {
                          goToQuestion(fi);
                          onClose();
                        }}
                      />
                    );
                  })}
                </Grid>
              </Box>
            );
          })
        ) : (
          <Grid templateColumns="repeat(5,1fr)" gap={2}>
            {question.map((_, i) => {
              const st = getQStatus(i, {
                answeredQuestion,
                markedAndAnswer,
                markedNotAnswer,
                notAnswer,
              });
              return (
                <Bubble
                  key={i}
                  label={i + 1}
                  isCurrent={i === currentQ}
                  status={st}
                  onClick={() => {
                    goToQuestion(i);
                    onClose();
                  }}
                />
              );
            })}
          </Grid>
        )}
      </Box>

      {/* Submit */}
      <Box px={5} py={4} flexShrink={0} borderTop={`1px solid ${C.bgLine}`}>
        <Button
          w="full"
          h="46px"
          borderRadius="14px"
          bg={`linear-gradient(135deg,${C.teal},${C.tealDk})`}
          color="white"
          fontWeight={800}
          fontSize="13px"
          leftIcon={<Icon as={FaPaperPlane} fontSize="12px" />}
          onClick={() => {
            setSubmitOpen(true);
            onClose();
          }}
          _hover={{ opacity: 0.9, boxShadow: `0 8px 24px ${C.tealGlow}` }}
          transition="all .15s"
        >
          Submit Test
        </Button>
      </Box>
    </Flex>
  );

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════════════════ */
  return (
    <Box
      h="100dvh"
      display="flex"
      flexDirection="column"
      bg={C.bg}
      fontFamily="'DM Sans','Segoe UI',sans-serif"
      position="relative"
      overflow="hidden"
      color={C.textPrimary}
    >
      {/* Fullscreen overlay */}
      {!isMobile && !fsActive && (
        <Box
          position="fixed"
          inset={0}
          bg="rgba(11,30,61,.97)"
          zIndex={9999}
          display="flex"
          alignItems="center"
          justifyContent="center"
          cursor="pointer"
          onClick={enterFullscreen}
        >
          <VStack spacing={5} textAlign="center" p={8}>
            <Text fontSize="44px" lineHeight="1">
              ⚠️
            </Text>
            <Box>
              <Text fontSize="24px" fontWeight={900} color="white" mb={2}>
                Fullscreen Required
              </Text>
              <Text
                fontSize="14px"
                color="rgba(255,255,255,.5)"
                maxW="340px"
                lineHeight="1.7"
              >
                Exam integrity requires fullscreen mode.
              </Text>
            </Box>
            <Button
              h="50px"
              px={8}
              borderRadius="14px"
              bg={`linear-gradient(135deg,${C.blue},${C.blueDk})`}
              color="white"
              fontWeight={800}
              leftIcon={<Icon as={FaExpand} />}
              _hover={{ opacity: 0.9 }}
            >
              Re-enter Fullscreen
            </Button>
          </VStack>
        </Box>
      )}

      {/* ══ HEADER ══ */}
      <Box
        bg={C.bgCard}
        flexShrink={0}
        borderBottom={`1px solid ${C.bgLine}`}
        boxShadow="0 2px 16px rgba(11,30,61,.45)"
        zIndex={10}
        position="relative"
      >
        {/* Row 1 */}
        <Flex
          px={{ base: 4, md: 5 }}
          h={{ base: "54px", md: "58px" }}
          align="center"
          gap={3}
        >
          {/* Timer */}
          <Flex
            align="center"
            gap={2}
            flexShrink={0}
            bg={
              timerUrgent
                ? C.redBg
                : timerWarn
                  ? C.amberBg
                  : "rgba(255,255,255,.07)"
            }
            border="1px solid"
            borderColor={
              timerUrgent
                ? "rgba(220,38,38,.4)"
                : timerWarn
                  ? "rgba(217,119,6,.4)"
                  : C.border
            }
            borderRadius="10px"
            px={{ base: 3, md: 3.5 }}
            py={{ base: "7px", md: "8px" }}
            transition="all .4s"
          >
            <Box
              w={{ base: "7px", md: "8px" }}
              h={{ base: "7px", md: "8px" }}
              borderRadius="50%"
              bg={
                timerPaused
                  ? C.amber
                  : timerUrgent
                    ? "#ef4444"
                    : timerWarn
                      ? C.amber
                      : C.sky
              }
              boxShadow={
                timerPaused
                  ? `0 0 6px ${C.amber}`
                  : timerUrgent
                    ? "0 0 6px #ef4444"
                    : timerWarn
                      ? `0 0 6px ${C.amber}`
                      : `0 0 6px ${C.sky}`
              }
              flexShrink={0}
            />
            <Text
              fontSize={{ base: "15px", md: "17px" }}
              fontWeight={900}
              letterSpacing={{ base: "1.5px", md: "2px" }}
              lineHeight="1"
              color={
                timerPaused
                  ? C.amber
                  : timerUrgent
                    ? "#fca5a5"
                    : timerWarn
                      ? "#fde68a"
                      : "white"
              }
              fontFamily="'JetBrains Mono','Courier New',monospace"
            >
              {timerPaused
                ? "PAUSED"
                : `${pad(timerH)}:${pad(timerM)}:${pad(timerS)}`}
            </Text>
          </Flex>

          {/* Title */}
          <Box flex={1} minW={0}>
            <Text
              fontSize={{ base: "12px", md: "13px" }}
              fontWeight={700}
              color={C.textSecondary}
              noOfLines={1}
            >
              {testMeta?.testTitle || "Exam"}
            </Text>
            {!isSectioned && testMeta?.subject && (
              <Text
                fontSize="10px"
                color={C.textMuted}
                noOfLines={1}
                fontWeight={500}
              >
                {testMeta.subject}
              </Text>
            )}
          </Box>

          {/* Controls */}
          <HStack spacing={2} flexShrink={0}>
            {/* Pause — now passes testTitle + pause/resume callbacks */}
            <ModalPause
              markedAndAnswer={markedAndAnswer}
              question={question}
              markedNotAnswer={markedNotAnswer}
              notAnswer={notAnswer}
              answered={answeredQuestion}
              testTitle={testMeta?.testTitle || "Test"}
              onPause={() => {
                saveQTime(currentQ);
                setTimerPaused(true);
              }}
              onResume={() => {
                qStartTimeRef.current = Date.now();
                setTimerPaused(false);
              }}
            />
            <IconButton
              icon={<Icon as={FaBars} fontSize="14px" />}
              onClick={onOpen}
              h={{ base: "34px", md: "36px" }}
              w={{ base: "34px", md: "36px" }}
              minW="auto"
              borderRadius="9px"
              bg="rgba(255,255,255,.07)"
              border={`1px solid ${C.border}`}
              color={C.textSecondary}
              aria-label="Navigator"
              _hover={{ bg: "rgba(255,255,255,.12)", color: "white" }}
            />
            {!isMobile && !fsActive && (
              <IconButton
                icon={<Icon as={FaExpand} fontSize="11px" />}
                onClick={enterFullscreen}
                h="36px"
                w="36px"
                minW="auto"
                borderRadius="9px"
                bg="rgba(255,255,255,.07)"
                border={`1px solid ${C.border}`}
                color={C.textSecondary}
                aria-label="Fullscreen"
                _hover={{ bg: "rgba(255,255,255,.12)" }}
              />
            )}
          </HStack>
        </Flex>

        {/* Section tabs */}
        {isSectioned && sectionMeta.length > 0 && (
          <Box
            borderTop={`1px solid ${C.bgLine}`}
            overflowX="auto"
            css={{
              "&::-webkit-scrollbar": { display: "none" },
              scrollbarWidth: "none",
            }}
          >
            <Flex px={{ base: 4, md: 5 }} gap={0} w="max-content" minW="100%">
              {sectionMeta.map((sec, sIdx) => {
                const isActive = sIdx === currentSec;
                const secStart = sectionBoundaries.findIndex(
                  (b) => b.sectionIdx === sIdx,
                );
                const secCount = sec.count || 0;
                const secAns = Array.from(
                  { length: secCount },
                  (_, i) => secStart + i,
                ).filter(
                  (fi) =>
                    answeredQuestion.includes(fi) ||
                    markedAndAnswer.includes(fi),
                ).length;
                return (
                  <Box
                    key={sIdx}
                    as="button"
                    onClick={() => goToSection(sIdx)}
                    position="relative"
                    px={{ base: 4, md: 5 }}
                    py={3}
                    flexShrink={0}
                    transition="all .15s"
                  >
                    <Text
                      fontSize={{ base: "12px", md: "13px" }}
                      fontWeight={isActive ? 800 : 600}
                      color={isActive ? "white" : C.textSecondary}
                      noOfLines={1}
                      transition="color .15s"
                    >
                      {sec.name || sec.subject || `Section ${sIdx + 1}`}
                    </Text>
                    {isActive && (
                      <Box
                        position="absolute"
                        bottom="0"
                        left="16px"
                        right="16px"
                        h="2.5px"
                        bg={C.blue}
                        borderRadius="full"
                      />
                    )}
                    <Text
                      fontSize="9px"
                      fontWeight={700}
                      color={isActive ? C.sky : C.textMuted}
                      mt={0.5}
                      textAlign="center"
                    >
                      {secAns}/{secCount}
                    </Text>
                  </Box>
                );
              })}
            </Flex>
          </Box>
        )}

        {/* Progress line */}
        <Box h="2px" bg="rgba(255,255,255,.05)">
          <Box
            h="100%"
            bg={`linear-gradient(90deg,${C.blue},${C.teal})`}
            w={`${progressPct}%`}
            transition="width .6s ease"
          />
        </Box>
      </Box>

      {/* ══ Q META ROW ══ */}
      <Flex
        px={{ base: 4, md: 5 }}
        py={{ base: "10px", md: "11px" }}
        align="center"
        justify="space-between"
        bg={C.bgCard}
        borderBottom={`1px solid ${C.bgLine}`}
        flexShrink={0}
      >
        <HStack spacing={3}>
          <Center
            bg={C.blue}
            borderRadius="8px"
            w={{ base: "28px", md: "30px" }}
            h={{ base: "28px", md: "30px" }}
            flexShrink={0}
          >
            <Text
              fontSize={{ base: "11px", md: "12px" }}
              fontWeight={900}
              color="white"
            >
              {isSectioned ? localQNum : currentQ + 1}
            </Text>
          </Center>
          <Box w="1px" h="16px" bg={C.bgLine} />
          <Flex align="center" gap={1.5}>
            <Icon
              as={FaStopwatch}
              fontSize="10px"
              color={qElapsed > 120 ? C.amber : C.textMuted}
            />
            <Text
              fontSize={{ base: "12px", md: "13px" }}
              fontWeight={700}
              color={qElapsed > 120 ? C.amber : C.textSecondary}
              fontFamily="'JetBrains Mono',monospace"
            >
              {pad(Math.floor(qElapsed / 60))}:{pad(qElapsed % 60)}
            </Text>
          </Flex>
          <Flex
            align="center"
            gap={1.5}
            bg="rgba(255,255,255,.06)"
            borderRadius="7px"
            px={2.5}
            py="3px"
          >
            <Text fontSize="10px" fontWeight={600} color={C.textMuted}>
              Done:
            </Text>
            <Text fontSize="10px" fontWeight={900} color={C.sky}>
              {totalAnswered}
            </Text>
          </Flex>
        </HStack>
        <HStack spacing={2}>
          <IconButton
            icon={
              <Icon
                as={isMarked ? MdBookmark : MdOutlineBookmarkBorder}
                fontSize="17px"
              />
            }
            onClick={markedQuestion}
            h="30px"
            w="30px"
            minW="30px"
            borderRadius="7px"
            bg={isMarked ? C.amberBg : "transparent"}
            color={isMarked ? C.amber : C.textMuted}
            aria-label="Mark for review"
            border={isMarked ? `1px solid rgba(217,119,6,.35)` : "none"}
            _hover={{ bg: C.amberBg, color: C.amber }}
            transition="all .15s"
          />
          <IconButton
            icon={<Icon as={MdOutlineReport} fontSize="16px" />}
            h="30px"
            w="30px"
            minW="30px"
            borderRadius="7px"
            bg="transparent"
            color={C.textMuted}
            aria-label="Report"
            _hover={{ bg: "rgba(220,38,38,.12)", color: "#f87171" }}
          />
          {!isMobile && <ReportQuestionDropdown />}
        </HStack>
      </Flex>

      {/* ══ BODY ══ */}
      <Flex flex={1} overflow="hidden">
        <Flex direction="column" flex={1} overflow="hidden" minW={0}>
          {/* Scrollable content */}
          <Box
            flex={1}
            overflowY="auto"
            px={{ base: 4, md: 5 }}
            pt={{ base: 5, md: 6 }}
            pb={{ base: 4, md: 5 }}
            css={{
              "&::-webkit-scrollbar": { width: "3px" },
              "&::-webkit-scrollbar-thumb": {
                background: "rgba(255,255,255,.12)",
                borderRadius: "4px",
              },
            }}
          >
            {/* Question */}
            <Box mb={{ base: 5, md: 6 }}>
              <Text
                fontSize={{ base: "15px", md: "16px" }}
                lineHeight={{ base: "1.75", md: "1.8" }}
                color={C.textPrimary}
                fontWeight={400}
                letterSpacing=".1px"
              >
                {question[currentQ]?.qus}
              </Text>
            </Box>

            {/* Options */}
            <VStack spacing={{ base: "10px", md: "12px" }} align="stretch">
              {question[currentQ]?.options.map((opt, i) => {
                const sel = answer === opt;
                return (
                  <Box
                    key={`${animKey}-${i}`}
                    borderRadius={{ base: "12px", md: "14px" }}
                    border="1.5px solid"
                    borderColor={sel ? C.blue : C.border}
                    bg={sel ? `rgba(37,99,235,.15)` : C.bgCard}
                    boxShadow={
                      sel
                        ? `0 0 0 1px ${C.blue}, 0 4px 20px ${C.blueGlow}`
                        : "none"
                    }
                    cursor="pointer"
                    transition="all .15s cubic-bezier(.4,0,.2,1)"
                    _hover={{
                      borderColor: sel ? C.blue : C.borderMid,
                      bg: sel ? `rgba(37,99,235,.18)` : C.bgElevated,
                    }}
                    _active={{
                      transform: "scale(.99)",
                      transition: "transform .07s",
                    }}
                    onClick={() => handleAnswer(opt, i)}
                  >
                    <Flex
                      align="center"
                      gap={3}
                      p={{ base: "13px 14px", md: "14px 18px" }}
                    >
                      <Center
                        w={{ base: "32px", md: "34px" }}
                        h={{ base: "32px", md: "34px" }}
                        borderRadius="8px"
                        flexShrink={0}
                        bg={sel ? C.blue : "rgba(255,255,255,.07)"}
                        color={sel ? "white" : C.textSecondary}
                        fontSize={{ base: "12px", md: "13px" }}
                        fontWeight={900}
                        border={sel ? "none" : `1px solid ${C.border}`}
                        transition="all .15s"
                      >
                        {sel ? (
                          <Icon
                            as={FaCheckCircle}
                            fontSize={{ base: "13px", md: "14px" }}
                          />
                        ) : (
                          LETTERS[i] || i + 1
                        )}
                      </Center>
                      <Text
                        fontSize={{ base: "14px", md: "15px" }}
                        fontWeight={sel ? 600 : 400}
                        color={sel ? "white" : C.textPrimary}
                        lineHeight="1.55"
                        flex={1}
                      >
                        {opt}
                      </Text>
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
            <Box h={{ base: "12px", md: "16px" }} />
          </Box>

          {/* ══ ACTION BAR ══ */}
          <Box bg={C.bgCard} borderTop={`1px solid ${C.bgLine}`} flexShrink={0}>
            {/* MOBILE */}
            {isMobile && (
              <Box px={4} pt={3} pb={`max(14px, env(safe-area-inset-bottom))`}>
                <Flex gap={2} mb={2.5}>
                  <Button
                    flex={1}
                    h="40px"
                    borderRadius="10px"
                    bg="rgba(255,255,255,.06)"
                    color={C.textSecondary}
                    border={`1px solid ${C.border}`}
                    fontWeight={700}
                    fontSize="12px"
                    leftIcon={<Icon as={FaChevronLeft} fontSize="9px" />}
                    isDisabled={currentQ === 0}
                    onClick={() => goToQuestion(currentQ - 1)}
                    _hover={{ bg: "rgba(255,255,255,.1)" }}
                    _disabled={{ opacity: 0.35 }}
                  >
                    Prev
                  </Button>

                  <Button
                    flex={2}
                    h="40px"
                    borderRadius="10px"
                    bg={isMarked ? C.amberBg : "rgba(255,255,255,.06)"}
                    color={isMarked ? C.amber : C.textSecondary}
                    border={`1px solid ${isMarked ? "rgba(217,119,6,.35)" : C.border}`}
                    fontWeight={700}
                    fontSize="12px"
                    leftIcon={
                      <Icon
                        as={isMarked ? MdBookmark : MdOutlineBookmarkBorder}
                        fontSize="14px"
                      />
                    }
                    onClick={markedQuestion}
                    _hover={{ bg: C.amberBg, color: C.amber }}
                    transition="all .15s"
                  >
                    Mark For Review
                  </Button>

                  <Button
                    flex={1}
                    h="40px"
                    borderRadius="10px"
                    bg="rgba(255,255,255,.06)"
                    color={C.textSecondary}
                    border={`1px solid ${C.border}`}
                    fontWeight={700}
                    fontSize="12px"
                    leftIcon={<Icon as={FaEraser} fontSize="9px" />}
                    onClick={handleClearAnswer}
                    _hover={{ bg: "rgba(255,255,255,.1)" }}
                  >
                    Clear
                  </Button>
                </Flex>
                <Flex gap={2}>
                  <Button
                    flex={3}
                    h="50px"
                    borderRadius="14px"
                    bg={`linear-gradient(135deg,${C.blue},${C.blueDk})`}
                    color="white"
                    fontWeight={800}
                    fontSize="15px"
                    rightIcon={<Icon as={FaChevronRight} fontSize="13px" />}
                    onClick={handleSaveNext}
                    boxShadow={`0 4px 20px ${C.blueGlow}`}
                    _hover={{ opacity: 0.95 }}
                    _active={{
                      transform: "scale(.98)",
                      transition: "transform .08s",
                    }}
                    transition="all .15s"
                  >
                    Save & Next
                  </Button>
                  <Button
                    flex={1}
                    h="50px"
                    borderRadius="14px"
                    bg={`rgba(13,148,136,.18)`}
                    color={C.teal}
                    border={`1.5px solid rgba(13,148,136,.35)`}
                    fontWeight={800}
                    fontSize="12px"
                    leftIcon={<Icon as={FaPaperPlane} fontSize="11px" />}
                    onClick={() => setSubmitOpen(true)}
                    _hover={{ bg: "rgba(13,148,136,.25)" }}
                    transition="all .15s"
                  >
                    Submit
                  </Button>
                </Flex>
              </Box>
            )}

            {/* DESKTOP */}
            {!isMobile && (
              <Flex
                px={6}
                py={4}
                justify="space-between"
                align="center"
                gap={3}
              >
                <HStack spacing={2}>
                  <Button
                    h="42px"
                    px={4}
                    borderRadius="11px"
                    bg="rgba(255,255,255,.07)"
                    color={C.textSecondary}
                    border={`1px solid ${C.border}`}
                    fontWeight={700}
                    fontSize="13px"
                    leftIcon={<Icon as={FaChevronLeft} fontSize="10px" />}
                    isDisabled={currentQ === 0}
                    onClick={() => goToQuestion(currentQ - 1)}
                    _hover={{ bg: "rgba(255,255,255,.12)" }}
                    _disabled={{ opacity: 0.4 }}
                  >
                    Prev
                  </Button>
                  <Button
                    h="42px"
                    px={4}
                    borderRadius="11px"
                    bg={isMarked ? C.amberBg : "rgba(255,255,255,.07)"}
                    color={isMarked ? C.amber : C.textSecondary}
                    border={`1px solid ${isMarked ? "rgba(217,119,6,.35)" : C.border}`}
                    fontWeight={700}
                    fontSize="13px"
                    leftIcon={
                      <Icon
                        as={isMarked ? MdBookmark : MdOutlineBookmarkBorder}
                        fontSize="14px"
                      />
                    }
                    onClick={markedQuestion}
                    _hover={{ bg: C.amberBg, color: C.amber }}
                    transition="all .15s"
                  >
                    Mark for Review
                  </Button>
                  <Button
                    h="42px"
                    px={4}
                    borderRadius="11px"
                    bg="rgba(255,255,255,.07)"
                    color={C.textSecondary}
                    border={`1px solid ${C.border}`}
                    fontWeight={700}
                    fontSize="13px"
                    leftIcon={<Icon as={FaEraser} fontSize="10px" />}
                    onClick={handleClearAnswer}
                    _hover={{ bg: "rgba(255,255,255,.1)" }}
                  >
                    Clear
                  </Button>
                </HStack>
                <HStack spacing={2}>
                  {isSectioned &&
                    currentSecInfo &&
                    currentQ === currentSecInfo.sectionEnd &&
                    currentSec < sectionMeta.length - 1 && (
                      <Button
                        h="42px"
                        px={5}
                        borderRadius="11px"
                        bg={`rgba(13,148,136,.14)`}
                        color={C.teal}
                        border={`1px solid rgba(13,148,136,.25)`}
                        fontWeight={800}
                        fontSize="13px"
                        rightIcon={<Icon as={FaLayerGroup} fontSize="10px" />}
                        onClick={() => goToSection(currentSec + 1)}
                        _hover={{ bg: "rgba(13,148,136,.22)" }}
                      >
                        Next Section
                      </Button>
                    )}
                  <Button
                    h="42px"
                    px={7}
                    borderRadius="11px"
                    bg={`linear-gradient(135deg,${C.blue},${C.blueDk})`}
                    color="white"
                    fontWeight={800}
                    fontSize="13px"
                    rightIcon={<Icon as={FaChevronRight} fontSize="11px" />}
                    onClick={handleSaveNext}
                    _hover={{
                      opacity: 0.9,
                      boxShadow: `0 6px 20px ${C.blueGlow}`,
                    }}
                    transition="all .15s"
                  >
                    Save & Next
                  </Button>
                  <Button
                    h="42px"
                    px={5}
                    borderRadius="11px"
                    bg={`linear-gradient(135deg,${C.teal},${C.tealDk})`}
                    color="white"
                    fontWeight={800}
                    fontSize="13px"
                    leftIcon={<Icon as={FaPaperPlane} fontSize="11px" />}
                    onClick={() => setSubmitOpen(true)}
                    _hover={{
                      opacity: 0.9,
                      boxShadow: `0 6px 20px ${C.tealGlow}`,
                    }}
                    transition="all .15s"
                  >
                    Submit
                  </Button>
                </HStack>
              </Flex>
            )}
          </Box>
        </Flex>

        {/* Desktop sidebar */}
        {!isMobile && (
          <Box
            w={{ md: "276px", lg: "296px" }}
            flexShrink={0}
            bg={C.bgCard}
            borderLeft={`1px solid ${C.bgLine}`}
            display="flex"
            flexDirection="column"
            overflow="hidden"
          >
            <NavigatorContent />
          </Box>
        )}
      </Flex>

      {/* Right drawer (mobile) */}
      {isMobile && (
        <Drawer onClose={onClose} isOpen={isOpen} placement="right" size="xs">
          <DrawerOverlay backdropFilter="blur(4px)" bg="rgba(11,30,61,.6)" />
          <DrawerContent bg={C.bgCard} maxW="300px">
            <DrawerBody p={0}>
              <NavigatorContent />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}

      {/* ══ SUBMIT DIALOG ══ */}
      <AlertDialog
        isOpen={submitOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setSubmitOpen(false)}
        isCentered
        motionPreset="slideInBottom"
      >
        <AlertDialogOverlay backdropFilter="blur(8px)" bg="rgba(11,30,61,.7)">
          <AlertDialogContent
            mx={4}
            maxW={{ base: "calc(100vw - 32px)", sm: "420px" }}
            bg={C.bgCard}
            borderRadius="24px"
            overflow="hidden"
            fontFamily="'DM Sans',system-ui,sans-serif"
            boxShadow={`0 32px 80px rgba(11,30,61,.6), 0 0 0 1px ${C.border}`}
            color={C.textPrimary}
          >
            <Box
              bg={`linear-gradient(135deg,${C.bg},${C.bgCard})`}
              px={6}
              py={5}
              borderBottom={`1px solid ${C.bgLine}`}
            >
              <Flex align="center" gap={3}>
                <Center
                  w="42px"
                  h="42px"
                  bg="rgba(255,255,255,.08)"
                  borderRadius="12px"
                  border={`1px solid ${C.border}`}
                  flexShrink={0}
                >
                  <Icon as={FaPaperPlane} color={C.teal} fontSize="15px" />
                </Center>
                <Box>
                  <Text
                    fontSize="17px"
                    fontWeight={900}
                    color="white"
                    letterSpacing="-.4px"
                  >
                    Submit Test?
                  </Text>
                  <Text fontSize="11px" color={C.textMuted} mt={0.5}>
                    This action cannot be undone
                  </Text>
                </Box>
              </Flex>
            </Box>

            <AlertDialogBody p={5}>
              {isSectioned && sectionMeta.length > 0 && (
                <Box
                  mb={4}
                  bg={C.bg}
                  borderRadius="14px"
                  p={4}
                  border={`1px solid ${C.bgLine}`}
                >
                  <Text
                    fontSize="10px"
                    fontWeight={800}
                    color={C.textMuted}
                    textTransform="uppercase"
                    letterSpacing=".8px"
                    mb={3}
                  >
                    Section Summary
                  </Text>
                  {sectionMeta.map((sec, sIdx) => {
                    const secStart = sectionBoundaries.findIndex(
                      (b) => b.sectionIdx === sIdx,
                    );
                    const secCount = sec.count || 0;
                    const secAns = Array.from(
                      { length: secCount },
                      (_, i) => secStart + i,
                    ).filter(
                      (fi) =>
                        answeredQuestion.includes(fi) ||
                        markedAndAnswer.includes(fi),
                    ).length;
                    const pct =
                      secCount > 0 ? Math.round((secAns / secCount) * 100) : 0;
                    return (
                      <Box
                        key={sIdx}
                        mb={sIdx < sectionMeta.length - 1 ? 3 : 0}
                      >
                        <Flex justify="space-between" mb={1.5}>
                          <Text
                            fontSize="12px"
                            fontWeight={600}
                            color={C.textPrimary}
                            textTransform="capitalize"
                          >
                            {sec.name || sec.subject || `Section ${sIdx + 1}`}
                          </Text>
                          <Text
                            fontSize="12px"
                            fontWeight={700}
                            color={secAns === secCount ? C.green : C.amber}
                          >
                            {secAns}/{secCount}
                          </Text>
                        </Flex>
                        <Box
                          h="3px"
                          bg="rgba(255,255,255,.08)"
                          borderRadius="full"
                          overflow="hidden"
                        >
                          <Box
                            h="100%"
                            bg={secAns === secCount ? C.green : C.amber}
                            w={`${pct}%`}
                            borderRadius="full"
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}

              <Grid templateColumns="repeat(4,1fr)" gap={2} mb={4}>
                {[
                  {
                    v: question.length,
                    l: "Total",
                    c: C.blue,
                    bg: "rgba(37,99,235,.15)",
                  },
                  {
                    v: answeredQuestion.length,
                    l: "Done",
                    c: C.green,
                    bg: C.greenBg,
                  },
                  { v: notAnswer.length, l: "Skipped", c: C.red, bg: C.redBg },
                  {
                    v: unvisited,
                    l: "Unseen",
                    c: C.textMuted,
                    bg: "rgba(255,255,255,.06)",
                  },
                ].map(({ v, l, c, bg }) => (
                  <Box
                    key={l}
                    bg={bg}
                    borderRadius="12px"
                    p={3}
                    textAlign="center"
                    border={`1px solid ${C.bgLine}`}
                  >
                    <Text
                      fontSize={{ base: "20px", md: "22px" }}
                      fontWeight={900}
                      color={c}
                      lineHeight="1"
                      letterSpacing="-1px"
                    >
                      {v}
                    </Text>
                    <Text
                      fontSize="9px"
                      color={C.textMuted}
                      fontWeight={700}
                      mt="5px"
                      textTransform="uppercase"
                      letterSpacing=".5px"
                    >
                      {l}
                    </Text>
                  </Box>
                ))}
              </Grid>

              <Flex
                align="center"
                gap={2.5}
                bg={C.amberBg}
                borderRadius="12px"
                p={3.5}
                border="1px solid rgba(217,119,6,.3)"
              >
                <Icon
                  as={FaExclamationTriangle}
                  color={C.amber}
                  fontSize="13px"
                  flexShrink={0}
                />
                <Text
                  fontSize="12px"
                  color="#fde68a"
                  fontWeight={600}
                  lineHeight="1.5"
                >
                  Once submitted, answers cannot be changed.
                </Text>
              </Flex>
            </AlertDialogBody>

            <AlertDialogFooter gap={3} px={5} pb={5} pt={0}>
              <Button
                ref={cancelRef}
                flex={1}
                h="48px"
                borderRadius="13px"
                bg="rgba(255,255,255,.07)"
                color={C.textSecondary}
                border={`1px solid ${C.border}`}
                fontWeight={700}
                fontSize="14px"
                onClick={() => setSubmitOpen(false)}
                _hover={{ bg: "rgba(255,255,255,.12)" }}
              >
                Cancel
              </Button>
              <Button
                flex={1}
                h="48px"
                borderRadius="13px"
                bg={`linear-gradient(135deg,${C.teal},${C.tealDk})`}
                color="white"
                fontWeight={800}
                fontSize="14px"
                leftIcon={<Icon as={FaPaperPlane} fontSize="12px" />}
                onClick={() => {
                  setSubmitOpen(false);
                  giveMark();
                }}
                _hover={{ opacity: 0.9, boxShadow: `0 8px 24px ${C.tealGlow}` }}
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