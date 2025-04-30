import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { fetchTeams } from "../../features/team/teamSlice";
import {
  createTask,
  setisTaskForm,
  setisUpdateTask,
  updateTask,
} from "../../features/task/taskSlice";
import { fetchProject } from "../../features/project/projectSlice";

const NewTaskForm = ({ taskId }) => {
  const dispatch = useDispatch();

  const [manualTeamChange, setManualTeamChange] = useState(false);

  const { projects } = useSelector((state) => state.projectState);

  const { teams } = useSelector((state) => state.teamState);

  const {
    isUpdateTask,
    isTaskForm,
    tasksDetailsById,
    taskDetailsFetchState,
    taskCreateState,
    taskCreateMessage,
    taskCreateError,
    taskUpdateState,
    taskUpdateMessage,
    taskUpdateError,
  } = useSelector((state) => state.taskState);

  const initialTaskData = {
    project: "",
    name: "",
    team: "",
    status: "To Do",
    tags: [],
    dueDate: "",
    timeToComplete: "",
  };

  const [taskFormData, setTaskFormData] = useState(initialTaskData);
  const [selectedOwner, setSelectedOwner] = useState([]);

  // console.log(isUpdateTask, taskDetailsFetchState, taskFormData);

  useEffect(() => {
    if (manualTeamChange) {
      setSelectedOwner([]);
    }
  }, [manualTeamChange]);

  //maybe this is problem 1

  useEffect(() => {
    if (projects.length < 1) {
      dispatch(fetchProject());
    }
    if (teams.length < 1) {
      dispatch(fetchTeams());
    }
  }, []);

  // set Data to Form if There is Data

  useEffect(() => {
    if (isUpdateTask && taskId) {
      setTaskFormData((prev) => {
        return {
          ...prev,
          ...{
            project: tasksDetailsById.project._id,
            name: tasksDetailsById.name,
            team: tasksDetailsById.team._id,
            status: tasksDetailsById.status,
            tags: tasksDetailsById.tags.map((tag) => ({
              label: tag,
              value: tag,
            })),
            dueDate: tasksDetailsById.dueDate,
            timeToComplete: tasksDetailsById.timeToComplete,
          },
        };
      });

      setSelectedOwner(
        tasksDetailsById.owners.map(({ _id, name }) => ({
          label: name,
          value: _id,
        }))
      );
      setManualTeamChange(false);
    }
  }, [isUpdateTask, taskId]);

  // console.log(tasksDetailsById);

  //new task code start

  useEffect(() => {
    if (projects.length > 0 && !isUpdateTask) {
      setTaskFormData((prev) => ({
        ...prev,
        project: projects[projects.length - 1]._id,
      }));
    }

    if (teams.length > 0 && !isUpdateTask) {
      setTaskFormData((prev) => ({
        ...prev,
        team: teams[teams.length - 1]._id,
      }));
    }
  }, [projects, teams, isUpdateTask]);

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
      project: projects.length > 0 && projects[projects.length - 1]._id,
      team: teams.length > 0 && teams[teams.length - 1]._id,
    });
    setSelectedOwner([]);
    setManualTeamChange(false);
  };

  useEffect(() => {
    if (taskCreateState === "success" && !isUpdateTask) {
      handleTaskFormReset();
    }
  }, [taskCreateState, isUpdateTask]);

  //new task code end

  const handleTaskFormSubmit = (e) => {
    e.preventDefault();

    const taskData = {
      ...taskFormData,
      tags: taskFormData.tags.map(({ value }) => value),
      owners: selectedOwner.map(({ value }) => value),
      completedAt: taskFormData.status === "Completed" ? Date.now() : null,
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
      if (isUpdateTask && taskId) {
        dispatch(updateTask({ taskId, updatedData: taskData }));
      } else {
        dispatch(createTask(taskData));
      }
    }
  };

  return (
    <>
      {
        <div className="overlay">
          <div className="project-form rounded">
            <form onSubmit={handleTaskFormSubmit} className="">
              <h5>{isUpdateTask ? "Update Task" : "Create New Task"}</h5>
              <label htmlFor="project-select" className="form-label">
                Select Project
              </label>
              <select
                value={taskFormData.project}
                className="form-select mb-2"
                id="project-select"
                onChange={handleTaskForm}
                name="project"
                required
              >
                {projects.length > 0 &&
                  projects?.toReversed().map(({ _id, name }) => {
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
                value={taskFormData.team}
                className="form-select mb-2"
                id="team-select"
                name="team"
                onChange={(e) => {
                  setManualTeamChange(true);
                  handleTaskForm(e);
                }}
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
                  ?.members.map(({ _id, name }) => ({
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
              <div className="d-flex justify-content-between mt-2 flex-wrap">
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
              <div>
                {isUpdateTask ? (
                  <>
                    {taskUpdateError && (
                      <p className="text-danger my-2">{taskUpdateError}</p>
                    )}
                    {taskUpdateMessage && (
                      <p className="text-info my-2">{taskUpdateMessage}</p>
                    )}
                  </>
                ) : (
                  <>
                    {taskCreateError && (
                      <p className="text-danger my-2">{taskCreateError}</p>
                    )}
                    {taskCreateMessage && (
                      <p className="text-info my-2">{taskCreateMessage}</p>
                    )}
                  </>
                )}
              </div>
              <div className="mt-4 d-flex justify-content-end gap-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleTaskFormReset();
                    dispatch(setisTaskForm(false));
                    dispatch(setisUpdateTask(false));
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  disabled={
                    taskCreateState === "loading" ||
                    taskUpdateState === "loading"
                  }
                  className="btn btn-primary"
                >
                  {isUpdateTask
                    ? `${
                        taskUpdateState === "loading" ? "Updating..." : "Update"
                      }`
                    : `${
                        taskCreateState === "loading" ? "Creating..." : "Create"
                      }`}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </>
  );
};

export default NewTaskForm;
