import { useDispatch, useSelector } from "react-redux";
import ProjectList from "../Component/ProjectList";
import { useEffect } from "react";
import { fetchProject } from "../../features/project/projectSlice";

const Project = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProject());
  }, []);

  const { projects } = useSelector((state) => state.projectState);

  return (
    <>
      <h1>Project</h1>

      <div className="row gap-3 mx-3">
        {projects.length > 0 && <ProjectList projects={projects} />}
      </div>
    </>
  );
};

export default Project;
