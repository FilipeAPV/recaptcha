import { newsletterSubscriptionFormSchema } from "@/schemas";
import { z } from "zod";

export type NewsletterSubscriptionForm = z.infer<
  typeof newsletterSubscriptionFormSchema
>;

// Error code reference : https://developers.google.com/recaptcha/docs/verify
type CaptchaErrorCode =
  | "missing-input-secret"
  | "invalid-input-secret"
  | "missing-input-response"
  | "invalid-input-response"
  | "bad-request"
  | "timeout-or-duplicate";

export type CaptchaV3Response = {
  success: true | false;
  challenge_ts: Date;
  hostname: string;
  score: number;
  action: string;
  "error-codes"?: CaptchaErrorCode[];
};

export type CaptchaV2Response = {
  success: true | false;
  challenge_ts: Date;
  hostname: string;
  "error-codes"?: CaptchaErrorCode[];
};

export type CaptchaToken = string | null;
export type CaptchaType = "v2" | "v3";

export type NewsletterFormSubmitResponse = {
  success: boolean;
  message: string;
  requiresCaptchaV2?: boolean;
};

export type CaptchaState = {
  isV2Required: boolean;
  v2Token: CaptchaToken | null;
};

export type CaptchaAction =
  | { type: "SET_V2_REQUIRED"; payload: boolean }
  | { type: "SET_V2_TOKEN"; payload: CaptchaToken | null }
  | { type: "RESET" };
