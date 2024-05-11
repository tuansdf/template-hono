import { MiddlewareHandler } from "hono";
import { accepts } from "hono/accepts";
import { defaultLang, validLangs } from "~/i18n/i18n.constant";
import { I18nUtils } from "~/i18n/i18n.util";

export const detectLanguage = (): MiddlewareHandler => {
  return async (c, next) => {
    let lang = c.req.query("lng");
    // @ts-expect-error
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
    c.set("lang", I18nUtils.getLang(lang));
    c.set("t", I18nUtils.getT(lang));
    await next();
  };
};
