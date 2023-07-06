import { HStack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  PaginationSeparator,
  usePagination,
} from "@ajna/pagination";

import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

// import CircularLoader from "../Loader/CircularLoader";

import clamp from "lodash/clamp";
// import { useDefaultStyle } from "hooks";

// Fix for the 'children does not exist' issue;
// const Pagination = (
//   props: PropsWithChildren<{ pagesCount: number; currentPage: number; isDisabled?: boolean; onPageChange: (page: number) => void }>
// ) => cloneElement(P as any, props);

// interface PaginatorProps {
//   totalCount: number;
//   limit: number;
//   page: number;

//   onPageChange: (page: number) => void;
// }

/**
 * Uses javascript, breaks when used with typescript because of the dead typing that comes outta the
 * box with the `@ajna/pagination` package.
 *
 * Pass in `totalCount` for the total number of items available from the data source
 * @prop totalCount
 *
 * Pass in `limit` for the number of items to show per page.
 * @prop limit
 *
 * Pass in `page` for the current page to show.
 * @prop page
 *
 * onPageChange callback event it triggered when a page changes
 * @prop onPageChange
 *
 * isLoading boolean value to indicate the fetch state of the data
 * @prop isLoading
 *
 * @example
 * ```javascript
 * <Paginator totalCount={100} limit={10} page={1} onPageChange={(currentPage) => setCurrentPage(currentPage)}
 * ```
 *
 */
export default function APaginator(props /*: PaginatorProps*/) {
  const { isLoading, totalCount, limit, page, onPageChange, ...xprops } = props;

  // const { shadow, borderColor } = useDefaultStyle();

  // const color = useColorModeValue("primary.800", "secondary.500");
  const sepBorderColor = useColorModeValue("primary.700", "secondary.700");

  const {
    pages,
    pagesCount,
    offset,
    currentPage,
    setCurrentPage,
    isDisabled,
    pageSize,
  } = usePagination({
    total: totalCount,
    limits: {
      outer: 1,
      inner: 1,
    },
    initialState: {
      pageSize: limit,
      isDisabled: false,
      currentPage: page,
    },
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange && onPageChange(page);
  };

  return (
    <VStack
      // bg="white"
      p="20px 0"
      justifyContent="space-between"
      // borderRadius="0px 0px 16px 16px"
      // flexDir={["column", "row"]}
      w="100%"
      // mt="0 !important"
      {...xprops}
    >
      {totalCount > 0 && (
        <HStack>
          <Text>
            Showing {offset + 1} to{" "}
            {clamp(
              offset + pageSize,
              Math.min(totalCount, pageSize),
              totalCount ?? 0
            )}{" "}
            of {totalCount ?? 0}
          </Text>

          {/* {isLoading && <CircularLoader isIndeterminate />} */}
        </HStack>
      )}
      <HStack mt="0 !important">
        <Pagination
          pagesCount={pagesCount}
          currentPage={currentPage}
          isDisabled={isDisabled}
          onPageChange={handlePageChange}
        >
          <PaginationContainer
            align="center"
            justify="space-between"
            p={4}
            w="full"
          >
            <PaginationPrevious
              mr="8px"
              minH="40px"
              minW="40px"
              maxW="unset"
              maxH="unset"
              boxSize="40px"
              p="0"
              color={"white"}
              borderRadius="50px"
              // _focus={{
              //   borderColor,
              //   shadow,
              // }}
              _active={{ bg: "transparent" }}
              _hover={{
                bg: "brand.primary",
                color: "black",
              }}
              bg="brand.primary"
            >
              <ChevronLeftIcon />
            </PaginationPrevious>
            <PaginationPageGroup
              isInline
              align="center"
              minH="20px"
              minW="20px"
              separator={
                <PaginationSeparator
                  minH="30px"
                  minW="30px"
                  maxW="unset"
                  maxH="unset"
                  border="1px solid transparent"
                  bg="transparent"
                  borderColor={sepBorderColor}
                  borderRadius="6px"
                  color={"black"}
                  fontSize="sm"
                  boxSize="30px"
                  p="0"
                  jumpSize={4}
                  _active={{ bg: "transparent" }}
                  _hover={{
                    bg: "transparent",
                  }}
                  // _focus={{
                  //   borderColor,
                  //   shadow,
                  // }}
                />
              }
            >
              {pages.map((page) => (
                <PaginationPage
                  minH="30px"
                  minW="30px"
                  maxW="unset"
                  maxH="unset"
                  boxSize="20px"
                  bg="transparent"
                  border="1px solid transparent"
                  borderRadius="50px"
                  color={"brand.neutral400"}
                  borderColor={sepBorderColor}
                  key={`pagination_page_${
                    page || Math.random() * 7676767665453
                  }`}
                  page={page}
                  p="0"
                  fontSize="sm"
                  _active={{ bg: "transparent" }}
                  _hover={{
                    bg: "transparent",
                  }}
                  // _focus={{
                  //   borderColor,
                  //   shadow,
                  // }}
                  _current={{
                    borderColor: "transparent",
                    bg: sepBorderColor,
                    fontSize: "sm",
                    minW: "30px !important",
                    minH: "30px !important",
                    color: "brand.primary",
                    _hover: {
                      borderColor: sepBorderColor,
                      bg: "transparent",
                      color: "black",
                    },
                  }}
                />
              ))}
            </PaginationPageGroup>

            <PaginationNext
              ml="8px"
              minH="40px"
              minW="40px"
              maxW="unset"
              maxH="unset"
              boxSize="40px"
              p="0"
              color={"white"}
              borderRadius="50px"
              _active={{ bg: "transparent" }}
              // _focus={{
              //   borderColor,
              //   shadow,
              // }}
              _hover={{
                bg: "brand.primary",
                color: "black",
              }}
              bg="brand.primary"
            >
              <ChevronRightIcon />
            </PaginationNext>
          </PaginationContainer>
        </Pagination>
      </HStack>
    </VStack>
  );
}
