import { useEffect, useState } from "react";
import { fetchAllUser, fetchUser } from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  fetchProject,
  resetprojectCreateMessage,
} from "../../features/project/projectSlice";
import { useSearchParams } from "react-router-dom";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { fetchTeams } from "../../features/team/teamSlice";
import {
  createTask,
  fetchTask,
  resetTaskCreateMessage,
} from "../../features/task/taskSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

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
    projectCreateState,
    projectCreateMessage,
    projectCreateError,
  } = useSelector((state) => state.projectState);

  const { allUsers } = useSelector((state) => state.userState);
  const { teams } = useSelector((state) => state.teamState);
  const { tasks, taskCreateState, taskCreateMessage, taskCreateError } =
    useSelector((state) => state.taskState);

  const [isnewProject, setisNewProject] = useState(false);

  const [isnewTask, setisNewTask] = useState(false);

  const initialProjectData = { name: "", status: "Active", description: "" };
  const [projectFormData, setPorjectFormData] = useState(initialProjectData);

  const initialTaskData = {
    project: [],
    name: "",
    team: [],
    status: "To Do",
    tags: [],
    dueDate: "",
    timeToComplete: "",
  };
  const [taskFormData, setTaskFormData] = useState(initialTaskData);
  const [selectedOwner, setSelectedOwner] = useState([]);

  useEffect(() => {
    setSelectedOwner([]);
  }, [taskFormData.team]);

  useEffect(() => {
    if (projects.length > 0) {
      setTaskFormData((prev) => ({
        ...prev,
        project: projects[projects.length - 1]._id,
      }));
    }

    if (teams.length > 0) {
      setTaskFormData((prev) => ({
        ...prev,
        team: teams[teams.length - 1]._id,
      }));
    }
  }, [projects, teams]);

  const handleTaskForm = (e) => {
    const { name, value } = e.target;
    setTaskFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleTag = (newValue) => {
    setTaskFormData((prev) => {
      return { ...prev, tags: newValue };
    });
  };

  const handleTaskFormReset = () => {
    setTaskFormData({
      ...initialTaskData,
      project: projects[projects.length - 1]._id,
      team: teams[teams.length - 1]._id,
    });
    setSelectedOwner([]);
  };

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

      handleTaskFormReset();
      // setTaskFormData({
      //   ...initialTaskData,
      //   project: projects[projects.length - 1]._id,
      //   team: teams[teams.length - 1]._id,
      // });
      // setSelectedOwner([]);
    }
  }, [projectCreateState, taskCreateState]);

  const handleProjectForm = (e) => {
    const { id, value } = e.target;
    setPorjectFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProjectFormSubmit = (e) => {
    e.preventDefault();
    if (projectFormData.name) {
      dispatch(createProject(projectFormData));
    }
  };

  const ProjectList = () => {
    return (
      <>
        {projects?.toReversed().map((project) => {
          const statusBG =
            project.status === "Active"
              ? "badge bg-success"
              : project.status === "Completed"
              ? "badge bg-primary"
              : "badge bg-warning text-dark";

          return (
            <div key={project._id} className="col-md-3 border bg-light p-4">
              <p>
                <span className={`${statusBG} px-2 py-1 rounded`}>
                  {project.status}
                </span>
              </p>
              <h5 className="fs-4">{project.name}</h5>
              <p>{project.description.slice(0, 55) + "..."}</p>
            </div>
          );
        })}
      </>
    );
  };

  const TaskList = () => {
    return (
      <>
        {tasks?.toReversed().map((task) => {
          const statusBG =
            task.status === "To Do"
              ? "bg-secondary text-light"
              : task.status === "In Progress"
              ? "bg-info text-light"
              : task.status === "Completed"
              ? "bg-success text-light"
              : task.status === "Blocked"
              ? "bg-danger text-light"
              : "";

          return (
            <div key={task._id} className="col-md-3 border p-4">
              <p>
                <span className={`${statusBG} px-2 py-1 rounded`}>
                  {task.status}
                </span>
              </p>
              <h5 className="fs-4">{task.name}</h5>
              <div class="d-flex align-items-center">
                {task.owners.map((owner, i) => {
                  const bgColor =
                    i == 0
                      ? "text-bg-primary"
                      : i == 1
                      ? "text-bg-secondary"
                      : i == 2
                      ? "text-bg-success"
                      : i == 3
                      ? "text-bg-danger"
                      : i == 4
                      ? "text-bg-warning"
                      : i == 5
                      ? "text-bg-info"
                      : "text-bg-dark";

                  return (
                    <div
                      className={`rounded-circle ${bgColor} d-flex justify-content-center align-items-center`}
                      style={{
                        width: "40px",
                        height: "40px",
                        fontWeight: "bold",
                        fontSize: "16px",
                        zIndex: `${i}`,
                        position: "relative",
                        left: `${-i}0px`,
                      }}
                    >
                      {owner.name ? owner.name.charAt(0) : ""}
                    </div>
                  );
                })}
              </div>
              <p>Due on: {task.dueDate}</p>
              <p></p>
            </div>
          );
        })}
      </>
    );
  };

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
      dispatch(fetchTask());
    }

    return () => clearTimeout(t);
  }, [searchParams]);

  const handleTaskFormSubmit = (e) => {
    e.preventDefault();

    const taskData = {
      ...taskFormData,
      tags: taskFormData.tags.map(({ value }) => value),
      owners: selectedOwner.map(({ value }) => value),
    };

    if (
      taskData.name &&
      taskData.project &&
      taskData.team &&
      taskData.owners.length > 0 &&
      taskData.status &&
      taskData.tags &&
      taskData.dueDate &&
      taskData.timeToComplete
    ) {
      dispatch(createTask(taskData));
    }
  };

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
            onClick={() => setisNewProject(true)}
            className="btn btn-primary mt-2 mt-md-0"
          >
            New Project
          </button>
        </div>
      </div>
      <div className="row gap-3 mx-3">
        <ProjectList />
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
              setisNewTask(true);
            }}
            className="btn btn-primary mt-2 mt-md-0"
          >
            New Task
          </button>
        </div>
      </div>
      <div className="row gap-3 mx-3">
        <TaskList />
      </div>

      {/* create project */}
      {isnewProject && (
        <>
          <div className="overlay">
            <div className="project-form rounded">
              <form onSubmit={handleProjectFormSubmit} className="">
                <h5>Create New Project</h5>
                <label htmlFor="name" className="form-label">
                  Project Name
                </label>
                <input
                  value={projectFormData.name}
                  onChange={handleProjectForm}
                  className="form-control mb-3"
                  type="text"
                  placeholder="Enter Project Name"
                  id="name"
                  required
                />

                <label htmlFor="status" className="form-label mt-2">
                  Status
                </label>
                <select
                  value={projectFormData.status}
                  className="form-select"
                  id="status"
                  name="status"
                  onChange={handleProjectForm}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>

                <label htmlFor="description" className="form-label mt-2">
                  Project Description
                </label>
                <textarea
                  value={projectFormData.description}
                  onChange={handleProjectForm}
                  className="form-control"
                  placeholder="Enter Project Description"
                  rows="3"
                  cols={30}
                  id="description"
                ></textarea>

                {projectCreateError && (
                  <p className="text-danger my-2">{projectCreateError}</p>
                )}
                {projectCreateMessage && (
                  <p className="text-info my-2">{projectCreateMessage}</p>
                )}

                <div className="mt-4 d-flex justify-content-end gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setisNewProject(false);
                      dispatch(resetprojectCreateMessage());
                      setPorjectFormData(initialProjectData);
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={projectCreateMessage === "loading"}
                    className="btn btn-primary"
                  >
                    {projectCreateMessage === "loading"
                      ? "Creating..."
                      : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
      {/* create Task */}

      {isnewTask && (
        <>
          <div className="overlay">
            <div className="project-form rounded">
              <form onSubmit={handleTaskFormSubmit} className="">
                <h5>Create New Task</h5>
                <label htmlFor="project-select" className="form-label">
                  Select Project
                </label>
                <select
                  value={taskFormData.project._id}
                  className="form-select mb-2"
                  id="project-select"
                  onChange={handleTaskForm}
                  name="project"
                  required
                >
                  {projects?.toReversed().map(({ _id, name }) => {
                    return (
                      <option key={_id} value={_id}>
                        {name}
                      </option>
                    );
                  })}
                </select>

                <label htmlFor="task-name" className="form-label">
                  Task Name
                </label>
                <input
                  value={taskFormData.name}
                  placeholder="Enter Task Name"
                  className="form-control mb-2"
                  id="task-name"
                  name="name"
                  onChange={handleTaskForm}
                  required
                />

                <label htmlFor="team-select" className="form-label">
                  Select Team
                </label>
                <select
                  value={taskFormData.team._id}
                  className="form-select mb-2"
                  id="team-select"
                  name="team"
                  onChange={handleTaskForm}
                  required
                >
                  {teams?.toReversed().map(({ _id, name }) => {
                    return (
                      <option key={_id} value={_id}>
                        {name}
                      </option>
                    );
                  })}
                </select>

                <label htmlFor="owner-select" className="form-label">
                  Owners
                </label>
                <Select
                  isMulti
                  options={teams
                    ?.find(({ _id }) => _id == taskFormData.team)
                    .members.map(({ _id, name }) => ({
                      label: name,
                      value: _id,
                    }))}
                  value={selectedOwner}
                  onChange={setSelectedOwner}
                  required
                />

                <label htmlFor="status-select" className="form-label mt-2">
                  Status
                </label>
                <select
                  value={taskFormData.status}
                  className="form-select"
                  id="status-select"
                  name="status"
                  onChange={handleTaskForm}
                  required
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>

                <label htmlFor="status-select" className="form-label mt-2">
                  Tags
                </label>
                <CreatableSelect
                  isMulti
                  onChange={handleTag}
                  value={taskFormData.tags}
                  placeholder="Type and press Enter"
                  required
                />

                <div className="d-flex justify-content-between mt-2">
                  <div>
                    <label className="form-label">Select Due date</label>
                    <input
                      value={taskFormData.dueDate}
                      className="form-control mb-2"
                      type="date"
                      placeholder="Select date"
                      name="dueDate"
                      onChange={handleTaskForm}
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Estimated Days</label>
                    <input
                      value={taskFormData.timeToComplete}
                      className="form-control mb-2"
                      type="number"
                      placeholder="Enter Time in Days"
                      name="timeToComplete"
                      onChange={handleTaskForm}
                      required
                    />
                  </div>
                </div>

                {taskCreateError && (
                  <p className="text-danger my-2">{taskCreateError}</p>
                )}
                {taskCreateMessage && (
                  <p className="text-info my-2">{taskCreateMessage}</p>
                )}

                <div className="mt-4 d-flex justify-content-end gap-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setisNewTask(false);
                      handleTaskFormReset();
                      dispatch(resetTaskCreateMessage());
                    }}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={taskCreateMessage === "loading"}
                    className="btn btn-primary"
                  >
                    {taskCreateMessage === "loading" ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
