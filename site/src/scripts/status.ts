// Today's hours and «відчинено / зачинено» for each station, by Kyiv time from the schedule in src/data/site.ts.
// Without scripting the plates show the full weekly schedule instead (concept §8.5).
import { stations, fmt, type Hours } from "../data/site";

const dayWords = ["у понеділок", "у вівторок", "у середу", "у четвер", "у п'ятницю", "у суботу", "у неділю"];

function kyivNow(): { day: number; min: number } {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Kyiv", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(get("weekday"));
  return { day: day < 0 ? 0 : day, min: Number(get("hour")) * 60 + Number(get("minute")) };
}

function statusFor(week: Hours[], day: number, min: number): { open: boolean; text: string } {
  const today = week[day];
  if (today && min >= today.open && min < today.close) return { open: true, text: `Відчинено до ${fmt(today.close)}` };
  if (today && min < today.open) return { open: false, text: `Зачинено, відкриємо о ${fmt(today.open)}` };
  for (let i = 1; i <= 7; i += 1) {
    const d = (day + i) % 7;
    const next = week[d];
    if (next) return { open: false, text: `Зачинено, відкриємо ${i === 1 ? "завтра" : dayWords[d]} о ${fmt(next.open)}` };
  }
  return { open: false, text: "Зачинено" };
}

export function renderStatus(): void {
  const { day, min } = kyivNow();
  for (const s of stations) {
    const today = s.week[day];
    document.querySelectorAll<HTMLElement>(`[data-today="${s.id}"]`).forEach((el) => {
      el.textContent = today ? `Сьогодні ${fmt(today.open)}–${fmt(today.close)}` : "Сьогодні вихідний";
    });
    const st = statusFor(s.week, day, min);
    document.querySelectorAll<HTMLElement>(`[data-status="${s.id}"]`).forEach((el) => {
      el.textContent = st.text;
      el.classList.toggle("is-open", st.open);
      el.hidden = false;
    });
    document.querySelectorAll<HTMLElement>(`[data-week="${s.id}"] [data-day="${day}"]`).forEach((el) => {
      el.classList.add("is-today");
      el.setAttribute("aria-current", "date");
    });
  }
}
