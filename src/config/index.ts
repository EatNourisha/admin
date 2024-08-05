const configs = {
  authKey: "x231nxj",
  // baseUrl: "http://localhost:8080/v1",
  // baseUrl: "https://api-stage.eatnourisha.com/v1/",
  baseUrl:"https://api.eatnourisha.com/v1",
  

  containerW: "8xl",
  DO_SPACES_KEY: "G224YB4WBEY5CX2DABQC",
  DO_SPACES_SECRET: "go8SxgqLsKl5FMP3Kvl0XOoRrffGk2IowWcSMskf6eE",
  DO_SPACES_URL: "https://koinpoll.sfo3.digitaloceanspaces.com",
  DO_SPACES_ENDPOINT: "sfo3.digitaloceanspaces.com",
  DO_BUCKET: "aegle",

  // AWS_BUCKET: "rapyd",
  // AWS_REGION: "us-east-1",
  // AWS_ACCESS_KEY: "AKIAXT64XBHMCZ54Y2YN",
  // AWS_SECRET_KEY: "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",

  AWS_BUCKET: "nourisha-bucket",
  AWS_REGION: "us-east-1",
  AWS_ACCESS_KEY: "AKIARYIJOAE6YMB2DQGQ",
  AWS_SECRET_KEY: "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",

  // AWS_BUCKET: "rapydcars-uploads",
  // AWS_REGION: "us-east-1",
  // AWS_ACCESS_KEY: "AKIAUDYTFEK2BOTMSG7C",
  // AWS_SECRET_KEY: "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",

  paths: {
    login: "/signin",
    register: "/signup",
    resetPassword: "/reset",
    verifyEmail: "/verify",
    forgotPassword: "/forgot",

    doctors: "/doctors",
    profile: "/profile",
    calendar: "/calendar",
    referrals: "/referrals",
    users: "/users",
    dashboard: "/dashboard",
    administrators: "/admins",
    meals: "/meals",
    plans: "/plans",
    addPlan: "/plans/add",
    editPlan: "/plans/edit",
    editProfile: "/profile/edit",
    appointments: "/appointments",
    subscriptions: "/subscriptions",
    addAdministrator: "/admins/add",


    giftCards:"/giftcards",


    meal_extra:"/meal_extra"


    // faqs: "/faqs",
    // support: "/support",
    // privacyPolicy: "/policy",
    // advertising: "/advertising",
    // aboutUs: "/about",
    // contactUs: "/contact",
    // disclaimer: "/disclaimer",
    // methodology: "/methodology",
    // termsAndConditions: "/terms",
    // discover: "/discover",
    // spotlight: "/spotlight",
    // profile: "/profile",
    // uploadCoin: "/profile/upload",

    // gem: "/d/gem",
    // sponsore: "/d/sponsore",

    // userDetails: (id: string) => `/u/${id}`,

    // coinDetails: (slug: string) => `/coins/${slug}`,
  },
};

export const isProd = String(process.env.NODE_ENV)
  .toLowerCase()
  .includes("prod");
export const isDev = String(process.env.NODE_ENV).toLowerCase().includes("dev");
// export const hideDevLogs = String(process.env.REACT_APP_HIDE_DEV_LOG)
//   .toLowerCase()
//   .includes("true");

export default configs;
