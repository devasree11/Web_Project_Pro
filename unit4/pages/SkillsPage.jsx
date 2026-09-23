import { useEffect, useRef } from "react";
import { skillGroups, tools } from "../data.js";

function SkillRow({ skill }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(
      () => el.nextElementSibling.querySelector(".skill-fill")?.classList.add("filled"),
      150
    );
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="skill-row">
      <div className="skill-top">
        <span className="skill-name" ref={ref}>
          {skill.name}
        </span>
        <span className="skill-pct">{skill.level}%</span>
      </div>
      <div className="skill-track">
        <div className="skill-fill" style={{ "--level": `${skill.level}%` }} />
      </div>
    </div>
  );
}

function SkillsPage() {
  return (
    <div>
      <div className="section-header">
        <span className="section-subtitle">Skills</span>
        <h2 className="section-title">My technical toolkit</h2>
        <div className="section-divider" />
      </div>

      <div className="skills-layout">
        <div>
          {skillGroups.map((group) => (
            <div className="skill-group" key={group.title}>
              <h3 className="skill-group-title">{group.title}</h3>
              {group.skills.map((skill) => (
                <SkillRow key={skill.name} skill={skill} />
              ))}
            </div>
          ))}
        </div>

        <div>
          <div className="section-head">
            <h2>Tools I use</h2>
            <p>My daily workhorses for building and shipping.</p>
          </div>

          <div className="tools-grid">
            {tools.map((tool) => (
              <div className="tool-chip" key={tool.name}>
                <span>{tool.icon}</span>
                {tool.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SkillsPage;