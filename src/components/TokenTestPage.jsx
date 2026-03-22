// import React, { useEffect, useState } from "react";
// import { apiFetch } from "../services/api";
// import {
//   Box,
//   Flex,
//   Text,
//   Spinner,
//   Button,
//   useToast,
//   Icon,
// } from "@chakra-ui/react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";

// export default function TokenTestPage() {
//   const { token } = useParams();
//   const navigate = useNavigate();
//   const toast = useToast();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!token) {
//       setError("Invalid link");
//       setLoading(false);
//       return;
//     }

//     apiFetch(`/tests/token/${token}`)
//       .then((r) => {
//         const test = r.data;
//         if (!test) {
//           setError("Test not found or link expired");
//           setLoading(false);
//           return;
//         }
//         // Redirect to the full test detail page using the test's _id
//         // The TestDetailPage will handle auth check + info page + start
//         navigate(`/tests/${test._id}`, { replace: true });
//       })
//       .catch((e) => {
//         setError(e.message || "Test not found or link expired");
//         setLoading(false);
//       });
//   }, [token, navigate]);

//   if (loading)
//     return (
//       <Flex
//         minH="80vh"
//         align="center"
//         justify="center"
//         direction="column"
//         gap={4}
//         fontFamily="'Sora',sans-serif"
//       >
//         <Spinner size="xl" color="#4a72b8" thickness="4px" />
//         <Text color="#64748b" fontSize="14px">
//           Loading test...
//         </Text>
//       </Flex>
//     );

//   return (
//     <Box textAlign="center" py={20} fontFamily="'Sora',sans-serif">
//       <Text fontSize="48px" mb={4}>
//         🔗
//       </Text>
//       <Text fontSize="18px" fontWeight={700} color="#374151" mb={2}>
//         {error}
//       </Text>
//       <Text fontSize="14px" color="#94a3b8" mb={6}>
//         This test link may have expired or been removed.
//       </Text>
//       <Button
//         leftIcon={<FaArrowLeft />}
//         onClick={() => navigate("/")}
//         bg="#4a72b8"
//         color="white"
//         borderRadius="10px"
//         fontWeight={700}
//         _hover={{ bg: "#3b5fa0" }}
//       >
//         Go Home
//       </Button>
//     </Box>
//   );
// }

/**
 * src/pages/TokenTestPage.jsx
 *
 * Resolves a private-access token → full test object → redirects to
 * TestDetailPage with the token in location state.
 *
 * TestDetailPage then:
 *  1. Skips the password prompt (viaToken: true)
 *  2. Calls testsAPI.startByToken(token) when the student clicks "Start Test"
 *     so the backend can record the conversion (link click → started).
 */
import React, { useEffect, useState } from "react";
import { testsAPI } from "../services/api";
import {
  Box,
  Flex,
  Text,
  Spinner,
  Button,
  Icon,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function TokenTestPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      setError("Invalid link — no token provided.");
      setLoading(false);
      return;
    }

    testsAPI
      .getByToken(token)
      .then((r) => {
        const test = r.data ?? r;
        if (!test?._id) {
          setError("Test not found or this link has expired.");
          setLoading(false);
          return;
        }

        // Use the test's _id as the URL param so TestDetailPage can load it.
        // Prefer slug for pretty URLs; fall back to _id.
        const slug = test.slug || test._id;

        navigate(`/tests/${slug}`, {
          replace: true,
          state: {
            // Signals TestDetailPage to skip the password modal
            viaToken: true,
            // Stored so launchTest() can call testsAPI.startByToken(token)
            accessToken: token,
          },
        });
      })
      .catch((e) => {
        setError(e.message || "Test not found or this link has expired.");
        setLoading(false);
      });
  }, [token, navigate]);

  if (loading)
    return (
      <Flex
        minH="80vh"
        align="center"
        justify="center"
        direction="column"
        gap={4}
        fontFamily="'Sora', sans-serif"
      >
        <Spinner size="xl" color="#4a72b8" thickness="4px" />
        <Text color="#64748b" fontSize="14px">
          Loading test…
        </Text>
      </Flex>
    );

  return (
    <Box
      textAlign="center"
      py={20}
      px={6}
      fontFamily="'Sora', sans-serif"
    >
      <Text fontSize="52px" mb={4} lineHeight="1">
        🔗
      </Text>
      <Text
        fontSize={{ base: "18px", md: "20px" }}
        fontWeight={700}
        color="#374151"
        mb={2}
      >
        {error}
      </Text>
      <Text fontSize="14px" color="#94a3b8" mb={8} maxW="360px" mx="auto">
        The test link may have expired or been removed by the creator.
        Contact your coaching centre for a new link.
      </Text>
      <Button
        leftIcon={<Icon as={FaArrowLeft} fontSize="12px" />}
        onClick={() => navigate("/")}
        bg="#4a72b8"
        color="white"
        borderRadius="10px"
        h="46px"
        px={6}
        fontWeight={700}
        _hover={{ bg: "#3b5fa0" }}
      >
        Go Home
      </Button>
    </Box>
  );
}