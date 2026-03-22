// import React from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Button,
//   Icon,
//   Avatar,
//   Menu,
//   MenuButton,
//   MenuList,
//   MenuItem,
//   MenuDivider,
//   IconButton,
//   Drawer,
//   DrawerOverlay,
//   DrawerContent,
//   DrawerCloseButton,
//   DrawerHeader,
//   DrawerBody,
//   Stack,
//   useDisclosure,
// } from "@chakra-ui/react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import {
//   FaGraduationCap,
//   FaChalkboardTeacher,
//   FaSignOutAlt,
//   FaBars,
//   FaHome,
//   FaTrophy,
//   FaShieldAlt,
//   FaClipboardList,
// } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";
// import { NotificationBell } from "../components/RequestTestDrawer";

// const LINKS = [
//   { label: "Home", to: "/", icon: FaHome },
//   { label: "Coaching", to: "/coaching", icon: FaChalkboardTeacher },
//   { label: "My Tests", to: "/UserTestData", icon: FaTrophy, auth: true },
// ];

// const Navbar = () => {
//   const { user, signOut } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const isActive = (to) =>
//     to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

//   const handleSignOut = async () => {
//     await signOut();
//     navigate("/");
//     onClose();
//   };

//   const isAdmin = Boolean(user?.isAdmin);

//   return (
//     <Box
//       bg="white"
//       borderBottom="1px solid #e2e8f0"
//       position="sticky"
//       top={0}
//       zIndex={200}
//       boxShadow="0 1px 12px rgba(0,0,0,.06)"
//       fontFamily="'Sora',sans-serif"
//     >
//       <Flex
//         maxW="1200px"
//         mx="auto"
//         px={{ base: 4, md: 6 }}
//         py={3}
//         align="center"
//         justify="space-between"
//       >
//         {/* Logo */}
//         <Link to="/">
//           <Flex align="center" gap={2}>
//             <Flex
//               w="34px"
//               h="34px"
//               bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
//               borderRadius="9px"
//               align="center"
//               justify="center"
//             >
//               <Icon as={FaGraduationCap} color="white" fontSize="16px" />
//             </Flex>
//             <Text
//               fontSize="17px"
//               fontWeight={800}
//               color="#0f172a"
//               letterSpacing="-0.5px"
//             >
//               Revision{" "}
//               <Text as="span" color="#4a72b8">
//                 Karlo
//               </Text>
//             </Text>
//           </Flex>
//         </Link>

//         {/* Desktop nav links */}
//         <Flex align="center" gap={1} display={{ base: "none", md: "flex" }}>
//           {LINKS.filter((l) => !l.auth || user).map((link) => (
//             <Link key={link.to} to={link.to}>
//               <Box
//                 px={4}
//                 py={2}
//                 borderRadius="9px"
//                 fontSize="13px"
//                 fontWeight={isActive(link.to) ? 700 : 500}
//                 color={isActive(link.to) ? "#4a72b8" : "#475569"}
//                 bg={isActive(link.to) ? "#eff6ff" : "transparent"}
//                 _hover={{ bg: "#f1f5f9", color: "#1e3a5f" }}
//                 transition="all .15s"
//               >
//                 {link.label}
//               </Box>
//             </Link>
//           ))}

//           {/* Admin link — desktop */}
//           {isAdmin && (
//             <Link to="/admin/coaching">
//               <Flex
//                 align="center"
//                 gap={1.5}
//                 px={4}
//                 py={2}
//                 borderRadius="9px"
//                 fontSize="13px"
//                 fontWeight={isActive("/admin") ? 700 : 600}
//                 color={isActive("/admin") ? "#7c3aed" : "#6d28d9"}
//                 bg={isActive("/admin") ? "#f5f3ff" : "rgba(124,58,237,.07)"}
//                 border="1px solid"
//                 borderColor={
//                   isActive("/admin") ? "#c4b5fd" : "rgba(124,58,237,.2)"
//                 }
//                 _hover={{ bg: "#f5f3ff", borderColor: "#c4b5fd" }}
//                 transition="all .15s"
//               >
//                 <Icon as={FaShieldAlt} fontSize="11px" />
//                 Admin
//               </Flex>
//             </Link>
//           )}
//         </Flex>

