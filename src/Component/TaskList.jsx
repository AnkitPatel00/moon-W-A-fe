import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteTask } from "../../features/task/taskSlice";
const TaskList = ({ tasks }) => {
  const dispatch = useDispatch();

  const handleTaskDelete = (taskId) => {
    dispatch(deleteTask(taskId));
  };

  const { taskDeleteState } = useSelector((state) => state.taskState);

  return (
    <>
      {tasks?.toReversed().map((task) => {
        const dueDate = task?.dueDate;
        const dueDateFormate = new Date(dueDate);

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
          <div key={task._id} className="col-md-4 border bg-body p-4">
            <p>
              <span className={`${statusBG} px-2 py-1 rounded`}>
                {task.status}
              </span>
            </p>
            <h5 className="fs-4">{task.name}</h5>
            <div className="d-flex align-items-center">
              {task.owners.slice(0, 3).map((owner, i) => {
                return (
                  <div
                    key={owner._id || i}
                    className="rounded-circle border border-light text-bg-secondary d-flex justify-content-center align-items-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      position: "relative",
                      left: `${-i * 12}px`,
                    }}
                  >
                    {owner.name ? owner.name.charAt(0) : ""}
                  </div>
                );
              })}

              {task.owners.length > 3 && (
                <div
                  className="rounded-circle border border-light  text-bg-secondary d-flex justify-content-center align-items-center"
                  style={{
                    width: "40px",
                    height: "40px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    position: "relative",
                    left: `${-3 * 12}px`,
                  }}
                >
                  +{task.owners.length - 3}
                </div>
              )}
            </div>
            <p>Due on: {dueDateFormate.toDateString()}</p>
            <p></p>
            <Link
              className="btn btn-primary btn-sm"
              to={`/task-details/${task._id}`}
            >
              See Details
            </Link>

            <button
              disabled={taskDeleteState === "loading" ? true : false}
              className="btn btn-danger btn-sm ms-3"
              onClick={() => handleTaskDelete(task._id)}
            >
              {taskDeleteState === "loading" ? "Deleting..." : "Delete"}
            </button>
          </div>
        );
      })}
    </>
  );
};

export default TaskList;
