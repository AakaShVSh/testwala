import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { FaPause, FaPlay, FaListUl } from "react-icons/fa";

/**
 * ModalPause — fixed version
 *
 * Props:
 *   question         – full question array (for length)
 *   markedAndAnswer  – indices array
 *   markedNotAnswer  – indices array
 *   notAnswer        – indices array
 *   answered         – indices array
 *   testTitle        – string (passed from TakeTest via testMeta.testTitle)
 *   onPause          – optional callback when paused (to freeze timer in parent)
 *   onResume         – optional callback when resumed
 */
const ModalPause = ({
  markedAndAnswer = [],
  question = [],
  markedNotAnswer = [],
  notAnswer = [],
  answered = [],
  testTitle = "Test",
  onPause,
  onResume,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);

  const notVisited =
    question.length -
    (notAnswer.length +
      answered.length +
      markedNotAnswer.length +
      markedAndAnswer.length);

  const handleOpen = () => {
    setIsOpen(true);
    setShowTable(false);
    if (onPause) onPause();
  };

  const handleClose = () => {
    setIsOpen(false);
    setShowTable(false);
    if (onResume) onResume();
  };

  const statItems = [
    { label: "Total", value: question.length, color: "#38bdf8" },
    {
      label: "Not Visited",
      value: Math.max(0, notVisited),
      color: "rgba(255,255,255,.45)",
    },
    { label: "Not Answered", value: notAnswer.length, color: "#f87171" },
    { label: "Answered", value: answered.length, color: "#4ade80" },
    { label: "Marked", value: markedNotAnswer.length, color: "#c084fc" },
    {
      label: "Marked & Answered",
      value: markedAndAnswer.length,
      color: "#fbbf24",
    },
  ];

  return (
    <>
      {/* Trigger button — styled to match dark exam UI */}
      <Button
        onClick={handleOpen}
        h={{ base: "34px", md: "36px" }}
        px={{ base: 3, md: 4 }}
        borderRadius="9px"
        bg="rgba(255,255,255,.07)"
        border="1px solid rgba(255,255,255,.1)"
        color="rgba(255,255,255,.75)"
        fontWeight={700}
        fontSize={{ base: "11px", md: "12px" }}
        leftIcon={<Icon as={FaPause} fontSize="9px" />}
        _hover={{ bg: "rgba(255,255,255,.13)", color: "white" }}
        transition="all .15s"
      >
        Pause
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        isCentered
        motionPreset="slideInBottom"
        size={showTable ? "xl" : "sm"}
      >
        <ModalOverlay backdropFilter="blur(8px)" bg="rgba(11,30,61,.7)" />
        <ModalContent
          bg="#132952"
          borderRadius="20px"
          overflow="hidden"
          border="1px solid rgba(255,255,255,.09)"
          boxShadow="0 32px 80px rgba(11,30,61,.6)"
          fontFamily="'DM Sans','Segoe UI',sans-serif"
          color="white"
          mx={4}
        >
          {/* Header */}
          <Box
            bg="linear-gradient(135deg,#0b1e3d,#132952)"
            px={6}
            py={5}
            borderBottom="1px solid rgba(255,255,255,.07)"
          >
            <Flex align="center" gap={3}>
              <Flex
                w="40px"
                h="40px"
                borderRadius="11px"
                bg="rgba(255,255,255,.08)"
                border="1px solid rgba(255,255,255,.1)"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <Icon as={FaPause} color="#38bdf8" fontSize="14px" />
              </Flex>
              <Box>
                <Text
                  fontSize="15px"
                  fontWeight={800}
                  color="white"
                  letterSpacing="-.3px"
                >
                  {showTable ? "Test Status" : "Pause Test?"}
                </Text>
                <Text
                  fontSize="11px"
                  color="rgba(255,255,255,.35)"
                  mt={0.5}
                  noOfLines={1}
                >
                  {testTitle}
                </Text>
              </Box>
            </Flex>
          </Box>

          <ModalBody px={6} py={5}>
            {!showTable ? (
              /* Confirmation view */
              <Box>
                <Text
                  fontSize="14px"
                  color="rgba(255,255,255,.65)"
                  lineHeight="1.7"
                  mb={4}
                >
                  Your progress is saved. You can resume the test at any time.
                </Text>
                {/* Mini stats preview */}
                <Grid templateColumns="repeat(3,1fr)" gap={2}>
                  <Box
                    bg="rgba(74,222,128,.1)"
                    borderRadius="10px"
                    p={3}
                    textAlign="center"
                    border="1px solid rgba(74,222,128,.2)"
                  >
                    <Text
                      fontSize="20px"
                      fontWeight={900}
                      color="#4ade80"
                      lineHeight="1"
                    >
                      {answered.length}
                    </Text>
                    <Text
                      fontSize="9px"
                      color="rgba(255,255,255,.4)"
                      fontWeight={700}
                      mt={1}
                      textTransform="uppercase"
                      letterSpacing=".5px"
                    >
                      Answered
                    </Text>
                  </Box>
                  <Box
                    bg="rgba(248,113,113,.1)"
                    borderRadius="10px"
                    p={3}
                    textAlign="center"
                    border="1px solid rgba(248,113,113,.2)"
                  >
                    <Text
                      fontSize="20px"
                      fontWeight={900}
                      color="#f87171"
                      lineHeight="1"
                    >
                      {notAnswer.length}
                    </Text>
                    <Text
                      fontSize="9px"
                      color="rgba(255,255,255,.4)"
                      fontWeight={700}
                      mt={1}
                      textTransform="uppercase"
                      letterSpacing=".5px"
                    >
                      Skipped
                    </Text>
                  </Box>
                  <Box
                    bg="rgba(251,191,36,.1)"
                    borderRadius="10px"
                    p={3}
                    textAlign="center"
                    border="1px solid rgba(251,191,36,.2)"
                  >
                    <Text
                      fontSize="20px"
                      fontWeight={900}
                      color="#fbbf24"
                      lineHeight="1"
                    >
                      {markedAndAnswer.length + markedNotAnswer.length}
                    </Text>
                    <Text
                      fontSize="9px"
                      color="rgba(255,255,255,.4)"
                      fontWeight={700}
                      mt={1}
                      textTransform="uppercase"
                      letterSpacing=".5px"
                    >
                      Marked
                    </Text>
                  </Box>
                </Grid>
              </Box>
            ) : (
              /* Full status table */
              <Box>
                <Text
                  fontSize="11px"
                  fontWeight={700}
                  color="rgba(255,255,255,.4)"
                  textTransform="uppercase"
                  letterSpacing=".8px"
                  mb={3}
                >
                  Question Status Overview
                </Text>
                <Flex direction="column" gap={2}>
                  {statItems.map(({ label, value, color }) => (
                    <Flex
                      key={label}
                      align="center"
                      justify="space-between"
                      px={4}
                      py={3}
                      bg="rgba(255,255,255,.04)"
                      borderRadius="10px"
                      border="1px solid rgba(255,255,255,.06)"
                    >
                      <Flex align="center" gap={2.5}>
                        <Box
                          w="8px"
                          h="8px"
                          borderRadius="2px"
                          bg={color}
                          flexShrink={0}
                        />
                        <Text
                          fontSize="13px"
                          color="rgba(255,255,255,.65)"
                          fontWeight={500}
                        >
                          {label}
                        </Text>
                      </Flex>
                      <Text
                        fontSize="16px"
                        fontWeight={900}
                        color={color}
                        letterSpacing="-.5px"
                      >
                        {value}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
            )}
          </ModalBody>

          <ModalFooter px={6} pb={5} pt={0} gap={2}>
            {!showTable ? (
              <>
                {/* No → close and resume */}
                <Button
                  flex={1}
                  h="44px"
                  borderRadius="12px"
                  bg="rgba(255,255,255,.07)"
                  color="rgba(255,255,255,.65)"
                  border="1px solid rgba(255,255,255,.1)"
                  fontWeight={700}
                  fontSize="13px"
                  onClick={handleClose}
                  _hover={{ bg: "rgba(255,255,255,.11)" }}
                >
                  No, Resume
                </Button>
                {/* Yes → show status table */}
                <Button
                  flex={1}
                  h="44px"
                  borderRadius="12px"
                  bg="linear-gradient(135deg,#2563eb,#1e40af)"
                  color="white"
                  fontWeight={800}
                  fontSize="13px"
                  leftIcon={<Icon as={FaListUl} fontSize="11px" />}
                  onClick={() => setShowTable(true)}
                  _hover={{
                    opacity: 0.9,
                    boxShadow: "0 6px 20px rgba(37,99,235,.35)",
                  }}
                  transition="all .15s"
                >
                  View Status
                </Button>
              </>
            ) : (
              /* Status table view → only Resume */
              <Button
                w="full"
                h="46px"
                borderRadius="12px"
                bg="linear-gradient(135deg,#0d9488,#0891b2)"
                color="white"
                fontWeight={800}
                fontSize="14px"
                leftIcon={<Icon as={FaPlay} fontSize="12px" />}
                onClick={handleClose}
                _hover={{
                  opacity: 0.9,
                  boxShadow: "0 8px 24px rgba(13,148,136,.35)",
                }}
                transition="all .15s"
              >
                Resume Test
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ModalPause;
