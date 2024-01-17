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
        `${base_Url}/data/missions/?mission_type=${id}`,
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

  
    // Handle menu item click logic here
    console.log(selectedItem.id, " I am an option");
    filterBasedOnCatagory(selectedItem.id);
  };
  const handleMenuItemClickAll = async (event) => {
    event.preventDefault();
    setIsMenuOpen(false);
    try {
      const res = await axios.get(
        `${base_Url}/data/missions/`,
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
    try {
      const res = await axios.get(
        `${base_Url}/data/missions/?is_featured=true`,
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
  //const [file,setFile] = useState(null);
  console.log(image);

  const handleMenuItemClickk = (event, item) => {
    // Add your logic here for handling menu item click
    setIsMenuOpen(false); // Close the menu when an item is selected
  };
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleClose();
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
  
      toast.success('Mission added successfully');
      console.log(renders, 'render');
      renders();
  
      // navigate("/tasks");
  
      console.log('Mission:', mission);
      console.log('Image:', image);
    } catch (err) {
      console.log(err);
      toast.error('Failed Adding Mission');
    }
  };
  console.log(cat);


  
  return (
    <header className="inner-head-bg bg-stone-200 text-white p-4 h-[72px] ">
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
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-2 rounded"
            >
              <Download />
            </button>
              <input
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search..."
                className="bg-gray-700 rounded-md py-1 px-3 focus:outline-none focus:ring focus:border-blue-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200">
                <Search />
              </button>
              </div>

            </div>
          )}

          {/* <select className="bg-gray-700 text-white rounded-md py-1 px-3 focus:outline-none focus:ring">
            <option value="filter1">Filter 1</option>
            <option value="filter2">Filter 2</option>
          </select> */}
          {title === "Mission" ? (
            <div style={{ backgroundColor: "#164863" }}>
              <Menu as="div" className="relative inline-block text-left">
      <div >
        <Menu.Button 
        className="flex w-full justify-center align-center gap-x-1.5 rounded-md bg-white px-3.5 py-2 text-m font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 "
        onClick={() => setIsMenuOpen(!isMenuOpen)} 
        >
          Categories
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-[128px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
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
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
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
            className="inner-head-bg hover:bg-blue-700 text-white font-bold rounded"
            type="submit"
          >
            Submit
          </button>
          <button  onClick={handleClose} class="g-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
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
