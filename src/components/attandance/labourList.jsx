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
  rohit: {
    username: "rohit",
    password: "1234",
    workers: ["Aman", "Vikas", "Tarun", "Sonu", "Monu"],
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
    amount: "",
  });

  const parseDuration = (str) => {
    if (!str) return 0;
    if (typeof str === "number") return str;
    str = String(str).trim();
    if (str.includes(" ")) {
      const [whole, fraction] = str.split(" ");
      const [num, denom] = fraction.split("/");
      return parseInt(whole) + parseFloat(num) / parseFloat(denom);
    } else if (str.includes("/")) {
      const [num, denom] = str.split("/");
      return parseFloat(num) / parseFloat(denom);
    } else {
      return parseFloat(str);
    }
  };

  const convertDurationToNumber = (str) => {
    switch (str) {
      case "1":
        return 1;
      case "1/2":
        return 0.5;
      case "1 1/2":
        return 1.5;
      case "2":
        return 2;
      default:
        return parseDuration(str);
    }
  };

  const totalDays = attendanceData
    .filter((d) => d.status === "Present")
    .reduce((sum, curr) => sum + convertDurationToNumber(curr.duration), 0);

  const totalSalary = attendanceData.reduce(
    (acc, curr) => acc + Number(curr.amount || 0),
    0
  );

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

    if (name === "status") {
      if (value === "Absent") {
        setForm((prev) => ({
          ...prev,
          status: value,
          amount: "0",
          duration: "0",
          site: "None",
        }));
      } else {
        setForm((prev) => ({
          ...prev,
          status: value,
          amount: "",
          duration: "1",
          site: "",
        }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  

  const handleSubmit = async () => {
    if (!form.name || !form.status) {
      toast({
        title: "Please fill name and status.",
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
        "https://script.google.com/macros/s/AKfycby4PByNnvrsxh5wElvwFdT3N2jBbVOGihpX1UnGEucQc4QZ73MiR2pVczfkWnslwNOk/exec",
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
        amount: "",
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
  const fetchWorkerData = async (workerName) => {
    try {
      const res = await fetch(
        "https://script.google.com/macros/s/AKfycbzsxUojI55ojgr7WK5AsgWanarZlkb5GMJ25QVESvtSoXTC-ytyndHJEZh86ujLqc8W/exec"
      );
      const data = await res.json();

      // Sanitize duration and amount fields
      const workerData = data
        .filter((entry) => entry.name === workerName)
        .map((entry) => ({
          ...entry,
          duration: entry.duration, // Force as string to prevent "1/2" issues
          amount: String(entry.amount || "0"), // Default empty amounts to 0
        }));

      console.log(workerData);
      setAttendanceData(workerData);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };
  

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
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => {
              window.open("https://your-app-download-link.com", "_blank");
            }}
          >
            Download App
          </Button>
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
                onChange={(e) => {
                  const selected = e.target.value;
                  setForm((prev) => ({ ...prev, name: selected }));
                  fetchWorkerData(selected);
                }}
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
                disabled={form.status === "Absent"}
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
                placeholder="Enter Duration"
                value={form.duration}
                disabled={form.status === "Absent"}
                onChange={handleChange}
              >
                <option value="1">1</option>
                <option value="0.5">1 / 2</option>
                <option value="1.5">1 1/2</option>
                <option value="2">2</option>
              </Select>

              <Input
                name="amount"
                type="number"
                placeholder="Enter salary"
                value={form.amount}
                onChange={handleChange}
                // disabled={form.status === "Absent"}
              />
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
          <DownloadCSV filteredData={attendanceData} />
        </Box>

        {attendanceData.length === 0 ? (
          <Text>No attendance records yet.</Text>
        ) : (
          <Box overflowX={{ base: "auto", md: "visible" }}>
            <Box mb={4}>
              <Text fontSize="lg">
                Total Duration Worked: <strong>{totalDays} hours</strong>
              </Text>
              <Text fontSize="lg">
                Total Salary: <strong>₹{totalSalary}</strong>
              </Text>
            </Box>

            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Date</Th>
                  <Th>Name</Th>
                  <Th>Site</Th>
                  <Th>Status</Th>
                  <Th>Duration</Th>
                  <Th>Amount</Th>
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
                      <Td>
                        {record.duration === "0.5" ? (
                          "1 / 2"
                        ) : (
                          <>
                            {record.duration === "1.5" ? (
                              "1 1/2"
                            ) : (
                              <>{record.duration}</>
                            )}
                          </>
                        )}
                      </Td>
                      <Td>{record.amount}</Td>
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
