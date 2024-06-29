import React, { useEffect, useState } from "react";
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
  Spacer,
  AlertIcon,
  Alert,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import { signUpApi } from "../apis/auth";
import { getCookies } from "../helpers/cookies";
const Signup = () => {
  const [cmpPassword, setScmpPassword] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState(null);
  const [checkNavigation, setCheckNavigation] = useState(false);
  const [signUpData, setSignUpData] = useState({
    Email: null,
    Password: null,
  });

  const handleSignup = async () => {
    // if (data.Email.includes("@gmail.com") && data.Email !== "") {
    //   if (data.Password === cmpPassword && data.Password !== "") {
    //
    //   } else {
    //     alert("Password and Confirm Password should be same");
    //   }
    // } else {
    //   alert("It should be Email only");
    // }
    if (
      signUpData.Email !== null &&
      signUpData.Password !== null &&
      cmpPassword !== null
    ) {
      if (signUpData.Email.includes("@gmail.com")) {
        if (signUpData.Password === cmpPassword) {
          const t = await signUpApi(signUpData, cmpPassword, setMessage);
          const c = await getCookies("_user");
          console.log(t, c);
          if (getCookies("_user") !== null&&t!==false) {
            setCheckNavigation(true);
          }
        } else {
          setMessage("Password and Confirm Password should be same");
        }
      } else {
        setMessage("Email is Required");
      }
    } else {
      setMessage("All fields are Required");
    }
  };
  useEffect(() => {
    if (checkNavigation && message !== null) {
      const navigateTimeOut = setTimeout(() => {
        setMessage(null);
        setCheckNavigation(false);navigate("/auth/signin");
      }, 3000);
      if (checkNavigation === false && message === null) {
        clearTimeout(navigateTimeOut);
      }
      
    } else {
      const messageTimeOut = setTimeout(() => {
        console.log("h");
        setMessage(null);
      }, 5000);
      if (message === null) {
        clearTimeout(messageTimeOut);
      }
    }
  }, [checkNavigation, navigate, message]);
  console.log(message);
  return (
    <>
      {checkNavigation && message !== null ? (
        <Alert over status="success">
          <AlertIcon />
          {message}
        </Alert>
      ) : message !== null ? (
        <Alert status="error">
          <AlertIcon />
          {message}
        </Alert>
      ) : null}
      ;
      <Container
        mt={"3%"}
        // position={"sticky"}
        //  w={{ base: "94%", md: "55%", lg: "60%" }}
        maxW={{ base: "90%", md: "65%", lg: "40%" }}
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
              onChange={(e) =>
                setSignUpData({ ...signUpData, Email: e.target.value })
              }
            />
          </Box>
          <Box bg={"whitesmoke"} mt={"3%"}>
            <FormLabel bg={"whitesmoke"}>Password</FormLabel>
            <Input
              type={"password"}
              required={true}
              bg={"whitesmoke"}
              placeholder={"Enter your Password"}
              onChange={(e) =>
                setSignUpData({ ...signUpData, Password: e.target.value })
              }
            />
          </Box>
          <Box bg={"whitesmoke"} mt={"3%"}>
            <FormLabel bg={"whitesmoke"}>Confirm Password</FormLabel>
            <Input
              type={"password"}
              required={true}
              bg={"whitesmoke"}
              placeholder={"Confirm your Password"}
              onChange={(e) => setScmpPassword(e.target.value)}
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
              </Text>
            </Box>
          </Box>{" "}
          <Button
            w={"100%"}
            mt={"3%"}
            colorScheme={"teal"}
            bg={"#1f4985"}
            onClick={handleSignup}
          >
            Submit
          </Button>
        </FormControl>
      </Container>
    </>
  );
};

export default Signup;
