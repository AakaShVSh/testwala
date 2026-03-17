

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
// import {
//   useParams,
//   useNavigate,
//   useLocation,
//   useSearchParams,
// } from "react-router-dom";
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
//   FaInfoCircle,
//   FaShieldAlt,
//   FaExclamationTriangle,
//   FaGlobe,
//   FaMobileAlt,
//   FaBan,
//   FaEye,
//   FaRedoAlt,
//   FaLayerGroup,
//   FaRegClock,
//   FaExternalLinkAlt,
// } from "react-icons/fa";
// import { apiFetch } from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { socket } from "../services/socket";

// const LANGUAGES = [
//   {
//     value: "english",
//     label: "English",
//     native: "English",
//     flag: "🇬🇧",
//     desc: "Questions & options in English only",
//     color: "#1d4ed8",
//     lightBg: "#eff6ff",
//     border: "#bfdbfe",
//     accent: "#2563eb",
//   },
//   {
//     value: "hindi",
//     label: "Hindi",
//     native: "हिंदी",
//     flag: "🇮🇳",
//     desc: "प्रश्न केवल हिंदी में",
//     color: "#b45309",
//     lightBg: "#fffbeb",
//     border: "#fde68a",
//     accent: "#d97706",
//   },
//   {
//     value: "bilingual",
//     label: "Bilingual",
//     native: "द्विभाषी",
//     flag: "🔀",
//     desc: "English + हिंदी side by side",
//     color: "#6d28d9",
//     lightBg: "#f5f3ff",
//     border: "#ddd6fe",
//     accent: "#7c3aed",
//   },
// ];

// function StatCard({ icon, label, value, color = "#4a72b8", bg = "#eff6ff" }) {
//   return (
//     <Box bg={bg} borderRadius="7px" p={5} flex={1} minW="120px">
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

// // ── LeaderRow — clickable for owner ──────────────────────────────────────────
// function LeaderRow({
//   rank,
//   result,
//   currentUserId,
//   isOwner,
//   onViewResult,
//   loadingId,
// }) {
//   const name = result.studentId?.Name || result.studentId?.Email || "Student";
//   const pct = result.scorePercentage ?? result.percentage ?? 0;
//   const isMe = String(result.studentId?._id) === String(currentUserId);
//   const medals = ["🥇", "🥈", "🥉"];
//   const isLoading = loadingId === result._id;

//   return (
//     <Flex
//       px={5}
//       py={3}
//       align="center"
//       gap={3}
//       bg={isMe ? "linear-gradient(90deg,#eff6ff,#f0fdf4)" : "transparent"}
//       borderLeft={isMe ? "3px solid #4a72b8" : "3px solid transparent"}
//       _hover={
//         isOwner ? { bg: "#f0f7ff", cursor: "pointer" } : { bg: "#f8fafc" }
//       }
//       onClick={isOwner && !isLoading ? () => onViewResult(result) : undefined}
//       transition="background .15s"
//       opacity={isLoading ? 0.7 : 1}
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
//       {isOwner &&
//         (isLoading ? (
//           <Spinner size="xs" color="#4a72b8" flexShrink={0} ml={1} />
//         ) : (
//           <Icon
//             as={FaExternalLinkAlt}
//             fontSize="11px"
//             color="#94a3b8"
//             flexShrink={0}
//             ml={1}
//           />
//         ))}
//     </Flex>
//   );
// }

// function LanguageSelector({ value, onChange, hasHindi }) {
//   return (
//     <Box
//       bg="white"
//       borderRadius="8px"
//       border="1px solid #E2E8F0"
//       p={{ base: "16px", md: "20px" }}
//       mb="12px"
//     >
//       <Flex align="center" gap="10px" mb="14px">
//         <Box
//           w="34px"
//           h="34px"
//           borderRadius="7px"
//           flexShrink={0}
//           bg="#F5F3FF"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           fontSize="16px"
//         >
//           🌐
//         </Box>
//         <Box>
//           <Text fontSize="14px" fontWeight={700} color="#0F172A">
//             Choose Test Language
//           </Text>
//           <Text fontSize="11px" color="#94A3B8" mt="1px">
//             Questions will appear in your selected language
//           </Text>
//         </Box>
//       </Flex>
//       <Flex gap="8px" direction={{ base: "column", sm: "row" }}>
//         {LANGUAGES.map((lang) => {
//           const isActive = value === lang.value;
//           const isDisabled =
//             (lang.value === "hindi" || lang.value === "bilingual") && !hasHindi;
//           return (
//             <Box
//               key={lang.value}
//               flex={1}
//               cursor={isDisabled ? "not-allowed" : "pointer"}
//               onClick={() => !isDisabled && onChange(lang.value)}
//               opacity={isDisabled ? 0.45 : 1}
//               transition="all .15s"
//             >
//               <Box
//                 border="2px solid"
//                 borderColor={isActive ? lang.accent : "#E2E8F0"}
//                 borderRadius="8px"
//                 p="12px"
//                 bg={isActive ? lang.lightBg : "white"}
//                 _hover={!isDisabled ? { borderColor: lang.accent } : {}}
//               >
//                 <Flex align="center" justify="space-between" mb="6px">
//                   <Flex align="center" gap="8px">
//                     <Text fontSize="20px" lineHeight="1">
//                       {lang.flag}
//                     </Text>
//                     <Box>
//                       <Text
//                         fontSize="13px"
//                         fontWeight={700}
//                         color={isActive ? lang.color : "#1E293B"}
//                       >
//                         {lang.label}
//                       </Text>
//                       {lang.native !== lang.label && (
//                         <Text fontSize="10px" color="#94A3B8">
//                           {lang.native}
//                         </Text>
//                       )}
//                     </Box>
//                   </Flex>
//                   <Box
//                     w="18px"
//                     h="18px"
//                     borderRadius="full"
//                     border="2px solid"
//                     borderColor={isActive ? lang.accent : "#CBD5E1"}
//                     bg={isActive ? lang.accent : "white"}
//                     display="flex"
//                     alignItems="center"
//                     justifyContent="center"
//                     flexShrink={0}
//                   >
//                     {isActive && (
//                       <Icon as={FaCheck} fontSize="8px" color="white" />
//                     )}
//                   </Box>
//                 </Flex>
//                 <Text
//                   fontSize="11px"
//                   color={isActive ? lang.color : "#94A3B8"}
//                   lineHeight="1.5"
//                 >
//                   {lang.desc}
//                 </Text>
//                 {isDisabled && (
//                   <Box
//                     mt="6px"
//                     display="inline-block"
//                     bg="#FEF3C7"
//                     px="6px"
//                     py="2px"
//                     borderRadius="4px"
//                   >
//                     <Text fontSize="10px" fontWeight={700} color="#B45309">
//                       Not available
//                     </Text>
//                   </Box>
//                 )}
//               </Box>
//             </Box>
//           );
//         })}
//       </Flex>
//       {value && (
//         <Flex
//           mt="10px"
//           p="8px"
//           align="center"
//           gap="8px"
//           bg="#F0FDF4"
//           borderRadius="6px"
//           border="1px solid #BBF7D0"
//         >
//           <Icon as={FaCheck} fontSize="10px" color="#16A34A" />
//           <Text fontSize="12px" color="#15803D" fontWeight={600}>
//             Language set to{" "}
//             <Text as="span" fontWeight={800} color="#0F172A">
//               {LANGUAGES.find((l) => l.value === value)?.label}
//             </Text>
//           </Text>
//         </Flex>
//       )}
//     </Box>
//   );
// }

// function RuleCard({ number, icon, accent, bg, title, description }) {
//   return (
//     <Flex
//       gap="12px"
//       p="14px"
//       borderRadius="8px"
//       bg={bg}
//       border={`1px solid ${accent}22`}
//       align="flex-start"
//     >
//       <Box position="relative" flexShrink={0}>
//         <Box
//           w="34px"
//           h="34px"
//           bg={accent}
//           borderRadius="8px"
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//           color="white"
//           fontSize="14px"
//         >
//           <Icon as={icon} />
//         </Box>
//         <Box
//           position="absolute"
//           top="-5px"
//           right="-5px"
//           w="14px"
//           h="14px"
//           bg="white"
//           borderRadius="full"
//           border={`2px solid ${accent}`}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <Text fontSize="7px" fontWeight={800} color={accent}>
//             {number}
//           </Text>
//         </Box>
//       </Box>
//       <Box flex={1}>
//         <Text fontSize="13px" fontWeight={700} color="#0F172A" mb="3px">
//           {title}
//         </Text>
//         <Text fontSize="11px" color="#64748B" lineHeight="1.65">
//           {description}
//         </Text>
//       </Box>
//     </Flex>
//   );
// }

// function TestInfoPage({
//   test,
//   stats,
//   onStart,
//   user,
//   myResult,
//   selectedLang,
//   onLangChange,
// }) {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [agreed, setAgreed] = useState(false);
//   const instructionsRef = useRef(null);

//   useEffect(() => {
//     if (window.location.hash === "#instructions" && instructionsRef.current) {
//       const timer = setTimeout(() => {
//         instructionsRef.current.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//         window.history.replaceState(
//           null,
//           "",
//           window.location.pathname + window.location.search,
//         );
//       }, 350);
//       return () => clearTimeout(timer);
//     }
//   }, []);

//   const timeLimitMin = test.timeLimitMin || test.timeLimit || 30;
//   const isPrivate =
//     test.visibility === "private" || test.accessType === "private";
//   const questionCount = test.questions?.length || 0;
//   const secsPerQ = Math.round((timeLimitMin * 60) / Math.max(questionCount, 1));
//   const hasHindi = test.questions?.some(
//     (q) => q.qush && String(q.qush).trim().length > 0,
//   );
//   const redirectBack = encodeURIComponent(
//     location.pathname + location.search + "#instructions",
//   );

//   const RULES = [
//     {
//       icon: FaEye,
//       accent: "#2563eb",
//       bg: "#eff6ff",
//       title: "Stay on this page",
//       description:
//         "Do not switch browser tabs or open other apps during the test.",
//     },
//     {
//       icon: FaRegClock,
//       accent: "#d97706",
//       bg: "#fffbeb",
//       title: "Strict time limit",
//       description: `You have exactly ${timeLimitMin} minutes. The test auto-submits when time runs out.`,
//     },
//     {
//       icon: FaLayerGroup,
//       accent: "#7c3aed",
//       bg: "#f5f3ff",
//       title: "Mark & review",
//       description:
//         "Use the question palette to jump between questions and mark for review.",
//     },
//     {
//       icon: FaCheckCircle,
//       accent: "#16a34a",
//       bg: "#f0fdf4",
//       title: "No negative marking",
//       description: `Each correct answer scores 1 mark (total: ${questionCount}). Wrong answers carry zero penalty.`,
//     },
//     {
//       icon: FaRedoAlt,
//       accent: "#0891b2",
//       bg: "#ecfeff",
//       title: "Reconnection is safe",
//       description:
//         "Your answers are saved per question. Progress is recovered on reload.",
//     },
//     {
//       icon: FaBan,
//       accent: "#e11d48",
//       bg: "#fff1f2",
//       title: "No copy-paste",
//       description:
//         "Right-click and keyboard shortcuts are disabled during the test for fairness.",
//     },
//     {
//       icon: FaMobileAlt,
//       accent: "#ea580c",
//       bg: "#fff7ed",
//       title: "Use a stable device",
//       description: "Laptop or desktop recommended. Keep your device charged.",
//     },
//     {
//       icon: FaGlobe,
//       accent: "#0d9488",
//       bg: "#f0fdfa",
//       title: "Stable internet required",
//       description: "Use a reliable Wi-Fi or wired connection.",
//     },
//   ];

//   const px = { base: "16px", md: "32px", lg: "48px" };

