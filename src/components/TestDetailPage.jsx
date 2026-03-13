// import React, { useEffect, useState, useRef, useCallback } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Button,
//   Icon,
//   Spinner,
//   Badge,
//   Progress,
//   Avatar,
//   useToast,
//   AlertDialog,
//   AlertDialogOverlay,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogBody,
//   AlertDialogFooter,
//   Input,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   ModalFooter,
//   Grid,
// } from "@chakra-ui/react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import {
//   FaArrowLeft,
//   FaClock,
//   FaUsers,
//   FaLock,
//   FaUnlock,
//   FaTrophy,
//   FaCheckCircle,
//   FaClipboardList,
//   FaLink,
//   FaCheck,
//   FaChartBar,
//   FaPlay,
//   FaBookOpen,
//   FaCrown,
//   FaFire,
//   FaGlobe,
//   FaInfoCircle,
//   FaShieldAlt,
// } from "react-icons/fa";
// import { apiFetch } from "../services/api";
// import { useAuth } from "../context/AuthContext";

// // ─── Stat Card ────────────────────────────────────────────────────
// function StatCard({ icon, label, value, color = "#4a72b8", bg = "#eff6ff" }) {
//   return (
//     <Box bg={bg} borderRadius="14px" p={5} flex={1} minW="120px">
//       <Flex align="center" gap={2} mb={2}>
//         <Flex
//           w="32px"
//           h="32px"
//           bg="white"
//           borderRadius="9px"
//           align="center"
//           justify="center"
//           boxShadow="0 2px 8px rgba(0,0,0,.08)"
//         >
//           <Icon as={icon} color={color} fontSize="14px" />
//         </Flex>
//         <Text
//           fontSize="11px"
//           fontWeight={700}
//           color="#94a3b8"
//           textTransform="uppercase"
//           letterSpacing=".8px"
//         >
//           {label}
//         </Text>
//       </Flex>
//       <Text
//         fontSize="28px"
//         fontWeight={800}
//         color="#0f172a"
//         letterSpacing="-1px"
//       >
//         {value}
//       </Text>
//     </Box>
//   );
// }

// // ─── Leaderboard Row ──────────────────────────────────────────────
// function LeaderRow({ rank, result, currentUserId }) {
//   const name = result.studentId?.Name || result.studentId?.Email || "Student";
//   const pct = result.scorePercentage ?? result.percentage ?? 0;
//   const isMe = String(result.studentId?._id) === String(currentUserId);
//   const medals = ["🥇", "🥈", "🥉"];
//   return (
//     <Flex
//       px={5}
//       py={3}
//       align="center"
//       gap={3}
//       bg={isMe ? "linear-gradient(90deg,#eff6ff,#f0fdf4)" : "transparent"}
//       borderLeft={isMe ? "3px solid #4a72b8" : "3px solid transparent"}
//       _hover={{ bg: "#f8fafc" }}
//     >
//       <Text w="28px" fontSize="15px" textAlign="center">
//         {rank <= 3 ? (
//           medals[rank - 1]
//         ) : (
//           <Text as="span" fontSize="13px" fontWeight={700} color="#94a3b8">
//             {rank}
//           </Text>
//         )}
//       </Text>
//       <Avatar
//         size="sm"
//         name={name}
//         bg="#4a72b8"
//         color="white"
//         fontSize="12px"
//       />
//       <Box flex={1} minW={0}>
//         <Text fontSize="13px" fontWeight={700} color="#0f172a" noOfLines={1}>
//           {name}{" "}
//           {isMe && (
//             <Badge colorScheme="blue" fontSize="9px" ml={1}>
//               You
//             </Badge>
//           )}
//         </Text>
//         <Progress
//           value={pct}
//           size="xs"
//           colorScheme="blue"
//           borderRadius="full"
//           mt={1}
//         />
//       </Box>
//       <Box textAlign="right">
//         <Text
//           fontSize="15px"
//           fontWeight={800}
//           color={pct >= 60 ? "#16a34a" : "#dc2626"}
//         >
//           {pct.toFixed(0)}%
//         </Text>
//         <Text fontSize="10px" color="#94a3b8">
//           {result.timeTakenSec
//             ? `${Math.floor(result.timeTakenSec / 60)}m`
//             : "—"}
//         </Text>
//       </Box>
//     </Flex>
//   );
// }

// // ─── Test Info / Landing Page ─────────────────────────────────────
// function TestInfoPage({ test, stats, onStart, user, myResult }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const timeLimitMin = test.timeLimitMin || test.timeLimit || 30;
//   const isPrivate =
//     test.visibility === "private" || test.accessType === "private";
//   const questionCount = test.questions?.length || 0;

//   const RULES = [
//     "Do not switch tabs or windows during the test",
//     "Test will auto-submit when time runs out",
//     "You can mark questions for review and come back",
//     "Each question carries equal marks",
//     "There is no negative marking",
//   ];

//   return (
//     <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
//       <Box
//         bg="linear-gradient(135deg,#0f1e3a 0%,#1e3a5f 50%,#2d5fa8 100%)"
//         px={{ base: 4, md: 8 }}
//         pt={{ base: 10, md: 14 }}
//         pb={{ base: 14, md: 20 }}
//         position="relative"
//         overflow="hidden"
//       >
//         <Box
//           position="absolute"
//           right="-80px"
//           top="-80px"
//           w="300px"
//           h="300px"
//           borderRadius="full"
//           bg="rgba(255,255,255,.03)"
//         />
//         <Box maxW="800px" mx="auto" position="relative" zIndex={1}>
//           <Flex
//             align="center"
//             gap={2}
//             mb={8}
//             cursor="pointer"
//             w="fit-content"
//             color="rgba(255,255,255,.5)"
//             _hover={{ color: "rgba(255,255,255,.9)" }}
//             onClick={() => navigate(-1)}
//           >
//             <Icon as={FaArrowLeft} fontSize="12px" />
//             <Text fontSize="13px" fontWeight={600}>
//               Back
//             </Text>
//           </Flex>

//           <Flex align="center" gap={3} mb={3} flexWrap="wrap">
//             <Flex
//               w="64px"
//               h="64px"
//               bg="rgba(255,255,255,.12)"
//               border="2px solid rgba(255,255,255,.2)"
//               borderRadius="18px"
//               align="center"
//               justify="center"
//               fontSize="28px"
//               flexShrink={0}
//             >
//               📋
//             </Flex>
//             <Box flex={1}>
//               <Text
//                 fontSize={{ base: "22px", md: "36px" }}
//                 fontWeight={800}
//                 color="white"
//                 letterSpacing="-1px"
//                 lineHeight="1.1"
//               >
//                 {test.title}
//               </Text>
//               {test.examType && (
//                 <Badge
//                   mt={2}
//                   px={3}
//                   py={1}
//                   borderRadius="full"
//                   bg="rgba(255,255,255,.15)"
//                   color="white"
//                   fontSize="12px"
//                   fontWeight={700}
//                 >
//                   {test.examType}
//                 </Badge>
//               )}
//             </Box>
//           </Flex>

//           <Flex
//             gap={8}
//             mt={8}
//             borderTop="1px solid rgba(255,255,255,.1)"
//             pt={8}
//             flexWrap="wrap"
//           >
//             {[
//               { icon: FaClipboardList, v: questionCount, l: "Questions" },
//               { icon: FaClock, v: `${timeLimitMin} min`, l: "Duration" },
//               { icon: FaUsers, v: stats?.totalAttempts ?? 0, l: "Attempts" },
//               {
//                 icon: FaChartBar,
//                 v: stats ? `${stats.avgPercentage}%` : "—",
//                 l: "Avg Score",
//               },
//             ].map((s) => (
//               <Flex key={s.l} align="center" gap={3}>
//                 <Icon
//                   as={s.icon}
//                   fontSize="14px"
//                   color="rgba(255,255,255,.4)"
//                 />
//                 <Box>
//                   <Text
//                     fontSize="22px"
//                     fontWeight={800}
//                     color="white"
//                     lineHeight="1"
//                     letterSpacing="-1px"
//                   >
//                     {s.v}
//                   </Text>
//                   <Text
//                     fontSize="10px"
//                     color="rgba(255,255,255,.5)"
//                     textTransform="uppercase"
//                     letterSpacing=".8px"
//                   >
//                     {s.l}
//                   </Text>
//                 </Box>
//               </Flex>
//             ))}
//           </Flex>
//         </Box>
//       </Box>

//       <Box maxW="800px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
//         <Grid templateColumns={{ base: "1fr", md: "1fr 340px" }} gap={6}>
//           <Box>
//             <Box
//               bg="white"
//               borderRadius="16px"
//               border="1px solid #e2e8f0"
//               p={6}
//               mb={5}
//             >
//               <Flex align="center" gap={2} mb={4}>
//                 <Icon as={FaInfoCircle} color="#4a72b8" />
//                 <Text fontSize="15px" fontWeight={800} color="#0f172a">
//                   Test Details
//                 </Text>
//               </Flex>
//               <Grid templateColumns="1fr 1fr" gap={4}>
//                 {[
//                   { label: "Questions", value: questionCount },
//                   { label: "Duration", value: `${timeLimitMin} minutes` },
//                   { label: "Language", value: test.language || "English" },
//                   {
//                     label: "Subject",
//                     value: test.subject
//                       ? test.subject.charAt(0).toUpperCase() +
//                         test.subject.slice(1)
//                       : "General",
//                   },
//                   { label: "Exam Type", value: test.examType || "General" },
//                   {
//                     label: "Access",
//                     value: isPrivate ? "🔒 Private" : "🌐 Public",
//                   },
//                   { label: "Marks", value: `${questionCount} marks` },
//                   { label: "Pass Mark", value: "40%" },
//                 ].map(({ label, value }) => (
//                   <Box key={label}>
//                     <Text
//                       fontSize="11px"
//                       fontWeight={700}
//                       color="#94a3b8"
//                       textTransform="uppercase"
//                       letterSpacing=".8px"
//                       mb={1}
//                     >
//                       {label}
//                     </Text>
//                     <Text fontSize="14px" fontWeight={600} color="#0f172a">
//                       {value}
//                     </Text>
//                   </Box>
//                 ))}
//               </Grid>
//             </Box>

//             <Box
//               bg="white"
//               borderRadius="16px"
//               border="1px solid #e2e8f0"
//               p={6}
//             >
//               <Flex align="center" gap={2} mb={4}>
//                 <Icon as={FaShieldAlt} color="#4a72b8" />
//                 <Text fontSize="15px" fontWeight={800} color="#0f172a">
//                   Instructions
//                 </Text>
//               </Flex>
//               <Box bg="#f0f7ff" borderRadius="10px" p={4}>
//                 {RULES.map((rule, i) => (
//                   <Flex
//                     key={i}
//                     gap={3}
//                     mb={i < RULES.length - 1 ? 3 : 0}
//                     align="flex-start"
//                   >
//                     <Flex
//                       w="20px"
//                       h="20px"
//                       bg="#4a72b8"
//                       borderRadius="full"
//                       align="center"
//                       justify="center"
//                       flexShrink={0}
//                       mt="1px"
//                     >
//                       <Text fontSize="10px" fontWeight={800} color="white">
//                         {i + 1}
//                       </Text>
//                     </Flex>
//                     <Text fontSize="13px" color="#374151" lineHeight="1.5">
//                       {rule}
//                     </Text>
//                   </Flex>
//                 ))}
//               </Box>
//             </Box>
//           </Box>

//           <Box>
//             <Box
//               bg="white"
//               borderRadius="16px"
//               border="1px solid #e2e8f0"
//               p={6}
//               textAlign="center"
//               position={{ md: "sticky" }}
//               top={{ md: "20px" }}
//               boxShadow="0 4px 24px rgba(0,0,0,.06)"
//             >
//               {myResult ? (
//                 <Box
//                   mb={4}
//                   p={3}
//                   bg="#f0fdf4"
//                   borderRadius="10px"
//                   border="1px solid #86efac"
//                 >
//                   <Text fontSize="12px" fontWeight={700} color="#16a34a" mb={1}>
//                     Previous Attempt
//                   </Text>
//                   <Text
//                     fontSize="28px"
//                     fontWeight={800}
//                     color="#16a34a"
//                     letterSpacing="-1px"
//                   >
//                     {(
//                       myResult.scorePercentage ??
//                       myResult.percentage ??
//                       0
//                     ).toFixed(0)}
//                     %
//                   </Text>
//                   <Text fontSize="12px" color="#64748b">
//                     {myResult.correct ?? myResult.correctQus?.length ?? 0}/
//                     {questionCount} correct
//                   </Text>
//                 </Box>
//               ) : (
//                 <Box mb={5}>
//                   <Box fontSize="48px" mb={3}>
//                     🎯
//                   </Box>
//                   <Text fontSize="16px" fontWeight={700} color="#0f172a" mb={1}>
//                     Ready to begin?
//                   </Text>
//                   <Text fontSize="13px" color="#64748b">
//                     {questionCount} questions · {timeLimitMin} min time limit
//                   </Text>
//                 </Box>
//               )}

