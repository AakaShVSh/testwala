// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Badge,
//   Button,
//   Icon,
//   Spinner,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   useDisclosure,
//   Grid,
// } from "@chakra-ui/react";
// import {
//   FiCalendar,
//   FiClock,
//   FiCheckCircle,
//   FiXCircle,
//   FiAlertCircle,
//   FiArrowRight,
//   FiBarChart2,
// } from "react-icons/fi";
// import { FaTrophy, FaArrowLeft } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { resultsAPI } from "../services/api";

// const fmtDate = (d) =>
//   d
//     ? new Date(d).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "—";
// const fmtTime = (s) => {
//   if (!s) return "—";
//   const m = Math.floor(s / 60),
//     sec = s % 60;
//   return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
// };
// const pctColor = (p) => (p >= 70 ? "#16a34a" : p >= 40 ? "#d97706" : "#ef4444");
// const pctBg = (p) => (p >= 70 ? "#f0fdf4" : p >= 40 ? "#fffbeb" : "#fef2f2");

// const UserTestDataList = () => {
//   const navigate = useNavigate();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selected, setSelected] = useState(null);
//   const [showAll, setShowAll] = useState(false);

//   useEffect(() => {
//     resultsAPI
//       .getMyResults()
//       .then((r) => setResults(r.data ?? []))
//       .catch(() => setResults([]))
//       .finally(() => setLoading(false));
//   }, []);

//   const displayed = showAll ? results : results.slice(0, 6);

//   if (loading)
//     return (
//       <Flex
//         minH="60vh"
//         align="center"
//         justify="center"
//         direction="column"
//         gap={4}
//       >
//         <Spinner size="xl" color="#4a72b8" thickness="4px" />
//         <Text color="#64748b" fontSize="14px">
//           Results load ho rahe hain…
//         </Text>
//       </Flex>
//     );

//   return (
//     <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
//       {/* Hero */}
//       <Box
//         bg="linear-gradient(135deg,#0f1e3a,#1e3a5f,#2d5fa8)"
//         px={{ base: 4, md: 8 }}
//         pt={{ base: 8, md: 12 }}
//         pb={{ base: 10, md: 16 }}
//       >
//         <Box maxW="1100px" mx="auto">
//           <Flex
//             align="center"
//             gap={2}
//             mb={6}
//             cursor="pointer"
//             w="fit-content"
//             color="rgba(255,255,255,.5)"
//             _hover={{ color: "rgba(255,255,255,.9)" }}
//             onClick={() => navigate("/")}
//           >
//             <Icon as={FaArrowLeft} fontSize="12px" />
//             <Text fontSize="13px" fontWeight={600}>
//               Home
//             </Text>
//           </Flex>
//           <Flex align="center" gap={4}>
//             <Flex
//               w="60px"
//               h="60px"
//               bg="rgba(255,255,255,.1)"
//               border="2px solid rgba(255,255,255,.15)"
//               borderRadius="16px"
//               align="center"
//               justify="center"
//               flexShrink={0}
//             >
//               <Icon as={FaTrophy} color="gold" fontSize="24px" />
//             </Flex>
//             <Box>
//               <Text
//                 fontSize={{ base: "26px", md: "38px" }}
//                 fontWeight={800}
//                 color="white"
//                 letterSpacing="-1px"
//               >
//                 My Results
//               </Text>
//               <Text fontSize="14px" color="rgba(255,255,255,.6)">
//                 {results.length} tests complete kiye
//               </Text>
//             </Box>
//           </Flex>
//         </Box>
//       </Box>