//         {/* Right side */}
//         <Flex align="center" gap={2}>
//           {/* Notification bell — only for logged in users */}
//           {user && <NotificationBell />}
//           {user ? (
//             <Menu>
//               <MenuButton>
//                 <Flex
//                   align="center"
//                   gap={2}
//                   bg={isAdmin ? "rgba(124,58,237,.07)" : "#f8fafc"}
//                   border="1px solid"
//                   borderColor={isAdmin ? "rgba(124,58,237,.25)" : "#e2e8f0"}
//                   borderRadius="10px"
//                   px={3}
//                   py={2}
//                   cursor="pointer"
//                   _hover={{ bg: isAdmin ? "#f5f3ff" : "#f1f5f9" }}
//                   transition="all .15s"
//                 >
//                   <Avatar
//                     size="xs"
//                     name={user.Name || user.Email}
//                     bg={isAdmin ? "#7c3aed" : "#4a72b8"}
//                     color="white"
//                     fontSize="11px"
//                     fontWeight={800}
//                   />
//                   <Text
//                     fontSize="13px"
//                     fontWeight={600}
//                     color="#374151"
//                     maxW="100px"
//                     noOfLines={1}
//                     display={{ base: "none", sm: "block" }}
//                   >
//                     {user.Name || user.name || user.Email?.split("@")[0]}
//                   </Text>
//                   {isAdmin && (
//                     <Flex
//                       align="center"
//                       gap={1}
//                       bg="#7c3aed"
//                       px={2}
//                       py="2px"
//                       borderRadius="full"
//                       display={{ base: "none", sm: "flex" }}
//                     >
//                       <Icon as={FaShieldAlt} fontSize="8px" color="white" />
//                       <Text
//                         fontSize="9px"
//                         fontWeight={800}
//                         color="white"
//                         letterSpacing=".3px"
//                       >
//                         ADMIN
//                       </Text>
//                     </Flex>
//                   )}
//                 </Flex>
//               </MenuButton>

//               <MenuList
//                 borderRadius="12px"
//                 border="1px solid #e2e8f0"
//                 boxShadow="0 8px 30px rgba(0,0,0,.1)"
//                 py={2}
//                 fontSize="13px"
//                 minW="200px"
//               >
//                 {/* User info */}
//                 <Box px={4} py={2} mb={1}>
//                   <Flex align="center" gap={2} mb={1}>
//                     <Text fontWeight={700} color="#0f172a" noOfLines={1}>
//                       {user.Name || user.name}
//                     </Text>
//                     {isAdmin && (
//                       <Flex
//                         align="center"
//                         gap={1}
//                         bg="#7c3aed"
//                         px={2}
//                         py="2px"
//                         borderRadius="full"
//                         flexShrink={0}
//                       >
//                         <Icon as={FaShieldAlt} fontSize="8px" color="white" />
//                         <Text fontSize="9px" fontWeight={800} color="white">
//                           ADMIN
//                         </Text>
//                       </Flex>
//                     )}
//                   </Flex>
//                   <Text fontSize="11px" color="#94a3b8">
//                     {user.Email || user.email}
//                   </Text>
//                 </Box>

//                 <MenuDivider />

//                 {/* Regular nav items */}
//                 {LINKS.filter((l) => l.auth).map((link) => (
//                   <MenuItem
//                     key={link.to}
//                     icon={<Icon as={link.icon} />}
//                     onClick={() => navigate(link.to)}
//                     borderRadius="8px"
//                     mx={2}
//                     w="calc(100% - 16px)"
//                   >
//                     {link.label}
//                   </MenuItem>
//                 ))}

