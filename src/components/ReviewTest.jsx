// import React, { useState } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Icon,
//   VStack,
//   Button,
//   Grid,
//   Center,
//   Drawer,
//   DrawerBody,
//   DrawerContent,
//   DrawerOverlay,
//   DrawerCloseButton,
//   useDisclosure,
//   useMediaQuery,
// } from "@chakra-ui/react";
// import { useLocation, useNavigate } from "react-router-dom";
// import {
//   FaArrowLeft,
//   FaArrowRight,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaFlag,
//   FaCircle,
//   FaChartBar,
//   FaStopwatch,
//   FaBars,
// } from "react-icons/fa";
// import { FiAlertCircle } from "react-icons/fi";

// /* ── helpers ─────────────────────────────────────────────────── */
// const fmtTime = (s) => {
//   if (!s && s !== 0) return null;
//   if (s === 0) return "< 1s";
//   const m = Math.floor(s / 60);
//   const r = s % 60;
//   return m > 0 ? `${m}m ${r}s` : `${r}s`;
// };

// /* ── status config ────────────────────────────────────────────── */
// const STATUS_MAP = {
//   correct: {
//     label: "Correct",
//     color: "#15803d",
//     bg: "#f0fdf4",
//     border: "#86efac",
//     cell: "#16a34a",
//     icon: FaCheckCircle,
//   },
//   incorrect: {
//     label: "Incorrect",
//     color: "#b91c1c",
//     bg: "#fef2f2",
//     border: "#fca5a5",
//     cell: "#ef4444",
//     icon: FaTimesCircle,
//   },
//   markedAnswered: {
//     label: "Marked & Answered",
//     color: "#6d28d9",
//     bg: "#f5f3ff",
//     border: "#c4b5fd",
//     cell: "#7c3aed",
//     icon: FaFlag,
//   },
//   markedSkipped: {
//     label: "Marked (Skipped)",
//     color: "#b45309",
//     bg: "#fffbeb",
//     border: "#fcd34d",
//     cell: "#d97706",
//     icon: FaFlag,
//   },
//   skipped: {
//     label: "Not Attempted",
//     color: "#475569",
//     bg: "#f8fafc",
//     border: "#cbd5e1",
//     cell: "#94a3b8",
//     icon: FaCircle,
//   },
//   answered: {
//     label: "Answered",
//     color: "#1d4ed8",
//     bg: "#eff6ff",
//     border: "#93c5fd",
//     cell: "#2563eb",
//     icon: FaCheckCircle,
//   },
//   notVisited: {
//     label: "Not Visited",
//     color: "#94a3b8",
//     bg: "#f9fafb",
//     border: "#e5e7eb",
//     cell: "#d1d5db",
//     icon: FaCircle,
//   },
// };

// function getStatus(i, sa) {
//   if (sa.correctQus.includes(i)) return "correct";
//   if (sa.wrongansqus.includes(i)) return "incorrect";
//   if (sa.markedAndAnswer.includes(i)) return "markedAnswered";
//   if (sa.markedNotAnswer.includes(i)) return "markedSkipped";
//   if (sa.notAnswer.includes(i)) return "skipped";
//   if (sa.answeredQuestion.includes(i)) return "answered";
//   return "notVisited";
// }

// /* ── Sidebar ──────────────────────────────────────────────────── */
// function Sidebar({ questions, current, setCurrent, sa, onClose }) {
//   const LEGEND = [
//     ["correct", "Correct"],
//     ["incorrect", "Wrong"],
//     ["skipped", "Not Attempted"],
//     ["markedAnswered", "Marked & Ans."],
//     ["markedSkipped", "Marked (Skip)"],
//     ["notVisited", "Not Visited"],
//   ];

//   return (
//     <Flex direction="column" h="100%" overflow="hidden">
//       {/* Legend */}
//       <Box px={4} pt={5} pb={4} borderBottom="1px solid #f1f5f9" flexShrink={0}>
//         <Text
//           fontSize="10px"
//           fontWeight={800}
//           color="#94a3b8"
//           textTransform="uppercase"
//           letterSpacing="1px"
//           mb={3}
//         >
//           Legend
//         </Text>
//         <Grid templateColumns="1fr 1fr" gap={2}>
//           {LEGEND.map(([key, label]) => (
//             <Flex key={key} align="center" gap={2}>
//               <Box
//                 w="10px"
//                 h="10px"
//                 borderRadius="3px"
//                 flexShrink={0}
//                 bg={STATUS_MAP[key].cell}
//                 border={
//                   key === "skipped" || key === "notVisited"
//                     ? "1.5px solid #cbd5e1"
//                     : "none"
//                 }
//               />
//               <Text
//                 fontSize="11px"
//                 color="#475569"
//                 fontWeight={500}
//                 noOfLines={1}
//               >
//                 {label}
//               </Text>
//             </Flex>
//           ))}
//         </Grid>
//       </Box>

//       {/* Question palette */}
//       <Box
//         px={4}
//         py={4}
//         flex={1}
//         overflowY="auto"
//         css={{
//           "&::-webkit-scrollbar": { width: "3px" },
//           "&::-webkit-scrollbar-thumb": {
//             background: "#e2e8f0",
//             borderRadius: "4px",
//           },
//         }}
//       >
//         <Text
//           fontSize="10px"
//           fontWeight={800}
//           color="#94a3b8"
//           textTransform="uppercase"
//           letterSpacing="1px"
//           mb={3}
//         >
//           Questions
//         </Text>
//         <Grid templateColumns="repeat(5, 1fr)" gap={2}>
//           {questions.map((_, i) => {
//             const st = getStatus(i, sa);
//             const cfg = STATUS_MAP[st];
//             const active = i === current;
//             return (
//               <Center
//                 key={i}
//                 h="34px"
//                 borderRadius="6px"
//                 cursor="pointer"
//                 fontSize="11px"
//                 fontWeight={800}
//                 bg={active ? "#0f172a" : cfg.cell}
//                 color="white"
//                 opacity={!active && st === "notVisited" ? 0.35 : 1}
//                 border={active ? "2px solid #3b82f6" : "2px solid transparent"}
//                 boxShadow={active ? "0 0 0 3px rgba(59,130,246,.2)" : "none"}
//                 transition="all .12s"
//                 _hover={{ opacity: 1, transform: "scale(1.08)" }}
//                 onClick={() => {
//                   setCurrent(i);
//                   if (onClose) onClose();
//                 }}
//               >
//                 {i + 1}
//               </Center>
//             );
//           })}
//         </Grid>
//       </Box>
//     </Flex>
//   );
// }

// /* ── Question card ────────────────────────────────────────────── */
// function QuestionCard({ question, index, allAnswers, sa, questionTimes }) {
//   if (!question) return null;

