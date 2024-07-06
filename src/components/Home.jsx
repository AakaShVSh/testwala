import React, { useEffect, useState } from "react";
// import TakeTest from "./TakeTest";
import { border, Box, Button, Center, Flex, Text, useMediaQuery } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Container,Grid,GridItem } from "@chakra-ui/react";
import Slideshow from "./Slideshow";
// import CalculateIcon from '@mui/icons-material/Calculate';
const Home = () => {
  // console.log("c==", category[0].question);
 
  return (
    <>
      <Box w={"100%"}>
        <Box
          bg={"#f44758"}
          w={"90%"}
          borderRadius={"3px"}
          m={"12px auto"}
          h={"350px"}
          p={"3"}
          position="relative"
          // border="1px solid blue"
        >
          {/* <Box w={"160px"} h={"120px"} bg={"#113461"}></Box> */}
          <Box
            w={"160px"}
            h={"120px"}
            borderRadius={"90% 60px 90% 0px"}
            position="absolute"
            bg={"#f41eff"}
          ></Box>
          <Box
            w={"160px"}
            m={"5"}
            position="absolute"
            borderRadius={"60% 0px 90% 60px"}
            h={"120px"}
            bg={"#ffc71e"}
          ></Box> <Slideshow/>
        </Box>

       
        <Box
          w={"90%"}
          m={"20px auto"}
          bg={"#c4d2ef"}
          h={"200px"}
          borderRadius={"10px"}
          // border={"1px solid red"}
          boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
        >
          <Flex
            w={"100%"}
            h={"100%"}
            p={"12px"}
            justifyContent={"space-around"}
            // border={"1px solid red"}
            templateColumns="repeat(3 , 1fr)"
            gap={9}
          >
            <Box
              w={"200px"}
              h={"100%"}
              fontFamily={"monospace"}
              bg={"white"}
              borderRadius={"10px"}
              p={"2%"}
              border={"1px solid #01bfbd"}
            >
              <Box
                w={"50px"}
                bg={"orange"}
                m={"auto"}
                borderRadius={"50%"}
                h={"50px"}
              ></Box>
              <Text></Text>
              <Link to={"/questionList"}>
                <Box
                  m={" 40px auto "}
                  textAlign={"center"}
                  p={"4px"}
                  borderRadius={"3px"}
                  bg={"#4285f4"}
                  fontSize={"x-large"}
                  w={"95%"}
                >
                  <b>Maths</b>
                </Box>
              </Link>
            </Box>
            <Box
              w={"200px"}
              h={"100%"}
              fontFamily={"monospace"}
              // bg={"red"}
              bg={"white"}
              borderRadius={"10px"}
              p={"2%"}
              border={"1px solid #01bfbd"}
            >
              <Box
                w={"50px"}
                bg={"orange"}
                m={"auto"}
                borderRadius={"50%"}
                h={"50px"}
              ></Box>
              <Text></Text>
              <Box
                m={" 40px auto "}
                textAlign={"center"}
                p={"4px"}
                borderRadius={"3px"}
                bg={"#4285f4"}
                fontSize={"x-large"}
                w={"95%"}
              >
                <b>English</b>
              </Box>
            </Box>{" "}
            <Box
              w={"200px"}
              h={"100%"}
              fontFamily={"monospace"}
              // bg={"red"}
              bg={"white"}
              borderRadius={"10px"}
              p={"2%"}
              border={"1px solid #01bfbd"}
            >
              <Box
                w={"50px"}
                bg={"orange"}
                m={"auto"}
                borderRadius={"50%"}
                h={"50px"}
              ></Box>
              <Text></Text>
              <Box
                m={" 40px auto "}
                textAlign={"center"}
                p={"4px"}
                borderRadius={"3px"}
                bg={"#4285f4"}
                fontSize={"x-large"}
                w={"95%"}
              >
                <b>Reasoning</b>
              </Box>
            </Box>
            <Box
              w={"200px"}
              h={"100%"}
              fontFamily={"monospace"}
              bg={"white"}
              // bg={"red"}
              borderRadius={"10px"}
              p={"2%"}
              border={"1px solid #01bfbd"}
            >
              <Box
                w={"50px"}
                bg={"orange"}
                m={"auto"}
                borderRadius={"50%"}
                h={"50px"}
              ></Box>
              <Text></Text>
              <Box
                m={" 40px auto "}
                textAlign={"center"}
                p={"4px"}
                borderRadius={"3px"}
                bg={"#4285f4"}
                fontSize={"x-large"}
                w={"95%"}
              >
                <b>General(GS)</b>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default Home;
