import {
  Box,
  Flex,
  Heading,
  Icon,
  Text,
  Badge,
  Progress,
  Container,
  Grid,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Circle,
  VStack,
  HStack,
  IconButton,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import {
  FiTarget,
  FiCheckCircle,
  FiXCircle,
  FiCircle,
  FiArrowLeft,
  FiFlag,
  FiAlertCircle,
  FiBookmark,
} from "react-icons/fi";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "../helpers/localStorage";
import { userTestFetchDataApi } from "../redux/userTestData/userTestData_ActionType";
import { Link } from "react-router-dom";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
);

const ResultPage = () => {
  const [totalMark, setTotalMark] = useState(0);
  const [TotalQuestion, SetTotalQuestion] = useState([]);
  const [marknotans, setmarknotans] = useState(0);
  const [notans, setnotans] = useState(0);
  const [answeredQuestioned, setansweredQuestioned] = useState(0);
  const [markedAndAnswered, setmarkedAndAnswered] = useState(0);
  const [wrongAns, setwrongAns] = useState(0);
  const [wrongAnsqus, setwrongAnsqus] = useState([]);
  const [correctqus, setcorrectqus] = useState([]);
  const [rank, setrank] = useState(1);
  const [TotalStudent, setTotalStudent] = useState(0);
  const [percentile, setPercentile] = useState(0);
  const [testData, setTestData] = useState(null);
  const [allAnswers, setAllAnswers] = useState({});
  const [savedQuestionIndices, setSavedQuestionIndices] = useState(new Set());
  const toast = useToast();

  const calculateAccuracy = () => {
    return totalMark > 0 && TotalQuestion.length > 0
      ? (totalMark / TotalQuestion.length) * 100
      : 0;
  };

  const calculatePercentile = async (score, allScores) => {
    const sub = getLocalStorage("Subject");
    const topic = getLocalStorage("category");
    const g = await allScores?.filter(
      (e) => e.subject === sub && e.section === topic,
    );

    if (g !== undefined && g.length > 0) {
      setTotalStudent(g?.length);
      const sortedScores = g?.sort((a, b) => a.score - b.score);
      const belowYourScore = sortedScores.filter((s) => s.score < score).length;
      const percent = (belowYourScore / sortedScores.length) * 100;
      setPercentile(percent.toFixed(2));

      await userTestFetchDataApi();

      const alluser = getLocalStorage("AllUserTestData");
      const gp = await alluser?.filter(
        (e) => e.subject === sub && e.section === topic,
      );
      if (gp && gp.length > 0) {
        setTotalStudent(gp.length);
        const sortedScoresrank = gp?.sort((a, b) => b.score - a.score);
        const strank =
          sortedScoresrank.filter((s) => s.score < score).length + 1;
        setLocalStorage("rank", strank);
        setrank(strank);
      }
    }
  };

  const handleCalculate = () => {
    const yourScore = getLocalStorage("Total");
    const scores = getLocalStorage("AllUserTestData");
    calculatePercentile(yourScore, scores);
  };

  // Load saved questions on mount
  useEffect(() => {
    setTotalMark(getLocalStorage("Total") || 0);
    SetTotalQuestion(getLocalStorage("Testdata") || []);
    const s = getLocalStorage("test");
    if (s && s[0]) {
      setTestData(s[0]);
      setmarknotans(s[0].markedNotAnswer?.length || 0);
      setnotans(s[0].notAnswer?.length || 0);
      setmarkedAndAnswered(s[0].markedAndAnswer?.length || 0);
      setansweredQuestioned(s[0].answeredQuestion?.length || 0);
      setwrongAns(s[0].wrongans || 0);
      setwrongAnsqus(s[0].wrongansqus || []);
      setcorrectqus(s[0].correctQus || []);
      setAllAnswers(s[0].allAnswer || {});
    }
    handleCalculate();
  }, []);

  // Load existing saved questions when TotalQuestion changes
  useEffect(() => {
    if (TotalQuestion.length > 0) {
      loadSavedQuestions();
    }
  }, [TotalQuestion]);

  // Load existing saved questions to show which are already bookmarked
  const loadSavedQuestions = () => {
    const subject = getLocalStorage("Subject");
    const subjectKey = subject?.toLowerCase() || "general studies";
    const allSaved = getLocalStorage("savedQuestionsBySubject") || {};
    const savedForSubject = allSaved[subjectKey] || [];

    // Create a set of question texts to check if already saved
    const savedTexts = new Set(savedForSubject.map((q) => q.qus));
    const savedIndices = new Set();

    TotalQuestion.forEach((q, idx) => {
      if (savedTexts.has(q.qus)) {
        savedIndices.add(idx);
      }
    });

    setSavedQuestionIndices(savedIndices);
  };

  // Toggle save question
  const toggleSaveQuestion = (question, index) => {
    const subject = getLocalStorage("Subject");
    const subjectKey = subject?.toLowerCase() || "general studies";

    // Get current saved questions
    const allSaved = getLocalStorage("savedQuestionsBySubject") || {};
    const savedForSubject = allSaved[subjectKey] || [];

    // Check if question is already saved
    const existingIndex = savedForSubject.findIndex(
      (q) => q.qus === question.qus,
    );

    if (existingIndex >= 0) {
      // Remove question
      savedForSubject.splice(existingIndex, 1);
      allSaved[subjectKey] = savedForSubject;
      setLocalStorage("savedQuestionsBySubject", allSaved);

      // Update qusno
      const qusno = (getLocalStorage("qusno") || []).filter(
        (t) => t !== question.qus,
      );
      setLocalStorage("qusno", qusno);

      // Update state
      setSavedQuestionIndices((prev) => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });

      toast({
        title: "Question removed",
        description: "Question removed from saved questions",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      // Add question
      savedForSubject.push(question);
      allSaved[subjectKey] = savedForSubject;
      setLocalStorage("savedQuestionsBySubject", allSaved);

      // Update qusno
      const qusno = getLocalStorage("qusno") || [];
      if (!qusno.includes(question.qus)) {
        qusno.push(question.qus);
        setLocalStorage("qusno", qusno);
      }

      // Update state
      setSavedQuestionIndices((prev) => new Set(prev).add(index));

      toast({
        title: "Question saved!",
        description: "Question added to your saved questions",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // Doughnut chart data
  const doughnutData = {
    labels: ["Correct", "Incorrect", "Unattempted"],
    datasets: [
      {
        data: [
          correctqus.length,
          wrongAnsqus.length,
          TotalQuestion.length - (answeredQuestioned + markedAndAnswered),
        ],
        backgroundColor: ["#48BB78", "#F56565", "#CBD5E0"],
        borderWidth: 0,
        cutout: "75%",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        padding: 12,
        borderRadius: 8,
      },
    },
  };

  // Performance metric card component
  const MetricCard = ({ icon, label, value, subtext, color, bgColor }) => (
    <Card
      bg="white"
      shadow="sm"
      borderRadius={{ base: "lg", md: "xl" }}
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ shadow: "md", transform: "translateY(-4px)" }}
      border="1px"
      borderColor="gray.100"
      height="100%"
    >
      <CardBody p={{ base: 3, sm: 4, md: 5 }}>
        <Flex
          align="center"
          justify="space-between"
          mb={{ base: 2, md: 3 }}
          direction={{ base: "column", sm: "row" }}
          gap={2}
        >
          <Circle size={{ base: "36px", sm: "40px", md: "48px" }} bg={bgColor}>
            <Icon as={icon} boxSize={{ base: 3, sm: 4, md: 5 }} color={color} />
          </Circle>
          <Badge
            colorScheme={color.split(".")[0]}
            fontSize={{ base: "2xs", md: "xs" }}
            px={{ base: 2, md: 3 }}
            py={1}
            borderRadius="full"
          >
            {subtext}
          </Badge>
        </Flex>
        <Stat>
          <StatLabel
            fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
            color="gray.500"
            mb={1}
          >
            {label}
          </StatLabel>
          <StatNumber
            fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
            fontWeight="bold"
            color="gray.700"
          >
            {value}
          </StatNumber>
        </Stat>
      </CardBody>
    </Card>
  );

  // Score breakdown item
  const ScoreItem = ({ icon, label, value, color }) => (
    <Flex align="center" py={{ base: 2, md: 3 }}>
      <Circle
        size={{ base: "32px", sm: "36px", md: "40px" }}
        bg={`${color}.50`}
        mr={{ base: 2, md: 3 }}
      >
        <Icon
          as={icon}
          color={`${color}.600`}
          boxSize={{ base: 3, sm: 4, md: 5 }}
        />
      </Circle>
      <Box flex="1">
        <Text
          fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
          color="gray.600"
          mb={1}
        >
          {label}
        </Text>
        <Text
          fontSize={{ base: "sm", sm: "md", md: "lg" }}
          fontWeight="semibold"
          color="gray.700"
        >
          {value}
        </Text>
      </Box>
    </Flex>
  );

  // Question Card Component with Bookmark button
  const QuestionCard = ({ question, index }) => {
    if (!question) return null;

    const userAnswer = allAnswers[index];
    const correctAnswerIndex = question.answer - 1;
    const correctAnswerText = question.options?.[correctAnswerIndex];
    const isCorrect = correctqus.includes(index);
    const isWrong = wrongAnsqus.includes(index);
    const isMarked =
      testData?.markedAndAnswer?.includes(index) ||
      testData?.markedNotAnswer?.includes(index);
    const isSaved = savedQuestionIndices.has(index);

    let statusColor = "gray";
    let statusText = "Unattempted";
    let statusIcon = FiCircle;

    if (isCorrect) {
      statusColor = "green";
      statusText = "Correct";
      statusIcon = FiCheckCircle;
    } else if (isWrong) {
      statusColor = "red";
      statusText = "Incorrect";
      statusIcon = FiXCircle;
    } else if (isMarked) {
      statusColor = "orange";
      statusText = "Marked";
      statusIcon = FiFlag;
    }

    return (
      <Card
        mb={{ base: 3, md: 4 }}
        bg="white"
        shadow="md"
        borderRadius={{ base: "md", md: "lg" }}
        border="2px"
        borderColor={isCorrect ? "green.200" : isWrong ? "red.200" : "gray.100"}
        width="100%"
      >
        <CardBody p={{ base: 3, sm: 4, md: 5 }}>
          {/* Question Header */}
          <Flex
            justify="space-between"
            align="flex-start"
            mb={{ base: 3, md: 4 }}
            gap={2}
            wrap="wrap"
          >
            <HStack spacing={{ base: 1.5, sm: 2, md: 3 }} wrap="wrap" flex="1">
              <Circle
                size={{ base: "24px", sm: "28px", md: "32px" }}
                bg="gray.100"
                fontWeight="bold"
                fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                color="gray.700"
              >
                {index + 1}
              </Circle>
              <Badge
                colorScheme={statusColor}
                px={{ base: 1.5, sm: 2, md: 3 }}
                py={1}
                borderRadius="full"
                fontSize="2xs"
              >
                <HStack spacing={1}>
                  <Icon as={statusIcon} boxSize={{ base: 2.5, md: 3 }} />
                  <Text>{statusText}</Text>
                </HStack>
              </Badge>
              {isMarked && (
                <Badge
                  colorScheme="orange"
                  px={{ base: 1.5, sm: 2, md: 3 }}
                  py={1}
                  borderRadius="full"
                  fontSize="2xs"
                >
                  <HStack spacing={1}>
                    <Icon as={FiFlag} boxSize={{ base: 2.5, md: 3 }} />
                    <Text>Marked</Text>
                  </HStack>
                </Badge>
              )}
            </HStack>

            {/* Bookmark Button */}
            <Tooltip
              label={isSaved ? "Remove from saved" : "Save question"}
              placement="top"
              hasArrow
            >
              <IconButton
                icon={<FiBookmark />}
                size={{ base: "sm", md: "md" }}
                variant={isSaved ? "solid" : "outline"}
                colorScheme={isSaved ? "purple" : "gray"}
                aria-label={isSaved ? "Remove bookmark" : "Bookmark question"}
                onClick={() => toggleSaveQuestion(question, index)}
                _hover={{
                  transform: "scale(1.1)",
                  shadow: "md",
                }}
                transition="all 0.2s"
              />
            </Tooltip>
          </Flex>

          {/* Question Text */}
          <Text
            fontSize={{ base: "xs", sm: "sm", md: "md" }}
            fontWeight="semibold"
            color="gray.700"
            mb={{ base: 3, md: 4 }}
            lineHeight="tall"
          >
            {question.qus}
          </Text>

          {/* Options */}
          <VStack
            align="stretch"
            spacing={{ base: 2, md: 3 }}
            mb={{ base: 3, md: 4 }}
          >
            {question.options?.map((option, optIndex) => {
              const isUserAnswer = userAnswer === option;
              const isCorrectOption = optIndex === correctAnswerIndex;

              return (
                <Box
                  key={optIndex}
                  p={{ base: 2, sm: 2.5, md: 3 }}
                  borderRadius="md"
                  border="2px"
                  borderColor={
                    isCorrectOption
                      ? "green.400"
                      : isUserAnswer && isWrong
                        ? "red.400"
                        : "gray.200"
                  }
                  bg={
                    isCorrectOption
                      ? "green.50"
                      : isUserAnswer && isWrong
                        ? "red.50"
                        : "transparent"
                  }
                >
                  <Flex
                    justify="space-between"
                    align="center"
                    gap={2}
                    wrap="wrap"
                  >
                    <HStack spacing={{ base: 2, md: 3 }} flex="1" minW="0">
                      <Circle
                        size={{ base: "20px", sm: "22px", md: "24px" }}
                        bg={
                          isCorrectOption
                            ? "green.500"
                            : isUserAnswer && isWrong
                              ? "red.500"
                              : "gray.300"
                        }
                        color="white"
                        fontSize="2xs"
                        fontWeight="bold"
                        flexShrink={0}
                      >
                        {String.fromCharCode(65 + optIndex)}
                      </Circle>
                      <Text
                        fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                        color="gray.700"
                        fontWeight={
                          isUserAnswer || isCorrectOption
                            ? "semibold"
                            : "normal"
                        }
                        wordBreak="break-word"
                      >
                        {option}
                      </Text>
                    </HStack>
                    {isCorrectOption && (
                      <Badge colorScheme="green" fontSize="2xs" flexShrink={0}>
                        Correct
                      </Badge>
                    )}
                    {isUserAnswer && isWrong && (
                      <Badge colorScheme="red" fontSize="2xs" flexShrink={0}>
                        Your Answer
                      </Badge>
                    )}
                  </Flex>
                </Box>
              );
            })}
          </VStack>

          {/* Explanation */}
          {question.explanation && (
            <Box
              p={{ base: 2.5, sm: 3, md: 4 }}
              bg="blue.50"
              borderRadius="md"
              borderLeft="4px"
              borderColor="blue.400"
              mb={{ base: 3, md: 4 }}
            >
              <HStack spacing={2} mb={2}>
                <Icon
                  as={FiAlertCircle}
                  color="blue.500"
                  boxSize={{ base: 3.5, sm: 4, md: 5 }}
                />
                <Text
                  fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                  fontWeight="bold"
                  color="blue.700"
                >
                  Explanation
                </Text>
              </HStack>
              <Text
                fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                color="blue.800"
                lineHeight="tall"
              >
                {question.explanation}
              </Text>
            </Box>
          )}

          {/* Answer Summary */}
          <Box pt={{ base: 3, md: 4 }} borderTop="1px" borderColor="gray.200">
            <Flex
              justify="space-between"
              align={{ base: "flex-start", sm: "center" }}
              gap={{ base: 2, md: 3 }}
              direction={{ base: "column", sm: "row" }}
            >
              <VStack align="start" spacing={1} flex="1">
                <Text
                  fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                  color="gray.600"
                >
                  Your Answer:{" "}
                  <Text
                    as="span"
                    fontWeight="bold"
                    color={
                      isCorrect ? "green.600" : isWrong ? "red.600" : "gray.500"
                    }
                  >
                    {userAnswer || "Not Attempted"}
                  </Text>
                </Text>
                <Text
                  fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                  color="gray.600"
                >
                  Correct Answer:{" "}
                  <Text as="span" fontWeight="bold" color="green.600">
                    {correctAnswerText}
                  </Text>
                </Text>
              </VStack>
              {isCorrect ? (
                <Badge
                  colorScheme="green"
                  px={{ base: 2, md: 3 }}
                  py={1}
                  fontSize={{ base: "2xs", md: "xs" }}
                >
                  +1 Point
                </Badge>
              ) : userAnswer ? (
                <Badge
                  colorScheme="red"
                  px={{ base: 2, md: 3 }}
                  py={1}
                  fontSize={{ base: "2xs", md: "xs" }}
                >
                  0 Points
                </Badge>
              ) : (
                <Badge
                  colorScheme="gray"
                  px={{ base: 2, md: 3 }}
                  py={1}
                  fontSize={{ base: "2xs", md: "xs" }}
                >
                  Not Attempted
                </Badge>
              )}
            </Flex>
          </Box>
        </CardBody>
      </Card>
    );
  };

  // Render questions for each tab
  const renderQuestions = (questionIndices) => {
    if (!questionIndices || questionIndices.length === 0) {
      return (
        <Box textAlign="center" py={{ base: 6, md: 10 }}>
          <Icon
            as={FiAlertCircle}
            boxSize={{ base: 8, sm: 10, md: 12 }}
            color="gray.300"
            mb={4}
          />
          <Text color="gray.500" fontSize={{ base: "xs", sm: "sm", md: "md" }}>
            No questions in this category
          </Text>
        </Box>
      );
    }

    return questionIndices.map((qIndex) => {
      const question = TotalQuestion[qIndex];
      if (!question) return null;
      return <QuestionCard key={qIndex} question={question} index={qIndex} />;
    });
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, blue.50, purple.50)"
      py={{ base: 3, sm: 4, md: 6, lg: 8 }}
      px={{ base: 2, sm: 3, md: 6, lg: 10 }}
    >
      <Container maxW="1400px" px={{ base: 2, sm: 3, md: 4 }}>
        {/* Header */}
        <Flex align="center" mb={{ base: 4, sm: 6, md: 8 }}>
          <Link to="/">
            <Icon
              as={FiArrowLeft}
              boxSize={{ base: 4, sm: 5, md: 6 }}
              color="purple.600"
              cursor="pointer"
              mr={{ base: 2, sm: 3, md: 4 }}
              _hover={{ transform: "translateX(-4px)" }}
              transition="all 0.2s"
            />
          </Link>

          <Box>
            <Heading
              fontSize={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="bold"
              color="gray.700"
              mb={1}
            >
              Test Results
            </Heading>

            <Text
              color="gray.500"
              fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
              display={{ base: "none", sm: "block" }}
            >
              Detailed performance analysis and insights
            </Text>
          </Box>

          <Box
            ml="auto"
            fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
            fontWeight="medium"
            bg="blue.600"
            color="white"
            px={{ base: 2, sm: 2.5, md: 3 }}
            py={{ base: 1, sm: 1.5, md: 2 }}
            borderRadius="md"
            whiteSpace="nowrap"
          >
            <Link to="/Review-Test">Review Test</Link>
          </Box>
        </Flex>

        {/* Main Content */}
        <VStack spacing={{ base: 4, md: 6 }} mb={{ base: 4, md: 6, lg: 8 }}>
          {/* Score Overview Card */}
          <Card
            bg="white"
            shadow="lg"
            borderRadius={{ base: "lg", md: "2xl" }}
            overflow="hidden"
            border="1px"
            borderColor="gray.100"
            width="100%"
          >
            <CardBody p={{ base: 3, sm: 4, md: 6 }}>
              {/* Score Circle */}
              <Box position="relative" mb={{ base: 3, sm: 4, md: 6 }}>
                <Box
                  h={{ base: "180px", sm: "220px", md: "280px" }}
                  position="relative"
                >
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                  <Flex
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    direction="column"
                    align="center"
                  >
                    <Text
                      fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
                      fontWeight="bold"
                      color="purple.600"
                    >
                      {totalMark}
                    </Text>
                    <Text
                      fontSize={{ base: "sm", sm: "md", md: "lg" }}
                      color="gray.500"
                    >
                      / {TotalQuestion.length}
                    </Text>
                    <Text
                      fontSize={{ base: "2xs", md: "xs" }}
                      color="gray.400"
                      mt={1}
                    >
                      Score
                    </Text>
                  </Flex>
                </Box>
              </Box>

              <Divider mb={{ base: 3, md: 4 }} />

              {/* Score Breakdown */}
              <Box>
                <ScoreItem
                  icon={FiCheckCircle}
                  label="Correct Answers"
                  value={correctqus.length}
                  color="green"
                />
                <ScoreItem
                  icon={FiXCircle}
                  label="Incorrect Answers"
                  value={wrongAnsqus.length}
                  color="red"
                />
                <ScoreItem
                  icon={FiCircle}
                  label="Unattempted"
                  value={
                    TotalQuestion.length -
                    (answeredQuestioned + markedAndAnswered)
                  }
                  color="gray"
                />
              </Box>
            </CardBody>
          </Card>

          {/* Performance Metrics */}
          <Grid
            templateColumns={{ base: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={{ base: 2, sm: 3, md: 4 }}
            width="100%"
          >
            <MetricCard
              icon={FiTarget}
              label="Accuracy"
              value={`${calculateAccuracy().toFixed(1)}%`}
              subtext="Performance"
              color="green.600"
              bgColor="green.50"
            />
            <MetricCard
              icon={FiCheckCircle}
              label="Completion"
              value={`${
                TotalQuestion.length > 0
                  ? Math.round(
                      ((answeredQuestioned + markedAndAnswered) /
                        TotalQuestion.length) *
                        100,
                    )
                  : 0
              }%`}
              subtext="Attempted"
              color="orange.600"
              bgColor="orange.50"
            />
          </Grid>

          {/* Progress Bar */}
          <Card
            bg="white"
            shadow="sm"
            borderRadius={{ base: "lg", md: "xl" }}
            border="1px"
            borderColor="gray.100"
            width="100%"
          >
            <CardBody p={{ base: 3, sm: 4, md: 6 }}>
              <Flex
                justify="space-between"
                align="center"
                mb={{ base: 2, md: 3 }}
              >
                <Text
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  fontWeight="semibold"
                  color="gray.700"
                >
                  Overall Performance
                </Text>
                <Text
                  fontSize={{ base: "md", sm: "lg", md: "xl" }}
                  fontWeight="bold"
                  color="purple.600"
                >
                  {calculateAccuracy().toFixed(1)}%
                </Text>
              </Flex>
              <Progress
                value={calculateAccuracy()}
                size={{ base: "sm", md: "lg" }}
                borderRadius="full"
                colorScheme="purple"
                hasStripe
                isAnimated
              />
              <Flex justify="space-between" mt={2}>
                <Text fontSize="2xs" color="gray.500">
                  0%
                </Text>
                <Text fontSize="2xs" color="gray.500">
                  100%
                </Text>
              </Flex>
            </CardBody>
          </Card>
        </VStack>

        {/* Tabs Section */}
        <Card
          bg="white"
          shadow="lg"
          borderRadius={{ base: "lg", md: "2xl" }}
          overflow="hidden"
          border="1px"
          borderColor="gray.100"
        >
          <CardBody p={0}>
            <Tabs colorScheme="purple" variant="soft-rounded">
              <Box
                px={{ base: 2, sm: 3, md: 6 }}
                pt={{ base: 3, sm: 4, md: 6 }}
              >
                <Box
                  bg="gray.50"
                  p={1}
                  borderRadius="xl"
                  overflowX="auto"
                  css={{
                    "&::-webkit-scrollbar": {
                      height: "4px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                      background: "#CBD5E0",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <TabList
                    border="none"
                    gap={{ base: 1, md: 2 }}
                    minWidth="max-content"
                  >
                    <Tab
                      fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                      fontWeight="medium"
                      px={{ base: 2, sm: 2.5, md: 3 }}
                      py={{ base: 1, sm: 1.5, md: 2 }}
                      _selected={{ bg: "purple.600", color: "white" }}
                      whiteSpace="nowrap"
                    >
                      Overview ({TotalQuestion.length})
                    </Tab>
                    <Tab
                      fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                      fontWeight="medium"
                      px={{ base: 2, sm: 2.5, md: 3 }}
                      py={{ base: 1, sm: 1.5, md: 2 }}
                      _selected={{ bg: "purple.600", color: "white" }}
                      whiteSpace="nowrap"
                    >
                      Correct ({correctqus.length})
                    </Tab>
                    <Tab
                      fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                      fontWeight="medium"
                      px={{ base: 2, sm: 2.5, md: 3 }}
                      py={{ base: 1, sm: 1.5, md: 2 }}
                      _selected={{ bg: "purple.600", color: "white" }}
                      whiteSpace="nowrap"
                    >
                      Incorrect ({wrongAnsqus.length})
                    </Tab>
                    <Tab
                      fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                      fontWeight="medium"
                      px={{ base: 2, sm: 2.5, md: 3 }}
                      py={{ base: 1, sm: 1.5, md: 2 }}
                      _selected={{ bg: "purple.600", color: "white" }}
                      whiteSpace="nowrap"
                    >
                      Marked ({marknotans + markedAndAnswered})
                    </Tab>
                    <Tab
                      fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                      fontWeight="medium"
                      px={{ base: 2, sm: 2.5, md: 3 }}
                      py={{ base: 1, sm: 1.5, md: 2 }}
                      _selected={{ bg: "purple.600", color: "white" }}
                      whiteSpace="nowrap"
                    >
                      Unattempted ({notans})
                    </Tab>
                  </TabList>
                </Box>
              </Box>

              <TabPanels>
                {/* Overview Tab */}
                <TabPanel p={{ base: 2, sm: 3, md: 6 }}>
                  <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                    <Box mb={{ base: 1, sm: 2, md: 4 }}>
                      <Heading
                        size={{ base: "xs", sm: "sm", md: "md" }}
                        mb={{ base: 1, md: 2 }}
                        color="gray.700"
                      >
                        All Questions ({TotalQuestion.length})
                      </Heading>
                      <Text
                        fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                        color="gray.500"
                      >
                        Complete test review with answers and explanations.
                        Click the bookmark icon 📑 to save questions for later
                        practice.
                      </Text>
                    </Box>
                    {TotalQuestion.map((question, index) => (
                      <QuestionCard
                        key={index}
                        question={question}
                        index={index}
                      />
                    ))}
                  </VStack>
                </TabPanel>

                {/* Correct Answers Tab */}
                <TabPanel p={{ base: 2, sm: 3, md: 6 }}>
                  <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                    <Box mb={{ base: 1, sm: 2, md: 4 }}>
                      <Heading
                        size={{ base: "xs", sm: "sm", md: "md" }}
                        mb={{ base: 1, md: 2 }}
                        color="green.600"
                      >
                        Correct Answers ({correctqus.length})
                      </Heading>
                      <Text
                        fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                        color="gray.500"
                      >
                        Questions you answered correctly
                      </Text>
                    </Box>
                    {renderQuestions(correctqus)}
                  </VStack>
                </TabPanel>

                {/* Incorrect Answers Tab */}
                <TabPanel p={{ base: 2, sm: 3, md: 6 }}>
                  <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                    <Box mb={{ base: 1, sm: 2, md: 4 }}>
                      <Heading
                        size={{ base: "xs", sm: "sm", md: "md" }}
                        mb={{ base: 1, md: 2 }}
                        color="red.600"
                      >
                        Incorrect Answers ({wrongAnsqus.length})
                      </Heading>
                      <Text
                        fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                        color="gray.500"
                      >
                        Review these questions to improve. 💡 Tip: Save them for
                        later practice!
                      </Text>
                    </Box>
                    {renderQuestions(wrongAnsqus)}
                  </VStack>
                </TabPanel>

                {/* Marked Questions Tab */}
                <TabPanel p={{ base: 2, sm: 3, md: 6 }}>
                  <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                    <Box mb={{ base: 1, sm: 2, md: 4 }}>
                      <Heading
                        size={{ base: "xs", sm: "sm", md: "md" }}
                        mb={{ base: 1, md: 2 }}
                        color="orange.600"
                      >
                        Marked for Review ({marknotans + markedAndAnswered})
                      </Heading>
                      <Text
                        fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                        color="gray.500"
                      >
                        Questions you marked during the test
                      </Text>
                    </Box>
                    {renderQuestions([
                      ...(testData?.markedNotAnswer || []),
                      ...(testData?.markedAndAnswer || []),
                    ])}
                  </VStack>
                </TabPanel>

                {/* Unattempted Questions Tab */}
                <TabPanel p={{ base: 2, sm: 3, md: 6 }}>
                  <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                    <Box mb={{ base: 1, sm: 2, md: 4 }}>
                      <Heading
                        size={{ base: "xs", sm: "sm", md: "md" }}
                        mb={{ base: 1, md: 2 }}
                        color="gray.600"
                      >
                        Unattempted Questions ({notans})
                      </Heading>
                      <Text
                        fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                        color="gray.500"
                      >
                        Questions you didn't attempt
                      </Text>
                    </Box>
                    {renderQuestions(testData?.notAnswer || [])}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBody>
        </Card>
      </Container>
    </Box>
  );
};

export default ResultPage;
