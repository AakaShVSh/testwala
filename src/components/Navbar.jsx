import React, { useEffect, useState } from "react";
import logo from "../logo.svg";
import { TbReportSearch } from "react-icons/tb";
import {
  Container,
  Text,
  Image,
  Box,
  Heading,
  Button,
  Input,
  Flex,
  Center,
  Icon,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaBold, FaRegUserCircle } from "react-icons/fa";
import { getCookies, setCookies } from "../helpers/cookies";
import { getLocalStorage, setLocalStorage } from "../helpers/localStorage";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
const Navbar = () => {
  const { signInSuccess } = useSelector((state) => state.signInReducer);
  const [stateSignin,setStateSignin] = useState(false);
  useEffect(() => {
    const h = async() => {
       const s = await getCookies("success");
   ;
    if (s) {
     
      setStateSignin(s); console.log(s)
      setLocalStorage("success", s);

    }
     else if (signInSuccess !== false) {
      setCookies("success", signInSuccess);
      setStateSignin(s)
    }
    
   
    }
    h()
  })
  return (
    <>
      {/* <Container */}
      <Center
        // bg={"whitesmoke"}
        pt="1px"
        pl={"3%"}
        pr={"4%"}
        maxW="100%"
        bgGradient="linear(to-r, #4285f4, #01bfbd)"
        // mt={"1%"}
        // borderRadius={"10px"}
        color={"#5c4ce3"}
        display={"flex"}
        justifyContent={"space-between"}
        // eslint-disable-next-line react/jsx-no-duplicate-props
        // bg={"#465074"}
        // bg={"#4285f4"}
        boxShadow="rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px"
      >
        <Box w={{ base: "40%", md: "22%", lg: "13%" }}>
          <Link to="/">
            <Image src={logo} alt="logo" borderRadius="md" />
          </Link>
        </Box>
        <Box
          as={"b"}
          // mb={"10px"}
          w={"40%"}
          bg={"#4285f4"}
          visibility={{ base: "hidden", md: "visible", lg: "visible" }}
        >
          <Input
            type="search"
            fontSize={"medium"}
            p={"1%"}
            // m={"2"}
            h={"auto"}
            placeholder="Search subject"
            w="100%"
            bg="#fbfbfb"
          />
        </Box>
        <Link to={"/ReportAdmin"}>
          <TbReportSearch fontSize={"30"} />
        </Link>
        {stateSignin ? (
          <Icon fontSize={"100%"} as={FaRegUserCircle} />
        ) : (
          <Link to={"/auth/signin"}>
            {/* <Button 
          colorScheme="orange"
          >
            SignIn
          </Button> */}
            <Button
              rightIcon={<FaRegUserCircle />}
              colorScheme="blue"
              border={"#4285f4"}
              color={"white"}
              bg={"turquoise"}
              _hover={{ bg: "#f44758" }}
              variant="outline"
            >
              Sign in
            </Button>
          </Link>
        )}
      </Center>
      {/* </Container> */}

      {/* sidebar */}

      {/* <Container bg={"#465074"}>
      <Flex
        // as="nav"
        pos="fixed"
        top="0"
        left="0"
        bottom="0"
        w="250px"
        p={"3"}
        bg={"#465074"}
        color="white"
        // py="6"
        // px="4"
        // direction="column"
        justify="space-between"
      > */}
      {/* <Link
          as={Icon}
          name="logo"
          size="24px"
          color="teal.500"
          // onClick={onOpen}
        /> */}

      {/* <Box> 
          {" "}
          <Image
            src={logo}
            bg={"#465074"}
            w={"80%"}
            m={"0%"}
            pb={"3%"}
            fontColor={"White"}
            alt="logo"
          />
          <Link to={"/"}>
            <Text borderBottomWidth="1px" mt={"3%"}>
              <Text fontSize="lg" fontWeight="bold" cursor={"pointer"}>
                Home
              </Text>
            </Text></Link>
            <Box color={"white"} borderBottomWidth="1px" fontWeight="bold">
              <Link
                as={Text}
                fontSize="lg"
                // color="gray.600"
                href="#"
              >
                Dashboard
              </Link><br></br>
              <Link
                as={Text}
                fontSize="lg"
                // color="gray.600"
                href="#"
              >
                Settings
              </Link>
            </Box>
           
          </Box>
      </Flex>
    </Container> */}
    </>
  );
};

export default Navbar;






