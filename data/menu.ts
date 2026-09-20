/**
 * Single source of truth for the menu page.
 *
 * Everything the page renders — brand copy, opening hours, contact details and
 * every dish — lives here. Edit this file to change the site; no component code
 * needs to be touched. Placeholder values are written in [BRACKETS] so they are
 * easy to spot and replace with the real details.
 */

export type CategoryId =
  | "allt"
  | "kyckling"
  | "biff"
  | "skaldjur"
  | "vegetariskt"
  | "starkt";

/** Tags a dish can carry (everything except the synthetic "allt"/"starkt"). */
export type DishTag = Exclude<CategoryId, "allt" | "starkt">;

export type Category = {
  id: CategoryId;
  label: string;
};

export type Dish = {
  /** Menu number. Extras and drinks are unnumbered. */
  no?: number;
  name: string;
  description?: string;
  /** Price in Swedish kronor. */
  price: number;
  /** Cross-cutting tags used by the category filter. */
  tags?: DishTag[];
};

export type MenuSection = {
  id: string;
  title: string;
  /** Chinese caption shown beside the heading, e.g. 泰式. */
  chinese?: string;
  /** "full" spans both columns and flows its dishes in two sub-columns. */
  span?: "half" | "full";
  dishes: Dish[];
};

export const categories: Category[] = [
  { id: "allt", label: "Allt" },
  { id: "kyckling", label: "Kyckling" },
  { id: "biff", label: "Biff" },
  { id: "skaldjur", label: "Skaldjur" },
  { id: "vegetariskt", label: "Vegetariskt" },
  { id: "starkt", label: "Starkt" },
];

export const site = {
  name: "Cherry Woken",
  kicker: "Thai & kinesisk restaurang · Sundsvall",
  tagline:
    "Thailändskt och kinesiskt kök. Allt wokas när ni beställer — ät här eller ta med hem.",
  logogram: "紅燈籠",
  searchPlaceholder: "Sök rätt, nummer eller sås",
  legend: "1–3 chili · besökarnas röster på styrkan",
  legendInfo:
    "Styrkan på rätterna är helt och hållet besökarnas egna bedömning — rösta själv genom att sätta 1–3 chili på en rätt. Det är alltså inte restaurangens officiella uppgift.",
  hours: {
    label: "Öppettider",
    weekday: "11.00 - 20.00",
    weekend: "12.00 - 20.00",
  },
  lunch: {
    label: "Dagens lunch",
    hours: "Mån–fre 11–14",
    included: "Dryck ingår",
  },
  order: {
    label: "Beställ & hämta",
    phone: "070 - 740 47 52",
    address: "Norrmalmsgatan 4, 852 34 Sundsvall",
  },
  allergyNote:
    "Fråga gärna om allergier innan ni beställer — i Cherry Wokens kök finns jordnötter, ägg, soja, skaldjur och gluten.",
  review: {
    title: "Något som kan bli bättre på sidan?",
    body: "Hittade du ett fel i menyn eller något som skaver på webbplatsen? Skicka en rad, så blir sidan bättre.",
    cta: "Lämna feedback",
  },
  takeaway: {
    label: "Hämtmat",
    body: "Ring och beställ för avhämtning, så står maten förmodligen klar när ni kommer.",
  },
  find: {
    label: "Hitta hit",
    phone: "070 - 740 47 52",
    address: "Norrmalmsgatan 4",
    postal: "852 34",
    city: "Sundsvall",
  },
  priceNote: "Priser i kronor",
  disclaimer: {
    text: "Denna sida är inte på något sätt associerad med Cherry Woken. Den drivs helt och hållet fristående.",
    authorLabel: "Skapad av",
    author: "@fjohanssondev",
  },
} as const;

