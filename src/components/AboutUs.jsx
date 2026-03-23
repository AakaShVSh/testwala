import React from "react";
import { Box, Flex, Text, Icon, Grid } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaBullseye,
  FaHeart,
  FaUsers,
  FaRocket,
  FaShieldAlt,
  FaArrowLeft,
} from "react-icons/fa";
import { MdQuiz, MdSchool } from "react-icons/md";

const TEAM = [
  {
    name: "Rahul Sharma",
    role: "Founder & CEO",
    emoji: "👨‍💻",
    desc: "IIT Delhi graduate passionate about democratising education for every Indian student.",
  },
  {
    name: "Priya Verma",
    role: "Head of Content",
    emoji: "📚",
    desc: "Former SSC topper with 5 years of coaching experience across Bihar and UP.",
  },
  {
    name: "Arjun Mehta",
    role: "Lead Engineer",
    emoji: "⚙️",
    desc: "Full-stack developer who built the adaptive testing engine from scratch.",
  },
  {
    name: "Divya Singh",
    role: "Community Manager",
    emoji: "🌟",
    desc: "Connects thousands of students with the right coaching centres across India.",
  },
];

const VALUES = [
  {
    icon: FaBullseye,
    title: "Mission First",
    desc: "Every feature we build serves one goal — helping students crack their dream exam.",
    color: "#4a72b8",
    bg: "#eff6ff",
  },
  {
    icon: FaHeart,
    title: "Student-Centric",
    desc: "Built by students, for students. We know the struggle because we lived it.",
    color: "#e11d48",
    bg: "#fff1f2",
  },
  {
    icon: FaShieldAlt,
    title: "Trust & Integrity",
    desc: "No fake rankings, no paid promotions. Every coaching on our platform is verified.",
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    icon: FaRocket,
    title: "Constant Growth",
    desc: "We ship improvements every week based on real feedback from our community.",
    color: "#d97706",
    bg: "#fffbeb",
  },
];

const STATS = [
  { num: "50,000+", label: "Students" },
  { num: "800+", label: "Coaching Centres" },
  { num: "2M+", label: "Tests Taken" },
  { num: "95%", label: "Pass Rate" },
];

