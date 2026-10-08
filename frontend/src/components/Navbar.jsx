import { useEffect, useState } from "react";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const name = user?.name || "User";
  const profilePicture = user?.profilePicture;

  return (
    <header className="navbar">
      <div className="logo">
        MyBlog
      </div>

      <div className="navbar-actions">
        <input
          type="text"
          placeholder="Search blogs..."
          className="search-input"
        />

        <div className="profile-button">

          <div className="profile-avatar">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={name}
              />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>

          <span>{name}</span>

        </div>
      </div>
    </header>
  );
}

export default Navbar;