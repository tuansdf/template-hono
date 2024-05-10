export class Base64Utils {
  static encode = (input: string): string => {
    return Buffer.from(input).toString("base64url");
  };
  static decode = (input: string): string => {
    return Buffer.from(input, "base64url").toString();
  };
}
