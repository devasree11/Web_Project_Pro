import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import Home from "./pages/Home.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import SkillsPage from "./pages/SkillsPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import HobbiesPage from "./pages/HobbiesPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import { useTheme } from "./hooks.js";
import "./App.css";

const ROUTES = ["home", "about", "skills", "projects", "hobbies", "contact"];

function getRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return ROUTES.includes(raw) ? raw : "home";
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const [route, setRoute] = useState(getRoute);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
      setMenuOpen(false);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = (next) => {
    if (next === route) return;
    if (window.location.hash === `#/${next}`) return;
    window.location.hash = `#/${next}`;
  };

  const pages = {
    home: <Home navigate={navigate} />,
    about: <AboutPage />,
    skills: <SkillsPage />,
    projects: <ProjectsPage />,
    hobbies: <HobbiesPage />,
    contact: <ContactPage />
  };

  return (
    <div className="app">
      <div className="bg-fx" aria-hidden="true">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      <Header
        route={route}
        theme={theme}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onToggleTheme={toggleTheme}
      />

      <main className="container">
        <div className="page" key={route}>
          {pages[route] || pages.home}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;