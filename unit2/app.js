/* =========================================================
   DATA
========================================================= */
const profile = {
  name: "Devasree",
  role: "Full-Stack Developer",
  title: "Computer Science Engineering Student",
  location: "Chennai, Tamil Nadu",
  email: "devasree@example.com",
  phone: "+91 98765 43210"
};

const stats = [
  { value: 2, suffix: "+", label: "Years of Coding" },
  { value: 10, suffix: "+", label: "Technologies" },
  { value: 6, suffix: "+", label: "Projects Built" },
  { value: 100, suffix: "%", label: "Learning Mindset" }
];

const marqueeTech = [
  "React", "JavaScript", "Java", "Python",
  "HTML & CSS", "SQL", "Git & GitHub", "Redux",
  "Firebase", "Tailwind", "Node.js", "TypeScript"
];

const skillGroups = [
  {
    title: "Programming Languages",
    skills: [
      { name: "Java", level: 92 },
      { name: "Python", level: 88 },
      { name: "JavaScript", level: 90 },
      { name: "TypeScript", level: 72 }
    ]
  },
  {
    title: "Web Development",
    skills: [
      { name: "HTML & CSS", level: 95 },
      { name: "React", level: 85 },
      { name: "Node.js", level: 70 },
      { name: "Tailwind CSS", level: 78 }
    ]
  },
  {
    title: "Core & Tools",
    skills: [
      { name: "Data Structures & Algorithms", level: 86 },
      { name: "SQL", level: 78 },
      { name: "Git & GitHub", level: 82 },
      { name: "Firebase", level: 74 }
    ]
  }
];

const tools = [
  { name: "VS Code", icon: "🧩" },
  { name: "GitHub", icon: "🐙" },
  { name: "Figma", icon: "🎨" },
  { name: "Postman", icon: "📮" }
];

const projects = [
  {
    id: 1, title: "College Event Portal", category: "Web App", year: "2025", emoji: "🎉",
    description: "A modern event management platform with real-time updates, ticketing and interactive dashboards for campus events.",
    tags: ["HTML", "CSS", "JavaScript", "Firebase"],
    color: "linear-gradient(135deg, #7c6cff, #22d3ee)"
  },
  {
    id: 2, title: "Student Portal", category: "Web App", year: "2025", emoji: "🎓",
    description: "A comprehensive React-based student information system with clean state management and role-based views.",
    tags: ["React", "JSX", "CSS", "Hooks"],
    color: "linear-gradient(135deg, #22d3ee, #f472b6)"
  },
  {
    id: 3, title: "Personal Portfolio", category: "Website", year: "2026", emoji: "✨",
    description: "A unique animated portfolio with page routing, dark/light themes, and smooth interactions — the site you are looking at.",
    tags: ["React", "JavaScript", "CSS"],
    color: "linear-gradient(135deg, #f472b6, #7c6cff)"
  },
  {
    id: 4, title: "Task Manager CLI", category: "Python", year: "2024", emoji: "⚙️",
    description: "A terminal-based task tracker with persistence, categories and priority sorting built in Python.",
    tags: ["Python", "CLI"],
    color: "linear-gradient(135deg, #f59e0b, #ef4444)"
  },
  {
    id: 5, title: "Weather Dashboard", category: "Web App", year: "2024", emoji: "🌦️",
    description: "A responsive weather dashboard consuming a public API with search, forecasts and a glassmorphic UI.",
    tags: ["JavaScript", "CSS", "API"],
    color: "linear-gradient(135deg, #10b981, #22d3ee)"
  },
  {
    id: 6, title: "Quiz App", category: "JavaScript", year: "2024", emoji: "🧠",
    description: "An interactive quiz game with timed questions, scoring, and animated feedback across multiple categories.",
    tags: ["JavaScript", "HTML", "CSS"],
    color: "linear-gradient(135deg, #8b5cf6, #ec4899)"
  }
];

