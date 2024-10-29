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
import { handleOnNewsletterFormSubmit } from "@/lib/utils";

export default function NewsletterForm() {
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

  async function onSubmit(values: NewsletterSubscriptionForm) {
    //console.log(values);
    try {
      await handleOnNewsletterFormSubmit(values);
      form.reset();
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
      </section>
    </>
  );
}
