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

// const TakeTest = ({ handleFullScreen }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const toast = useToast();
//   const { user } = useAuth();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [isMobile] = useMediaQuery("(max-width: 768px)");

//   const quest = location.state?.quest ?? [];
//   const testMeta = location.state?.testMeta ?? {};

//   const [question] = useState(() => [...quest].sort(() => Math.random() - 0.5));

//   const [currentquestion, setcurrentquestion] = useState(0);
//   const [answeredQuestion, setAnsweredQuestion] = useState([]);
//   const [markedAndAnswer, setMarkedAndAnswer] = useState([]);
//   const [markedNotAnswer, setMarkedNotAnswer] = useState([]);
//   const [notAnswer, setNotAnswer] = useState([]);
//   const [answer, setans] = useState(null); // stores option TEXT for UI highlight
//   const [wrongans, setwrong] = useState(0);
//   const [wrongansqus, setwrongansqus] = useState([]);
//   const [allAns, setAllAns] = useState({}); // stores option INDEX (number) for backend
//   const [mark, setMark] = useState(0);
//   const [correctQus, setcorrectQus] = useState([]);
//   const [correctAns, setCorrectAns] = useState([]);

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
//   const [size, setSize] = useState("");

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
//       } else if (isCurrentlyFullscreen) setIsFullscreenActive(true);
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

//   const giveMarkRef = useRef(null);

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

//   // ─── FIX: store option INDEX (number) not option text (string) ────────────
//   // Backend schema: allAnswers: Map<String, Number>
//   // optionText → used only for UI highlight (setans)
//   // optionIndex → stored in allAns and sent to backend
//   const handleAnswer = (optionText, optionIndex) => {
//     setans(optionText); // for UI highlight only

//     // 0-based index comparison (backend stores answer as 0-based index)
//     const isCorrect = question[currentquestion].answer === optionIndex;

//     if (isCorrect && !correctAns.includes(currentquestion)) {
//       if (wrongansqus.includes(currentquestion)) {
//         setwrong((w) => w - 1);
//         const r = wrongansqus.indexOf(currentquestion);
//         wrongansqus.splice(r, 1);
//       }
//       setMark((m) => m + 1);
//       setcorrectQus((p) => [...p, currentquestion]);
//       setCorrectAns((p) => [...p, currentquestion]);
//     } else if (!isCorrect && correctAns.includes(currentquestion)) {
//       const r = correctAns.indexOf(currentquestion);
//       correctAns.splice(r, 1);
//       const r2 = correctQus.indexOf(currentquestion);
//       correctQus.splice(r2, 1);
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

//     // ✅ Store the numeric INDEX, not the string text
//     setAllAns((p) => ({ ...p, [currentquestion]: optionIndex }));
//   };
//   // ─────────────────────────────────────────────────────────────────────────

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
//     setans(null);
//   };

//   const handleSubmitClick = () => setIsSubmitDialogOpen(true);
//   const handleCancelSubmit = () => setIsSubmitDialogOpen(false);
//   const handleConfirmSubmit = () => {
//     setIsSubmitDialogOpen(false);
//     giveMark();
//   };

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
//             allAnswers: allAns, // ✅ now contains {0: 2, 1: 0, ...} (all numbers)
//             correctQus,
//             wrongQus: wrongansqus,
//             answeredQus: answeredQuestion,
//             notAnsweredQus: notAnswer,
//             markedAndAnswered: markedAndAnswer,
//             markedNotAnswered: markedNotAnswer,
//           });
//           apiPercentile = res.data?.percentile ?? res.percentile ?? null;
//           savedResultId = res.data?._id ?? res._id ?? null;

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

//       if (document.exitFullscreen) document.exitFullscreen();
//       else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
//       else if (document.msExitFullscreen) document.msExitFullscreen();
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
//           questions: question,
//           allAnswers: allAns,
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
//             {/* RadioGroup value uses option text for UI highlight */}
//             <RadioGroup value={answer || ""}>
//               <VStack align="stretch" spacing={3}>
//                 {question[currentquestion]?.options.map((d, i) => (
//                   <Box
//                     key={i}
//                     p={3}
//                     borderRadius="md"
//                     border="1px solid"
//                     borderColor={answer === d ? "blue.400" : "gray.200"}
//                     bg={answer === d ? "blue.50" : "white"}
//                     cursor="pointer"
//                     transition="all 0.2s"
//                     _hover={{ borderColor: "blue.300", bg: "gray.50" }}
//                     onClick={() => handleAnswer(d, i)}
//                   >
//                     <Radio
//                       value={d}
//                       isChecked={answer === d}
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

