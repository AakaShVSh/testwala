// // export default MathQuestionlist;
// import {
//   Box,
//   Divider,
//   Heading,
//   Text,
//   Badge,
//   Card,
//   CardBody,
//   VStack,
//   HStack,
//   IconButton,
//   Flex,
//   Tooltip,
//   Icon,
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   Spinner,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalFooter,
//   ModalBody,
//   ModalCloseButton,
//   Button,
//   useDisclosure,
//   Progress,
//   Grid,
//   GridItem,
//   Tabs,
//   TabList,
//   TabPanels,
//   Tab,
//   TabPanel,
//   Alert,
//   AlertIcon,
// } from "@chakra-ui/react";
// import React, { useEffect, useState, useCallback } from "react";
// import { useNavigate } from "react-router-dom";
// import CollapseEx from "./CreateTest";
// import { GrCheckboxSelected } from "react-icons/gr";
// import {
//   AddIcon,
//   MinusIcon,
//   LockIcon,
//   CheckCircleIcon,
//   ChevronRightIcon,
//   InfoIcon,
//   RepeatIcon,
// } from "@chakra-ui/icons";
// import { FaBook, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import {
//   isTestUnlocked,
//   isSubcategoryUnlocked,
//   getTestScore,
//   isSubcategoryCompleted,
//   isCategoryCompleted,
//   getSubcategoryStats,
// } from "../helpers/testProgressHelper";
// import UserTestDataList from "./UserTestDataList";
// import {
//   fetchQuestions,
//   fetchTopicsForSubject,
//   fetchUserTestData,
//   postUserTestResult,
//   updateUserTestData,
// } from "../apis/question";

// /**
//  * Human-readable display names for subject keys returned by the API.
//  * Keys are lowercased to match what the backend stores.
//  */
// const SUBJECT_DISPLAY_NAMES = {
//   math: "Mathematics",
//   mathtwo: "Math Advanced",
//   english: "English",
//   gs: "General Studies",
//   vocabulary: "Vocabulary",
//   reasoning: "Reasoning",
// };

// const getCategoryDisplayName = (subject) =>
//   SUBJECT_DISPLAY_NAMES[subject?.toLowerCase()] ?? subject ?? "";

// // ---------------------------------------------------------------------------
// // Component
// // ---------------------------------------------------------------------------

// const MathQuestionlist = ({
//   category: categoryProp, // questions passed down from parent (may be stale / empty)
//   chooseSub,
//   currentSub: currentSubProp,
//   setQuestions,
//   handleFullScreen,
//   settestTitle,
// }) => {
//   // ── Loading states ────────────────────────────────────────────────────────
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubcategoryLoading, setIsSubcategoryLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // ── Core data ─────────────────────────────────────────────────────────────
//   const [currentSub, setCurrentSub] = useState(currentSubProp ?? "");
//   const [MathSubject, setMathSubject] = useState(""); // selected topic/subcategory
//   const [categoryData, setCategoryData] = useState([]); // all docs for currentSub
//   const [currentTopic, setCurrentTopic] = useState([]); // ordered topic list from API
//   const [categoryCompleted, setCategoryCompleted] = useState(false);

//   // ── Test creation UI state ────────────────────────────────────────────────
//   const [h, seth] = useState([]);
//   const [selectallstate, setselectallstate] = useState(false);
//   const [directTest, setdirectTest] = useState([]);
//   const [check, setcheck] = useState(false);
//   const [quslist, setquslist] = useState([]);
//   const [name, setname] = useState("Test");
//   const [noOfQus, setnoOfQus] = useState(3);
//   const [totalques, settotalques] = useState(false);
//   const [sum, setsum] = useState(0);

//   // ── Created / saved tests from backend ───────────────────────────────────
//   const [dataTypeWiseTest, setdataTypeWiseTest] = useState([]);
//   const [selectedTest, setSelectedTest] = useState(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const navigate = useNavigate();

//   // ── Helpers ───────────────────────────────────────────────────────────────

//   const maketest = useCallback(
//     (qus, full, sec) => {
//       setQuestions(qus);
//       handleFullScreen(full);
//       settestTitle(sec);
//       navigate("/test");
//     },
//     [setQuestions, handleFullScreen, settestTitle, navigate],
//   );

//   // ── Initial data load ─────────────────────────────────────────────────────
//   useEffect(() => {
//     const load = async () => {
//       setIsLoading(true);
//       setError(null);
//       try {
//         const subject = currentSubProp ?? "";
//         setCurrentSub(subject);

//         // 1. Fetch ordered topic list from API (no hardcoded arrays)
//         const topics = subject ? await fetchTopicsForSubject(subject) : [];
//         setCurrentTopic(topics);

//         // 2. Fetch all question docs for this subject
//         let docs = [];
//         if (categoryProp && categoryProp.length > 0) {
//           docs = categoryProp;
//         } else if (subject) {
//           docs = await fetchQuestions({ subject });
//         }
//         setCategoryData(docs);

//         // 3. Fetch saved tests from backend
//         const savedTests = await fetchUserTestData().catch(() => []);
//         // Filter to tests belonging to this subject for the sidebar
//         const subjectTests = savedTests.filter(
//           (t) => t.category?.toLowerCase() === subject?.toLowerCase(),
//         );
//         setdataTypeWiseTest(subjectTests);

//         // 4. Completion status (still uses progress helper — no localStorage for data)
//         setCategoryCompleted(isCategoryCompleted(subject));
//       } catch (err) {
//         console.error("Error loading question list:", err);
//         setError(err.message ?? "Failed to load data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     load();
//   }, [currentSubProp]); // re-run if parent changes the subject

//   // Keep currentSub in sync when prop changes
//   useEffect(() => {
//     if (currentSubProp && currentSubProp !== currentSub) {
//       setCurrentSub(currentSubProp);
//     }
//   }, [currentSubProp]);

//   // Sync categoryData if parent passes fresh docs
//   useEffect(() => {
//     if (categoryProp && categoryProp.length > 0) {
//       setCategoryData(categoryProp);
//     }
//   }, [categoryProp]);

//   // ── Subcategory (topic) selection ─────────────────────────────────────────
//   const handleSubcategoryClick = async (topic, topicIndex) => {
//     const unlocked = isSubcategoryUnlocked(currentSub, topicIndex);
//     if (!unlocked) return;

//     setIsSubcategoryLoading(true);
//     setMathSubject(topic);
//     setIsSubcategoryLoading(false);
//   };

//   // ── Test item click ───────────────────────────────────────────────────────
//   const handleTestClick = (testData, testIndex) => {
//     const unlocked = isTestUnlocked(currentSub, MathSubject, testIndex);
//     if (unlocked) {
//       maketest(testData.question, true, testData.section);
//     }
//   };

//   // ── Question count distribution for findtotal ─────────────────────────────
//   const findtotal = () => {
//     const docs = categoryData.filter((e) => e.topic === MathSubject);
//     const total = docs.reduce((s, e) => s + e.question.length, 0);
//     const sections = docs.length;
//     if (sections === 0) return;

//     const base = Math.floor(total / sections);
//     const extra = total % sections;
//     const distribution = docs.map((e, i) =>
//       Math.min(e.question.length, base + (i < extra ? 1 : 0)),
//     );

