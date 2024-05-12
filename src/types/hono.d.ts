import { AuthJwtTokenPayload } from "~/domains/auth/auth.type";
import { TFn, ValidLang } from "~/i18n/i18n.type";

declare module "hono" {
  interface ContextVariableMap {
    t: TFn;
    lang: ValidLang;
    authPayload?: AuthJwtTokenPayload;
    authToken?: string;
  }
}
