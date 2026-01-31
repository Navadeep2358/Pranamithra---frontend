import './Home.css'

export default function Home() {
  return (
    <main className="home">
      <div className="home-container">

        <div className="home-left">
          <h1>
            Your Health, <span>Our Priority</span>
          </h1>

          <p className="subtitle">
            Pranamithra is a unified doctor appointment platform connecting
            patients with trusted healthcare professionals.
          </p>

          <ul className="features">
            <li>Book appointments across hospitals instantly</li>
            <li>Find trusted doctors in seconds</li>
            <li>AI-powered chatbot for health guidance</li>
            <li>Fast, secure, and real-time booking</li>
          </ul>
        </div>

        <div className="home-right">
          <img
            src="/doctor home page.png"
            alt="Doctor"
            className="doctor-img"
          />
        </div>

      </div>
    </main>
  )
}
