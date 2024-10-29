import { CaptchaV3Response } from "@/types";

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
