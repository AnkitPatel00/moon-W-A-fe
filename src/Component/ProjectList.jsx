import { Link } from "react-router-dom";
const ProjectList = ({ projects }) => {
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
            <Link
              className="btn btn-primary btn-sm"
              to={`/project-details/${project._id}`}
            >
              See Details
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default ProjectList;
