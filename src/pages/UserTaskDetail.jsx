import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import { toast } from "sonner";
import { Info, PlusCircle, Trash2 } from "lucide-react";
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
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
const UserTaskDetail = () => {
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
  
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = userData?.slice(indexOfFirstRow, indexOfLastRow);

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
         
        }, []);
  
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
                key={row.id}
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
      <div className='border-2 border-indigo-600 h-10 w-10'>
      <img src={`http://127.0.0.1:8000/media/${row.user_first_pic}`} alt="First Pic" className="w-full h-full object-cover" />
      </div>
      }
      
      
      {row.user_second_pic && 
      <div className='border-2 border-indigo-600 h-10 w-10'>
      <img src={`http://127.0.0.1:8000/media/${row.user_second_pic}`} alt="Second Pic" className="w-full h-full object-cover" />
      </div>
      }
      
      
      {row.user_third_pic && 
       <div className='border-2 border-indigo-600 h-10 w-10'>
      <img src={`http://127.0.0.1:8000/media/${row.user_third_pic}`} alt="Third Pic" className="w-full h-full object-cover" />
      </div>
      }
      
      
      {row.user_fourth_pic && 
      <div className='border-2 border-indigo-600 h-10 w-10'>
      <img src={`http://127.0.0.1:8000/media/${row.user_fourth_pic}`} alt="Fourth Pic" className="w-full h-full object-cover" />
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

      
      </>
  )
}

export default UserTaskDetail