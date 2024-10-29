import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { CheckedState } from "@radix-ui/react-checkbox";

type GenericCheckboxFieldProps = {
  formControl: Control<any, any>;
  formFieldName: string;
  labelText: string;
  onChangeCallback?: (checked: CheckedState) => void; // Optional callback
};

export default function GenericCheckboxField({
  formControl,
  formFieldName,
  labelText,
  onChangeCallback,
}: GenericCheckboxFieldProps) {
  return (
    <FormField
      control={formControl}
      name={formFieldName}
      render={({ field }) => (
        <>
          <FormItem className="">
            <div className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked);
                    onChangeCallback?.(checked);
                  }}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{labelText}</FormLabel>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        </>
      )}
    />
  );
}
