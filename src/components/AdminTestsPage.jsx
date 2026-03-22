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
 * ─────────────────────────────────────────────────────────────────────────────
 * Lists all tests using the PROVEN endpoint:
 *   GET /tests  → returns tests (may be array or {data:[]} shape)
 *
 * Also shows visit analytics using:
 *   GET /tests/:id/visits  (new endpoint - gracefully falls back if not ready)
 *
 * Search, filter, delete all use existing proven endpoints.
 * ─────────────────────────────────────────────────────────────────────────────
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
} from "react-icons/fa";
import { apiFetch } from "../services/api";
import AdminNavPage from "./AdminNavPage";

const C = {
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  purple: "#7c3aed",
  muted: "#64748b",
  text: "#0f172a",
  border: "#e2e8f0",
  bg: "#f8fafc",
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const EXAM_TYPES = [
  "SSC",
  "UPSC",
  "BANK",
  "RAILWAY",
  "STATE",
  "DEFENCE",
  "OTHER",
];

/* Convert various backend response shapes → plain array */
function toArr(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  return [];
}

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
      borderBottom="1px solid #f8fafc"
      _last={{ borderBottom: "none" }}
      bg={i % 2 === 0 ? "white" : "#fafafa"}
    >
      <Text flex={0.5} fontSize="11px" fontWeight={700} color={C.muted}>
        {i + 1}
      </Text>
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
          {v.wasLoggedIn ? "Logged in" : "Guest"}
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
          {v.didSubmit ? "Done" : "—"}
        </Badge>
      </Box>
    </Flex>
  );
}

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

  const safe = async (path) => {
    try {
      return await apiFetch(path);
    } catch (e) {
      console.warn("[Tests] failed:", path, e.message);
      return null;
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query params
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
      // Endpoint may not exist yet — show empty state gracefully
      setVisits([]);
    } finally {
      setVisitsLoading(false);
    }
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

  // Filtered list (client-side search fallback if backend doesn't support search param)
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

  const convRate = (vs) => {
    if (!vs?.length) return 0;
    return Math.round((vs.filter((v) => v.didStart).length / vs.length) * 100);
  };

  return (
    <AdminNavPage title="All Tests" subtitle="Admin Panel">
      {/* Filters */}
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
            _focus={{ borderColor: C.blue, boxShadow: `0 0 0 1px ${C.blue}` }}
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

      {/* Count */}
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

      {/* Table */}
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
          {/* Header */}
          <Flex
            px={5}
            py={3}
            bg={C.bg}
            borderBottom={`1px solid ${C.border}`}
            display={{ base: "none", md: "flex" }}
          >
            {[
              ["Test", 4],
              ["Coaching/Creator", 2],
              ["Type", 1.5],
              ["Questions", 1.5],
              ["Attempts", 1.5],
              ["Created", 1.5],
              ["", 2],
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
                    0,
                  )
                : t.questions?.length || t.totalQuestions || 0;

            return (
              <Flex
                key={t._id}
                px={5}
                py={4}
                align="center"
                gap={3}
                borderBottom={
                  idx < displayed.length - 1 ? "1px solid #f1f5f9" : "none"
                }
                _hover={{ bg: "#f8faff" }}
                transition="background .12s"
                flexWrap={{ base: "wrap", md: "nowrap" }}
              >
                {/* Title */}
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

                {/* Creator */}
                <Box flex={2} minW={0} display={{ base: "none", md: "block" }}>
                  <Text fontSize="12px" color={C.muted} noOfLines={1}>
                    {t.coachingId?.name ||
                      t.createdBy?.Name ||
                      t.createdBy?.Email ||
                      "—"}
                  </Text>
                </Box>

                {/* Visibility */}
                <Box flex={1.5} display={{ base: "none", md: "block" }}>
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

                {/* Questions */}
                <Box flex={1.5} display={{ base: "none", md: "block" }}>
                  <Text fontSize="13px" fontWeight={700} color={C.text}>
                    {qCount}
                  </Text>
                  <Text fontSize="10px" color={C.muted}>
                    {t.timeLimitMin || t.timeLimit || "—"}min
                  </Text>
                </Box>

                {/* Attempts */}
                <Box flex={1.5}>
                  <Text fontSize="13px" fontWeight={700} color={C.blue}>
                    {t.totalAttempts ?? 0}
                  </Text>
                </Box>

                {/* Created */}
                <Box flex={1.5} display={{ base: "none", md: "block" }}>
                  <Text fontSize="11px" color={C.muted}>
                    {fmtDate(t.createdAt)}
                  </Text>
                </Box>

                {/* Actions */}
                <Flex flex={2} gap={1} justify="flex-end" flexWrap="wrap">
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

      {/* Visit analytics modal */}
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
                <Text fontSize="11px" color={C.muted} mt={1}>
                  Visit tracking records who opened this test's link, whether
                  they were logged in, and if they started/submitted.
                </Text>
              </Box>
            ) : (
              <>
                {/* Conversion summary */}
                <Grid
                  templateColumns="repeat(4,1fr)"
                  gap={0}
                  borderBottom="1px solid #f1f5f9"
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
                      label: "Started Test",
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

                {/* Conversion bar */}
                <Box px={5} py={4} bg="white" borderBottom="1px solid #f1f5f9">
                  <Flex justify="space-between" mb={1.5}>
                    <Text
                      fontSize="11px"
                      fontWeight={700}
                      color={C.muted}
                      textTransform="uppercase"
                      letterSpacing=".6px"
                    >
                      Link → Started Conversion
                    </Text>
                    <Text fontSize="11px" fontWeight={900} color={C.purple}>
                      {convRate(visits)}%
                    </Text>
                  </Flex>
                  <Progress
                    value={convRate(visits)}
                    colorScheme="purple"
                    size="sm"
                    borderRadius="full"
                  />
                </Box>

                {/* Row header */}
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
                    ["Days Since Login", 1.5],
                    ["Status", 1],
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

      {/* Delete confirm */}
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
                Permanently delete <strong>"{toDelete?.title}"</strong> and all
                its results? This cannot be undone.
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