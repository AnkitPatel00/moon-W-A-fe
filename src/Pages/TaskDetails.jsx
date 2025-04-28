import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  completedTaskUpdate,
  fetchTaskbyId,
  fetchTaskDetailsbyId,
  setisTaskForm,
  setisUpdateTask,
} from "../../features/task/taskSlice";
import NewTaskForm from "../Component/NewTaskForm";
import Loading from "../Component/Loading";

const TaskDetails = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskDetailsbyId(taskId));
    }
  }, [taskId]);

  const {
    tasksDetailsById,
    isTaskForm,
    isUpdateTask,
    taskUpdateState,
    taskDetailsFetchState,
  } = useSelector((state) => state.taskState);

  useEffect(() => {
    if (taskUpdateState === "success") {
      dispatch(fetchTaskDetailsbyId(taskId));
    }
  }, [taskUpdateState]);

  const daysRemain = () => {
    const today = new Date();
    const dueDate = new Date(tasksDetailsById?.dueDate);

    const milisecond = dueDate - today;

    const days = Math.ceil(milisecond / (1000 * 60 * 60 * 24));

    return days;
  };

  const handleMarkComplete = (e) => {
    const updatedData = { id: taskId };

    if (e.target.checked) {
      dispatch(
        completedTaskUpdate({
          ...updatedData,
          completedAt: Date.now(),
          status: "Completed",
        })
      );
    } else {
      dispatch(
        completedTaskUpdate({
          ...updatedData,
          completedAt: null,
          status: "In Progress",
        })
      );
    }
  };

  console.log(isUpdateTask);

  // console.log({ isTaskForm, isUpdateTask, tasksDetailsById, taskUpdateState });

  return (
    <>
      <div>
        <div>{taskDetailsFetchState === "loading" && <Loading />}</div>

        {tasksDetailsById && taskDetailsFetchState !== "loading" && (
          <>
            <h2 className="">Task Details</h2>
            <h5 className="">{tasksDetailsById.name}</h5>
            <p>Status: {tasksDetailsById.status}</p>
            <p>
              Project:
              <span className="ms-2">{tasksDetailsById.project.name}</span>
            </p>
            <p>
              Team:
              <span className="ms-2">{tasksDetailsById.team.name}</span>
            </p>
            <p>
              Owners:{" "}
              {tasksDetailsById.owners.map((owner) => {
                return <span key={owner._id}>{owner.name}</span>;
              })}
            </p>
            <p>
              Due Date: <span>{tasksDetailsById.dueDate}</span>
            </p>

            <p>
              Time Remaining:{" "}
              <span>
                {tasksDetailsById.status === "Completed"
                  ? `Completed at ${tasksDetailsById.completedAt}`
                  : daysRemain() +
                    ` Days ( ${
                      daysRemain() > 0
                        ? "Remaining"
                        : daysRemain() < 0
                        ? "Overdue"
                        : "Due today"
                    } )`}{" "}
              </span>
            </p>

            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="complete"
                checked={tasksDetailsById.status === "Completed" ? true : false}
                onChange={handleMarkComplete}
              />
              <label className="form-check-label" htmlFor="complete">
                Mark as Complete
              </label>
            </div>

            <button
              onClick={() => {
                console.log("Clicked");
                dispatch(setisUpdateTask(true));
              }}
              className="btn btn-primary mt-3"
            >
              Edit Task
            </button>
          </>
        )}
      </div>

      {/* {isUpdateTask && (
        <>
          <p>Working</p>
          <button onClick={() => dispatch(setisUpdateTask(false))}>
            Cancel
          </button>
        </>
      )} */}

      {isUpdateTask && <NewTaskForm taskId={taskId} />}
    </>
  );
};
export default TaskDetails;
