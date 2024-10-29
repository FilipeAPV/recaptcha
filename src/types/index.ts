import { newsletterSubscriptionFormSchema } from "@/schemas";
import { z } from "zod";

export type NewsletterSubscriptionForm = z.infer<
  typeof newsletterSubscriptionFormSchema
>;
