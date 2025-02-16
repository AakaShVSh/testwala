import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Text, Divider, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../helpers/localStorage";
import CollapseEx from "./CreateTest";

const SaveQuestion = ({ MathSubject = "", currentSub = "" }) => {
  const navigate=useNavigate();
  const boxes = [
    { title: "English", color: "teal.400" },
    { title: "Maths", color: "blue.400" },
    { title: "Reasoning", color: "green.400" },
    { title: "General studies", color: "red.400" },
  ];
  const navi = () => {
    const math ="math"
    console.log(math,"jjjjjjjjj");
    setLocalStorage("savedtopic",math)
    navigate("/savedData")
  }
  return (
    <>
      {/* Stats Boxes */}
   

      {/* Subject Section */}
      <Box
        display={{ base: "block", md: "flex", lg: "flex" }}
        gap="2"
        w={{ base: "99%", md: "80%", lg: "80%" }}
        m="20px auto"
        bg="#c4d2ef" 
        p="20px"
        borderRadius="4px"
      >
        <Box w="100%">
          <Heading>{MathSubject || currentSub}</Heading>
          <Divider />   <SimpleGrid columns={[1, 2]} spacing={5} p={5}>
        {boxes.map((box, index) => (
          <Box
          onClick={navi}
            key={index}
            bg={box.color}
            color="white"
            p={6}
            borderRadius="lg"
            boxShadow="lg"
            textAlign="center"
            fontWeight="bold"
            fontSize="lg"
            transition="transform 0.3s"
            _hover={{ transform: "scale(1.05)", boxShadow: "xl" }}
          >
            <Text>{box.title}</Text>
          </Box>
        ))}
      </SimpleGrid>
        </Box>
      </Box>
    </>
  );
};

export default SaveQuestion;
