import React, { useEffect, useState } from "react";
import TakeTest from "./TakeTest";
// import Router, { Route } from 'router'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmitTest from "./SubmitTest";
import Home from "./attandance/Home";
import Signin from "./Signin";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { fetchData } from "../apis/question";
import { setLocalStorage } from "../helpers/localStorage";
import ReviewTest from "./ReviewTest";
import { m } from "framer-motion";
// import Questionlist from "./Questionlist";
import ForgotPassword from "./ForgotPassword";
import MathQuestionlist from "./MathQuestionlist";
import Footer from "./Footer";
import { useDispatch, useSelector } from "react-redux";
import { QuestionApi } from "../redux/questions/questions.ActionType";
import Feedback from "./Feedback";
import ResultPage from "./ResultPage";
import Analysis from "./Analysis";
import SaveQuestion from "./SaveQuestion";
import ReportAdminPage from "./ReportAdminPage";
import SavedPage from "./SavedData";

const Main = () => {
  const [mark, setMark] = useState(0);
  // const [TotalQuestion, SetTotalQuestion] = useState(0);
  const [quest, setQuestions] = useState([]);
  const [questionCategory, setQuestionsCategory] = useState([]);
  const [testTitle, settestTitle] = useState(null);
  const [message, setMessage] = useState(null);
  const [checkNavigation, setCheckNavigation] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chooseSub, setchoosesub] = useState("");
  const [currentSub, setCurrentSub] = useState("");
  const { questionLoading, questionSuccess, questionData } = useSelector(
    (state) => state.QuestionReducer
  );
  const dispatch = useDispatch();
  const handleFullScreen = (isFull) => {
    if (isFull) {
      setIsFullScreen(true);
      document.documentElement.requestFullscreen();
      //  setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
      document.exitFullscreen();
    }
  };
  // console.log("k",questionData);

  // console.log("hhhhh",TotalQuestion,mark,quest.length);
  // console.log("cat==",questionCategory);
  // console.log("d===",quest);
  useEffect(() => {
    if (testTitle !== null) {
      setLocalStorage("category", testTitle);
      console.log(testTitle);
      setLocalStorage("Testdata", quest);
      console.log("l");
    }

    // SetTotalQuestion(quest.length);
    // fetchData(setQuestionsCategory);
    // if(!questionSuccess){
    console.log("cho",chooseSub);
    
    if (chooseSub !== "") {
      console.log("i", chooseSub);
      setCurrentSub(chooseSub);
      dispatch(QuestionApi(chooseSub));
      setLocalStorage("Subject", chooseSub);

      setchoosesub("");
    }
    if (questionData != []) {
      setQuestionsCategory(questionData);
      setQuestions(questionData);
    }
  }, [questionSuccess, chooseSub, testTitle, dispatch, questionData]);
  // console.log("qqqq", questionLoading, "sss", questionSuccess,"dddd",questionData);
  return (
    // <>
    //   {isFullScreen === true ? null : <Navbar />}
    //   {/* <Sidebar/> */}
    //   <Routes>
    //     <Route path="/" element={<Home setchoosesub={setchoosesub} />} />
    //     <Route
    //       path="/auth/signin"
    //       element={
    //         <Signin
    //           message={message}
    //           setMessage={setMessage}
    //           checkNavigation={checkNavigation}
    //           setCheckNavigation={setCheckNavigation}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/auth/signup"
    //       element={
    //         <Signup
    //           message={message}
    //           setMessage={setMessage}
    //           checkNavigation={checkNavigation}
    //           setCheckNavigation={setCheckNavigation}
    //         />
    //       }
    //     />
    //     <Route
    //       path="/auth/forgotPassword"
    //       element={<ForgotPassword message={message} setMessage={setMessage} />}
    //     />
    //     <Route
    //       path="/test"
    //       element={
    //         <TakeTest
    //           handleFullScreen={handleFullScreen}
    //           // setIsFullScreen={}
    //           // chooseSub={chooseSub}
    //           quest={quest}
    //         />
    //       }
    //     />
    //     <Route path="/test-result" element={<ResultPage />} />
    //     <Route path="/Review-Test" element={<ReviewTest />} />
    //     <Route
    //       path="/questionList"
    //       element={
    //         <MathQuestionlist
    //           currentSub={currentSub}
    //           chooseSub={chooseSub}
    //           category={questionCategory}
    //           handleFullScreen={handleFullScreen}
    //           setQuestions={setQuestions}
    //           settestTitle={settestTitle}
    //         />
    //       }
    //     />
    //     <Route path="/GiveFeedback" element={<Feedback />} />
    //     <Route path="/Analysis" element={<Analysis/>}/>
    //     <Route path="/Saved-Question" element={<SaveQuestion/>}/>
    //     <Route path="/ReportAdmin" element={<ReportAdminPage/>}/>
    //     <Route path="/savedData" element={<SavedPage/>}/>
    //   </Routes>
    //   {isFullScreen === true ? null : <Footer />}
    // </>

    <>
    {/* attendance */}
        <Home/>
    </>
  );
};

export default Main;
