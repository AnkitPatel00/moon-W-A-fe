import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Select from "react-select";
import { fetchAllUser } from "../../features/user/userSlice";
import { createTeams, setisForm } from "../../features/team/teamSlice";
const CreateTeamForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ name: "" });

  const [selectedMember, setSelectedMember] = useState([]);

  const { allUsers } = useSelector((state) => state.userState);
  const { teamsCreateState, teamsCreateMessage, teamsCreateError, isForm } =
    useSelector((state) => state.teamState);

  useEffect(() => {
    dispatch(fetchAllUser());
  }, []);

  const resetForm = () => {
    setSelectedMember([]);
    setFormData({ name: "" });
  };

  useEffect(() => {
    if (teamsCreateState === "success") {
      resetForm();
    }
    if (isForm) {
      resetForm();
    }
  }, [teamsCreateState, isForm]);

  const handleFormCancel = (e) => {
    e.preventDefault();
    dispatch(setisForm(false));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const teamData = {
      ...formData,
      members: selectedMember.map(({ value }) => value),
    };

    if (teamData.name && teamData.members.length > 0) {
      dispatch(createTeams(teamData));
    }
  };

  return (
    <>
      <div className="overlay">
        <div className="project-form rounded">
          <form className="" onSubmit={handleFormSubmit}>
            <h5>Create New Team</h5>

            <label htmlFor="name" className="form-label">
              Team Name
            </label>

            <input
              value={formData.name}
              className="form-control mb-3"
              type="text"
              placeholder="Enter Team Name"
              id="name"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />

            <label htmlFor="members" className="form-label">
              Add Members
            </label>
            <Select
              isMulti
              options={allUsers?.map(({ _id, name }) => ({
                label: name,
                value: _id,
              }))}
              value={selectedMember}
              onChange={setSelectedMember}
              required
            />

            {teamsCreateError && (
              <p className="text-danger my-2">{teamsCreateError}</p>
            )}
            {teamsCreateMessage && (
              <p className="text-info my-2">{teamsCreateMessage}</p>
            )}

            <div className="mt-4 d-flex justify-content-end gap-3">
              <button className="btn btn-secondary" onClick={handleFormCancel}>
                Cancel
              </button>
              <button
                disabled={teamsCreateState === "loading"}
                className="btn btn-primary"
              >
                {teamsCreateState === "loading" ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTeamForm;