//   const st = getStatus(index, sa);
//   const cfg = STATUS_MAP[st];
//   const uid = allAnswers[index] ?? allAnswers[String(index)];
//   const cid =
//     typeof question.answer === "number" ? question.answer : question.answer - 1;
//   const timeStr = fmtTime(
//     questionTimes?.[index] ?? questionTimes?.[String(index)] ?? null,
//   );

//   return (
//     <Box
//       bg="white"
//       borderRadius="12px"
//       border="1px solid #e5e7eb"
//       overflow="hidden"
//       boxShadow="0 1px 8px rgba(0,0,0,.05)"
//     >
//       {/* coloured top strip */}
//       <Box h="3px" bg={cfg.cell} />

//       {/* header */}
//       <Flex
//         align="center"
//         justify="space-between"
//         px={{ base: 4, md: 5 }}
//         py={3}
//         borderBottom="1px solid #f3f4f6"
//       >
//         <Flex align="center" gap={2.5}>
//           <Center
//             w="28px"
//             h="28px"
//             borderRadius="6px"
//             bg={cfg.bg}
//             border={`1px solid ${cfg.border}`}
//             flexShrink={0}
//           >
//             <Text fontSize="12px" fontWeight={900} color={cfg.color}>
//               {index + 1}
//             </Text>
//           </Center>
//           <Flex
//             align="center"
//             gap={1.5}
//             px={2.5}
//             py="4px"
//             borderRadius="20px"
//             bg={cfg.bg}
//             border={`1px solid ${cfg.border}`}
//           >
//             <Icon as={cfg.icon} fontSize="10px" color={cfg.color} />
//             <Text fontSize="11px" fontWeight={700} color={cfg.color}>
//               {cfg.label}
//             </Text>
//           </Flex>
//         </Flex>

//         {timeStr && (
//           <Flex
//             align="center"
//             gap={1.5}
//             px={2.5}
//             py="4px"
//             borderRadius="20px"
//             bg="#f9fafb"
//             border="1px solid #e5e7eb"
//           >
//             <Icon as={FaStopwatch} fontSize="9px" color="#6b7280" />
//             <Text fontSize="11px" fontWeight={700} color="#374151">
//               {timeStr}
//             </Text>
//           </Flex>
//         )}
//       </Flex>

//       {/* body */}
//       <Box px={{ base: 4, md: 5 }} pt={4} pb={5}>
//         {/* question text */}
//         <Text
//           fontSize={{ base: "15px", md: "16px" }}
//           fontWeight={600}
//           color="#0f172a"
//           lineHeight="1.8"
//           mb={4}
//         >
//           {question.qus}
//         </Text>

//         {/* options */}
//         <VStack spacing={2} align="stretch" mb={4}>
//           {question.options?.map((opt, i) => {
//             const isC = i === cid;
//             const isU = uid === i;
//             const isW = isU && !isC;
//             return (
//               <Flex
//                 key={i}
//                 align="center"
//                 gap={3}
//                 px={4}
//                 py={3}
//                 borderRadius="8px"
//                 border="1.5px solid"
//                 borderColor={isC ? "#86efac" : isW ? "#fca5a5" : "#e5e7eb"}
//                 bg={isC ? "#f0fdf4" : isW ? "#fef2f2" : "#fafafa"}
//               >
//                 <Center
//                   w="28px"
//                   h="28px"
//                   borderRadius="6px"
//                   flexShrink={0}
//                   fontSize="11px"
//                   fontWeight={900}
//                   bg={isC ? "#16a34a" : isW ? "#ef4444" : "#f3f4f6"}
//                   color={isC || isW ? "white" : "#6b7280"}
//                 >
//                   {isC ? (
//                     <Icon as={FaCheckCircle} fontSize="12px" />
//                   ) : isW ? (
//                     <Icon as={FaTimesCircle} fontSize="12px" />
//                   ) : (
//                     String.fromCharCode(65 + i)
//                   )}
//                 </Center>

//                 <Text
//                   flex={1}
//                   fontSize="14px"
//                   color={isC ? "#15803d" : isW ? "#b91c1c" : "#374151"}
//                   fontWeight={isC || isU ? 600 : 400}
//                   lineHeight="1.5"
//                 >
//                   {opt}
//                 </Text>

//                 <Flex gap={1.5} flexShrink={0}>
//                   {isC && (
//                     <Box
//                       px={2}
//                       py="2px"
//                       borderRadius="4px"
//                       fontSize="10px"
//                       fontWeight={700}
//                       bg="#dcfce7"
//                       color="#15803d"
//                       border="1px solid #bbf7d0"
//                     >
//                       ✓ Correct
//                     </Box>
//                   )}
//                   {isU && isC && (
//                     <Box
//                       px={2}
//                       py="2px"
//                       borderRadius="4px"
//                       fontSize="10px"
//                       fontWeight={700}
//                       bg="#dbeafe"
//                       color="#1d4ed8"
//                       border="1px solid #bfdbfe"
//                     >
//                       Your Answer
//                     </Box>
//                   )}
//                   {isW && (
//                     <Box
//                       px={2}
//                       py="2px"
//                       borderRadius="4px"
//                       fontSize="10px"
//                       fontWeight={700}
//                       bg="#fee2e2"
//                       color="#b91c1c"
//                       border="1px solid #fecaca"
//                     >
//                       ✗ Your Answer
//                     </Box>
//                   )}
//                 </Flex>
//               </Flex>
//             );
//           })}
//         </VStack>

//         {/* answer summary */}
//         <Flex
//           bg="#f9fafb"
//           borderRadius="8px"
//           border="1px solid #f3f4f6"
//           overflow="hidden"
//           mb={question.explanation ? 3 : 0}
//         >
//           <Box flex={1} px={4} py={3} borderRight="1px solid #f3f4f6">
//             <Text
//               fontSize="10px"
//               color="#9ca3af"
//               fontWeight={700}
//               textTransform="uppercase"
//               letterSpacing=".7px"
//               mb={1}
//             >
//               Your Answer
//             </Text>
//             <Text
//               fontSize="14px"
//               fontWeight={700}
//               color={
//                 st === "correct"
//                   ? "#15803d"
//                   : st === "incorrect"
//                     ? "#b91c1c"
//                     : "#9ca3af"
//               }
//             >
//               {uid !== undefined && uid !== null
//                 ? question.options?.[uid] || "—"
//                 : "Not Attempted"}
//             </Text>
//           </Box>
//           <Box flex={1} px={4} py={3}>
//             <Text
//               fontSize="10px"
//               color="#9ca3af"
//               fontWeight={700}
//               textTransform="uppercase"
//               letterSpacing=".7px"
//               mb={1}
//             >
//               Correct Answer
//             </Text>
//             <Text fontSize="14px" fontWeight={700} color="#15803d">
//               {question.options?.[cid] || "—"}
//             </Text>
//           </Box>
//         </Flex>

