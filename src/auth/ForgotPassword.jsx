// import React, { useState } from "react";
// import {
//   Box,
//   Flex,
//   Text,
//   FormControl,
//   FormLabel,
//   Input,
//   Button,
//   Alert,
//   AlertIcon,
//   Icon,
//   Progress,
// } from "@chakra-ui/react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaArrowLeft,
//   FaGraduationCap,
//   FaEnvelope,
//   FaKey,
//   FaLock,
// } from "react-icons/fa";
// import { authAPI } from "../services/api";

// const STEPS = ["Email", "OTP", "Naya Password"];
// const ICONS = [FaEnvelope, FaKey, FaLock];

// export default function ForgotPassword() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(0);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [userId, setUserId] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [done, setDone] = useState(false);

//   const step0 = async () => {
//     if (!email.includes("@")) {
//       setError("Valid email daalen");
//       return;
//     }
//     setLoading(true);
//     try {
//       const res = await authAPI.forgotPassword(email);
//       setUserId(res.data?.userId || res.userId || "");
//       setStep(1);
//       setError("");
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const step1 = async () => {
//     if (!otp) {
//       setError("OTP daalen");
//       return;
//     }
//     setLoading(true);
//     try {
//       // Server verifies OTP + sets _reset httpOnly cookie
//       await authAPI.verifyOtp(userId, otp);
//       setStep(2);
//       setError("");
//     } catch (e) {
//       setError(e.message || "OTP galat hai ya expire ho gaya");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const step2 = async () => {
//     if (password.length < 6) {
//       setError("Password min 6 characters");
//       return;
//     }
//     setLoading(true);
//     try {
//       await authAPI.changePassword(password);
//       setDone(true);
//       setTimeout(() => navigate("/auth/signin"), 1500);
//     } catch (e) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlers = [step0, step1, step2];
//   const btnLabels = ["OTP Bhejo", "OTP Verify Karo", "Password Reset Karo"];

//   return (
//     <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
//       <Box bg="linear-gradient(135deg,#0f1e3a,#1e3a5f)" px={6} py={4}>
//         <Flex align="center" gap={2} maxW="1200px" mx="auto">
//           <Icon as={FaGraduationCap} color="white" fontSize="15px" />
//           <Text fontSize="16px" fontWeight={800} color="white">
//             Test
//             <Text as="span" color="#60a5fa">
//               Wala
//             </Text>
//           </Text>
//         </Flex>
//       </Box>

//       <Flex
//         minH="calc(100vh - 60px)"
//         align="center"
//         justify="center"
//         px={4}
//         py={10}
//       >
//         <Box
//           w="100%"
//           maxW="420px"
//           bg="white"
//           borderRadius="20px"
//           boxShadow="0 8px 40px rgba(0,0,0,.1)"
//           border="1px solid #e2e8f0"
//           overflow="hidden"
//         >
//           <Box bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)" px={8} py={7}>
//             <Flex align="center" gap={3} mb={3}>
//               <Flex
//                 w="42px"
//                 h="42px"
//                 bg="rgba(255,255,255,.12)"
//                 borderRadius="12px"
//                 align="center"
//                 justify="center"
//                 flexShrink={0}
//               >
//                 <Icon as={ICONS[step]} color="white" fontSize="18px" />
//               </Flex>
//               <Box>
//                 <Text fontSize="20px" fontWeight={800} color="white">
//                   Password Reset
//                 </Text>
//                 <Text fontSize="12px" color="rgba(255,255,255,.6)">
//                   Step {step + 1}/3 — {STEPS[step]}
//                 </Text>
//               </Box>
//             </Flex>
//             <Progress
//               value={((step + 1) / 3) * 100}
//               size="xs"
//               colorScheme="blue"
//               bg="rgba(255,255,255,.2)"
//               borderRadius="full"
//             />
//           </Box>

//           <Box px={8} py={7}>
//             {done ? (
//               <Alert status="success" borderRadius="10px" fontSize="13px">
//                 <AlertIcon />
//                 Password reset ho gaya! Sign in pe ja rahe hain…
//               </Alert>
//             ) : (
//               <>
//                 {error && (
//                   <Alert
//                     status="error"
//                     borderRadius="10px"
//                     mb={5}
//                     fontSize="13px"
//                   >
//                     <AlertIcon />
//                     {error}
//                   </Alert>
//                 )}

//                 {step === 0 && (
//                   <FormControl>
//                     <FormLabel
//                       fontSize="12px"
//                       fontWeight={700}
//                       color="#374151"
//                       textTransform="uppercase"
//                       letterSpacing=".8px"
//                       mb={1}
//                     >
//                       Email Address
//                     </FormLabel>
//                     <Input
//                       type="email"
//                       placeholder="your@email.com"
//                       value={email}
//                       onChange={(e) => {
//                         setEmail(e.target.value);
//                         setError("");
//                       }}
//                       onKeyDown={(e) => e.key === "Enter" && step0()}
//                       borderRadius="10px"
//                       h="44px"
//                       fontSize="14px"
//                       borderColor="#e2e8f0"
//                       _focus={{
//                         borderColor: "#4a72b8",
//                         boxShadow: "0 0 0 1px #4a72b8",
//                       }}
//                     />
//                   </FormControl>
//                 )}

//                 {step === 1 && (
//                   <FormControl>
//                     <FormLabel
//                       fontSize="12px"
//                       fontWeight={700}
//                       color="#374151"
//                       textTransform="uppercase"
//                       letterSpacing=".8px"
//                       mb={1}
//                     >
//                       Email pe aaya OTP
//                     </FormLabel>
//                     <Input
//                       type="text"
//                       placeholder="6-digit OTP"
//                       value={otp}
//                       onChange={(e) => {
//                         setOtp(e.target.value);
//                         setError("");
//                       }}
//                       onKeyDown={(e) => e.key === "Enter" && step1()}
//                       borderRadius="10px"
//                       h="44px"
//                       fontSize="18px"
//                       fontFamily="monospace"
//                       letterSpacing="4px"
//                       textAlign="center"
//                       borderColor="#e2e8f0"
//                       _focus={{
//                         borderColor: "#4a72b8",
//                         boxShadow: "0 0 0 1px #4a72b8",
//                       }}
//                     />
//                   </FormControl>
//                 )}

//                 {step === 2 && (
//                   <FormControl>
//                     <FormLabel
//                       fontSize="12px"
//                       fontWeight={700}
//                       color="#374151"
//                       textTransform="uppercase"
//                       letterSpacing=".8px"
//                       mb={1}
//                     >
//                       Naya Password
//                     </FormLabel>
//                     <Input
//                       type="password"
//                       placeholder="Min 6 characters"
//                       value={password}
//                       onChange={(e) => {
//                         setPassword(e.target.value);
//                         setError("");
//                       }}
//                       onKeyDown={(e) => e.key === "Enter" && step2()}
//                       borderRadius="10px"
//                       h="44px"
//                       fontSize="14px"
//                       borderColor="#e2e8f0"
//                       _focus={{
//                         borderColor: "#4a72b8",
//                         boxShadow: "0 0 0 1px #4a72b8",
//                       }}
//                     />
//                   </FormControl>
//                 )}

//                 <Button
//                   w="100%"
//                   h="46px"
//                   borderRadius="12px"
//                   mt={6}
//                   bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
//                   color="white"
//                   fontWeight={800}
//                   isLoading={loading}
//                   onClick={handlers[step]}
//                   _hover={{ opacity: 0.9 }}
//                   transition="all .2s"
//                 >
//                   {btnLabels[step]}
//                 </Button>

//                 <Flex justify="center" mt={5}>
//                   <Link to="/auth/signin">
//                     <Flex
//                       align="center"
//                       gap={2}
//                       color="#94a3b8"
//                       _hover={{ color: "#4a72b8" }}
//                     >
//                       <Icon as={FaArrowLeft} fontSize="11px" />
//                       <Text fontSize="13px" fontWeight={600}>
//                         Sign In pe wapas
//                       </Text>
//                     </Flex>
//                   </Link>
//                 </Flex>
//               </>
//             )}
//           </Box>
//         </Box>
//       </Flex>
//     </Box>
//   );
// }

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const T = {
  font: "'Sora','DM Sans','Segoe UI',sans-serif",
  navy: "#0f1e3a",
  navyMid: "#1e3a5f",
  navyLight: "#2d5fa8",
  blue: "#4a72b8",
  accent: "#60a5fa",
  border: "#e2e8f0",
  borderFocus: "#4a72b8",
  muted: "#64748b",
  text: "#374151",
  bg: "#f8fafc",
  white: "#ffffff",
  radius: "12px",
  inputH: "46px",
};

const inputBase = (focused, extra = {}) => ({
  width: "100%",
  height: T.inputH,
  border: `1.5px solid ${focused ? T.borderFocus : T.border}`,
  borderRadius: T.radius,
  padding: "0 14px",
  fontSize: "14px",
  color: T.navy,
  background: T.white,
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.15s",
  fontFamily: T.font,
  boxShadow: focused ? "0 0 0 3px rgba(74,114,184,0.12)" : "none",
  ...extra,
});

const labelBase = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  color: T.text,
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.7px",
};