//   return (
//     <Box minH="100vh" bg="#F8FAFC" fontFamily="Inter, sans-serif">
//       <Box
//         bg="#0B1120"
//         px={px}
//         pt={{ base: "40px", md: "52px" }}
//         pb={{ base: "52px", md: "68px" }}
//       >
//         <Box maxW="1200px" mx="auto">
//           <Flex
//             align="center"
//             gap="8px"
//             mb="28px"
//             cursor="pointer"
//             w="fit-content"
//             color="rgba(255,255,255,.4)"
//             _hover={{ color: "rgba(255,255,255,.8)" }}
//             onClick={() => navigate(-1)}
//           >
//             <Icon as={FaArrowLeft} fontSize="11px" />
//             <Text fontSize="13px" fontWeight={500}>
//               Back
//             </Text>
//           </Flex>
//           <Flex
//             align="flex-start"
//             gap="16px"
//             flexWrap={{ base: "wrap", sm: "nowrap" }}
//           >
//             <Box
//               w={{ base: "48px", md: "56px" }}
//               h={{ base: "48px", md: "56px" }}
//               flexShrink={0}
//               bg="#1E293B"
//               borderRadius="10px"
//               display="flex"
//               alignItems="center"
//               justifyContent="center"
//               fontSize={{ base: "22px", md: "26px" }}
//             >
//               📋
//             </Box>
//             <Box flex={1} minW={0}>
//               <Flex flexWrap="wrap" gap="8px" mb="10px" align="center">
//                 {test.examType && (
//                   <Box
//                     bg="#1E3A5F"
//                     color="#93C5FD"
//                     px="10px"
//                     py="3px"
//                     borderRadius="4px"
//                     fontSize="11px"
//                     fontWeight={700}
//                     letterSpacing="0.8px"
//                   >
//                     {test.examType}
//                   </Box>
//                 )}
//                 {isPrivate && (
//                   <Box
//                     bg="#3B1219"
//                     color="#FCA5A5"
//                     px="10px"
//                     py="3px"
//                     borderRadius="4px"
//                     fontSize="11px"
//                     fontWeight={700}
//                   >
//                     🔒 Private
//                   </Box>
//                 )}
//                 {myResult && (
//                   <Box
//                     bg="#14532D"
//                     color="#86EFAC"
//                     px="10px"
//                     py="3px"
//                     borderRadius="4px"
//                     fontSize="11px"
//                     fontWeight={700}
//                   >
//                     ✓ Already attempted
//                   </Box>
//                 )}
//               </Flex>
//               <Text
//                 fontSize={{ base: "22px", md: "34px" }}
//                 fontWeight={800}
//                 color="white"
//                 letterSpacing="-0.8px"
//                 lineHeight="1.15"
//                 mb="6px"
//               >
//                 {test.title}
//               </Text>
//               {test.subject && (
//                 <Text
//                   fontSize="13px"
//                   color="rgba(255,255,255,.35)"
//                   fontWeight={500}
//                 >
//                   Subject:{" "}
//                   {test.subject.charAt(0).toUpperCase() + test.subject.slice(1)}
//                 </Text>
//               )}
//             </Box>
//           </Flex>
//           <Flex
//             mt="28px"
//             pt="24px"
//             borderTop="1px solid rgba(255,255,255,.07)"
//             gap={{ base: "24px", md: "40px" }}
//             flexWrap="wrap"
//           >
//             {[
//               {
//                 icon: FaClipboardList,
//                 value: questionCount,
//                 label: "Questions",
//               },
//               {
//                 icon: FaClock,
//                 value: `${timeLimitMin} min`,
//                 label: "Duration",
//               },
//               {
//                 icon: FaRegClock,
//                 value: `~${secsPerQ}s`,
//                 label: "Per Question",
//               },
//               {
//                 icon: FaUsers,
//                 value: stats?.totalAttempts ?? 0,
//                 label: "Attempts",
//               },
//               {
//                 icon: FaChartBar,
//                 value: stats ? `${stats.avgPercentage}%` : "—",
//                 label: "Avg Score",
//               },
//             ].map((s) => (
//               <Flex key={s.label} align="center" gap="10px">
//                 <Icon
//                   as={s.icon}
//                   fontSize="13px"
//                   color="rgba(255,255,255,.3)"
//                 />
//                 <Box>
//                   <Text
//                     fontSize={{ base: "18px", md: "22px" }}
//                     fontWeight={800}
//                     color="white"
//                     lineHeight="1"
//                     letterSpacing="-0.5px"
//                   >
//                     {s.value}
//                   </Text>
//                   <Text
//                     fontSize="10px"
//                     color="rgba(255,255,255,.35)"
//                     textTransform="uppercase"
//                     letterSpacing="0.8px"
//                     mt="2px"
//                   >
//                     {s.label}
//                   </Text>
//                 </Box>
//               </Flex>
//             ))}
//           </Flex>
//         </Box>
//       </Box>

//       <Box
//         maxW="1200px"
//         mx="auto"
//         px={px}
//         mt="-24px"
//         pb="60px"
//         position="relative"
//         zIndex={1}
//       >
//         <Grid
//           templateColumns={{ base: "1fr", lg: "1fr 300px" }}
//           gap="16px"
//           alignItems="start"
//         >
//           <Box>
//             {myResult && (
//               <Box
//                 bg="white"
//                 borderRadius="8px"
//                 border="1px solid #86EFAC"
//                 p="16px"
//                 mb="12px"
//               >
//                 <Flex align="center" gap="14px" flexWrap="wrap">
//                   <Box
//                     w="44px"
//                     h="44px"
//                     bg="#F0FDF4"
//                     borderRadius="8px"
//                     display="flex"
//                     alignItems="center"
//                     justifyContent="center"
//                     flexShrink={0}
//                     border="1px solid #86EFAC"
//                   >
//                     <Icon as={FaTrophy} color="#16a34a" fontSize="18px" />
//                   </Box>
//                   <Box flex={1}>
//                     <Text
//                       fontSize="11px"
//                       fontWeight={700}
//                       color="#16a34a"
//                       textTransform="uppercase"
//                       letterSpacing=".8px"
//                     >
//                       Your Previous Attempt
//                     </Text>
//                     <Flex align="baseline" gap="8px" mt="2px">
//                       <Text
//                         fontSize="28px"
//                         fontWeight={800}
//                         color="#15803d"
//                         lineHeight="1"
//                         letterSpacing="-1px"
//                       >
//                         {(
//                           myResult.scorePercentage ??
//                           myResult.percentage ??
//                           0
//                         ).toFixed(0)}
//                         %
//                       </Text>
//                       <Text fontSize="13px" color="#16a34a" fontWeight={600}>
//                         · {myResult.correct ?? myResult.correctQus?.length ?? 0}
//                         /{questionCount} correct
//                       </Text>
//                     </Flex>
//                   </Box>
//                   <Badge
//                     fontSize="11px"
//                     px={3}
//                     py={1}
//                     borderRadius="4px"
//                     colorScheme={
//                       (myResult.scorePercentage ?? myResult.percentage ?? 0) >=
//                       40
//                         ? "green"
//                         : "red"
//                     }
//                   >
//                     {(myResult.scorePercentage ?? myResult.percentage ?? 0) >=
//                     40
//                       ? "PASSED"
//                       : "FAILED"}
//                   </Badge>
//                 </Flex>
//               </Box>
//             )}

//             <LanguageSelector
//               value={selectedLang}
//               onChange={onLangChange}
//               hasHindi={hasHindi}
//             />

//             <Box
//               bg="white"
//               borderRadius="8px"
//               border="1px solid #E2E8F0"
//               p={{ base: "16px", md: "20px" }}
//               mb="12px"
//             >
//               <Flex align="center" gap="10px" mb="16px">
//                 <Icon as={FaInfoCircle} color="#2563EB" fontSize="14px" />
//                 <Text fontSize="14px" fontWeight={700} color="#0F172A">
//                   Test Details
//                 </Text>
//               </Flex>
//               <Grid
//                 templateColumns={{ base: "1fr 1fr", md: "repeat(3,1fr)" }}
//                 gap="10px"
//               >
//                 {[
//                   {
//                     label: "Questions",
//                     value: questionCount,
//                     accent: "#2563EB",
//                   },
//                   {
//                     label: "Duration",
//                     value: `${timeLimitMin} min`,
//                     accent: "#D97706",
//                   },
//                   {
//                     label: "Per Question",
//                     value: `~${secsPerQ} sec`,
//                     accent: "#16A34A",
//                   },
//                   {
//                     label: "Total Marks",
//                     value: `${questionCount}`,
//                     accent: "#7C3AED",
//                   },
//                   { label: "Pass Mark", value: "40%", accent: "#DC2626" },
//                   {
//                     label: "Subject",
//                     value: test.subject
//                       ? test.subject.charAt(0).toUpperCase() +
//                         test.subject.slice(1)
//                       : "General",
//                     accent: "#0891B2",
//                   },
//                   {
//                     label: "Exam Type",
//                     value: test.examType || "General",
//                     accent: "#EA580C",
//                   },
//                   {
//                     label: "Language",
//                     value:
//                       LANGUAGES.find((l) => l.value === selectedLang)?.label ||
//                       "English",
//                     accent: "#6D28D9",
//                   },
//                   {
//                     label: "Access",
//                     value: isPrivate ? "🔒 Private" : "🌐 Public",
//                     accent: "#374151",
//                   },
//                 ].map(({ label, value, accent }) => (
//                   <Box
//                     key={label}
//                     bg="#F8FAFC"
//                     borderRadius="6px"
//                     p="12px"
//                     border="1px solid #F1F5F9"
//                   >
//                     <Text
//                       fontSize="10px"
//                       fontWeight={700}
//                       color="#94A3B8"
//                       textTransform="uppercase"
//                       letterSpacing=".8px"
//                       mb="4px"
//                     >
//                       {label}
//                     </Text>
//                     <Text fontSize="14px" fontWeight={800} color={accent}>
//                       {value}
//                     </Text>
//                   </Box>
//                 ))}
//               </Grid>
//             </Box>

//             <Box
//               ref={instructionsRef}
//               bg="white"
//               borderRadius="8px"
//               border="1px solid #E2E8F0"
//               p={{ base: "16px", md: "20px" }}
//               mb="12px"
//             >
//               <Flex align="center" gap="10px" mb="16px">
//                 <Icon as={FaShieldAlt} color="#D97706" fontSize="14px" />
//                 <Box>
//                   <Text fontSize="14px" fontWeight={700} color="#0F172A">
//                     Instructions
//                   </Text>
//                   <Text fontSize="11px" color="#94A3B8" mt="1px">
//                     Read carefully before starting
//                   </Text>
//                 </Box>
//               </Flex>
//               <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="8px">
//                 {RULES.map((rule, i) => (
//                   <RuleCard
//                     key={i}
//                     number={i + 1}
//                     icon={rule.icon}
//                     accent={rule.accent}
//                     bg={rule.bg}
//                     title={rule.title}
//                     description={rule.description}
//                   />
//                 ))}
//               </Grid>
//             </Box>

//             <Box
//               bg="#FFFBEB"
//               border="1px solid #FDE68A"
//               borderRadius="8px"
//               p="16px"
//               mb="12px"
//             >
//               <Flex align="center" gap="8px" mb="10px">
//                 <Icon
//                   as={FaExclamationTriangle}
//                   color="#D97706"
//                   fontSize="13px"
//                 />
//                 <Text fontSize="13px" fontWeight={700} color="#92400E">
//                   Before You Start
//                 </Text>
//               </Flex>
//               <Flex direction="column" gap="6px">
//                 {[
//                   `Once started, the ${timeLimitMin}-minute timer cannot be paused or reset`,
//                   "Ensure your device is fully charged or connected to power",
//                   "Close all other browser tabs to avoid accidental navigation",
//                   "Use a laptop or desktop for the best test-taking experience",
//                   "Refreshing the page mid-test is safe — your progress is auto-saved",
//                 ].map((w, i) => (
//                   <Flex key={i} align="flex-start" gap="8px">
//                     <Box
//                       w="18px"
//                       h="18px"
//                       bg="#FDE68A"
//                       borderRadius="4px"
//                       display="flex"
//                       alignItems="center"
//                       justifyContent="center"
//                       flexShrink={0}
//                       mt="1px"
//                     >
//                       <Text fontSize="9px" fontWeight={800} color="#92400E">
//                         {i + 1}
//                       </Text>
//                     </Box>
//                     <Text fontSize="12px" color="#78350F" lineHeight="1.65">
//                       {w}
//                     </Text>
//                   </Flex>
//                 ))}
//               </Flex>
//             </Box>
//           </Box>

