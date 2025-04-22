import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  completedTaskUpdate,
  fetchTaskbyId,
} from "../../features/task/taskSlice";

const TaskDetails = () => {
  const { taskId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTaskbyId(taskId));
  }, []);

  const { tasksById } = useSelector((state) => state.taskState);

  const daysRemain = () => {
    const today = new Date();
    const dueDate = new Date(tasksById?.dueDate);

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

  return (
    <>
      <div>
        {tasksById && (
          <>
            <h2 className="">Task Details</h2>
            <h5 className="">{tasksById.name}</h5>
            <p>Status: {tasksById.status}</p>
            <p>
              Project:<span className="ms-2">{tasksById.project.name}</span>
            </p>
            <p>
              Team:
              <span className="ms-2">{tasksById.team.name}</span>
            </p>
            <p>
              Owners:{" "}
              {tasksById.owners.map((owner) => {
                return <span key={owner._id}>{owner.name}</span>;
              })}
            </p>
            <p>
              Due Date: <span>{tasksById.dueDate}</span>
            </p>

            <p>
              Time Remaining:{" "}
              <span>
                {tasksById.status === "Completed"
                  ? `Completed at ${tasksById.completedAt}`
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
                checked={tasksById.status === "Completed" ? true : false}
                onChange={handleMarkComplete}
              />
              <label className="form-check-label" htmlFor="complete">
                Mark as Complete
              </label>
            </div>
          </>
        )}
      </div>
    </>
  );
};
export default TaskDetails;