//     let newState = {};
//     docs.forEach((e, i) => {
//       e.question.slice(0, distribution[i]).forEach((item, j) => {
//         newState[`question_${i}_${j}`] = item;
//       });
//     });

//     settotalques(true);
//   };

//   // ── Build test object and persist to backend ──────────────────────────────
//   const persistTest = async (testobj) => {
//     try {
//       const saved = await postUserTestResult(testobj);
//       // Refresh sidebar tests
//       const all = await fetchUserTestData().catch(() => []);
//       const subjectTests = all.filter(
//         (t) => t.category?.toLowerCase() === currentSub?.toLowerCase(),
//       );
//       setdataTypeWiseTest(subjectTests);
//       return saved;
//     } catch (err) {
//       console.error("Failed to persist test:", err);
//     }
//   };

//   // ── Custom test creation (from CollapseEx) ────────────────────────────────
//   const setq = async () => {
//     const p = categoryData.filter((e) =>
//       quslist.map((q) => q.qusdata).includes(e.topic),
//     );
//     let dd = [];
//     quslist.forEach((e, i) => {
//       const g = p[i]?.question.slice(0, e.count) ?? [];
//       dd = [...dd, ...g];
//     });
//     const testobj = {
//       testName: name,
//       quslist,
//       noOfQus,
//       questions: dd,
//       createdAt: new Date().toISOString(),
//       category: currentSub,
//       subcategory: MathSubject,
//     };
//     await persistTest(testobj);
//     maketest(dd, true, "Test 1");
//   };

//   // ── quslist rebuilds when list/noOfQus change ─────────────────────────────
//   useEffect(() => {
//     // This state is maintained inside CollapseEx via setlist callback
//     // but we keep quslist here for the counter UI below
//   }, [name]);

//   const updateCounter = (index, operation) => {
//     setquslist((prev) => {
//       const next = [...prev];
//       next[index] = {
//         ...next[index],
//         count:
//           operation === "increment"
//             ? next[index].count + 1
//             : Math.max(1, next[index].count - 1),
//       };

//       const total = next.reduce((a, x) => a + x.count, 0);
//       if (total > noOfQus) {
//         let diff = total - noOfQus;
//         let adj = 0;
//         while (diff > 0 && adj < next.length) {
//           if (next[adj].count > 1) {
//             next[adj].count--;
//             diff--;
//           }
//           adj++;
//         }
//       }
//       return next;
//     });
//   };

//   // ── Subcategory completion helper ─────────────────────────────────────────
//   const getSubcategoryCompletionStatus = (subcategory) => {
//     const tests = categoryData.filter((e) => e.topic === subcategory);
//     if (!tests.length) return false;
//     return isSubcategoryCompleted(currentSub, subcategory, tests.length);
//   };

//   // ── Created test modal ────────────────────────────────────────────────────
//   const handleCreatedTestClick = (test) => {
//     setSelectedTest(test);
//     onOpen();
//   };

//   const handleRetakeTest = () => {
//     if (selectedTest) {
//       maketest(selectedTest.questions, true, selectedTest.testName);
//       onClose();
//     }
//   };

//   const getTestStatistics = (test) => {
//     if (!test?.results?.score) {
//       return {
//         attempted: 0,
//         correct: 0,
//         incorrect: 0,
//         skipped: test?.noOfQus ?? 0,
//         score: 0,
//         percentage: 0,
//       };
//     }
//     const total = test.noOfQus || test.questions?.length || 0;
//     const correct = test.results.correctAnswers ?? 0;
//     const incorrect = test.results.incorrectAnswers ?? 0;
//     return {
//       attempted: correct + incorrect,
//       correct,
//       incorrect,
//       skipped: total - correct - incorrect,
//       score: test.results.score ?? 0,
//       percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
//     };
//   };

//   // ── Spinner UI (shared) ───────────────────────────────────────────────────
//   const LoadingScreen = ({
//     message = "Loading...",
//     sub = "Please wait...",
//   }) => (
//     <Box
//       minH="100vh"
//       display="flex"
//       alignItems="center"
//       justifyContent="center"
//       bg="white"
//     >
//       <Flex direction="column" align="center" gap={6}>
//         <Box position="relative">
//           <Spinner
//             thickness="4px"
//             speed="0.65s"
//             emptyColor="gray.200"
//             color="#667eea"
//             size="xl"
//             w="80px"
//             h="80px"
//           />
//           <Box
//             position="absolute"
//             top="50%"
//             left="50%"
//             transform="translate(-50%, -50%)"
//           >
//             <FaBook size={32} color="#667eea" />
//           </Box>
//         </Box>
//         <Flex direction="column" align="center" gap={2}>
//           <Text
//             color="#2d3748"
//             fontSize="24px"
//             fontWeight="700"
//             letterSpacing="0.5px"
//           >
//             {message}
//           </Text>
//           <Text color="#718096" fontSize="14px">
//             {sub}
//           </Text>
//         </Flex>
//         <Flex gap={2}>
//           {[0, 1, 2].map((i) => (
//             <Box
//               key={i}
//               w="10px"
//               h="10px"
//               borderRadius="full"
//               bg="#667eea"
//               animation="bounce 1.4s infinite ease-in-out"
//               style={{ animationDelay: `${i * 0.16}s` }}
//             />
//           ))}
//         </Flex>
//       </Flex>
//       <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0);opacity:.5}40%{transform:scale(1);opacity:1}}`}</style>
//     </Box>
//   );

//   if (isLoading)
//     return (
//       <LoadingScreen
//         message={`Loading ${getCategoryDisplayName(currentSub)}`}
//       />
//     );
//   if (isSubcategoryLoading)
//     return (
//       <LoadingScreen
//         message="Loading Tests"
//         sub="Preparing your questions..."
//       />
//     );

//   if (error) {
//     return (
//       <Box p={8}>
//         <Alert status="error" borderRadius="8px">
//           <AlertIcon />
//           {error}
//         </Alert>
//       </Box>
//     );
//   }

//   // ── Render ────────────────────────────────────────────────────────────────
//   return (
//     <Box minH="100vh" bg="#f8f9fa" py={8} px={4}>
//       <Flex
//         gap={6}
//         maxW="1400px"
//         mx="auto"
//         direction={{ base: "column", lg: "row" }}
//       >
//         {/* ── Main Content ──────────────────────────────────────────────── */}
//         <Box flex="1">
//           {/* Breadcrumb */}
//           <Box mb={4}>
//             <Breadcrumb
//               spacing="8px"
//               separator={<ChevronRightIcon color="gray.500" />}
//               fontSize="14px"
//             >
//               <BreadcrumbItem>
//                 <BreadcrumbLink
//                   onClick={() => {
//                     setMathSubject("");
//                     navigate("/");
//                   }}
//                   color="blue.600"
//                   fontWeight="500"
//                   _hover={{ color: "blue.700", textDecoration: "underline" }}
//                   cursor="pointer"
//                 >
//                   Home
//                 </BreadcrumbLink>
//               </BreadcrumbItem>

