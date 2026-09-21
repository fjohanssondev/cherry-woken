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
  id: string;
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
  metaDescription:
    "Hela menyn för Cherry Woken i Sundsvall – thailändskt och kinesiskt kök som wokas på beställning. Se dagens lunch, priser och rätter, ät här eller hämta.",
  logogram: "紅燈籠",
  searchPlaceholder: "Sök rätt, nummer eller sås",
  legend: "1–3 chili · besökarnas röster på styrkan",
  legendInfo:
    "Styrkan på rätterna är helt och hållet besökarnas egna bedömning — rösta själv genom att sätta 1–3 chili på en rätt. Det är alltså inte restaurangens officiella uppgift.",
  hours: {
    label: "Öppettider",
    weekday: { day: "Tis – fre", time: "11.00 - 20.00" },
    weekend: { day: "Lör – sön", time: "12.00 - 20.00" },
  },
  lunch: {
    label: "Dagens lunch",
    note: "dryck ingår",
    hours: { day: "Tis – fre", time: "11.00 - 14.00" },
  },
  order: {
    label: "Beställ & hämta",
    phone: "060 - 740 47 52",
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
    phone: "060 - 740 47 52",
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
      { id: "d01", no: 1, name: "Vietnamesiska vårrullar (2 st)", price: 40 },
      {
        id: "d02",
        no: 2,
        name: "Vegetariska vårrullar (8 st)",
        price: 40,
        tags: ["vegetariskt"],
      },
      { id: "d03", no: 3, name: "Pekingsoppa", price: 60 },
      { id: "d04", no: 4, name: "Tom yum soppa", price: 60 },
      { id: "d05", no: 5, name: "Räkchips", price: 40, tags: ["skaldjur"] },
    ],
  },
  {
    id: "vegetariskt",
    title: "Vegetariskt",
    span: "half",
    dishes: [
      {
        id: "d06",
        no: 51,
        name: "Wokade grönsaker m. tofu",
        price: 110,
        tags: ["vegetariskt"],
      },
      {
        id: "d07",
        no: 52,
        name: "Wokade äggnudlar m. grönsaker",
        price: 110,
        tags: ["vegetariskt"],
      },
      {
        id: "d08",
        no: 53,
        name: "Stekris m. grönsaker",
        description: "Innehåller ägg",
        price: 110,
        tags: ["vegetariskt"],
      },
      {
        id: "d09",
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
        id: "d10",
        no: 6,
        name: "Thailändska fyra små rätter",
        description:
          "1 vårrulle · kyckling m. grönsaker & vitlökchili · kyckling m. jordnötssås · friterade räkor",
        price: 140,
        tags: ["kyckling", "skaldjur"],
      },
      { id: "d11", no: 7, name: "Kyckling m. jordnötssås", price: 110, tags: ["kyckling"] },
      { id: "d12", no: 8, name: "Szechuen biff (stark)", price: 110, tags: ["biff"] },
      { id: "d13", no: 9, name: "Räkor m. vitlökchili", price: 130, tags: ["skaldjur"] },
      { id: "d14", no: 10, name: "Räkor m. barbecuesås", price: 130, tags: ["skaldjur"] },
      {
        id: "d15",
        no: 11,
        name: "Räkor m. massamancurry & cashewnötter",
        price: 130,
        tags: ["skaldjur"],
      },
      { id: "d16", no: 12, name: "Räkor m. rödcurry", price: 130, tags: ["skaldjur"] },
      {
        id: "d17",
        no: 13,
        name: "Räkor m. bambuskott & champinjoner",
        price: 130,
        tags: ["skaldjur"],
      },
      { id: "d18", no: 14, name: "Kyckling m. gröncurry", price: 110, tags: ["kyckling"] },
      { id: "d19", no: 15, name: "Kyckling m. rödcurry", price: 110, tags: ["kyckling"] },
      { id: "d20", no: 16, name: "Kyckling m. gulcurry", price: 110, tags: ["kyckling"] },
      { id: "d21", no: 17, name: "Kyckling m. panangcurry", price: 110, tags: ["kyckling"] },
      {
        id: "d22",
        no: 18,
        name: "Kyckling m. massamancurry & cashewnötter",
        price: 115,
        tags: ["kyckling"],
      },
      {
        id: "d23",
        no: 19,
        name: "Kyckling m. vitlökchili & cashewnötter",
        price: 115,
        tags: ["kyckling"],
      },
      { id: "d24", no: 20, name: "Kyckling m. chilipasta", price: 110, tags: ["kyckling"] },
      {
        id: "d25",
        no: 21,
        name: "Stekris med kyckling",
        description: "Innehåller ägg",
        price: 115,
        tags: ["kyckling"],
      },
      {
        id: "d26",
        no: 22,
        name: "Stekta äggnudlar med kyckling",
        price: 115,
        tags: ["kyckling"],
      },
      { id: "d27", no: 23, name: "Biff m. vitlökchili", price: 110, tags: ["biff"] },
      {
        id: "d28",
        no: 24,
        name: "Biff m. massamancurry & cashewnötter",
        price: 115,
        tags: ["biff"],
      },
      { id: "d29", no: 25, name: "Biff m. panangcurry", price: 110, tags: ["biff"] },
      { id: "d30", no: 26, name: "Biff m. rödcurry", price: 110, tags: ["biff"] },
      {
        id: "d31",
        no: 27,
        name: "Szechuen kyckling (stark)",
        price: 110,
        tags: ["kyckling"],
      },
      {
        id: "d32",
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
        id: "d33",
        no: 29,
        name: "Kinesiska fyra små rätter",
        description:
          "Biff m. bambuskott & champinjoner · kyckling m. jordnötssås · friterad kyckling · friterade räkor",
        price: 140,
        tags: ["biff", "kyckling", "skaldjur"],
      },
      { id: "d34", no: 30, name: "Kyckling m. hoisinsås", price: 110, tags: ["kyckling"] },
      {
        id: "d35",
        no: 31,
        name: "Kyckling m. bambuskott & champinjoner",
        price: 110,
        tags: ["kyckling"],
      },
      { id: "d36", no: 32, name: "Kyckling m. kinesisk curry", price: 110, tags: ["kyckling"] },
      { id: "d37", no: 33, name: "Kyckling m. ananas", price: 110, tags: ["kyckling"] },
      { id: "d38", no: 34, name: "Kyckling m. barbecuesås", price: 110, tags: ["kyckling"] },
      {
        id: "d39",
        no: 35,
        name: "Kyckling m. grönsaker & jordnötssås",
        price: 110,
        tags: ["kyckling"],
      },
      {
        id: "d40",
        no: 36,
        name: "Friterad kyckling m. sötsursås",
        price: 110,
        tags: ["kyckling"],
      },
      {
        id: "d41",
        no: 37,
        name: "Friterade räkor m. sötsursås",
        price: 130,
        tags: ["skaldjur"],
      },
      { id: "d42", no: 38, name: "Friterad fläskfilé m. sötsursås", price: 110 },
      { id: "d43", no: 39, name: "Kyckling m. ostronsås", price: 110, tags: ["kyckling"] },
      {
        id: "d44",
        no: 40,
        name: "Biff m. vitlökchili & cashewnötter",
        price: 115,
        tags: ["biff"],
      },
      {
        id: "d45",
        no: 41,
        name: "Biff m. bambuskott & champinjoner",
        price: 110,
        tags: ["biff"],
      },
      { id: "d46", no: 42, name: "Biff m. lök & purjolök", price: 110, tags: ["biff"] },
      { id: "d47", no: 43, name: "Biff m. hoisinsås", price: 110, tags: ["biff"] },
      { id: "d48", no: 44, name: "Biff m. lök", price: 110, tags: ["biff"] },
      { id: "d49", no: 45, name: "Biff m. barbecuesås", price: 110, tags: ["biff"] },
      { id: "d50", no: 46, name: "Biff m. tomat", price: 110, tags: ["biff"] },
      { id: "d51", no: 47, name: "Stekta äggnudlar m. biff", price: 115, tags: ["biff"] },
      {
        id: "d52",
        no: 48,
        name: "Stekris m. biff",
        description: "Innehåller ägg",
        price: 115,
        tags: ["biff"],
      },
      { id: "d53", no: 49, name: "Anka m. ananas", price: 130 },
      { id: "d54", no: 50, name: "Anka m. hoisinsås", price: 130 },
    ],
  },
  {
    id: "special",
    title: "Specialrätter",
    span: "half",
    dishes: [
      {
        id: "d55",
        no: 55,
        name: "Szechuen Deluxe",
        description: "Biff, kyckling & räkor",
        price: 130,
        tags: ["biff", "kyckling", "skaldjur"],
      },
      {
        id: "d56",
        no: 56,
        name: "Phad Thai Deluxe",
        description: "Biff, kyckling & räkor",
        price: 130,
        tags: ["biff", "kyckling", "skaldjur"],
      },
      {
        id: "d57",
        no: 57,
        name: "Stekris Deluxe",
        description: "Biff, kyckling & räkor",
        price: 130,
        tags: ["biff", "kyckling", "skaldjur"],
      },
      {
        id: "d58",
        no: 58,
        name: "Stekta äggnudlar Deluxe",
        description: "Biff, kyckling & räkor",
        price: 130,
        tags: ["biff", "kyckling", "skaldjur"],
      },
      {
        id: "d59",
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
      { id: "d60", name: "Extra ris", price: 25 },
      { id: "d61", name: "Extra grönsaker", price: 35 },
      { id: "d62", name: "Extra kött", price: 40 },
      { id: "d63", name: "Extra jordnötssås el. sötsursås", price: 25 },
      { id: "d64", name: "Läsk 33 cl", price: 15 },
      { id: "d65", name: "Läsk 1,5 l", price: 40 },
    ],
  },
];
