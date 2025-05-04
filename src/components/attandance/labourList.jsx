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
  HStack,
  Stack,
  useToast,
  Divider,
} from "@chakra-ui/react";

// Site stations
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

// Worker list
const workerList = [
  "Chotu",
  "Jaysingh",
  "Dharam Raj",
  "Jinku",
  "Jitender"
];

const LabourList = () => {
  const getToday = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().split("T")[0];
  };


  const [attendanceData, setAttendanceData] = useState([]);
  const [form, setForm] = useState({
    date: getToday(),
    name: "",
    site: "",
    status: "Present",
    duration: "1",
  });

  const toast = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setForm((prev) => ({ ...prev, date: getToday() }));
    }, 60 * 1000);
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
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbx-FXKkyaSzrZQzTKqJkJ8w9wXLIWW5-bm5P6eWx04bT9yLB884_c0_5b4fDmsXkhhW/exec",
      {
        method: "POST",
        mode: "no-cors", // for Google Apps Script
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );
console.log(response,form);
    setAttendanceData((prev) => [...prev, form]);

    toast({
      title: "Attendance submitted to sheet!",
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

useEffect(() => {
  const fetchSheetData = async () => {
    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbx-FXKkyaSzrZQzTKqJkJ8w9wXLIWW5-bm5P6eWx04bT9yLB884_c0_5b4fDmsXkhhW/exec"
      );
      const json = await response.json();
      setAttendanceData(json);
      console.log(response,json);
      
    } catch (error) {
      console.error("Failed to fetch attendance from sheet", error);
    }
  };

  fetchSheetData();
}, []);
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
        <Heading size="2xl" fontWeight="bold" mb={2}>
          R.K Interior Design
        </Heading>
        <Text fontSize="lg" fontWeight="medium">
          Labour Attendance Management System
        </Text>
      </Box>

      <Container maxW="container.xl" py={8} px={4}>
        <Box mb={6}>
          <Text fontSize="2xl" fontWeight="600" size="xl" color="teal.500">
            Labour Attendance Sheet
          </Text>
          <Text fontSize="md" color="gray.600">
            Daily attendance entry with work duration
          </Text>
        </Box>

        {/* Attendance Form */}
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
                {workerList.map((worker, index) => (
                  <option key={index} value={worker}>
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
                {stations.map((station, index) => (
                  <option key={index} value={station}>
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
              <Input
                type="text"
                value={form.date}
                isReadOnly
                isDisabled
                bg="gray.100"
              />

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

            <Button colorScheme="teal" onClick={handleSubmit} w="100%">
              Submit Attendance
            </Button>
          </VStack>
        </Box>

        {/* Divider and Attendance Table */}
        <Divider my={6} />
        <Heading size="md" mb={4}>
          Full Attendance Record
        </Heading>

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
// https://script.google.com/macros/s/AKfycbxAM3hzp1K2Ttp9_4eNlYVS6zHXzilKD5pBRXH5ufnw3akDkejSfjy_8ynVhHOMqWPP/exec