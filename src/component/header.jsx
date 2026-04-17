import { useState } from "react";
import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";

export default function HeaderAD({ onToggleMenu }) {
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    window.location.href = "/login";
  };

  return (
    <header className="header">
      <div className="header-left">
        <FaBars className="menu-icon" onClick={onToggleMenu} />
      </div>

      <div className="header-center">
        <h1 className="header-title">HAIR SALON</h1>
      </div>

      <div className="header-right">
       

        <FaBell className="bell-icon" />

        <div className="user-wrapper">
          <FaUserCircle
            className="user-icon"
            onClick={() => setOpenMenu(!openMenu)}
          />
          {openMenu && (
            <div className="user-logout open">
              <div className="logout-btn" onClick={handleLogout}>
                <BiLogOutCircle />
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
