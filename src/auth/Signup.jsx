// import React, { useState, useEffect } from "react";
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
//   InputGroup,
//   InputRightElement,
//   IconButton,
//   Icon,
// } from "@chakra-ui/react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { FaEye, FaEyeSlash, FaGraduationCap } from "react-icons/fa";
// import { useAuth } from "../context/AuthContext";

// export default function Signup() {
//   const navigate = useNavigate();
//   const [params] = useSearchParams(); // ← read ?redirect=
//   const { user, signUp } = useAuth();

//   const [form, setForm] = useState({
//     Name: "",
//     Email: "",
//     Password: "",
//     confirm: "",
//   });
//   const [showPw, setShowPw] = useState(false);
//   const [showCf, setShowCf] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [ok, setOk] = useState(false);

//   // Already logged in → respect redirect param, else go home
//   useEffect(() => {
//     if (user) navigate(params.get("redirect") || "/", { replace: true });
//   }, [user, navigate, params]);

//   const set = (k) => (e) => {
//     setForm((p) => ({ ...p, [k]: e.target.value }));
//     setError("");
//   };

//   const submit = async () => {
//     const { Name, Email, Password, confirm } = form;
//     if (!Name || !Email || !Password || !confirm) {
//       setError("Sabhi fields fill karein");
//       return;
//     }
//     if (!Email.includes("@")) {
//       setError("Valid email daalen");
//       return;
//     }
//     if (Password.length < 6) {
//       setError("Password min 6 characters");
//       return;
//     }
//     if (Password !== confirm) {
//       setError("Passwords match nahi karte");
//       return;
//     }

//     setLoading(true);
//     try {
//       await signUp({ Name, Email, Password });
//       setOk(true);
//       // ← respect redirect param (e.g. back to test detail page)
//       navigate(params.get("redirect") || "/", { replace: true });
//     } catch (err) {
//       setError(err.message || "Registration failed");
//       setLoading(false);
//     }
//   };

//   return (
//     <Box minH="100vh" bg="#f8fafc" fontFamily="'Sora',sans-serif">
//       <Box bg="linear-gradient(135deg,#0f1e3a,#1e3a5f)" px={6} py={4}>
//         <Flex align="center" gap={2} maxW="1200px" mx="auto">
//           <Flex
//             w="32px"
//             h="32px"
//             bg="rgba(255,255,255,.15)"
//             borderRadius="8px"
//             align="center"
//             justify="center"
//           >
//             <Icon as={FaGraduationCap} color="white" fontSize="15px" />
//           </Flex>
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
//           maxW="440px"
//           bg="white"
//           borderRadius="20px"
//           boxShadow="0 8px 40px rgba(0,0,0,.1)"
//           border="1px solid #e2e8f0"
//           overflow="hidden"
//         >
//           <Box bg="linear-gradient(135deg,#0f1e3a,#2d5fa8)" px={8} py={7}>
//             <Text fontSize="24px" fontWeight={800} color="white" mb={1}>
//               Account banao ✨
//             </Text>
//             <Text fontSize="13px" color="rgba(255,255,255,.6)">
//               Lakho students ke saath join karein
//             </Text>
//           </Box>

//           <Box px={8} py={7}>
//             {(error || ok) && (
//               <Alert
//                 status={ok ? "success" : "error"}
//                 borderRadius="10px"
//                 mb={5}
//                 fontSize="13px"
//               >
//                 <AlertIcon />
//                 {ok ? "Account ban gaya! Redirecting…" : error}
//               </Alert>
//             )}

