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
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();

  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Password: "",
    confirm: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);

  // Already logged in → redirect
  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setError("");
  };

  const submit = async () => {
    const { Name, Email, Password, confirm } = form;
    if (!Name || !Email || !Password || !confirm) {
      setError("Sabhi fields fill karein");
      return;
    }
    if (!Email.includes("@")) {
      setError("Valid email daalen");
      return;
    }
    if (Password.length < 6) {
      setError("Password min 6 characters");
      return;
    }
    if (Password !== confirm) {
      setError("Passwords match nahi karte");
      return;
    }

    setLoading(true);
    try {
      // signUp → signUpApi → saveUser() → "sessionchange" →
      // AuthContext listener → setUser() → Navbar updates instantly →
      // useEffect above fires → navigate("/")
      await signUp({ Name, Email, Password });
      setOk(true);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
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
              Account banao ✨
            </Text>
            <Text fontSize="13px" color="rgba(255,255,255,.6)">
              Lakho students ke saath join karein
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
                {ok ? "Account ban gaya! Redirecting…" : error}
              </Alert>
            )}

            {[
              {
                key: "Name",
                label: "Full Name",
                type: "text",
                ph: "Aapka naam",
              },
              {
                key: "Email",
                label: "Email",
                type: "email",
                ph: "you@example.com",
              },
            ].map(({ key, label, type, ph }) => (
              <FormControl key={key} mb={4}>
                <FormLabel
                  fontSize="12px"
                  fontWeight={700}
                  color="#374151"
                  textTransform="uppercase"
                  letterSpacing=".8px"
                  mb={1}
                >
                  {label}
                </FormLabel>
                <Input
                  type={type}
                  placeholder={ph}
                  value={form[key]}
                  onChange={set(key)}
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
            ))}

            {[
              {
                key: "Password",
                label: "Password",
                show: showPw,
                toggle: () => setShowPw((p) => !p),
                ph: "Min 6 characters",
              },
              {
                key: "confirm",
                label: "Confirm Password",
                show: showCf,
                toggle: () => setShowCf((p) => !p),
                ph: "Dobara daalen",
              },
            ].map(({ key, label, show, toggle, ph }) => (
              <FormControl key={key} mb={4}>
                <FormLabel
                  fontSize="12px"
                  fontWeight={700}
                  color="#374151"
                  textTransform="uppercase"
                  letterSpacing=".8px"
                  mb={1}
                >
                  {label}
                </FormLabel>
                <InputGroup>
                  <Input
                    type={show ? "text" : "password"}
                    placeholder={ph}
                    value={form[key]}
                    onChange={set(key)}
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
                      icon={show ? <FaEyeSlash /> : <FaEye />}
                      onClick={toggle}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            ))}

            <Button
              w="100%"
              h="46px"
              borderRadius="12px"
              bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
              color="white"
              fontWeight={800}
              fontSize="14px"
              mt={2}
              isLoading={loading}
              loadingText="Creating…"
              onClick={submit}
              _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
              transition="all .2s"
            >
              Account Banao
            </Button>

            <Text fontSize="13px" color="#64748b" textAlign="center" mt={5}>
              Pehle se account hai?{" "}
              <Link to="/auth/signin">
                <Text
                  as="span"
                  color="#4a72b8"
                  fontWeight={700}
                  _hover={{ textDecoration: "underline" }}
                >
                  Sign in karein
                </Text>
              </Link>
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
