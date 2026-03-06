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
} from "@chakra-ui/react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaGraduationCap,
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaBars,
  FaHome,
  FaTrophy,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  { label: "Home", to: "/", icon: FaHome },
  { label: "Coaching", to: "/coaching", icon: FaChalkboardTeacher },
  { label: "My Tests", to: "/UserTestData", icon: FaTrophy, auth: true },
];

 const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    onClose();
  };

  return (
    <Box
      bg="white"
      borderBottom="1px solid #e2e8f0"
      position="sticky"
      top={0}
      zIndex={200}
      boxShadow="0 1px 12px rgba(0,0,0,.06)"
      fontFamily="'Sora',sans-serif"
    >
      <Flex
        maxW="1200px"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={3}
        align="center"
        justify="space-between"
      >
        <Link to="/">
          <Flex align="center" gap={2}>
            <Flex
              w="34px"
              h="34px"
              bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
              borderRadius="9px"
              align="center"
              justify="center"
            >
              <Icon as={FaGraduationCap} color="white" fontSize="16px" />
            </Flex>
            <Text
              fontSize="17px"
              fontWeight={800}
              color="#0f172a"
              letterSpacing="-0.5px"
            >
              Test
              <Text as="span" color="#4a72b8">
                Wala
              </Text>
            </Text>
          </Flex>
        </Link>

        <Flex align="center" gap={1} display={{ base: "none", md: "flex" }}>
          {LINKS.filter((l) => !l.auth || user).map((link) => (
            <Link key={link.to} to={link.to}>
              <Box
                px={4}
                py={2}
                borderRadius="9px"
                fontSize="13px"
                fontWeight={isActive(link.to) ? 700 : 500}
                color={isActive(link.to) ? "#4a72b8" : "#475569"}
                bg={isActive(link.to) ? "#eff6ff" : "transparent"}
                _hover={{ bg: "#f1f5f9", color: "#1e3a5f" }}
                transition="all .15s"
              >
                {link.label}
              </Box>
            </Link>
          ))}
        </Flex>

        <Flex align="center" gap={2}>
          {user ? (
            <Menu>
              <MenuButton>
                <Flex
                  align="center"
                  gap={2}
                  bg="#f8fafc"
                  border="1px solid #e2e8f0"
                  borderRadius="10px"
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: "#f1f5f9" }}
                >
                  <Avatar
                    size="xs"
                    name={user.Name || user.Email}
                    bg="#4a72b8"
                    color="white"
                    fontSize="11px"
                    fontWeight={800}
                  />
                  <Text
                    fontSize="13px"
                    fontWeight={600}
                    color="#374151"
                    maxW="100px"
                    noOfLines={1}
                    display={{ base: "none", sm: "block" }}
                  >
                    {user.Name || user.name || user.Email?.split("@")[0]}
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList
                borderRadius="12px"
                border="1px solid #e2e8f0"
                boxShadow="0 8px 30px rgba(0,0,0,.1)"
                py={2}
                fontSize="13px"
                minW="180px"
              >
                <Box px={4} py={2} mb={1}>
                  <Text fontWeight={700} color="#0f172a" noOfLines={1}>
                    {user.Name || user.name}
                  </Text>
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
                <MenuDivider />
                <MenuItem
                  icon={<Icon as={FaSignOutAlt} color="#ef4444" />}
                  onClick={handleSignOut}
                  color="#ef4444"
                  fontWeight={600}
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
                  fontWeight={600}
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
                  fontWeight={700}
                  borderRadius="9px"
                  _hover={{ opacity: 0.9 }}
                  boxShadow="0 2px 8px rgba(74,114,184,.3)"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
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

      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="xs">
        <DrawerOverlay />
        <DrawerContent fontFamily="'Sora',sans-serif">
          <DrawerCloseButton />
          <DrawerHeader
            borderBottom="1px solid #f1f5f9"
            fontSize="15px"
            fontWeight={800}
          >
            Menu
          </DrawerHeader>
          <DrawerBody py={4}>
            <Stack spacing={1}>
              {LINKS.filter((l) => !l.auth || user).map((link) => (
                <Flex
                  key={link.to}
                  align="center"
                  gap={3}
                  px={4}
                  py={3}
                  borderRadius="10px"
                  fontSize="14px"
                  fontWeight={600}
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
              {user ? (
                <Flex
                  align="center"
                  gap={3}
                  px={4}
                  py={3}
                  borderRadius="10px"
                  fontSize="14px"
                  fontWeight={600}
                  color="#ef4444"
                  cursor="pointer"
                  onClick={handleSignOut}
                  _hover={{ bg: "#fef2f2" }}
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
                    fontWeight={600}
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
                    fontWeight={700}
                    color="white"
                    bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
                    cursor="pointer"
                    onClick={() => {
                      navigate("/auth/signup");
                      onClose();
                    }}
                  >
                    Account Banao
                  </Box>
                </>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}



export default Navbar;