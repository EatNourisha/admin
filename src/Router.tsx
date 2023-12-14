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
  Subscriptions,
  PlanDetails,
  Plans,
  AddPlan,
  EditPlan,
  Meals,
  Broadcasts,
  SendBroadcast,
  MealAnalysis,
  AssignPlan,
  EditMeal,
  AddMeal,
  Settings,
  Orders,
  OrderDetails,
  Promos,
  CreatePromo,
  EditPromo,
  PromoDetails,
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
        <RootPage path={configs.paths.referrals}>
          <ProtectedRoute path="/" component={Referrals} />
        </RootPage>

        <RootPage path={configs.paths.promos}>
          <ProtectedRoute path="/" component={Promos} />
          <ProtectedRoute path="/create" component={CreatePromo} />
          <ProtectedRoute path="/edit/:id" component={EditPromo} />
          <ProtectedRoute path="/:id" component={PromoDetails} />
        </RootPage>
        <RootPage path={configs.paths.users}>
          <ProtectedRoute path="/:id" component={UserDetails} />
          <ProtectedRoute path="/" component={Users} />
        </RootPage>
        <RootPage path={configs.paths.subscriptions}>
          <ProtectedRoute path="/" component={Subscriptions} />
        </RootPage>
        <RootPage path={configs.paths.plans}>
          <ProtectedRoute path="/:id" component={PlanDetails} />
          <ProtectedRoute path="/:id/assign" component={AssignPlan} />
          <ProtectedRoute path="/" component={Plans} />
          <ProtectedRoute path="/add" component={AddPlan} />
          <ProtectedRoute path="/edit/:id" component={EditPlan} />
        </RootPage>
        <RootPage path={configs.paths.broadcasts}>
          <ProtectedRoute path="/" component={Broadcasts} />
          <ProtectedRoute path="/send" component={SendBroadcast} />
        </RootPage>
        <RootPage path={configs.paths.meals}>
          <ProtectedRoute path="/" component={Meals} />
          <ProtectedRoute path="/add" component={AddMeal} />
          <ProtectedRoute path="/edit/:id" component={EditMeal} />
          <ProtectedRoute path="/analysis/:id" component={MealAnalysis} />
          <ProtectedRoute path="/orders" component={Orders} />
          <ProtectedRoute path="/orders/:id" component={OrderDetails} />
        </RootPage>
        {/* <RootPage path={configs.paths.referrals}>
          <ProtectedRoute path="/" component={Referrals} />
        </RootPage> */}
        <RootPage path={configs.paths.profile}>
          <ProtectedRoute path="/" component={Profile} />
          <ProtectedRoute path="/edit" component={EditProfile} />
        </RootPage>
        <RootPage path={configs.paths.administrators}>
          <ProtectedRoute path="/" component={Admins} />
          <ProtectedRoute path="/add" component={AddAdmins} />
          <ProtectedRoute path="/settings" component={Settings} />
        </RootPage>
      </Layout>
    </Router>
  );
};

export default AppRouter;
