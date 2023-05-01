import { Router, Redirect } from "@reach/router";
import {
  Home,
  Appointments,
  Patients,
  Doctors,
  Calendar,
  Profile,
  Admins,
  PatientDetails,
  DoctorDetails,
  AddAdmins,
  EditProfile,
  Login,
  ResetPassword,
  ForgotPassword,
  AppointmentDetails,
  Referrals,
  ReferralDetails,
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
    <Router>
      {/* <NotFound default /> */}
      <Login path={configs.paths.login} />
      <ResetPassword path={configs.paths.resetPassword} />
      <ForgotPassword path={configs.paths.forgotPassword} />

      <Layout path="/">
        <Redirect from="/" to={configs.paths.dashboard} noThrow />
        <RootPage path={configs.paths.dashboard}>
          <ProtectedRoute path="/" component={Home} />
        </RootPage>
        <RootPage path={configs.paths.appointments}>
          <ProtectedRoute path="/" component={Appointments} />
          <ProtectedRoute path="/:id" component={AppointmentDetails} />
        </RootPage>
        <RootPage path={configs.paths.patients}>
          <ProtectedRoute path="/:id" component={PatientDetails} />
          <ProtectedRoute path="/" component={Patients} />
        </RootPage>
        <RootPage path={configs.paths.doctors}>
          <ProtectedRoute path="/:id" component={DoctorDetails} />
          <ProtectedRoute path="/" component={Doctors} />
        </RootPage>
        <RootPage path={configs.paths.calendar}>
          <ProtectedRoute path="/" component={Calendar} />
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
