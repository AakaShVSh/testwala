import React, { useState } from "react";
import { Box, Flex, Text, Icon, Grid } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaShieldAlt,
  FaChevronDown,
  FaChevronUp,
  FaDatabase,
  FaUserShield,
  FaCookieBite,
  FaEnvelope,
  FaLock,
  FaTrash,
} from "react-icons/fa";

const LAST_UPDATED = "1 January 2025";

const HIGHLIGHTS = [
  {
    icon: FaDatabase,
    title: "What we collect",
    desc: "Name, email, phone, test answers, performance data.",
    color: "#4a72b8",
    bg: "#eff6ff",
  },
  {
    icon: FaUserShield,
    title: "Who sees it",
    desc: "Only you, your coaching owner (test results), and our team.",
    color: "#059669",
    bg: "#ecfdf5",
  },
  {
    icon: FaCookieBite,
    title: "Cookies",
    desc: "We use one httpOnly auth cookie. No third-party ad trackers.",
    color: "#d97706",
    bg: "#fffbeb",
  },
  {
    icon: FaTrash,
    title: "Your rights",
    desc: "Delete your account anytime. Your data is gone within 30 days.",
    color: "#e11d48",
    bg: "#fff1f2",
  },
];

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: [
      "Account information: When you register, we collect your name, email address, phone number, and a securely hashed password.",
      "Test data: We store every test you take — your answers, time taken per question, score, and percentile — to power your progress dashboard.",
      "Usage data: We log page visits, test link opens (including whether you were logged in), and device/browser info to improve the platform and detect abuse.",
      "Coaching data: If you register a coaching centre, we collect your centre's details (name, address, contact info, exam types) for the public directory.",
      "We do NOT collect payment card numbers — all payments (if applicable) are handled by our payment processor (Razorpay) under their own privacy policy.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To provide the service: Authenticate you, show your test history, calculate rankings and percentiles, and connect you with coaching centres.",
      "To improve the platform: Analyse aggregate usage patterns, identify broken features, and prioritise new features.",
      "To communicate: Send you important account notifications (e.g. password reset OTP, coaching approval status). We do NOT send marketing emails without your explicit consent.",
      "For safety: Detect and prevent fraud, cheating, or abuse of our systems.",
    ],
  },
  {
    title: "3. Information Sharing",
    content: [
      "We never sell your personal data to advertisers or data brokers.",
      "Coaching owners can see the test results (score, percentage, time taken) of students who attempt their tests. They cannot see your email or phone unless you explicitly share it.",
      "We share data with service providers (e.g. cloud hosting on AWS/Render, email OTP services) strictly necessary to operate the platform. All providers are bound by data processing agreements.",
      "We may disclose your information if required by law or to protect the rights and safety of TestWala users.",
    ],
  },
  {
    title: "4. Cookies & Sessions",
    content: [
      "We use a single httpOnly, Secure cookie named _user that stores your authentication session token. This cookie is essential for the platform to work.",
      "This cookie is NOT readable by JavaScript, cannot be accessed by third parties, and expires after 7 days of inactivity.",
      "We do NOT use advertising cookies, cross-site tracking pixels, or Google Analytics (as of this policy date). If this changes, we will update this policy and notify users.",
    ],
  },
  {
    title: "5. Data Security",
    content: [
      "Passwords are hashed using bcrypt with a cost factor of 12 — they are never stored in plain text.",
      "All data is transmitted over HTTPS/TLS encryption.",
      "Database access is restricted to authorised engineering staff only, with activity logging enabled.",
      "Despite our best efforts, no system is perfectly secure. Please use a strong, unique password and notify us immediately if you suspect unauthorised access to your account.",
    ],
  },
  {
    title: "6. Data Retention",
    content: [
      "Active accounts: Your data is retained as long as your account exists.",
      "Deleted accounts: Upon account deletion, your personal data (name, email, phone) is purged within 30 days. Aggregated, anonymised test statistics may be retained for platform analytics.",
      "Inactive accounts: Accounts with no login activity for 24 months may be automatically deactivated. We will notify you at least 30 days before deactivation.",
    ],
  },
  {
    title: "7. Your Rights",
    content: [
      "Access: You can view your personal data and test history in your account dashboard at any time.",
      "Correction: You can update your name and phone number from the profile settings page.",
      'Deletion: You can delete your account from settings. Alternatively, email us at privacy@testwala.in with the subject "Account Deletion Request".',
      "Data Portability: You may request a JSON export of your test history by contacting us at privacy@testwala.in.",
      "Opt-out of communications: You can unsubscribe from non-essential emails using the link at the bottom of any email we send.",
    ],
  },
  {
    title: "8. Children's Privacy",
    content: [
      "TestWala is intended for users aged 13 and above. We do not knowingly collect personal information from children under 13.",
      "If you believe a child under 13 has registered, please contact us at privacy@testwala.in and we will promptly delete the account.",
    ],
  },
  {
    title: "9. Changes to This Policy",
    content: [
      "We may update this Privacy Policy as our services evolve. We will notify you of significant changes via email or a banner on the platform at least 14 days before they take effect.",
      "Continued use of TestWala after a policy update constitutes your acceptance of the new policy.",
    ],
  },
  {
    title: "10. Contact & Grievance Officer",
    content: [
      "For any privacy-related queries, requests, or complaints:",
      "📧 privacy@testwala.in",
      "⏱ We aim to respond within 7 business days.",
      "📍 TestWala Technologies Pvt. Ltd., New Delhi — 110001, India",
      "In accordance with the Information Technology Act 2000 and the rules made thereunder, the Grievance Officer can be reached at the above email address.",
    ],
  },
];

