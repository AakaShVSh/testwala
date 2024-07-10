import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  // Checkbox,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
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
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import ModalPause from "./ModalPause";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../helpers/localStorage";
import { useDispatch } from "react-redux";
import { userTestDataApi } from "../redux/userTestData/userTestData_ActionType.js";
import { HamburgerIcon } from "@chakra-ui/icons";

const TakeTest = ({ quest, handleFullScreen }) => {
  const [currentquestion, setcurrentquestion] = useState(0);
  const [question] = useState(quest);
  // const [answerSelected, setAnswerSelected] = useState(false);
  const [answeredQuestion, setAnsweredQuestion] = useState([]);
  const [markedAndAnswer, setMarkedAndAnswer] = useState([]);
  const [markedNotAnswer, setMarkedNotAnswer] = useState([]);
  const [notAnswer, setNotAnswer] = useState([]);
  const [answer, setans] = useState(null);
  const [allAns, setAllAns] = useState({});
  const [mark, setMark] = useState(0);
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const dispatch = useDispatch();
  // const [newTestDataStore,setNewTestDataStore] = useState(null)

  const [size, setSize] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [collectAns, setcollectAns] = useState([[]]);
  const [correctAns, setCorrectAns] = useState([]);
  const navigate = useNavigate();
  const [testData, setTestData] = useState({
    allAnswer: null,
    answeredQuestion: null,
    notAnswer: null,
    markedAndAnswer: null,
    markedNotAnswer: null,
  });
  console.log("jjjl", testData);
  const handlequestion = (con) => {
    if (con === "svn") {
      if (
        answer !== null &&
        allAns[currentquestion] !== undefined &&
        !answeredQuestion.includes(currentquestion)
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

        if (markedAndAnswer.includes(currentquestion)) {
          let removeFromMarkedAndAnswer =
            markedAndAnswer.indexOf(currentquestion);
          markedAndAnswer.splice(removeFromMarkedAndAnswer, 1);

          console.log(removeFromMarkedAndAnswer);
        }

        setAnsweredQuestion([...answeredQuestion, currentquestion]);

        if (question.length - 1 > currentquestion) {
          setcurrentquestion(currentquestion + 1);
        }
      } else if (allAns[currentquestion] === undefined && answer === null) {
        console.log("ggh");
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
          if (answeredQuestion.includes(currentquestion)) {
            let removeFromAnswerQuestion =
              answeredQuestion.indexOf(currentquestion);
            answeredQuestion.splice(removeFromAnswerQuestion, 1);

            console.log(removeFromAnswerQuestion);
          }

          // if (answeredQuestion.includes(currentquestion)) {
          //   let removeFromMarkedAndAnswer = answeredQuestion.indexOf(currentquestion);
          //   answeredQuestion.splice(removeFromMarkedAndAnswer, 1);
          //   console.log(removeFromMarkedAndAnswer);
          // }
          setNotAnswer([...notAnswer, currentquestion]);
          console.log("in");
        }
      }
      if (question.length - 1 > currentquestion) {
        setcurrentquestion(currentquestion + 1);
        // console.log("ac1", con);
      }
    } else {
      if (
        answer !== null &&
        allAns[currentquestion] !== undefined &&
        !answeredQuestion.includes(currentquestion)
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

        if (markedAndAnswer.includes(currentquestion)) {
          let removeFromMarkedAndAnswer =
            markedAndAnswer.indexOf(currentquestion);
          markedAndAnswer.splice(removeFromMarkedAndAnswer, 1);
          console.log(removeFromMarkedAndAnswer);
        }

        setAnsweredQuestion([...answeredQuestion, currentquestion]);
        if (question.length - 1 > currentquestion) {
          setcurrentquestion(con);
          // console.log("aq2");
        }
      } else if (
        answer === null &&
        allAns[currentquestion] === undefined &&
        !notAnswer.includes(currentquestion) &&
        currentquestion !== con
      ) {
        console.log("gghhjhj");
        if (markedNotAnswer.includes(currentquestion)) {
          let removeFromMarkedNotAnswer =
            markedNotAnswer.indexOf(currentquestion);
          markedNotAnswer.splice(removeFromMarkedNotAnswer, 1);
          console.log(removeFromMarkedNotAnswer);
        }

        if (markedAndAnswer.includes(currentquestion)) {
          let removeFromMarkedAndAnswer =
            markedAndAnswer.indexOf(currentquestion);
          markedAndAnswer.splice(removeFromMarkedAndAnswer, 1);
          console.log(removeFromMarkedAndAnswer);
        }

        if (answeredQuestion.includes(currentquestion)) {
          let removeFromMarkedAndAnswer =
            answeredQuestion.indexOf(currentquestion);
          answeredQuestion.splice(removeFromMarkedAndAnswer, 1);
          console.log(removeFromMarkedAndAnswer);
        }
        setNotAnswer([...notAnswer, currentquestion]);

        if (question.length - 1 > currentquestion) {
          setcurrentquestion(con);
          // console.log("ac2", con);
        }
      }
      if (con !== isNaN) {
        setcurrentquestion(con);
        // console.log("ac2", con);
      }
    }
    setans(null);
    //  setTestData({
    //    ...testData,
    //    allAnswer: allAns,
    //    answeredQuestion: answeredQuestion,
    //    notAnswer: notAnswer,
    //    markedAndAnswer: markedAndAnswer,
    //    markedNotAnswer: markedNotAnswer,
    //  });
  };
  // console.log(currentquestion);
  // console.log("g", allAns[currentquestion]);
  const markedQuestion = () => {
    if (allAns[currentquestion] === undefined && answer !== null) {
      setAllAns((prevState) => ({
        ...prevState,
        [currentquestion]: answer, // Update the selected answer for the specific question
      }));
    }
    if (
      // answer !== null &&
      allAns[currentquestion] !== undefined &&
      !markedAndAnswer.includes(currentquestion)
    ) {
      if (answeredQuestion.includes(currentquestion)) {
        let removeFromAnswer = answeredQuestion.indexOf(currentquestion);
        answeredQuestion.splice(removeFromAnswer, 1);
        console.log(removeFromAnswer);
      }

      if (markedNotAnswer.includes(currentquestion)) {
        let removeFromMarkNotAnswer = markedNotAnswer.indexOf(currentquestion);
        notAnswer.splice(removeFromMarkNotAnswer, 1);
      }

      if (notAnswer.includes(currentquestion)) {
        let removeFromNotAnswer = notAnswer.indexOf(currentquestion);
        notAnswer.splice(removeFromNotAnswer, 1);
      }
      setMarkedAndAnswer([...markedAndAnswer, currentquestion]);
      setans(null);
    } else if (
      allAns[currentquestion] === undefined &&
      !markedNotAnswer.includes(currentquestion)
    ) {
      setAllAns((prevState) => {
        const updatedState = { ...prevState };
        delete updatedState[currentquestion]; // Remove the selected answer for the specific question
        return updatedState;
      });
      if (answeredQuestion.includes(currentquestion)) {
        let removeFromAnswer = answeredQuestion.indexOf(currentquestion);
        answeredQuestion.splice(removeFromAnswer, 1);
        console.log(removeFromAnswer);
      }

      if (markedAndAnswer.includes(currentquestion)) {
        let removeFromMarkAndAnswer = markedAndAnswer.indexOf(currentquestion);
        notAnswer.splice(removeFromMarkAndAnswer, 1);
        //     console.log(removeFromNotAnswer);
      }
      if (notAnswer.includes(currentquestion)) {
        let removeFromNotAnswer = notAnswer.indexOf(currentquestion);
        notAnswer.splice(removeFromNotAnswer, 1);
      }
      setMarkedNotAnswer([...markedNotAnswer, currentquestion]);
    }
    if (question.length - 1 > currentquestion) {
      setcurrentquestion(currentquestion + 1);
    }
  };

  const handleAnswer = (ans, qus) => {
    setans(ans);
    if (
      question[currentquestion].answer === qus + 1 &&
      !correctAns.includes(currentquestion)
    ) {
      setMark(mark + 1);
      setCorrectAns([...correctAns, currentquestion]);
    } else if (
      question[currentquestion].answer !== qus + 1 &&
      correctAns.includes(currentquestion)
    ) {
      let removeFromCorrectAns = correctAns.indexOf(currentquestion);
      correctAns.splice(removeFromCorrectAns, 1);
      setMark(mark - 1);
    }
    setAllAns((prevState) => ({
      ...prevState,
      [currentquestion]: ans,
    }));
  };
  console.log("m", mark);
  const handleClearAnswer = (questionIndex) => {
    if (answeredQuestion.includes(currentquestion)) {
      let removeFromAnswer = answeredQuestion.indexOf(currentquestion);
      answeredQuestion.splice(removeFromAnswer, 1);
    }

    if (markedAndAnswer.includes(currentquestion)) {
      let removeFromMarkAndAnswer = markedAndAnswer.indexOf(currentquestion);
      markedAndAnswer.splice(removeFromMarkAndAnswer, 1);
      //     console.log(removeFromNotAnswer);
    }

    if (markedNotAnswer.includes(currentquestion)) {
      let removeFromMarkNotAnswer = markedNotAnswer.indexOf(currentquestion);
      markedNotAnswer.splice(removeFromMarkNotAnswer, 1);
    }

    setAllAns((prevState) => {
      const updatedState = { ...prevState };
      delete updatedState[questionIndex]; // Remove the selected answer for the specific question
      return updatedState;
    });
    if (!notAnswer.includes(currentquestion)) {
      setNotAnswer([...notAnswer, currentquestion]);
    }
  };

  const giveMark = () => {
    const category = getLocalStorage("category");
    const user = getLocalStorage("_user");
    console.log(user);
    const newTestData = {
      user: user,
      score: mark,
      allAnswer: allAns,
      answeredQuestion: answeredQuestion,
      notAnswer: notAnswer,
      markedAndAnswer: markedAndAnswer,
      markedNotAnswer: markedNotAnswer,
      section: category,
      questions: question,
    };

    setTestData(newTestData);
    dispatch(userTestDataApi(newTestData));
    // const getStorage = getLocalStorage("test");
    setLocalStorage("Total", mark);
    setLocalStorage("test", [newTestData]);
    navigate("/test-result");
    handleFullScreen(false);
    // if (getStorage === null) {

    // } else if (getStorage !== null) {

    //   setLocalStorage("Total", mark);
    //   setLocalStorage("test", [...getStorage, newTestData]);
    //   navigate("/test-result");
    //         handleFullScreen(false);

    // }

    //  }
  };
  // useEffect(() =>{

  const handleClick = (newSize) => {
    setSize(newSize);
    onOpen();
  };

  // },[allAns, answeredQuestion, markedAndAnswer, markedNotAnswer, newTestDataStore, notAnswer])
  return (
    <>
      {/* <Box 
      maxWidth={"100%"}
            width="100vw"
            height="100vh"
            // display="flex"
            justifyContent="center"
            alignItems="center"
            transform={isMobile ? "rotate(90deg)" : "rotate(0deg)"}
            transformOrigin="center center"
            overflow="hidden"
            > */}
      <Box
        bg={"white"}
        display={"flex"}
        justifyContent={"space-between"}
        // color={"black"}
        p={"0.6%"}
        backgroundColor={"#4285f4"}
        // maxWidth={"100%"}
        width="100%"
        color={"white"}
        //  p={"%"} maxWidth={"100%"}
      >
        {/* <Box
          
            // height="100vh"
            // display="flex"
            // justifyContent="center"
            // alignItems="center"
            // transform={isMobile ? "rotate(90deg)" : "rotate(0deg)"}
            // transformOrigin="center center"
            // overflow="hidden"
          > */}
        <Center w={"fit-content"} fontSize={isMobile ? "16px" : "26px"}>
          <b>Revision Karle</b>
        </Center>
        <Center
          bg={"#01bfbd"}
          // border="1px solid red"
          boxShadow="rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em"
          borderRadius={"4px"}
          pl={"2"}
          pr={"2"}
          w={isMobile ? "40%" : "10.5%"}
        >
          Time Left <Spacer />
          <Text as={"span"}>00</Text>:<Text as={"span"}>59</Text>:
          <Text as={"span"}>39</Text>
        </Center>
        <Box w={"20%"} mr={"0"}>
          {isMobile ? null : (
            <Button
              onClick={() => handleFullScreen(true)}
              border={"1px solid #01bfbd"}
              color={"#01bfbd"}
              mr={"10px"}
            >
              Enter Full Screen
            </Button>
          )}
          <ModalPause
            // testSection=
            markedAndAnswer={markedAndAnswer}
            question={question}
            markedNotAnswer={markedNotAnswer}
            notAnswer={notAnswer}
            answered={answeredQuestion}
          />
        </Box>
      </Box>{" "}
      {/* </Box> */}
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
            h={isMobile ? "83vh" : "574px"}
            w={"100%"}
          >
            {/* {question.length>0 && question.quest.map((d) )} */}
            <Text m={"1%"}>{question[currentquestion]?.qus}</Text>
            <RadioGroup
              value={allAns[currentquestion] || ""}
              onChange={(value) => handleAnswer(currentquestion, value)}
            >
              {question[currentquestion]?.options.map((d, i) => (
                <Box
                  onClick={() => {
                    handleAnswer(d, i);
                  }}
                >
                  <Radio
                    m={"1%"}
                    checked={allAns[currentquestion] === d}
                    value={d}
                  >
                    {d}
                  </Radio>
                  <br></br>{" "}
                </Box>
              ))}
            </RadioGroup>
            <Box
              position="fixed"
              bottom="10"
              width="100%"
              // bg="teal.500"
              // color="white"
              textAlign="end"
              // p="4"
            >
              {isMobile ? (
                <>
                  {" "}
                  <Button onClick={() => handleClick("xs")} key={"xs"} m={4}>
                    <HamburgerIcon />
                  </Button>
                  <Drawer onClose={onClose} isOpen={isOpen} size={"xs"}>
                    <DrawerOverlay />
                    <DrawerContent>
                      <DrawerCloseButton />
                      <DrawerHeader>Revision Karle</DrawerHeader>
                      <DrawerBody>
                        {/* <Box
                boxShadow="rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em"
                p={"1%"}
                w={"100%"}
                // h={""}
                // height="100vh"
                color={"white"}
                bg={"#4285f4"}
              > */}
                        <Box>
                          <Text fontSize={"x-large"}>
                            <b>Pablo</b>
                          </Text>
                        </Box>
                        <hr />
                        <Box mt={"3%"} mb={"3%"}>
                          <Box mb={"3%"} justifyContent={"space-between"}>
                            <Text mb={"2%"}>
                              Marked{" "}
                              <Text
                                w={"auto"}
                                pl={"4.5%"}
                                pr={"4.5%"}
                                backgroundColor={"purple"}
                                color={"white"}
                                borderRadius={"50%"}
                                as={"span"}
                              >
                                {markedNotAnswer.length}
                              </Text>{" "}
                            </Text>{" "}
                            <Text mb={"2%"}>
                              Not visited{" "}
                              <Text
                                w={"auto"}
                                pl={"4.5%"}
                                pr={"4.5%"}
                                // backgroundColor={"purple"}
                                color={"gray"}
                                bg={"white"}
                                border={"1px solid gray"}
                                // borderRadius={"50%"}
                                as={"span"}
                              >
                                {question.length -
                                  (markedAndAnswer.length +
                                    markedNotAnswer.length +
                                    answeredQuestion.length +
                                    notAnswer.length)}
                              </Text>
                            </Text>
                            <Text mb={"2%"}>
                              Answered{" "}
                              <Text
                                w={"auto"}
                                pl={"4.5%"}
                                pr={"4.5%"}
                                backgroundColor={"green"}
                                color={"white"}
                                borderTopLeftRadius={"50%"}
                                borderTopRightRadius={"50%"}
                                as={"span"}
                              >
                                {answeredQuestion.length}
                              </Text>
                            </Text>
                            <Text mb={"2%"}>
                              Not Answered{" "}
                              <Text
                                w={"auto"}
                                pl={"4.5%"}
                                pr={"4.5%"}
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
                                pl={"4.5%"}
                                pr={"4.5%"}
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
                        <Box
                          mt={"8%"}
                          mb={"6.5%"}
                          height="48vh"
                          p={"2%"}
                          overflow={"scroll"}
                          sx={{
                            "::-webkit-scrollbar": {
                              display: "none",
                            },
                            "-ms-overflow-style": "none", // IE and Edge
                            "scrollbar-width": "none", // Firefox
                          }}
                          // borderBottom={"1px solid gray"}
                        >
                          <Box>
                            {" "}
                            <Grid
                              templateColumns="repeat(5, 1fr)"
                              rowGap={"10%"}
                              columnGap={"6%"}
                              textAlign={"center"}
                            >
                              {question?.map((d, i) => (
                                <Box
                                  pl={"4.5%"}
                                  pr={"4.5%"}
                                  boxShadow={
                                    " rgba(0, 0, 0, 0.35) 0px 5px 15px"
                                  }
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
                                      : "white"
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
                                      : "gray"
                                  }
                                  cursor={"pointer"}
                                  border={"1px solid gray"}
                                >
                                  {markedAndAnswer.includes(i) ? (
                                    <>
                                      {i + 1}
                                      <b> ✓</b>
                                    </>
                                  ) : (
                                    <>{i + 1}</>
                                  )}
                                </Box>
                              ))}
                            </Grid>{" "}
                          </Box>
                        </Box>
                        <Box
                        // border={"1px solid red"}
                        >
                          <Box borderBottom={"1px solid #00d9ff"}>
                            <Button
                              mt={"3%"}
                              mb={"3%"}
                              border={"1px solid #01bfbd"}
                              w={"100%"}
                              color={"#01bfbd"}
                            >
                              Instruction
                            </Button>{" "}
                          </Box>{" "}
                          <Button
                            onClick={() => giveMark()}
                            mt={"3%"}
                            // mb={"3%"}
                            border={"1px solid #01bfbd"}
                            w={"100%"}
                            color={"#01bfbd"}
                          >
                            Submit Test
                          </Button>{" "}
                        </Box>
                        {/* <Box> */}
                        {/* <Link to={"/test-result"}> */}

                        {/* </Link> */}
                        {/* </Box> */}
                        {/* </Box> */}
                      </DrawerBody>
                    </DrawerContent>
                  </Drawer>
                </>
              ) : null}
            </Box>
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
                fontSize={isMobile ? "12" : "auto"}
                onClick={() => markedQuestion()}
                border={"1px solid #01bfbd"}
                color={"#01bfbd"}
              >
                Mark for priview & Next
              </Button>
              <Button
                fontSize={isMobile ? "12" : "auto"}
                onClick={() => handleClearAnswer(currentquestion)}
                border={"1px solid #01bfbd"}
                color={"#01bfbd"}
              >
                Clear Response
              </Button>
            </ButtonGroup>
            <Button
              fontSize={isMobile ? "12" : "auto"}
              onClick={() => handlequestion("svn")}
              border={"1px solid #01bfbd"}
              color={"#01bfbd"}
            >
              Save & Next
            </Button>
          </Box>
        </Box>

        {/* slider */}
        {isMobile ? null : (
          <>
            {" "}
            <Box
              boxShadow="rgba(67, 71, 85, 0.27) 0px 0px 0.25em, rgba(90, 125, 188, 0.05) 0px 0.25em 1em"
              p={"1%"}
              w={"25%"}
              // h={""}
              // height="100vh"
              color={"white"}
              bg={"#4285f4"}
            >
              <Box>
                <Text fontSize={"x-large"}>
                  <b>Pablo</b>
                </Text>
              </Box>
              <hr />
              <Box mt={"3%"} mb={"3%"}>
                <Box mb={"3%"} justifyContent={"space-between"}>
                  <Text mb={"2%"}>
                    Marked{" "}
                    <Text
                      w={"auto"}
                      pl={"4.5%"}
                      pr={"4.5%"}
                      backgroundColor={"purple"}
                      color={"white"}
                      borderRadius={"50%"}
                      as={"span"}
                    >
                      {markedNotAnswer.length}
                    </Text>{" "}
                  </Text>{" "}
                  <Text mb={"2%"}>
                    Not visited{" "}
                    <Text
                      w={"auto"}
                      pl={"4.5%"}
                      pr={"4.5%"}
                      // backgroundColor={"purple"}
                      color={"gray"}
                      bg={"white"}
                      border={"1px solid gray"}
                      // borderRadius={"50%"}
                      as={"span"}
                    >
                      {question.length -
                        (markedAndAnswer.length +
                          markedNotAnswer.length +
                          answeredQuestion.length +
                          notAnswer.length)}
                    </Text>
                  </Text>
                  <Text mb={"2%"}>
                    Answered{" "}
                    <Text
                      w={"auto"}
                      pl={"4.5%"}
                      pr={"4.5%"}
                      backgroundColor={"green"}
                      color={"white"}
                      borderTopLeftRadius={"50%"}
                      borderTopRightRadius={"50%"}
                      as={"span"}
                    >
                      {answeredQuestion.length}
                    </Text>
                  </Text>
                  <Text mb={"2%"}>
                    Not Answered{" "}
                    <Text
                      w={"auto"}
                      pl={"4.5%"}
                      pr={"4.5%"}
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
                      pl={"4.5%"}
                      pr={"4.5%"}
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
              <Box
                mt={"8%"}
                mb={"6.5%"}
                height="40vh"
                p={"2%"}
                overflow={"scroll"}
                sx={{
                  "::-webkit-scrollbar": {
                    display: "none",
                  },
                  "-ms-overflow-style": "none", // IE and Edge
                  "scrollbar-width": "none", // Firefox
                }}
                // borderBottom={"1px solid gray"}
              >
                <Box>
                  {" "}
                  <Grid
                    templateColumns="repeat(5, 1fr)"
                    rowGap={"10%"}
                    columnGap={"6%"}
                    textAlign={"center"}
                  >
                    {question?.map((d, i) => (
                      <Box
                        pl={"4.5%"}
                        pr={"4.5%"}
                        boxShadow={" rgba(0, 0, 0, 0.35) 0px 5px 15px"}
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
                            : "white"
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
                            : "gray"
                        }
                        cursor={"pointer"}
                        border={"1px solid gray"}
                      >
                        {markedAndAnswer.includes(i) ? (
                          <>
                            {i + 1}
                            <b> ✓</b>
                          </>
                        ) : (
                          <>{i + 1}</>
                        )}
                      </Box>
                    ))}
                  </Grid>{" "}
                </Box>
              </Box>
              <Box
              // border={"1px solid red"}
              >
                <Box borderBottom={"1px solid #ffffff"}>
                  <Button
                    mt={"3%"}
                    mb={"3%"}
                    border={"1px solid #01bfbd"}
                    w={"100%"}
                    color={"#01bfbd"}
                  >
                    Instruction
                  </Button>{" "}
                </Box>{" "}
                <Button
                  onClick={() => giveMark()}
                  mt={"3%"}
                  // mb={"3%"}
                  border={"1px solid #01bfbd"}
                  w={"100%"}
                  color={"#01bfbd"}
                >
                  Submit Test
                </Button>{" "}
              </Box>
              {/* <Box> */}
              {/* <Link to={"/test-result"}> */}

              {/* </Link> */}
              {/* </Box> */}
            </Box>
          </>
        )}
      </Box>
      {/* </Box> */}
    </>
  );
};

export default TakeTest;
