import React from "react";
import { Box, Flex, Text, Icon, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <Box
      bg="#0f1e3a"
      px={{ base: 4, md: 8 }}
      py={8}
      fontFamily="'Sora',sans-serif"
    >
      <Box maxW="1200px" mx="auto">
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          flexWrap="wrap"
          gap={6}
        >
          <Flex align="center">
            <Image
              src={logo}
              alt="TestWala"
              h={{ base: "40px", md: "48px", lg: "70px" }}
              w="auto"
              objectFit="cover"
              transform="scale(1.6)"
              transformOrigin="left center"
            />
          </Flex>

          <Flex gap={5} flexWrap="wrap">
            <Link to="/">
              <Text
                fontSize="13px"
                color="rgba(255,255,255,.4)"
                _hover={{ color: "white" }}
              >
                Home
              </Text>
            </Link>
            <Link to="/coaching">
              <Text
                fontSize="13px"
                color="rgba(255,255,255,.4)"
                _hover={{ color: "white" }}
              >
                Coaching
              </Text>
            </Link>
            <Link to="/about">
              <Text
                fontSize="13px"
                color="rgba(255,255,255,.4)"
                _hover={{ color: "white" }}
              >
                About Us
              </Text>
            </Link>
            <Link to="/feedback">
              <Text
                fontSize="13px"
                color="rgba(255,255,255,.4)"
                _hover={{ color: "white" }}
              >
                Feedback
              </Text>
            </Link>
            <Link to="/terms">
              <Text
                fontSize="13px"
                color="rgba(255,255,255,.4)"
                _hover={{ color: "white" }}
              >
                Terms and Conditions
              </Text>
            </Link>
            <Link to="/privacy">
              <Text
                fontSize="13px"
                color="rgba(255,255,255,.4)"
                _hover={{ color: "white" }}
              >
                Privacy and Policy
              </Text>
            </Link>
          </Flex>
        </Flex>

        <Box h="1px" bg="rgba(255,255,255,.07)" my={6} />

        <Flex justify="space-between" align="center" flexWrap="wrap" gap={2}>
          <Text fontSize="12px" color="rgba(255,255,255,.3)">
            © {new Date().getFullYear()} TestWala. All rights reserved.
          </Text>
          <Flex align="center" gap={1}>
            <Text fontSize="12px" color="rgba(255,255,255,.3)">
              Made with
            </Text>
            <Icon as={FaHeart} color="#ef4444" fontSize="10px" />
            <Text fontSize="12px" color="rgba(255,255,255,.3)">
              for Indian students
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
}
