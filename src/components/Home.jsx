import React from "react";
// import TakeTest from "./TakeTest";
import {Button} from '@chakra-ui/react'
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
   <Link to={"/test"}><Button bg={"#1f4985"} m="2% auto" color={"white"}>Take Test</Button></Link> 
    </>
  )
};

export default Home;
