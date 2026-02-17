import { useState } from "react";
import "./FindDoctor.css";

export default function FindDoctor({ goBack }) {
  const [selectedSpec, setSelectedSpec] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const doctors = [

    /* ================= CARDIOLOGY ================= */
    { id: 1, name: "Dr. Aarav Mehta", specialization: "Cardiology", experience: 12, hospital: "City Heart Care", image: "https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg" },
    { id: 2, name: "Dr. Vikram Iyer", specialization: "Cardiology", experience: 15, hospital: "Pulse Cardiac Center", image: "https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg" },
    { id: 3, name: "Dr. Rohan Patel", specialization: "Cardiology", experience: 18, hospital: "Metro Heart Clinic", image: "https://images.pexels.com/photos/8376153/pexels-photo-8376153.jpeg" },
    { id: 4, name: "Dr. Amit Shah", specialization: "Cardiology", experience: 10, hospital: "Elite Cardio Care", image: "https://images.pexels.com/photos/8460156/pexels-photo-8460156.jpeg" },
    { id: 5, name: "Dr. Sandeep Rao", specialization: "Cardiology", experience: 9, hospital: "HeartPlus Hospital", image: "https://images.pexels.com/photos/6129047/pexels-photo-6129047.jpeg" },

    /* ================= DERMATOLOGY ================= */
    { id: 6, name: "Dr. Nisha Rao", specialization: "Dermatology", experience: 8, hospital: "Skin & Glow Clinic", image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg" },
    { id: 7, name: "Dr. Meera Joshi", specialization: "Dermatology", experience: 10, hospital: "Dermacare Hospital", image: "https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg" },
    { id: 8, name: "Dr. Kavita Sharma", specialization: "Dermatology", experience: 6, hospital: "ClearSkin Center", image: "https://images.pexels.com/photos/8460099/pexels-photo-8460099.jpeg" },
    { id: 9, name: "Dr. Anjali Desai", specialization: "Dermatology", experience: 9, hospital: "Skin Science Clinic", image: "https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg" },
    { id: 10, name: "Dr. Riya Kapoor", specialization: "Dermatology", experience: 7, hospital: "Glow Medical", image: "https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg" },

    /* ================= ORTHOPEDICS ================= */
    { id: 11, name: "Dr. Rahul Verma", specialization: "Orthopedics", experience: 15, hospital: "OrthoPlus Hospital", image: "https://images.pexels.com/photos/6129045/pexels-photo-6129045.jpeg" },
    { id: 12, name: "Dr. Arjun Nair", specialization: "Orthopedics", experience: 13, hospital: "Bone & Joint Center", image: "https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg" },
    { id: 13, name: "Dr. Karan Malhotra", specialization: "Orthopedics", experience: 17, hospital: "Spine Care Hospital", image: "https://images.pexels.com/photos/6129498/pexels-photo-6129498.jpeg" },
    { id: 14, name: "Dr. Sanjay Kumar", specialization: "Orthopedics", experience: 20, hospital: "Metro Ortho Clinic", image: "https://images.pexels.com/photos/8376293/pexels-photo-8376293.jpeg" },
    { id: 15, name: "Dr. Vivek Reddy", specialization: "Orthopedics", experience: 12, hospital: "Joint Relief Center", image: "https://images.pexels.com/photos/6129046/pexels-photo-6129046.jpeg" },

    /* ================= NEUROLOGY ================= */
    { id: 16, name: "Dr. Kavya Sharma", specialization: "Neurology", experience: 10, hospital: "NeuroCare Center", image: "https://images.pexels.com/photos/6129052/pexels-photo-6129052.jpeg" },
    { id: 17, name: "Dr. Anil Gupta", specialization: "Neurology", experience: 14, hospital: "Brain & Spine Institute", image: "https://images.pexels.com/photos/6129499/pexels-photo-6129499.jpeg" },
    { id: 18, name: "Dr. Rohit Menon", specialization: "Neurology", experience: 11, hospital: "Neuro Health Clinic", image: "https://images.pexels.com/photos/8460376/pexels-photo-8460376.jpeg" },
    { id: 19, name: "Dr. Priya Iyer", specialization: "Neurology", experience: 9, hospital: "Advanced Neuro Center", image: "https://images.pexels.com/photos/8460100/pexels-photo-8460100.jpeg" },
    { id: 20, name: "Dr. Sneha Patel", specialization: "Neurology", experience: 13, hospital: "NeuroPlus Hospital", image: "https://images.pexels.com/photos/6129048/pexels-photo-6129048.jpeg" },

    /* ================= PEDIATRICS ================= */
    { id: 21, name: "Dr. Ananya Iyer", specialization: "Pediatrics", experience: 11, hospital: "Little Care Hospital", image: "https://images.pexels.com/photos/8460375/pexels-photo-8460375.jpeg" },
    { id: 22, name: "Dr. Rohini Patel", specialization: "Pediatrics", experience: 9, hospital: "Child Health Center", image: "https://images.pexels.com/photos/6129036/pexels-photo-6129036.jpeg" },
    { id: 23, name: "Dr. Kunal Mehta", specialization: "Pediatrics", experience: 13, hospital: "Kids Wellness Clinic", image: "https://images.pexels.com/photos/6129500/pexels-photo-6129500.jpeg" },
    { id: 24, name: "Dr. Priyansh Verma", specialization: "Pediatrics", experience: 7, hospital: "Happy Kids Hospital", image: "https://images.pexels.com/photos/8460374/pexels-photo-8460374.jpeg" },
    { id: 25, name: "Dr. Sneha Nair", specialization: "Pediatrics", experience: 10, hospital: "Care4Children", image: "https://images.pexels.com/photos/6129504/pexels-photo-6129504.jpeg" },

    /* ================= GYNECOLOGY ================= */
    { id: 26, name: "Dr. Kavitha Reddy", specialization: "Gynecology", experience: 14, hospital: "Women Care Hospital", image: "https://images.pexels.com/photos/8376287/pexels-photo-8376287.jpeg" },
    { id: 27, name: "Dr. Shalini Gupta", specialization: "Gynecology", experience: 12, hospital: "Mother & Child Clinic", image: "https://images.pexels.com/photos/6129496/pexels-photo-6129496.jpeg" },
    { id: 28, name: "Dr. Riya Menon", specialization: "Gynecology", experience: 8, hospital: "LifeCare Women Center", image: "https://images.pexels.com/photos/8460373/pexels-photo-8460373.jpeg" },
    { id: 29, name: "Dr. Neha Sharma", specialization: "Gynecology", experience: 16, hospital: "Elite Women Hospital", image: "https://images.pexels.com/photos/6129494/pexels-photo-6129494.jpeg" },
    { id: 30, name: "Dr. Pooja Iyer", specialization: "Gynecology", experience: 9, hospital: "Harmony Clinic", image: "https://images.pexels.com/photos/6129495/pexels-photo-6129495.jpeg" },

    /* ================= ENT ================= */
    { id: 31, name: "Dr. Arvind Kumar", specialization: "ENT", experience: 15, hospital: "Clear Voice Clinic", image: "https://images.pexels.com/photos/6129050/pexels-photo-6129050.jpeg" },
    { id: 32, name: "Dr. Meera Shah", specialization: "ENT", experience: 10, hospital: "Ear Nose Throat Center", image: "https://images.pexels.com/photos/8460372/pexels-photo-8460372.jpeg" },
    { id: 33, name: "Dr. Sagar Reddy", specialization: "ENT", experience: 12, hospital: "Metro ENT Hospital", image: "https://images.pexels.com/photos/6129492/pexels-photo-6129492.jpeg" },
    { id: 34, name: "Dr. Ishita Rao", specialization: "ENT", experience: 7, hospital: "Voice & Hearing Clinic", image: "https://images.pexels.com/photos/8460371/pexels-photo-8460371.jpeg" },
    { id: 35, name: "Dr. Prakash Nair", specialization: "ENT", experience: 18, hospital: "Advanced ENT Care", image: "https://images.pexels.com/photos/6129043/pexels-photo-6129043.jpeg" },

    /* ================= ONCOLOGY ================= */
    { id: 36, name: "Dr. Ramesh Iyer", specialization: "Oncology", experience: 20, hospital: "Cancer Care Institute", image: "https://images.pexels.com/photos/6129041/pexels-photo-6129041.jpeg" },
    { id: 37, name: "Dr. Shweta Kapoor", specialization: "Oncology", experience: 14, hospital: "Hope Oncology Center", image: "https://images.pexels.com/photos/8460370/pexels-photo-8460370.jpeg" },
    { id: 38, name: "Dr. Anil Verma", specialization: "Oncology", experience: 17, hospital: "Life Cancer Hospital", image: "https://images.pexels.com/photos/6129491/pexels-photo-6129491.jpeg" },
    { id: 39, name: "Dr. Rohini Menon", specialization: "Oncology", experience: 11, hospital: "OncoPlus Clinic", image: "https://images.pexels.com/photos/6129040/pexels-photo-6129040.jpeg" },
    { id: 40, name: "Dr. Nikhil Sharma", specialization: "Oncology", experience: 19, hospital: "Advanced Cancer Care", image: "https://images.pexels.com/photos/8460369/pexels-photo-8460369.jpeg" },

    /* ================= PSYCHIATRY ================= */
    { id: 41, name: "Dr. Aditi Rao", specialization: "Psychiatry", experience: 12, hospital: "Mind Wellness Center", image: "https://images.pexels.com/photos/6129039/pexels-photo-6129039.jpeg" },
    { id: 42, name: "Dr. Manish Kapoor", specialization: "Psychiatry", experience: 15, hospital: "Mental Health Clinic", image: "https://images.pexels.com/photos/8460368/pexels-photo-8460368.jpeg" },
    { id: 43, name: "Dr. Neha Verma", specialization: "Psychiatry", experience: 9, hospital: "Harmony Mind Center", image: "https://images.pexels.com/photos/6129038/pexels-photo-6129038.jpeg" },
    { id: 44, name: "Dr. Arjun Desai", specialization: "Psychiatry", experience: 14, hospital: "Brain Balance Hospital", image: "https://images.pexels.com/photos/8460367/pexels-photo-8460367.jpeg" },
    { id: 45, name: "Dr. Poonam Iyer", specialization: "Psychiatry", experience: 10, hospital: "CareMind Clinic", image: "https://images.pexels.com/photos/6129037/pexels-photo-6129037.jpeg" }
  ];

  const specializations = [
    "All",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Neurology",
    "Pediatrics",
    "Gynecology",
    "ENT",
    "Oncology",
    "Psychiatry"
  ];

  const filteredDoctors = doctors.filter(doc => {
    const matchSpec = selectedSpec === "All" || doc.specialization === selectedSpec;
    const matchSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSpec && matchSearch;
  });

  return (
    <div className="fd-container">
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
        <div className="fd-sidebar">
          <h3>Specializations</h3>
          <ul>
            {specializations.map((spec, index) => (
              <li
                key={index}
                className={selectedSpec === spec ? "active-spec" : ""}
                onClick={() => setSelectedSpec(spec)}
              >
                {spec}
              </li>
            ))}
          </ul>
        </div>

        <div className="fd-doctor-list">
          {filteredDoctors.map(doc => (
            <div className="fd-card" key={doc.id}>
              <div className="fd-image">
                <img src={doc.image} alt={doc.name} />
              </div>
              <div className="fd-info">
                <h2>{doc.name}</h2>
                <p className="fd-specialization">{doc.specialization}</p>
                <p>{doc.experience}+ Years Experience</p>
                <p className="fd-hospital">{doc.hospital}</p>
                <button className="fd-book-btn">Book Appointment</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fd-back">
        <button onClick={goBack}>← Back to Dashboard</button>
      </div>
    </div>
  );
}


