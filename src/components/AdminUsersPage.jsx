// /**
//  * AdminUsersPage.jsx
//  * ─────────────────────────────────────────────────────────────────────────────
//  * Shows students who have attempted tests — using the PROVEN endpoint:
//  *   GET /coaching/students  → returns students with test stats
//  *
//  * Also shows coaching owners from:
//  *   GET /admin/coaching/requests  → has owner field with Name/Email
//  *
//  * Note: There is no /admin/users endpoint on this backend yet.
//  * This page aggregates users from existing endpoints.
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
//   Avatar,
//   useToast,
//   Grid,
//   InputGroup,
//   InputLeftElement,
// } from "@chakra-ui/react";
// import {
//   FaSearch,
//   FaUsers,
//   FaSyncAlt,
//   FaChalkboardTeacher,
//   FaClock,
//   FaTrophy,
//   FaCalendarAlt,
//   FaChartBar,
//   FaLayerGroup,
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

// function daysSince(d) {
//   if (!d) return null;
//   return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
// }

// function DaysChip({ d }) {
//   const days = daysSince(d);
//   if (days === null)
//     return (
//       <Text fontSize="11px" color={C.muted}>
//         —
//       </Text>
//     );
//   const color =
//     days === 0 ? C.green : days <= 3 ? C.amber : days <= 14 ? C.muted : C.red;
//   const label =
//     days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`;
//   return (
//     <Text fontSize="11px" fontWeight={700} color={color}>
//       {label}
//     </Text>
//   );
// }

// /* ── Stat card ── */
// function MiniCard({ icon, label, value, color }) {
//   return (
//     <Box bg="white" borderRadius="12px" border={`1px solid ${C.border}`} p={4}>
//       <Flex align="center" gap={2} mb={1}>
//         <Flex
//           w="30px"
//           h="30px"
//           bg={`${color}14`}
//           borderRadius="8px"
//           align="center"
//           justify="center"
//         >
//           <Icon as={icon} color={color} fontSize="13px" />
//         </Flex>
//         <Text
//           fontSize="10px"
//           fontWeight={700}
//           color={C.muted}
//           textTransform="uppercase"
//           letterSpacing=".7px"
//         >
//           {label}
//         </Text>
//       </Flex>
//       <Text
//         fontSize="28px"
//         fontWeight={900}
//         color={C.text}
//         lineHeight="1"
//         letterSpacing="-1.5px"
//       >
//         {value ?? 0}
//       </Text>
//     </Box>
//   );
// }

// export default function AdminUsersPage() {
//   const toast = useToast();

//   const [students, setStudents] = useState([]);
//   const [owners, setOwners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [tab, setTab] = useState("students"); // "students" | "owners"
//   const [error, setError] = useState(null);

//   const safe = async (path) => {
//     try {
//       return await apiFetch(path);
//     } catch (e) {
//       console.warn("[Users] failed:", path, e.message);
//       return null;
//     }
//   };

//   const toArr = (res) => {
//     if (!res) return [];
//     if (Array.isArray(res)) return res;
//     if (Array.isArray(res.data)) return res.data;
//     return [];
//   };

//   const load = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const [studentsRes, coachingRes] = await Promise.all([
//         safe("/coaching/students"),
//         safe("/admin/coaching/requests"),
//       ]);

//       setStudents(toArr(studentsRes));

//       // Extract unique owners from coaching registrations
//       const allCoaching = toArr(coachingRes);
//       const ownerMap = new Map();
//       allCoaching.forEach((c) => {
//         if (c.owner?._id && !ownerMap.has(c.owner._id)) {
//           ownerMap.set(c.owner._id, {
//             _id: c.owner._id,
//             Name: c.owner.Name,
//             Email: c.owner.Email,
//             Phone: c.owner.Phone,
//             coachingName: c.name,
//             coachingStatus: c.status,
//             createdAt: c.createdAt,
//           });
//         }
//       });
//       setOwners(Array.from(ownerMap.values()));
//     } catch (e) {
//       setError(e.message);
//       toast({
//         title: "Failed to load users: " + e.message,
//         status: "error",
//         duration: 4000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     load();
//   }, [load]);

//   const filtered = (tab === "students" ? students : owners).filter((u) => {
//     if (!search.trim()) return true;
//     const q = search.toLowerCase();
//     return (
//       (u.Name || u.name || "").toLowerCase().includes(q) ||
//       (u.Email || u.email || "").toLowerCase().includes(q) ||
//       (u.coachingName || "").toLowerCase().includes(q)
//     );
//   });

