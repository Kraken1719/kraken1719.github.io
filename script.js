/* Builds the page from data.js. You normally don't need to edit this file. */
(function () {
  "use strict";

  // Preview mode: editor.html saves a draft in this browser; open index.html?preview to see it.
  let D = window.CV_DATA;
  if (/[?&]preview/.test(location.search)) {
    try { const draft = JSON.parse(localStorage.getItem("cvDraft")); if (draft) D = draft; } catch (e) {}
  }

  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const list = (a) => (Array.isArray(a) ? a : []);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n) => String(n).padStart(2, "0");

  const ICON = {
    linkedin: '<svg class="fill" viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z"/></svg>',
    github: '<svg class="fill" viewBox="0 0 24 24"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg>',
  };

  /* ================= HERO ================= */
  const [first, ...rest] = D.name.split(" ");
  const splitChars = (word, offset) => [...word].map((c, i) => `<span class="ch" style="animation-delay:${(offset + i) * 0.035 + 0.1}s">${esc(c)}</span>`).join("");
  $("name").innerHTML = `<span class="l1">${splitChars(first, 0)}</span><span class="l2">${splitChars(rest.join(" "), first.length)}</span>`;
  $("name").setAttribute("aria-label", D.name);
  document.title = `${D.name} · Software Developer · Auckland`;
  $("navName").textContent = first;
  $("footName").textContent = D.name;
  $("year").textContent = new Date().getFullYear();
  $("headline").textContent = D.headline;
  $("availability").textContent = D.availability;
  $("photo").src = D.photo;
  ["navHeadshot", "statusHeadshot", "headshot"].forEach((id) => ($(id).src = D.headshot || D.photo));
  if (D.cvFile) $("cvBtn").href = D.cvFile; else $("cvBtn").remove();

  const socials = [];
  if (D.linkedin) socials.push(`<a href="${esc(D.linkedin)}" target="_blank" rel="noopener">${ICON.linkedin}LinkedIn</a>`);
  if (D.github) socials.push(`<a href="${esc(D.github)}" target="_blank" rel="noopener">${ICON.github}GitHub</a>`);
  if (D.email) socials.push(`<a href="mailto:${esc(D.email)}">${ICON.mail}Email</a>`);
  $("socials").innerHTML = socials.join("");

  // Typing effect
  (function typer() {
    const roles = list(D.roles).length ? D.roles : ["developer"];
    const el = $("typed");
    if (reduced) { el.textContent = roles[0]; return; }
    let r = 0, i = 0, del = false;
    (function tick() {
      const word = roles[r];
      el.textContent = word.slice(0, i);
      if (!del && i < word.length) i++;
      else if (!del) { del = true; return setTimeout(tick, 1800); }
      else if (i > 0) i--;
      else { del = false; r = (r + 1) % roles.length; }
      setTimeout(tick, del ? 30 : 70);
    })();
  })();

  // Photo tilt + parallax
  const hp = $("heroPhoto");
  if (!reduced && matchMedia("(hover: hover)").matches) {
    hp.addEventListener("pointermove", (e) => {
      const r = hp.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      hp.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`;
    });
    hp.addEventListener("pointerleave", () => (hp.style.transform = ""));
  }

  // Ticker of all skills
  const allSkills = list(D.skills).flatMap((g) => list(g.items));
  const tickerHTML = allSkills.map((s) => `<span>${esc(s)}</span>`).join("");
  $("ticker").innerHTML = tickerHTML + tickerHTML;

  /* ================= ABOUT ================= */
  $("aboutText").innerHTML = list(D.about).map((p) => `<p>${esc(p)}</p>`).join("");
  $("glance").innerHTML = list(D.glance).map((g) => `<div><dt>${esc(g.label)}</dt><dd>${esc(g.value)}</dd></div>`).join("");
  $("now").innerHTML = list(D.now).map((n) => `<div><b>${esc(n.title)}</b><p>${esc(n.text)}</p></div>`).join("");
  if (!list(D.now).length) document.querySelector(".now").remove();

  /* ================= PROJECTS ================= */
  const projects = list(D.projects);
  const projText = projects.map((p) => [p.title, p.context, ...list(p.tags), ...list(p.points)].join(" ").toLowerCase());
  $("projectGrid").innerHTML = projects.map((p, i) => {
    const st = (p.status || "").toLowerCase();
    const live = st.includes("progress") || st.includes("ongoing");
    return `<article class="project reveal" style="--d:${(i % 2) * 0.08}s" data-tags="${esc(list(p.tags).join("|"))}">
      <div class="p-top"><span class="p-num">${pad(i + 1)}</span>${p.status ? `<span class="badge${live ? " progress-b" : ""}">${esc(p.status)}</span>` : ""}</div>
      <h3>${esc(p.title)}</h3>
      <p class="ctx">${esc(p.context)}</p>
      <ul>${list(p.points).map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
      ${p.link ? `<a class="more" href="${esc(p.link)}" target="_blank" rel="noopener">View project ${ICON.arrow}</a>` : ""}
      <div class="tags">${list(p.tags).map((t) => `<span class="tag sm">${esc(t)}</span>`).join("")}</div>
    </article>`;
  }).join("");
  const projectEls = [...document.querySelectorAll(".project")];
  const tags = [...new Set(projects.flatMap((p) => list(p.tags)))];

  function setProjectFilter(fn, chipLabel) {
    projectEls.forEach((el, i) => {
      const match = fn(i, el);
      el.classList.toggle("dim", fn !== null && !match);
      el.classList.toggle("glow", fn !== null && match && chipLabel !== undefined);
    });
  }
  function renderProjectChips(active, extra) {
    const chips = ["All", ...tags].map((t) => `<button class="chip${t === active ? " on" : ""}" data-t="${esc(t)}">${esc(t)}</button>`);
    if (extra) chips.unshift(`<button class="chip on" data-t="All">Using “${esc(extra)}” ✕</button>`);
    $("projectFilters").innerHTML = chips.join("");
  }
  renderProjectChips("All");
  $("projectFilters").addEventListener("click", (e) => {
    const b = e.target.closest(".chip"); if (!b) return;
    const t = b.dataset.t;
    renderProjectChips(t);
    setProjectFilter(t === "All" ? null : (i, el) => el.dataset.tags.split("|").includes(t));
  });
  $("projectGrid").addEventListener("pointermove", (e) => {
    const p = e.target.closest(".project"); if (!p) return;
    const r = p.getBoundingClientRect();
    p.style.setProperty("--mx", `${e.clientX - r.left}px`);
    p.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  /* ================= SKILLS ================= */
  const groups = list(D.skills);
  let activeGroup = "All";
  const STOP = new Set(["and", "the", "web", "app", "microsoft", "advanced", "introductory", "concepts", "fundamentals", "process", "multi-step", "methods", "office", "windows"]);
  const keywords = (s) => s.toLowerCase().replace(/[()]/g, " ").split(/[\s/]+/).filter((w) => w.length > 2 && !STOP.has(w));

  function renderSkills() {
    const q = $("skillSearch").value.trim().toLowerCase();
    const shown = groups
      .filter((g) => activeGroup === "All" || g.group === activeGroup)
      .map((g) => ({ ...g, items: list(g.items).filter((s) => !q || s.toLowerCase().includes(q) || g.group.toLowerCase().includes(q)) }))
      .filter((g) => g.items.length);
    $("skillRows").innerHTML = shown.length
      ? shown.map((g) => `<div class="skill-row"><h3>${esc(g.group)}<small>${pad(g.items.length)}</small></h3>
          <div class="tags">${g.items.map((s) => `<button class="tag${q && s.toLowerCase().includes(q) ? " hit" : ""}" data-skill="${esc(s)}">${esc(s)}</button>`).join("")}</div></div>`).join("")
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

  // Click a skill -> show where it was used
  $("skillRows").addEventListener("click", (e) => {
    const b = e.target.closest("[data-skill]"); if (!b) return;
    const skill = b.dataset.skill, kws = keywords(skill);
    const hits = projText.map((t, i) => (kws.some((k) => t.includes(k)) ? i : -1)).filter((i) => i >= 0);
    if (hits.length) {
      renderProjectChips(null, skill);
      setProjectFilter((i) => hits.includes(i), skill);
      $("projects").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
      return;
    }
    const exp = list(D.experience).find((x) => kws.some((k) => [x.role, x.org, ...list(x.points)].join(" ").toLowerCase().includes(k)));
    if (exp) { toast(`${skill}: used as ${exp.role} at ${exp.org}`); return; }
    toast(`${skill}: part of my toolkit — not tied to a listed project yet`);
  });

  /* ================= EXPERIENCE / EDUCATION ================= */
  $("experienceRows").innerHTML = list(D.experience).map((x) => `
    <article class="row reveal"><p class="row-date">${esc(x.dates)}</p>
      <div><h3>${esc(x.role)}</h3><p class="org">${esc(x.org)}</p>
      <ul>${list(x.points).map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div></article>`).join("");
  const eduRow = (e) => `<article class="row reveal"><p class="row-date">${esc(e.dates)}</p>
      <div><h3>${esc(e.degree || e.name)}</h3><p class="org">${esc(e.school || e.issuer)}</p>
      ${e.details ? `<p class="details">${esc(e.details)}</p>` : ""}</div></article>`;
  $("educationRows").innerHTML = list(D.education).map(eduRow).join("");
  if (list(D.certifications).length) { $("certWrap").hidden = false; $("certRows").innerHTML = D.certifications.map(eduRow).join(""); }

  /* ================= STRENGTHS ================= */
  $("strengthGrid").innerHTML = list(D.strengths).map((s, i) => `<div class="strength reveal" style="--d:${i * 0.07}s"><span class="i">${pad(i + 1)}</span><b>${esc(s.title)}</b><span>${esc(s.text)}</span></div>`).join("");
  $("langs").innerHTML = list(D.languages).map((l) => `<span class="lang">${esc(l.name)} <small>${esc(l.level)}</small></span>`).join("");

  /* ================= CONTACT ================= */
  $("mailLink").textContent = D.email;
  $("mailLink").href = `mailto:${D.email}?subject=${encodeURIComponent("Hello Nimesh – from your CV website")}`;
  const meta = [esc(D.location)];
  if (D.showPhone && D.phone) meta.push(`<a href="tel:${esc(D.phone.replace(/\s/g, ""))}">${esc(D.phone)}</a>`);
  if (D.linkedin) meta.push(`<a href="${esc(D.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`);
  if (D.github) meta.push(`<a href="${esc(D.github)}" target="_blank" rel="noopener">GitHub</a>`);
  $("contactMeta").innerHTML = meta.join("  ·  ");
  async function copyEmail() {
    try { await navigator.clipboard.writeText(D.email); toast("Email copied to clipboard ✓"); }
    catch { toast(D.email); }
  }
  $("copyBtn").addEventListener("click", copyEmail);

  function toast(msg) {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ================= TERMINAL ================= */
  const body = $("termBody"), tin = $("termIn");
  const out = (html, cls) => { const d = document.createElement("div"); if (cls) d.className = cls; d.innerHTML = html; body.appendChild(d); body.scrollTop = body.scrollHeight; };
  const CMDS = {
    help: () => out(
      `<span class="acc">Available commands</span>\n` +
      [["whoami", "who I am"], ["about", "short summary"], ["skills", "technical skills"], ["experience", "work history"],
       ["projects", "selected projects"], ["education", "degrees"], ["contact", "how to reach me"], ["cv", "download my CV"],
       ["theme", "switch light / dark"], ["clear", "clear the screen"]]
        .map(([c, d]) => `  <span class="blu">${c.padEnd(12)}</span><span class="muted">${d}</span>`).join("\n")),
    whoami: () => out(`<span class="acc">${esc(D.name)}</span>\n${esc(D.headline)}\n<span class="muted">📍 ${esc(D.location)}</span>`),
    about: () => out(list(D.about).map(esc).join("\n\n")),
    skills: () => out(groups.map((g) => `<span class="acc">${esc(g.group)}</span>\n  ${list(g.items).map(esc).join(" · ")}`).join("\n")),
    experience: () => out(list(D.experience).map((x) => `<span class="acc">${esc(x.role)}</span> @ ${esc(x.org)}  <span class="muted">${esc(x.dates)}</span>\n${list(x.points).map((p) => "  - " + esc(p)).join("\n")}`).join("\n\n")),
    projects: () => out(projects.map((p, i) => `<span class="muted">${pad(i + 1)}</span> <span class="acc">${esc(p.title)}</span> <span class="muted">[${esc(p.status || "")}]</span>\n   ${list(p.tags).map(esc).join(", ")}`).join("\n")),
    education: () => out(list(D.education).map((e) => `<span class="acc">${esc(e.degree)}</span>\n  ${esc(e.school)}  <span class="muted">${esc(e.dates)}</span>`).join("\n\n")),
    contact: () => out(`email     <a href="mailto:${esc(D.email)}">${esc(D.email)}</a>\nlinkedin  <a href="${esc(D.linkedin)}" target="_blank" rel="noopener">${esc(D.linkedin.replace(/^https?:\/\/(www\.)?/, ""))}</a>\ngithub    <a href="${esc(D.github)}" target="_blank" rel="noopener">${esc(D.github.replace(/^https?:\/\//, ""))}</a>`),
    cv: () => { if (D.cvFile) { const a = document.createElement("a"); a.href = D.cvFile; a.download = ""; a.click(); out(`<span class="ok">✓</span> Downloading CV…`); } else out("No CV file set."); },
    theme: () => { toggleTheme(); out(`<span class="ok">✓</span> Theme: ${document.documentElement.dataset.theme}`); },
    clear: () => (body.innerHTML = ""),
    sudo: (args) => out(args.join(" ").includes("hire") ? `<span class="ok">Permission granted.</span> Great choice — email <a href="mailto:${esc(D.email)}">${esc(D.email)}</a> and let's talk. 🚀` : `<span class="acc">nice try.</span> This incident will be reported. 😄 (hint: <span class="blu">sudo hire nimesh</span>)`),
    ls: () => out(`<span class="blu">about/  skills/  experience/  projects/  education/  contact/</span>  cv.pdf`),
    exit: () => out(`<span class="muted">There's no escape — but you can scroll down to contact me.</span>`),
  };
  const history = []; let hIdx = 0;
  function run(raw) {
    const line = raw.trim();
    out(`<span class="p-user">guest@cv</span>:<span class="p-path">~</span>$ <span class="cmd">${esc(line)}</span>`);
    if (!line) return;
    history.push(line); hIdx = history.length;
    const [cmd, ...args] = line.toLowerCase().split(/\s+/);
    const alias = { cat: "about", "cd": "ls", man: "help", "?": "help", hire: "contact", resume: "cv", work: "experience", jobs: "experience" };
    const fn = CMDS[cmd] || CMDS[alias[cmd]];
    if (fn) fn(args); else out(`<span class="muted">command not found: ${esc(cmd)} — type</span> <span class="blu">help</span>`);
  }
  out(`<span class="muted">Welcome to Nimesh's CV shell. Type</span> <span class="blu">help</span> <span class="muted">to get started.</span>`);
  $("termForm").addEventListener("submit", (e) => { e.preventDefault(); run(tin.value); tin.value = ""; });
  tin.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hIdx > 0) { tin.value = history[--hIdx]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hIdx = Math.min(history.length, hIdx + 1); tin.value = history[hIdx] || ""; e.preventDefault(); }
    if (e.key === "Tab") { const m = Object.keys(CMDS).find((c) => c.startsWith(tin.value.trim())); if (m && tin.value.trim()) { tin.value = m; } e.preventDefault(); }
  });
  $("term").addEventListener("click", (e) => { if (!e.target.closest("a")) tin.focus({ preventScroll: true }); });

  /* ================= THEME ================= */
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.dataset.theme = saved;
  function toggleTheme() {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
  }
  $("themeBtn").addEventListener("click", toggleTheme);

  /* ================= COMMAND PALETTE ================= */
  const go = (id) => () => $(id).scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  const ACTIONS = [
    ["About me", "Section", go("about")], ["Skills & tools", "Section", go("skills")], ["Work experience", "Section", go("experience")],
    ["Projects", "Section", go("projects")], ["Education", "Section", go("education")], ["How I work", "Section", go("strengths")],
    ["Terminal", "Section", () => { go("terminal")(); setTimeout(() => tin.focus({ preventScroll: true }), 500); }],
    ["Contact", "Section", go("contact")],
    ["Copy email address", "Action", copyEmail],
    ["Download CV (PDF)", "Action", () => $("cvBtn") && $("cvBtn").click()],
    ["Open LinkedIn", "Link", () => window.open(D.linkedin, "_blank", "noopener")],
    ["Open GitHub", "Link", () => window.open(D.github, "_blank", "noopener")],
    ["Switch light / dark theme", "Action", toggleTheme],
  ];
  const pal = $("palette"), pin = $("paletteIn"), plist = $("paletteList");
  let pItems = [], pSel = 0, lastFocus = null;
  function renderPalette() {
    const q = pin.value.trim().toLowerCase();
    pItems = ACTIONS.filter(([t]) => t.toLowerCase().includes(q));
    pSel = Math.min(pSel, Math.max(0, pItems.length - 1));
    plist.innerHTML = pItems.length
      ? pItems.map(([t, k], i) => `<li role="option" data-i="${i}" class="${i === pSel ? "sel" : ""}" aria-selected="${i === pSel}">${esc(t)}<small>${k}</small></li>`).join("")
      : `<li>No results</li>`;
  }
  function openPalette() { lastFocus = document.activeElement; pal.hidden = false; pin.value = ""; pSel = 0; renderPalette(); pin.focus(); }
  function closePalette() { pal.hidden = true; if (lastFocus) lastFocus.focus({ preventScroll: true }); }
  function choose(i) { const a = pItems[i]; if (!a) return; closePalette(); a[2](); }
  $("paletteBtn").addEventListener("click", openPalette);
  pin.addEventListener("input", () => { pSel = 0; renderPalette(); });
  pin.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { pSel = (pSel + 1) % pItems.length; renderPalette(); e.preventDefault(); }
    if (e.key === "ArrowUp") { pSel = (pSel - 1 + pItems.length) % pItems.length; renderPalette(); e.preventDefault(); }
    if (e.key === "Enter") choose(pSel);
  });
  plist.addEventListener("click", (e) => { const li = e.target.closest("[data-i]"); if (li) choose(+li.dataset.i); });
  pal.addEventListener("click", (e) => { if (e.target === pal) closePalette(); });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? openPalette() : closePalette(); }
    else if (e.key === "Escape" && !pal.hidden) closePalette();
    else if (e.key === "/" && pal.hidden && !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openPalette(); }
  });

  /* ================= NAV / SCROLL ================= */
  const links = $("links"), menuBtn = $("menuBtn");
  menuBtn.addEventListener("click", () => { const o = links.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); });
  links.addEventListener("click", (e) => { if (e.target.tagName === "A") { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); } });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...links.querySelectorAll("a")];
  const photoImg = $("photo");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const h = document.documentElement, y = h.scrollTop;
    $("progress").style.width = `${(y / Math.max(1, h.scrollHeight - h.clientHeight)) * 100}%`;
    $("nav").classList.toggle("scrolled", y > 10);
    let cur = "";
    sections.forEach((s) => { if (s.getBoundingClientRect().top < 140) cur = s.id; });
    if (cur === "strengths" || cur === "terminal") cur = "education";
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
    if (!reduced && y < 1200) photoImg.style.setProperty("--py", `${-y * 0.06}px`);
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
