// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import "./TakeTest.css";
// const TakeTest = () => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [visitedquestion, setvisitedquestion] = useState(1);
//   const [notvisitedquiestion, setnotvisitedquestion] = useState(0);
//   const [optionindex, setoptionindex] = useState([]);
//   const [cur, setcur] = useState(0);
//   console.log(answers);
//   const [questionindex, setquestionindex] = useState([0]);
//   const [questions, setquestion] = useState([]);
//   const [notans, setnotans] = useState(0);
//   const handleAnswerSelect = (answer, index) => {
//     if (!optionindex.includes(index)) {
//       setoptionindex([...optionindex, index]);
//       setAnswers([...answers, { ans: answer, ind: index }]);
//       setnotans(notans - 1);
//     } else {
//       for (var i = 0; i < answers.length; i++) {
//         if (answers[i].ind == index) {
//           answers[i].ans = answer;
//         }
//       }
//     }
//   };

//   const getdata = async () => {
//     try {
//       const data = await axios.get("http://localhost:80/");
//       //  console.log(data.data.data);

//       setquestion(data.data.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleNext = () => {
//     // setAnswers([...answers, selectedAnswer]);
//     // setSelectedAnswer("");
//     setCurrentQuestion(currentQuestion + 1);
//   };
//   console.log(currentQuestion);
//   const setq = (index) => {
//     if(currentQuestion!==questions.length){
//     setCurrentQuestion(index);

//     }
//     if (!questionindex.includes(index)) {
//       // console.log(index);
//       setvisitedquestion(visitedquestion + 1);
//       setquestionindex([...questionindex, index]);
//       setnotvisitedquestion(notvisitedquiestion - 1);
//     }
//   };

//   const handleSubmit = () => {
//     // if (selectedAnswer !== "") {
//     //   setAnswers([...answers, selectedAnswer]);
//     // }

//     // Add code here to submit the answers to the server
//   };

//   useEffect(() => {
//     getdata();
//     setnotans(questions.length - answers.length);
//     setnotvisitedquestion(questions.length - visitedquestion);
//   }, [answers.length, questions.length, setquestion, visitedquestion]);

//   return (
//     <div className="page">
//       <div className="header">
//         <div className="title">
//           testbook SSC GD Constable (2022) Official Paper (Held On : 10 Jan 2023
//           Shift 1)
//         </div>
//         <div className="time-left">Time Left 00:59:39</div>
//       </div>
//       <div className="question-box">
//         <div className="question-container">
//           <div className="question-number">Question {currentQuestion + 1}</div>
//           <div className="question-text">
//             {questions != "" ? questions[currentQuestion].question : null}
//           </div>

//           {questions != ""
//             ? questions[currentQuestion].options.map((option, index) => (
//                 <div
//                   key={index}
//                   className={`option ${
//                     selectedAnswer === index + 1 ? "selected" : ""
//                   }`}
//                   onClick={() => handleAnswerSelect(index + 1, currentQuestion)}
//                 >
//                   {option}
//                 </div>
//               ))
//             : null}
//         </div>
//         <div className="question-nos">
//           <ul>
//             <li>Visited Question : {visitedquestion}</li>
//             <li>Not Visited Question : {notvisitedquiestion}</li>
//             <li>Not Answered : {notans}</li>
//             <li>Answered : {answers.length}</li>
//           </ul>
//           <div className="no">
//             {questions.map((e, i) => (
//               <>
//                 <p className="qus-n" onClick={() => setq(i)}>
//                   {i + 1}
//                 </p>
//               </>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="footer">
//         <div className="marks">Marks +2 -0.5</div>
//         <div className="actions">
//           {(currentQuestion + 1) < questions.length ? (
//             <>
//               <button onClick={handleNext}>Next</button>
//               <button onClick={() => setSelectedAnswer("")}>
//                 Clear Response
//               </button>
//             </>
//           ) : (
//             <>
//               <button onClick={handleSubmit}>Submit Test</button>
//               <button onClick={() => setCurrentQuestion(1)}>Review</button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TakeTest;

// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import "./TakeTest.css";
// import { Link, useNavigate } from "react-router-dom";
// const TakeTest = ({ setmark, mark, SetTotalQuestion }) => {
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [visitedQuestions, setVisitedQuestions] = useState(new Set());
//   const [questions, setQuestions] = useState([]);
//   const navigate = useNavigate();
//   const [min,setmin] = (1);
//   const [hour,sethour] = (1);

