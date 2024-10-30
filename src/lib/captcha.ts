import { URL_VERIFY_CAPTCHA_TOKEN } from "@/lib/constants";
import { CaptchaV2Response, CaptchaV3Response } from "@/types";

export const getCaptchaV3Token = async () => {
  const siteKey = process.env.NEXT_PUBLIC_CAPTCHA_V3_SITE_KEY;

  return new Promise<string | null>((resolve) => {
    grecaptcha.ready(async () => {
      if (!siteKey) {
        resolve(null);
        return;
      }
      const token = await grecaptcha.execute(siteKey, {
        action: "submitNewsletterForm",
      });
      resolve(token);
    });
  });
};

export const verifyCaptchaV2Token = async (token: string) => {
  const secretKey = process.env.CAPTCHA_V2_SECRET_KEY;

  if (!secretKey) {
    throw new Error("CaptchaV2 secret key is required");
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

  const captchaData: CaptchaV2Response = await response.json();

  return captchaData;
};

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