function PolicySection({ section }) {
  const [open, setOpen] = useState(false);
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

export default function PrivacyPolicy() {
  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora', sans-serif">
      {/* Hero */}
      <Box
        bg="linear-gradient(135deg,#0f1e3a 0%,#134e3a 55%,#1a6b4f 100%)"
        px={{ base: 5, md: 10 }}
        pt={{ base: 10, md: 16 }}
        pb={{ base: 10, md: 14 }}
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top="-60px"
          right="-60px"
          w="260px"
          h="260px"
          borderRadius="full"
          bg="rgba(255,255,255,.03)"
        />
        <Box
          position="absolute"
          bottom="0"
          left="5%"
          w="180px"
          h="180px"
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
            <Icon as={FaShieldAlt} color="white" fontSize="22px" />
          </Flex>

          <Text
            fontSize={{ base: "28px", md: "42px" }}
            fontWeight={900}
            color="white"
            letterSpacing="-1px"
            mb={3}
          >
            Privacy Policy
          </Text>
          <Text fontSize="14px" color="rgba(255,255,255,.55)">
            Last updated: {LAST_UPDATED} · Applies to all TestWala products
          </Text>
        </Box>
      </Box>

      <Box
        maxW="780px"
        mx="auto"
        px={{ base: 5, md: 10 }}
        py={{ base: 8, md: 12 }}
      >
        {/* Promise box */}
        <Box
          bg="#ecfdf5"
          border="1.5px solid #6ee7b7"
          borderRadius="14px"
          p={5}
          mb={8}
        >
          <Flex align="flex-start" gap={3}>
            <Icon
              as={FaLock}
              color="#059669"
              fontSize="18px"
              mt="2px"
              flexShrink={0}
            />
            <Text fontSize="14px" color="#065f46" lineHeight={1.7}>
              <Text as="span" fontWeight={800}>
                Our promise:
              </Text>{" "}
              We collect only what we need, we don't sell your data, and you can
              delete everything at any time. This policy explains exactly what
              we collect and why — in plain language.
            </Text>
          </Flex>
        </Box>

        {/* Highlights grid */}
        <Grid
          templateColumns={{ base: "1fr 1fr", md: "repeat(4,1fr)" }}
          gap={3}
          mb={10}
        >
          {HIGHLIGHTS.map((h) => (
            <Box
              key={h.title}
              bg="white"
              borderRadius="12px"
              border="1px solid #e2e8f0"
              p={4}
              textAlign="center"
            >
              <Flex
                w="40px"
                h="40px"
                bg={h.bg}
                borderRadius="10px"
                align="center"
                justify="center"
                mx="auto"
                mb={2}
              >
                <Icon as={h.icon} color={h.color} fontSize="16px" />
              </Flex>
              <Text fontSize="12px" fontWeight={800} color="#0f172a" mb={1}>
                {h.title}
              </Text>
              <Text fontSize="11px" color="#64748b" lineHeight={1.5}>
                {h.desc}
              </Text>
            </Box>
          ))}
        </Grid>

        {/* Sections */}
        <Flex direction="column" gap={3} mb={10}>
          {SECTIONS.map((s) => (
            <PolicySection key={s.title} section={s} />
          ))}
        </Flex>

        {/* Footer */}
        <Box borderTop="1px solid #e2e8f0" pt={6} textAlign="center">
          <Text fontSize="13px" color="#94a3b8">
            Have a privacy concern?{" "}
            <Link to="/feedback">
              <Text
                as="span"
                color="#059669"
                fontWeight={700}
                _hover={{ textDecoration: "underline" }}
              >
                Get in touch
              </Text>
            </Link>
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