//               {currentSub && (
//                 <BreadcrumbItem>
//                   <BreadcrumbLink
//                     onClick={() => MathSubject && setMathSubject("")}
//                     color={MathSubject ? "blue.600" : "gray.700"}
//                     fontWeight="500"
//                     _hover={
//                       MathSubject
//                         ? { color: "blue.700", textDecoration: "underline" }
//                         : {}
//                     }
//                     cursor={MathSubject ? "pointer" : "default"}
//                     isCurrentPage={!MathSubject}
//                   >
//                     {getCategoryDisplayName(currentSub)}
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//               )}

//               {MathSubject && (
//                 <BreadcrumbItem isCurrentPage>
//                   <BreadcrumbLink color="gray.700" fontWeight="500">
//                     {MathSubject}
//                   </BreadcrumbLink>
//                 </BreadcrumbItem>
//               )}
//             </Breadcrumb>
//           </Box>

//           <Card
//             bg="white"
//             shadow="sm"
//             borderRadius="8px"
//             overflow="hidden"
//             border="1px solid"
//             borderColor="gray.300"
//           >
//             <Box
//               bg="white"
//               p={6}
//               borderBottom="1px solid"
//               borderColor="gray.300"
//             >
//               <Heading
//                 size="lg"
//                 fontWeight="600"
//                 color="gray.800"
//                 letterSpacing="-0.5px"
//               >
//                 {MathSubject || getCategoryDisplayName(currentSub)}
//               </Heading>
//               <Text fontSize="sm" mt={1} color="gray.500">
//                 {MathSubject
//                   ? "Select a test to begin or create a custom test"
//                   : "Choose a topic to get started"}
//               </Text>
//             </Box>

//             <CardBody p={6} bg="#fafbfc">
//               {/* CollapseEx — test creator toolbar */}
//               {(categoryCompleted || MathSubject !== "") && (
//                 <CollapseEx
//                   seth={seth}
//                   sum={sum}
//                   setdirecttest={setdirectTest}
//                   directTest={directTest}
//                   h={h}
//                   selectallstate={selectallstate}
//                   setselectallstate={setselectallstate}
//                   setcheck={setcheck}
//                   check={check}
//                   maketest={maketest}
//                   MathSubject={MathSubject}
//                   category={categoryData}
//                   findtotal={findtotal}
//                   settotalques={settotalques}
//                   totalques={totalques}
//                   setlist={(list) => {
//                     // rebuild quslist from fresh list
//                     if (list.length > 0) {
//                       const base = Math.floor(noOfQus / list.length);
//                       const rem = noOfQus % list.length;
//                       setquslist(
//                         list.map((item, i) => ({
//                           count: i === 0 ? base + rem : base,
//                           qusdata: item,
//                         })),
//                       );
//                     } else {
//                       setquslist([]);
//                     }
//                   }}
//                   settotaltestno={() => {}}
//                   setq={setq}
//                   setname={setname}
//                   setnoOfQus={setnoOfQus}
//                   currentSub={currentSub}
//                   persistTest={persistTest}
//                 />
//               )}

//               {!categoryCompleted && MathSubject === "" && (
//                 <Box
//                   bg="blue.50"
//                   border="1px solid"
//                   borderColor="blue.200"
//                   borderRadius="6px"
//                   p={4}
//                   mb={4}
//                 >
//                   <Text fontSize="sm" color="blue.700" fontWeight="500">
//                     ℹ️ Complete all subcategories to unlock direct test creation
//                     from this category
//                   </Text>
//                 </Box>
//               )}

//               <VStack spacing={3} mt={4} align="stretch">
//                 {/* Counter rows when a custom test is being configured */}
//                 {quslist.length > 0 ? (
//                   quslist.map((e, i) => (
//                     <Box
//                       key={i}
//                       bg="white"
//                       border="1px solid"
//                       borderColor="gray.300"
//                       borderRadius="6px"
//                       p={4}
//                       transition="all 0.2s"
//                       _hover={{ borderColor: "blue.400", shadow: "sm" }}
//                     >
//                       <Flex justify="space-between" align="center">
//                         <Text fontWeight="500" fontSize="15px" color="gray.700">
//                           {e.qusdata}
//                         </Text>
//                         <HStack spacing={2}>
//                           <IconButton
//                             icon={<MinusIcon />}
//                             size="sm"
//                             variant="outline"
//                             borderColor="gray.300"
//                             color="gray.600"
//                             borderRadius="4px"
//                             onClick={() => updateCounter(i, "decrement")}
//                             _hover={{ bg: "gray.50", borderColor: "gray.400" }}
//                           />
//                           <Box
//                             px={4}
//                             py={1}
//                             fontWeight="600"
//                             fontSize="15px"
//                             color="gray.700"
//                             minW="45px"
//                             textAlign="center"
//                             bg="gray.50"
//                             borderRadius="4px"
//                           >
//                             {e.count}
//                           </Box>
//                           <IconButton
//                             icon={<AddIcon />}
//                             size="sm"
//                             variant="outline"
//                             borderColor="gray.300"
//                             color="gray.600"
//                             borderRadius="4px"
//                             onClick={() => updateCounter(i, "increment")}
//                             _hover={{ bg: "gray.50", borderColor: "gray.400" }}
//                           />
//                         </HStack>
//                       </Flex>
//                     </Box>
//                   ))
//                 ) : (
//                   <VStack spacing={2} align="stretch">
//                     {/* ── Subcategory (topic) view ─── */}
//                     {MathSubject ? (
//                       (() => {
//                         const testsForTopic = categoryData.filter(
//                           (e) => e.topic === MathSubject,
//                         );
//                         return testsForTopic.map((e, k) => {
//                           const testIndex = testsForTopic.findIndex(
//                             (t) => t.section === e.section,
//                           );
//                           const unlocked = isTestUnlocked(
//                             currentSub,
//                             MathSubject,
//                             testIndex,
//                           );
//                           const testScore = getTestScore(
//                             currentSub,
//                             MathSubject,
//                             testIndex,
//                           );

