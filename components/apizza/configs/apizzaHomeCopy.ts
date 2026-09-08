export const APIZZA_TITLE = "APizza Austin";

export const APIZZA_SITE_NAME = "apizza austin";
export const APIZZA_OPENING_SOON = "opening soon";
export const APIZZA_COMING_TO_AUSTIN = "apizza is coming to austin";
export const APIZZA_ADDRESS_LINES = [
  "12001 burnet road, suite f",
  "austin, tx 78758",
  "usa",
] as const;

export const APIZZA_ADDRESS_MAP_QUERY =
  "12001 Burnet Road, Suite F, Austin, TX 78758, USA";

export const APIZZA_DIRECTIONS_LABEL = "directions";
export const APIZZA_DIRECTIONS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(APIZZA_ADDRESS_MAP_QUERY)}`;

export const APIZZA_HOURS_LABEL = "hours";

export type ApizzaHoursEntry = {
  day: string;
  hours: string;
};

export const APIZZA_HOURS: readonly ApizzaHoursEntry[] = [
  { day: "mon", hours: "" },
  { day: "tue", hours: "" },
  { day: "wed", hours: "" },
  { day: "thu", hours: "" },
  { day: "fri", hours: "" },
  { day: "sat", hours: "" },
  { day: "sun", hours: "" },
];

export const APIZZA_ABOUT_HEADING = "about us";

export const APIZZA_ABOUT_PARAGRAPHS = [
  "austin, get ready. apizza is coming. 🔥🍕",
  "founded in late 2019 in san francisco, apizza was born with one simple obsession: make insanely good pizza that’s fast, affordable, and made with ingredients you can actually feel good about.",
  "we bake every pizza in just 90 seconds using professional u.s.-made equipment — because great things shouldn’t make you wait. order it, grab it, devour it. that simple.",
  "our dough? that’s where the magic starts. we partner directly with Central Milling, the premier organic flour mill in the u.s., giving us vertically integrated, farm-to-plate quality. translation: better flour, better crust, better pizza. period.",
  "we use high-quality, locally sourced ingredients whenever possible — because flavor matters, and so does integrity.",
  "flat or folded (we don’t judge), your apizza comes in 100% compostable packaging — sustainable box or kraft bag — so you can love the planet while loving your slice.",
  "apizza isn’t just pizza. it’s bold. it’s warm. it’s approachable. premium without the attitude. quality without the crazy price.",
  "austin, we can’t wait to feed you.",
  "stay hungry. we’re opening soon. 🚀",
] as const;

export const APIZZA_COPYRIGHT = "© 2035 by apizza austin.";

export const APIZZA_APIZZZA_HEADING = "apizza";
export const APIZZA_NAV_APIZZZA = APIZZA_APIZZZA_HEADING;
export const APIZZA_NAV_WELCOME = "welcome";
export const APIZZA_NAV_LABEL = "site";
export const APIZZA_HERO_IMAGE_ALT = "Gros plan d'une pizza au fromage";

export type ApizzaHeroLayout = "split" | "stack" | "inset";
export const APIZZA_HERO_LAYOUT: ApizzaHeroLayout = "split";

export const APIZZA_HERO_IMAGE = {
  src: "/apizza/hero-pizza.jpg",
  alt: APIZZA_HERO_IMAGE_ALT,
} as const;

export const APIZZA_SOCIAL_BAR_LABEL = "social bar";
export const APIZZA_SOCIAL_ITEMS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/apizzaforeveryone/",
    src: "/apizza/social-instagram.png",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/apizzaforeveryone/",
    src: "/apizza/social-facebook.png",
  },
] as const;
