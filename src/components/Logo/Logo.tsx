import { forwardRef } from "react";
import { Image, BoxProps, HStack } from "@chakra-ui/react";

import Link from "../Link/Link";

import AegleLogo from "assets/images/logo.png";

interface LogoProps extends BoxProps {}

const Logo = forwardRef<HTMLDivElement, LogoProps>((props, ref) => {
  return (
    <Link
      textDecoration="none"
      _hover={{ textDecoration: "none" }}
      to="/"
      {...(props as any)}
    >
      <HStack ref={ref}>
        <Image src={AegleLogo} alt="" />
      </HStack>
    </Link>
  );
});

Logo.displayName = "KoinpollLogo";

export default Logo;
