import { profile, facts, stats, journeyTimeline } from "../data.js";

function AboutPage() {
  return (
    <div className="about-section">
      <div className="section-header">
        <span className="section-subtitle">About me</span>
        <h2 className="section-title">Turning ideas into experience</h2>
        <div className="section-divider" />
      </div>

      <div className="about-intro-grid">
        <div className="about-photo-card">
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--gradient-soft)",
              display: "grid",
              placeItems: "center",
              fontSize: "110px"
            }}
          >
            ✨
          </div>
          <div className="about-photo-overlay">
            <div>
              <h3>{profile.name}</h3>
              <p>{profile.title}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="about-title-role">{profile.role}</h3>
          <p className="about-bio">
            I&apos;m a {profile.title.toLowerCase()} who loves building clean,
            accessible and delightful interfaces. My journey began with curiosity
            and has grown into a passion for full-stack web development — from
            Java and Python foundations to modern React-based applications.
          </p>

          <div className="facts-grid" style={{ marginTop: 22 }}>
            {facts.map((fact) => (
              <div className="fact-item" key={fact.label}>
                <span className="fact-label">{fact.label}</span>
                <span className="fact-value">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="about-container" style={{ marginTop: 40 }}>
        <div className="about-left">
          <div className="section-head">
            <h2>My journey</h2>
            <p>Milestones that shaped who I am today.</p>
          </div>

          <div className="timeline">
            {journeyTimeline.map((item) => (
              <div className="timeline-item" key={item.year}>
                <span className="timeline-year">{item.year}</span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="about-right">
          <div className="section-head">
            <h2>Vitals</h2>
            <p>Quick numbers about my experience.</p>
          </div>

          <div className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-item" key={stat.label}>
                <div className="stat-number">
                  {stat.value}
                  {stat.suffix}
                </div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="education-grid-right">
            <div className="edu-box-right degree">
              <div className="edu-header">
                <div className="edu-icon">🎓</div>
                <div>
                  <div className="edu-level">B.E.</div>
                  <div className="edu-title">Computer Science Engineering</div>
                </div>
              </div>
              <p className="edu-school">Engineering college, Chennai · 2023 — Present</p>
            </div>

            <div className="edu-box-right hsc">
              <div className="edu-header">
                <div className="edu-icon">📘</div>
                <div>
                  <div className="edu-level">HSC</div>
                  <div className="edu-title">Higher Secondary</div>
                </div>
              </div>
              <p className="edu-school">Computer Science group · 2023</p>
            </div>
          </div>

          <div className="card vision-card">
            <div className="edu-level">Vision</div>
            <h4 style={{ marginTop: 6 }}>Keep building, keep learning.</h4>
            <p className="about-bio">
              I believe the best products come from empathy, iteration and a
              willingness to always stay curious.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;