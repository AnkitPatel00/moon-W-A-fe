import { Outlet } from "react-router-dom";
import Sidebar from "./Component/Sidebar";
import Header from "./Component/Header";

function App() {
  return (
    <>
      <Header />

      <div className="container-fluid  py-4">
        <div className="row mx-5">
          <div className="col-12 col-lg-2 p-4  rounded bg-light">
            <Sidebar />
          </div>

          <div className="col-12 col-lg-10  rounded p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
