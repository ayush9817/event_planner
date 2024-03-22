import { useState } from "react";
import CatHeader from "../components/CatHeader";
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { base_Url } from "../api";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Pagination from '@mui/material/Pagination';
import { Empty } from 'antd';
import { Pencil, PlusCircle, Trash2, XCircle } from "lucide-react";
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
  const [openModal, setOpenModal] = useState(false);
  const [row,setRow] = useState(null);
  const [category,setCategory] = useState('');
  const [file, setFile] = useState(null);
  const [image,setImage] = useState(null);


  console.log(file,"file")

  const handleFileChange = (e) => {
    // Update the file state when the input changes
    setFile(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  const handleOpenModal = (row) => {console.log(row,"row"); 
  setRow(row); 
  setFile(row?.category_photo)
  setCategory(row.mission_type);
  setOpenModal(true)};
  const handleCloseModal = () => {setOpenModal(false); setCategory(""); setFile(null); setRow(null);}

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

  const handleUpdate = async ()=>{
    const value = localStorage.getItem("authtoken");
    try {
      console.log(category,"category",file,'file');
      const formData = new FormData();
      if (category) {
        formData.append('mission_type', category);
      }
  
      // Add category_photo to formData if file is not null
       formData.append('category_photo', image);


      
      

      if (formData.has('mission_type') || formData.has('category_photo')) {
      const res = await axios.patch(
        `${base_Url}/data/mission-type/${row.id}`,formData ,
        {
          headers: {
            Authorization: `Token ${value}`,
          },
        }
      );
      console.log(res,"updating category");
      }
      getActiveCatData(token);
      getInActiveCatData(token);
      toast.success("Category updated successfully");
      
      handleCloseModal();
    } catch (error) {
      toast.error("Category failed to update");
      console.log(error);
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
                  <TableCell  style={{ }} align="right">
                  <p className="font-black text-base text-end mr-24">Action</p>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentRows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="left">
                      {row.mission_type}
                    </TableCell>
                    <TableCell style={{}} align="left">
                      
                      <div className="flex justify-end  items-center gap-2  ">
                     
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
                      <button
                          className="inner-head-bg  hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          onClick={()=>handleOpenModal(row)}
                        >
                          <Pencil size={18} />
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
            Edit Category
          </Typography>
          <label
            className=" mt-4 mb-4 block text-gray-700 text-md font-bold"
            htmlFor="taskName"
          >
            Category Name:
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mb-4 w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            name="taskName"
            // value={taskData.taskName}
            // onChange={handleInputChange}
            placeholder="Enter Task Name"
          />
          <input
            onChange={handleFileChange}
            className="w-full hidden border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            type="file"
            name="taskName"
            placeholder="Enter Task Name"
            id="fileInput"
          />

          {/* <div className="w-full rounded-md h-[100px] mt-2">

          </div> */}
        
<div className="flex justify-between">
        <div  className="relative cursor-pointer ">
          {!file  ? (
                 <div onClick={() => document.getElementById('fileInput').click()} className="w-40 h-40 border-2 rounded-md mt-3 flex items-center justify-center">
                                  <div className="flex flex-col items-center justify-center gap-2">
              No image!
              <PlusCircle/>
            </div>
                  </div>
          ):(
            <img
            src={file}
            alt="Selected photo"
            className="w-40 h-40 rounded-md mt-3 object-fit"
            // style={{
            //   position: 'absolute',
            //   bottom: '-60px', // Adjust as needed to position the image below the button
            //   left: '50%', // Position it at the center
            //   transform: 'translateX(-50%)', // Center it horizontally
            // }}
            onClick={() => document.getElementById('fileInput').click()} // Trigger file selection dialog using ref
          />
            )} 

            {file &&         <div onClick={() => document.getElementById('fileInput').click()} className="absolute bottom-[-7px] right-[-7px] h-7 w-7 rounded-full bg-[#368818] z-40 flex items-center justify-center">
        <Pencil color="white"  size={17} />
        </div>}

        {file &&          <div onClick={() => setFile('')} className="absolute top-[0px] right-[-7px] h-7 w-7 rounded-full bg-[#368818] z-40 flex items-center justify-center">
        {/* <CircleX color="white"  size={17} /> */}
        <XCircle color="white" size={17}/>
        </div> }
         



        </div>

          <div class="submit-btn mt-3 flex justify-evenly flex-col mr-5">
            <button
              onClick={() => handleUpdate()}
              className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
            >
              Save
            </button>
            <button
              onClick={handleCloseModal}
              className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
            >
              Cancel
            </button>
          </div>

          </div>
        </Box>
      </Modal>
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
        
         //  image="data.jpg"
        
          // imageStyle={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
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


