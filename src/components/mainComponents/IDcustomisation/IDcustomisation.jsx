import React, { useState, useEffect, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { HexColorPicker } from "react-colorful";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Col,
  Row,
  Form,
  Divider,
  Switch,
  Modal,
  Upload,
  message,
  Spin,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Url } from "../../../utils/apiUrl";
import {
  postApiWithAuth,
  patchApiWithAuth,
  getApiWithAuth,
} from "../../../utils/api";
import custImg from "../../../assets/images/userImage.jpg";
import logo from "../../../assets/images/google.svg";
import upload from "../../../assets/images/upload.png";
import QrCode from "./QrCode";
import { Container } from "./Container";
import "./IDcustomisation.scss";
import FormItem from "antd/es/form/FormItem";

const IDcustomisation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [color, setColor] = useState("");
  const [textFieldColor, setTextFieldColor] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchLogo, setFetchLogo] = useState({});
  const [instituteLogos, setInstituteLogos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState(true);
  const [switchLoading, setSwitchLoading] = useState(false);
  const [logos, setLogos] = useState();
  const [attributesData, setAttributesData] = useState([]);
  const [primaryLogo, setPrimaryLogo] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [isImgCorrect, setIsImgCorrect] = useState(false);

  const colorChange = async (event) => {
    const { name, value } = event.target;
    const colorCheck = event.target.value.match(/^#([A-Fa-f0-9]{3,6})$/);
    const colorLength = event.target.value.length;
    if(colorLength == 7 && colorCheck != null){
      setTextFieldColor(event.target.value);
      setColor(event.target.value);
      const response = await patchApiWithAuth(`${Url.updateOrders}${id}`, [
        {
          backgroundColor: event.target.value,
          key: "backgroundColor",
        },
      ]);
      if (!response.success) {
        setColor(attributesData.backgroundColor);
        setTextFieldColor(attributesData.backgroundColor);
      }
    }
    else if(colorLength < 3 || colorCheck == null){
    setTextFieldColor("#000000");
    setColor("#000000");
    }
  };

  const onIdStatusChange = async (checked) => {
    setSwitchLoading(true);
    setActiveStatus(checked);
    const res = await patchApiWithAuth(`${Url.toggleInstituteIdStatus}${id}`,
      [{
        "dummyData": "true",
        status: checked,
        label: "ID Status",
        order: 10,
        key: "idstatus"
      }]
    );

    if (res.success) {
      checked ?
        message.success("Institute activated succesfully") : message.success("Institute deactivated succesfully");
      setSwitchLoading(false);
    }
    else {
      message.error("Unable to update Id status");
      setSwitchLoading(false);

    }
  };

  const showModal = () => {
    setIsModalOpen(true);
    getInstituteLogos();
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChangeFile = (info) => {
    setLogos(info.file);
  };

  const uploadLogos = async (data) => {
    const response = await postApiWithAuth(`${Url.uploadPrimaryLogo}${id}`, {
      url: data,
    });
    if (response?.success) {
      getInstituteLogos();
      message.success("Logo uploaded");
      return;
    } else {
      message.error("Logo uploading failed");
    }
  };

  const getLogoUrl = async () => {
    const formData = new FormData();
    formData.append("file", logos);
    const response = await postApiWithAuth(`${Url.uploadLogoUrl}`, formData);
    if (response?.success) {
      uploadLogos(response.data);
      return;
    } else {
      message.error("Logo uploading failed");
    }
  };

  const updateLogoUrls = async (item) => {
    const temp = { url: item?.url };
    const response = await patchApiWithAuth(
      `${Url.idCustomisationLogos}${id}`,
      temp
    );
    if (response.success) {
      getInstituteLogos();
      setIsModalOpen(false);
    }
  };

  const getInstituteLogos = async () => {
    setIsLoading(true);
    const response = await getApiWithAuth(`${Url.getLogoUrl}${id}`);
    if (response.success) {
      setIsLoading(false);
      setInstituteLogos(response.data);
      const temp = response.data?.filter((item) => item.is_primary == true);
      setPrimaryLogo(temp[0]);
    }
  };

  const getAllData = async () => {
    setIsLoading(true);

    const response = await getApiWithAuth(`${Url.getAllAttributes}${id}`);
    if (response.success) {
      setAttributesData(response.data);
      setColor(response.data.backgroundColor);
      setTextFieldColor(response.data.backgroundColor);
      setIsLoading(false);
      setActiveStatus(response.data.attributes.filter((item) => item !== null && item.key === "idstatus")[0].status);
    } else {
      message.error("Failed to get Records");
      setIsLoading(false);

    }
  };

  const updateLogos = async () => {
    const response = await patchApiWithAuth(
      `${Url.updateInstituteUrl}${id}`,
      fetchLogo
    );
    if (response.success) {
      setImageUrls(response.data.logoUrl);
    }
  };

  const updateBgColor = async (color) => {
    setColor(color);
    setTextFieldColor(color);
    const response = await patchApiWithAuth(`${Url.updateOrders}${id}`, [
      {
        backgroundColor: color,
        key: "backgroundColor",
      },
    ]);
    if (!response.success) {
      setColor(attributesData.backgroundColor);
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

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    if (fetchLogo) {
      updateLogos();
    }
  }, [fetchLogo]);

  useEffect(() => {
    getInstituteLogos();
  }, []);

  useEffect(() => {
    if (isImgCorrect != true) {
      if (logos) {
        getLogoUrl();
      }
    }
  }, [logos]);

  return (
    <div className="idcustomisationContainer">
      <div className="idcustomisationInnerContainer">
        <Row>
          <Col span={24}>
            <div className="idcustomisationPoweredText">
              <ArrowLeftOutlined
                onClick={() => {
                  navigate(`/institute/institutiondetail/${id}`, {
                    state: { _id: id },
                  });
                }}
              />
              <span className="idcustomisationpoweredText">
                POWERED BY NEVERLEFT DIGITAL LTD.
              </span>
            </div>
          </Col>
        </Row>
        <div className="idcustPageOuterContainer">
          <div>
            <div className="idcustomisationpageHeading">
              <h1>ID Customisation</h1>
            </div>
          </div>
          <div className="idcustContainer">
            <div className="idCustColStyling">
              <Form
                fields={[
                  {
                    name: ["color"],
                    value: textFieldColor,
                  },
                ]}
              >
                <FormItem
                  label="Enter Code"
                  name="color"
                  rules={[
                    {
                      required: true,
                      message: "Input your Hex Code!",
                    },
                    {
                      pattern: "^#([A-Fa-f0-9]{3,6})$",
                      message: "Invalid Format",
                    },
                  ]}
                >
                  <input
                    type="text"
                    id="color"
                    name="textFieldColor"
                    className="inputhtml"
                    onChange={colorChange}
                    value={textFieldColor}
                  />
                </FormItem>
              </Form>
              <div className="pickColorContainer">
                <div className="colorPickerContainer">
                  <span className="pickColor">pick color</span>
                </div>
                <HexColorPicker
                  className="idColorPicker"
                  color={attributesData.backgroundColor}
                  onChange={(color) => {
                    updateBgColor(color);
                  }}
                />
              </div>
            </div>
            <div className="dividerStyling">
              <div className="dividerCircleOuterContainerleft">
                <div className="dividerCircle"></div>
              </div>
              <Divider style={{ backgroundColor: "white" }} />
              <div className="dividerCircleOuterContainerright">
                <div className="dividerCircle"></div>
              </div>
            </div>
            <div className="studentInfo">
              <DndProvider backend={HTML5Backend}>
                <Container getAllData={getAllData} />
              </DndProvider>
            </div>
            <div className="dividerStyling">
              <div className="dividerCircleOuterContainerleft">
                <div className="dividerCircle"></div>
              </div>
              <Divider style={{ backgroundColor: "white" }} />
              <div className="dividerCircleOuterContainerright">
                <div className="dividerCircle"></div>
              </div>
            </div>
            <div>
              <span className="pickGallery">Pick Logo from Gallery</span>
              <div className="idCustLogoGallery">
                <div className="idcustlogoContainer">
                  <Modal
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                  >
                    {isLoading ? (
                      <div className="spinerStying">
                        <Spin size="large" />
                      </div>
                    ) : (
                      <div className="idCustScroll">
                        <div className="scrolContent">
                          <Row gutter={[16, 35]} style={{ marginTop: "3%" }}>
                            {instituteLogos.length == 0 ? (
                              <div className="noImgsTicket">
                                <span className="nothingtoshow">
                                  No Data to Show
                                </span>
                              </div>
                            ) : (
                              instituteLogos?.map((item) => {
                                return (
                                  <Col span={6} key={item._id}>
                                    <div className="logoGalleryImgId">
                                      <img
                                        src={item.url}
                                        onClick={() => updateLogoUrls(item)}
                                      />
                                    </div>
                                  </Col>
                                );
                              })
                            )}
                          </Row>
                        </div>
                      </div>
                    )}
                  </Modal>
                  {isLoading ? (
                    <div className="idImgSpinnerColor">
                      <Spin size="small" />
                    </div>
                  ) : (
                    <img
                      src={primaryLogo?.url ? primaryLogo.url : logo}
                      onClick={showModal}
                    />
                  )}
                </div>
                <span className="logoOr">Or</span>
                <div className="idCustFormUpload">
                  <Form>
                    <Form.Item>
                      <Upload
                        onChange={onChangeFile}
                        beforeUpload={beforeUpload}
                      >
                        <div className="idcustlogoContainer">
                          <img src={upload} />
                        </div>
                      </Upload>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </div>
          </div>
          <div className="idcustContainer2">
            <div className="idCustCard">
              <div className="studentImgContainer">
                <img src={custImg} />
              </div>
              <div className="idCustCardInner" style={{ backgroundColor: color }}>
                <div className="idCustDataStyling">
                  <div className="allCardData">
                    <div className="allCardDataInner">
                      {attributesData?.attributes?.length == 0 ||
                        attributesData?.attributes?.length == "undefined" ? (
                        <p className="noDataToShow">Add Data Here</p>
                      ) : (
                        attributesData?.attributes
                          ?.filter((dataItem) => dataItem != null && dataItem.key !== "idstatus")
                          .map((item) => {
                            return (
                              <div className="idCustCardParent" key={item.key} >
                                <div className="idCustCardLeft">
                                  <span className="studentNoo">
                                    {item?.label}{" "}
                                  </span>
                                </div>
                                <div className="idCustCardRight">
                                  <span className="numm">
                                    {item?.dummyData}
                                  </span>
                                </div>
                              </div>
                            );
                          })
                      )}
                    </div>
                  </div>
                </div>
                <div className="idCustRightLogoParentDiv">
                  <div className="idCustRightLogo">
                    <div className="logoQr">
                      <div>
                        <div className="idcustBusinessContainer">
                          <img
                            src={primaryLogo?.url ? primaryLogo.url : logo}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="section container">
                      <QrCode />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="idcustContainer3">
            <div className="activeIdContainer">
              <span className="activeId">Active ID</span>
              <Switch loading={switchLoading} defaultChecked onChange={onIdStatusChange} checked={activeStatus} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IDcustomisation;
