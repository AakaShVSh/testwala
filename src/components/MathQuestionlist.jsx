import { Box, Divider, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const MathQuestionlist = ({
  category,
  setQuestions,
  handleFullScreen,
  settestTitle,
}) => {

 const [MathSubject,setMathSubject] = useState("")
const [sscCglMathsSyllabus] = useState([
    "Number System",
    "L.C.M and H.C.F",
    "Surds and Indices",
    "Algebraic Identities",
    "Percentage",
    "Profit and Loss",
    "Simple and Compound Interest",
    "Average",
    "Ratio and Proportion",
    "Partnership",
    "Problems with Ages",
    "Time and Distance",
    "Pipe and Cistern",
    "Mixture and Alligation",
    "Distance, Time, and Speed",
    "Problems based on Train, Boat, and Stream",
    "Mensuration 2D & 3D",
    "Geometry and Co-ordinate Geometry (Graphs of Linear Equations)",
    "Trigonometry",
    "Data Interpretation"
]);
console.log(MathSubject,category);
  return (
    <>
      <Flex w={"100%"}>
        <Box
          w={"75%"}
          bg={"#c4d2ef"}
          // border={"1px solid red"}
          p={"20px"}
          borderRadius={"4px"}
          m={"20px"}
        >
          <Heading>{MathSubject!==""?<>{MathSubject}</>:"Maths"}</Heading>

          {MathSubject !== "" ? (
            <>
              {" "}

              {category.map((e, i) => (
                <>
                {e.topic===MathSubject?
                <Box cursor={"pointer"}
                  w={"100%"}
                  mt={"2"}
                  bg={"#4285f4 "}
                  //   border={"1px solid red"}
                  overflow={"hidden"}
                  p={"2"}
                  borderRadius={"3px"}
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
            :null} </> ))}
            </>
          ) : (
            <>
              {sscCglMathsSyllabus.map((e, i) => (
                <Box
                  w={"100%"}
                  mt={"2"}
                  bg={"#4285f4 "}
                  //   border={"1px solid red"}
                  overflow={"hidden"}
                  p={"2"}
                  borderRadius={"3px"}
                >
                  {/* <Link
                   to={"/test"}
                   onClick={() => {
                   }}
                 > */}
                  <Box
                    // bg={"#1f4985"}
                    // mt={"430"}
                    _hover={"orange"}
                    w="100%"
                    h={"100%"}
                    color={"white"}
                    onClick={() => setMathSubject(e)}
                  >
                    <b>{e}</b>
                  </Box>
                  {/* </Link> */}
                </Box>
              ))}
            </>
          )}
        </Box>
        <Box
          w={"25%"}
          bg={"#c4d2ef"}
          // border={"1px solid red"}
          p={"20px"}
          borderRadius={"4px"}
          mt={"20px"}
          mr={"20px"}
          mb={"20px"}
        >
          <Text w={"100%"} fontSize={"large"}>
            <b>Make a Test</b>
          </Text>
          
        </Box>
      </Flex>
    </>
  );
};

export default MathQuestionlist