//       <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
//         {results.length === 0 ? (
//           <Box
//             textAlign="center"
//             py={20}
//             bg="white"
//             borderRadius="16px"
//             border="1px solid #e2e8f0"
//           >
//             <Icon
//               as={FiBarChart2}
//               fontSize="52px"
//               color="#e2e8f0"
//               display="block"
//               mx="auto"
//               mb={4}
//             />
//             <Text fontSize="17px" fontWeight={700} color="#475569" mb={2}>
//               Abhi tak koi test nahi diya
//             </Text>
//             <Text fontSize="14px" color="#94a3b8" mb={6}>
//               Coaching se test do aur results yahan dekhein
//             </Text>
//             <Button
//               onClick={() => navigate("/coaching")}
//               bg="#4a72b8"
//               color="white"
//               borderRadius="10px"
//               fontWeight={700}
//               _hover={{ bg: "#3b5fa0" }}
//             >
//               Coaching Browse Karo
//             </Button>
//           </Box>
//         ) : (
//           <>
//             <Grid
//               templateColumns={{
//                 base: "1fr",
//                 md: "repeat(2,1fr)",
//                 lg: "repeat(3,1fr)",
//               }}
//               gap={4}
//               mb={6}
//             >
//               {displayed.map((r) => {
//                 const pct = r.percentage ?? 0;
//                 return (
//                   <Box
//                     key={r._id}
//                     bg="white"
//                     borderRadius="16px"
//                     border="1.5px solid #e2e8f0"
//                     boxShadow="0 2px 12px rgba(0,0,0,.04)"
//                     overflow="hidden"
//                     transition="all .2s"
//                     _hover={{
//                       boxShadow: "0 6px 24px rgba(0,0,0,.08)",
//                       transform: "translateY(-2px)",
//                     }}
//                   >
//                     <Box h="4px" bg={pctBg(pct)}>
//                       <Box
//                         h="100%"
//                         w={`${pct}%`}
//                         bg={pctColor(pct)}
//                         borderRadius="full"
//                       />
//                     </Box>
//                     <Box p={5}>
//                       <Flex justify="space-between" align="flex-start" mb={3}>
//                         <Text
//                           fontSize="14px"
//                           fontWeight={700}
//                           color="#0f172a"
//                           noOfLines={2}
//                           flex={1}
//                           mr={3}
//                         >
//                           {r.testId?.title ?? r.testTitle ?? "Test"}
//                         </Text>
//                         <Box
//                           flexShrink={0}
//                           px={3}
//                           py={1}
//                           borderRadius="full"
//                           bg={pctBg(pct)}
//                           color={pctColor(pct)}
//                           fontSize="14px"
//                           fontWeight={800}
//                         >
//                           {pct}%
//                         </Box>
//                       </Flex>
//                       <Flex gap={4} mb={4} flexWrap="wrap">
//                         {[
//                           {
//                             icon: FiCheckCircle,
//                             val: r.correctQus?.length ?? r.score ?? 0,
//                             color: "#16a34a",
//                             label: "correct",
//                           },
//                           {
//                             icon: FiXCircle,
//                             val: r.wrongAnswers ?? 0,
//                             color: "#ef4444",
//                             label: "wrong",
//                           },
//                           {
//                             icon: FiAlertCircle,
//                             val: r.notAnsweredQus?.length ?? 0,
//                             color: "#94a3b8",
//                             label: "skip",
//                           },
//                         ].map((s) => (
//                           <Flex key={s.label} align="center" gap={1.5}>
//                             <Icon as={s.icon} color={s.color} fontSize="13px" />
//                             <Text
//                               fontSize="13px"
//                               fontWeight={700}
//                               color={s.color}
//                             >
//                               {s.val}
//                             </Text>
//                             <Text fontSize="11px" color="#94a3b8">
//                               {s.label}
//                             </Text>
//                           </Flex>
//                         ))}
//                       </Flex>
//                       <Flex justify="space-between" align="center">
//                         <Flex align="center" gap={1.5}>
//                           <Icon
//                             as={FiCalendar}
//                             fontSize="11px"
//                             color="#94a3b8"
//                           />
//                           <Text fontSize="11px" color="#94a3b8">
//                             {fmtDate(r.createdAt)}
//                           </Text>
//                         </Flex>
//                         <Button
//                           size="xs"
//                           rightIcon={<FiArrowRight />}
//                           onClick={() => {
//                             setSelected(r);
//                             onOpen();
//                           }}
//                           bg="#eff6ff"
//                           color="#4a72b8"
//                           fontWeight={700}
//                           borderRadius="7px"
//                           _hover={{ bg: "#dbeafe" }}
//                         >
//                           Details
//                         </Button>
//                       </Flex>
//                     </Box>
//                   </Box>
//                 );
//               })}
//             </Grid>
//             {results.length > 6 && (
//               <Flex justify="center">
//                 <Button
//                   onClick={() => setShowAll(!showAll)}
//                   variant="outline"
//                   borderRadius="10px"
//                   fontWeight={700}
//                   fontSize="13px"
//                   borderColor="#e2e8f0"
//                   color="#475569"
//                   _hover={{ bg: "#f1f5f9" }}
//                 >
//                   {showAll
//                     ? "Kam Dikhao"
//                     : `Saare ${results.length} Results Dekho`}
//                 </Button>
//               </Flex>
//             )}
//           </>
//         )}
//       </Box>

