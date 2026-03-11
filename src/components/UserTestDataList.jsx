import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  Icon,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Grid,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowRight,
  FiBarChart2,
} from "react-icons/fi";
import { FaTrophy, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { resultsAPI } from "../services/api";

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const fmtTime = (s) => {
  if (!s) return "—";
  const m = Math.floor(s / 60),
    sec = s % 60;
  return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
};
const pctColor = (p) => (p >= 70 ? "#16a34a" : p >= 40 ? "#d97706" : "#ef4444");
const pctBg = (p) => (p >= 70 ? "#f0fdf4" : p >= 40 ? "#fffbeb" : "#fef2f2");

const UserTestDataList = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    resultsAPI
      .getMyResults()
      .then((r) => setResults(r.data ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const displayed = showAll ? results : results.slice(0, 6);

  if (loading)
    return (
      <Flex
        minH="60vh"
        align="center"
        justify="center"
        direction="column"
        gap={4}
      >
        <Spinner size="xl" color="#4a72b8" thickness="4px" />
        <Text color="#64748b" fontSize="14px">
          Results load ho rahe hain…
        </Text>
      </Flex>
    );

  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
      {/* Hero */}
      <Box
        bg="linear-gradient(135deg,#0f1e3a,#1e3a5f,#2d5fa8)"
        px={{ base: 4, md: 8 }}
        pt={{ base: 8, md: 12 }}
        pb={{ base: 10, md: 16 }}
      >
        <Box maxW="1100px" mx="auto">
          <Flex
            align="center"
            gap={2}
            mb={6}
            cursor="pointer"
            w="fit-content"
            color="rgba(255,255,255,.5)"
            _hover={{ color: "rgba(255,255,255,.9)" }}
            onClick={() => navigate("/")}
          >
            <Icon as={FaArrowLeft} fontSize="12px" />
            <Text fontSize="13px" fontWeight={600}>
              Home
            </Text>
          </Flex>
          <Flex align="center" gap={4}>
            <Flex
              w="60px"
              h="60px"
              bg="rgba(255,255,255,.1)"
              border="2px solid rgba(255,255,255,.15)"
              borderRadius="16px"
              align="center"
              justify="center"
              flexShrink={0}
            >
              <Icon as={FaTrophy} color="gold" fontSize="24px" />
            </Flex>
            <Box>
              <Text
                fontSize={{ base: "26px", md: "38px" }}
                fontWeight={800}
                color="white"
                letterSpacing="-1px"
              >
                My Results
              </Text>
              <Text fontSize="14px" color="rgba(255,255,255,.6)">
                {results.length} tests complete kiye
              </Text>
            </Box>
          </Flex>
        </Box>
      </Box>

      <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        {results.length === 0 ? (
          <Box
            textAlign="center"
            py={20}
            bg="white"
            borderRadius="16px"
            border="1px solid #e2e8f0"
          >
            <Icon
              as={FiBarChart2}
              fontSize="52px"
              color="#e2e8f0"
              display="block"
              mx="auto"
              mb={4}
            />
            <Text fontSize="17px" fontWeight={700} color="#475569" mb={2}>
              Abhi tak koi test nahi diya
            </Text>
            <Text fontSize="14px" color="#94a3b8" mb={6}>
              Coaching se test do aur results yahan dekhein
            </Text>
            <Button
              onClick={() => navigate("/coaching")}
              bg="#4a72b8"
              color="white"
              borderRadius="10px"
              fontWeight={700}
              _hover={{ bg: "#3b5fa0" }}
            >
              Coaching Browse Karo
            </Button>
          </Box>
        ) : (
          <>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2,1fr)",
                lg: "repeat(3,1fr)",
              }}
              gap={4}
              mb={6}
            >
              {displayed.map((r) => {
                const pct = r.percentage ?? 0;
                return (
                  <Box
                    key={r._id}
                    bg="white"
                    borderRadius="16px"
                    border="1.5px solid #e2e8f0"
                    boxShadow="0 2px 12px rgba(0,0,0,.04)"
                    overflow="hidden"
                    transition="all .2s"
                    _hover={{
                      boxShadow: "0 6px 24px rgba(0,0,0,.08)",
                      transform: "translateY(-2px)",
                    }}
                  >
                    <Box h="4px" bg={pctBg(pct)}>
                      <Box
                        h="100%"
                        w={`${pct}%`}
                        bg={pctColor(pct)}
                        borderRadius="full"
                      />
                    </Box>
                    <Box p={5}>
                      <Flex justify="space-between" align="flex-start" mb={3}>
                        <Text
                          fontSize="14px"
                          fontWeight={700}
                          color="#0f172a"
                          noOfLines={2}
                          flex={1}
                          mr={3}
                        >
                          {r.testId?.title ?? r.testTitle ?? "Test"}
                        </Text>
                        <Box
                          flexShrink={0}
                          px={3}
                          py={1}
                          borderRadius="full"
                          bg={pctBg(pct)}
                          color={pctColor(pct)}
                          fontSize="14px"
                          fontWeight={800}
                        >
                          {pct}%
                        </Box>
                      </Flex>
                      <Flex gap={4} mb={4} flexWrap="wrap">
                        {[
                          {
                            icon: FiCheckCircle,
                            val: r.correctQus?.length ?? r.score ?? 0,
                            color: "#16a34a",
                            label: "correct",
                          },
                          {
                            icon: FiXCircle,
                            val: r.wrongAnswers ?? 0,
                            color: "#ef4444",
                            label: "wrong",
                          },
                          {
                            icon: FiAlertCircle,
                            val: r.notAnsweredQus?.length ?? 0,
                            color: "#94a3b8",
                            label: "skip",
                          },
                        ].map((s) => (
                          <Flex key={s.label} align="center" gap={1.5}>
                            <Icon as={s.icon} color={s.color} fontSize="13px" />
                            <Text
                              fontSize="13px"
                              fontWeight={700}
                              color={s.color}
                            >
                              {s.val}
                            </Text>
                            <Text fontSize="11px" color="#94a3b8">
                              {s.label}
                            </Text>
                          </Flex>
                        ))}
                      </Flex>
                      <Flex justify="space-between" align="center">
                        <Flex align="center" gap={1.5}>
                          <Icon
                            as={FiCalendar}
                            fontSize="11px"
                            color="#94a3b8"
                          />
                          <Text fontSize="11px" color="#94a3b8">
                            {fmtDate(r.createdAt)}
                          </Text>
                        </Flex>
                        <Button
                          size="xs"
                          rightIcon={<FiArrowRight />}
                          onClick={() => {
                            setSelected(r);
                            onOpen();
                          }}
                          bg="#eff6ff"
                          color="#4a72b8"
                          fontWeight={700}
                          borderRadius="7px"
                          _hover={{ bg: "#dbeafe" }}
                        >
                          Details
                        </Button>
                      </Flex>
                    </Box>
                  </Box>
                );
              })}
            </Grid>
            {results.length > 6 && (
              <Flex justify="center">
                <Button
                  onClick={() => setShowAll(!showAll)}
                  variant="outline"
                  borderRadius="10px"
                  fontWeight={700}
                  fontSize="13px"
                  borderColor="#e2e8f0"
                  color="#475569"
                  _hover={{ bg: "#f1f5f9" }}
                >
                  {showAll
                    ? "Kam Dikhao"
                    : `Saare ${results.length} Results Dekho`}
                </Button>
              </Flex>
            )}
          </>
        )}
      </Box>

      {selected && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
          <ModalOverlay backdropFilter="blur(4px)" />
          <ModalContent
            borderRadius="20px"
            fontFamily="'Sora',sans-serif"
            mx={4}
          >
            <ModalHeader
              fontSize="16px"
              fontWeight={800}
              borderBottom="1px solid #f1f5f9"
            >
              {selected.testId?.title ?? "Test Result"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody py={6}>
              <Flex justify="center" mb={6}>
                <Box
                  w="100px"
                  h="100px"
                  borderRadius="full"
                  bg={pctBg(selected.percentage ?? 0)}
                  border="4px solid"
                  borderColor={pctColor(selected.percentage ?? 0)}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDir="column"
                >
                  <Text
                    fontSize="26px"
                    fontWeight={900}
                    color={pctColor(selected.percentage ?? 0)}
                    lineHeight={1}
                  >
                    {selected.percentage ?? 0}%
                  </Text>
                  <Text
                    fontSize="10px"
                    color={pctColor(selected.percentage ?? 0)}
                    fontWeight={700}
                  >
                    score
                  </Text>
                </Box>
              </Flex>
              <Grid templateColumns="repeat(2,1fr)" gap={3} mb={4}>
                {[
                  {
                    label: "Correct",
                    val: selected.correctQus?.length ?? selected.score ?? 0,
                    color: "#16a34a",
                    bg: "#f0fdf4",
                  },
                  {
                    label: "Wrong",
                    val: selected.wrongAnswers ?? 0,
                    color: "#ef4444",
                    bg: "#fef2f2",
                  },
                  {
                    label: "Skipped",
                    val: selected.notAnsweredQus?.length ?? 0,
                    color: "#64748b",
                    bg: "#f8fafc",
                  },
                  {
                    label: "Percentile",
                    val:
                      selected.percentile != null
                        ? `${selected.percentile}%`
                        : "—",
                    color: "#7c3aed",
                    bg: "#f5f3ff",
                  },
                ].map((s) => (
                  <Box
                    key={s.label}
                    bg={s.bg}
                    borderRadius="12px"
                    p={4}
                    textAlign="center"
                  >
                    <Text fontSize="22px" fontWeight={800} color={s.color}>
                      {s.val}
                    </Text>
                    <Text
                      fontSize="10px"
                      color={s.color}
                      fontWeight={700}
                      textTransform="uppercase"
                      opacity={0.7}
                    >
                      {s.label}
                    </Text>
                  </Box>
                ))}
              </Grid>
              <Box bg="#f8fafc" borderRadius="12px" p={4} fontSize="13px">
                <Flex justify="space-between" mb={2}>
                  <Text color="#64748b">Date</Text>
                  <Text fontWeight={600} color="#374151">
                    {fmtDate(selected.createdAt)}
                  </Text>
                </Flex>
                <Flex justify="space-between">
                  <Text color="#64748b">Time Taken</Text>
                  <Text fontWeight={600} color="#374151">
                    {fmtTime(selected.timeTaken)}
                  </Text>
                </Flex>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default UserTestDataList;
