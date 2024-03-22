import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useParams } from "react-router-dom";
import { base_Url } from "../api";
import Header from "../components/Header";
import AddHeader from "../components/AddHeader";
import * as XLSX from 'xlsx';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography'
import { Info } from "lucide-react";
import { Empty } from 'antd';

export default function ConfigMissions() {
  const [missionData, setMissionData] = useState([]);
  const token = localStorage.getItem("authtoken");
  const { catId } = useParams();
  const [update,setUpdate] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = missionData.slice(indexOfFirstRow, indexOfLastRow);

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }));

  const handlePageChange = (event, value) => {
    console.log(value);
    setCurrentPage(value);
  };


  const triggerRerender = () => {
    setUpdate((prev) => !prev);
  };
  console.log(catId, "param");

  const convertJsonToExcel = () => {
    if (!missionData) {
      console.error('JSON data is not available.');
      return;
    }

    const sanitizedData = missionData.map(({ tasks,total_friends_in_mission, mission_type,creation_date,updated_at, user, ...rest }) => rest);

    // Create a workbook with a single worksheet
    const ws = XLSX.utils.json_to_sheet(sanitizedData);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');

  // Convert the workbook to a binary string
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  // Create a Blob from the binary string
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

  // Create a URL for the blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element and trigger a click to download the file
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Mission.xlsx';
  document.body.appendChild(a);
  a.click();

  // Remove the anchor element
  document.body.removeChild(a);
  };


  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };
  async function getCatMission() {
    try {
      const res = await axios.get(
        `${base_Url}/data/admin-missions/?mission_type=${catId}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(res.data.data.result);

      setMissionData(res.data.data.result);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getCatMission();
  }, [update]);
  return (
    <>
      {/* <Header  /> */}
      <AddHeader title={"Category Missions"} buttonTitle={"XLS"} id={catId} Rerender={triggerRerender} download={convertJsonToExcel}/>

      {currentRows.length > 0 ? ( 
        
        <>
        <TableContainer className="max-h-[calc(100vh-140px)] overflow-auto" component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" className="table head-padding">
          <TableHead  style={{ background: "#C8D9ED",position:'sticky',top:0,zIndex:5 }}>
            <TableRow className=" flex ">
              <TableCell>
              <p className="font-black text-base ">Missions</p>
                </TableCell>
                <TableCell>
              <p className="font-black text-base ml-[300px] ">Description</p>
                </TableCell>
              <TableCell >
              <p className="font-black text-base  ">Subtask Count</p>
                </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                 style={{height:3}}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>

                <TableCell align="left">
                  <div  className="ml-[320px]">
                  <HtmlTooltip
                    title={
                      <React.Fragment>
                        <Typography color="inherit">
                        {row.name}
                        </Typography>
                        {row.description}
                      </React.Fragment>
                    }
                  >
                    
                    <Button><Info/></Button>
                  </HtmlTooltip>
                  </div>
                </TableCell>
                <TableCell >
                  <div  className="ml-[60px]">
                  {row.tasks.length}
                  </div>
                  </TableCell>
                  
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center items-center mt-5  ">
      <Pagination
        count={Math.ceil(missionData.length / rowsPerPage)}
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
      )}
      
    </>
  );
}
