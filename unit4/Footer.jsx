import { useEffect, useState } from "react";
import { profile, socials } from "./data.js";
import Icon from "./icons.jsx";

function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const year = new Date().getFullYear();

  return (
    <>
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <a className="brand" href="#/home">
                <span className="brand-mark">D</span>
                Devasree<span style={{ color: "var(--accent)" }}>.</span>
              </a>
              <p>
                Computer Science Engineering student crafting creative,
                user-friendly digital experiences with modern technology.
              </p>
            </div>

            <div className="footer-col">
              <h4>Navigate</h4>
              <ul>
                <li><a href="#/home">Home</a></li>
                <li><a href="#/about">About</a></li>
                <li><a href="#/skills">Skills</a></li>
                <li><a href="#/projects">Projects</a></li>
                <li><a href="#/hobbies">Hobbies</a></li>
                <li><a href="#/contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Connect</h4>
              <ul>
                {socials.map((social) => (
                  <li key={social.name}>
                    <a
                      href={social.url}
                      target={social.url.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {year} {profile.name} · Built with React</span>
            <div className="footer-socials">
              {socials.slice(0, 3).map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target={social.url.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  aria-label={social.label}
                  title={social.label}
                >
                  <Icon name={social.icon} size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      <button
        className={`to-top ${showTop ? "visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </>
  );
}

export default Footer;