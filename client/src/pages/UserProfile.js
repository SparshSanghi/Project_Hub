import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/auth/user/${userId}`)
      .then(res => setUser(res.data));
  }, [userId]);

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="section-title">User Profile</h2>

      <div className="card">

        <img
          src={user.image || "https://via.placeholder.com/80"}
          alt="profile"
          className="profile-img"
        />

        <h3>{user.name}</h3>

        <p><b>Department:</b> {user.department || "Not provided"}</p>
        <p>{user.bio || "No bio available"}</p>

      </div>
    </div>
  );
}

export default UserProfile;