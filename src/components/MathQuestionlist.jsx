import { Box, Divider, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getLocalStorage, setLocalStorage } from '../helpers/localStorage';
import CollapseEx from './CreateTest';

const MathQuestionlist = ({
  category,
  chooseSub,
  currentSub,
  setQuestions,
  handleFullScreen,
  settestTitle,
}) => {

 const [MathSubject,setMathSubject] = useState("")
 const [currentTopic,setcurrentTopic] = useState([])
 const [data,setdata] = useState([]);
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
  "Coordinate Geometry",
  "Trigonometry",
  "Data Interpretation",
  "General Studies",
]);


const [englishTopics] = useState([
  "Spot the Error",
  "Reading Comprehension",
  "Synonyms",
  "Antonyms",
  "Fill in the Blanks",
  "Sentence Improvement",
  "Spotting Errors",
  "Para Jumbles",
  "Idioms and Phrases",
  "One Word Substitution",
  "Active and Passive Voice",
  "Direct and Indirect Speech",
  "Cloze Test",
  "Sentence Completion",
  "Vocabulary",
  "Prepositions",
  "Articles",
  "Tenses",
  "Subject-Verb Agreement",
  "Phrasal Verbs",
  "Vocabulary"
]);

const [Gs] = useState(["Vedic age"]);

const navigate = useNavigate()
const maketest = (qus,full,sec) => {
   setQuestions(qus);
   handleFullScreen(full);
   settestTitle(sec);
   navigate("/test")
}


useEffect(() => {
console.log("p",category);
const cate = category;
setLocalStorage("questiondata",cate);
const h = getLocalStorage("questiondata");
setdata(h);
}, [category])

useEffect(() => {
  if (currentSub === "Eng") {
    setcurrentTopic(englishTopics);
  } else if (currentSub === "math") {
    setcurrentTopic(sscCglMathsSyllabus);
  }
  else if(currentSub === "gs"){
     setcurrentTopic(Gs);
  }
}, [Gs, currentSub, englishTopics, sscCglMathsSyllabus]);

  return (
    <>
      <Flex w={"80%"} m="auto">
        <Box
          w={"75%"}
          bg={"#c4d2ef"}
          // border={"1px solid red"}
          p={"20px"}
          pt="2"
          borderRadius={"4px"}
          m={"20px"}
        >
          
          <Heading>
            {MathSubject !== "" ? <>{MathSubject}</> : <>{currentSub}</>}
          </Heading>
          <hr/>
<CollapseEx/>
          {MathSubject !== "" ? (
            <>
              {" "}
              {category.map((e, i) => (
                <>
                  {e.topic === MathSubject ? (
                    <Box
                      cursor={"pointer"}
                      w={"100%"}
                      mt={"2"}
                      bg={"#4285f4 "}
                      //   border={"1px solid red"}
                      overflow={"hidden"}
                      p={"2"}
                      borderRadius={"3px"}
                    >
                     
                        <Box
                          // bg={"#1f4985"}
                          // mt={"430"}
                          _hover={"orange"}
                          w="100%"
                          h={"100%"}
                          color={"white"}
                          onClick={() => maketest(e.question, true, e.section)}
                        >
                          <b>{e.section}</b>
                        </Box>
                    </Box>
                  ) : null}{" "}
                </>
              ))}
            </>
          ) : (
            <>
              {currentTopic?.map((e, i) => (
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
            <b>Created Tests</b>
            <hr />
             {currentTopic?.map((e, i) => (
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
            
          </Text>
        </Box>
      </Flex>
    </>
  );
};

export default MathQuestionlist