//                 {/* Admin section */}
//                 {isAdmin && (
//                   <>
//                     <MenuDivider />
//                     <Box px={4} py={1}>
//                       <Text
//                         fontSize="10px"
//                         fontWeight={800}
//                         color="#94a3b8"
//                         textTransform="uppercase"
//                         letterSpacing="1.5px"
//                       >
//                         Admin
//                       </Text>
//                     </Box>
//                     <MenuItem
//                       icon={<Icon as={FaShieldAlt} color="#7c3aed" />}
//                       onClick={() => navigate("/admin/coaching")}
//                       color="#6d28d9"
//                       fontWeight={600}
//                       borderRadius="8px"
//                       mx={2}
//                       w="calc(100% - 16px)"
//                       _hover={{ bg: "#f5f3ff" }}
//                     >
//                       Coaching Requests
//                     </MenuItem>
//                     <MenuItem
//                       icon={<Icon as={FaClipboardList} color="#7c3aed" />}
//                       onClick={() => navigate("/admin/test-requests")}
//                       color="#6d28d9"
//                       fontWeight={600}
//                       borderRadius="8px"
//                       mx={2}
//                       w="calc(100% - 16px)"
//                       _hover={{ bg: "#f5f3ff" }}
//                     >
//                       Test Requests
//                     </MenuItem>
//                   </>
//                 )}

//                 <MenuDivider />
//                 <MenuItem
//                   icon={<Icon as={FaSignOutAlt} color="#ef4444" />}
//                   onClick={handleSignOut}
//                   color="#ef4444"
//                   fontWeight={600}
//                   borderRadius="8px"
//                   mx={2}
//                   w="calc(100% - 16px)"
//                 >
//                   Sign Out
//                 </MenuItem>
//               </MenuList>
//             </Menu>
//           ) : (
//             <>
//               <Link to="/auth/signin">
//                 <Button
//                   size="sm"
//                   variant="ghost"
//                   fontWeight={600}
//                   color="#475569"
//                   borderRadius="9px"
//                   _hover={{ bg: "#f1f5f9" }}
//                 >
//                   Sign In
//                 </Button>
//               </Link>
//               <Link to="/auth/signup">
//                 <Button
//                   size="sm"
//                   bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
//                   color="white"
//                   fontWeight={700}
//                   borderRadius="9px"
//                   _hover={{ opacity: 0.9 }}
//                   boxShadow="0 2px 8px rgba(74,114,184,.3)"
//                 >
//                   Sign Up
//                 </Button>
//               </Link>
//             </>
//           )}

//           {/* Mobile hamburger */}
//           <IconButton
//             display={{ base: "flex", md: "none" }}
//             icon={<FaBars />}
//             variant="ghost"
//             onClick={onOpen}
//             aria-label="Menu"
//             color="#475569"
//           />
//         </Flex>
//       </Flex>

//       {/* Mobile Drawer */}
//       <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="xs">
//         <DrawerOverlay />
//         <DrawerContent fontFamily="'Sora',sans-serif">
//           <DrawerCloseButton />
//           <DrawerHeader
//             borderBottom="1px solid #f1f5f9"
//             fontSize="15px"
//             fontWeight={800}
//           >
//             Menu
//           </DrawerHeader>
//           <DrawerBody py={4}>
//             <Stack spacing={1}>
//               {/* User info strip (mobile) */}
//               {user && (
//                 <Flex
//                   align="center"
//                   gap={3}
//                   px={4}
//                   py={3}
//                   mb={1}
//                   bg={isAdmin ? "rgba(124,58,237,.06)" : "#f8fafc"}
//                   borderRadius="10px"
//                   border="1px solid"
//                   borderColor={isAdmin ? "rgba(124,58,237,.2)" : "#e2e8f0"}
//                 >
//                   <Avatar
//                     size="sm"
//                     name={user.Name || user.Email}
//                     bg={isAdmin ? "#7c3aed" : "#4a72b8"}
//                     color="white"
//                     fontSize="13px"
//                     fontWeight={800}
//                   />
//                   <Box flex={1} minW={0}>
//                     <Flex align="center" gap={2}>
//                       <Text
//                         fontSize="13px"
//                         fontWeight={700}
//                         color="#0f172a"
//                         noOfLines={1}
//                       >
//                         {user.Name || user.name}
//                       </Text>
//                       {isAdmin && (
//                         <Flex
//                           align="center"
//                           gap={1}
//                           bg="#7c3aed"
//                           px={2}
//                           py="2px"
//                           borderRadius="full"
//                           flexShrink={0}
//                         >
//                           <Icon as={FaShieldAlt} fontSize="8px" color="white" />
//                           <Text fontSize="9px" fontWeight={800} color="white">
//                             ADMIN
//                           </Text>
//                         </Flex>
//                       )}
//                     </Flex>
//                     <Text fontSize="11px" color="#94a3b8" noOfLines={1}>
//                       {user.Email || user.email}
//                     </Text>
//                   </Box>
//                 </Flex>
//               )}

