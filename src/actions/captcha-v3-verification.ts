"use server";

import { URL_VERIFY_CAPTCHA_TOKEN } from "@/lib/constants";
import { CaptchaV3Response } from "@/types";

export const verifyCaptchaV3Token = async (token: string) => {
  const secretKey = process.env.CAPTCHA_V3_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Captcha secret key is required");
  }

  const url = new URL(URL_VERIFY_CAPTCHA_TOKEN);
  url.searchParams.append("secret", secretKey);
  url.searchParams.append("response", token);

  const response = await fetch(url, {
    method: "POST",
  });

  if (!response.ok) {
    return null;
  }

  const captchaData: CaptchaV3Response = await response.json();
  return captchaData;
};
