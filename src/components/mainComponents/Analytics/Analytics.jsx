import React, { useEffect, useState } from 'react'
import "./Analytics.scss"
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    Tooltip
} from 'recharts';
import { Spin } from 'antd';
import { getApiWithAuth } from "../../../utils/api";
import { Url } from "../../../utils/apiUrl"
import 'react-datepicker/dist/react-datepicker-cssmodules.css';


const Analytics = () => {

    const [studentCount, setStudentCount] = useState({})
    const [pieData, setPieData] = useState([])

    const getPieData = (data) => {
        const pieData = [];
        for (const key in data) {
            pieData.push({
                name: key,
                value: data[key]
            });
        }
        return pieData;
    }

    const calcPercentage = (value, total) => {
        const percentage = (value / total) * 100;
        return percentage.toFixed(2) + '%';
    }

    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const getStudentCount = async () => {
        const response = await getApiWithAuth(Url.countUsers)
        if (response?.success) {
            setStudentCount(response.data);
            setPieData(getPieData(response.data));
        } else {
            alert("Something Went Wrong. Please Try Again Later.")
        }
    }

    useEffect(() => {
        getStudentCount();
    }, [])



    return (
        <div className="analyticsContainer">
            <div className="homePageOuterContainer analyticsW100">
                <div className="homepageHeading">
                    <h1>ANALYTICS</h1>
                </div>
                <div style={{ width: "100%", height: "98%", display: "flex", flexDirection: "column" }}>
                    <div className="analyticsUserCount">
                        <span>TOTAL STUDENTS: </span>
                        <span style={{ backgroundColor: "black", color: "#5ce1e6", padding: 3, borderRadius: "0.375rem" }}>{studentCount?.Totalstudents ? studentCount.Totalstudents : <Spin size='small' style={{ padding: 5 }} />}</span>
                        <span> TOTAL NORMAL USERS: </span>
                        <span style={{ backgroundColor: "black", color: "#5ce1e6", padding: 3, borderRadius: "0.375rem" }}>{studentCount?.TotalNormalUser ? studentCount.TotalNormalUser : <Spin size='small' style={{ padding: 5 }} />}</span>
                    </div>
                    <div className='pieChartContainer'>
                        <PieChart width={400} height={364} margin={{ bottom: 30, }}>
                            <Pie
                                data={pieData}
                                cx={200}
                                cy={170}
                                innerRadius={70}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {
                                    pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))
                                }
                            </Pie>
                            <Tooltip formatter={(value) => calcPercentage(value, pieData.reduce((acc, cur) => acc + cur.value, 0))} />
                            <Legend />
                        </PieChart>

                    </div>
                </div>
            </div >
        </div >
    );
}

export default Analytics;


