import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { base_Url } from "../api";
import Header from "../components/Header";
import { Trash2 } from "lucide-react";
import AddHeader from "../components/AddHeader";
import { Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import * as XLSX from "xlsx";
import { Empty } from "antd";

export default function SubTaskList() {
  const token = localStorage.getItem("authtoken");
  const [subTaskData, setSubTaskData] = useState([]);
  const [update, setUpdate] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = subTaskData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (event, value) => {
    console.log(value);
    setCurrentPage(value);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(event.target.value);
    setCurrentPage(1);
  };

  const triggerRerender = () => {
    setUpdate((prev) => !prev);
  };

  const { missionId } = useParams();
  useEffect(() => {
    getSubTask();
  }, [update]);

  const convertJsonToExcel = () => {
    if (!subTaskData) {
      console.error("JSON data is not available.");
      return;
    }

    const sanitizedData = subTaskData.map(
      ({ creation_date, updated_at, mission, ...rest }) => rest
    );

    // Create a workbook with a single worksheet
    const ws = XLSX.utils.json_to_sheet(sanitizedData);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 1");

    // Convert the workbook to a binary string
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

    // Create a Blob from the binary string
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Create a URL for the blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element and trigger a click to download the file
    const a = document.createElement("a");
    a.href = url;
    a.download = "Task.xlsx";
    document.body.appendChild(a);
    a.click();

    // Remove the anchor element
    document.body.removeChild(a);
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  async function getSubTask() {
    try {
      const res = await axios.get(
        `${base_Url}/data/mission-tasks/?mission=${missionId}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setSubTaskData(res.data.data.result);
      console.log("rel", res.data.data.result);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleDelete(id) {
    console.log(id);
    try {
      axios.delete(`${base_Url}/data/mission-tasks/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
    const data = subTaskData.filter((item) => item.id != id);
    setSubTaskData(data);
  }
  console.log(currentRows, "subtask");
  return (
    <>
      {/* <Header title={"Tasks"} /> */}
      <AddHeader
        title={"Tasks"}
        buttonTitle={"XLS"}
        id={missionId}
        Rerender={triggerRerender}
        download={convertJsonToExcel}
      />
      { currentRows.length > 0 ? ( // Check if there are items in currentRows
        <>
          <div className="flex-col justify-between items-center h-full">
            <div style={{ flex: 1 }}>
              <TableContainer className="max-h-[calc(100vh-140px)] overflow-auto" component={Paper}>
                <Table
                  className="head-padding"
                  sx={{ minWidth: 650 }}
                  aria-label="simple table"
                >
                  <TableHead style={{ background: "#C8D9ED",position:'sticky',top:0,zIndex:5 }}>
                    <TableRow>
                      <TableCell>
                        <p className="font-black text-base ">Task Name</p>
                      </TableCell>
                      <TableCell align="left">
                        <p className="font-black text-base ">Mission Name</p>
                      </TableCell>
                      <TableCell style={{ paddingRight: "70px" }} align="right">
                        <p className="font-black text-base ">Action</p>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentRows.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="left">
                          {row.mission_category}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ paddingRight: "60px" }}
                        >
                          <button
                            className="inner-head-bg hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleDelete(row.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <div className="flex justify-center items-center mt-5  ">
              <Pagination
                count={Math.ceil(subTaskData.length / rowsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                rowsPerPage={rowsPerPage}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="mt-[60px]">
        <Empty 
         // image="datac.jpg"
         // imageStyle={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
          description={false}
        /> 
      </div>
      )}
    </>
  );
}
