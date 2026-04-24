import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [projects, setProjects] = useState([]);

  const token = localStorage.getItem("token");
  const userId = JSON.parse(atob(token.split('.')[1])).id;

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => setProjects(res.data));
  }, []);

  // JOIN PROJECT
  const handleJoin = async (id) => {
    await axios.post(
      `http://localhost:5000/api/projects/${id}/join`,
      {},
      { headers: { Authorization: token } }
    );

    alert("Request sent");
  };

  // DELETE PROJECT
  const handleDelete = async (id) => {
    await axios.delete(
      `http://localhost:5000/api/projects/${id}`,
      { headers: { Authorization: token } }
    );

    alert("Project deleted");
    window.location.reload();
  };

  // REMOVE MEMBER (fixed variable naming)
  const handleRemove = async (projectId, memberId) => {
    await axios.post(
      `http://localhost:5000/api/projects/${projectId}/remove/${memberId}`,
      {},
      { headers: { Authorization: token } }
    );

    alert("Member removed");
    window.location.reload();
  };

  return (
    <div>
      <h2 className="section-title">All Projects</h2>

      {projects.map(p => (
        <div key={p._id} className="card">

          <h3>{p.title}</h3>
          <p style={{ color: "#666" }}>{p.description}</p>

          <p><b>Domain:</b> {p.domain}</p>
          <p><b>Created by:</b> {p.owner?.name || "Unknown"}</p>

          <p><b>Members:</b></p>
          <ul>
            {p.members?.map(m => (
              <li
                key={m._id}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                {m.name}

                {p.owner?._id === userId && (
                  <button
                    className="button-secondary"
                    onClick={() => handleRemove(p._id, m._id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>

          {/* ACTION BUTTON */}
          {(!p.owner || p.owner._id === userId) ? (
            <button
              className="button"
              onClick={() => handleDelete(p._id)}
            >
              Delete
            </button>
          ) : (
            <button
              className="button"
              onClick={() => handleJoin(p._id)}
            >
              Join
            </button>
          )}

        </div>
      ))}
    </div>
  );
}

export default Home;