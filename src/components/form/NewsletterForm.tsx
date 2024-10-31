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
import { CaptchaToken, CaptchaType, NewsletterSubscriptionForm } from "@/types";
import { newsletterFormSubmit } from "@/actions/newsletter-form-submit";
import { getCaptchaV3Token } from "@/lib/captcha";
import { useRef, useState, useTransition } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { CAPTCHA_TYPE_V2, CAPTCHA_TYPE_V3 } from "@/lib/constants";

const CAPTCHA_V2_SITE_KEY = process.env.NEXT_PUBLIC_CAPTCHA_V2_SITE_KEY;

export default function NewsletterForm() {
  if (!CAPTCHA_V2_SITE_KEY) {
    throw new Error("CAPTCHA_V2_SITE_KEY is not defined!");
  }

  const [isCaptchaV2Required, setIsCaptchaV2Required] = useState(false);
  const [captchaV2Token, setCaptchaV2Token] = useState<CaptchaToken>(null);
  const [isPending, startTransition] = useTransition();
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

  const updateCaptchaV2Token = (token: CaptchaToken) => {
    setCaptchaV2Token(token);
  };

  const toggleCaptchaV2Requirement = (isRequired: boolean) => {
    setIsCaptchaV2Required(isRequired);
  };

  async function onSubmit(formValues: NewsletterSubscriptionForm) {
    try {
      let captchaToken: CaptchaToken = null;
      let captchaType: CaptchaType = CAPTCHA_TYPE_V3;

      if (isCaptchaV2Required) {
        if (!captchaV2Token) {
          toast({
            variant: "destructive",
            description: "Please complete the CAPTCHA challenge.",
          });
          return;
        }
        captchaToken = captchaV2Token;
        captchaType = CAPTCHA_TYPE_V2;
      } else {
        captchaToken = await getCaptchaV3Token();
        if (!captchaToken) {
          toast({
            variant: "destructive",
            description: "Captcha verification failed. Please try again.",
          });
          return;
        }
      }

      startTransition(async () => {
        const response = await newsletterFormSubmit({
          captchaToken,
          captchaType,
          formValues,
        });

        if (response.success) {
          form.reset();
          toggleCaptchaV2Requirement(false);
          setCaptchaV2Token(null);
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
            description:
              response.message || "An error occurred. Please try again.",
          });
          if (isCaptchaV2Required) {
            recaptchaRef.current?.reset();
            setCaptchaV2Token(null);
          }
        }
      });
    } catch (error) {
      console.error("Unable to register newsletter preferences!", error);
      toast({
        variant: "destructive",
        description: "An unexpected error occurred. Please try again.",
      });
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
            {isCaptchaV2Required && (
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
                (isCaptchaV2Required && !captchaV2Token)
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