//               {!user ? (
//                 <>
//                   <Text fontSize="13px" color="#64748b" mb={4}>
//                     Please sign in to take this test
//                   </Text>
//                   <Button
//                     w="full"
//                     h="50px"
//                     borderRadius="12px"
//                     bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
//                     color="white"
//                     fontWeight={800}
//                     fontSize="15px"
//                     leftIcon={<FaPlay />}
//                     onClick={onStart}
//                     _hover={{
//                       opacity: 0.9,
//                       transform: "translateY(-2px)",
//                       boxShadow: "0 8px 24px rgba(74,114,184,.35)",
//                     }}
//                     transition="all .2s"
//                     mb={3}
//                   >
//                     Sign In to Start
//                   </Button>
//                   <Button
//                     w="full"
//                     h="42px"
//                     borderRadius="12px"
//                     variant="outline"
//                     borderColor="#4a72b8"
//                     color="#4a72b8"
//                     fontWeight={700}
//                     fontSize="14px"
//                     onClick={() => {
//                       const returnPath = location.pathname + location.search;
//                       navigate(
//                         `/auth/signup?redirect=${encodeURIComponent(returnPath)}`,
//                       );
//                     }}
//                     _hover={{ bg: "#eff6ff" }}
//                   >
//                     Create Account
//                   </Button>
//                 </>
//               ) : (
//                 <Button
//                   w="full"
//                   h="54px"
//                   borderRadius="12px"
//                   bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
//                   color="white"
//                   fontWeight={800}
//                   fontSize="16px"
//                   leftIcon={<FaPlay />}
//                   onClick={onStart}
//                   _hover={{
//                     opacity: 0.9,
//                     transform: "translateY(-2px)",
//                     boxShadow: "0 8px 24px rgba(74,114,184,.35)",
//                   }}
//                   transition="all .2s"
//                 >
//                   {myResult ? "Retake Test" : "Start Test"}
//                 </Button>
//               )}

//               {user && (
//                 <Text fontSize="11px" color="#94a3b8" mt={3}>
//                   Logged in as {user.Name || user.Email}
//                 </Text>
//               )}
//             </Box>

//             {stats && stats.totalAttempts > 0 && (
//               <Box
//                 bg="white"
//                 borderRadius="16px"
//                 border="1px solid #e2e8f0"
//                 p={5}
//                 mt={4}
//               >
//                 <Text
//                   fontSize="12px"
//                   fontWeight={700}
//                   color="#94a3b8"
//                   textTransform="uppercase"
//                   letterSpacing=".8px"
//                   mb={4}
//                 >
//                   Test Stats
//                 </Text>
//                 {[
//                   {
//                     label: "Attempts",
//                     value: stats.totalAttempts,
//                     color: "#4a72b8",
//                   },
//                   {
//                     label: "Pass Rate",
//                     value: `${stats.passRate}%`,
//                     color: "#16a34a",
//                   },
//                   {
//                     label: "Avg Score",
//                     value: `${stats.avgPercentage}%`,
//                     color: "#7c3aed",
//                   },
//                   {
//                     label: "Top Score",
//                     value: `${stats.highestScore}%`,
//                     color: "#ea580c",
//                   },
//                 ].map(({ label, value, color }) => (
//                   <Flex
//                     key={label}
//                     justify="space-between"
//                     align="center"
//                     mb={3}
//                   >
//                     <Text fontSize="13px" color="#64748b">
//                       {label}
//                     </Text>
//                     <Text fontSize="14px" fontWeight={800} color={color}>
//                       {value}
//                     </Text>
//                   </Flex>
//                 ))}
//               </Box>
//             )}
//           </Box>
//         </Grid>
//       </Box>
//     </Box>
//   );
// }

// // ═══════════════════════════════════════════════════════
// // MAIN PAGE
// // ═══════════════════════════════════════════════════════
// export default function TestDetailPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const toast = useToast();
//   const cancelRef = useRef();
//   const { user } = useAuth();

//   const [test, setTest] = useState(null);
//   const [stats, setStats] = useState(null);
//   const [leaderboard, setLeaderboard] = useState([]);
//   const [myResult, setMyResult] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [tab, setTab] = useState("info");
//   const [copied, setCopied] = useState(false);
//   const [pwOpen, setPwOpen] = useState(false);
//   const [pwInput, setPwInput] = useState("");
//   const [pwErr, setPwErr] = useState("");
//   const [delOpen, setDelOpen] = useState(false);

//   const load = useCallback(async () => {
//     try {
//       const [testRes, statsRes, lbRes] = await Promise.all([
//         apiFetch(`/tests/id/${id}`),
//         apiFetch(`/tests/${id}/stats`).catch(() => ({ data: null })),
//         apiFetch(`/tests/${id}/leaderboard`).catch(() => ({ data: [] })),
//       ]);
//       const t = testRes.data;
//       setTest(t);
//       setStats(statsRes.data);
//       setLeaderboard(lbRes.data || []);

//       if (user?._id) {
//         apiFetch(`/results/student/me?testId=${id}`)
//           .then((r) => setMyResult(r.data?.[0] || null))
//           .catch(() => {});
//       }
//     } catch (e) {
//       toast({ title: e.message, status: "error" });
//     } finally {
//       setLoading(false);
//     }
//   }, [id, user?._id]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   if (loading)
//     return (
//       <Flex minH="80vh" align="center" justify="center">
//         <Spinner size="xl" color="#4a72b8" thickness="4px" />
//       </Flex>
//     );

//   if (!test)
//     return (
//       <Box textAlign="center" py={20} fontFamily="'Sora',sans-serif">
//         <Text fontSize="18px" fontWeight={700} color="#374151">
//           Test not found
//         </Text>
//         <Button mt={4} onClick={() => navigate(-1)}>
//           Go Back
//         </Button>
//       </Box>
//     );

//   const isOwner = Boolean(
//     user &&
//     (String(user._id) === String(test.createdBy) ||
//       String(user._id) === String(test.createdBy?._id)),
//   );
//   const isPrivate =
//     test.visibility === "private" || test.accessType === "private";
//   const timeLimitMin = test.timeLimitMin || test.timeLimit || 30;
//   const shareUrl = `${window.location.origin}/tests/${id}`;
//   const tokenUrl = test.accessToken
//     ? `${window.location.origin}/tests/token/${test.accessToken}`
//     : shareUrl;

//   const handleCopy = (url) => {
//     navigator.clipboard.writeText(url).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2500);
//     });
//   };

//   // ─── FIXED: navigate with state instead of localStorage ───────
//   const launchTest = () => {
//     if (!test.questions || test.questions.length === 0) {
//       toast({ title: "This test has no questions", status: "error" });
//       return;
//     }
//     // Pass everything the TakeTest component needs via navigation state
//     navigate("/test", {
//       state: {
//         quest: test.questions,
//         testMeta: {
//           subject: test.subject || "general",
//           category: test.examType || test.title,
//           timeLimitMin: timeLimitMin, // >0 = countdown, 0 = count-up
//           testIndex: 0,
//           testId: test._id,
//           testTitle: test.title,
//         },
//       },
//     });
//   };

//   const handleStartTest = () => {
//     if (!user) {
//       const returnPath = location.pathname + location.search;
//       navigate(`/auth/signin?redirect=${encodeURIComponent(returnPath)}`);
//       return;
//     }
//     if (isPrivate && !isOwner) {
//       setPwOpen(true);
//       return;
//     }
//     launchTest();
//   };

//   const verifyPassword = () => {
//     if (pwInput === test.password) {
//       setPwOpen(false);
//       launchTest();
//     } else {
//       setPwErr("Incorrect password");
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await apiFetch(`/tests/${id}`, { method: "DELETE" });
//       toast({ title: "Test deleted", status: "success" });
//       navigate(-1);
//     } catch (e) {
//       toast({ title: e.message, status: "error" });
//     }
//   };

//   // Non-owner: show full info/landing page
//   if (tab === "info" && !isOwner) {
//     return (
//       <>
//         <TestInfoPage
//           test={test}
//           stats={stats}
//           onStart={handleStartTest}
//           user={user}
//           myResult={myResult}
//         />
//         <Modal isOpen={pwOpen} onClose={() => setPwOpen(false)} isCentered>
//           <ModalOverlay backdropFilter="blur(4px)" />
//           <ModalContent
//             borderRadius="16px"
//             fontFamily="'Sora',sans-serif"
//             mx={4}
//           >
//             <ModalHeader>
//               <Flex align="center" gap={2}>
//                 <Icon as={FaLock} color="#4a72b8" />
//                 <Text>Enter Test Password</Text>
//               </Flex>
//             </ModalHeader>
//             <ModalCloseButton />
//             <ModalBody pb={2}>
//               <Input
//                 placeholder="Password"
//                 type="password"
//                 value={pwInput}
//                 onChange={(e) => {
//                   setPwInput(e.target.value);
//                   setPwErr("");
//                 }}
//                 onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
//                 borderColor={pwErr ? "red.400" : "#e2e8f0"}
//                 borderRadius="10px"
//                 h="44px"
//                 _focus={{
//                   borderColor: "#4a72b8",
//                   boxShadow: "0 0 0 1px #4a72b8",
//                 }}
//               />
//               {pwErr && (
//                 <Text fontSize="12px" color="red.500" mt={1}>
//                   {pwErr}
//                 </Text>
//               )}
//             </ModalBody>
//             <ModalFooter gap={3}>
//               <Button variant="ghost" onClick={() => setPwOpen(false)}>
//                 Cancel
//               </Button>
//               <Button
//                 bg="#4a72b8"
//                 color="white"
//                 borderRadius="10px"
//                 fontWeight={700}
//                 onClick={verifyPassword}
//                 _hover={{ bg: "#3b5fa0" }}
//               >
//                 Enter Test
//               </Button>
//             </ModalFooter>
//           </ModalContent>
//         </Modal>
//       </>
//     );
//   }

//   // Owner dashboard view
//   const TABS = ["overview", "leaderboard", ...(isOwner ? ["questions"] : [])];

//   return (
//     <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
//       <Box
//         bg="linear-gradient(135deg,#0f1e3a 0%,#1e3a5f 50%,#2d5fa8 100%)"
//         px={{ base: 4, md: 8 }}
//         pt={{ base: 10, md: 14 }}
//         pb={{ base: 14, md: 20 }}
//         position="relative"
//         overflow="hidden"
//       >
//         <Box
//           position="absolute"
//           right="-80px"
//           top="-80px"
//           w="300px"
//           h="300px"
//           borderRadius="full"
//           bg="rgba(255,255,255,.03)"
//         />
//         <Box maxW="1100px" mx="auto" position="relative" zIndex={1}>
//           <Flex
//             align="center"
//             gap={2}
//             mb={8}
//             cursor="pointer"
//             w="fit-content"
//             color="rgba(255,255,255,.5)"
//             _hover={{ color: "rgba(255,255,255,.9)" }}
//             onClick={() => navigate(-1)}
//           >
//             <Icon as={FaArrowLeft} fontSize="12px" />
//             <Text fontSize="13px" fontWeight={600}>
//               Back
//             </Text>
//           </Flex>

