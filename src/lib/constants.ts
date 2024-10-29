// "as const" asserts that INTERESTS is a readonly tuple, not a mutable array.
export const PREFERRED_LANGUAGES = [
  { name: "English", code: "en" },
  { name: "French", code: "fr" },
  { name: "German", code: "de" },
  { name: "Italian", code: "it" },
  { name: "Spanish", code: "es" },
] as const;

export const INTERESTS = [
  "Bike",
  "Running",
  "Travel",
  "Wintersports",
  "Motosports",
] as const;
