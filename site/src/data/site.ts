// Facts for the homepage. Source: veon/client.json (company.contacts, business_lines, products_services, socials).
// Nothing here is invented: when a fact changes, change client.json first, then this file.

export type Hours = { open: number; close: number } | null; // minutes from midnight, Kyiv time

export interface Phone { tel: string; label: string }

export interface Station {
  id: "kyiv" | "lviv";
  city: string;
  district: string;
  address: string;
  mapQuery: string;
  phones: Phone[];
  email: string;
  /** Monday first, Sunday last. */
  week: Hours[];
  /** Schedule as plain text, shown when scripting is off. */
  scheduleText: string;
  note?: string;
}

const h = (open: number, close: number): Hours => ({ open: open * 60, close: close * 60 });

export const stations: Station[] = [
  {
    id: "kyiv",
    city: "Київ",
    district: "Борщагівка",
    address: "пр-т Корольова, 11/1",
    mapQuery: "Автопан, проспект Корольова, 11/1, Київ",
    phones: [
      { tel: "+380986232112", label: "098 623 21 12" },
      { tel: "+380936932112", label: "093 693 21 12" },
      { tel: "+380956932112", label: "095 693 21 12" },
    ],
    email: "zakaz@avtopan.ua",
    week: [h(8, 20), h(8, 20), h(8, 20), h(8, 20), h(8, 20), h(9, 18), h(9, 18)],
    scheduleText: "Пн–Пт 8:00–20:00, Сб–Нд 9:00–18:00",
    note: "Крім святкових днів",
  },
  {
    id: "lviv",
    city: "Львів",
    district: "Сигнівка",
    address: "вул. Грузинська, 25",
    mapQuery: "Автопан, вулиця Грузинська, 25, Львів",
    phones: [{ tel: "+380636932112", label: "063 693 21 12" }],
    email: "lviv@avtopan.ua",
    week: [h(9, 18), h(9, 18), h(9, 18), h(9, 18), h(9, 18), h(9, 18), null],
    scheduleText: "Пн–Сб 9:00–18:00, Нд вихідний",
  },
];

export const mapUrl = (s: Station) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.mapQuery)}`;

export const messengers = {
  viber: "viber://chat?number=380982277887",
  telegram: "https://t.me/bosch_avtopan",
};

export const socials = [
  { name: "Instagram", url: "https://www.instagram.com/avtopan_sto/" },
  { name: "Facebook", url: "https://www.facebook.com/bosch.avtopan" },
  { name: "YouTube", url: "https://www.youtube.com/@stoavtopan" },
];

export const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];
export const daysFull = ["Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота", "Неділя"];

export const fmt = (min: number) => `${Math.floor(min / 60)}:${String(min % 60).padStart(2, "0")}`;

export const vehicles = [
  {
    id: "cars",
    title: "Легкові",
    text: "Техобслуговування та ремонт легкових автомобілів.",
  },
  {
    id: "vans",
    title: "Мікроавтобуси, буси, фургони",
    text: "Ремонт та обслуговування комерційних авто, які щодня в роботі.",
  },
  {
    id: "trucks",
    title: "Вантажівки й малотоннажки",
    text: "Окремий цех обслуговування та ремонту вантажних авто і малотоннажок.",
  },
] as const;

export const serviceGroups = [
  { title: "Діагностика і ТО", text: "Комп'ютерна діагностика та діагностика агрегатів, планове ТО, заміна масла двигуна." },
  { title: "Двигун, ГБЦ, ГРМ", text: "Ремонт двигуна і головки блоку циліндрів, заміна ГРМ, очистка двигуна воднем." },
  { title: "Коробка передач і зчеплення", text: "Ремонт та обслуговування АКПП і МКПП, ремонт зчеплення." },
  { title: "Ходова, гальма, кермо", text: "Ремонт ходової, гальмівної системи та рульового управління, розвал-сходження." },
  { title: "Автоелектрика", text: "Роботи автоелектрика, ремонт стартера та генератора." },
  { title: "Паливна, вихлопна системи, охолодження й обігрів", text: "Ремонт паливної та вихлопної систем, системи охолодження двигуна й обігріву салону." },
  { title: "Кондиціонер", text: "Ремонт і заправка автокондиціонера." },
  { title: "Шини і диски", text: "Шиномонтаж, сезонне зберігання шин та дисків." },
];

export const futureNote = "Розділ у розробці";