const hobbies = [
  {
    title: "Reading Books", emoji: "📚", color: "#e8f5e9",
    description: "Fiction, self-help, and technology — always a book in hand.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=70"
  },
  {
    title: "Playing Badminton", emoji: "🏸", color: "#e3f2fd",
    description: "Refreshing weekend matches with friends on the court.",
    image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800&q=70"
  },
  {
    title: "Coding", emoji: "💻", color: "#fce4ec",
    description: "Building apps and learning something new every single day.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=70"
  }
];

const socials = [
  { name: "GitHub", label: "GitHub", icon: "github", url: "https://github.com/" },
  { name: "LinkedIn", label: "LinkedIn", icon: "linkedin", url: "https://www.linkedin.com/" },
  { name: "Instagram", label: "Instagram", icon: "instagram", url: "https://www.instagram.com/" },
  { name: "Email", label: "Email", icon: "mail", url: "mailto:devasree@example.com" }
];

const contacts = [
  { icon: "✉", label: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: "📱", label: "Phone", value: profile.phone, href: `tel:${profile.phone.replace(/[^+\d]/g, "")}` },
  { icon: "📍", label: "Location", value: profile.location },
  { icon: "🟢", label: "Availability", value: "Open to internships & projects" }
];

/* =========================================================
   ICONS (inline SVG)
========================================================= */
const ICON_PATHS = {
  github: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.13-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.53-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>',
  linkedin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.55V9h3.57v11.45z"/></svg>',
  instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
  mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="3"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/></svg>'
};

function icon(name, size) {
  const svg = ICON_PATHS[name] || "";
  if (!size) return svg;
  return svg.replace(/width="18" height="18"/, `width="${size}" height="${size}"`);
}

/* =========================================================
   ROUTING
========================================================= */
const ROUTES = ["home", "about", "skills", "projects", "hobbies", "contact"];

function getRoute() {
  const raw = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return ROUTES.includes(raw) ? raw : "home";
}

function renderRoute() {
  const route = getRoute();

  document.querySelectorAll(".page").forEach((page) => {
    page.classList.toggle("active", page.id === `page-${route}`);
  });

  document.querySelectorAll(".nav-links a[data-route]").forEach((link) => {
    const isActive = link.dataset.route === route;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  closeMenu();
  window.scrollTo({ top: 0, behavior: "instant" });
  observeReveals();
}

/* =========================================================
   THEME
========================================================= */
const themeToggle = document.getElementById("theme-toggle");

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

function applyToggleLabel() {
  const dark = currentTheme() === "dark";
  themeToggle.textContent = dark ? "☀️" : "🌙";
  themeToggle.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.title = dark ? "Light mode" : "Dark mode";
}

function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("portfolio-theme", next);
  applyToggleLabel();
}

/* =========================================================
   MOBILE MENU
========================================================= */
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}

/* =========================================================
   RENDERERS
========================================================= */
function projectCard(project, index) {
  return `
    <article class="project-card reveal" style="--d: ${index * 0.08}s">
      <div class="project-cover" style="background: ${project.color}">
        <span class="shine"></span>
        <span>${project.emoji}</span>
      </div>
      <div class="project-body">
        <div class="project-meta">
          <span class="project-category">${project.category}</span>
          <span class="project-year">${project.year}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <div class="project-links">
          <a href="#/contact" aria-label="Request details">→</a>
          <a href="#/contact" aria-label="Source code">⌥</a>
        </div>
      </div>
    </article>`;
}

function projectCardHome(project) {
  return `
    <article class="project-card reveal">
      <div class="project-cover" style="background: ${project.color}">
        <span class="shine"></span>
        <span class="project-index">0${project.id}</span>
      </div>
      <div class="project-body">
        <div class="project-meta">
          <span class="project-category">${project.category}</span>
          <span class="project-year">${project.year}</span>
        </div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
        <div class="project-links">
          <a href="#/projects" aria-label="View project">→</a>
        </div>
      </div>
    </article>`;
}