//           <Flex
//             align="flex-start"
//             gap={5}
//             flexWrap={{ base: "wrap", md: "nowrap" }}
//           >
//             <Flex
//               w={{ base: "56px", md: "72px" }}
//               h={{ base: "56px", md: "72px" }}
//               flexShrink={0}
//               bg="rgba(255,255,255,.12)"
//               border="2px solid rgba(255,255,255,.2)"
//               borderRadius="18px"
//               align="center"
//               justify="center"
//               fontSize={{ base: "24px", md: "32px" }}
//             >
//               📋
//             </Flex>
//             <Box flex={1}>
//               <Flex align="center" gap={3} flexWrap="wrap" mb={3}>
//                 <Text
//                   fontSize={{ base: "24px", md: "38px" }}
//                   fontWeight={800}
//                   color="white"
//                   letterSpacing="-1px"
//                   lineHeight="1.1"
//                 >
//                   {test.title}
//                 </Text>
//                 {isOwner && (
//                   <Flex
//                     align="center"
//                     gap={2}
//                     bg="rgba(255,215,0,.15)"
//                     border="1px solid rgba(255,215,0,.35)"
//                     px={3}
//                     py={1}
//                     borderRadius="full"
//                   >
//                     <Icon as={FaCrown} color="gold" fontSize="12px" />
//                     <Text fontSize="12px" fontWeight={700} color="gold">
//                       Your Test
//                     </Text>
//                   </Flex>
//                 )}
//               </Flex>

//               <Flex flexWrap="wrap" gap={3} mb={4}>
//                 {test.examType && (
//                   <Flex align="center" gap={1.5}>
//                     <Icon
//                       as={FaBookOpen}
//                       color="rgba(255,255,255,.5)"
//                       fontSize="12px"
//                     />
//                     <Text color="rgba(255,255,255,.75)" fontSize="13px">
//                       {test.examType}
//                     </Text>
//                   </Flex>
//                 )}
//                 <Flex align="center" gap={1.5}>
//                   <Icon
//                     as={FaClock}
//                     color="rgba(255,255,255,.5)"
//                     fontSize="12px"
//                   />
//                   <Text color="rgba(255,255,255,.75)" fontSize="13px">
//                     {timeLimitMin} min
//                   </Text>
//                 </Flex>
//                 <Flex align="center" gap={1.5}>
//                   <Icon
//                     as={FaClipboardList}
//                     color="rgba(255,255,255,.5)"
//                     fontSize="12px"
//                   />
//                   <Text color="rgba(255,255,255,.75)" fontSize="13px">
//                     {test.questions?.length || 0} Questions
//                   </Text>
//                 </Flex>
//                 <Flex align="center" gap={1.5}>
//                   <Icon
//                     as={isPrivate ? FaLock : FaUnlock}
//                     color="rgba(255,255,255,.5)"
//                     fontSize="12px"
//                   />
//                   <Text color="rgba(255,255,255,.75)" fontSize="13px">
//                     {isPrivate ? "Private" : "Public"}
//                   </Text>
//                 </Flex>
//               </Flex>

//               <Flex
//                 gap={8}
//                 borderTop="1px solid rgba(255,255,255,.1)"
//                 pt={6}
//                 flexWrap="wrap"
//               >
//                 {[
//                   {
//                     icon: FaUsers,
//                     v: stats?.totalAttempts ?? 0,
//                     l: "Attempts",
//                   },
//                   {
//                     icon: FaCheckCircle,
//                     v: stats ? `${stats.passRate}%` : "—",
//                     l: "Pass Rate",
//                   },
//                   {
//                     icon: FaChartBar,
//                     v: stats ? `${stats.avgPercentage}%` : "—",
//                     l: "Avg Score",
//                   },
//                   {
//                     icon: FaTrophy,
//                     v: stats?.highestScore ? `${stats.highestScore}%` : "—",
//                     l: "Top Score",
//                   },
//                 ].map((s) => (
//                   <Flex key={s.l} align="center" gap={3}>
//                     <Icon
//                       as={s.icon}
//                       fontSize="14px"
//                       color="rgba(255,255,255,.4)"
//                     />
//                     <Box>
//                       <Text
//                         fontSize="22px"
//                         fontWeight={800}
//                         color="white"
//                         lineHeight="1"
//                         letterSpacing="-1px"
//                       >
//                         {s.v}
//                       </Text>
//                       <Text
//                         fontSize="10px"
//                         color="rgba(255,255,255,.5)"
//                         textTransform="uppercase"
//                         letterSpacing=".8px"
//                       >
//                         {s.l}
//                       </Text>
//                     </Box>
//                   </Flex>
//                 ))}
//               </Flex>
//             </Box>
//           </Flex>

//           {/* Owner panel */}
//           {isOwner && (
//             <Box
//               mt={8}
//               bg="rgba(255,255,255,.08)"
//               border="1px solid rgba(255,255,255,.14)"
//               borderRadius="16px"
//               p={{ base: 4, md: 6 }}
//             >
//               <Text
//                 fontSize="11px"
//                 fontWeight={800}
//                 color="rgba(255,255,255,.4)"
//                 textTransform="uppercase"
//                 letterSpacing="2px"
//                 mb={4}
//               >
//                 Share Test Link
//               </Text>
//               <Flex gap={3} flexWrap={{ base: "wrap", sm: "nowrap" }} mb={3}>
//                 <Box
//                   flex={1}
//                   bg="rgba(0,0,0,.3)"
//                   borderRadius="10px"
//                   px={4}
//                   py="11px"
//                   fontFamily="monospace"
//                   fontSize="12px"
//                   color="rgba(255,255,255,.8)"
//                   overflow="hidden"
//                   textOverflow="ellipsis"
//                   whiteSpace="nowrap"
//                 >
//                   {isPrivate ? tokenUrl : shareUrl}
//                 </Box>
//                 <Button
//                   flexShrink={0}
//                   h="42px"
//                   px={5}
//                   borderRadius="10px"
//                   bg={copied ? "#22c55e" : "white"}
//                   color={copied ? "white" : "#1e3a5f"}
//                   fontWeight={800}
//                   fontSize="13px"
//                   leftIcon={
//                     <Icon as={copied ? FaCheck : FaLink} fontSize="12px" />
//                   }
//                   onClick={() => handleCopy(isPrivate ? tokenUrl : shareUrl)}
//                   _hover={{ bg: copied ? "#16a34a" : "#f0f7ff" }}
//                 >
//                   {copied ? "Copied!" : "Copy"}
//                 </Button>
//               </Flex>
//               <Flex gap={3} flexWrap="wrap">
//                 <Button
//                   size="sm"
//                   leftIcon={<FaPlay />}
//                   bg="white"
//                   color="#0f1e3a"
//                   borderRadius="9px"
//                   fontWeight={700}
//                   onClick={launchTest}
//                   _hover={{ bg: "#f0f7ff" }}
//                 >
//                   Preview Test
//                 </Button>
//                 <Button
//                   size="sm"
//                   leftIcon={<Icon as={FaChartBar} />}
//                   bg="transparent"
//                   color="#fca5a5"
//                   border="1px solid rgba(239,68,68,.3)"
//                   borderRadius="9px"
//                   fontWeight={700}
//                   onClick={() => setDelOpen(true)}
//                   _hover={{ bg: "rgba(239,68,68,.2)", color: "white" }}
//                 >
//                   Delete Test
//                 </Button>
//               </Flex>
//             </Box>
//           )}
//         </Box>
//       </Box>

//       {/* Body */}
//       <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
//         <Flex gap={2} mb={6} flexWrap="wrap">
//           {TABS.map((t) => (
//             <Box
//               key={t}
//               px={4}
//               py="8px"
//               borderRadius="10px"
//               cursor="pointer"
//               bg={tab === t ? "#4a72b8" : "white"}
//               color={tab === t ? "white" : "#374151"}
//               border="1px solid"
//               borderColor={tab === t ? "#4a72b8" : "#e2e8f0"}
//               fontSize="13px"
//               fontWeight={tab === t ? 700 : 500}
//               onClick={() => setTab(t)}
//               transition="all .15s"
//               _hover={{
//                 borderColor: "#4a72b8",
//                 color: tab === t ? "white" : "#4a72b8",
//               }}
//             >
//               {t.charAt(0).toUpperCase() + t.slice(1)}
//             </Box>
//           ))}
//         </Flex>

//         {tab === "overview" && (
//           <Grid
//             templateColumns={{
//               base: "1fr",
//               md: "repeat(2,1fr)",
//               lg: "repeat(4,1fr)",
//             }}
//             gap={4}
//           >
//             <StatCard
//               icon={FaUsers}
//               label="Attempts"
//               value={stats?.totalAttempts ?? 0}
//             />
//             <StatCard
//               icon={FaCheckCircle}
//               label="Pass Rate"
//               value={stats ? `${stats.passRate}%` : "—"}
//               color="#16a34a"
//               bg="#f0fdf4"
//             />
//             <StatCard
//               icon={FaChartBar}
//               label="Avg Score"
//               value={stats ? `${stats.avgPercentage}%` : "—"}
//               color="#7c3aed"
//               bg="#f5f3ff"
//             />
//             <StatCard
//               icon={FaFire}
//               label="Top Score"
//               value={stats?.highestScore ? `${stats.highestScore}%` : "—"}
//               color="#ea580c"
//               bg="#fff7ed"
//             />
//           </Grid>
//         )}

//         {tab === "leaderboard" && (
//           <Box
//             bg="white"
//             borderRadius="16px"
//             border="1px solid #e2e8f0"
//             overflow="hidden"
//           >
//             <Flex
//               px={6}
//               py={4}
//               align="center"
//               gap={3}
//               borderBottom="1px solid #f1f5f9"
//             >
//               <Icon as={FaTrophy} color="#f59e0b" />
//               <Text fontSize="15px" fontWeight={800} color="#0f172a">
//                 Leaderboard
//               </Text>
//               <Badge colorScheme="blue" borderRadius="full">
//                 {leaderboard.length} entries
//               </Badge>
//             </Flex>
//             {leaderboard.length === 0 ? (
//               <Box py={16} textAlign="center">
//                 <Icon
//                   as={FaTrophy}
//                   fontSize="40px"
//                   color="#e2e8f0"
//                   display="block"
//                   mx="auto"
//                   mb={3}
//                 />
//                 <Text fontSize="14px" color="#94a3b8">
//                   No attempts yet — be the first!
//                 </Text>
//               </Box>
//             ) : (
//               leaderboard.map((r, i) => (
//                 <Box
//                   key={r._id}
//                   borderBottom={
//                     i < leaderboard.length - 1 ? "1px solid #f1f5f9" : "none"
//                   }
//                 >
//                   <LeaderRow
//                     rank={i + 1}
//                     result={r}
//                     currentUserId={user?._id}
//                   />
//                 </Box>
//               ))
//             )}
//           </Box>
//         )}

//         {tab === "questions" && isOwner && (
//           <Box
//             bg="white"
//             borderRadius="16px"
//             border="1px solid #e2e8f0"
//             overflow="hidden"
//           >
//             <Flex px={6} py={4} align="center" borderBottom="1px solid #f1f5f9">
//               <Text fontSize="15px" fontWeight={800} color="#0f172a">
//                 Questions Preview
//               </Text>
//               <Badge ml={3} colorScheme="blue">
//                 {test.questions?.length}
//               </Badge>
//             </Flex>
//             {test.questions?.map((q, i) => (
//               <Box
//                 key={i}
//                 px={6}
//                 py={4}
//                 borderBottom={
//                   i < test.questions.length - 1 ? "1px solid #f8fafc" : "none"
//                 }
//               >
//                 <Flex gap={3} mb={2}>
//                   <Text
//                     fontSize="12px"
//                     fontWeight={700}
//                     color="#94a3b8"
//                     w="20px"
//                     flexShrink={0}
//                   >
//                     {i + 1}.
//                   </Text>
//                   <Text fontSize="14px" fontWeight={600} color="#0f172a">
//                     {q.qus}
//                   </Text>
//                 </Flex>
//                 <Flex flexWrap="wrap" gap={2} pl="23px">
//                   {q.options?.map((opt, oi) => (
//                     <Box
//                       key={oi}
//                       px={3}
//                       py="4px"
//                       borderRadius="7px"
//                       fontSize="12px"
//                       bg={oi === q.answer ? "#f0fdf4" : "#f8fafc"}
//                       color={oi === q.answer ? "#16a34a" : "#64748b"}
//                       border="1px solid"
//                       borderColor={oi === q.answer ? "#86efac" : "#e2e8f0"}
//                       fontWeight={oi === q.answer ? 700 : 400}
//                     >
//                       {String.fromCharCode(65 + oi)}. {opt}
//                       {oi === q.answer && " ✓"}
//                     </Box>
//                   ))}
//                 </Flex>
//               </Box>
//             ))}
//           </Box>
//         )}
//       </Box>

