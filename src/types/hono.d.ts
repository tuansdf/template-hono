import { JwtAuthTokenPayload } from "~/domains/auth/auth.type.js";
import { TFn, ValidLang } from "~/i18n/i18n.type.js";

declare module "hono" {
  interface ContextVariableMap {
    t: TFn;
    lang: ValidLang;
    authPayload?: JwtAuthTokenPayload;
  }
}
