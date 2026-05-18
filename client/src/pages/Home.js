import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home({ setPage, setSelectedUser, setSelectedProject }) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const userId = JSON.parse(atob(token.split('.')[1])).id;

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => setProjects(res.data));
  }, []);

  const handleJoin = async (id) => {
    await axios.post(
      `http://localhost:5000/api/projects/${id}/join`,
      {},
      { headers: { Authorization: token } }
    );
    alert("Joined project");
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/projects/${id}`,
      { headers: { Authorization: token } }
    );
    window.location.reload();
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="section-title">All Projects</h2>

      {/* SEARCH BAR */}
      <input
        className="input search-bar"
        placeholder="Search projects..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredProjects.map(p => (
        <div key={p._id} className="card">

          {/* CLICK PROJECT → DETAILS */}
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedProject(p._id);
              setPage("projectDetails");
            }}
          >
            {p.title}
          </h3>

          <p style={{ color: "#666" }}>{p.description}</p>

          <p><b>{p.domain}</b></p>

          {/* CLICK USER → PROFILE */}
          <p
            style={{ color: "#007aff", cursor: "pointer" }}
            onClick={() => {
              setSelectedUser(p.owner._id);
              setPage("userProfile");
            }}
          >
            by {p.owner?.name}
          </p>

          {/* ACTION BUTTON */}
          {(!p.owner || p.owner._id === userId) ? (
            <button className="button" onClick={() => handleDelete(p._id)}>
              Delete
            </button>
          ) : (
            <button className="button" onClick={() => handleJoin(p._id)}>
              Join
            </button>
          )}

        </div>
      ))}
    </div>
  );
}

export default Home;