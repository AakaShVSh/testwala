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
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Question Stats Overview",
      },
    },
  };
  // console.log(TotalQuestion);
  return (
    <Box mx="auto" p={"6"}>
      {/* Header */}
      <Flex alignItems="center" mb={4}>
        <Icon as={FaArrowLeft} color="gray.600" mr={2} />
        <Heading as="h1" size="lg" fontWeight="semibold">
          Results
        </Heading>
      </Flex>

      {/* Navigation Tabs */}
      <Flex borderBottom="1px" borderColor="gray.200" mb={4}>
        <List display="flex" flexDirection="row">
          <ListItem
            mr={4}
            pb={2}
            borderBottom="2px"
            borderColor="blue.500"
            color="blue.500"
          >
            Overview
          </ListItem>
          <ListItem mr={4} pb={2} color="gray.500">
           <Link to="/Review-Test">Review Test</Link>
          </ListItem>
          <ListItem mr={4} pb={2} color="gray.500">
             Analysis
          </ListItem>
          <ListItem mr={4} pb={2} color="gray.500">
            Correct
          </ListItem>
          <ListItem mr={4} pb={2} color="gray.500">
            Incorrect
          </ListItem>
          <ListItem pb={2} color="gray.500">
            Unattempted
          </ListItem>
        </List>
      </Flex>

      {/* Question Stats */}
      <Box mb={6}>
        <Heading as="h2" size="md" fontWeight="semibold" mb={4}>
          Question Stats
        </Heading>

        <Flex alignItems="center" mb={2}>
          <Icon as={FaTrophy} color="orange.500" mr={2} />
          <Text>
            Your Score: {totalMark}/{TotalQuestion.length}
          </Text>
        </Flex>

        <Flex alignItems="center" mb={2}>
          <Icon as={FaMedal} color="purple.500" mr={2} />
          <Text>
            Rank: {rank}/{TotalStudent}
          </Text>
        </Flex>

        <Flex alignItems="center" mb={2}>
          <Icon as={FaPercentage} color="blue.500" mr={2} />
          <Text>Percentile: {percentile}%</Text>
        </Flex>

        <Flex alignItems="center" mb={2}>
          <Icon as={FaCheckCircle} color="green.500" mr={2} />
          <Text>Correct: {correctqus.length}</Text>
        </Flex>

        <Flex alignItems="center" mb={2}>
          <Icon as={FaTimesCircle} color="red.500" mr={2} />
          <Text>Incorrect: {wrongAnsqus.length}</Text>
        </Flex>

        <Flex alignItems="center" mb={2}>
          <Icon as={FaMinusCircle} color="gray.500" mr={2} />
          <Text>
            Unattempted:{" "}
            {TotalQuestion.length - (answeredQuestioned + markedAndAnswered)}
          </Text>
        </Flex>

        <Flex alignItems="center" mb={2}>
          <Icon as={FaBullseye} color="blue.500" mr={2} />
          <Text>Accuracy: {calculateAccuracy().toFixed(2)}%</Text>
        </Flex>
      </Box>

      {/* Bar Chart */}
      <Heading as="h2" size="md" fontWeight="semibold">
        Graphical Repreasentation
      </Heading>
      <Box mb={6}>
        <Bar data={chartData} options={chartOptions} />
      </Box>
    </Box>
  );
};

export default ResultPage;
