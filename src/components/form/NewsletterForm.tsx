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
import { useToast } from "@/hooks/use-toast";

const CAPTCHA_V2_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_V2_SITE_KEY;

export default function NewsletterForm() {
  if (!CAPTCHA_V2_SITE_KEY) {
    throw new Error("CAPTCHA_V2_SITE_KEY is not defined!");
  }

  const [isCaptchaV2Required, setIsCaptchaV2Required] = useState(false);
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

  const handleCaptchaV2Change = (value: string | null) => {
    setCaptchaV2Token(value);
  };

  const handleIsCaptchaV2Required = (isRequired: boolean) => {
    setIsCaptchaV2Required(isRequired);
  };

  async function onSubmit(values: NewsletterSubscriptionForm) {
    try {
      if (!isCaptchaV2Required) {
        const captchaV3Token = await getCaptchaV3Token();
        if (!captchaV3Token) {
          toast({
            variant: "destructive",
            description: "Captcha verification failed. Please try again.",
          });
          return;
        }

        const response = await newsletterFormSubmit({ captchaV3Token, values });

        if (response.success) {
          form.reset();
          toast({
            variant: "default",
            description:
              "Successfully verified reCAPTCHA v3 token! Form submitted.",
          });
        } else if (response.requiresCaptchaV2) {
          handleIsCaptchaV2Required(true);
          toast({
            variant: "destructive",
            description:
              "reCAPTCHA v3 score is below threshold! Use reCaptcha V2.",
          });
        } else {
          toast({
            variant: "destructive",
            description:
              response?.message || "An error occurred. Please try again.",
          });
        }
      } else {
        if (!captchaV2Token) {
          console.error("Please complete the reCAPTCHA verification.");
          return;
        }
        const response = await newsletterFormSubmit({ captchaV2Token, values });

        if (response.success) {
          form.reset();
          handleIsCaptchaV2Required(false);

          toast({
            variant: "default",
            description:
              "Successfully verified reCAPTCHA v2 token! Form submitted.",
          });
        } else {
          toast({
            variant: "destructive",
            description: "CAPTCHA verification failed. Please try again.",
          });
          recaptchaRef.current?.reset();
        }
        handleCaptchaV2Change(null);
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
                (isCaptchaV2Required && !captchaV2Token)
              }
            >
              SIGN UP
            </Button>
          </form>
        </Form>
        {isCaptchaV2Required && (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={CAPTCHA_V2_SITE_KEY}
            onChange={handleCaptchaV2Change}
          />
        )}
      </section>
    </>
  );
}
