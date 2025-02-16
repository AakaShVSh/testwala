// import React, { useEffect, useState } from "react";
// import TakeTest from "./TakeTest";
import {
  border,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import Youtube from "../services/svgs/media_svgs/Youtube.svg" 
import { Link, useNavigate } from "react-router-dom";
// import { Container,Grid,GridItem } from "@chakra-ui/react";
import Slideshow from "./Slideshow";
import FeedbackSlideshow from "./Userfeedback";
import Feedback from "./Feedback";
import { setLocalStorage } from "../helpers/localStorage";
// import { RiEnglishInput } from "react-icons/ri";
// import CalculateIcon from '@mui/icons-material/Calculate';
const Home = ({ setchoosesub }) => {
  // console.log("c==", category[0].question);
  const navigate = useNavigate();
  const setsub = (pro,sub=null) => {
     console.log(pro, sub);
    setchoosesub(pro);
    console.log(pro,sub);
  setLocalStorage("cat",sub)

    navigate("/questionList");
  };
  return (
    <>
      {/* <Box
        w={"100%"}
        // bgColor={"#1f4985"}
        borderBottomRadius={"21%"}
        h={"100%"}
        m={"0"}
      > */}
      <Box>
        <Box
        // bg={"#f44758"}
        // w={"90%"}
        // borderRadius={"3px"}
        // m={"auto"}
        // mt="6"
        // // h={"350px"}

        // // pt={"6"}
        // position="relative"
        // // border="1px solid blue"
        // boxShadow="rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px"
        >
          {/* <Box w={"160px"} h={"120px"} bg={"#113461"}></Box> */}
          {/* <img
          src="https://www.nism.ac.in/wp-content/uploads/2024/07/1600-1-4.jpg"
          // h="0"
          w="100%"
          alt=""
        /> */}
          <Slideshow />
        </Box>
        <Box
          // border={"1px solid #d7efef"}
          // borderRadius={"7px"}
          p={"1%"}
          w={"90%"}
          m={"6% auto"}
        >
          <Text fontFamily={"sans-serif"} textAlign="center" fontSize={"18"}>
            Follow us on
          </Text>
          <Flex justifyContent={"space-around"} mt={"2%"}>
            <Box textAlign={"center"}>
              <Image
                src={Youtube}
                // bg={"#4285f4"}
                // // pb={"3%"}
                // fontColor={"White"}
                // alt="logo"
              />
              <Text fontFamily={"sans-serif"} fontSize={"16"}>
                Youtube
              </Text>
            </Box>{" "}
            <Box textAlign={"center"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="70"
                height="70"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#29b6f6"
                  d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"
                ></path>
                <path
                  fill="#fff"
                  d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"
                ></path>
                <path
                  fill="#b0bec5"
                  d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"
                ></path>
                <path
                  fill="#cfd8dc"
                  d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"
                ></path>
              </svg>
              <Text fontFamily={"sans-serif"} fontSize={"16"}>
                Telegram
              </Text>
            </Box>
            <Box textAlign={"center"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="70"
                height="70"
                viewBox="0 0 48 48"
              >
                <radialGradient
                  id="yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1"
                  cx="19.38"
                  cy="42.035"
                  r="44.899"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#fd5"></stop>
                  <stop offset=".328" stop-color="#ff543f"></stop>
                  <stop offset=".348" stop-color="#fc5245"></stop>
                  <stop offset=".504" stop-color="#e64771"></stop>
                  <stop offset=".643" stop-color="#d53e91"></stop>
                  <stop offset=".761" stop-color="#cc39a4"></stop>
                  <stop offset=".841" stop-color="#c837ab"></stop>
                </radialGradient>
                <path
                  fill="url(#yOrnnhliCrdS2gy~4tD8ma_Xy10Jcu1L2Su_gr1)"
                  d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                ></path>
                <radialGradient
                  id="yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2"
                  cx="11.786"
                  cy="5.54"
                  r="29.813"
                  gradientTransform="matrix(1 0 0 .6663 0 1.849)"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stop-color="#4168c9"></stop>
                  <stop
                    offset=".999"
                    stop-color="#4168c9"
                    stop-opacity="0"
                  ></stop>
                </radialGradient>
                <path
                  fill="url(#yOrnnhliCrdS2gy~4tD8mb_Xy10Jcu1L2Su_gr2)"
                  d="M34.017,41.99l-20,0.019c-4.4,0.004-8.003-3.592-8.008-7.992l-0.019-20	c-0.004-4.4,3.592-8.003,7.992-8.008l20-0.019c4.4-0.004,8.003,3.592,8.008,7.992l0.019,20	C42.014,38.383,38.417,41.986,34.017,41.99z"
                ></path>
                <path
                  fill="#fff"
                  d="M24,31c-3.859,0-7-3.14-7-7s3.141-7,7-7s7,3.14,7,7S27.859,31,24,31z M24,19c-2.757,0-5,2.243-5,5	s2.243,5,5,5s5-2.243,5-5S26.757,19,24,19z"
                ></path>
                <circle cx="31.5" cy="16.5" r="1.5" fill="#fff"></circle>
                <path
                  fill="#fff"
                  d="M30,37H18c-3.859,0-7-3.14-7-7V18c0-3.86,3.141-7,7-7h12c3.859,0,7,3.14,7,7v12	C37,33.86,33.859,37,30,37z M18,13c-2.757,0-5,2.243-5,5v12c0,2.757,2.243,5,5,5h12c2.757,0,5-2.243,5-5V18c0-2.757-2.243-5-5-5H18z"
                ></path>
              </svg>
              <Text fontFamily={"sans-serif"} fontSize={"16"}>
                Instagram
              </Text>
            </Box>
            <Box textAlign={"center"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="70"
                height="70"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#039be5"
                  d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                ></path>
                <path
                  fill="#fff"
                  d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                ></path>
              </svg>
              <Text fontFamily={"sans-serif"} fontSize={"16"}>
                Facebook
              </Text>
            </Box>
            <Box textAlign={"center"}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="70"
                height="70"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#fff"
                  d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"
                ></path>
                <path
                  fill="#fff"
                  d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"
                ></path>
                <path
                  fill="#cfd8dc"
                  d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"
                ></path>
                <path
                  fill="#40c351"
                  d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"
                ></path>
                <path
                  fill="#fff"
                  fill-rule="evenodd"
                  d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <Text fontFamily={"sans-serif"} fontSize={"16"}>
                WhatsApp
              </Text>
            </Box>
          </Flex>
        </Box>{" "}
        <Box p={"1%"} w={"90%"} textAlign="center" m={"1% auto"}>
          <Text fontFamily={"sans-serif"} fontSize={"18"}>
            Top compitative Subject Quize
          </Text>
          <Box
            display={{ base: "grid", lg: "flex" }}
            justifyContent={"space-around"}
            // gridTemplateColumns={"repeat(2,1fr)"}
            // w={"100%"}
            gap="5"
            // mt={"1%"}
          >
            <Box
              _hover={{
                transform: "scale(1.1)",
                transition: "0.5s ease-in-out",
              }}
              border={"3px solid #66afdd"}
              bg={"#66afdd"}
              color={"white"}
              borderRadius={"3px"}
              boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
              w={{ base: "100%", lg: "15%" }}
              // h={"20%"}
              mt={{ base: "5%", lg: "" }}
              onClick={() => {
                setsub("Eng");
                console.log("e");
              }}
            >
              <Box>
                <svg
                  fill="none"
                  height="48"
                  viewBox="0 0 48 48"
                  width="48"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    fill="#2F88FF"
                    height="36"
                    rx="3"
                    stroke="#666666"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                    width="36"
                    x="6"
                    y="6"
                  />
                  <path
                    d="M13 31V17H21"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                  />
                  <path
                    d="M13 24H20.5"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                  />
                  <path
                    d="M13 31H20.5"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                  />
                  <path
                    d="M26 31L26 19"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                  />
                  <path
                    d="M26 31L26 24.5C26 22.0147 28.0147 20 30.5 20V20C32.9853 20 35 22.0147 35 24.5L35 31"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                  />
                </svg>
              </Box>
              <Text m={"5%"} fontSize={"20"}>
                English
              </Text>
            </Box>
            <Box
              // to={"/questionList"}
              _hover={{
                transform: "scale(1.1)",
                transition: "0.5s ease-in-out",
              }}
              mt={{ base: "5%", lg: "" }}
              border={"3px solid #41d8d5"}
              bg={"#41d8d5"}
              color={"white"}
              borderRadius={"3px"}
              boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
              w={{ base: "100%", lg: "15%" }}
              onClick={() => setsub("math")}
            >
              <Box>
                {/* <svg viewBox="0 0 32 32">
                  <defs>
                    <style>
                      {`
          .cls-1{fill:none;}
          .cls-2{fill:#02a0e1;}
          .cls-3{fill:#bdeeff;}
        `}
                    </style>
                  </defs>
                  <g id="calculator">
                    <rect
                      className="cls-1"
                      height="32"
                      id="wrapper"
                      width="32"
                      y="0.07"
                    />
                    <path
                      className="cls-2"
                      d="M26.62,30.55h-21a4,4,0,0,1-4-4v-21a4,4,0,0,1,4-4h21a4,4,0,0,1,4,4v21A4,4,0,0,1,26.62,30.55Zm-21-27a2,2,0,0,0-2,2v21a2,2,0,0,0,2,2h21a2,2,0,0,0,2-2v-21a2,2,0,0,0-2-2Z"
                    />
                    <rect
                      className="cls-3"
                      height="3.89"
                      rx="1"
                      ry="1"
                      width="20.35"
                      x="5.97"
                      y="6"
                    />
                    <path
                      className="cls-2"
                      d="M25.32,10.89H7a2,2,0,0,1-2-2V7A2,2,0,0,1,7,5H25.32a2,2,0,0,1,2,2V8.89A2,2,0,0,1,25.32,10.89Zm0-2v0ZM7,7V8.89H25.32V7Z"
                    />
                    <path
                      className="cls-2"
                      d="M9.64,18.67H7a2,2,0,0,1-2-2V14a2,2,0,0,1,2-2H9.64a2,2,0,0,1,2,2v2.67A2,2,0,0,1,9.64,18.67Zm0-2v0ZM7,14v2.67H9.63V14Z"
                    />
                    <path
                      className="cls-2"
                      d="M17.63,18.67H15a2,2,0,0,1-2-2V14a2,2,0,0,1,2-2h2.66a2,2,0,0,1,2,2v2.67A2,2,0,0,1,17.63,18.67Zm0-2v0ZM15,14v2.67h2.66V14Z"
                    />
                    <path
                      className="cls-2"
                      d="M9.64,26.67H7a2,2,0,0,1-2-2V22a2,2,0,0,1,2-2H9.64a2,2,0,0,1,2,2v2.67A2,2,0,0,1,9.64,26.67Zm0-2v0ZM7,22v2.67H9.63V22Z"
                    />
                    <path
                      className="cls-2"
                      d="M17.63,26.67H15a2,2,0,0,1-2-2V22a2,2,0,0,1,2-2h2.66a2,2,0,0,1,2,2v2.67A2,2,0,0,1,17.63,26.67Zm0-2v0ZM15,22v2.67h2.66V22Z"
                    />
                    <rect
                      className="cls-3"
                      height="12.84"
                      rx="1"
                      ry="1"
                      width="4.66"
                      x="21.97"
                      y="13"
                    />
                    <path
                      className="cls-2"
                      d="M25.63,26.84H23a2,2,0,0,1-2-2V14a2,2,0,0,1,2-2h2.66a2,2,0,0,1,2,2V24.84A2,2,0,0,1,25.63,26.84Zm0-2v0ZM23,14V24.84h2.66V14Z"
                    />
                  </g>
                </svg> */}

                <svg
                  data-name="Layer 2"
                  id="Layer_2"
                  viewBox="0 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                >
                  <defs>
                    <style>
                      {`
                .cls-1 { fill: #45d4d9; }
                .cls-2 { fill: #2d95b5; }
                .cls-3 { fill: #f74b50; }
                .cls-4 { fill: #5c3b51; }
                .cls-5 { fill: #4a2e42; }
                .cls-6 { fill: #2c2a3d; }
            `}
                    </style>
                  </defs>
                  <title />
                  <rect
                    className="cls-1"
                    height="18"
                    width="29"
                    x="1.5"
                    y="4"
                  />
                  <rect
                    className="cls-2"
                    height="1.5"
                    width="29"
                    x="1.5"
                    y="4"
                  />
                  <rect
                    className="cls-3"
                    height="2"
                    width="29"
                    x="1.5"
                    y="20"
                  />
                  <polygon
                    className="cls-4"
                    points="12.255 22 10.75 30.5 8.56 30.5 10 22 12.255 22"
                  />
                  <polygon
                    className="cls-4"
                    points="22.36 22 23.8 30.5 21.61 30.5 20.105 22 22.36 22"
                  />
                  <polygon
                    className="cls-4"
                    points="13.5 4 14.1 1.5 17.9 1.5 18.5 4 13.5 4"
                  />
                  <polygon
                    className="cls-5"
                    points="18.26 3 17.9 1.5 14.1 1.5 13.74 3 18.26 3"
                  />
                  <path
                    className="cls-6"
                    d="M30.5,3.5H18.895l-0.5-2.115a0.5,0.5,0,0,0-.5-.385H14.1a0.5,0.5,0,0,0-.5.385L13.5,3.5H1.5A0.5,0.5,0,0,0,1,4v18.5a0.5,0.5,0,0,0,.5.5H9.41L8.065,30.415a0.5,0.5,0,0,0,.115.415,0.5,0.5,0,0,0,.38.175H10.75a0.5,0.5,0,0,0,.5-.415L12.675,22.5h7l1.43,8.08a0.5,0.5,0,0,0,.5.415h1.98a0.5,0.5,0,0,0,.5-.585L22.95,22.5H30.5a0.5,0.5,0,0,0,.5-0.5V4A0.5,0.5,0,0,0,30.5,3.5ZM10.33,30H9.15l1.27-7.5h1.24Zm11.7,0L20.7,22.5h1.24l1.27,7.5ZM14.5,2h3l0.355,1.5H14.135ZM13.5,4H30V19H3V4ZM30,21H3v-1H30Z"
                  />
                  <path
                    className="cls-6"
                    d="M22,17h4a0.5,0.5,0,0,0,0-1H22.5V14a1.5,1.5,0,0,1,1.5-1.5,2.5,2.5,0,1,0-2.5-2.5,0.5,0.5,0,0,0,1,0,1.5,1.5,0,1,1,1.5,1.5,2.5,2.5,0,0,0-2.5,2.5v2A0.5,0.5,0,0,0,22,17Z"
                  />
                  <path
                    className="cls-6"
                    d="M6,13h3.5v3.5a0.5,0.5,0,0,0,1,0V9.5a0.5,0.5,0,0,0-1,0V12H7V9.5a0.5,0.5,0,0,0-1,0v3A0.5,0.5,0,0,0,6,13Z"
                  />
                  <path
                    className="cls-6"
                    d="M14,13h2v2a0.5,0.5,0,0,0,1,0V13h2a0.5,0.5,0,0,0,0-1H17V9.5a0.5,0.5,0,0,0-1,0v2H14a0.5,0.5,0,0,0,0,1Z"
                  />
                </svg>
              </Box>
              <Text m={"5%"} fontSize={"20"}>
                Maths
              </Text>
            </Box>
            <Box
              _hover={{
                transform: "scale(1.1)",
                transition: "0.5s ease-in-out",
              }}
              mt={{ base: "5%", lg: "" }}
              border={"3px solid #48bb78"}
              borderRadius={"3px"}
              bg={"#48bb78"}
              color={"white"}
              boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
              w={{ base: "100%", lg: "15%" }}
              onClick={() => setsub("Reasoning")}
            >
              <Box>
                <svg
                  id="Layer_1_1_"
                  style={{
                    enableBackground: "new 0 0 64 64",
                    width: "50",
                    // height: "64px",""
                  }} // Set size here if needed
                  version="1.1"
                  viewBox="0 0 64 64"
                  xmlSpace="preserve"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                >
                  <g>
                    <g>
                      <path
                        d="M42,20H22c-1.105,0-2-0.895-2-2v-7c0-1.105,0.895-2,2-2h20c1.105,0,2,0.895,2,2v7C44,19.105,43.105,20,42,20z"
                        style={{ fill: "#006400" }} // Dark green
                      />
                    </g>
                    <g>
                      <path
                        d="M38,39H26c-1.105,0-2,0.895-2,2v6h16v-6C40,39.895,39.105,39,38,39z"
                        style={{ fill: "#006400" }} // Dark green
                      />
                    </g>
                    <g>
                      <path
                        d="M1,52c0,2.757,2.243,5,5,5h12v4h-4v2h36v-2h-4v-4h12c2.757,0,5-2.243,5-5v-3H1V52z M44,61H20v-4h24V61z M3,51h58v1c0,1.654-1.346,3-3,3H6c-1.654,0-3-1.346-3-3V51z"
                        style={{ fill: "#3F3A34" }}
                      />
                      <path
                        d="M3,16c0-1.654,1.346-3,3-3h7v-2H6c-2.757,0-5,2.243-5,5v31h2V16z"
                        style={{ fill: "#3F3A34" }}
                      />
                      <path
                        d="M58,11v2c1.654,0,3,1.346,3,3v31h2V16C63,13.243,60.757,11,58,11z"
                        style={{ fill: "#3F3A34" }}
                      />
                      <polygon
                        points="19,33.423 27,31.819 27,29 25,29 25,30.181 17,31.784 17,47 19,47"
                        style={{ fill: "#3F3A34" }}
                      />
                      <polygon
                        points="47,47 47,32.221 39,30.219 39,29 37,29 37,31.781 45,33.783 45,47"
                        style={{ fill: "#3F3A34" }}
                      />
                      <path
                        d="M15,34v-2h-4c-1.103,0-2,0.897-2,2v8c0,1.103,0.897,2,2,2v3h2v-3h2v-2h-4v-8H15z"
                        style={{ fill: "#3F3A34" }}
                      />
                      <path
                        d="M51,47h2v-3c1.103,0,2-0.897,2-2v-8c0-1.103-0.897-2-2-2h-4v2h4v8h-4v2h2V47z"
                        style={{ fill: "#3F3A34" }}
                      />
                      <path
                        d="M21.406,20.94C22.712,25.652,27.047,29,32,29s9.288-3.348,10.594-8.06C43.965,20.663,45,19.451,45,18v-7c0-1.568-1.213-2.844-2.747-2.974C40.621,3.797,36.589,1,32,1s-8.621,2.797-10.253,7.026C20.213,8.156,19,9.432,19,11v7C19,19.451,20.035,20.663,21.406,20.94z M32,27c-3.841,0-7.225-2.462-8.478-6h16.955C39.225,24.538,35.841,27,32,27z M32,3c3.478,0,6.566,1.962,8.064,5H23.936C25.434,4.962,28.522,3,32,3z M21,11c0-0.551,0.448-1,1-1h20c0.552,0,1,0.449,1,1v7c0,0.551-0.448,1-1,1H22c-0.552,0-1-0.449-1-1V11z"
                        style={{ fill: "#3F3A34" }}
                      />
                      <path
                        d="M27.5,17c1.379,0,2.5-1.122,2.5-2.5S28.879,12,27.5,12S25,13.122,25,14.5S26.121,17,27.5,17z M27.5,14c0.275,0,0.5,0.224,0.5,0.5S27.775,15,27.5,15S27,14.776,27,14.5S27.225,14,27.5,14z"
                        style={{ fill: "#3F3A34" }}
                      />
                      <path
                        d="M36.5,17c1.379,0,2.5-1.122,2.5-2.5S37.879,12,36.5,12S34,13.122,34,14.5S35.121,17,36.5,17z M36.5,14c0.275,0,0.5,0.224,0.5,0.5S36.775,15,36.5,15S36,14.776,36,14.5S36.225,14,36.5,14z"
                        style={{ fill: "#3F3A34" }}
                      />
                      <path
                        d="M41,47v-6c0-1.654-1.346-3-3-3H26c-1.654,0-3,1.346-3,3v6h2v-6c0-0.551,0.448-1,1-1h12c0.552,0,1,0.449,1,1v6H41z"
                        style={{ fill: "#3F3A34" }}
                      />
                      <path
                        d="M27,47h2c0-1.654,1.346-3,3-3s3,1.346,3,3h2c0-2.757-2.243-5-5-5S27,44.243,27,47z"
                        style={{ fill: "#3F3A34" }}
                      />
                    </g>
                    <g>
                      <path
                        d="M47,18.618V6h12v10h-6.764L47,18.618z M49,8v7.382L51.764,14H57V8H49z"
                        style={{ fill: "#E56565" }}
                      />
                    </g>
                    <g>
                      <rect
                        height="2"
                        style={{ fill: "#E56565" }}
                        width="4"
                        x="51"
                        y="10"
                      />
                    </g>
                    <g>
                      <path
                        d="M17,30H5V20h6.764L17,17.382V30z M7,28h8v-7.382L12.236,22H7V28z"
                        style={{ fill: "#E56565" }}
                      />
                    </g>
                    <g>
                      <rect
                        height="2"
                        style={{ fill: "#E56565" }}
                        width="4"
                        x="9"
                        y="24"
                      />
                    </g>
                  </g>
                </svg>
              </Box>

              <Text m={"5%"} fontSize={"20"}>
                Reasoning
              </Text>
            </Box>
            <Box
              _hover={{
                transform: "scale(1.1)",
                transition: "0.5s ease-in-out",
              }}
              mt={{ base: "5%", lg: "" }}
              border={"3px solid #ff782c"}
              bg={"#ff782c"}
              color={"white"}
              borderRadius={"3px"}
              boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
              w={{ base: "100%", lg: "15%" }}
              onClick={() => setsub("gs")}
            >
              <Box>
                <svg
                  viewBox="0 0 64 64"
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  // height="64"
                >
                  <circle
                    cx="27"
                    cy="30"
                    r="24"
                    fill="#84d2f4"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M33,42A23.983,23.983,0,0,1,9.392,13.7,24,24,0,1,0,50.608,34.3,23.93,23.93,0,0,1,33,42Z"
                    fill="#57b7eb"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M15,39l5-2V33H16V28l3-1,1-4-5-5,1-3-4.055-3.686A23.985,23.985,0,0,0,9.47,46.384L15,44Z"
                    fill="#c4f236"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M31,45l-4-1V40H22l-3,5,2,5-.614,3.07A24.019,24.019,0,0,0,27,54l4-5Z"
                    fill="#c4f236"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M21,15h3l-1,4,4,4,5-5-2-3V10l2.751-3.3a24,24,0,0,0-14.477.944L19,12Z"
                    fill="#c4f236"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M44,39l3-3,2.77,1.558a23.953,23.953,0,0,0-8.691-26.99L35,13l2,5-4,6,3,5-4,2,1,6-2,3,8,2-3,5,1.881,4.389a24.09,24.09,0,0,0,6.906-5.3Z"
                    fill="#c4f236"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M18.92,37.43,15,39v5L9.47,46.38a23.964,23.964,0,0,1-.08-32.67A23.286,23.286,0,0,0,9,18,23.96,23.96,0,0,0,18.92,37.43Z"
                    fill="#a1d51c"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M31,45v4l-4,5a23.991,23.991,0,0,1-6.61-.93L21,50l-2-5,3-5h1.42A22.933,22.933,0,0,0,27,41.24V44Z"
                    fill="#a1d51c"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M44.03,39.3l.76,6.79a24.4,24.4,0,0,1-6.91,5.3L36,47l3-5-1.63-.41A22.749,22.749,0,0,0,44.03,39.3Z"
                    fill="#a1d51c"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="11"
                    cy="30"
                    r="2"
                    fill="#f89c8d"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M11.194,28.02A1.8,1.8,0,0,0,11,28a2,2,0,1,0,1.776,2.9A23.873,23.873,0,0,1,11.194,28.02Z"
                    fill="#f8664f"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="43"
                    cy="27"
                    r="4"
                    fill="#f89c8d"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                  <g>
                    <circle
                      cx="13"
                      cy="13"
                      r="10"
                      fill="#f89c8d"
                      stroke="#333"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M18,17A10,10,0,0,1,8.427,4.114,10,10,0,1,0,22.573,15.886,9.94,9.94,0,0,1,18,17Z"
                      fill="#f8664f"
                      stroke="#333"
                      strokeWidth="1.5"
                    />
                    <g>
                      <path
                        d="M13,11h0a2,2,0,0,0-2-2h0a2,2,0,0,0-2,2H9a6,6,0,0,0,6,6h0a2,2,0,0,0,2-2h0a2,2,0,0,0-2-2h0A2,2,0,0,1,13,11Z"
                        fill="#c4f236"
                        stroke="#333"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M16,15a6,6,0,0,1-5.986-5.73A1.99,1.99,0,0,0,9,11a6,6,0,0,0,6,6,2,2,0,0,0,2-2,1.905,1.905,0,0,0-.027-.263A1.972,1.972,0,0,1,16,15Z"
                        fill="#a1d51c"
                        stroke="#333"
                        strokeWidth="1.5"
                      />
                    </g>
                    <path
                      d="M15.9,16.776a10.006,10.006,0,0,1-6.883-5.4A6,6,0,0,0,15,17,1.986,1.986,0,0,0,15.9,16.776Z"
                      fill="#7ab92d"
                      stroke="#333"
                      strokeWidth="1.5"
                    />
                  </g>
                  <g>
                    <circle
                      cx="48"
                      cy="48"
                      r="13"
                      fill="#f9e109"
                      stroke="#333"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M55,56A12.988,12.988,0,0,1,44.377,35.522,13,13,0,1,0,58.623,55.478,12.972,12.972,0,0,1,55,56Z"
                      fill="#fcbc04"
                      stroke="#333"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="6"
                      fill="#c4f236"
                      stroke="#333"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M51,51a5.993,5.993,0,0,1-5.466-8.466,6,6,0,1,0,7.932,7.932A5.974,5.974,0,0,1,51,51Z"
                      fill="#a1d51c"
                      stroke="#333"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M48.084,53.994a13,13,0,0,1-5.724-8A5.967,5.967,0,0,0,48,54C48.029,54,48.055,53.994,48.084,53.994Z"
                      fill="#7ab92d"
                      stroke="#333"
                      strokeWidth="1.5"
                    />
                  </g>
                  <path
                    d="M45,29a3.985,3.985,0,0,1-3.64-5.64,3.995,3.995,0,1,0,5.28,5.28A3.985,3.985,0,0,1,45,29Z"
                    fill="#f89c8d"
                    stroke="#333"
                    strokeWidth="1.5"
                  />
                </svg>
              </Box>

              <Text m={"5%"} fontSize={"20"}>
                General studies
              </Text>
            </Box>{" "}
            <Box
              _hover={{
                transform: "scale(1.1)",
                transition: "0.5s ease-in-out",
              }}
              mt={{ base: "5%", lg: "" }}
              border={"3px solid #2c64ff"}
              bg={"#2c64ff"}
              color={"white"}
              borderRadius={"3px"}
              boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
              w={{ base: "100%", lg: "15%" }}
              onClick={() => setsub("vocabulary")}
              // onClick={() => setsub("Eng")}
            >
              <Image
                w="60px"
                height={"50px"}
                src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-vocabulary-literature-flaticons-lineal-color-flat-icons.png"
                alt="vocabulary"
              />
              <Text m={"5%"} fontSize={"20"}>
                Vocabulary
              </Text>
            </Box>
            
              <Box
                _hover={{
                  transform: "scale(1.1)",
                  transition: "0.5s ease-in-out",
                }}
                mt={{ base: "5%", lg: "" }}
                border={"3px solid #5c4ce3"}
                color={"white"}
                bg={"#5c4ce3"}
                borderRadius={"3px"}
                boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
                w={{ base: "100%", lg: "15%" }}
                // onClick={() => setsub("Saved Qustion")}
              ><Link to={"/Saved-question"}>
                <Box>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="50"
                    // height="100"
                    viewBox="0 0 100 100"
                  >
                    <path
                      fill="#a3a3cd"
                      d="M75,75V24c0-4.4-3.6-8-8-8H30c-2.8,0-5,2.2-5,5v55h49C74.6,76,75,75.6,75,75z"
                    ></path>
                    <path
                      fill="#666aad"
                      d="M41,76V16H30c-2.8,0-5,2.2-5,5v55H41z"
                    ></path>
                    <path
                      fill="#fefdef"
                      d="M72,79.5c0,2,1.3,3.9,3,4.5H29.5C27,84,25,82,25,79.5s2-4.5,4.5-4.5H75C73.3,75.6,72,77.5,72,79.5z"
                    ></path>
                    <g>
                      <path
                        fill="#fcba7f"
                        d="M48.5,13.5v31l-8-4l-8,4v-31H48.5z"
                      ></path>
                    </g>
                    <g>
                      <path
                        fill="#1f212b"
                        d="M75,85H29.5c-3,0-5.5-2.5-5.5-5.5s2.5-5.5,5.5-5.5H75c0.5,0,0.9,0.4,1,0.8c0.1,0.5-0.2,0.9-0.7,1.1 c-1.3,0.5-2.3,2-2.3,3.6s1,3.1,2.3,3.6c0.5,0.2,0.7,0.6,0.7,1.1C75.9,84.6,75.5,85,75,85z M29.5,76c-1.9,0-3.5,1.6-3.5,3.5 s1.6,3.5,3.5,3.5h42.6c-0.7-1-1.1-2.2-1.1-3.5s0.4-2.5,1.1-3.5H29.5z"
                      ></path>
                      <path
                        fill="#1f212b"
                        d="M71.5,79h-40c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h40c0.3,0,0.5,0.2,0.5,0.5S71.8,79,71.5,79z M71.5,81h-31 c-0.3,0-0.5-0.2-0.5-0.5s0.2-0.5,0.5-0.5h31c0.3,0,0.5,0.2,0.5,0.5S71.8,81,71.5,81z M26,79.5h-2V21c0-3.3,2.7-6,6-6h2.5v2H30 c-2.2,0-4,1.8-4,4V79.5z M76,75h-2V24c0-3.9-3.1-7-7-7H48.5v-2H67c5,0,9,4,9,9V75z M40.5,60c-0.3,0-0.5-0.2-0.5-0.5v-19 c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v19C41,59.8,40.8,60,40.5,60z M40.5,65c-0.3,0-0.5-0.2-0.5-0.5v-2c0-0.3,0.2-0.5,0.5-0.5 s0.5,0.2,0.5,0.5v2C41,64.8,40.8,65,40.5,65z M40.5,68c-0.3,0-0.5-0.2-0.5-0.5v-1c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v1 C41,67.8,40.8,68,40.5,68z"
                      ></path>
                      <path
                        fill="#1f212b"
                        d="M48.5,45c-0.1,0-0.2,0-0.2-0.1l-7.8-3.9l-7.8,3.9c-0.2,0.1-0.3,0.1-0.5,0c-0.1-0.1-0.2-0.3-0.2-0.4v-31 c0-0.3,0.2-0.5,0.5-0.5h16c0.3,0,0.5,0.2,0.5,0.5v31c0,0.2-0.1,0.3-0.2,0.4C48.7,45,48.6,45,48.5,45z M40.5,40c0.1,0,0.2,0,0.2,0.1 l7.3,3.6V14H33v29.7l7.3-3.6C40.3,40,40.4,40,40.5,40z"
                      ></path>
                    </g>
                  </svg>
                </Box>

                <Text m={"5%"} fontSize={"20"}>
                  Saved question
                </Text> </Link>
              </Box>
           
            {/* <Box
              _hover={{
                transform: "scale(1.1)",
                transition: "0.5s ease-in-out",
              }}
              border={"3px solid #ec407a"}
              bg={"#ec407a"}
              color={"white"}
              borderRadius={"3px"}
              // fontFamily={"serif"}
              boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
              w={"15%"}
            >
              <Text m={"5%"} fontSize={"20"}>
                Coming soon
              </Text>
            </Box> */}
          </Box>
        </Box>
        {/* <Feedback /> */}
        <Box>
          <Text
            textAlign="center"
            p="2%"
            fontFamily={"sans-serif"}
            fontSize="x-large"
          >
            Top Feedback's
          </Text>
          <FeedbackSlideshow />
        </Box>
      </Box>
    </>
  );
};

export default Home;









































// import React from "react";
// import { Box, Flex, Image, Text, IconButton } from "@chakra-ui/react";
// import {
//   FaYoutube,
//   FaTelegram,
//   FaInstagram,
//   FaFacebook,
//   FaWhatsapp,
// } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import Slideshow from "./Slideshow";
// import FeedbackSlideshow from "./Userfeedback";
// import { setLocalStorage } from "../helpers/localStorage";

// const subjects = [
//   { name: "English", color: "#66afdd" },
//   { name: "Maths", color: "#41d8d5" },
//   { name: "Reasoning", color: "#48bb78" },
//   { name: "General Studies", color: "#ff782c" },
//   {
//     name: "Vocabulary",
//     color: "#2c64ff",
//     icon: "https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-vocabulary-literature-flaticons-lineal-color-flat-icons.png",
//   },
//   { name: "Coming Soon", color: "#5c4ce3" },
// ];

// const Home = ({ setchoosesub }) => {
//   const navigate = useNavigate();

//   const setSubject = (subject) => {
//     setchoosesub(subject);
//     setLocalStorage("cat", subject);
//     navigate("/questionList");
//   };

//   return (
//     <Box>
//       <Slideshow />

//       <Box textAlign="center" mt={6}>
//         <Text fontSize="xl" fontWeight="bold">
//           Follow us on
//         </Text>
//         <Flex justifyContent="center" gap={4} mt={3}>
//           {[FaYoutube, FaTelegram, FaInstagram, FaFacebook, FaWhatsapp].map(
//             (Icon, index) => (
//               <IconButton
//                 key={index}
//                 icon={<Icon size={24} />}
//                 variant="ghost"
//                 colorScheme="blue"
//                 aria-label="Social Media"
//               />
//             )
//           )}
//         </Flex>
//       </Box>

//       <Box textAlign="center" mt={8}>
//         <Text fontSize="xl" fontWeight="bold">
//           Top Competitive Subject Quizzes
//         </Text>
//         <Flex wrap="wrap" justifyContent="center" gap={5} mt={4}>
//           {subjects.map(({ name, color, icon }) => (
//             <Box
//               key={name}
//               w={{ base: "45%", md: "20%" }}
//               p={4}
//               bg={color}
//               color="white"
//               borderRadius="md"
//               textAlign="center"
//               boxShadow="lg"
//               cursor="pointer"
//               transition="transform 0.3s"
//               _hover={{ transform: "scale(1.05)" }}
//               onClick={() => name !== "Coming Soon" && setSubject(name)}
//             >
//               {icon && <Image src={icon} w={12} mx="auto" mb={2} />}
//               <Text fontSize="lg" fontWeight="bold">
//                 {name}
//               </Text>
//             </Box>
//           ))}
//         </Flex>
//       </Box>

//       <Box textAlign="center" mt={10}>
//         <Text fontSize="xl" fontWeight="bold">
//           Top Feedbacks
//         </Text>
//         <FeedbackSlideshow />
//       </Box>
//     </Box>
//   );
// };

// export default Home;















































// // import React, { useEffect, useState } from "react";
// // import TakeTest from "./TakeTest";
// import {
//   border,
//   Box,
//   Button,
//   Center,
//   Flex,
//   FormControl,
//   FormLabel,
//   Heading,
//   Image,
//   Input,
//   Text,
//   Textarea,
// } from "@chakra-ui/react";
// import Youtube from "../services/svgs/media_svgs/Youtube.svg" 
// import { Link, useNavigate } from "react-router-dom";
// import Slideshow from "./Slideshow";
// import FeedbackSlideshow from "./Userfeedback";
// import { setLocalStorage } from "../helpers/localStorage";
// const Home = ({ setchoosesub }) => {
//   const navigate = useNavigate();
//   const setsub = (pro,sub=null) => {
//      console.log(pro, sub);
//     setchoosesub(pro);
//     console.log(pro,sub);
//   setLocalStorage("cat",sub)

//     navigate("/questionList");
//   };
//   return (
//     <>
    
//       <Box>
//         <Box>
         
//           <Slideshow />
//         </Box>
//         <Box
//           // border={"1px solid #d7efef"}
//           // borderRadius={"7px"}
//           p={"1%"}
//           w={"90%"}
//           m={"6% auto"}
//         >
//           <Text fontFamily={"sans-serif"} textAlign="center" fontSize={"18"}>
//             Follow us on
//           </Text>
//           <Flex justifyContent={"space-around"} mt={"2%"}>
//             <Box textAlign={"center"}>
//               <Image
//                 src={Youtube}
//                 // bg={"#4285f4"}
//                 // // pb={"3%"}
//                 // fontColor={"White"}
//                 // alt="logo"
//               />
//               <Text fontFamily={"sans-serif"} fontSize={"16"}>
//                 Youtube
//               </Text>
//             </Box>{" "}
//             <Box textAlign={"center"}>
             
//               <Text fontFamily={"sans-serif"} fontSize={"16"}>
//                 Telegram
//               </Text>
//             </Box>
//             <Box textAlign={"center"}>

//               <Text fontFamily={"sans-serif"} fontSize={"16"}>
//                 Instagram
//               </Text>
//             </Box>
//             <Box textAlign={"center"}>
      
//               <Text fontFamily={"sans-serif"} fontSize={"16"}>
//                 Facebook
//               </Text>
//             </Box>
//             <Box textAlign={"center"}>

//               <Text fontFamily={"sans-serif"} fontSize={"16"}>
//                 WhatsApp
//               </Text>
//             </Box>
//           </Flex>
//         </Box>{" "}
//         <Box p={"1%"} w={"90%"} textAlign="center" m={"1% auto"}>
//           <Text fontFamily={"sans-serif"} fontSize={"18"}>
//             Top compitative Subject Quize
//           </Text>
//           <Box
//             display={{ base: "grid", lg: "flex" }}
//             justifyContent={"space-around"}
//             // gridTemplateColumns={"repeat(2,1fr)"}
//             // w={"100%"}
//             gap="5"
//             // mt={"1%"}
//           >
//             <Box
//               _hover={{
//                 transform: "scale(1.1)",
//                 transition: "0.5s ease-in-out",
//               }}
//               border={"3px solid #66afdd"}
//               bg={"#66afdd"}
//               color={"white"}
//               borderRadius={"3px"}
//               boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
//               w={{ base: "100%", lg: "15%" }}
//               // h={"20%"}
//               mt={{ base: "5%", lg: "" }}
//               onClick={() => {
//                 setsub("Eng");
//                 console.log("e");
//               }}
//             >
//               <Box>
            
//               </Box>
//               <Text m={"5%"} fontSize={"20"}>
//                 English
//               </Text>
//             </Box>
//             <Box
//               // to={"/questionList"}
//               _hover={{
//                 transform: "scale(1.1)",
//                 transition: "0.5s ease-in-out",
//               }}
//               mt={{ base: "5%", lg: "" }}
//               border={"3px solid #41d8d5"}
//               bg={"#41d8d5"}
//               color={"white"}
//               borderRadius={"3px"}
//               boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
//               w={{ base: "100%", lg: "15%" }}
//               onClick={() => setsub("math")}
//             >
//               <Box>
        
//               </Box>
//               <Text m={"5%"} fontSize={"20"}>
//                 Maths
//               </Text>
//             </Box>
//             <Box
//               _hover={{
//                 transform: "scale(1.1)",
//                 transition: "0.5s ease-in-out",
//               }}
//               mt={{ base: "5%", lg: "" }}
//               border={"3px solid #48bb78"}
//               borderRadius={"3px"}
//               bg={"#48bb78"}
//               color={"white"}
//               boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
//               w={{ base: "100%", lg: "15%" }}
//               onClick={() => setsub("Reasoning")}
//             >
//               <Box>
           
//               </Box>

//               <Text m={"5%"} fontSize={"20"}>
//                 Reasoning
//               </Text>
//             </Box>
//             <Box
//               _hover={{
//                 transform: "scale(1.1)",
//                 transition: "0.5s ease-in-out",
//               }}
//               mt={{ base: "5%", lg: "" }}
//               border={"3px solid #ff782c"}
//               bg={"#ff782c"}
//               color={"white"}
//               borderRadius={"3px"}
//               boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
//               w={{ base: "100%", lg: "15%" }}
//               onClick={() => setsub("gs")}
//             >
//               <Box>
          
//               </Box>

//               <Text m={"5%"} fontSize={"20"}>
//                 General studies
//               </Text>
//             </Box>{" "}
//             <Box
//               _hover={{
//                 transform: "scale(1.1)",
//                 transition: "0.5s ease-in-out",
//               }}
//               mt={{ base: "5%", lg: "" }}
//               border={"3px solid #2c64ff"}
//               bg={"#2c64ff"}
//               color={"white"}
//               borderRadius={"3px"}
//               boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
//               w={{ base: "100%", lg: "15%" }}onClick={() => setsub("vocabulary")}
//               // onClick={() => setsub("Eng")}
//             >
      
//               <Image w="60px" height={"50px"}
//                 src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/external-vocabulary-literature-flaticons-lineal-color-flat-icons.png"
//                 alt="vocabulary"
//               />
//               <Text m={"5%"} fontSize={"20"}>
//                 Vocabulary
//               </Text>
//             </Box>
//             <Box
//               _hover={{
//                 transform: "scale(1.1)",
//                 transition: "0.5s ease-in-out",
//               }}
//               mt={{ base: "5%", lg: "" }}
//               border={"3px solid #5c4ce3"}
//               color={"white"}
//               bg={"#5c4ce3"}
//               borderRadius={"3px"}
//               boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
//               w={{ base: "100%", lg: "15%" }}
//             >
//               <Box>
              
//               </Box>

//               <Text m={"5%"} fontSize={"20"}>
//                 Coming soon
//               </Text>
//             </Box>
//             {/* <Box
//               _hover={{
//                 transform: "scale(1.1)",
//                 transition: "0.5s ease-in-out",
//               }}
//               border={"3px solid #ec407a"}
//               bg={"#ec407a"}
//               color={"white"}
//               borderRadius={"3px"}
//               // fontFamily={"serif"}
//               boxShadow="rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"
//               w={"15%"}
//             >
//               <Text m={"5%"} fontSize={"20"}>
//                 Coming soon
//               </Text>
//             </Box> */}
//           </Box>
//         </Box>
//         {/* <Feedback /> */}
//         <Box>
//           <Text
//             textAlign="center"
//             p="2%"
//             fontFamily={"sans-serif"}
//             fontSize="x-large"
//           >
//             Top Feedback's
//           </Text>
//           <FeedbackSlideshow />
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default Home;
