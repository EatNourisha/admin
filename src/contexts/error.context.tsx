import { createContext, useCallback, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

// import { navigate } from "@reach/router";

import useAuth from "hooks/useAuth";
import useErrorStore from "stores/error";
import toLower from "lodash/toLower";
// import constants from "config";

interface IErrorContext {
  toast: ReturnType<typeof useToast>;
}

const ErrorContext = createContext<Partial<IErrorContext>>({});

const ErrorContextProvider = (props: any) => {
  const toast = useToast();
  const { logout } = useAuth();
  const { actions, next } = useErrorStore();

  const autoLogOut = useCallback(() => {
    if (
      (next?.message &&
        toLower(next.message).includes("authorization failed")) ||
      (next?.status && next?.status === 401)
    )
      logout();
  }, [next, logout]);

  useEffect(() => {
    console.log("NEXT ERROR", next);
    if (next.id !== null && next.message !== null && next.showUser) {
      console.log("NEXT ERROR", next);
      autoLogOut();

      toast({
        position: "bottom-right",
        title: "Error",
        description: next.message,
        status: "error",
        duration: 9000,
        isClosable: true,
        onCloseComplete: () => {
          actions?.clearError("next");
        },
      });
    }
  }, [next, toast, autoLogOut, actions]);

  return (
    <ErrorContext.Provider value={{ toast }}>
      {props.children}
    </ErrorContext.Provider>
  );
};

export default ErrorContextProvider;
