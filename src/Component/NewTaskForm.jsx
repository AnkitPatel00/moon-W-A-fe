import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import { fetchTeams } from "../../features/team/teamSlice";
import { createTask, setisTaskForm } from "../../features/task/taskSlice";
import { fetchProjectForForm } from "../../features/project/projectSlice";

const NewTaskForm = () => {
  const dispatch = useDispatch();

  const initialTaskData = {
    project: [],
    name: "",
    team: [],
    status: "To Do",
    tags: [],
    dueDate: "",
    timeToComplete: "",
  };

  const { projects, projectsforForm } = useSelector(
    (state) => state.projectState
  );

  const { teams } = useSelector((state) => state.teamState);

  const { taskCreateState, taskCreateMessage, taskCreateError } = useSelector(
    (state) => state.taskState
  );

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      dispatch(fetchTeams());
      dispatch(fetchProjectForForm());
    }
  }, []);

  const [taskFormData, setTaskFormData] = useState(initialTaskData);
  const [selectedOwner, setSelectedOwner] = useState([]);

  useEffect(() => {
    setSelectedOwner([]);
  }, [taskFormData.team]);

  useEffect(() => {
    if (projectsforForm.length > 0) {
      setTaskFormData((prev) => ({
        ...prev,
        project: projectsforForm[projectsforForm.length - 1]._id,
      }));
    }

    if (teams.length > 0) {
      setTaskFormData((prev) => ({
        ...prev,
        team: teams[teams.length - 1]._id,
      }));
    }
  }, [projectsforForm, teams]);

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
      project: projectsforForm[projectsforForm.length - 1]._id,
      team: teams[teams.length - 1]._id,
    });
    setSelectedOwner([]);
  };

  useEffect(() => {
    if (taskCreateState === "success") {
      handleTaskFormReset();
    }
  }, [taskCreateState]);

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
      dispatch(createTask(taskData));
    }
  };

  return (
    <>
      {teams.length > 0 && (
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
                {projectsforForm?.toReversed().map(({ _id, name }) => {
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
                    handleTaskFormReset();
                    dispatch(setisTaskForm(false));
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
      )}
    </>
  );
};

export default NewTaskForm;
