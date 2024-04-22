import i18n from "i18next";
import Backend from "i18next-fs-backend";
import { defaultLang, validLangs } from "~/i18n/i18n.constant.js";
import { ValidLang } from "~/i18n/i18n.type.js";

await i18n.use(Backend).init({
  fallbackLng: defaultLang,
  preload: validLangs,
  ns: ["translation"],
  defaultNS: "translation",
  backend: {
    loadPath: "./locales/{{lng}}/{{ns}}.json",
  },
});

export class I18nUtils {
  static getLang(lang?: string): ValidLang {
    let result: ValidLang = "en";
    if (validLangs.includes(lang as ValidLang)) {
      result = lang as ValidLang;
    }
    return result;
  }

  static getT(lang?: string) {
    return i18n.getFixedT(this.getLang(lang));
  }

  static getMessage(key: string, lang?: string) {
    const t = this.getT(lang);
    return t(key);
  }
}
