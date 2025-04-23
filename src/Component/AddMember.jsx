import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { fetchAllUser } from "../../features/user/userSlice";
import {
  addMembersToTeams,
  setisMemberForm,
} from "../../features/team/teamSlice";

const AddMember = () => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((state) => state.userState);
  const {
    teamWithId,
    teamAddMemberState,
    teamAddMemberMessage,
    teamAddMemberError,
  } = useSelector((state) => state.teamState);

  const membersToAdd = allUsers?.filter(
    (user) => !teamWithId?.members.some((member) => member._id === user._id)
  );

  const [selectedMember, setSelectedMember] = useState([]);

  useEffect(() => {
    dispatch(fetchAllUser());
  }, []);

  useEffect(() => {
    if (teamAddMemberState === "success") {
      dispatch(fetchAllUser());
      setSelectedMember([]);
    }
  }, [teamAddMemberState]);

  const handleFormCancel = (e) => {
    e.preventDefault();
    dispatch(setisMemberForm(false));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const memberData = { teamId: teamWithId._id, members: [] };
    if (selectedMember.length > 0 && teamWithId?.members.length > 0) {
      memberData.members = [
        ...teamWithId?.members.map((member) => member._id),
        ...selectedMember.map((member) => member.value),
      ];

      dispatch(addMembersToTeams(memberData));
    }
  };

  return (
    <>
      <div className="overlay">
        <div className="project-form rounded">
          <form className="" onSubmit={handleFormSubmit}>
            <h5>Add New Member</h5>

            <label htmlFor="members" className="form-label">
              Add Members
            </label>
            <Select
              isMulti
              options={membersToAdd?.map(({ _id, name }) => ({
                label: name,
                value: _id,
              }))}
              value={selectedMember}
              onChange={setSelectedMember}
              required
            />

            {teamAddMemberError && (
              <p className="text-danger my-2">{teamAddMemberError}</p>
            )}
            {teamAddMemberMessage && (
              <p className="text-info my-2">{teamAddMemberMessage}</p>
            )}

            <div className="mt-4 d-flex justify-content-end gap-3">
              <button className="btn btn-secondary" onClick={handleFormCancel}>
                Cancel
              </button>
              <button className="btn btn-primary">Add</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddMember;
