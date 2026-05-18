import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Profile() {
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showImage, setShowImage] = useState(false);

  const [form, setForm] = useState({
    department: '',
    bio: '',
    image: ''
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get('http://localhost:5000/api/auth/profile', {
      headers: { Authorization: token }
    }).then(res => {
      setUser(res.data);
      setForm({
        department: res.data.department || '',
        bio: res.data.bio || '',
        image: res.data.image || ''
      });
    });
  }, [token]);

  // 📁 IMAGE PREVIEW BEFORE SAVE
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result); // preview
      setForm({ ...form, image: reader.result }); // ready to save
    };

    if (file) reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    await axios.put(
      'http://localhost:5000/api/auth/profile',
      form,
      { headers: { Authorization: token } }
    );

    setUser(form);
    setEdit(false);
    setPreview(null);
    alert("Profile updated");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="section-title">My Profile</h2>

      <div className="card">

        {/* IMAGE (CLICK TO ENLARGE) */}
        <img
          src={preview || form.image || "https://via.placeholder.com/80"}
          alt="profile"
          className="profile-img"
          onClick={() => setShowImage(true)}
          style={{ cursor: "pointer" }}
        />

        <h3>{user.name}</h3>
        <p>{user.email}</p>

        {edit ? (
          <>
            {/* FILE INPUT */}
            <input type="file" onChange={handleImageUpload} />

            {preview && (
              <p style={{ fontSize: "12px", color: "#777" }}>
                Preview before saving
              </p>
            )}

            <input
              className="input"
              placeholder="Department"
              value={form.department}
              onChange={e => setForm({ ...form, department: e.target.value })}
            />

            <textarea
              className="input"
              placeholder="Bio"
              value={form.bio}
              onChange={e => setForm({ ...form, bio: e.target.value })}
            />

            <button className="button" onClick={handleUpdate}>
              Save Profile
            </button>
          </>
        ) : (
          <>
            <p><b>Department:</b> {user.department || "Not added"}</p>
            <p>{user.bio || "No bio added"}</p>

            <button className="button-secondary" onClick={() => setEdit(true)}>
              Edit Profile
            </button>
          </>
        )}

      </div>

      {/* 🔍 IMAGE MODAL */}
      {showImage && (
        <div
          onClick={() => setShowImage(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img
            src={preview || form.image}
            alt=""
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px"
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Profile;