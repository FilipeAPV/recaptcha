"use server";

import { verifyCaptchaV3Token, verifyCaptchaV2Token } from "@/lib/captcha";
import { CAPTCHA_TYPE_V2, CAPTCHA_TYPE_V3 } from "@/lib/constants";
import { CaptchaToken, CaptchaType, NewsletterSubscriptionForm } from "@/types";

type NewsletterFormSubmitProps = {
  captchaToken: CaptchaToken;
  captchaType: CaptchaType;
  formValues: NewsletterSubscriptionForm;
};

export const newsletterFormSubmit = async ({
  captchaToken,
  captchaType,
  formValues,
}: NewsletterFormSubmitProps) => {
  if (!captchaToken) {
    return { success: false, message: "Captcha token is required" };
  }

  if (captchaType === CAPTCHA_TYPE_V3) {
    const captchaData = await verifyCaptchaV3Token(captchaToken);
    if (!captchaData || !captchaData.success) {
      return {
        success: false,
        message: "Captcha verification failed",
        requiresCaptchaV2: true,
      };
    }

    if (captchaData.score > 0.5) {
      return {
        success: false,
        message: "Low captcha score",
        requiresCaptchaV2: true,
      };
    }
  } else if (captchaType === CAPTCHA_TYPE_V2) {
    const captchaData = await verifyCaptchaV2Token(captchaToken);
    if (!captchaData || !captchaData.success) {
      return {
        success: false,
        message: "Captcha verification failed",
      };
    }
  }

  //Persist the form data
  console.log("Form data:", formValues);
  return {
    success: true,
    message: "Successfully subscribed to newsletter",
  };
};
