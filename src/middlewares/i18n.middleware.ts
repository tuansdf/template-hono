import { MiddlewareHandler } from "hono";
import { accepts } from "hono/accepts";
import { defaultLang, i18n, validLangs } from "@/lib/i18n";

export const detectLanguage = (): MiddlewareHandler => async (c, next) => {
  let lang = c.req.query("lng");
  const langParams = c.req.param("lng");
  if (!lang && langParams) {
    lang = langParams;
  }
  if (!lang) {
    lang = accepts(c, {
      header: "Accept-Language",
      supports: validLangs,
      default: defaultLang,
    });
  }
  c.set("lang", i18n.getLang(lang));
  c.set("t", i18n.getT(lang));
  await next();
};
