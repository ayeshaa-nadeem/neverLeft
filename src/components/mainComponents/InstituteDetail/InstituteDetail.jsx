import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Modal, Col, Row, Form, message, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Url } from "../../../utils/apiUrl";
import {
  patchApiWithAuth,
  deleteApiWithAuth,
  getApiWithAuth,
} from "../../../utils/api";
import { InputField, NLBtn } from "../../commonComponents";
import "./InstituteDetails.scss";

const InstituteDetail = () => {
  const location = useLocation();
  const [instituteData, setInstituteData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [updatedInstituteData, setUpdatedInstituteData] = useState([]);
  const instituteId = location?.state?._id;
  const navigate = useNavigate();

  const getInstitutes = async () => {
    setisLoading(true);
    const response = await getApiWithAuth(
      `${Url.updateInstituteUrl}${instituteId}`
    );
    if (response.success == true) {
      setisLoading(false);
      return setInstituteData(response.data);
    } else {
      setisLoading(false);
      message.error(response.message);
    }
  };

  const getNewData = (event) => {
    const { name, value } = event.target;
    setInstituteData({ ...instituteData, [name]: value });
    setUpdatedInstituteData({ [name]: value });
  };

  const onFinish = async () => {
    const response = await patchApiWithAuth(
      `${Url.updateInstituteUrl}${instituteData._id}`,
      updatedInstituteData
    );
    if (response.success === true) {
      message.success("institute updated successfully");
      navigate("/institution");
    } else {
      message.error(response.message);
    }
  };

  const deleteData = async () => {
    const response = await deleteApiWithAuth(
      `${Url.deleteInstituteUrl}${instituteData._id}`
    );
    if (response.data.success === true) {
      message.success("institute deleted successfully");
      navigate("/institution");
    } else {
      message.error(response.message);
    }
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

  useEffect(() => {
    getInstitutes();
  }, []);

  return (
    <div className="instituteDetailContainer">
      <div className="instituteDetailInnerContainer">
        <Row>
          <Col span={24}>
            <div className="instDetailPoweredText">
              <div className="arrowStyling">
                <Link to={"/institution"}>
                  <ArrowLeftOutlined />
                </Link>
                <span className="instDetailpoweredText">
                  POWERED BY NEVERLEFT DIGITAL LTD.
                </span>
              </div>
              <div className="instDetailNLBtnStyling">
                <div className="instDetailTwobtns">
                  <div className="deleteBtn">
                    <NLBtn title="DELETE" type="primary" onClick={showModal} />
                  </div>
                  <NLBtn
                    title="SAVE"
                    type="primary"
                    disabled={
                      (location.state.name == instituteData.name &&
                        location.state.address == instituteData.address &&
                        location.state.domain == instituteData.domain) ||
                      instituteData.name == "" ||
                      instituteData.address == "" ||
                      instituteData.domain == ""
                    }
                    savedisabled
                    onClick={onFinish}
                  />
                  <Modal
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    okText="Delete"
                    footer={null}
                  >
                    <p>Do you want to delete this institute?</p>
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
        <Row className="instDetailcustColStyling">
          <Col span={24}>
            <div className="instDetailPageOuterContainer">
              <div>
                <div className={assignWidth(instituteData?.name?.length)}>
                  <h1>{instituteData.name}</h1>
                </div>
              </div>
              {isLoading ? (
                <Spin size="large" />
              ) : (
                <div className="instDetailInputScroll">
                  <Form>
                    <Form.Item label="Name">
                      <InputField
                        placeholder="Enter your Name"
                        type="text"
                        name="name"
                        value={instituteData.name}
                        onChange={getNewData}
                      />
                    </Form.Item>
                    <Form.Item label="Address">
                      <InputField
                        placeholder="Enter your Address"
                        type="text"
                        name="address"
                        value={instituteData.address}
                        onChange={getNewData}
                      />
                    </Form.Item>
                    <Form.Item label="Domain">
                      <InputField
                        placeholder="Enter your Domain"
                        type="text"
                        name="domain"
                        value={instituteData.domain}
                        onChange={getNewData}
                      />
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

export default InstituteDetail;
