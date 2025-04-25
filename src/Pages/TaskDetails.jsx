import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  completedTaskUpdate,
  fetchTaskbyId,
  fetchTaskDetailsbyId,
  setisTaskForm,
} from "../../features/task/taskSlice";
import NewTaskForm from "../Component/NewTaskForm";

const TaskDetails = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTaskDetailsbyId(taskId));
  }, []);

  const { tasksDetailsById, isTaskForm } = useSelector(
    (state) => state.taskState
  );

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

  console.log(tasksDetailsById);

  return (
    <>
      <div>
        {tasksDetailsById && (
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
              onClick={() => dispatch(setisTaskForm(true))}
              className="btn btn-primary mt-3"
            >
              Edit Task
            </button>
          </>
        )}
      </div>

      {isTaskForm && <NewTaskForm />}
    </>
  );
};
export default TaskDetails;
