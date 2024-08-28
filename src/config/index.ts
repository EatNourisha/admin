const configs = {
  authKey: "x231nxj",
  // baseUrl: "http://localhost:8080/v1",
  baseUrl: "https://api-stage.eatnourisha.com/v1",
  // baseUrl: "https://api.eatnourisha.com/v1",

  

  containerW: "8xl",

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
    promos: "/promos",
    users: "/users",
    dashboard: "/dashboard",
    administrators: "/admins",
    meals: "/meals",
    meal_extra:"/meal_extra",
    plans: "/plans",
    broadcasts: "/broadcasts",
    sendBroadcast: "/broadcasts/send",
    addPlan: "/plans/add",
    editPlan: "/plans/edit",
    editProfile: "/profile/edit",
    appointments: "/appointments",
    subscriptions: "/subscriptions",
    addAdministrator: "/admins/add",
    emails: "/emails",
    order: "/single-order",
    giftCard:"/gift_cards",

    lineUp: "/lineUp",


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


export const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];


export default configs;
