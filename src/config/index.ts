const configs = {
  authKey: "x231nxj",
  // baseUrl: "https://koinpoll-api.herokuapp.com/v1",
  baseUrl: "http://localhost:3020/v1",

  containerW: "8xl",
  DO_SPACES_KEY: "G224YB4WBEY5CX2DABQC",
  DO_SPACES_SECRET: "go8SxgqLsKl5FMP3Kvl0XOoRrffGk2IowWcSMskf6eE",
  DO_SPACES_URL: "https://koinpoll.sfo3.digitaloceanspaces.com",
  DO_SPACES_ENDPOINT: "sfo3.digitaloceanspaces.com",
  DO_BUCKET: "koinpoll",

  paths: {
    login: "/signin",
    register: "/signup",
    resetPassword: "/reset",
    verifyEmail: "/verify",
    forgotPassword: "/forgot",

    doctors: "/doctors",
    patients: "/patients",
    appointments: "/appointments",
    dashboard: "/dashboard",
    profile: "/profile",
    calendar: "/calendar",
    administrators: "/admins",

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
