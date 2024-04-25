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
import { ArrowDownUp, Pencil, Trash2 } from "lucide-react";
import AddHeader from "../components/AddHeader";
import { Button } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import * as XLSX from "xlsx";
import { Empty } from "antd";
import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { toast } from "sonner";

export default function SubTaskList() {
  const token = localStorage.getItem("authtoken");
  const [subTaskData, setSubTaskData] = useState([]);
  const [update, setUpdate] = useState(true);
  const [row,setRow] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [etask,setEtask] = useState('');
  const [order,setOrder] = useState('');
  const [loading,setLoading] = useState(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  const handleOpenModal = (row) => {console.log(row,"row"); 
  setRow(row); 
  setEtask(row?.name);
  setOpenModal(true)};
  const handleCloseModal = () => {setOpenModal(false); setEtask(""); setRow(null);}

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

  const handleEdit = async ()=>{
    setLoading(true);
    const value = localStorage.getItem("authtoken");
    try {
      if (etask) {
        const res = await axios.patch(
          `${base_Url}/data/mission-tasks/${row.id}`,{name:etask} ,
          {
            headers: {
              Authorization: `Token ${value}`,
            },
          }
        );

        console.log(res,"updated");
        }
      else{
        return;
      }
      getSubTask();
      setLoading(false);
      handleCloseModal();
      toast.success("Task updated successfully");
    } catch (error) {
      setLoading(false);
      toast.error("Task failed to update");
      console.log(error);
    }
  }

  const triggerRerender = () => {
    setUpdate((prev) => !prev);
  };

  const { missionId } = useParams();
  useEffect(() => {
    getSubTask();
  }, [update]);

  const convertJsonToExcel = () => {
    console.log("json");
    console.log(subTaskData,'subrask');
    if (subTaskData.length===0) {
      console.log("JSON data is not available.");
    }
    let sanitizedData = [];
    if(subTaskData.length===0){
      sanitizedData = [{id:"",mission_name:"",name:""}]
    }else{
       sanitizedData = subTaskData.map(
        ({ creation_date, updated_at, mission,mission_category,complete_task,is_created_by_admin,user,is_edit,task_id ,...rest }) => rest
      );
    }
    

 

    // Create a workbook with a single worksheet
    const ws = XLSX.utils.json_to_sheet(sanitizedData);

    
  // Make the first row bold
  // const headers = Object.keys(sanitizedData[0]);
  // headers.forEach((header, index) => {
  //   const cell = XLSX.utils.encode_cell({ r: 0, c: index });
  //   ws[cell].s = { font: { bold: true } };
  // });


 
 
  

  // Centering the content in each cell
  Object.keys(ws).forEach(cellAddress => {
    const cell = ws[cellAddress];
    if (cell && cell.t) {
      cell.s = { alignCentre: true };
    }
  });
  
    // Adjusting column sizes
    const columnWidths = [{ wch: 20 }, { wch: 30 }, { wch: 30 }, { wch: 20 }]; // Specify the width for each column
    ws['!cols'] = columnWidths;

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

  const handleOrder = ()=>{
    if(order === '-'){
      setOrder('');
    }else{
      setOrder('-');
    }
    getSubTask()
  }

  async function getSubTask() {
    setLoading(true);
    try {
      console.log(`${base_Url}/data/mission-tasks/?mission=${missionId}&ordering=${order}name`)
      const res = await axios.get(
        `${base_Url}/data/mission-tasks/?mission=${missionId}&ordering=${order}name`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setLoading(false);
      setSubTaskData(res.data.data.result);
      console.log("rel", res.data.data.result);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  async function handleDelete(id) {
    
    console.log(id);
    try {
      setLoading(true);
      axios.delete(`${base_Url}/data/mission-tasks/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
                        <div className="flex gap-2">
                        <p className="font-black text-base ">Task Name</p>
                        <ArrowDownUp onClick={handleOrder} />
                        </div>
                      </TableCell>
                      <TableCell align="left">
                        <p className="font-black text-base ">Mission Name</p>
                      </TableCell>
                      <TableCell style={{ paddingRight: "70px" }} align="right">
                        <p className="font-black text-base mr-5 ">Action</p>
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

                          <div className="w-[250px] flex-wrap break-words"> {row.name} </div>
                        </TableCell>
                        <TableCell align="left">
                        <div className="w-[250px] flex-wrap break-words"> {row.mission_category} </div>
                          
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{ paddingRight: "60px" }}
                        >
                        <div className="flex justify-end gap-2">
                        <button
                         disabled={loading}
                          className="inner-head-bg  hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          onClick={()=>handleOpenModal(row)}
                        >
                          <Pencil size={18} />
                        </button>
                          <button
                           disabled={loading}
                            className="inner-head-bg hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleDelete(row.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

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
          <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            style={{ fontSize: "30px", textAlign:"center" }}
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            Edit task
          </Typography>
          <label
            className=" mt-4 mb-4 block text-gray-700 text-md font-bold"
            htmlFor="taskName"
          >
            Task Name:
          </label>
          <input
            onChange={(e) => setEtask(e.target.value)}
            className="mb-4 w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            name="taskName"
            // value={taskData.taskName}
            // onChange={handleInputChange}
            placeholder="Enter Task Name"
            value = {etask}
          />

          <div class="submit-btn mt-3 flex justify-evenly">
            <button
              disabled={loading}
              onClick={() => handleEdit()}
              className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
            >
              Save
            </button>
            <button
              disabled={loading}
              onClick={handleCloseModal}
              className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
          
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
