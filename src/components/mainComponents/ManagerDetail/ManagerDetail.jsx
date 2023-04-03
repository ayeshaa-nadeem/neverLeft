import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { Modal, Col, Row, Form, message, Spin, DatePicker, Space, Select } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Url } from "../../../utils/apiUrl";
import {
  patchApiWithAuth,
  deleteApiWithAuth,
  getApiWithAuth,
} from "../../../utils/api";
import { InputField, NLBtn } from "../../commonComponents";
import "./ManagerDetail.scss";

const ManagerDetail = () => {
  const location = useLocation();
  const plainOptions = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Others', value: 'others' }];
  const [managerData, setManagerData] = useState({
    userid: { dateofbirth: moment("DD-MM-YYYY").format() },
  });
  const [genderData, setGenderData] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [updatedManagerData, setUpdatedManagerData] = useState({});
  const managerId = location.state._id;
  const navigate = useNavigate();

  const getManagers = async () => {
    setisLoading(true);
    const response = await getApiWithAuth(
      `${Url.viewSingleManager}${managerId}`
    );
    if (response.success == true) {
      setisLoading(false);
      setManagerData(response.data);
      setGenderData(response.data.userid.gender);
    } else {
      setisLoading(false);
      message.error(response.message);
    }
  };

  const getNewValues = (event) => {
    const { name, value } = event.target;
    setManagerData({
      ...managerData,
      userid: { ...managerData.userid, [name]: value },
    });
    setUpdatedManagerData({ [name]: value });
  };

  const onFinish = async () => {
    const response = await patchApiWithAuth(
      `${Url.updateManager}${managerData.userid._id}`,
      updatedManagerData
    );
    if (response.success === true) {
      message.success("Manager data updated successfully");
      navigate(`/club/manager/${managerData.clubid}`);
    } else {
      message.error(response.message);
    }
  };

  const deleteData = async () => {
    const response = await deleteApiWithAuth(
      `${Url.deleteManager}${managerData.userid._id}`
    );
    if (response.data.success) {
      message.success("Manager deleted successfully");
      navigate(`/club/manager/${managerData.clubid}`);
    } else {
      message.error(response.message);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    deleteData();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChangee = (value, dateString) => {
    const dateFormat = moment(value._d).format("DD-MM-YYYY");
    setManagerData({
      ...managerData,
      userid: { ...managerData.userid, dateofbirth: dateFormat },
    });
    setUpdatedManagerData({ dateofbirth: dateFormat });
  };

  const onChange1 = (value ) => {
    setManagerData({ ...managerData, userid: { ...managerData.userid, gender: value } });
    setUpdatedManagerData({ gender: value });
    setGenderData(value);
  };

  const assignWidth = (length) => {
    if (length <= 10) {
      return "tenLength";
    } else if (length <= 20) {
      return "tweentyLength";
    } else if (length <= 40) {
      return "fourtyLength";
    } else if (length <= 60) {
      return "sixtyLength";
    } else {
      return "maxLength";
    }
  };

  useEffect(() => {
    getManagers();

  }, []);

  return (
    <div className="clubDetailContainer">
      <div className="clubDetailInnerContainer">
        <Row>
          <Col span={24}>
            <div className="clubDetailPoweredText">
              <div className="arrowStyling">
                <ArrowLeftOutlined
                  onClick={() => {
                    navigate(`/club/manager/${managerData.clubid}`, {
                      state: { _id: managerId },
                    });
                  }}
                />
                <span className="clubDetailpoweredText">
                  POWERED BY NEVERLEFT DIGITAL LTD.
                </span>
              </div>
              <div className="clubDetailNLBtnStyling">
                <div className="clubDetailTwoBtns">
                  <div className="deleteBtn">
                    <NLBtn title="DELETE" type="primary" onClick={showModal} />
                  </div>
                  <div className="saveBtn">
                    <NLBtn
                      title="Save"
                      type="primary"
                      savedisabled
                      onClick={onFinish}
                    />
                  </div>
                  <Modal
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Delete"
                    footer={null}
                  >
                    <p>Do you want to delete this manager?</p>
                    <div className="footerCustomStyling">
                      <div className="cancelBTnStyling">
                        <NLBtn
                          title="Cancel"
                          type="primary"
                          onClick={handleCancel}
                        />
                      </div>
                      <div className="deleteBtn">
                        <NLBtn
                          title="Delete"
                          type="primary"
                          onClick={handleOk}
                        />
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="clubDetailcustColStyling">
          <Col span={24}>
            <div className="clubDetailPageOuterContainer">
              <div>
                <div className={assignWidth(managerData?.email?.length)}>
                  <h1>{managerData.userid.email}</h1>
                </div>
              </div>
              {isLoading ? (
                <Spin size="large" />
              ) : (
                <div className="managerDetailInputScroll">
                  <Form>
                    <Form.Item label="Email">
                      <InputField
                        placeholder="Enter your Email"
                        type="text"
                        name="email"
                        value={managerData.userid?.email}
                        onChange={getNewValues}
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      label="Password"
                      name={"password"}
                      rules={[
                        {
                          pattern: "^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+*!=]).*$",
                          message: "Password must contain atleast 1 small, 1 capital, 1 special character, 1 digit and length must be atleast 8 characters",
                        },
                      ]}
                    >
                      <InputField
                        placeholder="Enter New Password"
                        type="password"
                        name="password"
                        onChange={getNewValues}
                      />
                    </Form.Item>
                    <Form.Item label="DOB">
                      <Space direction="vertical">
                        <DatePicker
                          format="DD-MM-YYYY"
                          disabledDate={(current) =>
                            current.isAfter(moment().subtract(0, "day"))
                          }
                          onChange={onChangee}
                          value={moment(
                            managerData?.userid?.dateofbirth,
                            "DD-MM-YYYY"
                          )}
                        />
                      </Space>
                    </Form.Item>
                      <Form.Item
                        name={"gender"} label="Gender" >
                        <Select options={plainOptions} onChange={onChange1} defaultValue={genderData} />
                      </Form.Item>
                  </Form>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ManagerDetail;
