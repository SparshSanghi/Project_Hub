import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Requests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  const fetchRequests = () => {
    axios.get('http://localhost:5000/api/projects/requests', {
      headers: { Authorization: token }
    }).then(res => setRequests(res.data));
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleApprove = async (id) => {
    await axios.post(
      `http://localhost:5000/api/projects/requests/${id}/approve`,
      {},
      { headers: { Authorization: token } }
    );
    fetchRequests();
  };

  const handleReject = async (id) => {
    await axios.post(
      `http://localhost:5000/api/projects/requests/${id}/reject`,
      {},
      { headers: { Authorization: token } }
    );
    fetchRequests();
  };

  return (
    <div>
      <h2 className="section-title">Requests</h2>

      {requests.length === 0 && <p>No pending requests</p>}

      {requests.map(r => (
        <div key={r._id} className="card">
          <p>
            <b>{r.user.name}</b> wants to join <b>{r.project.title}</b>
          </p>

          <button className="button" onClick={() => handleApprove(r._id)}>
            Approve
          </button>

          <button
            className="button-secondary"
            onClick={() => handleReject(r._id)}
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}

export default Requests;