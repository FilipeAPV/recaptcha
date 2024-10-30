"use server";

import { verifyCaptchaV3Token, verifyCaptchaV2Token } from "@/lib/captcha";
import { NewsletterSubscriptionForm } from "@/types";

type NewsletterFormSubmitProps = {
  captchaV3Token?: string;
  captchaV2Token?: string;
  values: NewsletterSubscriptionForm;
};

export const newsletterFormSubmit = async ({
  captchaV3Token,
  captchaV2Token,
  values,
}: NewsletterFormSubmitProps) => {
  if (!captchaV3Token && !captchaV2Token) {
    return { success: false, message: "Captcha token is required" };
  }

  if (captchaV3Token && !captchaV2Token) {
    const captchaData = await verifyCaptchaV3Token(captchaV3Token);
    if (!captchaData) {
      return { success: false, message: "Unable to verify captcha token" };
    }
    if (!captchaData.success || captchaData.score > 0.5) {
      return {
        success: false,
        message: "Captcha verification failed",
        requiresCaptchaV2: true,
      };
    }
  }

  if (!captchaV3Token && captchaV2Token) {
    const captchaData = await verifyCaptchaV2Token(captchaV2Token);
    if (!captchaData) {
      return { success: false, message: "Unable to verify captcha token" };
    }
    if (!captchaData.success) {
      return {
        success: false,
        message: "Captcha verification failed",
      };
    }
  }

  //Persist the form data
  console.log(values);
  return {
    success: true,
    message: "Successfully subscribed to newsletter",
  };
};
