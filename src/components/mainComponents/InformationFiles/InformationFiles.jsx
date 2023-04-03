import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Row, message, Upload, Form, Spin } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { postApiWithAuth } from "../../../utils/api";
import { Url } from "../../../utils/apiUrl";
import { NLBtn } from "../../commonComponents";
import "./InformationFiles.scss";

const InformationFiles = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [fileData, setFileData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const props = {
    name: "file",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const fileUpload = (event) => {
    setFileData(event.file);
  };

  const uploadInformationFile = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", fileData);
    const response = await postApiWithAuth(
      `${Url.informationFiles}${id}`,
      formData,
      {timeout: 3000}
    );
    if(response==undefined){
      setIsLoading(false);
      message.error("Check your Internet Connection");
    }
    else if (response?.success) {
      setIsLoading(false);
      message.success("File uploaded");
    }
    else{
      setIsLoading(false);
      message.error(response);
    }
  };
  
  useEffect(() => {
    if (fileData) {
      uploadInformationFile();
    }
  }, [fileData]);

  return (
    <div className="infoFilesContainer">
      <div className="infoFilesInnerContainer">
        <Row>
          <Col span={24}>
            <div className="infoFilesPoweredText">
              <ArrowLeftOutlined
                onClick={() => {
                  navigate(`/institute/institutiondetail/${id}`, {
                    state: { _id: id },
                  });
                }}
              />
              <span className="infoFilespoweredText">
                POWERED BY NEVERLEFT DIGITAL LTD.
              </span>
            </div>
          </Col>
        </Row>
        <Row className="custColStyling">
          <Col span={24}>
            <div className="infoPageOuterContainer">
              <div>
                <div className="infoFilespageHeading">
                  <h1>INFORMATION FILES</h1>
                </div>
              </div>
              <div className="infoContainer">
                <span className="uploadFile">UPLOAD YOUR FILE</span>
                <div className="uploadwAttributes">
                  <Form>
                    <Form.Item>
                      <Upload
                        onChange={fileUpload}
                        beforeUpload={() => false}
                        maxCount={1}
                        accept={".csv"}
                      >
                        <NLBtn
                          title={isLoading ? <Spin /> : "Upload"}
                          type="primary"
                        />
                      </Upload>
                    </Form.Item>
                  </Form>
                  <div className="reqAttributes">
                    <div className="linkwIcon">
                      <LinkOutlined className="linkIcon"/>
                      <a
                        href={process.env.REACT_APP_CSV_LINK}
                        download
                      >
                        See the sample CSV File before uploading
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default InformationFiles;
