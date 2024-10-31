import { CaptchaAction, CaptchaState } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function captchaReducer(
  state: CaptchaState,
  action: CaptchaAction
): CaptchaState {
  switch (action.type) {
    case "SET_V2_REQUIRED":
      return { ...state, isV2Required: action.payload };
    case "SET_V2_TOKEN":
      return { ...state, v2Token: action.payload };
    case "RESET":
      return { isV2Required: false, v2Token: null };
    default:
      return state;
  }
}
