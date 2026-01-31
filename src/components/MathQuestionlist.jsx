import {
  Box,
  Divider,
  Heading,
  Text,
  Badge,
  Card,
  CardBody,
  VStack,
  HStack,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "../helpers/localStorage";
import CollapseEx from "./CreateTest";
import { GrCheckboxSelected } from "react-icons/gr";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";

const MathQuestionlist = ({
  category,
  chooseSub,
  currentSub,
  setQuestions,
  handleFullScreen,
  settestTitle,
}) => {
  const [totalques, settotalques] = useState(false);
  const [MathSubject, setMathSubject] = useState("");
  const [h, seth] = useState([]);
  const [selectallstate, setselectallstate] = useState(false);
  const [directTest, setdirectTest] = useState([]);
  const [check, setcheck] = useState(false);
  const [currentTopic, setcurrentTopic] = useState([]);
  const [dataTypeWiseTest, setdataTypeWiseTest] = useState([]);
  const [data, setdata] = useState([]);
  const [list, setlist] = useState([]);
  const [totaltestno, settotaltestno] = useState(10);
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
  console.log(directTest);

  const maketest = (qus, full, sec) => {
    console.log("jkjk", qus, full, sec);
    setQuestions(qus);
    handleFullScreen(full);
    settestTitle(sec);
    navigate("/test");
  };
  console.log("current", currentTopic);

  const updateCounter = (index, operation) => {
    setquslist((prevQuslist) => {
      let newQuslist = [...prevQuslist];
      const currentItem = newQuslist[index];
      const updatedItem = {
        ...currentItem,
        count:
          operation === "increment"
            ? currentItem.count + 1
            : Math.max(1, currentItem.count - 1),
      };

      newQuslist[index] = updatedItem;

      const totalQuestions = newQuslist.reduce(
        (acc, item) => acc + item.count,
        0,
      );

      if (totalQuestions > noOfQus) {
        let diff = totalQuestions - noOfQus;
        let adjustmentIndex = 0;

        while (diff > 0 && adjustmentIndex < newQuslist.length) {
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

  const [devidedqus, setdevidedqus] = useState();
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [allquestotaltaketest, setallquestotaltaketest] = useState([]);

  const findtotal = () => {
    if (!category || !Array.isArray(category)) {
      console.error("Category data is missing or invalid.");
      return;
    }

    let filtered = category.filter((e) => e.topic === MathSubject);
    let total = filtered.reduce((sum, e) => sum + e.question.length, 0);
    let totalSections = filtered.length;

    setTotalQuestions(total);

    if (totalSections === 0) {
      setdevidedqus([]);
      console.log("No sections found for", MathSubject);
      return;
    }

    let baseCount = Math.floor(total / totalSections);
    let extra = total % totalSections;
    let distribution = filtered.map((e) =>
      Math.min(e.question.length, baseCount),
    );

    for (let i = 0; i < extra; i++) {
      if (distribution[i] < filtered[i].question.length) {
        distribution[i] += 1;
      }
    }
    let newState = { ...allquestotaltaketest };

    setdevidedqus(distribution);

    filtered.forEach((e, i) => {
      e.question.slice(0, distribution[i]).forEach((item, index) => {
        newState[`question_${i}_${index}`] = item;
      });
    });

    setallquestotaltaketest(newState);
    console.log("data", newState);

    let result = filtered.map((e, i) => ({
      section: e.topic,
      totalQuestions: e.question.length,
      assignedQuestions: distribution[i],
    }));

    console.log("Question Distribution:", result);
  };

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
    console.log("p", f);

    if (f != null) {
      setLocalStorage("allTypeWiseTests", [...f, testobj]);
    } else {
      setLocalStorage("allTypeWiseTests", [testobj]);
    }

    maketest(dd, true, "Test 1");
  };

  console.log(quslist, name);
  console.log(h);

  useEffect(() => {
    if (list.length > 0) {
      const totalQuestions = list.length;
      const baseCount = Math.floor(noOfQus / totalQuestions);
      const remainder = noOfQus % totalQuestions;

      const updatedQuslist = list.map((item, index) => ({
        count: index === 0 ? baseCount + remainder : baseCount,
        qusdata: item,
      }));

      setquslist(updatedQuslist);
    }
  }, [list, noOfQus]);
  console.log(category);

  useEffect(() => {
    const cate = category;
    setLocalStorage("questiondata", cate);
    const h = getLocalStorage("questiondata");
    const hh = getLocalStorage("cat");
    console.log("hh", hh, h);

    console.log(currentSub, "ccc");
    if (currentSub === "mathtwo") {
      setcurrentTopic(mathtwo);
    }

    if (currentSub === "Eng" && hh == null) {
      setcurrentTopic(englishTopics);
    } else if (currentSub === "math") {
      setcurrentTopic(sscCglMathsSyllabus);
    } else if (currentSub === "gs") {
      setcurrentTopic(Gs);
    } else if (currentSub == "vocabulary") {
      setcurrentTopic(Vocabularydata);
    }
  }, [
    category,
    currentSub,
    englishTopics,
    sscCglMathsSyllabus,
    Gs,
    Vocabularydata,
    mathtwo,
  ]);

  useEffect(() => {
    const f = getLocalStorage("allTypeWiseTests");
    console.log(f, name);
    setdataTypeWiseTest(f);
  }, [name]);
  console.log(noOfQus);
  console.log(totaltestno);
  console.log(sum);

  return (
    <Box minH="100vh" bg="#f8f9fa" py={8} px={4}>
      <Flex
        gap={6}
        maxW="1400px"
        mx="auto"
        direction={{ base: "column", lg: "row" }}
      >
        {/* Main Content Area */}
        <Box flex="1">
          <Card
            bg="white"
            shadow="sm"
            borderRadius="8px"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.300"
          >
            <Box
              bg="white"
              p={6}
              borderBottom="1px solid"
              borderColor="gray.300"
            >
              <Heading
                size="lg"
                fontWeight="600"
                color="gray.800"
                letterSpacing="-0.5px"
              >
                {MathSubject !== "" ? MathSubject : currentSub}
              </Heading>
              <Text fontSize="sm" mt={1} color="gray.500">
                Configure your test topics and question distribution
              </Text>
            </Box>

            <CardBody p={6} bg="#fafbfc">
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

              <VStack spacing={3} mt={4} align="stretch">
                {quslist.length > 0 ? (
                  quslist.map((e, i) => (
                    <Box
                      key={i}
                      bg="white"
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="6px"
                      p={4}
                      transition="all 0.2s"
                      _hover={{
                        borderColor: "blue.400",
                        shadow: "sm",
                      }}
                    >
                      <Flex justify="space-between" align="center">
                        <Text fontWeight="500" fontSize="15px" color="gray.700">
                          {e.qusdata}
                        </Text>
                        <HStack spacing={2}>
                          <IconButton
                            icon={<MinusIcon />}
                            size="sm"
                            variant="outline"
                            borderColor="gray.300"
                            color="gray.600"
                            borderRadius="4px"
                            onClick={() => updateCounter(i, "decrement")}
                            _hover={{
                              bg: "gray.50",
                              borderColor: "gray.400",
                            }}
                          />
                          <Box
                            px={4}
                            py={1}
                            fontWeight="600"
                            fontSize="15px"
                            color="gray.700"
                            minW="45px"
                            textAlign="center"
                            bg="gray.50"
                            borderRadius="4px"
                          >
                            {e.count}
                          </Box>
                          <IconButton
                            icon={<AddIcon />}
                            size="sm"
                            variant="outline"
                            borderColor="gray.300"
                            color="gray.600"
                            borderRadius="4px"
                            onClick={() => updateCounter(i, "increment")}
                            _hover={{
                              bg: "gray.50",
                              borderColor: "gray.400",
                            }}
                          />
                        </HStack>
                      </Flex>
                    </Box>
                  ))
                ) : (
                  <VStack spacing={2} align="stretch">
                    {MathSubject ? (
                      category.map((e, k) =>
                        e.topic === MathSubject ? (
                          <Box
                            key={k}
                            bg="white"
                            border="1px solid"
                            borderColor="gray.300"
                            borderRadius="6px"
                            p={4}
                            transition="all 0.2s"
                            _hover={{
                              borderColor: "blue.400",
                              bg: "gray.50",
                            }}
                            cursor="pointer"
                          >
                            <Flex justify="space-between" align="center">
                              <Text
                                fontWeight="500"
                                fontSize="15px"
                                color="gray.700"
                              >
                                {e.section}
                              </Text>
                              <HStack spacing={3}>
                                {check && (
                                  <Box
                                    onClick={() => {
                                      setdirectTest([...directTest, e]);
                                      setsum(sum + e.question.length);
                                      seth((prev) =>
                                        prev.includes(k)
                                          ? prev.filter((item) => item !== k)
                                          : [...prev, k],
                                      );
                                    }}
                                    cursor="pointer"
                                    transition="all 0.2s"
                                    _hover={{ opacity: 0.7 }}
                                  >
                                    <GrCheckboxSelected
                                      size={18}
                                      color={
                                        h?.includes(k) || selectallstate
                                          ? "#3182ce"
                                          : "#a0aec0"
                                      }
                                    />
                                  </Box>
                                )}
                                <Badge
                                  bg="gray.100"
                                  color="gray.700"
                                  fontSize="13px"
                                  px={3}
                                  py={1}
                                  borderRadius="4px"
                                  fontWeight="500"
                                >
                                  {e.question.length}
                                </Badge>
                              </HStack>
                            </Flex>
                          </Box>
                        ) : null,
                      )
                    ) : (
                      <>
                        {currentTopic === null ? (
                          <>
                            {data.map((e, i) => (
                              <Box
                                key={i}
                                bg="white"
                                border="1px solid"
                                borderColor="gray.300"
                                borderRadius="6px"
                                p={4}
                                cursor="pointer"
                                transition="all 0.2s"
                                _hover={{
                                  borderColor: "blue.400",
                                  bg: "gray.50",
                                }}
                                onClick={() =>
                                  maketest(e.question, true, e.section)
                                }
                              >
                                <Text
                                  fontWeight="500"
                                  fontSize="15px"
                                  color="gray.700"
                                >
                                  {e.section}
                                </Text>
                              </Box>
                            ))}
                          </>
                        ) : (
                          currentTopic.map((topic, i) => (
                            <Box
                              key={i}
                              bg="white"
                              border="1px solid"
                              borderColor="gray.300"
                              borderRadius="6px"
                              p={4}
                              cursor="pointer"
                              transition="all 0.2s"
                              _hover={{
                                borderColor: "blue.400",
                                bg: "gray.50",
                              }}
                              onClick={() => setMathSubject(topic)}
                            >
                              <Text
                                fontWeight="500"
                                fontSize="15px"
                                color="gray.700"
                              >
                                {topic}
                              </Text>
                            </Box>
                          ))
                        )}
                      </>
                    )}
                  </VStack>
                )}
              </VStack>
            </CardBody>
          </Card>
        </Box>

        {/* Sidebar - Created Tests */}
        <Box
          w={{ base: "full", lg: "340px" }}
          display={{ base: "none", md: "block" }}
        >
          <Card
            bg="white"
            shadow="sm"
            borderRadius="8px"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.300"
            position="sticky"
            top="20px"
          >
            <Box
              bg="white"
              p={5}
              borderBottom="1px solid"
              borderColor="gray.300"
            >
              <Heading
                size="md"
                fontWeight="600"
                color="gray.800"
                letterSpacing="-0.5px"
              >
                Created Tests
              </Heading>
              <Text fontSize="sm" mt={1} color="gray.500">
                Your test history
              </Text>
            </Box>

            <CardBody
              p={0}
              maxH="calc(100vh - 200px)"
              overflowY="auto"
              bg="#fafbfc"
            >
              {dataTypeWiseTest && dataTypeWiseTest.length > 0 ? (
                <VStack spacing={0} align="stretch">
                  {dataTypeWiseTest.map((e, i) => (
                    <Box
                      key={i}
                      p={4}
                      borderBottom="1px solid"
                      borderColor="gray.200"
                      transition="all 0.2s"
                      cursor="pointer"
                      _hover={{
                        bg: "gray.50",
                      }}
                      _last={{
                        borderBottom: "none",
                      }}
                    >
                      <Text
                        fontWeight="500"
                        fontSize="15px"
                        color="gray.800"
                        mb={2}
                      >
                        {e.testName || "Unnamed Test"}
                      </Text>
                      <HStack spacing={2}>
                        <Badge
                          bg="blue.50"
                          color="blue.700"
                          fontSize="12px"
                          px={2}
                          py={1}
                          borderRadius="4px"
                          fontWeight="500"
                        >
                          {e.noOfQus || 0} Questions
                        </Badge>
                        <Badge
                          bg="gray.100"
                          color="gray.700"
                          fontSize="12px"
                          px={2}
                          py={1}
                          borderRadius="4px"
                          fontWeight="500"
                        >
                          {e.quslist?.length || 0} Topics
                        </Badge>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Box p={8} textAlign="center">
                  <Text color="gray.400" fontSize="14px" fontWeight="500">
                    No tests created yet
                  </Text>
                  <Text color="gray.400" fontSize="13px" mt={2}>
                    Create your first test to get started
                  </Text>
                </Box>
              )}
            </CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
};

export default MathQuestionlist;
