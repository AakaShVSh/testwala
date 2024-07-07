import React, { useEffect, useState } from "react";
import TakeTest from "./TakeTest";
// import Router, { Route } from 'router'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmitTest from "./SubmitTest";
import Home from "./Home";
import Signin from "./Signin";
import Signup from "./Signup";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { fetchData } from "../apis/question";
import { setLocalStorage } from "../helpers/localStorage";
import ReviewTest from "./ReviewTest";
import { m } from "framer-motion";
import Questionlist from "./Questionlist";
import ForgotPassword from "./ForgotPassword";

const Main = () => {
  const [mark, setMark] = useState(0);
  const [TotalQuestion, SetTotalQuestion] = useState(0);
  const [quest, setQuestions] = useState([]);
  const [questionCategory, setQuestionsCategory] = useState([]);
  const [testTitle, settestTitle] = useState(null);
  const [message, setMessage] = useState(null);
  const [checkNavigation, setCheckNavigation] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [correctAns, setCorrectAns] = useState([]);

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
  // console.log("hhhhh",TotalQuestion,mark,quest.length);
  // console.log("cat==",questionCategory);
  // console.log("d===",quest);
  useEffect(() => {
    setLocalStorage("category", testTitle);
    SetTotalQuestion(quest.length);
    fetchData(setQuestions, SetTotalQuestion, setQuestionsCategory);
  }, [quest.length, setQuestionsCategory, testTitle]);
  return (
    <>
      {isFullScreen === true ? null : <Navbar />}
      {/* <Sidebar/> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/auth/signin"
          element={
            <Signin
              message={message}
              setMessage={setMessage}
              checkNavigation={checkNavigation}
              setCheckNavigation={setCheckNavigation}
            />
          }
        />
        <Route
          path="/auth/signup"
          element={
            <Signup
              message={message}
              setMessage={setMessage}
              checkNavigation={checkNavigation}
              setCheckNavigation={setCheckNavigation}
            />
          }
        />
        <Route
          path="/auth/forgotPassword"
          element={
            <ForgotPassword
              message={message}
              setMessage={setMessage}
           
            />
          }
        />
        <Route
          path="/test"
          element={
            <TakeTest
              handleFullScreen={handleFullScreen}
              // setIsFullScreen={}
              quest={quest}
            />
          }
        />
        <Route
          path="/test-result"
          element={<SubmitTest TotalQuestion={quest.length} />}
        />
        <Route path="/Review-Test" element={<ReviewTest />} />
        <Route
          path="/questionList"
          element={
            <Questionlist
              category={questionCategory}
              handleFullScreen={handleFullScreen}
              setQuestions={setQuestions}
              settestTitle={settestTitle}
            />
          }
        ></Route>
      </Routes>
    </>
  );
};

export default Main;
