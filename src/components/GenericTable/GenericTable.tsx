import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  TableProps,
  Skeleton,
} from "@chakra-ui/react";
import React from "react";

export interface GenericTableProps extends TableProps {
  headers: string[];
  isLoading?: boolean;
}

export interface GenericTableItemProps {
  cols: Array<React.ReactNode>;
  onClick?: () => void;
  isClickable?: boolean;
  isLast?: boolean;
}

export default function GenericTable(props: GenericTableProps) {
  const { headers, isLoading, children } = props;

  return (
    <Table variant="simple">
      <Thead bg="brand.neutral50" h="74px">
        <Tr>
          {headers.map((header) => (
            <Th textTransform="capitalize" fontSize="14px" color="brand.black">
              {header}
            </Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {isLoading &&
          Array(10)
            .fill(0)
            .map((_, i) => (
              <Tr key={`header-row:${i}`}>
                {headers.map((header, i) => (
                  <Td key={`header-loading:${i}`}>
                    <Skeleton
                      isLoaded={!isLoading ?? true}
                      borderRadius="12px"
                      h="14px"
                    >
                      {header}
                    </Skeleton>
                  </Td>
                ))}
              </Tr>
            ))}

        {!isLoading && children}

        {!isLoading && !children && <>No Data</>}
      </Tbody>
    </Table>
  );
}

export function GenericTableItem(props: GenericTableItemProps) {
  const { cols, onClick, isClickable = false } = props;
  return (
    <Tr
      onClick={onClick}
      _hover={{ cursor: isClickable ? "pointer" : "default", bg: "#F7F8F98f" }}
      borderBottom="none"
    >
      {cols?.map((col, i) => (
        <Td key={`col:${i}`}>{col}</Td>
      ))}
    </Tr>
  );
}
