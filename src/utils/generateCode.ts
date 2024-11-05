import { generate, charset } from "voucher-code-generator";

export function generatePromoCode() {
  const code = generate({
    charset: charset("alphanumeric"),
    // prefix: "promo-",
    length: 6,
  });

  return code[0];
}
