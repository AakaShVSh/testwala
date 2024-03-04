import React, { useState } from "react";
import TakeTest from "./TakeTest";
// import Router, { Route } from 'router'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmitTest from "./SubmitTest";
import Home from "./Home";
import Signin from "./Signin";
import Signup from "./Signup";
import Navbar from "./Navbar";

const Main = () => {
  const [mark, setmark] = useState(0);
  const [TotalQuestion, SetTotalQuestion] = useState(0);
  console.log(mark);
  console.log(TotalQuestion);
  return (
    < >
    <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route
          path="/test"
          element={
            <TakeTest
              setmark={setmark}
              SetTotalQuestion={SetTotalQuestion}
              mark={mark}
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
