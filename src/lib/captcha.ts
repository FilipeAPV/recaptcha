import { CaptchaResponse } from "@/types";

export const getCaptchaToken = async () => {
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

export const verifyCaptchaToken = async (token: string) => {
  const secretKey = process.env.CAPTCHA_V3_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Captcha secret key is required");
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

  const captchaData: CaptchaResponse = await response.json();
  return captchaData;
};
