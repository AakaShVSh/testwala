import React from 'react'
import {
  Container,
  Heading,
  Box,
  FormLabel,
  FormControl,
  Input,
  Button,
  Text,
  Checkbox,
  Spacer
} from "@chakra-ui/react";

import { Link } from 'react-router-dom';
const Signup = () => {
  return (
    <>
      <Container
        mt={"3%"}
        //  w={{ base: "94%", md: "55%", lg: "60%" }}
        maxW={{base:"90%", md:"65%", lg:"40%"}}
        borderRadius={"20px"}
        p={"2% 4% 4% 4%"}
        bg={"whitesmoke"}
      >
        <Heading textAlign={"center"} mb={"11%"} bg={"whitesmoke"}>
          SignUp
        </Heading>
        <FormControl bg={"whitesmoke"}>
          <Box bg={"whitesmoke"}>
            <FormLabel bg={"whitesmoke"}>Email</FormLabel>
            <Input
              type={"email"}
              required={true}
              bg={"whitesmoke"}
              placeholder={"Enter your Email"}
            />
          </Box>
          <Box bg={"whitesmoke"} mt={"3%"}>
            <FormLabel bg={"whitesmoke"}>Password</FormLabel>
            <Input
              type={"password"}
              required={true}
              bg={"whitesmoke"}
              placeholder={"Enter your Password"}
            />
          
          </Box>
          <Box bg={"whitesmoke"} mt={"7%"}>
            <Checkbox border={"1px  gray"} fontSize={"sm"}>
             You agree to our Terms of service & Privacy Policy
            </Checkbox>
            {/* <Spacer/> */}
            <Box>
            <Text bg={"whitesmoke"} mt={"1%"} fontSize={"md"}>
              Already have Account?{" "}
              <Link to="/auth/signin">
              <Text
                as={"span"}
                cursor={"pointer"}
                textDecoration={"underline"}
                color="#1f4985"
              >
                Click Here for SignIn
              </Text>
              </Link>
            </Text></Box>
          </Box>{" "}
          <Button 
          w={"100%"}
          mt={"3%"} 
          colorScheme={"teal"} 
          bg={"#1f4985"}
          >
            Submit
          </Button>
        </FormControl>
      </Container>
    </>
  )
}

export default Signup