//                           return (
//                             <Tooltip
//                               key={k}
//                               label={
//                                 !unlocked
//                                   ? "Score 80%+ on previous test to unlock"
//                                   : ""
//                               }
//                               placement="top"
//                               hasArrow
//                             >
//                               <Box
//                                 bg={unlocked ? "white" : "gray.50"}
//                                 border="1px solid"
//                                 borderColor={unlocked ? "gray.300" : "gray.200"}
//                                 borderRadius="6px"
//                                 p={4}
//                                 transition="all 0.2s"
//                                 opacity={unlocked ? 1 : 0.6}
//                                 cursor={unlocked ? "pointer" : "not-allowed"}
//                                 _hover={
//                                   unlocked
//                                     ? { borderColor: "blue.400", bg: "gray.50" }
//                                     : {}
//                                 }
//                                 onClick={() => handleTestClick(e, testIndex)}
//                               >
//                                 <Flex justify="space-between" align="center">
//                                   <HStack spacing={2}>
//                                     {!unlocked && (
//                                       <LockIcon color="gray.400" boxSize={4} />
//                                     )}
//                                     <Text
//                                       fontWeight="500"
//                                       fontSize="15px"
//                                       color={unlocked ? "gray.700" : "gray.400"}
//                                     >
//                                       {e.section}
//                                     </Text>
//                                   </HStack>
//                                   <HStack spacing={3}>
//                                     {testScore && (
//                                       <Badge
//                                         colorScheme={
//                                           testScore.completed
//                                             ? "green"
//                                             : "orange"
//                                         }
//                                         fontSize="12px"
//                                         px={2}
//                                         py={1}
//                                         borderRadius="4px"
//                                         fontWeight="500"
//                                       >
//                                         {testScore.score}%
//                                       </Badge>
//                                     )}
//                                     {check && unlocked && (
//                                       <Box
//                                         onClick={(ev) => {
//                                           ev.stopPropagation();
//                                           setdirectTest((prev) =>
//                                             prev.some((d) => d._id === e._id)
//                                               ? prev.filter(
//                                                   (d) => d._id !== e._id,
//                                                 )
//                                               : [...prev, e],
//                                           );
//                                           setsum((s) => s + e.question.length);
//                                           seth((prev) =>
//                                             prev.includes(k)
//                                               ? prev.filter((x) => x !== k)
//                                               : [...prev, k],
//                                           );
//                                         }}
//                                         cursor="pointer"
//                                         transition="all 0.2s"
//                                         _hover={{ opacity: 0.7 }}
//                                       >
//                                         <GrCheckboxSelected
//                                           size={18}
//                                           color={
//                                             h?.includes(k) || selectallstate
//                                               ? "#3182ce"
//                                               : "#a0aec0"
//                                           }
//                                         />
//                                       </Box>
//                                     )}
//                                     <Badge
//                                       bg="gray.100"
//                                       color="gray.700"
//                                       fontSize="13px"
//                                       px={3}
//                                       py={1}
//                                       borderRadius="4px"
//                                       fontWeight="500"
//                                     >
//                                       {e.question.length}
//                                     </Badge>
//                                   </HStack>
//                                 </Flex>
//                               </Box>
//                             </Tooltip>
//                           );
//                         });
//                       })()
//                     ) : /* ── Category (subject) view — topic list from API ─── */
//                     currentTopic.length === 0 ? (
//                       <Box p={8} textAlign="center">
//                         <Text color="gray.400" fontSize="14px">
//                           No topics found for this subject.
//                         </Text>
//                       </Box>
//                     ) : (
//                       currentTopic.map((topic, i) => {
//                         const unlocked = isSubcategoryUnlocked(currentSub, i);
//                         const completed = getSubcategoryCompletionStatus(topic);
//                         const stats = getSubcategoryStats(currentSub, topic);

//                         return (
//                           <Tooltip
//                             key={i}
//                             label={
//                               !unlocked
//                                 ? "Complete previous subcategory to unlock"
//                                 : ""
//                             }
//                             placement="top"
//                             hasArrow
//                           >
//                             <Box
//                               bg={unlocked ? "white" : "gray.50"}
//                               border="1px solid"
//                               borderColor={unlocked ? "gray.300" : "gray.200"}
//                               borderRadius="6px"
//                               p={4}
//                               cursor={unlocked ? "pointer" : "not-allowed"}
//                               transition="all 0.2s"
//                               opacity={unlocked ? 1 : 0.6}
//                               _hover={
//                                 unlocked
//                                   ? { borderColor: "blue.400", bg: "gray.50" }
//                                   : {}
//                               }
//                               onClick={() => handleSubcategoryClick(topic, i)}
//                             >
//                               <Flex justify="space-between" align="center">
//                                 <HStack spacing={2}>
//                                   {!unlocked && (
//                                     <LockIcon color="gray.400" boxSize={4} />
//                                   )}
//                                   <VStack align="start" spacing={0}>
//                                     <Text
//                                       fontWeight="500"
//                                       fontSize="15px"
//                                       color={unlocked ? "gray.700" : "gray.400"}
//                                     >
//                                       {topic}
//                                     </Text>
//                                     {stats.totalQuestions > 0 && (
//                                       <Text fontSize="xs" color="gray.500">
//                                         {stats.totalCorrect} /{" "}
//                                         {stats.totalQuestions} correct
//                                         {stats.percentage > 0 && (
//                                           <Text
//                                             as="span"
//                                             ml={1}
//                                             fontWeight="600"
//                                             color={
//                                               stats.percentage >= 80
//                                                 ? "green.600"
//                                                 : stats.percentage >= 60
//                                                   ? "orange.600"
//                                                   : "red.600"
//                                             }
//                                           >
//                                             ({stats.percentage}%)
//                                           </Text>
//                                         )}
//                                       </Text>
//                                     )}
//                                   </VStack>
//                                 </HStack>
//                                 {completed && (
//                                   <Badge
//                                     colorScheme="green"
//                                     fontSize="12px"
//                                     px={2}
//                                     py={1}
//                                     borderRadius="4px"
//                                     fontWeight="500"
//                                     display="flex"
//                                     alignItems="center"
//                                     gap={1}
//                                   >
//                                     <CheckCircleIcon boxSize={3} /> Completed
//                                   </Badge>
//                                 )}
//                               </Flex>
//                             </Box>
//                           </Tooltip>
//                         );
//                       })
//                     )}
//                   </VStack>
//                 )}
//               </VStack>
//             </CardBody>
//           </Card>
//         </Box>

//         {/* ── Sidebar ───────────────────────────────────────────────────── */}
//         <Box
//           w={{ base: "full", lg: "340px" }}
//           display={{ base: "none", md: "block" }}
//         >
//           <Card
//             bg="white"
//             shadow="sm"
//             borderRadius="8px"
//             overflow="hidden"
//             border="1px solid"
//             borderColor="gray.300"
//             position="sticky"
//             top="20px"
//           >
//             <Tabs colorScheme="purple" variant="soft-rounded">
//               <Box
//                 px={5}
//                 pt={5}
//                 pb={3}
//                 borderBottom="1px solid"
//                 borderColor="gray.300"
//               >
//                 <TabList gap={2}>
//                   <Tab
//                     fontSize="sm"
//                     fontWeight="500"
//                     px={3}
//                     py={2}
//                     _selected={{ bg: "purple.600", color: "white" }}
//                   >
//                     Created Tests
//                   </Tab>
//                 </TabList>
//               </Box>
//               <TabPanels>
//                 <TabPanel p={0}>
//                   <CardBody
//                     p={0}
//                     maxH="calc(100vh - 280px)"
//                     overflowY="auto"
//                     bg="#fafbfc"
//                   >
//                     {dataTypeWiseTest && dataTypeWiseTest.length > 0 ? (
//                       <VStack spacing={0} align="stretch">
//                         {dataTypeWiseTest.map((e, i) => {
//                           const stats = getTestStatistics(e);
//                           return (
//                             <Box
//                               key={e._id ?? i}
//                               p={4}
//                               borderBottom="1px solid"
//                               borderColor="gray.200"
//                               transition="all 0.2s"
//                               cursor="pointer"
//                               _hover={{ bg: "gray.50" }}
//                               _last={{ borderBottom: "none" }}
//                               onClick={() => handleCreatedTestClick(e)}
//                             >
//                               <Flex
//                                 justify="space-between"
//                                 align="start"
//                                 mb={2}
//                               >
//                                 <Text
//                                   fontWeight="500"
//                                   fontSize="15px"
//                                   color="gray.800"
//                                 >
//                                   {e.testName || "Unnamed Test"}
//                                 </Text>
//                                 <IconButton
//                                   icon={<InfoIcon />}
//                                   size="xs"
//                                   variant="ghost"
//                                   colorScheme="blue"
//                                   aria-label="View details"
//                                 />
//                               </Flex>
//                               <HStack spacing={2} mb={2}>
//                                 <Badge
//                                   bg="blue.50"
//                                   color="blue.700"
//                                   fontSize="12px"
//                                   px={2}
//                                   py={1}
//                                   borderRadius="4px"
//                                   fontWeight="500"
//                                 >
//                                   {e.noOfQus || 0} Questions
//                                 </Badge>
//                                 {stats.percentage > 0 && (
//                                   <Badge
//                                     colorScheme={
//                                       stats.percentage >= 80
//                                         ? "green"
//                                         : stats.percentage >= 60
//                                           ? "orange"
//                                           : "red"
//                                     }
//                                     fontSize="12px"
//                                     px={2}
//                                     py={1}
//                                     borderRadius="4px"
//                                     fontWeight="500"
//                                   >
//                                     {stats.percentage}%
//                                   </Badge>
//                                 )}
//                               </HStack>
//                               {stats.percentage > 0 && (
//                                 <Progress
//                                   value={stats.percentage}
//                                   size="xs"
//                                   colorScheme={
//                                     stats.percentage >= 80
//                                       ? "green"
//                                       : stats.percentage >= 60
//                                         ? "orange"
//                                         : "red"
//                                   }
//                                   borderRadius="full"
//                                 />
//                               )}
//                             </Box>
//                           );
//                         })}
//                       </VStack>
//                     ) : (
//                       <Box p={8} textAlign="center">
//                         <Text color="gray.400" fontSize="14px" fontWeight="500">
//                           No tests created yet
//                         </Text>
//                         <Text color="gray.400" fontSize="13px" mt={2}>
//                           Create your first test to get started
//                         </Text>
//                       </Box>
//                     )}
//                   </CardBody>
//                 </TabPanel>