//         {/* explanation */}
//         {question.explanation && (
//           <Box
//             p={4}
//             bg="#eff6ff"
//             borderRadius="8px"
//             borderLeft="3px solid #3b82f6"
//           >
//             <Flex align="center" gap={2} mb={1.5}>
//               <Icon as={FiAlertCircle} color="#3b82f6" fontSize="13px" />
//               <Text
//                 fontSize="10px"
//                 fontWeight={800}
//                 color="#1e40af"
//                 textTransform="uppercase"
//                 letterSpacing=".7px"
//               >
//                 Explanation
//               </Text>
//             </Flex>
//             <Text fontSize="13px" color="#1e3a5f" lineHeight="1.75">
//               {question.explanation}
//             </Text>
//           </Box>
//         )}
//       </Box>
//     </Box>
//   );
// }

// /* ── Main page ────────────────────────────────────────────────── */
// export default function ReviewTest() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [isLg] = useMediaQuery("(min-width: 1024px)");

//   const d = location.state || {};
//   const questions = d.questions || [];
//   const allAnswers = d.allAnswers || {};
//   const questionTimes = d.questionTimes || {};
//   const testTitle = d.testTitle || "Test Review";

//   const sa = {
//     correctQus: d.correctQus || [],
//     wrongansqus: d.wrongansqus || [],
//     answeredQuestion: d.answeredQuestion || [],
//     notAnswer: d.notAnswer || [],
//     markedAndAnswer: d.markedAndAnswer || [],
//     markedNotAnswer: d.markedNotAnswer || [],
//   };

//   const [cur, setCur] = useState(0);

//   /* sliding dot window */
//   const HALF = 3;
//   let start = Math.max(0, cur - HALF);
//   let end = Math.min(questions.length - 1, start + 6);
//   if (end - start < 6) start = Math.max(0, end - 6);
//   const dots = [];
//   for (let i = start; i <= end; i++) dots.push(i);

//   /* no data guard */
//   if (!questions.length) {
//     return (
//       <Flex
//         minH="100vh"
//         align="center"
//         justify="center"
//         direction="column"
//         gap={3}
//         bg="#f9fafb"
//         fontFamily="'DM Sans',sans-serif"
//       >
//         <Icon as={FaChartBar} fontSize="44px" color="#d1d5db" />
//         <Text fontSize="17px" fontWeight={700} color="#111827">
//           No review data
//         </Text>
//         <Button
//           onClick={() => navigate(-1)}
//           bg="#111827"
//           color="white"
//           borderRadius="8px"
//           fontWeight={700}
//           h="42px"
//           px={5}
//           mt={1}
//           _hover={{ bg: "#1f2937" }}
//         >
//           Go Back
//         </Button>
//       </Flex>
//     );
//   }

//   const curSt = getStatus(cur, sa);
//   const curCfg = STATUS_MAP[curSt];

//   /* header height for sticky offset */
//   const HDR = { base: "54px", md: "60px" };

//   return (
//     <Box bg="#f3f4f6" minH="100vh" fontFamily="'DM Sans',sans-serif">
//       {/* ── Header ── */}
//       <Box
//         bg="linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)"
//         boxShadow="0 1px 12px rgba(0,0,0,.3)"
//         position="sticky"
//         top={0}
//         zIndex={50}
//       >
//         <Flex
//           px={{ base: 4, md: 6, lg: 8 }}
//           h={HDR}
//           align="center"
//           justify="space-between"
//         >
//           {/* left: back + title */}
//           <Flex align="center" gap={3} flex={1} minW={0}>
//             <Center
//               w="32px"
//               h="32px"
//               borderRadius="8px"
//               flexShrink={0}
//               bg="rgba(255,255,255,.08)"
//               border="1px solid rgba(255,255,255,.12)"
//               cursor="pointer"
//               onClick={() => navigate(-1)}
//               _hover={{ bg: "rgba(255,255,255,.15)" }}
//               transition="background .15s"
//             >
//               <Icon
//                 as={FaArrowLeft}
//                 color="rgba(255,255,255,.8)"
//                 fontSize="12px"
//               />
//             </Center>
//             <Box minW={0}>
//               <Text
//                 fontSize={{ base: "13px", md: "15px" }}
//                 fontWeight={800}
//                 color="white"
//                 noOfLines={1}
//                 letterSpacing="-0.2px"
//               >
//                 {testTitle}
//               </Text>
//               <Text
//                 fontSize="10px"
//                 color="rgba(255,255,255,.4)"
//                 fontWeight={600}
//                 textTransform="uppercase"
//                 letterSpacing=".8px"
//               >
//                 Review Mode
//               </Text>
//             </Box>
//           </Flex>

//           {/* center: counter */}
//           <Box
//             px={4}
//             py="6px"
//             borderRadius="8px"
//             flexShrink={0}
//             bg="rgba(255,255,255,.08)"
//             border="1px solid rgba(255,255,255,.12)"
//           >
//             <Text
//               fontSize="14px"
//               fontWeight={900}
//               color="white"
//               letterSpacing="1.5px"
//               fontFamily="'JetBrains Mono',monospace"
//             >
//               {String(cur + 1).padStart(2, "0")}/
//               {String(questions.length).padStart(2, "0")}
//             </Text>
//           </Box>

//           {/* right: hamburger (non-desktop) */}
//           {!isLg && (
//             <Center
//               w="32px"
//               h="32px"
//               borderRadius="8px"
//               flexShrink={0}
//               ml={3}
//               bg="rgba(255,255,255,.08)"
//               border="1px solid rgba(255,255,255,.12)"
//               cursor="pointer"
//               onClick={onOpen}
//               _hover={{ bg: "rgba(255,255,255,.15)" }}
//               transition="background .15s"
//             >
//               <Icon as={FaBars} color="rgba(255,255,255,.8)" fontSize="12px" />
//             </Center>
//           )}
//         </Flex>
//       </Box>

//       {/* ── Body ── */}
//       <Flex>
//         {/* Desktop sidebar */}
//         {isLg && (
//           <Box
//             w="240px"
//             flexShrink={0}
//             bg="white"
//             borderRight="1px solid #e5e7eb"
//             position="sticky"
//             top={HDR.md || "60px"}
//             h={`calc(100vh - 60px)`}
//             overflowY="auto"
//             css={{
//               "&::-webkit-scrollbar": { width: "3px" },
//               "&::-webkit-scrollbar-thumb": {
//                 background: "#e5e7eb",
//                 borderRadius: "4px",
//               },
//             }}
//           >
//             <Sidebar
//               questions={questions}
//               current={cur}
//               setCurrent={setCur}
//               sa={sa}
//             />
//           </Box>
//         )}

