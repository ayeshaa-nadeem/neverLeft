import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row, Form, Modal, message, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { Url } from "../../../utils/apiUrl";
import { NLBtn, InputField } from "../../commonComponents";
import "./Institutions.scss";

const Institutions = () => {
  const boolVariable = true;
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [institutionData, setInstitutionData] = useState({
    name: "",
    address: "",
    domain: "",
  });

  const showModal1 = () => {
    setIsModalOpen1(true);
  };

  const handleOk1 = async () => {
    setIsModalOpen1(false);
    const response = await postApiWithAuth(Url.InstituteUrl, institutionData);
    if (!response.success) {
      message.error(response);
    } else {
      message.success("institute created successfully");
    }
    getInstitutes();
  };

  const handleCancel1 = () => {
    setInstitutionData({
      name: "",
      address: "",
      domain: "",
    });
    form.resetFields();
    setIsModalOpen1(false);
  };

  const getInstitutes = async () => {
    setisLoading(true);
    const response = await getApiWithAuth(Url.InstituteUrl);
    if (!response.success) {
      setisLoading(false);
      return;
    }
    setisLoading(false);
    setInstitutions(response.data);
  };

  const onChangeValue = (event) => {
    const { name, value } = event.target;
    setInstitutionData({ ...institutionData, [name]: value });
  };

  useEffect(() => {
    getInstitutes();
  }, []);

  useEffect(() => {}, [isLoading]);

  return (
    <div className="institutionContainer">
      <div className="institutionInnerContainer">
        <Row>
          <Col span={24}>
            <div className="institutionPoweredText">
              <div className="arrowStyling">
                <Link to={"/home"}>
                  <ArrowLeftOutlined />
                </Link>
                <span className="institutionpoweredText">
                  POWERED BY NEVERLEFT DIGITAL LTD.
                </span>
              </div>
              <div className="institutionNLBtnStyling">
                <Modal
                  title="Create New Institute"
                  open={isModalOpen1}
                  onOk={handleOk1}
                  onCancel={handleCancel1}
                  okButtonProps={{ disabled: buttonDisabled }}
                  okText="Create"
                  footer={null}
                >
                  <Form
                    form={form}
                    onFieldsChange={() => {
                      if (
                        institutionData.name !== "" &&
                        institutionData.address !== "" &&
                        institutionData.domain !== ""
                      ) {
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
                              institutionData.name === ""
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
                          value={institutionData.name}
                          onChange={onChangeValue}
                        />
                      </Form.Item>
                    </div>
                    <div className="modalInputStyling">
                      <span className="clubFieldsStyling">Address:</span>
                      <Form.Item
                        name="address"
                        rules={[
                          {
                            required:
                              institutionData.address === ""
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
                          value={institutionData.address}
                          onChange={onChangeValue}
                        />
                      </Form.Item>
                    </div>
                    <div className="modalInputStyling">
                      <span className="clubFieldsStyling">Domain:</span>
                      <Form.Item
                        name={"domain"}
                        rules={[
                          // {
                          //   required:
                          //     institutionData.domain === ""
                          //       ? boolVariable
                          //       : !boolVariable,
                          //   message: "Domain Required",
                          // },
                          {
                            pattern: "^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$",
                            message: "Enter Correct Domain",
                            validator: (_, value) => {
                              if (value != '') {
                              if (isValidUrl(value)) {
                                return Promise.resolve();
                            }
                            else {
                            if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(value)) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject();
                            }
                            }
                            function isValidUrl(string) {
                              try {
                                new URL(string);
                                return true;
                              } catch (err) {
                                return false;
                              }
                            }
                          }
                          else {
                            return Promise.reject();
                          }
                            }
                          }
                        ]}
                      >
                        <InputField
                          placeholder="Enter your Domain"
                          type="text"
                          className="modalInputStyling"
                          name="domain"
                          value={institutionData.domain}
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
        <Row className="institutioncustColStyling">
          <Col span={24}>
            <div className="institutionPageOuterContainer">
              <div>
                <div className="instpageHeading">
                  <h1>INSTITUTIONS</h1>
                </div>
              </div>
              {isLoading ? (
                <Spin size="large" />
              ) : (
                <div className="institutionuniversitiesScroll">
                  <div className="scrollContent">
                    <Row gutter={[16, 20]} style={{ marginTop: "3%" }}>
                      {institutions.length== 0 ? <span className="clubNoData">Add Institutes</span> :
                      institutions.map((item) => {
                        return (
                          <Col lg={6} md={8} key={item._id} >
                            <div
                              onClick={() => {
                                navigate(
                                  `/institute/institutiondetail/${item._id}`,
                                  {
                                    state: item,
                                  }
                                );
                              }}
                            >
                              <div className="institutioncard1">
                                <div className="institutioncardInner">
                                  <div>
                                    <h1 className="instinstitution">
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

export default Institutions;
