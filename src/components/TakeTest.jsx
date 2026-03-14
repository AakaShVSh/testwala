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
//   Heading,
//   Radio,
//   RadioGroup,
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
// } from "@chakra-ui/react";
// import ModalPause from "./ModalPause";
// import { useNavigate, useLocation } from "react-router-dom";
// import { HamburgerIcon } from "@chakra-ui/icons";
// import { useAuth } from "../context/AuthContext";
// import { resultsAPI } from "../services/api";
// import { socket } from "../services/socket";
// import ReportQuestionDropdown from "./ReportQuestionDropdown";

// /**
//  * TakeTest
//  *
//  * Props (all required – no localStorage fallbacks):
//  *   quest          {Array}   – questions array from parent/API
//  *   testMeta       {Object}  – { subject, category, timeLimitMin, testIndex }
//  *                              timeLimitMin: if > 0 → countdown; if 0/null → count-up
//  *   handleFullScreen {fn}    – optional, called with false on submit
//  */
// const TakeTest = ({ handleFullScreen }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const toast = useToast();
//   const { user } = useAuth();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [isMobile] = useMediaQuery("(max-width: 768px)");

//   // Read questions + metadata from navigation state (passed by TestDetailPage)
//   const quest = location.state?.quest ?? [];
//   const testMeta = location.state?.testMeta ?? {};

//   // ─── Shuffle questions once on mount ──────────────────────────
//   const [question] = useState(() => [...quest].sort(() => Math.random() - 0.5));

//   // ─── Answer tracking ──────────────────────────────────────────
//   const [currentquestion, setcurrentquestion] = useState(0);
//   const [answeredQuestion, setAnsweredQuestion] = useState([]);
//   const [markedAndAnswer, setMarkedAndAnswer] = useState([]);
//   const [markedNotAnswer, setMarkedNotAnswer] = useState([]);
//   const [notAnswer, setNotAnswer] = useState([]);
//   const [answer, setans] = useState(null);
//   const [wrongans, setwrong] = useState(0);
//   const [wrongansqus, setwrongansqus] = useState([]);
//   const [allAns, setAllAns] = useState({});
//   const [mark, setMark] = useState(0);
//   const [correctQus, setcorrectQus] = useState([]);
//   const [correctAns, setCorrectAns] = useState([]);

//   // ─── Timer ────────────────────────────────────────────────────
//   // timeLimitMin > 0 → countdown; 0 or absent → count-up
//   const timeLimitMin = Number(testMeta?.timeLimitMin) || 0;
//   const isCountdown = timeLimitMin > 0;
//   const totalTimeInSeconds = timeLimitMin * 60;

//   // Count-up state
//   const [hour, sethour] = useState(0);
//   const [min, setmin] = useState(0);
//   const [sec, setsec] = useState(0);

//   // Countdown state
//   const [reversehour, setreversehour] = useState(() =>
//     Math.floor(totalTimeInSeconds / 3600),
//   );
//   const [reversemin, setreversemin] = useState(() =>
//     Math.floor((totalTimeInSeconds % 3600) / 60),
//   );
//   const [reversesec, setreversesec] = useState(() => totalTimeInSeconds % 60);

//   // ─── Fullscreen state ─────────────────────────────────────────
//   const [isFullscreenActive, setIsFullscreenActive] = useState(false);
//   const [hasExitedFullscreen, setHasExitedFullscreen] = useState(false);

//   // ─── Submit dialog ────────────────────────────────────────────
//   const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
//   const cancelSubmitRef = useRef();
//   const [size, setSize] = useState("");

//   // ─── Fullscreen / navigation guard ────────────────────────────
//   useEffect(() => {
//     let isRequestingFullscreen = false;

//     const requestFullscreen = async () => {
//       if (isRequestingFullscreen) return;
//       isRequestingFullscreen = true;
//       const elem = document.documentElement;
//       try {
//         if (elem.requestFullscreen) await elem.requestFullscreen();
//         else if (elem.webkitRequestFullscreen)
//           await elem.webkitRequestFullscreen();
//         else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
//         setIsFullscreenActive(true);
//       } catch {
//         if (hasExitedFullscreen) {
//           toast({
//             title: "Fullscreen Required",
//             description: "Please click anywhere to re-enter fullscreen mode.",
//             status: "warning",
//             duration: 5000,
//             isClosable: true,
//             position: "top",
//           });
//         }
//       } finally {
//         isRequestingFullscreen = false;
//       }
//     };

//     const handleFullscreenChange = () => {
//       const isCurrentlyFullscreen = !!(
//         document.fullscreenElement ||
//         document.webkitFullscreenElement ||
//         document.msFullscreenElement
//       );
//       if (!isCurrentlyFullscreen && isFullscreenActive) {
//         setIsFullscreenActive(false);
//         setHasExitedFullscreen(true);
//         toast({
//           title: "Fullscreen Exited",
//           description: "Click anywhere to re-enter fullscreen mode.",
//           status: "warning",
//           duration: 5000,
//           isClosable: true,
//           position: "top",
//         });
//       } else if (isCurrentlyFullscreen) {
//         setIsFullscreenActive(true);
//       }
//     };

