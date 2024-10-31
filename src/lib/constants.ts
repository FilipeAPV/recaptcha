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

export const URL_VERIFY_CAPTCHA_TOKEN =
  "https://www.google.com/recaptcha/api/siteverify";

export const CAPTCHA_TYPE_V2 = "v2";
export const CAPTCHA_TYPE_V3 = "v3";

export const HOSTNAME = "localhost";
export const GRECAPTCHA_EXECUTE_ACTION = "submitNewsletterForm";
