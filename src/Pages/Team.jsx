import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams, setisForm } from "../../features/team/teamSlice";
import { Link } from "react-router-dom";
import CreateTeamForm from "../Component/CreateTeamForm";

const Team = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTeams());
  }, []);

  const { teams, isForm } = useSelector((state) => state.teamState);

  return (
    <>
      <h2>Team Management </h2>

      <div className="my-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="d-flex align-items-center">
            <h5>Team List</h5>
          </div>
          <button
            onClick={() => dispatch(setisForm(true))}
            className="btn btn-primary mt-2 mt-md-0"
          >
            + Create Team
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <ul className="list-group">
            {teams.length > 0 &&
              teams.map((team) => {
                return (
                  <li
                    key={team._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {team.name}
                    <Link
                      to={`/team-details/${team._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>

      {isForm && <CreateTeamForm />}
    </>
  );
};

export default Team;
