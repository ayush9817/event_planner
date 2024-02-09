import { useState } from "react";
import CatHeader from "../components/CatHeader";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { base_Url } from "../api";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Pagination from '@mui/material/Pagination';
import { Empty } from 'antd';
import { Trash2 } from "lucide-react";
export default function Config() {
  const [update,setUpdate] = useState(true);
  const triggerRerender = () => {
    setUpdate((prev) => !prev);
  };
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("active");
  const [activeCatData, setActiveCatData] = useState([]);
  const [inActiveCatData, setInActiveCatData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = activeCatData.slice(indexOfFirstRow, indexOfLastRow);

  const [currentPagei, setCurrentPagei] = useState(1);
  const [rowsPerPagei, setRowsPerPagei] = useState(10);

  const indexOfLastRowi = currentPagei * rowsPerPagei;
  const indexOfFirstRowi = indexOfLastRowi - rowsPerPagei;
  const currentRowsi = inActiveCatData.slice(indexOfFirstRowi, indexOfLastRowi);

  const handlePageChange = (event, value) => {
    console.log(value);
    setCurrentPage(value);
  };
  const handlePageChangei = (event, value) => {
    console.log(value);
    setCurrentPagei(value);
  };
  const [token, setToken] = useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("authtoken");
    setToken(token);
    console.log("i am token", token);
    getActiveCatData(token);
    getInActiveCatData(token);
  }, [activeTab,update]);

  async function getActiveCatData(token) {
    try {
      const res = await axios.get(
        `${base_Url}/data/mission-type/?is_active=True`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("res", res.data.data.result);
      setActiveCatData(res.data.data.result);
    } catch (error) {
      console.log("error", error);
    }
  }

  async function getInActiveCatData(token) {
    try {
      const res = await axios.get(
        `${base_Url}/data/mission-type/?is_active=False`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("res", res.data.data.result);
      setInActiveCatData(res.data.data.result);
    } catch (error) {
      console.log("error");
    }
  }

  async function handleSwitch(id, token, action) {
    try {
      const res = await axios.patch(
        `${base_Url}data/mission-type/${id}`,
        {
          is_active: action,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (action === false) {
        const data = activeCatData.filter((item) => item.id != id);
        setActiveCatData(data);
      }
      if (action === true) {
        const data = inActiveCatData.filter((item) => item.id != id);
        setInActiveCatData(data);
      }
      // navigate("/dashboard");
      toast.success("Category switched successfully");
    } catch (error) {
      console.log(error);
    }
   
  }

  function handleViewButton(id) {
    navigate(`/catmissionList/${id}`);
  }
  return (
    <>
      <div>
        <CatHeader
          title="Configuration"
          setActiveTab={setActiveTab}
          activeTab={activeTab}
          render={triggerRerender}
        />
      </div>
      {activeTab === "active" ? (

currentRows.length > 0 ? (
  <>
          <TableContainer className="max-h-[calc(100vh-140px)] overflow-auto" component={Paper}>
            <Table
              className="table head-padding"
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead style={{ background: "#C8D9ED",position:'sticky',top:0,zIndex:5 }}>
                <TableRow>
                  <TableCell>
                    {" "}
                    <p className="font-black text-base ">Name</p>
                    {" "}
                  </TableCell>
                  <TableCell  style={{ paddingRight: "100px" }} align="right">
                  <p className="font-black text-base mr-2 ">Action</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.mission_type}
                    </TableCell>
                    <TableCell  align="right">
                      <div className="flex justify-center items-center gap-2 ml-[690px] 2xl:ml-[1090px]">
                     
                      <Button
                        className="inner-head-bg hover:bg-green-700"
                        onClick={() => handleViewButton(row.id)}
                        title="View Missions"
                      />
                      <button
                        onClick={() => handleSwitch(row.id, token, false)}
                        className="inner-head-bg  hover:bg-green-700 text-white font-bold py-2 px-4 rounded "
                      >
                        {activeTab === "active" ? "Inactive" : ""}
                      </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center items-center mt-5  ">
      <Pagination
        count={Math.ceil(activeCatData.length / rowsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        rowsPerPage={rowsPerPage}
      />
      </div>
        </>
  
) : (
  <div className="mt-[60px]">
       <Empty 
        
        //image="data.jpg"
     
        //imageStyle={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
        description={
        false
       }
     
     /> 
  </div>
)
        
      ) : (


        currentRowsi.length > 0 ? (

          <>
          <TableContainer className="max-h-[calc(100vh-140px)] overflow-auto" component={Paper}>
            <Table
              className="table-striped "
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead style={{ background: "#C8D9ED",position:'sticky',top:0,zIndex:5 }}>
                <TableRow>
                  <TableCell>
                  <p className="font-black text-base ">Category Name</p>
                  </TableCell>
                  <TableCell style={{ paddingRight: "40px" }} align="right">
                  <p className="font-black text-base ">Action</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRowsi.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.mission_type}
                    </TableCell>
                    <TableCell align="right">
                      {activeTab === "active" ? (
                        <Button
                        className="inner-head-bg hover:bg-green-700"
                          onClick={handleViewButton}
                          title="View Missionse"
                        />
                      ) : (
                        <></>
                      )}
                      <button
                        onClick={(e) => handleSwitch(row.id, token, true)}
                        className="inner-head-bg hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-4"
                      >
                        Active
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="flex justify-center items-center mt-5  ">
      <Pagination
        count={Math.ceil(inActiveCatData.length / rowsPerPage)}
        page={currentPagei}
        onChange={handlePageChangei}
        rowsPerPage={rowsPerPagei}
      />
      </div>
        </>
         
        ) : (
          <div className="mt-[60px]">
        <Empty 
        
           image="data.jpg"
        
           imageStyle={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
           description={
           false
          }
        
        /> 
        </div>
        )
      
        
      )}
    </>
  );
}


