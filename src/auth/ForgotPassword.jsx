import React, { useState } from "react";
import {
  Box,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Icon,
  Progress,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaGraduationCap,
  FaEnvelope,
  FaKey,
  FaLock,
} from "react-icons/fa";
import { authAPI } from "../services/api";

const STEPS = ["Email", "OTP", "Naya Password"];
const ICONS = [FaEnvelope, FaKey, FaLock];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [expectedOtp, setExpOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const step0 = async () => {
    if (!email.includes("@")) {
      setError("Valid email daalen");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      setExpOtp(String(res.data?.otp || res.otp || ""));
      setUserId(res.data?.userId || res.userId || "");
      setStep(1);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const step1 = () => {
    if (!otp) {
      setError("OTP daalen");
      return;
    }
    if (expectedOtp && otp !== expectedOtp) {
      setError("OTP galat hai");
      return;
    }
    setStep(2);
    setError("");
  };

  const step2 = async () => {
    if (password.length < 6) {
      setError("Password min 6 characters");
      return;
    }
    setLoading(true);
    try {
      await authAPI.changePassword(userId, password);
      setDone(true);
      setTimeout(() => navigate("/auth/signin"), 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handlers = [step0, step1, step2];
  const btnLabels = ["OTP Bhejo", "OTP Verify Karo", "Password Reset Karo"];

  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
      <Box bg="linear-gradient(135deg,#0f1e3a,#1e3a5f)" px={6} py={4}>
        <Flex align="center" gap={2} maxW="1200px" mx="auto">
          <Icon as={FaGraduationCap} color="white" fontSize="15px" />
          <Text fontSize="16px" fontWeight={800} color="white">
            Test
            <Text as="span" color="#60a5fa">
              Wala
            </Text>
          </Text>
        </Flex>
      </Box>

      <Flex
        minH="calc(100vh - 60px)"
        align="center"
        justify="center"
        px={4}
        py={10}
      >
        <Box
          w="100%"
          maxW="420px"
          bg="white"
          borderRadius="20px"
          boxShadow="0 8px 40px rgba(0,0,0,.1)"
          border="1px solid #e2e8f0"
          overflow="hidden"
        >
          <Box bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)" px={8} py={7}>
            <Flex align="center" gap={3} mb={3}>
              <Flex
                w="42px"
                h="42px"
                bg="rgba(255,255,255,.12)"
                borderRadius="12px"
                align="center"
                justify="center"
                flexShrink={0}
              >
                <Icon as={ICONS[step]} color="white" fontSize="18px" />
              </Flex>
              <Box>
                <Text fontSize="20px" fontWeight={800} color="white">
                  Password Reset
                </Text>
                <Text fontSize="12px" color="rgba(255,255,255,.6)">
                  Step {step + 1}/3 — {STEPS[step]}
                </Text>
              </Box>
            </Flex>
            <Progress
              value={((step + 1) / 3) * 100}
              size="xs"
              colorScheme="blue"
              bg="rgba(255,255,255,.2)"
              borderRadius="full"
            />
          </Box>

          <Box px={8} py={7}>
            {done ? (
              <Alert status="success" borderRadius="10px" fontSize="13px">
                <AlertIcon />
                Password reset ho gaya! Sign in pe ja rahe hain…
              </Alert>
            ) : (
              <>
                {error && (
                  <Alert
                    status="error"
                    borderRadius="10px"
                    mb={5}
                    fontSize="13px"
                  >
                    <AlertIcon />
                    {error}
                  </Alert>
                )}

                {step === 0 && (
                  <FormControl>
                    <FormLabel
                      fontSize="12px"
                      fontWeight={700}
                      color="#374151"
                      textTransform="uppercase"
                      letterSpacing=".8px"
                      mb={1}
                    >
                      Email Address
                    </FormLabel>
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && step0()}
                      borderRadius="10px"
                      h="44px"
                      fontSize="14px"
                      borderColor="#e2e8f0"
                      _focus={{
                        borderColor: "#4a72b8",
                        boxShadow: "0 0 0 1px #4a72b8",
                      }}
                    />
                  </FormControl>
                )}

                {step === 1 && (
                  <FormControl>
                    <FormLabel
                      fontSize="12px"
                      fontWeight={700}
                      color="#374151"
                      textTransform="uppercase"
                      letterSpacing=".8px"
                      mb={1}
                    >
                      Email pe aaya OTP
                    </FormLabel>
                    <Input
                      type="text"
                      placeholder="6-digit OTP"
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && step1()}
                      borderRadius="10px"
                      h="44px"
                      fontSize="18px"
                      fontFamily="monospace"
                      letterSpacing="4px"
                      textAlign="center"
                      borderColor="#e2e8f0"
                      _focus={{
                        borderColor: "#4a72b8",
                        boxShadow: "0 0 0 1px #4a72b8",
                      }}
                    />
                  </FormControl>
                )}

                {step === 2 && (
                  <FormControl>
                    <FormLabel
                      fontSize="12px"
                      fontWeight={700}
                      color="#374151"
                      textTransform="uppercase"
                      letterSpacing=".8px"
                      mb={1}
                    >
                      Naya Password
                    </FormLabel>
                    <Input
                      type="password"
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && step2()}
                      borderRadius="10px"
                      h="44px"
                      fontSize="14px"
                      borderColor="#e2e8f0"
                      _focus={{
                        borderColor: "#4a72b8",
                        boxShadow: "0 0 0 1px #4a72b8",
                      }}
                    />
                  </FormControl>
                )}

                <Button
                  w="100%"
                  h="46px"
                  borderRadius="12px"
                  mt={6}
                  bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
                  color="white"
                  fontWeight={800}
                  isLoading={loading}
                  onClick={handlers[step]}
                  _hover={{ opacity: 0.9 }}
                  transition="all .2s"
                >
                  {btnLabels[step]}
                </Button>

                <Flex justify="center" mt={5}>
                  <Link to="/auth/signin">
                    <Flex
                      align="center"
                      gap={2}
                      color="#94a3b8"
                      _hover={{ color: "#4a72b8" }}
                    >
                      <Icon as={FaArrowLeft} fontSize="11px" />
                      <Text fontSize="13px" fontWeight={600}>
                        Sign In pe wapas
                      </Text>
                    </Flex>
                  </Link>
                </Flex>
              </>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
