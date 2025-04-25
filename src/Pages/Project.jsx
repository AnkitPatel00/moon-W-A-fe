import { useDispatch, useSelector } from "react-redux";
import ProjectList from "../Component/ProjectList";
import { useEffect, useState } from "react";
import {
  fetchProject,
  setisProjectForm,
} from "../../features/project/projectSlice";
import { useSearchParams } from "react-router-dom";
import NewProjectForm from "../Component/newProjectForm";

const Project = () => {
  const dispatch = useDispatch();

  const [searchParams, setSearchParams] = useSearchParams();

  const statusProjectQuery = searchParams.get("projectStatus");

  const [projectFilter, setProjectFilter] = useState(statusProjectQuery || "");

  useEffect(() => {
    setSearchParams(
      (prevParams) => {
        const params = new URLSearchParams(prevParams);
        if (projectFilter) {
          params.set("projectStatus", projectFilter);
        } else {
          params.delete("projectStatus");
        }
        return params;
      },
      { replace: true }
    );
  }, [projectFilter]);

  let t;
  useEffect(() => {
    if (projectFilter) {
      t = setTimeout(() => {
        dispatch(fetchProject(`?${searchParams.toString()}`));
      }, 1000);
    } else {
      dispatch(fetchProject());
    }

    return () => clearTimeout(t);
  }, [searchParams]);

  const { projects, isProjectForm } = useSelector(
    (state) => state.projectState
  );

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
        {projects.length > 0 && <ProjectList projects={projects} />}
      </div>

      {isProjectForm && <NewProjectForm />}
    </>
  );
};

export default Project;
