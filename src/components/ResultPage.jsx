import {
  Box,
  Flex,
  Heading,
  Icon,
  Text,
  List,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
} from "@chakra-ui/react";
import {
  FaArrowLeft,
  FaTrophy,
  FaMedal,
  FaPercentage,
  FaCheckCircle,
  FaTimesCircle,
  FaMinusCircle,
  FaBullseye,
} from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  // chartOptions
} from "chart.js";
import { useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "../helpers/localStorage";
import { userTestFetchDataApi } from "../redux/userTestData/userTestData_ActionType";
import { Link } from "react-router-dom";

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultPage = ({chartOptions}) => {
  const [totalMark, setTotalMark] = useState(0);
  const [TotalQuestion, SetTotalQuestion] = useState([]);
  const [marknotans, setmarknotans] = useState(0);
  const [notans, setnotans] = useState(0);
  const [answeredQuestioned, setansweredQuestioned] = useState(0);
  const [markedAndAnswered, setmarkedAndAnswered] = useState(0);
  const [wrongAns, setwrongAns] = useState(0);
  const [wrongAnsqus, setwrongAnsqus] = useState([]);
  const [correctqus, setcorrectqus] = useState([]);
  const [rank,setrank] = useState(1);
   const [TotalStudent, setTotalStudent] = useState(0);
  const [percentile, setPercentile] = useState(0);

  console.log();
  const calculateAccuracy = () => {
    return (totalMark / TotalQuestion.length) * 100;
  };

  const calculatePercentile =async (score, allScores) => {
    // Sort the array of scores in ascending order
    const sub = getLocalStorage("Subject");
    const t = getLocalStorage("test");
    const topic = getLocalStorage("category");
    const g = await allScores?.filter(
      (e) => e.subject === sub && e.section === topic
    );
    console.log(g); 
    if(g!==undefined){  
setTotalStudent(g?.length)
    const sortedScores = g?.sort((a, b) => a.score - b.score);
    // Find how many scores are less than the user's score
    console.log(sortedScores);

    const belowYourScore = sortedScores.filter((s) => s.score < score).length;

    // Calculate percentile
    const percent = (belowYourScore / sortedScores.length) * 100;
    console.log("p", percent);

    setPercentile(percent.toFixed(2));
 
    //rank
    // Sort scores in descending order
  await  userTestFetchDataApi()
    
     const alluser = getLocalStorage("AllUserTestData");
     const gp = await alluser?.filter(
       (e) => e.subject === sub && e.section === topic
     );
     console.log(gp);
     setTotalStudent(gp.length);
    const sortedScoresrank = gp?.sort((a, b) => b.score - a.score);
console.log("s", score, sortedScoresrank,sortedScoresrank.indexOf(score));

    // Calculate rank (index of the user's score + 1 in the sorted array)
    const strank = sortedScoresrank.filter((s) => s.score < score).length+1;

    console.log("k",strank,sortedScoresrank);
    setLocalStorage("rank",strank)
    setrank(strank) 
    }
  }; 
  
  const handleCalculate = () => { 
    const yourScore = getLocalStorage("Total");
    const scores = getLocalStorage("AllUserTestData");
    const result = calculatePercentile(yourScore, scores);
    // setPercentile(result);
  };

  useEffect(() => {
    setTotalMark(getLocalStorage("Total"));
    SetTotalQuestion(getLocalStorage("Testdata"));
    const s = getLocalStorage("test");
    setmarknotans(s[0].markedNotAnswer.length);
    setnotans(s[0].notAnswer.length);
    setmarkedAndAnswered(s[0].markedAndAnswer.length);
    setansweredQuestioned(s[0].answeredQuestion.length);
    setwrongAns(s[0].wrongans);
    setwrongAnsqus(s[0].wrongansqus);
    setcorrectqus(s[0].correctQus);
    console.log(marknotans);
    handleCalculate()
    // SetTotalQuestion(TotalQuestion.questions);
  }, []);


 

  // Data for the bar chart
  const chartData = {
    labels: ["Correct", "Incorrect", "Unattempted"],
    datasets: [
      {
        label: "Question Stats",
        data: [
          totalMark,
          wrongAns,
          TotalQuestion.length - (answeredQuestioned + markedAndAnswered),
        ], // These values should be dynamic based on your app logic
        backgroundColor: ["#48bb50", "#F56565", "#A0AEC0"], // Chakra UI colors (green, red, gray)
      },
    ],
  };
  console.log(
    totalMark,
    markedAndAnswered,
    answeredQuestioned + markedAndAnswered
  );
  //  3 10 4
return (
  <Box
    mx="auto"
    p={6}
    mt={5}
    maxW="1000px"
    bgGradient="linear(to-r, blue.50, teal.50)"
    borderRadius="2xl"
    boxShadow="lg"
  >
    <Flex alignItems="center" mb={8} justifyContent="space-between">
      <Flex alignItems="center">
        <Icon
          as={FaArrowLeft}
          color="teal.600"
          boxSize={6}
          mr={3}
          cursor="pointer"
        />
        <Heading as="h1" size="xl" fontWeight="extrabold" color="teal.700">
          Your Results
        </Heading>
      </Flex>
    
    </Flex>

    {/* Navigation Tabs */}
    <Flex
      borderBottom="4px"
      borderColor="teal.300"
      mb={6}
      justifyContent="space-around"
    >
      <List display="flex" flexDirection="row" gap={4} fontWeight="bold">
        <ListItem
          pb={2}
          borderBottom="4px"
          borderColor="teal.500"
          color="teal.700"
          cursor="pointer"
          _hover={{ color: "teal.900" }}
        >
          Overview
        </ListItem>
        <ListItem
          pb={2}
          color="gray.600"
          cursor="pointer"
          _hover={{ color: "teal.900" }}
        >
          <Link to="/Review-Test">Review Test</Link>
        </ListItem>
        <ListItem
          pb={2}
          color="gray.600"
          cursor="pointer"
          _hover={{ color: "teal.900" }}
        >
          Analysis
        </ListItem>
        <ListItem
          pb={2}
          color="gray.600"
          cursor="pointer"
          _hover={{ color: "teal.900" }}
        >
          Correct
        </ListItem>
        <ListItem
          pb={2}
          color="gray.600"
          cursor="pointer"
          _hover={{ color: "teal.900" }}
        >
          Incorrect
        </ListItem>
        <ListItem
          pb={2}
          color="gray.600"
          cursor="pointer"
          _hover={{ color: "teal.900" }}
        >
          Unattempted
        </ListItem>
      </List>
    </Flex>

    {/* Question Stats */}
    <HStack m={"auto"}>
      <Box mb={""} w={"30%"} p={6} bg="white" borderRadius="lg" boxShadow="md">
        <Heading as="h4" size="lg" fontWeight="bold" color="teal.600" mb={6}>
          Test Result
        </Heading>

        <Flex direction="column" gap={5}>
          <Flex alignItems="center">
            <Icon as={FaTrophy} color="orange.400" boxSize={6} mr={4} />
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              Your Score:{" "}
              <b>
                {totalMark}/{TotalQuestion.length}
              </b>
            </Text>
          </Flex>

          <Flex alignItems="center">
            <Icon as={FaMedal} color="purple.500" boxSize={6} mr={4} />
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              Rank:{" "}
              <b>
                {rank}/{TotalStudent}
              </b>
            </Text>
          </Flex>

          <Flex alignItems="center">
            <Icon as={FaPercentage} color="blue.500" boxSize={6} mr={4} />
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              Percentile: <b>{percentile}%</b>
            </Text>
          </Flex>

          <Flex alignItems="center">
            <Icon as={FaCheckCircle} color="green.500" boxSize={6} mr={4} />
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              Correct: <b>{correctqus.length}</b>
            </Text>
          </Flex>

          <Flex alignItems="center">
            <Icon as={FaTimesCircle} color="red.400" boxSize={6} mr={4} />
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              Incorrect: <b>{wrongAnsqus.length}</b>
            </Text>
          </Flex>

          <Flex alignItems="center">
            <Icon as={FaMinusCircle} color="gray.500" boxSize={6} mr={4} />
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              Unattempted:{" "}
              <b>
                {TotalQuestion.length -
                  (answeredQuestioned + markedAndAnswered)}
              </b>
            </Text>
          </Flex>

          <Flex alignItems="center">
            <Icon as={FaBullseye} color="blue.400" boxSize={6} mr={4} />
            <Text fontSize="lg" fontWeight="medium" color="gray.700">
              Accuracy: <b>{calculateAccuracy().toFixed(2)}%</b>
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* Bar Chart */}
      <Box w={"70%"}>
        <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
          {" "}
          <Heading as="h4" size="lg" fontWeight="bold" color="teal.600" mb={6}>
            Graphical Representation
          </Heading>
          <Bar data={chartData} options={chartOptions} />
        </Box>
      </Box>
    </HStack>
  </Box>
);
};

export default ResultPage;
