import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Spin } from "antd";
import { getApiWithAuth } from "../../../utils/api";
import { Url } from "../../../utils/apiUrl";
import student from "../../../assets/images/student.svg";
import QrCode from "./QrCode";
import "./StudentInformation.scss";

const StudentInformation = () => {
  let [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setisLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState([]);
  const [color, setColor] = useState("");
  const [isLogo, setIsLogo] = useState([]);
  const getAllStudenInfo = async () => {
    setisLoading(true);

    const response = await getApiWithAuth(
      `${Url.studentInfo}${searchParams.get("id") ? searchParams.get("id") : "63aeb22cb9f27c5bd75948d7"}`
    );
    setColor(response.data.data[response.data.data.length - 1].backgroundColor);
    if (!response.success) {
      setisLoading(false);
      return;
    }
    setIsLogo(response.data.logoUrl.logo);
    setStudentInfo(response.data.data);
    setisLoading(false);
  };

  useEffect(() => {
    getAllStudenInfo();
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <div className="studentInfoContainer">
        <div className="studenInfoContainer">
          <div className="studentInfoImgdiv">
            <img src={student} />
          </div>
          <div className="studentInfoContent" style={{ backgroundColor: color }}>
            <div style={{ backgroundColor: color }} className="studenOuterCrdParent" >
              <div className="studenOuterCrd">
                <div className="studentCard">
                  <div className="studentDataContainer">
                    <div className="studentStyling">
                      {isLoading ? (
                        <div className="studentSpiner">
                          <Spin size="large" />
                        </div>
                      ) : (
                        studentInfo.filter((dataItem) => typeof dataItem.key != "undefined").map((item) => {
                          return (
                            <div className="studentData" key={item.key}>
                              <div className="studentName">
                                <div className="studentApiName">
                                  {item.label}
                                </div>
                              </div>
                              <div className="studentValue">
                                <div className="studntApiData">
                                  {item.dummyData}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="studetLogoContainer">
                  <div className="universityLOgo">
                    <img src={isLogo?.logo} />
                  </div>
                  <div className="scanner">
                    <QrCode />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentInformation;
