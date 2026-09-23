function Header({ route, theme, menuOpen, onToggleMenu, onToggleTheme }) {
  const links = [
    { key: "home", label: "Home" },
    { key: "about", label: "About" },
    { key: "skills", label: "Skills" },
    { key: "projects", label: "Projects" },
    { key: "hobbies", label: "Hobbies" },
    { key: "contact", label: "Contact" }
  ];

  return (
    <header className="navbar">
      <div className="nav-inner">
        <a className="brand" href="#/home" aria-label="Devasree — home">
          <span className="brand-mark">D</span>
          Devasree<span style={{ color: "var(--accent)" }}>.</span>
        </a>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`} aria-label="Main navigation">
          {links.map((link) => (
            <a
              key={link.key}
              href={`#/${link.key}`}
              className={route === link.key ? "active" : ""}
              aria-current={route === link.key ? "page" : undefined}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button
            className={`menu-toggle ${menuOpen ? "open" : ""}`}
            onClick={onToggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;