import { FC } from "react";
import { Container, ContainerProps } from "@chakra-ui/react";

import config from "config";

interface MainLayoutContainerProps extends ContainerProps {}

const MainLayoutContainer: FC<MainLayoutContainerProps> = (props) => {
  return (
    <Container px={{base: "16px", md: "20px", lg: "40px"}} maxW={config.containerW} {...props}>
      {props.children}
    </Container>
  );
};

export default MainLayoutContainer;
