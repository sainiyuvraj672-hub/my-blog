import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Link } from "react-router-dom";

function Settings({
  theme,
  setTheme,
}) {
  const [user, setUser] = useState(null);

  const [name, setName] = useState("");

  const [bio, setBio] = useState("");

  const [saving, setSaving] =
    useState(false);

  const fileInputRef =
    useRef(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      const parsedUser =
        JSON.parse(storedUser);

      setUser(parsedUser);

      setName(parsedUser.name || "");

      setBio(parsedUser.bio || "");
    }
  }, []);

  const handleSaveChanges =
    async () => {
      if (!user) return;

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert(
          "Please log in again."
        );

        return;
      }

      try {
        setSaving(true);

        const response =
          await fetch(
            "http://localhost:5000/api/auth/profile",
            {
              method: "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${token}`,
              },

              body: JSON.stringify({
                name:
                  name.trim() ||
                  user.name,

                bio,
                
                profilePicture:
                  user.profilePicture ||
                  null,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to update profile"
          );
        }

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setUser(data.user);

        setName(data.user.name);

        setBio(
          data.user.bio || ""
        );

        alert(
          "Profile updated successfully!"
        );
      } catch (error) {
        console.error(
          "Profile update error:",
          error
        );

        alert(error.message);
      } finally {
        setSaving(false);
      }
    };

  const handleProfilePictureChange =
    (event) => {
      const file =
        event.target.files[0];

      if (!file || !user) return;

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        alert(
          "Please select an image file."
        );

        return;
      }

      const reader =
        new FileReader();

      reader.onload = async () => {
        const imageData =
          reader.result;

        const token =
          localStorage.getItem(
            "token"
          );

        if (!token) {
          alert(
            "Please log in again."
          );

          return;
        }

        try {
          const response =
            await fetch(
              "http://localhost:5000/api/auth/profile",
              {
                method: "PATCH",

                headers: {
                  "Content-Type":
                    "application/json",

                  Authorization: `Bearer ${token}`,
                },

                body: JSON.stringify({
                  name:
                    user.name,

                  bio:
                    user.bio || "",

                  profilePicture:
                    imageData,
                }),
              }
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to update profile picture"
            );
          }

          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          setUser(data.user);

          setName(data.user.name);

          setBio(
            data.user.bio || ""
          );

          alert(
            "Profile picture updated!"
          );
        } catch (error) {
          console.error(
            "Profile picture error:",
            error
          );

          alert(error.message);
        }
      };

      reader.readAsDataURL(file);
    };

  if (!user) {
    return (
      <div className="settings-page">
        <div className="settings-container">
          <h2>
            User not found
          </h2>

          <p>
            Please log in again.
          </p>

          <Link to="/login">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const profilePicture =
    user.profilePicture;

  return (
    <div className="settings-page">
      <div className="settings-container">

        <div className="settings-header">
          <Link
            to="/home"
            className="back-button"
          >
            ← Back
          </Link>

          <h1>Settings</h1>

          <p>
            Manage your profile and
            preferences.
          </p>
        </div>

        <section className="settings-section">
          <h2>Profile</h2>

          <div className="profile-settings">

            <div className="large-avatar">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={user.name}
                />
              ) : (
                user.name
                  .charAt(0)
                  .toUpperCase()
              )}
            </div>

            <div>
              <h3>
                {user.name}
              </h3>

              <p>
                {user.email}
              </p>

              <button
                className="secondary-button"
                onClick={() =>
                  fileInputRef.current.click()
                }
              >
                Change Profile Picture
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={
                  handleProfilePictureChange
                }
                style={{
                  display: "none",
                }}
              />
            </div>

          </div>
        </section>

        <section className="settings-section">

          <h2>
            Edit Profile
          </h2>

          <label>Name</label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            className="settings-input"
          />

          <label>Bio</label>

          <textarea
            placeholder="Tell people something about yourself..."
            value={bio}
            onChange={(event) =>
              setBio(event.target.value)
            }
            className="settings-textarea"
          />

          <button
            className="primary-button"
            onClick={
              handleSaveChanges
            }
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </section>

        <section className="settings-section">

          <h2>
            Appearance
          </h2>

          <p className="settings-description">
            Choose how MyBlog looks
            for you.
          </p>

          <div className="theme-options">

            <button
              className={`theme-option ${
                theme === "light"
                  ? "active-theme"
                  : ""
              }`}
              onClick={() =>
                setTheme("light")
              }
            >
              ☀️{" "}
              <span>
                Light
              </span>
            </button>

            <button
              className={`theme-option ${
                theme === "dark"
                  ? "active-theme"
                  : ""
              }`}
              onClick={() =>
                setTheme("dark")
              }
            >
              🌙{" "}
              <span>
                Dark
              </span>
            </button>

            <button
              className={`theme-option ${
                theme === "system"
                  ? "active-theme"
                  : ""
              }`}
              onClick={() =>
                setTheme("system")
              }
            >
              💻{" "}
              <span>
                System
              </span>
            </button>

          </div>

        </section>

        <section className="settings-section">

          <h2>
            Account
          </h2>

          <button className="danger-button">
            Delete Account
          </button>

        </section>

      </div>
    </div>
  );
}

export default Settings;