import React, { useEffect, useState, useRef, useCallback } from "react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import { resultsAPI } from "../services/api";
import { socket } from "../services/socket";
import ReportQuestionDropdown from "./ReportQuestionDropdown";
import {
  FaPause,
  FaPlay,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
  FaCircle,
  FaBookmark,
} from "react-icons/fa";

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

  // Pause state
  const [isPaused, setIsPaused] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);

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

  // Fullscreen management
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

  // Timer — pauses when isPaused is true
  useEffect(() => {
    if (isPaused) return; // ← pause timer
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
  }, [
    hour,
    min,
    sec,
    reversehour,
    reversemin,
    reversesec,
    isCountdown,
    isPaused,
  ]);

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

  // Mark & Review — clears the marked state if already marked (toggle)
  const markedQuestion = () => {
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
        markedNotAnswer.splice(r, 1);
      }
      if (notAnswer.includes(currentquestion)) {
        const r = notAnswer.indexOf(currentquestion);
        notAnswer.splice(r, 1);
      }
      setMarkedAndAnswer([...markedAndAnswer, currentquestion]);
      setans(null);
    } else if (markedAndAnswer.includes(currentquestion)) {
      // Toggle off mark — move back to answered
      const r = markedAndAnswer.indexOf(currentquestion);
      const newMarked = [...markedAndAnswer];
      newMarked.splice(r, 1);
      setMarkedAndAnswer(newMarked);
      if (!answeredQuestion.includes(currentquestion)) {
        setAnsweredQuestion([...answeredQuestion, currentquestion]);
      }
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
        markedAndAnswer.splice(r, 1);
      }
      if (notAnswer.includes(currentquestion)) {
        const r = notAnswer.indexOf(currentquestion);
        notAnswer.splice(r, 1);
      }
      setMarkedNotAnswer([...markedNotAnswer, currentquestion]);
    } else if (markedNotAnswer.includes(currentquestion)) {
      // Toggle off mark
      const r = markedNotAnswer.indexOf(currentquestion);
      const newMarkedNot = [...markedNotAnswer];
      newMarkedNot.splice(r, 1);
      setMarkedNotAnswer(newMarkedNot);
    }
    if (question.length - 1 > currentquestion)
      setcurrentquestion(currentquestion + 1);
  };

  const handleAnswer = (optionText, optionIndex) => {
    setans(optionText);
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
    setAllAns((p) => ({ ...p, [currentquestion]: optionIndex }));
  };

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

  const handlePause = () => {
    setIsPaused(true);
    setShowPauseModal(true);
  };

  const handleResume = () => {
    setIsPaused(false);
    setShowPauseModal(false);
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

  const isMarked =
    markedAndAnswer.includes(currentquestion) ||
    markedNotAnswer.includes(currentquestion);

  // Palette colors
  const getQColor = (i) => {
    if (markedAndAnswer.includes(i))
      return { bg: "#7c3aed", color: "white", radius: "full" };
    if (answeredQuestion.includes(i))
      return { bg: "#16a34a", color: "white", radius: "8px 8px 0 0" };
    if (notAnswer.includes(i))
      return { bg: "#ef4444", color: "white", radius: "0 0 8px 8px" };
    if (markedNotAnswer.includes(i))
      return { bg: "#7c3aed", color: "white", radius: "full" };
    return { bg: "white", color: "#374151", radius: "6px" };
  };

  const QuestionSidebar = () => (
    <VStack spacing={4} align="stretch" h="100%">
      <Box>
        <Text
          fontSize="lg"
          fontWeight={800}
          color="white"
          letterSpacing="-0.5px"
        >
          Revision Karle
        </Text>
        <Text fontSize="11px" color="rgba(255,255,255,.5)" mt="1px">
          {testMeta?.testTitle || "Mock Test"}
        </Text>
      </Box>

      {/* Status legend */}
      <Box bg="rgba(255,255,255,.06)" borderRadius="12px" p={3}>
        <VStack spacing={2} align="stretch">
          {[
            {
              label: "Marked",
              count: markedNotAnswer.length,
              bg: "#7c3aed",
              radius: "full",
            },
            {
              label: "Not visited",
              count:
                question.length -
                (markedAndAnswer.length +
                  markedNotAnswer.length +
                  answeredQuestion.length +
                  notAnswer.length),
              bg: "rgba(255,255,255,.2)",
              textColor: "white",
              radius: "6px",
            },
            {
              label: "Answered",
              count: answeredQuestion.length,
              bg: "#16a34a",
              radius: "8px 8px 0 0",
            },
            {
              label: "Not Answered",
              count: notAnswer.length,
              bg: "#ef4444",
              radius: "0 0 8px 8px",
            },
            {
              label: "Marked & Answered",
              count: markedAndAnswer.length,
              bg: "#7c3aed",
              radius: "full",
            },
          ].map(({ label, count, bg, textColor, radius }) => (
            <HStack key={label} justify="space-between">
              <Text
                color="rgba(255,255,255,.75)"
                fontSize="12px"
                fontWeight={500}
              >
                {label}
              </Text>
              <Center
                minW="26px"
                h="26px"
                bg={bg}
                color={textColor || "white"}
                borderRadius={radius}
                fontSize="11px"
                fontWeight={800}
              >
                {count}
              </Center>
            </HStack>
          ))}
        </VStack>
      </Box>

      {/* Question grid */}
      <Box flex="1" overflowY="auto">
        <Text
          fontSize="10px"
          fontWeight={700}
          color="rgba(255,255,255,.4)"
          textTransform="uppercase"
          letterSpacing="1.2px"
          mb={2}
        >
          Questions
        </Text>
        <Grid templateColumns="repeat(5, 1fr)" gap={2}>
          {question?.map((d, i) => {
            const qc = getQColor(i);
            return (
              <Center
                key={i}
                w="100%"
                h="36px"
                cursor="pointer"
                onClick={() => handlequestion(i)}
                bg={qc.bg}
                color={qc.color}
                borderRadius={qc.radius}
                border="1px solid rgba(255,255,255,.12)"
                transition="all 0.15s"
                fontSize="12px"
                fontWeight={700}
                _hover={{ transform: "scale(1.08)", opacity: 0.9 }}
              >
                {i === currentquestion ? (
                  <Box w="6px" h="6px" bg="white" borderRadius="full" />
                ) : (
                  i + 1
                )}
              </Center>
            );
          })}
        </Grid>
      </Box>

      <VStack spacing={2} pt={4} borderTop="1px solid rgba(255,255,255,.1)">
        <Button
          w="100%"
          h="40px"
          bg="rgba(255,255,255,.1)"
          color="white"
          fontWeight={700}
          fontSize="13px"
          leftIcon={<Icon as={FaPause} fontSize="11px" />}
          _hover={{ bg: "rgba(255,255,255,.18)" }}
          onClick={handlePause}
        >
          Pause Test
        </Button>
        <Button
          w="100%"
          h="40px"
          bg="#ef4444"
          color="white"
          fontWeight={700}
          fontSize="13px"
          _hover={{ bg: "#dc2626" }}
          onClick={handleSubmitClick}
        >
          Submit Test
        </Button>
      </VStack>
    </VStack>
  );

  const timeDisplay = isCountdown
    ? `${reversehour < 10 ? `0${reversehour}` : reversehour}:${reversemin < 10 ? `0${reversemin}` : reversemin}:${reversesec < 10 ? `0${reversesec}` : reversesec}`
    : `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;

  const isLowTime = isCountdown && reversehour === 0 && reversemin < 5;

  return (
    <Box
      h="100vh"
      display="flex"
      flexDirection="column"
      bg="#f8fafc"
      position="relative"
      fontFamily="'Sora', sans-serif"
    >
      {/* Fullscreen overlay */}
      {!isMobile && !isFullscreenActive && hasExitedFullscreen && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0,0,0,.9)"
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
              bg="#4a72b8"
              color="white"
              onClick={enterFullscreen}
              mt={4}
              _hover={{ bg: "#3b5fa0" }}
            >
              Click Here to Re-enter Fullscreen
            </Button>
          </VStack>
        </Box>
      )}

      {/* Header */}
      <Flex
        bg="linear-gradient(135deg, #0f1e3a, #1e3a5f)"
        color="white"
        px={{ base: 3, sm: 4, md: 6 }}
        py={3}
        align="center"
        justify="space-between"
        flexShrink={0}
        gap={3}
        boxShadow="0 2px 12px rgba(0,0,0,.2)"
      >
        <Text
          fontSize={{ base: "15px", md: "18px" }}
          fontWeight={800}
          letterSpacing="-0.5px"
          flexShrink={0}
        >
          Revision{" "}
          <Text as="span" color="#60a5fa">
            Karle
          </Text>
        </Text>

        {/* Center — question progress */}
        <Box
          flex={1}
          textAlign="center"
          display={{ base: "none", md: "block" }}
        >
          <Text fontSize="12px" color="rgba(255,255,255,.6)" fontWeight={600}>
            Q {currentquestion + 1} of {question.length}
          </Text>
          <Box
            h="3px"
            bg="rgba(255,255,255,.12)"
            borderRadius="full"
            mx="auto"
            maxW="200px"
            mt={1}
          >
            <Box
              h="100%"
              w={`${((currentquestion + 1) / question.length) * 100}%`}
              bg="#60a5fa"
              borderRadius="full"
              transition="width .3s"
            />
          </Box>
        </Box>

        {/* Timer */}
        <Flex
          align="center"
          gap={2}
          bg={isLowTime ? "rgba(239,68,68,.2)" : "rgba(255,255,255,.1)"}
          border="1px solid"
          borderColor={
            isLowTime ? "rgba(239,68,68,.4)" : "rgba(255,255,255,.15)"
          }
          px={4}
          py={2}
          borderRadius="10px"
          flexShrink={0}
        >
          <Icon
            as={FaClock}
            fontSize="12px"
            color={isLowTime ? "#fca5a5" : "rgba(255,255,255,.6)"}
          />
          <Text
            fontWeight={800}
            fontSize={{ base: "13px", md: "15px" }}
            color={isLowTime ? "#fca5a5" : "white"}
            letterSpacing="1px"
          >
            {isPaused ? "PAUSED" : timeDisplay}
          </Text>
        </Flex>

        <HStack spacing={2} flexShrink={0}>
          {!isMobile && !isFullscreenActive && (
            <Button
              size="xs"
              bg="rgba(255,255,255,.1)"
              color="white"
              _hover={{ bg: "rgba(255,255,255,.18)" }}
              onClick={enterFullscreen}
              fontSize="11px"
              fontWeight={700}
              borderRadius="7px"
            >
              Fullscreen
            </Button>
          )}
          <Button
            size="xs"
            bg={isPaused ? "#22c55e" : "rgba(255,255,255,.1)"}
            color="white"
            leftIcon={<Icon as={isPaused ? FaPlay : FaPause} fontSize="10px" />}
            _hover={{ opacity: 0.9 }}
            onClick={isPaused ? handleResume : handlePause}
            fontSize="11px"
            fontWeight={700}
            borderRadius="7px"
          >
            {isPaused ? "Resume" : "Pause"}
          </Button>
        </HStack>
      </Flex>

      <Flex flex="1" overflow="hidden">
        {/* Main content */}
        <VStack flex="1" spacing={0} align="stretch" overflow="hidden">
          {/* Section bar */}
          <Flex
            px={5}
            py={2.5}
            borderBottom="1px solid #e2e8f0"
            justify="space-between"
            align="center"
            bg="white"
          >
            <Flex align="center" gap={3}>
              <Text
                fontSize="11px"
                color="#94a3b8"
                fontWeight={700}
                textTransform="uppercase"
                letterSpacing=".8px"
              >
                {testMeta?.subject || "General"} Section
              </Text>
              <Box
                px={3}
                py={0.5}
                bg="#eff6ff"
                color="#2563eb"
                borderRadius="full"
                fontSize="11px"
                fontWeight={700}
              >
                {currentquestion + 1} / {question.length}
              </Box>
            </Flex>
            <ReportQuestionDropdown />
          </Flex>

          {/* Question area */}
          <Box flex="1" overflow="auto" bg="white">
            <Box px={6} pt={5} pb={2}>
              <Flex align="center" gap={2} mb={4}>
                <Box
                  w="28px"
                  h="28px"
                  bg="#0f1e3a"
                  borderRadius="8px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Text fontSize="12px" fontWeight={800} color="white">
                    {currentquestion + 1}
                  </Text>
                </Box>
                <Text
                  fontSize="15px"
                  fontWeight={600}
                  color="#0f172a"
                  lineHeight="1.7"
                >
                  {question[currentquestion]?.qus}
                </Text>
              </Flex>
            </Box>

            <Box px={6} pb={4}>
              <VStack align="stretch" spacing={2.5}>
                {question[currentquestion]?.options.map((d, i) => {
                  const isSelected = answer === d;
                  const optLabel = String.fromCharCode(65 + i);
                  return (
                    <Box
                      key={i}
                      p={3.5}
                      borderRadius="12px"
                      border="1.5px solid"
                      borderColor={isSelected ? "#2563eb" : "#e2e8f0"}
                      bg={isSelected ? "#eff6ff" : "white"}
                      cursor="pointer"
                      transition="all 0.15s"
                      _hover={{ borderColor: "#2563eb", bg: "#f8faff" }}
                      onClick={() => handleAnswer(d, i)}
                    >
                      <Flex align="center" gap={3}>
                        <Flex
                          w="28px"
                          h="28px"
                          borderRadius="8px"
                          bg={isSelected ? "#2563eb" : "#f1f5f9"}
                          color={isSelected ? "white" : "#64748b"}
                          align="center"
                          justify="center"
                          fontSize="12px"
                          fontWeight={800}
                          flexShrink={0}
                          transition="all .15s"
                        >
                          {optLabel}
                        </Flex>
                        <Text
                          fontSize="14px"
                          color={isSelected ? "#1d4ed8" : "#374151"}
                          fontWeight={isSelected ? 600 : 400}
                          flex={1}
                        >
                          {d}
                        </Text>
                        {isSelected && (
                          <Box
                            w="18px"
                            h="18px"
                            bg="#2563eb"
                            borderRadius="full"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            flexShrink={0}
                          >
                            <Icon
                              as={FaCheckCircle}
                              fontSize="12px"
                              color="white"
                            />
                          </Box>
                        )}
                      </Flex>
                    </Box>
                  );
                })}
              </VStack>
            </Box>
          </Box>

          {/* Action bar */}
          <Box
            px={5}
            py={3}
            borderTop="1px solid #e2e8f0"
            bg="white"
            flexShrink={0}
          >
            <Flex
              justify="space-between"
              align="center"
              gap={2}
              flexWrap="wrap"
            >
              <HStack spacing={2}>
                <Button
                  size="sm"
                  h="36px"
                  variant="outline"
                  borderColor={isMarked ? "#7c3aed" : "#e2e8f0"}
                  color={isMarked ? "#7c3aed" : "#475569"}
                  bg={isMarked ? "#f5f3ff" : "white"}
                  fontWeight={700}
                  fontSize="12px"
                  borderRadius="8px"
                  leftIcon={<Icon as={FaBookmark} fontSize="10px" />}
                  onClick={markedQuestion}
                  _hover={{
                    borderColor: "#7c3aed",
                    bg: "#f5f3ff",
                    color: "#7c3aed",
                  }}
                >
                  {isMarked ? "Unmark" : "Mark & Next"}
                </Button>
                <Button
                  size="sm"
                  h="36px"
                  variant="outline"
                  borderColor="#e2e8f0"
                  color="#ef4444"
                  fontWeight={700}
                  fontSize="12px"
                  borderRadius="8px"
                  onClick={() => handleClearAnswer(currentquestion)}
                  _hover={{ borderColor: "#ef4444", bg: "#fef2f2" }}
                >
                  Clear
                </Button>
              </HStack>
              <HStack spacing={2}>
                {currentquestion > 0 && (
                  <Button
                    size="sm"
                    h="36px"
                    variant="outline"
                    borderColor="#e2e8f0"
                    color="#374151"
                    fontWeight={700}
                    fontSize="12px"
                    borderRadius="8px"
                    onClick={() => {
                      setcurrentquestion((c) => c - 1);
                      setans(null);
                    }}
                    _hover={{ bg: "#f8fafc" }}
                  >
                    ← Prev
                  </Button>
                )}
                <Button
                  size="sm"
                  h="36px"
                  bg="#0f1e3a"
                  color="white"
                  fontWeight={700}
                  fontSize="12px"
                  borderRadius="8px"
                  _hover={{ bg: "#1e3a5f" }}
                  onClick={() => handlequestion("svn")}
                >
                  Save & Next →
                </Button>
              </HStack>
            </Flex>
          </Box>
        </VStack>

        {/* Desktop Sidebar */}
        {!isMobile && (
          <Box
            w="280px"
            bg="linear-gradient(180deg, #0f1e3a, #1a3a6e)"
            p={5}
            borderLeft="1px solid rgba(255,255,255,.06)"
            flexShrink={0}
            overflow="hidden"
          >
            <QuestionSidebar />
          </Box>
        )}
      </Flex>

      {/* Mobile FAB */}
      {isMobile && (
        <>
          <Button
            position="fixed"
            bottom="4"
            right="4"
            bg="linear-gradient(135deg, #0f1e3a, #2d5fa8)"
            color="white"
            onClick={() => handleClick("xs")}
            borderRadius="full"
            w="52px"
            h="52px"
            shadow="0 4px 16px rgba(15,30,58,.4)"
            zIndex={100}
          >
            <HamburgerIcon w={5} h={5} />
          </Button>
          <Drawer onClose={onClose} isOpen={isOpen} size="xs" placement="right">
            <DrawerOverlay />
            <DrawerContent bg="linear-gradient(180deg, #0f1e3a, #1a3a6e)">
              <DrawerCloseButton color="white" />
              <DrawerHeader
                color="white"
                borderBottom="1px solid rgba(255,255,255,.1)"
                fontSize="15px"
                fontWeight={800}
              >
                Question Palette
              </DrawerHeader>
              <DrawerBody p={5}>
                <QuestionSidebar />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}

      {/* Pause Modal */}
      <Modal
        isOpen={showPauseModal}
        onClose={() => {}}
        isCentered
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(0,0,0,.6)" />
        <ModalContent
          borderRadius="20px"
          fontFamily="'Sora',sans-serif"
          mx={4}
          overflow="hidden"
        >
          <Box
            bg="linear-gradient(135deg, #0f1e3a, #1e3a5f)"
            p={6}
            textAlign="center"
          >
            <Box
              w="64px"
              h="64px"
              bg="rgba(255,255,255,.1)"
              borderRadius="full"
              mx="auto"
              mb={3}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaPause} fontSize="24px" color="white" />
            </Box>
            <Text fontSize="20px" fontWeight={800} color="white">
              Test Paused
            </Text>
            <Text fontSize="13px" color="rgba(255,255,255,.6)" mt={1}>
              Timer has been paused
            </Text>
          </Box>
          <ModalBody py={5}>
            <Box
              bg="#f8fafc"
              borderRadius="12px"
              p={4}
              mb={4}
              border="1px solid #e2e8f0"
            >
              <Text
                fontSize="12px"
                fontWeight={700}
                color="#64748b"
                textTransform="uppercase"
                letterSpacing=".8px"
                mb={3}
              >
                Current Status
              </Text>
              <VStack spacing={2} align="stretch">
                {[
                  {
                    label: "Questions",
                    value: question.length,
                    color: "#0f172a",
                  },
                  {
                    label: "Answered",
                    value: answeredQuestion.length,
                    color: "#16a34a",
                  },
                  {
                    label: "Not Answered",
                    value: notAnswer.length,
                    color: "#ef4444",
                  },
                  {
                    label: "Marked",
                    value: markedNotAnswer.length + markedAndAnswer.length,
                    color: "#7c3aed",
                  },
                  {
                    label: "Time Remaining",
                    value: isPaused ? "—" : timeDisplay,
                    color: "#2563eb",
                  },
                ].map(({ label, value, color }) => (
                  <Flex key={label} justify="space-between" align="center">
                    <Text fontSize="13px" color="#64748b">
                      {label}
                    </Text>
                    <Text fontSize="13px" fontWeight={700} color={color}>
                      {value}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          </ModalBody>
          <ModalFooter gap={3} pt={0}>
            <Button
              flex={1}
              h="44px"
              bg="#f1f5f9"
              color="#ef4444"
              fontWeight={700}
              fontSize="13px"
              borderRadius="10px"
              _hover={{ bg: "#fef2f2" }}
              onClick={() => {
                setShowPauseModal(false);
                setIsSubmitDialogOpen(true);
              }}
            >
              Submit Test
            </Button>
            <Button
              flex={2}
              h="44px"
              bg="linear-gradient(135deg, #0f1e3a, #2d5fa8)"
              color="white"
              fontWeight={800}
              fontSize="14px"
              borderRadius="10px"
              leftIcon={<Icon as={FaPlay} fontSize="12px" />}
              _hover={{ opacity: 0.9 }}
              onClick={handleResume}
            >
              Resume Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Submit confirmation */}
      <AlertDialog
        isOpen={isSubmitDialogOpen}
        leastDestructiveRef={cancelSubmitRef}
        onClose={handleCancelSubmit}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            mx={4}
            borderRadius="16px"
            fontFamily="'Sora',sans-serif"
          >
            <AlertDialogHeader
              fontSize="16px"
              fontWeight={800}
              borderBottom="1px solid #f1f5f9"
            >
              Submit Test?
            </AlertDialogHeader>
            <AlertDialogBody py={5}>
              <VStack align="start" spacing={4}>
                <Box
                  w="100%"
                  bg="#f8fafc"
                  borderRadius="12px"
                  p={4}
                  border="1px solid #e2e8f0"
                >
                  <Text
                    fontSize="12px"
                    fontWeight={700}
                    color="#64748b"
                    textTransform="uppercase"
                    letterSpacing=".8px"
                    mb={3}
                  >
                    Test Summary
                  </Text>
                  <VStack spacing={2} align="stretch">
                    {[
                      {
                        label: "Total Questions",
                        value: question.length,
                        color: "#0f172a",
                      },
                      {
                        label: "Answered",
                        value: answeredQuestion.length,
                        color: "#16a34a",
                      },
                      {
                        label: "Not Answered",
                        value: notAnswer.length,
                        color: "#ef4444",
                      },
                      {
                        label: "Marked for Review",
                        value: markedNotAnswer.length + markedAndAnswer.length,
                        color: "#7c3aed",
                      },
                    ].map(({ label, value, color }) => (
                      <Flex key={label} justify="space-between" align="center">
                        <Text fontSize="13px" color="#64748b">
                          {label}
                        </Text>
                        <Text fontSize="13px" fontWeight={700} color={color}>
                          {value}
                        </Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
                <Box
                  bg="#fef3c7"
                  borderRadius="10px"
                  p={3}
                  w="100%"
                  border="1px solid #fde68a"
                >
                  <Text fontSize="12px" color="#92400e" fontWeight={600}>
                    ⚠️ Once submitted, you cannot change your answers.
                  </Text>
                </Box>
              </VStack>
            </AlertDialogBody>
            <AlertDialogFooter gap={3} borderTop="1px solid #f1f5f9">
              <Button
                ref={cancelSubmitRef}
                onClick={handleCancelSubmit}
                variant="ghost"
                fontWeight={600}
                borderRadius="9px"
              >
                Cancel
              </Button>
              <Button
                bg="#ef4444"
                color="white"
                onClick={handleConfirmSubmit}
                fontWeight={700}
                borderRadius="9px"
                _hover={{ bg: "#dc2626" }}
              >
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