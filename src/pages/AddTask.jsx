import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const AddTask = () => {
  const [taskData, setTaskData] = useState({
    taskName: "",
    category: "",
    description: "",
    image: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("taskName", taskData.taskName);
      formData.append("category", taskData.category);
      formData.append("description", taskData.description);
      formData.append("image", taskData.image);

      const response = await axios.post("", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Task created:", response.data);
      toast.success("Mission added successfully");
    } catch (error) {
      console.error("Task creation failed:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData({
      ...taskData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setTaskData({
      ...taskData,
      image: file,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="taskName"
        >
          Task Name:
        </label>
        <input
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
          type="text"
          name="taskName"
          value={taskData.taskName}
          onChange={handleInputChange}
          placeholder="Enter Task Name"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="category"
        >
          Category:
        </label>
        <input
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
          type="text"
          name="category"
          value={taskData.category}
          onChange={handleInputChange}
          placeholder="Enter Category"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="description"
        >
          Description:
        </label>
        <textarea
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
          name="description"
          value={taskData.description}
          onChange={handleInputChange}
          placeholder="Enter Description"
          rows="4"
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="image"
        >
          Image
        </label>
        <input
          className="w-full border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-500"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Create Task
      </button>
    </form>
  );
};

export default AddTask;
