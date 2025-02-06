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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        width="100"
        height="100"
        viewBox="0 0 100 100"
      >
        <path
          fill="#a3a3cd"
          d="M75,75V24c0-4.4-3.6-8-8-8H30c-2.8,0-5,2.2-5,5v55h49C74.6,76,75,75.6,75,75z"
        ></path>
        <path fill="#666aad" d="M41,76V16H30c-2.8,0-5,2.2-5,5v55H41z"></path>
        <path
          fill="#fefdef"
          d="M72,79.5c0,2,1.3,3.9,3,4.5H29.5C27,84,25,82,25,79.5s2-4.5,4.5-4.5H75C73.3,75.6,72,77.5,72,79.5z"
        ></path>
        <g>
          <path fill="#fcba7f" d="M48.5,13.5v31l-8-4l-8,4v-31H48.5z"></path>
        </g>
        <g>
          <path
            fill="#1f212b"
            d="M75,85H29.5c-3,0-5.5-2.5-5.5-5.5s2.5-5.5,5.5-5.5H75c0.5,0,0.9,0.4,1,0.8c0.1,0.5-0.2,0.9-0.7,1.1 c-1.3,0.5-2.3,2-2.3,3.6s1,3.1,2.3,3.6c0.5,0.2,0.7,0.6,0.7,1.1C75.9,84.6,75.5,85,75,85z M29.5,76c-1.9,0-3.5,1.6-3.5,3.5 s1.6,3.5,3.5,3.5h42.6c-0.7-1-1.1-2.2-1.1-3.5s0.4-2.5,1.1-3.5H29.5z"
          ></path>
          <path
            fill="#1f212b"
            d="M71.5,79h-40c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h40c0.3,0,0.5,0.2,0.5,0.5S71.8,79,71.5,79z M71.5,81h-31 c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h31c0.3,0,0.5,0.2,0.5,0.5S71.8,81,71.5,81z M26,79.5h-2V21c0-3.3,2.7-6,6-6h2.5v2H30 c-2.2,0-4,1.8-4,4V79.5z M76,75h-2V24c0-3.9-3.1-7-7-7H48.5v-2H67c5,0,9,4,9,9V75z M40.5,60c-0.3,0-0.5-0.2-0.5-0.5v-19 c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v19C41,59.8,40.8,60,40.5,60z M40.5,65c-0.3,0-0.5-0.2-0.5-0.5v-2c0-0.3,0.2-0.5,0.5-0.5 s0.5,0.2,0.5,0.5v2C41,64.8,40.8,65,40.5,65z M40.5,68c-0.3,0-0.5-0.2-0.5-0.5v-1c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v1 C41,67.8,40.8,68,40.5,68z"
          ></path>
          <path
            fill="#1f212b"
            d="M48.5,45c-0.1,0-0.2,0-0.2-0.1l-7.8-3.9l-7.8,3.9c-0.2,0.1-0.3,0.1-0.5,0c-0.1-0.1-0.2-0.3-0.2-0.4v-31 c0-0.3,0.2-0.5,0.5-0.5h16c0.3,0,0.5,0.2,0.5,0.5v31c0,0.2-0.1,0.3-0.2,0.4C48.7,45,48.6,45,48.5,45z M40.5,40c0.1,0,0.2,0,0.2,0.1 l7.3,3.6V14H33v29.7l7.3-3.6C40.3,40,40.4,40,40.5,40z"
          ></path>
        </g>
      </svg>
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
