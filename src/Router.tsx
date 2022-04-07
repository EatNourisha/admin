import { Router, Redirect } from "@reach/router";
import {
  Home,
  Appointments,
  Patients,
  Doctors,
  Calendar,
  Profile,
  Admins,
} from "pages";

import { Layout, ProtectedRoute, RootPage } from "components";

import config from "config";

const AppRouter = () => {
  return (
    <Router>
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
        </RootPage>
        <RootPage path={config.paths.doctors}>
          <ProtectedRoute path="/" component={Doctors} />
        </RootPage>
        <RootPage path={config.paths.calendar}>
          <ProtectedRoute path="/" component={Calendar} />
        </RootPage>
        <RootPage path={config.paths.profile}>
          <ProtectedRoute path="/" component={Profile} />
        </RootPage>
        <RootPage path={config.paths.administrators}>
          <ProtectedRoute path="/" component={Admins} />
        </RootPage>

        {/* <RootPage path={config.paths.appointmens}> */}
        {/* <ProtectedRoute path="/" component={Appointments} /> */}
        {/* </RootPage> */}
      </Layout>
    </Router>
  );
};

export default AppRouter;
