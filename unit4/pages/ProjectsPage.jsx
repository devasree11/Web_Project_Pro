import { useState } from "react";
import { projects } from "../data.js";

const FILTERS = ["All", ...new Set(projects.map((project) => project.category))];

function ProjectsPage() {
  const [filter, setFilter] = useState("All");

  const visible =
    filter === "All"
      ? projects
      : projects.filter((project) => project.category === filter);

  return (
    <div>
      <div className="section-header">
        <span className="section-subtitle">Work</span>
        <h2 className="section-title">Selected projects</h2>
        <div className="section-divider" />
      </div>

      <div className="filters">
        {FILTERS.map((category) => (
          <button
            key={category}
            className={`filter-btn ${filter === category ? "active" : ""}`}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="project-grid">
        {visible.map((project, index) => (
          <article className="project-card" key={project.id}>
            <div className="project-cover" style={{ "--c": project.color }}>
              <span className="project-index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="shine" />
            </div>

            <div className="project-body">
              <div className="project-meta">
                <span className="project-category">{project.category}</span>
                <span className="project-year">{project.year}</span>
              </div>

              <h3>
                {project.emoji} {project.title}
              </h3>
              <p>{project.description}</p>

              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;