//       {/* Password Modal */}
//       <Modal isOpen={pwOpen} onClose={() => setPwOpen(false)} isCentered>
//         <ModalOverlay backdropFilter="blur(4px)" />
//         <ModalContent borderRadius="16px" fontFamily="'Sora',sans-serif" mx={4}>
//           <ModalHeader>
//             <Flex align="center" gap={2}>
//               <Icon as={FaLock} color="#4a72b8" />
//               <Text>Enter Test Password</Text>
//             </Flex>
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody pb={2}>
//             <Input
//               placeholder="Password"
//               type="password"
//               value={pwInput}
//               onChange={(e) => {
//                 setPwInput(e.target.value);
//                 setPwErr("");
//               }}
//               onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
//               borderColor={pwErr ? "red.400" : "#e2e8f0"}
//               borderRadius="10px"
//               h="44px"
//               _focus={{
//                 borderColor: "#4a72b8",
//                 boxShadow: "0 0 0 1px #4a72b8",
//               }}
//             />
//             {pwErr && (
//               <Text fontSize="12px" color="red.500" mt={1}>
//                 {pwErr}
//               </Text>
//             )}
//           </ModalBody>
//           <ModalFooter gap={3}>
//             <Button variant="ghost" onClick={() => setPwOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               bg="#4a72b8"
//               color="white"
//               borderRadius="10px"
//               fontWeight={700}
//               onClick={verifyPassword}
//               _hover={{ bg: "#3b5fa0" }}
//             >
//               Enter Test
//             </Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>

//       {/* Delete Dialog */}
//       <AlertDialog
//         isOpen={delOpen}
//         leastDestructiveRef={cancelRef}
//         onClose={() => setDelOpen(false)}
//         isCentered
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent
//             mx={4}
//             borderRadius="16px"
//             fontFamily="'Sora',sans-serif"
//           >
//             <AlertDialogHeader fontSize="16px" fontWeight={800}>
//               Delete Test?
//             </AlertDialogHeader>
//             <AlertDialogBody>
//               <Text fontSize="14px" color="#475569">
//                 This will permanently remove this test and all its results.
//               </Text>
//             </AlertDialogBody>
//             <AlertDialogFooter gap={3}>
//               <Button
//                 ref={cancelRef}
//                 onClick={() => setDelOpen(false)}
//                 variant="ghost"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 bg="#ef4444"
//                 color="white"
//                 borderRadius="10px"
//                 fontWeight={700}
//                 onClick={handleDelete}
//                 _hover={{ bg: "#dc2626" }}
//               >
//                 Delete
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </Box>
//   );
// }

import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  Spinner,
  Badge,
  Progress,
  Avatar,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Grid,
} from "@chakra-ui/react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowLeft,
  FaClock,
  FaUsers,
  FaLock,
  FaUnlock,
  FaTrophy,
  FaCheckCircle,
  FaClipboardList,
  FaLink,
  FaCheck,
  FaChartBar,
  FaPlay,
  FaBookOpen,
  FaCrown,
  FaFire,
  FaInfoCircle,
  FaShieldAlt,
  FaExclamationTriangle,
  FaGlobe,
  FaMobileAlt,
  FaBan,
  FaEye,
  FaRedoAlt,
  FaLayerGroup,
  FaRegClock,
} from "react-icons/fa";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

