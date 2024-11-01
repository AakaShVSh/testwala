import { Box, Text, Flex, Image } from "@chakra-ui/react";
import { RiFeedbackFill } from "react-icons/ri";
import { useState, useEffect } from "react";

const FeedbackSlideshow = () => {
  // Array of feedback messages with background colors and images
  const feedbacks = [
    {
      text: "The service was amazing, will definitely come back!",
      bg: "teal.500",
      img: "data:image/jpeg;base64,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",
    },
    {
      text: "Great experience, highly recommend!",
      bg: "purple.500",
      img: "data:image/jpeg;base64,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",
    },
    {
      text: "Friendly staff and excellent customer support. The way they handled my requests was extremely professional.",
      bg: "orange.400",
      img: "data:image/jpeg;base64,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",
    },
    
  ];

  const [currentFeedback, setCurrentFeedback] = useState(0);
  const feedbackCount = feedbacks.length;
  const autoSlideInterval = 3000; // Auto-slide every 3 seconds

  const nextFeedback = () => {
    setCurrentFeedback((prev) => (prev === feedbackCount - 1 ? 0 : prev + 1));
  };

  const prevFeedback = () => {
    setCurrentFeedback((prev) => (prev === 0 ? feedbackCount - 1 : prev - 1));
  };

  // Auto-slide functionality
  useEffect(() => {
    const slideInterval = setInterval(nextFeedback, autoSlideInterval);
    return () => clearInterval(slideInterval); // Cleanup interval on component unmount
  }, [currentFeedback]);

  // Function to get feedback index based on the current index and offset
  const getFeedbackIndex = (offset) => {
    let index = (currentFeedback + offset + feedbackCount) % feedbackCount;
    return index;
  };

  return (
    <Flex
      direction="row"
      alignItems="center"
      justifyContent="center"
      w="100%"
      maxW="800px"
      mx="auto"
      h="350px"
      p={5}
      position="relative"
      overflow="hidden"
    >
      {/* Left Side Feedback */}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        w="30%"
        h="80%"
        mx={2}
        bg={feedbacks[getFeedbackIndex(-1)].bg} // Previous feedback background
        borderRadius="md"
        boxShadow="lg"
        p={4}
        opacity={0.7} // Slightly faded effect for side feedback
        position="relative"
        transition="background-color 0.5s ease-in-out"
      >
        <Image
          src={feedbacks[getFeedbackIndex(-1)].img}
          alt="Feedback"
          borderRadius="md"
          mb={4}
          w="80%"
        />
        <Text fontSize="md" textAlign="center" noOfLines={3} color="white">
          {feedbacks[getFeedbackIndex(-1)].text}
        </Text>
      </Flex>

      {/* Center Feedback */}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        w="30%"
        h="100%"
        mx={2}
        bg={feedbacks[getFeedbackIndex(0)].bg} // Current feedback background
        borderRadius="md"
        boxShadow="2xl"
        p={6}
        position="relative"
        transition="background-color 0.5s ease-in-out"
      >
        {/* Feedback Icon at the Top Left */}
        <Box
          position="absolute"
          top="-20px"
          left="-20px"
          bg="white"
          p={3}
          borderRadius="full"
          border="4px solid"
          borderColor={feedbacks[currentFeedback].bg}
        >
          <RiFeedbackFill size={30} color={feedbacks[currentFeedback].bg} />
        </Box>

        <Image
          src={feedbacks[getFeedbackIndex(0)].img}
          alt="Feedback"
          borderRadius="md"
          mb={4}
        //   mt={-50}
          w="80%"
        />
        <Text
          fontSize="lg"
          fontWeight="bold"
          textAlign="center"
          noOfLines={3}
          color="white"
        >
          {feedbacks[currentFeedback].text}
        </Text>
      </Flex>

      {/* Right Side Feedback */}
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        w="30%"
        h="80%"
        mx={2}
        bg={feedbacks[getFeedbackIndex(1)].bg} // Next feedback background
        borderRadius="md"
        boxShadow="lg"
        p={4}
        opacity={0.7} // Slightly faded effect for side feedback
        position="relative"
        transition="background-color 0.5s ease-in-out"
      >
        <Image
          src={feedbacks[getFeedbackIndex(1)].img}
          alt="Feedback"
          borderRadius="md"
          mb={4}
          w="80%"
        />
        <Text fontSize="md" textAlign="center" noOfLines={3} color="white">
          {feedbacks[getFeedbackIndex(1)].text}
        </Text>
      </Flex>
    </Flex>
  );
};

export default FeedbackSlideshow;
