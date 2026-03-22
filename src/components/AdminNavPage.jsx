// /**
//  * AdminNavPage.jsx
//  * ─────────────────────────────────────────────────────────────────────────────
//  * Shared layout wrapper for ALL admin pages.
//  *
//  * Usage:
//  *   import AdminNavPage from "./AdminNavPage";
//  *   export default function AdminDashboardPage() {
//  *     return <AdminNavPage title="Dashboard" subtitle="Platform overview">
//  *       {/* your page content *\/}
//  *     </AdminNavPage>;
//  *   }
//  *
//  * Features:
//  *  • Dark sidebar with live "online" indicator
//  *  • Active route highlight
//  *  • Collapsible on mobile (hamburger → full-screen drawer)
//  *  • Live socket badge on "Test Requests" showing pending count
//  *  • Redirects non-admin users to "/"
//  * ─────────────────────────────────────────────────────────────────────────────
//  */
// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Icon,
//   Avatar,
//   Button,
//   Spinner,
//   Drawer,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerBody,
//   useDisclosure,
//   IconButton,
//   Badge,
// } from "@chakra-ui/react";
// import { useNavigate, useLocation, Link } from "react-router-dom";
// import {
//   FaChartBar,
//   FaUsers,
//   FaChalkboardTeacher,
//   FaClipboardList,
//   FaLayerGroup,
//   FaShieldAlt,
//   FaSignOutAlt,
//   FaBars,
//   FaTimes,
//   FaHome,
//   FaCircle,
//   FaBell,
// } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";
// import { socket } from "../services/socket";
// import { apiFetch } from "../services/api";

// const NAV = [
//   { label: "Dashboard", to: "/admin/dashboard", icon: FaChartBar },
//   { label: "Users", to: "/admin/users", icon: FaUsers },
//   { label: "Coaching", to: "/admin/coaching", icon: FaChalkboardTeacher },
//   { label: "Tests", to: "/admin/tests", icon: FaLayerGroup },
//   {
//     label: "Test Requests",
//     to: "/admin/test-requests",
//     icon: FaClipboardList,
//     badge: true, // shows pending count
//   },
// ];

// const C = {
//   sidebar: "#0b1e3d",
//   sidebarBorder: "rgba(255,255,255,.07)",
//   active: "rgba(124,58,237,.25)",
//   activeBorder: "#7c3aed",
//   activeText: "#c4b5fd",
//   text: "rgba(255,255,255,.6)",
//   textHover: "white",
//   purple: "#7c3aed",
//   bg: "#f8fafc",
// };

// function SidebarContent({ onClose, pendingCount }) {
//   const { user, signOut } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const isActive = (to) =>
//     location.pathname === to || location.pathname.startsWith(to + "/");

//   const handleSignOut = async () => {
//     await signOut();
//     navigate("/");
//   };

//   return (
//     <Flex direction="column" h="100%" bg={C.sidebar} py={0} overflow="hidden">
//       {/* Logo area */}
//       <Box
//         px={6}
//         pt={7}
//         pb={5}
//         borderBottom={`1px solid ${C.sidebarBorder}`}
//         flexShrink={0}
//       >
//         <Flex align="center" gap={3} mb={1}>
//           <Flex
//             w="36px"
//             h="36px"
//             bg={C.purple}
//             borderRadius="10px"
//             align="center"
//             justify="center"
//             flexShrink={0}
//           >
//             <Icon as={FaShieldAlt} color="white" fontSize="15px" />
//           </Flex>
//           <Box>
//             <Text fontSize="15px" fontWeight={800} color="white" lineHeight="1">
//               Testwala
//             </Text>
//             <Text
//               fontSize="10px"
//               color="rgba(255,255,255,.35)"
//               fontWeight={600}
//               letterSpacing="1.5px"
//             >
//               ADMIN PANEL
//             </Text>
//           </Box>
//         </Flex>

