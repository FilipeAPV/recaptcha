import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { INTERESTS } from "@/lib/constants";
import { Control } from "react-hook-form";

type InterestsFormFieldProps = {
  formControl: Control<any, any>;
};

export default function InterestsFormField({
  formControl,
}: InterestsFormFieldProps) {
  return (
    <FormField
      control={formControl}
      name="interests"
      render={() => (
        <FormItem>
          <div className="mb-4">
            <FormLabel className="text-base">YOUR INTERESTS *</FormLabel>
            <FormDescription>
              In order to receive the most relevant communication, which topics
              are you interested in? *
            </FormDescription>
          </div>
          {INTERESTS.map((item) => (
            <FormField
              key={item}
              control={formControl}
              name="interests"
              render={({ field }) => {
                return (
                  <FormItem
                    key={item}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, item])
                            : field.onChange(
                                field.value?.filter(
                                  (value: string) => value !== item
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      {item}
                    </FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
