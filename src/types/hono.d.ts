import { AuthJwtTokenPayload } from "@/domains/token/token.type";
import { TFn, ValidLang } from "@/lib/i18n";

declare module "hono" {
  interface ContextVariableMap {
    t: TFn;
    lang: ValidLang;
    authPayload?: AuthJwtTokenPayload;
    authToken?: string;
  }
}
