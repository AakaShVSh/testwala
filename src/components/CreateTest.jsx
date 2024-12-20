import { Box, Button, Collapse, Grid, GridItem, Input, Select, Tag, Text, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { MdAddBox } from "react-icons/md";
import { getLocalStorage } from "../helpers/localStorage";

function CollapseEx({setlist,setnoOfQus,setq,setname}) {
 const { isOpen: isOpen1, onToggle: onToggle1 } = useDisclosure();
  const { isOpen: isOpen2, onToggle: onToggle2 } = useDisclosure();
  const [totalqus,setTotalQus] = useState(20);
  const [arr,setarr] = useState([])
  const [TestSubject,setTestSubject] = useState("");


  useEffect(() => {
    setlist(arr)
    // setquslist({...quslist,qusdata:arr})
    setTestSubject(getLocalStorage("Subject"));
  setnoOfQus(totalqus)
    
  },[arr, setlist, setnoOfQus, totalqus])
  return (
    <>
      <Button mt="2" mr="2" onClick={onToggle1}>
        Create Direact Test <MdAddBox />
      </Button>
      <Button mt="2" onClick={onToggle2}>
        Create Typewise Test <MdAddBox />
      </Button>
      <Collapse in={isOpen2} animateOpacity>
        <Box
          p="10px"
          //   color="white"
          mt="2"
          bg="white"
          rounded="md"
          shadow="md"
        >
          <Grid
            // templateRows="repeat(2, 1fr)"
            templateColumns="repeat(1, 1fr)"
            gap={3}
          >
            {/* <Lorem count={1} /> */}
            <GridItem>
              <Text mb="3px">Test Name</Text>
              <Input
                // value={"select"}
                defaultValue="Test 1"
                // onChange={"handleChange"}
                placeholder="Here is a sample placeholder"
                onChange={(e) => setname(e.target.value)}
                size="sm"
              />
            </GridItem>
            <GridItem>
              <Text mb="3px">Select Question Types</Text>
              <Select
                onChange={(e) => {
                  if (!arr.includes(e.target.value) && e.target.value !== "") {
                    setarr([...arr, e.target.value]);
                  }
                }}
                defaultValue="Test 1"
                size="sm"
                sx={{
                  "&::-webkit-scrollbar": {
                    display: "none",
                  },
                  "-ms-overflow-style": "none", // for Internet Explorer and Edge
                  "scrollbar-width": "none", // for Firefox
                }}
              >
                {TestSubject === "Eng" ? (
                  <>
                    {" "}
                    <option></option>
                    <option
                      value="Spot the Error"
                      style={{
                        backgroundColor: arr.includes("Spot the Error")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Spot the Error
                    </option>
                    {/* <option
                  value="reading-comprehension"
                  style={{
                    backgroundColor: arr.includes("reading-comprehension")
                      ? "gray"
                      : "",
                    // color: "white",
                  }}
                >
                  Reading Comprehension
                </option>
                <option
                  value="synonyms"
                  style={{
                    backgroundColor: arr.includes("synonyms") ? "gray" : "",
                    // color: "white",
                  }}
                >
                  Synonyms
                </option>
                <option
                  value="antonyms"
                  style={{
                    backgroundColor: arr.includes("antonyms") ? "gray" : "",
                    // color: "white",
                  }}
                >
                  Antonyms
                </option>
                <option
                  value="fill-in-the-blanks"
                  style={{
                    backgroundColor: arr.includes("fill-in-the-blanks")
                      ? "gray"
                      : "",
                    // color: "white",
                  }}
                >
                  Fill in the Blanks
                </option>
                <option
                  value="sentence-improvement"
                  style={{
                    backgroundColor: arr.includes("sentence-improvement")
                      ? "gray"
                      : "",
                    // color: "white",
                  }}
                >
                  Sentence Improvement
                </option>

                <option
                  value="para-jumbles"
                  style={{
                    backgroundColor: arr.includes("para-jumbles") ? "gray" : "",
                    // color: "white",
                  }}
                >
                  Para Jumbles
                </option>
                <option
                  value="idioms-and-phrases"
                  style={{
                    backgroundColor: arr.includes("idioms-and-phrases")
                      ? "gray"
                      : "",
                    // color: "white",
                  }}
                >
                  Idioms and Phrases
                </option>
                <option
                  value="one-word-substitution"
                  style={{
                    backgroundColor: arr.includes("one-word-substitution")
                      ? "gray"
                      : "",
                    // color: "white",
                  }}
                >
                  One Word Substitution
                </option>
                <option
                  value="active-passive-voice"
                  style={{
                    backgroundColor: arr.includes("active-passive-voice")
                      ? "gray"
                      : "",
                    // color: "white",
                  }}
                >
                  Active and Passive Voice
                </option>
                <option
                  value="direct-indirect-speech"
                  style={{
                    backgroundColor: arr.includes("direct-indirect-speech")
                      ? "gray"
                      : "",
                    // color: "white",
                  }}
                >
                  Direct and Indirect Speech
                </option>
                <option
                  value="cloze-test"
                  style={{
                    backgroundColor: arr.includes("cloze-test") ? "gray" : "",
                    // color: "white",
                  }}
                >
                  Cloze Test
                </option>
                <option
                  value="sentence-completion"
                  style={{
                    backgroundColor: arr.includes("sentence-completion")
                      ? "gray"
                      : "",
                    // color: "white",
                  }}
                >
                  Sentence Completion
                </option> */}
                    <option
                      value="Vocabulary"
                      style={{
                        backgroundColor: arr.includes("Vocabulary")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Vocabulary
                    </option>
                    {/* <option
                  value="prepositions"
                  style={{
                    backgroundColor: arr.includes("prepositions") ? "gray" : "",
                    // color: "white",
                  }}
                >
                  Prepositions
                </option>
                <option
                  value="articles"
                  style={{
                    backgroundColor: arr.includes("articles") ? "gray" : "",
                    // color: "white",
                  }}
                >
                  Articles
                </option>
                <option
                  value="tenses"
                  style={{
                    backgroundColor: arr.includes("tenses") ? "gray" : "",
                    // color: "white",
                  }}
                >
                  Tenses
                </option>
                <option
                  value="subject-verb-agreement"
                  style={{
                    backgroundColor: arr.includes("subject-verb-agreement")
                      ? "gray"
                      : "",
                    // color: "white",
                  }}
                >
                  Subject-Verb Agreement
                </option>
                <option
                  value="phrasal-verbs"
                  style={{
                    backgroundColor: arr.includes("phrasal-verbs")
                      ? "gray"
                      : "",
                    // color: "white",
                  }}
                >
                  Phrasal Verbs
                </option> */}
                  </>
                ) : TestSubject === "math" ? (
                  <>
                    <option></option>
                    {/* <option
                      value="Average"
                      style={{
                        backgroundColor: arr.includes("Average") ? "gray" : "",
                        // color: "white",
                      }}
                    >
                      Average
                    </option>{" "} */}
                    <option
                      value="Mean,Median and Mode"
                      style={{
                        backgroundColor: arr.includes("Mean,Median and Mode")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Mean,Median and Mode
                    </option>{" "}
                    <option
                      value="L.C.M and H.C.F"
                      style={{
                        backgroundColor: arr.includes("L.C.M and H.C.F")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      L.C.M and H.C.F
                    </option>{" "}
                    {/* <option
                      value="Surds and Indices"
                      style={{
                        backgroundColor: arr.includes("Surds and Indices")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Surds and Indices
                    </option>{" "}
                    <option
                      value="Algebraic Identities"
                      style={{
                        backgroundColor: arr.includes("Algebraic Identities")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Algebraic Identities
                    </option>{" "}
                    <option
                      value="Percentage"
                      style={{
                        backgroundColor: arr.includes("Percentage")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Percentage
                    </option>{" "}
                    <option
                      value="Profit and Loss"
                      style={{
                        backgroundColor: arr.includes("Profit and Loss")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Profit and Loss
                    </option>{" "}
                    <option
                      value="Simple and Compound Interest"
                      style={{
                        backgroundColor: arr.includes(
                          "Simple and Compound Interest"
                        )
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Simple and Compound Interest
                    </option>{" "}
                    <option
                      value="Number System"
                      style={{
                        backgroundColor: arr.includes("Number System")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Number System
                    </option>{" "}
                    <option
                      value="Ratio and Proportion"
                      style={{
                        backgroundColor: arr.includes("Ratio and Proportion")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Ratio and Proportion
                    </option>{" "}
                    <option
                      value="Partnership"
                      style={{
                        backgroundColor: arr.includes("Partnership")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Partnership
                    </option>{" "}
                    <option
                      value="Problems with Ages"
                      style={{
                        backgroundColor: arr.includes("Problems with Ages")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Problems with Ages
                    </option>{" "}
                    <option
                      value="Time and Distance"
                      style={{
                        backgroundColor: arr.includes("Time and Distance")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Time and Distance
                    </option>{" "}
                    <option
                      value="Pipe and Cistern"
                      style={{
                        backgroundColor: arr.includes("Pipe and Cistern")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Pipe and Cistern
                    </option>{" "}
                    <option
                      value="Mixture and Alligation"
                      style={{
                        backgroundColor: arr.includes("Mixture and Alligation")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Mixture and Alligation
                    </option>{" "}
                    <option
                      value="Distance, Time, and Speed"
                      style={{
                        backgroundColor: arr.includes(
                          "Distance, Time, and Speed"
                        )
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Distance, Time, and Speed
                    </option>{" "}
                    <option
                      value="Problems based on Train, Boat, and Stream"
                      style={{
                        backgroundColor: arr.includes(
                          "Problems based on Train, Boat, and Stream"
                        )
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Problems based on Train, Boat, and Stream
                    </option>{" "}
                    <option
                      value="Mensuration 2D & 3D"
                      style={{
                        backgroundColor: arr.includes("Mensuration 2D & 3D")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Mensuration 2D & 3D
                    </option>{" "}
                    <option
                      value="Coordinate Geometry"
                      style={{
                        backgroundColor: arr.includes("Coordinate Geometry")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Coordinate Geometry
                    </option>{" "}
                    <option
                      value="Trigonometry"
                      style={{
                        backgroundColor: arr.includes("Trigonometry")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Trigonometry
                    </option>{" "}
                    <option
                      value="Data Interpretation"
                      style={{
                        backgroundColor: arr.includes("Data Interpretation")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Data Interpretation
                    </option>{" "} */}
                    {/* <option
                      value="General Studies"
                      style={{
                        backgroundColor: arr.includes("General Studies")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      General Studies
                    </option>{" "} */}
                  </>
                ) : TestSubject === "gs" ? (
                  <>
                    <option
                      value="Vedic age"
                      style={{
                        backgroundColor: arr.includes("Vedic age")
                          ? "gray"
                          : "",
                        // color: "white",
                      }}
                    >
                      Vedic age
                    </option>
                  </>
                ) : (
                  ""
                )}
              </Select>

              <Box display="flex" flexWrap="wrap" gap="8px" mt="10px">
                {arr.map((e, i) => (
                  <Text
                    as="span"
                    bg="whitesmoke"
                    p="1"
                    borderRadius="20px"
                    fontSize="small"
                    minWidth="fit-content" // Ensure minimum width to avoid squeezing
                    maxWidth="150px" // Define max width before wrapping text
                    overflow="hidden" // Hide overflow if necessary
                    textOverflow="ellipsis" // Add ellipsis for long words
                    key={i} // Add a key for each mapped element
                  >
                    {e}
                  </Text>
                ))}
              </Box>
            </GridItem>
            <GridItem>
              <Text mb="3px">Number of Questions You Want</Text>
              <Input
                defaultValue="20"
                // onChange={"handleChange"}
                onChange={(e) => setTotalQus(e.target.value)}
                type="number"
                placeholder="Here is a sample placeholder"
                size="sm"
              />
            </GridItem>
            <GridItem display={"inline-flex"} gap={"4"}>
              {" "}
              <Button
                mt="2"
                w="20%"
                // mr="6"
                fontSize={"sm"}
                // mt="2"
                // w="30%"
                bg="white"
                color="Red"
                border="1px solid red"
                _hover={{
                  transform: "scale(1.1)",
                  transition: "0.5s ease-in-out",
                  color: "white",
                  bg: "red",
                }}
                // fontSize={"sm"}
                onClick={onToggle2}
                // onClick={onToggle1}
              >
                Discarde
              </Button>{" "}
              <Button
                mt="2"
                w="20%"
                // mr="1%"
                fontSize={"sm"}
                bg="white"
                color="green"
                border="1px solid green"
                _hover={{
                  transform: "scale(1.1)",
                  transition: "0.5s ease-in-out",
                  color: "white",
                  bg: "green",
                }}
                // fontSize={"sm"}
                // onClick={onToggle1}
                onClick={setq}
              >
                Create
              </Button>
            </GridItem>
          </Grid>
        </Box>
      </Collapse>

      <Collapse in={isOpen1} animateOpacity>
        <Box
          p="10px"
          //   color="white"
          mt="2"
          bg="white"
          rounded="md"
          shadow="md"
        >
          <Grid
            // templateRows="repeat(2, 1fr)"
            templateColumns="repeat(1, 1fr)"
            gap={3}
          >
            {/* <Lorem count={1} /> */}
            <GridItem>
              <Text mb="3px">Test Name</Text>
              <Input
                // value={"select"}
                defaultValue="Test 1"
                // onChange={"handleChange"}
                placeholder="Here is a sample placeholder"
                size="sm"
              />
            </GridItem>
            <GridItem>
              <Text mb="3px">Number of Questions</Text>
              <Input
                // value={"select"}
                type="number"
                defaultValue={"20"}
                // onChange={"handleChange"}
                placeholder=""
                size="sm"
              />
            </GridItem>
            <GridItem display={"inline-flex"} gap={"4"}>
              {" "}
              <Button
                mt="2"
                w="20%"
                // mr="6"
                fontSize={"sm"}
                // mt="2"
                // w="30%"
                bg="white"
                color="Red"
                border="1px solid red"
                _hover={{
                  transform: "scale(1.1)",
                  transition: "0.5s ease-in-out",
                  color: "white",
                  bg: "red",
                }}
                // fontSize={"sm"}
                onClick={onToggle1}
                // onClick={onToggle1}
              >
                Discarde
              </Button>{" "}
              <Button
                mt="2"
                w="20%"
                // mr="1%"
                fontSize={"sm"}
                bg="white"
                color="green"
                border="1px solid green"
                _hover={{
                  transform: "scale(1.1)",
                  transition: "0.5s ease-in-out",
                  color: "white",
                  bg: "green",
                }}
                // fontSize={"sm"}
                // onClick={onToggle1}
                onClick={onToggle1}
              >
                Create
              </Button>
            </GridItem>
          </Grid>
        </Box>
      </Collapse>
    </>
  );
}

export default CollapseEx;