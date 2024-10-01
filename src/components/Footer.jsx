import { Box, Center, Flex, Image, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";
import logo from "../logo.svg"
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <Box
        // textAlign={"lft"}
        w={"100%"}
        display={"flex"}
        mt={"5%"}
        bg={"#1f4985"}
        fontFamily={"sans-serif"}
        color={"white"}
        // border={"1px solid red"}
        h={"250px"}
      >
        <Box w={"60%"}>
          <Box
            boxSize={"sm"}
            w={{ base: "40%", md: "22%", lg: "100%" }}
            h={"auto"}
            m={"auto"}
            bg="#1f4985"
          >
            <Link to={"/"}>
              {" "}
              <Image
                src={logo}
                bg={"#1f4985"}
                // w={"20%"}
                // pb={"3%"}
                fontColor={"White"}
                alt="logo"
              />
            </Link>
          </Box>
        </Box>
        <Flex
          // display={"flex"}
          m={"4"}
          justifyContent={"space-around"}
          lineHeight={"7"}
        >
          <Box mr={"9"}>
            <UnorderedList styleType="''">
              <Text>About Us</Text>
              <Link to={"/GiveFeedback"}>
                <ListItem>Give Feedback</ListItem>
              </Link>
              <ListItem>policy</ListItem>
              <ListItem>Conact us</ListItem>
              <ListItem>Privacy</ListItem>
            </UnorderedList>{" "}
          </Box>
          <Box mr={"9"}>
            <UnorderedList styleType="''">
              <Text>Help</Text>
              <ListItem>Support</ListItem>
              <ListItem>F&Q</ListItem>
              <ListItem>Status</ListItem>
              <ListItem>Conact us</ListItem>
            </UnorderedList>
          </Box>{" "}
          <Box>
            <UnorderedList styleType="''">
              <Text>Help</Text>
              <ListItem>Support</ListItem>
              <ListItem>F&Q</ListItem>
              <ListItem>Status</ListItem>
              <ListItem>Conact us</ListItem>
            </UnorderedList>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default Footer;