//             {[
//               {
//                 key: "Name",
//                 label: "Full Name",
//                 type: "text",
//                 ph: "Aapka naam",
//               },
//               {
//                 key: "Email",
//                 label: "Email",
//                 type: "email",
//                 ph: "you@example.com",
//               },
//             ].map(({ key, label, type, ph }) => (
//               <FormControl key={key} mb={4}>
//                 <FormLabel
//                   fontSize="12px"
//                   fontWeight={700}
//                   color="#374151"
//                   textTransform="uppercase"
//                   letterSpacing=".8px"
//                   mb={1}
//                 >
//                   {label}
//                 </FormLabel>
//                 <Input
//                   type={type}
//                   placeholder={ph}
//                   value={form[key]}
//                   onChange={set(key)}
//                   onKeyDown={(e) => e.key === "Enter" && submit()}
//                   borderRadius="10px"
//                   h="44px"
//                   fontSize="14px"
//                   borderColor="#e2e8f0"
//                   _focus={{
//                     borderColor: "#4a72b8",
//                     boxShadow: "0 0 0 1px #4a72b8",
//                   }}
//                 />
//               </FormControl>
//             ))}

//             {[
//               {
//                 key: "Password",
//                 label: "Password",
//                 show: showPw,
//                 toggle: () => setShowPw((p) => !p),
//                 ph: "Min 6 characters",
//               },
//               {
//                 key: "confirm",
//                 label: "Confirm Password",
//                 show: showCf,
//                 toggle: () => setShowCf((p) => !p),
//                 ph: "Dobara daalen",
//               },
//             ].map(({ key, label, show, toggle, ph }) => (
//               <FormControl key={key} mb={4}>
//                 <FormLabel
//                   fontSize="12px"
//                   fontWeight={700}
//                   color="#374151"
//                   textTransform="uppercase"
//                   letterSpacing=".8px"
//                   mb={1}
//                 >
//                   {label}
//                 </FormLabel>
//                 <InputGroup>
//                   <Input
//                     type={show ? "text" : "password"}
//                     placeholder={ph}
//                     value={form[key]}
//                     onChange={set(key)}
//                     onKeyDown={(e) => e.key === "Enter" && submit()}
//                     borderRadius="10px"
//                     h="44px"
//                     fontSize="14px"
//                     borderColor="#e2e8f0"
//                     _focus={{
//                       borderColor: "#4a72b8",
//                       boxShadow: "0 0 0 1px #4a72b8",
//                     }}
//                   />
//                   <InputRightElement h="44px">
//                     <IconButton
//                       size="sm"
//                       variant="ghost"
//                       aria-label="toggle"
//                       icon={show ? <FaEyeSlash /> : <FaEye />}
//                       onClick={toggle}
//                     />
//                   </InputRightElement>
//                 </InputGroup>
//               </FormControl>
//             ))}

//             <Button
//               w="100%"
//               h="46px"
//               borderRadius="12px"
//               bg="linear-gradient(135deg,#4a72b8,#1e3a5f)"
//               color="white"
//               fontWeight={800}
//               fontSize="14px"
//               mt={2}
//               isLoading={loading}
//               loadingText="Creating…"
//               onClick={submit}
//               _hover={{ opacity: 0.9, transform: "translateY(-1px)" }}
//               transition="all .2s"
//             >
//               Account Banao
//             </Button>

//             <Text fontSize="13px" color="#64748b" textAlign="center" mt={5}>
//               Pehle se account hai?{" "}
//               <Link to="/auth/signin">
//                 <Text
//                   as="span"
//                   color="#4a72b8"
//                   fontWeight={700}
//                   _hover={{ textDecoration: "underline" }}
//                 >
//                   Sign in karein
//                 </Text>
//               </Link>
//             </Text>
//           </Box>
//         </Box>
//       </Flex>
//     </Box>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

const getStrength = (pw) => {
  if (!pw) return { score: 0, label: "", color: T.border };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: "", color: T.border },
    { label: "Weak", color: "#ef4444" },
    { label: "Fair", color: "#f97316" },
    { label: "Good", color: "#eab308" },
    { label: "Strong", color: "#22c55e" },
  ];
  return { score: s, ...map[s] };
};

