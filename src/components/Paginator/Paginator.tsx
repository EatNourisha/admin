import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

import { LinkedList } from "libs";
import { HStack, IconButton } from "@chakra-ui/react";

// import { nanoid } from "nanoid";
import { HashedDocumentPagination } from "interfaces";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface IContext {
  state?: Partial<IState>;
  history?: LinkedList<string>;
  onPrev: () => string | undefined;
  onNext: (nextHash: string, prevHash: string) => void;
  updateList?: (nextHash: string, prevHash: string) => void;
  hasPrev: boolean;
  hasNext: boolean;
}

interface PaginatorProps
  extends Omit<HashedDocumentPagination<any[]>, "results"> {
  onNext?: (next: string) => void;
  onPrev?: (prev: string) => void;
}

interface PaginatorContainerProps {}

const Context = createContext<IContext>({
  state: {},
  history: new LinkedList<string>(),
  onPrev: () => undefined,
  onNext: (pageHash: string) => "",
  updateList: (nextHash: string, prevHash: string) => {},
  hasPrev: false,
  hasNext: false,
});

interface IState {
  next: string;
  previous: string;
}

export function PaginatorContainer(
  props: PropsWithChildren<PaginatorContainerProps>
) {
  const { children } = props;

  // const [state, set] = usePartialState<IState>();

  // const hasPrev = useMemo(() => !!state?.previous, [state]);
  // const hasNext = useMemo(() => !!state?.next, [state]);

  // const onNext = (next: string, prev: string) => {
  //   set({ next, previous: prev });
  // };

  // const onPrev = () => {
  //   return state?.previous;
  // };

  const [hasStartingNodes, _setHasStartingNodes] = useState(false);
  const [state, set] = useState(new LinkedList<string>());
  const [currentNode, setCurrentNode] = useState(state.tail);

  const hasPrev = useMemo(() => !!currentNode?.prev?.value, [currentNode]);
  const hasNext = useMemo(() => !!currentNode?.next?.value, [currentNode]);

  const onPrev = () => {
    const list = state;
    // const previous = currentNode?.prev;
    const previous = list.pop();
    console.log(
      "PREVIOUS NODE ",
      list,
      previous,
      previous?.value === currentNode?.value
    );
    if (currentNode && previous) setCurrentNode(previous);
    set(list);
    return previous?.value;
  };

  const updateList = (nextHash: string, prevHash?: string | null) => {
    let list = state;

    if (!state?.head && !prevHash && !hasStartingNodes) return;
    if (!hasStartingNodes && prevHash && !state?.head) {
      list = list.push(prevHash);
      _setHasStartingNodes(true);
    }

    //   throw new Error(
    //     "Head node is empty, try pass in a prevHash and nextHash."
    //   );

    list = list.push(nextHash);
    set(list);
    setCurrentNode(list.tail);
    return;
  };

  const onNext = (nextHash: string, prevHash?: string) => {
    const next = currentNode?.next;
    if (currentNode && next) setCurrentNode(next);

    if (!next) updateList(nextHash, prevHash);
    return next?.value ?? nextHash;
    // const list = state.push(nextHash);
    // set(list);
    // setCurrentNode(list.tail);
    // return nextHash;
  };

  console.log("state", state, {
    prev: currentNode?.prev?.value,
    next: currentNode?.next?.value,
    current: currentNode?.value,
    isPrevEQNext: currentNode?.prev?.value === currentNode?.next?.value,
    isPrevEqCurrent: currentNode?.prev?.value === currentNode?.value,
  });

  return (
    <Context.Provider
      value={{
        history: state,
        onPrev,
        onNext,
        hasPrev,
        hasNext,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function usePaginator() {
  const _context = useContext(Context);
  if (!_context) throw new Error("PaginatorContainer not found");
  return _context;
}

export function Paginator(props: PaginatorProps) {
  const {
    previous,
    next,
    onPrev: prevClick,
    onNext: nextClick,
    hasNext,
    hasPrevious,
  } = props;
  const { history, onPrev, onNext } = usePaginator();

  const goBack = () => {
    const value = onPrev();
    prevClick && value && prevClick(value);
    console.log("Prev Value", value);
  };

  const goForward = () => {
    !!next && onNext(next, previous);
    !!next && nextClick && nextClick(next);
  };

  console.log("Paginator History", history);
  return (
    <HStack py="30px" justifyContent="flex-end">
      <IconButton
        aria-label="previous"
        boxSize="40px"
        minH="unset"
        minW="unset"
        maxW="unset"
        maxH="unset"
        borderRadius="50px"
        onClick={goBack}
        icon={<ChevronLeftIcon />}
        disabled={!hasPrevious}
      />

      <IconButton
        aria-label="next"
        boxSize="40px"
        minH="unset"
        minW="unset"
        maxW="unset"
        maxH="unset"
        borderRadius="50px"
        onClick={goForward}
        icon={<ChevronRightIcon />}
        disabled={!hasNext}
      />
    </HStack>
  );
}