//   return (
//     <AdminNavPage title="Users" subtitle="Admin Panel">
//       {/* Summary cards */}
//       <Grid
//         templateColumns={{ base: "1fr 1fr", md: "repeat(4,1fr)" }}
//         gap={4}
//         mb={6}
//       >
//         <MiniCard
//           icon={FaUsers}
//           label="Students"
//           value={students.length}
//           color={C.blue}
//         />
//         <MiniCard
//           icon={FaChalkboardTeacher}
//           label="Coaching Owners"
//           value={owners.length}
//           color={C.purple}
//         />
//         <MiniCard
//           icon={FaTrophy}
//           label="Avg Tests/Student"
//           value={
//             students.length
//               ? Math.round(
//                   students.reduce((s, u) => s + (u.totalTests || 0), 0) /
//                     students.length,
//                 )
//               : 0
//           }
//           color={C.amber}
//         />
//         <MiniCard
//           icon={FaChartBar}
//           label="Avg Score"
//           value={
//             students.length
//               ? `${Math.round(students.reduce((s, u) => s + (u.avgPercentage || 0), 0) / students.length)}%`
//               : "—"
//           }
//           color={C.green}
//         />
//       </Grid>

//       {/* Tab switcher + search */}
//       <Flex gap={3} mb={5} flexWrap={{ base: "wrap", md: "nowrap" }}>
//         <Flex
//           bg="white"
//           border={`1px solid ${C.border}`}
//           borderRadius="10px"
//           p="4px"
//           gap={1}
//           flexShrink={0}
//         >
//           {[
//             { key: "students", label: "Students", icon: FaUsers },
//             {
//               key: "owners",
//               label: "Coaching Owners",
//               icon: FaChalkboardTeacher,
//             },
//           ].map((t) => (
//             <Button
//               key={t.key}
//               size="sm"
//               h="34px"
//               px={4}
//               borderRadius="8px"
//               bg={tab === t.key ? C.purple : "transparent"}
//               color={tab === t.key ? "white" : C.muted}
//               fontWeight={tab === t.key ? 700 : 500}
//               fontSize="12px"
//               leftIcon={<Icon as={t.icon} fontSize="11px" />}
//               onClick={() => setTab(t.key)}
//               _hover={tab === t.key ? {} : { bg: "#f1f5f9" }}
//             >
//               {t.label}
//             </Button>
//           ))}
//         </Flex>

