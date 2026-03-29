// /**
//  * AdminTestsPage.jsx
//  * ─────────────────────────────────────────────────────────────────────────────
//  * Lists all tests using the PROVEN endpoint:
//  *   GET /tests  → returns tests (may be array or {data:[]} shape)
//  *
//  * Also shows visit analytics using:
//  *   GET /tests/:id/visits  (new endpoint - gracefully falls back if not ready)
//  *
//  * Search, filter, delete all use existing proven endpoints.
//  * ─────────────────────────────────────────────────────────────────────────────
//  */
// import React, { useEffect, useState, useCallback, useRef } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Icon,
//   Input,
//   Button,
//   Spinner,
//   Badge,
//   Select,
//   useToast,
//   Grid,
//   InputGroup,
//   InputLeftElement,
//   Progress,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   useDisclosure,
//   AlertDialog,
//   AlertDialogOverlay,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogBody,
//   AlertDialogFooter,
// } from "@chakra-ui/react";
// import {
//   FaSearch,
//   FaLayerGroup,
//   FaTrash,
//   FaSyncAlt,
//   FaLock,
//   FaUnlock,
//   FaUsers,
//   FaTrophy,
//   FaChartBar,
//   FaClock,
//   FaLink,
//   FaExternalLinkAlt,
//   FaClipboardList,
//   FaEye,
// } from "react-icons/fa";
// import { apiFetch } from "../services/api";
// import AdminNavPage from "./AdminNavPage";

// const C = {
//   blue: "#2563eb",
//   green: "#16a34a",
//   red: "#dc2626",
//   amber: "#d97706",
//   purple: "#7c3aed",
//   muted: "#64748b",
//   text: "#0f172a",
//   border: "#e2e8f0",
//   bg: "#f8fafc",
// };

// const fmtDate = (d) =>
//   d
//     ? new Date(d).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";

// const EXAM_TYPES = [
//   "SSC",
//   "UPSC",
//   "BANK",
//   "RAILWAY",
//   "STATE",
//   "DEFENCE",
//   "OTHER",
// ];

// /* Convert various backend response shapes → plain array */
// function toArr(res) {
//   if (!res) return [];
//   if (Array.isArray(res)) return res;
//   if (Array.isArray(res.data)) return res.data;
//   return [];
// }

// function VisitRow({ v, i }) {
//   const days = v.daysSinceLastLogin;
//   const daysColor =
//     days == null ? C.muted : days <= 1 ? C.green : days <= 7 ? C.amber : C.red;
//   return (
//     <Flex
//       align="center"
//       gap={3}
//       px={4}
//       py={3}
//       borderBottom="1px solid #f8fafc"
//       _last={{ borderBottom: "none" }}
//       bg={i % 2 === 0 ? "white" : "#fafafa"}
//     >
//       <Text flex={0.5} fontSize="11px" fontWeight={700} color={C.muted}>
//         {i + 1}
//       </Text>
//       <Box flex={3} minW={0}>
//         <Text fontSize="12px" fontWeight={600} color={C.text} noOfLines={1}>
//           {v.userName || v.userEmail || "Guest"}
//         </Text>
//         <Text fontSize="10px" color={C.muted} noOfLines={1}>
//           {v.userEmail}
//         </Text>
//       </Box>
//       <Flex flex={1.5} align="center" gap={1}>
//         <Box
//           w="6px"
//           h="6px"
//           bg={v.wasLoggedIn ? C.green : C.amber}
//           borderRadius="full"
//           flexShrink={0}
//         />
//         <Text
//           fontSize="11px"
//           fontWeight={600}
//           color={v.wasLoggedIn ? C.green : C.amber}
//         >
//           {v.wasLoggedIn ? "Logged in" : "Guest"}
//         </Text>
//       </Flex>
//       <Text flex={1.5} fontSize="11px" fontWeight={700} color={daysColor}>
//         {days == null ? "—" : days === 0 ? "Today" : `${days}d ago`}
//       </Text>
//       <Box flex={1}>
//         <Badge
//           bg={v.didStart ? "#dcfce7" : "#f1f5f9"}
//           color={v.didStart ? C.green : C.muted}
//           borderRadius="full"
//           fontSize="9px"
//           fontWeight={700}
//           px={2}
//         >
//           {v.didStart ? "Started" : "Viewed"}
//         </Badge>
//       </Box>
//       <Box flex={1}>
//         <Badge
//           bg={v.didSubmit ? "#eff6ff" : "#f1f5f9"}
//           color={v.didSubmit ? C.blue : C.muted}
//           borderRadius="full"
//           fontSize="9px"
//           fontWeight={700}
//           px={2}
//         >
//           {v.didSubmit ? "Done" : "—"}
//         </Badge>
//       </Box>
//     </Flex>
//   );
// }

// export default function AdminTestsPage() {
//   const toast = useToast();
//   const cancelRef = useRef();
//   const {
//     isOpen: visitsOpen,
//     onOpen: openVisits,
//     onClose: closeVisits,
//   } = useDisclosure();
//   const {
//     isOpen: delOpen,
//     onOpen: openDel,
//     onClose: closeDel,
//   } = useDisclosure();

//   const [tests, setTests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [examFilter, setExamFilter] = useState("");
//   const [visFilter, setVisFilter] = useState("");
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [visits, setVisits] = useState([]);
//   const [visitsLoading, setVisitsLoading] = useState(false);
//   const [toDelete, setToDelete] = useState(null);
//   const [deleting, setDeleting] = useState(false);

//   const safe = async (path) => {
//     try {
//       return await apiFetch(path);
//     } catch (e) {
//       console.warn("[Tests] failed:", path, e.message);
//       return null;
//     }
//   };

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // Build query params
//       const p = new URLSearchParams();
//       if (search.trim()) p.set("search", search.trim());
//       if (examFilter) p.set("examType", examFilter);
//       if (visFilter) p.set("visibility", visFilter);
//       const qs = p.toString();
//       const res = await apiFetch(`/tests${qs ? `?${qs}` : ""}`);
//       setTests(toArr(res));
//     } catch (e) {
//       setError(e.message);
//       toast({ title: e.message, status: "error", duration: 3000 });
//     } finally {
//       setLoading(false);
//     }
//   }, [search, examFilter, visFilter]);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const openVisitsModal = async (t) => {
//     setSelectedTest(t);
//     setVisits([]);
//     openVisits();
//     setVisitsLoading(true);
//     try {
//       const res = await apiFetch(`/tests/${t._id}/visits`);
//       setVisits(toArr(res));
//     } catch {
//       // Endpoint may not exist yet — show empty state gracefully
//       setVisits([]);
//     } finally {
//       setVisitsLoading(false);
//     }
//   };

//   const deleteTest = async () => {
//     if (!toDelete) return;
//     setDeleting(true);
//     try {
//       await apiFetch(`/tests/${toDelete._id}`, { method: "DELETE" });
//       toast({ title: "Test deleted", status: "success" });
//       setTests((prev) => prev.filter((t) => t._id !== toDelete._id));
//       closeDel();
//     } catch (e) {
//       toast({ title: e.message, status: "error" });
//     } finally {
//       setDeleting(false);
//     }
//   };

//   // Filtered list (client-side search fallback if backend doesn't support search param)
//   const displayed = tests.filter((t) => {
//     const q = search.toLowerCase();
//     const matchSearch =
//       !q ||
//       (t.title || "").toLowerCase().includes(q) ||
//       (t.examType || "").toLowerCase().includes(q) ||
//       (t.subject || "").toLowerCase().includes(q);
//     const matchExam = !examFilter || t.examType === examFilter;
//     const matchVis = !visFilter || t.visibility === visFilter;
//     return matchSearch && matchExam && matchVis;
//   });

//   const convRate = (vs) => {
//     if (!vs?.length) return 0;
//     return Math.round((vs.filter((v) => v.didStart).length / vs.length) * 100);
//   };

//   return (
//     <AdminNavPage title="All Tests" subtitle="Admin Panel">
//       {/* Filters */}
//       <Flex gap={3} mb={5} flexWrap={{ base: "wrap", md: "nowrap" }}>
//         <InputGroup flex={1} minW="180px">
//           <InputLeftElement pointerEvents="none" h="full" pl={3}>
//             <Icon as={FaSearch} color="gray.400" fontSize="12px" />
//           </InputLeftElement>
//           <Input
//             placeholder="Search test title, exam type…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && load()}
//             bg="white"
//             borderRadius="10px"
//             h="42px"
//             fontSize="13px"
//             pl="38px"
//             border={`1px solid ${C.border}`}
//             _focus={{ borderColor: C.blue, boxShadow: `0 0 0 1px ${C.blue}` }}
//           />
//         </InputGroup>
//         <Select
//           value={examFilter}
//           onChange={(e) => setExamFilter(e.target.value)}
//           bg="white"
//           borderRadius="10px"
//           h="42px"
//           minW="130px"
//           maxW="130px"
//           fontSize="13px"
//           fontWeight={600}
//           border={`1px solid ${C.border}`}
//         >
//           <option value="">All Exams</option>
//           {EXAM_TYPES.map((ex) => (
//             <option key={ex} value={ex}>
//               {ex}
//             </option>
//           ))}
//         </Select>
//         <Select
//           value={visFilter}
//           onChange={(e) => setVisFilter(e.target.value)}
//           bg="white"
//           borderRadius="10px"
//           h="42px"
//           minW="120px"
//           maxW="120px"
//           fontSize="13px"
//           fontWeight={600}
//           border={`1px solid ${C.border}`}
//         >
//           <option value="">All Types</option>
//           <option value="public">🌐 Public</option>
//           <option value="private">🔒 Private</option>
//         </Select>
//         <Button
//           onClick={load}
//           bg={C.blue}
//           color="white"
//           borderRadius="10px"
//           h="42px"
//           px={5}
//           fontSize="13px"
//           fontWeight={700}
//           leftIcon={<Icon as={FaSyncAlt} fontSize="11px" />}
//           _hover={{ opacity: 0.9 }}
//         >
//           Search
//         </Button>
//       </Flex>

