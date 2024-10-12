import {
  Box,
  Center,
  Flex,
  Image,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import React from "react";
import logo from "../logo.svg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <Box
      w={"100%"}
      display={"flex"}
      mt={"5%"}
      bg={"#1f4985"}
      fontFamily={"sans-serif"}
      color={"white"}
      h={""} // Responsive height
      p={{ base: "20px 10%", md: "30px 10%" }} // Responsive padding
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent={"space-between"}
        alignItems={"center"}
        w={"100%"}
      >
        <Box
          boxSize={"sm"}
          w={{ base: "60%", md: "22%", lg: "20%" }}
          h={"auto"}
          m={"auto"}
          bg="#1f4985"
        >
          <Link to={"/"}>
            <Image
              src={logo}
              alt="logo"
              objectFit="contain"
              h={{ base: "100%", md: "60px",lg:"100%" }} // Responsive logo height
              m="auto"
            />
          </Link>
        </Box>

        <Flex
          direction={{ base: "column", md: "row" }}
          justifyContent={"space-around"}
          alignItems={"flex-start"}
          mt={{ base: "20px", md: "0" }} // Margin on mobile
        >
          <Box>
            <UnorderedList styleType="none" spacing={2} color="white">
              <Text fontWeight="bold" mb={2}>
                About Us
              </Text>
              <Link to={"/GiveFeedback"}>
                <ListItem
                  _hover={{ textDecoration: "underline", color: "#cce5ff" }}
                >
                  Give Feedback
                </ListItem>
              </Link>
              <ListItem
                _hover={{ textDecoration: "underline", color: "#cce5ff" }}
              >
                Policy
              </ListItem>
              <ListItem
                _hover={{ textDecoration: "underline", color: "#cce5ff" }}
              >
                Contact Us
              </ListItem>
              <ListItem
                _hover={{ textDecoration: "underline", color: "#cce5ff" }}
              >
                Privacy
              </ListItem>
            </UnorderedList>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Footer;