//           {/* Sticky sidebar */}
//           <Box position={{ base: "static", lg: "sticky" }} top={{ lg: "20px" }}>
//             <Box
//               bg="white"
//               borderRadius="8px"
//               border="1px solid #E2E8F0"
//               overflow="hidden"
//               mb="12px"
//             >
//               <Box
//                 bg="#0B1120"
//                 px="20px"
//                 pt="20px"
//                 pb="28px"
//                 textAlign="center"
//               >
//                 <Box fontSize="28px" mb="8px">
//                   🎯
//                 </Box>
//                 <Text fontSize="15px" fontWeight={800} color="white">
//                   {myResult ? "Retake the Test" : "Ready to Begin?"}
//                 </Text>
//                 <Text fontSize="12px" color="rgba(255,255,255,.4)" mt="4px">
//                   {questionCount} questions · {timeLimitMin} min ·{" "}
//                   {LANGUAGES.find((l) => l.value === selectedLang)?.label}
//                 </Text>
//               </Box>
//               <Box px="16px" pt="16px" pb="20px">
//                 <Box
//                   mb="12px"
//                   bg="#F8FAFC"
//                   borderRadius="8px"
//                   border="1px solid #E2E8F0"
//                   overflow="hidden"
//                 >
//                   <Flex
//                     align="center"
//                     gap="8px"
//                     px="14px"
//                     py="10px"
//                     borderBottom="1px solid #F1F5F9"
//                     bg="white"
//                   >
//                     <Icon as={FaClock} color="#D97706" fontSize="12px" />
//                     <Text fontSize="12px" fontWeight={700} color="#374151">
//                       Time Allowed
//                     </Text>
//                   </Flex>
//                   <Box
//                     bg="#FFFBEB"
//                     px="14px"
//                     py="14px"
//                     borderBottom="1px solid #FDE68A"
//                   >
//                     <Flex align="center" justify="center" gap="6px">
//                       {timeLimitMin >= 60 && (
//                         <>
//                           <Box textAlign="center">
//                             <Box
//                               bg="white"
//                               borderRadius="6px"
//                               px="10px"
//                               py="8px"
//                               border="1px solid #FDE68A"
//                               minW="46px"
//                             >
//                               <Text
//                                 fontSize="26px"
//                                 fontWeight={800}
//                                 color="#92400E"
//                                 lineHeight="1"
//                                 letterSpacing="-1.5px"
//                               >
//                                 {Math.floor(timeLimitMin / 60)
//                                   .toString()
//                                   .padStart(2, "0")}
//                               </Text>
//                             </Box>
//                             <Text
//                               fontSize="9px"
//                               color="#B45309"
//                               fontWeight={700}
//                               textTransform="uppercase"
//                               letterSpacing=".8px"
//                               mt="4px"
//                             >
//                               HRS
//                             </Text>
//                           </Box>
//                           <Text
//                             fontSize="24px"
//                             fontWeight={800}
//                             color="#D97706"
//                             mb="12px"
//                           >
//                             :
//                           </Text>
//                         </>
//                       )}
//                       <Box textAlign="center">
//                         <Box
//                           bg="white"
//                           borderRadius="6px"
//                           px="10px"
//                           py="8px"
//                           border="1px solid #FDE68A"
//                           minW="46px"
//                         >
//                           <Text
//                             fontSize="26px"
//                             fontWeight={800}
//                             color="#92400E"
//                             lineHeight="1"
//                             letterSpacing="-1.5px"
//                           >
//                             {(timeLimitMin % 60).toString().padStart(2, "0")}
//                           </Text>
//                         </Box>
//                         <Text
//                           fontSize="9px"
//                           color="#B45309"
//                           fontWeight={700}
//                           textTransform="uppercase"
//                           letterSpacing=".8px"
//                           mt="4px"
//                         >
//                           MIN
//                         </Text>
//                       </Box>
//                       <Text
//                         fontSize="24px"
//                         fontWeight={800}
//                         color="#D97706"
//                         mb="12px"
//                       >
//                         :
//                       </Text>
//                       <Box textAlign="center">
//                         <Box
//                           bg="white"
//                           borderRadius="6px"
//                           px="10px"
//                           py="8px"
//                           border="1px solid #FDE68A"
//                           minW="46px"
//                         >
//                           <Text
//                             fontSize="26px"
//                             fontWeight={800}
//                             color="#B45309"
//                             lineHeight="1"
//                             letterSpacing="-1.5px"
//                           >
//                             00
//                           </Text>
//                         </Box>
//                         <Text
//                           fontSize="9px"
//                           color="#B45309"
//                           fontWeight={700}
//                           textTransform="uppercase"
//                           letterSpacing=".8px"
//                           mt="4px"
//                         >
//                           SEC
//                         </Text>
//                       </Box>
//                     </Flex>
//                   </Box>
//                   <Flex
//                     px="14px"
//                     py="10px"
//                     align="center"
//                     justify="space-between"
//                   >
//                     <Text fontSize="12px" color="#64748B">
//                       ~per question
//                     </Text>
//                     <Box
//                       bg="#F0FDF4"
//                       border="1px solid #BBF7D0"
//                       px="10px"
//                       py="3px"
//                       borderRadius="4px"
//                     >
//                       <Text fontSize="12px" fontWeight={800} color="#15803D">
//                         ⚡ ~{secsPerQ}s
//                       </Text>
//                     </Box>
//                   </Flex>
//                 </Box>

//                 <Box
//                   border="2px solid"
//                   mb="12px"
//                   borderColor={agreed ? "#2563EB" : "#E2E8F0"}
//                   borderRadius="8px"
//                   bg={agreed ? "#EFF6FF" : "white"}
//                   cursor="pointer"
//                   transition="all .15s"
//                   _hover={{ borderColor: "#2563EB" }}
//                   onClick={() => setAgreed((p) => !p)}
//                   p="12px"
//                 >
//                   <Flex align="flex-start" gap="10px">
//                     <Box
//                       flexShrink={0}
//                       mt="1px"
//                       w="20px"
//                       h="20px"
//                       borderRadius="5px"
//                       bg={agreed ? "#2563EB" : "white"}
//                       border="2px solid"
//                       borderColor={agreed ? "#2563EB" : "#CBD5E1"}
//                       display="flex"
//                       alignItems="center"
//                       justifyContent="center"
//                       transition="all .15s"
//                     >
//                       {agreed && (
//                         <Icon as={FaCheck} fontSize="9px" color="white" />
//                       )}
//                     </Box>
//                     <Text
//                       fontSize="12px"
//                       color={agreed ? "#1E40AF" : "#64748B"}
//                       lineHeight={1.65}
//                       fontWeight={agreed ? 600 : 400}
//                     >
//                       I have read all instructions and agree to the test rules.
//                     </Text>
//                   </Flex>
//                 </Box>

//                 {!user ? (
//                   <>
//                     <Button
//                       w="full"
//                       h="46px"
//                       borderRadius="7px"
//                       mb="8px"
//                       bg="#0B1120"
//                       color="white"
//                       fontWeight={700}
//                       fontSize="14px"
//                       leftIcon={<FaPlay />}
//                       onClick={() =>
//                         navigate(`/auth/signin?redirect=${redirectBack}`)
//                       }
//                       _hover={{ bg: "#1E293B" }}
//                     >
//                       Sign In to Start
//                     </Button>
//                     <Button
//                       w="full"
//                       h="40px"
//                       borderRadius="7px"
//                       variant="outline"
//                       borderColor="#E2E8F0"
//                       color="#374151"
//                       fontWeight={600}
//                       fontSize="13px"
//                       onClick={() =>
//                         navigate(`/auth/signup?redirect=${redirectBack}`)
//                       }
//                       _hover={{ bg: "#F8FAFC" }}
//                     >
//                       Create Account
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <Button
//                       w="full"
//                       h="48px"
//                       borderRadius="7px"
//                       bg={agreed ? "#1D4ED8" : "#F1F5F9"}
//                       color={agreed ? "white" : "#94A3B8"}
//                       fontWeight={700}
//                       fontSize="15px"
//                       leftIcon={<Icon as={FaPlay} fontSize="12px" />}
//                       cursor={agreed ? "pointer" : "not-allowed"}
//                       onClick={agreed ? onStart : undefined}
//                       _hover={agreed ? { bg: "#1E40AF" } : {}}
//                       transition="all .15s"
//                     >
//                       {myResult ? "Retake Test" : "Start Test"}
//                     </Button>
//                     {!agreed && (
//                       <Text
//                         fontSize="11px"
//                         color="#F59E0B"
//                         textAlign="center"
//                         mt="8px"
//                         fontWeight={600}
//                       >
//                         ☝️ Check the box above to start
//                       </Text>
//                     )}
//                     <Text
//                       fontSize="11px"
//                       color="#94A3B8"
//                       textAlign="center"
//                       mt="8px"
//                     >
//                       as {user.Name || user.Email}
//                     </Text>
//                   </>
//                 )}
//               </Box>
//             </Box>

//             {stats && stats.totalAttempts > 0 && (
//               <Box
//                 bg="white"
//                 borderRadius="8px"
//                 border="1px solid #E2E8F0"
//                 p="16px"
//               >
//                 <Text
//                   fontSize="11px"
//                   fontWeight={700}
//                   color="#94A3B8"
//                   textTransform="uppercase"
//                   letterSpacing=".8px"
//                   mb="14px"
//                 >
//                   Community Stats
//                 </Text>
//                 {[
//                   {
//                     label: "Attempts",
//                     value: stats.totalAttempts,
//                     color: "#2563EB",
//                   },
//                   {
//                     label: "Pass Rate",
//                     value: `${stats.passRate}%`,
//                     color: "#16A34A",
//                   },
//                   {
//                     label: "Avg Score",
//                     value: `${stats.avgPercentage}%`,
//                     color: "#7C3AED",
//                   },
//                   {
//                     label: "Top Score",
//                     value: `${stats.highestScore}%`,
//                     color: "#EA580C",
//                   },
//                 ].map(({ label, value, color }, i, arr) => (
//                   <Flex
//                     key={label}
//                     justify="space-between"
//                     align="center"
//                     pb={i < arr.length - 1 ? "10px" : 0}
//                     mb={i < arr.length - 1 ? "10px" : 0}
//                     borderBottom={
//                       i < arr.length - 1 ? "1px solid #F8FAFC" : "none"
//                     }
//                   >
//                     <Text fontSize="13px" color="#64748B">
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

// // ═══════════════════════════════════════════════
// // MAIN PAGE
// // ═══════════════════════════════════════════════
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
//   const [copied, setCopied] = useState(false);
//   const [pwOpen, setPwOpen] = useState(false);
//   const [pwInput, setPwInput] = useState("");
//   const [pwErr, setPwErr] = useState("");
//   const [delOpen, setDelOpen] = useState(false);
//   const [selectedLang, setSelectedLang] = useState("english");
//   const [loadingResultId, setLoadingResultId] = useState(null);

//   // ── Tab state synced with ?tab= URL param ─────────────────────────────────
//   const [searchParams, setSearchParams] = useSearchParams();
//   const VALID_TABS = ["overview", "leaderboard", "questions"];
//   const rawTab = searchParams.get("tab") || "overview";
//   const tab = VALID_TABS.includes(rawTab) ? rawTab : "overview";

//   const setTab = (t) => {
//     setSearchParams({ tab: t }, { replace: true });
//   };

//   const viaToken = Boolean(location.state?.viaToken);

//   // Keep only each student's FIRST attempt (earliest createdAt), then sort score desc.
//   const firstAttemptPerStudent = (raw) => {
//     const seen = new Map();
//     const byDate = [...raw].sort(
//       (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
//     );
//     for (const r of byDate) {
//       const key = String(r.studentId?._id || r.studentId || r._id);
//       if (!seen.has(key)) seen.set(key, r);
//     }
//     return Array.from(seen.values()).sort((a, b) => {
//       const pa = a.scorePercentage ?? a.percentage ?? 0;
//       const pb = b.scorePercentage ?? b.percentage ?? 0;
//       return pb - pa;
//     });
//   };

//   const load = useCallback(async () => {
//     try {
//       let testData = null;
//       const isObjectId = /^[a-f\d]{24}$/i.test(id);
//       if (isObjectId) {
//         const res = await apiFetch(`/tests/id/${id}`);
//         testData = res.data;
//       } else {
//         try {
//           const res = await apiFetch(`/tests/${id}`);
//           testData = res.data;
//         } catch (e) {
//           if (user?._id) {
//             const res = await apiFetch(`/tests/id/${id}`);
//             testData = res.data;
//           } else throw e;
//         }
//       }
//       setTest(testData);
//       const hasHindi = testData.questions?.some(
//         (q) => q.qush && String(q.qush).trim().length > 0,
//       );
//       if (!hasHindi) setSelectedLang("english");
//       const testId = testData._id;
//       const [statsRes, lbRes] = await Promise.all([
//         apiFetch(`/tests/${testId}/stats`).catch(() => ({ data: null })),
//         apiFetch(`/tests/${testId}/leaderboard`).catch(() => ({ data: [] })),
//       ]);
//       setStats(statsRes.data);
//       setLeaderboard(firstAttemptPerStudent(lbRes.data || []));
//       if (user?._id) {
//         apiFetch(`/results/student/me?testId=${testId}`)
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

