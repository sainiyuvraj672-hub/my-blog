import { Link, useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-menu">

        <Link
          to="/home"
          className={`sidebar-item ${
            location.pathname === "/home" ? "active" : ""
          }`}
        >
          🏠
          <span>Home</span>
        </Link>

        <Link
          to="/my-blogs"
          className={`sidebar-item ${
            location.pathname === "/my-blogs" ? "active" : ""
          }`}
        >
          ✍️
          <span>My Blogs</span>
        </Link>

        <Link
          to="/saved"
          className={`sidebar-item ${
            location.pathname === "/saved" ? "active" : ""
          }`}
        >
          🔖
          <span>Saved</span>
        </Link>

        <Link
          to="/settings"
          className={`sidebar-item ${
            location.pathname === "/settings" ? "active" : ""
          }`}
        >
          ⚙️
          <span>Settings</span>
        </Link>

      </nav>

      <button
        className="sidebar-item logout"
        onClick={handleLogout}
      >
        🚪
        <span>Logout</span>
      </button>
    </aside>
  );
}

export default Sidebar;