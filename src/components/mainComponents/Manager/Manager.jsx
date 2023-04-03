import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  Col,
  Row,
  Form,
  Modal,
  message,
  Spin,
  DatePicker,
  Space,
  Radio,
  Select
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getApiWithAuth, postApiWithAuth } from "../../../utils/api";
import { Url } from "../../../utils/apiUrl";
import { NLBtn, InputField } from "../../commonComponents";
import "./Manager.scss";

const Manager = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id;
  const boolVariable = true;
  const plainOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Others', value: 'others' }];
  const [isModalOpen1, setIsModalOpen1] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [managers, setManagers] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [managerData, setManagerData] = useState({
    email: "",
    password: "",
    dateofbirth: "",
    clubid: id,
    usertype: "manager",
    gender: "male",
  });

  const showModal1 = () => {
    setIsModalOpen1(true);
  };

  const handleOk1 = async () => {
    setIsModalOpen1(false);
    const response = await postApiWithAuth(Url.CreateManager, managerData);
    if (!response.success) {
      message.error(response);
      return;
    }
    message.success("Manager created successfully");
    getManagers();
  };

  const handleCancel1 = () => {
    setIsModalOpen1(false);
  };

  const getManagers = async () => {
    setisLoading(true);
    const response = await getApiWithAuth(`${Url.ViewClubManager}${id}`);
    if (!response.success) {
      setisLoading(false);
      return;
    }
    setisLoading(false);
    setManagers(response.data);
  };

  const onChangeValue = (event) => {
    const { value, name } = event.target;
    setManagerData({ ...managerData, [name]: value });
  };

  const onChangee = (value, dateString) => {
    const dateFormat = moment(value._d).format("DD-MM-YYYY");
    setManagerData({ ...managerData, dateofbirth: dateFormat });
  };

  const onChange1 = (value) => {
    setManagerData({ ...managerData, gender: value });
  };

  useEffect(() => {
    getManagers();
  }, []);

  return (
    <div className="clubContainer">
      <div className="clubInnerContainer">
        <Row>
          <Col span={24}>
            <div className="clubPoweredText">
              <div className="arrowStyling">
                <ArrowLeftOutlined
                  onClick={() => {
                    navigate(`/club/clubdetail/${id}`, {
                      state: { _id: id },
                    });
                  }}
                />
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
                  okText="Create"
                  footer={null}
                >
                  <Form
                    onFieldsChange={() => {
                      if (
                        managerData.email !== "" &&
                        managerData.password !== "" &&
                        managerData.dateofbirth !== ""
                      ) {
                        setButtonDisabled(false);
                      } else {
                        setButtonDisabled(true);
                      }
                    }}
                  >
                    <div className="modalInputStyling">
                      <span className="clubFieldsStyling">Email</span>
                      <Form.Item
                        name={"email"}
                        rules={[
                          {
                            required:
                              managerData.email === ""
                                ? boolVariable
                                : !boolVariable,
                            message: "Email Required",
                          },
                          {
                            type: "email",
                            message: "Enter valid Email",
                          },
                        ]}
                      >
                        <InputField
                          placeholder="Enter your Email"
                          type="text"
                          name="email"
                          value={managerData.email}
                          onChange={onChangeValue}
                        />
                      </Form.Item>
                    </div>
                    <div className="modalInputStylingManager">
                      <span className="clubFieldsStyling">Password</span>
                      <Form.Item
                        name={"password"}
                        rules={[
                          {
                            required:
                              managerData.password === ""
                                ? boolVariable
                                : !boolVariable,
                            message: "Password Required",
                          },
                          {
                            pattern:
                              "^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+*!=]).*$",
                            message:
                              "Password must contain atleast 1 small, 1 capital, 1 special character, 1 digit and length must be atleast 8 characters",
                          },
                        ]}
                      >
                        <InputField
                          placeholder="Enter your Password"
                          type="password"
                          name="password"
                          value={managerData.password}
                          onChange={onChangeValue}
                        />
                      </Form.Item>
                    </div>
                    <div className="modalInputStyling">
                      <span className="clubFieldsStyling">Date of Birth</span>
                      <Form.Item
                        name={"dateofbirth"}
                        rules={[
                          {
                            required:
                              managerData.dateofbirth === ""
                                ? boolVariable
                                : !boolVariable,
                            message: "Date of birth Required",
                          },
                        ]}
                      >
                        <Space direction="vertical">
                          <DatePicker
                            format="DD-MM-YYYY"
                            onChange={onChangee}
                            disabledDate={(current) =>
                              current.isAfter(moment().subtract(0, "day"))
                            }
                          />
                        </Space>
                      </Form.Item>
                    </div>
                    <div className="modalInputStyling">
                      <span className="clubFieldsStyling">Gender</span>
                      <Form.Item
                        name={"gender"}>
                        <Select options={plainOptions} onChange={onChange1} defaultValue={'male'} />
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
                        disabled={
                          managerData.email === "" ||
                          managerData.password === "" ||
                          managerData.dateofbirth === ""
                        }
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
                  <h1>MANAGERS</h1>
                </div>
              </div>
              {isLoading ? (
                <Spin size="large" />
              ) : (
                <div className="universitiesScroll">
                  <div className="managerScrollContent">
                    <Row gutter={[16, 20]} style={{ marginTop: "3%" }}>
                      {managers.length == 0 ? (
                        <span className="clubNoData">Add Managers</span>
                      ) : (
                        managers.map((item) => {
                          return (
                            <Col lg={6} md={8} key={item.userid._id} >
                              <div
                                onClick={() => {
                                  navigate(
                                    `/club/manager/ManagerDetail/${item.userid._id}`,
                                    {
                                      state: { _id: item.userid._id },
                                    }
                                  );
                                }}
                              >
                                <div className="clubcard1">
                                  <div className="clubcardInner">
                                    <div>
                                      <h1 className="clubinstitution">
                                        {item.userid.email}
                                      </h1>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Col>
                          );
                        })
                      )}
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
export default Manager;