//   console.log(questions);
//   const handleAnswerSelect = (index) => {
//     const newAnswers = [...answers];
//     newAnswers[currentQuestion] = index;
//     if (newAnswers[currentQuestion] + 1 == questions[currentQuestion].answer) {
//       setmark(mark + 1);
//     }
//     console.log(mark);
//     setAnswers(newAnswers);
//   };

//   const fetchData = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:80/");
//       setQuestions(data.data);
//       SetTotalQuestion(data.data.length);
//     } catch (error) {
//       console.error("Error fetching questions:", error);
//     }
//   };

//   const handleNext = () => {
//     setCurrentQuestion(currentQuestion + 1);
//   };

//   const handleQuestionClick = (index) => {
//     setCurrentQuestion(index);
//     setVisitedQuestions(new Set([...visitedQuestions, index]));
//   };

//   const handlesubmit = () => {
//     // navigate("/test")
//     console.log(answers);
//     localStorage.setItem("test-data", JSON.stringify(answers));
//   };

//   let id = setInterval(() => {
//     sethour((hours) => {
//      if(hours<0){
//          clearInterval(id)
//      }else if(hours>0){
//             hours--
//      }
//       setmin((m) =>{
//     if(m>60){
//       // eslint-disable-next-line no-unused-expressions
//       hours-1;
//          clearInterval(id)
//      }else if(m<60){
//            m++
//      }
//   },60000)

//     },1000)

//   },[])

//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <div className="page">
//       <div className="header">
//         <div className="title">
//           Testbook SSC GD Constable (2022) Official Paper (Held On : 10 Jan 2023
//           Shift 1)
//         </div>
//         <div className="time-left">Time Left {hour}:{min}</div>
//       </div>
//       <div className="question-box">
//         <div className="question-container">
//           <div className="question-number">Question {currentQuestion + 1}</div>
//           <div className="question-text">
//             {questions.length > 0 && questions[currentQuestion].question}
//           </div>
//           {questions.length > 0 &&
//             questions[currentQuestion].options.map((option, index) => (
//               <div
//                 key={index}
//                 className={`option ${
//                   answers[currentQuestion] === index ? "selected" : ""
//                 }`}
//                 onClick={() => handleAnswerSelect(index, currentQuestion)}
//               >
//                 {option}
//               </div>
//             ))}
//         </div>
//         <div className="question-nos">
//           Visited Question : {visitedQuestions.size}
//           <br></br>
//           Not Visited Question : {questions.length - visitedQuestions.size}
//           <br></br>
//           Not Answered : {questions.length - answers.length}
//           <br></br>Answered : {answers.length}
//           <br></br><br></br>
//           <div className="no">
//             {questions.map((_, index) => (
//               <p
//                 key={index}
//                 className={`qus-n ${
//                   visitedQuestions.has(index) ? "visited" : ""
//                 }`}
//                 onClick={() => handleQuestionClick(index)}
//               >
//                 {index + 1}
//               </p>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div className="footer">
//         <div className="marks">Marks +2 -0.5</div>
//         <div className="actions">
//           {currentQuestion + 1 < questions.length ? (
//             <>
//               <button onClick={handleNext}>Next</button>
//               <button onClick={() => handleAnswerSelect(null)}>
//                 Clear Response
//               </button>
//             </>
//           ) : (
//             <>
//               <button onClick={handlesubmit}>
//                 <Link to={"/test"}>Submit Test</Link>
//               </button>
//               <button onClick={() => setCurrentQuestion(1)}>Review</button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TakeTest;

import axios from "axios";
import React, { useState, useEffect } from "react";
import "./TakeTest.css";
import { Link, useNavigate } from "react-router-dom";
import { Box, Container, Text, Grid, GridItem , Flex } from "@chakra-ui/react";
import { fetchData } from "../apis/question";
import { Button } from "@chakra-ui/react";

