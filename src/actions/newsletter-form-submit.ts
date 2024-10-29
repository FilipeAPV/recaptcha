"use server";

import { verifyCaptchaV3Token } from "@/lib/captcha";
import { NewsletterSubscriptionForm } from "@/types";

export const newsletterFormSubmit = async (
  token: string | null,
  values: NewsletterSubscriptionForm
) => {
  if (!token) {
    return { success: false, message: "Captcha token is required" };
  }

  // Verify the captcha token
  const captchaData = await verifyCaptchaV3Token(token);
  if (!captchaData) {
    return { success: false, message: "Unable to verify captcha token" };
  }

  if (!captchaData.success || captchaData.score < 0.5) {
    return {
      success: false,
      message: "Captcha verification failed",
      errors: captchaData["error-codes"],
    };
  }

  //Persist the form data
  console.log(values);
  return {
    success: true,
    message: "Successfully registered newsletter preferences!",
  };
};
