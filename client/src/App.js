import React, { useState } from 'react';
import './App.css';

import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import MyProjects from './pages/MyProjects';
import Requests from './pages/Requests';
import CreateProject from './components/CreateProject';
import ProjectDetails from './pages/ProjectDetails';

function App() {
  const token = localStorage.getItem("token");

  const [page, setPage] = useState("home");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  if (!token) return <Login />;

  return (
    <div className="container">

      <h1 className="header">Project Hub</h1>

      {/* NAVBAR */}
      <div className="topbar">

        {/* LEFT */}
        <div className="nav-left">
          <button className="button" onClick={() => setPage("home")}>
            Projects
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

        {/* RIGHT */}
        <div className="nav-right">

          <button
            className="profile-btn"
            onClick={() => setPage("profile")}
          >
            👤
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

      {/* ROUTES */}
      {page === "home" &&
        <Home
          setPage={setPage}
          setSelectedUser={setSelectedUser}
          setSelectedProject={setSelectedProject}
        />
      }

      {page === "profile" && <Profile />}

      {page === "userProfile" &&
        <UserProfile userId={selectedUser} />
      }

      {page === "my" && <MyProjects />}

      {page === "create" && <CreateProject />}

      {page === "requests" && <Requests />}

      {page === "projectDetails" &&
        <ProjectDetails projectId={selectedProject} />
      }

    </div>
  );
}

export default App;