import "./HeartLoader.css";

export default function HeartLoader() {
  return (
    <div className="ecg-overlay">
      <div className="ecg-container">

        <svg viewBox="0 0 500 120" className="ecg-line">
          <polyline
            points="
            0,60 
            40,60 
            60,30 
            80,90 
            100,45 
            120,60
            180,60
            200,30
            220,90
            240,45
            260,60
            500,60"
          />
        </svg>

        <div className="ecg-text">
          Loading...
        </div>

      </div>
    </div>
  );
}