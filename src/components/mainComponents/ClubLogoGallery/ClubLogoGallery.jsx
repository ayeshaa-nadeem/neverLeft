import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Modal, Col, Row, Form, message, Upload, Spin } from "antd";
import {
  ArrowLeftOutlined,
  CloseCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { Url } from "../../../utils/apiUrl";
import {
  postApiWithAuth,
  patchApiWithAuth,
  getApiWithAuth,
  deleteApiWithAuth,
} from "../../../utils/api";
import { NLBtn } from "../../commonComponents";
import "./ClubLogoGallery.scss";

const ClubLogoGallery = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [logos, setLogos] = useState();
  const [fetchLogo, setFetchLogo] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  const [clubLogos, setClubLogos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgIsLoading, setImgIsLoading] = useState(false);
  const [isImgCorrect, setIsImgCorrect] = useState(false);
  const [isLogoDelete, setIsLogoDelete]=useState({})

  const onChangeFile = (info) => {
    setLogos(info.file);
  };

  const uploadLogos = async () => {
    setImgIsLoading(true);
    const formData = new FormData();
    formData.append("file", logos);
    const response = await postApiWithAuth(Url.uploadClubLogo, formData);
    if (response?.success) {
      setImgIsLoading(false);
      setFetchLogo({
        ...fetchLogo,
        logoUrl: [...clubLogos, { url: response.data }],
      });
      message.success("Logo uploaded");
      return;
    } else {
      setImgIsLoading(false);
      message.error("Logo uploading failed");
    }
  };

  const getInstituteLogos = async () => {
    setIsLoading(true);
    const response = await getApiWithAuth(`${Url.getClubLogo}${id}`);
    setClubLogos(response.data);
    setIsLoading(false);
  };

  const updateLogoUrls = async () => {
    const response = await patchApiWithAuth(
      `${Url.updateClubUrl}${id}`,
      fetchLogo
    );
    if (response.success) {
      setImageUrls(response.data.logoUrl);
    }
  };

  const dragOver = (e) => {
    e.preventDefault();
  };

  const dragEnter = (e) => {
    e.preventDefault();
  };

  const dragLeave = (e) => {
    e.preventDefault();
  };

  const fileDrop = async (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    const sizeCheck = beforeUpload(files[0]);
    if (!sizeCheck) {
      setLogos(e.dataTransfer.files[0]);
    }
  };

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must be smaller than 2MB!");
      setIsImgCorrect(true);
      return true;
    }
    setIsImgCorrect(false);
    return false;
  };

  const deleteLogo = async () => {
    const response = await deleteApiWithAuth(`${Url.deleteClubLogo}${isLogoDelete.url}&id=${id}`);
    if (response.data.success === true) {
      message.success("Logo deleted successfully");
      getInstituteLogos();
      navigate(`/club/clubLogogallery/${id}`);
    } else {
      message.error(response.message);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    deleteLogo();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  useEffect(() => {
    if (fetchLogo) {
      updateLogoUrls();
    }
  }, [fetchLogo]);

  useEffect(() => {
    getInstituteLogos();
  }, [imageUrls]);

  useEffect(() => {
    if (isImgCorrect != true) {
      if (logos) {
        uploadLogos();
      }
    }
  }, [logos]);

  return (
    <div className="clubLogoGalleryContainer">
      <div className="clubLogoInnerContainer">
        <Form>
          <Row>
            <Col span={24}>
              <div className="clubLogoPoweredText">
                <div className="arrowStyling">
                  <ArrowLeftOutlined
                    onClick={() => {
                      navigate(`/club/clubdetail/${id}`, {
                        state: { _id: id },
                      });
                    }}
                  />
                  <span className="clubLogopoweredText">
                    POWERED BY NEVERLEFT DIGITAL LTD.
                  </span>
                </div>
                <div className="clubLogoNLBtnStyling">
                  <Form.Item>
                    <Upload
                      onChange={onChangeFile}
                      beforeUpload={beforeUpload}
                      accept={".png, .jpeg, .jpg"}
                    >
                      <NLBtn title="Upload Image" />
                    </Upload>
                  </Form.Item>
                </div>
              </div>
            </Col>
          </Row>
        </Form>
        <Row className="custColStyling">
          <Col span={24}>
            <div className="clubLogoPageOuterContainer">
              <div>
                <div className="clubLogopageHeading">
                  <h1>Club Logo Gallery</h1>
                </div>
              </div>
              <div className="clubLogosScroll">
                <div
                  className="scrollContent"
                  onDragOver={dragOver}
                  onDragEnter={dragEnter}
                  onDragLeave={dragLeave}
                  onDrop={fileDrop}
                >
                  {imgIsLoading ? (
                    <Spin indicator={antIcon} />
                  ) : isLoading ? (
                    <Spin size="large" />
                  ) : (
                    <Row gutter={[16, 40]} style={{ marginTop: "3%" }}>
                      {clubLogos?.length == 0 ? (
                        <div className="noImgs">
                          <span className="nothingtoshow">
                            No Data to Show you can also drag and drop image
                            here
                          </span>
                        </div>
                      ) : (
                        clubLogos?.map((item) => {
                          return (
                            <Col lg={4} md={6} key={item._id}>
                              <div className="clubLogoGalleryImg">
                                <img src={item.url} />
                                <CloseCircleFilled
                                  className="crossInstIcon"
                                  onClick={() => {
                                    showModal();
                                    setIsLogoDelete(item);
                                  }}
                                />
                                <Modal
                                  open={isModalOpen}
                                  onOk={handleOk}
                                  onCancel={handleCancel}
                                  okText="Delete"
                                  footer={null}
                                >
                                  <p>Do you want to delete this logo?</p>
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
                            </Col>
                          );
                        })
                      )}
                    </Row>
                  )}
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ClubLogoGallery;
