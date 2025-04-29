import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.userState);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      dispatch(logoutUser());
    }
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <div className="bg-light d-flex justify-content-between align-items-center flex-wrap px-5">
        <h1 className="display-5 text-center py-3">Workasana</h1>

        <div className="d-flex">
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
            {user?.name.charAt(0)}
          </div>
          <button onClick={handleLogout} className="btn btn-danger ms-4">
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
