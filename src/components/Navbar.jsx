import React from "react";
import logo from "../logo.svg";
import {
  Container,
  Text,
  Image,
  Box,
  Heading,
  Button,
  Input,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
const Navbar = () => {
  return (
    <>
      <Container
        // bg={"whitesmoke"}
        pt="10px"
        pl={"3%"}
        pr={"4%"}
        maxW="100%"
        // mt={"1%"}
        // borderRadius={"10px"}
        // color={"#5c4ce3"}
        display={"flex"}
        justifyContent={"space-between"}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        bg={"#465074"}
        boxShadow="rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
      >
        <Box
          boxSize={"sm"}
          w={{ base: "40%", md: "22%", lg: "13%" }}
          h={"auto"}
          bg="#465074"
        ><Link to={"/"}>
          {" "}
          <Image
            src={logo}
            bg={"#465074"}
            pb={"3%"}
            fontColor={"White"}
            alt="logo"
          /></Link>
        </Box>
        <Box
          as={"b"}
          mb={"10px"}
          w={"40%"}
          bg="#465074"
          visibility={{ base: "hidden", md: "visible", lg: "visible" }}
        >
          <Input
            type="search"
            placeholder="Search subject"
            w="100%"
            bg="#fbfbfb"
          />
        </Box>
        <Link to={"/auth/signin"}>
          {/* <Button 
          colorScheme="orange"
          >
            SignIn
          </Button> */}
          <Button rightIcon={<FaRegUserCircle />} colorScheme='blue' color={"white"} bg={"gray"} variant='outline'>
    Sign in
  </Button>
        </Link>
      </Container>
    </>
  );
};

export default Navbar;
