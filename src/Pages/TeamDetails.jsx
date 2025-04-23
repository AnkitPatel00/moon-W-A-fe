import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchTeamWithId,
  setisMemberForm,
} from "../../features/team/teamSlice";
import AddMember from "../Component/AddMember";

const TeamDetails = () => {
  const { teamId } = useParams();

  const dispatch = useDispatch();
  const { teamWithId, isMemberForm, teamAddMemberState } = useSelector(
    (state) => state.teamState
  );

  useEffect(() => {
    if (teamAddMemberState === "success") {
      dispatch(fetchTeamWithId(teamId));
    }
  }, [teamAddMemberState]);

  useEffect(() => {
    dispatch(fetchTeamWithId(teamId));
  }, []);

  return (
    <>
      {teamWithId && (
        <>
          <h2>{teamWithId.name}</h2>
          <h5>Members</h5>

          {teamWithId.members.map((member) => {
            return (
              <div
                key={member._id}
                className="d-flex mt-3"
                style={{ alignItems: "center" }}
              >
                <div
                  style={{
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "20px",
                    backgroundColor: "lightgrey",
                    width: "40px",
                    height: "40px",
                    borderRadius: "20px",
                  }}
                >
                  {member.name.charAt(0)}
                </div>
                <p style={{ marginLeft: "10px", marginBottom: "0" }}>
                  {member.name}
                </p>
              </div>
            );
          })}

          <button
            className="btn btn-primary btn-sm mt-3"
            onClick={() => dispatch(setisMemberForm(true))}
          >
            + Add Member
          </button>
        </>
      )}

      {isMemberForm && <AddMember />}
    </>
  );
};

export default TeamDetails;
