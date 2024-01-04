import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { base_Url } from "../api";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Info, PlusCircle, Star, Trash2 } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
//import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
//import Typography from '@mui/material/Typography'
//import * as React from 'react';
import { Empty } from "antd";
import Button from "@mui/material/Button";

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

export default function Task() {
  const [open, setOpen] = React.useState(false);
  const [update, setUpdate] = useState(true);
  const triggerRerender = () => {
    console.log("render task");
    setUpdate((prev) => !prev);
  };
  const handleOpen = (id) => {
    console.log("ayush", id);
    setUserId(id);
    setOpen(true);
  };
  const handleClose = (id) => {
    setOpen(false);
    setUserId("");
  };

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: "#f5f5f9",
      color: "rgba(0, 0, 0, 0.87)",
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: "1px solid #dadde9",
    },
  }));

  const [mData, setMData] = useState([]);
  //const [open, setOpen] = React.useState(false);
  const [catId, setCatId] = useState(null);
  const [cat, setCat] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("authtoken");
  const [userId, setUserId] = useState("");
  //const handleClose = () => setOpen(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = mData.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (event, value) => {
    console.log(value);
    setCurrentPage(value);
  };
  // const [open2, setOpen2] = React.useState(false);

  useEffect(() => {
    console.log("task");
    getMissionD(token);
    getCat();
  }, [update]);

  const handleMenuItemClick = (event, selectedItem) => {
    event.preventDefault();
  //  setIsMenuOpen(false);

  
    // Handle menu item click logic here
    //console.log(selectedItem.id, " I am an option");
    handleToggleFeatured(selectedItem);
  };
  const handleToggleFeatured = async (selectedItem) => {
    try {
      const res = await axios.patch(
        `${base_Url}/data/missions/${selectedItem.id}`,
        { is_featured: !selectedItem.is_featured },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(res.data, "mission updated successfully");
      setUpdate((prev) => !prev);
      // Update the local state after the successful update
      
    } catch (error) {
      console.error(error);
    }
  };
  async function getMissionD(token) {
    try {
      const res = await axios.get(`${base_Url}data/missions/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(res.data.data.result, "userData");
      setMData(res.data.data.result);
    } catch (error) {
      console.log(error);
    }
  }
  async function getCat() {
    try {
      const res = await axios.get(`${base_Url}/data/mission-type-dropdown/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(res.data.data.mission_type_list);
      setCat(res.data.data.mission_type_list);
    } catch (error) {
      console.log(error);
    }
  }
  function onAddMissionClick() {
    navigate("/addMission");
  }
  async function handleDelete(id) {
    try {
      await axios.delete(`${base_Url}/data/missions/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Deleted succesfully");
    } catch (error) {
      console.log(error);
    }
    const data = mData.filter((item) => item.id != id);
    setMData(data);
  }
  const [task, setTask] = useState("");

  //const navigate = useNavigate();
  //const { userId } = useParams();
  console.log(userId, "parm id");
  //const token = localStorage.getItem("authtoken");
  const handleChange = (e) => {
    setTask(e.target.value);
  };

  const handleAddTask = async () => {
    try {
      console.log("Adding subtask:", task, userId);

      const res = await axios.post(
        `${base_Url}data/mission-tasks/`,
        { name: task, mission: userId },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      handleClose();
      toast.success("Subtask added successfully");
      //navigate("/tasks");
    } catch (error) {
      handleClose();
      console.log(error);
      toast.error("Failed Adding Subtask");
    }
    setTask("");
  };
  return (
    <>
      <Header
        title="Mission"
        buttonTitle="Mission"
        cat={cat}
        setCatId={setCatId}
        mission={true}
        // onClick={handleOpen2}
        mData={mData}
        setMData={setMData}
        renders={triggerRerender}
      />

      {currentRows.length > 0 ? (
        <>
          <TableContainer className="" component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"
              // className="mt-5"
              className="head-padding"
            >
              <TableHead style={{ background: "#C8D9ED" }}>
                <TableRow>
                  <TableCell align="left">
                    <p className="font-black text-base ">Mission Name</p>
                  </TableCell>
                  <TableCell align="left">
                    <p className="font-black text-base ">Category</p>
                  </TableCell>
                  <TableCell align="left">
                    <p className="font-black text-base ">Description</p>
                  </TableCell>
                  <TableCell align="left">
                    <p className="font-black text-base ">Total Tasks</p>
                  </TableCell>
                  <TableCell align="left">
                    <p className="font-black text-base ">Featured</p>
                  </TableCell>
                  <TableCell style={{ paddingRight: "60px" }} align="right">
                    <p className="font-black text-base ">Action</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      onClick={() => navigate(`/tasks-view/${row.id}`)}
                      component="th"
                      scope="row"
                      style={{ cursor: "pointer" }}
                    >
                      {row.name}
                    </TableCell>
                    <TableCell>{row.mission_category}</TableCell>

                    <TableCell align="left">
                      <div className="ml-5">
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
                          <Button>
                            <Info />
                          </Button>
                        </HtmlTooltip>
                      </div>
                    </TableCell>

                    <TableCell align="left">
                      <div className="ml-10">{row.tasks.length}</div>
                    </TableCell>
                    <TableCell align="left">
                      {row.is_featured ? (
                        <div className="ml-7">
                          <Star onClick={(event) => handleMenuItemClick(event, row)} fill="#532f80" strokeWidth={1} />
                        </div>
                      ) : (
                        <div className="ml-7">
                          <Star onClick={(event) => handleMenuItemClick(event, row)} fill="white" strokeWidth={1} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <div className="mr-3">
                        <button
                          style={{}}
                          onClick={
                            //navigate(`/addSubtask/${row.id}`);
                            () => {
                              handleOpen(row.id);
                            }
                          }
                          className="inner-head-bg  hover:bg-blue-200 text-white font-bold mx-3 py-2 px-4 rounded"
                        >
                          <PlusCircle size={18} />
                        </button>

                        <button
                          className="inner-head-bg  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              {/* <div className="bg-white  add-subtask shadow-md rounded px-8 pt-6 pb-8 mb-4"> */}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-xl font-semibold mb-4 text-center"
                  htmlFor="taskInput"
                >
                  Add Subtask
                </label>
                <input
                  className=" w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
                  id="taskInput"
                  type="text"
                  placeholder="Enter subtask..."
                  value={task}
                  onChange={handleChange}
                />
              </div>
              <div class="submit-btn mt-3 flex justify-evenly">
                <button
                  className="inner-head-bg hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={handleAddTask}
                >
                  Add
                </button>
                <button
                  className="inner-head-bg hover:bg-blue-700 text-white font-bold rounded"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </div>
              {/* </div> */}
            </Box>
          </Modal>
          <div className="flex justify-center items-center mt-5  ">
            <Pagination
              count={Math.ceil(mData.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              rowsPerPage={rowsPerPage}
            />
          </div>
        </>
      ) : (
        <div className="mt-[60px]">
          <Empty
            image="datac.jpg"
            imageStyle={{
              height: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            description={false}
          />
        </div>
      )}
    </>
  );
}
