// /**
//  * AdminDashboardPage.jsx
//  * ─────────────────────────────────────────────────────────────────────────────
//  * Uses ONLY proven existing backend endpoints.
//  * NO custom /admin/dashboard route needed.
//  *
//  * Endpoints used (all confirmed working):
//  *   GET /admin/coaching/requests              → coaching count + all status breakdown
//  *   GET /admin/coaching/requests?status=pending
//  *   GET /test-requests/admin/all?status=pending
//  *   GET /test-requests/admin/all?status=completed
//  *   GET /tests?limit=8                        → recent tests for activity feed
//  *   GET /coaching/students                    → students who took tests
//  * ─────────────────────────────────────────────────────────────────────────────
//  */
// import React, { useEffect, useState, useCallback } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Icon,
//   Grid,
//   Spinner,
//   Button,
//   Badge,
//   useToast,
// } from "@chakra-ui/react";
// import {
//   FaUsers,
//   FaLayerGroup,
//   FaChalkboardTeacher,
//   FaClipboardList,
//   FaTrophy,
//   FaArrowRight,
//   FaSyncAlt,
//   FaFire,
//   FaBell,
//   FaCheckCircle,
//   FaHourglass,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { apiFetch } from "../services/api";
// import { socket } from "../services/socket";
// import AdminNavPage from "./AdminNavPage";

// const C = {
//   blue: "#2563eb",
//   green: "#16a34a",
//   red: "#dc2626",
//   amber: "#d97706",
//   purple: "#7c3aed",
//   teal: "#0d9488",
//   muted: "#64748b",
//   text: "#0f172a",
//   border: "#e2e8f0",
// };

// const fmt = (d) =>
//   d
//     ? new Date(d).toLocaleString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//       })
//     : "—";

// /* ── Stat card ── */
// function StatCard({ icon, label, value, sub, color, onClick }) {
//   return (
//     <Box
//       bg="white"
//       borderRadius="14px"
//       border={`1px solid ${C.border}`}
//       p={5}
//       cursor={onClick ? "pointer" : "default"}
//       onClick={onClick}
//       transition="all .18s"
//       position="relative"
//       overflow="hidden"
//       _hover={
//         onClick
//           ? {
//               boxShadow: "0 6px 24px rgba(0,0,0,.09)",
//               transform: "translateY(-2px)",
//             }
//           : {}
//       }
//     >
//       <Box
//         position="absolute"
//         top={0}
//         left={0}
//         w="3px"
//         h="100%"
//         bg={color}
//         borderRadius="14px 0 0 14px"
//       />
//       <Flex align="flex-start" justify="space-between" gap={3}>
//         <Box>
//           <Text
//             fontSize="10px"
//             fontWeight={700}
//             color={C.muted}
//             textTransform="uppercase"
//             letterSpacing=".8px"
//             mb={1.5}
//           >
//             {label}
//           </Text>
//           <Text
//             fontSize="34px"
//             fontWeight={900}
//             color={C.text}
//             lineHeight="1"
//             letterSpacing="-2px"
//           >
//             {value ?? 0}
//           </Text>
//           {sub && (
//             <Text fontSize="11px" color={C.muted} mt={1.5} fontWeight={500}>
//               {sub}
//             </Text>
//           )}
//         </Box>
//         <Flex
//           w="44px"
//           h="44px"
//           bg={`${color}18`}
//           borderRadius="12px"
//           align="center"
//           justify="center"
//           flexShrink={0}
//         >
//           <Icon as={icon} color={color} fontSize="17px" />
//         </Flex>
//       </Flex>
//     </Box>
//   );
// }

// /* ── Activity row ── */
// function ActivityRow({ item }) {
//   const typeMap = {
//     test: { icon: FaLayerGroup, color: C.teal, label: "Test" },
//     coaching: { icon: FaChalkboardTeacher, color: C.purple, label: "Coaching" },
//     request: { icon: FaClipboardList, color: C.red, label: "Request" },
//     completed: { icon: FaCheckCircle, color: C.green, label: "Delivered" },
//   };
//   const t = typeMap[item.type] || {
//     icon: FaBell,
//     color: C.muted,
//     label: "Event",
//   };
//   return (
//     <Flex
//       align="center"
//       gap={3}
//       py={3}
//       borderBottom="1px solid #f1f5f9"
//       _last={{ borderBottom: "none" }}
//     >
//       <Flex
//         w="34px"
//         h="34px"
//         bg={`${t.color}14`}
//         borderRadius="10px"
//         align="center"
//         justify="center"
//         flexShrink={0}
//       >
//         <Icon as={t.icon} color={t.color} fontSize="13px" />
//       </Flex>
//       <Box flex={1} minW={0}>
//         <Text fontSize="13px" fontWeight={600} color={C.text} noOfLines={1}>
//           {item.message}
//         </Text>
//         <Text fontSize="11px" color={C.muted}>
//           {fmt(item.createdAt)}
//         </Text>
//       </Box>
//       <Badge
//         bg={`${t.color}14`}
//         color={t.color}
//         borderRadius="full"
//         fontSize="9px"
//         fontWeight={700}
//         px={2}
//         flexShrink={0}
//       >
//         {t.label}
//       </Badge>
//     </Flex>
//   );
// }

// /* ══════════════════════════════════════════════════════════════════════════ */
// export default function AdminDashboardPage() {
//   const navigate = useNavigate();
//   const toast = useToast();

//   const [data, setData] = useState(null); // null = not loaded yet
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);

//   /* safe fetch - returns null on error, never throws */
//   const safe = async (path) => {
//     try {
//       return await apiFetch(path);
//     } catch (e) {
//       console.warn("[Dashboard] failed:", path, e.message);
//       return null;
//     }
//   };

//   /* extract array from various response shapes the backend might return */
//   const toArr = (res) => {
//     if (!res) return [];
//     if (Array.isArray(res)) return res;
//     if (Array.isArray(res.data)) return res.data;
//     return [];
//   };

