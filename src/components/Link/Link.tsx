import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import { Link as RouterLink } from "@reach/router";
import { FC } from "react";

interface LinkProps extends ChakraLinkProps {
  to: string;
}

const Link: FC<LinkProps> = (props) => {
  return (
    <ChakraLink
      as={RouterLink}
      borderRadius="2px"
      {...props}
      d="inline-block"
      _focus={{ shadow: `0 0 0 3px var(--focusColor)` }}
    >
      {props.children}
    </ChakraLink>
  );
};

export default Link;
