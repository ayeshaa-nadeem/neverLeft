import
React,
{ useEffect, useState } from "react";
import {

    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    LineChart,
    Line,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import {
    Modal,
    Spin,
    Button,
    Switch,
} from "antd";
import moment from "moment";
import DatePicker from "react-datepicker";
import { getApiWithAuth } from "../../../utils/api";
import { Url } from "../../../utils/apiUrl";
import "react-datepicker/dist/react-datepicker.css";
import "./Analytics.scss";
import { ToggleSwitch } from "../../commonComponents";

export default function ClubAnalytics() {
    const [clubs, setClubs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedClub, setSelectedClub] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState(moment(startDate).format("YYYY-MM-DD"));
    const [selectedButton, setSelectedButton] = useState("date");
    const [selectedToggleButton, setSelectedToggleButton] = useState("hanger")
    const [hangerCount, setHangerCount] = useState([]);
    const [switchState, setSwitchState] = useState(false)
    const [isLoading, setIsLoading] = useState({
        fetchClubLoader: false,
        chartLoader: false,
    });

    const handleButtonFilterClick = (type, format) => {
        setSelectedButton(type);
        setFormattedDate(moment(startDate).format(format));
    };

    const getAllClubs = async () => {
        setIsLoading({ ...isLoading, fetchClubLoader: true })
        const response = await getApiWithAuth(Url.clubsUrl);
        if (response.success) {
            setClubs(response.data);
        }
        setIsLoading({ ...isLoading, fetchClubLoader: false })
    }

    const getHangerCount = async () => {
        setIsLoading({ ...isLoading, chartLoader: true })
        const response = await getApiWithAuth(`${switchState ? Url.ticketCount : Url.hangerCount}?${selectedButton}=${formattedDate}&club_id=${selectedClub._id}`)
        if (response.success) {
            if (selectedButton === "year") {
                setHangerCount(getMonthCount(response.data));
            } else {
                setHangerCount(response.data);
            }
        }
        setIsLoading({ ...isLoading, chartLoader: false })
    }

    const getMonthCount = (data) => {
        const result = [];
        data.forEach(item => {
            let count = 0;
            item.days.forEach(day => {
                count += day.count;
            });
            result.push({
                _id: item.month,
                count: count
            });
        });
        return result;
    }

    useEffect(() => {
        getAllClubs();
    }, [])

    useEffect(() => {
        if (selectedButton === "date") {
            setFormattedDate(moment(startDate).format("YYYY-MM-DD"));
        } else if (selectedButton === "month") {
            setFormattedDate(moment(startDate).format("YYYY-MM"));
        } else {
            setFormattedDate(moment(startDate).format("YYYY"));
        }
    }, [startDate])

    useEffect(() => {
        getHangerCount();
    }, [switchState])


    return (
        <div className="analyticsContainer">
            <div className="homePageOuterContainer analyticsW100">
                <div className="homepageHeading">
                    <h1>CLUB ANALYTICS</h1>
                </div>
                {
                    isLoading.fetchClubLoader
                        ? <Spin
                            tip="Loading"
                            size="large"
                        />
                        : (
                            <div className="clubAnalyticsContainer">
                                {
                                    clubs.map(item => (
                                        <div
                                            className="clubCardMargin"
                                            onClick={() => {
                                                setSelectedClub(item);
                                                setShowModal(true);
                                                getHangerCount();
                                            }}
                                        >
                                            <div className="clubcard1">
                                                <div className="clubcardInner">
                                                    <div>
                                                        <h1 className="clubinstitution">
                                                            {item.name}
                                                        </h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                <Modal
                                    width={800}
                                    title={selectedClub.name}
                                    open={showModal}
                                    onCancel={() => setShowModal(false)}
                                    footer={[
                                        <div className='toggleSwitchContainer'>
                                            <button
                                                className={
                                                    selectedToggleButton === "ticket"
                                                        ? 'toggleButton toggleButtonSelected'
                                                        : "toggleButton"
                                                }
                                                onClick={() => {
                                                    setSelectedToggleButton("ticket");
                                                    setSwitchState(true);
                                                }}
                                            >
                                                Ticket Count
                                            </button>
                                            <button
                                                className={
                                                    selectedToggleButton === "hanger"
                                                        ? 'toggleButton toggleButtonSelected'
                                                        : "toggleButton"
                                                }
                                                onClick={() => {
                                                    setSelectedToggleButton("hanger");
                                                    setSwitchState(false)
                                                }}
                                            >
                                                Hanger Count
                                            </button>
                                        </div>
                                    ]}
                                >
                                    <div>
                                        <div className="modalTopContainer">
                                            <div className="timeButtonContainer">
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleButtonFilterClick("date", "YYYY-MM-DD")}
                                                    className={
                                                        selectedButton === "date"
                                                            ? "btnStyle selected-button"
                                                            : "btnStyle"
                                                    }
                                                >
                                                    Date
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleButtonFilterClick("month", "YYYY-MM")}
                                                    className={
                                                        selectedButton === "month"
                                                            ? "btnStyle selected-button"
                                                            : "btnStyle"
                                                    }
                                                >
                                                    Month
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    onClick={() => handleButtonFilterClick("year", "YYYY")}
                                                    className={
                                                        selectedButton === "year"
                                                            ? "btnStyle selected-button"
                                                            : "btnStyle"
                                                    }
                                                >
                                                    Year
                                                </Button>
                                            </div>
                                            <div style={{ width: "30%" }}>
                                                {
                                                    selectedButton === "date"
                                                        ? <DatePicker
                                                            maxDate={new Date()}
                                                            selected={startDate}
                                                            onChange={(date) => {

                                                                setStartDate(date);
                                                            }}
                                                            dateFormat="yyyy-MM-dd"
                                                        />
                                                        : selectedButton === "month"
                                                            ? <DatePicker
                                                                maxDate={new Date()}
                                                                selected={startDate}
                                                                onChange={(date) => {
                                                                    setStartDate(date);
                                                                }}
                                                                dateFormat="yyyy-MM"
                                                                showMonthYearPicker
                                                            />
                                                            : <DatePicker
                                                                maxDate={new Date()}
                                                                selected={startDate}
                                                                onChange={(date) => {
                                                                    setStartDate(date);
                                                                }}
                                                                dateFormat="yyyy"
                                                                showYearPicker
                                                            />
                                                }
                                            </div>
                                            <Button
                                                type="primary"
                                                className="btnStyle"
                                                style={{ width: "25%" }}
                                                onClick={() => getHangerCount()}
                                            >
                                                Go
                                            </Button>
                                        </div>
                                        {
                                            hangerCount.length > 0
                                                ? (
                                                    <ResponsiveContainer height={300} className="chartsContainer">
                                                        <LineChart
                                                            data={hangerCount}
                                                            margin={{
                                                                top: 5,
                                                                right: 20,
                                                                bottom: 5,
                                                                left: 0
                                                            }}
                                                        >
                                                            <Line
                                                                type="monotone"
                                                                dataKey="count"
                                                                stroke="#8884d8"
                                                            />
                                                            <CartesianGrid
                                                                stroke="#ccc"
                                                                strokeDasharray="5 5"
                                                            />
                                                            <XAxis dataKey="_id" />
                                                            <YAxis domain={[0, hangerCount.length <= 3 ? 4 : hangerCount.length]} />
                                                            <Tooltip />
                                                        </LineChart>
                                                    </ResponsiveContainer>
                                                )
                                                : isLoading.chartLoader
                                                    ? <Spin
                                                        tip="Loading"
                                                        size="large"
                                                        style={{ width: "100%" }}
                                                    />
                                                    : <p className="noDataStyle">NO DATA</p>
                                        }
                                    </div>
                                </Modal>
                            </div>
                        )}
            </div >
        </div >
    )
}