//         {/* Mobile/tablet sidebar drawer */}
//         {!isLg && (
//           <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
//             <DrawerOverlay backdropFilter="blur(3px)" bg="rgba(0,0,0,.3)" />
//             <DrawerContent bg="white" maxW="260px">
//               <DrawerCloseButton top={3} right={3} color="#374151" />
//               <DrawerBody p={0} pt={10}>
//                 <Sidebar
//                   questions={questions}
//                   current={cur}
//                   setCurrent={setCur}
//                   sa={sa}
//                   onClose={onClose}
//                 />
//               </DrawerBody>
//             </DrawerContent>
//           </Drawer>
//         )}

//         {/* Main content */}
//         <Box flex={1} minW={0}>
//           {/* sticky sub-header */}
//           <Flex
//             px={{ base: 4, md: 6, lg: 8 }}
//             py={3}
//             bg="white"
//             borderBottom="1px solid #e5e7eb"
//             align="center"
//             gap={3}
//             position="sticky"
//             top={HDR}
//             zIndex={40}
//           >
//             <Box px={3} py="5px" borderRadius="6px" bg="#0f172a">
//               <Text
//                 fontSize="11px"
//                 fontWeight={800}
//                 color="white"
//                 letterSpacing=".3px"
//               >
//                 Q {cur + 1} / {questions.length}
//               </Text>
//             </Box>
//             <Flex
//               align="center"
//               gap={1.5}
//               px={2.5}
//               py="4px"
//               borderRadius="20px"
//               bg={curCfg.bg}
//               border={`1px solid ${curCfg.border}`}
//             >
//               <Icon as={curCfg.icon} fontSize="10px" color={curCfg.color} />
//               <Text fontSize="11px" fontWeight={700} color={curCfg.color}>
//                 {curCfg.label}
//               </Text>
//             </Flex>
//           </Flex>

//           {/* question card */}
//           <Box px={{ base: 3, md: 5, lg: 8 }} pt={5} pb={4}>
//             <QuestionCard
//               question={questions[cur]}
//               index={cur}
//               allAnswers={allAnswers}
//               sa={sa}
//               questionTimes={questionTimes}
//             />
//           </Box>

//           {/* bottom nav */}
//           <Box px={{ base: 3, md: 5, lg: 8 }} pb={8}>
//             <Flex
//               align="center"
//               justify="space-between"
//               gap={3}
//               bg="white"
//               borderRadius="10px"
//               border="1px solid #e5e7eb"
//               px={3}
//               py={2.5}
//               boxShadow="0 1px 6px rgba(0,0,0,.04)"
//             >
//               <Button
//                 leftIcon={<Icon as={FaArrowLeft} fontSize="10px" />}
//                 isDisabled={cur === 0}
//                 onClick={() => setCur((c) => Math.max(0, c - 1))}
//                 bg="#f3f4f6"
//                 color="#374151"
//                 borderRadius="8px"
//                 fontWeight={700}
//                 fontSize="13px"
//                 h="38px"
//                 px={4}
//                 border="1px solid #e5e7eb"
//                 _hover={{ bg: "#e9eaec" }}
//                 _disabled={{ opacity: 0.35 }}
//                 transition="all .12s"
//               >
//                 Prev
//               </Button>

//               <Flex align="center" gap={1.5} flex={1} justify="center">
//                 {dots.map((i) => {
//                   const s = getStatus(i, sa);
//                   const c = STATUS_MAP[s];
//                   const active = i === cur;
//                   return (
//                     <Center
//                       key={i}
//                       w="28px"
//                       h="28px"
//                       borderRadius="6px"
//                       cursor="pointer"
//                       fontSize="10px"
//                       fontWeight={800}
//                       bg={active ? "#0f172a" : c.cell}
//                       color="white"
//                       opacity={!active && s === "notVisited" ? 0.3 : 1}
//                       border={
//                         active ? "2px solid #3b82f6" : "2px solid transparent"
//                       }
//                       boxShadow={
//                         active ? "0 0 0 2px rgba(59,130,246,.2)" : "none"
//                       }
//                       onClick={() => setCur(i)}
//                       transition="all .12s"
//                       _hover={{ transform: "scale(1.1)", opacity: 1 }}
//                     >
//                       {i + 1}
//                     </Center>
//                   );
//                 })}
//               </Flex>

//               <Button
//                 rightIcon={<Icon as={FaArrowRight} fontSize="10px" />}
//                 isDisabled={cur === questions.length - 1}
//                 onClick={() =>
//                   setCur((c) => Math.min(questions.length - 1, c + 1))
//                 }
//                 bg="#0f172a"
//                 color="white"
//                 borderRadius="8px"
//                 fontWeight={700}
//                 fontSize="13px"
//                 h="38px"
//                 px={4}
//                 _hover={{
//                   bg: "#1e293b",
//                   boxShadow: "0 3px 10px rgba(0,0,0,.2)",
//                 }}
//                 _disabled={{ opacity: 0.35 }}
//                 transition="all .12s"
//               >
//                 Next
//               </Button>
//             </Flex>
//           </Box>
//         </Box>
//       </Flex>
//     </Box>
//   );
// }

import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  VStack,
  Button,
  Grid,
  Center,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaTimesCircle,
  FaFlag,
  FaCircle,
  FaChartBar,
  FaStopwatch,
  FaBars,
  FaLayerGroup,
} from "react-icons/fa";
import { FiAlertCircle } from "react-icons/fi";

const fmtTime = (s) => {
  if (!s && s !== 0) return null;
  if (s === 0) return "< 1s";
  const m = Math.floor(s / 60),
    r = s % 60;
  return m > 0 ? `${m}m ${r}s` : `${r}s`;
};

const STATUS_MAP = {
  correct: {
    label: "Correct",
    color: "#15803d",
    bg: "#f0fdf4",
    border: "#86efac",
    cell: "#16a34a",
    icon: FaCheckCircle,
  },
  incorrect: {
    label: "Incorrect",
    color: "#b91c1c",
    bg: "#fef2f2",
    border: "#fca5a5",
    cell: "#ef4444",
    icon: FaTimesCircle,
  },
  markedAnswered: {
    label: "Marked & Answered",
    color: "#6d28d9",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    cell: "#7c3aed",
    icon: FaFlag,
  },
  markedSkipped: {
    label: "Marked (Skipped)",
    color: "#b45309",
    bg: "#fffbeb",
    border: "#fcd34d",
    cell: "#d97706",
    icon: FaFlag,
  },
  skipped: {
    label: "Not Attempted",
    color: "#475569",
    bg: "#f8fafc",
    border: "#cbd5e1",
    cell: "#94a3b8",
    icon: FaCircle,
  },
  answered: {
    label: "Answered",
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#93c5fd",
    cell: "#2563eb",
    icon: FaCheckCircle,
  },
  notVisited: {
    label: "Not Visited",
    color: "#94a3b8",
    bg: "#f9fafb",
    border: "#e5e7eb",
    cell: "#d1d5db",
    icon: FaCircle,
  },
};

