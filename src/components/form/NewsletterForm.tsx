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
import {
  CaptchaToken,
  NewsletterFormSubmitResponse,
  NewsletterSubscriptionForm,
} from "@/types";
import { newsletterFormSubmit } from "@/actions/newsletter-form-submit";
import { useTransition } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import useCaptcha from "@/hooks/use-captcha";

const CAPTCHA_V2_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_V2_SITE_KEY;

export default function NewsletterForm() {
  if (!CAPTCHA_V2_SITE_KEY) {
    throw new Error("CAPTCHA_V2_SITE_KEY is not defined!");
  }

  const {
    captchaState,
    dispatchCaptcha,
    recaptchaRef,
    getCaptchaToken,
    resetCaptcha,
  } = useCaptcha();

  const [isPending, startTransition] = useTransition();
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

  const updateCaptchaV2Token = (token: CaptchaToken) => {
    dispatchCaptcha({ type: "SET_V2_TOKEN", payload: token });
  };

  const toggleCaptchaV2Requirement = (isRequired: boolean) => {
    dispatchCaptcha({ type: "SET_V2_REQUIRED", payload: isRequired });
  };

  async function onSubmit(formValues: NewsletterSubscriptionForm) {
    try {
      const captchaResult = await getCaptchaToken();
      if (!captchaResult) {
        toast({
          variant: "destructive",
          description: "Please complete the CAPTCHA challenge.",
        });
        return;
      }

      const { token: captchaToken, type: captchaType } = captchaResult;

      startTransition(async () => {
        const response = await newsletterFormSubmit({
          captchaToken,
          captchaType,
          formValues,
        });
        handleResponse(response);
      });
    } catch (error) {
      console.error("Unable to register newsletter preferences!", error);
      toast({
        variant: "destructive",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  }

  const handleResponse = (response: NewsletterFormSubmitResponse) => {
    if (response.success) {
      form.reset();
      resetCaptcha();
      toast({
        variant: "default",
        description: response.message,
      });
    } else if (response.requiresCaptchaV2) {
      toggleCaptchaV2Requirement(true);
      toast({
        variant: "default",
        description:
          "Additional verification required. Please complete the CAPTCHA.",
      });
    } else {
      toast({
        variant: "destructive",
        description: response.message || "An error occurred. Please try again.",
      });
      if (captchaState.isV2Required) {
        resetCaptcha();
      }
    }
  };

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
            {captchaState.isV2Required && (
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={CAPTCHA_V2_SITE_KEY}
                onChange={updateCaptchaV2Token}
              />
            )}
            <Button
              type="submit"
              disabled={
                !form.formState.isValid ||
                isPending ||
                (captchaState.isV2Required && !captchaState.v2Token)
              }
              className="w-full"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "SIGN UP"
              )}
            </Button>
          </form>
        </Form>
      </section>
    </>
  );
}
