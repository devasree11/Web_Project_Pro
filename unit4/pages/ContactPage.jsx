import { useState } from "react";
import { profile, socials } from "../data.js";
import Icon from "../icons.jsx";
import Formvalidation from "../Formvalidation.jsx";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setStatus(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setStatus({ type: "error", text: "Please fill in all fields." });
      return;
    }
    setStatus({
      type: "success",
      text: "Thanks for reaching out — I'll get back to you soon!"
    });
  };

  const rows = [
    { icon: "📧", label: "Email", value: profile.email },
    { icon: "📱", label: "Phone", value: profile.phone },
    { icon: "📍", label: "Location", value: profile.location }
  ];

  return (
    <div>
      <div className="section-header">
        <span className="section-subtitle">Contact</span>
        <h2 className="section-title">Let&apos;s build something together</h2>
        <div className="section-divider" />
      </div>

      <div className="contact-grid">
        <div className="contact-info-card">
          {rows.map((row) => (
            <div className="contact-row" key={row.label}>
              <div className="contact-row-icon">{row.icon}</div>
              <div>
                <h4>{row.label}</h4>
                <p>{row.value}</p>
              </div>
            </div>
          ))}

          <h4 style={{ margin: "8px 4px 0" }}>Follow me</h4>
          <div className="hero-socials">
            {socials.map((social) => (
              <a
                key={social.name}
                className="social-link"
                href={social.url}
                target={social.url.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                aria-label={social.label}
                title={social.label}
              >
                <Icon name={social.icon} size={18} />
              </a>
            ))}
          </div>
        </div>

        <form className="contact-form-card card" onSubmit={handleSubmit} noValidate>
          <div className="form-grid-2">
            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input
                id="c-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div className="field">
              <label htmlFor="c-email">Email</label>
              <input
                id="c-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="c-message">Message</label>
            <textarea
              id="c-message"
              name="message"
              rows={5}
              value={form.message}
              onChange={handleChange}
              placeholder="Tell me about your idea…"
            />
          </div>

          {status && (
            <p className={`form-message ${status.type}`} role="alert">
              {status.text}
            </p>
          )}

          <button type="submit" className="btn btn-primary">
            Send message
            <Icon name="arrow" size={16} />
          </button>
        </form>
      </div>

      <div className="section-header" style={{ marginTop: 60 }}>
        <span className="section-subtitle">Registration</span>
        <h2 className="section-title">Student registration</h2>
        <div className="section-divider" />
      </div>

      <Formvalidation />
    </div>
  );
}

export default ContactPage;