//                 <TabPanel p={0}>
//                   <CardBody
//                     p={0}
//                     maxH="calc(100vh - 280px)"
//                     overflowY="auto"
//                     bg="#fafbfc"
//                   >
//                     <UserTestDataList />
//                   </CardBody>
//                 </TabPanel>
//               </TabPanels>
//             </Tabs>
//           </Card>
//         </Box>
//       </Flex>

//       {/* ── Test Details Modal ────────────────────────────────────────── */}
//       <Modal isOpen={isOpen} onClose={onClose} size="xl">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader borderBottom="1px solid" borderColor="gray.200">
//             <VStack align="start" spacing={1}>
//               <Text fontSize="lg" fontWeight="600">
//                 {selectedTest?.testName || "Test Details"}
//               </Text>
//               {selectedTest?.createdAt && (
//                 <Text fontSize="sm" color="gray.500" fontWeight="400">
//                   Created:{" "}
//                   {new Date(selectedTest.createdAt).toLocaleDateString()}
//                 </Text>
//               )}
//             </VStack>
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody py={6}>
//             {selectedTest &&
//               (() => {
//                 const stats = getTestStatistics(selectedTest);
//                 return (
//                   <VStack spacing={5} align="stretch">
//                     {stats.percentage > 0 && (
//                       <Box>
//                         <Text
//                           fontSize="sm"
//                           fontWeight="600"
//                           color="gray.700"
//                           mb={3}
//                         >
//                           Performance Overview
//                         </Text>
//                         <Box
//                           bg={
//                             stats.percentage >= 80
//                               ? "green.50"
//                               : stats.percentage >= 60
//                                 ? "orange.50"
//                                 : "red.50"
//                           }
//                           border="1px solid"
//                           borderColor={
//                             stats.percentage >= 80
//                               ? "green.200"
//                               : stats.percentage >= 60
//                                 ? "orange.200"
//                                 : "red.200"
//                           }
//                           borderRadius="8px"
//                           p={4}
//                         >
//                           <Flex justify="space-between" align="center" mb={2}>
//                             <Text
//                               fontSize="2xl"
//                               fontWeight="700"
//                               color={
//                                 stats.percentage >= 80
//                                   ? "green.700"
//                                   : stats.percentage >= 60
//                                     ? "orange.700"
//                                     : "red.700"
//                               }
//                             >
//                               {stats.percentage}%
//                             </Text>
//                             <Badge
//                               colorScheme={
//                                 stats.percentage >= 80
//                                   ? "green"
//                                   : stats.percentage >= 60
//                                     ? "orange"
//                                     : "red"
//                               }
//                               fontSize="md"
//                               px={3}
//                               py={1}
//                               borderRadius="6px"
//                             >
//                               {stats.percentage >= 80
//                                 ? "Excellent"
//                                 : stats.percentage >= 60
//                                   ? "Good"
//                                   : "Needs Improvement"}
//                             </Badge>
//                           </Flex>
//                           <Progress
//                             value={stats.percentage}
//                             size="sm"
//                             colorScheme={
//                               stats.percentage >= 80
//                                 ? "green"
//                                 : stats.percentage >= 60
//                                   ? "orange"
//                                   : "red"
//                             }
//                             borderRadius="full"
//                           />
//                         </Box>
//                       </Box>
//                     )}

//                     <Box>
//                       <Text
//                         fontSize="sm"
//                         fontWeight="600"
//                         color="gray.700"
//                         mb={3}
//                       >
//                         Detailed Statistics
//                       </Text>
//                       <Grid templateColumns="repeat(2, 1fr)" gap={3}>
//                         {[
//                           {
//                             label: "Total Questions",
//                             val: selectedTest.noOfQus || 0,
//                             scheme: "blue",
//                           },
//                           {
//                             label: "Attempted",
//                             val: stats.attempted,
//                             scheme: "purple",
//                           },
//                           {
//                             label: "Correct",
//                             val: stats.correct,
//                             scheme: "green",
//                             icon: <FaCheckCircle color="#48BB78" size={14} />,
//                           },
//                           {
//                             label: "Incorrect",
//                             val: stats.incorrect,
//                             scheme: "red",
//                             icon: <FaTimesCircle color="#F56565" size={14} />,
//                           },
//                         ].map(({ label, val, scheme, icon }) => (
//                           <GridItem key={label}>
//                             <Box
//                               bg={`${scheme}.50`}
//                               border="1px solid"
//                               borderColor={`${scheme}.200`}
//                               borderRadius="8px"
//                               p={4}
//                               textAlign="center"
//                             >
//                               {icon && (
//                                 <Flex align="center" justify="center" mb={1}>
//                                   {icon}
//                                   <Text
//                                     fontSize="sm"
//                                     color={`${scheme}.600`}
//                                     fontWeight="500"
//                                     ml={1}
//                                   >
//                                     {label}
//                                   </Text>
//                                 </Flex>
//                               )}
//                               {!icon && (
//                                 <Text
//                                   fontSize="sm"
//                                   color={`${scheme}.600`}
//                                   fontWeight="500"
//                                   mb={1}
//                                 >
//                                   {label}
//                                 </Text>
//                               )}
//                               <Text
//                                 fontSize="2xl"
//                                 fontWeight="700"
//                                 color={`${scheme}.700`}
//                               >
//                                 {val}
//                               </Text>
//                             </Box>
//                           </GridItem>
//                         ))}
//                       </Grid>
//                     </Box>