//         {/* Live indicator */}
//         <Flex
//           align="center"
//           gap={1.5}
//           mt={3}
//           bg="rgba(34,197,94,.12)"
//           border="1px solid rgba(34,197,94,.25)"
//           px={3}
//           py="5px"
//           borderRadius="full"
//           w="fit-content"
//         >
//           <Box
//             w="6px"
//             h="6px"
//             bg="#22c55e"
//             borderRadius="full"
//             style={{ animation: "adminPulse 2s ease-in-out infinite" }}
//           />
//           <Text fontSize="10px" fontWeight={700} color="#4ade80">
//             Live
//           </Text>
//         </Flex>
//       </Box>

//       {/* Nav links */}
//       <Box flex={1} overflowY="auto" py={4} px={3}>
//         <Text
//           fontSize="9px"
//           fontWeight={700}
//           color="rgba(255,255,255,.2)"
//           textTransform="uppercase"
//           letterSpacing="2px"
//           px={3}
//           mb={2}
//         >
//           Navigation
//         </Text>
//         {NAV.map((item) => {
//           const active = isActive(item.to);
//           return (
//             <Flex
//               key={item.to}
//               as="button"
//               w="full"
//               align="center"
//               gap={3}
//               px={3}
//               py="10px"
//               borderRadius="10px"
//               mb={1}
//               bg={active ? C.active : "transparent"}
//               borderLeft={
//                 active ? `3px solid ${C.activeBorder}` : "3px solid transparent"
//               }
//               color={active ? C.activeText : C.text}
//               fontWeight={active ? 700 : 500}
//               fontSize="13px"
//               cursor="pointer"
//               transition="all .15s"
//               _hover={{ bg: "rgba(255,255,255,.06)", color: C.textHover }}
//               onClick={() => {
//                 navigate(item.to);
//                 onClose?.();
//               }}
//               textAlign="left"
//             >
//               <Icon as={item.icon} fontSize="13px" flexShrink={0} />
//               <Text flex={1}>{item.label}</Text>
//               {item.badge && pendingCount > 0 && (
//                 <Badge
//                   bg={C.purple}
//                   color="white"
//                   borderRadius="full"
//                   fontSize="9px"
//                   px={2}
//                   py="1px"
//                   fontWeight={800}
//                 >
//                   {pendingCount}
//                 </Badge>
//               )}
//             </Flex>
//           );
//         })}

//         <Box mt={4} mb={2} borderTop={`1px solid ${C.sidebarBorder}`} />
//         <Text
//           fontSize="9px"
//           fontWeight={700}
//           color="rgba(255,255,255,.2)"
//           textTransform="uppercase"
//           letterSpacing="2px"
//           px={3}
//           mb={2}
//         >
//           Quick Links
//         </Text>
//         <Flex
//           as="button"
//           w="full"
//           align="center"
//           gap={3}
//           px={3}
//           py="10px"
//           borderRadius="10px"
//           color={C.text}
//           fontWeight={500}
//           fontSize="13px"
//           cursor="pointer"
//           _hover={{ bg: "rgba(255,255,255,.06)", color: C.textHover }}
//           onClick={() => {
//             navigate("/");
//             onClose?.();
//           }}
//           textAlign="left"
//         >
//           <Icon as={FaHome} fontSize="13px" flexShrink={0} />
//           <Text>View Site</Text>
//         </Flex>
//       </Box>