//               {/* Nav links */}
//               {LINKS.filter((l) => !l.auth || user).map((link) => (
//                 <Flex
//                   key={link.to}
//                   align="center"
//                   gap={3}
//                   px={4}
//                   py={3}
//                   borderRadius="10px"
//                   fontSize="14px"
//                   fontWeight={600}
//                   color={isActive(link.to) ? "#4a72b8" : "#374151"}
//                   bg={isActive(link.to) ? "#eff6ff" : "transparent"}
//                   cursor="pointer"
//                   onClick={() => {
//                     navigate(link.to);
//                     onClose();
//                   }}
//                   _hover={{ bg: "#f1f5f9" }}
//                 >
//                   <Icon as={link.icon} fontSize="14px" />
//                   {link.label}
//                 </Flex>
//               ))}

//               {/* Admin link (mobile) */}
//               {isAdmin && (
//                 <>
//                   <Box px={4} pt={3} pb={1}>
//                     <Text
//                       fontSize="10px"
//                       fontWeight={800}
//                       color="#94a3b8"
//                       textTransform="uppercase"
//                       letterSpacing="1.5px"
//                     >
//                       Admin
//                     </Text>
//                   </Box>
//                   <Flex
//                     align="center"
//                     gap={3}
//                     px={4}
//                     py={3}
//                     borderRadius="10px"
//                     fontSize="14px"
//                     fontWeight={600}
//                     color={isActive("/admin") ? "#7c3aed" : "#6d28d9"}
//                     bg={isActive("/admin") ? "#f5f3ff" : "rgba(124,58,237,.05)"}
//                     cursor="pointer"
//                     onClick={() => {
//                       navigate("/admin/coaching");
//                       onClose();
//                     }}
//                     _hover={{ bg: "#f5f3ff" }}
//                   >
//                     <Icon as={FaShieldAlt} fontSize="14px" />
//                     Coaching Requests
//                   </Flex>
//                   <Flex
//                     align="center"
//                     gap={3}
//                     px={4}
//                     py={3}
//                     borderRadius="10px"
//                     fontSize="14px"
//                     fontWeight={600}
//                     color={
//                       isActive("/admin/test-requests") ? "#7c3aed" : "#6d28d9"
//                     }
//                     bg={
//                       isActive("/admin/test-requests")
//                         ? "#f5f3ff"
//                         : "rgba(124,58,237,.05)"
//                     }
//                     cursor="pointer"
//                     onClick={() => {
//                       navigate("/admin/test-requests");
//                       onClose();
//                     }}
//                     _hover={{ bg: "#f5f3ff" }}
//                   >
//                     <Icon as={FaClipboardList} fontSize="14px" />
//                     Test Requests
//                   </Flex>
//                 </>
//               )}

