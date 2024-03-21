import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import Select from 'react-select'
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
import { Info, Pencil, PlusCircle, Star, Trash2 } from "lucide-react";
import Pagination from "@mui/material/Pagination";
import { styled } from "@mui/material/styles";
//import Button from '@mui/material/Button';
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
//import Typography from '@mui/material/Typography'
//import * as React from 'react';
import { Empty } from "antd";
import Button from "@mui/material/Button";
import { Autocomplete, TextField } from "@mui/material";

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
  const [openModal, setOpenModal] = React.useState(false);
  const [update, setUpdate] = useState(true);
  const handleOpenModal = (row) => {
    setMission(row.name);
    setDes(row.description);

    console.log(row,"row"); setRow(row); setOpenModal(true)
  };
  const handleCloseModal = () => setOpenModal(false);
  const [category ,setCategory] = useState(null)
  const [des,setDes] = useState('');
  const [loading, setLoading] = useState(true);

 

  const handleSubmitUpdate = async (e)=>{
    e.preventDefault()
    const value = localStorage.getItem("authtoken");
    try {
      const formData = new FormData();
      if (mission) {
        formData.append('name', mission);
      }
      if (image) {
        formData.append('mission_detail_photo', image);
      }
      if (category) {
        formData.append('mission_category', category);
      }
      if(des){
        formData.append('description', des);
      }
      if (formData.has('name') || formData.has('mission_detail_photo') || formData.has('mission_category') || formData.has('description')  ) {
      const res = await axios.patch(`${base_Url}data/missions/${row.id}`,formData,
        {
          headers: {
            Authorization: `Token ${value}`,
          },
        }
      );
      console.log(res,"updating category");
      }
      getMissionD(token);
      
      handleCloseModal();
      toast.success("Mission updated successfully");
    } catch (error) {
      toast.error("Failed to update mission");
      console.log(error);
    }
  }

  const [Task, settask] = useState('');
  const [tasks, setTasks] = useState([]);

  console.log("tasks",tasks)

  const handleChanget = (e) => {
    settask(e.target.value);
  };

  const handleAddTaskt = () => {
    // Logic to handle adding tasks
    setTasks([...tasks, Task]);
    // Clear input field after adding task if needed
    settask('');
  };


  console.log(category,'category');

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
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("authtoken");
  const [userId, setUserId] = useState("");
  const [row,setRow] = useState("");
  //const handleClose = () => setOpen(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [catIda, setCatIda] = useState(null);

  const [mission,setMission] = useState("");
  const [description,setDescription] = useState('');

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
    setLoading(true);
    getMissionD(token);
    getCat();
    
  }, [update]);


  console.log(cat,"cat");

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
  const getMissionD = async (token)=> {
    try {
      const res = await axios.get(`${base_Url}data/admin-missions/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(res.data.data.result, "userData");
      setLoading(false)
      setMData(res.data.data.result);
       
    } catch (error) {
      setLoading(false);
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
        { task_list: tasks, mission: userId },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      handleClose();
      toast.success("Subtasks added successfully");
      //navigate("/tasks");
    } catch (error) {
      handleClose();
      console.log(error);
      toast.error("Failed Adding Subtask");
    }
    setTask("");
  };
  console.log(loading,"loading")
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
     {/* {loading ? (<>Loading</>) : ( */}

     <> 

      {currentRows?.length > 0 && mData ? (
        <>
          <TableContainer className="max-h-[calc(100vh-140px)] overflow-auto" component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              aria-label="simple table"

              // className="mt-5"
              className="head-padding "
            >
              <TableHead  style={{ background: "#C8D9ED",position:'sticky',top:0,zIndex:5 }}>
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
                    <p className="font-black text-base  mr-3">Action</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody  >
                {currentRows?.map((row) => (
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
                          <Star className="cursor-pointer" onClick={(event) => handleMenuItemClick(event, row)} fill="#FFD700" strokeWidth={1} />
                        </div>
                      ) : (
                        <div className="ml-7">
                          <Star className="cursor-pointer" onClick={(event) => handleMenuItemClick(event, row)} fill="white" strokeWidth={1} />
                        </div>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex gap-2 items-center justify-end">
                        <button
                          style={{}}
                          onClick={
                            //navigate(`/addSubtask/${row.id}`);
                            () => {
                              handleOpen(row.id);
                            }
                          }
                          className="inner-head-bg  hover:bg-green-700 text-white font-bold  py-2 px-4 rounded"
                        >
                          <PlusCircle size={18} />
                        </button>
                        <button
                          className="inner-head-bg  hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          onClick={()=>handleOpenModal(row)}
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          className="inner-head-bg  hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
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
      {/* <div style={{ maxHeight: '200px', overflowY: 'auto' }}> */}
        <div className="mb-4 ">
          <label
            className="block text-gray-700 text-xl font-semibold mb-4 text-center"
            htmlFor="taskInput"
          >
            Add Subtask
          </label>
          <div className="flex gap-2">
          <input
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            id="taskInput"
            type="text"
            placeholder="Enter subtask..."
            value={Task}
            onChange={handleChanget}
            required
          />
          <button
            className="inner-head-bg hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleAddTaskt}
          >
            Add
          </button>

          </div>
        </div>
        {/* List of tasks */}
        <div className="flex gap-2 w-full flex-wrap  ">

          {tasks.map((taskItem, index) => (
            <div key={index} className="text-gray-700 bg-slate-200 px-2 rounded-lg flex items-center justify-center">
              {taskItem}
            </div>
          ))}
        </div>
        {/* Buttons */}
        <div className="submit-btn mt-3 flex justify-evenly">
          <button
            className="inner-head-bg hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleAddTask}
          >
            Submit
          </button>
          <button
            className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      {/* </div> */}
    </Box>
          </Modal>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <form
        onSubmit={handleSubmitUpdate}
        className="bg-white  rounded mb-4"
      >
        <div className="mb-2">
          <label
            className="block text-gray-700 text-md font-bold mb-2"
            htmlFor="missionInput"
          >
            Add Mission
          </label>
          <input
            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="missionInput"
            type="text"
            placeholder="Enter mission..."
            value={mission}
            maxLength={25}
            onChange={(e) => setMission(e.target.value)}
          />
        </div>
        <div className="mb-2">
        <label
          className="mb-2 block text-gray-700 text-md font-bold"
          htmlFor="descriptionInput"
        >
          Description
        </label>
        <textarea
          className="mt-2 shadow appearance-none border rounded w-full py-2 h-17 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="descriptionInput"
          placeholder="Enter description..."
          value={des}
         
          onChange={(e) => setDes(e.target.value)}
        />
      </div>
        <div className="mb-2">
          <label
            className="mb-2 block text-gray-700 text-md font-bold "
            htmlFor="categoryDropdown"
          >
            Category
          </label>
          {/* <Autocomplete
            disablePortal
            
            key={{ label: 'Select an option', id: 'someID' }}
            defaultValue={{ label: 'Select an option', id: 'someID' }}
            id="combo-box-demo"
            getOptionLabel={(option) => option.mission_type}
            onChange={(a, b) => {
              console.log(b, " iam a option");
              setCatIda(b.id);
            }}
            options={cat}
            sx={{ width: 335 , boxShadow:"-moz-initial" }}
            renderInput={(params) => (
              <TextField {...params} label="Categories" />
            )}
          /> */}
        <Select 
            menuPortalTarget={document.body} 
           // styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          //  theme={(theme) => ({
          //   ...theme,
          //   borderRadius: 0,
          //   colors: {
          //     ...theme.colors,
          //     primary25: '#619a4c',
          //     primary: '#368818',
          //   },
          // })}
  styles={{
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    
    // option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      
    //   return {
    //     ...styles,
    //     backgroundColor: isDisabled ? 'white' :"white",
    //     color: '#FFF',
    //     cursor: isDisabled ? 'not-allowed' : 'default',
       
    //   };
    // },
  }}
           value={ category ? category :{label:row.mission_category,value:row.mission_category} }
            // defaultValue={{label:row.mission_category,value:row.mission_category}}
              options={cat.map(item => ({
                label: item.mission_type,
                value: item.mission_type,
                id: item.id
              }))} 
            onChange={setCategory}
        
         />
          
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 text-md font-bold mb-2"
            htmlFor="imageInput"
          >
            Image URL
          </label>

          <input
            className=" hidden shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="imageInput"
            type="file"
            placeholder="Enter image URL..."
          //  value={image}
            onChange={(e) => setImage(e.target.files[0])}
          />



        </div>
        <div className="flex justify-between">
          <div className="relative cursor-pointer">

        { !image && !row?.mission_detail_photo ? ( 
          <div onClick={() => document.getElementById('imageInput').click()} className="w-40 border-2 h-40 rounded-md mt-3 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2">
              No image!
              <PlusCircle/>
            </div>
          </div>
        ) : (
          <img
          src={image ? URL.createObjectURL(image) : (row?.mission_detail_photo  || '')}
          alt="Selected photo"
          className="w-40 h-40 rounded-md mt-3 object-fit"
          // style={{
          //   position: 'absolute',
          //   bottom: '-60px', // Adjust as needed to position the image below the button
          //   left: '50%', // Position it at the center
          //   transform: 'translateX(-50%)', // Center it horizontally
          // }}
          onClick={() => document.getElementById('imageInput').click()} // Trigger file selection dialog using ref
        />
        ) }

       
        <div onClick={() => document.getElementById('imageInput').click()} className="absolute bottom-[-7px] right-[-7px] h-7 w-7 rounded-full bg-[#368818] z-40 flex items-center justify-center">
        <Pencil color="white"  size={17} />
        </div>
         

        </div>
        <div className="flex items-center justify-evenly submit-btn flex-col mr-5">
          <button
            className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
             
            type="submit"
          >  
            Submit
          </button>
          <button  onClick={handleCloseModal} class="g-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
            Cancel
            </button>
        </div>
        </div>
      </form>
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
            // image="datac.jpg"
            // imageStyle={{
            //   height: 500,
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "center",
            // }}
            description={false}
          />
        </div>
      )}
     </>
     

      {/* } */}

    </>
  );
}
