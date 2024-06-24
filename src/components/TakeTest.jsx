import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  // Checkbox,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  // Tag,
  Text,
} from "@chakra-ui/react";
import ModalPause from "./ModalPause";
const TakeTest = (quest, testTitle) => {
  const [currentquestion, setcurrentquestion] = useState(0);
  const [question, setquestion] = useState(quest);
  // const [answerSelected, setAnswerSelected] = useState(false);
  const [answeredQuestion, setAnsweredQuestion] = useState([]);
  const [markedAndAnswer, setMarkedAndAnswer] = useState([]);
  const [markedNotAnswer, setMarkedNotAnswer] = useState([]);
  const [notAnswer, setNotAnswer] = useState([]);
  const [answer, setans] = useState(null);
  const [allAns, setAllAns] = useState([]);
  const [collectAns, setcollectAns] = useState({});
  const handlequestion = (con) => {
    if (con === "svn") {
      if (answer !== null && !answeredQuestion.includes(currentquestion)) {
        setans(null);
        if (markedNotAnswer.includes(currentquestion)) {
          let removeFromMarkedNotAnswer =
            markedNotAnswer.indexOf(currentquestion);
          markedNotAnswer.splice(removeFromMarkedNotAnswer, 1);
          console.log(removeFromMarkedNotAnswer);
        }

        if (notAnswer.includes(currentquestion)) {
          let removeFromNotAnswer = notAnswer.indexOf(currentquestion);
          notAnswer.splice(removeFromNotAnswer, 1);
          console.log(removeFromNotAnswer);
        }

        if (markedAndAnswer.includes(currentquestion)) {
          let removeFromMarkedAndAnswer =
            markedAndAnswer.indexOf(currentquestion);
          markedAndAnswer.splice(removeFromMarkedAndAnswer, 1);
          console.log(removeFromMarkedAndAnswer);
        }

        setAnsweredQuestion([...answeredQuestion, currentquestion]);
        if (question.quest.length - 1 > currentquestion) {
          setcurrentquestion(currentquestion + 1);
        }
      } else if (answer === null) {
        if (!notAnswer.includes(currentquestion)) {
          if (markedNotAnswer.includes(currentquestion)) {
            let removeFromMarkedNotAnswer =
              markedNotAnswer.indexOf(currentquestion);
            markedNotAnswer.splice(removeFromMarkedNotAnswer, 1);
            console.log(removeFromMarkedNotAnswer);
          }
          if (markedAndAnswer.includes(currentquestion)) {
            let removeFromMarAndAnswer =
              markedAndAnswer.indexOf(currentquestion);
            markedAndAnswer.splice(removeFromMarAndAnswer, 1);
            console.log(removeFromMarAndAnswer);
          }
          if (notAnswer.includes(currentquestion)) {
            let removeFromNotAnswer = notAnswer.indexOf(currentquestion);
            notAnswer.splice(removeFromNotAnswer, 1);
            console.log(removeFromNotAnswer);
          }

          // if (answeredQuestion.includes(currentquestion)) {
          //   let removeFromMarkedAndAnswer = answeredQuestion.indexOf(currentquestion);
          //   answeredQuestion.splice(removeFromMarkedAndAnswer, 1);
          //   console.log(removeFromMarkedAndAnswer);
          // }
          setNotAnswer([...notAnswer, currentquestion]);
          console.log("in");
        }
      

      }  if (question.quest.length - 1 > currentquestion) {
          setcurrentquestion(currentquestion + 1);
          // console.log("ac1", con);
        }
    } else {
      if (answer !== null && !answeredQuestion.includes(currentquestion)) {
        if (markedNotAnswer.includes(currentquestion)) {
          let removeFromMarkedNotAnswer =
            markedNotAnswer.indexOf(currentquestion);
          markedNotAnswer.splice(removeFromMarkedNotAnswer, 1);
          console.log(removeFromMarkedNotAnswer);
        }

        if (notAnswer.includes(currentquestion)) {
          let removeFromNotAnswer = notAnswer.indexOf(currentquestion);
          notAnswer.splice(removeFromNotAnswer, 1);
          console.log(removeFromNotAnswer);
        }

        if (markedAndAnswer.includes(currentquestion)) {
          let removeFromMarkedAndAnswer =
            markedAndAnswer.indexOf(currentquestion);
          markedAndAnswer.splice(removeFromMarkedAndAnswer, 1);
          console.log(removeFromMarkedAndAnswer);
        }

        setAnsweredQuestion([...answeredQuestion, currentquestion]);
        if (question.quest.length - 1 > currentquestion) {
          setcurrentquestion(con);
          // console.log("aq2");
          setans(null);
        }
      } else if (
        answer === null &&
        !notAnswer.includes(currentquestion) &&
        currentquestion !== con
      ) {
        if (markedNotAnswer.includes(currentquestion)) {
          let removeFromMarkedNotAnswer =
            markedNotAnswer.indexOf(currentquestion);
          markedNotAnswer.splice(removeFromMarkedNotAnswer, 1);
          console.log(removeFromMarkedNotAnswer);
        }

        if (notAnswer.includes(currentquestion)) {
          let removeFromNotAnswer = notAnswer.indexOf(currentquestion);
          notAnswer.splice(removeFromNotAnswer, 1);
          console.log(removeFromNotAnswer);
        }

        // if (answeredQuestion.includes(currentquestion)) {
        //   let removeFromMarkedAndAnswer = answeredQuestion.indexOf(currentquestion);
        //   answeredQuestion.splice(removeFromMarkedAndAnswer, 1);
        //   console.log(removeFromMarkedAndAnswer);
        setNotAnswer([...notAnswer, currentquestion]);

        if (question.quest.length - 1 > currentquestion) {
          setcurrentquestion(con);
          // console.log("ac2", con);
        }
      }
      if (con !== isNaN) {
        setcurrentquestion(con);
        // console.log("ac2", con);
      }
    }
  };
  // console.log(currentquestion);
  const markedQuestion = () => {
    if (answer !== null && !markedAndAnswer.includes(currentquestion)) {
      if (markedNotAnswer.includes(currentquestion)) {
        let removeFromMarkedNotAnswer =
          markedNotAnswer.indexOf(currentquestion);
        markedNotAnswer.splice(removeFromMarkedNotAnswer, 1);
        console.log(removeFromMarkedNotAnswer);
      }

      if (notAnswer.includes(currentquestion)) {
        let removeFromNotAnswer = notAnswer.indexOf(currentquestion);
        notAnswer.splice(removeFromNotAnswer, 1);
        console.log(removeFromNotAnswer);
      }

      if (answeredQuestion.includes(currentquestion)) {
        let removeFromAnswer = answeredQuestion.indexOf(currentquestion);
        answeredQuestion.splice(removeFromAnswer, 1);
        console.log(removeFromAnswer);
      }

      setMarkedAndAnswer([...markedAndAnswer, currentquestion]);
      setans(null);
    }

    // markdnn
    if (answer === null && !markedNotAnswer.includes(currentquestion)) {
      if (markedAndAnswer.includes(currentquestion)) {
        if (question.quest.length - 1 > currentquestion) {
          setcurrentquestion(currentquestion + 1);
          return;
        }
      }

      if (notAnswer.includes(currentquestion)) {
        let removeFromNotAnswer = notAnswer.indexOf(currentquestion);
        notAnswer.splice(removeFromNotAnswer, 1);
        console.log(removeFromNotAnswer);
      }

      if (answeredQuestion.includes(currentquestion)) {
        let removeFromAnswer = answeredQuestion.indexOf(currentquestion);
        answeredQuestion.splice(removeFromAnswer, 1);
        console.log(removeFromAnswer);
      }

      setMarkedNotAnswer([...markedNotAnswer, currentquestion]);
    }
    if (question.quest.length - 1 > currentquestion) {
      setcurrentquestion(currentquestion + 1);
    }
  };
  // console.log(currentquestion,markedNotAnswer,notAnswer);
  const handleAnswer = (ans, qus) => {
    setans(qus);

    if (answeredQuestion.includes(currentquestion)) {
      let removeFromAnswer = answeredQuestion.indexOf(currentquestion);
      answeredQuestion.splice(removeFromAnswer, 1);
      allAns.splice(removeFromAnswer, 1);
      console.log(removeFromAnswer);
      setAllAns([...allAns, qus]);
      setAnsweredQuestion([...answeredQuestion, currentquestion]);
    } else {
      setAllAns([...allAns, qus]);
      setAnsweredQuestion([...answeredQuestion, currentquestion]);
    }
    // if (question.quest.length - 1 > currentquestion) {
    //   setcurrentquestion(currentquestion + 1);
    // }
    console.log(
      "ssa",
      // question.quest.length,
      // "ma",
      // markedAndAnswer,
      // "na",
      // notAnswer,
      "a",
      answeredQuestion,
      "c",
      // markedNotAnswer,
      currentquestion,
      qus,
      allAns
    );
  };

  //    useEffect(() => {
  //     if (questions.length != "") {
  //       const id = setInterval(() => {
  //         if (hour != 0 && min <= 0) {
  //           setHour(hour - 1);
  //           setMin(60);
  //         } else if (min != 0) {
  //           setMin(min - 1);
  //         } else if (min == 0 && hour == 0) {
  //           alert("your time is up!");
  //           navigate("/test-result");

  //           clearInterval();
  // if(isFullScreen){
  //       handleFullScreen();
  //     }
  //           return 0;
  //         }
  //         return min - 1;
  //       }, 1000);

  //       return () => clearInterval(id);
  //     }
  //     setquest(quest);
  //     handleQuestionClick(0);z
  //     // Cleanup function to clear interval
  //   }, [handleFullScreen, handleQuestionClick, hour, isFullScreen, min, navigate, quest, questions.length]); // Added hour to dependency array
  // console.log("question :", question.quest[0].qus, "\n", testTitle);
  return (
    <>
      <Container bg={"white"} color={"black"} p={"%"} maxWidth={"100%"}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          color={"black"}
          p={"0.6%"}
          maxWidth={"100%"}
        >
          <Text fontSize={"26px"}>
            <b>Revision Karle</b>
          </Text>
          <Text>
            Time Left <Text as={"span"}>00</Text>:<Text as={"span"}>59</Text>:
            <Text as={"span"}>39</Text>
          </Text>
          <Box>
            <Button border={"1px solid #01bfbd"} color={"#01bfbd"} mr={"12px"}>
              Enter Full Screen
            </Button>
            <ModalPause />
          </Box>
        </Box>{" "}
      </Container>
      <Box display={"flex"} h={"100^"}>
        <Box w={"100%"}>
          <Box
            boxShadow="rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em"
            p={"1%"}
            w={"100%"}
          >
            <Text>
              SECTIONS | <Text as={"span"}>Elementary maths</Text>
            </Text>
          </Box>{" "}
          <Box p={"1%"} w={"100%"}>
            <Text>
              <b>Question no {currentquestion + 1}</b>
            </Text>
          </Box>
          <Box
            boxShadow="rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em"
            p={"1%"}
            h={"574px"}
            w={"100%"}
          >
            {/* {question.length>0 && question.quest.map((d) )} */}
            <Text m={"1%"}>{question.quest[currentquestion]?.qus}</Text>
            <RadioGroup>
              {question.quest[currentquestion]?.options.map((d, i) => (
                <Box
                  onClick={() => {
                    handleAnswer(d, i);
                  }}
                >
                  <Radio m={"1%"} value={d}>
                    {d}
                  </Radio>
                  <br></br>{" "}
                </Box>
              ))}
            </RadioGroup>
          </Box>
          <Box
            display={"flex"}
            boxShadow="rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em"
            w={"100%"}
            p={"0.5%"}
            justifyContent={"space-between"}
          >
            <ButtonGroup>
              <Button
                onClick={() => markedQuestion()}
                border={"1px solid #01bfbd"}
                color={"#01bfbd"}
              >
                Mark for priview & Next
              </Button>
              <Button border={"1px solid #01bfbd"} color={"#01bfbd"}>
                Clear Response
              </Button>
            </ButtonGroup>
            <Button
              onClick={() => handlequestion("svn")}
              border={"1px solid #01bfbd"}
              color={"#01bfbd"}
            >
              Save & Next
            </Button>
          </Box>
        </Box>

        {/* slider */}
        <Box
          boxShadow="rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em"
          p={"1%"}
          w={"25%"}
        >
          <Box>
            <Text fontSize={"larger"}>
              <b>Pablo</b>
            </Text>
          </Box>
          <hr />
          <Box mt={"3%"} mb={"3%"}>
            <Box justifyContent={"space-between"}>
              <Text>
                Marked{" "}
                <Text
                  w={"auto"}
                  pl={"1.5%"}
                  pr={"1.5%"}
                  backgroundColor={"purple"}
                  color={"white"}
                  borderRadius={"50%"}
                  as={"span"}
                >
                  {markedNotAnswer.length}
                </Text>{" "}
              </Text>{" "}
              <Text>
                Not visited{" "}
                <Text
                  w={"auto"}
                  pl={"1.5%"}
                  pr={"1.5%"}
                  // backgroundColor={"purple"}
                  // color={"white"}
                  border={"1px solid gray"}
                  // borderRadius={"50%"}
                  as={"span"}
                >
                  {question.quest.length -
                    (markedAndAnswer.length +
                      markedNotAnswer.length +
                      answeredQuestion.length +
                      notAnswer.length)}
                </Text>
              </Text>
              <Text>
                Answered{" "}
                <Text
                  w={"auto"}
                  pl={"1.5%"}
                  pr={"1.5%"}
                  backgroundColor={"green"}
                  color={"white"}
                  borderTopLeftRadius={"50%"}
                  borderTopRightRadius={"50%"}
                  as={"span"}
                >
                  {answeredQuestion.length}
                </Text>
              </Text>
              <Text>
                Not Answered{" "}
                <Text
                  w={"auto"}
                  pl={"1.5%"}
                  pr={"1.5%"}
                  backgroundColor={"red"}
                  color={"white"}
                  borderBottomLeftRadius={"50%"}
                  borderBottomRightRadius={"50%"}
                  as={"span"}
                >
                  {notAnswer.length}
                </Text>
              </Text>
              <Text>
                Marked & Answered{" "}
                <Text
                  w={"auto"}
                  pl={"1.5%"}
                  pr={"1.5%"}
                  backgroundColor={"purple"}
                  color={"white"}
                  borderRadius={"50%"}
                  as={"span"}
                >
                  {markedAndAnswer.length} ✓
                </Text>
              </Text>
            </Box>
            <hr />
          </Box>

          <Text mb={"3%"}>Section : Average Type 1</Text>
          <hr />
          <Box mt={"10%"} h={"57%"} borderBottom={"1px solid gray"}>
            <Grid
              templateColumns="repeat(5, 1fr)"
              rowGap={"10%"}
              columnGap={"6%"}
              textAlign={"center"}
            >
              {question.quest?.map((d, i) => (
                <Box
                  onClick={() => handlequestion(i)}
                  background={
                    markedNotAnswer.includes(i)
                      ? "purple"
                      : answeredQuestion.includes(i)
                      ? "green"
                      : notAnswer.includes(i)
                      ? "red"
                      : markedAndAnswer.includes(i)
                      ? "purple"
                      : null
                  }
                  borderRadius={
                    markedAndAnswer.includes(i)
                      ? "50%"
                      : markedNotAnswer.includes(i)
                      ? "50%"
                      : answeredQuestion.includes(i)
                      ? "50% 50% 0% 0%"
                      : notAnswer.includes(i)
                      ? "0% 0% 50% 50%"
                      : null
                  }
                  color={
                    markedAndAnswer.includes(i)
                      ? "white"
                      : markedNotAnswer.includes(i)
                      ? "white"
                      : answeredQuestion.includes(i)
                      ? "white"
                      : notAnswer.includes(i)
                      ? "white"
                      : null
                  }
                  cursor={"pointer"}
                  border={"1px solid gray"}
                >
                  {markedAndAnswer.includes(i) ? <>{i + 1} ✓</> : <>{i + 1}</>}
                </Box>
              ))}
            </Grid>
          </Box>
          <Box borderBottom={"1px solid gray"}>
            <Button
              mt={"3%"}
              mb={"3%"}
              border={"1px solid #01bfbd"}
              w={"100%"}
              color={"#01bfbd"}
            >
              Instruction
            </Button>
          </Box>
          <Box>
            <Button
              mt={"3%"}
              // mb={"3%"}
              border={"1px solid #01bfbd"}
              w={"100%"}
              color={"#01bfbd"}
            >
              Submit Test
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default TakeTest;