//     const handleClickToFullscreen = () => {
//       if (!isFullscreenActive && hasExitedFullscreen && !isMobile)
//         requestFullscreen();
//     };

//     const handleBackButton = (e) => {
//       e.preventDefault();
//       window.history.pushState(null, "", window.location.href);
//       toast({
//         title: "Navigation Blocked",
//         description:
//           "You cannot go back during the test. Please submit to exit.",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//     };

//     const handleBeforeUnload = (e) => {
//       e.preventDefault();
//       e.returnValue =
//         "Are you sure you want to leave? Your test progress may be lost.";
//       return e.returnValue;
//     };

//     document.addEventListener("fullscreenchange", handleFullscreenChange);
//     document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
//     document.addEventListener("MSFullscreenChange", handleFullscreenChange);
//     document.addEventListener("click", handleClickToFullscreen);
//     window.history.pushState(null, "", window.location.href);
//     window.addEventListener("popstate", handleBackButton);
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       document.removeEventListener("fullscreenchange", handleFullscreenChange);
//       document.removeEventListener(
//         "webkitfullscreenchange",
//         handleFullscreenChange,
//       );
//       document.removeEventListener(
//         "MSFullscreenChange",
//         handleFullscreenChange,
//       );
//       document.removeEventListener("click", handleClickToFullscreen);
//       window.removeEventListener("popstate", handleBackButton);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [isMobile, isFullscreenActive, hasExitedFullscreen, toast]);

//   // Prevent right-click
//   useEffect(() => {
//     const h = (e) => {
//       e.preventDefault();
//       return false;
//     };
//     document.addEventListener("contextmenu", h);
//     return () => document.removeEventListener("contextmenu", h);
//   }, []);

//   // Prevent shortcuts
//   useEffect(() => {
//     const h = (e) => {
//       if (e.key === "F11" || e.key === "Escape") e.preventDefault();
//       if (e.altKey && e.key === "F4") e.preventDefault();
//       if (e.ctrlKey && e.key === "w") e.preventDefault();
//     };
//     document.addEventListener("keydown", h);
//     return () => document.removeEventListener("keydown", h);
//   }, []);

//   // ─── Ref for giveMark (avoids stale closure in timer) ─────────
//   const giveMarkRef = useRef(null);