//       {/* Count */}
//       {!loading && (
//         <Flex align="center" gap={2} mb={3}>
//           <Text fontSize="13px" color={C.muted} fontWeight={500}>
//             {displayed.length} tests
//           </Text>
//           {(search || examFilter || visFilter) && (
//             <Button
//               size="xs"
//               h="24px"
//               px={2}
//               borderRadius="6px"
//               bg="#f1f5f9"
//               color={C.muted}
//               fontSize="11px"
//               fontWeight={600}
//               onClick={() => {
//                 setSearch("");
//                 setExamFilter("");
//                 setVisFilter("");
//               }}
//               _hover={{ bg: "#e2e8f0" }}
//             >
//               Clear filters
//             </Button>
//           )}
//         </Flex>
//       )}

//       {/* Table */}
//       {loading ? (
//         <Flex justify="center" py={20}>
//           <Spinner color={C.purple} size="xl" thickness="3px" />
//         </Flex>
//       ) : error ? (
//         <Box
//           py={16}
//           textAlign="center"
//           bg="white"
//           borderRadius="14px"
//           border={`1px solid ${C.border}`}
//         >
//           <Text fontSize="16px" fontWeight={700} color={C.red} mb={3}>
//             {error}
//           </Text>
//           <Button
//             onClick={load}
//             bg={C.purple}
//             color="white"
//             borderRadius="10px"
//             fontWeight={700}
//             px={6}
//           >
//             Retry
//           </Button>
//         </Box>
//       ) : displayed.length === 0 ? (
//         <Box
//           py={20}
//           textAlign="center"
//           bg="white"
//           borderRadius="14px"
//           border={`1px solid ${C.border}`}
//         >
//           <Icon
//             as={FaClipboardList}
//             fontSize="48px"
//             color="#e2e8f0"
//             display="block"
//             mx="auto"
//             mb={4}
//           />
//           <Text fontSize="15px" fontWeight={700} color={C.muted}>
//             No tests found
//           </Text>
//         </Box>
//       ) : (
//         <Box
//           bg="white"
//           borderRadius="14px"
//           border={`1px solid ${C.border}`}
//           overflow="hidden"
//           mb={5}
//         >
//           {/* Header */}
//           <Flex
//             px={5}
//             py={3}
//             bg={C.bg}
//             borderBottom={`1px solid ${C.border}`}
//             display={{ base: "none", md: "flex" }}
//           >
//             {[
//               ["Test", 4],
//               ["Coaching/Creator", 2],
//               ["Type", 1.5],
//               ["Questions", 1.5],
//               ["Attempts", 1.5],
//               ["Created", 1.5],
//               ["", 2],
//             ].map(([h, f]) => (
//               <Text
//                 key={h}
//                 flex={f}
//                 fontSize="10px"
//                 fontWeight={800}
//                 color={C.muted}
//                 textTransform="uppercase"
//                 letterSpacing=".8px"
//               >
//                 {h}
//               </Text>
//             ))}
//           </Flex>

//           {displayed.map((t, idx) => {
//             const isPrivate = t.visibility === "private";
//             const qCount =
//               t.isSectioned && t.sections?.length
//                 ? t.sections.reduce(
//                     (s, sec) => s + (sec.questions?.length || 0),
//                     0,
//                   )
//                 : t.questions?.length || t.totalQuestions || 0;

//             return (
//               <Flex
//                 key={t._id}
//                 px={5}
//                 py={4}
//                 align="center"
//                 gap={3}
//                 borderBottom={
//                   idx < displayed.length - 1 ? "1px solid #f1f5f9" : "none"
//                 }
//                 _hover={{ bg: "#f8faff" }}
//                 transition="background .12s"
//                 flexWrap={{ base: "wrap", md: "nowrap" }}
//               >
//                 {/* Title */}
//                 <Box flex={4} minW={0}>
//                   <Flex align="center" gap={2}>
//                     <Text
//                       fontSize="13px"
//                       fontWeight={700}
//                       color={C.text}
//                       noOfLines={1}
//                     >
//                       {t.title}
//                     </Text>
//                     {isPrivate && (
//                       <Icon
//                         as={FaLock}
//                         fontSize="10px"
//                         color={C.muted}
//                         flexShrink={0}
//                       />
//                     )}
//                     {t.isSectioned && (
//                       <Badge
//                         bg="#eff6ff"
//                         color={C.blue}
//                         borderRadius="full"
//                         fontSize="9px"
//                         fontWeight={700}
//                         px={2}
//                         flexShrink={0}
//                       >
//                         <Flex align="center" gap={1}>
//                           <Icon as={FaLayerGroup} fontSize="8px" />
//                           {t.sections?.length}s
//                         </Flex>
//                       </Badge>
//                     )}
//                   </Flex>
//                   <Flex gap={1} mt={0.5} flexWrap="wrap">
//                     {t.examType && (
//                       <Text
//                         fontSize="9px"
//                         fontWeight={700}
//                         bg="#eff6ff"
//                         color={C.blue}
//                         px={2}
//                         py="1px"
//                         borderRadius="full"
//                       >
//                         {t.examType}
//                       </Text>
//                     )}
//                     {t.subject && (
//                       <Text
//                         fontSize="9px"
//                         fontWeight={700}
//                         bg="#f1f5f9"
//                         color={C.muted}
//                         px={2}
//                         py="1px"
//                         borderRadius="full"
//                         textTransform="capitalize"
//                       >
//                         {t.subject}
//                       </Text>
//                     )}
//                   </Flex>
//                 </Box>

//                 {/* Creator */}
//                 <Box flex={2} minW={0} display={{ base: "none", md: "block" }}>
//                   <Text fontSize="12px" color={C.muted} noOfLines={1}>
//                     {t.coachingId?.name ||
//                       t.createdBy?.Name ||
//                       t.createdBy?.Email ||
//                       "—"}
//                   </Text>
//                 </Box>

//                 {/* Visibility */}
//                 <Box flex={1.5} display={{ base: "none", md: "block" }}>
//                   <Flex align="center" gap={1}>
//                     <Icon
//                       as={isPrivate ? FaLock : FaUnlock}
//                       fontSize="10px"
//                       color={isPrivate ? C.amber : C.green}
//                     />
//                     <Text
//                       fontSize="11px"
//                       fontWeight={600}
//                       color={isPrivate ? C.amber : C.green}
//                     >
//                       {isPrivate ? "Private" : "Public"}
//                     </Text>
//                   </Flex>
//                 </Box>

//                 {/* Questions */}
//                 <Box flex={1.5} display={{ base: "none", md: "block" }}>
//                   <Text fontSize="13px" fontWeight={700} color={C.text}>
//                     {qCount}
//                   </Text>
//                   <Text fontSize="10px" color={C.muted}>
//                     {t.timeLimitMin || t.timeLimit || "—"}min
//                   </Text>
//                 </Box>

//                 {/* Attempts */}
//                 <Box flex={1.5}>
//                   <Text fontSize="13px" fontWeight={700} color={C.blue}>
//                     {t.totalAttempts ?? 0}
//                   </Text>
//                 </Box>

//                 {/* Created */}
//                 <Box flex={1.5} display={{ base: "none", md: "block" }}>
//                   <Text fontSize="11px" color={C.muted}>
//                     {fmtDate(t.createdAt)}
//                   </Text>
//                 </Box>

//                 {/* Actions */}
//                 <Flex flex={2} gap={1} justify="flex-end" flexWrap="wrap">
//                   <Button
//                     size="xs"
//                     h="28px"
//                     px={2}
//                     borderRadius="7px"
//                     bg="#f5f3ff"
//                     color={C.purple}
//                     fontSize="10px"
//                     fontWeight={700}
//                     leftIcon={<Icon as={FaChartBar} fontSize="9px" />}
//                     onClick={() => openVisitsModal(t)}
//                     _hover={{ bg: "#ede9fe" }}
//                   >
//                     Visits
//                   </Button>
//                   <Button
//                     size="xs"
//                     h="28px"
//                     px={2}
//                     borderRadius="7px"
//                     bg="#f0f7ff"
//                     color={C.blue}
//                     fontSize="10px"
//                     fontWeight={700}
//                     leftIcon={<Icon as={FaExternalLinkAlt} fontSize="9px" />}
//                     onClick={() =>
//                       window.open(`/tests/${t.slug || t._id}`, "_blank")
//                     }
//                     _hover={{ bg: "#dbeafe" }}
//                   >
//                     View
//                   </Button>
//                   <Button
//                     size="xs"
//                     h="28px"
//                     w="28px"
//                     p={0}
//                     borderRadius="7px"
//                     bg="#fef2f2"
//                     color={C.red}
//                     onClick={() => {
//                       setToDelete(t);
//                       openDel();
//                     }}
//                     _hover={{ bg: "#fecaca" }}
//                   >
//                     <Icon as={FaTrash} fontSize="10px" />
//                   </Button>
//                 </Flex>
//               </Flex>
//             );
//           })}
//         </Box>
//       )}

//       {/* Visit analytics modal */}
//       <Modal
//         isOpen={visitsOpen}
//         onClose={closeVisits}
//         size="4xl"
//         scrollBehavior="inside"
//         isCentered
//       >
//         <ModalOverlay backdropFilter="blur(4px)" />
//         <ModalContent
//           borderRadius="16px"
//           fontFamily="'DM Sans',sans-serif"
//           mx={4}
//           maxH="88vh"
//           overflow="hidden"
//         >
//           <ModalHeader
//             px={6}
//             pt={6}
//             pb={5}
//             bg="linear-gradient(135deg,#0b1e3d,#1a3a6e)"
//             color="white"
//           >
//             <Flex align="center" justify="space-between">
//               <Box>
//                 <Text fontSize="15px" fontWeight={800}>
//                   Link Visit Analytics
//                 </Text>
//                 <Text
//                   fontSize="11px"
//                   color="rgba(255,255,255,.45)"
//                   mt={0.5}
//                   noOfLines={1}
//                 >
//                   {selectedTest?.title} · {visits.length} visits recorded
//                 </Text>
//               </Box>
//               <ModalCloseButton
//                 position="static"
//                 color="white"
//                 _hover={{ bg: "rgba(255,255,255,.15)" }}
//                 borderRadius="8px"
//               />
//             </Flex>
//           </ModalHeader>

