import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { AuthProvider } from "../context/AuthContext";
import ScrollToTop from "../helpers/ScrollToTop";
import ProtectedRoute from "../helpers/ProtectedRoute";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Signin from "../auth/Signin";
import Signup from "../auth/Signup";
import ForgotPassword from "../auth/ForgotPassword";
import Home from "./Home";
import MathQuestionlist from "./MathQuestionlist";
import TakeTest from "./TakeTest";
import ResultPage from "./ResultPage";
import ReviewTest from "./ReviewTest";
import SubmitTest from "./SubmitTest";
import CoachingPage from "./CoachingPage";
import TestDetailPage from "./TestDetailPage";
import TokenTestPage from "./TokenTestPage";
import UserTestDataList from "./UserTestDataList";
import SavedPage from "./SavedData";
import SaveQuestion from "./SaveQuestion";

// ── Admin pages ──────────────────────────────────────────────────────────────
import AdminCoachingPage from "./AdminCoachingPage";
import AdminTestRequestsPage from "./AdminTestRequestsPage";
import AdminDashboardPage from "./AdminDashboardPage";
import AdminUsersPage from "./AdminUsersPage";
import AdminTestsPage from "./AdminTestsPage";

// ── Info pages ───────────────────────────────────────────────────────────────
import AboutUs from "./AboutUs";
import TermsAndConditions from "./TermsAndConditions";
import PrivacyPolicy from "./PrivacyPolicy";
import Feedback from "./Feedback";

// const BASE_URL = "http://localhost:8080";
const BASE_URL = "https://testwala-backend.onrender.com";

function AppShell() {
  const location = useLocation();
  const toast = useToast();
  const [quest, setQuestions] = useState([]);
  const [questionCategory, setQuestionsCategory] = useState([]);
  const [testTitle, settestTitle] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [chooseSub, setchoosesub] = useState("");
  const [currentSub, setCurrentSub] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFullScreen = (isFull) => {
    setIsFullScreen(isFull);
    if (isFull) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  useEffect(() => {
    if (!chooseSub) return;
    setCurrentSub(chooseSub);
    setchoosesub("");
    setIsLoading(true);
    fetch(`${BASE_URL}/questions?subject=${chooseSub}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((d) => {
        const docs = d?.data ?? d ?? [];
        setQuestionsCategory(docs);
        setQuestions(docs);
        toast({
          title: "Questions loaded",
          status: "success",
          duration: 2000,
          position: "top-right",
        });
      })
      .catch((err) =>
        toast({
          title: "Failed to load questions",
          description: err.message,
          status: "error",
          duration: 4000,
          position: "top-right",
        }),
      )
      .finally(() => setIsLoading(false));
  }, [chooseSub, toast]);

  // Admin routes use their own layout — hide global Navbar/Footer
  const isAdminRoute = location.pathname.startsWith("/admin");

  const hideLayout =
    isFullScreen ||
    isAdminRoute ||
    location.pathname === "/auth/signin" ||
    location.pathname === "/auth/signup" ||
    location.pathname === "/auth/forgotPassword" ||
    location.pathname === "/test";

  return (
    <>
      {!hideLayout && <Navbar />}
      <ScrollToTop />
      <Routes>
        {/* ── Public / Student routes ────────────────────────────────── */}
        <Route path="/" element={<Home setchoosesub={setchoosesub} />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/forgotPassword" element={<ForgotPassword />} />
        <Route
          path="/test"
          element={<TakeTest handleFullScreen={handleFullScreen} />}
        />
        <Route path="/test-result" element={<ResultPage />} />
        <Route path="/SubmitTest" element={<SubmitTest />} />
        <Route
          path="/Review-Test"
          element={
            <ProtectedRoute>
              <ReviewTest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questionList"
          element={
            <MathQuestionlist
              currentSub={currentSub}
              chooseSub={chooseSub}
              category={questionCategory}
              handleFullScreen={handleFullScreen}
              setQuestions={setQuestions}
              settestTitle={settestTitle}
              isLoading={isLoading}
            />
          }
        />

        {/* ── Tests & Coaching ───────────────────────────────────────── */}
        <Route path="/tests/token/:token" element={<TokenTestPage />} />
        <Route path="/tests/:id" element={<TestDetailPage />} />
        <Route path="/coaching" element={<CoachingPage />} />
        <Route path="/coaching/:slug" element={<CoachingPage />} />

        {/* ── Info pages ─────────────────────────────────────────────── */}
        <Route path="/about" element={<AboutUs />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/feedback" element={<Feedback />} />

        {/* ── Protected student routes ───────────────────────────────── */}
        <Route
          path="/UserTestData"
          element={
            <ProtectedRoute>
              <UserTestDataList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/savedData"
          element={
            <ProtectedRoute>
              <SavedPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Saved-Question"
          element={
            <ProtectedRoute>
              <SaveQuestion />
            </ProtectedRoute>
          }
        />

        {/* ── Admin routes (each page handles its own sidebar layout) ── */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/coaching" element={<AdminCoachingPage />} />
        <Route
          path="/admin/test-requests"
          element={<AdminTestRequestsPage />}
        />
        <Route path="/admin/tests" element={<AdminTestsPage />} />
      </Routes>
      {!hideLayout && <Footer />}
    </>
  );
}

export default function Main() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
