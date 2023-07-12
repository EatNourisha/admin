import { Router, Redirect } from "@reach/router";
import {
  Home,
  Users,
  Profile,
  Admins,
  UserDetails,
  AddAdmins,
  EditProfile,
  Login,
  ResetPassword,
  ForgotPassword,
  Referrals,
  ReferralDetails,
  Subscriptions,
  PlanDetails,
  Plans,
  AddPlan,
  EditPlan,
  Meals,
} from "pages";

import { Layout, ProtectedRoute, RootPage } from "components";

// import { AnimatePresence } from "framer-motion";

import configs from "config";

// const FramerRouter = ({ children }: any) => (
//   <Location>
//     {({ location }) => (
//       <div style={{ position: "relative" }}>
//         <AnimatePresence>
//           <Router key={location.key} location={location}>
//             {children}
//           </Router>
//         </AnimatePresence>
//       </div>
//     )}
//   </Location>
// );

const AppRouter = () => {
  return (
    // @ts-ignore
    <Router>
      {/* <NotFound default /> */}
      <Login path={configs.paths.login} />
      <ResetPassword path={configs.paths.resetPassword} />
      <ForgotPassword path={configs.paths.forgotPassword} />

      <Layout path="/">
        {/*  @ts-ignore */}
        <Redirect from="/" to={configs.paths.dashboard} noThrow />
        <RootPage path={configs.paths.dashboard}>
          <ProtectedRoute path="/" component={Home} />
        </RootPage>
        {/* <RootPage path={configs.paths.appointments}>
          <ProtectedRoute path="/" component={Appointments} />
          <ProtectedRoute path="/:id" component={AppointmentDetails} />
        </RootPage> */}
        <RootPage path={configs.paths.users}>
          <ProtectedRoute path="/:id" component={UserDetails} />
          <ProtectedRoute path="/" component={Users} />
        </RootPage>
        <RootPage path={configs.paths.subscriptions}>
          <ProtectedRoute path="/" component={Subscriptions} />
        </RootPage>
        <RootPage path={configs.paths.plans}>
          <ProtectedRoute path="/:id" component={PlanDetails} />
          <ProtectedRoute path="/" component={Plans} />
          <ProtectedRoute path="/add" component={AddPlan} />
          <ProtectedRoute path="/edit/:id" component={EditPlan} />
        </RootPage>
        <RootPage path={configs.paths.meals}>
          {/* <ProtectedRoute path="/:id" component={DoctorDetails} /> */}
          <ProtectedRoute path="/" component={Meals} />
        </RootPage>
        <RootPage path={configs.paths.referrals}>
          <ProtectedRoute path="/" component={Referrals} />
          <ProtectedRoute path="/:id" component={ReferralDetails} />
        </RootPage>
        <RootPage path={configs.paths.profile}>
          <ProtectedRoute path="/" component={Profile} />
          <ProtectedRoute path="/edit" component={EditProfile} />
        </RootPage>
        <RootPage path={configs.paths.administrators}>
          <ProtectedRoute path="/" component={Admins} />
          <ProtectedRoute path="/add" component={AddAdmins} />
        </RootPage>
      </Layout>
    </Router>
  );
};

export default AppRouter;