//       {/* User strip */}
//       <Box
//         px={4}
//         py={4}
//         borderTop={`1px solid ${C.sidebarBorder}`}
//         flexShrink={0}
//       >
//         <Flex align="center" gap={3} mb={3}>
//           <Avatar
//             size="sm"
//             name={user?.Name || user?.Email}
//             bg={C.purple}
//             color="white"
//             fontSize="12px"
//             fontWeight={800}
//             flexShrink={0}
//           />
//           <Box flex={1} minW={0}>
//             <Text fontSize="12px" fontWeight={700} color="white" noOfLines={1}>
//               {user?.Name || user?.name || "Admin"}
//             </Text>
//             <Text fontSize="10px" color="rgba(255,255,255,.35)" noOfLines={1}>
//               {user?.Email || user?.email}
//             </Text>
//           </Box>
//           <Flex
//             w="16px"
//             h="16px"
//             align="center"
//             justify="center"
//             flexShrink={0}
//           >
//             <Box w="7px" h="7px" bg="#22c55e" borderRadius="full" />
//           </Flex>
//         </Flex>
//         <Button
//           w="full"
//           h="36px"
//           borderRadius="9px"
//           bg="rgba(239,68,68,.12)"
//           color="#fca5a5"
//           border="1px solid rgba(239,68,68,.2)"
//           fontWeight={700}
//           fontSize="12px"
//           leftIcon={<Icon as={FaSignOutAlt} fontSize="11px" />}
//           onClick={handleSignOut}
//           _hover={{ bg: "rgba(239,68,68,.2)", color: "white" }}
//         >
//           Sign Out
//         </Button>
//       </Box>
//     </Flex>
//   );
// }

// export default function AdminNavPage({ children, title, subtitle }) {
//   const { user, loading: authLoading } = useAuth();
//   const navigate = useNavigate();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [pendingCount, setPendingCount] = useState(0);

//   // Redirect non-admins
//   useEffect(() => {
//     if (!authLoading && user && !user.isAdmin) navigate("/");
//     if (!authLoading && !user) navigate("/auth/signin");
//   }, [user, authLoading, navigate]);

//   // Load pending test request count for badge
//   useEffect(() => {
//     if (!user?.isAdmin) return;
//     apiFetch("/test-requests/admin/all?status=pending")
//       .then((r) => setPendingCount((r.data ?? []).length))
//       .catch(() => {});
//   }, [user?.isAdmin]);

//   // Socket: new test request → bump badge
//   useEffect(() => {
//     if (!user?.isAdmin) return;
//     if (socket.connected) socket.emit("join-admin");
//     socket.on("connect", () => socket.emit("join-admin"));
//     const onNew = () => setPendingCount((p) => p + 1);
//     socket.on("test-request:new", onNew);
//     socket.on("coaching:new-request", onNew);
//     return () => {
//       socket.emit("leave-admin");
//       socket.off("test-request:new", onNew);
//       socket.off("coaching:new-request", onNew);
//       socket.off("connect");
//     };
//   }, [user?.isAdmin]);

//   if (authLoading)
//     return (
//       <Flex minH="100vh" align="center" justify="center" bg={C.bg}>
//         <Spinner size="xl" color={C.purple} thickness="4px" />
//       </Flex>
//     );
//   if (!user?.isAdmin) return null;

//   const SIDEBAR_W = "240px";

//   return (
//     <Box minH="100vh" bg={C.bg} fontFamily="'DM Sans','Segoe UI',sans-serif">
//       {/* ── Desktop sidebar (fixed) ── */}
//       <Box
//         display={{ base: "none", lg: "flex" }}
//         position="fixed"
//         left={0}
//         top={0}
//         bottom={0}
//         w={SIDEBAR_W}
//         zIndex={100}
//         flexDirection="column"
//       >
//         <SidebarContent pendingCount={pendingCount} />
//       </Box>

//       {/* ── Mobile top bar ── */}
//       <Flex
//         display={{ base: "flex", lg: "none" }}
//         position="sticky"
//         top={0}
//         zIndex={50}
//         bg="#0b1e3d"
//         px={4}
//         h="54px"
//         align="center"
//         justify="space-between"
//         borderBottom="1px solid rgba(255,255,255,.07)"
//         boxShadow="0 2px 12px rgba(11,30,61,.4)"
//       >
//         <Flex align="center" gap={2.5}>
//           <Flex
//             w="28px"
//             h="28px"
//             bg={C.purple}
//             borderRadius="7px"
//             align="center"
//             justify="center"
//           >
//             <Icon as={FaShieldAlt} color="white" fontSize="12px" />
//           </Flex>
//           <Text fontSize="14px" fontWeight={800} color="white">
//             Admin Panel
//           </Text>
//         </Flex>
//         <Flex align="center" gap={2}>
//           {pendingCount > 0 && (
//             <Badge
//               bg={C.purple}
//               color="white"
//               borderRadius="full"
//               fontSize="10px"
//               px={2}
//             >
//               {pendingCount}
//             </Badge>
//           )}
//           <IconButton
//             icon={<Icon as={FaBars} fontSize="16px" />}
//             onClick={onOpen}
//             h="36px"
//             w="36px"
//             minW="auto"
//             borderRadius="8px"
//             bg="rgba(255,255,255,.08)"
//             color="white"
//             aria-label="Menu"
//             _hover={{ bg: "rgba(255,255,255,.14)" }}
//           />
//         </Flex>
//       </Flex>

