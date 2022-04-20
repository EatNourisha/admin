import { ComponentType, FC } from "react";

import { Redirect, RouteComponentProps } from "@reach/router";

import config from "config";
import ls from "utils/secureStorage";
import { PageProps } from "interfaces";

import useUser from "hooks/useUser";

interface ProtectedRouteProps extends RouteComponentProps {
  component: ComponentType<PageProps> | string;
  isNotMandatory?: boolean;
}

const ProtectedRoute: FC<ProtectedRouteProps> = (props) => {
  const { component: Component, isNotMandatory, ...rest } = props;
  // const { status, data } = useSelector(selectUser);
  const { data, isLoading } = useUser();

  const isSignedIn = () => {
    const auth = ls.get(config.authKey);
    return auth?.isSignedIn && auth?.token;
  };

  const renderRoute = () => {
    if (isSignedIn())
      return (
        <Component isFetchingUser={isLoading} user={data?.data} {...rest} />
      );
    return isNotMandatory ? (
      <Component isFetchingUser={false} {...rest} />
    ) : (
      <Redirect to={config.paths.login} noThrow />
    );
  };

  return renderRoute();
};

export default ProtectedRoute;
