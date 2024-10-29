import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

type EmailFormFieldProps = {
  formControl: Control<any, any>;
  labelText: string;
  disabled?: boolean;
};

export default function EmailFormField({
  formControl,
  labelText,
  disabled,
}: EmailFormFieldProps) {
  return (
    <FormField
      control={formControl}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{labelText}</FormLabel>
          <FormControl>
            <Input {...field} disabled={disabled} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
