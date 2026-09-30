import { useEffect, useState } from "react";
import Project2 from "./Project2.jsx";
import Project3 from "./Project3.jsx";
import "./Project3.css";

const getSelectedProject = () =>
  window.location.hash === "#calculator" ? "calculator" : "attendance";

function App() {
  const [selectedProject, setSelectedProject] = useState(getSelectedProject);

  useEffect(() => {
    const syncSelectedProject = () =>
      setSelectedProject(getSelectedProject());

    window.addEventListener("hashchange", syncSelectedProject);
    return () => window.removeEventListener("hashchange", syncSelectedProject);
  }, []);

  return (
    <div className="app">
      {selectedProject === "calculator" ? <Project2 /> : <Project3 />}
    </div>
  );
}

export default App;