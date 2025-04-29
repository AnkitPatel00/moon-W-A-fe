import { useEffect, useState } from "react";
import { fetchUser, logoutUser } from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProject,
  setisProjectForm,
} from "../../features/project/projectSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

import { fetchTeams } from "../../features/team/teamSlice";
import { fetchTask, setisTaskForm } from "../../features/task/taskSlice";
import TaskList from "../Component/TaskList";
import ProjectList from "../Component/ProjectList";
import NewProjectForm from "../Component/newProjectForm";
import NewTaskForm from "../Component/NewTaskForm";
import Loading from "../Component/Loading";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const storedExpireTime = localStorage.getItem("expireTime");

    if (storedExpireTime) {
      const expTime = JSON.parse(storedExpireTime);

      if (expTime && expTime.exp) {
        const futureTime = expTime.exp * 1000;
        const now = Date.now();
        const timeLeft = futureTime - now;

        if (timeLeft > 0) {
          console.log("timer started");
          const logOutTimer = setTimeout(() => {
            dispatch(logoutUser());
            window.location.reload();
          }, timeLeft);

          return () => clearTimeout(logOutTimer);
        } else {
          dispatch(logoutUser());
        }
      } else {
        dispatch(logoutUser());
      }
    }
  }, [localStorage.getItem("expireTime")]);

  const [searchParams, setSearchParams] = useSearchParams();

  const searchProjectQuery = searchParams.get("projectName");

  const [search, setSearch] = useState(searchProjectQuery || "");

  const statusProjectQuery = searchParams.get("projectStatus");
  const statusTaskQuery = searchParams.get("taskStatus");

  const [projectFilter, setProjectFilter] = useState(statusProjectQuery || "");
  const [taskFilter, setTaskFilter] = useState(statusTaskQuery || "");

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("projectName", search);
    if (projectFilter) params.set("projectStatus", projectFilter);
    if (taskFilter) params.set("taskStatus", taskFilter);
    setSearchParams(params, { replace: true });
  }, [search, projectFilter, taskFilter]);

  const { projects, isProjectForm, projectCreateState, projectFetchState } =
    useSelector((state) => state.projectState);

  const { tasks, isTaskForm, taskFetchState, taskCreateState } = useSelector(
    (state) => state.taskState
  );

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      const userTimer = setTimeout(() => dispatch(fetchUser()), 200);
      const teamTimer = setTimeout(() => dispatch(fetchTeams()), 300);

      return () => {
        clearTimeout(userTimer);
        clearTimeout(teamTimer);
      };
    }
  }, []);

  const clearQueries = () => {
    setProjectFilter("");
    navigate(location.pathname, { replace: true });
  };

  useEffect(() => {
    if (taskCreateState === "success") {
      dispatch(fetchTask());
    }
    if (projectCreateState === "success") {
      clearQueries();
    }
  }, [taskCreateState, projectCreateState]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Project Fetch
  useEffect(() => {
    let projectTimeout;

    projectTimeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("projectName", search);
      if (projectFilter) params.set("projectStatus", projectFilter);

      dispatch(fetchProject(params.toString() ? `?${params.toString()}` : ""));
    }, 500);

    return () => clearTimeout(projectTimeout);
  }, [search, projectFilter]);

  // Task Fetch
  useEffect(() => {
    let taskTimeout;

    taskTimeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (taskFilter) params.set("taskStatus", taskFilter);

      dispatch(fetchTask(params.toString() ? `?${params.toString()}` : ""));
    }, 500);

    return () => clearTimeout(taskTimeout);
  }, [taskFilter]);

  return (
    <>
      <input
        value={search}
        className="form-control"
        type="text"
        placeholder="Search Project by Title"
        onChange={handleSearch}
      />
      <div className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center">
            <h5 className="mb-0 me-3 fs-4">Projects</h5>
            <label htmlFor="project-status-filter" className="me-3">
              Status Filter:
            </label>
            <select
              disabled={projectFetchState === "loading" ? true : false}
              value={projectFilter}
              className="form-select"
              id="project-status-filter"
              style={{ width: "150px" }}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <button
            onClick={() => {
              dispatch(setisProjectForm(true));
            }}
            className="btn btn-primary mt-2 mt-md-0"
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="row gap-2 ">
        {projectFetchState === "loading" && <Loading />}
        {projects.length < 1 && projectFetchState !== "loading" && (
          <p>No Project Found!</p>
        )}
        {projects.length > 0 && projectFetchState !== "loading" && (
          <ProjectList projects={projects} />
        )}
      </div>
      <div className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center">
            <h5 className="mb-0 me-3 fs-4">My Tasks</h5>
            <label htmlFor="task-status-filter" className="me-3">
              Status Filter:
            </label>
            <select
              value={taskFilter}
              className="form-select"
              style={{ width: "150px" }}
              id="task-status-filter"
              onChange={(e) => setTaskFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>
          <button
            onClick={() => {
              dispatch(setisTaskForm(true));
              clearQueries();
            }}
            className="btn btn-primary mt-2 mt-md-0"
          >
            + New Task
          </button>
        </div>
      </div>
      <div className="row gap-2 ">
        {taskFetchState === "loading" && <Loading />}
        {tasks.length < 1 && taskFetchState !== "loading" && (
          <p>No Task Found!</p>
        )}
        {tasks.length > 0 && taskFetchState !== "loading" && (
          <TaskList tasks={tasks} />
        )}
      </div>

      {/* create project */}

      {isProjectForm && <NewProjectForm />}

      {/* create Task */}

      {isTaskForm && <NewTaskForm />}
    </>
  );
};

export default Dashboard;
