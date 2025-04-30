import { useDispatch, useSelector } from "react-redux";
import ProjectList from "../Component/ProjectList";
import { useEffect, useState } from "react";
import {
  clearProjects,
  fetchProject,
  setisProjectForm,
} from "../../features/project/projectSlice";
import { useSearchParams } from "react-router-dom";
import Loading from "../Component/Loading";
import NewProjectForm from "../Component/NewProjectForm";

const Project = () => {
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const statusProjectQuery = searchParams.get("projectStatus");

  const [projectFilter, setProjectFilter] = useState(statusProjectQuery || "");

  const { projects, isProjectForm, projectFetchState } = useSelector(
    (state) => state.projectState
  );

  useEffect(() => {
    dispatch(clearProjects());
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (projectFilter) params.set("projectStatus", projectFilter);
    setSearchParams(params, { replace: true });
  }, [projectFilter]);

  // Project Fetch
  useEffect(() => {
    let projectTimeout;

    projectTimeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (projectFilter) params.set("projectStatus", projectFilter);

      dispatch(fetchProject(params.toString() ? `?${params.toString()}` : ""));
    }, 500);

    return () => clearTimeout(projectTimeout);
  }, [projectFilter]);

  return (
    <>
      <div className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center">
            <h5 className="mb-0 me-3 fs-4">Projects</h5>
            <label htmlFor="project-status-filter" className="me-3">
              Status Filter:
            </label>
            <select
              className="form-select"
              id="project-status-filter"
              style={{ width: "150px" }}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
          <button
            onClick={() => dispatch(setisProjectForm(true))}
            className="btn btn-primary mt-2 mt-md-0"
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="row gap-3 mx-3 my-3">
        {projectFetchState === "loading" && <Loading />}
        {projects.length > 0 && projectFetchState !== "loading" && (
          <ProjectList projects={projects} />
        )}
      </div>

      {isProjectForm && <NewProjectForm />}
    </>
  );
};

export default Project;
