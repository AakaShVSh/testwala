import { Box, Heading } from '@chakra-ui/react';
import React from 'react'
import { Link } from 'react-router-dom';

const Questionlist = ({
  category,
  setQuestions,
  handleFullScreen,
  settestTitle,
}) => {
  return (
    <>
      <Box
        w={"90%"}
        bg={"#c4d2ef"}
        // border={"1px solid red"}
        p={"20px"}
        borderRadius={"4px"}
        m={" 20px auto"}
      >
        <Heading>Maths</Heading>

        {category.map((e, i) => (
          <Box
            w={"100%"}
            mt={"2"}
            bg={"#4285f4 "}
            //   border={"1px solid red"}
            overflow={"hidden"}
            p={"2"}
            borderRadius={"3px"}
          >
            <Link
              to={"/test"}
              onClick={() => {
                setQuestions(e.question);
                handleFullScreen(true);
                settestTitle(e.section);
              }}
            >
              <Box
                // bg={"#1f4985"}
                // mt={"430"}
                _hover={"orange"}
                w="100%"
                h={"100%"}
                color={"white"}
              >
                <b>{e.section}</b>
              </Box>
            </Link>
          </Box>
        ))}
      </Box>
    </>
  );
};

export default Questionlist