const TakeTest = ({ setmark, mark, testTitle, quest }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setquest] = useState(quest);
  const [answers, setAnswers] = useState([]);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([]));
  const navigate = useNavigate();
  const [hour, setHour] = useState(20); // Use useState to set initial value
  const [min, setMin] = useState(0); // Use useState to set initial value

  const handleAnswerSelect = (index) => {
    if (answers[currentQuestion] == index) {
      if (index + 1 === questions[currentQuestion].answer) {
        setmark(mark - 2);
        // Update mark with +2 for correct answer
      }
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = null;
      console.log(newAnswers[currentQuestion]);
      setAnswers(newAnswers);
    } else {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = index;
      console.log(newAnswers[currentQuestion]);

      if (index + 1 === questions[currentQuestion].answer) {
        setmark(mark + 2);
        // Update mark with +2 for correct answer
      }
      setAnswers(newAnswers);
    }
    console.log("mark:", mark);

    // newAnswers[currentQuestion] = null;
  };

  const handleNext = () => {
    setCurrentQuestion(currentQuestion + 1);
    setVisitedQuestions(new Set([...visitedQuestions, currentQuestion]));
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestion(index);
    setVisitedQuestions(new Set([...visitedQuestions, index]));
  };

  const handleSubmit = () => {
    navigate("/test-result");
    // console.log(answers);
    localStorage.setItem("test-data", JSON.stringify(answers));
  };

  useEffect(() => {
    if (questions.length != "") {
      const id = setInterval(() => {
        if (hour != 0 && min <= 0) {
          setHour(hour - 1);
          setMin(60);
        } else if (min != 0) {
          setMin(min - 1);
        } else if (min == 0 && hour == 0) {
          alert("your time is up!");
          navigate("/test");

          clearInterval();

          return 0;
        }
        return min - 1;
      }, 1000);

      return () => clearInterval(id);
    }
    setquest(quest);
    handleQuestionClick(0);
    // Cleanup function to clear interval
  }, [handleQuestionClick, hour, min, navigate, quest, questions.length]); // Added hour to dependency array
  // console.log(min,hour);

  return (
    <Container maxWidth={"100%"}>
      <Flex
        color={"white"}
        p={"1%"}
        bg={"black"}
        justifyContent={"space-between"}
        w={"100%"}
        fontFamily={"initial"}
        fontSize={"2xl"}
      >
        <Box color={"white"} bg={"black"}>
          {testTitle}
        </Box>
        <Box bg={"black"}>
          Time Left {hour < 10 ? "0" + hour : hour}:{min < 10 ? "0" + min : min}
        </Box>
      </Flex>
      <Flex>
        <Container maxW={"100%"}>
          <Text bg={"#c4d2ef"} p={"1%"} borderRadius={"2px"} m={"1% 0% 2% 0%"}>
            <Box fontSize={"xl"} fontFamily={"monospace"}>
              Question {currentQuestion + 1}
            </Box>
            {questions.length > 0 && questions[currentQuestion].qus}
          </Text>
          {questions.length > 0 &&
            questions[currentQuestion].options.map((option, index) => (
              <Box
                // gap={"20%"}
                key={index}
                className={`option ${
                  answers[currentQuestion] === index ? "selected" : ""
                }`}
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </Box>
            ))}

          {/* <div className="marks">Marks +2 -0.5</div> */}
          <Flex
            w={"100%"}
            justifyContent={"space-between"}
            p={"5px"}
            mt={"26%"}
            borderRadius={"12px"}
            bg={"#d4dfdf"}
          >
            {currentQuestion + 1 < questions.length ? (
              <>
                <Button onClick={handleNext}>Next</Button>
                <Button onClick={() => handleAnswerSelect(null)}>
                  Clear Response
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleSubmit}>
                  <Link to={"/test"}>Submit Test</Link>
                </Button>
                <Button onClick={() => setCurrentQuestion(0)}>Review</Button>
              </>
            )}
          </Flex>
        </Container>
        <Box w={"25%"} p={"1%"}>
          Visited Question : {visitedQuestions.size}
          <br />
          Not Visited Question : {questions.length - visitedQuestions.size}
          <br />
          Not Answered : {questions.length - answers.length}
          <br />
          Answered : {answers.length}
          <br />
          <br />
          <Grid templateColumns='repeat(4, 1fr)' gap={6} >
            {questions.map((_, index) => (
              <GridItem borderRadius={"3px"}
                key={index}
                className={`qus-n ${
                  visitedQuestions.has(index) ? "visited" : ""
                }`}
                onClick={() => handleQuestionClick(index)}
              >
                {index + 1}
              </GridItem>
            ))}
          </Grid>
          <Button
            bg={"#1f4985"}
            w={"100%"}
            mt={"95%"}
            color={"white"}
            _hover={"red"}
          >
            Submit Now
          </Button>
        </Box>
      </Flex>
    </Container>
  );
};

export default TakeTest;
