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
import "./LogoGallery.scss";

const LogoGallery = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [logos, setLogos] = useState();
  const [fetchLogo, setFetchLogo] = useState({});
  const [imageUrls, setImageUrls] = useState([]);
  const [instituteLogos, setInstituteLogos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imgIsLoading, setImgIsLoading] = useState(false);
  const [isImgCorrect, setIsImgCorrect] = useState(false);
  const [isLogoDelete, setIsLogoDelete] = useState({});

  const onChangeFile = (info) => {
    setLogos(info.file);
  };

  const uploadLogos = async () => {
    setImgIsLoading(true);
    const formData = new FormData();
    formData.append("file", logos);
    const response = await postApiWithAuth(Url.uploadLogoUrl, formData);
    if (response?.success) {
      setImgIsLoading(false);
      setFetchLogo({
        ...fetchLogo,
        logoUrl: [...instituteLogos, { url: response.data }],
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
    const response = await getApiWithAuth(`${Url.getLogoUrl}${id}`);
    setIsLoading(false);
    setInstituteLogos(response.data);
  };

  const updateLogoUrls = async () => {
    const response = await patchApiWithAuth(
      `${Url.updateInstituteUrl}${id}`,
      fetchLogo
    );
    if (response.success) {
      setImageUrls(response.data.logoUrl);
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
    const response = await deleteApiWithAuth(
      `${Url.deleteInstituteLogo}${isLogoDelete.url}&id=${id}`
    );
    if (response.data?.success) {
      message.success("Logo deleted successfully");
      getInstituteLogos();
      navigate(`/institute/instituteLogogallery/${id}`);
    } else {
      message.error(response.message);
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

  useEffect(() => {
    getInstituteLogos();
  }, []);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return (
    <div className="logoGalleryContainer">
      <div className="logoInnerContainer">
        <Form>
          <Row>
            <Col span={24}>
              <div className="logoPoweredText">
                <div className="arrowStyling">
                  <ArrowLeftOutlined
                    onClick={() => {
                      navigate(`/institute/institutiondetail/${id}`, {
                        state: { _id: id },
                      });
                    }}
                  />
                  <span className="logopoweredText">
                    POWERED BY NEVERLEFT DIGITAL LTD.
                  </span>
                </div>
                <div className="logoNLBtnStyling">
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
            <div className="logoPageOuterContainer">
              <div>
                <div className="logopageHeading">
                  <h1>Institute Logo Gallery</h1>
                </div>
              </div>
              <div className="logosScroll">
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
                      {instituteLogos.length == 0 ? (
                        <div className="noImgs">
                          <span className="nothingtoshow">
                            No Data to Show you can also drag and drop image
                            here
                          </span>
                        </div>
                      ) : (
                        instituteLogos?.map((item) => {
                          return (
                            <Col lg={4} md={6} key={item._id}>
                              <div className="logoGalleryImg">
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

export default LogoGallery;
