import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts";
import { CalendarCheck, Settings2, SquareUser, User } from "lucide-react";
import DashHeader from "../components/DashHeader";
import axios from "axios";




export default function Dashboard() {
  const [Data, setData] = useState([]);
  const [userData, setUserData] = useState([]);

  async function getData() {

    const token = localStorage.getItem("authtoken");
    // const navigate = useNavigate();
     try {
       const res = await axios.get(`http://127.0.0.1:8000/data/missions-count-by-category/`, {
         headers: {
          Authorization: `Token ${token}`,
         },
       });
       console.log(res.data.data, " i am a dashboard");
       setData(res.data.data);
     } catch (error) {
  
       console.log(error,"user");
     }
   }


  const chartSetting = {
    yAxis: [
      {
        label: "Missions",
      },
    ],
    width: 1100,
    height: 500,

    // sx: {
    //   [`.${axisClasses.left} .${axisClasses.label}`]: {
    //     transform: "translate(-20px, 0)",
    //   },
    // },
  };

  async function getUserData() {

    const token = localStorage.getItem("authtoken");
   // const navigate = useNavigate();
    try {
      const res = await axios.get(`http://127.0.0.1:8000/account/users/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(res.data.data.result, " i am a response");
      setUserData(res.data.data.result);
    } catch (error) {

      console.log(error,"user");
    }
  }

  useEffect(() => {
    getData();
    getUserData()
  }, []);

  //const xAxisData=["movie"];
  //const seriesData = [1];



  const xAxisData = Data?.map((item) => item.mission_type__mission_type);
  const seriesData = Data?.map((item) => item.count);

  const xAxisDataLength = xAxisData ? xAxisData.length : 0;
  const seriesDataSum = seriesData ? seriesData.reduce((sum, value) => sum + value, 0) : 0;


  return (

    
    <>
      <DashHeader title={"Dashboard"} />
      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3 p-4">
        <div className="min-height bg-blue w-full bg-gray rounded-lg flex justify-between items-center">
          <div className="text-sm font-medium text-gray truncate">
            Total users
            <div className="mt-1 text-3xl font-semibold text-gray">{userData.length}</div>
          </div>
          <div className="home-icon">
            <User size={35} />
          </div>
        </div>
        <div className="min-height bg-darkblue w-full bg-gray rounded-lg flex justify-between items-center">
          <div className="text-sm font-medium text-gray truncate ">
            Total Categories
            <div className="mt-1 text-3xl font-semibold text-gray ">{xAxisDataLength}</div>
          </div>
          <div className="home-icon">
            <Settings2 size={35} />
          </div>
        </div>
        <div className="min-height bg-peach w-fullbg-gray rounded-lg flex justify-between items-center">
          <div className="text-sm font-medium text-gray truncate ">
            Total Missions
            <div className="mt-1 text-3xl font-semibold text-gray ">{seriesDataSum}</div>
          </div>
          <div className="home-icon">
            <CalendarCheck size={35} />
          </div>
        </div>
      </div>
      <div className=" w-full ">
      <div className="ml-[180px] ">

      {xAxisData.length > 0 ? (
            <BarChart
              xAxis={[{ scaleType: "band", data: xAxisData }]}
              series={[{ data: seriesData }]}
              {...chartSetting}
            />
          ) : (
            <div>No data available for the chart.</div>
          )}
        
       
      </div>
      </div>
    </>
  );
}
