import { useEffect, useState } from "react";
import "./Profile.css";

export default function Profile({ goBack }) {
  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetch("http://localhost:3000/profile", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  const handleChange = e => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setData({ ...data, [e.target.name]: e.target.files[0] });
  };

  const saveProfile = async () => {
    const formData = new FormData();

    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });

    await fetch("http://localhost:3000/profile", {
      method: "PUT",
      credentials: "include",
      body: formData
    });

    alert("Profile Updated");
    setEditMode(false);
    window.location.reload();
  };

  return (
    <div className="profile-wrapper">

      {/* LEFT BLUE BOX */}
      <div className="profile-left">
        {data.role === "doctor" && data.doctor_image ? (
          <img
            src={`http://localhost:3000/uploads/${data.doctor_image}`}
            alt="Doctor"
            className="profile-image"
          />
        ) : (
          <div className="profile-avatar">
            {data.full_name?.charAt(0)}
          </div>
        )}

        <h3>{data.full_name}</h3>
        <p>{data.email}</p>
        <p>{data.phone}</p>

        {data.role === "doctor" && (
          <>
            <p><strong>Hospital:</strong> {data.hospital_name}</p>

            {data.hospital_image && (
              <img
                src={`http://localhost:3000/uploads/${data.hospital_image}`}
                alt="Hospital"
                className="hospital-image"
              />
            )}
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="profile-right">
        <div className="profile-header">
          <h2>Personal Information</h2>
          <button onClick={() => setEditMode(!editMode)}>
            {editMode ? "Save" : "Update"}
          </button>
        </div>

        <div className="profile-grid">

          <div>
            <label>Full Name</label>
            <input
              name="full_name"
              value={data.full_name || ""}
              disabled={!editMode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email (Permanent)</label>
            <input value={data.email || ""} disabled />
          </div>

          <div>
            <label>Phone</label>
            <input
              name="phone"
              value={data.phone || ""}
              disabled={!editMode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Age</label>
            <input
              name="age"
              value={data.age || ""}
              disabled={!editMode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>DOB</label>
            <input
              name="dob"
              value={data.dob?.split("T")[0] || ""}
              disabled={!editMode}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Gender</label>
            <input
              name="gender"
              value={data.gender || ""}
              disabled={!editMode}
              onChange={handleChange}
            />
          </div>

          <div className="full-width">
            <label>Address</label>
            <input
              name="address"
              value={data.address || ""}
              disabled={!editMode}
              onChange={handleChange}
            />
          </div>

          {/* DOCTOR EXTRA FIELDS */}
          {data.role === "doctor" && (
            <>
              <div>
                <label>Hospital Name</label>
                <input
                  name="hospital_name"
                  value={data.hospital_name || ""}
                  disabled={!editMode}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Specialization</label>
                <input
                  name="specialization"
                  value={data.specialization || ""}
                  disabled={!editMode}
                  onChange={handleChange}
                />
              </div>

              {editMode && (
                <>
                  <div>
                    <label>Doctor Image</label>
                    <input
                      type="file"
                      name="doctor_image"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div>
                    <label>Hospital Image</label>
                    <input
                      type="file"
                      name="hospital_image"
                      onChange={handleFileChange}
                    />
                  </div>
                </>
              )}
            </>
          )}

        </div>

        {editMode && (
          <button
            className="save-btn"
            onClick={saveProfile}
          >
            Save Changes
          </button>
        )}

        <button className="back-btn" onClick={goBack}>
          Back
        </button>
      </div>
    </div>
  );
}
