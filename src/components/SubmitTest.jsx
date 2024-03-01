import React from 'react'
import {Container,Box,Text} from "@chakra-ui/react"

const SubmitTest = ({mark,TotalQuestion}) => {
  return (
    <Box borderRadius={"20px"} width={"90%"} backgroundColor={"#e9e9e9"} alignItems={"center"} padding={"1%"} m={"1% auto"} justifyContent={"space-between"} display={"flex"}  border='1px' borderColor='black.200'>
      <Box >
         <Text bg={"#c4c8ef"} p={"10px"} w={"100%"} textAlign={"center"}>Your Score<br></br>{mark}</Text >
      
      </Box>
     <Box>
         <Text bg={"#c4c8ef"} p={"10px"} w={"100%"} textAlign={"center"}>Percentile<br></br>{((mark/(TotalQuestion*2))*100).toFixed(2)}</Text >
     </Box>
     <Box>
          <Text bg={"#c4c8ef"} p={"10px"} w={"100%"} textAlign={"center"}>Mode<br></br>Easy</Text >
     </Box>
     <Box>
        <Text bg={"#c4c8ef"} p={"10px"} w={"100px"} textAlign={"center"}>Rank<br></br>1/100</Text >
     </Box>
     <hr />
    </Box>
  )
}

export default SubmitTest
