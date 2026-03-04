import { useEffect, useState } from "react";
import "./Profile.css";

/* ===== LOCALHOST BACKEND ===== */
const API = "http://localhost:3000";

export default function Profile({ goBack, setActionLoading }) {

  const [data, setData] = useState({});
  const [editMode, setEditMode] = useState(false);

  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [popup, setPopup] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const showPopup = (message, type) => {
    setPopup({ message, type });
    setFadeOut(false);

    setTimeout(() => setFadeOut(true), 4200);
    setTimeout(() => {
      setPopup(null);
      setFadeOut(false);
    }, 5000);
  };

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    fetch(`${API}/profile`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.files[0] });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  /* ================= SAVE PROFILE ================= */

  const saveProfile = async () => {

    setActionLoading(true);

    try {

      if (data.role === "customer") {

        await fetch(`${API}/profile`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data)
        });

      } else if (data.role === "doctor") {

        const formData = new FormData();
        Object.keys(data).forEach(key => {
          formData.append(key, data[key]);
        });

        await fetch(`${API}/profile`, {
          method: "PUT",
          credentials: "include",
          body: formData
        });
      }

      showPopup("Profile Updated Successfully", "success");
      setEditMode(false);

      const res = await fetch(`${API}/profile`, {
        credentials: "include"
      });

      const updated = await res.json();
      setData(updated);

    } catch {
      showPopup("Profile Update Failed", "error");
    }

    setTimeout(() => {
  setActionLoading(false);
}, 3000);
  };


  /* ================= CHANGE PASSWORD ================= */

  const changePassword = async () => {

    setActionLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showPopup("New passwords do not match", "error");
      return;
    }

    try {

      const res = await fetch(`${API}/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const message = await res.text();

      if (res.ok) {

        showPopup(message || "Password Updated Successfully", "success");

        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });

        setShowPasswordBox(false);

      } else {
        showPopup(message || "Password Update Failed", "error");
      }

    } catch {
      showPopup("Server Error", "error");
    }

    setTimeout(() => {
  setActionLoading(false);
}, 3000);
  };

  return (
    <div className="profile-wrapper">

      {popup && (
        <div className={`profile-toast ${popup.type} ${fadeOut ? "fade-out" : ""}`}>
          {popup.message}
        </div>
      )}

      <div className="profile-left">

        {data.doctor_image ? (
          <img
            src={`${API}/uploads/${data.doctor_image}`}
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
            <p><strong>Hospital Address:</strong> {data.hospital_address}</p>
            <p><strong>Experience:</strong> {data.experience || 0} Years</p>

            {data.hospital_image && (
              <img
                src={`${API}/uploads/${data.hospital_image}`}
                alt="Hospital"
                className="hospital-image"
              />
            )}
          </>
        )}
      </div>

      <div className="profile-right">

        <div className="profile-header">
          <h2>Personal Information</h2>
          <button onClick={() => editMode ? saveProfile() : setEditMode(true)}>
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

          {data.role === "customer" && (
            <>
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
                  type="date"
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
            </>
          )}

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

              <div className="full-width">
                <label>Hospital Address</label>
                <input
                  name="hospital_address"
                  value={data.hospital_address || ""}
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

              <div>
                <label>Experience (Years)</label>
                <input
                  type="number"
                  name="experience"
                  value={data.experience || ""}
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

        <button
          className="password-btn"
          onClick={() => setShowPasswordBox(!showPasswordBox)}
        >
          Change Password
        </button>

        {showPasswordBox && (
          <form className="password-box" autoComplete="off">

            <input type="text" style={{ display: "none" }} />
            <input type="password" style={{ display: "none" }} />

            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              autoComplete="new-password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              autoComplete="new-password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              autoComplete="new-password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
            />

            <button type="button" onClick={changePassword}>
              Update Password
            </button>

          </form>
        )}

        <button className="back-btn" onClick={goBack}>
          Back
        </button>

      </div>
    </div>
  );
}