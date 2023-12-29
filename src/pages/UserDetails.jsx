import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import { toast } from "sonner";
import { PlusCircle, Trash2 } from "lucide-react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Link, useParams } from 'react-router-dom';
import axios from "axios";
import Pagination from '@mui/material/Pagination';
import { Empty } from 'antd';

const UserDetails = () => {
  const [userData, setUserData] = useState([]);
  const [userName, setUserName] = useState([]);
  const { userId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = userData.slice(indexOfFirstRow, indexOfLastRow);

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
          const res = await axios.get(`http://127.0.0.1:8000/data/user-missions/?user=${userId}`, {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          console.log(res.data.data.result, "userData");
          setUserData(res.data.data.result);
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
          console.log(res.data.data.result, "userDataname");
          setUserName(res.data.data.result);
        } catch (error) {
          console.log(error);
        }
      }
      //console.log(userName[0].username,"userdetails");
  return (
      <>
      <UserHeader title={userName && userName[0]?.username} />

      {currentRows.length > 0 ? (
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
                <p className="font-black text-base ">Mission Name</p>
              </TableCell>
              <TableCell align="left">
                <p className="font-black text-base ">Total Tasks</p>
              </TableCell>
              <TableCell align="left">
              <p className="font-black text-base ">Percentage</p>
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
                  
                  component="th"
                  scope="row"
                >
                <Link to={`/users/tasks/${userId}/${row.mission}`} state={{ mission_name: row.mission_name }}>
  {row.mission_name}
</Link>
                </TableCell>
                <TableCell align="left">{row.user_task_details.length}</TableCell>
                <TableCell align="left">{row.missions_percentage[row.mission_name]}%</TableCell>
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
        count={Math.ceil(userData.length / rowsPerPage)}
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

export default UserDetails