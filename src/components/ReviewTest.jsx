import React, { useEffect, useState } from "react";
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
  useMediaQuery,
} from "@chakra-ui/react";
import ModalPause from "./ModalPause";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../helpers/localStorage";

const ReviewTest = () => {
  const [question, setQuestion] = useState([]);
  const [score, setscore] = useState(null);
  const [category, setcategory] = useState(null);
  const [allAns, setallAnswer] = useState({});
  const [answeredQuestion, setAnsweredQuestion] = useState(null);
  const [notAnswer, setNotAnswer] = useState(null);
  const [markedAndAnswer, setMarkedAndAnswer] = useState(null);
  const [markedNotAnswer, setMarkedNotAnswer] = useState(null);
  const [currentquestion, setcurrentQuestion] = useState(0);

const handleQuestion = (con=null) => {
  if(con!==null){
    setcurrentQuestion(con)
  }
  else{
    setcurrentQuestion(currentquestion+1)
  }
}

  useEffect(() => {
    const getData = () => {
      const data = getLocalStorage("test");

      setQuestion(data[0].questions);
      setscore(data[0].score);
      setcategory(data[0].category);
      setallAnswer(data[0].allAnswer);
      setAnsweredQuestion(data[0].answeredQuestion);
      setNotAnswer(data[0].notAnswer);
      setMarkedAndAnswer(data[0].markedAndAnswer);
      setMarkedNotAnswer(data[0].markedNotAnswer);
      console.log(data);
    };

    getData();
  }, []);
  console.log("pp", question);
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
          {/* <Text>
            Time Left <Text as={"span"}>00</Text>:<Text as={"span"}>59</Text>:
            <Text as={"span"}>39</Text>
          </Text> */}
          <Box>
            <Button
              // onClick={() => handleFullScreen(true)}
              border={"1px solid #01bfbd"}
              color={"#01bfbd"}
              mr={"12px"}
            >
              Reattempt This Test
            </Button>
            {/* <ModalPause
              // testSection=
              markedAndAnswer={markedAndAnswer}
              question={question}
              markedNotAnswer={markedNotAnswer}
              notAnswer={notAnswer}
              answered={answeredQuestion}
            /> */}
          </Box>
        </Box>{" "}
      </Container>
      <Box display={"flex"} h={"100%"}>
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
            <Text m={"1%"}>{question[currentquestion]?.qus}</Text>
            <RadioGroup
              value={
                allAns[currentquestion] ||
                question[currentquestion]?.options[
                  question[currentquestion]?.answer - 1
                ]
              }
              // onChange={(value) => handleAnswer(currentquestion, value)}
            >
              {question[currentquestion]?.options.map((d, i) => (
                <Box
                m={"1%"}
                  p={"1%"}
                  fontSize={"large"}
                  bg={
                    (allAns[currentquestion] ===
                      question[currentquestion]?.options[
                        question[currentquestion]?.answer - 1
                      ] &&
                      question[currentquestion]?.answer - 1 === i) ||
                    question[currentquestion]?.options[
                      question[currentquestion]?.answer - 1
                    ] === d
                      ? "#27ae60"
                      : allAns[currentquestion] === d
                      ? "#e15d29"
                      : ""
                  }
                  color={
                    (allAns[currentquestion] ===
                      question[currentquestion]?.options[
                        question[currentquestion]?.answer - 1
                      ] &&
                      question[currentquestion]?.answer - 1 === i) ||
                    question[currentquestion]?.options[
                      question[currentquestion]?.answer - 1
                    ] === d
                      ? "white"
                      : allAns[currentquestion] === d
                      ? "white"
                      : ""
                  }
                >
                  {/* <Radio
                    m={"1%"}
                    checked={
                      allAns[currentquestion] === d ||
                      question[currentquestion]?.answer - 1 === i
                    }
                    value={d}
                  > */}
                  {d}
                  {/* </Radio> */}
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
                // onClick={() => markedQuestion()}
                onClick={() => handleQuestion(null)}
                border={"1px solid #01bfbd"}
                color={"#01bfbd"}
              >
                Mark for priview & Next
              </Button>
              {/* <Button
                // onClick={() => handleClearAnswer(currentquestion)}
                border={"1px solid #01bfbd"}
                color={"#01bfbd"}
              >
                Clear Response
              </Button> */}
            </ButtonGroup>
            <Button
              // onClick={() => handlequestion("svn")}
              onClick={() => handleQuestion(null)}
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
          // h={""}
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
                  {markedNotAnswer?.length}
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
                  {question?.length -
                    (markedAndAnswer?.length +
                      markedNotAnswer?.length +
                      answeredQuestion?.length +
                      notAnswer?.length)}
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
                  {answeredQuestion?.length}
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
                  {notAnswer?.length}
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
                  {markedAndAnswer?.length} ✓
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
              {question?.map((d, i) => (
                <Box
                  // onClick={() => handlequestion(i)}
                  onClick={() => handleQuestion(i)}
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
            {/* <Link to={"/test-result"}> */}
            <Button
              // onClick={() => giveMark()}
              mt={"3%"}
              // mb={"3%"}
              border={"1px solid #01bfbd"}
              w={"100%"}
              color={"#01bfbd"}
            >
              Submit Test
            </Button>
            {/* </Link> */}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ReviewTest;
