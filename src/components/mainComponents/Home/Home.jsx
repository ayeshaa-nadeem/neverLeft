import React from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "antd";
import insttutionImg from "../../../assets/images/colorInstitution.svg";
import clubImg from "../../../assets/images/coloredClubs.svg";
import dataQualityImg from "../../../assets/images/Data Quality.svg";

import "./Home.scss";
const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="homeContainer">
      <div className="homeInnerContainer">
        <Row>
          <Col span={24}>
            <div className="homePoweredText">
              <span className="poweredText">
                POWERED BY NEVERLEFT DIGITAL LTD.
              </span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="homePageOuterContainer">
              <div>
                <div className="homepageHeading">
                  <h1>HOME PAGE</h1>
                </div>
              </div>
              <Row gutter={[48, 16]}>
                <Col span={8}>
                  <div>
                    <div
                      className="card1"
                      onClick={() => {
                        navigate("/institution");
                      }}
                    >
                      <div className="cardStyling">
                        <div className="instImg">
                          <img src={insttutionImg} />
                        </div>
                        <h1 className="institution">Institution</h1>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <div
                      className="card1"
                      onClick={() => {
                        navigate("/club");
                      }}
                    >
                      <div className="cardStyling">
                        <div className="imgContainerClub">
                          <img src={clubImg} />
                        </div>
                        <h1 className="institution">Club</h1>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col span={8}>
                  <div>
                    <div 
                    className="card1"
                    onClick={()=> navigate("/analytics")}
                    >
                      <div className="cardStyling">
                        <div className="imgContainer">
                          <img src={dataQualityImg} />
                        </div>
                        <h1 className="institution"> Platform Usage Data</h1>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;
