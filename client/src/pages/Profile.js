import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: token }
    }).then(res => setUser(res.data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="section-title">My Profile</h2>

      <div className="card">
        <p><b>Name:</b> {user.name}</p>
        <p><b>Email:</b> {user.email}</p>
      </div>
    </div>
  );
}   

export default Profile;