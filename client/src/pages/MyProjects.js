import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyProjects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get('http://localhost:5000/api/projects/my', {
      headers: { Authorization: token }
    }).then(res => setProjects(res.data));
  }, []);

  return (
    <div>
      <h2>My Projects</h2>

      {projects.map(p => (
        <div key={p._id}>
          <h3>{p.title}</h3>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}

export default MyProjects;