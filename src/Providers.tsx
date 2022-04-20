import { ChakraProvider } from "@chakra-ui/react";
// import { Provider } from "react-redux";
import ErrorProvider from "contexts/error.context";
import { trackLiveQueries } from "middlewares";
import useErrorStore from "stores/error";
import { SWRConfig } from "swr";
// import SuccessProvider from "contexts/success.context";
import theme from "theme";
// import store from "store";

// const Providers = ({ children }: any) => {
//   // const { actions } = useErrorStore();

//   return (
//     <ChakraProvider resetCSS theme={theme}>
//       {/* <SWRConfig
//         value={{
//           onError: (error, key) => {
//             if (error.status !== 403 && error.status !== 404) {
//               console.log("ERROR", error, key);

//               actions?.setError({
//                 message: error?.message,
//                 status: error?.statusCode,
//                 action: {
//                   type: key,
//                   payload: undefined,
//                 },
//                 showUser: true,
//               });
//             }
//           },
//         }}
//       > */}
//       {/* <SuccessProvider> */}
//       {/* <ErrorProvider> */}
//       {children}
//       {/* </ErrorProvider> */}
//       {/* </SuccessProvider> */}
//       {/* </SWRConfig> */}
//     </ChakraProvider>
//   );
// };

export default function Providers({ children }: any) {
  const { actions } = useErrorStore();
  return (
    <ChakraProvider resetCSS theme={theme}>
      <SWRConfig
        value={{
          use: [trackLiveQueries],
          onError: (error, key) => {
            if (error.status !== 403 && error.status !== 404) {
              console.log("ERROR", error, key);

              actions?.setError({
                message: error?.message,
                status: error?.statusCode,
                action: {
                  type: key,
                  payload: undefined,
                },
                showUser: true,
              });
            }
          },
        }}
      >
        <ErrorProvider>{children} </ErrorProvider>
      </SWRConfig>
    </ChakraProvider>
  );
}
