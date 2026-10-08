import MyBlogs from "./MyBlogs";
import Saved from "./Saved";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

import "./App.css";

function App() {
  const [theme, setTheme] =
    useState("light");

  return (
    <div
      className={`app ${theme}`}
    >
      <BrowserRouter>

        <Routes>

          <Route
            path="/my-blogs"
            element={
              <MyBlogs />
            }
          />

          <Route
            path="/saved"
            element={
              <Saved />
            }
          />

          <Route
            path="/"
            element={
              <Navigate to="/login" />
            }
          />

          <Route
            path="/login"
            element={
              <Login />
            }
          />

          <Route
            path="/signup"
            element={
              <Signup />
            }
          />

          <Route
            path="/home"
            element={
              <Home />
            }
          />

          <Route
            path="/profile/:id"
            element={
              <Profile />
            }
          />

          <Route
            path="/settings"
            element={
              <Settings
                theme={theme}
                setTheme={
                  setTheme
                }
              />
            }
          />

        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;