//   // ─── Timer effect ──────────────────────────────────────────────
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (isCountdown) {
//         const currentTimeInSeconds =
//           reversehour * 3600 + reversemin * 60 + reversesec;
//         if (currentTimeInSeconds <= 0) {
//           toast({
//             title: "Time's Up!",
//             description: "Your test is being submitted automatically.",
//             status: "warning",
//             duration: 3000,
//             isClosable: true,
//             position: "top",
//           });
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
//     return () => clearTimeout(timer);
//   }, [hour, min, sec, reversehour, reversemin, reversesec, isCountdown]);

//   // ─── Question navigation ───────────────────────────────────────
//   const handlequestion = (con) => {
//     if (con === "svn") {
//       if (
//         answer !== null &&
//         allAns[currentquestion] !== undefined &&
//         !answeredQuestion.includes(currentquestion)
//       ) {
//         if (markedNotAnswer.includes(currentquestion)) {
//           const r = markedNotAnswer.indexOf(currentquestion);
//           markedNotAnswer.splice(r, 1);
//         }
//         if (notAnswer.includes(currentquestion)) {
//           const r = notAnswer.indexOf(currentquestion);
//           notAnswer.splice(r, 1);
//         }
//         if (markedAndAnswer.includes(currentquestion)) {
//           const r = markedAndAnswer.indexOf(currentquestion);
//           markedAndAnswer.splice(r, 1);
//         }
//         setAnsweredQuestion([...answeredQuestion, currentquestion]);
//         if (question.length - 1 > currentquestion)
//           setcurrentquestion(currentquestion + 1);
//       } else if (allAns[currentquestion] === undefined && answer === null) {
//         if (!notAnswer.includes(currentquestion)) {
//           if (markedNotAnswer.includes(currentquestion)) {
//             const r = markedNotAnswer.indexOf(currentquestion);
//             markedNotAnswer.splice(r, 1);
//           }
//           if (markedAndAnswer.includes(currentquestion)) {
//             const r = markedAndAnswer.indexOf(currentquestion);
//             markedAndAnswer.splice(r, 1);
//           }
//           if (answeredQuestion.includes(currentquestion)) {
//             const r = answeredQuestion.indexOf(currentquestion);
//             answeredQuestion.splice(r, 1);
//           }
//           setNotAnswer([...notAnswer, currentquestion]);
//         }
//       }
//       if (question.length - 1 > currentquestion)
//         setcurrentquestion(currentquestion + 1);
//     } else {
//       if (
//         answer !== null &&
//         allAns[currentquestion] !== undefined &&
//         !answeredQuestion.includes(currentquestion)
//       ) {
//         if (markedNotAnswer.includes(currentquestion)) {
//           const r = markedNotAnswer.indexOf(currentquestion);
//           markedNotAnswer.splice(r, 1);
//         }
//         if (notAnswer.includes(currentquestion)) {
//           const r = notAnswer.indexOf(currentquestion);
//           notAnswer.splice(r, 1);
//         }
//         if (markedAndAnswer.includes(currentquestion)) {
//           const r = markedAndAnswer.indexOf(currentquestion);
//           markedAndAnswer.splice(r, 1);
//         }
//         setAnsweredQuestion([...answeredQuestion, currentquestion]);
//         if (question.length - 1 > currentquestion) setcurrentquestion(con);
//       } else if (
//         answer === null &&
//         allAns[currentquestion] === undefined &&
//         !notAnswer.includes(currentquestion) &&
//         currentquestion !== con
//       ) {
//         if (markedNotAnswer.includes(currentquestion)) {
//           const r = markedNotAnswer.indexOf(currentquestion);
//           markedNotAnswer.splice(r, 1);
//         }
//         if (markedAndAnswer.includes(currentquestion)) {
//           const r = markedAndAnswer.indexOf(currentquestion);
//           markedAndAnswer.splice(r, 1);
//         }
//         if (answeredQuestion.includes(currentquestion)) {
//           const r = answeredQuestion.indexOf(currentquestion);
//           answeredQuestion.splice(r, 1);
//         }
//         setNotAnswer([...notAnswer, currentquestion]);
//         if (question.length - 1 > currentquestion) setcurrentquestion(con);
//       }
//       if (con !== isNaN) setcurrentquestion(con);
//     }
//     setans(null);
//   };

//   const markedQuestion = () => {
//     if (allAns[currentquestion] === undefined && answer !== null) {
//       setAllAns((p) => ({ ...p, [currentquestion]: answer }));
//     }
//     if (
//       allAns[currentquestion] !== undefined &&
//       !markedAndAnswer.includes(currentquestion)
//     ) {
//       if (answeredQuestion.includes(currentquestion)) {
//         const r = answeredQuestion.indexOf(currentquestion);
//         answeredQuestion.splice(r, 1);
//       }
//       if (markedNotAnswer.includes(currentquestion)) {
//         const r = markedNotAnswer.indexOf(currentquestion);
//         notAnswer.splice(r, 1);
//       }
//       if (notAnswer.includes(currentquestion)) {
//         const r = notAnswer.indexOf(currentquestion);
//         notAnswer.splice(r, 1);
//       }
//       setMarkedAndAnswer([...markedAndAnswer, currentquestion]);
//       setans(null);
//     } else if (
//       allAns[currentquestion] === undefined &&
//       !markedNotAnswer.includes(currentquestion)
//     ) {
//       setAllAns((p) => {
//         const u = { ...p };
//         delete u[currentquestion];
//         return u;
//       });
//       if (answeredQuestion.includes(currentquestion)) {
//         const r = answeredQuestion.indexOf(currentquestion);
//         answeredQuestion.splice(r, 1);
//       }
//       if (markedAndAnswer.includes(currentquestion)) {
//         const r = markedAndAnswer.indexOf(currentquestion);
//         notAnswer.splice(r, 1);
//       }
//       if (notAnswer.includes(currentquestion)) {
//         const r = notAnswer.indexOf(currentquestion);
//         notAnswer.splice(r, 1);
//       }
//       setMarkedNotAnswer([...markedNotAnswer, currentquestion]);
//     }
//     if (question.length - 1 > currentquestion)
//       setcurrentquestion(currentquestion + 1);
//   };

//   const handleAnswer = (ans, qus) => {
//     setans(ans);
//     if (
//       question[currentquestion].answer === qus + 1 &&
//       !correctAns.includes(currentquestion)
//     ) {
//       if (wrongansqus.includes(currentquestion)) {
//         setwrong(wrongans - 1);
//         const r = wrongansqus.indexOf(currentquestion);
//         wrongansqus.splice(r, 1);
//       }
//       setMark((m) => m + 1);
//       setcorrectQus((p) => [...p, currentquestion]);
//       setCorrectAns((p) => [...p, currentquestion]);
//     } else if (
//       question[currentquestion].answer !== qus + 1 &&
//       correctAns.includes(currentquestion)
//     ) {
//       const r = correctAns.indexOf(currentquestion);
//       correctAns.splice(r, 1);
//       const r2 = correctQus.indexOf(currentquestion);
//       correctQus.splice(r2, 1);
//       setMark((m) => m - 1);
//       setwrong((w) => w + 1);
//     }
//     if (
//       question[currentquestion].answer !== qus + 1 &&
//       !correctAns.includes(currentquestion) &&
//       !wrongansqus.includes(currentquestion)
//     ) {
//       setwrong((w) => w + 1);
//       setwrongansqus((p) => [...p, currentquestion]);
//     }
//     setAllAns((p) => ({ ...p, [currentquestion]: ans }));
//   };

//   const handleClearAnswer = (questionIndex) => {
//     if (answeredQuestion.includes(currentquestion)) {
//       const r = answeredQuestion.indexOf(currentquestion);
//       answeredQuestion.splice(r, 1);
//     }
//     if (markedAndAnswer.includes(currentquestion)) {
//       const r = markedAndAnswer.indexOf(currentquestion);
//       markedAndAnswer.splice(r, 1);
//     }
//     if (markedNotAnswer.includes(currentquestion)) {
//       const r = markedNotAnswer.indexOf(currentquestion);
//       markedNotAnswer.splice(r, 1);
//     }
//     setAllAns((p) => {
//       const u = { ...p };
//       delete u[questionIndex];
//       return u;
//     });
//     if (!notAnswer.includes(currentquestion))
//       setNotAnswer([...notAnswer, currentquestion]);
//   };

//   const handleSubmitClick = () => setIsSubmitDialogOpen(true);
//   const handleCancelSubmit = () => setIsSubmitDialogOpen(false);
//   const handleConfirmSubmit = () => {
//     setIsSubmitDialogOpen(false);
//     giveMark();
//   };

//   // ─── Submit & save to backend ─────────────────────────────────
//   const giveMark = async () => {
//     try {
//       const subject = testMeta?.subject || "";
//       const category = testMeta?.category || subject;
//       const timeTaken = isCountdown
//         ? totalTimeInSeconds -
//           (reversehour * 3600 + reversemin * 60 + reversesec)
//         : hour * 3600 + min * 60 + sec;
//       const scorePercentage =
//         question.length > 0 ? Math.round((mark / question.length) * 100) : 0;

//       // Save to backend and capture percentile from API response
//       let apiPercentile = null;
//       let savedResultId = null;
//       if (testMeta?.testId) {
//         try {
//           const res = await resultsAPI.submit({
//             testId: testMeta.testId,
//             score: mark,
//             totalQuestions: question.length,
//             wrongAnswers: wrongans,
//             timeTaken,
//             allAnswers: allAns,
//             correctQus,
//             wrongQus: wrongansqus,
//             answeredQus: answeredQuestion,
//             notAnsweredQus: notAnswer,
//             markedAndAnswered: markedAndAnswer,
//             markedNotAnswered: markedNotAnswer,
//           });
//           apiPercentile = res.data?.percentile ?? res.percentile ?? null;
//           savedResultId = res.data?._id ?? res._id ?? null;

//           // Emit real-time event so CoachingPage updates instantly
//           const coachingId = res.data?.coachingId ?? null;
//           if (coachingId) {
//             socket.emit("test:submitted", {
//               coachingId: coachingId.toString(),
//               testId: testMeta.testId,
//             });
//           }
//         } catch (err) {
//           console.error("Save result error:", err);
//         }
//       }

//       // Exit fullscreen
//       if (document.exitFullscreen) document.exitFullscreen();
//       else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//       else if (document.msExitFullscreen) document.msExitFullscreen();
//       if (handleFullScreen) handleFullScreen(false);

//       // Pass ALL data to ResultPage via navigation state
//       navigate("/test-result", {
//         replace: true,
//         state: {
//           // Test metadata
//           testId: testMeta?.testId,
//           testTitle: testMeta?.testTitle || testMeta?.category || subject,
//           subject,
//           category,
//           // Score
//           score: mark,
//           totalQuestions: question.length,
//           scorePercentage,
//           percentile: apiPercentile,
//           savedResultId,
//           // Time
//           timeTaken,
//           // Question arrays (for review)
//           questions: question,
//           allAnswers: allAns,
//           // Status arrays
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

//   // Keep giveMark in ref so timer can call it without stale closure
//   giveMarkRef.current = giveMark;

//   const enterFullscreen = async () => {
//     const elem = document.documentElement;
//     try {
//       if (elem.requestFullscreen) await elem.requestFullscreen();
//       else if (elem.webkitRequestFullscreen)
//         await elem.webkitRequestFullscreen();
//       else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
//       setIsFullscreenActive(true);
//     } catch {
//       toast({
//         title: "Fullscreen Failed",
//         description: "Unable to enter fullscreen mode.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//         position: "top",
//       });
//     }
//   };

//   const handleClick = (newSize) => {
//     setSize(newSize);
//     onOpen();
//   };

//   // ─── Sidebar ──────────────────────────────────────────────────
//   const QuestionSidebar = () => (
//     <VStack spacing={4} align="stretch" h="100%">
//       <Box>
//         <Text fontSize="xl" fontWeight="bold" color="white">
//           Revision Karle
//         </Text>
//       </Box>
//       <Box borderTop="1px solid rgba(255,255,255,0.2)" pt={4}>
//         <VStack spacing={3} align="stretch">
//           {[
//             {
//               label: "Marked",
//               count: markedNotAnswer.length,
//               bg: "purple.500",
//               shape: "full",
//             },
//             {
//               label: "Not visited",
//               count:
//                 question.length -
//                 (markedAndAnswer.length +
//                   markedNotAnswer.length +
//                   answeredQuestion.length +
//                   notAnswer.length),
//               bg: "white",
//               textColor: "gray.600",
//               border: true,
//               shape: "4px",
//             },
//             {
//               label: "Answered",
//               count: answeredQuestion.length,
//               bg: "green.500",
//               shape: "50% 50% 0 0",
//             },
//             {
//               label: "Not Answered",
//               count: notAnswer.length,
//               bg: "red.500",
//               shape: "0 0 50% 50%",
//             },
//             {
//               label: "Marked & Answered",
//               count: markedAndAnswer.length,
//               bg: "purple.500",
//               shape: "full",
//             },
//           ].map(({ label, count, bg, textColor, border, shape }) => (
//             <HStack key={label} justify="space-between">
//               <Text color="white" fontSize="sm">
//                 {label}
//               </Text>
//               <Center
//                 minW="28px"
//                 h="28px"
//                 bg={bg}
//                 color={textColor || "white"}
//                 border={border ? "1px solid" : undefined}
//                 borderColor={border ? "gray.300" : undefined}
//                 borderRadius={shape}
//                 fontSize="sm"
//                 fontWeight="600"
//               >
//                 {count}
//               </Center>
//             </HStack>
//           ))}
//         </VStack>
//       </Box>
//       <Box flex="1" overflowY="auto">
//         <Grid templateColumns="repeat(5, 1fr)" gap={3}>
//           {question?.map((d, i) => (
//             <Center
//               key={i}
//               w="100%"
//               h="40px"
//               cursor="pointer"
//               onClick={() => handlequestion(i)}
//               bg={
//                 markedNotAnswer.includes(i)
//                   ? "purple.500"
//                   : answeredQuestion.includes(i)
//                     ? "green.500"
//                     : notAnswer.includes(i)
//                       ? "red.500"
//                       : markedAndAnswer.includes(i)
//                         ? "purple.500"
//                         : "white"
//               }
//               color={
//                 markedNotAnswer.includes(i) ||
//                 answeredQuestion.includes(i) ||
//                 notAnswer.includes(i) ||
//                 markedAndAnswer.includes(i)
//                   ? "white"
//                   : "gray.600"
//               }
//               borderRadius={
//                 markedAndAnswer.includes(i)
//                   ? "full"
//                   : markedNotAnswer.includes(i)
//                     ? "full"
//                     : answeredQuestion.includes(i)
//                       ? "50% 50% 0 0"
//                       : notAnswer.includes(i)
//                         ? "0 0 50% 50%"
//                         : "4px"
//               }
//               border="1px solid"
//               borderColor={
//                 markedNotAnswer.includes(i) ||
//                 answeredQuestion.includes(i) ||
//                 notAnswer.includes(i) ||
//                 markedAndAnswer.includes(i)
//                   ? "transparent"
//                   : "gray.300"
//               }
//               transition="all 0.2s"
//               _hover={{ transform: "scale(1.05)", shadow: "md" }}
//               fontSize="sm"
//               fontWeight="600"
//             >
//               {markedAndAnswer.includes(i) ? <>{i + 1} ✓</> : i + 1}
//             </Center>
//           ))}
//         </Grid>
//       </Box>
//       <VStack spacing={3} pt={4} borderTop="1px solid rgba(255,255,255,0.2)">
//         <Button
//           w="100%"
//           bg="white"
//           color="#4285f4"
//           fontWeight="600"
//           _hover={{ bg: "gray.100" }}
//         >
//           Instructions
//         </Button>
//         <Button
//           w="100%"
//           bg="#01bfbd"
//           color="white"
//           fontWeight="600"
//           _hover={{ bg: "#00a8a6" }}
//           onClick={handleSubmitClick}
//         >
//           Submit Test
//         </Button>
//       </VStack>
//     </VStack>
//   );

//   return (
//     <Box
//       h="100vh"
//       display="flex"
//       flexDirection="column"
//       bg="white"
//       position="relative"
//     >
//       {/* Fullscreen overlay */}
//       {!isMobile && !isFullscreenActive && hasExitedFullscreen && (
//         <Box
//           position="fixed"
//           top="0"
//           left="0"
//           right="0"
//           bottom="0"
//           bg="rgba(0,0,0,0.85)"
//           zIndex="9999"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           onClick={enterFullscreen}
//           cursor="pointer"
//         >
//           <VStack spacing={4} color="white" textAlign="center" p={8}>
//             <Heading size="xl">⚠️ Fullscreen Required</Heading>
//             <Text fontSize="lg">
//               You must stay in fullscreen mode during the test.
//             </Text>
//             <Button
//               size="lg"
//               colorScheme="blue"
//               onClick={enterFullscreen}
//               mt={4}
//             >
//               Click Here to Re-enter Fullscreen
//             </Button>
//           </VStack>
//         </Box>
//       )}

//       {/* Header */}
//       <Flex
//         bg="#4285f4"
//         color="white"
//         px={{ base: 3, sm: 4, md: 6 }}
//         py={{ base: 2, sm: 3 }}
//         align="center"
//         justify="space-between"
//         flexShrink={0}
//         gap={{ base: 2, sm: 3 }}
//       >
//         <Text
//           fontSize={{ base: "md", sm: "lg", md: "2xl" }}
//           fontWeight="bold"
//           flexShrink={0}
//         >
//           Revision Karle
//         </Text>
//         <Center
//           bg="#01bfbd"
//           px={{ base: 2, sm: 3, md: 4 }}
//           py={{ base: 1.5, sm: 2 }}
//           borderRadius="md"
//           fontWeight="600"
//           fontSize={{ base: "xs", sm: "sm", md: "md" }}
//           minW={{ base: "100px", sm: "130px", md: "160px" }}
//           flexShrink={0}
//         >
//           <HStack spacing={{ base: 0.5, sm: 1 }}>
//             <Text display={{ base: "none", sm: "inline" }}>
//               {isCountdown ? "Time Left" : "Time"}
//             </Text>
//             <Text>
//               {isCountdown
//                 ? `${reversehour < 10 ? `0${reversehour}` : reversehour}:${reversemin < 10 ? `0${reversemin}` : reversemin}:${reversesec < 10 ? `0${reversesec}` : reversesec}`
//                 : `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`}
//             </Text>
//           </HStack>
//         </Center>
//         <HStack spacing={{ base: 1, sm: 2 }} flexShrink={0}>
//           {!isMobile && !isFullscreenActive && (
//             <Button
//               size={{ base: "xs", sm: "sm" }}
//               variant="solid"
//               bg="#01bfbd"
//               color="white"
//               _hover={{ bg: "#00a8a6" }}
//               onClick={enterFullscreen}
//               fontSize={{ base: "xs", sm: "sm" }}
//               px={{ base: 2, sm: 3 }}
//               fontWeight="600"
//             >
//               Enter Fullscreen
//             </Button>
//           )}
//           <ModalPause
//             markedAndAnswer={markedAndAnswer}
//             question={question}
//             markedNotAnswer={markedNotAnswer}
//             notAnswer={notAnswer}
//             answered={answeredQuestion}
//           />
//         </HStack>
//       </Flex>

//       {/* Countdown info bar */}
//       {isCountdown && (
//         <Box
//           bg="orange.50"
//           borderBottom="2px solid"
//           borderColor="orange.300"
//           px={6}
//           py={3}
//         >
//           <Flex align="center" justify="center" gap={2} flexWrap="wrap">
//             <Text fontSize="sm" fontWeight="600" color="orange.800">
//               ⏱️ Time Limit:
//             </Text>
//             <Text fontSize="sm" fontWeight="700" color="orange.900">
//               {totalTimeInSeconds >= 3600
//                 ? `${Math.floor(totalTimeInSeconds / 3600)}h ${Math.floor((totalTimeInSeconds % 3600) / 60)}m`
//                 : `${Math.floor(totalTimeInSeconds / 60)} minutes`}
//             </Text>
//             <Text fontSize="xs" color="orange.600">
//               ({question.length} questions × 30 seconds each)
//             </Text>
//           </Flex>
//         </Box>
//       )}

//       {/* Body */}
//       <Flex flex="1" overflow="hidden">
//         <VStack flex="1" spacing={0} align="stretch" overflow="hidden">
//           <Flex
//             px={6}
//             py={3}
//             borderBottom="1px solid"
//             borderColor="gray.200"
//             justify="space-between"
//             align="center"
//             bg="gray.50"
//           >
//             <Text fontSize="sm" color="gray.600">
//               SECTIONS |{" "}
//               <Text as="span" fontWeight="600">
//                 {testMeta?.subject || "General"}
//               </Text>
//             </Text>
//             <ReportQuestionDropdown />
//           </Flex>
//           <Box px={6} py={3} bg="white">
//             <Text fontWeight="600" fontSize="md">
//               Question no {currentquestion + 1}
//             </Text>
//           </Box>
//           <Box
//             flex="1"
//             overflow="auto"
//             px={6}
//             py={4}
//             bg="white"
//             borderTop="1px solid"
//             borderColor="gray.200"
//           >
//             <Text mb={6} fontSize="md" lineHeight="tall">
//               {question[currentquestion]?.qus}
//             </Text>
//             <RadioGroup
//               value={allAns[currentquestion] || ""}
//               onChange={(value) => handleAnswer(currentquestion, value)}
//             >
//               <VStack align="stretch" spacing={3}>
//                 {question[currentquestion]?.options.map((d, i) => (
//                   <Box
//                     key={i}
//                     p={3}
//                     borderRadius="md"
//                     border="1px solid"
//                     borderColor={
//                       allAns[currentquestion] === d ? "blue.400" : "gray.200"
//                     }
//                     bg={allAns[currentquestion] === d ? "blue.50" : "white"}
//                     cursor="pointer"
//                     transition="all 0.2s"
//                     _hover={{ borderColor: "blue.300", bg: "gray.50" }}
//                     onClick={() => handleAnswer(d, i)}
//                   >
//                     <Radio
//                       value={d}
//                       isChecked={allAns[currentquestion] === d}
//                       colorScheme="blue"
//                     >
//                       <Text ml={2}>{d}</Text>
//                     </Radio>
//                   </Box>
//                 ))}
//               </VStack>
//             </RadioGroup>
//           </Box>
//           <Flex
//             px={6}
//             py={3}
//             borderTop="1px solid"
//             borderColor="gray.200"
//             justify="space-between"
//             align="center"
//             bg="white"
//             flexShrink={0}
//           >
//             <HStack spacing={2}>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 colorScheme="blue"
//                 onClick={markedQuestion}
//               >
//                 Review & Next
//               </Button>
//               <Button
//                 size="sm"
//                 variant="outline"
//                 colorScheme="blue"
//                 onClick={() => handleClearAnswer(currentquestion)}
//               >
//                 Clear Response
//               </Button>
//             </HStack>
//             <Button
//               size="sm"
//               display={{ base: "none", md: "inline-flex" }}
//               colorScheme="blue"
//               onClick={() => handlequestion("svn")}
//             >
//               Save & Next
//             </Button>
//           </Flex>
//           <Button
//             size="sm"
//             display={{ base: "flex", md: "none" }}
//             w="90%"
//             mx="auto"
//             mt={0}
//             colorScheme="blue"
//             onClick={() => handlequestion("svn")}
//           >
//             Save & Next
//           </Button>
//         </VStack>
//         {!isMobile && (
//           <Box
//             w="320px"
//             bg="#4285f4"
//             p={6}
//             borderLeft="1px solid"
//             borderColor="gray.200"
//             flexShrink={0}
//           >
//             <QuestionSidebar />
//           </Box>
//         )}
//       </Flex>

//       {/* Mobile drawer */}
//       {isMobile && (
//         <>
//           <Button
//             position="fixed"
//             bottom="4"
//             right="4"
//             colorScheme="blue"
//             onClick={() => handleClick("xs")}
//             borderRadius="full"
//             w="56px"
//             h="56px"
//             shadow="lg"
//           >
//             <HamburgerIcon w={6} h={6} />
//           </Button>
//           <Drawer onClose={onClose} isOpen={isOpen} size="xs" placement="right">
//             <DrawerOverlay />
//             <DrawerContent bg="#4285f4">
//               <DrawerCloseButton color="white" />
//               <DrawerHeader
//                 color="white"
//                 borderBottom="1px solid rgba(255,255,255,0.2)"
//               >
//                 Revision Karle
//               </DrawerHeader>
//               <DrawerBody p={6}>
//                 <QuestionSidebar />
//               </DrawerBody>
//             </DrawerContent>
//           </Drawer>
//         </>
//       )}

//       {/* Submit confirmation dialog */}
//       <AlertDialog
//         isOpen={isSubmitDialogOpen}
//         leastDestructiveRef={cancelSubmitRef}
//         onClose={handleCancelSubmit}
//         isCentered
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent mx={4}>
//             <AlertDialogHeader fontSize="lg" fontWeight="bold">
//               Submit Test
//             </AlertDialogHeader>
//             <AlertDialogBody>
//               <VStack align="start" spacing={3}>
//                 <Text>Are you sure you want to submit the test?</Text>
//                 <Box w="100%" p={3} bg="gray.50" borderRadius="md">
//                   <Text fontSize="sm" fontWeight="600" mb={2}>
//                     Test Summary:
//                   </Text>
//                   <Text fontSize="sm">Total Questions: {question.length}</Text>
//                   <Text fontSize="sm" color="green.600">
//                     Answered: {answeredQuestion.length}
//                   </Text>
//                   <Text fontSize="sm" color="red.600">
//                     Not Answered: {notAnswer.length}
//                   </Text>
//                   <Text fontSize="sm" color="purple.600">
//                     Marked for Review:{" "}
//                     {markedNotAnswer.length + markedAndAnswer.length}
//                   </Text>
//                   <Text fontSize="sm" color="gray.600">
//                     Not Visited:{" "}
//                     {question.length -
//                       (markedAndAnswer.length +
//                         markedNotAnswer.length +
//                         answeredQuestion.length +
//                         notAnswer.length)}
//                   </Text>
//                 </Box>
//                 <Text fontSize="sm" color="red.500" fontWeight="500">
//                   ⚠️ Once submitted, you cannot change your answers.
//                 </Text>
//               </VStack>
//             </AlertDialogBody>
//             <AlertDialogFooter>
//               <Button ref={cancelSubmitRef} onClick={handleCancelSubmit}>
//                 Cancel
//               </Button>
//               <Button colorScheme="blue" onClick={handleConfirmSubmit} ml={3}>
//                 Yes, Submit
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
  Heading,
  Radio,
  RadioGroup,
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
import { socket } from "../services/socket";
import ReportQuestionDropdown from "./ReportQuestionDropdown";
import {
  FaFlag,
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
} from "react-icons/fa";

// ─── Design tokens ─────────────────────────────────────────────────
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

// ─── Question status helpers ───────────────────────────────────────
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

// ─── Timer widget ──────────────────────────────────────────────────
function TimerWidget({ h, m, s, isCountdown, totalSec }) {
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

// ═══════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════
const TakeTest = ({ handleFullScreen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { user } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isMobile] = useMediaQuery("(max-width: 768px)");

  const quest = location.state?.quest ?? [];
  const testMeta = location.state?.testMeta ?? {};

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
  const [mark, setMark] = useState(0);
  const [correctQus, setcorrectQus] = useState([]);
  const [correctAns, setCorrectAns] = useState([]);
  const [animKey, setAnimKey] = useState(0);

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

  const [isFullscreenActive, setIsFullscreenActive] = useState(false);
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

  // ── Fullscreen & security guards ─────────────────────────────────
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

  // ── Timer ─────────────────────────────────────────────────────────
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

  // ── Navigation helper ─────────────────────────────────────────────
  const goToQuestion = (idx) => {
    setcurrentquestion(idx);
    setans(
      allAns[idx] !== undefined
        ? (question[idx]?.options?.[allAns[idx]] ?? null)
        : null,
    );
    setAnimKey((k) => k + 1);
  };

  // ── Question flow (original logic preserved) ──────────────────────
  const handlequestion = (con) => {
    if (con === "svn") {
      if (
        answer !== null &&
        allAns[currentquestion] !== undefined &&
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
      } else if (allAns[currentquestion] === undefined && answer === null) {
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
        allAns[currentquestion] !== undefined &&
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
        allAns[currentquestion] === undefined &&
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
    setans(null);
  };

  const markedQuestion = () => {
    if (allAns[currentquestion] === undefined && answer !== null)
      setAllAns((p) => ({ ...p, [currentquestion]: answer }));
    if (
      allAns[currentquestion] !== undefined &&
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
      allAns[currentquestion] === undefined &&
      !markedNotAnswer.includes(currentquestion)
    ) {
      setAllAns((p) => {
        const u = { ...p };
        delete u[currentquestion];
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
    setAllAns((p) => ({ ...p, [currentquestion]: optionIndex }));
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
      return u;
    });
    if (!notAnswer.includes(currentquestion))
      setNotAnswer([...notAnswer, currentquestion]);
    setans(null);
  };

  const giveMark = async () => {
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
            allAnswers: allAns,
            correctQus,
            wrongQus: wrongansqus,
            answeredQus: answeredQuestion,
            notAnsweredQus: notAnswer,
            markedAndAnswered: markedAndAnswer,
            markedNotAnswered: markedNotAnswer,
          });
          apiPercentile = res.data?.percentile ?? res.percentile ?? null;
          savedResultId = res.data?._id ?? res._id ?? null;
          const coachingId = res.data?.coachingId ?? null;
          if (coachingId)
            socket.emit("test:submitted", {
              coachingId: coachingId.toString(),
              testId: testMeta.testId,
            });
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
          questions: question,
          allAnswers: allAns,
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

  // ── Question Sidebar ──────────────────────────────────────────────
  const QuestionSidebar = () => (
    <Flex direction="column" h="100%" overflow="hidden">
      {/* Sidebar header */}
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

      {/* Progress */}
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

      {/* Legend */}
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

      {/* Question grid */}
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

      {/* Sidebar submit btn */}
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
      {/* ── Fullscreen overlay ─── */}
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

      {/* ── Header ─── */}
      <Flex
        bg="linear-gradient(135deg, #0b1e3d 0%, #132952 60%, #1a3a6e 100%)"
        px={{ base: 3, md: 5 }}
        h={{ base: "56px", md: "62px" }}
        align="center"
        justify="space-between"
        flexShrink={0}
        boxShadow="0 2px 16px rgba(11,30,61,.5)"
        position="relative"
        zIndex={10}
      >
        {/* Brand */}
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

        {/* Timer */}
        <TimerWidget
          h={isCountdown ? reversehour : hour}
          m={isCountdown ? reversemin : min}
          s={isCountdown ? reversesec : sec}
          isCountdown={isCountdown}
          totalSec={totalTimeInSeconds}
        />

        {/* Right actions */}
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

      {/* ── Progress strip ─── */}
      <Box h="3px" bg="rgba(37,99,235,.12)" flexShrink={0}>
        <Box
          h="100%"
          bg="linear-gradient(90deg,#2563eb,#0d9488)"
          w={`${progressPct}%`}
          transition="width .6s ease"
          boxShadow="0 0 8px rgba(37,99,235,.45)"
        />
      </Box>

      {/* ── Body ─── */}
      <Flex flex={1} overflow="hidden">
        {/* ── Question Panel ── */}
        <Flex direction="column" flex={1} overflow="hidden">
          {/* Sub-header */}
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
            {/* Question card */}
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

            {/* Options */}
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
                        ? "0 0 0 3px rgba(37,99,235,.1), 0 4px 16px rgba(37,99,235,.08)"
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

          {/* ── Bottom action bar ── */}
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

            {/* Mobile compact dot nav */}
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

        {/* ── Desktop Sidebar ── */}
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

      {/* ── Mobile Drawer ── */}
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

      {/* ── Submit Dialog ── */}
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
            {/* Dialog header */}
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