function getStatus(i, sa) {
  if (sa.correctQus.includes(i)) return "correct";
  if (sa.wrongansqus.includes(i)) return "incorrect";
  if (sa.markedAndAnswer.includes(i)) return "markedAnswered";
  if (sa.markedNotAnswer.includes(i)) return "markedSkipped";
  if (sa.notAnswer.includes(i)) return "skipped";
  if (sa.answeredQuestion.includes(i)) return "answered";
  return "notVisited";
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  questions,
  current,
  setCurrent,
  sa,
  onClose,
  isSectioned,
  sectionMeta,
}) {
  const LEGEND = [
    ["correct", "Correct"],
    ["incorrect", "Wrong"],
    ["skipped", "Not Attempted"],
    ["markedAnswered", "Marked & Ans."],
    ["markedSkipped", "Marked (Skip)"],
    ["notVisited", "Not Visited"],
  ];

  // Build section boundaries
  const sectionBounds = React.useMemo(() => {
    if (!isSectioned || !sectionMeta?.length) return [];
    const result = [];
    let offset = 0;
    sectionMeta.forEach((sec, sIdx) => {
      const count = sec.count || 0;
      result.push({
        sectionIdx: sIdx,
        name: sec.name || sec.subject || `Section ${sIdx + 1}`,
        start: offset,
        end: offset + count - 1,
        count,
      });
      offset += count;
    });
    return result;
  }, [isSectioned, sectionMeta]);

  return (
    <Flex direction="column" h="100%" overflow="hidden">
      {/* Legend */}
      <Box px={4} pt={5} pb={4} borderBottom="1px solid #f1f5f9" flexShrink={0}>
        <Text
          fontSize="10px"
          fontWeight={800}
          color="#94a3b8"
          textTransform="uppercase"
          letterSpacing="1px"
          mb={3}
        >
          Legend
        </Text>
        <Grid templateColumns="1fr 1fr" gap={2}>
          {LEGEND.map(([key, label]) => (
            <Flex key={key} align="center" gap={2}>
              <Box
                w="10px"
                h="10px"
                borderRadius="3px"
                flexShrink={0}
                bg={STATUS_MAP[key].cell}
                border={
                  key === "skipped" || key === "notVisited"
                    ? "1.5px solid #cbd5e1"
                    : "none"
                }
              />
              <Text
                fontSize="11px"
                color="#475569"
                fontWeight={500}
                noOfLines={1}
              >
                {label}
              </Text>
            </Flex>
          ))}
        </Grid>
      </Box>

      {/* Question palette */}
      <Box
        px={4}
        py={4}
        flex={1}
        overflowY="auto"
        css={{
          "&::-webkit-scrollbar": { width: "3px" },
          "&::-webkit-scrollbar-thumb": {
            background: "#e2e8f0",
            borderRadius: "4px",
          },
        }}
      >
        <Text
          fontSize="10px"
          fontWeight={800}
          color="#94a3b8"
          textTransform="uppercase"
          letterSpacing="1px"
          mb={3}
        >
          Questions
        </Text>

        {isSectioned && sectionBounds.length > 0 ? (
          sectionBounds.map((sec) => (
            <Box key={sec.sectionIdx} mb={4}>
              <Flex align="center" gap={1.5} mb={2}>
                <Icon as={FaLayerGroup} fontSize="9px" color="#2563eb" />
                <Text
                  fontSize="10px"
                  fontWeight={700}
                  color="#2563eb"
                  textTransform="capitalize"
                >
                  {sec.name}
                </Text>
              </Flex>
              <Grid templateColumns="repeat(5, 1fr)" gap={2}>
                {Array.from({ length: sec.count }, (_, i) => {
                  const flatIdx = sec.start + i;
                  const st = getStatus(flatIdx, sa);
                  const cfg = STATUS_MAP[st];
                  const active = flatIdx === current;
                  return (
                    <Center
                      key={flatIdx}
                      h="34px"
                      borderRadius="6px"
                      cursor="pointer"
                      fontSize="11px"
                      fontWeight={800}
                      bg={active ? "#0f172a" : cfg.cell}
                      color="white"
                      opacity={!active && st === "notVisited" ? 0.35 : 1}
                      border={
                        active ? "2px solid #3b82f6" : "2px solid transparent"
                      }
                      boxShadow={
                        active ? "0 0 0 3px rgba(59,130,246,.2)" : "none"
                      }
                      transition="all .12s"
                      _hover={{ opacity: 1, transform: "scale(1.08)" }}
                      onClick={() => {
                        setCurrent(flatIdx);
                        if (onClose) onClose();
                      }}
                    >
                      {i + 1}
                    </Center>
                  );
                })}
              </Grid>
            </Box>
          ))
        ) : (
          <Grid templateColumns="repeat(5, 1fr)" gap={2}>
            {questions.map((_, i) => {
              const st = getStatus(i, sa);
              const cfg = STATUS_MAP[st];
              const active = i === current;
              return (
                <Center
                  key={i}
                  h="34px"
                  borderRadius="6px"
                  cursor="pointer"
                  fontSize="11px"
                  fontWeight={800}
                  bg={active ? "#0f172a" : cfg.cell}
                  color="white"
                  opacity={!active && st === "notVisited" ? 0.35 : 1}
                  border={
                    active ? "2px solid #3b82f6" : "2px solid transparent"
                  }
                  boxShadow={active ? "0 0 0 3px rgba(59,130,246,.2)" : "none"}
                  transition="all .12s"
                  _hover={{ opacity: 1, transform: "scale(1.08)" }}
                  onClick={() => {
                    setCurrent(i);
                    if (onClose) onClose();
                  }}
                >
                  {i + 1}
                </Center>
              );
            })}
          </Grid>
        )}
      </Box>
    </Flex>
  );
}

