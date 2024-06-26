import { Autocomplete, Paper, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { base_Url } from "../api";
import { Search } from "lucide-react";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChevronUpIcon } from '@heroicons/react/20/solid'

import classNames from 'classnames';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Download} from "lucide-react";
import * as XLSX from 'xlsx';

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Modal from "@mui/material/Modal";


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

export default function Header({
  title,
  buttonTitle,
  setSearch,
  onClick,
  cat,

  setCatId,
  mData,
  download,
  render,
  renders,
  setMData,
}) {
  // http://127.0.0.1:8000/data/missions/?mission_type=10
  const token = localStorage.getItem("authtoken");
  async function filterBasedOnCatagory(id) {
    try {
      const res = await axios.get(
        `${base_Url}/data/admin-missions/?mission_type=${id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(res.data.data.result, "filtered data");
      setMData(res.data.data.result);
    } catch (error) {}
  }
  const handleMenuItemClick = (event, selectedItem) => {
    event.preventDefault();
    setIsMenuOpen(false);
    setMissionType(`${selectedItem.mission_type}`);
    console.log(selectedItem,"hi hello");

  
    // Handle menu item click logic here
    console.log(selectedItem.id, " I am an option");
    filterBasedOnCatagory(selectedItem.id);
  };
  const handleMenuItemClickAll = async (event) => {
    event.preventDefault();
    setIsMenuOpen(false);
    setMissionType('All');
    try {
      const res = await axios.get(
        `${base_Url}/data/admin-missions/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(res.data.data.result, "filtered data");
      setMData(res.data.data.result);
    } catch (error) { 
      console.log(error);
    }
  };
  const handleMenuItemClickFeature = async (event) => {
    event.preventDefault();
    
    setIsMenuOpen(false);
    setMissionType('Featured');
    try {
      const res = await axios.get(
        `${base_Url}/data/admin-missions/?is_featured=true`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log(res.data.data.result, "filtered data");
      setMData(res.data.data.result);
    } catch (error) { 
      console.log(error);
    }
  };
  const [open, setOpen] = React.useState(false);
  const [mission, setMission] = useState("");
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [catId, setCatIda] = useState(null);
  const [description, setDescription] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [missionType,setMissionType] = useState('Categories');
  const [loading,setLoading] = useState(false);  //const [file,setFile] = useState(null);
  console.log(image);

  const handleMenuItemClickk = (event, item) => {
    // Add your logic here for handling menu item click
    setIsMenuOpen(false); // Close the menu when an item is selected
  };
  
  const handleOpen = () => setOpen(true);
  const handleClose = () =>{ 
    setOpen(false)
    setMission("");
    setDescription("");
    setImage(null);
    setCatId(null);
  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   
    
    try {
      const formData = new FormData();
      formData.append('name', mission);
      formData.append('description', description);
      formData.append('mission_type', catId);
  
      // Check if an image is selected
      if (image) {
        formData.append('mission_detail_photo', image);
      }
  
      await axios.post(`${base_Url}data/missions/`, formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      handleClose();

      setMission("");
      setDescription("");
      setImage(null);
      setCatId(null);


  
      toast.success('Mission added successfully');
      console.log(renders, 'render');
      renders();
  
      // navigate("/tasks");
  
      console.log('Mission:', mission);
      console.log('Image:', image);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err,"sumbmit");
      toast.error('Failed in adding mission');
    }
  };
  console.log(cat);


  
  return (
    <header className="inner-head-bg bg-stone-200 text-white p-4 h-[72px] z-50 relative ">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold my-auto">{title}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {title === "Dashboard" ||
          title === "Mission" ||
          // title === "User Page" ||
          title === "Category Missions" ||
          title === "Tasks" ? (
            <></>
          ) : (
            <div className="relative top-input">
              <div className="flex justify-center items-center gap-2 ">
              <button
              onClick={download}
              className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-2 rounded"
            >
              <Download />
            </button>
              <div className="bg-white rounded-md  px-1 focus:outline-none focus:ring focus:border-blue-500 flex justify-center items-center">
              <input
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search..."
                className="outline-none"
               // className="bg-gray-700 rounded-md py-1 px-3 focus:outline-none focus:ring focus:border-blue-500"
              />
              <button className=" text-gray-400 hover:text-gray-200">
                <Search />
              </button>
              </div>
              </div>

            </div>
          )}

          {/* <select className="bg-gray-700 text-white rounded-md py-1 px-3 focus:outline-none focus:ring">
            <option value="filter1">Filter 1</option>
            <option value="filter2">Filter 2</option>
          </select> */}
          {title === "Mission" ? (
            <div style={{ backgroundColor: "#368818" }}>
              <Menu as="div" className="relative inline-block text-left">
      <div >
        <Menu.Button 
        className="flex w-full justify-center align-center gap-x-1.5 rounded-md bg-white px-3.5 py-2 text-m font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 "
        onClick={() => setIsMenuOpen(!isMenuOpen)} 
        >
         {`${missionType}`}
          {isMenuOpen ? (
            <ChevronUpIcon className="-mr-1 pt-0.5 h-6 w-7 text-gray-800" aria-hidden="true" />
          ) : (
            <ChevronDownIcon className="-mr-1 pt-0.5 h-6 w-7 text-gray-800" aria-hidden="true" />
          )}
        </Menu.Button>
      </div>

      <Transition
        show={isMenuOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0  mt-2 w-[128px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1  ">
          <Menu.Item  
                onClick={(event) => handleMenuItemClickAll(event)} >
                {({ active }) => (<a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    All
                  </a>
                )}
              </Menu.Item>
          <Menu.Item  
                onClick={(event) => handleMenuItemClickFeature(event)} >
                {({ active }) => (<a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    Featured
                  </a>
                )}
              </Menu.Item>
            
            {cat.map((item)=>{
                return <Menu.Item  
                onClick={(event) => handleMenuItemClick(event, item)} >
                {({ active }) => (<a
                    href="#"
                    className={classNames(
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    {item.mission_type}
                  </a>
                )}
              </Menu.Item>
            })}
             
          </div>
        </Menu.Items>
      </Transition>
    </Menu>

              
            </div>
          ) : (
            <></>
          )}
          {title === "Dashboard" ||
          title === "User Page" ||
          // title === "Category Missions" ||
          title === "Tasks" || title==="Users" ? (
            <></>
          ) : (
            <>
              <button
                onClick={handleOpen}
                className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-4 rounded"
              >
                Add {buttonTitle}
              </button>
              <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <form
        onSubmit={handleSubmit}
        className="bg-white  rounded mb-4"
      >
        <div className="mb-4">
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
            maxLength={100}
            onChange={(e) => setMission(e.target.value)}
          />
        </div>
        <div className="mb-4">
        <label
          className="mb-2 block text-gray-700 text-md font-bold"
          htmlFor="descriptionInput"
        >
          Description
        </label>
        <textarea
          className="mt-2 shadow appearance-none border rounded w-full py-2 h-10 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="descriptionInput"
          placeholder="Enter description..."
          value={description}
          
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
        <div className="mb-4">
          <label
            className="mb-2 block text-gray-700 text-md font-bold "
            htmlFor="categoryDropdown"
          >
            Category
          </label>
          <Autocomplete
            disablePortal
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
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-md font-bold mb-2"
            htmlFor="imageInput"
          >
            Image URL
          </label>
          <input
            className="mt-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="imageInput"
            type="file"
            placeholder="Enter image URL..."
          //  value={image}
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <div className="flex items-center justify-evenly submit-btn">
          <button
            className="inner-head-bg hover:bg-green-700 text-white font-bold rounded"
            disabled={loading}
            type="submit"
          >
           
            <div className="flex justify-center items-center gap-2">
              { loading &&
            <svg aria-hidden="true" class="w-[14px] h-[14px] text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
}
            Submit
            </div>
          </button>
          <button disabled={loading}  onClick={handleClose} class="g-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded">
            Cancel
            </button>
        </div>
      </form>
        </Box>
              </Modal>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
