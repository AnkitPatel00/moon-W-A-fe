import { useEffect, useState } from "react";
import { fetchUser } from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProject,
  setisProjectForm,
} from "../../features/project/projectSlice";
import { useNavigate, useSearchParams } from "react-router-dom";

import { fetchTeams } from "../../features/team/teamSlice";
import {
  clearTask,
  fetchTask,
  setisTaskForm,
} from "../../features/task/taskSlice";
import TaskList from "../Component/TaskList";
import ProjectList from "../Component/ProjectList";
import NewProjectForm from "../Component/newProjectForm";
import NewTaskForm from "../Component/NewTaskForm";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const searchProjectQuery = searchParams.get("projectName");

  const [search, setSearch] = useState(searchProjectQuery || "");

  const statusProjectQuery = searchParams.get("projectStatus");
  const statusTaskQuery = searchParams.get("taskStatus");

  const [projectFilter, setProjectFilter] = useState(statusProjectQuery || "");
  const [taskFilter, setTaskFilter] = useState(statusTaskQuery || "");

  useEffect(() => {
    setSearchParams(
      (prevParams) => {
        const params = new URLSearchParams(prevParams);
        if (search) {
          params.set("projectName", search);
        } else {
          params.delete("projectName");
        }
        if (projectFilter) {
          params.set("projectStatus", projectFilter);
        } else {
          params.delete("projectStatus");
        }
        if (taskFilter) {
          params.set("taskStatus", taskFilter);
        } else {
          params.delete("taskStatus");
        }
        return params;
      },
      { replace: true }
    );
  }, [search, projectFilter, taskFilter]);

  const {
    projects,
    isProjectForm,
    projectCreateState,
    projectCreateMessage,
    projectCreateError,
  } = useSelector((state) => state.projectState);

  console.log(projects);

  const {
    tasks,
    isTaskForm,
    taskCreateState,
    taskCreateMessage,
    taskCreateError,
  } = useSelector((state) => state.taskState);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      dispatch(fetchUser());
      dispatch(fetchTeams());
    }
    if (projectCreateState === "success") {
      setPorjectFormData(initialProjectData);
    }
    if (taskCreateState === "success") {
      dispatch(fetchTask());
    }
  }, [projectCreateState, taskCreateState]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  let t;
  useEffect(() => {
    if (search || projectFilter) {
      t = setTimeout(() => {
        dispatch(fetchProject(`?${searchParams.toString()}`));
      }, 1000);
    } else {
      dispatch(fetchProject());
    }

    if (taskFilter) {
      t = setTimeout(() => {
        dispatch(fetchTask(`?${searchParams.toString()}`));
      }, 1000);
    } else {
      // dispatch(clearTask());
      dispatch(fetchTask());
    }

    return () => clearTimeout(t);
  }, [searchParams]);

  // const clearQueries = () => {
  //   navigate(location.pathname, { replace: true });
  // };

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
            onClick={() => dispatch(setisProjectForm(true))}
            className="btn btn-primary mt-2 mt-md-0"
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="row gap-2 ">
        {projects.length > 0 && <ProjectList projects={projects} />}
      </div>
      <div className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center">
            <h5 className="mb-0 me-3 fs-4">My Tasks</h5>
            <label htmlFor="task-status-filter" className="me-3">
              Status Filter:
            </label>
            <select
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
              // clearQueries();
            }}
            className="btn btn-primary mt-2 mt-md-0"
          >
            + New Task
          </button>
        </div>
      </div>
      <div className="row gap-2 ">
        {tasks.length > 0 && <TaskList tasks={tasks} />}
      </div>

      {/* create project */}

      {isProjectForm && <NewProjectForm />}

      {/* create Task */}

      {isTaskForm && <NewTaskForm />}
    </>
  );
};

export default Dashboard;
