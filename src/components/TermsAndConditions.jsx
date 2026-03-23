import React, { useState } from "react";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaFileContract,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const LAST_UPDATED = "1 January 2025";

const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: [
      'By accessing or using TestWala ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.',
      "These terms apply to all visitors, registered users, coaching centre owners, and any other persons who access the Platform.",
      "We reserve the right to update these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the new Terms. We will notify users of material changes via email or a prominent notice on the Platform.",
    ],
  },
  {
    id: "eligibility",
    title: "2. Eligibility & Registration",
    content: [
      "You must be at least 13 years of age to use TestWala. Users under 18 should have parental or guardian consent.",
      "When you create an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your login credentials.",
      "You may not share your account with others or create multiple accounts for the purpose of gaming rankings or leaderboards.",
      "TestWala reserves the right to suspend or terminate accounts that violate these terms or are created fraudulently.",
    ],
  },
  {
    id: "platform-use",
    title: "3. Platform Use & Conduct",
    content: [
      "TestWala is designed for educational purposes — taking mock tests, connecting with coaching centres, and tracking exam preparation progress.",
      "You agree NOT to: attempt to reverse-engineer, scrape, or copy test questions and content; post false reviews or ratings of coaching centres; upload harmful, illegal, or misleading content; use automated bots to take tests or manipulate scores.",
      "Coaching centre owners are responsible for the accuracy of the information they submit during registration. TestWala verifies details but cannot guarantee the completeness of third-party data.",
      "Any commercial use of the Platform's content or data without express written permission from TestWala is strictly prohibited.",
    ],
  },
  {
    id: "content",
    title: "4. Intellectual Property",
    content: [
      "All content on TestWala — including test questions, explanations, UI design, logo, and brand elements — is the intellectual property of TestWala or its licensors.",
      "You may not copy, reproduce, distribute, or create derivative works from any content on the Platform without prior written consent.",
      "User-generated content (such as coaching descriptions submitted by owners) remains the property of the submitting party but grants TestWala a non-exclusive, royalty-free licence to display and use it on the Platform.",
    ],
  },
  {
    id: "payments",
    title: "5. Payments & Refunds",
    content: [
      "TestWala's core features are currently free for students. Premium features, if introduced, will be clearly marked and require prior consent before purchase.",
      "Coaching centres that opt for premium listing or promotional services agree to the pricing communicated at the time of purchase.",
      "Refund requests for any paid services must be raised within 7 days of purchase. Refunds are processed within 10–15 business days to the original payment method.",
      "TestWala is not responsible for any fees charged by coaching centres to students outside of the Platform.",
    ],
  },
  {
    id: "disclaimer",
    title: "6. Disclaimer of Warranties",
    content: [
      'TestWala is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.',
      "We do not guarantee that the Platform will be error-free, uninterrupted, or free of viruses. We recommend maintaining up-to-date antivirus software.",
      "Test scores and percentile rankings are computed algorithmically and are for indicative purposes only. They do not represent or guarantee performance in any official examination.",
      "TestWala does not endorse any coaching centre or guarantee the quality of their teaching. Verified status means we have checked basic credentials, not the educational outcomes.",
    ],
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: [
      "To the maximum extent permitted by applicable law, TestWala shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Platform.",
      "Our total liability for any claim arising out of your use of the Platform shall not exceed the amount you paid us in the 12 months preceding the claim, or ₹1,000, whichever is greater.",
    ],
  },
  {
    id: "termination",
    title: "8. Termination",
    content: [
      "You may delete your account at any time from the account settings page. Upon deletion, your personal data will be handled in accordance with our Privacy Policy.",
      "TestWala may suspend or terminate your access without notice if you violate these Terms, engage in fraudulent activity, or for any other reason at our sole discretion.",
    ],
  },
  {
    id: "governing",
    title: "9. Governing Law",
    content: [
      "These Terms are governed by the laws of India. Any disputes arising in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of New Delhi, India.",
      "For informal dispute resolution, you may contact us at legal@testwala.in before initiating legal proceedings.",
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: [
      "If you have questions about these Terms, please reach us at:",
      "📧 legal@testwala.in",
      "📍 TestWala Technologies Pvt. Ltd., New Delhi, India — 110001",
    ],
  },
];