//       {/* Mobile drawer */}
//       <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
//         <DrawerOverlay bg="rgba(11,30,61,.6)" backdropFilter="blur(4px)" />
//         <DrawerContent bg={C.sidebar} maxW="260px" p={0}>
//           <DrawerBody p={0}>
//             <Box position="absolute" top={3} right={3} zIndex={1}>
//               <IconButton
//                 icon={<Icon as={FaTimes} fontSize="13px" />}
//                 onClick={onClose}
//                 h="30px"
//                 w="30px"
//                 minW="auto"
//                 borderRadius="7px"
//                 bg="rgba(255,255,255,.08)"
//                 color="rgba(255,255,255,.6)"
//                 aria-label="Close"
//                 _hover={{ bg: "rgba(255,255,255,.14)" }}
//               />
//             </Box>
//             <SidebarContent onClose={onClose} pendingCount={pendingCount} />
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>

//       {/* ── Main content area ── */}
//       <Box
//         ml={{ base: 0, lg: SIDEBAR_W }}
//         minH="100vh"
//         display="flex"
//         flexDirection="column"
//       >
//         {/* Page header */}
//         {(title || subtitle) && (
//           <Box
//             bg="linear-gradient(135deg,#0b1e3d 0%,#132952 55%,#1a3a6e 100%)"
//             px={{ base: 5, md: 8 }}
//             pt={{ base: 6, md: 8 }}
//             pb={{ base: 8, md: 12 }}
//           >
//             {subtitle && (
//               <Text
//                 fontSize="10px"
//                 fontWeight={700}
//                 color="rgba(255,255,255,.3)"
//                 textTransform="uppercase"
//                 letterSpacing="3px"
//                 mb={1}
//               >
//                 {subtitle}
//               </Text>
//             )}
//             {title && (
//               <Text
//                 fontSize={{ base: "22px", md: "28px" }}
//                 fontWeight={900}
//                 color="white"
//                 letterSpacing="-0.8px"
//               >
//                 {title}
//               </Text>
//             )}
//           </Box>
//         )}

//         {/* Content */}
//         <Box flex={1} px={{ base: 4, md: 8 }} py={6}>
//           {children}
//         </Box>
//       </Box>

//       {/* Pulse keyframe */}
//       <style>{`
//         @keyframes adminPulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50%       { opacity: 0.5; transform: scale(1.2); }
//         }
//       `}</style>
//     </Box>
//   );
// }












/**
 * AdminNavPage.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Shared layout wrapper for ALL admin pages.
 *
 * Usage:
 *   import AdminNavPage from "./AdminNavPage";
 *   export default function AdminDashboardPage() {
 *     return <AdminNavPage title="Dashboard" subtitle="Platform overview">
 *       {/* your page content *\/}
 *     </AdminNavPage>;
 *   }
 *
 * Features:
 *  • Dark sidebar with live "online" indicator
 *  • Active route highlight
 *  • Collapsible on mobile (hamburger → full-screen drawer)
 *  • Live socket badge on "Test Requests" showing pending count
 *  • Redirects non-admin users to "/"
 * ─────────────────────────────────────────────────────────────────────────────
 */
