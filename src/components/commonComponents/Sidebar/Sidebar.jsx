import React, { useState } from "react";
import { NavLink, useNavigate, useParams, useLocation } from "react-router-dom";
import { FaHome, FaCity, FaChartLine } from "react-icons/fa";
import { message } from "antd";
import {
  LogoutOutlined,
  PictureOutlined,
  FileOutlined,
  EditOutlined,
  FormOutlined,
  UserOutlined,
  CrownFilled
} from "@ant-design/icons";
import { deleteToken } from "../../../utils/localStorage";
import siteLogo from "../../../assets/images/NLlogo.svg";
import "./Sidebar.scss";

const Sidebar = ({ children, sidebarStatus }) => {
  const location = useLocation();
  const pathName = location.pathname;
  const navigate = useNavigate();
  const { id } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    {
      path: "/home",
      name: "Home",
      icon: <FaHome />,
    },
    {
      path: "/institution",
      name: "Institutes",
      icon: <FaCity />,
    },
    {
      path: "/club",
      name: "Clubs",
      icon: <CrownFilled />,
    },
  ];
  const InstituteMenuItem = [
    {
      path: "/home",
      name: "Home",
      icon: <FaHome />,
    },
    {
      path: `/institute/idcustomisation/${id}`,
      name: "ID Customisation",
      icon: <EditOutlined />,
    },
    {
      path: `/institute/instituteLogogallery/${id}`,
      name: "Logo Gallery",
      icon: <PictureOutlined />,
    },
    {
      path: `/institute/informationFiles/${id}`,
      name: "Information Files",
      icon: <FileOutlined />,
    },
  ];
  const ClubMenuItem = [
    {
      path: "/home",
      name: "Home",
      icon: <FaHome />,
    },
    {
      path: `/club/ticketcustomisation/${id}`,
      name: "Ticket Customisation",
      icon: <FormOutlined />,
    },
    {
      path: `/club/clubLogogallery/${id}`,
      name: "Logo Gallery",
      icon: <PictureOutlined />,
    },
    {
      path: `/club/manager/${id}`,
      name: "Manager",
      icon: <UserOutlined />,
    },
  ];

  const AnalyticsMenuItem = [
    {
      path: "/home",
      name: "Home",
      icon: <FaHome />,
    },
    {
      path: "/analytics",
      name: "Analytics",
      icon: <FaChartLine />,
    },
    {
      path: "/analytics/clubAnalytics",
      name: "Club Analytics",
      icon: <FaCity />,
    },
    {
      path: "/analytics/instituteAnalytics",
      name: "Institute Analytics",
      icon: <CrownFilled />,
    },
    {
      path: "/analytics/analyticUsers",
      name: "Analytic Users",
      icon: <UserOutlined />,
    },
  ]

  const logout = () => {
    deleteToken();
    message.success("Logout successfully");
    navigate("/login");
  };

  return (
    <div className="container">
      <div
        style={{
          width: isOpen ? "350px" : "80px",
        }}
        className="sidebar"
      >
        <div className="top_section">
          <div className="bars">
            <img
              src={siteLogo}
              onClick={toggle}
              className={`${ isOpen ? "sidebarOpen" : "sidebarClose" }`}
            />
          </div>
        </div>
        <div className="sidebarContentStyle">
          <div>
            {sidebarStatus === "club"
              ? ClubMenuItem.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className="link"
                  activeclassName="active"
                  style={{ justifyContent: isOpen ? "flex-start" : "center" }}
                >
                  <div className="icon">{item.icon}</div>
                  <div
                    style={{ display: isOpen ? "block" : "none" }}
                    className="link_text"
                  >
                    {item.name}
                  </div>
                </NavLink>
              ))
              : sidebarStatus === "institute"
                ? InstituteMenuItem.map((item, index) => (
                  <NavLink
                    to={item.path}
                    key={index}
                    className="link"
                    activeclassName="active"
                    style={{ justifyContent: isOpen ? "flex-start" : "center" }}
                  >
                    <div className="icon">{item.icon}</div>
                    <div
                      style={{ display: isOpen ? "block" : "none" }}
                      className="link_text"
                    >
                      {item.name}
                    </div>
                  </NavLink>
                ))
                : sidebarStatus === "analytics"
                  ? AnalyticsMenuItem.map((item, index) => (
                    <NavLink
                      to={item.path}
                      key={index}
                      className="link"
                      activeclassName="active"
                      style={{ justifyContent: isOpen ? "flex-start" : "center" }}
                    >
                      <div className="icon">{item.icon}</div>
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        {item.name}
                      </div>
                    </NavLink>
                  ))

                  : menuItem.map((item, index) => (
                    <NavLink
                      to={item.path}
                      key={index}
                      className="link"
                      activeclassName="active"
                      style={{ justifyContent: isOpen ? "flex-start" : "center" }}
                    >
                      <div className="icon">{item.icon}</div>
                      <div
                        style={{ display: isOpen ? "block" : "none" }}
                        className="link_text"
                      >
                        {item.name}
                      </div>
                    </NavLink>
                  ))}
          </div>
          <div>
            <div
              style={{
                color: "black",
                justifyContent: isOpen ? "flex-start" : "center",
              }}
              className="logoutstyle"
              onClick={logout}
            >
              <div className="icon">
                <LogoutOutlined />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className="link_text"
              >
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
};

export default Sidebar;
