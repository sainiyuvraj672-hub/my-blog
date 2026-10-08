import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response =
        await fetch(
          "http://localhost:5000/api/auth/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Login failed"
        );
      }

      /*
       * Get profile information that
       * was saved before logout.
       */
      const savedProfile =
        localStorage.getItem(
          `profile_${email}`
        );

      let profileData = {};

      if (savedProfile) {
        try {
          profileData =
            JSON.parse(
              savedProfile
            );
        } catch (error) {
          console.error(
            "Could not read saved profile:",
            error
          );
        }
      }

      /*
       * Merge backend user + saved
       * profile information.
       */
      const loggedInUser = {
        ...data.user,

        name:
          profileData.name ||
          data.user.name,

        bio:
          profileData.bio ||
          data.user.bio ||
          "",

        profilePicture:
          profileData.profilePicture ||
          data.user.profilePicture ||
          null,
      };

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          loggedInUser
        )
      );

      navigate("/home");

    } catch (error) {
      setError(
        error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <h1>MyBlog</h1>

        <p className="subtitle">
          Share your thoughts.
          Tell your story.
        </p>

        <button className="google-btn">
          Continue with Google
        </button>

        <div className="divider">
          <span>or</span>
        </div>

        {error && (
          <p
            style={{
              color: "red",
              marginBottom: "15px",
            }}
          >
            {error}
          </p>
        )}

        <form onSubmit={handleLogin}>

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            required
          />

          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <Link to="/signup">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;