//               {/* Auth actions */}
//               {user ? (
//                 <Flex
//                   align="center"
//                   gap={3}
//                   px={4}
//                   py={3}
//                   borderRadius="10px"
//                   fontSize="14px"
//                   fontWeight={600}
//                   color="#ef4444"
//                   cursor="pointer"
//                   onClick={handleSignOut}
//                   _hover={{ bg: "#fef2f2" }}
//                   mt={1}
//                 >
//                   <Icon as={FaSignOutAlt} />
//                   Sign Out
//                 </Flex>
//               ) : (
//                 <>
//                   <Box
//                     px={4}
//                     py={3}
//                     borderRadius="10px"
//                     fontSize="14px"
//                     fontWeight={600}
//                     color="#374151"
//                     cursor="pointer"
//                     _hover={{ bg: "#f1f5f9" }}
//                     onClick={() => {
//                       navigate("/auth/signin");
//                       onClose();
//                     }}
//                   >
//                     Sign In
//                   </Box>
//                   <Box
//                     px={4}
//                     py={3}
//                     borderRadius="10px"
//                     fontSize="14px"
//                     fontWeight={700}
//                     color="white"
//                     bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
//                     cursor="pointer"
//                     onClick={() => {
//                       navigate("/auth/signup");
//                       onClose();
//                     }}
//                   >
//                     Account Banao
//                   </Box>
//                 </>
//               )}
//             </Stack>
//           </DrawerBody>
//         </DrawerContent>
//       </Drawer>
//     </Box>
//   );
// };

// export default Navbar;

import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Icon,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  useDisclosure,
  Image,
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaBars,
  FaHome,
  FaTrophy,
  FaShieldAlt,
  FaClipboardList,
  FaChartBar,
  FaUsers,
  FaLayerGroup,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { NotificationBell } from "../components/RequestTestDrawer";
import logo from "../assets/logo.png";

const LINKS = [
  { label: "Home", to: "/", icon: FaHome },
  { label: "Coaching", to: "/coaching", icon: FaChalkboardTeacher },
  { label: "My Tests", to: "/UserTestData", icon: FaTrophy, auth: true },
];

