import React, { useEffect, useState } from "react";
// import TakeTest from "./TakeTest";
import { border, Box, Button, Center, Flex, useMediaQuery } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Container,Grid,GridItem } from "@chakra-ui/react";
import Slideshow from "./Slideshow";
// import CalculateIcon from '@mui/icons-material/Calculate';
const Home = ({ category,setQuestions,handleFullScreen,settestTitle }) => {
  // console.log("c==", category[0].question);
 
  return (
    <>
      <Box w={"100%"} border={"1px solid red"}>
        <Box
          w={"100%"}
          h={"350px"}
          p={"3"}
          position="relative"
          border="1px solid blue"
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
          ></Box>
        </Box>

        {/* <Slideshow/> */}
        <Box w={"90%"} m={"auto"} h={"200px"} border={"1px solid red"}>
          <Flex
            w={"100%"}
            h={"100%"}
            borderRadius={"10px"}
            p={"12px"}
            justifyContent={"space-around"}
            border={"1px solid red"}
            templateColumns="repeat(3 , 1fr)"
            gap={9}
          >
           
            <Box
              w={"200px"}
              h={"100%"}
              fontFamily={"monospace"}
              bg={"red"}
              borderRadius={"10px"}
              border={"4px solid blue"}
            >
              <Box></Box>
              <Button fontSize={"x-large"} w={"90%"}>
                <b>Maths</b>
              </Button>
            </Box>
            <Box
              w={"200px"}
              h={"100%"}
              fontFamily={"monospace"}
              bg={"red"}
              borderRadius={"10px"}
              border={"4px solid blue"}
            >
              <Button fontSize={"x-large"} w={"90%"}>
                <b>Maths</b>
              </Button>
            </Box>
            <Box
              w={"200px"}
              h={"100%"}
              fontFamily={"monospace"}
              bg={"red"}
              borderRadius={"10px"}
              border={"4px solid blue"}
            >
              <Button fontSize={"x-large"} w={"90%"}>
                <b>Maths</b>
              </Button>
            </Box>
            <Box
              w={"200px"}
              h={"100%"}
              fontFamily={"monospace"}
              bg={"red"}
              borderRadius={"10px"}
              border={"4px solid blue"}
            >
              <Button fontSize={"x-large"} w={"90%"}>
                <b>Maths</b>
              </Button>
            </Box>
            {/* {category.map((e, i) => (
              <Box
                w={"250px"}
                bg={"#4285f4 "}
                border={"1px solid red"}
                overflow={"hidden"}
                borderRadius={"10px"}
              >
                <Link
                  to={"/test"}
                  onClick={() => {
                    setQuestions(e.question);
                    handleFullScreen(true);
                    settestTitle(e.section);
                  }}
                >
                  <Box
                    // bg={"#1f4985"}
                    // mt={"430"}
                    _hover={"orange"}
                    w="100%"
                    h={"100%"}
                    color={"white"}
                  >
                    <b>{e.section}</b>
                  </Box>
                </Link>
              </Box>
            ))} */}
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default Home;
