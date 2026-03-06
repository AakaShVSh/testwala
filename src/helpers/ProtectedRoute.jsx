import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <Flex minH="80vh" align="center" justify="center">
        <Spinner size="xl" color="#4a72b8" thickness="4px" />
      </Flex>
    );
  if (!user)
    return (
      <Navigate
        to={`/auth/signin?redirect=${encodeURIComponent(location.pathname + location.search)}`}
        replace
      />
    );
  return children;
}