//   useEffect(() => {
//     if (!test?._id) return;
//     // Backend only emits "test:attempted" on a student's FIRST attempt,
//     // so this listener naturally keeps the leaderboard first-attempt only.
//     const onAttempted = ({ testId }) => {
//       if (String(testId) === String(test._id)) {
//         Promise.all([
//           apiFetch(`/tests/${test._id}/stats`).catch(() => ({ data: null })),
//           apiFetch(`/tests/${test._id}/leaderboard`).catch(() => ({
//             data: [],
//           })),
//         ]).then(([sRes, lbRes]) => {
//           setStats(sRes.data);
//           setLeaderboard(firstAttemptPerStudent(lbRes.data || []));
//         });
//       }
//     };
//     socket.on("test:attempted", onAttempted);
//     return () => socket.off("test:attempted", onAttempted);
//   }, [test?._id]);

//   if (loading)
//     return (
//       <Flex minH="80vh" align="center" justify="center">
//         <Spinner size="xl" color="#4a72b8" thickness="4px" />
//       </Flex>
//     );
//   if (!test)
//     return (
//       <Box textAlign="center" py={20} fontFamily="Inter,sans-serif">
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
//       String(user._id) === String(test.createdBy?._id) ||
//       (user.coachingId &&
//         test.coachingId &&
//         String(user.coachingId) === String(test.coachingId))),
//   );

//   const isPrivate =
//     test.visibility === "private" || test.accessType === "private";
//   const timeLimitMin = test.timeLimitMin || test.timeLimit || 30;
//   const shareUrl = `${window.location.origin}/tests/${test.slug || id}`;
//   const tokenUrl = test.accessToken
//     ? `${window.location.origin}/tests/token/${test.accessToken}`
//     : shareUrl;

//   const handleCopy = (url) => {
//     navigator.clipboard.writeText(url).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2500);
//     });
//   };

//   const launchTest = () => {
//     if (!test.questions || test.questions.length === 0) {
//       toast({ title: "This test has no questions", status: "error" });
//       return;
//     }
//     navigate("/test", {
//       state: {
//         quest: test.questions,
//         testLanguage: selectedLang,
//         testMeta: {
//           subject: test.subject || "general",
//           category: test.examType || test.title,
//           timeLimitMin,
//           testIndex: 0,
//           testId: test._id,
//           testTitle: test.title,
//         },
//       },
//     });
//   };

//   const handleStartTest = () => {
//     if (!user) {
//       const rb = encodeURIComponent(
//         location.pathname + location.search + "#instructions",
//       );
//       navigate(`/auth/signin?redirect=${rb}`);
//       return;
//     }
//     if (isPrivate && !isOwner && !viaToken) {
//       setPwOpen(true);
//       return;
//     }
//     launchTest();
//   };

//   const verifyPassword = () => {
//     if (pwInput === test.password) {
//       setPwOpen(false);
//       launchTest();
//     } else setPwErr("Incorrect password");
//   };

//   const handleDelete = async () => {
//     try {
//       await apiFetch(`/tests/${test._id}`, { method: "DELETE" });
//       toast({ title: "Test deleted", status: "success" });
//       navigate(-1);
//     } catch (e) {
//       toast({ title: e.message, status: "error" });
//     }
//   };

//   // ── Owner clicks a leaderboard row ─────────────────────────────────────────
//   const handleViewStudentResult = async (leaderboardEntry) => {
//     const resultId = leaderboardEntry._id;
//     if (!resultId) return;
//     setLoadingResultId(resultId);
//     try {
//       // 1. Full result for this leaderboard entry (first attempt)
//       const res = await apiFetch(`/results/${resultId}`);
//       const r = res.data || res;
//       const studentName = r.studentId?.Name || r.studentId?.Email || "Student";
//       const studentId = String(r.studentId?._id || r.studentId);

//       // questions for rendering: prefer shuffledQuestions stored in result
//       // (exact order shown to student), fall back to original test questions
//       const originalQuestions =
//         Array.isArray(r.testId?.questions) && r.testId.questions.length
//           ? r.testId.questions
//           : test.questions || [];
//       const shuffledQuestions =
//         Array.isArray(r.shuffledQuestions) && r.shuffledQuestions.length > 0
//           ? r.shuffledQuestions
//           : null; // null = no shuffle data saved (old results)

//       // 2. All attempts by this student for this test — to power the retakes panel
//       let allAttempts = [];
//       try {
//         const allRes = await apiFetch(`/results/test/${test._id}`);
//         const allRaw = allRes.data || [];
//         // keep only this student's attempts, sorted oldest first
//         allAttempts = allRaw
//           .filter((a) => String(a.studentId?._id || a.studentId) === studentId)
//           .sort(
//             (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
//           )
//           .map((a, idx) => ({
//             _id: a._id,
//             attemptNumber: idx + 1,
//             createdAt: a.createdAt,
//             scorePercentage: a.scorePercentage ?? a.percentage ?? 0,
//             timeTakenSec: a.timeTakenSec ?? a.timeTaken ?? 0,
//             correct:
//               a.correct ??
//               (Array.isArray(a.correctQus) ? a.correctQus.length : 0),
//             totalQuestions: originalQuestions.length,
//           }));
//       } catch {
//         // if this fails, just show the single result without retakes panel
//       }

//       const toArr = (v) => (Array.isArray(v) ? v : []);

//       navigate("/test-result", {
//         state: {
//           viewingAs: "owner",
//           studentName,
//           studentId,
//           testId: String(test._id),
//           // back URL includes ?tab=leaderboard so the back button restores the right tab
//           backUrl: `/tests/${test.slug || test._id}?tab=leaderboard`,
//           allAttempts,
//           currentAttemptId: String(resultId),
//           testTitle: test.title,
//           score:
//             r.correct ??
//             (Array.isArray(r.correctQus) ? r.correctQus.length : 0) ??
//             0,
//           totalQuestions: originalQuestions.length || r.totalQuestions || 0,
//           scorePercentage: r.scorePercentage ?? r.percentage ?? 0,
//           percentile: r.percentile ?? null,
//           timeTaken: r.timeTakenSec ?? r.timeTaken ?? 0,
//           // shuffledQuestions = the order questions were shown during the test.
//           // ResultPage uses this to map allAnswers indices to the right questions.
//           shuffledQuestions: shuffledQuestions || [],
//           questions: originalQuestions, // fallback for old results without shuffle data
//           allAnswers:
//             r.allAnswers && typeof r.allAnswers === "object"
//               ? r.allAnswers
//               : {},
//           questionTimes:
//             r.questionTimes && typeof r.questionTimes === "object"
//               ? r.questionTimes
//               : {},
//           correctQus: toArr(r.correctQus),
//           wrongansqus: toArr(r.wrongansqus).length
//             ? toArr(r.wrongansqus)
//             : toArr(r.wrongQus),
//           answeredQuestion: toArr(r.answeredQuestion).length
//             ? toArr(r.answeredQuestion)
//             : toArr(r.answeredQus).length
//               ? toArr(r.answeredQus)
//               : toArr(r.answered),
//           notAnswer: toArr(r.notAnswer).length
//             ? toArr(r.notAnswer)
//             : toArr(r.notAnsweredQus).length
//               ? toArr(r.notAnsweredQus)
//               : toArr(r.skipped),
//           markedAndAnswer: toArr(r.markedAndAnswer).length
//             ? toArr(r.markedAndAnswer)
//             : toArr(r.markedAndAnswered),
//           markedNotAnswer: toArr(r.markedNotAnswer).length
//             ? toArr(r.markedNotAnswer)
//             : toArr(r.markedNotAnswered),
//         },
//       });
//     } catch (e) {
//       toast({ title: "Could not load student result", status: "error" });
//     } finally {
//       setLoadingResultId(null);
//     }
//   };

//   // ── Non-owner view ────────────────────────────────────────────────────────
//   if (!isOwner) {
//     return (
//       <>
//         <TestInfoPage
//           test={test}
//           stats={stats}
//           onStart={handleStartTest}
//           user={user}
//           myResult={myResult}
//           selectedLang={selectedLang}
//           onLangChange={setSelectedLang}
//         />
//         <Modal isOpen={pwOpen} onClose={() => setPwOpen(false)} isCentered>
//           <ModalOverlay backdropFilter="blur(4px)" />
//           <ModalContent borderRadius="8px" fontFamily="Inter,sans-serif" mx={4}>
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

//   // ── Owner dashboard ───────────────────────────────────────────────────────
//   const TABS = [
//     { key: "overview", label: "Overview", icon: FaChartBar },
//     { key: "leaderboard", label: "Leaderboard", icon: FaTrophy },
//     { key: "questions", label: "Questions", icon: FaClipboardList },
//   ];

//   return (
//     <Box minH="100vh" bg="#f8fafc" fontFamily="Inter,sans-serif">
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
//                 <Flex
//                   align="center"
//                   gap={2}
//                   bg="rgba(255,215,0,.15)"
//                   border="1px solid rgba(255,215,0,.35)"
//                   px={3}
//                   py={1}
//                   borderRadius="full"
//                 >
//                   <Icon as={FaCrown} color="gold" fontSize="12px" />
//                   <Text fontSize="12px" fontWeight={700} color="gold">
//                     Your Test
//                   </Text>
//                 </Flex>
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

//           <Box
//             mt={8}
//             bg="rgba(255,255,255,.08)"
//             border="1px solid rgba(255,255,255,.14)"
//             borderRadius="8px"
//             p={{ base: 4, md: 6 }}
//           >
//             <Text
//               fontSize="11px"
//               fontWeight={800}
//               color="rgba(255,255,255,.4)"
//               textTransform="uppercase"
//               letterSpacing="2px"
//               mb={4}
//             >
//               Share Test Link
//             </Text>
//             <Flex gap={3} flexWrap={{ base: "wrap", sm: "nowrap" }} mb={3}>
//               <Box
//                 flex={1}
//                 bg="rgba(0,0,0,.3)"
//                 borderRadius="10px"
//                 px={4}
//                 py="11px"
//                 fontFamily="monospace"
//                 fontSize="12px"
//                 color="rgba(255,255,255,.8)"
//                 overflow="hidden"
//                 textOverflow="ellipsis"
//                 whiteSpace="nowrap"
//               >
//                 {isPrivate ? tokenUrl : shareUrl}
//               </Box>
//               <Button
//                 flexShrink={0}
//                 h="42px"
//                 px={5}
//                 borderRadius="10px"
//                 bg={copied ? "#22c55e" : "white"}
//                 color={copied ? "white" : "#1e3a5f"}
//                 fontWeight={800}
//                 fontSize="13px"
//                 leftIcon={
//                   <Icon as={copied ? FaCheck : FaLink} fontSize="12px" />
//                 }
//                 onClick={() => handleCopy(isPrivate ? tokenUrl : shareUrl)}
//                 _hover={{ bg: copied ? "#16a34a" : "#f0f7ff" }}
//               >
//                 {copied ? "Copied!" : "Copy"}
//               </Button>
//             </Flex>
//             <Flex gap={3} flexWrap="wrap">
//               <Button
//                 size="sm"
//                 leftIcon={<FaPlay />}
//                 bg="white"
//                 color="#0f1e3a"
//                 borderRadius="9px"
//                 fontWeight={700}
//                 onClick={launchTest}
//                 _hover={{ bg: "#f0f7ff" }}
//               >
//                 Preview Test
//               </Button>
//               <Button
//                 size="sm"
//                 bg="transparent"
//                 color="#fca5a5"
//                 border="1px solid rgba(239,68,68,.3)"
//                 borderRadius="9px"
//                 fontWeight={700}
//                 onClick={() => setDelOpen(true)}
//                 _hover={{ bg: "rgba(239,68,68,.2)", color: "white" }}
//               >
//                 Delete Test
//               </Button>
//             </Flex>
//           </Box>
//         </Box>
//       </Box>

