import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  setisProjectForm,
} from "../../features/project/projectSlice";

const NewProjectForm = () => {
  const dispatch = useDispatch();

  const initialProjectData = { name: "", status: "Active", description: "" };
  const [projectFormData, setPorjectFormData] = useState(initialProjectData);

  const {
    projectsforForm,
    projectCreateState,
    projectCreateMessage,
    projectCreateError,
  } = useSelector((state) => state.projectState);

  useEffect(() => {
    if (projectCreateState === "success") {
      setPorjectFormData(initialProjectData);
    }
  }, [projectCreateState]);

  const handleProjectForm = (e) => {
    const { id, value } = e.target;
    setPorjectFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleProjectFormSubmit = (e) => {
    e.preventDefault();
    if (projectFormData.name) {
      dispatch(createProject(projectFormData));
    }
  };

  return (
    <>
      <div className="overlay">
        <div className="project-form rounded">
          <form onSubmit={handleProjectFormSubmit} className="">
            <h5>Create New Project</h5>
            <label htmlFor="name" className="form-label">
              Project Name
            </label>
            <input
              value={projectFormData.name}
              onChange={handleProjectForm}
              className="form-control mb-3"
              type="text"
              placeholder="Enter Project Name"
              id="name"
              required
            />

            <label htmlFor="status" className="form-label mt-2">
              Status
            </label>
            <select
              value={projectFormData.status}
              className="form-select"
              id="status"
              name="status"
              onChange={handleProjectForm}
              required
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>

            <label htmlFor="description" className="form-label mt-2">
              Project Description
            </label>
            <textarea
              value={projectFormData.description}
              onChange={handleProjectForm}
              className="form-control"
              placeholder="Enter Project Description"
              rows="3"
              cols={30}
              id="description"
            ></textarea>

            {projectCreateError && (
              <p className="text-danger my-2">{projectCreateError}</p>
            )}
            {projectCreateMessage && (
              <p className="text-info my-2">{projectCreateMessage}</p>
            )}

            <div className="mt-4 d-flex justify-content-end gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(setisProjectForm(false));
                  setPorjectFormData(initialProjectData);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                disabled={projectCreateMessage === "loading"}
                className="btn btn-primary"
              >
                {projectCreateMessage === "loading" ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default NewProjectForm;
