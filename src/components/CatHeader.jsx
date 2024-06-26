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
  const [loading,setLoading] = useState(false);
  useEffect(() => {

    const res = localStorage.getItem("authtoken");
    setToken(res);
  }, []);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    // Update the file state when the input changes
    setFile(e.target.files[0]);
  };

  async function saveCat(token) {

    console.log("run");
    try {
      setLoading(true);
      const fData = new FormData();
      // const data = {};

      fData.append("mission_type", catValue);
      if (file) {
        fData.append("category_photo", file);
      }
      console.log(fData, "fdata");
      const res = await axios.post(`${base_Url}data/mission-type/`, fData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      toast.success("Category added successfully");
      render();
      handleClose();
      setLoading(false);
      navigate("/dashboard");
      navigate("/config");
    } catch (error) {
      setLoading(false);
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
          disabled={loading}
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
            maxLength={25}
            // onChange={handleInputChange}
            placeholder="Enter Task Name"
          />
          <input
             onChange={handleFileChange}
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
