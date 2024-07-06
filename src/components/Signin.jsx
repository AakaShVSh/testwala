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
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
// import { signInApi } from "../apis/auth";
import { getCookies } from "../helpers/cookies";
import { useDispatch, useSelector } from "react-redux";
import { signInApi } from "../redux/signIn/signIn.ActionType";
const Signin = ({ message, setMessage,checkNavigation,setCheckNavigation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signInSuccess } = useSelector((state) => state.signInReducer);
  const [signinData, setSigninData] = useState({
    Email: null,
    Password: null,
  });
const handleKeyDown = (event) => {
  console.log("hghfdss");
  if(event.key==="Enter"){
    console.log("hghghhfh");
    handleSubmit()
  }
}
  const handleSubmit = async () => {
    // try {

      if (
        signinData.Email!==null&&
        signinData.Password !== null
      ) {    if(signinData.Email.includes("@gmail.com")){
      dispatch(signInApi(signinData,setMessage))
        // onsole.log(checkSignup);
        const checkCookie = await getCookies("_user");console.log("in",signinData,signInSuccess,checkCookie);
        if (signInSuccess!==false&&checkCookie!==null) {
          setCheckNavigation(true)
        }
      }else{
         setMessage("Email is Required");
      }
      } else {
        setMessage("All fields are Required")
      }
    // } catch (error) {
    //   console.log(error);
    // }
  };
 useEffect(() => {
   if (checkNavigation && message !== null) {
     const navigateTimeOut = setTimeout(() => {
       setMessage(null);
       setCheckNavigation(false);
       navigate("/");
     }, 3000);
     if (checkNavigation === false && message === null) {
       clearTimeout(navigateTimeOut);
     }
   } else {
     const messageTimeOut = setTimeout(() => {
       console.log("lh");
       setMessage(null);
     }, 5000);
     if (message === null) {
       clearTimeout(messageTimeOut);
     }
   }
 }, [checkNavigation, navigate, message]);
  return (
    <>
      {signInSuccess && message !== null ? (
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

      <Container
        mt={"3%"}
        borderRadius={"20px"}
        maxW={{ base: "90%", md: "65%", lg: "40%" }}
        p={"2% 4% 4% 4%"}
        // bg={"whitesmoke"}
      >
        <Heading
          textAlign={"center"}
          mb={"11%"}
          // bg={"whitesmoke"}
        >
          Signin
        </Heading>
        <FormControl
        // bg={"whitesmoke"}
        >
          <Box
          // bg={"whitesmoke"}
          >
            <FormLabel
            // bg={"whitesmoke"}
            >
              Email
            </FormLabel>
            <Input
              type={"email"}
              required={true}
              // bg={"whitesmoke"}
              placeholder={"Enter your Email"}
              onKeyDown={handleKeyDown}
              onChange={(e) =>
                setSigninData({ ...signinData, Email: e.target.value })
              }
            />
          </Box>
          <Box
            //  bg={"whitesmoke"}
            mt={"3%"}
          >
            <FormLabel
            //  bg={"whitesmoke"}
            >
              Password
            </FormLabel>
            <Input
              type={"password"}
              required={true}
              // bg={"whitesmoke"}
              placeholder={"Enter your Password"}
              onKeyDown={handleKeyDown}
              onChange={(e) =>
                setSigninData({ ...signinData, Password: e.target.value })
              }
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
          <Box
            // bg={"whitesmoke"}
            mt={"7%"}
          >
            <Text
              //  bg={"whitesmoke"}
              fontSize={"md"}
            >
              Don't have account?{" "}
              <Link to="/auth/signup">
                <Text
                  as={"span"}
                  cursor={"pointer"}
                  textDecoration={"underline"}
                  color="#1f4985"
                >
                  Click Here for SignUp
                </Text>
              </Link>
            </Text>
          </Box>{" "}
          <Button
            w={"100%"}
            mt={"3%"}
            colorScheme={"teal"}
            bg={"#4285f4"}
            // spinner={<BeatLoader size={8} color='white' />}
            onClick={() => handleSubmit()}
            // onKeyDown={handleKeyDown}
          >
            Submit
          </Button>
        </FormControl>
      </Container>
    </>
  );
};

export default Signin;