//       {selected && (
//         <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
//           <ModalOverlay backdropFilter="blur(4px)" />
//           <ModalContent
//             borderRadius="20px"
//             fontFamily="'Sora',sans-serif"
//             mx={4}
//           >
//             <ModalHeader
//               fontSize="16px"
//               fontWeight={800}
//               borderBottom="1px solid #f1f5f9"
//             >
//               {selected.testId?.title ?? "Test Result"}
//             </ModalHeader>
//             <ModalCloseButton />
//             <ModalBody py={6}>
//               <Flex justify="center" mb={6}>
//                 <Box
//                   w="100px"
//                   h="100px"
//                   borderRadius="full"
//                   bg={pctBg(selected.percentage ?? 0)}
//                   border="4px solid"
//                   borderColor={pctColor(selected.percentage ?? 0)}
//                   display="flex"
//                   alignItems="center"
//                   justifyContent="center"
//                   flexDir="column"
//                 >
//                   <Text
//                     fontSize="26px"
//                     fontWeight={900}
//                     color={pctColor(selected.percentage ?? 0)}
//                     lineHeight={1}
//                   >
//                     {selected.percentage ?? 0}%
//                   </Text>
//                   <Text
//                     fontSize="10px"
//                     color={pctColor(selected.percentage ?? 0)}
//                     fontWeight={700}
//                   >
//                     score
//                   </Text>
//                 </Box>
//               </Flex>
//               <Grid templateColumns="repeat(2,1fr)" gap={3} mb={4}>
//                 {[
//                   {
//                     label: "Correct",
//                     val: selected.correctQus?.length ?? selected.score ?? 0,
//                     color: "#16a34a",
//                     bg: "#f0fdf4",
//                   },
//                   {
//                     label: "Wrong",
//                     val: selected.wrongAnswers ?? 0,
//                     color: "#ef4444",
//                     bg: "#fef2f2",
//                   },
//                   {
//                     label: "Skipped",
//                     val: selected.notAnsweredQus?.length ?? 0,
//                     color: "#64748b",
//                     bg: "#f8fafc",
//                   },
//                   {
//                     label: "Percentile",
//                     val:
//                       selected.percentile != null
//                         ? `${selected.percentile}%`
//                         : "—",
//                     color: "#7c3aed",
//                     bg: "#f5f3ff",
//                   },
//                 ].map((s) => (
//                   <Box
//                     key={s.label}
//                     bg={s.bg}
//                     borderRadius="12px"
//                     p={4}
//                     textAlign="center"
//                   >
//                     <Text fontSize="22px" fontWeight={800} color={s.color}>
//                       {s.val}
//                     </Text>
//                     <Text
//                       fontSize="10px"
//                       color={s.color}
//                       fontWeight={700}
//                       textTransform="uppercase"
//                       opacity={0.7}
//                     >
//                       {s.label}
//                     </Text>
//                   </Box>
//                 ))}
//               </Grid>
//               <Box bg="#f8fafc" borderRadius="12px" p={4} fontSize="13px">
//                 <Flex justify="space-between" mb={2}>
//                   <Text color="#64748b">Date</Text>
//                   <Text fontWeight={600} color="#374151">
//                     {fmtDate(selected.createdAt)}
//                   </Text>
//                 </Flex>
//                 <Flex justify="space-between">
//                   <Text color="#64748b">Time Taken</Text>
//                   <Text fontWeight={600} color="#374151">
//                     {fmtTime(selected.timeTaken)}
//                   </Text>
//                 </Flex>
//               </Box>
//             </ModalBody>
//           </ModalContent>
//         </Modal>
//       )}
//     </Box>
//   );
// };