// Admin sub-nav items shown in dropdown and mobile drawer
const ADMIN_LINKS = [
  { label: "Dashboard", to: "/admin/dashboard", icon: FaChartBar },
  { label: "Users", to: "/admin/users", icon: FaUsers },
  { label: "Coaching", to: "/admin/coaching", icon: FaChalkboardTeacher },
  { label: "Tests", to: "/admin/tests", icon: FaLayerGroup },
  { label: "Test Requests", to: "/admin/test-requests", icon: FaClipboardList },
];

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const isAnyAdminActive = ADMIN_LINKS.some((l) =>
    location.pathname.startsWith(l.to),
  );

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    onClose();
  };

  const isAdmin = Boolean(user?.isAdmin);

  return (
    <Box
      bg="white"
      borderBottom="1px solid #e2e8f0"
      position="sticky"
      top={0}
      zIndex={200}
      boxShadow="0 1px 12px rgba(0,0,0,.06)"
      fontFamily="'Poppins', sans-serif"
    >
      <Flex
        maxW="1390px"
        mx="auto"
        px={{ base: 4, md: 6, lg: 0 }}
        py={0}
        align="center"
        justify="space-between"
        h={{ base: "56px", md: "64px" }}
      >
        {/* ── Logo ── */}
        <Link to="/">
          <Image
            src={logo}
            mt={4}
            alt="logo"
            h={{ base: "40px", md: "48px", lg: "80px" }}
            w="auto"
            objectFit="cover"
            transform="scale(1.6)"
            transformOrigin="left center"
          />
        </Link>

        {/* ── Desktop nav links ── */}
        <Flex align="center" gap={1} display={{ base: "none", md: "flex" }}>
          {LINKS.filter((l) => !l.auth || user).map((link) => (
            <Link key={link.to} to={link.to}>
              <Box
                px={4}
                py={2}
                borderRadius="9px"
                fontSize="13px"
                fontWeight={isActive(link.to) ? 600 : 400}
                color={isActive(link.to) ? "#4a72b8" : "#475569"}
                bg={isActive(link.to) ? "#eff6ff" : "transparent"}
                _hover={{ bg: "#f1f5f9", color: "#1e3a5f" }}
                transition="all .15s"
              >
                {link.label}
              </Box>
            </Link>
          ))}

          {/* Admin dropdown — desktop */}
          {isAdmin && (
            <Menu>
              <MenuButton>
                <Flex
                  align="center"
                  gap={1.5}
                  px={4}
                  py={2}
                  borderRadius="9px"
                  fontSize="13px"
                  fontWeight={isAnyAdminActive ? 600 : 500}
                  color={isAnyAdminActive ? "#7c3aed" : "#6d28d9"}
                  bg={isAnyAdminActive ? "#f5f3ff" : "rgba(124,58,237,.07)"}
                  border="1px solid"
                  borderColor={
                    isAnyAdminActive ? "#c4b5fd" : "rgba(124,58,237,.2)"
                  }
                  _hover={{ bg: "#f5f3ff", borderColor: "#c4b5fd" }}
                  transition="all .15s"
                >
                  <Icon as={FaShieldAlt} fontSize="11px" />
                  Admin
                </Flex>
              </MenuButton>
              <MenuList
                borderRadius="12px"
                border="1px solid #e2e8f0"
                boxShadow="0 8px 30px rgba(0,0,0,.1)"
                py={2}
                minW="200px"
              >
                {ADMIN_LINKS.map((al) => (
                  <MenuItem
                    key={al.to}
                    icon={<Icon as={al.icon} color="#7c3aed" fontSize="12px" />}
                    onClick={() => navigate(al.to)}
                    fontSize="13px"
                    fontWeight={isActive(al.to) ? 700 : 500}
                    color={isActive(al.to) ? "#6d28d9" : "#374151"}
                    bg={isActive(al.to) ? "#f5f3ff" : "white"}
                    borderRadius="8px"
                    mx={2}
                    w="calc(100% - 16px)"
                    _hover={{ bg: "#f5f3ff", color: "#6d28d9" }}
                  >
                    {al.label}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          )}
        </Flex>

        {/* ── Right side ── */}
        <Flex align="center" gap={2}>
          {user && <NotificationBell />}

          {user ? (
            <Menu>
              <MenuButton>
                <Flex
                  align="center"
                  gap={2}
                  bg={isAdmin ? "rgba(124,58,237,.07)" : "#f8fafc"}
                  border="1px solid"
                  borderColor={isAdmin ? "rgba(124,58,237,.25)" : "#e2e8f0"}
                  borderRadius="10px"
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: isAdmin ? "#f5f3ff" : "#f1f5f9" }}
                  transition="all .15s"
                >
                  <Avatar
                    size="xs"
                    name={user.Name || user.Email}
                    bg={isAdmin ? "#7c3aed" : "#4a72b8"}
                    color="white"
                    fontSize="11px"
                    fontWeight={800}
                  />
                  <Text
                    fontSize="13px"
                    fontWeight={500}
                    color="#374151"
                    maxW="100px"
                    noOfLines={1}
                    display={{ base: "none", sm: "block" }}
                  >
                    {user.Name || user.name || user.Email?.split("@")[0]}
                  </Text>
                  {isAdmin && (
                    <Flex
                      align="center"
                      gap={1}
                      bg="#7c3aed"
                      px={2}
                      py="2px"
                      borderRadius="full"
                      display={{ base: "none", sm: "flex" }}
                    >
                      <Icon as={FaShieldAlt} fontSize="8px" color="white" />
                      <Text
                        fontSize="9px"
                        fontWeight={700}
                        color="white"
                        letterSpacing=".3px"
                      >
                        ADMIN
                      </Text>
                    </Flex>
                  )}
                </Flex>
              </MenuButton>

              <MenuList
                borderRadius="12px"
                border="1px solid #e2e8f0"
                boxShadow="0 8px 30px rgba(0,0,0,.1)"
                py={2}
                fontSize="13px"
                minW="200px"
              >
                {/* User info */}
                <Box px={4} py={2} mb={1}>
                  <Flex align="center" gap={2} mb={1}>
                    <Text fontWeight={600} color="#0f172a" noOfLines={1}>
                      {user.Name || user.name}
                    </Text>
                    {isAdmin && (
                      <Flex
                        align="center"
                        gap={1}
                        bg="#7c3aed"
                        px={2}
                        py="2px"
                        borderRadius="full"
                        flexShrink={0}
                      >
                        <Icon as={FaShieldAlt} fontSize="8px" color="white" />
                        <Text fontSize="9px" fontWeight={700} color="white">
                          ADMIN
                        </Text>
                      </Flex>
                    )}
                  </Flex>
                  <Text fontSize="11px" color="#94a3b8">
                    {user.Email || user.email}
                  </Text>
                </Box>

                <MenuDivider />

                {LINKS.filter((l) => l.auth).map((link) => (
                  <MenuItem
                    key={link.to}
                    icon={<Icon as={link.icon} />}
                    onClick={() => navigate(link.to)}
                    borderRadius="8px"
                    mx={2}
                    w="calc(100% - 16px)"
                  >
                    {link.label}
                  </MenuItem>
                ))}

                {isAdmin && (
                  <>
                    <MenuDivider />
                    <Box px={4} py={1}>
                      <Text
                        fontSize="10px"
                        fontWeight={600}
                        color="#94a3b8"
                        textTransform="uppercase"
                        letterSpacing="1.5px"
                      >
                        Admin Panel
                      </Text>
                    </Box>
                    {ADMIN_LINKS.map((al) => (
                      <MenuItem
                        key={al.to}
                        icon={
                          <Icon as={al.icon} color="#7c3aed" fontSize="12px" />
                        }
                        onClick={() => navigate(al.to)}
                        color="#6d28d9"
                        fontWeight={500}
                        fontSize="13px"
                        borderRadius="8px"
                        mx={2}
                        w="calc(100% - 16px)"
                        _hover={{ bg: "#f5f3ff" }}
                      >
                        {al.label}
                      </MenuItem>
                    ))}
                  </>
                )}

                <MenuDivider />
                <MenuItem
                  icon={<Icon as={FaSignOutAlt} color="#ef4444" />}
                  onClick={handleSignOut}
                  color="#ef4444"
                  fontWeight={500}
                  borderRadius="8px"
                  mx={2}
                  w="calc(100% - 16px)"
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <>
              <Link to="/auth/signin">
                <Button
                  size="sm"
                  variant="ghost"
                  fontWeight={500}
                  color="#475569"
                  borderRadius="9px"
                  _hover={{ bg: "#f1f5f9" }}
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button
                  size="sm"
                  bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
                  color="white"
                  fontWeight={600}
                  borderRadius="9px"
                  _hover={{ opacity: 0.9 }}
                  boxShadow="0 2px 8px rgba(74,114,184,.3)"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}

          {/* Mobile hamburger */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<FaBars />}
            variant="ghost"
            onClick={onOpen}
            aria-label="Menu"
            color="#475569"
          />
        </Flex>
      </Flex>

      {/* ── Mobile Drawer ── */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="xs">
        <DrawerOverlay />
        <DrawerContent fontFamily="'Poppins', sans-serif">
          <DrawerCloseButton />
          <DrawerHeader
            borderBottom="1px solid #f1f5f9"
            fontSize="15px"
            fontWeight={600}
          >
            Menu
          </DrawerHeader>
          <DrawerBody py={4}>
            <Stack spacing={1}>
              {user && (
                <Flex
                  align="center"
                  gap={3}
                  px={4}
                  py={3}
                  mb={1}
                  bg={isAdmin ? "rgba(124,58,237,.06)" : "#f8fafc"}
                  borderRadius="10px"
                  border="1px solid"
                  borderColor={isAdmin ? "rgba(124,58,237,.2)" : "#e2e8f0"}
                >
                  <Avatar
                    size="sm"
                    name={user.Name || user.Email}
                    bg={isAdmin ? "#7c3aed" : "#4a72b8"}
                    color="white"
                    fontSize="13px"
                    fontWeight={700}
                  />
                  <Box flex={1} minW={0}>
                    <Flex align="center" gap={2}>
                      <Text
                        fontSize="13px"
                        fontWeight={600}
                        color="#0f172a"
                        noOfLines={1}
                      >
                        {user.Name || user.name}
                      </Text>
                      {isAdmin && (
                        <Flex
                          align="center"
                          gap={1}
                          bg="#7c3aed"
                          px={2}
                          py="2px"
                          borderRadius="full"
                          flexShrink={0}
                        >
                          <Icon as={FaShieldAlt} fontSize="8px" color="white" />
                          <Text fontSize="9px" fontWeight={700} color="white">
                            ADMIN
                          </Text>
                        </Flex>
                      )}
                    </Flex>
                    <Text fontSize="11px" color="#94a3b8" noOfLines={1}>
                      {user.Email || user.email}
                    </Text>
                  </Box>
                </Flex>
              )}

              {LINKS.filter((l) => !l.auth || user).map((link) => (
                <Flex
                  key={link.to}
                  align="center"
                  gap={3}
                  px={4}
                  py={3}
                  borderRadius="10px"
                  fontSize="14px"
                  fontWeight={500}
                  color={isActive(link.to) ? "#4a72b8" : "#374151"}
                  bg={isActive(link.to) ? "#eff6ff" : "transparent"}
                  cursor="pointer"
                  onClick={() => {
                    navigate(link.to);
                    onClose();
                  }}
                  _hover={{ bg: "#f1f5f9" }}
                >
                  <Icon as={link.icon} fontSize="14px" />
                  {link.label}
                </Flex>
              ))}

              {/* Admin links — mobile */}
              {isAdmin && (
                <>
                  <Box px={4} pt={3} pb={1}>
                    <Text
                      fontSize="10px"
                      fontWeight={600}
                      color="#94a3b8"
                      textTransform="uppercase"
                      letterSpacing="1.5px"
                    >
                      Admin Panel
                    </Text>
                  </Box>
                  {ADMIN_LINKS.map((al) => (
                    <Flex
                      key={al.to}
                      align="center"
                      gap={3}
                      px={4}
                      py={3}
                      borderRadius="10px"
                      fontSize="14px"
                      fontWeight={500}
                      color={isActive(al.to) ? "#7c3aed" : "#6d28d9"}
                      bg={isActive(al.to) ? "#f5f3ff" : "rgba(124,58,237,.05)"}
                      cursor="pointer"
                      onClick={() => {
                        navigate(al.to);
                        onClose();
                      }}
                      _hover={{ bg: "#f5f3ff" }}
                    >
                      <Icon as={al.icon} fontSize="14px" />
                      {al.label}
                    </Flex>
                  ))}
                </>
              )}

              {user ? (
                <Flex
                  align="center"
                  gap={3}
                  px={4}
                  py={3}
                  borderRadius="10px"
                  fontSize="14px"
                  fontWeight={500}
                  color="#ef4444"
                  cursor="pointer"
                  onClick={handleSignOut}
                  _hover={{ bg: "#fef2f2" }}
                  mt={1}
                >
                  <Icon as={FaSignOutAlt} />
                  Sign Out
                </Flex>
              ) : (
                <>
                  <Box
                    px={4}
                    py={3}
                    borderRadius="10px"
                    fontSize="14px"
                    fontWeight={500}
                    color="#374151"
                    cursor="pointer"
                    _hover={{ bg: "#f1f5f9" }}
                    onClick={() => {
                      navigate("/auth/signin");
                      onClose();
                    }}
                  >
                    Sign In
                  </Box>
                  <Box
                    px={4}
                    py={3}
                    borderRadius="10px"
                    fontSize="14px"
                    fontWeight={600}
                    color="white"
                    bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
                    cursor="pointer"
                    onClick={() => {
                      navigate("/auth/signup");
                      onClose();
                    }}
                  >
                    Create Account
                  </Box>
                </>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Navbar;