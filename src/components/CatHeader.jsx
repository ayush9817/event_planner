import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import React from "react";
import { base_Url } from "../api";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
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

const CatHeader = ({ setActiveTab, activeTab, title ,render}) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [catValue, setCatValue] = useState("");
  const [token, setToken] = useState("");
  useEffect(() => {
    const res = localStorage.getItem("authtoken");
    setToken(res);
  }, []);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  async function saveCat(token) {
    console.log("run");
    try {
      const fData = new FormData();
      // const data = {};

      fData.append("mission_type", catValue);
      console.log(fData, "fdata");
      const res = await axios.post(`${base_Url}data/mission-type/`, fData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Category added successfully");
      render();
      handleClose();
      navigate("/dashboard");
      navigate("/config");
    } catch (error) {
      console.log(error);
    }
  }
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  console.log("cat ", catValue);
  return (
    <div className="inner-head-bg  p-4 flex h-[72px] py-5">
      <div class="text-2xl font-bold text-white">{title}</div>
      <div className="mx-3 ml-auto">
        <button
          onClick={handleOpen}
          className={`${"bg-orange-400 hover:bg-orange-500 text-white"} px-4 py-2 rounded-md ml-auto`}
        >
          Add Category
        </button>
      </div>
      <div className="flex justify-center">
        <button
          className={`${
            activeTab === "active"
              ? "bg-[#4BB543] text-white"
              : "bg-white text-dark"
          } px-4 py-1 rounded-l-md h-10`}
          onClick={() => handleTabClick("active")}
        >
          Active
        </button>

        <button
          className={`${
            activeTab === "inactive"
              ? "bg-orange-500 text-white"
              : "bg-white text-dark "
          } px-4 py-1 rounded-r-md h-10`}
          onClick={() => handleTabClick("inactive")}
        >
          Inactive
        </button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
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
            Add Category
          </Typography>
          <label
            className=" mt-4 mb-4 block text-gray-700 text-md font-bold"
            htmlFor="taskName"
          >
            Category Name:
          </label>
          <input
            onChange={(e) => setCatValue(e.target.value)}
            className="mb-4 w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            type="text"
            name="taskName"
            // value={taskData.taskName}
            // onChange={handleInputChange}
            placeholder="Enter Task Name"
          />
          <input
            // onChange={(e) => setCatValue(e.target.value)}
            className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
            type="file"
            name="taskName"
            // value={taskData.taskName}
            // onChange={handleInputChange}
            placeholder="Enter Task Name"
          />
          <div class="submit-btn mt-3 flex justify-evenly">
            <button
              onClick={() => saveCat(token)}
              className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
            >
              Save
            </button>
            <button
              onClick={handleClose}
              className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
            >
              Cancel
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default CatHeader;
