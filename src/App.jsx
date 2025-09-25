import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Component/Sidebar";
import Header from "./Component/Header";
import { Drawer, Box, useMediaQuery } from "@mui/material";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width:768px)"); // md breakpoint

  return (
    <>
      {/* Pass toggle to Header, but only show on mobile */}
      <Header
        onToggleSidebar={() => !isDesktop && setIsSidebarOpen(true)}
        showMenu={!isDesktop} // pass prop to control hamburger
      />

      <div className="container-fluid">
        <div className="row flex-nowrap">
          {/* Sidebar (Desktop permanent) */}
          {isDesktop && (
            <div className="col-12 col-md-3 col-lg-2 px-0">
              <Sidebar />
            </div>
          )}

          {/* Sidebar (Mobile Drawer) */}
          {!isDesktop && (
            <Drawer
              anchor="left"
              open={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              sx={{
                "& .MuiDrawer-paper": {
                  width: 240,
                },
              }}
            >
              <Box role="presentation" onClick={() => setIsSidebarOpen(false)}>
                <Sidebar />
              </Box>
            </Drawer>
          )}

          {/* Main Content */}
          <div className="col px-4 py-4 bg-light min-vh-100">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
