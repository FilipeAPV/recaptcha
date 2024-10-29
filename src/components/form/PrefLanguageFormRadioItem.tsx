import React from "react";
import { FormControl, FormItem, FormLabel } from "../ui/form";
import { RadioGroupItem } from "../ui/radio-group";

type PrefLanguageFormRadioItemProps = {
  languageObj: {
    name: string;
    code: string;
  };
};

export default function PrefLanguageFormRadioItem({
  languageObj,
}: PrefLanguageFormRadioItemProps) {
  const { code, name } = languageObj;
  return (
    <FormItem className="flex items-center space-x-3 space-y-0">
      <FormControl>
        <RadioGroupItem value={code} />
      </FormControl>
      <FormLabel className="font-normal">{name}</FormLabel>
    </FormItem>
  );
}
