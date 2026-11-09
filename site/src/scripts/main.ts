// Page behaviour, progressive: every element here works or stays readable without scripting.
import { renderStatus } from "./status";

const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const wide = () => window.matchMedia("(min-width: 48rem)").matches;

/* ---------- Status of the stations ---------- */
renderStatus();
window.setInterval(renderStatus, 60_000);

/* ---------- Header hairline on scroll ---------- */
const header = document.querySelector<HTMLElement>("[data-header]");
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    header?.classList.toggle("is-scrolled", window.scrollY > 4);
    ticking = false;
  });
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ---------- Call sheet (effect 3) ---------- */
const sheet = document.querySelector<HTMLDialogElement>("#call-sheet");
let opener: HTMLElement | null = null;

function placeSheet(btn: HTMLElement) {
  if (!sheet) return;
  if (!wide()) { sheet.style.removeProperty("--sheet-x"); sheet.style.removeProperty("--sheet-y"); return; }
  const r = btn.getBoundingClientRect();
  const w = Math.min(352, window.innerWidth - 32);
  const x = Math.max(16, Math.min(r.right - w, window.innerWidth - w - 16));
  let y = r.bottom + 8;
  if (y + 260 > window.innerHeight) y = Math.max(16, r.top - 8 - 260);
  sheet.style.setProperty("--sheet-x", `${x}px`);
  sheet.style.setProperty("--sheet-y", `${y}px`);
}

function openSheet(btn: HTMLElement) {
  if (!sheet || sheet.open) return;
  opener = btn;
  placeSheet(btn);
  sheet.showModal();
  btn.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => sheet.classList.add("is-open"));
  sheet.querySelector<HTMLElement>(".sheet__city")?.focus();
}

function closeSheet(returnFocus = true) {
  if (!sheet || !sheet.open) return;
  sheet.classList.remove("is-open");
  opener?.setAttribute("aria-expanded", "false");
  const done = () => {
    sheet.close();
    if (returnFocus) opener?.focus();
  };
  if (reduce()) done(); else window.setTimeout(done, 160);
}

document.querySelectorAll<HTMLAnchorElement>("[data-call]").forEach((btn) => {
  btn.setAttribute("role", "button");
  btn.setAttribute("aria-expanded", "false");
  btn.addEventListener("click", (e) => { e.preventDefault(); openSheet(btn); });
  btn.addEventListener("keydown", (e) => { if (e.key === " ") { e.preventDefault(); openSheet(btn); } });
});
sheet?.addEventListener("cancel", (e) => { e.preventDefault(); closeSheet(); });
sheet?.addEventListener("click", (e) => { if (e.target === sheet) closeSheet(); });
sheet?.querySelectorAll<HTMLElement>("[data-sheet-close]").forEach((el) =>
  el.addEventListener("click", () => closeSheet(!(el instanceof HTMLAnchorElement))),
);
window.addEventListener("resize", () => { if (sheet?.open && opener) placeSheet(opener); });

/* ---------- Mobile menu ---------- */
const menu = document.querySelector<HTMLElement>("[data-menu]");
const menuBtn = document.querySelector<HTMLButtonElement>("[data-menu-open]");
function setMenu(open: boolean) {
  if (!menu || !menuBtn) return;
  menu.hidden = !open;
  menuBtn.setAttribute("aria-expanded", String(open));
  document.documentElement.style.overflow = open ? "hidden" : "";
  if (open) menu.querySelector<HTMLElement>(".menu__close")?.focus();
  else menuBtn.focus({ preventScroll: true });
}
menuBtn?.addEventListener("click", () => setMenu(true));
menu?.querySelectorAll("[data-menu-close]").forEach((el) => el.addEventListener("click", () => setMenu(false)));
menu?.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
  if (e.key === "Tab") {
    const f = [...menu.querySelectorAll<HTMLElement>("a[href], button, [tabindex='0']")];
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
  }
});

/* ---------- Current section in the nav ---------- */
const navLinks = [...document.querySelectorAll<HTMLAnchorElement>(".header__nav a[href^='#']")];
const sections = navLinks.map((a) => document.querySelector<HTMLElement>(a.hash)).filter((s): s is HTMLElement => !!s);
if ("IntersectionObserver" in window && sections.length) {
  const seen = new Map<Element, boolean>();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => seen.set(e.target, e.isIntersecting));
    const current = sections.find((s) => seen.get(s));
    navLinks.forEach((a) => {
      const on = !!current && a.hash === `#${current.id}`;
      a.classList.toggle("is-current", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => io.observe(s));
}

/* ---------- Service groups: open on desktop, collapsible on a phone ---------- */
const groups = [...document.querySelectorAll<HTMLDetailsElement>("[data-group]")];
const syncGroups = () => {
  const desktop = window.matchMedia("(min-width: 64rem)").matches;
  // On a phone the first two groups stay open, so a call from the list is visible without a tap.
  groups.forEach((d, i) => { d.open = desktop || i < 2; });
};
syncGroups();
window.matchMedia("(min-width: 64rem)").addEventListener("change", syncGroups);
groups.forEach((d) => d.querySelector("summary")?.addEventListener("click", (e) => {
  if (window.matchMedia("(min-width: 64rem)").matches) e.preventDefault();
}));

/* ---------- Mobile action bar (effect 4) ---------- */
const bar = document.querySelector<HTMLElement>("[data-bar]");
const hero = document.querySelector("#hero");
const stationsEl = document.querySelector("#stations");
if (bar && hero && stationsEl && "IntersectionObserver" in window) {
  let heroIn = true;
  let stationsIn = false;
  const sync = () => {
    const shown = !heroIn && !stationsIn;
    bar.classList.toggle("is-shown", shown);
    bar.inert = !shown; // off-screen controls leave the tab order
  };
  sync();
  new IntersectionObserver(([e]) => { heroIn = !!e?.isIntersecting; sync(); }).observe(hero);
  new IntersectionObserver(([e]) => { stationsIn = !!e?.isIntersecting; sync(); }, { rootMargin: "0px 0px -30% 0px" }).observe(stationsEl);
}
