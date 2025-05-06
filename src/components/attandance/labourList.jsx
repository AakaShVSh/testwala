// import React, { useState, useEffect } from "react";
// import {
//   ChakraProvider,
//   Box,
//   Heading,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Container,
//   Text,
//   Badge,
//   Select,
//   Input,
//   Button,
//   VStack,
//   Stack,
//   useToast,
//   extendTheme,
//   ThemeProvider,
//   Flex,
//   HStack,
// } from "@chakra-ui/react";

// const theme = extendTheme({
//   fonts: {
//     heading: "Poppins, sans-serif",
//     body: "Inter, sans-serif",
//   },
//   styles: {
//     global: {
//       body: {
//         bg: "gray.50",
//       },
//     },
//   },
// });

// const stations = ["Nalasopara", "Virar", "Vasai Road", "Naigaon", "Bhayandar"];

// const contractors = {
//   rajendra: {
//     username: "rajendra",
//     workers: ["Chotu", "Jaysingh", "Dharam Raj", "Jinku", "Jitender"],
//   },
//   satyam: {
//     username: "satyam",
//     workers: ["Ramesh", "Suresh", "Mahesh", "Naresh"],
//   },
// };

// const downloadCSV = (data, filename = "attendance.csv") => {
//   const headers = ["Date", "Name", "Site", "Status", "Duration"];
//   const csvRows = [
//     headers.join(","),
//     ...data.map((row) =>
//       [row.date, row.name, row.site, row.status, row.duration].join(",")
//     ),
//   ];
//   const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = filename;
//   a.click();
//   URL.revokeObjectURL(url);
// };

