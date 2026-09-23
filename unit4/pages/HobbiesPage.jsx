import { hobbies } from "../data.js";

function HobbiesPage() {
  return (
    <div>
      <div className="section-header">
        <span className="section-subtitle">Hobbies</span>
        <h2 className="section-title">Life outside the terminal</h2>
        <div className="section-divider" />
      </div>

      <div className="hobby-grid">
        {hobbies.map((hobby) => (
          <div
            className="hobby-card"
            key={hobby.title}
            style={{ "--c": hobby.color }}
          >
            <div className="hobby-img-wrapper">
              <img
                className="hobby-img"
                src={hobby.image}
                alt={hobby.title}
                loading="lazy"
              />
            </div>
            <div className="hobby-body">
              <span className="hobby-emoji">{hobby.emoji}</span>
              <h3>{hobby.title}</h3>
              <p>{hobby.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HobbiesPage;