function renderAll() {
  const heroSocials = document.getElementById("hero-socials");
  heroSocials.innerHTML = socials
    .map(
      (s) =>
        `<a class="social-link" href="${s.url}" ${s.url.startsWith("http") ? 'target="_blank"' : ""} rel="noreferrer" aria-label="${s.label}" title="${s.label}">${icon(s.icon)}</a>`
    )
    .join("");

  const marquee = document.getElementById("marquee-track");
  marquee.innerHTML = [...marqueeTech, ...marqueeTech]
    .map((tech, i) => `<span>${tech}</span>`)
    .join("");

  document.getElementById("home-projects").innerHTML = projects
    .slice(0, 3)
    .map(projectCardHome)
    .join("");

  document.getElementById("home-stats").innerHTML = stats
    .map(
      (stat) =>
        `<div class="stat-card reveal"><div class="stat-value" data-count="${stat.value}" data-suffix="${stat.suffix}">0${stat.suffix}</div><div class="stat-label">${stat.label}</div></div>`
    )
    .join("");

  const groups = document.getElementById("skill-groups");
  let i = 0;
  groups.innerHTML = skillGroups
    .map((group) => {
      const bars = group.skills
        .map((skill) => {
          const idx = i++;
          return `<div class="skill-row" style="--d: ${idx * 0.08}s">
            <div class="skill-top"><span class="skill-name">${skill.name}</span><span class="skill-pct">${skill.level}%</span></div>
            <div class="skill-track"><div class="skill-fill" style="--level: ${skill.level}%"></div></div>
          </div>`;
        })
        .join("");
      return `<div class="skill-group"><h3 class="skill-group-title">${group.title}</h3>${bars}</div>`;
    })
    .join("");

  document.getElementById("tools-grid").innerHTML = tools
    .map((tool) => `<div class="tool-chip"><span>${tool.icon}</span> ${tool.name}</div>`)
    .join("");

  renderFilters();

  document.getElementById("hobby-grid").innerHTML = hobbies
    .map(
      (hobby) => `
      <article class="hobby-card reveal" style="--c: ${hobby.color}">
        <div class="hobby-img-wrapper"><img src="${hobby.image}" alt="${hobby.title}" class="hobby-img" loading="lazy" /></div>
        <div class="hobby-body"><span class="hobby-emoji">${hobby.emoji}</span><h3>${hobby.title}</h3><p>${hobby.description}</p></div>
      </article>`
    )
    .join("");

  document.getElementById("contact-info").innerHTML = contacts
    .map(
      (item) => `
      <div class="contact-row">
        <span class="contact-row-icon">${item.icon}</span>
        <div><h4>${item.label}</h4>
        ${item.href ? `<p><a href="${item.href}" style="color: inherit">${item.value}</a></p>` : `<p>${item.value}</p>`}
        </div>
      </div>`
    )
    .join("");

  const connect = document.getElementById("footer-connect");
  connect.innerHTML = socials
    .map(
      (s) =>
        `<li><a href="${s.url}" ${s.url.startsWith("http") ? 'target="_blank"' : ""} rel="noreferrer">${s.label}</a></li>`
    )
    .join("");

  const footerSocials = document.getElementById("footer-socials");
  footerSocials.innerHTML = socials
    .slice(0, 3)
    .map(
      (s) =>
        `<a href="${s.url}" ${s.url.startsWith("http") ? 'target="_blank"' : ""} rel="noreferrer" aria-label="${s.label}" title="${s.label}">${icon(s.icon, 16)}</a>`
    )
    .join("");

  document.getElementById("footer-copy").textContent = `© ${new Date().getFullYear()} ${profile.name} · Built with HTML, CSS & JavaScript`;

  observeSkillBars();
  observeCountUp();
  observeReveals();
}

/* =========================================================
   PROJECT FILTER
========================================================= */
const CATEGORIES = ["All", "Web App", "Website", "Python", "JavaScript"];
let activeFilter = "All";

function renderFilters() {
  const filters = document.getElementById("filters");
  filters.innerHTML = CATEGORIES.map(
    (cat) => `<button class="filter-btn ${activeFilter === cat ? "active" : ""}" data-cat="${cat}">${cat}</button>`
  ).join("");
}

function renderProjects() {
  const grid = document.getElementById("projects-grid");
  const visible = activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);
  grid.innerHTML = visible.map(projectCard).join("");
  observeReveals();
}

