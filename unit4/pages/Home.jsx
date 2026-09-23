import { profile, marqueeTech, stats, hobbies, facts } from "../data.js";
import { useCountUp, useReveal, useTypewriter } from "../hooks.js";
import Icon from "../icons.jsx";

function Stat({ stat }) {
  const { ref, value } = useCountUp(stat.value);
  return (
    <div className="stat-card">
      <div className="stat-value" ref={ref}>
        {value}
        {stat.suffix}
      </div>
      <div className="stat-label">{stat.label}</div>
    </div>
  );
}

function Home({ navigate }) {
  const typed = useTypewriter(profile.roles);
  const revealRef = useReveal();

  return (
    <>
      <section className="hero">
        <div className="hero-left">
          <p className="hero-hello">
            <span className="dot" />
            Hi, I&apos;m {profile.name}
          </p>

          <h1>
            Devasree<span className="gradient-text">.</span>
          </h1>

          <p className="hero-role">
            {typed}
            <span className="caret" />
          </p>

          <p className="hero-desc">
            {profile.title} based in {profile.location}. I craft creative,
            user-friendly digital experiences with modern web technology.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick={() => navigate("projects")}>
              View my work
              <Icon name="arrow" size={16} />
            </button>
            <button className="btn btn-ghost" onClick={() => navigate("contact")}>
              Get in touch
            </button>
          </div>

          <div className="hero-socials">
            {["github", "linkedin", "instagram", "mail"].map((name) => (
              <a key={name} className="social-link" href="#/home" aria-label={name}>
                <Icon name={name} size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="hero-visual">
          <div className="portrait-wrap">
            <div className="portrait-ring" />
            <div
              className="portrait-img"
              style={{
                background: "var(--gradient-soft)",
                display: "grid",
                placeItems: "center",
                fontSize: "96px"
              }}
            >
              <span>👩‍💻</span>
            </div>
            <div className="portrait-tag tag-1">⚛️ React Developer</div>
            <div className="portrait-tag tag-2">📍 {facts[1]?.value || profile.location}</div>
            <div className="portrait-tag tag-3">🎨 UI/UX</div>
          </div>
        </div>
      </section>

      <div className="marquee" ref={revealRef}>
        <div className="marquee-track reveal">
          {[...marqueeTech, ...marqueeTech].map((tech, index) => (
            <span key={index}>{tech}</span>
          ))}
        </div>
      </div>

      <section className="section">
        <div className="section-head">
          <h2>At a glance</h2>
          <p>Numbers that summarise my journey so far.</p>
        </div>
        <div className="stats-grid">
          {stats.map((stat) => (
            <Stat key={stat.label} stat={stat} />
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Beyond the code</h2>
          <p>A few things I love doing in my spare time.</p>
        </div>
        <div className="hobby-grid" ref={revealRef}>
          {hobbies.map((hobby) => (
            <div className="hobby-card reveal" key={hobby.title} style={{ "--c": hobby.color }}>
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
      </section>

      <section className="cta-banner">
        <h2>Have an idea in mind?</h2>
        <p>
          I&apos;m always open to new opportunities, collaborations and projects.
        </p>
        <button className="btn btn-primary" onClick={() => navigate("contact")}>
          Let&apos;s talk
        </button>
      </section>
    </>
  );
}

export default Home;