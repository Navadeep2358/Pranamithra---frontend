import { useEffect, useState } from "react";
import "./FindDoctor.css";

export default function FindDoctor({ goBack }) {

  const [doctors, setDoctors] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DOCTORS ================= */
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/customer/doctors",
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          setDoctors(data);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  /* ================= SPECIALIZATION LIST ================= */
  const allSpecializations = [
    { value: "all", label: "All" },
    { value: "cardiology", label: "Cardiology" },
    { value: "ent", label: "ENT" },
    { value: "neurology", label: "Neurology" },
    { value: "dentist", label: "Dentist" },
    { value: "general", label: "General Physician" },
    { value: "orthopedics", label: "Orthopedics" },
    { value: "dermatology", label: "Dermatology" },
    { value: "pediatrics", label: "Pediatrics" },
    { value: "gynecology", label: "Gynecology" },
    { value: "psychiatry", label: "Psychiatry" },
    { value: "urology", label: "Urology" },
    { value: "oncology", label: "Oncology" },
    { value: "gastroenterology", label: "Gastroenterology" },
    { value: "nephrology", label: "Nephrology" },
    { value: "pulmonology", label: "Pulmonology" },
    { value: "radiology", label: "Radiology" },
    { value: "anesthesiology", label: "Anesthesiology" },
    { value: "endocrinology", label: "Endocrinology" },
    { value: "ophthalmology", label: "Ophthalmology" },
    { value: "plastic_surgery", label: "Plastic Surgery" }
  ];

  /* ================= FILTER LOGIC ================= */
  const filteredDoctors = doctors.filter(doc => {

    const docSpec = doc.specialization?.toLowerCase();

    const matchSpec =
      selectedSpec === "all" ||
      docSpec === selectedSpec;

    const matchSearch =
      doc.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      docSpec?.includes(searchTerm.toLowerCase());

    return matchSpec && matchSearch;
  });

  return (
    <div className="fd-container">

      {/* HEADER */}
      <div className="fd-header">
        <h1>Find Your Specialist</h1>

        <input
          placeholder="Search doctor or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="fd-search-input"
        />
      </div>

      <div className="fd-content">

        {/* SIDEBAR */}
        <div className="fd-sidebar">
          <h3>Specializations</h3>
          <ul>
            {allSpecializations.map((spec, index) => (
              <li
                key={index}
                className={selectedSpec === spec.value ? "active-spec" : ""}
                onClick={() => setSelectedSpec(spec.value)}
              >
                {spec.label}
              </li>
            ))}
          </ul>
        </div>

        {/* DOCTOR LIST */}
        <div className="fd-doctor-list">

          {loading && <p>Loading doctors...</p>}

          {!loading && filteredDoctors.length === 0 && (
            <div className="no-doctor-message">
              <h3>
                Sorry, doctors are not available for this specialization today.
              </h3>
              <p>
                Please come back next day or contact customer care.
              </p>
            </div>
          )}

          {filteredDoctors.map(doc => (
            <div className="fd-card" key={doc.id}>

              {/* LEFT IMAGE */}
              <div className="fd-left">
                <img
                  src={
                    doc.doctor_image
                      ? `http://localhost:3000/uploads/${doc.doctor_image}`
                      : "https://via.placeholder.com/140"
                  }
                  alt={doc.full_name}
                />
              </div>

              {/* CENTER INFO */}
              <div className="fd-center">
                <h2>{doc.full_name}</h2>

                <p className="fd-specialization">
                  {doc.specialization?.toUpperCase()}
                </p>

                <p>{doc.experience}+ Years Experience</p>
                <p className="fd-hospital">{doc.hospital_name}</p>
              </div>

              {/* RIGHT BUTTON */}
              <div className="fd-right">
                <button className="fd-book-btn">
                  Book Appointment
                </button>
              </div>

            </div>
          ))}

        </div>
      </div>

      {/* BACK BUTTON */}
      <div className="fd-back">
        <button onClick={goBack}>
          ← Back to Dashboard
        </button>
      </div>

    </div>
  );
}