import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Avatar,
  Button,
  Spinner,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  useDisclosure,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FaChartBar,
  FaUsers,
  FaChalkboardTeacher,
  FaClipboardList,
  FaLayerGroup,
  FaShieldAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaCircle,
  FaBell,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { socket, joinAdminRoom } from "../services/socket";
import { apiFetch } from "../services/api";

const NAV = [
  { label: "Dashboard", to: "/admin/dashboard", icon: FaChartBar },
  { label: "Users", to: "/admin/users", icon: FaUsers },
  { label: "Coaching", to: "/admin/coaching", icon: FaChalkboardTeacher },
  { label: "Tests", to: "/admin/tests", icon: FaLayerGroup },
  {
    label: "Test Requests",
    to: "/admin/test-requests",
    icon: FaClipboardList,
    badge: true, // shows pending count
  },
];

const C = {
  sidebar: "#0b1e3d",
  sidebarBorder: "rgba(255,255,255,.07)",
  active: "rgba(124,58,237,.25)",
  activeBorder: "#7c3aed",
  activeText: "#c4b5fd",
  text: "rgba(255,255,255,.6)",
  textHover: "white",
  purple: "#7c3aed",
  bg: "#f8fafc",
};

function SidebarContent({ onClose, pendingCount }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (to) =>
    location.pathname === to || location.pathname.startsWith(to + "/");

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Flex direction="column" h="100%" bg={C.sidebar} py={0} overflow="hidden">
      {/* Logo area */}
      <Box
        px={6}
        pt={7}
        pb={5}
        borderBottom={`1px solid ${C.sidebarBorder}`}
        flexShrink={0}
      >
        <Flex align="center" gap={3} mb={1}>
          <Flex
            w="36px"
            h="36px"
            bg={C.purple}
            borderRadius="10px"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <Icon as={FaShieldAlt} color="white" fontSize="15px" />
          </Flex>
          <Box>
            <Text fontSize="15px" fontWeight={800} color="white" lineHeight="1">
              Testwala
            </Text>
            <Text
              fontSize="10px"
              color="rgba(255,255,255,.35)"
              fontWeight={600}
              letterSpacing="1.5px"
            >
              ADMIN PANEL
            </Text>
          </Box>
        </Flex>

        {/* Live indicator */}
        <Flex
          align="center"
          gap={1.5}
          mt={3}
          bg="rgba(34,197,94,.12)"
          border="1px solid rgba(34,197,94,.25)"
          px={3}
          py="5px"
          borderRadius="full"
          w="fit-content"
        >
          <Box
            w="6px"
            h="6px"
            bg="#22c55e"
            borderRadius="full"
            style={{ animation: "adminPulse 2s ease-in-out infinite" }}
          />
          <Text fontSize="10px" fontWeight={700} color="#4ade80">
            Live
          </Text>
        </Flex>
      </Box>

      {/* Nav links */}
      <Box flex={1} overflowY="auto" py={4} px={3}>
        <Text
          fontSize="9px"
          fontWeight={700}
          color="rgba(255,255,255,.2)"
          textTransform="uppercase"
          letterSpacing="2px"
          px={3}
          mb={2}
        >
          Navigation
        </Text>
        {NAV.map((item) => {
          const active = isActive(item.to);
          return (
            <Flex
              key={item.to}
              as="button"
              w="full"
              align="center"
              gap={3}
              px={3}
              py="10px"
              borderRadius="10px"
              mb={1}
              bg={active ? C.active : "transparent"}
              borderLeft={
                active ? `3px solid ${C.activeBorder}` : "3px solid transparent"
              }
              color={active ? C.activeText : C.text}
              fontWeight={active ? 700 : 500}
              fontSize="13px"
              cursor="pointer"
              transition="all .15s"
              _hover={{ bg: "rgba(255,255,255,.06)", color: C.textHover }}
              onClick={() => {
                navigate(item.to);
                onClose?.();
              }}
              textAlign="left"
            >
              <Icon as={item.icon} fontSize="13px" flexShrink={0} />
              <Text flex={1}>{item.label}</Text>
              {item.badge && pendingCount > 0 && (
                <Badge
                  bg={C.purple}
                  color="white"
                  borderRadius="full"
                  fontSize="9px"
                  px={2}
                  py="1px"
                  fontWeight={800}
                >
                  {pendingCount}
                </Badge>
              )}
            </Flex>
          );
        })}

        <Box mt={4} mb={2} borderTop={`1px solid ${C.sidebarBorder}`} />
        <Text
          fontSize="9px"
          fontWeight={700}
          color="rgba(255,255,255,.2)"
          textTransform="uppercase"
          letterSpacing="2px"
          px={3}
          mb={2}
        >
          Quick Links
        </Text>
        <Flex
          as="button"
          w="full"
          align="center"
          gap={3}
          px={3}
          py="10px"
          borderRadius="10px"
          color={C.text}
          fontWeight={500}
          fontSize="13px"
          cursor="pointer"
          _hover={{ bg: "rgba(255,255,255,.06)", color: C.textHover }}
          onClick={() => {
            navigate("/");
            onClose?.();
          }}
          textAlign="left"
        >
          <Icon as={FaHome} fontSize="13px" flexShrink={0} />
          <Text>View Site</Text>
        </Flex>
      </Box>

      {/* User strip */}
      <Box
        px={4}
        py={4}
        borderTop={`1px solid ${C.sidebarBorder}`}
        flexShrink={0}
      >
        <Flex align="center" gap={3} mb={3}>
          <Avatar
            size="sm"
            name={user?.Name || user?.Email}
            bg={C.purple}
            color="white"
            fontSize="12px"
            fontWeight={800}
            flexShrink={0}
          />
          <Box flex={1} minW={0}>
            <Text fontSize="12px" fontWeight={700} color="white" noOfLines={1}>
              {user?.Name || user?.name || "Admin"}
            </Text>
            <Text fontSize="10px" color="rgba(255,255,255,.35)" noOfLines={1}>
              {user?.Email || user?.email}
            </Text>
          </Box>
          <Flex
            w="16px"
            h="16px"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <Box w="7px" h="7px" bg="#22c55e" borderRadius="full" />
          </Flex>
        </Flex>
        <Button
          w="full"
          h="36px"
          borderRadius="9px"
          bg="rgba(239,68,68,.12)"
          color="#fca5a5"
          border="1px solid rgba(239,68,68,.2)"
          fontWeight={700}
          fontSize="12px"
          leftIcon={<Icon as={FaSignOutAlt} fontSize="11px" />}
          onClick={handleSignOut}
          _hover={{ bg: "rgba(239,68,68,.2)", color: "white" }}
        >
          Sign Out
        </Button>
      </Box>
    </Flex>
  );
}