//   /* extract total count hint if backend sends pagination meta */
//   const totalHint = (res, arr) =>
//     res?.total ?? res?.totalCount ?? res?.count ?? arr.length;

//   const load = useCallback(async (quiet = false) => {
//     if (quiet) setRefreshing(true);
//     else setLoading(true);
//     setError(null);

//     try {
//       const [
//         allCoachingRes,
//         pendingCoachRes,
//         pendingReqRes,
//         completedReqRes,
//         recentTestsRes,
//         studentsRes,
//       ] = await Promise.all([
//         safe("/admin/coaching/requests"),
//         safe("/admin/coaching/requests?status=pending"),
//         safe("/test-requests/admin/all?status=pending"),
//         safe("/test-requests/admin/all?status=completed"),
//         safe("/tests?limit=8"),
//         safe("/coaching/students"),
//       ]);

//       const allCoaching = toArr(allCoachingRes);
//       const pendingCoach = toArr(pendingCoachRes);
//       const pendingReqs = toArr(pendingReqRes);
//       const completedReqs = toArr(completedReqRes);
//       const recentTests = toArr(recentTestsRes);
//       const students = toArr(studentsRes);

//       // Build activity feed
//       const activity = [];

//       recentTests.slice(0, 5).forEach((t) =>
//         activity.push({
//           type: "test",
//           message: `Test "${t.title}" created${t.coachingId?.name ? ` by ${t.coachingId.name}` : ""}`,
//           createdAt: t.createdAt,
//         }),
//       );
//       pendingCoach.slice(0, 4).forEach((c) =>
//         activity.push({
//           type: "coaching",
//           message: `"${c.name}" submitted a coaching registration`,
//           createdAt: c.createdAt,
//         }),
//       );
//       pendingReqs.slice(0, 4).forEach((r) =>
//         activity.push({
//           type: "request",
//           message: `Test request: "${r.title}" from ${r.coachingId?.name || "coaching"}`,
//           createdAt: r.createdAt,
//         }),
//       );
//       completedReqs.slice(0, 3).forEach((r) =>
//         activity.push({
//           type: "completed",
//           message: `Test delivered: "${r.title}" → ${r.coachingId?.name || "coaching"}`,
//           createdAt: r.updatedAt || r.createdAt,
//         }),
//       );

//       activity.sort(
//         (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
//       );