// const LabourList = () => {
//   const [loggedInUser, setLoggedInUser] = useState(null);
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [form, setForm] = useState({
//     date: new Date().toISOString().split("T")[0],
//     name: "",
//     site: "",
//     status: "Present",
//     duration: "1",
//   });
//   const [filters, setFilters] = useState({
//     name: "",
//     date: "",
//     site: "",
//     status: "",
//   });
//   const toast = useToast();

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
//     if (storedUser) setLoggedInUser(storedUser);
//   }, []);

//   const handleLogin = (contractor) => {
//     localStorage.setItem(
//       "loggedInUser",
//       JSON.stringify(contractors[contractor])
//     );
//     setLoggedInUser(contractors[contractor]);
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     const { name, site, duration } = form;
//     if (!name || !site || !duration) {
//       toast({
//         title: "Please fill all fields.",
//         status: "warning",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }
//     const duplicate = attendanceData.find(
//       (entry) => entry.name === name && entry.date === form.date
//     );
//     if (duplicate) {
//       toast({
//         title: "Already marked for today.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//       return;
//     }
//     try {
//       await fetch(
//         "https://script.google.com/macros/s/AKfycbznXXrrqMnq7XPN7LzP20e_ETkrE2xkJgXRiETIOto6_HRsjOB5TleKHWzp35ePvLps/exec",
//         {
//           method: "POST",
//           mode: "no-cors",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(form),
//         }
//       );
//       setAttendanceData((prev) => [...prev, form]);
//       toast({
//         title: "Submitted!",
//         status: "success",
//         duration: 2000,
//         isClosable: true,
//       });
//       setForm({
//         name: "",
//         site: "",
//         status: "Present",
//         date: new Date().toISOString().split("T")[0],
//         duration: "1",
//       });
//     } catch (error) {
//       console.error("Submit failed", error);
//       toast({
//         title: "Failed to submit.",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   useEffect(() => {
//     fetch(
//       "https://script.google.com/macros/s/AKfycbznXXrrqMnq7XPN7LzP20e_ETkrE2xkJgXRiETIOto6_HRsjOB5TleKHWzp35ePvLps/exec"
//     )
//       .then((res) => res.json())
//       .then((json) => setAttendanceData(json))
//       .catch((err) => console.error("Fetch error", err));
//   }, []);

//   if (!loggedInUser) {
//     return (
//       <ChakraProvider theme={theme}>
//         <Flex
//           minH="100vh"
//           align="center"
//           justify="center"
//           bgGradient="linear(to-tr, blue.400, purple.400)"
//         >
//           <Box bg="white" p={10} rounded="2xl" shadow="2xl" textAlign="center">
//             <Heading mb={6} color="gray.800">
//               Select Contractor
//             </Heading>
//             <VStack spacing={4}>
//               <Button
//                 colorScheme="blue"
//                 size="lg"
//                 w="full"
//                 onClick={() => handleLogin("rajendra")}
//               >
//                 Rajendra
//               </Button>
//               <Button
//                 colorScheme="purple"
//                 size="lg"
//                 w="full"
//                 onClick={() => handleLogin("satyam")}
//               >
//                 Satyam
//               </Button>
//             </VStack>
//           </Box>
//         </Flex>
//       </ChakraProvider>
//     );
//   }

//   const filteredData = attendanceData.filter((record) => {
//     return (
//       loggedInUser.workers.includes(record.name) &&
//       (filters.name === "" || record.name === filters.name) &&
//       (filters.site === "" || record.site === filters.site) &&
//       (filters.date === "" || record.date === filters.date) &&
//       (filters.status === "" || record.status === filters.status)
//     );
//   });

//   return (
//     <ChakraProvider theme={theme}>
//       <Box minH="100vh" bg="gray.50" p={6}>
//         <Container maxW="container.xl">
//           <Box
//             textAlign="center"
//             bgGradient="linear(to-r, blue.500, cyan.400)"
//             p={6}
//             borderRadius="xl"
//             color="white"
//             shadow="lg"
//             mb={8}
//           >
//             <Heading fontSize="3xl">R.K Interior Design</Heading>
//             <Text fontSize="lg">Attendance Management System</Text>
//             <Text mt={1}>
//               Logged in as <b>{loggedInUser.username}</b>
//             </Text>
//           </Box>

//           <Box bg="white" p={6} rounded="xl" shadow="md" mb={6}>
//             <Heading size="md" mb={4}>
//               Mark Attendance
//             </Heading>
//             <HStack spacing={4} flexWrap="wrap">
//               <Select
//                 name="name"
//                 placeholder="Select Name"
//                 value={form.name}
//                 onChange={handleChange}
//                 maxW="200px"
//               >
//                 {loggedInUser.workers.map((worker, i) => (
//                   <option key={i} value={worker}>
//                     {worker}
//                   </option>
//                 ))}
//               </Select>
//               <Select
//                 name="site"
//                 placeholder="Select Site"
//                 value={form.site}
//                 onChange={handleChange}
//                 maxW="200px"
//               >
//                 {stations.map((station, i) => (
//                   <option key={i} value={station}>
//                     {station}
//                   </option>
//                 ))}
//               </Select>
//               <Select
//                 name="status"
//                 value={form.status}
//                 onChange={handleChange}
//                 maxW="150px"
//               >
//                 <option value="Present">Present</option>
//                 <option value="Absent">Absent</option>
//               </Select>
//               <Select
//                 name="duration"
//                 value={form.duration}
//                 onChange={handleChange}
//                 maxW="150px"
//               >
//                 <option value="1">1</option>
//                 <option value="1/2">1/2</option>
//                 <option value="1 1/2">1 1/2</option>
//               </Select>
//               <Button colorScheme="teal" onClick={handleSubmit}>
//                 Submit
//               </Button>
//             </HStack>
//           </Box>

//           <Box bg="white" p={6} rounded="xl" shadow="md" mb={6}>
//             <Heading size="md" mb={4}>
//               Filter Records
//             </Heading>
//             <HStack spacing={4} flexWrap="wrap">
//               <Select
//                 name="name"
//                 placeholder="Filter by Name"
//                 value={filters.name}
//                 onChange={handleFilterChange}
//                 maxW="200px"
//               >
//                 {loggedInUser.workers.map((w, i) => (
//                   <option key={i}>{w}</option>
//                 ))}
//               </Select>
//               <Select
//                 name="site"
//                 placeholder="Filter by Site"
//                 value={filters.site}
//                 onChange={handleFilterChange}
//                 maxW="200px"
//               >
//                 {stations.map((s, i) => (
//                   <option key={i}>{s}</option>
//                 ))}
//               </Select>
//               <Select
//                 name="status"
//                 placeholder="Filter by Status"
//                 value={filters.status}
//                 onChange={handleFilterChange}
//                 maxW="150px"
//               >
//                 <option value="Present">Present</option>
//                 <option value="Absent">Absent</option>
//               </Select>
//               <Input
//                 type="date"
//                 name="date"
//                 value={filters.date}
//                 onChange={handleFilterChange}
//                 maxW="180px"
//               />
//               <Button
//                 colorScheme="blue"
//                 onClick={() =>
//                   downloadCSV(
//                     filteredData,
//                     `${loggedInUser.username}_attendance.csv`
//                   )
//                 }
//               >
//                 Download CSV
//               </Button>
//             </HStack>
//           </Box>

//           <Box bg="white" p={6} rounded="xl" shadow="md">
//             <Heading size="md" mb={4}>
//               Attendance Records
//             </Heading>
//             <Table variant="simple" size="sm">
//               <Thead bg="gray.100">
//                 <Tr>
//                   <Th>Date</Th>
//                   <Th>Name</Th>
//                   <Th>Site</Th>
//                   <Th>Status</Th>
//                   <Th>Duration</Th>
//                 </Tr>
//               </Thead>
//               <Tbody>
//                 {filteredData.map((rec, i) => (
//                   <Tr key={i}>
//                     <Td>{rec.date}</Td>
//                     <Td>{rec.name}</Td>
//                     <Td>{rec.site}</Td>
//                     <Td>
//                       <Badge
//                         colorScheme={rec.status === "Present" ? "green" : "red"}
//                       >
//                         {rec.status}
//                       </Badge>
//                     </Td>
//                     <Td>{rec.duration}</Td>
//                   </Tr>
//                 ))}
//               </Tbody>
//             </Table>
//           </Box>
//         </Container>
//       </Box>
//     </ChakraProvider>
//   );
// };

// export default LabourList;


import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Container,
  Text,
  Badge,
  Select,
  Input,
  Button,
  VStack,
  Stack,
  useToast,
  Divider,
  HStack,
} from "@chakra-ui/react";
import DownloadCSV from "./DownloadCSV";

const USERS = {
  satyam: {
    username: "satyam",
    password: "1234",
    workers: ["Ramesh", "Suresh", "Dinesh", "Lokesh", "Mukesh"],
  },
  rajendra: {
    username: "rajendra",
    password: "85918",
    workers: ["Chotu", "Jaysingh", "Dharam Raj", "Jinku", "Jitender"],
  },
};

const stations = [
  "Nalasopara",
  "Virar",
  "Vasai Road",
  "Naigaon",
  "Bhayandar",
  "Mira Road",
  "Dahisar",
  "Borivali",
  "Kandivali",
  "Malad",
  "Goregaon",
  "Jogeshwari",
  "Andheri",
  "Vile Parle",
  "Santacruz",
  "Khar Road",
  "Bandra",
  "Mahim",
  "Dadar",
  "Elphinstone",
  "Lower Parel",
  "Mahalaxmi",
  "Mumbai Central",
];

const LabourList = () => {
  const toast = useToast();

  const getToday = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0];
  };

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loggedInUser, setLoggedInUser] = useState(() => {
    const saved = localStorage.getItem("loggedInUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [attendanceData, setAttendanceData] = useState([]);
  const [form, setForm] = useState({
    date: getToday(),
    name: "",
    site: "",
    status: "Present",
    duration: "1",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    const user = USERS[loginForm.username.toLowerCase()];
    if (user && user.password === loginForm.password) {
      setLoggedInUser(user);
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      toast({
        title: `Welcome, ${loginForm.username}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Invalid username or password",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setLoggedInUser(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setForm((prev) => ({ ...prev, date: getToday() }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.site || !form.duration) {
      toast({
        title: "Please fill all fields.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const duplicate = attendanceData.find(
      (entry) => entry.name === form.name && entry.date === form.date
    );
    if (duplicate) {
      toast({
        title: "Attendance already marked for this worker today.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbx-FXKkyaSzrZQzTKqJkJ8w9wXLIWW5-bm5P6eWx04bT9yLB884_c0_5b4fDmsXkhhW/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      setAttendanceData((prev) => [...prev, form]);
      toast({
        title: "Attendance submitted!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setForm({
        name: "",
        site: "",
        status: "Present",
        date: getToday(),
        duration: "1",
      });
    } catch (error) {
      console.error("Submit failed", error);
      toast({
        title: "Failed to submit attendance.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
const downloadCSV = (data, filename = "attendance.csv") => {
  const headers = ["Date", "Name", "Site", "Status", "Duration"];
  const csvRows = [
    headers.join(","),
    ...data.map((row) =>
      [row.date, row.name, row.site, row.status, row.duration].join(",")
    ),
  ];
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://script.google.com/macros/s/AKfycbx-FXKkyaSzrZQzTKqJkJ8w9wXLIWW5-bm5P6eWx04bT9yLB884_c0_5b4fDmsXkhhW/exec"
        );
        const json = await res.json();
        setAttendanceData(json);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const workerList = loggedInUser?.workers || [];

  if (!loggedInUser) {
    return (
      <ChakraProvider>
        <Container centerContent py={20}>
          <Box p={8} bg="gray.100" borderRadius="lg" boxShadow="md">
            <Heading size="md" mb={4}>
              Login
            </Heading>
            <VStack spacing={4}>
              <Input
                placeholder="Username"
                name="username"
                value={loginForm.username}
                onChange={handleLoginChange}
              />
              <Input
                placeholder="Password"
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
              />
              <Button colorScheme="teal" w="100%" onClick={handleLogin}>
                Login
              </Button>
            </VStack>
          </Box>
        </Container>
      </ChakraProvider>
    );
  }

  return (
    <ChakraProvider>
      <Box
        textAlign="center"
        py={6}
        bg="teal.500"
        color="white"
        borderRadius="lg"
        mb={6}
        boxShadow="md"
        px={4}
      >
        <HStack justifyContent="space-between" maxW="6xl" mx="auto">
          <Box>
            <Heading size="2xl" textAlign={"left"} fontWeight="bold" mb={2}>
             Hajari Card
            </Heading>
            <Text fontSize="lg" fontWeight="medium">
              Labour Attendance Management System
            </Text>
          </Box>
          <Button size="sm" colorScheme="red" onClick={handleLogout}>
            Logout
          </Button>
        </HStack>
      </Box>

      <Container maxW="container.xl" py={8} px={4}>
        <Box mb={6}>
          <Text fontSize="2xl" fontWeight="600" color="teal.500">
            Labour Attendance Sheet ({loggedInUser.username})
          </Text>
          <Text fontSize="md" color="gray.600">
            Daily attendance entry with work duration
          </Text>
        </Box>

        <Box bg="gray.50" p={4} borderRadius="lg" mb={6} boxShadow="base">
          <VStack spacing={4}>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              w="100%"
            >
              <Select
                placeholder="Select your name"
                name="name"
                value={form.name}    
                onChange={handleChange}
              >
                {workerList.map((worker, idx) => (
                  <option key={idx} value={worker}>
                    {worker}
                  </option>
                ))}
              </Select>

              <Select
                placeholder="Select site"
                name="site"
                value={form.site}
                onChange={handleChange}
              >
                {stations.map((station, idx) => (
                  <option key={idx} value={station}>
                    {station}
                  </option>
                ))}
              </Select>
            </Stack>

            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={4}
              w="100%"
            >
              <Input value={form.date} isReadOnly isDisabled bg="gray.100" />

              <Select name="status" value={form.status} onChange={handleChange}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </Select>

              <Select
                name="duration"
                value={form.duration}
                onChange={handleChange}
              >
                <option value="1">1</option>
                <option value="1/2">1/2</option>
                <option value="1 1/2">1 1/2</option>
              </Select>
            </Stack>

            <Button colorScheme="teal" w="100%" onClick={handleSubmit}>
              Submit Attendance
            </Button>
          </VStack>
        </Box>

        <Divider my={6} />
        <Heading size="md" mb={4}>
          Full Attendance Record
        </Heading>
        <Box mb={6}>
          <Button
            colorScheme="blue"
            onClick={() =>
              downloadCSV(
                attendanceData.filter((entry) =>
                  loggedInUser.workers.includes(entry.name)
                ),
                `${loggedInUser.username}_attendance.csv`
              )
            }
          >
            Download CSV
          </Button>
        </Box>

        {attendanceData.length === 0 ? (
          <Text>No attendance records yet.</Text>
        ) : (
          <Box overflowX={{ base: "auto", md: "visible" }}>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Name</Th>
                  <Th>Site</Th>
                  <Th>Status</Th>
                  <Th>Duration</Th>
                </Tr>
              </Thead>
              <Tbody>
                {attendanceData
                  .filter((record) =>
                    loggedInUser.workers.includes(record.name)
                  )
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((record, index) => (
                    <Tr key={index}>
                      <Td>
                        {new Date(record.date).toISOString().split("T")[0]}
                      </Td>
                      <Td>{record.name}</Td>
                      <Td>{record.site}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            record.status === "Present" ? "green" : "red"
                          }
                        >
                          {record.status}
                        </Badge>
                      </Td>
                      <Td>{record.duration}</Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Container>
    </ChakraProvider>
  );
};

export default LabourList;
