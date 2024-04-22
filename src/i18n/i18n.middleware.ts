import { Handler } from "hono";
import { accepts } from "hono/accepts";
import { defaultLang, validLangs } from "~/i18n/i18n.constant.js";
import { I18nUtils } from "~/i18n/i18n.util.js";

export class I18nMiddleware {
  static handle(): Handler {
    return async (c, next) => {
      let lang = c.req.query("lng");
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
  }
}
