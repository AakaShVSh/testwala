import React, { useEffect, useState } from "react";
// import TakeTest from "./TakeTest";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Container } from "@chakra-ui/react";
const Home = ({ category,setQuestions }) => {
  // console.log("c==", category[0].question);

  return (
    <>
      <Container>
        {category.map((e,i) => (
          <>
            <Link to={"/test"}
      
            onClick={() => setQuestions(e.question)}
            >
              <Button bg={"#1f4985"} m="2% auto" color={"white"}>
                {e.section}
              </Button>
            </Link>
          </>
        ))}
      </Container>
    </>
  );
};

export default Home;
