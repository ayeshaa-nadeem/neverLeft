/* eslint-disable no-console */
import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/commonComponents/Sidebar/Sidebar";
import { getToken } from "../utils/localStorage";

const PrivateRoute = ({ children,sidebar }) => {
  return getToken() ? <Sidebar sidebarStatus={sidebar}>{children}</Sidebar> : <Navigate to="/login" />;
};

export default PrivateRoute;
