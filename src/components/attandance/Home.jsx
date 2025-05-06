import React, { useState } from "react";
import LabourList from "./labourList";
import NewsFeed from "./NewsFeed";
import { Box, Flex, Button, Text } from "@chakra-ui/react";

const Home = () => {
  const [view, setView] = useState("labour");

  return (
    <Box>
      {/* Navigation Bar */}
      <Flex
        bg="gray.800"
        p={4}
        color="white"
        justify="space-between"
        align="center"
      >
        <Text fontSize="xl" fontWeight="bold">
          Attendance Dashboard
        </Text>
        <Flex gap={4}>
          <Button
            variant={view === "labour" ? "solid" : "outline"}
            colorScheme="blue"
            onClick={() => setView("labour")}
          >
            Labour List
          </Button>
          <Button
            variant={view === "news" ? "solid" : "outline"}
            colorScheme="green"
            onClick={() => setView("news")}
          >
            News Feed
          </Button>
        </Flex>
      </Flex>

      {/* Main Content */}
      <Box p={4}>
        {view === "labour" && <LabourList />}
        {view === "news" && <NewsFeed />}
      </Box>
    </Box>
  );
};

export default Home;
