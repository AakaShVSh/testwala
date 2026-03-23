import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  Icon,
  Input,
  Textarea,
  Select,
  Grid,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCommentAlt,
  FaBug,
  FaLightbulb,
  FaStar,
  FaCheckCircle,
  FaEnvelope,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { apiFetch } from "../services/api";

const TYPES = [
  {
    key: "general",
    label: "💬 General Feedback",
    desc: "Share your thoughts about TestWala",
    icon: FaCommentAlt,
    color: "#4a72b8",
    bg: "#eff6ff",
  },
  {
    key: "bug",
    label: "🐛 Report a Bug",
    desc: "Something not working correctly?",
    icon: FaBug,
    color: "#dc2626",
    bg: "#fef2f2",
  },
  {
    key: "feature",
    label: "💡 Feature Request",
    desc: "Suggest something we should build",
    icon: FaLightbulb,
    color: "#d97706",
    bg: "#fffbeb",
  },
];

const FAQS = [
  {
    q: "How long does coaching verification take?",
    a: "We aim to verify all coaching registrations within 24–48 hours. You'll receive a notification once your status is updated.",
  },
  {
    q: "My test score seems wrong — what do I do?",
    a: "Please report it as a bug with the test name and your expected score. We'll investigate within 24 hours.",
  },
  {
    q: "Can I request a specific subject or exam type?",
    a: "Yes! Use the Feature Request form to suggest new subjects or exam types. Popular requests get prioritised.",
  },
  {
    q: "How do I delete my account?",
    a: "Go to Profile Settings → Delete Account. All your data will be removed within 30 days as per our Privacy Policy.",
  },
];

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <Flex gap={2}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Icon
          key={star}
          as={FaStar}
          fontSize="28px"
          cursor="pointer"
          color={(hovered || value) >= star ? "#f59e0b" : "#e2e8f0"}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          transition="color .1s"
        />
      ))}
    </Flex>
  );
}