// export default UserTestDataList;

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
  ModalFooter,
  useDisclosure,
  Grid,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiArrowRight,
  FiBarChart2,
  FiRepeat,
} from "react-icons/fi";
import {
  FaTrophy,
  FaArrowLeft,
  FaChevronDown,
  FaChevronUp,
  FaPlay,
  FaMedal,
} from "react-icons/fa";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { resultsAPI } from "../services/api";

ChartJS.register(ArcElement, Tooltip, Legend);

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
const pctLabel = (p) =>
  p >= 80 ? "Excellent" : p >= 60 ? "Good" : p >= 40 ? "Average" : "Needs Work";

// Group results by test ID
const groupByTest = (results) => {
  const map = {};
  results.forEach((r) => {
    const key = r.testId?._id || r.testId || "unknown";
    if (!map[key]) map[key] = [];
    map[key].push(r);
  });
  return Object.entries(map).map(([testId, attempts]) => ({
    testId,
    title: attempts[0]?.testId?.title ?? attempts[0]?.testTitle ?? "Test",
    attempts: attempts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    ),
    best: attempts.reduce(
      (best, r) => ((r.percentage ?? 0) > (best.percentage ?? 0) ? r : best),
      attempts[0],
    ),
  }));
};

// Mini donut for result card
const MiniDonut = ({ correct, wrong, skipped }) => {
  const data = {
    datasets: [
      {
        data: [correct, wrong, skipped],
        backgroundColor: ["#22c55e", "#ef4444", "#cbd5e1"],
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };
  return (
    <Doughnut
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
      }}
    />
  );
};