//           <ModalBody px={0} py={0}>
//             {visitsLoading ? (
//               <Flex justify="center" py={16}>
//                 <Spinner color={C.purple} size="lg" />
//               </Flex>
//             ) : visits.length === 0 ? (
//               <Box py={16} textAlign="center">
//                 <Icon
//                   as={FaLink}
//                   fontSize="36px"
//                   color="#e2e8f0"
//                   display="block"
//                   mx="auto"
//                   mb={3}
//                 />
//                 <Text fontSize="13px" color={C.muted} fontWeight={600}>
//                   No visit data recorded yet
//                 </Text>
//                 <Text fontSize="11px" color={C.muted} mt={1}>
//                   Visit tracking records who opened this test's link, whether
//                   they were logged in, and if they started/submitted.
//                 </Text>
//               </Box>
//             ) : (
//               <>
//                 {/* Conversion summary */}
//                 <Grid
//                   templateColumns="repeat(4,1fr)"
//                   gap={0}
//                   borderBottom="1px solid #f1f5f9"
//                 >
//                   {[
//                     {
//                       label: "Total Visits",
//                       value: visits.length,
//                       color: C.blue,
//                       bg: "#eff6ff",
//                     },
//                     {
//                       label: "Logged In",
//                       value: visits.filter((v) => v.wasLoggedIn).length,
//                       color: C.green,
//                       bg: "#f0fdf4",
//                     },
//                     {
//                       label: "Started Test",
//                       value: visits.filter((v) => v.didStart).length,
//                       color: C.amber,
//                       bg: "#fffbeb",
//                     },
//                     {
//                       label: "Completed",
//                       value: visits.filter((v) => v.didSubmit).length,
//                       color: C.purple,
//                       bg: "#f5f3ff",
//                     },
//                   ].map((s) => (
//                     <Box
//                       key={s.label}
//                       px={5}
//                       py={4}
//                       bg={s.bg}
//                       textAlign="center"
//                     >
//                       <Text
//                         fontSize="24px"
//                         fontWeight={900}
//                         color={s.color}
//                         lineHeight="1"
//                       >
//                         {s.value}
//                       </Text>
//                       <Text
//                         fontSize="10px"
//                         fontWeight={700}
//                         color={s.color}
//                         textTransform="uppercase"
//                         letterSpacing=".6px"
//                         mt={1}
//                       >
//                         {s.label}
//                       </Text>
//                     </Box>
//                   ))}
//                 </Grid>

//                 {/* Conversion bar */}
//                 <Box px={5} py={4} bg="white" borderBottom="1px solid #f1f5f9">
//                   <Flex justify="space-between" mb={1.5}>
//                     <Text
//                       fontSize="11px"
//                       fontWeight={700}
//                       color={C.muted}
//                       textTransform="uppercase"
//                       letterSpacing=".6px"
//                     >
//                       Link → Started Conversion
//                     </Text>
//                     <Text fontSize="11px" fontWeight={900} color={C.purple}>
//                       {convRate(visits)}%
//                     </Text>
//                   </Flex>
//                   <Progress
//                     value={convRate(visits)}
//                     colorScheme="purple"
//                     size="sm"
//                     borderRadius="full"
//                   />
//                 </Box>

//                 {/* Row header */}
//                 <Flex
//                   px={4}
//                   py={2.5}
//                   bg={C.bg}
//                   borderBottom={`1px solid ${C.border}`}
//                 >
//                   {[
//                     ["#", 0.5],
//                     ["Student", 3],
//                     ["Auth", 1.5],
//                     ["Days Since Login", 1.5],
//                     ["Status", 1],
//                     ["Submitted", 1],
//                   ].map(([h, f]) => (
//                     <Text
//                       key={h}
//                       flex={f}
//                       fontSize="10px"
//                       fontWeight={800}
//                       color={C.muted}
//                       textTransform="uppercase"
//                       letterSpacing=".8px"
//                     >
//                       {h}
//                     </Text>
//                   ))}
//                 </Flex>
//                 <Box maxH="320px" overflowY="auto">
//                   {visits.map((v, i) => (
//                     <VisitRow key={i} v={v} i={i} />
//                   ))}
//                 </Box>
//               </>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>

//       {/* Delete confirm */}
//       <AlertDialog
//         isOpen={delOpen}
//         leastDestructiveRef={cancelRef}
//         onClose={closeDel}
//         isCentered
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent
//             mx={4}
//             borderRadius="14px"
//             fontFamily="'DM Sans',sans-serif"
//           >
//             <AlertDialogHeader fontWeight={800} fontSize="16px">
//               Delete Test?
//             </AlertDialogHeader>
//             <AlertDialogBody>
//               <Text fontSize="13px" color={C.muted}>
//                 Permanently delete <strong>"{toDelete?.title}"</strong> and all
//                 its results? This cannot be undone.
//               </Text>
//             </AlertDialogBody>
//             <AlertDialogFooter gap={3}>
//               <Button
//                 ref={cancelRef}
//                 onClick={closeDel}
//                 variant="ghost"
//                 borderRadius="10px"
//                 fontWeight={700}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 bg={C.red}
//                 color="white"
//                 borderRadius="10px"
//                 fontWeight={800}
//                 isLoading={deleting}
//                 onClick={deleteTest}
//                 _hover={{ bg: "#b91c1c" }}
//               >
//                 Delete
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </AdminNavPage>
//   );
// }










/**
 * AdminTestsPage.jsx
 * Admin can click "Details" on any test row to open a full detail modal
 * showing: Overview stats, All Attempts, Questions list, Visit analytics.
 */
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Input,
  Button,
  Spinner,
  Badge,
  Select,
  useToast,
  Grid,
  InputGroup,
  InputLeftElement,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Avatar,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaLayerGroup,
  FaTrash,
  FaSyncAlt,
  FaLock,
  FaUnlock,
  FaUsers,
  FaTrophy,
  FaChartBar,
  FaClock,
  FaLink,
  FaExternalLinkAlt,
  FaClipboardList,
  FaEye,
  FaCheckCircle,
  FaStopwatch,
  FaCalendarAlt,
  FaEnvelope,
  FaListAlt,
  FaInfoCircle,
  FaPercent,
  FaRegClock,
} from "react-icons/fa";
import { apiFetch } from "../services/api";
import AdminNavPage from "./AdminNavPage";

