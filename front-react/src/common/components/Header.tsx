import type { Dispatch, SetStateAction } from "react";
import { useAuth } from "../../features/auth/context/AuthContext";

type props = {
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
};

function Header({ showSidebar, setShowSidebar }: props) {
  const { user } = useAuth();

  const handleClick = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <header className="flex justify-between p-5 text-3xl bg-[#0C2B4E] text-white ">
      <span
        onClick={handleClick}
        className="uppercase hover:text-green-500 cursor-pointer"
      >
        Gestion des etudiants
      </span>
      <span className="text-xl text-[#5289a0]">{user?.email}</span>
    </header>
  );
}

export default Header;