// ── Question card ─────────────────────────────────────────────────────────────
function QuestionCard({
  question,
  index,
  allAnswers,
  sa,
  questionTimes,
  sectionLabel,
}) {
  if (!question) return null;

  const st = getStatus(index, sa);
  const cfg = STATUS_MAP[st];
  const uid = allAnswers[index] ?? allAnswers[String(index)];
  const cid =
    typeof question.answer === "number" ? question.answer : question.answer - 1;
  const timeStr = fmtTime(
    questionTimes?.[index] ?? questionTimes?.[String(index)] ?? null,
  );

  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid #e5e7eb"
      overflow="hidden"
      boxShadow="0 1px 8px rgba(0,0,0,.05)"
    >
      <Box h="3px" bg={cfg.cell} />

      <Flex
        align="center"
        justify="space-between"
        px={{ base: 4, md: 5 }}
        py={3}
        borderBottom="1px solid #f3f4f6"
      >
        <Flex align="center" gap={2.5}>
          <Center
            w="28px"
            h="28px"
            borderRadius="6px"
            bg={cfg.bg}
            border={`1px solid ${cfg.border}`}
            flexShrink={0}
          >
            <Text fontSize="12px" fontWeight={900} color={cfg.color}>
              {index + 1}
            </Text>
          </Center>
          <Flex
            align="center"
            gap={1.5}
            px={2.5}
            py="4px"
            borderRadius="20px"
            bg={cfg.bg}
            border={`1px solid ${cfg.border}`}
          >
            <Icon as={cfg.icon} fontSize="10px" color={cfg.color} />
            <Text fontSize="11px" fontWeight={700} color={cfg.color}>
              {cfg.label}
            </Text>
          </Flex>
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

        {timeStr && (
          <Flex
            align="center"
            gap={1.5}
            px={2.5}
            py="4px"
            borderRadius="20px"
            bg="#f9fafb"
            border="1px solid #e5e7eb"
          >
            <Icon as={FaStopwatch} fontSize="9px" color="#6b7280" />
            <Text fontSize="11px" fontWeight={700} color="#374151">
              {timeStr}
            </Text>
          </Flex>
        )}
      </Flex>

      <Box px={{ base: 4, md: 5 }} pt={4} pb={5}>
        <Text
          fontSize={{ base: "15px", md: "16px" }}
          fontWeight={600}
          color="#0f172a"
          lineHeight="1.8"
          mb={4}
        >
          {question.qus}
        </Text>

        <VStack spacing={2} align="stretch" mb={4}>
          {question.options?.map((opt, i) => {
            const isC = i === cid,
              isU = uid === i,
              isW = isU && !isC;
            return (
              <Flex
                key={i}
                align="center"
                gap={3}
                px={4}
                py={3}
                borderRadius="8px"
                border="1.5px solid"
                borderColor={isC ? "#86efac" : isW ? "#fca5a5" : "#e5e7eb"}
                bg={isC ? "#f0fdf4" : isW ? "#fef2f2" : "#fafafa"}
              >
                <Center
                  w="28px"
                  h="28px"
                  borderRadius="6px"
                  flexShrink={0}
                  fontSize="11px"
                  fontWeight={900}
                  bg={isC ? "#16a34a" : isW ? "#ef4444" : "#f3f4f6"}
                  color={isC || isW ? "white" : "#6b7280"}
                >
                  {isC ? (
                    <Icon as={FaCheckCircle} fontSize="12px" />
                  ) : isW ? (
                    <Icon as={FaTimesCircle} fontSize="12px" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </Center>
                <Text
                  flex={1}
                  fontSize="14px"
                  color={isC ? "#15803d" : isW ? "#b91c1c" : "#374151"}
                  fontWeight={isC || isU ? 600 : 400}
                  lineHeight="1.5"
                >
                  {opt}
                </Text>
                <Flex gap={1.5} flexShrink={0}>
                  {isC && (
                    <Box
                      px={2}
                      py="2px"
                      borderRadius="4px"
                      fontSize="10px"
                      fontWeight={700}
                      bg="#dcfce7"
                      color="#15803d"
                      border="1px solid #bbf7d0"
                    >
                      ✓ Correct
                    </Box>
                  )}
                  {isU && isC && (
                    <Box
                      px={2}
                      py="2px"
                      borderRadius="4px"
                      fontSize="10px"
                      fontWeight={700}
                      bg="#dbeafe"
                      color="#1d4ed8"
                      border="1px solid #bfdbfe"
                    >
                      Your Answer
                    </Box>
                  )}
                  {isW && (
                    <Box
                      px={2}
                      py="2px"
                      borderRadius="4px"
                      fontSize="10px"
                      fontWeight={700}
                      bg="#fee2e2"
                      color="#b91c1c"
                      border="1px solid #fecaca"
                    >
                      ✗ Your Answer
                    </Box>
                  )}
                </Flex>
              </Flex>
            );
          })}
        </VStack>

        <Flex
          bg="#f9fafb"
          borderRadius="8px"
          border="1px solid #f3f4f6"
          overflow="hidden"
          mb={question.explanation ? 3 : 0}
        >
          <Box flex={1} px={4} py={3} borderRight="1px solid #f3f4f6">
            <Text
              fontSize="10px"
              color="#9ca3af"
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing=".7px"
              mb={1}
            >
              Your Answer
            </Text>
            <Text
              fontSize="14px"
              fontWeight={700}
              color={
                st === "correct"
                  ? "#15803d"
                  : st === "incorrect"
                    ? "#b91c1c"
                    : "#9ca3af"
              }
            >
              {uid !== undefined && uid !== null
                ? question.options?.[uid] || "—"
                : "Not Attempted"}
            </Text>
          </Box>
          <Box flex={1} px={4} py={3}>
            <Text
              fontSize="10px"
              color="#9ca3af"
              fontWeight={700}
              textTransform="uppercase"
              letterSpacing=".7px"
              mb={1}
            >
              Correct Answer
            </Text>
            <Text fontSize="14px" fontWeight={700} color="#15803d">
              {question.options?.[cid] || "—"}
            </Text>
          </Box>
        </Flex>

        {question.explanation && (
          <Box
            p={4}
            bg="#eff6ff"
            borderRadius="8px"
            borderLeft="3px solid #3b82f6"
          >
            <Flex align="center" gap={2} mb={1.5}>
              <Icon as={FiAlertCircle} color="#3b82f6" fontSize="13px" />
              <Text
                fontSize="10px"
                fontWeight={800}
                color="#1e40af"
                textTransform="uppercase"
                letterSpacing=".7px"
              >
                Explanation
              </Text>
            </Flex>
            <Text fontSize="13px" color="#1e3a5f" lineHeight="1.75">
              {question.explanation}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ReviewTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLg] = useMediaQuery("(min-width: 1024px)");

  const d = location.state || {};
  const questions = d.questions || [];
  const allAnswers = d.allAnswers || {};
  const questionTimes = d.questionTimes || {};
  const testTitle = d.testTitle || "Test Review";
  const isSectioned = d.isSectioned === true;
  const sectionMeta = Array.isArray(d.sectionMeta) ? d.sectionMeta : [];

  const sa = {
    correctQus: d.correctQus || [],
    wrongansqus: d.wrongansqus || [],
    answeredQuestion: d.answeredQuestion || [],
    notAnswer: d.notAnswer || [],
    markedAndAnswer: d.markedAndAnswer || [],
    markedNotAnswer: d.markedNotAnswer || [],
  };

  const [cur, setCur] = useState(0);

  // Build section label map for question cards
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

  // Build section boundaries for navigation
  const sectionBounds = React.useMemo(() => {
    if (!isSectioned || !sectionMeta.length) return [];
    let offset = 0;
    return sectionMeta.map((sec, sIdx) => {
      const count = sec.count || 0;
      const bound = {
        sectionIdx: sIdx,
        name: sec.name || sec.subject || `Section ${sIdx + 1}`,
        start: offset,
        end: offset + count - 1,
      };
      offset += count;
      return bound;
    });
  }, [isSectioned, sectionMeta]);

  const currentSection = sectionBounds.find(
    (s) => cur >= s.start && cur <= s.end,
  );

  // Sliding dot window
  const HALF = 3;
  let start = Math.max(0, cur - HALF);
  let end = Math.min(questions.length - 1, start + 6);
  if (end - start < 6) start = Math.max(0, end - 6);
  const dots = [];
  for (let i = start; i <= end; i++) dots.push(i);

  if (!questions.length) {
    return (
      <Flex
        minH="100vh"
        align="center"
        justify="center"
        direction="column"
        gap={3}
        bg="#f9fafb"
        fontFamily="'DM Sans',sans-serif"
      >
        <Icon as={FaChartBar} fontSize="44px" color="#d1d5db" />
        <Text fontSize="17px" fontWeight={700} color="#111827">
          No review data
        </Text>
        <Button
          onClick={() => navigate(-1)}
          bg="#111827"
          color="white"
          borderRadius="8px"
          fontWeight={700}
          h="42px"
          px={5}
          mt={1}
          _hover={{ bg: "#1f2937" }}
        >
          Go Back
        </Button>
      </Flex>
    );
  }

  const curSt = getStatus(cur, sa);
  const curCfg = STATUS_MAP[curSt];
  const HDR = { base: "54px", md: "60px" };

  return (
    <Box bg="#f3f4f6" minH="100vh" fontFamily="'DM Sans',sans-serif">
      {/* Header */}
      <Box
        bg="linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%)"
        boxShadow="0 1px 12px rgba(0,0,0,.3)"
        position="sticky"
        top={0}
        zIndex={50}
      >
        <Flex
          px={{ base: 4, md: 6, lg: 8 }}
          h={HDR}
          align="center"
          justify="space-between"
        >
          <Flex align="center" gap={3} flex={1} minW={0}>
            <Center
              w="32px"
              h="32px"
              borderRadius="8px"
              flexShrink={0}
              bg="rgba(255,255,255,.08)"
              border="1px solid rgba(255,255,255,.12)"
              cursor="pointer"
              onClick={() => navigate(-1)}
              _hover={{ bg: "rgba(255,255,255,.15)" }}
              transition="background .15s"
            >
              <Icon
                as={FaArrowLeft}
                color="rgba(255,255,255,.8)"
                fontSize="12px"
              />
            </Center>
            <Box minW={0}>
              <Text
                fontSize={{ base: "13px", md: "15px" }}
                fontWeight={800}
                color="white"
                noOfLines={1}
              >
                {testTitle}
              </Text>
              <Flex align="center" gap={2}>
                <Text
                  fontSize="10px"
                  color="rgba(255,255,255,.4)"
                  fontWeight={600}
                  textTransform="uppercase"
                  letterSpacing=".8px"
                >
                  Review Mode
                </Text>
                {isSectioned && currentSection && (
                  <Flex
                    align="center"
                    gap={1}
                    bg="rgba(56,189,248,.2)"
                    color="#38bdf8"
                    px={2}
                    py="1px"
                    borderRadius="full"
                    fontSize="9px"
                    fontWeight={700}
                  >
                    <Icon as={FaLayerGroup} fontSize="8px" />
                    {currentSection.name}
                  </Flex>
                )}
              </Flex>
            </Box>
          </Flex>

          {/* Section tabs in header for sectioned tests */}
          {isSectioned && sectionBounds.length > 0 && (
            <Flex gap={1} display={{ base: "none", md: "flex" }}>
              {sectionBounds.map((sec) => {
                const isActive = currentSection?.sectionIdx === sec.sectionIdx;
                return (
                  <Box
                    key={sec.sectionIdx}
                    as="button"
                    onClick={() => setCur(sec.start)}
                    px={2}
                    py="3px"
                    borderRadius="6px"
                    fontSize="10px"
                    fontWeight={700}
                    bg={
                      isActive
                        ? "rgba(56,189,248,.25)"
                        : "rgba(255,255,255,.08)"
                    }
                    color={isActive ? "#38bdf8" : "rgba(255,255,255,.5)"}
                    border={
                      isActive
                        ? "1px solid rgba(56,189,248,.4)"
                        : "1px solid rgba(255,255,255,.1)"
                    }
                    _hover={{ bg: "rgba(255,255,255,.15)" }}
                    transition="all .12s"
                    textTransform="capitalize"
                  >
                    {sec.name}
                  </Box>
                );
              })}
            </Flex>
          )}

          <Box
            px={4}
            py="6px"
            borderRadius="8px"
            flexShrink={0}
            bg="rgba(255,255,255,.08)"
            border="1px solid rgba(255,255,255,.12)"
          >
            <Text
              fontSize="14px"
              fontWeight={900}
              color="white"
              letterSpacing="1.5px"
              fontFamily="'JetBrains Mono',monospace"
            >
              {String(cur + 1).padStart(2, "0")}/
              {String(questions.length).padStart(2, "0")}
            </Text>
          </Box>

          {!isLg && (
            <Center
              w="32px"
              h="32px"
              borderRadius="8px"
              flexShrink={0}
              ml={3}
              bg="rgba(255,255,255,.08)"
              border="1px solid rgba(255,255,255,.12)"
              cursor="pointer"
              onClick={onOpen}
              _hover={{ bg: "rgba(255,255,255,.15)" }}
              transition="background .15s"
            >
              <Icon as={FaBars} color="rgba(255,255,255,.8)" fontSize="12px" />
            </Center>
          )}
        </Flex>
      </Box>

      <Flex>
        {isLg && (
          <Box
            w="240px"
            flexShrink={0}
            bg="white"
            borderRight="1px solid #e5e7eb"
            position="sticky"
            top={HDR.md || "60px"}
            h="calc(100vh - 60px)"
            overflowY="auto"
            css={{
              "&::-webkit-scrollbar": { width: "3px" },
              "&::-webkit-scrollbar-thumb": {
                background: "#e5e7eb",
                borderRadius: "4px",
              },
            }}
          >
            <Sidebar
              questions={questions}
              current={cur}
              setCurrent={setCur}
              sa={sa}
              isSectioned={isSectioned}
              sectionMeta={sectionMeta}
            />
          </Box>
        )}

        {!isLg && (
          <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
            <DrawerOverlay backdropFilter="blur(3px)" bg="rgba(0,0,0,.3)" />
            <DrawerContent bg="white" maxW="260px">
              <DrawerCloseButton top={3} right={3} color="#374151" />
              <DrawerBody p={0} pt={10}>
                <Sidebar
                  questions={questions}
                  current={cur}
                  setCurrent={setCur}
                  sa={sa}
                  onClose={onClose}
                  isSectioned={isSectioned}
                  sectionMeta={sectionMeta}
                />
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        )}

        <Box flex={1} minW={0}>
          {/* Sticky sub-header */}
          <Flex
            px={{ base: 4, md: 6, lg: 8 }}
            py={3}
            bg="white"
            borderBottom="1px solid #e5e7eb"
            align="center"
            gap={3}
            position="sticky"
            top={HDR}
            zIndex={40}
          >
            <Box px={3} py="5px" borderRadius="6px" bg="#0f172a">
              <Text
                fontSize="11px"
                fontWeight={800}
                color="white"
                letterSpacing=".3px"
              >
                Q {cur + 1} / {questions.length}
              </Text>
            </Box>
            <Flex
              align="center"
              gap={1.5}
              px={2.5}
              py="4px"
              borderRadius="20px"
              bg={curCfg.bg}
              border={`1px solid ${curCfg.border}`}
            >
              <Icon as={curCfg.icon} fontSize="10px" color={curCfg.color} />
              <Text fontSize="11px" fontWeight={700} color={curCfg.color}>
                {curCfg.label}
              </Text>
            </Flex>
            {isSectioned && currentSection && (
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
                {currentSection.name}
              </Flex>
            )}
          </Flex>

          {/* Question card */}
          <Box px={{ base: 3, md: 5, lg: 8 }} pt={5} pb={4}>
            <QuestionCard
              question={questions[cur]}
              index={cur}
              allAnswers={allAnswers}
              sa={sa}
              questionTimes={questionTimes}
              sectionLabel={isSectioned ? sectionLabelMap[cur] : null}
            />
          </Box>

          {/* Bottom nav */}
          <Box px={{ base: 3, md: 5, lg: 8 }} pb={8}>
            <Flex
              align="center"
              justify="space-between"
              gap={3}
              bg="white"
              borderRadius="10px"
              border="1px solid #e5e7eb"
              px={3}
              py={2.5}
              boxShadow="0 1px 6px rgba(0,0,0,.04)"
            >
              <Button
                leftIcon={<Icon as={FaArrowLeft} fontSize="10px" />}
                isDisabled={cur === 0}
                onClick={() => setCur((c) => Math.max(0, c - 1))}
                bg="#f3f4f6"
                color="#374151"
                borderRadius="8px"
                fontWeight={700}
                fontSize="13px"
                h="38px"
                px={4}
                border="1px solid #e5e7eb"
                _hover={{ bg: "#e9eaec" }}
                _disabled={{ opacity: 0.35 }}
                transition="all .12s"
              >
                Prev
              </Button>

              <Flex align="center" gap={1.5} flex={1} justify="center">
                {dots.map((i) => {
                  const s = getStatus(i, sa);
                  const c = STATUS_MAP[s];
                  const active = i === cur;
                  // Section boundary marker
                  const isSecStart =
                    isSectioned &&
                    sectionBounds.some((sb) => sb.start === i && i !== 0);
                  return (
                    <React.Fragment key={i}>
                      {isSecStart && (
                        <Box w="1px" h="20px" bg="#e2e8f0" flexShrink={0} />
                      )}
                      <Center
                        w="28px"
                        h="28px"
                        borderRadius="6px"
                        cursor="pointer"
                        fontSize="10px"
                        fontWeight={800}
                        bg={active ? "#0f172a" : c.cell}
                        color="white"
                        opacity={!active && s === "notVisited" ? 0.3 : 1}
                        border={
                          active ? "2px solid #3b82f6" : "2px solid transparent"
                        }
                        boxShadow={
                          active ? "0 0 0 2px rgba(59,130,246,.2)" : "none"
                        }
                        onClick={() => setCur(i)}
                        transition="all .12s"
                        _hover={{ transform: "scale(1.1)", opacity: 1 }}
                      >
                        {i + 1}
                      </Center>
                    </React.Fragment>
                  );
                })}
              </Flex>

              <Button
                rightIcon={<Icon as={FaArrowRight} fontSize="10px" />}
                isDisabled={cur === questions.length - 1}
                onClick={() =>
                  setCur((c) => Math.min(questions.length - 1, c + 1))
                }
                bg="#0f172a"
                color="white"
                borderRadius="8px"
                fontWeight={700}
                fontSize="13px"
                h="38px"
                px={4}
                _hover={{
                  bg: "#1e293b",
                  boxShadow: "0 3px 10px rgba(0,0,0,.2)",
                }}
                _disabled={{ opacity: 0.35 }}
                transition="all .12s"
              >
                Next
              </Button>
            </Flex>

            {/* Section jump bar (mobile) */}
            {isSectioned && sectionBounds.length > 0 && (
              <Flex gap={2} mt={3} justify="center" flexWrap="wrap">
                {sectionBounds.map((sec) => {
                  const isActive =
                    currentSection?.sectionIdx === sec.sectionIdx;
                  return (
                    <Box
                      key={sec.sectionIdx}
                      as="button"
                      onClick={() => setCur(sec.start)}
                      px={3}
                      py="5px"
                      borderRadius="8px"
                      fontSize="11px"
                      fontWeight={700}
                      bg={isActive ? "#0f172a" : "#f3f4f6"}
                      color={isActive ? "white" : "#374151"}
                      border={isActive ? "none" : "1px solid #e5e7eb"}
                      _hover={{ bg: isActive ? "#1e293b" : "#e9eaec" }}
                      transition="all .12s"
                      textTransform="capitalize"
                    >
                      {sec.name}
                    </Box>
                  );
                })}
              </Flex>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}