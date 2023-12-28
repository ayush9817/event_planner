import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base_Url } from "../api";
import { toast } from "sonner";
export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  async function handleLogin(e) {
    e.preventDefault();
    console.log("hit");
    try {
      const res = await axios.post(`${base_Url}/account/login/`, credentials, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(res, "response");
      localStorage.setItem("authtoken", res.data.token);
      toast.success("Login successfull");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Invalid credentials");
    }
  }
  console.log(credentials, "cred");
  return (
    <div className="relative min-h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: 'url("pexels.jpg")' }}>
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-custom-color ">
          Sign in
        </h1>

        <form className="mt-6">
          <div className="mb-2">
            <label
              htmlFor="text"
              className="block text-sm font-semibold text-custom-color"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              placeholder="Username"
              className="block w-full px-4 py-2 mt-2 text-custom-color bg-white border rounded-md focus:border-custom-color focus:ring-custom-color focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-custom-color"
            >
              Password
            </label>

            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Password"
              className="block w-full px-4 py-2 mt-2 text-custom-color bg-white border rounded-md focus:border-custom-color focus:ring-custom-color focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>
          {/* <a href="" className="text-xs text-custom-color hover:underline">
            Forget Password?
          </a> */}
          <div className="mt-6">
            <button
              onClick={(e) => handleLogin(e)}
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-custom-color rounded-md hover:bg-custom-color-dark focus:outline-none focus:bg-custom-color"
            >
              Login
            </button>
          </div>
        </form>

        {/* <p className="mt-8 text-xs font-light text-center text-gray-700">
          Don't have an account?
          <a href="" className="font-medium text-purple-600 hover:underline">
            Sign up
          </a>
        </p> */}
      </div>
    </div>
  );
}
