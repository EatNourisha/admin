import { generate, charset } from "voucher-code-generator";

export function generatePromoCode() {
  //   console.log("Generated Code", []);
  const code = generate({
    charset: charset("alphanumeric"),
    // prefix: "promo-",
    length: 6,
  });

  //   console.log("Generated Code", code);
  return code[0];
}
