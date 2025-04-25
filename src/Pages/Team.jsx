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
        <div className="col-xxl-3">
          <ul className="list-group">
            {teams.length > 0 &&
              teams.map((team) => {
                return (
                  <li key={team._id} className="list-group-item">
                    <p>{team.name}</p>

                    <div className="d-flex">
                      {team?.members.slice(0, 3).map((owner, i) => {
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

                      {team?.members.length > 3 && (
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
                          +{team?.members.length - 3}
                        </div>
                      )}
                    </div>

                    <div className="d-flex justify-content-end">
                      <Link
                        to={`/team-details/${team._id}`}
                        className="btn btn-primary btn-sm mt-3"
                      >
                        View
                      </Link>
                    </div>
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
