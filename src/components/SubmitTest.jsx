import React from 'react'
import {Container,Box,Text} from "@chakra-ui/react"

const SubmitTest = ({mark,TotalQuestion}) => {
  return (
    <div width={"100%"}  backgroundColor="#dddaf7"><Container borderRadius={"20px"} backgroundColor={"#e9e9e9"} mt="10%" padding={"2%"} justifyContent={"space-between"} display={"flex"}  border='1px' borderColor='black.200'>
      <Box >
         <Text bg={"#c4c8ef"} p={"10px"} w={"100px"} textAlign={"center"}>Your Score<br></br>{mark}</Text >
      
      </Box>
     <Box>
         <Text bg={"#c4c8ef"} p={"10px"} w={"100px"} textAlign={"center"}>Percentile<br></br>{((mark/TotalQuestion)*100).toFixed(2)}</Text >
     </Box>
     <Box>
          <Text bg={"#c4c8ef"} p={"10px"} w={"100px"} textAlign={"center"}>Mode<br></br>Easy</Text >
     </Box>
     <Box>
        <Text bg={"#c4c8ef"} p={"10px"} w={"100px"} textAlign={"center"}>Rank<br></br>1/100</Text >
     </Box>
     <hr />
    </Container></div>
  )
}

export default SubmitTest
