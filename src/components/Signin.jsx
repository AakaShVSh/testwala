import React, { useState } from "react";
import {
  Container,
  Heading,
  Box,
  FormLabel,
  FormControl,
  Input,
  Button,
  Text,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { signInApi } from "../apis/auth";
const Signin = () => {
  const navigate = useNavigate();
  const [signinData,setSigninData] = useState({
    Email:null,
    Password:null,
 })

  const handleSubmit = () => {
        if(signInApi(signinData)){
        console.log(signinData);
            navigate("/")
        }
  }

  return (
    <>
      <Container
        mt={"3%"}
        borderRadius={"20px"}
        maxW={{base:"90%", md:"65%", lg:"40%"}}
        p={"2% 4% 4% 4%"}
        bg={"whitesmoke"}
      >
        <Heading textAlign={"center"} mb={"11%"} bg={"whitesmoke"}>
          Signin
        </Heading>
        <FormControl  bg={"whitesmoke"} >
          <Box bg={"whitesmoke"}>
            <FormLabel bg={"whitesmoke"}>Email</FormLabel>
            <Input
              type={"email"}
              required={true}
              bg={"whitesmoke"}
              placeholder={"Enter your Email"}
              onChange={(e) => setSigninData({...signinData,Email:e.target.value})}
            />
          </Box>
          <Box bg={"whitesmoke"} mt={"3%"}>
            <FormLabel bg={"whitesmoke"}>Password</FormLabel>
            <Input
              type={"password"}
              required={true}
              bg={"whitesmoke"}
              placeholder={"Enter your Password"}
              onChange={(e) => setSigninData({...signinData,Password:e.target.value})}
            />
            <Text
              fontSize={"12px"}
              cursor={"pointer"}
              textAlign={"right"}
              color={"#1f4985"}
            >
              Forgot Password?
            </Text>
          </Box>
          <Box bg={"whitesmoke"} mt={"7%"}>
            <Text bg={"whitesmoke"} fontSize={"md"}>
              Don't have account?{" "}
              <Link to="/auth/signup">
              <Text
                as={"span"}
                cursor={"pointer"}
                textDecoration={"underline"}
                color="#1f4985"
              >
                Click Here for SignUp
              </Text></Link>
            </Text>
          </Box>{" "}
          <Button 
          w={"100%"}
          mt={"3%"} 
          colorScheme={"teal"} 
          bg={"#1f4985"}
          // spinner={<BeatLoader size={8} color='white' />}
          onClick={() => handleSubmit()}
          >
            Submit
          </Button>
        </FormControl>
      </Container>
    </>
  );
};

export default Signin;
