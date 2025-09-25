import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/user/userSlice";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Button,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";

const Header = ({ onToggleSidebar, showMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.userState);

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      dispatch(logoutUser());
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    window.location.reload();
  };

  return (
    <AppBar
      position="sticky"
      color="primary"
      elevation={3}
      sx={{ px: { xs: 2, md: 6 } }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Sidebar toggle button (only on mobile when sidebar hidden) */}
        {showMenu && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onToggleSidebar}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Brand */}
        <Box display="flex" alignItems="center" gap={1}>
          <DashboardIcon fontSize="large" />
          <Typography
            variant="h6"
            component={NavLink}
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
            fontWeight="bold"
          >
            Workasana
          </Typography>
        </Box>

        {/* Right side content (avatar + logout) */}
        <Box display="flex" alignItems="center" gap={2}>
          {user && (
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar sx={{ bgcolor: "secondary.main" }}>
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body1"
                sx={{ display: { xs: "none", md: "inline" }, fontWeight: 600 }}
              >
                {user.name}
              </Typography>
            </Box>
          )}
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 2,
              py: 1,
              boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
