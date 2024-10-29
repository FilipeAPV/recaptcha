import { INTERESTS, PREFERRED_LANGUAGES } from "@/lib/constants";
import { z } from "zod";

const languageCodes = PREFERRED_LANGUAGES.map((language) => language.code) as [
  string,
  ...string[]
];

export const newsletterSubscriptionFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  preferredLanguage: z.enum(languageCodes, {
    errorMap: () => ({ message: "Invalid preferred language" }),
  }),
  interests: z
    .array(z.enum(INTERESTS))
    .min(1, { message: "At least one interest must be chosen" })
    .max(5, { message: "You can choose up to 5 interests" }),
  isAgreed: z.boolean().refine((valueToValidate) => valueToValidate, {
    message: "You must agree to the privacy policy",
  }),
});
