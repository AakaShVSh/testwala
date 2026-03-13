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
  FaGlobe,
  FaChevronDown,
  FaEdit,
  FaSave,
  FaTimes,
  FaLanguage,
} from "react-icons/fa";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";

// ─── Language Options ─────────────────────────────────────────────
const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", flag: "🇮🇳" },
  { code: "gu", label: "Gujarati", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", flag: "🇮🇳" },
  { code: "te", label: "Telugu", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", flag: "🇮🇳" },
  { code: "ml", label: "Malayalam", flag: "🇮🇳" },
  { code: "pa", label: "Punjabi", flag: "🇮🇳" },
  { code: "ur", label: "Urdu", flag: "🇵🇰" },
  { code: "fr", label: "French", flag: "🇫🇷" },
  { code: "de", label: "German", flag: "🇩🇪" },
  { code: "es", label: "Spanish", flag: "🇪🇸" },
  { code: "ar", label: "Arabic", flag: "🇸🇦" },
  { code: "zh", label: "Chinese", flag: "🇨🇳" },
  { code: "ja", label: "Japanese", flag: "🇯🇵" },
];

// ─── Language Picker ──────────────────────────────────────────────
function LanguagePicker({ value, onChange, isOwner }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef();
  const current = LANGUAGES.find((l) => l.code === value) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = LANGUAGES.filter((l) =>
    l.label.toLowerCase().includes(search.toLowerCase()),
  );

  if (!isOwner) {
    return (
      <Flex
        align="center"
        gap={2}
        px={3}
        py="6px"
        bg="#f0f7ff"
        borderRadius="8px"
        border="1px solid #bdd7f5"
      >
        <Text fontSize="14px">{current.flag}</Text>
        <Text fontSize="13px" fontWeight={600} color="#1e3a5f">
          {current.label}
        </Text>
      </Flex>
    );
  }

  return (
    <Box position="relative" ref={ref}>
      <Flex
        align="center"
        gap={2}
        px={3}
        py="8px"
        bg="white"
        borderRadius="10px"
        border="1.5px solid"
        borderColor={open ? "#4a72b8" : "#e2e8f0"}
        cursor="pointer"
        onClick={() => setOpen(!open)}
        userSelect="none"
        boxShadow={open ? "0 0 0 3px rgba(74,114,184,.12)" : "none"}
        transition="all .15s"
        minW="160px"
        _hover={{ borderColor: "#4a72b8" }}
      >
        <Icon as={FaLanguage} color="#4a72b8" fontSize="13px" />
        <Text fontSize="14px">{current.flag}</Text>
        <Text fontSize="13px" fontWeight={700} color="#0f172a" flex={1}>
          {current.label}
        </Text>
        <Icon
          as={FaChevronDown}
          fontSize="10px"
          color="#94a3b8"
          transform={open ? "rotate(180deg)" : "none"}
          transition="transform .15s"
        />
      </Flex>

      {open && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left={0}
          zIndex={100}
          bg="white"
          borderRadius="12px"
          border="1px solid #e2e8f0"
          boxShadow="0 12px 40px rgba(0,0,0,.14)"
          minW="220px"
          overflow="hidden"
        >
          <Box px={3} pt={3} pb={2} borderBottom="1px solid #f1f5f9">
            <Input
              placeholder="Search language..."
              size="sm"
              borderRadius="8px"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fontSize="13px"
              autoFocus
              _focus={{
                borderColor: "#4a72b8",
                boxShadow: "0 0 0 1px #4a72b8",
              }}
            />
          </Box>
          <Box maxH="220px" overflowY="auto">
            {filtered.map((lang) => (
              <Flex
                key={lang.code}
                align="center"
                gap={3}
                px={4}
                py="10px"
                cursor="pointer"
                fontSize="13px"
                fontWeight={500}
                bg={lang.code === value ? "#eff6ff" : "transparent"}
                color={lang.code === value ? "#4a72b8" : "#374151"}
                _hover={{ bg: "#f8fafc" }}
                onClick={() => {
                  onChange(lang.code);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <Text fontSize="16px">{lang.flag}</Text>
                <Text flex={1}>{lang.label}</Text>
                {lang.code === value && (
                  <Icon as={FaCheck} fontSize="10px" color="#4a72b8" />
                )}
              </Flex>
            ))}
            {filtered.length === 0 && (
              <Box py={6} textAlign="center">
                <Text fontSize="13px" color="#94a3b8">
                  No language found
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  color = "#4a72b8",
  bg = "#eff6ff",
  trend,
}) {
  return (
    <Box
      bg={bg}
      borderRadius="16px"
      p={5}
      flex={1}
      minW="130px"
      border="1px solid"
      borderColor="rgba(0,0,0,.05)"
      transition="transform .15s, box-shadow .15s"
      _hover={{
        transform: "translateY(-2px)",
        boxShadow: "0 8px 24px rgba(0,0,0,.08)",
      }}
    >
      <Flex align="center" gap={2} mb={3}>
        <Flex
          w="34px"
          h="34px"
          bg="white"
          borderRadius="10px"
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
        fontSize="30px"
        fontWeight={900}
        color="#0f172a"
        letterSpacing="-1.5px"
        lineHeight="1"
      >
        {value}
      </Text>
      {trend && (
        <Text fontSize="11px" color={color} fontWeight={600} mt={1}>
          {trend}
        </Text>
      )}
    </Box>
  );
}

// ─── Leaderboard Row ──────────────────────────────────────────────
function LeaderRow({ rank, result, currentUserId }) {
  const name = result.studentId?.Name || result.studentId?.Email || "Student";
  const pct = result.scorePercentage ?? result.percentage ?? 0;
  const isMe = String(result.studentId?._id) === String(currentUserId);
  const medals = ["🥇", "🥈", "🥉"];
  const rankColor =
    rank === 1
      ? "#f59e0b"
      : rank === 2
        ? "#94a3b8"
        : rank === 3
          ? "#cd7f32"
          : "#cbd5e1";

  return (
    <Flex
      px={5}
      py={3.5}
      align="center"
      gap={4}
      bg={isMe ? "linear-gradient(90deg,#eff6ff,#f0fdf4)" : "transparent"}
      borderLeft={isMe ? "3px solid #4a72b8" : "3px solid transparent"}
      _hover={{
        bg: isMe ? "linear-gradient(90deg,#e0edff,#ecfdf5)" : "#f8fafc",
      }}
      transition="background .15s"
    >
      <Flex w="32px" align="center" justify="center" flexShrink={0}>
        {rank <= 3 ? (
          <Text fontSize="18px">{medals[rank - 1]}</Text>
        ) : (
          <Box
            w="28px"
            h="28px"
            borderRadius="8px"
            bg="#f1f5f9"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="11px" fontWeight={800} color="#94a3b8">
              {rank}
            </Text>
          </Box>
        )}
      </Flex>
      <Avatar
        size="sm"
        name={name}
        bg="#4a72b8"
        color="white"
        fontSize="11px"
      />
      <Box flex={1} minW={0}>
        <Flex align="center" gap={2} mb={1}>
          <Text fontSize="13px" fontWeight={700} color="#0f172a" noOfLines={1}>
            {name}
          </Text>
          {isMe && (
            <Badge colorScheme="blue" fontSize="9px" borderRadius="full">
              You
            </Badge>
          )}
        </Flex>
        <Progress
          value={pct}
          size="xs"
          colorScheme={pct >= 60 ? "green" : "red"}
          borderRadius="full"
          bg="#f1f5f9"
        />
      </Box>
      <Box textAlign="right" flexShrink={0}>
        <Text
          fontSize="15px"
          fontWeight={900}
          color={pct >= 60 ? "#16a34a" : "#dc2626"}
          letterSpacing="-0.5px"
        >
          {pct.toFixed(0)}%
        </Text>
        <Text fontSize="10px" color="#94a3b8">
          {result.timeTakenSec
            ? `${Math.floor(result.timeTakenSec / 60)}m ${result.timeTakenSec % 60}s`
            : "—"}
        </Text>
      </Box>
    </Flex>
  );
}

// ─── Section Header ───────────────────────────────────────────────
function SectionHeader({ icon, title, badge }) {
  return (
    <Flex px={6} py={4} align="center" gap={3} borderBottom="1px solid #f1f5f9">
      <Flex
        w="32px"
        h="32px"
        bg="#eff6ff"
        borderRadius="9px"
        align="center"
        justify="center"
      >
        <Icon as={icon} color="#4a72b8" fontSize="13px" />
      </Flex>
      <Text fontSize="15px" fontWeight={800} color="#0f172a">
        {title}
      </Text>
      {badge !== undefined && (
        <Badge colorScheme="blue" borderRadius="full" fontSize="11px" ml={1}>
          {badge}
        </Badge>
      )}
    </Flex>
  );
}

// ─── Detail Row ───────────────────────────────────────────────────
function DetailRow({ label, value, valueColor }) {
  return (
    <Flex
      justify="space-between"
      align="center"
      py={3}
      borderBottom="1px solid #f8fafc"
      _last={{ borderBottom: "none" }}
    >
      <Text fontSize="13px" color="#64748b" fontWeight={500}>
        {label}
      </Text>
      <Text fontSize="13px" fontWeight={700} color={valueColor || "#0f172a"}>
        {value}
      </Text>
    </Flex>
  );
}

// ─── TestInfoPage (non-owner landing) ─────────────────────────────
function TestInfoPage({
  test,
  stats,
  onStart,
  user,
  myResult,
  onLanguageChange,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const timeLimitMin = test.timeLimitMin || test.timeLimit || 30;
  const isPrivate =
    test.visibility === "private" || test.accessType === "private";
  const questionCount = test.questions?.length || 0;
  const currentLang =
    LANGUAGES.find((l) => l.code === test.language) || LANGUAGES[0];

  const RULES = [
    "Do not switch tabs or windows during the test.",
    "Test will auto-submit when time runs out.",
    "You can mark questions for review and revisit them.",
    "Each question carries equal marks.",
    "No negative marking applies.",
    "Keep your internet connection stable throughout.",
  ];

  return (
    <Box minH="100vh" bg="#f0f4fa" fontFamily="'DM Sans', sans-serif">
      {/* Hero Banner */}
      <Box
        bg="linear-gradient(145deg, #0a1628 0%, #0f2347 40%, #1a3a6e 70%, #1e4d8c 100%)"
        px={{ base: 4, md: 8 }}
        pt={{ base: 10, md: 14 }}
        pb={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative blobs */}
        <Box
          position="absolute"
          right="-100px"
          top="-60px"
          w="350px"
          h="350px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(74,114,184,.18) 0%, transparent 70%)"
        />
        <Box
          position="absolute"
          left="-80px"
          bottom="-80px"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(100,140,220,.12) 0%, transparent 70%)"
        />
        {/* Grid pattern overlay */}
        <Box
          position="absolute"
          inset={0}
          opacity={0.04}
          bgImage="linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)"
          bgSize="40px 40px"
        />

        <Box maxW="820px" mx="auto" position="relative" zIndex={1}>
          <Flex
            align="center"
            gap={2}
            mb={8}
            cursor="pointer"
            w="fit-content"
            color="rgba(255,255,255,.4)"
            _hover={{ color: "rgba(255,255,255,.85)" }}
            onClick={() => navigate(-1)}
            transition="color .15s"
          >
            <Icon as={FaArrowLeft} fontSize="11px" />
            <Text
              fontSize="12px"
              fontWeight={600}
              letterSpacing=".5px"
              textTransform="uppercase"
            >
              Back
            </Text>
          </Flex>

          <Flex
            align="flex-start"
            gap={5}
            flexWrap={{ base: "wrap", sm: "nowrap" }}
          >
            <Flex
              w={{ base: "60px", md: "76px" }}
              h={{ base: "60px", md: "76px" }}
              flexShrink={0}
              bg="linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.06))"
              border="1.5px solid rgba(255,255,255,.2)"
              borderRadius="20px"
              align="center"
              justify="center"
              fontSize={{ base: "26px", md: "32px" }}
              boxShadow="0 8px 32px rgba(0,0,0,.3)"
            >
              📋
            </Flex>
            <Box flex={1}>
              <Flex align="center" gap={3} flexWrap="wrap" mb={2}>
                {test.examType && (
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="rgba(255,255,255,.12)"
                    color="rgba(255,255,255,.85)"
                    fontSize="11px"
                    fontWeight={700}
                    letterSpacing=".5px"
                  >
                    {test.examType}
                  </Badge>
                )}
                <Badge
                  px={3}
                  py={1}
                  borderRadius="full"
                  bg={
                    isPrivate ? "rgba(251,191,36,.12)" : "rgba(34,197,94,.12)"
                  }
                  color={isPrivate ? "#fbbf24" : "#4ade80"}
                  fontSize="11px"
                  fontWeight={700}
                >
                  {isPrivate ? "🔒 Private" : "🌐 Public"}
                </Badge>
              </Flex>
              <Text
                fontSize={{ base: "24px", md: "40px" }}
                fontWeight={900}
                color="white"
                letterSpacing="-1.5px"
                lineHeight="1.1"
                mb={3}
              >
                {test.title}
              </Text>
              <Flex align="center" gap={2} flexWrap="wrap">
                <Flex
                  align="center"
                  gap={1.5}
                  bg="rgba(255,255,255,.08)"
                  px={3}
                  py="5px"
                  borderRadius="full"
                  border="1px solid rgba(255,255,255,.12)"
                >
                  <Text fontSize="13px">{currentLang.flag}</Text>
                  <Text
                    fontSize="12px"
                    fontWeight={600}
                    color="rgba(255,255,255,.75)"
                  >
                    {currentLang.label}
                  </Text>
                </Flex>
                {test.subject && (
                  <Flex
                    align="center"
                    gap={1.5}
                    bg="rgba(255,255,255,.08)"
                    px={3}
                    py="5px"
                    borderRadius="full"
                    border="1px solid rgba(255,255,255,.12)"
                  >
                    <Icon
                      as={FaBookOpen}
                      color="rgba(255,255,255,.5)"
                      fontSize="11px"
                    />
                    <Text
                      fontSize="12px"
                      fontWeight={600}
                      color="rgba(255,255,255,.75)"
                    >
                      {test.subject.charAt(0).toUpperCase() +
                        test.subject.slice(1)}
                    </Text>
                  </Flex>
                )}
              </Flex>
            </Box>
          </Flex>

          {/* Hero stats strip */}
          <Flex
            gap={{ base: 6, md: 12 }}
            mt={10}
            borderTop="1px solid rgba(255,255,255,.08)"
            pt={8}
            flexWrap="wrap"
          >
            {[
              { icon: FaClipboardList, v: questionCount, l: "Questions" },
              { icon: FaClock, v: `${timeLimitMin} min`, l: "Duration" },
              { icon: FaUsers, v: stats?.totalAttempts ?? 0, l: "Attempts" },
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
                <Flex
                  w="36px"
                  h="36px"
                  bg="rgba(255,255,255,.08)"
                  borderRadius="10px"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon
                    as={s.icon}
                    fontSize="14px"
                    color="rgba(255,255,255,.5)"
                  />
                </Flex>
                <Box>
                  <Text
                    fontSize={{ base: "20px", md: "24px" }}
                    fontWeight={900}
                    color="white"
                    lineHeight="1"
                    letterSpacing="-1px"
                  >
                    {s.v}
                  </Text>
                  <Text
                    fontSize="10px"
                    color="rgba(255,255,255,.4)"
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
      </Box>

      {/* Body */}
      <Box maxW="820px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        <Grid
          templateColumns={{ base: "1fr", md: "1fr 320px" }}
          gap={6}
          alignItems="start"
        >
          {/* Left column */}
          <Box>
            {/* Test Details Card */}
            <Box
              bg="white"
              borderRadius="18px"
              border="1px solid #e8eef7"
              overflow="hidden"
              mb={5}
              boxShadow="0 2px 16px rgba(0,0,0,.04)"
            >
              <SectionHeader icon={FaInfoCircle} title="Test Details" />
              <Box px={6} py={4}>
                <Grid templateColumns="1fr 1fr" gap={0}>
                  {[
                    { label: "Total Questions", value: questionCount },
                    { label: "Duration", value: `${timeLimitMin} minutes` },
                    { label: "Total Marks", value: `${questionCount} marks` },
                    { label: "Pass Mark", value: "40%", valueColor: "#16a34a" },
                    { label: "Exam Type", value: test.examType || "General" },
                    {
                      label: "Subject",
                      value: test.subject
                        ? test.subject.charAt(0).toUpperCase() +
                          test.subject.slice(1)
                        : "General",
                    },
                    {
                      label: "Access Type",
                      value: isPrivate ? "🔒 Private" : "🌐 Public",
                    },
                    {
                      label: "Language",
                      value: `${currentLang.flag} ${currentLang.label}`,
                    },
                  ].map(({ label, value, valueColor }, i) => (
                    <Box
                      key={label}
                      px={0}
                      py={3}
                      borderBottom="1px solid #f8fafc"
                      borderRight={i % 2 === 0 ? "1px solid #f8fafc" : "none"}
                      pr={i % 2 === 0 ? 6 : 0}
                      pl={i % 2 === 1 ? 6 : 0}
                    >
                      <Text
                        fontSize="11px"
                        fontWeight={700}
                        color="#94a3b8"
                        textTransform="uppercase"
                        letterSpacing=".7px"
                        mb={1}
                      >
                        {label}
                      </Text>
                      <Text
                        fontSize="14px"
                        fontWeight={700}
                        color={valueColor || "#0f172a"}
                      >
                        {value}
                      </Text>
                    </Box>
                  ))}
                </Grid>
              </Box>
            </Box>

            {/* Instructions Card */}
            <Box
              bg="white"
              borderRadius="18px"
              border="1px solid #e8eef7"
              overflow="hidden"
              boxShadow="0 2px 16px rgba(0,0,0,.04)"
            >
              <SectionHeader icon={FaShieldAlt} title="Instructions" />
              <Box px={6} py={5}>
                <Box
                  bg="linear-gradient(135deg, #f0f7ff, #f8faff)"
                  borderRadius="12px"
                  p={5}
                  border="1px solid #dbeafe"
                >
                  {RULES.map((rule, i) => (
                    <Flex
                      key={i}
                      gap={3}
                      mb={i < RULES.length - 1 ? 4 : 0}
                      align="flex-start"
                    >
                      <Flex
                        w="22px"
                        h="22px"
                        bg="linear-gradient(135deg,#4a72b8,#2d5fa8)"
                        borderRadius="7px"
                        align="center"
                        justify="center"
                        flexShrink={0}
                        mt="1px"
                      >
                        <Text fontSize="10px" fontWeight={900} color="white">
                          {i + 1}
                        </Text>
                      </Flex>
                      <Text
                        fontSize="13px"
                        color="#374151"
                        lineHeight="1.6"
                        fontWeight={500}
                      >
                        {rule}
                      </Text>
                    </Flex>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right sidebar */}
          <Box>
            {/* Action card */}
            <Box
              bg="white"
              borderRadius="18px"
              border="1px solid #e8eef7"
              p={6}
              position={{ md: "sticky" }}
              top={{ md: "20px" }}
              boxShadow="0 8px 32px rgba(0,0,0,.08)"
            >
              {myResult ? (
                <Box
                  mb={5}
                  p={4}
                  bg="linear-gradient(135deg,#f0fdf4,#ecfdf5)"
                  borderRadius="12px"
                  border="1px solid #86efac"
                  textAlign="center"
                >
                  <Flex align="center" justify="center" gap={2} mb={2}>
                    <Icon as={FaCheckCircle} color="#16a34a" fontSize="12px" />
                    <Text
                      fontSize="11px"
                      fontWeight={700}
                      color="#16a34a"
                      textTransform="uppercase"
                      letterSpacing=".8px"
                    >
                      Previous Attempt
                    </Text>
                  </Flex>
                  <Text
                    fontSize="40px"
                    fontWeight={900}
                    color="#16a34a"
                    letterSpacing="-2px"
                    lineHeight="1"
                  >
                    {(
                      myResult.scorePercentage ??
                      myResult.percentage ??
                      0
                    ).toFixed(0)}
                    %
                  </Text>
                  <Text fontSize="12px" color="#64748b" mt={1}>
                    {myResult.correct ?? myResult.correctQus?.length ?? 0}/
                    {questionCount} correct
                  </Text>
                  <Progress
                    value={myResult.scorePercentage ?? myResult.percentage ?? 0}
                    size="xs"
                    colorScheme="green"
                    borderRadius="full"
                    mt={3}
                  />
                </Box>
              ) : (
                <Box mb={5} textAlign="center" py={2}>
                  <Box fontSize="52px" mb={3} lineHeight="1">
                    🎯
                  </Box>
                  <Text
                    fontSize="17px"
                    fontWeight={800}
                    color="#0f172a"
                    mb={1}
                    letterSpacing="-0.5px"
                  >
                    Ready to begin?
                  </Text>
                  <Text fontSize="13px" color="#64748b">
                    {questionCount} questions · {timeLimitMin} min
                  </Text>
                </Box>
              )}

              {!user ? (
                <>
                  <Text
                    fontSize="13px"
                    color="#64748b"
                    mb={4}
                    textAlign="center"
                  >
                    Sign in to take this test
                  </Text>
                  <Button
                    w="full"
                    h="52px"
                    borderRadius="14px"
                    bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
                    color="white"
                    fontWeight={800}
                    fontSize="15px"
                    leftIcon={<FaPlay />}
                    mb={3}
                    onClick={onStart}
                    _hover={{
                      opacity: 0.9,
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 28px rgba(74,114,184,.4)",
                    }}
                    transition="all .2s"
                  >
                    Sign In to Start
                  </Button>
                  <Button
                    w="full"
                    h="44px"
                    borderRadius="12px"
                    variant="outline"
                    borderColor="#4a72b8"
                    color="#4a72b8"
                    fontWeight={700}
                    fontSize="14px"
                    _hover={{ bg: "#eff6ff" }}
                  >
                    Create Account
                  </Button>
                </>
              ) : (
                <Button
                  w="full"
                  h="56px"
                  borderRadius="14px"
                  bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
                  color="white"
                  fontWeight={900}
                  fontSize="16px"
                  leftIcon={<FaPlay />}
                  onClick={onStart}
                  _hover={{
                    opacity: 0.9,
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 32px rgba(74,114,184,.4)",
                  }}
                  transition="all .2s"
                  letterSpacing="-0.3px"
                >
                  {myResult ? "Retake Test" : "Start Test"}
                </Button>
              )}

              {user && (
                <Text fontSize="11px" color="#94a3b8" mt={3} textAlign="center">
                  Signed in as{" "}
                  <Box as="span" fontWeight={700} color="#64748b">
                    {user.Name || user.Email}
                  </Box>
                </Text>
              )}
            </Box>

            {/* Stats card */}
            {stats && stats.totalAttempts > 0 && (
              <Box
                bg="white"
                borderRadius="18px"
                border="1px solid #e8eef7"
                overflow="hidden"
                mt={4}
                boxShadow="0 2px 16px rgba(0,0,0,.04)"
              >
                <SectionHeader icon={FaChartBar} title="Live Stats" />
                <Box px={6} py={4}>
                  {[
                    {
                      label: "Total Attempts",
                      value: stats.totalAttempts,
                      color: "#4a72b8",
                    },
                    {
                      label: "Pass Rate",
                      value: `${stats.passRate}%`,
                      color: "#16a34a",
                    },
                    {
                      label: "Average Score",
                      value: `${stats.avgPercentage}%`,
                      color: "#7c3aed",
                    },
                    {
                      label: "Highest Score",
                      value: `${stats.highestScore}%`,
                      color: "#ea580c",
                    },
                  ].map(({ label, value, color }) => (
                    <DetailRow
                      key={label}
                      label={label}
                      value={value}
                      valueColor={color}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════
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
  const [tab, setTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const [savingLang, setSavingLang] = useState(false);
  const [localLang, setLocalLang] = useState(null);

  const viaToken = Boolean(location.state?.viaToken);

  const load = useCallback(async () => {
    try {
      let testData = null;
      const isObjectId = /^[a-f\d]{24}$/i.test(id);
      if (isObjectId) {
        try {
          const res = await apiFetch(`/tests/id/${id}`);
          testData = res.data;
        } catch (e) {
          throw e;
        }
      } else {
        try {
          const res = await apiFetch(`/tests/${id}`);
          testData = res.data;
        } catch (e) {
          if (user?._id) {
            const res = await apiFetch(`/tests/id/${id}`);
            testData = res.data;
          } else throw e;
        }
      }
      setTest(testData);
      setLocalLang(testData.language || "en");
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
      <Flex
        minH="80vh"
        align="center"
        justify="center"
        flexDir="column"
        gap={4}
      >
        <Spinner size="xl" color="#4a72b8" thickness="4px" speed=".65s" />
        <Text fontSize="13px" color="#94a3b8" fontFamily="'DM Sans',sans-serif">
          Loading test...
        </Text>
      </Flex>
    );

  if (!test)
    return (
      <Box textAlign="center" py={20} fontFamily="'DM Sans',sans-serif">
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
  const currentLang =
    LANGUAGES.find((l) => l.code === localLang) || LANGUAGES[0];
  const langChanged = localLang !== (test.language || "en");

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const launchTest = () => {
    if (!test.questions || test.questions.length === 0) {
      toast({ title: "This test has no questions yet.", status: "error" });
      return;
    }
    navigate("/test", {
      state: {
        quest: test.questions,
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
      toast({ title: "Test deleted successfully", status: "success" });
      navigate(-1);
    } catch (e) {
      toast({ title: e.message, status: "error" });
    }
  };

  const handleSaveLanguage = async () => {
    setSavingLang(true);
    try {
      await apiFetch(`/tests/${test._id}`, {
        method: "PATCH",
        body: JSON.stringify({ language: localLang }),
      });
      setTest((prev) => ({ ...prev, language: localLang }));
      toast({
        title: `Language updated to ${currentLang.label}`,
        status: "success",
        duration: 2500,
      });
    } catch (e) {
      toast({ title: e.message, status: "error" });
    } finally {
      setSavingLang(false);
    }
  };

  // Non-owner view
  if (!isOwner) {
    return (
      <>
        <TestInfoPage
          test={test}
          stats={stats}
          onStart={handleStartTest}
          user={user}
          myResult={myResult}
          onLanguageChange={() => {}}
        />
        <Modal isOpen={pwOpen} onClose={() => setPwOpen(false)} isCentered>
          <ModalOverlay backdropFilter="blur(6px)" />
          <ModalContent
            borderRadius="18px"
            fontFamily="'DM Sans',sans-serif"
            mx={4}
          >
            <ModalHeader>
              <Flex align="center" gap={2}>
                <Flex
                  w="32px"
                  h="32px"
                  bg="#eff6ff"
                  borderRadius="9px"
                  align="center"
                  justify="center"
                >
                  <Icon as={FaLock} color="#4a72b8" fontSize="13px" />
                </Flex>
                <Text fontSize="16px" fontWeight={800}>
                  Enter Test Password
                </Text>
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
                h="46px"
                fontFamily="'DM Sans',sans-serif"
                fontSize="14px"
                _focus={{
                  borderColor: "#4a72b8",
                  boxShadow: "0 0 0 3px rgba(74,114,184,.12)",
                }}
              />
              {pwErr && (
                <Text fontSize="12px" color="red.500" mt={1.5}>
                  {pwErr}
                </Text>
              )}
            </ModalBody>
            <ModalFooter gap={3}>
              <Button
                variant="ghost"
                onClick={() => setPwOpen(false)}
                fontWeight={600}
              >
                Cancel
              </Button>
              <Button
                bg="#4a72b8"
                color="white"
                borderRadius="10px"
                fontWeight={800}
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

  // ── Owner dashboard ───────────────────────────────────────────────
  const TABS = [
    { key: "overview", label: "Overview", icon: FaChartBar },
    { key: "details", label: "Details", icon: FaInfoCircle },
    { key: "leaderboard", label: "Leaderboard", icon: FaTrophy },
    { key: "questions", label: "Questions", icon: FaClipboardList },
    { key: "settings", label: "Settings", icon: FaEdit },
  ];

  return (
    <Box minH="100vh" bg="#f0f4fa" fontFamily="'DM Sans', sans-serif">
      {/* Hero */}
      <Box
        bg="linear-gradient(145deg, #0a1628 0%, #0f2347 40%, #1a3a6e 70%, #1e4d8c 100%)"
        px={{ base: 4, md: 8 }}
        pt={{ base: 10, md: 14 }}
        pb={{ base: 16, md: 24 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          right="-100px"
          top="-60px"
          w="380px"
          h="380px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(74,114,184,.2) 0%, transparent 70%)"
        />
        <Box
          position="absolute"
          left="-60px"
          bottom="-80px"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="radial-gradient(circle, rgba(100,140,220,.12) 0%, transparent 70%)"
        />
        <Box
          position="absolute"
          inset={0}
          opacity={0.04}
          bgImage="linear-gradient(rgba(255,255,255,.3) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.3) 1px,transparent 1px)"
          bgSize="40px 40px"
        />

        <Box maxW="1120px" mx="auto" position="relative" zIndex={1}>
          <Flex
            align="center"
            gap={2}
            mb={8}
            cursor="pointer"
            w="fit-content"
            color="rgba(255,255,255,.4)"
            _hover={{ color: "rgba(255,255,255,.85)" }}
            onClick={() => navigate(-1)}
            transition="color .15s"
          >
            <Icon as={FaArrowLeft} fontSize="11px" />
            <Text
              fontSize="12px"
              fontWeight={600}
              textTransform="uppercase"
              letterSpacing=".5px"
            >
              Back
            </Text>
          </Flex>

          <Flex
            align="flex-start"
            gap={5}
            flexWrap={{ base: "wrap", md: "nowrap" }}
          >
            <Flex
              w={{ base: "60px", md: "80px" }}
              h={{ base: "60px", md: "80px" }}
              flexShrink={0}
              bg="linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.06))"
              border="1.5px solid rgba(255,255,255,.2)"
              borderRadius="20px"
              align="center"
              justify="center"
              fontSize={{ base: "26px", md: "36px" }}
              boxShadow="0 8px 32px rgba(0,0,0,.3)"
            >
              📋
            </Flex>
            <Box flex={1}>
              <Flex align="center" gap={3} flexWrap="wrap" mb={2}>
                <Flex
                  align="center"
                  gap={2}
                  bg="linear-gradient(135deg,rgba(255,215,0,.15),rgba(255,215,0,.08))"
                  border="1px solid rgba(255,215,0,.3)"
                  px={3}
                  py="5px"
                  borderRadius="full"
                >
                  <Icon as={FaCrown} color="gold" fontSize="11px" />
                  <Text
                    fontSize="11px"
                    fontWeight={800}
                    color="gold"
                    letterSpacing=".5px"
                  >
                    YOUR TEST
                  </Text>
                </Flex>
                {test.examType && (
                  <Badge
                    px={3}
                    py={1}
                    borderRadius="full"
                    bg="rgba(255,255,255,.1)"
                    color="rgba(255,255,255,.8)"
                    fontSize="11px"
                    fontWeight={700}
                  >
                    {test.examType}
                  </Badge>
                )}
              </Flex>
              <Text
                fontSize={{ base: "26px", md: "42px" }}
                fontWeight={900}
                color="white"
                letterSpacing="-2px"
                lineHeight="1.05"
                mb={4}
              >
                {test.title}
              </Text>
              <Flex flexWrap="wrap" gap={2} mb={6}>
                {[
                  { icon: FaClock, v: `${timeLimitMin} min` },
                  {
                    icon: FaClipboardList,
                    v: `${test.questions?.length || 0} Q's`,
                  },
                  {
                    icon: isPrivate ? FaLock : FaUnlock,
                    v: isPrivate ? "Private" : "Public",
                  },
                  { icon: FaGlobe, v: currentLang.label },
                ].map(({ icon, v }) => (
                  <Flex
                    key={v}
                    align="center"
                    gap={1.5}
                    bg="rgba(255,255,255,.08)"
                    border="1px solid rgba(255,255,255,.1)"
                    px={3}
                    py="5px"
                    borderRadius="full"
                  >
                    <Icon
                      as={icon}
                      color="rgba(255,255,255,.5)"
                      fontSize="11px"
                    />
                    <Text
                      fontSize="12px"
                      fontWeight={600}
                      color="rgba(255,255,255,.8)"
                    >
                      {v}
                    </Text>
                  </Flex>
                ))}
              </Flex>

              {/* Stats strip */}
              <Flex
                gap={{ base: 6, md: 12 }}
                borderTop="1px solid rgba(255,255,255,.08)"
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
                    <Flex
                      w="36px"
                      h="36px"
                      bg="rgba(255,255,255,.08)"
                      borderRadius="10px"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      <Icon
                        as={s.icon}
                        fontSize="14px"
                        color="rgba(255,255,255,.5)"
                      />
                    </Flex>
                    <Box>
                      <Text
                        fontSize={{ base: "20px", md: "24px" }}
                        fontWeight={900}
                        color="white"
                        lineHeight="1"
                        letterSpacing="-1px"
                      >
                        {s.v}
                      </Text>
                      <Text
                        fontSize="10px"
                        color="rgba(255,255,255,.4)"
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
            bg="rgba(255,255,255,.07)"
            border="1px solid rgba(255,255,255,.12)"
            borderRadius="18px"
            p={{ base: 4, md: 6 }}
          >
            <Text
              fontSize="10px"
              fontWeight={800}
              color="rgba(255,255,255,.35)"
              textTransform="uppercase"
              letterSpacing="2px"
              mb={4}
            >
              Share Test Link
            </Text>
            <Flex gap={3} flexWrap={{ base: "wrap", sm: "nowrap" }} mb={4}>
              <Box
                flex={1}
                bg="rgba(0,0,0,.35)"
                borderRadius="12px"
                px={4}
                py="12px"
                fontFamily="monospace"
                fontSize="12px"
                color="rgba(255,255,255,.7)"
                overflow="hidden"
                textOverflow="ellipsis"
                whiteSpace="nowrap"
                border="1px solid rgba(255,255,255,.08)"
              >
                {isPrivate ? tokenUrl : shareUrl}
              </Box>
              <Button
                flexShrink={0}
                h="44px"
                px={6}
                borderRadius="12px"
                bg={copied ? "#22c55e" : "white"}
                color={copied ? "white" : "#1e3a5f"}
                fontWeight={800}
                fontSize="13px"
                leftIcon={
                  <Icon as={copied ? FaCheck : FaLink} fontSize="12px" />
                }
                onClick={() => handleCopy(isPrivate ? tokenUrl : shareUrl)}
                _hover={{ bg: copied ? "#16a34a" : "#f0f7ff" }}
                transition="all .15s"
              >
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </Flex>
            <Flex gap={3} flexWrap="wrap">
              <Button
                size="sm"
                h="36px"
                px={4}
                leftIcon={<FaPlay />}
                bg="white"
                color="#0f1e3a"
                borderRadius="10px"
                fontWeight={700}
                onClick={launchTest}
                _hover={{ bg: "#f0f7ff" }}
              >
                Preview Test
              </Button>
              <Button
                size="sm"
                h="36px"
                px={4}
                bg="transparent"
                color="#fca5a5"
                border="1px solid rgba(239,68,68,.3)"
                borderRadius="10px"
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

      {/* Tabs */}
      <Box maxW="1120px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        {/* Tab nav */}
        <Box
          bg="white"
          borderRadius="14px"
          border="1px solid #e8eef7"
          p="5px"
          mb={6}
          display="inline-flex"
          gap={1}
          flexWrap="wrap"
          boxShadow="0 2px 12px rgba(0,0,0,.04)"
        >
          {TABS.map((t) => (
            <Flex
              key={t.key}
              align="center"
              gap={2}
              px={4}
              py="8px"
              borderRadius="10px"
              cursor="pointer"
              transition="all .15s"
              bg={
                tab === t.key
                  ? "linear-gradient(135deg,#4a72b8,#1e3a5f)"
                  : "transparent"
              }
              color={tab === t.key ? "white" : "#64748b"}
              fontWeight={tab === t.key ? 800 : 500}
              fontSize="13px"
              _hover={{
                bg: tab === t.key ? undefined : "#f8fafc",
                color: tab === t.key ? "white" : "#374151",
              }}
              onClick={() => setTab(t.key)}
            >
              <Icon as={t.icon} fontSize="11px" />
              <Text>{t.label}</Text>
            </Flex>
          ))}
        </Box>

        {/* Overview */}
        {tab === "overview" && (
          <Box>
            <Grid
              templateColumns={{ base: "1fr 1fr", md: "repeat(4, 1fr)" }}
              gap={4}
              mb={6}
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

            {/* Quick info cards */}
            <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
              <Box
                bg="white"
                borderRadius="18px"
                border="1px solid #e8eef7"
                overflow="hidden"
                boxShadow="0 2px 16px rgba(0,0,0,.04)"
              >
                <SectionHeader icon={FaInfoCircle} title="Quick Info" />
                <Box px={6} py={2}>
                  <DetailRow
                    label="Questions"
                    value={test.questions?.length || 0}
                  />
                  <DetailRow
                    label="Duration"
                    value={`${timeLimitMin} minutes`}
                  />
                  <DetailRow
                    label="Subject"
                    value={test.subject || "General"}
                  />
                  <DetailRow
                    label="Exam Type"
                    value={test.examType || "General"}
                  />
                  <DetailRow
                    label="Language"
                    value={`${currentLang.flag} ${currentLang.label}`}
                  />
                  <DetailRow
                    label="Access"
                    value={isPrivate ? "🔒 Private" : "🌐 Public"}
                  />
                </Box>
              </Box>
              <Box
                bg="white"
                borderRadius="18px"
                border="1px solid #e8eef7"
                overflow="hidden"
                boxShadow="0 2px 16px rgba(0,0,0,.04)"
              >
                <SectionHeader
                  icon={FaTrophy}
                  title="Top Performers"
                  badge={leaderboard.length}
                />
                {leaderboard.length === 0 ? (
                  <Box py={10} textAlign="center">
                    <Text fontSize="32px" mb={2}>
                      🏆
                    </Text>
                    <Text fontSize="13px" color="#94a3b8">
                      No attempts yet
                    </Text>
                  </Box>
                ) : (
                  leaderboard.slice(0, 3).map((r, i) => (
                    <Box
                      key={r._id}
                      borderBottom={
                        i < Math.min(2, leaderboard.length - 1)
                          ? "1px solid #f1f5f9"
                          : "none"
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
            </Grid>
          </Box>
        )}

        {/* Details tab */}
        {tab === "details" && (
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
            <Box
              bg="white"
              borderRadius="18px"
              border="1px solid #e8eef7"
              overflow="hidden"
              boxShadow="0 2px 16px rgba(0,0,0,.04)"
            >
              <SectionHeader icon={FaClipboardList} title="Test Information" />
              <Box px={6} py={2}>
                <DetailRow
                  label="Test ID"
                  value={test._id?.slice(-8).toUpperCase()}
                />
                <DetailRow label="Title" value={test.title} />
                <DetailRow label="Subject" value={test.subject || "General"} />
                <DetailRow
                  label="Exam Type"
                  value={test.examType || "General"}
                />
                <DetailRow
                  label="Questions"
                  value={test.questions?.length || 0}
                />
                <DetailRow label="Duration" value={`${timeLimitMin} minutes`} />
                <DetailRow
                  label="Total Marks"
                  value={`${test.questions?.length || 0} marks`}
                />
                <DetailRow label="Pass Mark" value="40%" valueColor="#16a34a" />
              </Box>
            </Box>

            <Box
              bg="white"
              borderRadius="18px"
              border="1px solid #e8eef7"
              overflow="hidden"
              boxShadow="0 2px 16px rgba(0,0,0,.04)"
            >
              <SectionHeader icon={FaShieldAlt} title="Access & Security" />
              <Box px={6} py={2}>
                <DetailRow
                  label="Access Type"
                  value={isPrivate ? "🔒 Private" : "🌐 Public"}
                  valueColor={isPrivate ? "#f59e0b" : "#16a34a"}
                />
                <DetailRow
                  label="Password Protected"
                  value={test.password ? "Yes" : "No"}
                  valueColor={test.password ? "#ef4444" : "#16a34a"}
                />
                <DetailRow
                  label="Access Token"
                  value={test.accessToken ? "Active" : "None"}
                  valueColor={test.accessToken ? "#4a72b8" : "#94a3b8"}
                />
                <DetailRow
                  label="Language"
                  value={`${currentLang.flag} ${currentLang.label}`}
                />
                <DetailRow label="Slug" value={test.slug || "—"} />
                <DetailRow
                  label="Visibility"
                  value={test.visibility || "public"}
                />
              </Box>
            </Box>

            {stats && (
              <Box
                bg="white"
                borderRadius="18px"
                border="1px solid #e8eef7"
                overflow="hidden"
                boxShadow="0 2px 16px rgba(0,0,0,.04)"
              >
                <SectionHeader icon={FaChartBar} title="Performance Stats" />
                <Box px={6} py={2}>
                  <DetailRow
                    label="Total Attempts"
                    value={stats.totalAttempts}
                  />
                  <DetailRow
                    label="Pass Rate"
                    value={`${stats.passRate}%`}
                    valueColor="#16a34a"
                  />
                  <DetailRow
                    label="Fail Rate"
                    value={`${100 - stats.passRate}%`}
                    valueColor="#ef4444"
                  />
                  <DetailRow
                    label="Average Score"
                    value={`${stats.avgPercentage}%`}
                    valueColor="#7c3aed"
                  />
                  <DetailRow
                    label="Highest Score"
                    value={`${stats.highestScore}%`}
                    valueColor="#ea580c"
                  />
                  <DetailRow
                    label="Lowest Score"
                    value={stats.lowestScore ? `${stats.lowestScore}%` : "—"}
                  />
                </Box>
              </Box>
            )}
          </Grid>
        )}

        {/* Leaderboard */}
        {tab === "leaderboard" && (
          <Box
            bg="white"
            borderRadius="18px"
            border="1px solid #e8eef7"
            overflow="hidden"
            boxShadow="0 2px 16px rgba(0,0,0,.04)"
          >
            <SectionHeader
              icon={FaTrophy}
              title="Leaderboard"
              badge={leaderboard.length}
            />
            {leaderboard.length === 0 ? (
              <Box py={20} textAlign="center">
                <Text fontSize="48px" mb={3}>
                  🏆
                </Text>
                <Text fontSize="15px" fontWeight={700} color="#374151" mb={1}>
                  No attempts yet
                </Text>
                <Text fontSize="13px" color="#94a3b8">
                  Share the test link to get your first student!
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

        {/* Questions */}
        {tab === "questions" && (
          <Box
            bg="white"
            borderRadius="18px"
            border="1px solid #e8eef7"
            overflow="hidden"
            boxShadow="0 2px 16px rgba(0,0,0,.04)"
          >
            <SectionHeader
              icon={FaClipboardList}
              title="Questions Preview"
              badge={test.questions?.length}
            />
            {test.questions?.map((q, i) => (
              <Box
                key={i}
                px={6}
                py={5}
                borderBottom={
                  i < test.questions.length - 1 ? "1px solid #f8fafc" : "none"
                }
                _hover={{ bg: "#fcfdff" }}
                transition="background .1s"
              >
                <Flex gap={3} mb={3}>
                  <Box
                    w="24px"
                    h="24px"
                    bg="linear-gradient(135deg,#4a72b8,#2d5fa8)"
                    borderRadius="7px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    <Text fontSize="11px" fontWeight={900} color="white">
                      {i + 1}
                    </Text>
                  </Box>
                  <Text
                    fontSize="14px"
                    fontWeight={700}
                    color="#0f172a"
                    lineHeight="1.6"
                  >
                    {q.qus}
                  </Text>
                </Flex>
                <Flex flexWrap="wrap" gap={2} pl="36px">
                  {q.options?.map((opt, oi) => (
                    <Flex
                      key={oi}
                      align="center"
                      gap={2}
                      px={3}
                      py="6px"
                      borderRadius="9px"
                      fontSize="12px"
                      fontWeight={oi === q.answer ? 700 : 500}
                      bg={
                        oi === q.answer
                          ? "linear-gradient(135deg,#f0fdf4,#ecfdf5)"
                          : "#f8fafc"
                      }
                      color={oi === q.answer ? "#16a34a" : "#64748b"}
                      border="1px solid"
                      borderColor={oi === q.answer ? "#86efac" : "#e2e8f0"}
                    >
                      <Box
                        w="18px"
                        h="18px"
                        borderRadius="5px"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                        bg={oi === q.answer ? "#16a34a" : "#e2e8f0"}
                      >
                        <Text
                          fontSize="9px"
                          fontWeight={900}
                          color={oi === q.answer ? "white" : "#94a3b8"}
                        >
                          {String.fromCharCode(65 + oi)}
                        </Text>
                      </Box>
                      {opt}
                      {oi === q.answer && <Icon as={FaCheck} fontSize="9px" />}
                    </Flex>
                  ))}
                </Flex>
              </Box>
            ))}
          </Box>
        )}

        {/* Settings tab — language + other settings */}
        {tab === "settings" && (
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={5}>
            {/* Language Card */}
            <Box
              bg="white"
              borderRadius="18px"
              border="1px solid #e8eef7"
              overflow="hidden"
              boxShadow="0 2px 16px rgba(0,0,0,.04)"
            >
              <SectionHeader icon={FaLanguage} title="Test Language" />
              <Box px={6} py={5}>
                <Text fontSize="13px" color="#64748b" mb={4} lineHeight="1.6">
                  Set the primary language for this test. This helps students
                  know what language the questions are in.
                </Text>
                <Box mb={4}>
                  <Text
                    fontSize="11px"
                    fontWeight={700}
                    color="#94a3b8"
                    textTransform="uppercase"
                    letterSpacing=".8px"
                    mb={2}
                  >
                    Current Language
                  </Text>
                  <LanguagePicker
                    value={localLang}
                    onChange={setLocalLang}
                    isOwner={true}
                  />
                </Box>
                {langChanged && (
                  <Box
                    bg="#fffbeb"
                    borderRadius="10px"
                    px={4}
                    py={3}
                    border="1px solid #fde68a"
                    mb={4}
                  >
                    <Flex align="center" gap={2}>
                      <Text fontSize="14px">⚠️</Text>
                      <Text fontSize="12px" color="#92400e" fontWeight={600}>
                        Unsaved change — language will be set to{" "}
                        <Box as="span" fontWeight={800}>
                          {currentLang.label}
                        </Box>
                      </Text>
                    </Flex>
                  </Box>
                )}
                <Flex gap={3}>
                  <Button
                    flex={1}
                    h="44px"
                    borderRadius="12px"
                    bg={
                      langChanged
                        ? "linear-gradient(135deg,#4a72b8,#1e3a5f)"
                        : "#f1f5f9"
                    }
                    color={langChanged ? "white" : "#94a3b8"}
                    fontWeight={800}
                    fontSize="14px"
                    leftIcon={<Icon as={FaSave} fontSize="13px" />}
                    onClick={handleSaveLanguage}
                    isLoading={savingLang}
                    isDisabled={!langChanged}
                    _hover={
                      langChanged
                        ? { opacity: 0.9, transform: "translateY(-1px)" }
                        : {}
                    }
                    transition="all .15s"
                  >
                    Save Language
                  </Button>
                  {langChanged && (
                    <Button
                      h="44px"
                      px={4}
                      borderRadius="12px"
                      variant="outline"
                      borderColor="#e2e8f0"
                      color="#64748b"
                      fontWeight={700}
                      leftIcon={<Icon as={FaTimes} fontSize="12px" />}
                      onClick={() => setLocalLang(test.language || "en")}
                      _hover={{ bg: "#f8fafc" }}
                    >
                      Reset
                    </Button>
                  )}
                </Flex>
              </Box>
            </Box>

            {/* Share settings */}
            <Box
              bg="white"
              borderRadius="18px"
              border="1px solid #e8eef7"
              overflow="hidden"
              boxShadow="0 2px 16px rgba(0,0,0,.04)"
            >
              <SectionHeader icon={FaLink} title="Share Settings" />
              <Box px={6} py={5}>
                <Box mb={4}>
                  <Text
                    fontSize="11px"
                    fontWeight={700}
                    color="#94a3b8"
                    textTransform="uppercase"
                    letterSpacing=".8px"
                    mb={2}
                  >
                    Public Link
                  </Text>
                  <Flex gap={2}>
                    <Box
                      flex={1}
                      bg="#f8fafc"
                      borderRadius="10px"
                      px={3}
                      py="10px"
                      border="1px solid #e2e8f0"
                      fontSize="12px"
                      color="#475569"
                      fontFamily="monospace"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {shareUrl}
                    </Box>
                    <Button
                      h="40px"
                      px={4}
                      borderRadius="10px"
                      bg="#4a72b8"
                      color="white"
                      fontSize="12px"
                      fontWeight={700}
                      flexShrink={0}
                      onClick={() => handleCopy(shareUrl)}
                      _hover={{ bg: "#3b5fa0" }}
                    >
                      Copy
                    </Button>
                  </Flex>
                </Box>
                {isPrivate && test.accessToken && (
                  <Box mb={4}>
                    <Text
                      fontSize="11px"
                      fontWeight={700}
                      color="#94a3b8"
                      textTransform="uppercase"
                      letterSpacing=".8px"
                      mb={2}
                    >
                      Token Link (Private)
                    </Text>
                    <Flex gap={2}>
                      <Box
                        flex={1}
                        bg="#fffbeb"
                        borderRadius="10px"
                        px={3}
                        py="10px"
                        border="1px solid #fde68a"
                        fontSize="12px"
                        color="#92400e"
                        fontFamily="monospace"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {tokenUrl}
                      </Box>
                      <Button
                        h="40px"
                        px={4}
                        borderRadius="10px"
                        bg="#f59e0b"
                        color="white"
                        fontSize="12px"
                        fontWeight={700}
                        flexShrink={0}
                        onClick={() => handleCopy(tokenUrl)}
                        _hover={{ bg: "#d97706" }}
                      >
                        Copy
                      </Button>
                    </Flex>
                  </Box>
                )}
                <Box pt={3} borderTop="1px solid #f1f5f9">
                  <Text
                    fontSize="11px"
                    fontWeight={700}
                    color="#94a3b8"
                    textTransform="uppercase"
                    letterSpacing=".8px"
                    mb={3}
                  >
                    Danger Zone
                  </Text>
                  <Button
                    w="full"
                    h="42px"
                    borderRadius="12px"
                    bg="#fef2f2"
                    color="#ef4444"
                    border="1px solid #fecaca"
                    fontWeight={700}
                    fontSize="13px"
                    onClick={() => setDelOpen(true)}
                    _hover={{ bg: "#fee2e2", borderColor: "#ef4444" }}
                  >
                    Delete This Test Permanently
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        )}
      </Box>

      {/* Password Modal */}
      <Modal isOpen={pwOpen} onClose={() => setPwOpen(false)} isCentered>
        <ModalOverlay backdropFilter="blur(6px)" />
        <ModalContent
          borderRadius="18px"
          fontFamily="'DM Sans',sans-serif"
          mx={4}
        >
          <ModalHeader>
            <Flex align="center" gap={2}>
              <Flex
                w="32px"
                h="32px"
                bg="#eff6ff"
                borderRadius="9px"
                align="center"
                justify="center"
              >
                <Icon as={FaLock} color="#4a72b8" fontSize="13px" />
              </Flex>
              <Text fontSize="16px" fontWeight={800}>
                Enter Test Password
              </Text>
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
              h="46px"
              fontSize="14px"
              _focus={{
                borderColor: "#4a72b8",
                boxShadow: "0 0 0 3px rgba(74,114,184,.12)",
              }}
            />
            {pwErr && (
              <Text fontSize="12px" color="red.500" mt={1.5}>
                {pwErr}
              </Text>
            )}
          </ModalBody>
          <ModalFooter gap={3}>
            <Button
              variant="ghost"
              fontWeight={600}
              onClick={() => setPwOpen(false)}
            >
              Cancel
            </Button>
            <Button
              bg="#4a72b8"
              color="white"
              borderRadius="10px"
              fontWeight={800}
              onClick={verifyPassword}
              _hover={{ bg: "#3b5fa0" }}
            >
              Enter Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Alert */}
      <AlertDialog
        isOpen={delOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setDelOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            mx={4}
            borderRadius="18px"
            fontFamily="'DM Sans',sans-serif"
          >
            <AlertDialogHeader
              fontSize="17px"
              fontWeight={900}
              letterSpacing="-0.5px"
            >
              Delete This Test?
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text fontSize="14px" color="#475569" lineHeight="1.6">
                This will permanently remove{" "}
                <Box as="span" fontWeight={800} color="#0f172a">
                  "{test.title}"
                </Box>{" "}
                and all associated results. This action cannot be undone.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button
                ref={cancelRef}
                onClick={() => setDelOpen(false)}
                variant="ghost"
                fontWeight={600}
              >
                Cancel
              </Button>
              <Button
                bg="#ef4444"
                color="white"
                borderRadius="10px"
                fontWeight={800}
                onClick={handleDelete}
                _hover={{ bg: "#dc2626" }}
              >
                Delete Forever
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}