import { Box, Divider, Heading, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../helpers/localStorage";
import CollapseEx from "./CreateTest";
import { GrCheckboxSelected } from "react-icons/gr";
const MathQuestionlist = ({
  category,
  chooseSub,
  currentSub,
  setQuestions,
  handleFullScreen,
  settestTitle,
}) => {
  const [totalques,settotalques] = useState(false)
  const [MathSubject, setMathSubject] = useState("");
  const [h,seth] = useState([])
  const [selectallstate,setselectallstate] = useState(false)
  const [directTest,setdirectTest] = useState([])
  const [check,setcheck] = useState(false)
  const [currentTopic, setcurrentTopic] = useState([]);
  const [dataTypeWiseTest, setdataTypeWiseTest] = useState([]);
  const [data, setdata] = useState([]);
  const [list, setlist] = useState([]);
  const [totaltestno,settotaltestno] = useState(10);
  const [quslist, setquslist] = useState([]);
  const [name, setname] = useState("Test");
  const [sum, setsum] = useState(0);
  const [noOfQus, setnoOfQus] = useState(3);
  const [Vocabularydata] = useState([
    "One Word Substitution",
    "English Vocabulary",
  ]);
  const [sscCglMathsSyllabus] = useState([
    "Number System",
    "L.C.M and H.C.F",
    "Surds and Indices",
    "Algebraic Identities",
    "Percentage",
    "Profit and Loss",
    "Simple Interest",
    "Compound Interest",
    "Average",
    "Ratio and Proportion",
    "Partnership",
    "Problems with Ages",
    "Time and Distance",
    "Pipe and Cistern",
    "Mixture and Alligation",
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
    "Idioms & Phrases",
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

  const [mathtwo] = useState([
    "Average Wala",
    "mathtwo",
    "Police and Thief",
    "Time and Distance (Meeting Wala)",
    "Time and distance basic",
    "Train Wala (Relative Speed)",
  ]);
  const [Gs] = useState(["Vedic age", "Polity", "Ancient History"]);
  const navigate = useNavigate();
console.log(directTest)
  const maketest = (qus, full, sec) => {
    console.log("jkjk",qus,full,sec);
    
    setQuestions(qus);
    handleFullScreen(full);
    settestTitle(sec);
    navigate("/test");
  };
console.log("current",currentTopic);

  // Handle increment and decrement in quslist
  const updateCounter = (index, operation) => {
    setquslist((prevQuslist) => {
      let newQuslist = [...prevQuslist];
      const currentItem = newQuslist[index];
      const updatedItem = {
        ...currentItem,
        count:
          operation === "increment"
            ? currentItem.count + 1
            : Math.max(1, currentItem.count - 1), // Ensure count doesn't go below 1
      };

      newQuslist[index] = updatedItem;

      // Calculate the total count of questions
      const totalQuestions = newQuslist.reduce(
        (acc, item) => acc + item.count,
        0
      );

      // If totalQuestions exceeds the desired number, redistribute to maintain the total
      if (totalQuestions > noOfQus) {
        // Adjust other topics to make sure the total count matches `noOfQus`
        let diff = totalQuestions - noOfQus;
        let adjustmentIndex = 0;

        while (diff > 0 && adjustmentIndex < newQuslist.length) {
          // Find topics with count greater than 1 to decrement
          if (newQuslist[adjustmentIndex].count > 1) {
            newQuslist[adjustmentIndex].count -= 1;
            diff--;
          }
          adjustmentIndex++;
        }
      }

      return newQuslist;
    });
  };

  // console.log(20%quslist.length);
  const [devidedqus,setdevidedqus] = useState();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [allquestotaltaketest,setallquestotaltaketest] = useState([]);
const findtotal = () => {
  if (!category || !Array.isArray(category)) {
    console.error("Category data is missing or invalid.");
    return;
  }

  // Step 1: Filter only MathSubject questions
  let filtered = category.filter((e) => e.topic === MathSubject);

  // Step 2: Count total questions and sections
  let total = filtered.reduce((sum, e) => sum + e.question.length, 0);
  let totalSections = filtered.length;

  setTotalQuestions(total); // Update state with total questions

  if (totalSections === 0) {
    setdevidedqus([]);
    console.log("No sections found for", MathSubject);
    return;
  }

  // Step 3: Distribute questions evenly
  let baseCount = Math.floor(total / totalSections);
  let extra = total % totalSections;
  let distribution = filtered.map((e) =>
    Math.min(e.question.length, baseCount)
  );

  for (let i = 0; i < extra; i++) {
    if (distribution[i] < filtered[i].question.length) {
      distribution[i] += 1; // Distribute extra questions
    }
  }
let newState = { ...allquestotaltaketest };

setdevidedqus(distribution);

filtered.forEach((e, i) => {
  e.question.slice(0, distribution[i]).forEach((item, index) => {
    newState[`question_${i}_${index}`] = item; // Ensure unique keys
  });
});

setallquestotaltaketest(newState);

console.log("data", newState);


  // Step 4: Log the distribution for debugging
  let result = filtered.map((e, i) => ({
    section: e.topic,
    totalQuestions: e.question.length,
    assignedQuestions: distribution[i],
  }));




  console.log("Question Distribution:", result);
};


// Ensure logging after state update
useEffect(() => {
  console.log(devidedqus);
}, [devidedqus]);

console.log(devidedqus);


  const setq = async () => {
    const questionData = getLocalStorage("questiondata");
    const p = questionData.filter((e) => list.includes(e.topic));
    let dd = [];
    quslist.forEach((e, i) => {
      const g = p[i].question.slice(0, e.count);
      //  console.log(p[i].question.slice(0,e.count),quslist)
      dd = [...dd, ...g];
    });
    console.log("g", dd);
    const testobj = {
      testName: name,
      quslist: quslist,
      noOfQus: noOfQus,
      questions: dd,
    };
    const f = getLocalStorage("allTypeWiseTests");
    console.log("p",f);
    
    if (f != null) {
      setLocalStorage("allTypeWiseTests", [...f, testobj]);
    } else {
      setLocalStorage("allTypeWiseTests", [testobj]);
    }

    maketest(dd, true, "Test 1");
  };

  console.log(quslist, name);
console.log(h);

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
// if()
      setquslist(updatedQuslist);
    }
  }, [list, noOfQus]);
console.log(category);

  useEffect(() => {
    // Category-related actions
    const cate = category;
    setLocalStorage("questiondata", cate);
    const h = getLocalStorage("questiondata");
    const hh = getLocalStorage("cat");
    // setdata(h);
console.log("hh",hh,h);

console.log(currentSub,"ccc");
if(currentSub==="mathtwo"){
   setcurrentTopic(mathtwo);
}
    // Update topics based on `currentSub`
    if (currentSub === "Eng"&&hh==null) {

      setcurrentTopic(englishTopics);
    } else if (currentSub === "math") {
      setcurrentTopic(sscCglMathsSyllabus);
    } else if (currentSub === "gs") {
      setcurrentTopic(Gs);
    }else if(currentSub=="vocabulary"){

setcurrentTopic(Vocabularydata);

    // maketest(dd, true, "Test 1");
    }
  }, [category, currentSub, englishTopics, sscCglMathsSyllabus, Gs, Vocabularydata, mathtwo]);

  useEffect(() => {
    const f = getLocalStorage("allTypeWiseTests");
    console.log(f, name);
    setdataTypeWiseTest(f);
  }, [name]);
console.log(noOfQus);
console.log(totaltestno);
console.log(sum);

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
          <CollapseEx
          seth={seth}
          sum={sum}
          setdirecttest={setdirectTest}
          directTest={directTest}
          h={h}
          selectallstate={selectallstate}
          setselectallstate={setselectallstate}
          setcheck={setcheck}
          check={check}
    maketest={maketest}
          MathSubject={MathSubject}
          category={category}
            findtotal={findtotal}
            settotalques={settotalques}
            totalques={totalques}
            setlist={setlist}
            settotaltestno={settotaltestno}
            setq={setq}
            setname={setname}
            setnoOfQus={setnoOfQus}
          />
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
              {MathSubject ? (
                category.map((e, k) =>
                  e.topic === MathSubject ? (
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      key={k}
                      cursor="pointer"
                      w="100%"
                      mt="2"
                      bg="#4285f4"
                      p="2"
                      borderRadius="3px"
                    >
                      <Box
                        color="white"
                        // onClick={() => maketest(e.question, true, e.section)}
                      >
                        <b>{e.section}</b>
                      </Box>
                      <Box
                        display={"inline-flex"}
                        justifyContent={"space-between"}
                        w={"10%"}
                        paddingRight={"5px"}
                        textDecoration={"underline"}
                      >
                        {check? <><GrCheckboxSelected
                          color={h?.includes(k) || selectallstate? "green" : "black"}
                          onClick={() =>{
                            setdirectTest([...directTest,e])
                            setsum(sum+e.question.length)
                            seth((prev) =>
                              prev.includes(k)
                                ? prev.filter((item) => item !== k)
                                : [...prev, k]
                            )}
                          }
                          style={{ border: "2px solid" }}
                        /></>:null}
                        <Text>{e.question.length}</Text>
                      </Box>
                    </Box>
                  ) : null
                )
              ) : (
                <>
                  {currentTopic === null ? (
                    <>
                      {data.map((e, i) => (
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
                            onClick={() =>
                              maketest(e.question, true, e.section)
                            }
                          >
                            <b>{e.section}</b>
                          </Box>
                        </Box>
                      ))}
                    </>
                  ) : (
                    currentTopic.map((topic, i) => (
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
                    ))
                  )}
                </>
              )}
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
          <Box w="100%">
            <Text fontSize="large">
              <b>Created Tests</b>
            </Text>
            <Divider />
            {dataTypeWiseTest && dataTypeWiseTest.length > 0 ? (
              dataTypeWiseTest.map((e, i) => (
                <Box
                  key={i}
                  w="100%"
                  mt="2"
                  bg="#4285f4"
                  p="2"
                  borderRadius="3px"
                >
                  <Text color="white">
                    <b>{e.testName || "Unnamed Test"}</b>
                  </Text>
                </Box>
              ))
            ) : (
              <Text mt="4" color="gray.500">
                No tests available.
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MathQuestionlist;