//       <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
//         {/* ── Tab bar ──────────────────────────────────────────────────────── */}
//         <Box
//           bg="white"
//           borderRadius="12px"
//           border="1px solid #e2e8f0"
//           boxShadow="0 1px 4px rgba(0,0,0,.05)"
//           p="5px"
//           mb={6}
//           display="inline-flex"
//           gap="4px"
//         >
//           {TABS.map(({ key, label, icon }) => {
//             const active = tab === key;
//             return (
//               <Flex
//                 key={key}
//                 as="button"
//                 align="center"
//                 gap="7px"
//                 px={{ base: 3, md: 4 }}
//                 py="8px"
//                 borderRadius="8px"
//                 cursor="pointer"
//                 bg={active ? "#4a72b8" : "transparent"}
//                 color={active ? "white" : "#64748b"}
//                 fontWeight={active ? 700 : 500}
//                 fontSize="13px"
//                 onClick={() => setTab(key)}
//                 transition="all .15s"
//                 _hover={{
//                   bg: active ? "#4a72b8" : "#f1f5f9",
//                   color: active ? "white" : "#0f172a",
//                 }}
//                 border="none"
//                 outline="none"
//               >
//                 <Icon as={icon} fontSize="12px" />
//                 <Text as="span">{label}</Text>
//               </Flex>
//             );
//           })}
//         </Box>

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
//             borderRadius="8px"
//             border="1px solid #e2e8f0"
//             overflow="hidden"
//           >
//             <Flex
//               px={6}
//               py={4}
//               align="center"
//               gap={3}
//               borderBottom="1px solid #f1f5f9"
//               flexWrap="wrap"
//             >
//               <Icon as={FaTrophy} color="#f59e0b" />
//               <Text fontSize="15px" fontWeight={800} color="#0f172a">
//                 Leaderboard
//               </Text>
//               <Badge colorScheme="blue" borderRadius="full">
//                 {leaderboard.length} students
//               </Badge>
//               {/* hint for owner */}
//               <Flex
//                 align="center"
//                 gap={1.5}
//                 ml="auto"
//                 bg="#f0f7ff"
//                 px={3}
//                 py="4px"
//                 borderRadius="full"
//                 border="1px solid #bfdbfe"
//               >
//                 <Icon as={FaExternalLinkAlt} fontSize="9px" color="#2563eb" />
//                 <Text fontSize="11px" color="#2563eb" fontWeight={600}>
//                   Click student to view result
//                 </Text>
//               </Flex>
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
//                     isOwner={isOwner}
//                     onViewResult={handleViewStudentResult}
//                     loadingId={loadingResultId}
//                   />
//                 </Box>
//               ))
//             )}
//           </Box>
//         )}

//         {tab === "questions" && (
//           <Box
//             bg="white"
//             borderRadius="8px"
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

//       <Modal isOpen={pwOpen} onClose={() => setPwOpen(false)} isCentered>
//         <ModalOverlay backdropFilter="blur(4px)" />
//         <ModalContent borderRadius="8px" fontFamily="Inter,sans-serif" mx={4}>
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

//       <AlertDialog
//         isOpen={delOpen}
//         leastDestructiveRef={cancelRef}
//         onClose={() => setDelOpen(false)}
//         isCentered
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent
//             mx={4}
//             borderRadius="8px"
//             fontFamily="Inter,sans-serif"
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
import {
  useParams,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
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
  FaExternalLinkAlt,
} from "react-icons/fa";
import { apiFetch } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { socket } from "../services/socket";

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
  },
];