/* ─────────────────────────────────────────────────────────────────────────────
   LANGUAGE CONFIG
───────────────────────────────────────────────────────────────────────────── */
const LANGUAGES = [
  {
    value: "english",
    label: "English",
    native: "English",
    flag: "🇬🇧",
    desc: "Questions & options in English only",
    color: "#1d4ed8",
    lightBg: "#eff6ff",
    border: "#bfdbfe",
    accent: "#2563eb",
    gradient: "linear-gradient(135deg,#1d4ed8,#2563eb)",
  },
  {
    value: "hindi",
    label: "Hindi",
    native: "हिंदी",
    flag: "🇮🇳",
    desc: "प्रश्न केवल हिंदी में",
    color: "#b45309",
    lightBg: "#fffbeb",
    border: "#fde68a",
    accent: "#d97706",
    gradient: "linear-gradient(135deg,#b45309,#d97706)",
  },
  {
    value: "bilingual",
    label: "Bilingual",
    native: "द्विभाषी",
    flag: "🔀",
    desc: "English + हिंदी side by side",
    color: "#6d28d9",
    lightBg: "#f5f3ff",
    border: "#ddd6fe",
    accent: "#7c3aed",
    gradient: "linear-gradient(135deg,#6d28d9,#7c3aed)",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STAT CARD (used by owner dashboard)
───────────────────────────────────────────────────────────────────────────── */
function StatCard({ icon, label, value, color = "#4a72b8", bg = "#eff6ff" }) {
  return (
    <Box bg={bg} borderRadius="14px" p={5} flex={1} minW="120px">
      <Flex align="center" gap={2} mb={2}>
        <Flex
          w="32px"
          h="32px"
          bg="white"
          borderRadius="9px"
          align="center"
          justify="center"
          boxShadow="0 2px 8px rgba(0,0,0,.08)"
        >
          <Icon as={icon} color={color} fontSize="14px" />
        </Flex>
        <Text
          fontSize="11px"
          fontWeight={700}
          color="#94a3b8"
          textTransform="uppercase"
          letterSpacing=".8px"
        >
          {label}
        </Text>
      </Flex>
      <Text
        fontSize="28px"
        fontWeight={800}
        color="#0f172a"
        letterSpacing="-1px"
      >
        {value}
      </Text>
    </Box>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LEADERBOARD ROW
───────────────────────────────────────────────────────────────────────────── */
function LeaderRow({ rank, result, currentUserId }) {
  const name = result.studentId?.Name || result.studentId?.Email || "Student";
  const pct = result.scorePercentage ?? result.percentage ?? 0;
  const isMe = String(result.studentId?._id) === String(currentUserId);
  const medals = ["🥇", "🥈", "🥉"];
  return (
    <Flex
      px={5}
      py={3}
      align="center"
      gap={3}
      bg={isMe ? "linear-gradient(90deg,#eff6ff,#f0fdf4)" : "transparent"}
      borderLeft={isMe ? "3px solid #4a72b8" : "3px solid transparent"}
      _hover={{ bg: "#f8fafc" }}
    >
      <Text w="28px" fontSize="15px" textAlign="center">
        {rank <= 3 ? (
          medals[rank - 1]
        ) : (
          <Text as="span" fontSize="13px" fontWeight={700} color="#94a3b8">
            {rank}
          </Text>
        )}
      </Text>
      <Avatar
        size="sm"
        name={name}
        bg="#4a72b8"
        color="white"
        fontSize="12px"
      />
      <Box flex={1} minW={0}>
        <Text fontSize="13px" fontWeight={700} color="#0f172a" noOfLines={1}>
          {name}{" "}
          {isMe && (
            <Badge colorScheme="blue" fontSize="9px" ml={1}>
              You
            </Badge>
          )}
        </Text>
        <Progress
          value={pct}
          size="xs"
          colorScheme="blue"
          borderRadius="full"
          mt={1}
        />
      </Box>
      <Box textAlign="right">
        <Text
          fontSize="15px"
          fontWeight={800}
          color={pct >= 60 ? "#16a34a" : "#dc2626"}
        >
          {pct.toFixed(0)}%
        </Text>
        <Text fontSize="10px" color="#94a3b8">
          {result.timeTakenSec
            ? `${Math.floor(result.timeTakenSec / 60)}m`
            : "—"}
        </Text>
      </Box>
    </Flex>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   LANGUAGE SELECTOR
───────────────────────────────────────────────────────────────────────────── */
function LanguageSelector({ value, onChange, hasHindi }) {
  return (
    <Box
      bg="white"
      borderRadius="20px"
      border="1px solid #e2e8f0"
      p={{ base: 5, md: 6 }}
      mb={5}
      boxShadow="0 2px 16px rgba(0,0,0,.05)"
    >
      <Flex align="center" gap={3} mb={5}>
        <Box
          w="42px"
          h="42px"
          borderRadius="13px"
          flexShrink={0}
          bg="linear-gradient(135deg,#6d28d9,#7c3aed)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 4px 12px rgba(109,40,217,.25)"
        >
          <Text fontSize="18px" lineHeight="1">
            🌐
          </Text>
        </Box>
        <Box>
          <Text
            fontSize="15px"
            fontWeight={800}
            color="#0f172a"
            letterSpacing="-0.3px"
          >
            Choose Test Language
          </Text>
          <Text fontSize="12px" color="#94a3b8" mt="1px">
            Questions will be displayed in your selected language
          </Text>
        </Box>
      </Flex>

      <Flex gap={3} direction={{ base: "column", sm: "row" }}>
        {LANGUAGES.map((lang) => {
          const isActive = value === lang.value;
          const isDisabled =
            (lang.value === "hindi" || lang.value === "bilingual") && !hasHindi;
          return (
            <Box
              key={lang.value}
              flex={1}
              cursor={isDisabled ? "not-allowed" : "pointer"}
              onClick={() => !isDisabled && onChange(lang.value)}
              transition="all .2s cubic-bezier(.4,0,.2,1)"
              transform={isActive ? "translateY(-3px)" : "none"}
              opacity={isDisabled ? 0.4 : 1}
            >
              {/* Active: full gradient header */}
              {isActive ? (
                <Box
                  borderRadius="14px"
                  overflow="hidden"
                  boxShadow={`0 8px 24px ${lang.accent}30`}
                >
                  <Box bg={lang.gradient} px={4} pt={4} pb={3}>
                    <Flex align="center" justify="space-between">
                      <Flex align="center" gap={2}>
                        <Text fontSize="24px" lineHeight="1">
                          {lang.flag}
                        </Text>
                        <Box>
                          <Text fontSize="14px" fontWeight={800} color="white">
                            {lang.label}
                          </Text>
                          {lang.native !== lang.label && (
                            <Text
                              fontSize="11px"
                              color="rgba(255,255,255,.65)"
                              mt="-1px"
                            >
                              {lang.native}
                            </Text>
                          )}
                        </Box>
                      </Flex>
                      <Flex
                        w="22px"
                        h="22px"
                        borderRadius="full"
                        bg="rgba(255,255,255,.25)"
                        align="center"
                        justify="center"
                      >
                        <Icon as={FaCheck} fontSize="9px" color="white" />
                      </Flex>
                    </Flex>
                  </Box>
                  <Box
                    bg={lang.lightBg}
                    px={4}
                    py={3}
                    border={`2px solid ${lang.accent}`}
                    borderTop="none"
                    borderRadius="0 0 14px 14px"
                  >
                    <Text
                      fontSize="11px"
                      color={lang.color}
                      fontWeight={600}
                      lineHeight={1.5}
                    >
                      {lang.desc}
                    </Text>
                  </Box>
                </Box>
              ) : (
                <Box
                  border="2px solid #e2e8f0"
                  borderRadius="14px"
                  p={4}
                  bg={isDisabled ? "#fafafa" : "white"}
                  _hover={
                    !isDisabled
                      ? { borderColor: lang.accent, bg: lang.lightBg }
                      : {}
                  }
                  transition="all .18s"
                >
                  <Flex align="center" justify="space-between" mb={2}>
                    <Flex align="center" gap={2}>
                      <Text fontSize="22px" lineHeight="1">
                        {lang.flag}
                      </Text>
                      <Box>
                        <Text fontSize="13px" fontWeight={700} color="#374151">
                          {lang.label}
                        </Text>
                        {lang.native !== lang.label && (
                          <Text fontSize="11px" color="#94a3b8" mt="-1px">
                            {lang.native}
                          </Text>
                        )}
                      </Box>
                    </Flex>
                    <Box
                      w="20px"
                      h="20px"
                      borderRadius="full"
                      border="2px solid #d1d5db"
                      bg="white"
                      flexShrink={0}
                    />
                  </Flex>
                  <Text fontSize="11px" color="#94a3b8" lineHeight={1.5}>
                    {lang.desc}
                  </Text>
                  {isDisabled && (
                    <Box
                      mt={2}
                      display="inline-block"
                      bg="#fef3c7"
                      px={2}
                      py="2px"
                      borderRadius="5px"
                    >
                      <Text fontSize="10px" fontWeight={700} color="#b45309">
                        Not available
                      </Text>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          );
        })}
      </Flex>

      {/* Confirmation line */}
      <Flex
        mt={4}
        p={3}
        align="center"
        gap={2}
        bg="linear-gradient(90deg,#f0fdf4,#f8fafc)"
        borderRadius="10px"
        border="1px solid #bbf7d0"
      >
        <Flex
          w="20px"
          h="20px"
          bg="#16a34a"
          borderRadius="full"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Icon as={FaCheck} fontSize="9px" color="white" />
        </Flex>
        <Text fontSize="12px" color="#15803d" fontWeight={600}>
          Questions will be shown in{" "}
          <Text as="span" fontWeight={800} color="#0f172a">
            {LANGUAGES.find((l) => l.value === value)?.label}
          </Text>
          {value === "bilingual" && (
            <Text as="span" color="#64748b" fontWeight={400}>
              {" "}
              — both languages simultaneously
            </Text>
          )}
        </Text>
      </Flex>
    </Box>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   RULE CARD
───────────────────────────────────────────────────────────────────────────── */
function RuleCard({ number, icon, accent, bg, title, description }) {
  return (
    <Flex
      gap={3}
      p={4}
      borderRadius="14px"
      bg={bg}
      border={`1px solid ${accent}22`}
      align="flex-start"
      transition="all .18s"
      _hover={{
        boxShadow: `0 4px 16px ${accent}18`,
        transform: "translateY(-1px)",
      }}
    >
      <Box position="relative" flexShrink={0}>
        <Flex
          w="38px"
          h="38px"
          bg={accent}
          borderRadius="11px"
          align="center"
          justify="center"
          color="white"
          fontSize="16px"
          boxShadow={`0 4px 10px ${accent}40`}
        >
          <Icon as={icon} />
        </Flex>
        <Box
          position="absolute"
          top="-6px"
          right="-6px"
          w="16px"
          h="16px"
          bg="white"
          borderRadius="full"
          border={`2px solid ${accent}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="8px" fontWeight={800} color={accent} lineHeight="1">
            {number}
          </Text>
        </Box>
      </Box>
      <Box flex={1}>
        <Text
          fontSize="13px"
          fontWeight={800}
          color="#0f172a"
          mb={1}
          letterSpacing="-0.2px"
        >
          {title}
        </Text>
        <Text fontSize="12px" color="#64748b" lineHeight={1.65}>
          {description}
        </Text>
      </Box>
    </Flex>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TEST INFO / INSTRUCTION PAGE  (students & guests)
───────────────────────────────────────────────────────────────────────────── */
function TestInfoPage({
  test,
  stats,
  onStart,
  user,
  myResult,
  selectedLang,
  onLangChange,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [agreed, setAgreed] = useState(false);

  const timeLimitMin = test.timeLimitMin || test.timeLimit || 30;
  const isPrivate =
    test.visibility === "private" || test.accessType === "private";
  const questionCount = test.questions?.length || 0;
  const secsPerQ = Math.round((timeLimitMin * 60) / Math.max(questionCount, 1));
  const hasHindi = test.questions?.some(
    (q) => q.qush && String(q.qush).trim().length > 0,
  );

  const RULES = [
    {
      icon: FaEye,
      accent: "#2563eb",
      bg: "#eff6ff",
      title: "Stay on this page",
      description:
        "Do not switch browser tabs or open other apps during the test. Tab-switching is monitored and may flag your attempt.",
    },
    {
      icon: FaRegClock,
      accent: "#d97706",
      bg: "#fffbeb",
      title: "Strict time limit",
      description: `You have exactly ${timeLimitMin} minutes. The test auto-submits the moment time runs out — no extensions or pauses allowed.`,
    },
    {
      icon: FaLayerGroup,
      accent: "#7c3aed",
      bg: "#f5f3ff",
      title: "Mark & review",
      description:
        "Use the question palette to jump between questions. Mark any question for review — you can revisit it before final submission.",
    },
    {
      icon: FaCheckCircle,
      accent: "#16a34a",
      bg: "#f0fdf4",
      title: "No negative marking",
      description: `Each correct answer scores 1 mark (total: ${questionCount}). Wrong answers and skipped questions carry zero penalty.`,
    },
    {
      icon: FaRedoAlt,
      accent: "#0891b2",
      bg: "#ecfeff",
      title: "Reconnection is safe",
      description:
        "Your answers are saved question by question. If you lose connection or refresh, your progress is fully recovered on reload.",
    },
    {
      icon: FaBan,
      accent: "#e11d48",
      bg: "#fff1f2",
      title: "No copy-paste",
      description:
        "Right-click, keyboard shortcuts (Ctrl+C, Ctrl+V), and text selection are disabled during the test for fairness.",
    },
    {
      icon: FaMobileAlt,
      accent: "#ea580c",
      bg: "#fff7ed",
      title: "Use a stable device",
      description:
        "Laptop or desktop recommended. Keep your device charged. Close unnecessary apps to ensure smooth performance.",
    },
    {
      icon: FaGlobe,
      accent: "#0d9488",
      bg: "#f0fdfa",
      title: "Stable internet required",
      description:
        "Use a reliable Wi-Fi or wired connection. Poor connectivity may cause delays in saving answers, though auto-recovery helps.",
    },
  ];

  return (
    <Box minH="100vh" bg="#f0f4f8" fontFamily="'Sora', sans-serif">
      {/* ── HERO HEADER ── */}
      <Box
        bg="linear-gradient(135deg,#0a1628 0%,#0f2444 40%,#1a3a6e 80%,#1e4d8c 100%)"
        px={{ base: 4, md: 8, lg: 12 }}
        pt={{ base: 10, md: 14 }}
        pb={{ base: 20, md: 28 }}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative rings */}
        <Box
          position="absolute"
          right="-120px"
          top="-120px"
          w="420px"
          h="420px"
          borderRadius="full"
          border="1px solid rgba(255,255,255,.04)"
        />
        <Box
          position="absolute"
          right="-60px"
          top="-60px"
          w="280px"
          h="280px"
          borderRadius="full"
          border="1px solid rgba(255,255,255,.06)"
        />
        <Box
          position="absolute"
          left="-80px"
          bottom="-80px"
          w="320px"
          h="320px"
          borderRadius="full"
          bg="rgba(30,77,140,.3)"
        />
        {/* Dot grid */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.04}
          backgroundImage="radial-gradient(circle, white 1px, transparent 1px)"
          backgroundSize="28px 28px"
        />

        <Box maxW="900px" mx="auto" position="relative" zIndex={1}>
          {/* Back */}
          <Flex
            align="center"
            gap={2}
            mb={8}
            cursor="pointer"
            w="fit-content"
            color="rgba(255,255,255,.4)"
            _hover={{ color: "rgba(255,255,255,.9)", gap: "10px" }}
            transition="all .2s"
            onClick={() => navigate(-1)}
          >
            <Icon as={FaArrowLeft} fontSize="12px" />
            <Text fontSize="13px" fontWeight={600}>
              Back
            </Text>
          </Flex>

          {/* Title block */}
          <Flex
            align="flex-start"
            gap={{ base: 4, md: 5 }}
            flexWrap={{ base: "wrap", sm: "nowrap" }}
          >
            <Flex
              w={{ base: "52px", md: "70px" }}
              h={{ base: "52px", md: "70px" }}
              flexShrink={0}
              bg="rgba(255,255,255,.1)"
              backdropFilter="blur(8px)"
              border="1.5px solid rgba(255,255,255,.2)"
              borderRadius="18px"
              align="center"
              justify="center"
              fontSize={{ base: "24px", md: "32px" }}
            >
              📋
            </Flex>
            <Box flex={1} minW={0}>
              <Flex flexWrap="wrap" gap={2} mb={3} align="center">
                {test.examType && (
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="rgba(255,255,255,.12)"
                    backdropFilter="blur(4px)"
                    color="rgba(255,255,255,.85)"
                    fontSize="11px"
                    fontWeight={700}
                    border="1px solid rgba(255,255,255,.15)"
                  >
                    {test.examType}
                  </Badge>
                )}
                {isPrivate && (
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="rgba(239,68,68,.2)"
                    color="#fca5a5"
                    fontSize="11px"
                    fontWeight={700}
                    border="1px solid rgba(239,68,68,.3)"
                  >
                    🔒 Private
                  </Badge>
                )}
                {myResult && (
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="rgba(34,197,94,.15)"
                    color="#86efac"
                    fontSize="11px"
                    fontWeight={700}
                    border="1px solid rgba(34,197,94,.25)"
                  >
                    ✓ Already attempted
                  </Badge>
                )}
              </Flex>
              <Text
                fontSize={{ base: "24px", md: "40px" }}
                fontWeight={800}
                color="white"
                letterSpacing={{ base: "-0.5px", md: "-1.5px" }}
                lineHeight="1.1"
                mb={1}
              >
                {test.title}
              </Text>
              {test.subject && (
                <Text fontSize="14px" color="rgba(255,255,255,.45)" mt={1}>
                  Subject:{" "}
                  {test.subject.charAt(0).toUpperCase() + test.subject.slice(1)}
                </Text>
              )}
            </Box>
          </Flex>

          {/* Quick stats strip */}
          <Flex
            mt={8}
            pt={6}
            borderTop="1px solid rgba(255,255,255,.08)"
            gap={{ base: 6, md: 10 }}
            flexWrap="wrap"
          >
            {[
              {
                icon: FaClipboardList,
                value: questionCount,
                label: "Questions",
              },
              {
                icon: FaClock,
                value: `${timeLimitMin} min`,
                label: "Duration",
              },
              {
                icon: FaRegClock,
                value: `~${secsPerQ}s`,
                label: "Per Question",
              },
              {
                icon: FaUsers,
                value: stats?.totalAttempts ?? 0,
                label: "Attempts",
              },
              {
                icon: FaChartBar,
                value: stats ? `${stats.avgPercentage}%` : "—",
                label: "Avg Score",
              },
            ].map((s) => (
              <Flex key={s.label} align="center" gap={3}>
                <Flex
                  w="34px"
                  h="34px"
                  bg="rgba(255,255,255,.08)"
                  borderRadius="10px"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon
                    as={s.icon}
                    fontSize="13px"
                    color="rgba(255,255,255,.45)"
                  />
                </Flex>
                <Box>
                  <Text
                    fontSize={{ base: "20px", md: "24px" }}
                    fontWeight={800}
                    color="white"
                    lineHeight="1"
                    letterSpacing="-0.8px"
                  >
                    {s.value}
                  </Text>
                  <Text
                    fontSize="10px"
                    color="rgba(255,255,255,.4)"
                    textTransform="uppercase"
                    letterSpacing="1px"
                    mt="1px"
                  >
                    {s.label}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* ── BODY — overlaps hero ── */}
      <Box
        maxW="900px"
        mx="auto"
        px={{ base: 4, md: 6, lg: 8 }}
        mt={{ base: "-40px", md: "-56px" }}
        pb={16}
        position="relative"
        zIndex={1}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 300px" }}
          gap={5}
          alignItems="start"
        >
          {/* ── LEFT COLUMN ── */}
          <Box>
            {/* Previous result banner */}
            {myResult && (
              <Box
                bg="white"
                borderRadius="20px"
                border="1.5px solid #86efac"
                p={5}
                mb={5}
                boxShadow="0 4px 20px rgba(22,163,74,.12)"
              >
                <Flex align="center" gap={4} flexWrap="wrap">
                  <Flex
                    w="52px"
                    h="52px"
                    bg="linear-gradient(135deg,#f0fdf4,#dcfce7)"
                    borderRadius="14px"
                    align="center"
                    justify="center"
                    flexShrink={0}
                    border="1.5px solid #86efac"
                  >
                    <Icon as={FaTrophy} color="#16a34a" fontSize="20px" />
                  </Flex>
                  <Box flex={1}>
                    <Text
                      fontSize="12px"
                      fontWeight={700}
                      color="#16a34a"
                      textTransform="uppercase"
                      letterSpacing=".8px"
                    >
                      Your Previous Attempt
                    </Text>
                    <Flex align="baseline" gap={2} mt={0.5}>
                      <Text
                        fontSize="32px"
                        fontWeight={800}
                        color="#15803d"
                        lineHeight="1"
                        letterSpacing="-1.5px"
                      >
                        {(
                          myResult.scorePercentage ??
                          myResult.percentage ??
                          0
                        ).toFixed(0)}
                        %
                      </Text>
                      <Text fontSize="14px" color="#16a34a" fontWeight={600}>
                        · {myResult.correct ?? myResult.correctQus?.length ?? 0}
                        /{questionCount} correct
                      </Text>
                    </Flex>
                  </Box>
                  <Badge
                    fontSize="11px"
                    px={3}
                    py={1.5}
                    borderRadius="full"
                    colorScheme={
                      (myResult.scorePercentage ?? myResult.percentage ?? 0) >=
                      40
                        ? "green"
                        : "red"
                    }
                  >
                    {(myResult.scorePercentage ?? myResult.percentage ?? 0) >=
                    40
                      ? "PASSED"
                      : "FAILED"}
                  </Badge>
                </Flex>
              </Box>
            )}

            {/* ── LANGUAGE SELECTOR ── */}
            <LanguageSelector
              value={selectedLang}
              onChange={onLangChange}
              hasHindi={hasHindi}
            />

            {/* ── TEST DETAILS GRID ── */}
            <Box
              bg="white"
              borderRadius="20px"
              border="1px solid #e2e8f0"
              p={{ base: 5, md: 6 }}
              mb={5}
              boxShadow="0 2px 12px rgba(0,0,0,.04)"
            >
              <Flex align="center" gap={3} mb={5}>
                <Flex
                  w="38px"
                  h="38px"
                  bg="#eff6ff"
                  borderRadius="12px"
                  align="center"
                  justify="center"
                >
                  <Icon as={FaInfoCircle} color="#2563eb" fontSize="15px" />
                </Flex>
                <Text
                  fontSize="15px"
                  fontWeight={800}
                  color="#0f172a"
                  letterSpacing="-0.3px"
                >
                  Test Details
                </Text>
              </Flex>
              <Grid
                templateColumns={{ base: "1fr 1fr", md: "repeat(3,1fr)" }}
                gap={3}
              >
                {[
                  {
                    label: "Questions",
                    value: questionCount,
                    accent: "#2563eb",
                    bg: "#eff6ff",
                  },
                  {
                    label: "Duration",
                    value: `${timeLimitMin} min`,
                    accent: "#d97706",
                    bg: "#fffbeb",
                  },
                  {
                    label: "Per Question",
                    value: `~${secsPerQ} sec`,
                    accent: "#16a34a",
                    bg: "#f0fdf4",
                  },
                  {
                    label: "Total Marks",
                    value: `${questionCount}`,
                    accent: "#7c3aed",
                    bg: "#f5f3ff",
                  },
                  {
                    label: "Pass Mark",
                    value: "40%",
                    accent: "#e11d48",
                    bg: "#fff1f2",
                  },
                  {
                    label: "Subject",
                    value: test.subject
                      ? test.subject.charAt(0).toUpperCase() +
                        test.subject.slice(1)
                      : "General",
                    accent: "#0891b2",
                    bg: "#ecfeff",
                  },
                  {
                    label: "Exam Type",
                    value: test.examType || "General",
                    accent: "#ea580c",
                    bg: "#fff7ed",
                  },
                  {
                    label: "Language",
                    value:
                      LANGUAGES.find((l) => l.value === selectedLang)?.label ||
                      "English",
                    accent: "#6d28d9",
                    bg: "#f5f3ff",
                  },
                  {
                    label: "Access",
                    value: isPrivate ? "🔒 Private" : "🌐 Public",
                    accent: "#374151",
                    bg: "#f8fafc",
                  },
                ].map(({ label, value, accent, bg }) => (
                  <Box key={label} bg={bg} borderRadius="12px" p={3.5}>
                    <Text
                      fontSize="10px"
                      fontWeight={700}
                      color="#94a3b8"
                      textTransform="uppercase"
                      letterSpacing=".8px"
                      mb={1.5}
                    >
                      {label}
                    </Text>
                    <Text
                      fontSize="14px"
                      fontWeight={800}
                      color={accent}
                      letterSpacing="-0.3px"
                    >
                      {value}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </Box>

            {/* ── INSTRUCTIONS ── */}
            <Box
              bg="white"
              borderRadius="20px"
              border="1px solid #e2e8f0"
              p={{ base: 5, md: 6 }}
              mb={5}
              boxShadow="0 2px 12px rgba(0,0,0,.04)"
            >
              <Flex align="center" gap={3} mb={5}>
                <Flex
                  w="38px"
                  h="38px"
                  bg="#fffbeb"
                  borderRadius="12px"
                  align="center"
                  justify="center"
                >
                  <Icon as={FaShieldAlt} color="#d97706" fontSize="15px" />
                </Flex>
                <Box>
                  <Text
                    fontSize="15px"
                    fontWeight={800}
                    color="#0f172a"
                    letterSpacing="-0.3px"
                  >
                    Instructions
                  </Text>
                  <Text fontSize="12px" color="#94a3b8" mt="1px">
                    Read all rules before starting
                  </Text>
                </Box>
              </Flex>

              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={3}>
                {RULES.map((rule, i) => (
                  <RuleCard
                    key={i}
                    number={i + 1}
                    icon={rule.icon}
                    accent={rule.accent}
                    bg={rule.bg}
                    title={rule.title}
                    description={rule.description}
                  />
                ))}
              </Grid>
            </Box>

            {/* ── WARNING STRIP ── */}
            <Box
              bg="linear-gradient(135deg,#fffbeb,#fef9c3)"
              border="1.5px solid #fde68a"
              borderRadius="16px"
              p={5}
              mb={5}
            >
              <Flex align="center" gap={2} mb={3}>
                <Icon
                  as={FaExclamationTriangle}
                  color="#d97706"
                  fontSize="15px"
                />
                <Text fontSize="14px" fontWeight={800} color="#92400e">
                  Before You Start
                </Text>
              </Flex>
              <Flex direction="column" gap={2}>
                {[
                  `Once started, the ${timeLimitMin}-minute timer cannot be paused or reset`,
                  "Ensure your device is fully charged or connected to power",
                  "Close all other browser tabs to avoid accidental navigation",
                  "Use a laptop or desktop for the best test-taking experience",
                  "Refreshing the page mid-test is safe — your progress is auto-saved",
                ].map((w, i) => (
                  <Flex key={i} align="flex-start" gap={2.5}>
                    <Box
                      w="20px"
                      h="20px"
                      bg="#fde68a"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      mt="1px"
                    >
                      <Text fontSize="10px" fontWeight={800} color="#92400e">
                        {i + 1}
                      </Text>
                    </Box>
                    <Text fontSize="13px" color="#78350f" lineHeight={1.6}>
                      {w}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Box>

          {/* ── RIGHT COLUMN — sticky start card ── */}
          <Box position={{ base: "static", lg: "sticky" }} top={{ lg: "20px" }}>
            {/* ── START CARD ── */}
            <Box
              bg="white"
              borderRadius="20px"
              border="1px solid #e2e8f0"
              overflow="hidden"
              boxShadow="0 8px 32px rgba(0,0,0,.08)"
              mb={4}
            >
              {/* Card top — gradient */}
              <Box
                bg="linear-gradient(135deg,#0a1628 0%,#1a3a6e 100%)"
                px={6}
                pt={6}
                pb={8}
                textAlign="center"
                position="relative"
                overflow="hidden"
              >
                <Box
                  position="absolute"
                  right="-30px"
                  top="-30px"
                  w="120px"
                  h="120px"
                  borderRadius="full"
                  bg="rgba(255,255,255,.04)"
                />
                <Box
                  position="absolute"
                  left="-20px"
                  bottom="-20px"
                  w="90px"
                  h="90px"
                  borderRadius="full"
                  bg="rgba(99,102,241,.08)"
                />
                <Box
                  w="70px"
                  h="70px"
                  mx="auto"
                  mb={3}
                  bg="rgba(255,255,255,.1)"
                  backdropFilter="blur(4px)"
                  borderRadius="20px"
                  border="1.5px solid rgba(255,255,255,.2)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="30px"
                >
                  🎯
                </Box>
                <Text
                  fontSize="17px"
                  fontWeight={800}
                  color="white"
                  letterSpacing="-0.3px"
                >
                  {myResult ? "Retake the Test" : "Ready to Begin?"}
                </Text>
                <Text fontSize="12px" color="rgba(255,255,255,.5)" mt={1}>
                  {questionCount} questions · {timeLimitMin} min ·{" "}
                  {LANGUAGES.find((l) => l.value === selectedLang)?.label}
                </Text>
              </Box>

              {/* Card body */}
              <Box px={5} pt={5} pb={6}>
                {/* ── TIME BREAKDOWN — visual clock display ── */}
                <Box
                  mb={4}
                  borderRadius="16px"
                  overflow="hidden"
                  border="1px solid #f1f5f9"
                >
                  {/* Header */}
                  <Flex
                    align="center"
                    gap={2}
                    bg="#fafafa"
                    px={4}
                    py={3}
                    borderBottom="1px solid #f1f5f9"
                  >
                    <Icon as={FaClock} color="#d97706" fontSize="13px" />
                    <Text fontSize="12px" fontWeight={700} color="#374151">
                      Time Allowed
                    </Text>
                  </Flex>

                  {/* Big clock face */}
                  <Box
                    bg="linear-gradient(135deg,#fffbeb,#fef9c3)"
                    px={4}
                    py={4}
                    borderBottom="1px solid #fde68a"
                  >
                    <Flex align="center" justify="center" gap={2}>
                      {/* Hours (if >= 60 min) */}
                      {timeLimitMin >= 60 && (
                        <>
                          <Box textAlign="center">
                            <Box
                              bg="white"
                              borderRadius="10px"
                              px={3}
                              py={2}
                              border="1.5px solid #fde68a"
                              minW="50px"
                              boxShadow="0 2px 8px rgba(0,0,0,.06)"
                            >
                              <Text
                                fontSize="28px"
                                fontWeight={800}
                                color="#92400e"
                                lineHeight="1"
                                letterSpacing="-2px"
                              >
                                {Math.floor(timeLimitMin / 60)
                                  .toString()
                                  .padStart(2, "0")}
                              </Text>
                            </Box>
                            <Text
                              fontSize="9px"
                              color="#b45309"
                              fontWeight={700}
                              textTransform="uppercase"
                              letterSpacing=".8px"
                              mt={1}
                            >
                              HRS
                            </Text>
                          </Box>
                          <Text
                            fontSize="28px"
                            fontWeight={800}
                            color="#d97706"
                            mb={4}
                          >
                            :
                          </Text>
                        </>
                      )}
                      {/* Minutes */}
                      <Box textAlign="center">
                        <Box
                          bg="white"
                          borderRadius="10px"
                          px={3}
                          py={2}
                          border="1.5px solid #fde68a"
                          minW="50px"
                          boxShadow="0 2px 8px rgba(0,0,0,.06)"
                        >
                          <Text
                            fontSize="28px"
                            fontWeight={800}
                            color="#92400e"
                            lineHeight="1"
                            letterSpacing="-2px"
                          >
                            {(timeLimitMin % 60).toString().padStart(2, "0")}
                          </Text>
                        </Box>
                        <Text
                          fontSize="9px"
                          color="#b45309"
                          fontWeight={700}
                          textTransform="uppercase"
                          letterSpacing=".8px"
                          mt={1}
                        >
                          MIN
                        </Text>
                      </Box>
                      <Text
                        fontSize="28px"
                        fontWeight={800}
                        color="#d97706"
                        mb={4}
                      >
                        :
                      </Text>
                      {/* Seconds */}
                      <Box textAlign="center">
                        <Box
                          bg="white"
                          borderRadius="10px"
                          px={3}
                          py={2}
                          border="1.5px solid #fde68a"
                          minW="50px"
                          boxShadow="0 2px 8px rgba(0,0,0,.06)"
                        >
                          <Text
                            fontSize="28px"
                            fontWeight={800}
                            color="#b45309"
                            lineHeight="1"
                            letterSpacing="-2px"
                          >
                            00
                          </Text>
                        </Box>
                        <Text
                          fontSize="9px"
                          color="#b45309"
                          fontWeight={700}
                          textTransform="uppercase"
                          letterSpacing=".8px"
                          mt={1}
                        >
                          SEC
                        </Text>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Per-question chip */}
                  <Flex px={4} py={3} align="center" justify="space-between">
                    <Text fontSize="12px" color="#64748b">
                      ~time per question
                    </Text>
                    <Box
                      bg="#f0fdf4"
                      border="1px solid #bbf7d0"
                      px={3}
                      py={1}
                      borderRadius="full"
                    >
                      <Text fontSize="12px" fontWeight={800} color="#15803d">
                        ⚡ ~{secsPerQ}s
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                {/* ── AGREEMENT CHECKBOX ── */}
                <Box
                  border="2px solid"
                  mb={4}
                  borderColor={agreed ? "#2563eb" : "#e2e8f0"}
                  borderRadius="14px"
                  bg={agreed ? "#f0f7ff" : "white"}
                  cursor="pointer"
                  transition="all .18s"
                  _hover={{ borderColor: "#2563eb", bg: "#f8fbff" }}
                  onClick={() => setAgreed((p) => !p)}
                  p={4}
                >
                  <Flex align="flex-start" gap={3}>
                    <Box
                      flexShrink={0}
                      mt="1px"
                      w="22px"
                      h="22px"
                      borderRadius="7px"
                      bg={agreed ? "#2563eb" : "white"}
                      border="2px solid"
                      borderColor={agreed ? "#2563eb" : "#cbd5e1"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="all .15s"
                      boxShadow={
                        agreed ? "0 2px 8px rgba(37,99,235,.3)" : "none"
                      }
                    >
                      {agreed && (
                        <Icon as={FaCheck} fontSize="9px" color="white" />
                      )}
                    </Box>
                    <Text
                      fontSize="12px"
                      color={agreed ? "#1e40af" : "#64748b"}
                      lineHeight={1.7}
                      fontWeight={agreed ? 600 : 400}
                    >
                      I have read all instructions and agree to the test rules.
                      I understand that switching tabs or unfair means may
                      result in disqualification.
                    </Text>
                  </Flex>
                </Box>

                {/* Start button */}
                {!user ? (
                  <>
                    <Button
                      w="full"
                      h="50px"
                      borderRadius="12px"
                      mb={2}
                      bg="linear-gradient(135deg,#1a3a6e,#0a1628)"
                      color="white"
                      fontWeight={800}
                      fontSize="15px"
                      leftIcon={<FaPlay />}
                      onClick={onStart}
                      _hover={{
                        opacity: 0.9,
                        transform: "translateY(-2px)",
                        boxShadow: "0 8px 24px rgba(26,58,110,.4)",
                      }}
                      transition="all .2s"
                    >
                      Sign In to Start
                    </Button>
                    <Button
                      w="full"
                      h="42px"
                      borderRadius="12px"
                      variant="outline"
                      borderColor="#e2e8f0"
                      color="#374151"
                      fontWeight={700}
                      fontSize="13px"
                      onClick={() => {
                        const rp = location.pathname + location.search;
                        navigate(
                          `/auth/signup?redirect=${encodeURIComponent(rp)}`,
                        );
                      }}
                      _hover={{ bg: "#f8fafc" }}
                    >
                      Create Account
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      w="full"
                      h="54px"
                      borderRadius="13px"
                      bg={
                        agreed
                          ? "linear-gradient(135deg,#1a3a6e,#0a1628)"
                          : "#f1f5f9"
                      }
                      color={agreed ? "white" : "#94a3b8"}
                      fontWeight={800}
                      fontSize="16px"
                      leftIcon={
                        <Icon as={FaPlay} fontSize={agreed ? "14px" : "12px"} />
                      }
                      cursor={agreed ? "pointer" : "not-allowed"}
                      onClick={agreed ? onStart : undefined}
                      boxShadow={
                        agreed ? "0 4px 16px rgba(26,58,110,.25)" : "none"
                      }
                      _hover={
                        agreed
                          ? {
                              opacity: 0.9,
                              transform: "translateY(-2px)",
                              boxShadow: "0 8px 24px rgba(26,58,110,.4)",
                            }
                          : {}
                      }
                      transition="all .2s"
                    >
                      {myResult ? "Retake Test" : "Start Test"}
                    </Button>
                    {!agreed && (
                      <Flex align="center" gap={1.5} justify="center" mt={2}>
                        <Text fontSize="11px" color="#f59e0b" fontWeight={700}>
                          ☝️ Check the box above to start
                        </Text>
                      </Flex>
                    )}
                    <Text
                      fontSize="11px"
                      color="#94a3b8"
                      textAlign="center"
                      mt={2}
                    >
                      as {user.Name || user.Email}
                    </Text>
                  </>
                )}
              </Box>
            </Box>

            {/* Community stats mini-card */}
            {stats && stats.totalAttempts > 0 && (
              <Box
                bg="white"
                borderRadius="16px"
                border="1px solid #e2e8f0"
                p={5}
                boxShadow="0 2px 12px rgba(0,0,0,.04)"
              >
                <Text
                  fontSize="11px"
                  fontWeight={800}
                  color="#94a3b8"
                  textTransform="uppercase"
                  letterSpacing=".8px"
                  mb={4}
                >
                  Community Stats
                </Text>
                {[
                  {
                    label: "Attempts",
                    value: stats.totalAttempts,
                    color: "#2563eb",
                  },
                  {
                    label: "Pass Rate",
                    value: `${stats.passRate}%`,
                    color: "#16a34a",
                  },
                  {
                    label: "Avg Score",
                    value: `${stats.avgPercentage}%`,
                    color: "#7c3aed",
                  },
                  {
                    label: "Top Score",
                    value: `${stats.highestScore}%`,
                    color: "#ea580c",
                  },
                ].map(({ label, value, color }, i, arr) => (
                  <Flex
                    key={label}
                    justify="space-between"
                    align="center"
                    pb={i < arr.length - 1 ? 3 : 0}
                    mb={i < arr.length - 1 ? 3 : 0}
                    borderBottom={
                      i < arr.length - 1 ? "1px solid #f8fafc" : "none"
                    }
                  >
                    <Text fontSize="13px" color="#64748b">
                      {label}
                    </Text>
                    <Text fontSize="15px" fontWeight={800} color={color}>
                      {value}
                    </Text>
                  </Flex>
                ))}
              </Box>
            )}
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════════ */
export default function TestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const cancelRef = useRef();
  const { user } = useAuth();

  const [test, setTest] = useState(null);
  const [stats, setStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [myResult, setMyResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("info");
  const [copied, setCopied] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("english");

  const viaToken = Boolean(location.state?.viaToken);

  const load = useCallback(async () => {
    try {
      let testData = null;
      const isObjectId = /^[a-f\d]{24}$/i.test(id);

      if (isObjectId) {
        try {
          const res = await apiFetch(`/tests/id/${id}`);
          testData = res.data;
        } catch (ownerErr) {
          throw ownerErr;
        }
      } else {
        try {
          const res = await apiFetch(`/tests/${id}`);
          testData = res.data;
        } catch (publicErr) {
          if (user?._id) {
            const res = await apiFetch(`/tests/id/${id}`);
            testData = res.data;
          } else {
            throw publicErr;
          }
        }
      }

      setTest(testData);

      // Auto-select English if test has no hindi questions
      const hasHindi = testData.questions?.some(
        (q) => q.qush && String(q.qush).trim().length > 0,
      );
      if (!hasHindi) setSelectedLang("english");

      const testId = testData._id;
      const [statsRes, lbRes] = await Promise.all([
        apiFetch(`/tests/${testId}/stats`).catch(() => ({ data: null })),
        apiFetch(`/tests/${testId}/leaderboard`).catch(() => ({ data: [] })),
      ]);
      setStats(statsRes.data);
      setLeaderboard(lbRes.data || []);

      if (user?._id) {
        apiFetch(`/results/student/me?testId=${testId}`)
          .then((r) => setMyResult(r.data?.[0] || null))
          .catch(() => {});
      }
    } catch (e) {
      toast({ title: e.message, status: "error" });
    } finally {
      setLoading(false);
    }
  }, [id, user?._id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading)
    return (
      <Flex minH="80vh" align="center" justify="center">
        <Spinner size="xl" color="#4a72b8" thickness="4px" />
      </Flex>
    );

  if (!test)
    return (
      <Box textAlign="center" py={20} fontFamily="'Sora',sans-serif">
        <Text fontSize="18px" fontWeight={700} color="#374151">
          Test not found
        </Text>
        <Button mt={4} onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Box>
    );

  const isOwner = Boolean(
    user &&
    (String(user._id) === String(test.createdBy) ||
      String(user._id) === String(test.createdBy?._id) ||
      (user.coachingId &&
        test.coachingId &&
        String(user.coachingId) === String(test.coachingId))),
  );

  const isPrivate =
    test.visibility === "private" || test.accessType === "private";
  const timeLimitMin = test.timeLimitMin || test.timeLimit || 30;
  const shareUrl = `${window.location.origin}/tests/${test.slug || id}`;
  const tokenUrl = test.accessToken
    ? `${window.location.origin}/tests/token/${test.accessToken}`
    : shareUrl;

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const launchTest = () => {
    if (!test.questions || test.questions.length === 0) {
      toast({ title: "This test has no questions", status: "error" });
      return;
    }
    navigate("/test", {
      state: {
        quest: test.questions,
        testLanguage: selectedLang, // ← passed through to TakeTest
        testMeta: {
          subject: test.subject || "general",
          category: test.examType || test.title,
          timeLimitMin,
          testIndex: 0,
          testId: test._id,
          testTitle: test.title,
        },
      },
    });
  };

  const handleStartTest = () => {
    if (!user) {
      const returnPath = location.pathname + location.search;
      navigate(`/auth/signin?redirect=${encodeURIComponent(returnPath)}`);
      return;
    }
    if (isPrivate && !isOwner && !viaToken) {
      setPwOpen(true);
      return;
    }
    launchTest();
  };

  const verifyPassword = () => {
    if (pwInput === test.password) {
      setPwOpen(false);
      launchTest();
    } else setPwErr("Incorrect password");
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/tests/${test._id}`, { method: "DELETE" });
      toast({ title: "Test deleted", status: "success" });
      navigate(-1);
    } catch (e) {
      toast({ title: e.message, status: "error" });
    }
  };

  // ── Non-owner → instruction page ────────────────────────────────
  if (!isOwner) {
    return (
      <>
        <TestInfoPage
          test={test}
          stats={stats}
          onStart={handleStartTest}
          user={user}
          myResult={myResult}
          selectedLang={selectedLang}
          onLangChange={setSelectedLang}
        />
        <Modal isOpen={pwOpen} onClose={() => setPwOpen(false)} isCentered>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent
            borderRadius="16px"
            fontFamily="'Sora',sans-serif"
            mx={4}
          >
            <ModalHeader>
              <Flex align="center" gap={2}>
                <Icon as={FaLock} color="#4a72b8" />
                <Text>Enter Test Password</Text>
              </Flex>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={2}>
              <Input
                placeholder="Password"
                type="password"
                value={pwInput}
                onChange={(e) => {
                  setPwInput(e.target.value);
                  setPwErr("");
                }}
                onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
                borderColor={pwErr ? "red.400" : "#e2e8f0"}
                borderRadius="10px"
                h="44px"
                _focus={{
                  borderColor: "#4a72b8",
                  boxShadow: "0 0 0 1px #4a72b8",
                }}
              />
              {pwErr && (
                <Text fontSize="12px" color="red.500" mt={1}>
                  {pwErr}
                </Text>
              )}
            </ModalBody>
            <ModalFooter gap={3}>
              <Button variant="ghost" onClick={() => setPwOpen(false)}>
                Cancel
              </Button>
              <Button
                bg="#4a72b8"
                color="white"
                borderRadius="10px"
                fontWeight={700}
                onClick={verifyPassword}
                _hover={{ bg: "#3b5fa0" }}
              >
                Enter Test
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }

  // ── Owner dashboard ──────────────────────────────────────────────
  const TABS = ["overview", "leaderboard", "questions"];

  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
      {/* ── OWNER HERO ── */}
      <Box
        bg="linear-gradient(135deg,#0f1e3a 0%,#1e3a5f 50%,#2d5fa8 100%)"
        px={{ base: 4, md: 8 }}
        pt={{ base: 10, md: 14 }}
        pb={{ base: 14, md: 20 }}
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
        <Box maxW="1100px" mx="auto" position="relative" zIndex={1}>
          <Flex
            align="center"
            gap={2}
            mb={8}
            cursor="pointer"
            w="fit-content"
            color="rgba(255,255,255,.5)"
            _hover={{ color: "rgba(255,255,255,.9)" }}
            onClick={() => navigate(-1)}
          >
            <Icon as={FaArrowLeft} fontSize="12px" />
            <Text fontSize="13px" fontWeight={600}>
              Back
            </Text>
          </Flex>

          <Flex
            align="flex-start"
            gap={5}
            flexWrap={{ base: "wrap", md: "nowrap" }}
          >
            <Flex
              w={{ base: "56px", md: "72px" }}
              h={{ base: "56px", md: "72px" }}
              flexShrink={0}
              bg="rgba(255,255,255,.12)"
              border="2px solid rgba(255,255,255,.2)"
              borderRadius="18px"
              align="center"
              justify="center"
              fontSize={{ base: "24px", md: "32px" }}
            >
              📋
            </Flex>
            <Box flex={1}>
              <Flex align="center" gap={3} flexWrap="wrap" mb={3}>
                <Text
                  fontSize={{ base: "24px", md: "38px" }}
                  fontWeight={800}
                  color="white"
                  letterSpacing="-1px"
                  lineHeight="1.1"
                >
                  {test.title}
                </Text>
                <Flex
                  align="center"
                  gap={2}
                  bg="rgba(255,215,0,.15)"
                  border="1px solid rgba(255,215,0,.35)"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  <Icon as={FaCrown} color="gold" fontSize="12px" />
                  <Text fontSize="12px" fontWeight={700} color="gold">
                    Your Test
                  </Text>
                </Flex>
              </Flex>
              <Flex flexWrap="wrap" gap={3} mb={4}>
                {test.examType && (
                  <Flex align="center" gap={1.5}>
                    <Icon
                      as={FaBookOpen}
                      color="rgba(255,255,255,.5)"
                      fontSize="12px"
                    />
                    <Text color="rgba(255,255,255,.75)" fontSize="13px">
                      {test.examType}
                    </Text>
                  </Flex>
                )}
                <Flex align="center" gap={1.5}>
                  <Icon
                    as={FaClock}
                    color="rgba(255,255,255,.5)"
                    fontSize="12px"
                  />
                  <Text color="rgba(255,255,255,.75)" fontSize="13px">
                    {timeLimitMin} min
                  </Text>
                </Flex>
                <Flex align="center" gap={1.5}>
                  <Icon
                    as={FaClipboardList}
                    color="rgba(255,255,255,.5)"
                    fontSize="12px"
                  />
                  <Text color="rgba(255,255,255,.75)" fontSize="13px">
                    {test.questions?.length || 0} Questions
                  </Text>
                </Flex>
                <Flex align="center" gap={1.5}>
                  <Icon
                    as={isPrivate ? FaLock : FaUnlock}
                    color="rgba(255,255,255,.5)"
                    fontSize="12px"
                  />
                  <Text color="rgba(255,255,255,.75)" fontSize="13px">
                    {isPrivate ? "Private" : "Public"}
                  </Text>
                </Flex>
              </Flex>
              <Flex
                gap={8}
                borderTop="1px solid rgba(255,255,255,.1)"
                pt={6}
                flexWrap="wrap"
              >
                {[
                  {
                    icon: FaUsers,
                    v: stats?.totalAttempts ?? 0,
                    l: "Attempts",
                  },
                  {
                    icon: FaCheckCircle,
                    v: stats ? `${stats.passRate}%` : "—",
                    l: "Pass Rate",
                  },
                  {
                    icon: FaChartBar,
                    v: stats ? `${stats.avgPercentage}%` : "—",
                    l: "Avg Score",
                  },
                  {
                    icon: FaTrophy,
                    v: stats?.highestScore ? `${stats.highestScore}%` : "—",
                    l: "Top Score",
                  },
                ].map((s) => (
                  <Flex key={s.l} align="center" gap={3}>
                    <Icon
                      as={s.icon}
                      fontSize="14px"
                      color="rgba(255,255,255,.4)"
                    />
                    <Box>
                      <Text
                        fontSize="22px"
                        fontWeight={800}
                        color="white"
                        lineHeight="1"
                        letterSpacing="-1px"
                      >
                        {s.v}
                      </Text>
                      <Text
                        fontSize="10px"
                        color="rgba(255,255,255,.5)"
                        textTransform="uppercase"
                        letterSpacing=".8px"
                      >
                        {s.l}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Flex>

          {/* Share panel */}
          <Box
            mt={8}
            bg="rgba(255,255,255,.08)"
            border="1px solid rgba(255,255,255,.14)"
            borderRadius="16px"
            p={{ base: 4, md: 6 }}
          >
            <Text
              fontSize="11px"
              fontWeight={800}
              color="rgba(255,255,255,.4)"
              textTransform="uppercase"
              letterSpacing="2px"
              mb={4}
            >
              Share Test Link
            </Text>
            <Flex gap={3} flexWrap={{ base: "wrap", sm: "nowrap" }} mb={3}>
              <Box
                flex={1}
                bg="rgba(0,0,0,.3)"
                borderRadius="10px"
                px={4}
                py="11px"
                fontFamily="monospace"
                fontSize="12px"
                color="rgba(255,255,255,.8)"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
              >
                {isPrivate ? tokenUrl : shareUrl}
              </Box>
              <Button
                flexShrink={0}
                h="42px"
                px={5}
                borderRadius="10px"
                bg={copied ? "#22c55e" : "white"}
                color={copied ? "white" : "#1e3a5f"}
                fontWeight={800}
                fontSize="13px"
                leftIcon={
                  <Icon as={copied ? FaCheck : FaLink} fontSize="12px" />
                }
                onClick={() => handleCopy(isPrivate ? tokenUrl : shareUrl)}
                _hover={{ bg: copied ? "#16a34a" : "#f0f7ff" }}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </Flex>
            <Flex gap={3} flexWrap="wrap">
              <Button
                size="sm"
                leftIcon={<FaPlay />}
                bg="white"
                color="#0f1e3a"
                borderRadius="9px"
                fontWeight={700}
                onClick={launchTest}
                _hover={{ bg: "#f0f7ff" }}
              >
                Preview Test
              </Button>
              <Button
                size="sm"
                bg="transparent"
                color="#fca5a5"
                border="1px solid rgba(239,68,68,.3)"
                borderRadius="9px"
                fontWeight={700}
                onClick={() => setDelOpen(true)}
                _hover={{ bg: "rgba(239,68,68,.2)", color: "white" }}
              >
                Delete Test
              </Button>
            </Flex>
          </Box>
        </Box>
      </Box>

      {/* ── TABS ── */}
      <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Flex gap={2} mb={6} flexWrap="wrap">
          {TABS.map((t) => (
            <Box
              key={t}
              px={4}
              py="8px"
              borderRadius="10px"
              cursor="pointer"
              bg={tab === t ? "#4a72b8" : "white"}
              color={tab === t ? "white" : "#374151"}
              border="1px solid"
              borderColor={tab === t ? "#4a72b8" : "#e2e8f0"}
              fontSize="13px"
              fontWeight={tab === t ? 700 : 500}
              onClick={() => setTab(t)}
              transition="all .15s"
              _hover={{
                borderColor: "#4a72b8",
                color: tab === t ? "white" : "#4a72b8",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Box>
          ))}
        </Flex>

        {tab === "overview" && (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2,1fr)",
              lg: "repeat(4,1fr)",
            }}
            gap={4}
          >
            <StatCard
              icon={FaUsers}
              label="Attempts"
              value={stats?.totalAttempts ?? 0}
            />
            <StatCard
              icon={FaCheckCircle}
              label="Pass Rate"
              value={stats ? `${stats.passRate}%` : "—"}
              color="#16a34a"
              bg="#f0fdf4"
            />
            <StatCard
              icon={FaChartBar}
              label="Avg Score"
              value={stats ? `${stats.avgPercentage}%` : "—"}
              color="#7c3aed"
              bg="#f5f3ff"
            />
            <StatCard
              icon={FaFire}
              label="Top Score"
              value={stats?.highestScore ? `${stats.highestScore}%` : "—"}
              color="#ea580c"
              bg="#fff7ed"
            />
          </Grid>
        )}

        {tab === "leaderboard" && (
          <Box
            bg="white"
            borderRadius="16px"
            border="1px solid #e2e8f0"
            overflow="hidden"
          >
            <Flex
              px={6}
              py={4}
              align="center"
              gap={3}
              borderBottom="1px solid #f1f5f9"
            >
              <Icon as={FaTrophy} color="#f59e0b" />
              <Text fontSize="15px" fontWeight={800} color="#0f172a">
                Leaderboard
              </Text>
              <Badge colorScheme="blue" borderRadius="full">
                {leaderboard.length} entries
              </Badge>
            </Flex>
            {leaderboard.length === 0 ? (
              <Box py={16} textAlign="center">
                <Icon
                  as={FaTrophy}
                  fontSize="40px"
                  color="#e2e8f0"
                  display="block"
                  mx="auto"
                  mb={3}
                />
                <Text fontSize="14px" color="#94a3b8">
                  No attempts yet — be the first!
                </Text>
              </Box>
            ) : (
              leaderboard.map((r, i) => (
                <Box
                  key={r._id}
                  borderBottom={
                    i < leaderboard.length - 1 ? "1px solid #f1f5f9" : "none"
                  }
                >
                  <LeaderRow
                    rank={i + 1}
                    result={r}
                    currentUserId={user?._id}
                  />
                </Box>
              ))
            )}
          </Box>
        )}

        {tab === "questions" && (
          <Box
            bg="white"
            borderRadius="16px"
            border="1px solid #e2e8f0"
            overflow="hidden"
          >
            <Flex px={6} py={4} align="center" borderBottom="1px solid #f1f5f9">
              <Text fontSize="15px" fontWeight={800} color="#0f172a">
                Questions Preview
              </Text>
              <Badge ml={3} colorScheme="blue">
                {test.questions?.length}
              </Badge>
            </Flex>
            {test.questions?.map((q, i) => (
              <Box
                key={i}
                px={6}
                py={4}
                borderBottom={
                  i < test.questions.length - 1 ? "1px solid #f8fafc" : "none"
                }
              >
                <Flex gap={3} mb={2}>
                  <Text
                    fontSize="12px"
                    fontWeight={700}
                    color="#94a3b8"
                    w="20px"
                    flexShrink={0}
                  >
                    {i + 1}.
                  </Text>
                  <Text fontSize="14px" fontWeight={600} color="#0f172a">
                    {q.qus}
                  </Text>
                </Flex>
                <Flex flexWrap="wrap" gap={2} pl="23px">
                  {q.options?.map((opt, oi) => (
                    <Box
                      key={oi}
                      px={3}
                      py="4px"
                      borderRadius="7px"
                      fontSize="12px"
                      bg={oi === q.answer ? "#f0fdf4" : "#f8fafc"}
                      color={oi === q.answer ? "#16a34a" : "#64748b"}
                      border="1px solid"
                      borderColor={oi === q.answer ? "#86efac" : "#e2e8f0"}
                      fontWeight={oi === q.answer ? 700 : 400}
                    >
                      {String.fromCharCode(65 + oi)}. {opt}
                      {oi === q.answer && " ✓"}
                    </Box>
                  ))}
                </Flex>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Password Modal */}
      <Modal isOpen={pwOpen} onClose={() => setPwOpen(false)} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="16px" fontFamily="'Sora',sans-serif" mx={4}>
          <ModalHeader>
            <Flex align="center" gap={2}>
              <Icon as={FaLock} color="#4a72b8" />
              <Text>Enter Test Password</Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={2}>
            <Input
              placeholder="Password"
              type="password"
              value={pwInput}
              onChange={(e) => {
                setPwInput(e.target.value);
                setPwErr("");
              }}
              onKeyDown={(e) => e.key === "Enter" && verifyPassword()}
              borderColor={pwErr ? "red.400" : "#e2e8f0"}
              borderRadius="10px"
              h="44px"
              _focus={{
                borderColor: "#4a72b8",
                boxShadow: "0 0 0 1px #4a72b8",
              }}
            />
            {pwErr && (
              <Text fontSize="12px" color="red.500" mt={1}>
                {pwErr}
              </Text>
            )}
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={() => setPwOpen(false)}>
              Cancel
            </Button>
            <Button
              bg="#4a72b8"
              color="white"
              borderRadius="10px"
              fontWeight={700}
              onClick={verifyPassword}
              _hover={{ bg: "#3b5fa0" }}
            >
              Enter Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Dialog */}
      <AlertDialog
        isOpen={delOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setDelOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            mx={4}
            borderRadius="16px"
            fontFamily="'Sora',sans-serif"
          >
            <AlertDialogHeader fontSize="16px" fontWeight={800}>
              Delete Test?
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text fontSize="14px" color="#475569">
                This will permanently remove this test and all its results.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button
                ref={cancelRef}
                onClick={() => setDelOpen(false)}
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                bg="#ef4444"
                color="white"
                borderRadius="10px"
                fontWeight={700}
                onClick={handleDelete}
                _hover={{ bg: "#dc2626" }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}