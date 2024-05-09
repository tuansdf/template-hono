import i18n from "i18next";
import Backend from "i18next-fs-backend";
import { defaultLang, validLangs } from "~/i18n/i18n.constant.js";
import { TFn, ValidLang } from "~/i18n/i18n.type.js";

await i18n.use(Backend).init({
  fallbackLng: defaultLang,
  preload: validLangs,
  ns: ["translation"],
  defaultNS: "translation",
  backend: {
    loadPath: "./resources/locales/{{lng}}/{{ns}}.json",
  },
});

const KEY_SEPARATED_BY = ":::";

export class I18nUtils {
  static getLang(lang?: string): ValidLang {
    let result: ValidLang = defaultLang;
    if (validLangs.includes(lang as ValidLang)) {
      result = lang as ValidLang;
    }
    return result;
  }

  static getT(lang?: string) {
    return i18n.getFixedT(this.getLang(lang));
  }

  static getMessage(t: TFn, key: string) {
    return t(key);
  }

  static getMessageAndParams(t: TFn, input: string): string {
    const split = input.split(KEY_SEPARATED_BY);
    const mainKey = split[0] || "";
    const length = split.length;
    const params: Record<string, string> = {};
    if (length > 1) {
      for (let i = 1; i < length; i++) {
        params[String(i)] = t(split[i]!);
      }
    }
    return t(mainKey, params);
  }
}
