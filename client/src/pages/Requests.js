import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Requests() {
  const [requests, setRequests] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects/requests', {
      headers: { Authorization: token }
    }).then(res => setRequests(res.data));
  }, []);

  // ACCEPT
  const handleAccept = async (id) => {
    await axios.post(
      `http://localhost:5000/api/projects/request/${id}/accept`,
      {},
      { headers: { Authorization: token } }
    );

    alert("Request accepted");
    window.location.reload();
  };

  // REJECT
  const handleReject = async (id) => {
    await axios.post(
      `http://localhost:5000/api/projects/request/${id}/reject`,
      {},
      { headers: { Authorization: token } }
    );

    alert("Request rejected");
    window.location.reload();
  };

  return (
    <div>
      <h2>Join Requests</h2>

      {requests.length === 0 && <p>No pending requests</p>}

      {requests.map(r => (
        <div key={r._id} style={{
          border: "1px solid #ccc",
          padding: "10px",
          margin: "10px",
          borderRadius: "8px"
        }}>
          <p><b>User:</b> {r.user.name}</p>
          <p><b>Project:</b> {r.project.title}</p>

          <button onClick={() => handleAccept(r._id)}>
            Accept
          </button>

          <button onClick={() => handleReject(r._id)} style={{ marginLeft: "10px" }}>
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default Requests;