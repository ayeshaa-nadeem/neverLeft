import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../utils/localStorage";

const PublicRoute = ({ children, restricted }) => {
  return getToken() && restricted ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
