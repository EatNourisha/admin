import { Box, LinkProps, Text, HStack } from "@chakra-ui/react";
import { FC } from "react";
import capitalize from "lodash/capitalize";
// import hexToRgba from "utils/hexToRgba";
import Link from "components/Link/Link";
import { motion, AnimatePresence } from "framer-motion";

interface SidebarLinkProps extends LinkProps {
  icon?: React.ReactNode | any;
  activeIcon?: React.ReactNode | any;
  label: string;
  to: string;

  isCurrent?: boolean;
  _current?: LinkProps;
}

const SidebarLink: FC<SidebarLinkProps> = (props) => {
  const { icon, activeIcon, label, to, isCurrent, _current, ...xprops } = props;

  const whenCurrent = (): LinkProps =>
    isCurrent
      ? {
          bg: "rgba(255, 255, 255, 0.1)",
          color: "white",
          // borderLeftColor: "white",
          pos: "relative",
          ..._current,
          _after: {
            content: '""',
            pos: "absolute",
            w: "12px",
            h: "100%",
            bg: "transparent",
            top: 0,
            left: -1,
            borderRightRadius: "4px",
            transition: "width .3s ease-in-out",
          },
        }
      : {};

  const syntheticProps = { ...xprops, ...whenCurrent() };

  return (
    <Link
      // as={HStack}
      display="flex"
      flexDir="row"
      alignItems="center"
      to={to}
      mb="16px !important"
      p="14px 34px"
      w="100%"
      // border="4px solid transparent"
      // borderRadius="4px"
      color="#ffffff8f"
      _hover={{
        bg: "rgba(255, 255, 255, 0.2)",
      }}
      overflow="hidden"
      minH="51px"
      // _after={{
      //   content: '""',
      //   pos: "absolute",
      //   w: "0px",
      //   h: "100%",
      //   bg: "white",
      //   top: 0,
      //   left: -1,
      //   borderRightRadius: "4px",
      //   willChange: "width",
      //   transition: "width .3s ease-in-out",
      // }}
      {...syntheticProps}
    >
      <HStack>
        <AnimatePresence exitBeforeEnter initial={false}>
          <motion.div
            key={`icon-${isCurrent ? "active" : "inactive"}`}
            initial={{ scale: 0.9, y: -4, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 4, opacity: 0 }}
            // transition={{ type: "spring", stiffness: 100 }}
          >
            {/* <HStack> */}
            {!isCurrent && (
              <Box boxSize="20px" as={icon} color="brand.grey400" />
            )}
            {isCurrent && <Box boxSize="20px" as={activeIcon} />}
          </motion.div>
        </AnimatePresence>

        <Text
          ml="18px !important"
          fontSize="sm"
          fontWeight="500"
          color="inherit"
          // color={isCurrent ? "brand.black" : "brand.greyText"}
        >
          {capitalize(label)}
        </Text>
      </HStack>
    </Link>
  );
};

export default SidebarLink;