//                     {selectedTest.quslist?.length > 0 && (
//                       <Box>
//                         <Text
//                           fontSize="sm"
//                           fontWeight="600"
//                           color="gray.700"
//                           mb={3}
//                         >
//                           Topics Covered ({selectedTest.quslist.length})
//                         </Text>
//                         <VStack spacing={2} align="stretch">
//                           {selectedTest.quslist.map((topic, idx) => (
//                             <Flex
//                               key={idx}
//                               justify="space-between"
//                               align="center"
//                               bg="gray.50"
//                               p={3}
//                               borderRadius="6px"
//                               border="1px solid"
//                               borderColor="gray.200"
//                             >
//                               <Text
//                                 fontSize="sm"
//                                 color="gray.700"
//                                 fontWeight="500"
//                               >
//                                 {topic.qusdata}
//                               </Text>
//                               <Badge
//                                 bg="gray.200"
//                                 color="gray.700"
//                                 fontSize="xs"
//                                 px={2}
//                                 py={1}
//                                 borderRadius="4px"
//                               >
//                                 {topic.count} questions
//                               </Badge>
//                             </Flex>
//                           ))}
//                         </VStack>
//                       </Box>
//                     )}

//                     {(selectedTest.category || selectedTest.subcategory) && (
//                       <Box>
//                         <Text
//                           fontSize="sm"
//                           fontWeight="600"
//                           color="gray.700"
//                           mb={3}
//                         >
//                           Test Information
//                         </Text>
//                         <VStack spacing={2} align="stretch">
//                           {selectedTest.category && (
//                             <Flex justify="space-between" align="center">
//                               <Text fontSize="sm" color="gray.600">
//                                 Category:
//                               </Text>
//                               <Badge
//                                 colorScheme="blue"
//                                 fontSize="sm"
//                                 px={3}
//                                 py={1}
//                               >
//                                 {getCategoryDisplayName(selectedTest.category)}
//                               </Badge>
//                             </Flex>
//                           )}
//                           {selectedTest.subcategory && (
//                             <Flex justify="space-between" align="center">
//                               <Text fontSize="sm" color="gray.600">
//                                 Subcategory:
//                               </Text>
//                               <Badge
//                                 colorScheme="purple"
//                                 fontSize="sm"
//                                 px={3}
//                                 py={1}
//                               >
//                                 {selectedTest.subcategory}
//                               </Badge>
//                             </Flex>
//                           )}
//                         </VStack>
//                       </Box>
//                     )}
//                   </VStack>
//                 );
//               })()}
//           </ModalBody>
//           <ModalFooter borderTop="1px solid" borderColor="gray.200">
//             <Button variant="ghost" mr={3} onClick={onClose}>
//               Close
//             </Button>
//             <Button
//               colorScheme="blue"
//               leftIcon={<RepeatIcon />}
//               onClick={handleRetakeTest}
//             >
//               Retake Test
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </Box>
//   );
// };

// export default MathQuestionlist;

