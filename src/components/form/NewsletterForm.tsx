"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "../ui/form";
import EmailFormField from "./EmailFormField";
import GenericCheckboxField from "./GenericCheckboxField";
import { Button } from "../ui/button";
import InterestsFormField from "./InterestsFormField";
import PrefLanguageFormField from "./PrefLanguageFormField";
import { newsletterSubscriptionFormSchema } from "@/schemas";
import { NewsletterSubscriptionForm } from "@/types";
import { newsletterFormSubmit } from "@/actions/newsletter-form-submit";
import { getCaptchaV3Token } from "@/lib/captcha";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { verifyCaptchaV2Token } from "@/actions/captcha-v2-verification";
import { verifyCaptchaV3Token } from "@/actions/captcha-v3-verification";

export default function NewsletterForm() {
  const [isCaptchaV2TokenVisible, setIsCaptchaV2TokenVisible] = useState(false);
  const [captchaV2Token, setCaptchaV2Token] = useState(null);
  const recaptchaRef = useRef(null);

  const form = useForm<NewsletterSubscriptionForm>({
    resolver: zodResolver(newsletterSubscriptionFormSchema),
    defaultValues: {
      email: "",
      preferredLanguage: "en",
      interests: [],
      isAgreed: false,
    },
    mode: "all",
  });

  const handleCaptchaChange = (value) => {
    setCaptchaV2Token(value);
  };

  const handleCaptchaV2TokenVisibility = () => {
    setIsCaptchaV2TokenVisible(true);
  };

  async function onSubmit(values: NewsletterSubscriptionForm) {
    try {
      if (!isCaptchaV2TokenVisible) {
        // Verify V3 captcha
        const captchaV3Token = await getCaptchaV3Token();
        const captchaV3Response = await verifyCaptchaV3Token(captchaV3Token);
        if (captchaV3Response?.success && captchaV3Response?.score < 0.5) {
          // Submit Form
          console.log("Successfully verified captcha V3 token!");
          console.log("Form Submited");
        } else if (
          captchaV3Response?.success &&
          captchaV3Response?.score > 0.5
        ) {
          // Display captcha V2
          handleCaptchaV2TokenVisibility();
        }
      }
      if (isCaptchaV2TokenVisible) {
        const captchaV2Response = await verifyCaptchaV2Token(captchaV2Token);
        if (captchaV2Response?.success) {
          // Submit Form
          console.log("Successfully verified captcha V2 token!");
          console.log("Form Submited");
        } else {
          console.error("Unable to verify captcha V2 token!");
        }
      }

      /* 
      const response = await newsletterFormSubmit(token, values); 

      if (response?.success) {
        console.log("Successfully registered newsletter preferences!");
        form.reset();
      } else {
        console.error(response?.message);
        console.error(response?.errors);
      }*/
    } catch (error) {
      console.error("Unable to register newsletter preferences!");
      console.error(error);
    }
  }

  return (
    <>
      <section className="space-y-5">
        <h2 className="text-xl font-bold">SUBSCRIBE WITH EMAIL</h2>
        <p>
          Stay up-to-date with our latest news, stories and products by signing
          up to our newsletter
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
            <EmailFormField formControl={form.control} labelText="E-MAIL *" />
            <PrefLanguageFormField formControl={form.control} />
            <InterestsFormField formControl={form.control} />
            <GenericCheckboxField
              formControl={form.control}
              formFieldName="isAgreed"
              labelText="I agree with the Privacy Policy *"
            />
            <Button type="submit" disabled={!form.formState.isValid}>
              SIGN UP
            </Button>
          </form>
        </Form>
        {isCaptchaV2TokenVisible && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_CAPTCHA_V2_SITE_KEY}
            onChange={handleCaptchaChange}
          />
        )}
      </section>
    </>
  );
}
