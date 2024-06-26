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

const Main = () => {
  const [mark, setMark] = useState(0);
  const [TotalQuestion, SetTotalQuestion] = useState(0);
  const [quest, setQuestions] = useState([]);
  const [questionCategory, setQuestionsCategory] = useState([]);
  const [testTitle,settestTitle] = useState(null)
 const [isFullScreen, setIsFullScreen] = useState(false);
    const [correctAns, setCorrectAns] = useState([]);
    
  const handleFullScreen = () => {
   
    
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
       setIsFullScreen(true);
    } else {
      document.exitFullscreen(); setIsFullScreen(false);
    }
 
  };
  console.log("hhhhh",TotalQuestion,mark,quest.length);
  console.log("cat==",questionCategory);
  console.log("d===",quest);
    useEffect(() => {
      setLocalStorage("category",testTitle)
SetTotalQuestion(quest.length)
    fetchData(setQuestions, SetTotalQuestion,setQuestionsCategory);
  }, [quest.length, setQuestionsCategory, testTitle]);
  return (
    <>
      {isFullScreen === true ? null : <Navbar />}
      {/* <Sidebar/> */}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              category={questionCategory}
              handleFullScreen={handleFullScreen}
              setQuestions={setQuestions}
              settestTitle={settestTitle}
            />
          }
        />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route
          path="/test"
          element={
            <TakeTest
              handleFullScreen={handleFullScreen}
              quest={quest}
            />
          }
        />
        <Route
          path="/test-result"
          element={<SubmitTest TotalQuestion={quest.length} />}
        />
      </Routes>
    </>
  );
};

export default Main;
