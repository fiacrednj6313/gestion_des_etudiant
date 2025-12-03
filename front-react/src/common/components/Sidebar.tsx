import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
// import { LogOut } from "lucide-react";

type Props = {
  showSidebar: boolean;
};

function Sidebar({ showSidebar }: Props) {
  const { logout } = useAuth();

  return (
    <aside
      className={`flex flex-col justify-between bg-[#1A3D64] text-white text-2xl overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out ${
        showSidebar ? "w-[250px]" : "w-0"
      } min-h-[calc(100vh_-_76px)] `}
    >
      <ul className="flex flex-col gap-2.5">
        <Link
          to="/"
          className="px-5 py-4 hover:bg-[#0C2B4E] cursor-pointer mt-2"
        >
          Dashbord
        </Link>
        <Link
          to="/etudiants"
          className="px-5 py-4 hover:bg-[#0C2B4E] cursor-pointer "
        >
          Etudiants
        </Link>
        <Link
          to="/classes"
          className="px-5 py-4 hover:bg-[#0C2B4E] cursor-pointer "
        >
          Classes
        </Link>
      </ul>
      <span
        onClick={logout}
        className="flex gap-2 text-xl hover:text-green-500 cursor-pointer px-5 mb-2"
      >
        Logout
      </span>
    </aside>
  );
}

export default Sidebar;
