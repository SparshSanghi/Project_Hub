import React, { useState } from 'react';
import './App.css';

import Login from './pages/Login';
import Home from './pages/Home';
import MyProjects from './pages/MyProjects';
import CreateProject from './components/CreateProject';
import Requests from './pages/Requests';
import Profile from './pages/Profile';

function App() {
  const token = localStorage.getItem("token");
  const [page, setPage] = useState("home");

  // If not logged in → show login
  if (!token) {
    return <Login />;
  }

  return (
    <div className="container">

      <h1 className="header">Project Hub</h1>

      {/* Top Navigation Bar */}
      <div className="topbar">

        {/* LEFT SIDE */}
        <div className="nav-left">
          <button className="button" onClick={() => setPage("home")}>
            All Projects
          </button>

          <button className="button-secondary" onClick={() => setPage("my")}>
            My Projects
          </button>

          <button className="button-secondary" onClick={() => setPage("create")}>
            Create
          </button>

          <button className="button-secondary" onClick={() => setPage("requests")}>
            Requests
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", gap: "10px" }}>

          <button
            className="profile-btn"
            onClick={() => setPage("profile")}
          >
            👤 Profile
          </button>

          <button
            className="button-secondary"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.reload();
            }}
          >
            Logout
          </button>

        </div>

      </div>

      {/* Page Rendering */}
      {page === "home" && <Home />}
      {page === "my" && <MyProjects />}
      {page === "create" && <CreateProject />}
      {page === "requests" && <Requests />}
      {page === "profile" && <Profile />}

    </div>
  );
}

export default App;