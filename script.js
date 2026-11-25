/* Builds the page from data.js. You normally don't need to edit this file. */
(function () {
  // Preview mode: editor.html saves a draft to this browser; open index.html?preview to see it.
  let D = window.CV_DATA;
  if (location.search.includes("preview")) {
    try { const draft = JSON.parse(localStorage.getItem("cvDraft")); if (draft) D = draft; } catch (e) {}
  }
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const list = (a) => (Array.isArray(a) ? a : []);

  const ICONS = {
    linkedin: '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z"/></svg>',
    github: '<svg viewBox="0 0 24 24"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path d="M2 5h20v14H2zm2 2v.5l8 5 8-5V7zm16 2.8-8 5-8-5V17h16z"/></svg>',
  };

  /* ---------- Hero ---------- */
  document.title = `${D.name} · ${(D.roles || [])[0] || ""} · Auckland`;
  $("name").textContent = D.name;
  $("navName").textContent = D.name.split(" ")[0];
  $("footName").textContent = D.name;
  $("year").textContent = new Date().getFullYear();
  $("headline").textContent = D.headline;
  $("location").textContent = D.location;
  $("availability").textContent = D.availability;
  $("photo").src = D.photo;
  if (D.cvFile) $("cvBtn").href = D.cvFile; else $("cvBtn").remove();

  const socials = [];
  if (D.linkedin) socials.push(`<a href="${esc(D.linkedin)}" target="_blank" rel="noopener">${ICONS.linkedin}LinkedIn</a>`);
  if (D.github) socials.push(`<a href="${esc(D.github)}" target="_blank" rel="noopener">${ICONS.github}GitHub</a>`);
  if (D.email) socials.push(`<a href="mailto:${esc(D.email)}">${ICONS.mail}${esc(D.email)}</a>`);
  $("socials").innerHTML = socials.join("");

  // Typing effect over the roles list
  (function typer() {
    const roles = list(D.roles).length ? D.roles : [D.headline];
    const el = $("typed");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = roles[0]; return; }
    let r = 0, i = 0, del = false;
    (function tick() {
      const word = roles[r];
      el.textContent = word.slice(0, i);
      if (!del && i < word.length) i++;
      else if (!del) { del = true; return setTimeout(tick, 1600); }
      else if (i > 0) i--;
      else { del = false; r = (r + 1) % roles.length; }
      setTimeout(tick, del ? 35 : 75);
    })();
  })();

  /* ---------- About ---------- */
  $("aboutText").innerHTML = list(D.about).map((p) => `<p>${esc(p)}</p>`).join("");
  $("stats").innerHTML = list(D.stats).map((s) => `<div class="stat"><b data-count="${esc(s.value)}">${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("");

  /* ---------- Skills (filter + search) ---------- */
  const groups = list(D.skills);
  let activeGroup = "All";
  function renderSkills() {
    const q = $("skillSearch").value.trim().toLowerCase();
    const shown = groups
      .filter((g) => activeGroup === "All" || g.group === activeGroup)
      .map((g) => ({ ...g, items: list(g.items).filter((s) => !q || s.toLowerCase().includes(q) || g.group.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length);
    $("skillGrid").innerHTML = shown.length
      ? shown.map((g) => `<div class="skill-card"><h3>${esc(g.group)}<small>${g.items.length}</small></h3>
          <div class="tags">${g.items.map((s) => `<span class="tag${q && s.toLowerCase().includes(q) ? " hit" : ""}">${esc(s)}</span>`).join("")}</div></div>`).join("")
      : `<p class="empty">No skills match “${esc(q)}”.</p>`;
  }
  $("skillFilters").innerHTML = ["All", ...groups.map((g) => g.group)]
    .map((g) => `<button class="chip${g === "All" ? " on" : ""}" data-g="${esc(g)}">${esc(g)}</button>`).join("");
  $("skillFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    activeGroup = b.dataset.g;
    $("skillFilters").querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === b));
    renderSkills();
  });
  $("skillSearch").addEventListener("input", renderSkills);
  renderSkills();

  /* ---------- Experience (click to expand) ---------- */
  $("timeline").innerHTML = list(D.experience).map((x, i) => `
    <li class="tl-item"><div class="tl-card${i === 0 ? " open" : ""}" tabindex="0" role="button" aria-expanded="${i === 0}">
      <div class="tl-head"><h3>${esc(x.role)} <span class="tl-org">· ${esc(x.org)}</span></h3><span class="tl-dates">${esc(x.dates)}</span></div>
      <div class="tl-body"><div><ul>${list(x.points).map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div></div>
      <div class="tl-toggle">${i === 0 ? "Click to collapse" : "Click to see details"}</div>
    </div></li>`).join("");
  $("timeline").addEventListener("click", toggleCard);
  $("timeline").addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCard(e); } });
  function toggleCard(e) {
    const c = e.target.closest(".tl-card"); if (!c) return;
    const open = c.classList.toggle("open");
    c.setAttribute("aria-expanded", open);
    c.querySelector(".tl-toggle").textContent = open ? "Click to collapse" : "Click to see details";
  }

  /* ---------- Projects (filter by tag) ---------- */
  const projects = list(D.projects);
  const allTags = [...new Set(projects.flatMap((p) => list(p.tags)))];
  $("projectGrid").innerHTML = projects.map((p) => `
    <article class="project" data-tags="${esc(list(p.tags).join("|"))}">
      <p class="ctx">${esc(p.context)}</p>
      <h3>${esc(p.title)}</h3>
      <ul>${list(p.points).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      ${p.link ? `<a class="more" href="${esc(p.link)}" target="_blank" rel="noopener">View project →</a>` : ""}
      <div class="tags">${list(p.tags).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
    </article>`).join("");
  $("projectFilters").innerHTML = ["All", ...allTags].map((t) => `<button class="chip${t === "All" ? " on" : ""}" data-t="${esc(t)}">${esc(t)}</button>`).join("");
  $("projectFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    $("projectFilters").querySelectorAll(".chip").forEach((c) => c.classList.toggle("on", c === b));
    document.querySelectorAll(".project").forEach((p) => {
      p.classList.toggle("hide", b.dataset.t !== "All" && !p.dataset.tags.split("|").includes(b.dataset.t));
    });
  });
  $("projectGrid").addEventListener("pointermove", (e) => {
    const p = e.target.closest(".project"); if (!p) return;
    const r = p.getBoundingClientRect();
    p.style.setProperty("--mx", `${e.clientX - r.left}px`);
    p.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  /* ---------- Education / certs ---------- */
  const eduCard = (e) => `<div class="edu-card"><h3>${esc(e.degree || e.name)}</h3><p>${esc(e.school || e.issuer)}</p>
    <span class="tl-dates">${esc(e.dates)}</span>${e.details ? `<p>${esc(e.details)}</p>` : ""}</div>`;
  $("edu").innerHTML = list(D.education).map(eduCard).join("");
  if (list(D.certifications).length) { $("certWrap").hidden = false; $("certs").innerHTML = D.certifications.map(eduCard).join(""); }

  /* ---------- Strengths / languages ---------- */
  $("strengthGrid").innerHTML = list(D.strengths).map((s) => `<div class="strength"><b>${esc(s.title)}</b><span>${esc(s.text)}</span></div>`).join("");
  $("langs").innerHTML = list(D.languages).map((l) => `<div class="lang">${esc(l.name)} <small>${esc(l.level)}</small></div>`).join("");

  /* ---------- Contact ---------- */
  $("mailBtn").href = `mailto:${D.email}?subject=${encodeURIComponent("Hello Nimesh – from your CV website")}`;
  const meta = [D.location];
  if (D.showPhone && D.phone) meta.push(`<a href="tel:${esc(D.phone.replace(/\s/g, ""))}">${esc(D.phone)}</a>`);
  $("contactMeta").innerHTML = meta.map((m, i) => (i === 0 ? esc(m) : m)).join(" · ");
  $("rights").textContent = D.workRights || "";
  $("copyBtn").addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(D.email); toast("Email copied ✓"); }
    catch { toast(D.email); }
  });
  function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2000);
  }

  /* ---------- Theme ---------- */
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
  $("themeBtn").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  });

  /* ---------- Nav, progress, reveal ---------- */
  $("menuBtn").addEventListener("click", () => $("links").classList.toggle("open"));
  $("links").addEventListener("click", (e) => { if (e.target.tagName === "A") $("links").classList.remove("open"); });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".links a")];
  function onScroll() {
    const h = document.documentElement;
    $("progress").style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`;
    $("nav").classList.toggle("scrolled", h.scrollTop > 10);
    let cur = "";
    sections.forEach((s) => { if (s.getBoundingClientRect().top < 120) cur = s.id; });
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    en.target.querySelectorAll("[data-count]").forEach(countUp);
    io.unobserve(en.target);
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  function countUp(el) {
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target) || String(target) !== el.dataset.count) return;
    const start = target > 100 ? target - 30 : 0, t0 = performance.now();
    (function step(t) {
      const k = Math.min(1, (t - t0) / 900);
      el.textContent = Math.round(start + (target - start) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
})();
