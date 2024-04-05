import { ClipboardCheck, Settings2, UsersRound } from "lucide-react";
import "../App.css";
import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

export default function Root() {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("authtoken")) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <div className="flex">
        <div className="flex flex-col h-screen bg-white shadow w-60">
          <div className="">
            <div className="flex items-center">
              <div className="sidebar-logo flex gap-2 justify-center items-center h-[72px] ">
                
                <img src="/logo2.png" alt="List Tracker Logo" className="h-[40px]" />
              </div>
            </div>
            <div className="flex-1">
              <ul className="   text-sm side-menu border-t-[1px]">
                <Link to="/dashboard">
                  <li
                    onClick={() => setActive("home")}
                    className={`rounded-sm hover:bg-[#368818] ${
                      active === "home" ? "bg-[#368818] text-white" : ""
                    } `}
                  >
                    <p className="flex items-center p-2 space-x-3 rounded-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6"
                        fill="none"
                        i
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                      <span>Home</span>
                    </p>
                  </li>{" "}
                </Link>
                <Link to="tasks">
                  <li
                    onClick={() => setActive("mission")}
                    className={`rounded-sm ${
                      active === "mission" ? "bg-[#368818] text-white" : ""
                    }`}
                  >
                    <p
                      href=""
                      className="flex items-center p-2 space-x-3 rounded-md"
                    >
                      <ClipboardCheck />
                      <span>Mission</span>
                    </p>
                  </li>
                </Link>

                <Link to="users">
                  <li
                    onClick={() => setActive("users")}
                    className={`rounded-sm ${
                      active === "users" ? "bg-[#368818] text-white" : ""
                    }`}
                  >
                    <p
                      href=""
                      className="flex items-center p-2 space-x-3 rounded-md"
                    >
                      <UsersRound />
                      <span>Users</span>
                    </p>
                  </li>
                </Link>

                <Link to="config">
                  <li
                    onClick={() => setActive("config")}
                    className={`rounded-sm ${
                      active === "config" ? "bg-[#368818] text-white" : ""
                    }`}
                  >
                    <p
                      href=""
                      className="flex items-center p-2 space-x-3 rounded-md"
                    >
                      <Settings2 />
                      <span>Configuration</span>
                    </p>
                  </li>
                </Link>
                <li
                  onClick={() => {
                    localStorage.removeItem("authtoken");
                    navigate("/login");
                  }}
                  className="rounded-sm "
                >
                  <p className="flex items-center p-2 space-x-3 rounded-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mx-auto w-full">
          {/* <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
          <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500 truncate">
              Total users
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              12,00
            </div>
          </div>
          <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500 truncate">
              Total Profit
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">
              $ 450k
            </div>
          </div>
          <div className="w-full px-4 py-5 bg-white rounded-lg shadow">
            <div className="text-sm font-medium text-gray-500 truncate">
              Total Orders
            </div>
            <div className="mt-1 text-3xl font-semibold text-gray-900">20k</div>
          </div>
        </div> */}

          <Outlet />
        </div>
      </div>
    </>
  );
}
