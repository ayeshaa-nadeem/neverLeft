import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Col, Row, Select, Spin, Button, message } from "antd";
import { Url } from "../../../utils/apiUrl";
import { getApiWithAuth } from "../../../utils/api";
import "./AnalyticsIUsers.scss";

const AnalyticsUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([{}]);
  const [startDate, setStartDate] = useState(new Date());
  const[gender,setGender]=useState([{}]);
  const[isYear,setIsYear]=useState("");
  const[isGender,setIsGender]=useState("");
  const[count,setCount]=useState("");

  const getAnalyticUsersYear = async () => {
    setIsLoading(true);
    const date = startDate?.getFullYear();
    const response = await getApiWithAuth(
      `${Url.analyticUsersYear}${date}`
    );
    if (response.success) {
      setIsLoading(false);
      setUserData(response.data);
    }
  };

  const handleChange = (value) => {
    setIsGender("gender");
    setGender(value.value);
  };

  const getAnalyticUsersGender = async () => {
    // console.log("==gender",isGender);
    setIsLoading(true);
    const response = await getApiWithAuth(
      `${Url.analyticUsersGender}${gender}`
    );
    if (response.success) {
      setIsLoading(false);
      setUserData(response.data.response);
      setCount(response.data)
    }
  };

  const getAnalyticUsersYearnGender = async () => {
    setIsLoading(true);
    const date = startDate?.getFullYear();
    const response = await getApiWithAuth(
      `${Url.analyticUsersYear}${date}&gender=${gender}`
    );
    if (response.success) {
      setIsLoading(false);
      setUserData(response.data.response);
    }
  };

  const callFunction = () =>{
  
    if(isGender=="gender" && gender){
      // console.log("genderrr")
      getAnalyticUsersGender();
    }
    else if(isYear=="year" && userData)
    {
      // console.log("yearrr")
      getAnalyticUsersYear();
    }
    else if(isYear=="year" && isGender=="gender")
    {
      // console.log("ayeshaaaaaaaaaaa")
      getAnalyticUsersYearnGender();
    }
    else{
      // console.log("=====errrorrrr")
    }
  }

  useEffect(()=>{
    console.log("== useefct year",isYear)
  },[userData])

  useEffect(()=>{
    console.log("== useeffect gender",isGender)
  },[gender])

  // useEffect(() => {
  //   getAnalyticUsersGender();
  // }, [gender]);

  // useEffect(() => {
  //   getAnalyticUsersYear();
  // }, [startDate]);

  // useEffect(() => {
  //   if(startDate !=null && (gender =="female" || gender=="male" || gender=="other")){
  //     getAnalyticUsersYearnGender();
  //     console.log("ayeshaaaaa")
  //   }
  // }, []);

  return (
    <div className="homeContainer">
      <div className="homeInnerContainer">
        <Row>
          <Col span={24}>
            <div className="homePoweredText">
              <span className="poweredText">
                POWERED BY NEVERLEFT DIGITAL LTD.
              </span>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="homePageOuterContainer">
              <div>
                <div className="homepageHeading">
                  <h1>Analytic Users</h1>
                </div>
              </div>
              <div className="analyticUserTable">
                <div className="yearSelectorContainer">
                  <div className="yearSelector">
                    <Button type="primary" className="btnStyle" onClick={()=>{callFunction()}}>
                      OK
                    </Button>
                    <DatePicker
                      maxDate={new Date()}
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        setIsYear("year");
                      }}
                      dateFormat="yyyy"
                      showYearPicker
                    />
                  </div>

                  <div className="yearSelector">
                    <Select
                      labelInValue
                      defaultValue={{
                        value: "Select Gender",
                        label: "Select Gender",
                      }}
                      onChange={handleChange}
                      options={[
                        {
                          value: "male",
                          label: "Male",
                        },
                        {
                          value: "female",
                          label: "Female",
                        },
                        {
                          value: "other",
                          label: "Other",
                        },
                        {
                          value: "",
                          label: "empty",
                        },
                      ]}
                    />
                    <Button type="primary" className="btnStyle" onClick={()=>{callFunction()}}>
                      Count = {gender =="male"? count.male : gender== "female" ? count.female : gender=="other"? count.other : ""}
                    </Button>
                  </div>
                </div>
                <div>
                  <Row gutter={[16, 16]}>
                    <Col span={6} className="userDataHeader">
                      <b>Student ID</b>
                    </Col>
                    <Col span={6} className="userDataHeader">
                      <b>Email</b>
                    </Col>
                    <Col span={6} className="userDataHeader">
                      <b>DOB</b>
                    </Col>
                    <Col span={6} className="userDataHeader">
                      <b>User Type</b>
                    </Col>
                  </Row>
                </div>
                <div className="userDataScroll">
                  {isLoading ? (
                    <div className="spinDiv">
                      <Spin size="large" />
                    </div>
                  ) : (
                    userData?.map((item) => {
                      return (
                        <Row gutter={[16, 16]}>
                          <Col span={6}>
                            <div className="userDataDiv">{item.studentId}</div>
                          </Col>
                          <Col span={6}>
                            <div className="userDataDiv">{item.email}</div>
                          </Col>
                          <Col span={6}>
                            <div className="userDataDiv">
                              {item.dateofbirth}
                            </div>
                          </Col>
                          <Col span={6}>
                            <div className="userDataDiv">{item.usertype}</div>
                          </Col>
                        </Row>
                      );
                    })
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

export default AnalyticsUsers;
