import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProjectDetails({ projectId }) {
  const [project, setProject] = useState(null);

  

  useEffect(() => {
    axios.get(`http://localhost:5000/api/projects/${projectId}`)
      .then(res => setProject(res.data));
  }, [projectId]);

  if (!project) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="section-title">Project Details</h2>

      <div className="card">
        <h2>{project.title}</h2>
        <p>{project.description}</p>

        <p><b>Domain:</b> {project.domain}</p>
        <p><b>Owner:</b> {project.owner?.name}</p>

        <h4>Members:</h4>
        <ul>
          {project.members.map(m => (
            <li key={m._id}>{m.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProjectDetails;