import { Box, Divider, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../helpers/localStorage";
import CollapseEx from "./CreateTest";

const MathQuestionlist = ({
  category,
  chooseSub,
  currentSub,
  setQuestions,
  handleFullScreen,
  settestTitle,
}) => {
  const [MathSubject, setMathSubject] = useState("");
  const [currentTopic, setcurrentTopic] = useState([]);
  const [data, setdata] = useState([]);
  const [list, setlist] = useState([]);
  const [quslist, setquslist] = useState([]);
  const [noOfQus,setnoOfQus] = useState(0);
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
  ]);

  const [Gs] = useState(["Vedic age"]);
  const navigate = useNavigate();

  const maketest = (qus, full, sec) => {
    setQuestions(qus);
    handleFullScreen(full);
    settestTitle(sec);
    navigate("/test");
  };

  // Handle increment and decrement in quslist
  const updateCounter = (index, operation) => {
    setquslist((prevQuslist) =>
      prevQuslist.map((item, idx) =>
        idx === index
          ? {
              ...item,
              count:
                operation === "increment"
                  ? item.count + 1
                  : Math.max(1, item.count - 1),
            }
          : item
      )
    );
  };
// console.log(20%quslist.length);


const setq = async () => {
  const questionData = getLocalStorage("questiondata"); 
  const p = questionData.filter((e) => list.includes(e.topic));
  let dd = []
  quslist.forEach((e,i) => { 
 const g = p[i].question.slice(0, e.count);
    //  console.log(p[i].question.slice(0,e.count),quslist)
    dd = [...dd,...g]
})
console.log("g",dd);
maketest(dd,true,"Test 1")
}
 
  



// const setq = async () => {
//   const questionData = getLocalStorage("questiondata"); // Fetch data once
//   const vocabularyData = questionData.find(
//     (item) => item.topic === "Vocabulary"
//   ); // Find vocabulary topic

//   if (vocabularyData && vocabularyData.question) {
//     quslist.forEach((e) => {
//       // Slice the question array up to the count specified in quslist
//       const selectedQuestions = vocabularyData.question.slice(0, e.count);
//       console.log(selectedQuestions); // Display the sliced questions
//     });
//   } else {
//     console.log("No Vocabulary topic found or no questions available.");
//   }
// };

 



 useEffect(() => {
   if (list.length > 0) {
     const totalQuestions = list.length;
     const baseCount = Math.floor(noOfQus / totalQuestions);
     const remainder = noOfQus % totalQuestions; // Calculate the remainder based on noOfQus

     // Create `quslist` where the first item gets extra count if there's a remainder
     const updatedQuslist = list.map((item, index) => ({
       count: index === 0 ? baseCount + remainder : baseCount, // First item gets baseCount + remainder
       qusdata: item,
     }));

     setquslist(updatedQuslist);
   }
 }, [list, noOfQus]);



  useEffect(() => {
    // Category-related actions
    const cate = category;
    setLocalStorage("questiondata", cate);
    const h = getLocalStorage("questiondata");
    setdata(h);

    // Update topics based on `currentSub`
    if (currentSub === "Eng") {
      setcurrentTopic(englishTopics);
    } else if (currentSub === "math") {
      setcurrentTopic(sscCglMathsSyllabus);
    } else if (currentSub === "gs") {
      setcurrentTopic(Gs);
    }
  }, [category, currentSub, englishTopics, sscCglMathsSyllabus, Gs]);

  return (
    <>
      <Box
        display={{ base: "", md: "flex", lg: "flex" }}
        gap="2"
        w={{ base: "99%", md: "80%", lg: "80%" }}
        m="20px auto"
      >
        <Box
          w={{ base: "99%", md: "75%", lg: "75%" }}
          bg={"#c4d2ef"}
          p={"20px"}
          pt="2"
          borderRadius={"4px"}
          m={"0px"}
        >
          <Heading>{MathSubject !== "" ? MathSubject : currentSub}</Heading>
          <Divider />
          <CollapseEx setlist={setlist} setq={setq} setnoOfQus={setnoOfQus} />
          {quslist.length > 0 ? (
            quslist.map((e, i) => (
              <Box
                key={i}
                cursor="pointer"
                w="100%"
                mt="2"
                bg="#4285f4"
                overflow="hidden"
                p="2"
                borderRadius="3px"
              >
                <Box
                  display="inline-flex"
                  justifyContent="space-between"
                  w="100%"
                  h="100%"
                  color="white"
                >
                  <b>{e.qusdata}</b>
                  <Box
                    display="flex"
                    w="10%"
                    bg="white"
                    borderRadius="20px"
                    justifyContent="space-around"
                  >
                    <Box
                      onClick={() => updateCounter(i, "increment")}
                      w="100%"
                      bg="green"
                      textAlign="center"
                    >
                      +
                    </Box>
                    <Box w="100%" color="gray" textAlign="center">
                      {e.count}
                    </Box>
                    <Box
                      onClick={() => updateCounter(i, "decrement")}
                      w="100%"
                      bg="red"
                      textAlign="center"
                    >
                      -
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Box>
              {MathSubject
                ? category.map((e, i) =>
                    e.topic === MathSubject ? (
                      <Box
                        key={i}
                        cursor="pointer"
                        w="100%"
                        mt="2"
                        bg="#4285f4"
                        p="2"
                        borderRadius="3px"
                      >
                        <Box
                          color="white"
                          onClick={() => maketest(e.question, true, e.section)}
                        >
                          <b>{e.section}</b>
                        </Box>
                      </Box>
                    ) : null
                  )
                : currentTopic.map((topic, i) => (
                    <Box
                      key={i}
                      w="100%"
                      mt="2"
                      bg="#4285f4"
                      p="1"
                      borderRadius="3px"
                      onClick={() => setMathSubject(topic)}
                      cursor="pointer"
                    >
                      <Box color="white">
                        <b>{topic}</b>
                      </Box>
                    </Box>
                  ))}
            </Box>
          )}
        </Box>
        <Box
          w="25%"
          h="72vh"
          overflow="scroll"
          bg="#c4d2ef"
          display={{ base: "none", md: "flex", lg: "flex" }}
          p="20px"
          borderRadius="4px"
        >
          <Text w="100%" fontSize="large">
            <b>Created Tests</b>
            <Divider />
            {currentTopic.map((topic, i) => (
              <Box
                key={i}
                w="100%"
                mt="2"
                bg="#4285f4"
                p="2"
                borderRadius="3px"
              >
                <Box color="white" onClick={() => setMathSubject(topic)}>
                  <b>{topic}</b>
                </Box>
              </Box>
            ))}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default MathQuestionlist;