export const menu: MenuSection[] = [
  {
    id: "forratter",
    title: "Förrätter",
    span: "half",
    dishes: [
      { no: 1, name: "Vietnamesiska vårrullar (2 st)", price: 40 },
      {
        no: 2,
        name: "Vegetariska vårrullar (8 st)",
        price: 40,
        tags: ["vegetariskt"],
      },
      { no: 3, name: "Pekingsoppa", price: 60 },
      { no: 4, name: "Tom yum soppa", price: 60 },
      { no: 5, name: "Räkchips", price: 40, tags: ["skaldjur"] },
    ],
  },
  {
    id: "vegetariskt",
    title: "Vegetariskt",
    span: "half",
    dishes: [
      {
        no: 51,
        name: "Wokade grönsaker m. tofu",
        price: 110,
        tags: ["vegetariskt"],
      },
      {
        no: 52,
        name: "Wokade äggnudlar m. grönsaker",
        price: 110,
        tags: ["vegetariskt"],
      },
      {
        no: 53,
        name: "Stekris m. grönsaker",
        description: "Innehåller ägg",
        price: 110,
        tags: ["vegetariskt"],
      },
      {
        no: 54,
        name: "Grönsaker m. curry",
        description: "Välj mellan massaman, panang, röd, grön eller gulcurry",
        price: 110,
        tags: ["vegetariskt"],
      },
    ],
  },
  {
    id: "thai",
    title: "Thailändska varmrätter",
    chinese: "泰式",
    span: "full",
    dishes: [
      {
        no: 6,
        name: "Thailändska fyra små rätter",
        description:
          "1 vårrulle · kyckling m. grönsaker & vitlökchili · kyckling m. jordnötssås · friterade räkor",
        price: 140,
        tags: ["kyckling", "skaldjur"],
      },
      { no: 7, name: "Kyckling m. jordnötssås", price: 110, tags: ["kyckling"] },
      { no: 8, name: "Szechuen biff (stark)", price: 110, tags: ["biff"] },
      { no: 9, name: "Räkor m. vitlökchili", price: 130, tags: ["skaldjur"] },
      { no: 10, name: "Räkor m. barbecuesås", price: 130, tags: ["skaldjur"] },
      {
        no: 11,
        name: "Räkor m. massamancurry & cashewnötter",
        price: 130,
        tags: ["skaldjur"],
      },
      { no: 12, name: "Räkor m. rödcurry", price: 130, tags: ["skaldjur"] },
      {
        no: 13,
        name: "Räkor m. bambuskott & champinjoner",
        price: 130,
        tags: ["skaldjur"],
      },
      { no: 14, name: "Kyckling m. gröncurry", price: 110, tags: ["kyckling"] },
      { no: 15, name: "Kyckling m. rödcurry", price: 110, tags: ["kyckling"] },
      { no: 16, name: "Kyckling m. gulcurry", price: 110, tags: ["kyckling"] },
      { no: 17, name: "Kyckling m. panangcurry", price: 110, tags: ["kyckling"] },
      {
        no: 18,
        name: "Kyckling m. massamancurry & cashewnötter",
        price: 115,
        tags: ["kyckling"],
      },
      {
        no: 19,
        name: "Kyckling m. vitlökchili & cashewnötter",
        price: 115,
        tags: ["kyckling"],
      },
      { no: 20, name: "Kyckling m. chilipasta", price: 110, tags: ["kyckling"] },
      {
        no: 21,
        name: "Stekris med kyckling",
        description: "Innehåller ägg",
        price: 115,
        tags: ["kyckling"],
      },
      {
        no: 22,
        name: "Stekta äggnudlar med kyckling",
        price: 115,
        tags: ["kyckling"],
      },
      { no: 23, name: "Biff m. vitlökchili", price: 110, tags: ["biff"] },
      {
        no: 24,
        name: "Biff m. massamancurry & cashewnötter",
        price: 115,
        tags: ["biff"],
      },
      { no: 25, name: "Biff m. panangcurry", price: 110, tags: ["biff"] },
      { no: 26, name: "Biff m. rödcurry", price: 110, tags: ["biff"] },
      {
        no: 27,
        name: "Szechuen kyckling (stark)",
        price: 110,
        tags: ["kyckling"],
      },
      {
        no: 28,
        name: "Phad Thai m. kyckling",
        description: "Innehåller jordnötter",
        price: 115,
        tags: ["kyckling"],
      },
    ],
  },
  {
    id: "kinesiska",
    title: "Kinesiska varmrätter",
    chinese: "中式",
    span: "full",
    dishes: [
      {
        no: 29,
        name: "Kinesiska fyra små rätter",
        description:
          "Biff m. bambuskott & champinjoner · kyckling m. jordnötssås · friterad kyckling · friterade räkor",
        price: 140,
        tags: ["biff", "kyckling", "skaldjur"],
      },
      { no: 30, name: "Kyckling m. hoisinsås", price: 110, tags: ["kyckling"] },
      {
        no: 31,
        name: "Kyckling m. bambuskott & champinjoner",
        price: 110,
        tags: ["kyckling"],
      },
      { no: 32, name: "Kyckling m. kinesisk curry", price: 110, tags: ["kyckling"] },
      { no: 33, name: "Kyckling m. ananas", price: 110, tags: ["kyckling"] },
      { no: 34, name: "Kyckling m. barbecuesås", price: 110, tags: ["kyckling"] },
      {
        no: 35,
        name: "Kyckling m. grönsaker & jordnötssås",
        price: 110,
        tags: ["kyckling"],
      },
      {
        no: 36,
        name: "Friterad kyckling m. sötsursås",
        price: 110,
        tags: ["kyckling"],
      },
      {
        no: 37,
        name: "Friterade räkor m. sötsursås",
        price: 130,
        tags: ["skaldjur"],
      },
      { no: 38, name: "Friterad fläskfilé m. sötsursås", price: 110 },
      { no: 39, name: "Kyckling m. ostronsås", price: 110, tags: ["kyckling"] },
      {
        no: 40,
        name: "Biff m. vitlökchili & cashewnötter",
        price: 115,
        tags: ["biff"],
      },
      {
        no: 41,
        name: "Biff m. bambuskott & champinjoner",
        price: 110,
        tags: ["biff"],
      },
      { no: 42, name: "Biff m. lök & purjolök", price: 110, tags: ["biff"] },
      { no: 43, name: "Biff m. hoisinsås", price: 110, tags: ["biff"] },
      { no: 44, name: "Biff m. lök", price: 110, tags: ["biff"] },
      { no: 45, name: "Biff m. barbecuesås", price: 110, tags: ["biff"] },
      { no: 46, name: "Biff m. tomat", price: 110, tags: ["biff"] },
      { no: 47, name: "Stekta äggnudlar m. biff", price: 115, tags: ["biff"] },
      {
        no: 48,
        name: "Stekris m. biff",
        description: "Innehåller ägg",
        price: 115,
        tags: ["biff"],
      },
      { no: 49, name: "Anka m. ananas", price: 130 },
      { no: 50, name: "Anka m. hoisinsås", price: 130 },
    ],
  },
  {
    id: "special",
    title: "Specialrätter",
    span: "half",
    dishes: [
      {
        no: 55,
        name: "Szechuen Deluxe",
        description: "Biff, kyckling & räkor",
        price: 130,
        tags: ["biff", "kyckling", "skaldjur"],
      },
      {
        no: 56,
        name: "Phad Thai Deluxe",
        description: "Biff, kyckling & räkor",
        price: 130,
        tags: ["biff", "kyckling", "skaldjur"],
      },
      {
        no: 57,
        name: "Stekris Deluxe",
        description: "Biff, kyckling & räkor",
        price: 130,
        tags: ["biff", "kyckling", "skaldjur"],
      },
      {
        no: 58,
        name: "Stekta äggnudlar Deluxe",
        description: "Biff, kyckling & räkor",
        price: 130,
        tags: ["biff", "kyckling", "skaldjur"],
      },
      {
        no: 59,
        name: "Seafood",
        description: "Bläckfisk, räkor & musslor",
        price: 130,
        tags: ["skaldjur"],
      },
    ],
  },
  {
    id: "tillbehor",
    title: "Tillbehör & dryck",
    span: "half",
    dishes: [
      { name: "Extra ris", price: 25 },
      { name: "Extra grönsaker", price: 35 },
      { name: "Extra kött", price: 40 },
      { name: "Extra jordnötssås el. sötsursås", price: 25 },
      { name: "Läsk 33 cl", price: 15 },
      { name: "Läsk 1,5 l", price: 40 },
    ],
  },
];
