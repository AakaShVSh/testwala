import React, { useEffect, useState } from "react";
// import TakeTest from "./TakeTest";
import { Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { Container } from "@chakra-ui/react";
const Home = ({ category,setQuestions,settestTitle }) => {
  // console.log("c==", category[0].question);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  return (
    <>
      <Container>
        {category.map((e,i) => (
          <>
            <Link to={"/test"}
      
            onClick={() => {setQuestions(e.question)
            handleFullScreen();
            settestTitle(e.section)
            }}
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
