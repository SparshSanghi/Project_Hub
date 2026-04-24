import React, { useState } from 'react';
import axios from 'axios';

function CreateProject() {
  const [data, setData] = useState({
    title: '',
    description: '',
    domain: ''
  });

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    await axios.post(
      'http://localhost:5000/api/projects',
      data,
      {
        headers: { Authorization: token }
      }
    );

    alert("Project Created");
    window.location.reload();
  };

  return (
    <div>
      <h2 className="section-title">Create Project</h2>

      <div className="card">

        <input
          className="input"
          placeholder="Title"
          onChange={e => setData({ ...data, title: e.target.value })}
        />

        <input
          className="input"
          placeholder="Domain"
          onChange={e => setData({ ...data, domain: e.target.value })}
        />

        <textarea
          className="input"
          placeholder="Description"
          onChange={e => setData({ ...data, description: e.target.value })}
        />

        <button className="button" onClick={handleSubmit}>
          Create Project
        </button>

      </div>
    </div>
  );
}

export default CreateProject;