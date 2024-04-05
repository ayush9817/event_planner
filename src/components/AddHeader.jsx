import React, { useRef, useState } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { toast } from "sonner";
import { Download, Upload} from "lucide-react";
import { base_Url } from "../api";


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

const AddHeader = ({ title, buttonTitle, id, onClick, Rerender , download }) => {
  console.log(Rerender , 'i am rerender')
  console.log("asdf", id);

  const [file, setFile] = useState(null);
  const [loading,setLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleButtonClick = async () => {
    const token = localStorage.getItem("authtoken");
    setLoading(true);
   
    try {
      if (!file) {
        console.log("Please select a file.");
        return;
      }
  
      console.log("we have a file.");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", id);
  
      
  
      if (title === "Tasks") {
        const response = await axios.post(
          `${base_Url}data/mission-task-upload/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Token ${token}`,
            },
          }
        );
      } else {
        const response = await axios.post(
          `${base_Url}data/missions-upload/`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Token ${token}`,
            },
          }
        );
      }
      setLoading(false);
      setOpen(false);
  
      // Call the function received as a prop
      Rerender();
  
      setFile(null);
      toast.success("File uploaded successfully");
    } catch (error) {
      setLoading(false);
      setOpen(false);
      toast.error("Something went wrong");
      console.error("Error uploading file:", error);
      // Additional error handling
    }
  };
  

  return (
    <header className="inner-head-bg bg-stone-200 text-white p-4 h-[74px] ">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative top-input flex gap-2">
          <button
              onClick={download}
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-2 rounded"
            >
              <Download />
            </button>
            <button
              onClick={handleOpen}
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-2 rounded"
            >
              <Upload />
            </button>

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
                  Add XLS
                </Typography>
                <div className="pb-3 pt-5">
                  <input
                    // onChange={(e) => setCatValue(e.target.value)}
                    accept=".xls, .xlsx" 
                    onChange={handleFileChange}
                    className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
                    type="file"
                    name="taskName"
                    // value={taskData.taskName}
                    // onChange={handleInputChange}
                    placeholder="Enter Task Name"
                  />
                </div>
                <div class="submit-btn mt-3 flex gap-2">
                  <button
                    onClick={()=>{handleButtonClick()}}
                    className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
                  >
                  <div className="flex gap-3 justify-center items-center">
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
                    onClick={handleButtonClick}
                    className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
                  >
                    Cancel
                  </button>
                  
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AddHeader;

{
  /* <input
              type="file"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            /> */
}
{
  /* Button to trigger file selection */
}
// <button
//   onClick={handleButtonClick}
//   className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
// >
//   Add {buttonTitle}
// </button>