//         <InputGroup flex={1} minW="200px">
//           <InputLeftElement pointerEvents="none" h="full" pl={3}>
//             <Icon as={FaSearch} color="gray.400" fontSize="12px" />
//           </InputLeftElement>
//           <Input
//             placeholder={`Search ${tab}…`}
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             bg="white"
//             borderRadius="10px"
//             h="42px"
//             fontSize="13px"
//             pl="38px"
//             border={`1px solid ${C.border}`}
//             _focus={{ borderColor: C.blue, boxShadow: `0 0 0 1px ${C.blue}` }}
//           />
//         </InputGroup>

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
//           Refresh
//         </Button>
//       </Flex>

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
//       ) : filtered.length === 0 ? (
//         <Box
//           py={16}
//           textAlign="center"
//           bg="white"
//           borderRadius="14px"
//           border={`1px solid ${C.border}`}
//         >
//           <Icon
//             as={FaUsers}
//             fontSize="48px"
//             color="#e2e8f0"
//             display="block"
//             mx="auto"
//             mb={4}
//           />
//           <Text fontSize="15px" fontWeight={700} color={C.muted}>
//             {search ? "No results match your search" : `No ${tab} found yet`}
//           </Text>
//         </Box>
//       ) : tab === "students" ? (
//         /* ── Students table ── */
//         <Box
//           bg="white"
//           borderRadius="14px"
//           border={`1px solid ${C.border}`}
//           overflow="hidden"
//         >
//           <Flex
//             px={5}
//             py={3}
//             bg={C.bg}
//             borderBottom={`1px solid ${C.border}`}
//             display={{ base: "none", md: "flex" }}
//           >
//             {[
//               ["Student", 3],
//               ["Email", 3],
//               ["Tests Taken", 1.5],
//               ["Avg Score", 1.5],
//               ["Last Attempt", 2],
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
//           {filtered.map((u, i) => (
//             <Flex
//               key={u._id || i}
//               px={5}
//               py={3.5}
//               align="center"
//               gap={3}
//               borderBottom={
//                 i < filtered.length - 1 ? "1px solid #f1f5f9" : "none"
//               }
//               _hover={{ bg: "#f8faff" }}
//               transition="background .12s"
//               flexWrap={{ base: "wrap", md: "nowrap" }}
//             >
//               <Flex flex={3} align="center" gap={2.5} minW={0}>
//                 <Avatar
//                   size="sm"
//                   name={u.Name}
//                   bg={C.blue}
//                   color="white"
//                   fontSize="11px"
//                   fontWeight={800}
//                   flexShrink={0}
//                 />
//                 <Box minW={0}>
//                   <Text
//                     fontSize="13px"
//                     fontWeight={700}
//                     color={C.text}
//                     noOfLines={1}
//                   >
//                     {u.Name || "—"}
//                   </Text>
//                 </Box>
//               </Flex>
//               <Text
//                 flex={3}
//                 fontSize="12px"
//                 color={C.muted}
//                 noOfLines={1}
//                 display={{ base: "none", md: "block" }}
//               >
//                 {u.Email}
//               </Text>
//               <Box flex={1.5}>
//                 <Text fontSize="13px" fontWeight={700} color={C.blue}>
//                   {u.totalTests ?? 0}
//                 </Text>
//               </Box>
//               <Box flex={1.5}>
//                 {u.avgPercentage != null ? (
//                   <Badge
//                     bg={u.avgPercentage >= 40 ? "#dcfce7" : "#fee2e2"}
//                     color={u.avgPercentage >= 40 ? C.green : C.red}
//                     borderRadius="full"
//                     fontWeight={700}
//                     fontSize="11px"
//                     px={2}
//                   >
//                     {u.avgPercentage}%
//                   </Badge>
//                 ) : (
//                   <Text fontSize="11px" color={C.muted}>
//                     —
//                   </Text>
//                 )}
//               </Box>
//               <Box flex={2} display={{ base: "none", md: "block" }}>
//                 <DaysChip d={u.lastAttempt} />
//                 <Text fontSize="10px" color={C.muted}>
//                   {fmtDate(u.lastAttempt)}
//                 </Text>
//               </Box>
//             </Flex>
//           ))}
//         </Box>
//       ) : (
//         /* ── Coaching owners table ── */
//         <Box
//           bg="white"
//           borderRadius="14px"
//           border={`1px solid ${C.border}`}
//           overflow="hidden"
//         >
//           <Flex
//             px={5}
//             py={3}
//             bg={C.bg}
//             borderBottom={`1px solid ${C.border}`}
//             display={{ base: "none", md: "flex" }}
//           >
//             {[
//               ["Owner", 3],
//               ["Email", 3],
//               ["Coaching", 2.5],
//               ["Status", 1.5],
//               ["Registered", 2],
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
//           {filtered.map((o, i) => {
//             const statusCfg = {
//               approved: { bg: "#dcfce7", color: C.green, label: "Approved" },
//               pending: { bg: "#fef9c3", color: "#a16207", label: "Pending" },
//               rejected: { bg: "#fee2e2", color: C.red, label: "Rejected" },
//             };
//             const s = statusCfg[o.coachingStatus] || statusCfg.pending;
//             return (
//               <Flex
//                 key={o._id || i}
//                 px={5}
//                 py={3.5}
//                 align="center"
//                 gap={3}
//                 borderBottom={
//                   i < filtered.length - 1 ? "1px solid #f1f5f9" : "none"
//                 }
//                 _hover={{ bg: "#f8faff" }}
//                 transition="background .12s"
//                 flexWrap={{ base: "wrap", md: "nowrap" }}
//               >
//                 <Flex flex={3} align="center" gap={2.5} minW={0}>
//                   <Avatar
//                     size="sm"
//                     name={o.Name || o.Email}
//                     bg={C.purple}
//                     color="white"
//                     fontSize="11px"
//                     fontWeight={800}
//                     flexShrink={0}
//                   />
//                   <Text
//                     fontSize="13px"
//                     fontWeight={700}
//                     color={C.text}
//                     noOfLines={1}
//                   >
//                     {o.Name || "—"}
//                   </Text>
//                 </Flex>
//                 <Text
//                   flex={3}
//                   fontSize="12px"
//                   color={C.muted}
//                   noOfLines={1}
//                   display={{ base: "none", md: "block" }}
//                 >
//                   {o.Email}
//                 </Text>
//                 <Text
//                   flex={2.5}
//                   fontSize="13px"
//                   fontWeight={600}
//                   color={C.text}
//                   noOfLines={1}
//                   display={{ base: "none", md: "block" }}
//                 >
//                   {o.coachingName || "—"}
//                 </Text>
//                 <Box flex={1.5}>
//                   <Badge
//                     bg={s.bg}
//                     color={s.color}
//                     borderRadius="full"
//                     fontSize="10px"
//                     fontWeight={700}
//                     px={2.5}
//                   >
//                     {s.label}
//                   </Badge>
//                 </Box>
//                 <Box flex={2} display={{ base: "none", md: "block" }}>
//                   <Text fontSize="11px" color={C.muted}>
//                     {fmtDate(o.createdAt)}
//                   </Text>
//                 </Box>
//               </Flex>
//             );
//           })}
//         </Box>
//       )}
//     </AdminNavPage>
//   );
// }













