import { getCaptchaV3Token } from "@/lib/captcha";
import { CAPTCHA_TYPE_V2, CAPTCHA_TYPE_V3 } from "@/lib/constants";
import { captchaReducer } from "@/lib/utils";
import { CaptchaToken, CaptchaType } from "@/types";
import { useReducer, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function useCaptcha() {
  const [state, dispatch] = useReducer(captchaReducer, {
    isV2Required: false,
    v2Token: null,
  });
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const getCaptchaToken = async (): Promise<{
    token: CaptchaToken;
    type: CaptchaType;
  } | null> => {
    if (state.isV2Required) {
      if (!state.v2Token) {
        return null;
      }
      return { token: state.v2Token, type: CAPTCHA_TYPE_V2 };
    } else {
      const token = await getCaptchaV3Token();
      if (!token) {
        return null;
      }
      return { token, type: CAPTCHA_TYPE_V3 };
    }
  };

  const resetCaptcha = () => {
    dispatch({ type: "RESET" });
    recaptchaRef.current?.reset();
  };

  return {
    captchaState: state,
    dispatchCaptcha: dispatch,
    recaptchaRef,
    getCaptchaToken,
    resetCaptcha,
  };
}
