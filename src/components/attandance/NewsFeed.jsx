import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Heading,
  Image,
  Link,
  SimpleGrid,
  Spinner,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchNews = async () => {
    try {
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=pub_8518774f935bc6fcf4019c775e39278d5ae57&country=in&language=en&category=top`
      );
      const data = await response.json();
      console.log("API Response:", data); // Debugging: Log the response

      if (data.status === "success" && data.results) {
        setArticles(data.results);
      } else {
        console.error("Error from API:", data);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openDetail = (news) => {
    setSelectedNews(news);
    onOpen();
  };

  const closeModal = () => {
    setSelectedNews(null);
    onClose();
  };

  return (
    <Box my={10} px={4}>
      <Heading size="lg" mb={6} textAlign="center" color="teal.600">
        📰 Live News Feed (via NewsData.io)
      </Heading>

      {articles.length === 0 ? (
        <Box display="flex" justifyContent="center" py={10}>
          <Spinner size="xl" color="teal.500" />
        </Box>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {articles.slice(0, 12).map((news, idx) => (
            <Box
              key={idx}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="md"
              cursor="pointer"
              _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
              transition="all 0.3s ease"
              onClick={() => openDetail(news)}
            >
              <Image
                src={
                  news.image_url ||
                  "https://via.placeholder.com/300x150?text=No+Image"
                }
                alt={news.title}
                objectFit="cover"
                w="100%"
                h="150px"
              />
              <Box p={4}>
                <Text fontWeight="bold" mb={2} noOfLines={2}>
                  {news.title}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {news.pubDate
                    ? new Date(news.pubDate).toLocaleString()
                    : "No date"}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {/* Modal for Full Article */}
      <Modal isOpen={isOpen} onClose={closeModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedNews?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} pb={4}>
              {selectedNews?.image_url && (
                <Image
                  src={selectedNews.image_url}
                  alt={selectedNews.title}
                  borderRadius="md"
                  maxH="300px"
                  objectFit="cover"
                />
              )}
              <Text fontSize="md">{selectedNews?.description}</Text>
              <Link
                href={selectedNews?.link}
                color="teal.500"
                fontWeight="bold"
                isExternal
              >
                🔗 Read Full Article
              </Link>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default NewsFeed;
