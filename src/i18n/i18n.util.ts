import i18nGlobal, { i18n as i18nType } from "i18next";
import Backend from "i18next-fs-backend";
import { defaultLang, validLangs } from "~/i18n/i18n.constant";
import { TFn, ValidLang } from "~/i18n/i18n.type";

const KEY_SEPARATED_BY = ":::";

export class I18nUtils {
  static getLang(lang?: string): ValidLang {
    let result: ValidLang = defaultLang;
    if (validLangs.includes(lang as ValidLang)) {
      result = lang as ValidLang;
    }
    return result;
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

class I18n {
  private _instance!: i18nType;

  public async init() {
    const temp = i18nGlobal.createInstance();
    await temp.use(Backend).init({
      fallbackLng: defaultLang,
      preload: validLangs,
      ns: ["translation"],
      defaultNS: "translation",
      backend: {
        loadPath: "./resources/locales/{{lng}}/{{ns}}.json",
      },
    });
    this._instance = temp;
  }

  public getT(lang?: string) {
    return this._instance.getFixedT(I18nUtils.getLang(lang));
  }
}

export const i18n = new I18n();
