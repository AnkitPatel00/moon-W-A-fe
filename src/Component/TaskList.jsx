import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { deleteTask } from "../../features/task/taskSlice";
const TaskList = ({ tasks }) => {
  const dispatch = useDispatch();

  const handleTaskDelete = (taskId) => {
    dispatch(deleteTask(taskId));
  };

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
            <div className="d-flex align-items-center">
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
                    key={owner._id}
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
            <Link
              className="btn btn-primary btn-sm"
              to={`/task-details/${task._id}`}
            >
              See Details
            </Link>

            <button
              className="btn btn-danger btn-sm ms-3"
              onClick={() => handleTaskDelete(task._id)}
            >
              Delete
            </button>
          </div>
        );
      })}
    </>
  );
};

export default TaskList;
