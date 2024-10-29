import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { RadioGroup } from "@/components/ui/radio-group";
import { PREFERRED_LANGUAGES } from "@/lib/constants";
import PrefLanguageFormRadioItem from "@/components/form/PrefLanguageFormRadioItem";

type PrefLanguageFormFieldProps = {
  formControl: Control<any, any>;
};

export default function PrefLanguageFormField({
  formControl,
}: PrefLanguageFormFieldProps) {
  return (
    <FormField
      control={formControl}
      name="preferredLanguage"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>PREFERRED LANGUAGE *</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col space-y-1"
            >
              {PREFERRED_LANGUAGES.map((language) => (
                <PrefLanguageFormRadioItem
                  key={language.code}
                  languageObj={language}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
