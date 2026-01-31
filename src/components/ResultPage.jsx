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
  GridItem,
  Card,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Divider,
  Circle,
} from "@chakra-ui/react";
import {
  FiAward,
  FiTrendingUp,
  FiTarget,
  FiCheckCircle,
  FiXCircle,
  FiCircle,
  FiArrowLeft,
} from "react-icons/fi";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
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
  Tooltip,
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

  // Color mode values
  const bgGradient = useColorModeValue(
    "linear(to-br, blue.50, purple.50)",
    "linear(to-br, gray.900, gray.800)",
  );
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.100");
  const accentColor = useColorModeValue("purple.600", "purple.300");

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
      setTotalStudent(gp.length);
      const sortedScoresrank = gp?.sort((a, b) => b.score - a.score);
      const strank = sortedScoresrank.filter((s) => s.score < score).length + 1;
      setLocalStorage("rank", strank);
      setrank(strank);
    }
  };

  const handleCalculate = () => {
    const yourScore = getLocalStorage("Total");
    const scores = getLocalStorage("AllUserTestData");
    calculatePercentile(yourScore, scores);
  };

  useEffect(() => {
    setTotalMark(getLocalStorage("Total") || 0);
    SetTotalQuestion(getLocalStorage("Testdata") || []);
    const s = getLocalStorage("test");
    if (s && s[0]) {
      setmarknotans(s[0].markedNotAnswer?.length || 0);
      setnotans(s[0].notAnswer?.length || 0);
      setmarkedAndAnswered(s[0].markedAndAnswer?.length || 0);
      setansweredQuestioned(s[0].answeredQuestion?.length || 0);
      setwrongAns(s[0].wrongans || 0);
      setwrongAnsqus(s[0].wrongansqus || []);
      setcorrectqus(s[0].correctQus || []);
    }
    handleCalculate();
  }, []);

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
      bg={cardBg}
      shadow="sm"
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.3s"
      _hover={{ shadow: "md", transform: "translateY(-4px)" }}
      border="1px"
      borderColor={useColorModeValue("gray.100", "gray.700")}
    >
      <CardBody p={5}>
        <Flex align="center" justify="space-between" mb={3}>
          <Circle size="48px" bg={bgColor}>
            <Icon as={icon} boxSize={5} color={color} />
          </Circle>
          <Badge
            colorScheme={color.split(".")[0]}
            fontSize="xs"
            px={3}
            py={1}
            borderRadius="full"
          >
            {subtext}
          </Badge>
        </Flex>
        <Stat>
          <StatLabel fontSize="sm" color="gray.500" mb={1}>
            {label}
          </StatLabel>
          <StatNumber fontSize="2xl" fontWeight="bold" color={textColor}>
            {value}
          </StatNumber>
        </Stat>
      </CardBody>
    </Card>
  );

  // Score breakdown item
  const ScoreItem = ({ icon, label, value, color }) => (
    <Flex align="center" py={3}>
      <Circle size="40px" bg={`${color}.50`} mr={4}>
        <Icon as={icon} color={`${color}.600`} boxSize={5} />
      </Circle>
      <Box flex="1">
        <Text fontSize="sm" color="gray.600" mb={1}>
          {label}
        </Text>
        <Text fontSize="lg" fontWeight="semibold" color={textColor}>
          {value}
        </Text>
      </Box>
    </Flex>
  );

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={8} px={10}>
      <Container maxW="1400px">
        {/* Header */}
        <Flex align="center" mb={8}>
          <Link to="/">
            <Icon
              as={FiArrowLeft}
              boxSize={6}
              color={accentColor}
              cursor="pointer"
              mr={4}
              _hover={{ transform: "translateX(-4px)" }}
              transition="all 0.2s"
            />
          </Link>
          <Box>
            <Heading
              fontSize={{ base: "2xl", md: "3xl" }}
              fontWeight="bold"
              color={textColor}
              mb={1}
            >
              Test Results
            </Heading>
            <Text color="gray.500" fontSize="sm">
              Detailed performance analysis and insights
            </Text>
          </Box>
        </Flex>

        {/* Main Content */}
        <Grid templateColumns={{ base: "1fr", lg: "400px 1fr" }} gap={6} mb={8}>
          {/* Left Column - Score Overview */}
          <GridItem>
            <Card
              bg={cardBg}
              shadow="lg"
              borderRadius="2xl"
              overflow="hidden"
              border="1px"
              borderColor={useColorModeValue("gray.100", "gray.700")}
            >
              <CardBody p={6}>
                {/* Score Circle */}
                <Box position="relative" mb={6}>
                  <Box h="280px" position="relative">
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
                        fontSize="4xl"
                        fontWeight="bold"
                        color={accentColor}
                      >
                        {totalMark}
                      </Text>
                      <Text fontSize="lg" color="gray.500">
                        / {TotalQuestion.length}
                      </Text>
                      <Text fontSize="xs" color="gray.400" mt={1}>
                        Score
                      </Text>
                    </Flex>
                  </Box>
                </Box>

                <Divider mb={4} />

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
          </GridItem>

          {/* Right Column - Performance Metrics */}
          <GridItem>
            <Grid
              templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }}
              gap={4}
              mb={6}
            >
              <MetricCard
                icon={FiAward}
                label="Your Rank"
                value={`#${rank}`}
                subtext={`Top ${((rank / TotalStudent) * 100).toFixed(0)}%`}
                color="purple.600"
                bgColor="purple.50"
              />
              <MetricCard
                icon={FiTrendingUp}
                label="Percentile"
                value={`${percentile}%`}
                subtext={`${TotalStudent} students`}
                color="blue.600"
                bgColor="blue.50"
              />
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
                value={`${Math.round(
                  ((answeredQuestioned + markedAndAnswered) /
                    TotalQuestion.length) *
                    100,
                )}%`}
                subtext="Attempted"
                color="orange.600"
                bgColor="orange.50"
              />
            </Grid>

            {/* Accuracy Progress Bar */}
            <Card
              bg={cardBg}
              shadow="sm"
              borderRadius="xl"
              border="1px"
              borderColor={useColorModeValue("gray.100", "gray.700")}
            >
              <CardBody p={6}>
                <Flex justify="space-between" align="center" mb={3}>
                  <Text fontSize="md" fontWeight="semibold" color={textColor}>
                    Overall Performance
                  </Text>
                  <Text fontSize="xl" fontWeight="bold" color={accentColor}>
                    {calculateAccuracy().toFixed(1)}%
                  </Text>
                </Flex>
                <Progress
                  value={calculateAccuracy()}
                  size="lg"
                  borderRadius="full"
                  colorScheme="purple"
                  hasStripe
                  isAnimated
                />
                <Flex justify="space-between" mt={2}>
                  <Text fontSize="xs" color="gray.500">
                    0%
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    100%
                  </Text>
                </Flex>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Tabs Section */}
        <Card
          bg={cardBg}
          shadow="lg"
          borderRadius="2xl"
          overflow="hidden"
          border="1px"
          borderColor={useColorModeValue("gray.100", "gray.700")}
        >
          <CardBody p={0}>
            <Tabs colorScheme="purple" variant="soft-rounded">
              <Box px={6} pt={6}>
                <TabList
                  bg={useColorModeValue("gray.50", "gray.700")}
                  p={1}
                  borderRadius="xl"
                  flexWrap="wrap"
                  gap={2}
                >
                  <Tab
                    fontSize="sm"
                    fontWeight="medium"
                    _selected={{
                      bg: accentColor,
                      color: "white",
                    }}
                  >
                    Overview
                  </Tab>
                  <Tab
                    fontSize="sm"
                    fontWeight="medium"
                    _selected={{
                      bg: accentColor,
                      color: "white",
                    }}
                  >
                    <Link to="/Review-Test">Review Test</Link>
                  </Tab>
                  <Tab
                    fontSize="sm"
                    fontWeight="medium"
                    _selected={{
                      bg: accentColor,
                      color: "white",
                    }}
                  >
                    Analysis
                  </Tab>
                  <Tab
                    fontSize="sm"
                    fontWeight="medium"
                    _selected={{
                      bg: accentColor,
                      color: "white",
                    }}
                  >
                    Correct
                  </Tab>
                  <Tab
                    fontSize="sm"
                    fontWeight="medium"
                    _selected={{
                      bg: accentColor,
                      color: "white",
                    }}
                  >
                    Incorrect
                  </Tab>
                </TabList>
              </Box>

              <TabPanels>
                <TabPanel p={6}>
                  <Text color={textColor}>
                    Overview content goes here - You can add detailed
                    statistics, question-wise breakdown, time analysis, etc.
                  </Text>
                </TabPanel>
                <TabPanel p={6}>
                  <Text color={textColor}>Review Test content</Text>
                </TabPanel>
                <TabPanel p={6}>
                  <Text color={textColor}>Detailed Analysis content</Text>
                </TabPanel>
                <TabPanel p={6}>
                  <Text color={textColor}>Correct answers review</Text>
                </TabPanel>
                <TabPanel p={6}>
                  <Text color={textColor}>Incorrect answers review</Text>
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