/**
 * AdminUsersPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shows students who have attempted tests — using the PROVEN endpoint:
 *   GET /coaching/students  → returns students with test stats
 *
 * Also shows coaching owners from:
 *   GET /admin/coaching/requests  → has owner field with Name/Email
 *
 * Note: There is no /admin/users endpoint on this backend yet.
 * This page aggregates users from existing endpoints.
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
  Avatar,
  useToast,
  Grid,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import {
  FaSearch,
  FaUsers,
  FaSyncAlt,
  FaChalkboardTeacher,
  FaClock,
  FaTrophy,
  FaCalendarAlt,
  FaChartBar,
  FaLayerGroup,
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

function daysSince(d) {
  if (!d) return null;
  return Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
}

function DaysChip({ d }) {
  const days = daysSince(d);
  if (days === null)
    return (
      <Text fontSize="11px" color={C.muted}>
        —
      </Text>
    );
  const color =
    days === 0 ? C.green : days <= 3 ? C.amber : days <= 14 ? C.muted : C.red;
  const label =
    days === 0 ? "Today" : days === 1 ? "Yesterday" : `${days}d ago`;
  return (
    <Text fontSize="11px" fontWeight={700} color={color}>
      {label}
    </Text>
  );
}

/* ── Stat card ── */
function MiniCard({ icon, label, value, color }) {
  return (
    <Box bg="white" borderRadius="12px" border={`1px solid ${C.border}`} p={4}>
      <Flex align="center" gap={2} mb={1}>
        <Flex
          w="30px"
          h="30px"
          bg={`${color}14`}
          borderRadius="8px"
          align="center"
          justify="center"
        >
          <Icon as={icon} color={color} fontSize="13px" />
        </Flex>
        <Text
          fontSize="10px"
          fontWeight={700}
          color={C.muted}
          textTransform="uppercase"
          letterSpacing=".7px"
        >
          {label}
        </Text>
      </Flex>
      <Text
        fontSize="28px"
        fontWeight={900}
        color={C.text}
        lineHeight="1"
        letterSpacing="-1.5px"
      >
        {value ?? 0}
      </Text>
    </Box>
  );
}

