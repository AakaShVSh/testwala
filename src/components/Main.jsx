/**
 * src/components/Main.jsx
 *
 * KEY FIXES:
 *  1. AuthProvider wraps entire app
 *  2. Auth/Layout from new folders (auth/, layout/)
 *  3. TakeTest does NOT get quest prop — reads from useLocation().state
 *  4. No localStorage/setLocalStorage for data
 *  5. Signin/Signup self-contained — no prop drilling
 */
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
import AdminCoachingPage from "./AdminCoachingPage";

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

  const hideLayout =
    isFullScreen ||
    location.pathname === "/auth/signin" ||
    location.pathname === "/auth/signup" ||
    location.pathname === "/auth/forgotPassword" ||
    location.pathname === "/test";

  return (
    <>
      {!hideLayout && <Navbar />}
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home setchoosesub={setchoosesub} />} />
        <Route path="/auth/signin" element={<Signin />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/forgotPassword" element={<ForgotPassword />} />

        {/* TakeTest reads quest+testMeta from location.state — no quest prop */}
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

        {/* <Route path="/admin/coaching" element={<AdminCoachingPage />} /> */}

        <Route path="/tests/token/:token" element={<TokenTestPage />} />
        <Route path="/tests/:id" element={<TestDetailPage />} />
        <Route path="/coaching" element={<CoachingPage />} />
        <Route path="/coaching/:slug" element={<CoachingPage />} />

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
