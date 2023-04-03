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
import "./ClubDetail.scss";

const ClubDetail = () => {
  const location = useLocation();
  const [clubData, setClubData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [updatedClubData, setUpdatedClubData] = useState([]);
  const clubId = location.state._id;
  const navigate = useNavigate();

  const getInstitutes = async () => {
    setisLoading(true);
    const response = await getApiWithAuth(`${Url.updateClubUrl}${clubId}`);
    if (response.success == true) {
      setisLoading(false);
      return setClubData(response.data);
    } else {
      setisLoading(false);
      message.error(response.message);
    }
  };

  const getNewValues = (event) => {
    const { name, value } = event.target;
    setClubData({ ...clubData, [name]: value });
    setUpdatedClubData({ [name]: value });
  };

  const onFinish = async () => {
    const response = await patchApiWithAuth(
      `${Url.updateClubUrl}${clubData._id}`,
      updatedClubData
    );
    if (response.success === true) {
      message.success("club updated successfully");
      navigate("/club");
    } else {
      message.error(response.message);
    }
  };

  const deleteData = async () => {
    const response = await deleteApiWithAuth(
      `${Url.deletClubsUrl}${clubData._id}`
    );
    if (response.data.success) {
      message.success("Club deleted successfully");
      navigate("/club");
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
    getInstitutes();
  }, []);
  
  return (
    <div className="clubDetailContainer">
      <div className="clubDetailInnerContainer">
        <Row>
          <Col span={24}>
            <div className="clubDetailPoweredText">
              <div className="arrowStyling">
                <Link to={"/club"}>
                  <ArrowLeftOutlined />
                </Link>
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
                      disabled={
                        (location.state.name == clubData.name &&
                          location.state.address == clubData.address) ||
                        clubData.name == "" ||
                        clubData.address == ""
                      }
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
                    <p>Do you want to delete this club?</p>
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
                <div className={assignWidth(clubData?.name?.length)}>
                  <h1>{clubData.name}</h1>
                </div>
              </div>
              {isLoading ? (
                <Spin size="large" />
              ) : (
                <div className="clubDetailInputScroll">
                  <Form>
                    <Form.Item label="Name">
                      <InputField
                        placeholder="Enter your Name"
                        type="text"
                        name="name"
                        value={clubData.name}
                        onChange={getNewValues}
                      />
                    </Form.Item>
                    <Form.Item label="Address">
                      <InputField
                        placeholder="Enter your Address"
                        type="text"
                        name="address"
                        value={clubData.address}
                        onChange={getNewValues}
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

export default ClubDetail;
