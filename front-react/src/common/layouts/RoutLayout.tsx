import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

function RoutLayout() {
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  return (
    <>
      <Header showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
      <div className="flex bg-[#F4F4F4]">
        <Sidebar showSidebar={showSidebar} />
        <span className="m-5">
          <Outlet />
        </span>
      </div>
    </>
  );
}

export default RoutLayout;
