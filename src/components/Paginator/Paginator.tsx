import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

import { LinkedList } from "libs";
import { Button } from "@chakra-ui/react";

// import { nanoid } from "nanoid";
import { HashedDocumentPagination } from "interfaces";

interface IContext {
  history: LinkedList<string>;
  onPrev: () => string | undefined;
  onNext: (nextHash: string, prevHash: string) => string;
  updateList: (nextHash: string, prevHash: string) => void;
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
  history: new LinkedList<string>(),
  onPrev: () => undefined,
  onNext: (pageHash: string) => "",
  updateList: (nextHash: string, prevHash: string) => {},
  hasPrev: false,
  hasNext: false,
});

export function PaginatorContainer(
  props: PropsWithChildren<PaginatorContainerProps>
) {
  const { children } = props;

  const [hasStartingNodes, _setHasStartingNodes] = useState(false);
  const [state, set] = useState(new LinkedList<string>());
  const [currentNode, setCurrentNode] = useState(state.tail);

  const hasPrev = useMemo(() => !!currentNode?.prev?.value, [currentNode]);
  const hasNext = useMemo(() => !!currentNode?.next?.value, [currentNode]);

  const onPrev = () => {
    const previous = currentNode?.prev;
    console.log("PREVIOUS NODE ", previous);
    if (currentNode && previous) setCurrentNode(previous);
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

  console.log("state", state, "current-node", currentNode);

  return (
    <Context.Provider
      value={{ history: state, onPrev, onNext, hasPrev, hasNext, updateList }}
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
  const { previous, next, onPrev: prevClick, onNext: nextClick } = props;
  const { history, onPrev, onNext, hasPrev } = usePaginator();

  const goBack = () => {
    const value = onPrev();
    prevClick && value && prevClick(value);
    console.log("Prev Value", value);
  };

  const goForward = () => {
    const value = onNext(next, previous);
    nextClick && value && nextClick(value);
  };

  console.log("Paginator History", history);
  return (
    <>
      SOMETHING
      {hasPrev && <Button onClick={goBack}>prev</Button>}
      <Button onClick={goForward}>next</Button>
    </>
  );
}
