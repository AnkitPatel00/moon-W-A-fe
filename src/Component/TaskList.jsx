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
          <div key={task._id} className="col-md-4 border bg-body p-4">
            <p>
              <span className={`${statusBG} px-2 py-1 rounded`}>
                {task.status}
              </span>
            </p>
            <h5 className="fs-4">{task.name}</h5>
            <div className="d-flex align-items-center">
              {task.owners.slice(0, 3).map((owner, i) => {
                const avatarColors = [
                  "#f94144",
                  "#f3722c",
                  "#f9844a",
                  "#43aa8b",
                  "#577590",
                  "#277da1",
                ];

                const getRandomColor = () => {
                  return avatarColors[
                    Math.floor(Math.random() * avatarColors.length)
                  ];
                };

                return (
                  <div
                    key={owner._id}
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