import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  VStack,
  HStack,
  Icon,
  Spinner,
  Badge,
  Collapse,
  useDisclosure,
  useToast,
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  FormControl,
  FormLabel,
  Select,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FiBook,
  FiChevronRight,
  FiChevronDown,
  FiPlay,
  FiPlus,
  FiLock,
  FiUnlock,
  FiClock,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { FaBookOpen, FaLock, FaCheckCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import {
  fetchTopicsForSubject,
  fetchQuestions,
  isSubcategoryUnlocked,
  isTestUnlocked,
} from "../helpers/testProgressHelper";

const MathQuestionlist = ({ chooseSub }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [currentTopic, setCurrentTopic] = useState([]);
  const [MathSubject, setMathSubject] = useState(null);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [createdTests, setCreatedTests] = useState([]);

  // Custom test modal
  const {
    isOpen: isCustomOpen,
    onOpen: onCustomOpen,
    onClose: onCustomClose,
  } = useDisclosure();
  const [customForm, setCustomForm] = useState({
    title: "",
    description: "",
    timeLimitMin: 30,
    numQuestions: 10,
    difficulty: "medium",
  });
  const [creating, setCreating] = useState(false);

  // Fetch topics when subject changes
  useEffect(() => {
    if (!chooseSub) return;
    setTopicsLoading(true);
    setMathSubject(null);
    setTests([]);

    fetchTopicsForSubject(chooseSub)
      .then((topics) => {
        setCurrentTopic(topics || []);
        // Auto-select first topic
        if (topics && topics.length > 0) {
          handleSubcategoryClick(topics[0], 0);
        }
      })
      .catch(() => setCurrentTopic([]))
      .finally(() => setTopicsLoading(false));
  }, [chooseSub]);

  const handleSubcategoryClick = useCallback(
    (topic, index) => {
      if (!isSubcategoryUnlocked(index, user)) {
        toast({
          title: "Locked",
          description: "Complete the previous section to unlock this one.",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }
      setMathSubject(topic);
      setLoading(true);
      fetchQuestions(chooseSub, topic)
        .then((qs) => setTests(qs || []))
        .catch(() => setTests([]))
        .finally(() => setLoading(false));
    },
    [chooseSub, user, toast],
  );

  const handleStartTest = (test, idx) => {
    if (!isTestUnlocked(idx, user)) {
      toast({
        title: "Locked",
        description: "Complete the previous test to unlock this one.",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    navigate("/test", {
      state: {
        quest: test.questions,
        testMeta: {
          subject: chooseSub,
          category: MathSubject,
          timeLimitMin: test.timeLimitMin || 0,
          testId: test._id,
          testTitle: test.title,
        },
      },
    });
  };

  const handleCreateCustomTest = async () => {
    setCreating(true);
    try {
      // Navigate to test with filtered/random questions
      const selectedQs = tests
        .flatMap((t) => t.questions || [])
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(customForm.numQuestions, 100));

      if (selectedQs.length === 0) {
        toast({
          title: "No questions available",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      navigate("/test", {
        state: {
          quest: selectedQs,
          testMeta: {
            subject: chooseSub,
            category: MathSubject,
            timeLimitMin: customForm.timeLimitMin,
            testTitle: customForm.title || `Custom: ${MathSubject}`,
          },
        },
      });
      onCustomClose();
    } catch (err) {
      toast({ title: "Error creating test", status: "error", duration: 3000 });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora', sans-serif">
      {/* Hero header */}
      <Box
        bg="linear-gradient(135deg, #0f1e3a 0%, #1e3a5f 60%, #2d5fa8 100%)"
        px={{ base: 4, md: 8 }}
        py={{ base: 8, md: 10 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          right="-80px"
          top="-80px"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="rgba(255,255,255,.03)"
        />
        <Box maxW="1200px" mx="auto" position="relative" zIndex={1}>
          <Flex align="center" gap={3} mb={2}>
            <Flex
              w="44px"
              h="44px"
              bg="rgba(255,255,255,.1)"
              border="2px solid rgba(255,255,255,.15)"
              borderRadius="12px"
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Icon as={FaBookOpen} color="white" fontSize="18px" />
            </Flex>
            <Box>
              <Text
                fontSize={{ base: "22px", md: "30px" }}
                fontWeight={800}
                color="white"
                letterSpacing="-0.5px"
              >
                {chooseSub || "Select a Subject"}
              </Text>
              <Text fontSize="13px" color="rgba(255,255,255,.5)">
                {currentTopic.length} topics available
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>

      <Box maxW="1200px" mx="auto" px={{ base: 4, md: 8 }} py={6}>
        <Flex gap={6} flexDirection={{ base: "column", lg: "row" }}>
          {/* Sidebar — topics */}
          <Box w={{ base: "100%", lg: "260px" }} flexShrink={0}>
            <Box
              bg="white"
              borderRadius="16px"
              border="1.5px solid #e2e8f0"
              overflow="hidden"
              position={{ lg: "sticky" }}
              top={{ lg: "80px" }}
            >
              <Box px={4} py={3} borderBottom="1px solid #f1f5f9" bg="#f8fafc">
                <Text
                  fontSize="11px"
                  fontWeight={800}
                  color="#94a3b8"
                  textTransform="uppercase"
                  letterSpacing="1.2px"
                >
                  Topics
                </Text>
              </Box>

              {topicsLoading ? (
                <Flex justify="center" align="center" py={8}>
                  <Spinner size="md" color="#4a72b8" />
                </Flex>
              ) : currentTopic.length === 0 ? (
                <Box p={5} textAlign="center">
                  <Text fontSize="13px" color="#94a3b8">
                    No topics found
                  </Text>
                </Box>
              ) : (
                <VStack spacing={0} align="stretch">
                  {currentTopic.map((topic, idx) => {
                    const unlocked = isSubcategoryUnlocked(idx, user);
                    const isActive = MathSubject === topic;

                    return (
                      <Flex
                        key={idx}
                        px={4}
                        py={3}
                        align="center"
                        gap={3}
                        cursor={unlocked ? "pointer" : "not-allowed"}
                        bg={isActive ? "#eff6ff" : "transparent"}
                        borderLeft="3px solid"
                        borderLeftColor={isActive ? "#2563eb" : "transparent"}
                        onClick={() => handleSubcategoryClick(topic, idx)}
                        _hover={
                          unlocked
                            ? { bg: isActive ? "#eff6ff" : "#f8fafc" }
                            : {}
                        }
                        transition="all .15s"
                      >
                        <Flex
                          w="28px"
                          h="28px"
                          borderRadius="8px"
                          bg={
                            isActive
                              ? "#dbeafe"
                              : unlocked
                                ? "#f1f5f9"
                                : "#fef2f2"
                          }
                          align="center"
                          justify="center"
                          flexShrink={0}
                        >
                          <Icon
                            as={
                              unlocked
                                ? isActive
                                  ? FaCheckCircle
                                  : FiBook
                                : FaLock
                            }
                            fontSize="12px"
                            color={
                              isActive
                                ? "#2563eb"
                                : unlocked
                                  ? "#64748b"
                                  : "#ef4444"
                            }
                          />
                        </Flex>
                        <Text
                          fontSize="13px"
                          fontWeight={isActive ? 700 : 500}
                          color={
                            isActive
                              ? "#1d4ed8"
                              : unlocked
                                ? "#374151"
                                : "#94a3b8"
                          }
                          flex={1}
                          noOfLines={1}
                        >
                          {topic}
                        </Text>
                        {!unlocked && (
                          <Icon as={FiLock} fontSize="11px" color="#cbd5e1" />
                        )}
                      </Flex>
                    );
                  })}
                </VStack>
              )}
            </Box>
          </Box>

          {/* Main content — tests */}
          <Box flex={1} minW={0}>
            {!MathSubject ? (
              <Box
                bg="white"
                borderRadius="16px"
                border="1.5px solid #e2e8f0"
                p={12}
                textAlign="center"
              >
                <Icon
                  as={FiGrid}
                  fontSize="52px"
                  color="#e2e8f0"
                  display="block"
                  mx="auto"
                  mb={4}
                />
                <Text fontSize="17px" fontWeight={700} color="#475569" mb={2}>
                  Select a topic to get started
                </Text>
                <Text fontSize="14px" color="#94a3b8">
                  Choose a topic from the sidebar to view available tests
                </Text>
              </Box>
            ) : (
              <>
                {/* Topic header + custom test button */}
                <Flex
                  justify="space-between"
                  align="center"
                  mb={4}
                  flexWrap="wrap"
                  gap={3}
                >
                  <Box>
                    <Text
                      fontSize="20px"
                      fontWeight={800}
                      color="#0f172a"
                      letterSpacing="-0.3px"
                    >
                      {MathSubject}
                    </Text>
                    <Text fontSize="13px" color="#64748b">
                      {tests.length} test{tests.length !== 1 ? "s" : ""}{" "}
                      available
                    </Text>
                  </Box>
                  <Button
                    leftIcon={<Icon as={FiPlus} />}
                    bg="#0f1e3a"
                    color="white"
                    fontWeight={700}
                    fontSize="13px"
                    borderRadius="10px"
                    h="38px"
                    _hover={{ bg: "#1e3a5f" }}
                    onClick={onCustomOpen}
                  >
                    Custom Test
                  </Button>
                </Flex>

                {loading ? (
                  <Flex justify="center" align="center" py={16}>
                    <Spinner size="xl" color="#4a72b8" thickness="4px" />
                  </Flex>
                ) : tests.length === 0 ? (
                  <Box
                    bg="white"
                    borderRadius="16px"
                    border="1.5px solid #e2e8f0"
                    p={10}
                    textAlign="center"
                  >
                    <Icon
                      as={FiList}
                      fontSize="40px"
                      color="#e2e8f0"
                      display="block"
                      mx="auto"
                      mb={3}
                    />
                    <Text
                      fontSize="15px"
                      fontWeight={600}
                      color="#475569"
                      mb={2}
                    >
                      No tests in this topic yet
                    </Text>
                    <Text fontSize="13px" color="#94a3b8">
                      Check back later or create a custom test
                    </Text>
                  </Box>
                ) : (
                  <Grid
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                    gap={4}
                  >
                    {tests.map((test, idx) => {
                      const unlocked = isTestUnlocked(idx, user);
                      const qCount =
                        test.questions?.length || test.totalQuestions || 0;
                      const timeLimit = test.timeLimitMin || 0;

                      return (
                        <Box
                          key={test._id || idx}
                          bg="white"
                          borderRadius="16px"
                          border="1.5px solid"
                          borderColor={unlocked ? "#e2e8f0" : "#fecaca"}
                          boxShadow="0 2px 10px rgba(0,0,0,.04)"
                          overflow="hidden"
                          opacity={unlocked ? 1 : 0.7}
                          transition="all .2s"
                          _hover={
                            unlocked
                              ? {
                                  boxShadow: "0 8px 28px rgba(0,0,0,.1)",
                                  transform: "translateY(-2px)",
                                }
                              : {}
                          }
                        >
                          {/* Top color bar */}
                          <Box
                            h="3px"
                            bg={
                              unlocked
                                ? "linear-gradient(90deg, #2563eb, #7c3aed)"
                                : "#fca5a5"
                            }
                          />

                          <Box p={5}>
                            <Flex
                              justify="space-between"
                              align="flex-start"
                              mb={3}
                              gap={2}
                            >
                              <Box flex={1} minW={0}>
                                <Text
                                  fontSize="15px"
                                  fontWeight={700}
                                  color="#0f172a"
                                  noOfLines={2}
                                  lineHeight="1.4"
                                  mb={1}
                                >
                                  {test.title}
                                </Text>
                                {test.description && (
                                  <Text
                                    fontSize="12px"
                                    color="#64748b"
                                    noOfLines={2}
                                  >
                                    {test.description}
                                  </Text>
                                )}
                              </Box>
                              {!unlocked && (
                                <Flex
                                  w="32px"
                                  h="32px"
                                  bg="#fef2f2"
                                  borderRadius="8px"
                                  align="center"
                                  justify="center"
                                  flexShrink={0}
                                >
                                  <Icon
                                    as={FiLock}
                                    fontSize="14px"
                                    color="#ef4444"
                                  />
                                </Flex>
                              )}
                            </Flex>

                            {/* Stats row */}
                            <HStack spacing={4} mb={4}>
                              <Flex align="center" gap={1.5}>
                                <Icon
                                  as={FiGrid}
                                  fontSize="11px"
                                  color="#94a3b8"
                                />
                                <Text
                                  fontSize="12px"
                                  color="#64748b"
                                  fontWeight={600}
                                >
                                  {qCount} Qs
                                </Text>
                              </Flex>
                              {timeLimit > 0 && (
                                <Flex align="center" gap={1.5}>
                                  <Icon
                                    as={FiClock}
                                    fontSize="11px"
                                    color="#94a3b8"
                                  />
                                  <Text
                                    fontSize="12px"
                                    color="#64748b"
                                    fontWeight={600}
                                  >
                                    {timeLimit} min
                                  </Text>
                                </Flex>
                              )}
                              {test.difficulty && (
                                <Badge
                                  px={2}
                                  py={0.5}
                                  borderRadius="full"
                                  fontSize="10px"
                                  fontWeight={700}
                                  bg={
                                    test.difficulty === "easy"
                                      ? "#f0fdf4"
                                      : test.difficulty === "hard"
                                        ? "#fef2f2"
                                        : "#fffbeb"
                                  }
                                  color={
                                    test.difficulty === "easy"
                                      ? "#16a34a"
                                      : test.difficulty === "hard"
                                        ? "#ef4444"
                                        : "#d97706"
                                  }
                                  textTransform="capitalize"
                                >
                                  {test.difficulty}
                                </Badge>
                              )}
                            </HStack>

                            <Button
                              w="100%"
                              h="38px"
                              bg={unlocked ? "#0f1e3a" : "#f1f5f9"}
                              color={unlocked ? "white" : "#94a3b8"}
                              fontWeight={700}
                              fontSize="13px"
                              borderRadius="10px"
                              leftIcon={
                                <Icon
                                  as={unlocked ? FiPlay : FiLock}
                                  fontSize="12px"
                                />
                              }
                              _hover={unlocked ? { bg: "#1e3a5f" } : {}}
                              cursor={unlocked ? "pointer" : "not-allowed"}
                              onClick={() => handleStartTest(test, idx)}
                            >
                              {unlocked ? "Start Test" : "Locked"}
                            </Button>
                          </Box>
                        </Box>
                      );
                    })}
                  </Grid>
                )}
              </>
            )}
          </Box>
        </Flex>
      </Box>

      {/* Custom Test Modal */}
      <Modal isOpen={isCustomOpen} onClose={onCustomClose} isCentered size="md">
        <ModalOverlay backdropFilter="blur(4px)" bg="rgba(0,0,0,.5)" />
        <ModalContent borderRadius="20px" fontFamily="'Sora',sans-serif" mx={4}>
          <Box
            bg="linear-gradient(135deg, #0f1e3a, #2d5fa8)"
            px={6}
            py={5}
            borderTopRadius="20px"
          >
            <ModalCloseButton color="white" top={4} right={4} />
            <Text fontSize="18px" fontWeight={800} color="white">
              Create Custom Test
            </Text>
            <Text fontSize="12px" color="rgba(255,255,255,.6)" mt={1}>
              {MathSubject} · {chooseSub}
            </Text>
          </Box>

          <ModalBody py={5} px={6}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight={700}
                  color="#64748b"
                  textTransform="uppercase"
                  letterSpacing=".8px"
                >
                  Test Title (optional)
                </FormLabel>
                <Input
                  placeholder={`Custom ${MathSubject} Test`}
                  value={customForm.title}
                  onChange={(e) =>
                    setCustomForm((p) => ({ ...p, title: e.target.value }))
                  }
                  borderRadius="10px"
                  border="1.5px solid #e2e8f0"
                  fontSize="14px"
                  _focus={{ borderColor: "#2563eb", boxShadow: "none" }}
                />
              </FormControl>

              <Flex gap={3}>
                <FormControl flex={1}>
                  <FormLabel
                    fontSize="12px"
                    fontWeight={700}
                    color="#64748b"
                    textTransform="uppercase"
                    letterSpacing=".8px"
                  >
                    Questions
                  </FormLabel>
                  <NumberInput
                    min={1}
                    max={100}
                    value={customForm.numQuestions}
                    onChange={(val) =>
                      setCustomForm((p) => ({
                        ...p,
                        numQuestions: Number(val),
                      }))
                    }
                  >
                    <NumberInputField
                      borderRadius="10px"
                      border="1.5px solid #e2e8f0"
                      fontSize="14px"
                      _focus={{ borderColor: "#2563eb", boxShadow: "none" }}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl flex={1}>
                  <FormLabel
                    fontSize="12px"
                    fontWeight={700}
                    color="#64748b"
                    textTransform="uppercase"
                    letterSpacing=".8px"
                  >
                    Time (min)
                  </FormLabel>
                  <NumberInput
                    min={0}
                    max={300}
                    value={customForm.timeLimitMin}
                    onChange={(val) =>
                      setCustomForm((p) => ({
                        ...p,
                        timeLimitMin: Number(val),
                      }))
                    }
                  >
                    <NumberInputField
                      borderRadius="10px"
                      border="1.5px solid #e2e8f0"
                      fontSize="14px"
                      _focus={{ borderColor: "#2563eb", boxShadow: "none" }}
                    />
                  </NumberInput>
                </FormControl>
              </Flex>

              <FormControl>
                <FormLabel
                  fontSize="12px"
                  fontWeight={700}
                  color="#64748b"
                  textTransform="uppercase"
                  letterSpacing=".8px"
                >
                  Difficulty
                </FormLabel>
                <Select
                  value={customForm.difficulty}
                  onChange={(e) =>
                    setCustomForm((p) => ({ ...p, difficulty: e.target.value }))
                  }
                  borderRadius="10px"
                  border="1.5px solid #e2e8f0"
                  fontSize="14px"
                  _focus={{ borderColor: "#2563eb", boxShadow: "none" }}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter gap={3} borderTop="1px solid #f1f5f9" pt={4}>
            <Button
              variant="ghost"
              onClick={onCustomClose}
              fontWeight={600}
              borderRadius="9px"
              color="#64748b"
            >
              Cancel
            </Button>
            <Button
              bg="#0f1e3a"
              color="white"
              fontWeight={700}
              borderRadius="9px"
              leftIcon={<Icon as={FiPlay} fontSize="12px" />}
              isLoading={creating}
              onClick={handleCreateCustomTest}
              _hover={{ bg: "#1e3a5f" }}
            >
              Start Custom Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MathQuestionlist;