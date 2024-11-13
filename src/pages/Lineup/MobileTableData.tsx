import React from "react";
import {
  Box,
  BoxProps,
  Button,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { navigate } from "@reach/router";
import { Gravatar } from "components";
import MobileDataSkeleton from "components/MobileDataSkeleton";
import { currencyFormat } from "utils";
import { formatDistanceToNow, parseISO } from "date-fns";
import { join } from "lodash";
import moment from "moment";
import configs from "config";
import Empty from "assets/images/folder.png";
import { OrderStatusBadge } from "pages/Orders/OrderStatusBadge";

interface MobileTableDataProps extends BoxProps {
  data?: any[];
  isLoading?: boolean;
  type: "lineup" | "order";
  onViewLineup?: (user: any) => void;
}

const MobileTableData: React.FC<MobileTableDataProps> = ({
  data = [],
  isLoading,
  type,
  onViewLineup,
  ...boxProps
}) => {
  if (isLoading) {
    return <MobileDataSkeleton count={10} />;
  }

  if (!data?.length) {
    return (
      <VStack maxW="200px" mx="auto" my="180px" hideFrom="md">
        <Image src={Empty} alt="empty list" />
        <Text textAlign="center" fontSize="14px">
          No {type === "lineup" ? "lineups" : "orders"} found
        </Text>
      </VStack>
    );
  }

  const renderLineupData = (item: any) => (
    <VStack alignItems="stretch" gap="12px">
      <Gravatar
        title={join([item?.first_name, item?.last_name], " ")}
        IsReturningCustomer={item?.isReturningCustomer}
        onClick={() => navigate(`${configs.paths.users}/${item?._id}`)}
      />
      <HStack justifyContent="space-between">
        <Box>
          <Text color="gray.600">Status</Text>
          <Text fontSize="14px" fontWeight="medium">
            {item?.status}
          </Text>
        </Box>
        <Box>
          <Text color="gray.600">City</Text>
          <Text fontSize="14px" fontWeight="medium">
            {item?.address?.city ?? "---"}
          </Text>
        </Box>
      </HStack>
      <Box>
        <Text color="gray.600">Delivery Date</Text>
        <Text fontSize="14px" fontWeight="medium">
          {moment(item?.delivery_date).format("DD/MM/YYYY")}
        </Text>
      </Box>
      <Button size="sm" width="full" onClick={() => onViewLineup?.(item)}>
        View Lineup
      </Button>
    </VStack>
  );

  const renderOrderData = (order: any) => (
    <VStack alignItems="stretch" gap="12px">
      <Gravatar
        src={order?.customer?.profilePhotoUrl}
        title={join(
          [order?.customer?.first_name, order?.customer?.last_name],
          " "
        )}
        IsReturningCustomer={order?.isReturningCustomer}
        subtitle={
          !order?.customer?.createdAt
            ? undefined
            : `${formatDistanceToNow(parseISO(order?.customer?.createdAt))} ago`
        }
      />
      <HStack justifyContent="space-between">
        <Box>
          <Text color="gray.600">Reference ID</Text>
          <Text fontSize="14px" fontWeight="medium">
            {order?.ref ?? "---"}
          </Text>
        </Box>
        <Box>
          <Text color="gray.600">Phone</Text>
          <Text fontSize="14px" fontWeight="medium">
            {order?.phone_number ?? "---"}
          </Text>
        </Box>
      </HStack>
      <HStack justifyContent="space-between">
        <Box>
          <Text color="gray.600">Subtotal</Text>
          <Text fontSize="14px" fontWeight="medium">
            {currencyFormat("gbp").format(order?.subtotal ?? 0)}
          </Text>
        </Box>
        <Box>
          <Text color="gray.600">Total</Text>
          <Text fontSize="14px" fontWeight="medium">
            {currencyFormat("gbp").format(order?.total ?? 0)}
          </Text>
        </Box>
      </HStack>
      <Box>
        <Text color="gray.600">Status</Text>
        <OrderStatusBadge type={order?.status} />
      </Box>
      <Button
        size="sm"
        width="full"
        onClick={() => navigate(`${configs.paths.order}/${order?._id}`)}
      >
        View Details
      </Button>
    </VStack>
  );

  return (
    <VStack spacing={4} width="full" hideFrom="md" {...boxProps}>
      {data.map((item, index) => (
        <Box
          key={`${type}-${index}`}
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          fontSize="sm"
          w="full"
        >
          {type === "lineup" ? renderLineupData(item) : renderOrderData(item)}
        </Box>
      ))}
    </VStack>
  );
};

export default MobileTableData;