export default function AdminNavPage({ children, title, subtitle }) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pendingCount, setPendingCount] = useState(0);

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && user && !user.isAdmin) navigate("/");
    if (!authLoading && !user) navigate("/auth/signin");
  }, [user, authLoading, navigate]);

  // Load pending test request count for badge
  useEffect(() => {
    if (!user?.isAdmin) return;
    apiFetch("/test-requests/admin/all?status=pending")
      .then((r) => setPendingCount((r.data ?? []).length))
      .catch(() => {});
  }, [user?.isAdmin]);

  // Socket: new test request → bump badge
  useEffect(() => {
    if (!user?.isAdmin) return;
    const cleanup = joinAdminRoom(); // handles join + reconnect
    const onNew = () => setPendingCount((p) => p + 1);
    socket.on("test-request:new", onNew);
    socket.on("coaching:new-request", onNew);
    return () => {
      cleanup();
      socket.off("test-request:new", onNew);
      socket.off("coaching:new-request", onNew);
    };
  }, [user?.isAdmin]);

  if (authLoading)
    return (
      <Flex minH="100vh" align="center" justify="center" bg={C.bg}>
        <Spinner size="xl" color={C.purple} thickness="4px" />
      </Flex>
    );
  if (!user?.isAdmin) return null;

  const SIDEBAR_W = "240px";

  return (
    <Box minH="100vh" bg={C.bg} fontFamily="'DM Sans','Segoe UI',sans-serif">
      {/* ── Desktop sidebar (fixed) ── */}
      <Box
        display={{ base: "none", lg: "flex" }}
        position="fixed"
        left={0}
        top={0}
        bottom={0}
        w={SIDEBAR_W}
        zIndex={100}
        flexDirection="column"
      >
        <SidebarContent pendingCount={pendingCount} />
      </Box>

      {/* ── Mobile top bar ── */}
      <Flex
        display={{ base: "flex", lg: "none" }}
        position="sticky"
        top={0}
        zIndex={50}
        bg="#0b1e3d"
        px={4}
        h="54px"
        align="center"
        justify="space-between"
        borderBottom="1px solid rgba(255,255,255,.07)"
        boxShadow="0 2px 12px rgba(11,30,61,.4)"
      >
        <Flex align="center" gap={2.5}>
          <Flex
            w="28px"
            h="28px"
            bg={C.purple}
            borderRadius="7px"
            align="center"
            justify="center"
          >
            <Icon as={FaShieldAlt} color="white" fontSize="12px" />
          </Flex>
          <Text fontSize="14px" fontWeight={800} color="white">
            Admin Panel
          </Text>
        </Flex>
        <Flex align="center" gap={2}>
          {pendingCount > 0 && (
            <Badge
              bg={C.purple}
              color="white"
              borderRadius="full"
              fontSize="10px"
              px={2}
            >
              {pendingCount}
            </Badge>
          )}
          <IconButton
            icon={<Icon as={FaBars} fontSize="16px" />}
            onClick={onOpen}
            h="36px"
            w="36px"
            minW="auto"
            borderRadius="8px"
            bg="rgba(255,255,255,.08)"
            color="white"
            aria-label="Menu"
            _hover={{ bg: "rgba(255,255,255,.14)" }}
          />
        </Flex>
      </Flex>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
        <DrawerOverlay bg="rgba(11,30,61,.6)" backdropFilter="blur(4px)" />
        <DrawerContent bg={C.sidebar} maxW="260px" p={0}>
          <DrawerBody p={0}>
            <Box position="absolute" top={3} right={3} zIndex={1}>
              <IconButton
                icon={<Icon as={FaTimes} fontSize="13px" />}
                onClick={onClose}
                h="30px"
                w="30px"
                minW="auto"
                borderRadius="7px"
                bg="rgba(255,255,255,.08)"
                color="rgba(255,255,255,.6)"
                aria-label="Close"
                _hover={{ bg: "rgba(255,255,255,.14)" }}
              />
            </Box>
            <SidebarContent onClose={onClose} pendingCount={pendingCount} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* ── Main content area ── */}
      <Box
        ml={{ base: 0, lg: SIDEBAR_W }}
        minH="100vh"
        display="flex"
        flexDirection="column"
      >
        {/* Page header */}
        {(title || subtitle) && (
          <Box
            bg="linear-gradient(135deg,#0b1e3d 0%,#132952 55%,#1a3a6e 100%)"
            px={{ base: 5, md: 8 }}
            pt={{ base: 6, md: 8 }}
            pb={{ base: 8, md: 12 }}
          >
            {subtitle && (
              <Text
                fontSize="10px"
                fontWeight={700}
                color="rgba(255,255,255,.3)"
                textTransform="uppercase"
                letterSpacing="3px"
                mb={1}
              >
                {subtitle}
              </Text>
            )}
            {title && (
              <Text
                fontSize={{ base: "22px", md: "28px" }}
                fontWeight={900}
                color="white"
                letterSpacing="-0.8px"
              >
                {title}
              </Text>
            )}
          </Box>
        )}

        {/* Content */}
        <Box flex={1} px={{ base: 4, md: 8 }} py={6}>
          {children}
        </Box>
      </Box>

      {/* Pulse keyframe */}
      <style>{`
        @keyframes adminPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </Box>
  );
}