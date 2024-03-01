import React from "react";
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

} from "@chakra-ui/react";
const Signin = () => {
  return (
    <>
      <Container mt={"10%"} borderRadius={"20px"} p={"2% 4% 4% 4%"} bg={"whitesmoke"}>
        <Heading textAlign={"center"} bg={"whitesmoke"}>
          Signin
        </Heading>
        <FormControl bg={"whitesmoke"} mt={"5%"}>
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
            <Text fontSize={"12px"} cursor={"pointer"} textAlign={"right"} color={"#1f4985"}>Forgot Password?</Text>
          </Box>
          <Box bg={"whitesmoke"} mt={"6%"}>
            
             <Text  bg={"whitesmoke"}>
                Don't have account? <Text as={"span"} cursor={"pointer"} textDecoration={"underline"} color="#1f4985">Click Here for Signup</Text>                                             
               
            </Text>
          
          </Box>  <Button w={"100%"} mt={"3%"} color={"White"} bg={"#1f4985"}>
              Signin
            </Button>
        </FormControl>
      </Container>
    </>
  );
};

export default Signin;
