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
import { useToast } from "@/hooks/use-toast";

const CAPTCHA_V2_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_V2_SITE_KEY;

export default function NewsletterForm() {
  if (!CAPTCHA_V2_SITE_KEY) {
    throw new Error("CAPTCHA_V2_SITE_KEY is not defined!");
  }
  const [isCaptchaV2TokenVisible, setIsCaptchaV2TokenVisible] = useState(false);
  const [captchaV2Token, setCaptchaV2Token] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { toast } = useToast();

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

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaV2Token(value);
  };

  const handleCaptchaV2TokenVisibility = (visibilityStatus: boolean) => {
    setIsCaptchaV2TokenVisible(visibilityStatus);
  };

  async function onSubmit(values: NewsletterSubscriptionForm) {
    try {
      if (!isCaptchaV2TokenVisible) {
        // Verify V3 captcha
        const captchaV3Token = await getCaptchaV3Token();
        const captchaV3Response = captchaV3Token
          ? await verifyCaptchaV3Token(captchaV3Token)
          : null;

        if (captchaV3Response?.success) {
          if (captchaV3Response.score < 0.5) {
            // Score above threshold, proceed to submit form
            toast({
              variant: "default",
              description:
                "Successfully verified reCAPTCHA v3 token! Form submitted.",
            });
            // Submit the form data here
            // await newsletterFormSubmit(values);
            form.reset();
          } else {
            // Score below threshold, display reCAPTCHA v2
            toast({
              variant: "destructive",
              description:
                "reCAPTCHA v3 score is below threshold! Use reCaptchaV2.",
            });
            handleCaptchaV2TokenVisibility(true);
            return; // Exit to wait for user interaction
          }
        } else {
          console.error("Unable to verify reCAPTCHA v3 token!");
          return;
        }
      } else {
        if (!captchaV2Token) {
          console.error("Please complete the reCAPTCHA verification.");
          return;
        }
        const captchaV2Response = await verifyCaptchaV2Token(captchaV2Token);
        if (captchaV2Response?.success) {
          toast({
            variant: "default",
            description:
              "Successfully verified reCAPTCHA v2 token! Form submitted.",
          });
          // Submit the form data here
          //await newsletterFormSubmit(values);
          form.reset();
          // Reset reCAPTCHA v2 state
          handleCaptchaV2TokenVisibility(false);
          setCaptchaV2Token(null);
        } else {
          console.error("Unable to verify reCAPTCHA v2 token!");
          recaptchaRef.current?.reset();
          setCaptchaV2Token(null);
        }
      }
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
            <Button
              type="submit"
              disabled={
                !form.formState.isValid ||
                (isCaptchaV2TokenVisible && !captchaV2Token)
              }
            >
              SIGN UP
            </Button>
          </form>
        </Form>
        {isCaptchaV2TokenVisible && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={CAPTCHA_V2_SITE_KEY}
            onChange={handleCaptchaChange}
          />
        )}
      </section>
    </>
  );
}