export default function AboutUs() {
  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora', sans-serif">
      {/* ── Hero ── */}
      <Box
        bg="linear-gradient(135deg,#0f1e3a 0%,#1e3a5f 50%,#2d5fa8 100%)"
        px={{ base: 5, md: 10 }}
        pt={{ base: 10, md: 16 }}
        pb={{ base: 12, md: 20 }}
        position="relative"
        overflow="hidden"
      >
        {/* decorative circles */}
        <Box
          position="absolute"
          top="-60px"
          right="-60px"
          w="280px"
          h="280px"
          borderRadius="full"
          bg="rgba(255,255,255,.04)"
        />
        <Box
          position="absolute"
          bottom="-40px"
          left="10%"
          w="160px"
          h="160px"
          borderRadius="full"
          bg="rgba(74,114,184,.15)"
        />

        <Box maxW="780px" mx="auto" position="relative">
          <Link to="/">
            <Flex
              align="center"
              gap={2}
              color="rgba(255,255,255,.45)"
              _hover={{ color: "rgba(255,255,255,.8)" }}
              w="fit-content"
              mb={8}
              transition="color .2s"
            >
              <Icon as={FaArrowLeft} fontSize="12px" />
              <Text fontSize="13px" fontWeight={600}>
                Back to Home
              </Text>
            </Flex>
          </Link>

          <Flex
            w="60px"
            h="60px"
            bg="rgba(255,255,255,.1)"
            border="1.5px solid rgba(255,255,255,.15)"
            borderRadius="16px"
            align="center"
            justify="center"
            mb={5}
          >
            <Icon as={FaGraduationCap} color="white" fontSize="26px" />
          </Flex>

          <Text
            fontSize={{ base: "32px", md: "52px" }}
            fontWeight={900}
            color="white"
            letterSpacing="-1.5px"
            lineHeight={1.1}
            mb={4}
          >
            We're on a mission to
            <br />
            <Text as="span" color="#7eb3f7">
              level the playing field
            </Text>
          </Text>
          <Text
            fontSize={{ base: "15px", md: "17px" }}
            color="rgba(255,255,255,.6)"
            maxW="560px"
            lineHeight={1.7}
          >
            TestWala was born from a simple belief — every student in India
            deserves access to quality mock tests and coaching, regardless of
            where they live or how much they earn.
          </Text>
        </Box>
      </Box>

      {/* ── Stats strip ── */}
      <Box
        bg="white"
        borderBottom="1px solid #e2e8f0"
        py={6}
        px={{ base: 5, md: 10 }}
      >
        <Flex
          maxW="780px"
          mx="auto"
          justify="space-around"
          flexWrap="wrap"
          gap={6}
        >
          {STATS.map((s) => (
            <Box key={s.label} textAlign="center">
              <Text
                fontSize={{ base: "26px", md: "34px" }}
                fontWeight={900}
                color="#0f1e3a"
                letterSpacing="-1px"
              >
                {s.num}
              </Text>
              <Text
                fontSize="12px"
                color="#64748b"
                fontWeight={600}
                textTransform="uppercase"
                letterSpacing=".8px"
              >
                {s.label}
              </Text>
            </Box>
          ))}
        </Flex>
      </Box>

      <Box
        maxW="780px"
        mx="auto"
        px={{ base: 5, md: 10 }}
        py={{ base: 10, md: 16 }}
      >
        {/* ── Story ── */}
        <Box mb={14}>
          <Text
            fontSize="11px"
            fontWeight={800}
            color="#4a72b8"
            textTransform="uppercase"
            letterSpacing="2px"
            mb={3}
          >
            Our Story
          </Text>
          <Text
            fontSize={{ base: "22px", md: "28px" }}
            fontWeight={800}
            color="#0f172a"
            letterSpacing="-0.5px"
            mb={5}
          >
            Started from a hostel room in 2022
          </Text>
          <Flex direction="column" gap={4}>
            {[
              "Our founder Rahul was preparing for SSC CGL in a small town in Jharkhand. He had the drive but not the resources — coaching fees were out of reach, and quality mock tests online were either too expensive or too bad.",
              "He started TestWala as a simple Telegram bot that shared free MCQ sets. Within 3 months, 10,000 students had joined. The demand was clear.",
              "Today, TestWala connects students with verified coaching centres, provides unlimited mock tests, and tracks your progress so you know exactly where to improve. We're just getting started.",
            ].map((p, i) => (
              <Text key={i} fontSize="15px" color="#475569" lineHeight={1.8}>
                {p}
              </Text>
            ))}
          </Flex>
        </Box>

        {/* ── Values ── */}
        <Box mb={14}>
          <Text
            fontSize="11px"
            fontWeight={800}
            color="#4a72b8"
            textTransform="uppercase"
            letterSpacing="2px"
            mb={3}
          >
            What We Stand For
          </Text>
          <Text
            fontSize={{ base: "22px", md: "28px" }}
            fontWeight={800}
            color="#0f172a"
            letterSpacing="-0.5px"
            mb={6}
          >
            Our values
          </Text>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={4}>
            {VALUES.map((v) => (
              <Flex
                key={v.title}
                gap={4}
                p={5}
                bg="white"
                borderRadius="14px"
                border="1px solid #e2e8f0"
                boxShadow="0 2px 8px rgba(0,0,0,.04)"
                align="flex-start"
              >
                <Flex
                  w="44px"
                  h="44px"
                  bg={v.bg}
                  borderRadius="12px"
                  align="center"
                  justify="center"
                  flexShrink={0}
                >
                  <Icon as={v.icon} color={v.color} fontSize="18px" />
                </Flex>
                <Box>
                  <Text fontSize="14px" fontWeight={800} color="#0f172a" mb={1}>
                    {v.title}
                  </Text>
                  <Text fontSize="13px" color="#64748b" lineHeight={1.65}>
                    {v.desc}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Grid>
        </Box>

        {/* ── Team ── */}
        <Box mb={14}>
          <Text
            fontSize="11px"
            fontWeight={800}
            color="#4a72b8"
            textTransform="uppercase"
            letterSpacing="2px"
            mb={3}
          >
            The Team
          </Text>
          <Text
            fontSize={{ base: "22px", md: "28px" }}
            fontWeight={800}
            color="#0f172a"
            letterSpacing="-0.5px"
            mb={6}
          >
            People behind TestWala
          </Text>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2,1fr)" }} gap={4}>
            {TEAM.map((m) => (
              <Flex
                key={m.name}
                gap={4}
                p={5}
                bg="white"
                borderRadius="14px"
                border="1px solid #e2e8f0"
                align="flex-start"
              >
                <Flex
                  w="50px"
                  h="50px"
                  bg="#eff6ff"
                  borderRadius="14px"
                  align="center"
                  justify="center"
                  flexShrink={0}
                  fontSize="24px"
                >
                  {m.emoji}
                </Flex>
                <Box>
                  <Text fontSize="14px" fontWeight={800} color="#0f172a">
                    {m.name}
                  </Text>
                  <Text fontSize="11px" color="#4a72b8" fontWeight={700} mb={1}>
                    {m.role}
                  </Text>
                  <Text fontSize="12px" color="#64748b" lineHeight={1.6}>
                    {m.desc}
                  </Text>
                </Box>
              </Flex>
            ))}
          </Grid>
        </Box>

        {/* ── CTA ── */}
        <Box
          bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)"
          borderRadius="20px"
          p={{ base: 7, md: 10 }}
          textAlign="center"
        >
          <Icon
            as={MdSchool}
            color="rgba(255,255,255,.4)"
            fontSize="36px"
            mb={3}
          />
          <Text
            fontSize={{ base: "20px", md: "26px" }}
            fontWeight={900}
            color="white"
            letterSpacing="-0.5px"
            mb={2}
          >
            Ready to crack your exam?
          </Text>
          <Text fontSize="14px" color="rgba(255,255,255,.6)" mb={6}>
            Join 50,000+ students already using TestWala
          </Text>
          <Link to="/coaching">
            <Box
              display="inline-block"
              bg="white"
              color="#0f1e3a"
              px={7}
              py={3}
              borderRadius="10px"
              fontSize="14px"
              fontWeight={800}
              cursor="pointer"
              _hover={{ bg: "#f1f5f9" }}
              transition="background .2s"
            >
              Explore Coaching Centres →
            </Box>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
