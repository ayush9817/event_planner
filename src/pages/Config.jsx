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
  const [image,setImage] = useState('');
  const [loading,setLoading] = useState(false);
  const [isdelete,setisDelete] = useState(false);


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
  const handleCloseModal = () => {setOpenModal(false); setCategory(""); setFile(null); setImage(''); setRow(null);}

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
      setLoading(true)
      const res = await axios.get(
        `${base_Url}/data/mission-type/?is_active=True`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("res", res.data.data.result);
      setLoading(false);
      setActiveCatData(res.data.data.result);
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  }


  async function getInActiveCatData(token) {
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("error");
    }
  }

  const handleUpdate = async ()=>{
    const value = localStorage.getItem("authtoken");
    try {
      setLoading(true);
      console.log(category,"category",file,'file');
      const formData = new FormData();
      if (category) {
        formData.append('mission_type', category);
      }
  
      // Add category_photo to formData if file is not null
      if(image){
       formData.append('category_photo', image);
      }else{
        if(!file && !image){
        formData.append('category_photo', '');
      }
      }


      
      

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
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Category failed to update");
      console.log(error);
    }
  }

  async function handleSwitch(id, token, action) {
    try {
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
                     
                      <div className="w-[250px] flex-wrap break-words">  {row.mission_type}</div>
                    </TableCell>
                    <TableCell style={{}} align="left">
                      
                      <div className="flex justify-end  items-center gap-2  ">
                     
                      <Button
                        disabled={loading}
                        className="inner-head-bg hover:bg-green-700"
                        onClick={() => handleViewButton(row.id)}
                        title="View Missions"
                      />
                      <button
                      disabled={loading}
                        onClick={() => handleSwitch(row.id, token, false)}
                        className="inner-head-bg  hover:bg-green-700 text-white font-bold py-2 px-4 rounded "
                      >
                        {activeTab === "active" ? "Inactive" : ""}
                      </button>
                      <button
                       disabled={loading}
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
            maxLength={25}
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

        {file &&          <div onClick={() => {setFile(''); setImage('');}} className="absolute top-[0px] right-[-7px] h-7 w-7 rounded-full bg-[#368818] z-40 flex items-center justify-center">
        {/* <CircleX color="white"  size={17} /> */}
        <XCircle color="white" size={17}/>
        </div> }
         



        </div>

          <div class="submit-btn mt-3 flex justify-evenly flex-col mr-5">
            <button
              disabled={loading}
              onClick={() => handleUpdate()}
              className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
            >
              <div className="flex items-center justify-center gap-2">
                { loading &&
              <svg aria-hidden="true" class="w-[14px] h-[14px] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
}
              Save
              </div>
            </button>
            <button
            disabled={loading}
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


