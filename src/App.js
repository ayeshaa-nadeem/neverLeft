import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Institutions,
  Club,
  InstituteDetail,
  ClubDetail,
  LogoGallery,
  InformationFiles,
  IDcustomisation,
  TicketCustomisation,
  ClubLogoGallery,
  Manager,
  ManagerDetail,
  StudentInformation,
  Analytics,
  ClubAnalytics,
  InstituteAnalytics,
  AnalyticsUsers,
} from "./components/mainComponents";
import { Login } from "./components/authComponents";
import PrivateRoute from "./route/PrivateRouting";
import PublicRoute from "./route/PublicRouting";
import "./assets/fonts/OpenSans-Regular.ttf";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/studentInformation"
            element={
              <PublicRoute>
                <StudentInformation />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute restricted={true}>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/institution"
            element={
              <PrivateRoute status={true}>
                <Institutions />
              </PrivateRoute>
            }
          />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/club"
            element={
              <PrivateRoute status={false}>
                <Club />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <PrivateRoute status={false} sidebar={"analytics"}>
                <Analytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics/clubAnalytics"
            element={
              <PrivateRoute status={false} sidebar={"analytics"}>
                <ClubAnalytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics/instituteAnalytics"
            element={
              <PrivateRoute status={false} sidebar={"analytics"}>
                <InstituteAnalytics />
              </PrivateRoute>
            }
          />
          <Route
            path="/analytics/analyticUsers"
            element={
              <PrivateRoute status={false} sidebar={"analytics"}>
                <AnalyticsUsers />
              </PrivateRoute>
            }
          />
          <Route
            path="/institute/institutiondetail/:id"
            element={
              <PrivateRoute status={false} sidebar={"institute"}>
                <InstituteDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/club/clubdetail/:id"
            element={
              <PrivateRoute status={false} sidebar={"club"}>
                <ClubDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/institute/instituteLogogallery/:id"
            element={
              <PrivateRoute status={false} sidebar={"institute"}>
                <LogoGallery />
              </PrivateRoute>
            }
          />
          <Route
            path="/institute/informationFiles/:id"
            element={
              <PrivateRoute status={false} sidebar={"institute"}>
                <InformationFiles />
              </PrivateRoute>
            }
          />
          <Route
            path="/institute/idcustomisation/:id"
            element={
              <PrivateRoute status={false} sidebar={"institute"}>
                <IDcustomisation />
              </PrivateRoute>
            }
          />
          <Route
            path="/club/ticketcustomisation/:id"
            element={
              <PrivateRoute status={false} sidebar={"club"}>
                <TicketCustomisation />
              </PrivateRoute>
            }
          />
          <Route
            path="/club/clubLogogallery/:id"
            element={
              <PrivateRoute status={false} sidebar={"club"}>
                <ClubLogoGallery />
              </PrivateRoute>
            }
          />
          <Route
            path="/club/manager/:id"
            element={
              <PrivateRoute status={false} sidebar={"club"}>
                <Manager />
              </PrivateRoute>
            }
          />
          <Route
            path="/club/manager/managerDetail/:id"
            element={
              <PrivateRoute status={false} sidebar={"club"}>
                <ManagerDetail />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