const UserTestDataList = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // selected test group
  const [expandedAttempt, setExpandedAttempt] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    resultsAPI
      .getMyResults()
      .then((r) => setResults(r.data ?? []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const grouped = groupByTest(results);
  const displayed = showAll ? grouped : grouped.slice(0, 6);

  const openDetail = (group) => {
    setSelected(group);
    setExpandedAttempt(null);
    onOpen();
  };

  const handleReattempt = (testId) => {
    navigate(`/tests/${testId}`);
    onClose();
  };

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
        <Text color="#64748b" fontSize="14px" fontFamily="'Sora',sans-serif">
          Loading your results…
        </Text>
      </Flex>
    );

  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora', sans-serif">
      {/* Hero */}
      <Box
        bg="linear-gradient(135deg, #0f1e3a 0%, #1e3a5f 50%, #2d5fa8 100%)"
        px={{ base: 4, md: 8 }}
        pt={{ base: 8, md: 12 }}
        pb={{ base: 12, md: 18 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          right="-60px"
          top="-60px"
          w="240px"
          h="240px"
          borderRadius="full"
          bg="rgba(255,255,255,.03)"
        />
        <Box maxW="1100px" mx="auto" position="relative" zIndex={1}>
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
                {grouped.length} tests · {results.length} total attempts
              </Text>
            </Box>
          </Flex>

          {/* Summary strip */}
          {results.length > 0 && (
            <Flex
              mt={6}
              pt={6}
              borderTop="1px solid rgba(255,255,255,.08)"
              gap={{ base: 6, md: 10 }}
              flexWrap="wrap"
            >
              {[
                { label: "Tests Attempted", value: grouped.length },
                { label: "Total Attempts", value: results.length },
                {
                  label: "Best Score",
                  value: `${Math.max(...results.map((r) => r.percentage ?? 0))}%`,
                },
                {
                  label: "Avg Score",
                  value: `${Math.round(results.reduce((s, r) => s + (r.percentage ?? 0), 0) / results.length)}%`,
                },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Text
                    fontSize={{ base: "22px", md: "28px" }}
                    fontWeight={800}
                    color="white"
                    lineHeight="1"
                    letterSpacing="-1px"
                  >
                    {value}
                  </Text>
                  <Text
                    fontSize="10px"
                    color="rgba(255,255,255,.4)"
                    textTransform="uppercase"
                    letterSpacing="1px"
                    mt="2px"
                  >
                    {label}
                  </Text>
                </Box>
              ))}
            </Flex>
          )}
        </Box>
      </Box>

      <Box maxW="1100px" mx="auto" px={{ base: 4, md: 8 }} py={8}>
        {grouped.length === 0 ? (
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
              No tests attempted yet
            </Text>
            <Text fontSize="14px" color="#94a3b8" mb={6}>
              Give your first test and see results here
            </Text>
            <Button
              onClick={() => navigate("/coaching")}
              bg="#4a72b8"
              color="white"
              borderRadius="10px"
              fontWeight={700}
              _hover={{ bg: "#3b5fa0" }}
            >
              Browse Tests
            </Button>
          </Box>
        ) : (
          <>
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              }}
              gap={4}
              mb={6}
            >
              {displayed.map((group) => {
                const best = group.best;
                const pct = best.percentage ?? 0;
                const correct = best.correctQus?.length ?? best.score ?? 0;
                const wrong = best.wrongAnswers ?? 0;
                const skip = best.notAnsweredQus?.length ?? 0;

                return (
                  <Box
                    key={group.testId}
                    bg="white"
                    borderRadius="16px"
                    border="1.5px solid #e2e8f0"
                    boxShadow="0 2px 12px rgba(0,0,0,.04)"
                    overflow="hidden"
                    transition="all .2s"
                    _hover={{
                      boxShadow: "0 8px 28px rgba(0,0,0,.1)",
                      transform: "translateY(-2px)",
                    }}
                    cursor="pointer"
                    onClick={() => openDetail(group)}
                  >
                    {/* Score bar */}
                    <Box h="4px" bg="#f1f5f9">
                      <Box
                        h="100%"
                        w={`${pct}%`}
                        bg={pctColor(pct)}
                        borderRadius="full"
                        transition="width 1s ease"
                      />
                    </Box>

                    <Box p={5}>
                      <Flex
                        justify="space-between"
                        align="flex-start"
                        mb={3}
                        gap={2}
                      >
                        <Box flex={1} minW={0}>
                          <Text
                            fontSize="14px"
                            fontWeight={700}
                            color="#0f172a"
                            noOfLines={2}
                            lineHeight="1.4"
                            mb={1}
                          >
                            {group.title}
                          </Text>
                          {group.attempts.length > 1 && (
                            <Flex align="center" gap={1}>
                              <Icon
                                as={FiRepeat}
                                fontSize="11px"
                                color="#7c3aed"
                              />
                              <Text
                                fontSize="11px"
                                color="#7c3aed"
                                fontWeight={600}
                              >
                                {group.attempts.length} attempts
                              </Text>
                            </Flex>
                          )}
                        </Box>
                        <Box textAlign="right" flexShrink={0}>
                          <Box
                            px={3}
                            py={1}
                            bg={pctBg(pct)}
                            borderRadius="full"
                          >
                            <Text
                              fontSize="16px"
                              fontWeight={900}
                              color={pctColor(pct)}
                              letterSpacing="-0.5px"
                            >
                              {pct}%
                            </Text>
                          </Box>
                          <Text
                            fontSize="10px"
                            color="#94a3b8"
                            mt={1}
                            fontWeight={600}
                          >
                            {pctLabel(pct)}
                          </Text>
                        </Box>
                      </Flex>

                      {/* Mini donut + stats */}
                      <Flex align="center" gap={4} mb={3}>
                        <Box w="48px" h="48px" flexShrink={0}>
                          <MiniDonut
                            correct={correct}
                            wrong={wrong}
                            skipped={skip}
                          />
                        </Box>
                        <Grid templateColumns="repeat(3,1fr)" flex={1} gap={2}>
                          {[
                            {
                              icon: FiCheckCircle,
                              val: correct,
                              color: "#16a34a",
                              label: "Right",
                            },
                            {
                              icon: FiXCircle,
                              val: wrong,
                              color: "#ef4444",
                              label: "Wrong",
                            },
                            {
                              icon: FiAlertCircle,
                              val: skip,
                              color: "#94a3b8",
                              label: "Skip",
                            },
                          ].map((s) => (
                            <Box key={s.label} textAlign="center">
                              <Text
                                fontSize="16px"
                                fontWeight={800}
                                color={s.color}
                                lineHeight="1"
                              >
                                {s.val}
                              </Text>
                              <Text
                                fontSize="10px"
                                color="#94a3b8"
                                fontWeight={600}
                              >
                                {s.label}
                              </Text>
                            </Box>
                          ))}
                        </Grid>
                      </Flex>

                      <Flex
                        justify="space-between"
                        align="center"
                        pt={3}
                        borderTop="1px solid #f1f5f9"
                      >
                        <Flex align="center" gap={1.5}>
                          <Icon
                            as={FiCalendar}
                            fontSize="11px"
                            color="#94a3b8"
                          />
                          <Text fontSize="11px" color="#94a3b8">
                            {fmtDate(best.createdAt)}
                          </Text>
                        </Flex>
                        <Text fontSize="11px" color="#4a72b8" fontWeight={700}>
                          View Details →
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                );
              })}
            </Grid>

            {grouped.length > 6 && (
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
                  {showAll ? "Show Less" : `View All ${grouped.length} Tests`}
                </Button>
              </Flex>
            )}
          </>
        )}
      </Box>

      {/* Detail Modal */}
      {selected && (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="xl"
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay backdropFilter="blur(4px)" bg="rgba(0,0,0,.5)" />
          <ModalContent
            borderRadius="20px"
            fontFamily="'Sora',sans-serif"
            mx={4}
            overflow="hidden"
          >
            {/* Header */}
            <Box
              bg="linear-gradient(135deg, #0f1e3a, #2d5fa8)"
              px={6}
              pt={6}
              pb={5}
            >
              <ModalCloseButton color="white" top={4} right={4} />
              <Flex align="center" gap={3}>
                <Box
                  w="44px"
                  h="44px"
                  bg="rgba(255,255,255,.12)"
                  borderRadius="12px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="20px"
                  flexShrink={0}
                >
                  📋
                </Box>
                <Box flex={1} minW={0}>
                  <Text
                    fontSize="16px"
                    fontWeight={800}
                    color="white"
                    noOfLines={2}
                    lineHeight="1.3"
                  >
                    {selected.title}
                  </Text>
                  <Flex align="center" gap={3} mt={1}>
                    <Text fontSize="12px" color="rgba(255,255,255,.6)">
                      {selected.attempts.length} attempt
                      {selected.attempts.length !== 1 ? "s" : ""}
                    </Text>
                    <Box
                      w="4px"
                      h="4px"
                      bg="rgba(255,255,255,.3)"
                      borderRadius="full"
                    />
                    <Text fontSize="12px" color="rgba(255,255,255,.6)">
                      Best: {selected.best.percentage ?? 0}%
                    </Text>
                  </Flex>
                </Box>
              </Flex>

              {/* Best score highlight */}
              <Flex
                mt={4}
                bg="rgba(255,255,255,.08)"
                borderRadius="12px"
                p={3}
                align="center"
                gap={4}
                border="1px solid rgba(255,255,255,.1)"
              >
                <Flex
                  w="40px"
                  h="40px"
                  bg="rgba(255,215,0,.2)"
                  borderRadius="full"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon as={FaMedal} color="gold" fontSize="18px" />
                </Flex>
                <Box>
                  <Text
                    fontSize="11px"
                    color="rgba(255,255,255,.5)"
                    fontWeight={600}
                    textTransform="uppercase"
                    letterSpacing=".8px"
                  >
                    Best Score
                  </Text>
                  <Text
                    fontSize="22px"
                    fontWeight={900}
                    color="white"
                    letterSpacing="-1px"
                    lineHeight="1"
                  >
                    {selected.best.percentage ?? 0}%
                  </Text>
                </Box>
                <Box ml="auto">
                  <Text fontSize="11px" color="rgba(255,255,255,.5)">
                    {fmtDate(selected.best.createdAt)}
                  </Text>
                </Box>
              </Flex>
            </Box>

            <ModalBody py={5} px={5}>
              <Text
                fontSize="11px"
                fontWeight={800}
                color="#94a3b8"
                textTransform="uppercase"
                letterSpacing="2px"
                mb={3}
              >
                All Attempts ({selected.attempts.length})
              </Text>

              <VStack spacing={3} align="stretch">
                {selected.attempts.map((attempt, idx) => {
                  const pct = attempt.percentage ?? 0;
                  const correct =
                    attempt.correctQus?.length ?? attempt.score ?? 0;
                  const wrong = attempt.wrongAnswers ?? 0;
                  const skip = attempt.notAnsweredQus?.length ?? 0;
                  const isBest = attempt._id === selected.best._id;
                  const isExpanded = expandedAttempt === idx;

                  return (
                    <Box
                      key={attempt._id}
                      bg={isBest ? "#f8faff" : "#f8fafc"}
                      borderRadius="14px"
                      border="1.5px solid"
                      borderColor={isBest ? "#bfdbfe" : "#e2e8f0"}
                      overflow="hidden"
                    >
                      {/* Attempt row */}
                      <Flex
                        align="center"
                        px={4}
                        py={3}
                        gap={3}
                        cursor="pointer"
                        onClick={() =>
                          setExpandedAttempt(isExpanded ? null : idx)
                        }
                        _hover={{ bg: isBest ? "#eff6ff" : "#f1f5f9" }}
                        transition="background .15s"
                      >
                        {/* Rank badge */}
                        <Flex
                          w="32px"
                          h="32px"
                          borderRadius="full"
                          bg={
                            idx === 0
                              ? isBest
                                ? "gold"
                                : "#e2e8f0"
                              : "#f1f5f9"
                          }
                          align="center"
                          justify="center"
                          flexShrink={0}
                        >
                          <Text
                            fontSize="12px"
                            fontWeight={800}
                            color={
                              idx === 0
                                ? isBest
                                  ? "#0f172a"
                                  : "#64748b"
                                : "#94a3b8"
                            }
                          >
                            {isBest ? "🥇" : `#${idx + 1}`}
                          </Text>
                        </Flex>

                        <Box flex={1} minW={0}>
                          <Flex align="center" gap={2} mb={0.5}>
                            <Text
                              fontSize="13px"
                              fontWeight={700}
                              color="#0f172a"
                            >
                              Attempt {selected.attempts.length - idx}
                            </Text>
                            {isBest && (
                              <Badge
                                px={2}
                                py={0.5}
                                borderRadius="full"
                                bg="#eff6ff"
                                color="#2563eb"
                                fontSize="10px"
                                fontWeight={700}
                              >
                                Best
                              </Badge>
                            )}
                          </Flex>
                          <Text fontSize="11px" color="#94a3b8">
                            {fmtDate(attempt.createdAt)} ·{" "}
                            {fmtTime(attempt.timeTaken)}
                          </Text>
                        </Box>

                        <Box
                          px={3}
                          py={1}
                          bg={pctBg(pct)}
                          borderRadius="full"
                          flexShrink={0}
                        >
                          <Text
                            fontSize="14px"
                            fontWeight={900}
                            color={pctColor(pct)}
                          >
                            {pct}%
                          </Text>
                        </Box>

                        <Icon
                          as={isExpanded ? FaChevronUp : FaChevronDown}
                          fontSize="11px"
                          color="#94a3b8"
                          flexShrink={0}
                        />
                      </Flex>

                      {/* Expanded details */}
                      {isExpanded && (
                        <Box
                          px={4}
                          pb={4}
                          borderTop="1px solid"
                          borderColor={isBest ? "#dbeafe" : "#e2e8f0"}
                        >
                          <Grid
                            templateColumns="repeat(4,1fr)"
                            gap={3}
                            mt={3}
                            mb={4}
                          >
                            {[
                              {
                                label: "Correct",
                                value: correct,
                                color: "#16a34a",
                                bg: "#f0fdf4",
                              },
                              {
                                label: "Wrong",
                                value: wrong,
                                color: "#ef4444",
                                bg: "#fef2f2",
                              },
                              {
                                label: "Skipped",
                                value: skip,
                                color: "#64748b",
                                bg: "#f8fafc",
                              },
                              {
                                label: "Percentile",
                                value:
                                  attempt.percentile != null
                                    ? `${attempt.percentile}%`
                                    : "—",
                                color: "#7c3aed",
                                bg: "#f5f3ff",
                              },
                            ].map((s) => (
                              <Box
                                key={s.label}
                                bg={s.bg}
                                borderRadius="10px"
                                p={3}
                                textAlign="center"
                              >
                                <Text
                                  fontSize="18px"
                                  fontWeight={900}
                                  color={s.color}
                                  lineHeight="1"
                                >
                                  {s.value}
                                </Text>
                                <Text
                                  fontSize="10px"
                                  color={s.color}
                                  opacity={0.7}
                                  fontWeight={700}
                                  textTransform="uppercase"
                                  mt={0.5}
                                >
                                  {s.label}
                                </Text>
                              </Box>
                            ))}
                          </Grid>

                          <Flex gap={2} flexWrap="wrap">
                            <Button
                              size="sm"
                              h="34px"
                              bg="#0f1e3a"
                              color="white"
                              fontWeight={700}
                              fontSize="12px"
                              borderRadius="8px"
                              leftIcon={<Icon as={FaPlay} fontSize="10px" />}
                              onClick={() => handleReattempt(selected.testId)}
                              _hover={{ bg: "#1e3a5f" }}
                            >
                              Reattempt
                            </Button>
                          </Flex>
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </VStack>
            </ModalBody>

            <ModalFooter borderTop="1px solid #f1f5f9" gap={3} pt={4}>
              <Button
                variant="ghost"
                onClick={onClose}
                fontWeight={600}
                borderRadius="9px"
                color="#64748b"
              >
                Close
              </Button>
              <Button
                bg="#0f1e3a"
                color="white"
                fontWeight={700}
                borderRadius="9px"
                fontSize="13px"
                leftIcon={<Icon as={FaPlay} fontSize="11px" />}
                onClick={() => handleReattempt(selected.testId)}
                _hover={{ bg: "#1e3a5f" }}
              >
                Reattempt Test
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};

export default UserTestDataList;