import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Form, Modal, message, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { Url } from "../../../utils/apiUrl";
import { NLBtn, InputField } from "../../commonComponents";
import "./Club.scss";

const Club = () => {
  const navigate = useNavigate();
  const boolVariable = true;
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [clubs, setClubs] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [clubData, setClubData] = useState({
    name: "",
    address: "",
  });

  const showModal1 = () => {
    setIsModalOpen1(true);
  };

  const handleOk1 = async () => {
    setIsModalOpen1(false);
    const response = await postApiWithAuth(Url.clubsUrl, clubData);
    if (!response.success) {
      message.error(response);
      return;
    }
    message.success("club created successfully");
    getClubs();
    window.location.reload(false);
  };

  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

  const getClubs = async () => {
    setisLoading(true);
    const response = await getApiWithAuth(Url.clubsUrl);
    if (!response.success) {
      setisLoading(false);
      return;
    }
    setisLoading(false);
    setClubs(response.data);
  };

  const onChangeValue = (event) => {
    const { value, name } = event.target;

    setClubData({ ...clubData, [name]: value });
  };

  useEffect(() => {
    getClubs();
  }, []);

  return (
    <div className="clubContainer">
      <div className="clubInnerContainer">
        <Row>
          <Col span={24}>
            <div className="clubPoweredText">
              <div className="arrowStyling">
                <Link to={"/home"}>
                  <ArrowLeftOutlined />
                </Link>
                <span className="clubpoweredText">
                  POWERED BY NEVERLEFT DIGITAL LTD.
                </span>
              </div>
              <div className="clubNLBtnStyling">
                <Modal
                  title="Create New Club"
                  open={isModalOpen1}
                  onOk={handleOk1}
                  onCancel={handleCancel1}
                  okButtonProps={{ disabled: buttonDisabled }}
                  okText="Create"
                  footer={null}
                >
                  <Form
                    onFieldsChange={() => {
                      if (clubData.name !== "" && clubData.address !== "") {
                        setButtonDisabled(false);
                      } else {
                        setButtonDisabled(true);
                      }
                    }}
                  >
                    <div className="modalInputStyling">
                      <span className="clubFieldsStyling">Name:</span>
                      <Form.Item
                        name={"name"}
                        rules={[
                          {
                            required:
                              clubData.name === ""
                                ? boolVariable
                                : !boolVariable,
                            message: "Name Required",
                          },
                        ]}
                      >
                        <InputField
                          placeholder="Enter your Name"
                          type="text"
                          name="name"
                          value={clubData.name}
                          onChange={onChangeValue}
                        />
                      </Form.Item>
                    </div>
                    <div className="modalInputStyling">
                      <span className="clubFieldsStyling">Address:</span>
                      <Form.Item
                        name={"address"}
                        rules={[
                          {
                            required:
                              clubData.address === ""
                                ? boolVariable
                                : !boolVariable,
                            message: "Address Required",
                          },
                        ]}
                      >
                        <InputField
                          placeholder="Enter your Address"
                          type="text"
                          name="address"
                          value={clubData.address}
                          onChange={onChangeValue}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                  <div className="footerCustomStyling">
                    <div className="cancelBTnStyling">
                      <NLBtn
                        title="Cancel"
                        type="primary"
                        onClick={handleCancel1}
                      />
                    </div>
                    <div className="createBtnModalStyling">
                      <NLBtn
                        title="Create"
                        type="primary"
                        disabled={buttonDisabled}
                        greyDisabledButton
                        onClick={handleOk1}
                      />
                    </div>
                  </div>
                </Modal>
                <NLBtn title="Create" type="primary" onClick={showModal1} />
              </div>
            </div>
          </Col>
        </Row>
        <Row className="custColStyling">
          <Col span={24}>
            <div className="clubPageOuterContainer">
              <div>
                <div className="clubpageHeading">
                  <h1>CLUBS</h1>
                </div>
              </div>
              {isLoading ? (
                <Spin size="large" />
              ) : (
                <div className="universitiesScroll">
                  <div className="scrollContent">
                    <Row gutter={[16, 20]} style={{ marginTop: "3%" }}>
                      {clubs.length==0 ? <span className="clubNoData">Add Clubs</span> :
                      clubs.map((item) => {
                        return (
                          <Col lg={6} md={8} key={item._id}>
                            <div
                              onClick={() => {
                                navigate(`/club/clubdetail/${item._id}`, {
                                  state: item,
                                });
                              }}
                            >
                              <div className="clubcard1">
                                <div className="clubcardInner">
                                  <div>
                                    <h1 className="clubinstitution">
                                      {item.name}
                                    </h1>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Club;