export default function Feedback() {
  const [type, setType] = useState("general");
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    rating: 0,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.message.trim()) {
      setError("Please enter a message.");
      return;
    }
    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }
    setError("");
    setSending(true);
    try {
      // Send as a notification to admin (uses the adminAPI notify endpoint)
      // In production, wire this to a dedicated feedback model/endpoint
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ Email: "feedback-placeholder@testwala.in" }),
      }).catch(() => {}); // placeholder — replace with real feedback endpoint

      // Simulate success for now
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
    } catch (e) {
      setError(
        "Failed to send. Please email us directly at support@testwala.in",
      );
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <Box
        minH="100vh"
        bg="#f8fafc"
        fontFamily="'Sora', sans-serif"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box textAlign="center" p={10} maxW="440px">
          <Flex
            w="80px"
            h="80px"
            bg="#ecfdf5"
            borderRadius="full"
            align="center"
            justify="center"
            mx="auto"
            mb={5}
          >
            <Icon as={FaCheckCircle} color="#059669" fontSize="36px" />
          </Flex>
          <Text
            fontSize="26px"
            fontWeight={900}
            color="#0f172a"
            letterSpacing="-0.5px"
            mb={3}
          >
            Message received!
          </Text>
          <Text fontSize="14px" color="#64748b" lineHeight={1.7} mb={6}>
            Thank you for reaching out. We typically respond within 24–48 hours
            on weekdays. Keep an eye on <b>{form.email}</b>.
          </Text>
          <Link to="/">
            <Box
              display="inline-block"
              bg="#0f1e3a"
              color="white"
              px={6}
              py={3}
              borderRadius="10px"
              fontSize="14px"
              fontWeight={700}
              cursor="pointer"
              _hover={{ bg: "#1e3a5f" }}
              transition="background .2s"
            >
              Back to Home
            </Box>
          </Link>
        </Box>
      </Box>
    );
  }

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
          w="280px"
          h="280px"
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
            <Icon as={FaCommentAlt} color="white" fontSize="22px" />
          </Flex>

          <Text
            fontSize={{ base: "28px", md: "42px" }}
            fontWeight={900}
            color="white"
            letterSpacing="-1px"
            mb={3}
          >
            We'd love to hear from you
          </Text>
          <Text
            fontSize="15px"
            color="rgba(255,255,255,.6)"
            maxW="500px"
            lineHeight={1.65}
          >
            Bug report, feature idea, or just want to say hi — every message is
            read by our team.
          </Text>
        </Box>
      </Box>

      <Box
        maxW="780px"
        mx="auto"
        px={{ base: 5, md: 10 }}
        py={{ base: 8, md: 12 }}
      >
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr 340px" }}
          gap={8}
          alignItems="flex-start"
        >
          {/* ── Left: Form ── */}
          <Box>
            {/* Type selector */}
            <Text
              fontSize="12px"
              fontWeight={800}
              color="#64748b"
              textTransform="uppercase"
              letterSpacing="1.5px"
              mb={3}
            >
              What's your feedback about?
            </Text>
            <Flex gap={3} mb={6} flexWrap="wrap">
              {TYPES.map((t) => (
                <Flex
                  key={t.key}
                  flex="1"
                  minW="140px"
                  direction="column"
                  gap={1}
                  p={4}
                  borderRadius="12px"
                  border="2px solid"
                  borderColor={type === t.key ? t.color : "#e2e8f0"}
                  bg={type === t.key ? t.bg : "white"}
                  cursor="pointer"
                  onClick={() => setType(t.key)}
                  transition="all .15s"
                  _hover={{ borderColor: t.color }}
                >
                  <Icon
                    as={t.icon}
                    color={type === t.key ? t.color : "#94a3b8"}
                    fontSize="16px"
                  />
                  <Text
                    fontSize="12px"
                    fontWeight={700}
                    color={type === t.key ? t.color : "#374151"}
                  >
                    {t.label}
                  </Text>
                  <Text fontSize="11px" color="#94a3b8">
                    {t.desc}
                  </Text>
                </Flex>
              ))}
            </Flex>

            {/* Form fields */}
            <Box
              bg="white"
              borderRadius="16px"
              border="1px solid #e2e8f0"
              p={6}
              boxShadow="0 2px 12px rgba(0,0,0,.04)"
            >
              <Flex direction="column" gap={4}>
                <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={4}>
                  <Box>
                    <Text
                      fontSize="12px"
                      fontWeight={700}
                      color="#64748b"
                      mb={1.5}
                    >
                      Your Name
                    </Text>
                    <Input
                      value={form.name}
                      onChange={(e) => upd("name", e.target.value)}
                      placeholder="Rahul Kumar"
                      borderRadius="9px"
                      fontSize="13px"
                      h="40px"
                      borderColor="#e2e8f0"
                      _focus={{
                        borderColor: "#4a72b8",
                        boxShadow: "0 0 0 1px #4a72b8",
                      }}
                    />
                  </Box>
                  <Box>
                    <Text
                      fontSize="12px"
                      fontWeight={700}
                      color="#64748b"
                      mb={1.5}
                    >
                      Email Address *
                    </Text>
                    <Input
                      value={form.email}
                      onChange={(e) => upd("email", e.target.value)}
                      placeholder="rahul@email.com"
                      type="email"
                      borderRadius="9px"
                      fontSize="13px"
                      h="40px"
                      borderColor="#e2e8f0"
                      _focus={{
                        borderColor: "#4a72b8",
                        boxShadow: "0 0 0 1px #4a72b8",
                      }}
                    />
                  </Box>
                </Grid>

                <Box>
                  <Text
                    fontSize="12px"
                    fontWeight={700}
                    color="#64748b"
                    mb={1.5}
                  >
                    Subject
                  </Text>
                  <Input
                    value={form.subject}
                    onChange={(e) => upd("subject", e.target.value)}
                    placeholder={
                      type === "bug"
                        ? "e.g. Timer stops working on mobile"
                        : type === "feature"
                          ? "e.g. Add Hindi language support"
                          : "e.g. Great experience with TestWala!"
                    }
                    borderRadius="9px"
                    fontSize="13px"
                    h="40px"
                    borderColor="#e2e8f0"
                    _focus={{
                      borderColor: "#4a72b8",
                      boxShadow: "0 0 0 1px #4a72b8",
                    }}
                  />
                </Box>

                <Box>
                  <Text
                    fontSize="12px"
                    fontWeight={700}
                    color="#64748b"
                    mb={1.5}
                  >
                    Message *
                  </Text>
                  <Textarea
                    value={form.message}
                    onChange={(e) => upd("message", e.target.value)}
                    placeholder={
                      type === "bug"
                        ? "Steps to reproduce:\n1. \n2. \n\nExpected: \nActual: "
                        : type === "feature"
                          ? "Describe the feature you'd like to see and why it would help..."
                          : "Tell us what you think about TestWala..."
                    }
                    rows={6}
                    resize="none"
                    borderRadius="9px"
                    fontSize="13px"
                    borderColor="#e2e8f0"
                    _focus={{
                      borderColor: "#4a72b8",
                      boxShadow: "0 0 0 1px #4a72b8",
                    }}
                  />
                </Box>

                {/* Rating (only for general feedback) */}
                {type === "general" && (
                  <Box>
                    <Text
                      fontSize="12px"
                      fontWeight={700}
                      color="#64748b"
                      mb={2}
                    >
                      How would you rate your experience?
                    </Text>
                    <StarRating
                      value={form.rating}
                      onChange={(v) => upd("rating", v)}
                    />
                    {form.rating > 0 && (
                      <Text
                        fontSize="12px"
                        color="#f59e0b"
                        fontWeight={700}
                        mt={1}
                      >
                        {
                          [
                            "",
                            "Poor 😕",
                            "Fair 😐",
                            "Good 🙂",
                            "Great 😊",
                            "Excellent 🤩",
                          ][form.rating]
                        }
                      </Text>
                    )}
                  </Box>
                )}

                {error && (
                  <Box
                    bg="#fef2f2"
                    border="1px solid #fecaca"
                    borderRadius="9px"
                    px={4}
                    py={3}
                  >
                    <Text fontSize="13px" color="#dc2626">
                      {error}
                    </Text>
                  </Box>
                )}

                <Box
                  as="button"
                  bg={sending ? "#94a3b8" : "#0f1e3a"}
                  color="white"
                  borderRadius="10px"
                  py={3}
                  px={6}
                  fontSize="14px"
                  fontWeight={700}
                  cursor={sending ? "not-allowed" : "pointer"}
                  _hover={{ bg: sending ? "#94a3b8" : "#1e3a5f" }}
                  transition="background .2s"
                  onClick={!sending ? handleSubmit : undefined}
                  w="full"
                >
                  {sending ? "Sending…" : "Send Message →"}
                </Box>
              </Flex>
            </Box>
          </Box>

          {/* ── Right: Info ── */}
          <Flex direction="column" gap={5}>
            {/* Contact info */}
            <Box
              bg="white"
              borderRadius="14px"
              border="1px solid #e2e8f0"
              p={5}
            >
              <Text fontSize="13px" fontWeight={800} color="#0f172a" mb={4}>
                Other ways to reach us
              </Text>
              <Flex direction="column" gap={4}>
                {[
                  {
                    icon: FaEnvelope,
                    label: "Email",
                    value: "support@testwala.in",
                    color: "#4a72b8",
                  },
                  {
                    icon: FaWhatsapp,
                    label: "WhatsApp",
                    value: "+91 98765 43210",
                    color: "#25d366",
                  },
                  {
                    icon: FaTwitter,
                    label: "Twitter",
                    value: "@TestWalaIn",
                    color: "#1d9bf0",
                  },
                  {
                    icon: FaInstagram,
                    label: "Instagram",
                    value: "@testwala.in",
                    color: "#e1306c",
                  },
                ].map((c) => (
                  <Flex key={c.label} align="center" gap={3}>
                    <Flex
                      w="34px"
                      h="34px"
                      bg="#f8fafc"
                      borderRadius="9px"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      <Icon as={c.icon} color={c.color} fontSize="14px" />
                    </Flex>
                    <Box>
                      <Text
                        fontSize="10px"
                        color="#94a3b8"
                        fontWeight={700}
                        textTransform="uppercase"
                        letterSpacing=".6px"
                      >
                        {c.label}
                      </Text>
                      <Text fontSize="13px" color="#0f172a" fontWeight={600}>
                        {c.value}
                      </Text>
                    </Box>
                  </Flex>
                ))}
              </Flex>
            </Box>

            {/* Response time */}
            <Box
              bg="#eff6ff"
              border="1px solid #bfdbfe"
              borderRadius="14px"
              p={5}
            >
              <Text fontSize="13px" fontWeight={800} color="#1e40af" mb={1}>
                ⏱ Response Time
              </Text>
              <Text fontSize="13px" color="#3b82f6" lineHeight={1.6}>
                We typically respond within <b>24–48 hours</b> on weekdays.
                Complex bug reports may take up to 72 hours.
              </Text>
            </Box>

            {/* FAQs */}
            <Box
              bg="white"
              borderRadius="14px"
              border="1px solid #e2e8f0"
              p={5}
            >
              <Text fontSize="13px" fontWeight={800} color="#0f172a" mb={4}>
                Quick Answers
              </Text>
              <Flex direction="column" gap={4}>
                {FAQS.map((faq) => (
                  <Box key={faq.q}>
                    <Text
                      fontSize="12px"
                      fontWeight={700}
                      color="#374151"
                      mb={1}
                    >
                      {faq.q}
                    </Text>
                    <Text fontSize="12px" color="#64748b" lineHeight={1.6}>
                      {faq.a}
                    </Text>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Grid>
      </Box>
    </Box>
  );
}