const EyeIcon = ({ open }) =>
  open ? (
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
  );

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
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
  const [focused, setFocused] = useState("");

  useEffect(() => {
    if (user) navigate(params.get("redirect") || "/", { replace: true });
  }, [user, navigate, params]);

  const set = (k) => (e) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    setError("");
  };
  const strength = getStrength(form.Password);
  const mismatch = form.confirm && form.Password !== form.confirm;

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
      setError("Password min 6 characters hona chahiye");
      return;
    }
    if (Password !== confirm) {
      setError("Passwords match nahi karte");
      return;
    }
    setLoading(true);
    try {
      await signUp({ Name, Email, Password });
      setOk(true);
      navigate(params.get("redirect") || "/", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed");
      setLoading(false);
    }
  };

  const eyeBtn = {
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
  };

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
            <h1
              style={{
                fontSize: "clamp(20px,4vw,24px)",
                fontWeight: 800,
                color: "white",
                margin: "0 0 5px",
                letterSpacing: "-0.5px",
              }}
            >
              Account banao ✨
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.55)",
                margin: 0,
              }}
            >
              Lakho students ke saath join karein
            </p>
          </div>

          {/* ── Body ── */}
          <div style={{ padding: "24px 32px 28px" }}>
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
            {ok && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 500,
                  marginBottom: "16px",
                  background: "#f0fdf4",
                  color: "#16a34a",
                  border: "1px solid #bbf7d0",
                }}
              >
                ✓ Account ban gaya! Redirecting…
              </div>
            )}

            {/* Name */}
            <div style={{ marginBottom: "14px" }}>
              <label style={labelBase}>Full Name</label>
              <input
                type="text"
                placeholder="Aapka poora naam"
                value={form.Name}
                onChange={set("Name")}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused("")}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                style={inputBase(focused === "name")}
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: "14px" }}>
              <label style={labelBase}>Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.Email}
                onChange={set("Email")}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                style={inputBase(focused === "email")}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "6px" }}>
              <label style={labelBase}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={form.Password}
                  onChange={set("Password")}
                  onFocus={() => setFocused("pw")}
                  onBlur={() => setFocused("")}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  style={inputBase(focused === "pw", { paddingRight: "44px" })}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  style={eyeBtn}
                >
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>

            {/* Strength bar */}
            {form.Password && (
              <div style={{ marginBottom: "12px" }}>
                <div
                  style={{ display: "flex", gap: "3px", marginBottom: "4px" }}
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: "3px",
                        borderRadius: "2px",
                        background:
                          i <= strength.score ? strength.color : "#f1f5f9",
                        transition: "background 0.2s",
                      }}
                    />
                  ))}
                </div>
                {strength.label && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: strength.color,
                      fontWeight: 600,
                    }}
                  >
                    {strength.label}
                  </span>
                )}
              </div>
            )}

            {/* Confirm password */}
            <div style={{ marginBottom: "22px" }}>
              <label style={labelBase}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCf ? "text" : "password"}
                  placeholder="Dobara daalen"
                  value={form.confirm}
                  onChange={set("confirm")}
                  onFocus={() => setFocused("cf")}
                  onBlur={() => setFocused("")}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  style={inputBase(focused === "cf", {
                    paddingRight: "44px",
                    borderColor: mismatch
                      ? "#fca5a5"
                      : focused === "cf"
                        ? T.borderFocus
                        : T.border,
                    boxShadow: mismatch
                      ? "0 0 0 3px rgba(252,165,165,0.2)"
                      : focused === "cf"
                        ? "0 0 0 3px rgba(74,114,184,0.12)"
                        : "none",
                  })}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCf((p) => !p)}
                  style={eyeBtn}
                >
                  <EyeIcon open={showCf} />
                </button>
              </div>
              {mismatch && (
                <p
                  style={{
                    fontSize: "11px",
                    color: "#ef4444",
                    margin: "5px 0 0",
                    fontWeight: 600,
                  }}
                >
                  Passwords match nahi karte
                </p>
              )}
            </div>

            <button
              onClick={submit}
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
              {loading ? "Creating account…" : "Account Banao"}
            </button>

            <p
              style={{
                textAlign: "center",
                fontSize: "13px",
                color: T.muted,
                margin: "18px 0 0",
              }}
            >
              Pehle se account hai?{" "}
              <Link
                to="/auth/signin"
                style={{
                  color: T.blue,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Sign in karein
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}