import React, { useState } from 'react'
import TakeTest from './TakeTest'
// import Router, { Route } from 'router'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SubmitTest from './SubmitTest';

const Main = () => {
  const [mark,setmark] = useState(0);
  const [TotalQuestion,SetTotalQuestion] = useState(0);
  console.log(mark);
  console.log(TotalQuestion);
  return (
    <div>
      
    <Routes>
            <Route path='/' element={<TakeTest setmark={setmark} SetTotalQuestion={SetTotalQuestion} mark={mark}/>}/>

      <Route path='/test' element={<SubmitTest mark={mark} TotalQuestion={TotalQuestion}/>}/>
    </Routes>
         
    </div>
  )
}

export default Main
