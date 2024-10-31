"use server";

import { verifyCaptchaV3Token, verifyCaptchaV2Token } from "@/lib/captcha";
import {
  CAPTCHA_TYPE_V2,
  CAPTCHA_TYPE_V3,
  GRECAPTCHA_EXECUTE_ACTION,
  HOSTNAME,
} from "@/lib/constants";
import {
  CaptchaToken,
  CaptchaType,
  NewsletterFormSubmitResponse,
  NewsletterSubscriptionForm,
} from "@/types";

type NewsletterFormSubmitProps = {
  captchaToken: CaptchaToken;
  captchaType: CaptchaType;
  formValues: NewsletterSubscriptionForm;
};

export const newsletterFormSubmit = async ({
  captchaToken,
  captchaType,
  formValues,
}: NewsletterFormSubmitProps): Promise<NewsletterFormSubmitResponse> => {
  if (!captchaToken) {
    return { success: false, message: "Captcha token is required" };
  }

  let captchaValidationResult: NewsletterFormSubmitResponse;

  if (captchaType === CAPTCHA_TYPE_V3) {
    captchaValidationResult = await validateCaptchaV3(captchaToken);
  } else if (captchaType === CAPTCHA_TYPE_V2) {
    captchaValidationResult = await validateCaptchaV2(captchaToken);
  } else {
    return { success: false, message: "Invalid captcha type." };
  }

  if (!captchaValidationResult.success) {
    return captchaValidationResult;
  }

  //Persist the form data
  console.log("Form data:", formValues);

  return {
    success: true,
    message: "Successfully subscribed to newsletter",
  };
};

async function validateCaptchaV3(
  captchaToken: string
): Promise<NewsletterFormSubmitResponse> {
  const captchaData = await verifyCaptchaV3Token(captchaToken);

  if (!captchaData) {
    return {
      success: false,
      message: "Captcha verification failed.",
      requiresCaptchaV2: true,
    };
  }

  if (!captchaData.success) {
    return {
      success: false,
      message: "Captcha verification unsuccessful.",
      requiresCaptchaV2: true,
    };
  }

  if (captchaData.hostname !== HOSTNAME) {
    return {
      success: false,
      message: "Invalid captcha token hostname.",
    };
  }

  // https://developers.google.com/recaptcha/docs/v3
  // when you verify the reCAPTCHA response, you should verify that the action name is the name you expect.
  if (captchaData.action !== GRECAPTCHA_EXECUTE_ACTION) {
    return {
      success: false,
      message: "Invalid captcha action.",
    };
  }

  // A score below 0.5 is considered suspicious; prompt for reCAPTCHA v2
  // https://developers.google.com/recaptcha/docs/v3
  if (captchaData.score > 0.5) {
    return {
      success: false,
      message: "Low captcha score.",
      requiresCaptchaV2: true,
    };
  }

  return { success: true, message: "Captcha v3 validation succeeded." };
}

async function validateCaptchaV2(
  captchaToken: string
): Promise<NewsletterFormSubmitResponse> {
  const captchaData = await verifyCaptchaV2Token(captchaToken);

  if (!captchaData) {
    return {
      success: false,
      message: "Captcha verification failed.",
    };
  }

  if (!captchaData.success) {
    return {
      success: false,
      message: "Captcha verification unsuccessful.",
    };
  }

  return { success: true, message: "Captcha v2 validation succeeded." };
}
