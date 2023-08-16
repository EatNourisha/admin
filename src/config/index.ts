const configs = {
  authKey: "x231nxj",
  // baseUrl: "http://localhost:8080/v1",
  // baseUrl: "https://api-stage.eatnourisha.com/v1",
  baseUrl: "https://api.eatnourisha.com/v1",

  containerW: "8xl",
  DO_SPACES_KEY: "G224YB4WBEY5CX2DABQC",
  DO_SPACES_SECRET: "go8SxgqLsKl5FMP3Kvl0XOoRrffGk2IowWcSMskf6eE",
  DO_SPACES_URL: "https://koinpoll.sfo3.digitaloceanspaces.com",
  DO_SPACES_ENDPOINT: "sfo3.digitaloceanspaces.com",
  DO_BUCKET: "aegle",

  AWS_BUCKET: "nourisha-bucket",
  AWS_REGION: "us-east-1",
  AWS_ACCESS_KEY: "AKIARYIJOAE6YMB2DQGQ",
  AWS_SECRET_KEY: "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",


  paths: {
    login: "/signin",
    register: "/signup",
    resetPassword: "/reset",
    verifyEmail: "/verify",
    forgotPassword: "/forgot",

    profile: "/profile",
    referrals: "/referrals",
    users: "/users",
    dashboard: "/dashboard",
    administrators: "/admins",
    meals: "/meals",
    plans: "/plans",
    broadcasts: "/broadcasts",
    sendBroadcast: "/broadcasts/send",
    addPlan: "/plans/add",
    editPlan: "/plans/edit",
    editProfile: "/profile/edit",
    appointments: "/appointments",
    subscriptions: "/subscriptions",
    addAdministrator: "/admins/add",

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
