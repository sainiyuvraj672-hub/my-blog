import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

function Profile() {
  const { id } =
    useParams();

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchProfile =
      async () => {
        try {
          const response =
            await fetch(
              `http://localhost:5000/api/users/${id}`
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data.message ||
                "Failed to load profile"
            );
          }

          setUser(data);
        } catch (error) {
          console.error(
            "Profile error:",
            error
          );

          setError(
            error.message
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <Link
            to="/home"
            className="back-button"
          >
            ← Back
          </Link>

          <h2>
            {error}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      <div className="profile-container">

        <Link
          to="/home"
          className="back-button"
        >
          ← Back
        </Link>

        <div className="public-profile-card">

          <div className="public-profile-avatar">

            {user.profilePicture ? (
              <img
                src={
                  user.profilePicture
                }
                alt={
                  user.name
                }
              />
            ) : (
              user.name
                .charAt(0)
                .toUpperCase()
            )}

          </div>

          <h1>
            {user.name}
          </h1>

          <p className="profile-email">
            {user.email}
          </p>

          <div className="profile-bio">

            <h2>
              About
            </h2>

            <p>
              {user.bio ||
                "No bio added yet."}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;