const STEPS = ["Email", "OTP", "Password"];
const STEP_DESC = [
  "Registered email daalen — hum OTP bhejenge",
  "Email pe aaya 6-digit OTP daalen",
  "Apna naya password set karein",
];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState("");

  const step0 = async () => {
    if (!email.includes("@")) {
      setError("Valid email daalen");
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      setUserId(res.data?.userId || res.userId || "");
      setStep(1);
      setError("");
    } catch (e) {
      setError(e.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  const step1 = async () => {
    if (!otp || otp.length < 4) {
      setError("OTP daalen");
      return;
    }
    setLoading(true);
    try {
      await authAPI.verifyOtp(userId, otp);
      setStep(2);
      setError("");
    } catch (e) {
      setError(e.message || "OTP galat hai ya expire ho gaya");
    } finally {
      setLoading(false);
    }
  };

  const step2 = async () => {
    if (password.length < 6) {
      setError("Password min 6 characters hona chahiye");
      return;
    }
    setLoading(true);
    try {
      await authAPI.changePassword(password);
      setDone(true);
      setTimeout(() => navigate("/auth/signin"), 2000);
    } catch (e) {
      setError(e.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const handlers = [step0, step1, step2];
  const btnLabels = ["OTP Bhejo", "Verify Karo", "Password Reset Karo"];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        fontFamily: T.font,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div
          style={{
            background: T.white,
            borderRadius: "20px",
            boxShadow: "0 8px 40px rgba(15,30,58,0.12)",
            border: `1px solid ${T.border}`,
            overflow: "hidden",
          }}
        >
          {/* ── Header ── */}
          <div
            style={{
              background: `linear-gradient(135deg, ${T.navy}, ${T.navyLight})`,
              padding: "28px 32px 24px",
            }}
          >
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 1.5L13.5 4.5V11.5L8 14.5L2.5 11.5V4.5L8 1.5Z"
                    fill="white"
                    fillOpacity="0.9"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "white",
                  letterSpacing: "-0.2px",
                }}
              >
                Revision Karlo
              </span>
            </div>

            {/* Step indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              {STEPS.map((s, i) => (
                <React.Fragment key={i}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        background:
                          i < step
                            ? "#22c55e"
                            : i === step
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(255,255,255,0.15)",
                        border: `2px solid ${i < step ? "#22c55e" : i === step ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 800,
                        color:
                          i < step
                            ? "white"
                            : i === step
                              ? T.navy
                              : "rgba(255,255,255,0.5)",
                        transition: "all 0.25s",
                        flexShrink: 0,
                      }}
                    >
                      {i < step ? "✓" : i + 1}
                    </div>
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 700,
                        color:
                          i === step
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.35)",
                        letterSpacing: "0.3px",
                        textTransform: "uppercase",
                      }}
                    >
                      {s}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      style={{
                        flex: 1,
                        height: "2px",
                        background:
                          i < step ? "#22c55e" : "rgba(255,255,255,0.15)",
                        margin: "0 6px 14px",
                        transition: "background 0.3s",
                      }}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            <h1
              style={{
                fontSize: "clamp(18px,4vw,22px)",
                fontWeight: 800,
                color: "white",
                margin: "0 0 4px",
                letterSpacing: "-0.4px",
              }}
            >
              {done
                ? "Password reset ho gaya!"
                : step === 0
                  ? "Password Reset"
                  : step === 1
                    ? "OTP Verify Karo"
                    : "Naya Password Set Karo"}
            </h1>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.5)",
                margin: 0,
              }}
            >
              {done ? "Sign in pe redirect ho rahe hain…" : STEP_DESC[step]}
            </p>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "24px 32px 28px" }}>
            {done ? (
              /* Success */
              <div style={{ textAlign: "center", padding: "12px 0 8px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    background: "#f0fdf4",
                    border: "2px solid #bbf7d0",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    fontSize: "22px",
                  }}
                >
                  ✓
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: T.muted,
                    margin: "0 0 20px",
                  }}
                >
                  Aapka password successfully reset ho gaya.
                </p>
                <Link
                  to="/auth/signin"
                  style={{
                    display: "inline-block",
                    padding: "10px 24px",
                    background: `linear-gradient(135deg, ${T.blue}, ${T.navy})`,
                    color: "white",
                    borderRadius: T.radius,
                    fontSize: "13px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Sign In karein
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: 500,
                      marginBottom: "16px",
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1px solid #fecaca",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="currentColor"
                    >
                      <path d="M7 0a7 7 0 100 14A7 7 0 007 0zm.75 10.5h-1.5v-1.5h1.5v1.5zm0-3h-1.5V3.5h1.5V7.5z" />
                    </svg>
                    {error}
                  </div>
                )}

                {/* Step 0: Email */}
                {step === 0 && (
                  <div style={{ marginBottom: "22px" }}>
                    <label style={labelBase}>Email Address</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      onFocus={() => setFocused("email")}
                      onBlur={() => setFocused("")}
                      onKeyDown={(e) => e.key === "Enter" && step0()}
                      style={inputBase(focused === "email")}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                )}

                {/* Step 1: OTP */}
                {step === 1 && (
                  <div style={{ marginBottom: "14px" }}>
                    <label style={labelBase}>
                      OTP
                      <span
                        style={{
                          fontSize: "10px",
                          color: T.muted,
                          fontWeight: 400,
                          textTransform: "none",
                          letterSpacing: 0,
                          marginLeft: "8px",
                        }}
                      >
                        {email} pe bheja gaya
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="• • • • • •"
                      value={otp}
                      maxLength={6}
                      onChange={(e) => {
                        setOtp(e.target.value.replace(/\D/g, ""));
                        setError("");
                      }}
                      onFocus={() => setFocused("otp")}
                      onBlur={() => setFocused("")}
                      onKeyDown={(e) => e.key === "Enter" && step1()}
                      style={inputBase(focused === "otp", {
                        fontSize: "20px",
                        letterSpacing: "12px",
                        textAlign: "center",
                        fontFamily: "monospace",
                      })}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setStep(0);
                        setOtp("");
                        setError("");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        color: T.blue,
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer",
                        padding: "8px 0 0",
                        fontFamily: T.font,
                        display: "block",
                      }}
                    >
                      ← Dobara OTP bhejo
                    </button>
                    <div style={{ marginBottom: "8px" }} />
                  </div>
                )}

                {/* Step 2: New password */}
                {step === 2 && (
                  <div style={{ marginBottom: "22px" }}>
                    <label style={labelBase}>Naya Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPw ? "text" : "password"}
                        placeholder="Min 8 characters"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError("");
                        }}
                        onFocus={() => setFocused("pw")}
                        onBlur={() => setFocused("")}
                        onKeyDown={(e) => e.key === "Enter" && step2()}
                        style={inputBase(focused === "pw", {
                          paddingRight: "44px",
                        })}
                        autoComplete="new-password"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((p) => !p)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                          padding: "4px",
                          display: "flex",
                        }}
                      >
                        {showPw ? (
                          <svg
                            width="15"
                            height="15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg
                            width="15"
                            height="15"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                          >
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {password && password.length < 6 && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#ef4444",
                          margin: "5px 0 0",
                          fontWeight: 600,
                        }}
                      >
                        Min 6 characters chahiye
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={handlers[step]}
                  disabled={loading}
                  style={{
                    width: "100%",
                    height: "46px",
                    background: `linear-gradient(135deg, ${T.blue}, ${T.navy})`,
                    color: "white",
                    border: "none",
                    borderRadius: T.radius,
                    fontSize: "14px",
                    fontWeight: 800,
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "opacity 0.15s",
                    fontFamily: T.font,
                    opacity: loading ? 0.75 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) e.currentTarget.style.opacity = "0.88";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = loading ? "0.75" : "1";
                  }}
                >
                  {loading ? "Processing…" : btnLabels[step]}
                </button>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "16px",
                  }}
                >
                  <Link
                    to="/auth/signin"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "12px",
                      color: T.muted,
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Sign In pe wapas
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}