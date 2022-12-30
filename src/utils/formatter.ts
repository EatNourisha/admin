type SupportCurrency = "ngn" | "ghs" | "kes" | "usd";

const currencyMap: Record<SupportCurrency, string> = {
  ngn: "en-NG",
  ghs: "en-GH",
  kes: "en-KE",
  usd: "en-US",
};

const formatter = (currency: SupportCurrency) =>
  new Intl.NumberFormat(currencyMap[currency], {
    style: "currency",
    currency: String(currency).toUpperCase(),

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });

const currencyFormat = (currency: SupportCurrency) => formatter(currency);

export default currencyFormat;
