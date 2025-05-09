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
            variant=  {view === "labour" ? "solid" : "outline"}
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





















// // Home.jsx
// import React, { useState } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   Input,
//   Button,
//   Image,
//   VStack,
//   SimpleGrid,
//   Spinner,
// } from "@chakra-ui/react";

// const Home = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [animeList, setAnimeList] = useState([]);
//   const [selectedAnime, setSelectedAnime] = useState(null);
//   const [episodes, setEpisodes] = useState([]);
//   const [streamUrl, setStreamUrl] = useState("");
//   const [loading, setLoading] = useState(false);

//   // 1. Search anime from Kitsu
//   const fetchAnime = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(
//         `https://kitsu.io/api/edge/anime?filter[text]=${searchTerm}&page[limit]=10`
//       );
//       const data = await res.json();
//       setAnimeList(data.data);
//     } catch (err) {
//       console.error("Error fetching anime list:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 2. Fetch episodes from Aniwatch API
//   const fetchAniwatchEpisodes = async (animeTitle) => {
//     try {
//       const res = await fetch(
//         `https://api-consuming-aniwatch.vercel.app/meta/anime/${encodeURIComponent(
//           animeTitle
//         )}`
//       );
//       const data = await res.json();
//       setEpisodes(data.episodes || []);
//     } catch (err) {
//       console.error("Failed to fetch episodes from Aniwatch", err);
//     }
//   };

//   // 3. Play episode in video player
//   const playEpisode = async (episodeId) => {
//     try {
//       const res = await fetch(
//         `https://api-consuming-aniwatch.vercel.app/meta/anime/watch/${episodeId}`
//       );
//       const data = await res.json();
// console.log(data,res);

//       const source1080p = data.sources?.find((src) => src.quality === "1080p");
//       const fallback = data.sources?.[0];

//       setStreamUrl(source1080p?.url || fallback?.url || "");
//     } catch (err) {
//       console.error("Failed to load stream:", err);
//     }
//   };

//   return (
//     <Box>
//       {/* Navbar */}
//       <Flex bg="gray.800" p={4} justify="center">
//         <Text fontSize="2xl" color="white" fontWeight="bold">
//           Anime Streaming with Aniwatch
//         </Text>
//       </Flex>

//       {/* Search Bar */}
//       <Box p={4}>
//         <Flex gap={2} mb={4}>
//           <Input
//             placeholder="Search Anime..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <Button onClick={fetchAnime} colorScheme="blue">
//             Search
//           </Button>
//         </Flex>

//         {/* Search Results */}
//         {loading ? (
//           <Flex justify="center">
//             <Spinner size="xl" />
//           </Flex>
//         ) : (
//           <SimpleGrid columns={[1, 2, 3, 4]} spacing={4}>
//             {animeList.map((anime) => (
//               <VStack
//                 key={anime.id}
//                 p={3}
//                 bg="white"
//                 borderRadius="md"
//                 shadow="md"
//                 cursor="pointer"
//                 onClick={() => {
//                   setSelectedAnime(anime);
//                   fetchAniwatchEpisodes(anime.attributes.canonicalTitle);
//                   setStreamUrl("");
//                 }}
//                 _hover={{ bg: "gray.100" }}
//               >
//                 <Image
//                   src={anime.attributes.posterImage?.small}
//                   alt={anime.attributes.canonicalTitle}
//                   borderRadius="md"
//                 />
//                 <Text fontWeight="bold">{anime.attributes.canonicalTitle}</Text>
//               </VStack>
//             ))}
//           </SimpleGrid>
//         )}
//       </Box>

//       {/* Selected Anime Details */}
//       {selectedAnime && (
//         <Box p={4} bg="gray.50" mt={6}>
//           <Text fontSize="2xl" fontWeight="bold">
//             {selectedAnime.attributes.canonicalTitle}
//           </Text>
//           <Text my={2}>{selectedAnime.attributes.synopsis}</Text>
//           <Text>
//             Rating: {selectedAnime.attributes.averageRating || "Not rated"}
//           </Text>

//           {/* Episode List */}
//           <Box mt={6}>
//             <Text fontSize="xl" fontWeight="semibold" mb={2}>
//               Episodes
//             </Text>
//             <SimpleGrid columns={[1, 2, 3, 4]} spacing={3}>
//               {episodes.map((ep) => (
//                 <Button
//                   key={ep.id}
//                   onClick={() => playEpisode(ep.id)}
//                   colorScheme="teal"
//                 >
//                   Episode {ep.number}
//                 </Button>
//               ))}
//             </SimpleGrid>
//           </Box>

//           {/* Video Player */}
//           {streamUrl && (
//             <Box mt={8}>
//               <Text fontSize="lg" mb={2}>
//                 Now Playing:
//               </Text>
//               <video width="100%" height="auto" controls autoPlay>
//                 <source src={streamUrl} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             </Box>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Home;
