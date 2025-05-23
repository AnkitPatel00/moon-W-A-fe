import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import {
  clearTask,
  fetchTask,
  fetchTaskbyId,
} from "../../features/task/taskSlice";
import TaskList from "../Component/TaskList";
import Loading from "../Component/Loading";

const ProjectDetails = () => {
  const dispatch = useDispatch();

  const { projectId } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    dispatch(clearTask());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    // if (projectId) params.set("projectId", projectId);
    if (status) params.set("taskStatus", status);
    if (ownerFilter) params.set("taskOwner", ownerFilter);
    if (sortBy) params.set("sortByDate", sortBy);

    setSearchParams(params, { replace: true });
  }, [status, ownerFilter, projectId, sortBy]);

  useEffect(() => {
    let t;

    t = setTimeout(() => {
      const params = new URLSearchParams();
      if (projectId) params.set("projectId", projectId);
      if (status) params.set("taskStatus", status);
      if (ownerFilter) params.set("taskOwner", ownerFilter);
      if (sortBy) params.set("sortByDate", sortBy);

      dispatch(fetchTask(params.toString() ? `?${params.toString()}` : ""));
    }, 300);

    return () => clearTimeout(t);
  }, [status, ownerFilter, projectId, sortBy]);

  useEffect(() => {
    if (projectId) {
      const tasksTimer = setTimeout(
        () => dispatch(fetchTaskbyId(projectId)),
        100
      );

      return () => clearTimeout(tasksTimer);
    }
  }, [projectId]);

  const { tasks, taskFetchState, tasksById } = useSelector(
    (state) => state.taskState
  );

  const taskOwners =
    tasksById.length > 0 &&
    [
      ...new Set(
        tasksById
          ?.flatMap((task) => task.owners)
          .map((owner) => `${owner.name + "split" + owner._id}`)
      ),
    ].map((owner) => owner.split("split")[0]);

  return (
    <>
      <h2 className="text-center">{tasks[0]?.project.name}</h2>

      <div>
        <h5>Task List</h5>

        <div className="d-flex align-items-center mb-3 flex-wrap">
          <label htmlFor="task-status-filter" className="mb-3">
            Status Filter:
          </label>
          <select
            className="form-select mx-2 mb-3"
            style={{ width: "150px" }}
            id="task-status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Blocked">Blocked</option>
          </select>

          <label htmlFor="task-owner-filter" className="mb-3">
            Owner Filter:
          </label>
          <select
            className="form-select mx-2 mb-3"
            style={{ width: "150px" }}
            id="task-owner-filter"
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
          >
            <option value={""}>All</option>
            {taskOwners.length > 0 &&
              taskOwners.map((user) => {
                return (
                  <option key={user} value={user}>
                    {user}
                  </option>
                );
              })}
          </select>

          <label htmlFor="task-owner-filter" className="mb-3">
            SortByDate:
          </label>
          <select
            className="form-select ms-2 mb-3"
            style={{ width: "150px" }}
            id="task-owner-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value={""}>All</option>
            <option value={"1"}>Latest</option>
            <option value={"-1"}>Old</option>
          </select>
        </div>
      </div>

      {tasks.length < 1 && taskFetchState !== "loading" && (
        <p>No Task Found!</p>
      )}

      <div className="row gap-3 mx-3">
        {taskFetchState === "loading" && <Loading />}
        {tasks.length > 0 && taskFetchState !== "loading" && (
          <TaskList tasks={tasks} />
        )}
      </div>
    </>
  );
};

export default ProjectDetails;
