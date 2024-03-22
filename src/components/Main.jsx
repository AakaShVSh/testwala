import React, { useEffect, useState } from "react";
import TakeTest from "./TakeTest";
// import Router, { Route } from 'router'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmitTest from "./SubmitTest";
import Home from "./Home";
import Signin from "./Signin";
import Signup from "./Signup";
import Navbar from "./Navbar";
import { fetchData } from "../apis/question";

const Main = () => {
  const [mark, setmark] = useState(0);
  const [TotalQuestion, SetTotalQuestion] = useState(0);
  const [quest, setQuestions] = useState([]);
  const [questionCategory, setQuestionsCategory] = useState([]);

  console.log("cat==",questionCategory);
  console.log("d===",quest);
    useEffect(() => {
    fetchData(setQuestions, SetTotalQuestion,setQuestionsCategory);
  }, [setQuestionsCategory]);
  return (
    < >
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home 
        category={questionCategory}
      setQuestions={setQuestions}

        />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route
          path="/test"
          element={
            <TakeTest
              setmark={setmark}
              SetTotalQuestion={SetTotalQuestion}
              mark={mark}
              quest={quest}
            />
          }
        />
        <Route
          path="/test-result"
          element={<SubmitTest mark={mark} TotalQuestion={TotalQuestion} />}
        />
      </Routes>
    </>
  );
};

export default Main;