document.querySelectorAll(".filters").forEach((filters) => {
  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    activeFilter = btn.dataset.cat;
    renderFilters();
    renderProjects();
  });
});

/* =========================================================
   OBSERVERS
========================================================= */
function observeReveals() {
  const els = document.querySelectorAll(".reveal:not(.revealed)");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("revealed"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  els.forEach((el) => observer.observe(el));
}

function observeSkillBars() {
  const rows = document.querySelectorAll(".skill-row");
  if (!("IntersectionObserver" in window)) {
    rows.forEach((row) => row.querySelector(".skill-fill")?.classList.add("filled"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelector(".skill-fill")?.classList.add("filled");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  rows.forEach((row) => observer.observe(row));
}

function observeCountUp() {
  const values = document.querySelectorAll(".stat-value[data-count]");
  if (!("IntersectionObserver" in window)) {
    values.forEach((el) => {
      el.textContent = `${el.dataset.count}${el.dataset.suffix}`;
    });
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = `${Math.round(target * eased)}${suffix}`;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );
  values.forEach((el) => observer.observe(el));
}

/* =========================================================
   TYPEWRITER
========================================================= */
const ROLES = ["Full-Stack Developer", "UI/UX Enthusiast", "Problem Solver", "CS Engineering Student"];
const TYPE_SPEED = 90, DELETE_SPEED = 45, HOLD = 1600;

function typewriter() {
  const el = document.getElementById("typewriter");
  if (!el) return;
  let wordIndex = 0;
  let text = "";
  let deleting = false;

  const tick = () => {
    const word = ROLES[wordIndex % ROLES.length];
    if (!deleting && text === word) {
      setTimeout(() => { deleting = true; tick(); }, HOLD);
      return;
    }
    if (deleting && text === "") {
      deleting = false;
      wordIndex = (wordIndex + 1) % ROLES.length;
      setTimeout(tick, DELETE_SPEED);
      return;
    }
    text = word.slice(0, text.length + (deleting ? -1 : 1));
    el.textContent = text;
    setTimeout(tick, deleting ? DELETE_SPEED : TYPE_SPEED);
  };
  tick();
}

/* =========================================================
   CONTACT FORM
========================================================= */
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");

contactForm.addEventListener("input", () => {
  nameInput.classList.remove("invalid");
  emailInput.classList.remove("invalid");
  messageInput.classList.remove("invalid");
  formMessage.className = "form-message";
  formMessage.textContent = "";
});

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const errors = {};
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();

  if (!name) { errors.name = "Please enter your name."; nameInput.classList.add("invalid"); }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.email = "Enter a valid email address."; emailInput.classList.add("invalid"); }
  if (message.length < 10) { errors.message = "Message should be at least 10 characters."; messageInput.classList.add("invalid"); }

  if (Object.keys(errors).length) {
    formMessage.className = "form-message error";
    formMessage.textContent = "Please fix the highlighted fields.";
    return;
  }

  const subject = encodeURIComponent(`Message from ${name} via portfolio`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  nameInput.value = "";
  emailInput.value = "";
  messageInput.value = "";
  formMessage.className = "form-message success";
  formMessage.textContent = "Thanks! Your email draft is ready — hit send and I'll get back to you soon.";
  window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
});

/* =========================================================
   BACK TO TOP
========================================================= */
const toTop = document.getElementById("to-top");

window.addEventListener("scroll", () => {
  toTop.classList.toggle("visible", window.scrollY > 500);
}, { passive: true });

toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* =========================================================
   INIT
========================================================= */
themeToggle.addEventListener("click", toggleTheme);
applyToggleLabel();

menuToggle.addEventListener("click", () => {
  const open = !navLinks.classList.contains("open");
  navLinks.classList.toggle("open", open);
  menuToggle.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
});

navLinks.addEventListener("click", (e) => {
  if (e.target.closest("a")) closeMenu();
});

window.addEventListener("hashchange", renderRoute);

renderAll();
renderRoute();
typewriter();