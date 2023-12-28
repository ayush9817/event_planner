import React, { useEffect, useRef, useState } from "react";
import { base_Url } from "../api";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddMission = () => {
  const [mission, setMission] = useState("");
  const navigate = useNavigate();
  const [image, setImage] = useState("");
  const [catId, setCatId] = useState(null);
  const token = localStorage.getItem("authtoken");
  const [cat, setCat] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.post(
      `${base_Url}data/missions/`,
      {
        name: mission,
        mission_type: catId,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    toast.success("Mission added succesfully");
    navigate("/tasks");
    console.log("Mission:", mission);
    // console.log("Category:", category);
    console.log("Image URL:", image);
  };

  useEffect(() => {
    getCat();
  }, []);
  async function getCat() {
    try {
      const res = await axios.get(`${base_Url}/data/mission-type-dropdown/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      console.log(res.data.data.mission_type_list);
      setCat(res.data.data.mission_type_list);
    } catch (error) {
      console.log(error);
    }
  }
  console.log(catId);
  console.log(mission);
  return (
    <div className="flex items-center justify-center h-screen" style={{background: '#f5f5f5'}}>
      <form
        onSubmit={handleSubmit}
        className="bg-white mission-box rounded mb-4"
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
            className="mb-2 block text-gray-700 text-md font-bold mb-2"
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
              setCatId(b.id);
            }}
            options={cat}
            sx={{ width: 380 }}
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
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between submit-btn">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMission;
