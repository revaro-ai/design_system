// Behaviour for the documentation site (index.html). No dependencies.
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;

  /* Theme: light, dark, or follow the device ("") */
  const store = {
    get() { try { return localStorage.getItem("rv-docs-theme") || ""; } catch (e) { return ""; } },
    set(v) { try { v ? localStorage.setItem("rv-docs-theme", v) : localStorage.removeItem("rv-docs-theme"); } catch (e) {} },
  };
  function applyTheme(v) {
    if (v) root.dataset.theme = v; else delete root.dataset.theme;
    $$("[data-theme-set]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.themeSet === v)));
  }
  applyTheme(store.get());
  $$("[data-theme-set]").forEach((b) => b.addEventListener("click", () => { store.set(b.dataset.themeSet); applyTheme(b.dataset.themeSet); }));

  /* Copy helpers with a toast */
  const copied = $(".copied"), copiedMsg = $("[data-copied-msg]");
  let copiedTimer;
  async function copy(text, label) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
      ta.select(); try { document.execCommand("copy"); } catch (_) {} ta.remove();
    }
    copiedMsg.textContent = label;
    copied.classList.add("is-on");
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => copied.classList.remove("is-on"), 1800);
  }
  document.addEventListener("click", (e) => {
    const sw = e.target.closest("[data-copy]");
    if (sw) return copy(sw.dataset.copy, `Copied ${sw.dataset.copy}`);
    const code = e.target.closest("[data-copy-code]");
    if (code) {
      const text = code.closest(".code").querySelector("pre").innerText;
      copy(text, "Copied code");
      code.textContent = "Copied"; setTimeout(() => (code.textContent = "Copy"), 1500);
      return;
    }
    const ic = e.target.closest("[data-copy-svg]");
    if (ic) {
      const tpl = $("#icon-sources");
      const src = tpl && tpl.content.querySelector(`[data-icon="${ic.dataset.copySvg}"]`);
      if (src) copy(src.value, `Copied ${ic.dataset.copySvg}.svg`);
    }
  });

  /* Component demos: theme, width and code panel per stage */
  $$("[data-demo]").forEach((demo) => {
    const stage = $(".demo__stage", demo), frame = $(".demo__frame", demo), code = $(".demo__code", demo);
    $$("[data-stage-theme]", demo).forEach((b) => b.addEventListener("click", () => {
      const v = b.dataset.stageTheme;
      if (v) stage.dataset.theme = v; else delete stage.dataset.theme;
      $$("[data-stage-theme]", demo).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    }));
    $$("[data-stage-width]", demo).forEach((b) => b.addEventListener("click", () => {
      frame.classList.toggle("is-phone", b.dataset.stageWidth === "phone");
      $$("[data-stage-width]", demo).forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    }));
    const cb = $("[data-toggle-code]", demo);
    cb.addEventListener("click", () => {
      const open = code.hidden;
      code.hidden = !open;
      cb.setAttribute("aria-expanded", String(open));
    });
  });

  /* Sidebar search */
  const search = $("[data-search]");
  const links = $$("[data-nav]");
  const empty = $(".search__empty");
  function filter() {
    const q = search.value.trim().toLowerCase();
    let any = false;
    $$(".navgroup").forEach((g) => {
      const groupHit = $(".navgroup__title", g).textContent.toLowerCase().includes(q);
      let shown = 0;
      $$("li", g).forEach((li) => {
        const hit = !q || groupHit || li.textContent.toLowerCase().includes(q);
        li.hidden = !hit; if (hit) shown++;
      });
      g.hidden = shown === 0; if (shown) any = true;
    });
    empty.hidden = any;
  }
  search.addEventListener("input", filter);
  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { const first = links.find((a) => !a.closest("li").hidden && !a.closest(".navgroup").hidden); if (first) { first.click(); search.blur(); } }
    if (e.key === "Escape") { search.value = ""; filter(); search.blur(); }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); openNav(); search.focus(); }
  });

  /* Mobile drawer */
  const sidebar = $("#sidebar"), scrim = $(".sidebar-scrim"), opener = $("[data-nav-open]");
  function openNav() { if (getComputedStyle(opener.parentElement).display === "none") return; sidebar.classList.add("is-open"); scrim.hidden = false; opener.setAttribute("aria-expanded", "true"); }
  function closeNav() { sidebar.classList.remove("is-open"); scrim.hidden = true; opener.setAttribute("aria-expanded", "false"); }
  opener.addEventListener("click", openNav);
  scrim.addEventListener("click", closeNav);
  links.forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });

  /* Scroll spy */
  const byId = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  let current;
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const a = byId.get(en.target.id);
      if (!a || a === current) return;
      if (current) current.removeAttribute("aria-current");
      a.setAttribute("aria-current", "true");
      current = a;
      const nav = $(".sidebar__nav");
      const r = a.getBoundingClientRect(), n = nav.getBoundingClientRect();
      if (r.top < n.top || r.bottom > n.bottom) a.scrollIntoView({ block: "nearest" });
    });
  }, { rootMargin: "-20% 0px -70% 0px" });
  $$("[data-section]").forEach((s) => spy.observe(s));
})();
