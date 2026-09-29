import { useEffect, useState } from "react";
import Project2 from "./Project2.jsx";
import Project3 from "./Project3.jsx";
import "./Project3.css";

function getProject() {
  return window.location.hash === "#calculator" ? "calculator" : "attendance";
}

function App() {
  const [project, setProject] = useState(getProject);

  useEffect(() => {
    const handleHashChange = () => setProject(getProject());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    document.title = project === "calculator" ? "Calculator · Unit 3" : "Attendance Tracker · Unit 3";
  }, [project]);

  return (
    <div className="app">
      {project === "calculator" ? <Project2 /> : <Project3 />}
    </div>
  );
}

export default App;