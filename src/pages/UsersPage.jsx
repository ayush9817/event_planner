import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Header from "../components/Header";
import { CiEdit } from "react-icons/ci";
import axios from "axios";
import { base_Url } from "../api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import Pagination from '@mui/material/Pagination';
import {  useNavigate } from "react-router-dom";
import * as XLSX from 'xlsx';
import Switch from '@mui/material/Switch';
import { Empty } from 'antd';
export default function UsersPage() {
  const [checked, setChecked] = useState(true);
  const [search, setSearch] = useState("");
  const [userData, setUserData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = userData.slice(indexOfFirstRow, indexOfLastRow);

  const handleChange = async (userId,currentIsActive) => {
    const token = localStorage.getItem("authtoken");
    const newIsActive = !currentIsActive;


    try {
      const res = await axios.patch(`${base_Url}account/users/${userId}`,{ is_active: newIsActive } ,{
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      //console.log(res.data.data.result, "userDataname");
      setChecked(!checked);
    } catch (error) {
      console.log(error);
    }
   // setChecked(event.target.checked);
    console.log(checked,"checked");
  };

  const handlePageChange = (event, value) => {
    console.log(value);
    setCurrentPage(value);
  };


  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }
  const navigate = useNavigate();
  async function getUserData() {

    const token = localStorage.getItem("authtoken");
   // const navigate = useNavigate();
    try {
      const res = await axios.get(`${base_Url}account/users/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(res.data.data.result, " i am a response");
      setUserData(res.data.data.result);
    } catch (error) {

      console.log(error,"user");
    }
  }
  useEffect(() => {
    getUserData();
  }, [checked]);

  async function deleteUser(id) {
    const token = localStorage.getItem("authtoken");
    try {
      console.log(id,"user")
      await axios.delete(`${base_Url}account/users/${id}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      // Filter out the deleted user from userData and update the state
      const updatedUserData = userData.filter((user) => user.id !== id);
      setUserData(updatedUserData);
      toast.success("User deleted successfuly")
    } catch (error) {
      toast.error("User not Deleted")
      console.log(error);
    }
  }
  console.log(search);
  const convertJsonToExcel = () => {
    if (!userData) {
      console.error('JSON data is not available.');
      return;
    }

    //const sanitizedData = su.map(({ creation_date, updated_at, mission, ...rest }) => rest);

    // Create a workbook with a single worksheet
    const ws = XLSX.utils.json_to_sheet(userData);

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
  a.download = 'User.xlsx';
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
  return (
    <>
      <Header
        // search={search}
        setSearch={setSearch}
        buttonTitle="User"
        title="Users"
        download={convertJsonToExcel}
      />
      {currentRows.length > 0 ? (
  <>
    <TableContainer className="max-h-[calc(100vh-140px)] overflow-auto" component={Paper}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          className="head-padding"
        >
          <TableHead style={{ background: "#C8D9ED",position:'sticky',top:0,zIndex:5 }}>
            <TableRow>
              <TableCell>
              <p className="font-black text-base ">First Name</p>
              </TableCell>
              <TableCell align="left">
              <p className="font-black text-base ">Last Name</p>
              </TableCell>
              <TableCell align="left">
              <p className="font-black text-base ">Username</p>
              </TableCell>
              <TableCell align="left">
              <p className="font-black text-base ">Email</p>
              </TableCell>
              <TableCell align="left">
              <p className="font-black text-base ">DOB</p>
              </TableCell>
              <TableCell align="left">
              <p className="font-black text-base ">Zipcode</p>
              </TableCell>
              <TableCell align="left">
              <p className="font-black text-base ">Phone</p>
              </TableCell>
              <TableCell align="left">
              <p className="font-black text-base ">Status</p>
              </TableCell>
              <TableCell style={{ paddingRight: "30px" }} align="center">
              <p className="font-black text-base ">Action</p>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows
              .filter(
                (item) =>
                  item.username.toLowerCase().includes(search.toLowerCase()) ||
                  item.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                
                <TableRow
                  // style={{ padding: "10px, 16px" }}
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell 
               onClick={() => navigate(`/users/${item.id}`)}
                  component="th" scope="row"
                  style={{ cursor: 'pointer' }}
                  >
                    {item.first_name}
                  </TableCell>
                  <TableCell align="left">{item.last_name}</TableCell>
                  <TableCell align="left">{item.username}</TableCell>
                  <TableCell align="left">{item.email}</TableCell>
                  <TableCell align="left">{formatDate(item.date_of_birth)}</TableCell>
                  <TableCell align="left">{item.zip_code}</TableCell>
                  <TableCell align="left">{item.phone_number}</TableCell>

                  <TableCell align="left">
                    <div className="flex gap-2 justify-center items-center">
                  {item.is_active ? "Active" : "Inactive"}
                  <Switch
                  color="warning"
      checked={item.is_active }
      onChange={()=>handleChange(item.id,item.is_active)}
      inputProps={{ 'aria-label': 'controlled' }}
    />
    </div>
                  
                  </TableCell>
                  <TableCell align="center">
                    <button className=" inner-head-bg  hover:bg-green-600 text-white  font-semibold  p-2 rounded mr-2 "
                          onClick={() => deleteUser(item.id)}
                    >
                      <Trash2 size={18} />
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
