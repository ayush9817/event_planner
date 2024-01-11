import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import { toast } from "sonner";
import { Info, PlusCircle, Trash2, XCircle } from "lucide-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useParams } from 'react-router-dom';
import axios from "axios";
import { useLocation } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { Empty } from 'antd';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
const UserTaskDetail = () => {

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
    const location = useLocation();
    console.log("location",location);
    const receivedData = location.state?.mission_name;
    console.log(receivedData,"state");
    const [userData, setUserData] = useState([]);
    const [userName, setUserName] = useState([]);

    const HtmlTooltip = styled(({ className, ...props }) => (
      <Tooltip {...props}  classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
      },
    }));
 
    const { userId , missionId } = useParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isDeleting, setIsDeleting] = useState(true);
    const [open, setOpen] = React.useState(false);
    const [path,setPath] = useState("");
    const [id,setId] = useState(null);
    const [updateUI,setupdateUI] = useState(false);
    const handleOpen = (id,pictype) =>{
      setPath(pictype);
      setId(id)
      setOpen(true);

    } ;
    const handleClose = () => setOpen(false);
  
  
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = userData?.slice(indexOfFirstRow, indexOfLastRow);

    const handleButtonClick = ()=>{
      const token = localStorage.getItem("authtoken");

          console.log("handle delete");
          const formData = new FormData();
          formData.append(path, "");
          try {
            const res = axios.patch(`http://127.0.0.1:8000/data/tasks/${id}`,formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${token}`,
              },
            }
            )
            console.log(res);
            setupdateUI((prev) => !prev);
            
            
            
          } catch (error) {
            console.log(error);
          }
           
    }

    const demo =  [
      {
        "id": 8,
        "name": "Afghanistan",
        "status":"Pending",
        "mission_name":"Travel the World",
        "mission": 12,
        "user": 2
      },
      {
        "id": 9,
        "name": "Algeria",
        "status":"Pending",
        "mission_name":"Travel the World",
        "mission": 12,
        "user": 2
      }
 ]

  
    const handlePageChange = (event, value) => {
      console.log(value);
      setCurrentPage(value);
    };
  
    useEffect(() => {
        
        getMissionUserData();
        getUserName();
        handleClose();
         
        }, [updateUI]);
  
        async function getMissionUserData() {
          const token = localStorage.getItem("authtoken");
          try {
            const res = await axios.get(`http://127.0.0.1:8000/data/user-completed-tasks-checklist/?user_id=${userId}&mission_id=${missionId}`, {
              headers: {
                Authorization: `Token ${token}`,
              },
            });
            
            console.log(res.data.data, "userDatastatus");
            setUserData(res.data.data);
          } catch (error) {
            console.log(error);
          }
        }
        async function getUserName() {
          const token = localStorage.getItem("authtoken");
          try {
            const res = await axios.get(`http://127.0.0.1:8000/account/users/?id=${userId}`, {
              headers: {
                Authorization: `Token ${token}`,
              },
            });
            console.log(res.data, "userDatanamestatus");
            setUserName(res.data.data.result);
          } catch (error) {
            console.log(error);
          }
        }
  return (
    <>
      <UserHeader title={userName && `${userName[0]?.username}/${receivedData}`} />

      

      {currentRows?.length > 0 ? ( 

        <>
        
        <TableContainer className="" component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          // className="mt-5"
          className="head-padding"
        >
          <TableHead  style={{ background: "#C8D9ED" }}>
            <TableRow>
              <TableCell align="left">
                <p className="font-black text-base ">Task Name</p>
              </TableCell>
              
              <TableCell align="left">
              <p className="font-black text-base ">Status</p>
              </TableCell>
              <TableCell align="left">
              <p className="font-black text-base ">Images</p>
              </TableCell>
              <TableCell align="left">
              <p className="font-black text-base ">Description</p>
              </TableCell>
              <TableCell style={{ paddingRight: "60px" }} align="right">
              <p className="font-black text-base ">Action</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows?.map((row) => (
              <TableRow
                //key={row.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell
                  
                  component="th"
                  scope="row"
                >
                  {row.name}
                </TableCell>
               
                <TableCell align="left">{row.user_status}</TableCell>

                <TableCell align="left">

  {row.user_status === 'Completed' ? (
    <>
    <div className='flex gap-2'>
      
      {row.user_first_pic && 
      <div className='relative h-12 w-12 flex items-center justify-center'>
      <div className='border-2 border-indigo-600 h-10 w-10 relative'>
        <img src={`http://127.0.0.1:8000/media/${row.user_first_pic}`} alt="First Pic" className="w-full h-full object-cover" />
      </div>
      {isDeleting && (
        <div className="absolute bottom-7 left-7">
          {/* Add your delete button (red cross) */}
          <XCircle  fill="red" color="white" onClick={()=>{handleOpen(row.id,"first_pic")}}/>
          
        </div>
      )}
    </div>
      }
      
      
      {
      row.user_second_pic && 
      <div className='relative h-12 w-12 flex items-center justify-center'>
      <div className='border-2 border-indigo-600 h-10 w-10 relative'>
        <img src={`http://127.0.0.1:8000/media/${row.user_second_pic}`} alt="Second Pic" className="w-full h-full object-cover" />
      </div>
      {isDeleting && (
        <div className="absolute bottom-7 left-7">
          {/* Add your delete button (red cross) */}
          <XCircle  fill="red" color="white" onClick={()=>{handleOpen(row.id,"second_pic")}}/>
          
        </div>
      )}
    </div>
      
      }
      
      
      {row.user_third_pic && 
      <div className='relative h-12 w-12 flex items-center justify-center'>
      <div className='border-2 border-indigo-600 h-10 w-10 relative'>
        <img src={`http://127.0.0.1:8000/media/${row.user_third_pic}`} alt="Third Pic" className="w-full h-full object-cover" />
      </div>
      {isDeleting && (
        <div className="absolute bottom-7 left-7">
          {/* Add your delete button (red cross) */}
          <XCircle  fill="red" color="white" onClick={()=>{handleOpen(row.id,"third_pic")}}/>
          
        </div>
      )}
    </div>
      }
      
      
      {row.user_fourth_pic && 
      <div className='relative h-12 w-12 flex items-center justify-center'>
      <div className='border-2 border-indigo-600 h-10 w-10 relative'>
        <img src={`http://127.0.0.1:8000/media/${row.user_fourth_pic}`} alt="Fourth Pic" className="w-full h-full object-cover" />
      </div>
      {isDeleting && (
        <div className="absolute bottom-7 left-7">
          {/* Add your delete button (red cross) */}
          <XCircle  fill="red" color="white" onClick={()=>{handleOpen(row.id,"fourth_pic")}}/>
          
        </div>
      )}
    </div>
      }
      
    </div>
    </>
  ) : (
    <div>-</div>
  )}

                </TableCell>

                <TableCell align="left" >
                 

                  {row.user_status === 'Completed' ? (
    <>
     <div className="ml-5">
                  <HtmlTooltip 
                    title={
                      <React.Fragment>
                        {/* <Typography color="inherit">
                        {row.name}
                        </Typography> */}
                        {row.user_description}
                      </React.Fragment>
                    }
                  >
                    
                    <Button><Info/></Button>
                  </HtmlTooltip>
                  </div>
    </>
  ) : (
    <div className="ml-12">-</div>
  )}
                </TableCell>

                <TableCell align="right">
                  <button 
                    className="inner-head-bg  hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-11"
                    onClick={() => handleDelete(row.id)}
                  >
                    <Trash2 size={18}  />
                  </button>
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex justify-center items-center mt-5  ">
      <Pagination
        count={Math.ceil(userData?.length / rowsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        rowsPerPage={rowsPerPage}
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
      )}

          <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <Typography
                  style={{ fontSize: "30px", marginLeft: "auto" }}
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                >
                  Are you sure you want to delete?
                </Typography>
                
                <div class="submit-btn mt-3 flex  justify-between">
                  <button
                    onClick={()=>{handleButtonClick()}}
                    className="inner-head-bg hover:bg-blue-700 text-white font-bold rounded"
                  >
                    Yes
                  </button>
                  <button
                    onClick={handleClose}
                    className="inner-head-bg hover:bg-blue-700 text-white font-bold rounded"
                  >
                    No
                  </button>
                </div>
              </Box>
            </Modal>

      
      </>
  )
}

export default UserTaskDetail