function StatCard({ icon, label, value, color = "#4a72b8", bg = "#eff6ff" }) {
  return (
    <Box bg={bg} borderRadius="7px" p={5} flex={1} minW="120px">
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

function LeaderRow({
  rank,
  result,
  currentUserId,
  isOwner,
  onViewResult,
  loadingId,
}) {
  const name = result.studentId?.Name || result.studentId?.Email || "Student";
  const pct = result.scorePercentage ?? result.percentage ?? 0;
  const isMe = String(result.studentId?._id) === String(currentUserId);
  const medals = ["🥇", "🥈", "🥉"];
  const isLoading = loadingId === result._id;

  return (
    <Flex
      px={5}
      py={3}
      align="center"
      gap={3}
      bg={isMe ? "linear-gradient(90deg,#eff6ff,#f0fdf4)" : "transparent"}
      borderLeft={isMe ? "3px solid #4a72b8" : "3px solid transparent"}
      _hover={
        isOwner ? { bg: "#f0f7ff", cursor: "pointer" } : { bg: "#f8fafc" }
      }
      onClick={isOwner && !isLoading ? () => onViewResult(result) : undefined}
      transition="background .15s"
      opacity={isLoading ? 0.7 : 1}
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
      {isOwner &&
        (isLoading ? (
          <Spinner size="xs" color="#4a72b8" flexShrink={0} ml={1} />
        ) : (
          <Icon
            as={FaExternalLinkAlt}
            fontSize="11px"
            color="#94a3b8"
            flexShrink={0}
            ml={1}
          />
        ))}
    </Flex>
  );
}

function LanguageSelector({ value, onChange, hasHindi }) {
  return (
    <Box
      bg="white"
      borderRadius="8px"
      border="1px solid #E2E8F0"
      p={{ base: "16px", md: "20px" }}
      mb="12px"
    >
      <Flex align="center" gap="10px" mb="14px">
        <Box
          w="34px"
          h="34px"
          borderRadius="7px"
          flexShrink={0}
          bg="#F5F3FF"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="16px"
        >
          🌐
        </Box>
        <Box>
          <Text fontSize="14px" fontWeight={700} color="#0F172A">
            Choose Test Language
          </Text>
          <Text fontSize="11px" color="#94A3B8" mt="1px">
            Questions will appear in your selected language
          </Text>
        </Box>
      </Flex>
      <Flex gap="8px" direction={{ base: "column", sm: "row" }}>
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
              opacity={isDisabled ? 0.45 : 1}
              transition="all .15s"
            >
              <Box
                border="2px solid"
                borderColor={isActive ? lang.accent : "#E2E8F0"}
                borderRadius="8px"
                p="12px"
                bg={isActive ? lang.lightBg : "white"}
                _hover={!isDisabled ? { borderColor: lang.accent } : {}}
              >
                <Flex align="center" justify="space-between" mb="6px">
                  <Flex align="center" gap="8px">
                    <Text fontSize="20px" lineHeight="1">
                      {lang.flag}
                    </Text>
                    <Box>
                      <Text
                        fontSize="13px"
                        fontWeight={700}
                        color={isActive ? lang.color : "#1E293B"}
                      >
                        {lang.label}
                      </Text>
                      {lang.native !== lang.label && (
                        <Text fontSize="10px" color="#94A3B8">
                          {lang.native}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                  <Box
                    w="18px"
                    h="18px"
                    borderRadius="full"
                    border="2px solid"
                    borderColor={isActive ? lang.accent : "#CBD5E1"}
                    bg={isActive ? lang.accent : "white"}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                  >
                    {isActive && (
                      <Icon as={FaCheck} fontSize="8px" color="white" />
                    )}
                  </Box>
                </Flex>
                <Text
                  fontSize="11px"
                  color={isActive ? lang.color : "#94A3B8"}
                  lineHeight="1.5"
                >
                  {lang.desc}
                </Text>
                {isDisabled && (
                  <Box
                    mt="6px"
                    display="inline-block"
                    bg="#FEF3C7"
                    px="6px"
                    py="2px"
                    borderRadius="4px"
                  >
                    <Text fontSize="10px" fontWeight={700} color="#B45309">
                      Not available
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Flex>
      {value && (
        <Flex
          mt="10px"
          p="8px"
          align="center"
          gap="8px"
          bg="#F0FDF4"
          borderRadius="6px"
          border="1px solid #BBF7D0"
        >
          <Icon as={FaCheck} fontSize="10px" color="#16A34A" />
          <Text fontSize="12px" color="#15803D" fontWeight={600}>
            Language set to{" "}
            <Text as="span" fontWeight={800} color="#0F172A">
              {LANGUAGES.find((l) => l.value === value)?.label}
            </Text>
          </Text>
        </Flex>
      )}
    </Box>
  );
}

function RuleCard({ number, icon, accent, bg, title, description }) {
  return (
    <Flex
      gap="12px"
      p="14px"
      borderRadius="8px"
      bg={bg}
      border={`1px solid ${accent}22`}
      align="flex-start"
    >
      <Box position="relative" flexShrink={0}>
        <Box
          w="34px"
          h="34px"
          bg={accent}
          borderRadius="8px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          fontSize="14px"
        >
          <Icon as={icon} />
        </Box>
        <Box
          position="absolute"
          top="-5px"
          right="-5px"
          w="14px"
          h="14px"
          bg="white"
          borderRadius="full"
          border={`2px solid ${accent}`}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="7px" fontWeight={800} color={accent}>
            {number}
          </Text>
        </Box>
      </Box>
      <Box flex={1}>
        <Text fontSize="13px" fontWeight={700} color="#0F172A" mb="3px">
          {title}
        </Text>
        <Text fontSize="11px" color="#64748B" lineHeight="1.65">
          {description}
        </Text>
      </Box>
    </Flex>
  );
}

// ── TestInfoPage (non-owner) ──────────────────────────────────────────────────
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
  const instructionsRef = useRef(null);

  useEffect(() => {
    if (window.location.hash === "#instructions" && instructionsRef.current) {
      const timer = setTimeout(() => {
        instructionsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  const timeLimitMin = test.timeLimitMin || test.timeLimit || 30;
  const isPrivate =
    test.visibility === "private" || test.accessType === "private";
  const isSectioned = test.isSectioned === true;

  // Total questions: from sections if sectioned, else flat questions array
  const questionCount =
    isSectioned && test.sections?.length
      ? test.sections.reduce((s, sec) => s + (sec.questions?.length || 0), 0)
      : test.questions?.length || 0;

  const secsPerQ = Math.round((timeLimitMin * 60) / Math.max(questionCount, 1));
  const hasHindi = isSectioned
    ? test.sections
        ?.flatMap((s) => s.questions || [])
        .some((q) => q.qush && String(q.qush).trim().length > 0)
    : test.questions?.some((q) => q.qush && String(q.qush).trim().length > 0);
  const redirectBack = encodeURIComponent(
    location.pathname + location.search + "#instructions",
  );

  const RULES = [
    {
      icon: FaEye,
      accent: "#2563eb",
      bg: "#eff6ff",
      title: "Stay on this page",
      description:
        "Do not switch browser tabs or open other apps during the test.",
    },
    {
      icon: FaRegClock,
      accent: "#d97706",
      bg: "#fffbeb",
      title: "Strict time limit",
      description: `You have exactly ${timeLimitMin} minutes. The test auto-submits when time runs out.`,
    },
    {
      icon: FaLayerGroup,
      accent: "#7c3aed",
      bg: "#f5f3ff",
      title: "Mark & review",
      description:
        "Use the question palette to jump between questions and mark for review.",
    },
    {
      icon: FaCheckCircle,
      accent: "#16a34a",
      bg: "#f0fdf4",
      title: "No negative marking",
      description: `Each correct answer scores 1 mark (total: ${questionCount}). Wrong answers carry zero penalty.`,
    },
    {
      icon: FaRedoAlt,
      accent: "#0891b2",
      bg: "#ecfeff",
      title: "Reconnection is safe",
      description:
        "Your answers are saved per question. Progress is recovered on reload.",
    },
    {
      icon: FaBan,
      accent: "#e11d48",
      bg: "#fff1f2",
      title: "No copy-paste",
      description:
        "Right-click and keyboard shortcuts are disabled during the test for fairness.",
    },
    {
      icon: FaMobileAlt,
      accent: "#ea580c",
      bg: "#fff7ed",
      title: "Use a stable device",
      description: "Laptop or desktop recommended. Keep your device charged.",
    },
    {
      icon: FaGlobe,
      accent: "#0d9488",
      bg: "#f0fdfa",
      title: "Stable internet required",
      description: "Use a reliable Wi-Fi or wired connection.",
    },
  ];

  const px = { base: "16px", md: "32px", lg: "48px" };

  return (
    <Box minH="100vh" bg="#F8FAFC" fontFamily="Inter, sans-serif">
      <Box
        bg="#0B1120"
        px={px}
        pt={{ base: "40px", md: "52px" }}
        pb={{ base: "52px", md: "68px" }}
      >
        <Box maxW="1200px" mx="auto">
          <Flex
            align="center"
            gap="8px"
            mb="28px"
            cursor="pointer"
            w="fit-content"
            color="rgba(255,255,255,.4)"
            _hover={{ color: "rgba(255,255,255,.8)" }}
            onClick={() => navigate(-1)}
          >
            <Icon as={FaArrowLeft} fontSize="11px" />
            <Text fontSize="13px" fontWeight={500}>
              Back
            </Text>
          </Flex>

          <Flex
            align="flex-start"
            gap="16px"
            flexWrap={{ base: "wrap", sm: "nowrap" }}
          >
            <Box
              w={{ base: "48px", md: "56px" }}
              h={{ base: "48px", md: "56px" }}
              flexShrink={0}
              bg="#1E293B"
              borderRadius="10px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize={{ base: "22px", md: "26px" }}
            >
              📋
            </Box>
            <Box flex={1} minW={0}>
              <Flex flexWrap="wrap" gap="8px" mb="10px" align="center">
                {test.examType && (
                  <Box
                    bg="#1E3A5F"
                    color="#93C5FD"
                    px="10px"
                    py="3px"
                    borderRadius="4px"
                    fontSize="11px"
                    fontWeight={700}
                    letterSpacing="0.8px"
                  >
                    {test.examType}
                  </Box>
                )}
                {isSectioned && (
                  <Flex
                    align="center"
                    gap={1}
                    bg="rgba(56,189,248,.15)"
                    color="#38bdf8"
                    px="10px"
                    py="3px"
                    borderRadius="4px"
                    fontSize="11px"
                    fontWeight={700}
                  >
                    <Icon as={FaLayerGroup} fontSize="10px" />
                    {test.sections?.length} Sections
                  </Flex>
                )}
                {isPrivate && (
                  <Box
                    bg="#3B1219"
                    color="#FCA5A5"
                    px="10px"
                    py="3px"
                    borderRadius="4px"
                    fontSize="11px"
                    fontWeight={700}
                  >
                    🔒 Private
                  </Box>
                )}
                {myResult && (
                  <Box
                    bg="#14532D"
                    color="#86EFAC"
                    px="10px"
                    py="3px"
                    borderRadius="4px"
                    fontSize="11px"
                    fontWeight={700}
                  >
                    ✓ Already attempted
                  </Box>
                )}
              </Flex>
              <Text
                fontSize={{ base: "22px", md: "34px" }}
                fontWeight={800}
                color="white"
                letterSpacing="-0.8px"
                lineHeight="1.15"
                mb="6px"
              >
                {test.title}
              </Text>
              {!isSectioned && test.subject && (
                <Text
                  fontSize="13px"
                  color="rgba(255,255,255,.35)"
                  fontWeight={500}
                >
                  Subject:{" "}
                  {test.subject.charAt(0).toUpperCase() + test.subject.slice(1)}
                </Text>
              )}
            </Box>
          </Flex>

          <Flex
            mt="28px"
            pt="24px"
            borderTop="1px solid rgba(255,255,255,.07)"
            gap={{ base: "24px", md: "40px" }}
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
              <Flex key={s.label} align="center" gap="10px">
                <Icon
                  as={s.icon}
                  fontSize="13px"
                  color="rgba(255,255,255,.3)"
                />
                <Box>
                  <Text
                    fontSize={{ base: "18px", md: "22px" }}
                    fontWeight={800}
                    color="white"
                    lineHeight="1"
                    letterSpacing="-0.5px"
                  >
                    {s.value}
                  </Text>
                  <Text
                    fontSize="10px"
                    color="rgba(255,255,255,.35)"
                    textTransform="uppercase"
                    letterSpacing="0.8px"
                    mt="2px"
                  >
                    {s.label}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Flex>
        </Box>
      </Box>

      <Box
        maxW="1200px"
        mx="auto"
        px={px}
        mt="-24px"
        pb="60px"
        position="relative"
        zIndex={1}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 300px" }}
          gap="16px"
          alignItems="start"
        >
          <Box>
            {myResult && (
              <Box
                bg="white"
                borderRadius="8px"
                border="1px solid #86EFAC"
                p="16px"
                mb="12px"
              >
                <Flex align="center" gap="14px" flexWrap="wrap">
                  <Box
                    w="44px"
                    h="44px"
                    bg="#F0FDF4"
                    borderRadius="8px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexShrink={0}
                    border="1px solid #86EFAC"
                  >
                    <Icon as={FaTrophy} color="#16a34a" fontSize="18px" />
                  </Box>
                  <Box flex={1}>
                    <Text
                      fontSize="11px"
                      fontWeight={700}
                      color="#16a34a"
                      textTransform="uppercase"
                      letterSpacing=".8px"
                    >
                      Your Previous Attempt
                    </Text>
                    <Flex align="baseline" gap="8px" mt="2px">
                      <Text
                        fontSize="28px"
                        fontWeight={800}
                        color="#15803d"
                        lineHeight="1"
                        letterSpacing="-1px"
                      >
                        {(
                          myResult.scorePercentage ??
                          myResult.percentage ??
                          0
                        ).toFixed(0)}
                        %
                      </Text>
                      <Text fontSize="13px" color="#16a34a" fontWeight={600}>
                        · {myResult.correct ?? myResult.correctQus?.length ?? 0}
                        /{questionCount} correct
                      </Text>
                    </Flex>
                  </Box>
                  <Badge
                    fontSize="11px"
                    px={3}
                    py={1}
                    borderRadius="4px"
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

            <LanguageSelector
              value={selectedLang}
              onChange={onLangChange}
              hasHindi={hasHindi}
            />

            {/* Section overview for non-owner */}
            {isSectioned && test.sections?.length > 0 && (
              <Box
                bg="white"
                borderRadius="8px"
                border="1px solid #E2E8F0"
                p={{ base: "16px", md: "20px" }}
                mb="12px"
              >
                <Flex align="center" gap="10px" mb="14px">
                  <Icon as={FaLayerGroup} color="#2563EB" fontSize="14px" />
                  <Text fontSize="14px" fontWeight={700} color="#0F172A">
                    Test Sections
                  </Text>
                </Flex>
                <Flex direction="column" gap={2}>
                  {test.sections.map((sec, i) => (
                    <Flex
                      key={i}
                      align="center"
                      justify="space-between"
                      bg="#f8fafc"
                      borderRadius="8px"
                      border="1px solid #e2e8f0"
                      px={4}
                      py={3}
                    >
                      <Flex align="center" gap={3}>
                        <Flex
                          w="24px"
                          h="24px"
                          bg="#eff6ff"
                          borderRadius="6px"
                          align="center"
                          justify="center"
                          flexShrink={0}
                        >
                          <Text
                            fontSize="10px"
                            fontWeight={900}
                            color="#2563eb"
                          >
                            {i + 1}
                          </Text>
                        </Flex>
                        <Text
                          fontSize="13px"
                          fontWeight={700}
                          color="#0f172a"
                          textTransform="capitalize"
                        >
                          {sec.name || sec.subject}
                        </Text>
                      </Flex>
                      <Text fontSize="12px" color="#64748b" fontWeight={600}>
                        {sec.questions?.length || 0} questions
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            )}

            <Box
              bg="white"
              borderRadius="8px"
              border="1px solid #E2E8F0"
              p={{ base: "16px", md: "20px" }}
              mb="12px"
            >
              <Flex align="center" gap="10px" mb="16px">
                <Icon as={FaInfoCircle} color="#2563EB" fontSize="14px" />
                <Text fontSize="14px" fontWeight={700} color="#0F172A">
                  Test Details
                </Text>
              </Flex>
              <Grid
                templateColumns={{ base: "1fr 1fr", md: "repeat(3,1fr)" }}
                gap="10px"
              >
                {[
                  {
                    label: "Questions",
                    value: questionCount,
                    accent: "#2563EB",
                  },
                  {
                    label: "Duration",
                    value: `${timeLimitMin} min`,
                    accent: "#D97706",
                  },
                  {
                    label: "Per Question",
                    value: `~${secsPerQ} sec`,
                    accent: "#16A34A",
                  },
                  {
                    label: "Total Marks",
                    value: `${questionCount}`,
                    accent: "#7C3AED",
                  },
                  { label: "Pass Mark", value: "40%", accent: "#DC2626" },
                  {
                    label: isSectioned ? "Sections" : "Subject",
                    value: isSectioned
                      ? `${test.sections?.length} sections`
                      : test.subject
                        ? test.subject.charAt(0).toUpperCase() +
                          test.subject.slice(1)
                        : "General",
                    accent: "#0891B2",
                  },
                  {
                    label: "Exam Type",
                    value: test.examType || "General",
                    accent: "#EA580C",
                  },
                  {
                    label: "Language",
                    value:
                      LANGUAGES.find((l) => l.value === selectedLang)?.label ||
                      "English",
                    accent: "#6D28D9",
                  },
                  {
                    label: "Access",
                    value: isPrivate ? "🔒 Private" : "🌐 Public",
                    accent: "#374151",
                  },
                ].map(({ label, value, accent }) => (
                  <Box
                    key={label}
                    bg="#F8FAFC"
                    borderRadius="6px"
                    p="12px"
                    border="1px solid #F1F5F9"
                  >
                    <Text
                      fontSize="10px"
                      fontWeight={700}
                      color="#94A3B8"
                      textTransform="uppercase"
                      letterSpacing=".8px"
                      mb="4px"
                    >
                      {label}
                    </Text>
                    <Text fontSize="14px" fontWeight={800} color={accent}>
                      {value}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </Box>

            <Box
              ref={instructionsRef}
              bg="white"
              borderRadius="8px"
              border="1px solid #E2E8F0"
              p={{ base: "16px", md: "20px" }}
              mb="12px"
            >
              <Flex align="center" gap="10px" mb="16px">
                <Icon as={FaShieldAlt} color="#D97706" fontSize="14px" />
                <Box>
                  <Text fontSize="14px" fontWeight={700} color="#0F172A">
                    Instructions
                  </Text>
                  <Text fontSize="11px" color="#94A3B8" mt="1px">
                    Read carefully before starting
                  </Text>
                </Box>
              </Flex>
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap="8px">
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

            <Box
              bg="#FFFBEB"
              border="1px solid #FDE68A"
              borderRadius="8px"
              p="16px"
              mb="12px"
            >
              <Flex align="center" gap="8px" mb="10px">
                <Icon
                  as={FaExclamationTriangle}
                  color="#D97706"
                  fontSize="13px"
                />
                <Text fontSize="13px" fontWeight={700} color="#92400E">
                  Before You Start
                </Text>
              </Flex>
              <Flex direction="column" gap="6px">
                {[
                  `Once started, the ${timeLimitMin}-minute timer cannot be paused or reset`,
                  "Ensure your device is fully charged or connected to power",
                  "Close all other browser tabs to avoid accidental navigation",
                  "Use a laptop or desktop for the best test-taking experience",
                  "Refreshing the page mid-test is safe — your progress is auto-saved",
                ].map((w, i) => (
                  <Flex key={i} align="flex-start" gap="8px">
                    <Box
                      w="18px"
                      h="18px"
                      bg="#FDE68A"
                      borderRadius="4px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      flexShrink={0}
                      mt="1px"
                    >
                      <Text fontSize="9px" fontWeight={800} color="#92400E">
                        {i + 1}
                      </Text>
                    </Box>
                    <Text fontSize="12px" color="#78350F" lineHeight="1.65">
                      {w}
                    </Text>
                  </Flex>
                ))}
              </Flex>
            </Box>
          </Box>

          {/* Sticky sidebar */}
          <Box position={{ base: "static", lg: "sticky" }} top={{ lg: "20px" }}>
            <Box
              bg="white"
              borderRadius="8px"
              border="1px solid #E2E8F0"
              overflow="hidden"
              mb="12px"
            >
              <Box
                bg="#0B1120"
                px="20px"
                pt="20px"
                pb="28px"
                textAlign="center"
              >
                <Box fontSize="28px" mb="8px">
                  🎯
                </Box>
                <Text fontSize="15px" fontWeight={800} color="white">
                  {myResult ? "Retake the Test" : "Ready to Begin?"}
                </Text>
                <Text fontSize="12px" color="rgba(255,255,255,.4)" mt="4px">
                  {questionCount} questions · {timeLimitMin} min ·{" "}
                  {LANGUAGES.find((l) => l.value === selectedLang)?.label}
                  {isSectioned && ` · ${test.sections?.length} sections`}
                </Text>
              </Box>
              <Box px="16px" pt="16px" pb="20px">
                <Box
                  mb="12px"
                  bg="#F8FAFC"
                  borderRadius="8px"
                  border="1px solid #E2E8F0"
                  overflow="hidden"
                >
                  <Flex
                    align="center"
                    gap="8px"
                    px="14px"
                    py="10px"
                    borderBottom="1px solid #F1F5F9"
                    bg="white"
                  >
                    <Icon as={FaClock} color="#D97706" fontSize="12px" />
                    <Text fontSize="12px" fontWeight={700} color="#374151">
                      Time Allowed
                    </Text>
                  </Flex>
                  <Box
                    bg="#FFFBEB"
                    px="14px"
                    py="14px"
                    borderBottom="1px solid #FDE68A"
                  >
                    <Flex align="center" justify="center" gap="6px">
                      {timeLimitMin >= 60 && (
                        <>
                          <Box textAlign="center">
                            <Box
                              bg="white"
                              borderRadius="6px"
                              px="10px"
                              py="8px"
                              border="1px solid #FDE68A"
                              minW="46px"
                            >
                              <Text
                                fontSize="26px"
                                fontWeight={800}
                                color="#92400E"
                                lineHeight="1"
                                letterSpacing="-1.5px"
                              >
                                {Math.floor(timeLimitMin / 60)
                                  .toString()
                                  .padStart(2, "0")}
                              </Text>
                            </Box>
                            <Text
                              fontSize="9px"
                              color="#B45309"
                              fontWeight={700}
                              textTransform="uppercase"
                              letterSpacing=".8px"
                              mt="4px"
                            >
                              HRS
                            </Text>
                          </Box>
                          <Text
                            fontSize="24px"
                            fontWeight={800}
                            color="#D97706"
                            mb="12px"
                          >
                            :
                          </Text>
                        </>
                      )}
                      <Box textAlign="center">
                        <Box
                          bg="white"
                          borderRadius="6px"
                          px="10px"
                          py="8px"
                          border="1px solid #FDE68A"
                          minW="46px"
                        >
                          <Text
                            fontSize="26px"
                            fontWeight={800}
                            color="#92400E"
                            lineHeight="1"
                            letterSpacing="-1.5px"
                          >
                            {(timeLimitMin % 60).toString().padStart(2, "0")}
                          </Text>
                        </Box>
                        <Text
                          fontSize="9px"
                          color="#B45309"
                          fontWeight={700}
                          textTransform="uppercase"
                          letterSpacing=".8px"
                          mt="4px"
                        >
                          MIN
                        </Text>
                      </Box>
                      <Text
                        fontSize="24px"
                        fontWeight={800}
                        color="#D97706"
                        mb="12px"
                      >
                        :
                      </Text>
                      <Box textAlign="center">
                        <Box
                          bg="white"
                          borderRadius="6px"
                          px="10px"
                          py="8px"
                          border="1px solid #FDE68A"
                          minW="46px"
                        >
                          <Text
                            fontSize="26px"
                            fontWeight={800}
                            color="#B45309"
                            lineHeight="1"
                            letterSpacing="-1.5px"
                          >
                            00
                          </Text>
                        </Box>
                        <Text
                          fontSize="9px"
                          color="#B45309"
                          fontWeight={700}
                          textTransform="uppercase"
                          letterSpacing=".8px"
                          mt="4px"
                        >
                          SEC
                        </Text>
                      </Box>
                    </Flex>
                  </Box>
                  <Flex
                    px="14px"
                    py="10px"
                    align="center"
                    justify="space-between"
                  >
                    <Text fontSize="12px" color="#64748B">
                      ~per question
                    </Text>
                    <Box
                      bg="#F0FDF4"
                      border="1px solid #BBF7D0"
                      px="10px"
                      py="3px"
                      borderRadius="4px"
                    >
                      <Text fontSize="12px" fontWeight={800} color="#15803D">
                        ⚡ ~{secsPerQ}s
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                <Box
                  border="2px solid"
                  mb="12px"
                  borderColor={agreed ? "#2563EB" : "#E2E8F0"}
                  borderRadius="8px"
                  bg={agreed ? "#EFF6FF" : "white"}
                  cursor="pointer"
                  transition="all .15s"
                  _hover={{ borderColor: "#2563EB" }}
                  onClick={() => setAgreed((p) => !p)}
                  p="12px"
                >
                  <Flex align="flex-start" gap="10px">
                    <Box
                      flexShrink={0}
                      mt="1px"
                      w="20px"
                      h="20px"
                      borderRadius="5px"
                      bg={agreed ? "#2563EB" : "white"}
                      border="2px solid"
                      borderColor={agreed ? "#2563EB" : "#CBD5E1"}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="all .15s"
                    >
                      {agreed && (
                        <Icon as={FaCheck} fontSize="9px" color="white" />
                      )}
                    </Box>
                    <Text
                      fontSize="12px"
                      color={agreed ? "#1E40AF" : "#64748B"}
                      lineHeight={1.65}
                      fontWeight={agreed ? 600 : 400}
                    >
                      I have read all instructions and agree to the test rules.
                    </Text>
                  </Flex>
                </Box>

                {!user ? (
                  <>
                    <Button
                      w="full"
                      h="46px"
                      borderRadius="7px"
                      mb="8px"
                      bg="#0B1120"
                      color="white"
                      fontWeight={700}
                      fontSize="14px"
                      leftIcon={<FaPlay />}
                      onClick={() =>
                        navigate(`/auth/signin?redirect=${redirectBack}`)
                      }
                      _hover={{ bg: "#1E293B" }}
                    >
                      Sign In to Start
                    </Button>
                    <Button
                      w="full"
                      h="40px"
                      borderRadius="7px"
                      variant="outline"
                      borderColor="#E2E8F0"
                      color="#374151"
                      fontWeight={600}
                      fontSize="13px"
                      onClick={() =>
                        navigate(`/auth/signup?redirect=${redirectBack}`)
                      }
                      _hover={{ bg: "#F8FAFC" }}
                    >
                      Create Account
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      w="full"
                      h="48px"
                      borderRadius="7px"
                      bg={agreed ? "#1D4ED8" : "#F1F5F9"}
                      color={agreed ? "white" : "#94A3B8"}
                      fontWeight={700}
                      fontSize="15px"
                      leftIcon={<Icon as={FaPlay} fontSize="12px" />}
                      cursor={agreed ? "pointer" : "not-allowed"}
                      onClick={agreed ? onStart : undefined}
                      _hover={agreed ? { bg: "#1E40AF" } : {}}
                      transition="all .15s"
                    >
                      {myResult ? "Retake Test" : "Start Test"}
                    </Button>
                    {!agreed && (
                      <Text
                        fontSize="11px"
                        color="#F59E0B"
                        textAlign="center"
                        mt="8px"
                        fontWeight={600}
                      >
                        ☝️ Check the box above to start
                      </Text>
                    )}
                    <Text
                      fontSize="11px"
                      color="#94A3B8"
                      textAlign="center"
                      mt="8px"
                    >
                      as {user.Name || user.Email}
                    </Text>
                  </>
                )}
              </Box>
            </Box>

            {stats && stats.totalAttempts > 0 && (
              <Box
                bg="white"
                borderRadius="8px"
                border="1px solid #E2E8F0"
                p="16px"
              >
                <Text
                  fontSize="11px"
                  fontWeight={700}
                  color="#94A3B8"
                  textTransform="uppercase"
                  letterSpacing=".8px"
                  mb="14px"
                >
                  Community Stats
                </Text>
                {[
                  {
                    label: "Attempts",
                    value: stats.totalAttempts,
                    color: "#2563EB",
                  },
                  {
                    label: "Pass Rate",
                    value: `${stats.passRate}%`,
                    color: "#16A34A",
                  },
                  {
                    label: "Avg Score",
                    value: `${stats.avgPercentage}%`,
                    color: "#7C3AED",
                  },
                  {
                    label: "Top Score",
                    value: `${stats.highestScore}%`,
                    color: "#EA580C",
                  },
                ].map(({ label, value, color }, i, arr) => (
                  <Flex
                    key={label}
                    justify="space-between"
                    align="center"
                    pb={i < arr.length - 1 ? "10px" : 0}
                    mb={i < arr.length - 1 ? "10px" : 0}
                    borderBottom={
                      i < arr.length - 1 ? "1px solid #F8FAFC" : "none"
                    }
                  >
                    <Text fontSize="13px" color="#64748B">
                      {label}
                    </Text>
                    <Text fontSize="14px" fontWeight={800} color={color}>
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

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
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
  const [copied, setCopied] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [delOpen, setDelOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("english");
  const [loadingResultId, setLoadingResultId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const VALID_TABS = ["overview", "leaderboard", "questions"];
  const rawTab = searchParams.get("tab") || "overview";
  const tab = VALID_TABS.includes(rawTab) ? rawTab : "overview";
  const setTab = (t) => setSearchParams({ tab: t }, { replace: true });

  const viaToken = Boolean(location.state?.viaToken);

  const firstAttemptPerStudent = (raw) => {
    const seen = new Map();
    const byDate = [...raw].sort(
      (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
    );
    for (const r of byDate) {
      const key = String(r.studentId?._id || r.studentId || r._id);
      if (!seen.has(key)) seen.set(key, r);
    }
    return Array.from(seen.values()).sort((a, b) => {
      const pa = a.scorePercentage ?? a.percentage ?? 0;
      const pb = b.scorePercentage ?? b.percentage ?? 0;
      return pb - pa;
    });
  };

  const load = useCallback(async () => {
    try {
      let testData = null;
      const isObjectId = /^[a-f\d]{24}$/i.test(id);
      if (isObjectId) {
        const res = await apiFetch(`/tests/id/${id}`);
        testData = res.data;
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

      // Determine hasHindi considering sectioned tests
      const allQs =
        testData.isSectioned && testData.sections?.length
          ? testData.sections.flatMap((s) => s.questions || [])
          : testData.questions || [];
      const hasHindi = allQs.some(
        (q) => q.qush && String(q.qush).trim().length > 0,
      );
      if (!hasHindi) setSelectedLang("english");

      const testId = testData._id;
      const [statsRes, lbRes] = await Promise.all([
        apiFetch(`/tests/${testId}/stats`).catch(() => ({ data: null })),
        apiFetch(`/tests/${testId}/leaderboard`).catch(() => ({ data: [] })),
      ]);
      setStats(statsRes.data);
      setLeaderboard(firstAttemptPerStudent(lbRes.data || []));
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

  useEffect(() => {
    if (!test?._id) return;
    const onAttempted = ({ testId }) => {
      if (String(testId) === String(test._id)) {
        Promise.all([
          apiFetch(`/tests/${test._id}/stats`).catch(() => ({ data: null })),
          apiFetch(`/tests/${test._id}/leaderboard`).catch(() => ({
            data: [],
          })),
        ]).then(([sRes, lbRes]) => {
          setStats(sRes.data);
          setLeaderboard(firstAttemptPerStudent(lbRes.data || []));
        });
      }
    };
    socket.on("test:attempted", onAttempted);
    return () => socket.off("test:attempted", onAttempted);
  }, [test?._id]);

  if (loading)
    return (
      <Flex minH="80vh" align="center" justify="center">
        <Spinner size="xl" color="#4a72b8" thickness="4px" />
      </Flex>
    );
  if (!test)
    return (
      <Box textAlign="center" py={20} fontFamily="Inter,sans-serif">
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

  const isSectioned = test.isSectioned === true;
  const isPrivate =
    test.visibility === "private" || test.accessType === "private";
  const timeLimitMin = test.timeLimitMin || test.timeLimit || 30;
  const shareUrl = `${window.location.origin}/tests/${test.slug || id}`;
  const tokenUrl = test.accessToken
    ? `${window.location.origin}/tests/token/${test.accessToken}`
    : shareUrl;

  // Total question count
  const totalQuestionCount =
    isSectioned && test.sections?.length
      ? test.sections.reduce((s, sec) => s + (sec.questions?.length || 0), 0)
      : test.questions?.length || 0;

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Launch test — flattens sections if sectioned
  const launchTest = () => {
    let questArray = [];
    let sectionsMeta = [];

    if (isSectioned && test.sections?.length) {
      questArray = test.sections.flatMap((s) => s.questions || []);
      sectionsMeta = test.sections.map((s) => ({
        name: s.name || s.subject || "",
        subject: s.subject || "",
        count: s.questions?.length || 0,
      }));
    } else {
      questArray = test.questions || [];
    }

    if (!questArray.length) {
      toast({ title: "This test has no questions", status: "error" });
      return;
    }

    navigate("/test", {
      state: {
        quest: questArray,
        testLanguage: selectedLang,
        testMeta: {
          subject: test.subject || "general",
          category: test.examType || test.title,
          timeLimitMin,
          testIndex: 0,
          testId: test._id,
          testTitle: test.title,
          isSectioned,
          sections: sectionsMeta,
        },
      },
    });
  };

  const handleStartTest = () => {
    if (!user) {
      const rb = encodeURIComponent(
        location.pathname + location.search + "#instructions",
      );
      navigate(`/auth/signin?redirect=${rb}`);
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

  // Owner clicks leaderboard row
  const handleViewStudentResult = async (leaderboardEntry) => {
    const resultId = leaderboardEntry._id;
    if (!resultId) return;
    setLoadingResultId(resultId);
    try {
      const res = await apiFetch(`/results/${resultId}`);
      const r = res.data || res;
      const studentName = r.studentId?.Name || r.studentId?.Email || "Student";
      const studentId = String(r.studentId?._id || r.studentId);

      const originalQuestions =
        isSectioned && test.sections?.length
          ? test.sections.flatMap((s) => s.questions || [])
          : Array.isArray(r.testId?.questions) && r.testId.questions.length
            ? r.testId.questions
            : test.questions || [];

      const shuffledQuestions =
        Array.isArray(r.shuffledQuestions) && r.shuffledQuestions.length > 0
          ? r.shuffledQuestions
          : null;

      let allAttempts = [];
      try {
        const allRes = await apiFetch(`/results/test/${test._id}`);
        const allRaw = allRes.data || [];
        allAttempts = allRaw
          .filter((a) => String(a.studentId?._id || a.studentId) === studentId)
          .sort(
            (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
          )
          .map((a, idx) => ({
            _id: a._id,
            attemptNumber: idx + 1,
            createdAt: a.createdAt,
            scorePercentage: a.scorePercentage ?? a.percentage ?? 0,
            timeTakenSec: a.timeTakenSec ?? a.timeTaken ?? 0,
            correct:
              a.correct ??
              (Array.isArray(a.correctQus) ? a.correctQus.length : 0),
            totalQuestions: originalQuestions.length,
          }));
      } catch {
        /* show single result */
      }

      const toArr = (v) => (Array.isArray(v) ? v : []);

      // Build sectionMeta for result page
      const sectionsMeta =
        isSectioned && test.sections?.length
          ? test.sections.map((s) => ({
              name: s.name || s.subject || "",
              subject: s.subject || "",
              count: s.questions?.length || 0,
            }))
          : [];

      navigate("/test-result", {
        state: {
          viewingAs: "owner",
          studentName,
          studentId,
          testId: String(test._id),
          backUrl: `/tests/${test.slug || test._id}?tab=leaderboard`,
          allAttempts,
          currentAttemptId: String(resultId),
          testTitle: test.title,
          isSectioned,
          sectionMeta: sectionsMeta,
          sectionScores: toArr(r.sectionScores),
          score:
            r.correct ??
            (Array.isArray(r.correctQus) ? r.correctQus.length : 0) ??
            0,
          totalQuestions: originalQuestions.length || r.totalQuestions || 0,
          scorePercentage: r.scorePercentage ?? r.percentage ?? 0,
          percentile: r.percentile ?? null,
          timeTaken: r.timeTakenSec ?? r.timeTaken ?? 0,
          shuffledQuestions: shuffledQuestions || [],
          questions: originalQuestions,
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
    } catch (e) {
      toast({ title: "Could not load student result", status: "error" });
    } finally {
      setLoadingResultId(null);
    }
  };

  // ── Non-owner view ────────────────────────────────────────────────────────
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
          <ModalContent borderRadius="8px" fontFamily="Inter,sans-serif" mx={4}>
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

  // ── Owner dashboard ───────────────────────────────────────────────────────
  const TABS = [
    { key: "overview", label: "Overview", icon: FaChartBar },
    { key: "leaderboard", label: "Leaderboard", icon: FaTrophy },
    { key: "questions", label: "Questions", icon: FaClipboardList },
  ];

  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="Inter,sans-serif">
      {/* Hero */}
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
                {isSectioned && (
                  <Flex
                    align="center"
                    gap={1.5}
                    bg="rgba(56,189,248,.15)"
                    border="1px solid rgba(56,189,248,.3)"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    <Icon as={FaLayerGroup} color="#38bdf8" fontSize="11px" />
                    <Text fontSize="12px" fontWeight={700} color="#38bdf8">
                      {test.sections?.length} Sections
                    </Text>
                  </Flex>
                )}
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
                    {totalQuestionCount} Questions
                    {isSectioned && ` · ${test.sections?.length} sections`}
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

          {/* Share bar */}
          <Box
            mt={8}
            bg="rgba(255,255,255,.08)"
            border="1px solid rgba(255,255,255,.14)"
            borderRadius="8px"
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

      <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        {/* Tab bar */}
        <Box
          bg="white"
          borderRadius="12px"
          border="1px solid #e2e8f0"
          boxShadow="0 1px 4px rgba(0,0,0,.05)"
          p="5px"
          mb={6}
          display="inline-flex"
          gap="4px"
        >
          {TABS.map(({ key, label, icon }) => {
            const active = tab === key;
            return (
              <Flex
                key={key}
                as="button"
                align="center"
                gap="7px"
                px={{ base: 3, md: 4 }}
                py="8px"
                borderRadius="8px"
                cursor="pointer"
                bg={active ? "#4a72b8" : "transparent"}
                color={active ? "white" : "#64748b"}
                fontWeight={active ? 700 : 500}
                fontSize="13px"
                onClick={() => setTab(key)}
                transition="all .15s"
                _hover={{
                  bg: active ? "#4a72b8" : "#f1f5f9",
                  color: active ? "white" : "#0f172a",
                }}
                border="none"
                outline="none"
              >
                <Icon as={icon} fontSize="12px" />
                <Text as="span">{label}</Text>
              </Flex>
            );
          })}
        </Box>

        {/* Overview tab */}
        {tab === "overview" && (
          <Box>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2,1fr)",
                lg: "repeat(4,1fr)",
              }}
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

            {/* Per-section stats for owner */}
            {isSectioned && stats?.sectionStats?.length > 0 && (
              <Box
                bg="white"
                borderRadius="12px"
                border="1px solid #e2e8f0"
                boxShadow="0 1px 4px rgba(0,0,0,.05)"
                overflow="hidden"
              >
                <Flex
                  px={6}
                  py={4}
                  align="center"
                  gap={2}
                  borderBottom="1px solid #f1f5f9"
                >
                  <Icon as={FaLayerGroup} color="#2563eb" fontSize="14px" />
                  <Text fontSize="15px" fontWeight={800} color="#0f172a">
                    Section Performance
                  </Text>
                </Flex>
                {stats.sectionStats.map((sec, i) => (
                  <Flex
                    key={i}
                    px={6}
                    py={4}
                    align="center"
                    gap={4}
                    borderBottom={
                      i < stats.sectionStats.length - 1
                        ? "1px solid #f8fafc"
                        : "none"
                    }
                    flexWrap="wrap"
                  >
                    <Flex align="center" gap={2} flex={1} minW={0}>
                      <Flex
                        w="26px"
                        h="26px"
                        bg="#eff6ff"
                        borderRadius="7px"
                        align="center"
                        justify="center"
                        flexShrink={0}
                      >
                        <Text fontSize="10px" fontWeight={900} color="#2563eb">
                          {i + 1}
                        </Text>
                      </Flex>
                      <Box minW={0}>
                        <Text
                          fontSize="13px"
                          fontWeight={700}
                          color="#0f172a"
                          textTransform="capitalize"
                          noOfLines={1}
                        >
                          {sec.name || sec.subject}
                        </Text>
                        <Text fontSize="11px" color="#94a3b8">
                          {sec.totalQuestions} questions
                        </Text>
                      </Box>
                    </Flex>
                    <Flex align="center" gap={3}>
                      <Box>
                        <Text
                          fontSize="11px"
                          color="#94a3b8"
                          fontWeight={600}
                          textTransform="uppercase"
                          letterSpacing=".6px"
                          mb={1}
                        >
                          Avg Score
                        </Text>
                        <Text
                          fontSize="18px"
                          fontWeight={800}
                          color={
                            sec.avgPercentage >= 60
                              ? "#16a34a"
                              : sec.avgPercentage >= 40
                                ? "#d97706"
                                : "#ef4444"
                          }
                        >
                          {sec.avgPercentage}%
                        </Text>
                      </Box>
                      <Box w="80px">
                        <Progress
                          value={sec.avgPercentage}
                          size="xs"
                          colorScheme={
                            sec.avgPercentage >= 60
                              ? "green"
                              : sec.avgPercentage >= 40
                                ? "yellow"
                                : "red"
                          }
                          borderRadius="full"
                        />
                      </Box>
                    </Flex>
                  </Flex>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Leaderboard tab */}
        {tab === "leaderboard" && (
          <Box
            bg="white"
            borderRadius="8px"
            border="1px solid #e2e8f0"
            overflow="hidden"
          >
            <Flex
              px={6}
              py={4}
              align="center"
              gap={3}
              borderBottom="1px solid #f1f5f9"
              flexWrap="wrap"
            >
              <Icon as={FaTrophy} color="#f59e0b" />
              <Text fontSize="15px" fontWeight={800} color="#0f172a">
                Leaderboard
              </Text>
              <Badge colorScheme="blue" borderRadius="full">
                {leaderboard.length} students
              </Badge>
              <Flex
                align="center"
                gap={1.5}
                ml="auto"
                bg="#f0f7ff"
                px={3}
                py="4px"
                borderRadius="full"
                border="1px solid #bfdbfe"
              >
                <Icon as={FaExternalLinkAlt} fontSize="9px" color="#2563eb" />
                <Text fontSize="11px" color="#2563eb" fontWeight={600}>
                  Click student to view result
                </Text>
              </Flex>
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
                    isOwner={isOwner}
                    onViewResult={handleViewStudentResult}
                    loadingId={loadingResultId}
                  />
                </Box>
              ))
            )}
          </Box>
        )}

        {/* Questions tab */}
        {tab === "questions" && (
          <Box
            bg="white"
            borderRadius="8px"
            border="1px solid #e2e8f0"
            overflow="hidden"
          >
            <Flex px={6} py={4} align="center" borderBottom="1px solid #f1f5f9">
              <Text fontSize="15px" fontWeight={800} color="#0f172a">
                Questions Preview
              </Text>
              <Badge ml={3} colorScheme="blue">
                {totalQuestionCount}
              </Badge>
              {isSectioned && (
                <Badge ml={2} colorScheme="purple">
                  {test.sections?.length} sections
                </Badge>
              )}
            </Flex>

            {isSectioned && test.sections?.length
              ? test.sections.map((sec, sIdx) => (
                  <Box key={sIdx}>
                    {/* Section header */}
                    <Flex
                      align="center"
                      gap={3}
                      px={6}
                      py={3}
                      bg="#f0f7ff"
                      borderBottom="1px solid #bfdbfe"
                    >
                      <Flex
                        w="26px"
                        h="26px"
                        bg="#2563eb"
                        borderRadius="7px"
                        align="center"
                        justify="center"
                        flexShrink={0}
                      >
                        <Text fontSize="10px" fontWeight={900} color="white">
                          {sIdx + 1}
                        </Text>
                      </Flex>
                      <Text
                        fontSize="13px"
                        fontWeight={800}
                        color="#1e40af"
                        textTransform="capitalize"
                      >
                        {sec.name || sec.subject}
                      </Text>
                      <Badge colorScheme="blue" fontSize="10px">
                        {sec.questions?.length} questions
                      </Badge>
                    </Flex>
                    {/* Section questions */}
                    {sec.questions?.map((q, i) => (
                      <Box
                        key={i}
                        px={6}
                        py={4}
                        borderBottom={
                          i < sec.questions.length - 1 ||
                          sIdx < test.sections.length - 1
                            ? "1px solid #f8fafc"
                            : "none"
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
                          <Text
                            fontSize="14px"
                            fontWeight={600}
                            color="#0f172a"
                          >
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
                              borderColor={
                                oi === q.answer ? "#86efac" : "#e2e8f0"
                              }
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
                ))
              : test.questions?.map((q, i) => (
                  <Box
                    key={i}
                    px={6}
                    py={4}
                    borderBottom={
                      i < test.questions.length - 1
                        ? "1px solid #f8fafc"
                        : "none"
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

      {/* Password modal */}
      <Modal isOpen={pwOpen} onClose={() => setPwOpen(false)} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent borderRadius="8px" fontFamily="Inter,sans-serif" mx={4}>
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

      {/* Delete dialog */}
      <AlertDialog
        isOpen={delOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setDelOpen(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            mx={4}
            borderRadius="8px"
            fontFamily="Inter,sans-serif"
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
