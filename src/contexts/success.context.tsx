import { createContext, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
// import { useDispatch, useSelector } from "react-redux";

// import { selectSuccess, clearSuccess } from "store/slices";

interface ISuccessContext {
  toast: ReturnType<typeof useToast>;
}

const SuccessContext = createContext<Partial<ISuccessContext>>({});

const SuccessContextProvider = (props: any) => {
  const toast = useToast();
  // const dispatch = useDispatch();

  // const { next } = useSelector(selectSuccess);

  // useEffect(() => {
  //   if (next.id !== null && next.message !== null && next.showUser) {
  //     console.log("NEXT Success", next);

  //     toast({
  //       position: "bottom-right",
  //       title: "Success 🎉",
  //       description: next.message,
  //       status: "success",
  //       duration: 4000,
  //       isClosable: true,
  //       onCloseComplete: () => {
  //         dispatch(clearSuccess("next"));
  //       },
  //     });
  //   }
  // }, [next, dispatch, toast]);

  return (
    <SuccessContext.Provider value={{ toast }}>
      {props.children}
    </SuccessContext.Provider>
  );
};

export default SuccessContextProvider;
