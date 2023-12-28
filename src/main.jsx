import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Login from "./pages/Login";
import Root from "./routes/root";
import ErrorPage from "./pages/Error-page";
import AddTask from "./pages/AddTask";
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/UsersPage";
import Task from "./pages/Task";
import Config from "./pages/Config";
import AddSubTask from "./pages/AddSubTask";
import SubTaskList from "./pages/SubTaskList";
import AddMission from "./pages/AddMission";
import { Toaster } from "sonner";
import ConfigMissions from "./pages/ConfigMissions";
import UserDetails from "./pages/UserDetails";
import UserTaskDetail from "./pages/UserTaskDetail";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
      {
        path: "add-tasks/:userId",
        element: <AddTask />,
      },
      {
        path: "tasks-view/:missionId",
        element: <SubTaskList />,
      },
      {
        path: "catmissionList/:catId",
        element: <ConfigMissions />,
      },
      {
        path: "tasks",
        element: <Task />,
      },
      {
        path: "config",
        element: <Config />,
      },
      {
        path: "addSubtask/:userId",
        element: <AddSubTask />,
      },
      {
        path: "addMission",
        element: <AddMission />,
      },
      {
        path:"users/:userId",
        element: <UserDetails/>
      },
      {
        path: "users/tasks/:userId/:missionId",
        element: <UserTaskDetail />
      }
      
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Toaster richColors />
    <RouterProvider router={router} />
  </React.StrictMode>
);