export default function AdminUsersPage() {
  const toast = useToast();

  const [students, setStudents] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("students"); // "students" | "owners"
  const [error, setError] = useState(null);

  const safe = async (path) => {
    try {
      return await apiFetch(path);
    } catch (e) {
      console.warn("[Users] failed:", path, e.message);
      return null;
    }
  };

  const toArr = (res) => {
    if (!res) return [];
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.data)) return res.data;
    return [];
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [studentsRes, coachingRes] = await Promise.all([
        safe("/coaching/students"),
        safe("/admin/coaching/requests"),
      ]);

      setStudents(toArr(studentsRes));

      // Extract unique owners from coaching registrations
      const allCoaching = toArr(coachingRes);
      const ownerMap = new Map();
      allCoaching.forEach((c) => {
        if (c.owner?._id && !ownerMap.has(c.owner._id)) {
          ownerMap.set(c.owner._id, {
            _id: c.owner._id,
            Name: c.owner.Name,
            Email: c.owner.Email,
            Phone: c.owner.Phone,
            coachingName: c.name,
            coachingStatus: c.status,
            createdAt: c.createdAt,
          });
        }
      });
      setOwners(Array.from(ownerMap.values()));
    } catch (e) {
      setError(e.message);
      toast({
        title: "Failed to load users: " + e.message,
        status: "error",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = (tab === "students" ? students : owners).filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.Name || u.name || "").toLowerCase().includes(q) ||
      (u.Email || u.email || "").toLowerCase().includes(q) ||
      (u.coachingName || "").toLowerCase().includes(q)
    );
  });

  return (
    <AdminNavPage title="Users" subtitle="Admin Panel">
      {/* Summary cards */}
      <Grid
        templateColumns={{ base: "1fr 1fr", md: "repeat(4,1fr)" }}
        gap={4}
        mb={6}
      >
        <MiniCard
          icon={FaUsers}
          label="Students"
          value={students.length}
          color={C.blue}
        />
        <MiniCard
          icon={FaChalkboardTeacher}
          label="Coaching Owners"
          value={owners.length}
          color={C.purple}
        />
        <MiniCard
          icon={FaTrophy}
          label="Avg Tests/Student"
          value={
            students.length
              ? Math.round(
                  students.reduce((s, u) => s + (u.totalTests || 0), 0) /
                    students.length,
                )
              : 0
          }
          color={C.amber}
        />
        <MiniCard
          icon={FaChartBar}
          label="Avg Score"
          value={
            students.length
              ? `${Math.round(students.reduce((s, u) => s + (u.avgPercentage || 0), 0) / students.length)}%`
              : "—"
          }
          color={C.green}
        />
      </Grid>

      {/* Tab switcher + search */}
      <Flex gap={3} mb={5} flexWrap={{ base: "wrap", md: "nowrap" }}>
        <Flex
          bg="white"
          border={`1px solid ${C.border}`}
          borderRadius="10px"
          p="4px"
          gap={1}
          flexShrink={0}
        >
          {[
            { key: "students", label: "Students", icon: FaUsers },
            {
              key: "owners",
              label: "Coaching Owners",
              icon: FaChalkboardTeacher,
            },
          ].map((t) => (
            <Button
              key={t.key}
              size="sm"
              h="34px"
              px={4}
              borderRadius="8px"
              bg={tab === t.key ? C.purple : "transparent"}
              color={tab === t.key ? "white" : C.muted}
              fontWeight={tab === t.key ? 700 : 500}
              fontSize="12px"
              leftIcon={<Icon as={t.icon} fontSize="11px" />}
              onClick={() => setTab(t.key)}
              _hover={tab === t.key ? {} : { bg: "#f1f5f9" }}
            >
              {t.label}
            </Button>
          ))}
        </Flex>

        <InputGroup flex={1} minW="200px">
          <InputLeftElement pointerEvents="none" h="full" pl={3}>
            <Icon as={FaSearch} color="gray.400" fontSize="12px" />
          </InputLeftElement>
          <Input
            placeholder={`Search ${tab}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg="white"
            borderRadius="10px"
            h="42px"
            fontSize="13px"
            pl="38px"
            border={`1px solid ${C.border}`}
            _focus={{ borderColor: C.blue, boxShadow: `0 0 0 1px ${C.blue}` }}
          />
        </InputGroup>

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
          Refresh
        </Button>
      </Flex>

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
      ) : filtered.length === 0 ? (
        <Box
          py={16}
          textAlign="center"
          bg="white"
          borderRadius="14px"
          border={`1px solid ${C.border}`}
        >
          <Icon
            as={FaUsers}
            fontSize="48px"
            color="#e2e8f0"
            display="block"
            mx="auto"
            mb={4}
          />
          <Text fontSize="15px" fontWeight={700} color={C.muted}>
            {search ? "No results match your search" : `No ${tab} found yet`}
          </Text>
        </Box>
      ) : tab === "students" ? (
        /* ── Students table ── */
        <Box
          bg="white"
          borderRadius="14px"
          border={`1px solid ${C.border}`}
          overflow="hidden"
        >
          <Flex
            px={5}
            py={3}
            bg={C.bg}
            borderBottom={`1px solid ${C.border}`}
            display={{ base: "none", md: "flex" }}
          >
            {[
              ["Student", 3],
              ["Email", 3],
              ["Tests Taken", 1.5],
              ["Avg Score", 1.5],
              ["Last Attempt", 2],
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
          {filtered.map((u, i) => (
            <Flex
              key={u._id || i}
              px={5}
              py={3.5}
              align="center"
              gap={3}
              borderBottom={
                i < filtered.length - 1 ? "1px solid #f1f5f9" : "none"
              }
              _hover={{ bg: "#f8faff" }}
              transition="background .12s"
              flexWrap={{ base: "wrap", md: "nowrap" }}
            >
              <Flex flex={3} align="center" gap={2.5} minW={0}>
                <Avatar
                  size="sm"
                  name={u.Name}
                  bg={C.blue}
                  color="white"
                  fontSize="11px"
                  fontWeight={800}
                  flexShrink={0}
                />
                <Box minW={0}>
                  <Text
                    fontSize="13px"
                    fontWeight={700}
                    color={C.text}
                    noOfLines={1}
                  >
                    {u.Name || "—"}
                  </Text>
                </Box>
              </Flex>
              <Text
                flex={3}
                fontSize="12px"
                color={C.muted}
                noOfLines={1}
                display={{ base: "none", md: "block" }}
              >
                {u.Email}
              </Text>
              <Box flex={1.5}>
                <Text fontSize="13px" fontWeight={700} color={C.blue}>
                  {u.totalTests ?? 0}
                </Text>
              </Box>
              <Box flex={1.5}>
                {u.avgPercentage != null ? (
                  <Badge
                    bg={u.avgPercentage >= 40 ? "#dcfce7" : "#fee2e2"}
                    color={u.avgPercentage >= 40 ? C.green : C.red}
                    borderRadius="full"
                    fontWeight={700}
                    fontSize="11px"
                    px={2}
                  >
                    {u.avgPercentage}%
                  </Badge>
                ) : (
                  <Text fontSize="11px" color={C.muted}>
                    —
                  </Text>
                )}
              </Box>
              <Box flex={2} display={{ base: "none", md: "block" }}>
                <DaysChip d={u.lastAttempt} />
                <Text fontSize="10px" color={C.muted}>
                  {fmtDate(u.lastAttempt)}
                </Text>
              </Box>
            </Flex>
          ))}
        </Box>
      ) : (
        /* ── Coaching owners table ── */
        <Box
          bg="white"
          borderRadius="14px"
          border={`1px solid ${C.border}`}
          overflow="hidden"
        >
          <Flex
            px={5}
            py={3}
            bg={C.bg}
            borderBottom={`1px solid ${C.border}`}
            display={{ base: "none", md: "flex" }}
          >
            {[
              ["Owner", 3],
              ["Email", 3],
              ["Coaching", 2.5],
              ["Status", 1.5],
              ["Registered", 2],
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
          {filtered.map((o, i) => {
            const statusCfg = {
              approved: { bg: "#dcfce7", color: C.green, label: "Approved" },
              pending: { bg: "#fef9c3", color: "#a16207", label: "Pending" },
              rejected: { bg: "#fee2e2", color: C.red, label: "Rejected" },
            };
            const s = statusCfg[o.coachingStatus] || statusCfg.pending;
            return (
              <Flex
                key={o._id || i}
                px={5}
                py={3.5}
                align="center"
                gap={3}
                borderBottom={
                  i < filtered.length - 1 ? "1px solid #f1f5f9" : "none"
                }
                _hover={{ bg: "#f8faff" }}
                transition="background .12s"
                flexWrap={{ base: "wrap", md: "nowrap" }}
              >
                <Flex flex={3} align="center" gap={2.5} minW={0}>
                  <Avatar
                    size="sm"
                    name={o.Name || o.Email}
                    bg={C.purple}
                    color="white"
                    fontSize="11px"
                    fontWeight={800}
                    flexShrink={0}
                  />
                  <Text
                    fontSize="13px"
                    fontWeight={700}
                    color={C.text}
                    noOfLines={1}
                  >
                    {o.Name || "—"}
                  </Text>
                </Flex>
                <Text
                  flex={3}
                  fontSize="12px"
                  color={C.muted}
                  noOfLines={1}
                  display={{ base: "none", md: "block" }}
                >
                  {o.Email}
                </Text>
                <Text
                  flex={2.5}
                  fontSize="13px"
                  fontWeight={600}
                  color={C.text}
                  noOfLines={1}
                  display={{ base: "none", md: "block" }}
                >
                  {o.coachingName || "—"}
                </Text>
                <Box flex={1.5}>
                  <Badge
                    bg={s.bg}
                    color={s.color}
                    borderRadius="full"
                    fontSize="10px"
                    fontWeight={700}
                    px={2.5}
                  >
                    {s.label}
                  </Badge>
                </Box>
                <Box flex={2} display={{ base: "none", md: "block" }}>
                  <Text fontSize="11px" color={C.muted}>
                    {fmtDate(o.createdAt)}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </Box>
      )}
    </AdminNavPage>
  );
}