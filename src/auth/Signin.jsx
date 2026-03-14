import React, { useState, useEffect } from "react";
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
  InputGroup,
  InputRightElement,
  IconButton,
  Icon,
} from "@chakra-ui/react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Signin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { signIn, user } = useAuth();

  const [form, setForm] = useState({ Email: "", Password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  // If already logged in, redirect immediately
  useEffect(() => {
    if (user) navigate(params.get("redirect") || "/", { replace: true });
  }, [user, navigate, params]);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setError("");
  };

  const submit = async () => {
    if (!form.Email || !form.Password) {
      setError("Sabhi fields fill karein");
      return;
    }
    if (!form.Email.includes("@")) {
      setError("Valid email daalen");
      return;
    }

    setLoading(true);
    try {
      // signIn → signInApi → saveUser() → "sessionchange" event →
      // AuthContext listener → setUser() → Navbar re-renders instantly
      await signIn(form);
      setOk(true);
      navigate(params.get("redirect") || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
      <Box bg="linear-gradient(135deg,#0f1e3a,#1e3a5f)" px={6} py={4}>
        <Flex align="center" gap={2} maxW="1200px" mx="auto">
          <Flex
            w="32px"
            h="32px"
            bg="rgba(255,255,255,.15)"
            borderRadius="8px"
            align="center"
            justify="center"
          >
            <Icon as={FaGraduationCap} color="white" fontSize="15px" />
          </Flex>
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
          maxW="440px"
          bg="white"
          borderRadius="20px"
          boxShadow="0 8px 40px rgba(0,0,0,.1)"
          border="1px solid #e2e8f0"
          overflow="hidden"
        >
          <Box bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)" px={8} py={7}>
            <Text fontSize="24px" fontWeight={800} color="white" mb={1}>
              Welcome back 👋
            </Text>
            <Text fontSize="13px" color="rgba(255,255,255,.6)">
              TestWala pe sign in karein
            </Text>
          </Box>

          <Box px={8} py={7}>
            {(error || ok) && (
              <Alert
                status={ok ? "success" : "error"}
                borderRadius="10px"
                mb={5}
                fontSize="13px"
              >
                <AlertIcon />
                {ok ? "Signed in! Redirecting…" : error}
              </Alert>
            )}

            <FormControl mb={4}>
              <FormLabel
                fontSize="12px"
                fontWeight={700}
                color="#374151"
                textTransform="uppercase"
                letterSpacing=".8px"
                mb={1}
              >
                Email
              </FormLabel>
              <Input
                type="email"
                placeholder="you@example.com"
                value={form.Email}
                onChange={set("Email")}
                onKeyDown={(e) => e.key === "Enter" && submit()}
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

            <FormControl mb={2}>
              <FormLabel
                fontSize="12px"
                fontWeight={700}
                color="#374151"
                textTransform="uppercase"
                letterSpacing=".8px"
                mb={1}
              >
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="Password daalen"
                  value={form.Password}
                  onChange={set("Password")}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  borderRadius="10px"
                  h="44px"
                  fontSize="14px"
                  borderColor="#e2e8f0"
                  _focus={{
                    borderColor: "#4a72b8",
                    boxShadow: "0 0 0 1px #4a72b8",
                  }}
                />
                <InputRightElement h="44px">
                  <IconButton
                    size="sm"
                    variant="ghost"
                    aria-label="toggle"
                    icon={showPw ? <FaEyeSlash /> : <FaEye />}
                    onClick={() => setShowPw((p) => !p)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Flex justify="flex-end" mb={6}>
              <Link to="/auth/forgotPassword">
                <Text
                  fontSize="12px"
                  color="#4a72b8"
                  fontWeight={600}
                  _hover={{ textDecoration: "underline" }}
                >
                  Password bhool gaye?
                </Text>
              </Link>
            </Flex>

            <Button
              w="100%"
              h="46px"
              borderRadius="12px"
              bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
              color="white"
              fontWeight={800}
              fontSize="14px"
              isLoading={loading}
              loadingText="Signing in…"
              onClick={submit}
              _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
              transition="all .2s"
            >
              Sign In
            </Button>

            <Text fontSize="13px" color="#64748b" textAlign="center" mt={5}>
              Account nahi hai?{" "}
              <Link to="/auth/signup">
                <Text
                  as="span"
                  color="#4a72b8"
                  fontWeight={700}
                  _hover={{ textDecoration: "underline" }}
                >
                  Account banao
                </Text>
              </Link>
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
