import { RouteComponentProps } from "@reach/router";
import { UserRo } from "./auth.interface";

interface PageProps extends RouteComponentProps {
  isFetchingUser: boolean;
  user?: UserRo;
}

export default PageProps;