/* ─── colour palette ─────────────────────────────────────── */
const C = {
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  purple: "#7c3aed",
  cyan: "#0891b2",
  muted: "#64748b",
  text: "#0f172a",
  border: "#e2e8f0",
  bg: "#f8fafc",
  navy: "#0b1120",
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const fmtTime = (sec) => {
  if (!sec && sec !== 0) return "—";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const EXAM_TYPES = ["SSC", "UPSC", "BANK", "RAILWAY", "STATE", "DEFENCE", "OTHER"];

function toArr(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  return [];
}

/* ─── tiny stat tile ─────────────────────────────────────── */
function StatTile({ label, value, color = C.blue, bg = "#eff6ff", icon }) {
  return (
    <Box bg={bg} borderRadius="10px" px={4} py={3}>
      <Flex align="center" gap={1.5} mb={1}>
        {icon && <Icon as={icon} fontSize="10px" color={color} />}
        <Text
          fontSize="10px"
          fontWeight={700}
          color={color}
          textTransform="uppercase"
          letterSpacing=".7px"
        >
          {label}
        </Text>
      </Flex>
      <Text
        fontSize="22px"
        fontWeight={900}
        color={color}
        lineHeight="1"
        letterSpacing="-1px"
      >
        {value}
      </Text>
    </Box>
  );
}

/* ─── visit row ──────────────────────────────────────────── */
function VisitRow({ v, i }) {
  const days = v.daysSinceLastLogin;
  const daysColor =
    days == null ? C.muted : days <= 1 ? C.green : days <= 7 ? C.amber : C.red;
  return (
    <Flex
      align="center"
      gap={3}
      px={4}
      py={3}
      borderBottom="1px solid #f1f5f9"
      _last={{ borderBottom: "none" }}
      bg={i % 2 === 0 ? "white" : "#fafafa"}
    >
      <Text w="22px" fontSize="11px" fontWeight={700} color={C.muted} flexShrink={0}>
        {i + 1}
      </Text>
      <Avatar
        size="xs"
        name={v.userName || v.userEmail || "G"}
        bg={C.cyan}
        color="white"
        fontSize="10px"
        flexShrink={0}
      />
      <Box flex={3} minW={0}>
        <Text fontSize="12px" fontWeight={600} color={C.text} noOfLines={1}>
          {v.userName || v.userEmail || "Guest"}
        </Text>
        <Text fontSize="10px" color={C.muted} noOfLines={1}>
          {v.userEmail}
        </Text>
      </Box>
      <Flex flex={1.5} align="center" gap={1}>
        <Box
          w="6px"
          h="6px"
          bg={v.wasLoggedIn ? C.green : C.amber}
          borderRadius="full"
          flexShrink={0}
        />
        <Text
          fontSize="11px"
          fontWeight={600}
          color={v.wasLoggedIn ? C.green : C.amber}
        >
          {v.wasLoggedIn ? "Logged In" : "Guest"}
        </Text>
      </Flex>
      <Text flex={1.5} fontSize="11px" fontWeight={700} color={daysColor}>
        {days == null ? "—" : days === 0 ? "Today" : `${days}d ago`}
      </Text>
      <Box flex={1}>
        <Badge
          bg={v.didStart ? "#dcfce7" : "#f1f5f9"}
          color={v.didStart ? C.green : C.muted}
          borderRadius="full"
          fontSize="9px"
          fontWeight={700}
          px={2}
        >
          {v.didStart ? "Started" : "Viewed"}
        </Badge>
      </Box>
      <Box flex={1}>
        <Badge
          bg={v.didSubmit ? "#eff6ff" : "#f1f5f9"}
          color={v.didSubmit ? C.blue : C.muted}
          borderRadius="full"
          fontSize="9px"
          fontWeight={700}
          px={2}
        >
          {v.didSubmit ? "Submitted" : "—"}
        </Badge>
      </Box>
    </Flex>
  );
}

/* ─── attempt row ────────────────────────────────────────── */
function AttemptRow({ r, i, totalQ }) {
  const name = r.studentId?.Name || r.studentId?.Email || "Student";
  const email = r.studentId?.Email || "";
  const pct = r.scorePercentage ?? r.percentage ?? 0;
  const passed = pct >= 40;
  const correct =
    r.correct ?? (Array.isArray(r.correctQus) ? r.correctQus.length : 0);
  const wrong = Array.isArray(r.wrongansqus)
    ? r.wrongansqus.length
    : Array.isArray(r.wrongQus)
    ? r.wrongQus.length
    : 0;
  const skipped = Math.max(0, (totalQ || 0) - correct - wrong);
  const timeSec = r.timeTakenSec ?? r.timeTaken ?? 0;

  return (
    <Flex
      align="center"
      gap={3}
      px={5}
      py={3.5}
      borderBottom="1px solid #f1f5f9"
      _last={{ borderBottom: "none" }}
      bg={i % 2 === 0 ? "white" : "#fafafa"}
      _hover={{ bg: "#f0f7ff" }}
      transition="background .12s"
    >
      {/* rank */}
      <Flex
        w="28px"
        h="28px"
        borderRadius="full"
        bg={
          i === 0
            ? "#fef9c3"
            : i === 1
            ? "#f1f5f9"
            : i === 2
            ? "#fff7ed"
            : C.bg
        }
        border={`1.5px solid ${
          i === 0
            ? "#fbbf24"
            : i === 1
            ? "#94a3b8"
            : i === 2
            ? "#fb923c"
            : C.border
        }`}
        align="center"
        justify="center"
        flexShrink={0}
      >
        <Text
          fontSize={i < 3 ? "13px" : "10px"}
          fontWeight={800}
          color={C.muted}
        >
          {i < 3 ? ["🥇", "🥈", "🥉"][i] : i + 1}
        </Text>
      </Flex>

      {/* student */}
      <Flex flex={3} align="center" gap={2.5} minW={0}>
        <Avatar
          size="xs"
          name={name}
          bg={C.purple}
          color="white"
          fontSize="10px"
          flexShrink={0}
        />
        <Box minW={0}>
          <Text fontSize="12px" fontWeight={700} color={C.text} noOfLines={1}>
            {name}
          </Text>
          <Flex align="center" gap={1} mt="1px">
            <Icon as={FaEnvelope} fontSize="8px" color={C.muted} />
            <Text fontSize="10px" color={C.muted} noOfLines={1}>
              {email || "—"}
            </Text>
          </Flex>
        </Box>
      </Flex>

      {/* score */}
      <Box flex={1.5} minW={0}>
        <Text
          fontSize="16px"
          fontWeight={900}
          lineHeight="1"
          color={pct >= 60 ? C.green : pct >= 40 ? C.amber : C.red}
        >
          {pct.toFixed(1)}%
        </Text>
        <Text fontSize="10px" color={C.muted} mt="2px">
          {correct}/{totalQ || "?"} correct
        </Text>
      </Box>

      {/* breakdown bar */}
      <Box flex={2} display={{ base: "none", md: "block" }}>
        <Progress
          value={pct}
          size="xs"
          colorScheme={pct >= 60 ? "green" : pct >= 40 ? "yellow" : "red"}
          borderRadius="full"
          mb={1}
        />
        <Flex gap={2}>
          <Text fontSize="9px" color={C.green}>
            ✓ {correct}
          </Text>
          <Text fontSize="9px" color={C.red}>
            ✗ {wrong}
          </Text>
          <Text fontSize="9px" color={C.muted}>
            — {skipped}
          </Text>
        </Flex>
      </Box>

      {/* time */}
      <Flex
        flex={1.2}
        align="center"
        gap={1}
        display={{ base: "none", md: "flex" }}
      >
        <Icon as={FaStopwatch} fontSize="9px" color={C.muted} />
        <Text fontSize="11px" fontWeight={600} color={C.muted}>
          {fmtTime(timeSec)}
        </Text>
      </Flex>

      {/* pass/fail */}
      <Box flex={0.9}>
        <Badge
          bg={passed ? "#dcfce7" : "#fee2e2"}
          color={passed ? C.green : C.red}
          borderRadius="full"
          fontSize="9px"
          fontWeight={800}
          px={2}
          py="1px"
        >
          {passed ? "PASS" : "FAIL"}
        </Badge>
      </Box>

      {/* date */}
      <Box flex={2} display={{ base: "none", lg: "block" }}>
        <Flex align="center" gap={1}>
          <Icon as={FaCalendarAlt} fontSize="9px" color={C.muted} />
          <Text fontSize="10px" color={C.muted}>
            {fmtDateTime(r.createdAt)}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
}

/* ─── question row ───────────────────────────────────────── */
function QuestionRow({ q, num, last }) {
  return (
    <Box
      px={5}
      py={4}
      borderBottom={last ? "none" : "1px solid #f8fafc"}
      _hover={{ bg: "#fafbff" }}
    >
      <Flex gap={3} mb={2.5}>
        <Flex
          w="22px"
          h="22px"
          bg="#eff6ff"
          borderRadius="6px"
          align="center"
          justify="center"
          flexShrink={0}
          mt="1px"
        >
          <Text fontSize="9px" fontWeight={900} color={C.blue}>
            {num}
          </Text>
        </Flex>
        <Text
          fontSize="13px"
          fontWeight={600}
          color={C.text}
          lineHeight="1.6"
        >
          {q.qus}
        </Text>
      </Flex>
      {q.qush && (
        <Text
          fontSize="12px"
          color={C.muted}
          pl="25px"
          mb={2.5}
          lineHeight="1.6"
          fontStyle="italic"
        >
          {q.qush}
        </Text>
      )}
      <Flex flexWrap="wrap" gap={2} pl="25px">
        {(q.options || []).map((opt, oi) => {
          const isCorrect = oi === q.answer;
          return (
            <Flex
              key={oi}
              align="center"
              gap={1.5}
              px={3}
              py="5px"
              borderRadius="7px"
              fontSize="12px"
              bg={isCorrect ? "#f0fdf4" : "#f8fafc"}
              color={isCorrect ? C.green : C.muted}
              border="1px solid"
              borderColor={isCorrect ? "#86efac" : C.border}
              fontWeight={isCorrect ? 700 : 400}
            >
              {isCorrect && (
                <Icon as={FaCheckCircle} fontSize="9px" color={C.green} />
              )}
              <Text>
                {String.fromCharCode(65 + oi)}. {opt}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  );
}

/* ─── full detail modal ──────────────────────────────────── */
function TestDetailModal({ test, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [attempts, setAttempts] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !test) return;
    setActiveTab("overview");
    setAttempts([]);
    setVisits([]);
    setLoading(true);

    const safe = async (path) => {
      try {
        return await apiFetch(path);
      } catch {
        return null;
      }
    };

    (async () => {
      const [attRes, visRes] = await Promise.all([
        safe(`/results?testId=${test._id}`),
        safe(`/tests/${test._id}/visits`),
      ]);

      const att = toArr(attRes).sort((a, b) => {
        const pa = a.scorePercentage ?? a.percentage ?? 0;
        const pb = b.scorePercentage ?? b.percentage ?? 0;
        return pb - pa;
      });

      setAttempts(att);
      setVisits(toArr(visRes));
      setLoading(false);
    })();
  }, [isOpen, test?._id]);

  if (!test) return null;

  const isSectioned = test.isSectioned === true;
  const isPrivate = test.visibility === "private";
  const timeLimitMin = test.timeLimitMin || test.timeLimit || 30;

  const qCount =
    isSectioned && test.sections?.length
      ? test.sections.reduce((s, sec) => s + (sec.questions?.length || 0), 0)
      : test.questions?.length || test.totalQuestions || 0;

  const allQuestions =
    isSectioned && test.sections?.length
      ? test.sections.flatMap((s) => s.questions || [])
      : test.questions || [];

  const passCount = attempts.filter(
    (a) => (a.scorePercentage ?? a.percentage ?? 0) >= 40
  ).length;
  const avgPct = attempts.length
    ? Math.round(
        attempts.reduce(
          (s, a) => s + (a.scorePercentage ?? a.percentage ?? 0),
          0
        ) / attempts.length
      )
    : 0;
  const topPct = attempts.length
    ? Math.max(
        ...attempts.map((a) => a.scorePercentage ?? a.percentage ?? 0)
      )
    : 0;
  const convRate = visits.length
    ? Math.round(
        (visits.filter((v) => v.didStart).length / visits.length) * 100
      )
    : 0;

  const TABS = [
    { key: "overview", label: "Overview", icon: FaChartBar },
    {
      key: "attempts",
      label: `All Attempts${attempts.length ? ` (${attempts.length})` : ""}`,
      icon: FaListAlt,
    },
    {
      key: "questions",
      label: `Questions (${qCount})`,
      icon: FaClipboardList,
    },
    {
      key: "visits",
      label: `Visits${visits.length ? ` (${visits.length})` : ""}`,
      icon: FaEye,
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
      scrollBehavior="inside"
      isCentered
    >
      <ModalOverlay backdropFilter="blur(6px)" bg="rgba(0,0,0,.55)" />
      <ModalContent
        borderRadius="18px"
        fontFamily="'DM Sans', sans-serif"
        mx={4}
        maxH="92vh"
        overflow="hidden"
        boxShadow="0 32px 80px rgba(0,0,0,.35)"
      >
        {/* ── hero ── */}
        <Box
          bg={`linear-gradient(135deg, ${C.navy} 0%, #1a3a6e 60%, #2d5fa8 100%)`}
          px={6}
          pt={6}
          pb={5}
          position="relative"
          overflow="hidden"
        >
          <Box
            position="absolute"
            right="-60px"
            top="-60px"
            w="220px"
            h="220px"
            borderRadius="full"
            bg="rgba(255,255,255,.04)"
          />
          <Box
            position="absolute"
            left="40%"
            bottom="-40px"
            w="160px"
            h="160px"
            borderRadius="full"
            bg="rgba(255,255,255,.03)"
          />

          <Flex
            align="flex-start"
            justify="space-between"
            position="relative"
            zIndex={1}
          >
            <Box flex={1} minW={0} pr={4}>
              {/* badges */}
              <Flex gap={2} flexWrap="wrap" mb={3}>
                {test.examType && (
                  <Box
                    bg="rgba(147,197,253,.18)"
                    color="#93c5fd"
                    px={2.5}
                    py="2px"
                    borderRadius="5px"
                    fontSize="11px"
                    fontWeight={700}
                    letterSpacing=".6px"
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
                    px={2.5}
                    py="2px"
                    borderRadius="5px"
                    fontSize="11px"
                    fontWeight={700}
                  >
                    <Icon as={FaLayerGroup} fontSize="9px" />
                    {test.sections?.length} Sections
                  </Flex>
                )}
                <Box
                  bg={
                    isPrivate
                      ? "rgba(252,165,165,.15)"
                      : "rgba(134,239,172,.15)"
                  }
                  color={isPrivate ? "#fca5a5" : "#86efac"}
                  px={2.5}
                  py="2px"
                  borderRadius="5px"
                  fontSize="11px"
                  fontWeight={700}
                >
                  {isPrivate ? "🔒 Private" : "🌐 Public"}
                </Box>
              </Flex>

              <Text
                fontSize={{ base: "18px", md: "26px" }}
                fontWeight={900}
                color="white"
                letterSpacing="-0.8px"
                lineHeight="1.15"
                noOfLines={2}
                mb={1}
              >
                {test.title}
              </Text>
              <Text fontSize="12px" color="rgba(255,255,255,.4)" mt={1}>
                {test.coachingId?.name ||
                  test.createdBy?.Name ||
                  test.createdBy?.Email ||
                  "—"}{" "}
                · Created {fmtDate(test.createdAt)}
              </Text>
            </Box>
            <ModalCloseButton
              position="static"
              color="rgba(255,255,255,.7)"
              _hover={{ bg: "rgba(255,255,255,.12)", color: "white" }}
              borderRadius="8px"
              mt={-1}
              mr={-1}
            />
          </Flex>

          {/* quick metrics strip */}
          <Flex
            gap={{ base: 4, md: 8 }}
            mt={4}
            pt={4}
            borderTop="1px solid rgba(255,255,255,.1)"
            flexWrap="wrap"
            position="relative"
            zIndex={1}
          >
            {[
              { icon: FaClipboardList, v: qCount, l: "Questions" },
              { icon: FaRegClock, v: `${timeLimitMin}m`, l: "Duration" },
              { icon: FaUsers, v: attempts.length || test.totalAttempts || 0, l: "Attempts" },
              {
                icon: FaTrophy,
                v: loading ? "…" : `${topPct.toFixed(0)}%`,
                l: "Top Score",
              },
              {
                icon: FaEye,
                v: loading ? "…" : visits.length,
                l: "Link Visits",
              },
            ].map((s) => (
              <Flex key={s.l} align="center" gap={2}>
                <Icon
                  as={s.icon}
                  fontSize="12px"
                  color="rgba(255,255,255,.35)"
                />
                <Box>
                  <Text
                    fontSize="18px"
                    fontWeight={900}
                    color="white"
                    lineHeight="1"
                    letterSpacing="-0.5px"
                  >
                    {s.v}
                  </Text>
                  <Text
                    fontSize="9px"
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

        {/* ── tab bar ── */}
        <Box
          px={5}
          pt={3}
          pb={0}
          bg="white"
          borderBottom={`1px solid ${C.border}`}
        >
          <Flex gap={1} overflowX="auto">
            {TABS.map(({ key, label, icon }) => {
              const active = activeTab === key;
              return (
                <Flex
                  key={key}
                  as="button"
                  align="center"
                  gap={1.5}
                  px={4}
                  py={2.5}
                  borderRadius="8px 8px 0 0"
                  cursor="pointer"
                  bg={active ? C.navy : "transparent"}
                  color={active ? "white" : C.muted}
                  fontWeight={active ? 700 : 500}
                  fontSize="12px"
                  onClick={() => setActiveTab(key)}
                  border="none"
                  outline="none"
                  transition="all .15s"
                  _hover={{
                    bg: active ? C.navy : C.bg,
                    color: active ? "white" : C.text,
                  }}
                  whiteSpace="nowrap"
                  flexShrink={0}
                >
                  <Icon as={icon} fontSize="10px" />
                  {label}
                </Flex>
              );
            })}
          </Flex>
        </Box>

        {/* ── body ── */}
        <ModalBody px={0} py={0} overflowY="auto">
          {loading ? (
            <Flex justify="center" align="center" py={20}>
              <Spinner size="xl" color={C.purple} thickness="3px" />
            </Flex>
          ) : (
            <>
              {/* ════ OVERVIEW ════ */}
              {activeTab === "overview" && (
                <Box p={6}>
                  {/* top-line stats */}
                  <Grid
                    templateColumns={{
                      base: "repeat(2,1fr)",
                      md: "repeat(4,1fr)",
                    }}
                    gap={3}
                    mb={4}
                  >
                    <StatTile
                      label="Total Attempts"
                      value={attempts.length}
                      color={C.blue}
                      bg="#eff6ff"
                      icon={FaUsers}
                    />
                    <StatTile
                      label="Pass Rate"
                      value={
                        attempts.length
                          ? `${Math.round(
                              (passCount / attempts.length) * 100
                            )}%`
                          : "—"
                      }
                      color={C.green}
                      bg="#f0fdf4"
                      icon={FaCheckCircle}
                    />
                    <StatTile
                      label="Avg Score"
                      value={attempts.length ? `${avgPct}%` : "—"}
                      color={C.purple}
                      bg="#f5f3ff"
                      icon={FaChartBar}
                    />
                    <StatTile
                      label="Top Score"
                      value={attempts.length ? `${topPct.toFixed(0)}%` : "—"}
                      color={C.amber}
                      bg="#fffbeb"
                      icon={FaTrophy}
                    />
                  </Grid>
                  <Grid
                    templateColumns={{
                      base: "repeat(2,1fr)",
                      md: "repeat(4,1fr)",
                    }}
                    gap={3}
                    mb={6}
                  >
                    <StatTile
                      label="Link Visits"
                      value={visits.length}
                      color={C.cyan}
                      bg="#ecfeff"
                      icon={FaEye}
                    />
                    <StatTile
                      label="Conversion"
                      value={`${convRate}%`}
                      color={C.purple}
                      bg="#f5f3ff"
                      icon={FaPercent}
                    />
                    <StatTile
                      label="Questions"
                      value={qCount}
                      color={C.text}
                      bg={C.bg}
                      icon={FaClipboardList}
                    />
                    <StatTile
                      label="Duration"
                      value={`${timeLimitMin}m`}
                      color={C.amber}
                      bg="#fffbeb"
                      icon={FaClock}
                    />
                  </Grid>

                  {/* two-column info + distribution */}
                  <Grid
                    templateColumns={{ base: "1fr", md: "1fr 1fr" }}
                    gap={4}
                    mb={5}
                  >
                    {/* test meta */}
                    <Box
                      bg="white"
                      borderRadius="12px"
                      border={`1px solid ${C.border}`}
                      overflow="hidden"
                    >
                      <Flex
                        align="center"
                        gap={2}
                        px={5}
                        py={3}
                        bg={C.bg}
                        borderBottom={`1px solid ${C.border}`}
                      >
                        <Icon
                          as={FaInfoCircle}
                          color={C.blue}
                          fontSize="12px"
                        />
                        <Text
                          fontSize="12px"
                          fontWeight={800}
                          color={C.text}
                          textTransform="uppercase"
                          letterSpacing=".6px"
                        >
                          Test Info
                        </Text>
                      </Flex>
                      <Box px={5} py={4}>
                        {[
                          { label: "Title", value: test.title },
                          { label: "Exam Type", value: test.examType || "General" },
                          {
                            label: "Subject",
                            value: isSectioned
                              ? `${test.sections?.length} Sections`
                              : test.subject || "—",
                          },
                          {
                            label: "Visibility",
                            value: isPrivate ? "🔒 Private" : "🌐 Public",
                          },
                          { label: "Total Marks", value: qCount },
                          { label: "Pass Mark", value: "40%" },
                          {
                            label: "Creator",
                            value:
                              test.coachingId?.name ||
                              test.createdBy?.Name ||
                              test.createdBy?.Email ||
                              "—",
                          },
                          { label: "Created", value: fmtDate(test.createdAt) },
                        ].map(({ label, value }) => (
                          <Flex
                            key={label}
                            justify="space-between"
                            align="flex-start"
                            py={2}
                            borderBottom={`1px solid ${C.bg}`}
                            _last={{ borderBottom: "none" }}
                          >
                            <Text
                              fontSize="12px"
                              color={C.muted}
                              fontWeight={500}
                            >
                              {label}
                            </Text>
                            <Text
                              fontSize="12px"
                              color={C.text}
                              fontWeight={700}
                              textAlign="right"
                              maxW="60%"
                            >
                              {value}
                            </Text>
                          </Flex>
                        ))}
                      </Box>
                    </Box>

                    {/* score distribution */}
                    <Box
                      bg="white"
                      borderRadius="12px"
                      border={`1px solid ${C.border}`}
                      overflow="hidden"
                    >
                      <Flex
                        align="center"
                        gap={2}
                        px={5}
                        py={3}
                        bg={C.bg}
                        borderBottom={`1px solid ${C.border}`}
                      >
                        <Icon
                          as={FaChartBar}
                          color={C.purple}
                          fontSize="12px"
                        />
                        <Text
                          fontSize="12px"
                          fontWeight={800}
                          color={C.text}
                          textTransform="uppercase"
                          letterSpacing=".6px"
                        >
                          Score Distribution
                        </Text>
                      </Flex>
                      <Box px={5} py={4}>
                        {[
                          {
                            label: "90–100%",
                            color: "#16a34a",
                            count: attempts.filter(
                              (a) =>
                                (a.scorePercentage ?? a.percentage ?? 0) >= 90
                            ).length,
                          },
                          {
                            label: "75–89%",
                            color: "#2563eb",
                            count: attempts.filter((a) => {
                              const p =
                                a.scorePercentage ?? a.percentage ?? 0;
                              return p >= 75 && p < 90;
                            }).length,
                          },
                          {
                            label: "60–74%",
                            color: "#0891b2",
                            count: attempts.filter((a) => {
                              const p =
                                a.scorePercentage ?? a.percentage ?? 0;
                              return p >= 60 && p < 75;
                            }).length,
                          },
                          {
                            label: "40–59%",
                            color: "#d97706",
                            count: attempts.filter((a) => {
                              const p =
                                a.scorePercentage ?? a.percentage ?? 0;
                              return p >= 40 && p < 60;
                            }).length,
                          },
                          {
                            label: "Below 40%",
                            color: "#dc2626",
                            count: attempts.filter(
                              (a) =>
                                (a.scorePercentage ?? a.percentage ?? 0) < 40
                            ).length,
                          },
                        ].map(({ label, color, count }) => (
                          <Flex
                            key={label}
                            align="center"
                            gap={3}
                            mb={2.5}
                            _last={{ mb: 0 }}
                          >
                            <Box w="64px" flexShrink={0}>
                              <Text
                                fontSize="10px"
                                fontWeight={700}
                                color={color}
                              >
                                {label}
                              </Text>
                            </Box>
                            <Box
                              flex={1}
                              bg="#f8fafc"
                              borderRadius="full"
                              h="8px"
                              overflow="hidden"
                            >
                              <Box
                                h="8px"
                                bg={color}
                                borderRadius="full"
                                w={
                                  attempts.length
                                    ? `${(count / attempts.length) * 100}%`
                                    : "0%"
                                }
                                transition="width .5s"
                              />
                            </Box>
                            <Box w="24px" flexShrink={0} textAlign="right">
                              <Text
                                fontSize="11px"
                                fontWeight={800}
                                color={color}
                              >
                                {count}
                              </Text>
                            </Box>
                          </Flex>
                        ))}
                        {attempts.length === 0 && (
                          <Text
                            fontSize="12px"
                            color={C.muted}
                            textAlign="center"
                            py={4}
                          >
                            No attempts yet
                          </Text>
                        )}
                      </Box>
                    </Box>
                  </Grid>

                  {/* sections list */}
                  {isSectioned && test.sections?.length > 0 && (
                    <Box
                      bg="white"
                      borderRadius="12px"
                      border={`1px solid ${C.border}`}
                      overflow="hidden"
                    >
                      <Flex
                        align="center"
                        gap={2}
                        px={5}
                        py={3}
                        bg={C.bg}
                        borderBottom={`1px solid ${C.border}`}
                      >
                        <Icon
                          as={FaLayerGroup}
                          color={C.blue}
                          fontSize="12px"
                        />
                        <Text
                          fontSize="12px"
                          fontWeight={800}
                          color={C.text}
                          textTransform="uppercase"
                          letterSpacing=".6px"
                        >
                          Sections
                        </Text>
                      </Flex>
                      <Flex flexWrap="wrap" gap={3} p={4}>
                        {test.sections.map((sec, i) => (
                          <Flex
                            key={i}
                            align="center"
                            gap={3}
                            bg={C.bg}
                            borderRadius="8px"
                            border={`1px solid ${C.border}`}
                            px={4}
                            py={3}
                            minW="180px"
                          >
                            <Flex
                              w="28px"
                              h="28px"
                              bg="#eff6ff"
                              borderRadius="7px"
                              align="center"
                              justify="center"
                              flexShrink={0}
                            >
                              <Text
                                fontSize="10px"
                                fontWeight={900}
                                color={C.blue}
                              >
                                {i + 1}
                              </Text>
                            </Flex>
                            <Box>
                              <Text
                                fontSize="13px"
                                fontWeight={700}
                                color={C.text}
                                textTransform="capitalize"
                              >
                                {sec.name || sec.subject}
                              </Text>
                              <Text fontSize="10px" color={C.muted}>
                                {sec.questions?.length || 0} questions
                              </Text>
                            </Box>
                          </Flex>
                        ))}
                      </Flex>
                    </Box>
                  )}
                </Box>
              )}

              {/* ════ ALL ATTEMPTS ════ */}
              {activeTab === "attempts" && (
                <Box>
                  {/* summary bar */}
                  <Grid
                    templateColumns="repeat(4,1fr)"
                    gap={0}
                    borderBottom={`1px solid ${C.border}`}
                  >
                    {[
                      {
                        label: "Total",
                        value: attempts.length,
                        color: C.blue,
                        bg: "#eff6ff",
                      },
                      {
                        label: "Passed",
                        value: passCount,
                        color: C.green,
                        bg: "#f0fdf4",
                      },
                      {
                        label: "Failed",
                        value: attempts.length - passCount,
                        color: C.red,
                        bg: "#fef2f2",
                      },
                      {
                        label: "Avg Score",
                        value: attempts.length ? `${avgPct}%` : "—",
                        color: C.purple,
                        bg: "#f5f3ff",
                      },
                    ].map((s) => (
                      <Box
                        key={s.label}
                        px={5}
                        py={4}
                        bg={s.bg}
                        textAlign="center"
                      >
                        <Text
                          fontSize="24px"
                          fontWeight={900}
                          color={s.color}
                          lineHeight="1"
                        >
                          {s.value}
                        </Text>
                        <Text
                          fontSize="10px"
                          fontWeight={700}
                          color={s.color}
                          textTransform="uppercase"
                          letterSpacing=".6px"
                          mt={1}
                        >
                          {s.label}
                        </Text>
                      </Box>
                    ))}
                  </Grid>

                  {attempts.length === 0 ? (
                    <Box py={20} textAlign="center">
                      <Icon
                        as={FaListAlt}
                        fontSize="48px"
                        color="#e2e8f0"
                        display="block"
                        mx="auto"
                        mb={3}
                      />
                      <Text fontSize="14px" color={C.muted} fontWeight={600}>
                        No attempts yet
                      </Text>
                    </Box>
                  ) : (
                    <>
                      {/* column headers */}
                      <Flex
                        px={5}
                        py={2.5}
                        bg={C.bg}
                        borderBottom={`1px solid ${C.border}`}
                      >
                        {[
                          ["#", "28px", true],
                          ["Student", "3", true],
                          ["Score", "1.5", true],
                          ["Breakdown", "2", false],
                          ["Time", "1.2", false],
                          ["Result", "0.9", true],
                          ["Submitted At", "2", false],
                        ].map(([h, f, always]) => (
                          <Text
                            key={h}
                            flex={f}
                            fontSize="10px"
                            fontWeight={800}
                            color={C.muted}
                            textTransform="uppercase"
                            letterSpacing=".8px"
                            display={
                              always
                                ? "block"
                                : h === "Submitted At"
                                ? { base: "none", lg: "block" }
                                : { base: "none", md: "block" }
                            }
                          >
                            {h}
                          </Text>
                        ))}
                      </Flex>
                      <Box maxH="430px" overflowY="auto">
                        {attempts.map((r, i) => (
                          <AttemptRow
                            key={r._id || i}
                            r={r}
                            i={i}
                            totalQ={qCount}
                          />
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              )}

              {/* ════ QUESTIONS ════ */}
              {activeTab === "questions" && (
                <Box>
                  <Flex
                    px={5}
                    py={3}
                    bg={C.bg}
                    borderBottom={`1px solid ${C.border}`}
                    align="center"
                    gap={3}
                  >
                    <Icon
                      as={FaClipboardList}
                      color={C.blue}
                      fontSize="12px"
                    />
                    <Text
                      fontSize="12px"
                      fontWeight={800}
                      color={C.text}
                      textTransform="uppercase"
                      letterSpacing=".6px"
                    >
                      All Questions
                    </Text>
                    <Badge
                      bg="#eff6ff"
                      color={C.blue}
                      borderRadius="full"
                      fontSize="10px"
                      fontWeight={700}
                      px={2}
                    >
                      {qCount}
                    </Badge>
                    {isSectioned && (
                      <Badge
                        bg="#f5f3ff"
                        color={C.purple}
                        borderRadius="full"
                        fontSize="10px"
                        fontWeight={700}
                        px={2}
                      >
                        {test.sections?.length} sections
                      </Badge>
                    )}
                  </Flex>

                  <Box maxH="520px" overflowY="auto">
                    {isSectioned && test.sections?.length
                      ? test.sections.map((sec, sIdx) => (
                          <Box key={sIdx}>
                            <Flex
                              align="center"
                              gap={2.5}
                              px={5}
                              py={3}
                              bg="#f0f7ff"
                              borderBottom="1px solid #bfdbfe"
                              borderTop={
                                sIdx > 0 ? `2px solid ${C.blue}` : "none"
                              }
                            >
                              <Flex
                                w="24px"
                                h="24px"
                                bg={C.blue}
                                borderRadius="6px"
                                align="center"
                                justify="center"
                                flexShrink={0}
                              >
                                <Text
                                  fontSize="10px"
                                  fontWeight={900}
                                  color="white"
                                >
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
                            {(sec.questions || []).map((q, qIdx) => (
                              <QuestionRow
                                key={qIdx}
                                q={q}
                                num={qIdx + 1}
                                last={
                                  qIdx === (sec.questions?.length || 0) - 1
                                }
                              />
                            ))}
                          </Box>
                        ))
                      : allQuestions.map((q, qIdx) => (
                          <QuestionRow
                            key={qIdx}
                            q={q}
                            num={qIdx + 1}
                            last={qIdx === allQuestions.length - 1}
                          />
                        ))}
                  </Box>
                </Box>
              )}

              {/* ════ VISITS ════ */}
              {activeTab === "visits" && (
                <Box>
                  {/* summary */}
                  <Grid
                    templateColumns="repeat(4,1fr)"
                    gap={0}
                    borderBottom={`1px solid ${C.border}`}
                  >
                    {[
                      {
                        label: "Total Visits",
                        value: visits.length,
                        color: C.blue,
                        bg: "#eff6ff",
                      },
                      {
                        label: "Logged In",
                        value: visits.filter((v) => v.wasLoggedIn).length,
                        color: C.green,
                        bg: "#f0fdf4",
                      },
                      {
                        label: "Started",
                        value: visits.filter((v) => v.didStart).length,
                        color: C.amber,
                        bg: "#fffbeb",
                      },
                      {
                        label: "Completed",
                        value: visits.filter((v) => v.didSubmit).length,
                        color: C.purple,
                        bg: "#f5f3ff",
                      },
                    ].map((s) => (
                      <Box
                        key={s.label}
                        px={5}
                        py={4}
                        bg={s.bg}
                        textAlign="center"
                      >
                        <Text
                          fontSize="24px"
                          fontWeight={900}
                          color={s.color}
                          lineHeight="1"
                        >
                          {s.value}
                        </Text>
                        <Text
                          fontSize="10px"
                          fontWeight={700}
                          color={s.color}
                          textTransform="uppercase"
                          letterSpacing=".6px"
                          mt={1}
                        >
                          {s.label}
                        </Text>
                      </Box>
                    ))}
                  </Grid>

                  {/* conversion bar */}
                  <Box
                    px={5}
                    py={4}
                    borderBottom={`1px solid ${C.border}`}
                    bg="white"
                  >
                    <Flex justify="space-between" mb={1.5}>
                      <Text
                        fontSize="11px"
                        fontWeight={700}
                        color={C.muted}
                        textTransform="uppercase"
                        letterSpacing=".6px"
                      >
                        Visit → Started Conversion
                      </Text>
                      <Text
                        fontSize="11px"
                        fontWeight={900}
                        color={C.purple}
                      >
                        {convRate}%
                      </Text>
                    </Flex>
                    <Progress
                      value={convRate}
                      colorScheme="purple"
                      size="sm"
                      borderRadius="full"
                    />
                  </Box>

                  {visits.length === 0 ? (
                    <Box py={20} textAlign="center">
                      <Icon
                        as={FaEye}
                        fontSize="48px"
                        color="#e2e8f0"
                        display="block"
                        mx="auto"
                        mb={3}
                      />
                      <Text fontSize="14px" color={C.muted} fontWeight={600}>
                        No visit data recorded yet
                      </Text>
                    </Box>
                  ) : (
                    <>
                      <Flex
                        px={4}
                        py={2.5}
                        bg={C.bg}
                        borderBottom={`1px solid ${C.border}`}
                      >
                        {[
                          ["#", 0.5],
                          ["Student", 3],
                          ["Auth", 1.5],
                          ["Last Login", 1.5],
                          ["Started", 1],
                          ["Submitted", 1],
                        ].map(([h, f]) => (
                          <Text
                            key={h}
                            flex={f}
                            fontSize="10px"
                            fontWeight={800}
                            color={C.muted}
                            textTransform="uppercase"
                            letterSpacing=".8px"
                          >
                            {h}
                          </Text>
                        ))}
                      </Flex>
                      <Box maxH="400px" overflowY="auto">
                        {visits.map((v, i) => (
                          <VisitRow key={i} v={v} i={i} />
                        ))}
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

/* ─── main page ──────────────────────────────────────────── */
export default function AdminTestsPage() {
  const toast = useToast();
  const cancelRef = useRef();

  const {
    isOpen: visitsOpen,
    onOpen: openVisits,
    onClose: closeVisits,
  } = useDisclosure();
  const {
    isOpen: delOpen,
    onOpen: openDel,
    onClose: closeDel,
  } = useDisclosure();
  const {
    isOpen: detailOpen,
    onOpen: openDetail,
    onClose: closeDetail,
  } = useDisclosure();

  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [visFilter, setVisFilter] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [visits, setVisits] = useState([]);
  const [visitsLoading, setVisitsLoading] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const p = new URLSearchParams();
      if (search.trim()) p.set("search", search.trim());
      if (examFilter) p.set("examType", examFilter);
      if (visFilter) p.set("visibility", visFilter);
      const qs = p.toString();
      const res = await apiFetch(`/tests${qs ? `?${qs}` : ""}`);
      setTests(toArr(res));
    } catch (e) {
      setError(e.message);
      toast({ title: e.message, status: "error", duration: 3000 });
    } finally {
      setLoading(false);
    }
  }, [search, examFilter, visFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openVisitsModal = async (t) => {
    setSelectedTest(t);
    setVisits([]);
    openVisits();
    setVisitsLoading(true);
    try {
      const res = await apiFetch(`/tests/${t._id}/visits`);
      setVisits(toArr(res));
    } catch {
      setVisits([]);
    } finally {
      setVisitsLoading(false);
    }
  };

  const openDetailModal = (t) => {
    setSelectedTest(t);
    openDetail();
  };

  const deleteTest = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await apiFetch(`/tests/${toDelete._id}`, { method: "DELETE" });
      toast({ title: "Test deleted", status: "success" });
      setTests((prev) => prev.filter((t) => t._id !== toDelete._id));
      closeDel();
    } catch (e) {
      toast({ title: e.message, status: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const displayed = tests.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (t.title || "").toLowerCase().includes(q) ||
      (t.examType || "").toLowerCase().includes(q) ||
      (t.subject || "").toLowerCase().includes(q);
    const matchExam = !examFilter || t.examType === examFilter;
    const matchVis = !visFilter || t.visibility === visFilter;
    return matchSearch && matchExam && matchVis;
  });

  const quickConvRate = (vs) => {
    if (!vs?.length) return 0;
    return Math.round((vs.filter((v) => v.didStart).length / vs.length) * 100);
  };

  return (
    <AdminNavPage title="All Tests" subtitle="Admin Panel">
      {/* ── filters ── */}
      <Flex gap={3} mb={5} flexWrap={{ base: "wrap", md: "nowrap" }}>
        <InputGroup flex={1} minW="180px">
          <InputLeftElement pointerEvents="none" h="full" pl={3}>
            <Icon as={FaSearch} color="gray.400" fontSize="12px" />
          </InputLeftElement>
          <Input
            placeholder="Search test title, exam type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
            bg="white"
            borderRadius="10px"
            h="42px"
            fontSize="13px"
            pl="38px"
            border={`1px solid ${C.border}`}
            _focus={{
              borderColor: C.blue,
              boxShadow: `0 0 0 1px ${C.blue}`,
            }}
          />
        </InputGroup>
        <Select
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
          bg="white"
          borderRadius="10px"
          h="42px"
          minW="130px"
          maxW="130px"
          fontSize="13px"
          fontWeight={600}
          border={`1px solid ${C.border}`}
        >
          <option value="">All Exams</option>
          {EXAM_TYPES.map((ex) => (
            <option key={ex} value={ex}>
              {ex}
            </option>
          ))}
        </Select>
        <Select
          value={visFilter}
          onChange={(e) => setVisFilter(e.target.value)}
          bg="white"
          borderRadius="10px"
          h="42px"
          minW="120px"
          maxW="120px"
          fontSize="13px"
          fontWeight={600}
          border={`1px solid ${C.border}`}
        >
          <option value="">All Types</option>
          <option value="public">🌐 Public</option>
          <option value="private">🔒 Private</option>
        </Select>
        <Button
          onClick={load}
          bg={C.blue}
          color="white"
          borderRadius="10px"
          h="42px"
          px={5}
          fontSize="13px"
          fontWeight={700}
          leftIcon={<Icon as={FaSyncAlt} fontSize="11px" />}
          _hover={{ opacity: 0.9 }}
        >
          Search
        </Button>
      </Flex>

      {/* count / clear */}
      {!loading && (
        <Flex align="center" gap={2} mb={3}>
          <Text fontSize="13px" color={C.muted} fontWeight={500}>
            {displayed.length} tests
          </Text>
          {(search || examFilter || visFilter) && (
            <Button
              size="xs"
              h="24px"
              px={2}
              borderRadius="6px"
              bg="#f1f5f9"
              color={C.muted}
              fontSize="11px"
              fontWeight={600}
              onClick={() => {
                setSearch("");
                setExamFilter("");
                setVisFilter("");
              }}
              _hover={{ bg: "#e2e8f0" }}
            >
              Clear filters
            </Button>
          )}
        </Flex>
      )}

      {/* table */}
      {loading ? (
        <Flex justify="center" py={20}>
          <Spinner color={C.purple} size="xl" thickness="3px" />
        </Flex>
      ) : error ? (
        <Box
          py={16}
          textAlign="center"
          bg="white"
          borderRadius="14px"
          border={`1px solid ${C.border}`}
        >
          <Text fontSize="16px" fontWeight={700} color={C.red} mb={3}>
            {error}
          </Text>
          <Button
            onClick={load}
            bg={C.purple}
            color="white"
            borderRadius="10px"
            fontWeight={700}
            px={6}
          >
            Retry
          </Button>
        </Box>
      ) : displayed.length === 0 ? (
        <Box
          py={20}
          textAlign="center"
          bg="white"
          borderRadius="14px"
          border={`1px solid ${C.border}`}
        >
          <Icon
            as={FaClipboardList}
            fontSize="48px"
            color="#e2e8f0"
            display="block"
            mx="auto"
            mb={4}
          />
          <Text fontSize="15px" fontWeight={700} color={C.muted}>
            No tests found
          </Text>
        </Box>
      ) : (
        <Box
          bg="white"
          borderRadius="14px"
          border={`1px solid ${C.border}`}
          overflow="hidden"
          mb={5}
        >
          {/* column headers */}
          <Flex
            px={5}
            py={3}
            bg={C.bg}
            borderBottom={`1px solid ${C.border}`}
            display={{ base: "none", md: "flex" }}
          >
            {[
              ["Test", 4],
              ["Coaching / Creator", 2],
              ["Type", 1.5],
              ["Questions", 1.5],
              ["Attempts", 1.2],
              ["Avg Score", 1.2],
              ["Created", 1.5],
              ["", 3],
            ].map(([h, f]) => (
              <Text
                key={h}
                flex={f}
                fontSize="10px"
                fontWeight={800}
                color={C.muted}
                textTransform="uppercase"
                letterSpacing=".8px"
              >
                {h}
              </Text>
            ))}
          </Flex>

          {displayed.map((t, idx) => {
            const isPrivate = t.visibility === "private";
            const qCount =
              t.isSectioned && t.sections?.length
                ? t.sections.reduce(
                    (s, sec) => s + (sec.questions?.length || 0),
                    0
                  )
                : t.questions?.length || t.totalQuestions || 0;
            const avgScore = t.avgScore ?? t.averageScore ?? null;

            return (
              <Flex
                key={t._id}
                px={5}
                py={4}
                align="center"
                gap={3}
                borderBottom={
                  idx < displayed.length - 1
                    ? `1px solid ${C.bg}`
                    : "none"
                }
                _hover={{ bg: "#f8faff" }}
                transition="background .12s"
                flexWrap={{ base: "wrap", md: "nowrap" }}
              >
                {/* title */}
                <Box flex={4} minW={0}>
                  <Flex align="center" gap={2}>
                    <Text
                      fontSize="13px"
                      fontWeight={700}
                      color={C.text}
                      noOfLines={1}
                    >
                      {t.title}
                    </Text>
                    {isPrivate && (
                      <Icon
                        as={FaLock}
                        fontSize="10px"
                        color={C.muted}
                        flexShrink={0}
                      />
                    )}
                    {t.isSectioned && (
                      <Badge
                        bg="#eff6ff"
                        color={C.blue}
                        borderRadius="full"
                        fontSize="9px"
                        fontWeight={700}
                        px={2}
                        flexShrink={0}
                      >
                        <Flex align="center" gap={1}>
                          <Icon as={FaLayerGroup} fontSize="8px" />
                          {t.sections?.length}s
                        </Flex>
                      </Badge>
                    )}
                  </Flex>
                  <Flex gap={1} mt={0.5} flexWrap="wrap">
                    {t.examType && (
                      <Text
                        fontSize="9px"
                        fontWeight={700}
                        bg="#eff6ff"
                        color={C.blue}
                        px={2}
                        py="1px"
                        borderRadius="full"
                      >
                        {t.examType}
                      </Text>
                    )}
                    {t.subject && (
                      <Text
                        fontSize="9px"
                        fontWeight={700}
                        bg="#f1f5f9"
                        color={C.muted}
                        px={2}
                        py="1px"
                        borderRadius="full"
                        textTransform="capitalize"
                      >
                        {t.subject}
                      </Text>
                    )}
                  </Flex>
                </Box>

                {/* creator */}
                <Box
                  flex={2}
                  minW={0}
                  display={{ base: "none", md: "block" }}
                >
                  <Text fontSize="12px" color={C.muted} noOfLines={1}>
                    {t.coachingId?.name ||
                      t.createdBy?.Name ||
                      t.createdBy?.Email ||
                      "—"}
                  </Text>
                </Box>

                {/* visibility */}
                <Box
                  flex={1.5}
                  display={{ base: "none", md: "block" }}
                >
                  <Flex align="center" gap={1}>
                    <Icon
                      as={isPrivate ? FaLock : FaUnlock}
                      fontSize="10px"
                      color={isPrivate ? C.amber : C.green}
                    />
                    <Text
                      fontSize="11px"
                      fontWeight={600}
                      color={isPrivate ? C.amber : C.green}
                    >
                      {isPrivate ? "Private" : "Public"}
                    </Text>
                  </Flex>
                </Box>

                {/* questions */}
                <Box
                  flex={1.5}
                  display={{ base: "none", md: "block" }}
                >
                  <Text fontSize="13px" fontWeight={700} color={C.text}>
                    {qCount}
                  </Text>
                  <Text fontSize="10px" color={C.muted}>
                    {t.timeLimitMin || t.timeLimit || "—"}min
                  </Text>
                </Box>

                {/* attempts */}
                <Box flex={1.2}>
                  <Text fontSize="13px" fontWeight={700} color={C.blue}>
                    {t.totalAttempts ?? 0}
                  </Text>
                </Box>

                {/* avg score */}
                <Box
                  flex={1.2}
                  display={{ base: "none", md: "block" }}
                >
                  {avgScore != null ? (
                    <Text
                      fontSize="13px"
                      fontWeight={700}
                      color={
                        avgScore >= 60
                          ? C.green
                          : avgScore >= 40
                          ? C.amber
                          : C.red
                      }
                    >
                      {Number(avgScore).toFixed(0)}%
                    </Text>
                  ) : (
                    <Text fontSize="12px" color={C.muted}>
                      —
                    </Text>
                  )}
                </Box>

                {/* created */}
                <Box
                  flex={1.5}
                  display={{ base: "none", md: "block" }}
                >
                  <Text fontSize="11px" color={C.muted}>
                    {fmtDate(t.createdAt)}
                  </Text>
                </Box>

                {/* ── action buttons ── */}
                <Flex flex={3} gap={1.5} justify="flex-end" flexWrap="wrap">
                  {/* ★ Details (new) */}
                  <Button
                    size="xs"
                    h="28px"
                    px={2.5}
                    borderRadius="7px"
                    bg={C.navy}
                    color="white"
                    fontSize="10px"
                    fontWeight={700}
                    leftIcon={<Icon as={FaEye} fontSize="9px" />}
                    onClick={() => openDetailModal(t)}
                    _hover={{ bg: "#1e3a6e" }}
                  >
                    Details
                  </Button>

                  {/* visits quick-view */}
                  <Button
                    size="xs"
                    h="28px"
                    px={2}
                    borderRadius="7px"
                    bg="#f5f3ff"
                    color={C.purple}
                    fontSize="10px"
                    fontWeight={700}
                    leftIcon={<Icon as={FaChartBar} fontSize="9px" />}
                    onClick={() => openVisitsModal(t)}
                    _hover={{ bg: "#ede9fe" }}
                  >
                    Visits
                  </Button>

                  {/* live link */}
                  <Button
                    size="xs"
                    h="28px"
                    px={2}
                    borderRadius="7px"
                    bg="#f0f7ff"
                    color={C.blue}
                    fontSize="10px"
                    fontWeight={700}
                    leftIcon={<Icon as={FaExternalLinkAlt} fontSize="9px" />}
                    onClick={() =>
                      window.open(`/tests/${t.slug || t._id}`, "_blank")
                    }
                    _hover={{ bg: "#dbeafe" }}
                  >
                    View
                  </Button>

                  {/* delete */}
                  <Button
                    size="xs"
                    h="28px"
                    w="28px"
                    p={0}
                    borderRadius="7px"
                    bg="#fef2f2"
                    color={C.red}
                    onClick={() => {
                      setToDelete(t);
                      openDel();
                    }}
                    _hover={{ bg: "#fecaca" }}
                  >
                    <Icon as={FaTrash} fontSize="10px" />
                  </Button>
                </Flex>
              </Flex>
            );
          })}
        </Box>
      )}

      {/* ── full detail modal ── */}
      <TestDetailModal
        test={selectedTest}
        isOpen={detailOpen}
        onClose={closeDetail}
      />

      {/* ── legacy visits quick-modal ── */}
      <Modal
        isOpen={visitsOpen}
        onClose={closeVisits}
        size="4xl"
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent
          borderRadius="16px"
          fontFamily="'DM Sans',sans-serif"
          mx={4}
          maxH="88vh"
          overflow="hidden"
        >
          <ModalHeader
            px={6}
            pt={6}
            pb={5}
            bg="linear-gradient(135deg,#0b1e3d,#1a3a6e)"
            color="white"
          >
            <Flex align="center" justify="space-between">
              <Box>
                <Text fontSize="15px" fontWeight={800}>
                  Link Visit Analytics
                </Text>
                <Text
                  fontSize="11px"
                  color="rgba(255,255,255,.45)"
                  mt={0.5}
                  noOfLines={1}
                >
                  {selectedTest?.title} · {visits.length} visits recorded
                </Text>
              </Box>
              <ModalCloseButton
                position="static"
                color="white"
                _hover={{ bg: "rgba(255,255,255,.15)" }}
                borderRadius="8px"
              />
            </Flex>
          </ModalHeader>
          <ModalBody px={0} py={0}>
            {visitsLoading ? (
              <Flex justify="center" py={16}>
                <Spinner color={C.purple} size="lg" />
              </Flex>
            ) : visits.length === 0 ? (
              <Box py={16} textAlign="center">
                <Icon
                  as={FaLink}
                  fontSize="36px"
                  color="#e2e8f0"
                  display="block"
                  mx="auto"
                  mb={3}
                />
                <Text fontSize="13px" color={C.muted} fontWeight={600}>
                  No visit data recorded yet
                </Text>
              </Box>
            ) : (
              <>
                <Grid
                  templateColumns="repeat(4,1fr)"
                  gap={0}
                  borderBottom="1px solid #f1f5f9"
                >
                  {[
                    { label: "Total Visits", value: visits.length, color: C.blue, bg: "#eff6ff" },
                    { label: "Logged In", value: visits.filter((v) => v.wasLoggedIn).length, color: C.green, bg: "#f0fdf4" },
                    { label: "Started Test", value: visits.filter((v) => v.didStart).length, color: C.amber, bg: "#fffbeb" },
                    { label: "Completed", value: visits.filter((v) => v.didSubmit).length, color: C.purple, bg: "#f5f3ff" },
                  ].map((s) => (
                    <Box key={s.label} px={5} py={4} bg={s.bg} textAlign="center">
                      <Text fontSize="24px" fontWeight={900} color={s.color} lineHeight="1">
                        {s.value}
                      </Text>
                      <Text fontSize="10px" fontWeight={700} color={s.color} textTransform="uppercase" letterSpacing=".6px" mt={1}>
                        {s.label}
                      </Text>
                    </Box>
                  ))}
                </Grid>
                <Box px={5} py={4} bg="white" borderBottom="1px solid #f1f5f9">
                  <Flex justify="space-between" mb={1.5}>
                    <Text fontSize="11px" fontWeight={700} color={C.muted} textTransform="uppercase" letterSpacing=".6px">
                      Link → Started Conversion
                    </Text>
                    <Text fontSize="11px" fontWeight={900} color={C.purple}>
                      {quickConvRate(visits)}%
                    </Text>
                  </Flex>
                  <Progress value={quickConvRate(visits)} colorScheme="purple" size="sm" borderRadius="full" />
                </Box>
                <Flex px={4} py={2.5} bg={C.bg} borderBottom={`1px solid ${C.border}`}>
                  {[["#", 0.5], ["Student", 3], ["Auth", 1.5], ["Days Since Login", 1.5], ["Status", 1], ["Submitted", 1]].map(([h, f]) => (
                    <Text key={h} flex={f} fontSize="10px" fontWeight={800} color={C.muted} textTransform="uppercase" letterSpacing=".8px">
                      {h}
                    </Text>
                  ))}
                </Flex>
                <Box maxH="320px" overflowY="auto">
                  {visits.map((v, i) => (
                    <VisitRow key={i} v={v} i={i} />
                  ))}
                </Box>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* ── delete confirm ── */}
      <AlertDialog
        isOpen={delOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeDel}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            mx={4}
            borderRadius="14px"
            fontFamily="'DM Sans',sans-serif"
          >
            <AlertDialogHeader fontWeight={800} fontSize="16px">
              Delete Test?
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text fontSize="13px" color={C.muted}>
                Permanently delete{" "}
                <strong>"{toDelete?.title}"</strong> and all its results? This
                cannot be undone.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter gap={3}>
              <Button
                ref={cancelRef}
                onClick={closeDel}
                variant="ghost"
                borderRadius="10px"
                fontWeight={700}
              >
                Cancel
              </Button>
              <Button
                bg={C.red}
                color="white"
                borderRadius="10px"
                fontWeight={800}
                isLoading={deleting}
                onClick={deleteTest}
                _hover={{ bg: "#b91c1c" }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </AdminNavPage>
  );
}