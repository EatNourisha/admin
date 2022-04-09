import { Router, Redirect, Location } from "@reach/router";
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
} from "pages";

import { Layout, ProtectedRoute, RootPage } from "components";

import { AnimatePresence } from "framer-motion";

import config from "config";

const FramerRouter = ({ children }: any) => (
  <Location>
    {({ location }) => (
      <div style={{ position: "relative" }}>
        <AnimatePresence>
          <Router key={location.key} location={location}>
            {children}
          </Router>
        </AnimatePresence>
      </div>
    )}
  </Location>
);

const AppRouter = () => {
  return (
    <FramerRouter>
      {/* <NotFound default />
      <Login path={constants.paths.login} />
      <ResetPassword path={constants.paths.resetPassword} />
      <ForgotPassword path={constants.paths.forgotPassword} /> */}

      <Layout path="/">
        <Redirect from="/" to={config.paths.dashboard} noThrow />
        <RootPage path={config.paths.dashboard}>
          <ProtectedRoute path="/" component={Home} />
        </RootPage>
        <RootPage path={config.paths.appointments}>
          <ProtectedRoute path="/" component={Appointments} />
        </RootPage>
        <RootPage path={config.paths.patients}>
          <ProtectedRoute path="/" component={Patients} />
          <ProtectedRoute path="/:id" component={PatientDetails} />
        </RootPage>
        <RootPage path={config.paths.doctors}>
          <ProtectedRoute path="/" component={Doctors} />
          <ProtectedRoute path="/:id" component={DoctorDetails} />
        </RootPage>
        <RootPage path={config.paths.calendar}>
          <ProtectedRoute path="/" component={Calendar} />
        </RootPage>
        <RootPage path={config.paths.profile}>
          <ProtectedRoute path="/" component={Profile} />
          <ProtectedRoute path="/edit" component={EditProfile} />
        </RootPage>
        <RootPage path={config.paths.administrators}>
          <ProtectedRoute path="/" component={Admins} />
          <ProtectedRoute path="/add" component={AddAdmins} />
        </RootPage>
      </Layout>
    </FramerRouter>
  );
};

export default AppRouter;