function Section({ section }) {
  const [open, setOpen] = useState(false);
  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid #e2e8f0"
      overflow="hidden"
      transition="box-shadow .2s"
      boxShadow={
        open ? "0 4px 20px rgba(0,0,0,.07)" : "0 1px 4px rgba(0,0,0,.04)"
      }
    >
      <Flex
        px={6}
        py={5}
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={() => setOpen((o) => !o)}
        _hover={{ bg: "#fafbfc" }}
        userSelect="none"
      >
        <Text fontSize="14px" fontWeight={700} color="#0f172a">
          {section.title}
        </Text>
        <Icon
          as={open ? FaChevronUp : FaChevronDown}
          fontSize="12px"
          color="#94a3b8"
          flexShrink={0}
          ml={3}
        />
      </Flex>
      {open && (
        <Box px={6} pb={6} borderTop="1px solid #f1f5f9">
          <Flex direction="column" gap={3} pt={4}>
            {section.content.map((p, i) => (
              <Text key={i} fontSize="14px" color="#475569" lineHeight={1.75}>
                {p}
              </Text>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
}

export default function TermsAndConditions() {
  const [allOpen, setAllOpen] = useState(false);

  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora', sans-serif">
      {/* Hero */}
      <Box
        bg="linear-gradient(135deg,#0f1e3a 0%,#1e3a5f 55%,#2d5fa8 100%)"
        px={{ base: 5, md: 10 }}
        pt={{ base: 10, md: 16 }}
        pb={{ base: 10, md: 14 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-80px"
          right="-80px"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="rgba(255,255,255,.03)"
        />

        <Box maxW="780px" mx="auto">
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
            w="56px"
            h="56px"
            bg="rgba(255,255,255,.1)"
            border="1.5px solid rgba(255,255,255,.15)"
            borderRadius="14px"
            align="center"
            justify="center"
            mb={5}
          >
            <Icon as={FaFileContract} color="white" fontSize="22px" />
          </Flex>

          <Text
            fontSize={{ base: "28px", md: "42px" }}
            fontWeight={900}
            color="white"
            letterSpacing="-1px"
            mb={3}
          >
            Terms & Conditions
          </Text>
          <Text fontSize="14px" color="rgba(255,255,255,.55)">
            Last updated: {LAST_UPDATED} · Effective immediately
          </Text>
        </Box>
      </Box>

      <Box
        maxW="780px"
        mx="auto"
        px={{ base: 5, md: 10 }}
        py={{ base: 8, md: 12 }}
      >
        {/* Intro box */}
        <Box
          bg="#eff6ff"
          border="1.5px solid #bfdbfe"
          borderRadius="14px"
          p={5}
          mb={8}
        >
          <Text fontSize="14px" color="#1e40af" lineHeight={1.7}>
            Please read these Terms and Conditions carefully before using
            TestWala. By creating an account or using any part of our service,
            you agree to be bound by these terms. These terms constitute a
            legally binding agreement between you and TestWala Technologies Pvt.
            Ltd.
          </Text>
        </Box>

        {/* Expand/Collapse all */}
        <Flex justify="flex-end" mb={4}>
          <Box
            as="button"
            fontSize="12px"
            fontWeight={700}
            color="#4a72b8"
            cursor="pointer"
            onClick={() => setAllOpen((o) => !o)}
            _hover={{ textDecoration: "underline" }}
          >
            {allOpen ? "Collapse all" : "Expand all"}
          </Box>
        </Flex>

        {/* Sections */}
        <Flex direction="column" gap={3} mb={10}>
          {SECTIONS.map((s) => (
            <ExpandableSection key={s.id} section={s} forceOpen={allOpen} />
          ))}
        </Flex>

        {/* Footer note */}
        <Box borderTop="1px solid #e2e8f0" pt={6} textAlign="center">
          <Text fontSize="13px" color="#94a3b8">
            Questions about these terms?{" "}
            <Link to="/feedback">
              <Text
                as="span"
                color="#4a72b8"
                fontWeight={700}
                _hover={{ textDecoration: "underline" }}
              >
                Contact us
              </Text>
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}

/* Controlled version that responds to forceOpen */
function ExpandableSection({ section, forceOpen }) {
  const [localOpen, setLocalOpen] = useState(false);
  const open = forceOpen || localOpen;

  return (
    <Box
      bg="white"
      borderRadius="12px"
      border="1px solid #e2e8f0"
      overflow="hidden"
      boxShadow={
        open ? "0 4px 20px rgba(0,0,0,.07)" : "0 1px 4px rgba(0,0,0,.04)"
      }
      transition="box-shadow .2s"
    >
      <Flex
        px={6}
        py={5}
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={() => setLocalOpen((o) => !o)}
        _hover={{ bg: "#fafbfc" }}
        userSelect="none"
      >
        <Text fontSize="14px" fontWeight={700} color="#0f172a">
          {section.title}
        </Text>
        <Icon
          as={open ? FaChevronUp : FaChevronDown}
          fontSize="12px"
          color="#94a3b8"
          flexShrink={0}
          ml={3}
        />
      </Flex>
      {open && (
        <Box px={6} pb={6} borderTop="1px solid #f1f5f9">
          <Flex direction="column" gap={3} pt={4}>
            {section.content.map((p, i) => (
              <Text key={i} fontSize="14px" color="#475569" lineHeight={1.75}>
                {p}
              </Text>
            ))}
          </Flex>
        </Box>
      )}
    </Box>
  );
}
