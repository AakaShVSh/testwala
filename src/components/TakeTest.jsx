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
} from "@chakra-ui/react";
import ModalPause from "./ModalPause";
import { useNavigate, useLocation } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import { resultsAPI } from "../services/api";
import { socket } from "../services/socket";
import ReportQuestionDropdown from "./ReportQuestionDropdown";

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
  const [answer, setans] = useState(null); // stores option TEXT for UI highlight
  const [wrongans, setwrong] = useState(0);
  const [wrongansqus, setwrongansqus] = useState([]);
  const [allAns, setAllAns] = useState({}); // stores option INDEX (number) for backend
  const [mark, setMark] = useState(0);
  const [correctQus, setcorrectQus] = useState([]);
  const [correctAns, setCorrectAns] = useState([]);

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
  const [size, setSize] = useState("");

  useEffect(() => {
    let isRequestingFullscreen = false;
    const requestFullscreen = async () => {
      if (isRequestingFullscreen) return;
      isRequestingFullscreen = true;
      const elem = document.documentElement;
      try {
        if (elem.requestFullscreen) await elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen)
          await elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
        setIsFullscreenActive(true);
      } catch {
        if (hasExitedFullscreen) {
          toast({
            title: "Fullscreen Required",
            description: "Please click anywhere to re-enter fullscreen mode.",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
        }
      } finally {
        isRequestingFullscreen = false;
      }
    };
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
      if (!isCurrentlyFullscreen && isFullscreenActive) {
        setIsFullscreenActive(false);
        setHasExitedFullscreen(true);
        toast({
          title: "Fullscreen Exited",
          description: "Click anywhere to re-enter fullscreen mode.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      } else if (isCurrentlyFullscreen) setIsFullscreenActive(true);
    };
    const handleClickToFullscreen = () => {
      if (!isFullscreenActive && hasExitedFullscreen && !isMobile)
        requestFullscreen();
    };
    const handleBackButton = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.href);
      toast({
        title: "Navigation Blocked",
        description:
          "You cannot go back during the test. Please submit to exit.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    };
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your test progress may be lost.";
      return e.returnValue;
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    document.addEventListener("click", handleClickToFullscreen);
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange,
      );
      document.removeEventListener("click", handleClickToFullscreen);
      window.removeEventListener("popstate", handleBackButton);
      window.removeEventListener("beforeunload", handleBeforeUnload);
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

  const giveMarkRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isCountdown) {
        const currentTimeInSeconds =
          reversehour * 3600 + reversemin * 60 + reversesec;
        if (currentTimeInSeconds <= 0) {
          toast({
            title: "Time's Up!",
            description: "Your test is being submitted automatically.",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "top",
          });
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
    return () => clearTimeout(timer);
  }, [hour, min, sec, reversehour, reversemin, reversesec, isCountdown]);

  const handlequestion = (con) => {
    if (con === "svn") {
      if (
        answer !== null &&
        allAns[currentquestion] !== undefined &&
        !answeredQuestion.includes(currentquestion)
      ) {
        if (markedNotAnswer.includes(currentquestion)) {
          const r = markedNotAnswer.indexOf(currentquestion);
          markedNotAnswer.splice(r, 1);
        }
        if (notAnswer.includes(currentquestion)) {
          const r = notAnswer.indexOf(currentquestion);
          notAnswer.splice(r, 1);
        }
        if (markedAndAnswer.includes(currentquestion)) {
          const r = markedAndAnswer.indexOf(currentquestion);
          markedAndAnswer.splice(r, 1);
        }
        setAnsweredQuestion([...answeredQuestion, currentquestion]);
        if (question.length - 1 > currentquestion)
          setcurrentquestion(currentquestion + 1);
      } else if (allAns[currentquestion] === undefined && answer === null) {
        if (!notAnswer.includes(currentquestion)) {
          if (markedNotAnswer.includes(currentquestion)) {
            const r = markedNotAnswer.indexOf(currentquestion);
            markedNotAnswer.splice(r, 1);
          }
          if (markedAndAnswer.includes(currentquestion)) {
            const r = markedAndAnswer.indexOf(currentquestion);
            markedAndAnswer.splice(r, 1);
          }
          if (answeredQuestion.includes(currentquestion)) {
            const r = answeredQuestion.indexOf(currentquestion);
            answeredQuestion.splice(r, 1);
          }
          setNotAnswer([...notAnswer, currentquestion]);
        }
      }
      if (question.length - 1 > currentquestion)
        setcurrentquestion(currentquestion + 1);
    } else {
      if (
        answer !== null &&
        allAns[currentquestion] !== undefined &&
        !answeredQuestion.includes(currentquestion)
      ) {
        if (markedNotAnswer.includes(currentquestion)) {
          const r = markedNotAnswer.indexOf(currentquestion);
          markedNotAnswer.splice(r, 1);
        }
        if (notAnswer.includes(currentquestion)) {
          const r = notAnswer.indexOf(currentquestion);
          notAnswer.splice(r, 1);
        }
        if (markedAndAnswer.includes(currentquestion)) {
          const r = markedAndAnswer.indexOf(currentquestion);
          markedAndAnswer.splice(r, 1);
        }
        setAnsweredQuestion([...answeredQuestion, currentquestion]);
        if (question.length - 1 > currentquestion) setcurrentquestion(con);
      } else if (
        answer === null &&
        allAns[currentquestion] === undefined &&
        !notAnswer.includes(currentquestion) &&
        currentquestion !== con
      ) {
        if (markedNotAnswer.includes(currentquestion)) {
          const r = markedNotAnswer.indexOf(currentquestion);
          markedNotAnswer.splice(r, 1);
        }
        if (markedAndAnswer.includes(currentquestion)) {
          const r = markedAndAnswer.indexOf(currentquestion);
          markedAndAnswer.splice(r, 1);
        }
        if (answeredQuestion.includes(currentquestion)) {
          const r = answeredQuestion.indexOf(currentquestion);
          answeredQuestion.splice(r, 1);
        }
        setNotAnswer([...notAnswer, currentquestion]);
        if (question.length - 1 > currentquestion) setcurrentquestion(con);
      }
      if (con !== isNaN) setcurrentquestion(con);
    }
    setans(null);
  };

  const markedQuestion = () => {
    if (allAns[currentquestion] === undefined && answer !== null) {
      setAllAns((p) => ({ ...p, [currentquestion]: answer }));
    }
    if (
      allAns[currentquestion] !== undefined &&
      !markedAndAnswer.includes(currentquestion)
    ) {
      if (answeredQuestion.includes(currentquestion)) {
        const r = answeredQuestion.indexOf(currentquestion);
        answeredQuestion.splice(r, 1);
      }
      if (markedNotAnswer.includes(currentquestion)) {
        const r = markedNotAnswer.indexOf(currentquestion);
        notAnswer.splice(r, 1);
      }
      if (notAnswer.includes(currentquestion)) {
        const r = notAnswer.indexOf(currentquestion);
        notAnswer.splice(r, 1);
      }
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
      if (answeredQuestion.includes(currentquestion)) {
        const r = answeredQuestion.indexOf(currentquestion);
        answeredQuestion.splice(r, 1);
      }
      if (markedAndAnswer.includes(currentquestion)) {
        const r = markedAndAnswer.indexOf(currentquestion);
        notAnswer.splice(r, 1);
      }
      if (notAnswer.includes(currentquestion)) {
        const r = notAnswer.indexOf(currentquestion);
        notAnswer.splice(r, 1);
      }
      setMarkedNotAnswer([...markedNotAnswer, currentquestion]);
    }
    if (question.length - 1 > currentquestion)
      setcurrentquestion(currentquestion + 1);
  };

  // ─── FIX: store option INDEX (number) not option text (string) ────────────
  // Backend schema: allAnswers: Map<String, Number>
  // optionText → used only for UI highlight (setans)
  // optionIndex → stored in allAns and sent to backend
  const handleAnswer = (optionText, optionIndex) => {
    setans(optionText); // for UI highlight only

    // 0-based index comparison (backend stores answer as 0-based index)
    const isCorrect = question[currentquestion].answer === optionIndex;

    if (isCorrect && !correctAns.includes(currentquestion)) {
      if (wrongansqus.includes(currentquestion)) {
        setwrong((w) => w - 1);
        const r = wrongansqus.indexOf(currentquestion);
        wrongansqus.splice(r, 1);
      }
      setMark((m) => m + 1);
      setcorrectQus((p) => [...p, currentquestion]);
      setCorrectAns((p) => [...p, currentquestion]);
    } else if (!isCorrect && correctAns.includes(currentquestion)) {
      const r = correctAns.indexOf(currentquestion);
      correctAns.splice(r, 1);
      const r2 = correctQus.indexOf(currentquestion);
      correctQus.splice(r2, 1);
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

    // ✅ Store the numeric INDEX, not the string text
    setAllAns((p) => ({ ...p, [currentquestion]: optionIndex }));
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleClearAnswer = (questionIndex) => {
    if (answeredQuestion.includes(currentquestion)) {
      const r = answeredQuestion.indexOf(currentquestion);
      answeredQuestion.splice(r, 1);
    }
    if (markedAndAnswer.includes(currentquestion)) {
      const r = markedAndAnswer.indexOf(currentquestion);
      markedAndAnswer.splice(r, 1);
    }
    if (markedNotAnswer.includes(currentquestion)) {
      const r = markedNotAnswer.indexOf(currentquestion);
      markedNotAnswer.splice(r, 1);
    }
    setAllAns((p) => {
      const u = { ...p };
      delete u[questionIndex];
      return u;
    });
    if (!notAnswer.includes(currentquestion))
      setNotAnswer([...notAnswer, currentquestion]);
    setans(null);
  };

  const handleSubmitClick = () => setIsSubmitDialogOpen(true);
  const handleCancelSubmit = () => setIsSubmitDialogOpen(false);
  const handleConfirmSubmit = () => {
    setIsSubmitDialogOpen(false);
    giveMark();
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

      let apiPercentile = null;
      let savedResultId = null;
      if (testMeta?.testId) {
        try {
          const res = await resultsAPI.submit({
            testId: testMeta.testId,
            score: mark,
            totalQuestions: question.length,
            wrongAnswers: wrongans,
            timeTaken,
            allAnswers: allAns, // ✅ now contains {0: 2, 1: 0, ...} (all numbers)
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
          if (coachingId) {
            socket.emit("test:submitted", {
              coachingId: coachingId.toString(),
              testId: testMeta.testId,
            });
          }
        } catch (err) {
          console.error("Save result error:", err);
        }
      }

      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
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
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen)
        await elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
      setIsFullscreenActive(true);
    } catch {
      toast({
        title: "Fullscreen Failed",
        description: "Unable to enter fullscreen mode.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };

  const QuestionSidebar = () => (
    <VStack spacing={4} align="stretch" h="100%">
      <Box>
        <Text fontSize="xl" fontWeight="bold" color="white">
          Revision Karle
        </Text>
      </Box>
      <Box borderTop="1px solid rgba(255,255,255,0.2)" pt={4}>
        <VStack spacing={3} align="stretch">
          {[
            {
              label: "Marked",
              count: markedNotAnswer.length,
              bg: "purple.500",
              shape: "full",
            },
            {
              label: "Not visited",
              count:
                question.length -
                (markedAndAnswer.length +
                  markedNotAnswer.length +
                  answeredQuestion.length +
                  notAnswer.length),
              bg: "white",
              textColor: "gray.600",
              border: true,
              shape: "4px",
            },
            {
              label: "Answered",
              count: answeredQuestion.length,
              bg: "green.500",
              shape: "50% 50% 0 0",
            },
            {
              label: "Not Answered",
              count: notAnswer.length,
              bg: "red.500",
              shape: "0 0 50% 50%",
            },
            {
              label: "Marked & Answered",
              count: markedAndAnswer.length,
              bg: "purple.500",
              shape: "full",
            },
          ].map(({ label, count, bg, textColor, border, shape }) => (
            <HStack key={label} justify="space-between">
              <Text color="white" fontSize="sm">
                {label}
              </Text>
              <Center
                minW="28px"
                h="28px"
                bg={bg}
                color={textColor || "white"}
                border={border ? "1px solid" : undefined}
                borderColor={border ? "gray.300" : undefined}
                borderRadius={shape}
                fontSize="sm"
                fontWeight="600"
              >
                {count}
              </Center>
            </HStack>
          ))}
        </VStack>
      </Box>
      <Box flex="1" overflowY="auto">
        <Grid templateColumns="repeat(5, 1fr)" gap={3}>
          {question?.map((d, i) => (
            <Center
              key={i}
              w="100%"
              h="40px"
              cursor="pointer"
              onClick={() => handlequestion(i)}
              bg={
                markedNotAnswer.includes(i)
                  ? "purple.500"
                  : answeredQuestion.includes(i)
                    ? "green.500"
                    : notAnswer.includes(i)
                      ? "red.500"
                      : markedAndAnswer.includes(i)
                        ? "purple.500"
                        : "white"
              }
              color={
                markedNotAnswer.includes(i) ||
                answeredQuestion.includes(i) ||
                notAnswer.includes(i) ||
                markedAndAnswer.includes(i)
                  ? "white"
                  : "gray.600"
              }
              borderRadius={
                markedAndAnswer.includes(i)
                  ? "full"
                  : markedNotAnswer.includes(i)
                    ? "full"
                    : answeredQuestion.includes(i)
                      ? "50% 50% 0 0"
                      : notAnswer.includes(i)
                        ? "0 0 50% 50%"
                        : "4px"
              }
              border="1px solid"
              borderColor={
                markedNotAnswer.includes(i) ||
                answeredQuestion.includes(i) ||
                notAnswer.includes(i) ||
                markedAndAnswer.includes(i)
                  ? "transparent"
                  : "gray.300"
              }
              transition="all 0.2s"
              _hover={{ transform: "scale(1.05)", shadow: "md" }}
              fontSize="sm"
              fontWeight="600"
            >
              {markedAndAnswer.includes(i) ? <>{i + 1} ✓</> : i + 1}
            </Center>
          ))}
        </Grid>
      </Box>
      <VStack spacing={3} pt={4} borderTop="1px solid rgba(255,255,255,0.2)">
        <Button
          w="100%"
          bg="white"
          color="#4285f4"
          fontWeight="600"
          _hover={{ bg: "gray.100" }}
        >
          Instructions
        </Button>
        <Button
          w="100%"
          bg="#01bfbd"
          color="white"
          fontWeight="600"
          _hover={{ bg: "#00a8a6" }}
          onClick={handleSubmitClick}
        >
          Submit Test
        </Button>
      </VStack>
    </VStack>
  );

  return (
    <Box
      h="100vh"
      display="flex"
      flexDirection="column"
      bg="white"
      position="relative"
    >
      {!isMobile && !isFullscreenActive && hasExitedFullscreen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,0.85)"
          zIndex="9999"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={enterFullscreen}
          cursor="pointer"
        >
          <VStack spacing={4} color="white" textAlign="center" p={8}>
            <Heading size="xl">⚠️ Fullscreen Required</Heading>
            <Text fontSize="lg">
              You must stay in fullscreen mode during the test.
            </Text>
            <Button
              size="lg"
              colorScheme="blue"
              onClick={enterFullscreen}
              mt={4}
            >
              Click Here to Re-enter Fullscreen
            </Button>
          </VStack>
        </Box>
      )}

      <Flex
        bg="#4285f4"
        color="white"
        px={{ base: 3, sm: 4, md: 6 }}
        py={{ base: 2, sm: 3 }}
        align="center"
        justify="space-between"
        flexShrink={0}
        gap={{ base: 2, sm: 3 }}
      >
        <Text
          fontSize={{ base: "md", sm: "lg", md: "2xl" }}
          fontWeight="bold"
          flexShrink={0}
        >
          Revision Karle
        </Text>
        <Center
          bg="#01bfbd"
          px={{ base: 2, sm: 3, md: 4 }}
          py={{ base: 1.5, sm: 2 }}
          borderRadius="md"
          fontWeight="600"
          fontSize={{ base: "xs", sm: "sm", md: "md" }}
          minW={{ base: "100px", sm: "130px", md: "160px" }}
          flexShrink={0}
        >
          <HStack spacing={{ base: 0.5, sm: 1 }}>
            <Text display={{ base: "none", sm: "inline" }}>
              {isCountdown ? "Time Left" : "Time"}
            </Text>
            <Text>
              {isCountdown
                ? `${reversehour < 10 ? `0${reversehour}` : reversehour}:${reversemin < 10 ? `0${reversemin}` : reversemin}:${reversesec < 10 ? `0${reversesec}` : reversesec}`
                : `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`}
            </Text>
          </HStack>
        </Center>
        <HStack spacing={{ base: 1, sm: 2 }} flexShrink={0}>
          {!isMobile && !isFullscreenActive && (
            <Button
              size={{ base: "xs", sm: "sm" }}
              variant="solid"
              bg="#01bfbd"
              color="white"
              _hover={{ bg: "#00a8a6" }}
              onClick={enterFullscreen}
              fontSize={{ base: "xs", sm: "sm" }}
              px={{ base: 2, sm: 3 }}
              fontWeight="600"
            >
              Enter Fullscreen
            </Button>
          )}
          <ModalPause
            markedAndAnswer={markedAndAnswer}
            question={question}
            markedNotAnswer={markedNotAnswer}
            notAnswer={notAnswer}
            answered={answeredQuestion}
          />
        </HStack>
      </Flex>

      {isCountdown && (
        <Box
          bg="orange.50"
          borderBottom="2px solid"
          borderColor="orange.300"
          px={6}
          py={3}
        >
          <Flex align="center" justify="center" gap={2} flexWrap="wrap">
            <Text fontSize="sm" fontWeight="600" color="orange.800">
              ⏱️ Time Limit:
            </Text>
            <Text fontSize="sm" fontWeight="700" color="orange.900">
              {totalTimeInSeconds >= 3600
                ? `${Math.floor(totalTimeInSeconds / 3600)}h ${Math.floor((totalTimeInSeconds % 3600) / 60)}m`
                : `${Math.floor(totalTimeInSeconds / 60)} minutes`}
            </Text>
            <Text fontSize="xs" color="orange.600">
              ({question.length} questions × 30 seconds each)
            </Text>
          </Flex>
        </Box>
      )}

      <Flex flex="1" overflow="hidden">
        <VStack flex="1" spacing={0} align="stretch" overflow="hidden">
          <Flex
            px={6}
            py={3}
            borderBottom="1px solid"
            borderColor="gray.200"
            justify="space-between"
            align="center"
            bg="gray.50"
          >
            <Text fontSize="sm" color="gray.600">
              SECTIONS |{" "}
              <Text as="span" fontWeight="600">
                {testMeta?.subject || "General"}
              </Text>
            </Text>
            <ReportQuestionDropdown />
          </Flex>
          <Box px={6} py={3} bg="white">
            <Text fontWeight="600" fontSize="md">
              Question no {currentquestion + 1}
            </Text>
          </Box>
          <Box
            flex="1"
            overflow="auto"
            px={6}
            py={4}
            bg="white"
            borderTop="1px solid"
            borderColor="gray.200"
          >
            <Text mb={6} fontSize="md" lineHeight="tall">
              {question[currentquestion]?.qus}
            </Text>
            {/* RadioGroup value uses option text for UI highlight */}
            <RadioGroup value={answer || ""}>
              <VStack align="stretch" spacing={3}>
                {question[currentquestion]?.options.map((d, i) => (
                  <Box
                    key={i}
                    p={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={answer === d ? "blue.400" : "gray.200"}
                    bg={answer === d ? "blue.50" : "white"}
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ borderColor: "blue.300", bg: "gray.50" }}
                    onClick={() => handleAnswer(d, i)}
                  >
                    <Radio
                      value={d}
                      isChecked={answer === d}
                      colorScheme="blue"
                    >
                      <Text ml={2}>{d}</Text>
                    </Radio>
                  </Box>
                ))}
              </VStack>
            </RadioGroup>
          </Box>
          <Flex
            px={6}
            py={3}
            borderTop="1px solid"
            borderColor="gray.200"
            justify="space-between"
            align="center"
            bg="white"
            flexShrink={0}
          >
            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                onClick={markedQuestion}
              >
                Review & Next
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                onClick={() => handleClearAnswer(currentquestion)}
              >
                Clear Response
              </Button>
            </HStack>
            <Button
              size="sm"
              display={{ base: "none", md: "inline-flex" }}
              colorScheme="blue"
              onClick={() => handlequestion("svn")}
            >
              Save & Next
            </Button>
          </Flex>
          <Button
            size="sm"
            display={{ base: "flex", md: "none" }}
            w="90%"
            mx="auto"
            mt={0}
            colorScheme="blue"
            onClick={() => handlequestion("svn")}
          >
            Save & Next
          </Button>
        </VStack>

        {!isMobile && (
          <Box
            w="320px"
            bg="#4285f4"
            p={6}
            borderLeft="1px solid"
            borderColor="gray.200"
            flexShrink={0}
          >
            <QuestionSidebar />
          </Box>
        )}
      </Flex>

      {isMobile && (
        <>
          <Button
            position="fixed"
            bottom="4"
            right="4"
            colorScheme="blue"
            onClick={() => handleClick("xs")}
            borderRadius="full"
            w="56px"
            h="56px"
            shadow="lg"
          >
            <HamburgerIcon w={6} h={6} />
          </Button>
          <Drawer onClose={onClose} isOpen={isOpen} size="xs" placement="right">
            <DrawerOverlay />
            <DrawerContent bg="#4285f4">
              <DrawerCloseButton color="white" />
              <DrawerHeader
                color="white"
                borderBottom="1px solid rgba(255,255,255,0.2)"
              >
                Revision Karle
              </DrawerHeader>
              <DrawerBody p={6}>
                <QuestionSidebar />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}

      <AlertDialog
        isOpen={isSubmitDialogOpen}
        leastDestructiveRef={cancelSubmitRef}
        onClose={handleCancelSubmit}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx={4}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Submit Test
            </AlertDialogHeader>
            <AlertDialogBody>
              <VStack align="start" spacing={3}>
                <Text>Are you sure you want to submit the test?</Text>
                <Box w="100%" p={3} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm" fontWeight="600" mb={2}>
                    Test Summary:
                  </Text>
                  <Text fontSize="sm">Total Questions: {question.length}</Text>
                  <Text fontSize="sm" color="green.600">
                    Answered: {answeredQuestion.length}
                  </Text>
                  <Text fontSize="sm" color="red.600">
                    Not Answered: {notAnswer.length}
                  </Text>
                  <Text fontSize="sm" color="purple.600">
                    Marked for Review:{" "}
                    {markedNotAnswer.length + markedAndAnswer.length}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Not Visited:{" "}
                    {question.length -
                      (markedAndAnswer.length +
                        markedNotAnswer.length +
                        answeredQuestion.length +
                        notAnswer.length)}
                  </Text>
                </Box>
                <Text fontSize="sm" color="red.500" fontWeight="500">
                  ⚠️ Once submitted, you cannot change your answers.
                </Text>
              </VStack>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelSubmitRef} onClick={handleCancelSubmit}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleConfirmSubmit} ml={3}>
                Yes, Submit
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default TakeTest;