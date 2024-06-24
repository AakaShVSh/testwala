import React, { useEffect, useState } from "react";
// import TakeTest from "./TakeTest";
import { Button, Flex } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Container,Grid,GridItem } from "@chakra-ui/react";
import Slideshow from "./Slideshow";
const Home = ({ category,setQuestions,handleFullScreen,settestTitle }) => {
  // console.log("c==", category[0].question);

 
  return (
    <>
      <Container maxW={"100%"} mt={"3%"} ml={"20%"} >
        {/* <Slideshow/> */}
       <Grid templateColumns='repeat(7 , 1fr)'  gap={6} >
        {category.map((e,i) => (
          <GridItem>
            <Link to={"/test"}
      
            onClick={() => {setQuestions(e.question)
            handleFullScreen();
            settestTitle(e.section)
            }}
            >
              <Button bg={"#1f4985"} mt={"430"} _hover={"orange"} w="90%"  color={"white"}>
                {e.section}
              </Button>
            </Link>
          </GridItem>
        ))} 
        </Grid>
      </Container>
    </>
  );
};

export default Home;
