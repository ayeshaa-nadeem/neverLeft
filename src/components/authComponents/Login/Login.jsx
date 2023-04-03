import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, message } from "antd";
import { Url } from "../../../utils/apiUrl";
import { postApiWithoutAuth } from "../../../utils/api";
import { setToken } from "../../../utils/localStorage";
import { InputField, NLBtn } from "../../commonComponents";
import logo from "../../../assets/images/NLlogo.svg";
import "./Login.scss";

const Login = () => {
  const boolVariable = true;
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const onFinish = async () => {
    setisLoading(true);
    const response = await postApiWithoutAuth(Url.loginUrl, userData);
    if (response.success === true && response.data.type == "admin") {
      setisLoading(false);
      setToken(response.data.accessToken);
      message.success("Login successfully");
      navigate("/home");
    } else {
      setisLoading(false);
      message.error("Invalid Login Credentials");
    }
  };

  const onChangeValue = (event) => {
    const { value, name } = event.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="loginContainer">
      <div className="loginLogoContainer">
        <div className="logoContent">
          <div className="siteLogo">
            <img src={logo} />
          </div>
          <span className="loginContainerText">
            POWERED BY NEVERLEFT DIGITAL LTD.
          </span>
        </div>
      </div>
      <div className="loginCred">
        <div className="loginCredContainer">
          <div className="logoContent">
            <div className="formContent">
              <div className="formFields">
                <h1 className="loginSignin">SIGN IN</h1>
                <span className="loginText">
                  Please Enter Your Valid Email & Password
                </span>
                <div className="loginCredFormStyling">
                  <Form
                    className="formStyling"
                    name="basic"
                    labelCol={{
                      span: 8,
                    }}
                    wrapperCol={{
                      offset: 1,
                      span: 22,
                    }}
                    initialValues={{
                      remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                    type="Submit"
                  >
                    <div className="loginField">
                      <Form.Item
                        className="formField"
                        name="email"
                        rules={[
                          {
                            required:
                              userData.email === ""
                                ? boolVariable
                                : !boolVariable,
                            message: "Email Required",
                          },
                          {
                            pattern: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                            message: "Please Enter Valid Email",
                          },
                        ]}
                      >
                        <InputField
                          placeholder="Enter your Email"
                          type="email"
                          onChange={onChangeValue}
                          value={userData.email}
                          name={"email"}
                        />
                      </Form.Item>
                      <Form.Item
                        className="formField"
                        name="password"
                        rules={[
                          {
                            required:
                              userData.password === ""
                                ? boolVariable
                                : !boolVariable,
                            message: "Password Required",
                          },
                          {
                            pattern: /^[ A-Za-z0-9_@./#&+-]*$/,
                            message: "Please Enter Valid Password",
                          },
                        ]}
                      >
                        <InputField
                          placeholder="Enter your Password"
                          type="password"
                          onChange={onChangeValue}
                          value={userData.email}
                          name={"password"}
                        />
                      </Form.Item>

                      <Form.Item
                        className="NLBtnStyling"
                        wrapperCol={{
                          offset: 1,
                          span: 22,
                        }}
                      >
                        <NLBtn
                          type="primary"
                          htmlType="submit"
                          title="LOG IN"
                          showSpinner={isLoading}
                        />
                      </Form.Item>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
