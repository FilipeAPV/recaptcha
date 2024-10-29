"use server";

import { CaptchaV2Response } from "@/types";

export const verifyCaptchaV2Token = async (token: string) => {
  const secretKey = process.env.CAPTCHA_V2_SECRET_KEY;
  console.log(secretKey);
  if (!secretKey) {
    throw new Error("CaptchaV2 secret key is required");
  }
  const url = new URL("https://www.google.com/recaptcha/api/siteverify");
  url.searchParams.append("secret", secretKey);
  url.searchParams.append("response", token);

  const response = await fetch(url, {
    method: "POST",
  });

  if (!response.ok) {
    return null;
  }

  const captchaData: CaptchaV2Response = await response.json();

  return captchaData;
};
