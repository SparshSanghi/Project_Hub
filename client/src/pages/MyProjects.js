import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyProjects() {
  const [projects, setProjects] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects/my', {
      headers: { Authorization: token }
    })
    .then(res => setProjects(res.data))
    .catch(err => {
      console.error(err);
      alert("Failed to load your projects");
    });
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/projects/${id}`,
        { headers: { Authorization: token } }
      );

      setProjects(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h2 className="section-title">My Projects</h2>

      {projects.length === 0 && <p>No projects created yet.</p>}

      {projects.map(p => (
        <div key={p._id} className="card">
          <h3>{p.title}</h3>
          <p>{p.description}</p>
          <p><b>{p.domain}</b></p>

          <button
            className="button"
            onClick={() => handleDelete(p._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default MyProjects;