//       setData({
//         coachingCount: totalHint(allCoachingRes, allCoaching),
//         approvedCoaching: allCoaching.filter((c) => c.status === "approved")
//           .length,
//         pendingCoaching: pendingCoach.length,
//         pendingTestRequests: pendingReqs.length,
//         completedRequests: totalHint(completedReqRes, completedReqs),
//         totalStudents: students.length,
//         totalTests: totalHint(recentTestsRes, recentTests),
//         recentTests: recentTests.slice(0, 5),
//         pendingCoachList: pendingCoach.slice(0, 5),
//         pendingReqList: pendingReqs.slice(0, 5),
//         recentActivity: activity.slice(0, 20),
//       });
//     } catch (e) {
//       console.error("[Dashboard] load error:", e);
//       setError(e.message);
//       toast({
//         title: "Dashboard error: " + e.message,
//         status: "error",
//         duration: 4000,
//       });
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   useEffect(() => {
//     if (socket.connected) socket.emit("join-admin");
//     socket.on("connect", () => socket.emit("join-admin"));
//     const refresh = () => load(true);
//     socket.on("coaching:new-request", refresh);
//     socket.on("test-request:new", refresh);
//     socket.on("test:attempted", refresh);
//     return () => {
//       socket.emit("leave-admin");
//       ["coaching:new-request", "test-request:new", "test:attempted"].forEach(
//         (ev) => socket.off(ev, refresh),
//       );
//       socket.off("connect");
//     };
//   }, [load]);

//   const d = data || {};

//   const CARDS = [
//     {
//       icon: FaChalkboardTeacher,
//       label: "Coaching Centres",
//       value: d.coachingCount,
//       sub: `${d.approvedCoaching ?? 0} approved`,
//       color: C.purple,
//       route: "/admin/coaching",
//     },
//     {
//       icon: FaHourglass,
//       label: "Pending Coaching",
//       value: d.pendingCoaching,
//       sub: "awaiting your approval",
//       color: C.amber,
//       route: "/admin/coaching",
//     },
//     {
//       icon: FaLayerGroup,
//       label: "Tests on Platform",
//       value: d.totalTests,
//       sub: "across all coachings",
//       color: C.teal,
//       route: "/admin/tests",
//     },
//     {
//       icon: FaClipboardList,
//       label: "Pending Requests",
//       value: d.pendingTestRequests,
//       sub: "test creation requests",
//       color: C.red,
//       route: "/admin/test-requests",
//     },
//     {
//       icon: FaCheckCircle,
//       label: "Delivered Tests",
//       value: d.completedRequests,
//       sub: "completed test requests",
//       color: C.green,
//       route: "/admin/test-requests",
//     },
//     {
//       icon: FaUsers,
//       label: "Active Students",
//       value: d.totalStudents,
//       sub: "attempted at least one test",
//       color: C.blue,
//       route: "/admin/coaching",
//     },
//   ];

//   return (
//     <AdminNavPage title="Dashboard" subtitle="Admin Panel">
//       {/* Refresh */}
//       <Flex justify="flex-end" mb={5}>
//         <Button
//           size="sm"
//           h="36px"
//           px={4}
//           borderRadius="9px"
//           leftIcon={
//             <Icon
//               as={FaSyncAlt}
//               fontSize="11px"
//               style={
//                 refreshing ? { animation: "dashSpin 0.8s linear infinite" } : {}
//               }
//             />
//           }
//           onClick={() => load(true)}
//           isLoading={refreshing}
//           loadingText="Refreshing…"
//           bg="white"
//           border={`1px solid ${C.border}`}
//           color={C.muted}
//           fontWeight={600}
//           fontSize="13px"
//           _hover={{ bg: "#f1f5f9" }}
//         >
//           Refresh
//         </Button>
//       </Flex>

//       {loading ? (
//         <Flex
//           justify="center"
//           align="center"
//           direction="column"
//           gap={4}
//           minH="350px"
//         >
//           <Spinner size="xl" color={C.purple} thickness="4px" speed="0.7s" />
//           <Text fontSize="13px" color={C.muted} fontWeight={500}>
//             Loading dashboard…
//           </Text>
//         </Flex>
//       ) : error ? (
//         <Box
//           py={16}
//           textAlign="center"
//           bg="white"
//           borderRadius="14px"
//           border={`1px solid ${C.border}`}
//         >
//           <Text fontSize="40px" mb={3}>
//             ⚠️
//           </Text>
//           <Text fontSize="16px" fontWeight={700} color={C.red} mb={2}>
//             Could not load dashboard
//           </Text>
//           <Text fontSize="13px" color={C.muted} mb={6}>
//             {error}
//           </Text>
//           <Button
//             onClick={() => load()}
//             bg={C.purple}
//             color="white"
//             borderRadius="10px"
//             fontWeight={700}
//             px={6}
//           >
//             Try Again
//           </Button>
//         </Box>
//       ) : (
//         <>
//           {/* Stat cards */}
//           <Grid
//             templateColumns={{ base: "1fr 1fr", md: "repeat(3,1fr)" }}
//             gap={4}
//             mb={6}
//           >
//             {CARDS.map((sc) => (
//               <StatCard
//                 key={sc.label}
//                 {...sc}
//                 onClick={sc.route ? () => navigate(sc.route) : undefined}
//               />
//             ))}
//           </Grid>

//           {/* Activity + sidebar */}
//           <Grid templateColumns={{ base: "1fr", lg: "1fr 340px" }} gap={5}>
//             {/* Recent Activity */}
//             <Box
//               bg="white"
//               borderRadius="14px"
//               border={`1px solid ${C.border}`}
//               overflow="hidden"
//             >
//               <Flex
//                 px={5}
//                 py={4}
//                 borderBottom="1px solid #f1f5f9"
//                 align="center"
//                 justify="space-between"
//               >
//                 <Flex align="center" gap={2}>
//                   <Icon as={FaFire} color={C.amber} fontSize="14px" />
//                   <Text fontSize="15px" fontWeight={800} color={C.text}>
//                     Recent Activity
//                   </Text>
//                 </Flex>
//                 <Text fontSize="11px" color={C.muted}>
//                   {d.recentActivity?.length ?? 0} events
//                 </Text>
//               </Flex>
//               <Box
//                 px={5}
//                 py={2}
//                 maxH="420px"
//                 overflowY="auto"
//                 css={{
//                   "&::-webkit-scrollbar": { width: "3px" },
//                   "&::-webkit-scrollbar-thumb": {
//                     background: "#e2e8f0",
//                     borderRadius: "2px",
//                   },
//                 }}
//               >
//                 {!d.recentActivity?.length ? (
//                   <Box py={14} textAlign="center">
//                     <Icon
//                       as={FaBell}
//                       fontSize="32px"
//                       color="#e2e8f0"
//                       display="block"
//                       mx="auto"
//                       mb={3}
//                     />
//                     <Text fontSize="13px" color={C.muted}>
//                       No activity yet
//                     </Text>
//                     <Text fontSize="11px" color={C.muted} mt={1}>
//                       Events appear as tests are created, coachings register,
//                       and requests come in
//                     </Text>
//                   </Box>
//                 ) : (
//                   d.recentActivity.map((item, i) => (
//                     <ActivityRow key={i} item={item} />
//                   ))
//                 )}
//               </Box>
//             </Box>

//             {/* Right sidebar */}
//             <Flex direction="column" gap={4}>
//               {/* Pending Actions */}
//               <Box
//                 bg="white"
//                 borderRadius="14px"
//                 border={`1px solid ${C.border}`}
//                 overflow="hidden"
//               >
//                 <Box px={5} py={4} borderBottom="1px solid #f1f5f9">
//                   <Text fontSize="14px" fontWeight={800} color={C.text}>
//                     Pending Actions
//                   </Text>
//                   <Text fontSize="11px" color={C.muted} mt={0.5}>
//                     Items needing your attention
//                   </Text>
//                 </Box>
//                 <Box p={4}>
//                   {[
//                     {
//                       label: "Coaching Approvals",
//                       count: d.pendingCoaching ?? 0,
//                       color: C.purple,
//                       route: "/admin/coaching",
//                     },
//                     {
//                       label: "Test Requests",
//                       count: d.pendingTestRequests ?? 0,
//                       color: C.red,
//                       route: "/admin/test-requests",
//                     },
//                   ].map((item) => (
//                     <Flex
//                       key={item.label}
//                       align="center"
//                       justify="space-between"
//                       py={3.5}
//                       borderBottom="1px solid #f8fafc"
//                       cursor="pointer"
//                       _hover={{ bg: "#f8fafc" }}
//                       px={2}
//                       borderRadius="8px"
//                       transition="background .12s"
//                       onClick={() => navigate(item.route)}
//                     >
//                       <Text fontSize="13px" color={C.text} fontWeight={500}>
//                         {item.label}
//                       </Text>
//                       <Flex align="center" gap={2}>
//                         <Badge
//                           bg={item.count > 0 ? `${item.color}18` : "#f1f5f9"}
//                           color={item.count > 0 ? item.color : C.muted}
//                           borderRadius="full"
//                           fontWeight={800}
//                           fontSize="14px"
//                           px={3}
//                           py={1}
//                         >
//                           {item.count}
//                         </Badge>
//                         <Icon
//                           as={FaArrowRight}
//                           fontSize="10px"
//                           color="#cbd5e1"
//                         />
//                       </Flex>
//                     </Flex>
//                   ))}
//                 </Box>
//               </Box>

//               {/* Pending Coaching list preview */}
//               {d.pendingCoachList?.length > 0 && (
//                 <Box
//                   bg="white"
//                   borderRadius="14px"
//                   border={`1px solid ${C.border}`}
//                   overflow="hidden"
//                 >
//                   <Flex
//                     px={5}
//                     py={4}
//                     borderBottom="1px solid #f1f5f9"
//                     align="center"
//                     justify="space-between"
//                   >
//                     <Text fontSize="14px" fontWeight={800} color={C.text}>
//                       Awaiting Approval
//                     </Text>
//                     <Badge
//                       bg="#fef9c3"
//                       color="#a16207"
//                       borderRadius="full"
//                       fontSize="10px"
//                       fontWeight={700}
//                       px={2}
//                     >
//                       {d.pendingCoaching} pending
//                     </Badge>
//                   </Flex>
//                   {d.pendingCoachList.map((c, i) => (
//                     <Flex
//                       key={c._id || i}
//                       align="center"
//                       gap={3}
//                       px={5}
//                       py={3}
//                       borderBottom={
//                         i < d.pendingCoachList.length - 1
//                           ? "1px solid #f8fafc"
//                           : "none"
//                       }
//                       cursor="pointer"
//                       _hover={{ bg: "#f8fafc" }}
//                       onClick={() => navigate("/admin/coaching")}
//                     >
//                       <Flex
//                         w="32px"
//                         h="32px"
//                         bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
//                         borderRadius="9px"
//                         align="center"
//                         justify="center"
//                         fontSize="13px"
//                         fontWeight={900}
//                         color="white"
//                         flexShrink={0}
//                       >
//                         {c.name?.[0]?.toUpperCase() || "?"}
//                       </Flex>
//                       <Box flex={1} minW={0}>
//                         <Text
//                           fontSize="12px"
//                           fontWeight={700}
//                           color={C.text}
//                           noOfLines={1}
//                         >
//                           {c.name}
//                         </Text>
//                         <Text fontSize="10px" color={C.muted} noOfLines={1}>
//                           {c.city || c.owner?.Email || ""}
//                         </Text>
//                       </Box>
//                       <Icon
//                         as={FaArrowRight}
//                         fontSize="10px"
//                         color="#cbd5e1"
//                         flexShrink={0}
//                       />
//                     </Flex>
//                   ))}
//                   <Box px={4} pb={4} pt={2}>
//                     <Button
//                       w="full"
//                       h="34px"
//                       borderRadius="9px"
//                       bg="#f5f3ff"
//                       color={C.purple}
//                       fontWeight={700}
//                       fontSize="12px"
//                       rightIcon={<Icon as={FaArrowRight} fontSize="10px" />}
//                       onClick={() => navigate("/admin/coaching")}
//                       _hover={{ bg: "#ede9fe" }}
//                     >
//                       Review All
//                     </Button>
//                   </Box>
//                 </Box>
//               )}

//               {/* Recent tests preview */}
//               {d.recentTests?.length > 0 && (
//                 <Box
//                   bg="white"
//                   borderRadius="14px"
//                   border={`1px solid ${C.border}`}
//                   overflow="hidden"
//                 >
//                   <Flex
//                     px={5}
//                     py={4}
//                     borderBottom="1px solid #f1f5f9"
//                     align="center"
//                     justify="space-between"
//                   >
//                     <Text fontSize="14px" fontWeight={800} color={C.text}>
//                       Recent Tests
//                     </Text>
//                     <Button
//                       size="xs"
//                       h="26px"
//                       px={3}
//                       borderRadius="7px"
//                       bg="#f0f7ff"
//                       color={C.blue}
//                       fontWeight={700}
//                       fontSize="11px"
//                       rightIcon={<Icon as={FaArrowRight} fontSize="9px" />}
//                       onClick={() => navigate("/admin/tests")}
//                       _hover={{ bg: "#dbeafe" }}
//                     >
//                       View All
//                     </Button>
//                   </Flex>
//                   {d.recentTests.map((t, i) => (
//                     <Flex
//                       key={t._id || i}
//                       align="center"
//                       gap={3}
//                       px={5}
//                       py={3}
//                       borderBottom={
//                         i < d.recentTests.length - 1
//                           ? "1px solid #f8fafc"
//                           : "none"
//                       }
//                       cursor="pointer"
//                       _hover={{ bg: "#f8fafc" }}
//                       onClick={() => navigate("/admin/tests")}
//                     >
//                       <Flex
//                         w="32px"
//                         h="32px"
//                         bg="#f0f9ff"
//                         borderRadius="9px"
//                         align="center"
//                         justify="center"
//                         flexShrink={0}
//                       >
//                         <Icon
//                           as={FaLayerGroup}
//                           color={C.teal}
//                           fontSize="13px"
//                         />
//                       </Flex>
//                       <Box flex={1} minW={0}>
//                         <Text
//                           fontSize="12px"
//                           fontWeight={700}
//                           color={C.text}
//                           noOfLines={1}
//                         >
//                           {t.title}
//                         </Text>
//                         <Flex gap={1} mt={0.5}>
//                           {t.examType && (
//                             <Text
//                               fontSize="9px"
//                               fontWeight={700}
//                               bg="#eff6ff"
//                               color={C.blue}
//                               px={1.5}
//                               py="1px"
//                               borderRadius="full"
//                             >
//                               {t.examType}
//                             </Text>
//                           )}
//                           <Text fontSize="9px" color={C.muted}>
//                             {t.questions?.length || t.totalQuestions || 0}Q
//                           </Text>
//                         </Flex>
//                       </Box>
//                     </Flex>
//                   ))}
//                 </Box>
//               )}

//               {/* Quick nav */}
//               <Box
//                 bg="white"
//                 borderRadius="14px"
//                 border={`1px solid ${C.border}`}
//                 p={4}
//               >
//                 <Text
//                   fontSize="10px"
//                   fontWeight={700}
//                   color={C.muted}
//                   textTransform="uppercase"
//                   letterSpacing="1.2px"
//                   mb={3}
//                 >
//                   Quick Navigate
//                 </Text>
//                 {[
//                   {
//                     label: "All Tests",
//                     route: "/admin/tests",
//                     icon: FaLayerGroup,
//                     color: C.teal,
//                   },
//                   {
//                     label: "Coaching Mgmt",
//                     route: "/admin/coaching",
//                     icon: FaChalkboardTeacher,
//                     color: C.purple,
//                   },
//                   {
//                     label: "Test Requests",
//                     route: "/admin/test-requests",
//                     icon: FaClipboardList,
//                     color: C.red,
//                   },
//                 ].map((link) => (
//                   <Flex
//                     key={link.route}
//                     align="center"
//                     gap={3}
//                     py={2.5}
//                     px={2}
//                     borderRadius="8px"
//                     cursor="pointer"
//                     _hover={{ bg: "#f8fafc" }}
//                     transition="background .12s"
//                     onClick={() => navigate(link.route)}
//                   >
//                     <Flex
//                       w="28px"
//                       h="28px"
//                       bg={`${link.color}14`}
//                       borderRadius="8px"
//                       align="center"
//                       justify="center"
//                       flexShrink={0}
//                     >
//                       <Icon as={link.icon} color={link.color} fontSize="12px" />
//                     </Flex>
//                     <Text
//                       fontSize="13px"
//                       color={C.text}
//                       fontWeight={500}
//                       flex={1}
//                     >
//                       {link.label}
//                     </Text>
//                     <Icon as={FaArrowRight} fontSize="10px" color="#cbd5e1" />
//                   </Flex>
//                 ))}
//               </Box>
//             </Flex>
//           </Grid>
//         </>
//       )}
//       <style>{`@keyframes dashSpin { to { transform: rotate(360deg); } }`}</style>
//     </AdminNavPage>
//   );
// }










/**
 * AdminDashboardPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Uses ONLY proven existing backend endpoints.
 * NO custom /admin/dashboard route needed.
 *
 * Endpoints used (all confirmed working):
 *   GET /admin/coaching/requests              → coaching count + all status breakdown
 *   GET /admin/coaching/requests?status=pending
 *   GET /test-requests/admin/all?status=pending
 *   GET /test-requests/admin/all?status=completed
 *   GET /tests?limit=8                        → recent tests for activity feed
 *   GET /coaching/students                    → students who took tests
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Grid,
  Spinner,
  Button,
  Badge,
  useToast,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaLayerGroup,
  FaChalkboardTeacher,
  FaClipboardList,
  FaTrophy,
  FaArrowRight,
  FaSyncAlt,
  FaFire,
  FaBell,
  FaCheckCircle,
  FaHourglass,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";
import { socket, joinAdminRoom } from "../services/socket";
import AdminNavPage from "./AdminNavPage";

const C = {
  blue: "#2563eb",
  green: "#16a34a",
  red: "#dc2626",
  amber: "#d97706",
  purple: "#7c3aed",
  teal: "#0d9488",
  muted: "#64748b",
  text: "#0f172a",
  border: "#e2e8f0",
};

const fmt = (d) =>
  d
    ? new Date(d).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "—";

/* ── Stat card ── */
function StatCard({ icon, label, value, sub, color, onClick }) {
  return (
    <Box
      bg="white"
      borderRadius="14px"
      border={`1px solid ${C.border}`}
      p={5}
      cursor={onClick ? "pointer" : "default"}
      onClick={onClick}
      transition="all .18s"
      position="relative"
      overflow="hidden"
      _hover={
        onClick
          ? {
              boxShadow: "0 6px 24px rgba(0,0,0,.09)",
              transform: "translateY(-2px)",
            }
          : {}
      }
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        w="3px"
        h="100%"
        bg={color}
        borderRadius="14px 0 0 14px"
      />
      <Flex align="flex-start" justify="space-between" gap={3}>
        <Box>
          <Text
            fontSize="10px"
            fontWeight={700}
            color={C.muted}
            textTransform="uppercase"
            letterSpacing=".8px"
            mb={1.5}
          >
            {label}
          </Text>
          <Text
            fontSize="34px"
            fontWeight={900}
            color={C.text}
            lineHeight="1"
            letterSpacing="-2px"
          >
            {value ?? 0}
          </Text>
          {sub && (
            <Text fontSize="11px" color={C.muted} mt={1.5} fontWeight={500}>
              {sub}
            </Text>
          )}
        </Box>
        <Flex
          w="44px"
          h="44px"
          bg={`${color}18`}
          borderRadius="12px"
          align="center"
          justify="center"
          flexShrink={0}
        >
          <Icon as={icon} color={color} fontSize="17px" />
        </Flex>
      </Flex>
    </Box>
  );
}

/* ── Activity row ── */
function ActivityRow({ item }) {
  const typeMap = {
    test: { icon: FaLayerGroup, color: C.teal, label: "Test" },
    coaching: { icon: FaChalkboardTeacher, color: C.purple, label: "Coaching" },
    request: { icon: FaClipboardList, color: C.red, label: "Request" },
    completed: { icon: FaCheckCircle, color: C.green, label: "Delivered" },
  };
  const t = typeMap[item.type] || {
    icon: FaBell,
    color: C.muted,
    label: "Event",
  };
  return (
    <Flex
      align="center"
      gap={3}
      py={3}
      borderBottom="1px solid #f1f5f9"
      _last={{ borderBottom: "none" }}
    >
      <Flex
        w="34px"
        h="34px"
        bg={`${t.color}14`}
        borderRadius="10px"
        align="center"
        justify="center"
        flexShrink={0}
      >
        <Icon as={t.icon} color={t.color} fontSize="13px" />
      </Flex>
      <Box flex={1} minW={0}>
        <Text fontSize="13px" fontWeight={600} color={C.text} noOfLines={1}>
          {item.message}
        </Text>
        <Text fontSize="11px" color={C.muted}>
          {fmt(item.createdAt)}
        </Text>
      </Box>
      <Badge
        bg={`${t.color}14`}
        color={t.color}
        borderRadius="full"
        fontSize="9px"
        fontWeight={700}
        px={2}
        flexShrink={0}
      >
        {t.label}
      </Badge>
    </Flex>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const [data, setData] = useState(null); // null = not loaded yet
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /* safe fetch - returns null on error, never throws */
  const safe = async (path) => {
    try {
      return await apiFetch(path);
    } catch (e) {
      console.warn("[Dashboard] failed:", path, e.message);
      return null;
    }
  };

  /* extract array from various response shapes the backend might return */
  const toArr = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };

  /* extract total count hint if backend sends pagination meta */
  const totalHint = (res, arr) =>
    res?.total ?? res?.totalCount ?? res?.count ?? arr.length;

  const load = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Single call to the dedicated dashboard endpoint
      const dashRes = await safe("/admin/dashboard");
      const dash = dashRes?.data ?? dashRes ?? {};

      // Also fetch pending lists for the quick-action panels
      const [pendingCoachRes, pendingReqRes] = await Promise.all([
        safe("/admin/coaching/requests?status=pending"),
        safe("/test-requests/admin/all?status=pending"),
      ]);

      const pendingCoach = toArr(pendingCoachRes);
      const pendingReqs = toArr(pendingReqRes);

      // Build activity feed from activityByDay + topTests returned by dashboard
      const activity = [];
      (dash.topTests || []).slice(0, 5).forEach((t) =>
        activity.push({
          type: "test",
          message: `"${t.testTitle}" — ${t.attempts} attempts`,
          createdAt: null,
        }),
      );
      pendingCoach.slice(0, 4).forEach((c) =>
        activity.push({
          type: "coaching",
          message: `"${c.name}" submitted a coaching registration`,
          createdAt: c.createdAt,
        }),
      );
      pendingReqs.slice(0, 4).forEach((r) =>
        activity.push({
          type: "request",
          message: `Test request: "${r.title}" from ${r.coachingId?.name || "coaching"}`,
          createdAt: r.createdAt,
        }),
      );
      activity.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );

      setData({
        coachingCount: dash.coachings?.total ?? 0,
        approvedCoaching: (dash.coachings?.total ?? 0) - (dash.coachings?.pending ?? 0),
        pendingCoaching: dash.coachings?.pending ?? pendingCoach.length,
        pendingTestRequests: dash.requests?.pending ?? pendingReqs.length,
        completedRequests: dash.requests?.total ?? 0,
        totalStudents: dash.users?.total ?? 0,
        onlineUsers: dash.users?.online ?? 0,
        totalTests: dash.tests?.total ?? 0,
        totalResults: dash.tests?.totalResults ?? 0,
        resultsLast24h: dash.tests?.resultsLast24h ?? 0,
        activityByDay: dash.activityByDay ?? [],
        pendingCoachList: pendingCoach.slice(0, 5),
        pendingReqList: pendingReqs.slice(0, 5),
        recentActivity: activity.slice(0, 20),
      });
    } catch (e) {
      console.error("[Dashboard] load error:", e);
      setError(e.message);
      toast({
        title: "Dashboard error: " + e.message,
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const cleanup = joinAdminRoom();
    const refresh = () => load(true);
    socket.on("coaching:new-request", refresh);
    socket.on("test-request:new", refresh);
    socket.on("test:attempted", refresh);
    return () => {
      cleanup();
      ["coaching:new-request", "test-request:new", "test:attempted"].forEach(
        (ev) => socket.off(ev, refresh),
      );
    };
  }, [load]);

  const d = data || {};

  const CARDS = [
    {
      icon: FaChalkboardTeacher,
      label: "Coaching Centres",
      value: d.coachingCount,
      sub: `${d.approvedCoaching ?? 0} approved`,
      color: C.purple,
      route: "/admin/coaching",
    },
    {
      icon: FaHourglass,
      label: "Pending Coaching",
      value: d.pendingCoaching,
      sub: "awaiting your approval",
      color: C.amber,
      route: "/admin/coaching",
    },
    {
      icon: FaLayerGroup,
      label: "Tests on Platform",
      value: d.totalTests,
      sub: "across all coachings",
      color: C.teal,
      route: "/admin/tests",
    },
    {
      icon: FaClipboardList,
      label: "Pending Requests",
      value: d.pendingTestRequests,
      sub: "test creation requests",
      color: C.red,
      route: "/admin/test-requests",
    },
    {
      icon: FaCheckCircle,
      label: "Delivered Tests",
      value: d.completedRequests,
      sub: "completed test requests",
      color: C.green,
      route: "/admin/test-requests",
    },
    {
      icon: FaUsers,
      label: "Total Students",
      value: d.totalStudents,
      sub: `${d.onlineUsers ?? 0} online now`,
      color: C.blue,
      route: "/admin/users",
    },
    {
      icon: FaTrophy,
      label: "Results Today",
      value: d.resultsLast24h ?? 0,
      sub: `${d.totalResults ?? 0} total all-time`,
      color: C.teal,
      route: "/admin/tests",
    },
  ];

  return (
    <AdminNavPage title="Dashboard" subtitle="Admin Panel">
      {/* Refresh */}
      <Flex justify="flex-end" mb={5}>
        <Button
          size="sm"
          h="36px"
          px={4}
          borderRadius="9px"
          leftIcon={
            <Icon
              as={FaSyncAlt}
              fontSize="11px"
              style={
                refreshing ? { animation: "dashSpin 0.8s linear infinite" } : {}
              }
            />
          }
          onClick={() => load(true)}
          isLoading={refreshing}
          loadingText="Refreshing…"
          bg="white"
          border={`1px solid ${C.border}`}
          color={C.muted}
          fontWeight={600}
          fontSize="13px"
          _hover={{ bg: "#f1f5f9" }}
        >
          Refresh
        </Button>
      </Flex>

      {loading ? (
        <Flex
          justify="center"
          align="center"
          direction="column"
          gap={4}
          minH="350px"
        >
          <Spinner size="xl" color={C.purple} thickness="4px" speed="0.7s" />
          <Text fontSize="13px" color={C.muted} fontWeight={500}>
            Loading dashboard…
          </Text>
        </Flex>
      ) : error ? (
        <Box
          py={16}
          textAlign="center"
          bg="white"
          borderRadius="14px"
          border={`1px solid ${C.border}`}
        >
          <Text fontSize="40px" mb={3}>
            ⚠️
          </Text>
          <Text fontSize="16px" fontWeight={700} color={C.red} mb={2}>
            Could not load dashboard
          </Text>
          <Text fontSize="13px" color={C.muted} mb={6}>
            {error}
          </Text>
          <Button
            onClick={() => load()}
            bg={C.purple}
            color="white"
            borderRadius="10px"
            fontWeight={700}
            px={6}
          >
            Try Again
          </Button>
        </Box>
      ) : (
        <>
          {/* Stat cards */}
          <Grid
            templateColumns={{ base: "1fr 1fr", md: "repeat(3,1fr)" }}
            gap={4}
            mb={6}
          >
            {CARDS.map((sc) => (
              <StatCard
                key={sc.label}
                {...sc}
                onClick={sc.route ? () => navigate(sc.route) : undefined}
              />
            ))}
          </Grid>

          {/* Activity + sidebar */}
          <Grid templateColumns={{ base: "1fr", lg: "1fr 340px" }} gap={5}>
            {/* Recent Activity */}
            <Box
              bg="white"
              borderRadius="14px"
              border={`1px solid ${C.border}`}
              overflow="hidden"
            >
              <Flex
                px={5}
                py={4}
                borderBottom="1px solid #f1f5f9"
                align="center"
                justify="space-between"
              >
                <Flex align="center" gap={2}>
                  <Icon as={FaFire} color={C.amber} fontSize="14px" />
                  <Text fontSize="15px" fontWeight={800} color={C.text}>
                    Recent Activity
                  </Text>
                </Flex>
                <Text fontSize="11px" color={C.muted}>
                  {d.recentActivity?.length ?? 0} events
                </Text>
              </Flex>
              <Box
                px={5}
                py={2}
                maxH="420px"
                overflowY="auto"
                css={{
                  "&::-webkit-scrollbar": { width: "3px" },
                  "&::-webkit-scrollbar-thumb": {
                    background: "#e2e8f0",
                    borderRadius: "2px",
                  },
                }}
              >
                {!d.recentActivity?.length ? (
                  <Box py={14} textAlign="center">
                    <Icon
                      as={FaBell}
                      fontSize="32px"
                      color="#e2e8f0"
                      display="block"
                      mx="auto"
                      mb={3}
                    />
                    <Text fontSize="13px" color={C.muted}>
                      No activity yet
                    </Text>
                    <Text fontSize="11px" color={C.muted} mt={1}>
                      Events appear as tests are created, coachings register,
                      and requests come in
                    </Text>
                  </Box>
                ) : (
                  d.recentActivity.map((item, i) => (
                    <ActivityRow key={i} item={item} />
                  ))
                )}
              </Box>
            </Box>

            {/* Right sidebar */}
            <Flex direction="column" gap={4}>
              {/* Pending Actions */}
              <Box
                bg="white"
                borderRadius="14px"
                border={`1px solid ${C.border}`}
                overflow="hidden"
              >
                <Box px={5} py={4} borderBottom="1px solid #f1f5f9">
                  <Text fontSize="14px" fontWeight={800} color={C.text}>
                    Pending Actions
                  </Text>
                  <Text fontSize="11px" color={C.muted} mt={0.5}>
                    Items needing your attention
                  </Text>
                </Box>
                <Box p={4}>
                  {[
                    {
                      label: "Coaching Approvals",
                      count: d.pendingCoaching ?? 0,
                      color: C.purple,
                      route: "/admin/coaching",
                    },
                    {
                      label: "Test Requests",
                      count: d.pendingTestRequests ?? 0,
                      color: C.red,
                      route: "/admin/test-requests",
                    },
                  ].map((item) => (
                    <Flex
                      key={item.label}
                      align="center"
                      justify="space-between"
                      py={3.5}
                      borderBottom="1px solid #f8fafc"
                      cursor="pointer"
                      _hover={{ bg: "#f8fafc" }}
                      px={2}
                      borderRadius="8px"
                      transition="background .12s"
                      onClick={() => navigate(item.route)}
                    >
                      <Text fontSize="13px" color={C.text} fontWeight={500}>
                        {item.label}
                      </Text>
                      <Flex align="center" gap={2}>
                        <Badge
                          bg={item.count > 0 ? `${item.color}18` : "#f1f5f9"}
                          color={item.count > 0 ? item.color : C.muted}
                          borderRadius="full"
                          fontWeight={800}
                          fontSize="14px"
                          px={3}
                          py={1}
                        >
                          {item.count}
                        </Badge>
                        <Icon
                          as={FaArrowRight}
                          fontSize="10px"
                          color="#cbd5e1"
                        />
                      </Flex>
                    </Flex>
                  ))}
                </Box>
              </Box>

              {/* Pending Coaching list preview */}
              {d.pendingCoachList?.length > 0 && (
                <Box
                  bg="white"
                  borderRadius="14px"
                  border={`1px solid ${C.border}`}
                  overflow="hidden"
                >
                  <Flex
                    px={5}
                    py={4}
                    borderBottom="1px solid #f1f5f9"
                    align="center"
                    justify="space-between"
                  >
                    <Text fontSize="14px" fontWeight={800} color={C.text}>
                      Awaiting Approval
                    </Text>
                    <Badge
                      bg="#fef9c3"
                      color="#a16207"
                      borderRadius="full"
                      fontSize="10px"
                      fontWeight={700}
                      px={2}
                    >
                      {d.pendingCoaching} pending
                    </Badge>
                  </Flex>
                  {d.pendingCoachList.map((c, i) => (
                    <Flex
                      key={c._id || i}
                      align="center"
                      gap={3}
                      px={5}
                      py={3}
                      borderBottom={
                        i < d.pendingCoachList.length - 1
                          ? "1px solid #f8fafc"
                          : "none"
                      }
                      cursor="pointer"
                      _hover={{ bg: "#f8fafc" }}
                      onClick={() => navigate("/admin/coaching")}
                    >
                      <Flex
                        w="32px"
                        h="32px"
                        bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
                        borderRadius="9px"
                        align="center"
                        justify="center"
                        fontSize="13px"
                        fontWeight={900}
                        color="white"
                        flexShrink={0}
                      >
                        {c.name?.[0]?.toUpperCase() || "?"}
                      </Flex>
                      <Box flex={1} minW={0}>
                        <Text
                          fontSize="12px"
                          fontWeight={700}
                          color={C.text}
                          noOfLines={1}
                        >
                          {c.name}
                        </Text>
                        <Text fontSize="10px" color={C.muted} noOfLines={1}>
                          {c.city || c.owner?.Email || ""}
                        </Text>
                      </Box>
                      <Icon
                        as={FaArrowRight}
                        fontSize="10px"
                        color="#cbd5e1"
                        flexShrink={0}
                      />
                    </Flex>
                  ))}
                  <Box px={4} pb={4} pt={2}>
                    <Button
                      w="full"
                      h="34px"
                      borderRadius="9px"
                      bg="#f5f3ff"
                      color={C.purple}
                      fontWeight={700}
                      fontSize="12px"
                      rightIcon={<Icon as={FaArrowRight} fontSize="10px" />}
                      onClick={() => navigate("/admin/coaching")}
                      _hover={{ bg: "#ede9fe" }}
                    >
                      Review All
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Recent tests preview */}
              {d.recentTests?.length > 0 && (
                <Box
                  bg="white"
                  borderRadius="14px"
                  border={`1px solid ${C.border}`}
                  overflow="hidden"
                >
                  <Flex
                    px={5}
                    py={4}
                    borderBottom="1px solid #f1f5f9"
                    align="center"
                    justify="space-between"
                  >
                    <Text fontSize="14px" fontWeight={800} color={C.text}>
                      Recent Tests
                    </Text>
                    <Button
                      size="xs"
                      h="26px"
                      px={3}
                      borderRadius="7px"
                      bg="#f0f7ff"
                      color={C.blue}
                      fontWeight={700}
                      fontSize="11px"
                      rightIcon={<Icon as={FaArrowRight} fontSize="9px" />}
                      onClick={() => navigate("/admin/tests")}
                      _hover={{ bg: "#dbeafe" }}
                    >
                      View All
                    </Button>
                  </Flex>
                  {d.recentTests.map((t, i) => (
                    <Flex
                      key={t._id || i}
                      align="center"
                      gap={3}
                      px={5}
                      py={3}
                      borderBottom={
                        i < d.recentTests.length - 1
                          ? "1px solid #f8fafc"
                          : "none"
                      }
                      cursor="pointer"
                      _hover={{ bg: "#f8fafc" }}
                      onClick={() => navigate("/admin/tests")}
                    >
                      <Flex
                        w="32px"
                        h="32px"
                        bg="#f0f9ff"
                        borderRadius="9px"
                        align="center"
                        justify="center"
                        flexShrink={0}
                      >
                        <Icon
                          as={FaLayerGroup}
                          color={C.teal}
                          fontSize="13px"
                        />
                      </Flex>
                      <Box flex={1} minW={0}>
                        <Text
                          fontSize="12px"
                          fontWeight={700}
                          color={C.text}
                          noOfLines={1}
                        >
                          {t.title}
                        </Text>
                        <Flex gap={1} mt={0.5}>
                          {t.examType && (
                            <Text
                              fontSize="9px"
                              fontWeight={700}
                              bg="#eff6ff"
                              color={C.blue}
                              px={1.5}
                              py="1px"
                              borderRadius="full"
                            >
                              {t.examType}
                            </Text>
                          )}
                          <Text fontSize="9px" color={C.muted}>
                            {t.questions?.length || t.totalQuestions || 0}Q
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                  ))}
                </Box>
              )}

              {/* Quick nav */}
              <Box
                bg="white"
                borderRadius="14px"
                border={`1px solid ${C.border}`}
                p={4}
              >
                <Text
                  fontSize="10px"
                  fontWeight={700}
                  color={C.muted}
                  textTransform="uppercase"
                  letterSpacing="1.2px"
                  mb={3}
                >
                  Quick Navigate
                </Text>
                {[
                  {
                    label: "All Tests",
                    route: "/admin/tests",
                    icon: FaLayerGroup,
                    color: C.teal,
                  },
                  {
                    label: "Coaching Mgmt",
                    route: "/admin/coaching",
                    icon: FaChalkboardTeacher,
                    color: C.purple,
                  },
                  {
                    label: "Test Requests",
                    route: "/admin/test-requests",
                    icon: FaClipboardList,
                    color: C.red,
                  },
                ].map((link) => (
                  <Flex
                    key={link.route}
                    align="center"
                    gap={3}
                    py={2.5}
                    px={2}
                    borderRadius="8px"
                    cursor="pointer"
                    _hover={{ bg: "#f8fafc" }}
                    transition="background .12s"
                    onClick={() => navigate(link.route)}
                  >
                    <Flex
                      w="28px"
                      h="28px"
                      bg={`${link.color}14`}
                      borderRadius="8px"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      <Icon as={link.icon} color={link.color} fontSize="12px" />
                    </Flex>
                    <Text
                      fontSize="13px"
                      color={C.text}
                      fontWeight={500}
                      flex={1}
                    >
                      {link.label}
                    </Text>
                    <Icon as={FaArrowRight} fontSize="10px" color="#cbd5e1" />
                  </Flex>
                ))}
              </Box>
            </Flex>
          </Grid>
        </>
      )}
      <style>{`@keyframes dashSpin { to { transform: rotate(360deg); } }`}</style>
    </AdminNavPage>
  );
}