import { useEffect, useState } from "react";
import "./AdminHome.css";

export default function AdminHome() {
  const [page, setPage] = useState(
    localStorage.getItem("adminPage") || "home"
  );

  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [dbData, setDbData] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  /* ================= PAGE CHANGE ================= */
  const changePage = (p) => {
    localStorage.setItem("adminPage", p);
    setPage(p);
    setSearch("");
    setSort("");
    window.scrollTo(0, 0);
  };

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (page === "verify") {
      fetch("http://localhost:3000/admin/doctors/pending", {
        credentials: "include",
      })
        .then((r) => r.json())
        .then(setPendingDoctors);
    }

    if (page === "doctors") {
      fetch("http://localhost:3000/admin/doctors", {
        credentials: "include",
      })
        .then((r) => r.json())
        .then(setDbData);
    }

    if (page === "customers") {
      fetch("http://localhost:3000/admin/customers", {
        credentials: "include",
      })
        .then((r) => r.json())
        .then(setDbData);
    }
  }, [page]);

  /* ================= LOCK SCROLL WHEN MODAL ================= */
  useEffect(() => {
    document.body.style.overflow = selectedDoctor ? "hidden" : "auto";
  }, [selectedDoctor]);

  /* ================= FILTER + SORT ================= */
  const filteredData = dbData
    .filter((d) =>
      JSON.stringify(d).toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sort) return 0;
      return (a[sort] || "")
        .toString()
        .localeCompare((b[sort] || "").toString());
    });

  return (
    <div className="admin-container">
      {/* ================= HERO ================= */}
      <div className="admin-hero">
        <div className="admin-hero-text">
          <div className="welcome-text">WELCOME</div>
          <div className="admin-text">ADMIN</div>
        </div>
      </div>

      {/* ================= HOME ================= */}
      {page === "home" && (
        <>
          <h3 className="services-heading">Services</h3>

          <div className="services-grid">
            <div className="service-box" onClick={() => changePage("verify")}>
              Verify Doctor
            </div>
            <div className="service-box" onClick={() => changePage("doctors")}>
              Doctor Database
            </div>
            <div className="service-box" onClick={() => changePage("customers")}>
              Customer Database
            </div>
            <div className="service-box">Chatbot Queries</div>
          </div>

          <div className="feedback-box">
            <p>Feedback from customers and doctors will appear here.</p>
          </div>
        </>
      )}

      {/* ================= VERIFY PAGE ================= */}
      {page === "verify" && (
        <div className="verify-page">
          <div className="verify-header">
            <h1>Doctors Under Verification</h1>
            <button onClick={() => changePage("home")}>← Back</button>
          </div>

          {pendingDoctors.map((doc) => (
            <div key={doc.id} className="verify-card">
              <span>{doc.full_name}</span>
              <button
                onClick={async () => {
                  const res = await fetch(
                    `http://localhost:3000/admin/doctors/${doc.id}`,
                    { credentials: "include" }
                  );
                  setSelectedDoctor(await res.json());
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= DOCTOR DATABASE ================= */}
      {page === "doctors" && (
        <div className="db-page">
          <div className="verify-header">
            <h1>Doctor Database</h1>
            <button onClick={() => changePage("home")}>← Back</button>
          </div>

          <div className="db-controls">
            <input
              className="db-search"
              placeholder="Search doctor / hospital / specialization"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="db-sort"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="hospital_name">Hospital</option>
              <option value="specialization">Specialization</option>
            </select>
          </div>

          <table className="db-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Hospital</th>
                <th>Specialization</th>
                <th>Status</th>
                <th>Doctor Image</th>
                <th>Hospital Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((d) => (
                <tr key={d.id}>
                  <td>{d.full_name}</td>
                  <td>{d.email}</td>
                  <td>{d.phone}</td>
                  <td>{d.hospital_name}</td>
                  <td>{d.specialization}</td>
                  <td>{d.status}</td>
                  <td>
                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:3000/uploads/${d.doctor_image}`,
                          "_blank"
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        window.open(
                          `http://localhost:3000/uploads/${d.hospital_image}`,
                          "_blank"
                        )
                      }
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= CUSTOMER DATABASE ================= */}
      {page === "customers" && (
        <div className="db-page">
          <div className="verify-header">
            <h1>Customer Database</h1>
            <button onClick={() => changePage("home")}>← Back</button>
          </div>

          <div className="db-controls">
            <input
              className="db-search"
              placeholder="Search customer / address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="db-sort"
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="age">Age</option>
              <option value="gender">Gender</option>
            </select>
          </div>

          <table className="db-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((c) => (
                <tr key={c.id}>
                  <td>{c.full_name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.age}</td>
                  <td>{c.gender}</td>
                  <td>{c.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-box animate-pop">
            <div className="modal-image-wrap">
              <img
                src={`http://localhost:3000/uploads/${selectedDoctor.doctor_image}`}
                alt="Doctor"
              />
            </div>

            <div className="modal-details">
              <div className="detail-row">
                <span>Name</span>
                <p>{selectedDoctor.full_name}</p>
              </div>
              <div className="detail-row">
                <span>Email</span>
                <p>{selectedDoctor.email}</p>
              </div>
              <div className="detail-row">
                <span>Phone</span>
                <p>{selectedDoctor.phone}</p>
              </div>
              <div className="detail-row">
                <span>Hospital</span>
                <p>{selectedDoctor.hospital_name}</p>
              </div>
              <div className="detail-row">
                <span>Specialization</span>
                <p>{selectedDoctor.specialization}</p>
              </div>

              <button
                className="hospital-link"
                onClick={() =>
                  window.open(
                    `http://localhost:3000/uploads/${selectedDoctor.hospital_image}`,
                    "_blank"
                  )
                }
              >
                View Hospital Image
              </button>
            </div>

            <div className="modal-actions">
  <button
    className="verify-btn"
    onClick={async () => {
      await fetch(
        `http://localhost:3000/admin/doctors/verify/${selectedDoctor.id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      setSelectedDoctor(null);
      setPendingDoctors((prev) =>
        prev.filter((d) => d.id !== selectedDoctor.id)
      );
    }}
  >
    Verify Doctor
  </button>

  <button
    className="reject-btn"
    onClick={async () => {
      await fetch(
        `http://localhost:3000/admin/doctors/reject/${selectedDoctor.id}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      setSelectedDoctor(null);
      setPendingDoctors((prev) =>
        prev.filter((d) => d.id !== selectedDoctor.id)
      );
    }}
  >
    Reject Doctor
  </button>
</div>


            <button className="close-btn" onClick={() => setSelectedDoctor(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
