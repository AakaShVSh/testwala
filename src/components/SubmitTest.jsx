import React from "react";
import { Container, Box, Text } from "@chakra-ui/react";

const SubmitTest = ({ mark, TotalQuestion }) => {
  return (
    <>
    <Container 
    borderRadius={"5px"}
      maxWidth={"97%"}
      // backgroundColor={"#e9e9e9"}
      alignItems={"center"}
      padding={"1%"}
      m={"1% auto"}
      justifyContent={"space-between"}
      display={"flex"}
      // border="1px"
      // borderColor="black.200"
      // boxShadow= "rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px"
      boxShadow= "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px"
      >
     
      <Box>
        <Text  p={"10px"} w={"100%"} >
          Your Score:-
          {mark}
        </Text>
      </Box>
      <Box>
        <Text  p={"10px"} w={"100%"} textAlign={"center"}>
          Percentile:-
          {((mark / (TotalQuestion * 2)) * 100).toFixed(2)}
        </Text>
      </Box>
      <Box>
        <Text  p={"10px"} w={"100%"} textAlign={"center"}>
          Mode:-Easy
        </Text>
      </Box>
      <Box>
        <Text  p={"10px"} w={"100%"} textAlign={"center"}>
          Rank:-1/100
        </Text>
      </Box>
      <hr />
    
    </Container>
    </>
    
  );
};

export default SubmitTest;
