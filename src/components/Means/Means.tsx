import { useMemo } from "react";
import { HStack, Text, BoxProps } from "@chakra-ui/react";
import { IconNames } from "components/Icon/Icon";
import CircleIcon from "components/Icon/CircleIcon";
import { MeansOfContact } from "interfaces";

interface MeansProps extends BoxProps {
  type: MeansOfContact;
}

type OptionMapType = Record<
  MeansProps["type"],
  { bg: string; icon: IconNames; label: string }
>;

export default function Means(props: MeansProps) {
  const { type } = props;

  const options = useMemo(() => {
    const map: OptionMapType = {
      [MeansOfContact.AUDIO]: {
        bg: "brand.lightGreen",
        icon: "audio",
        label: "Audio Call",
      },
      [MeansOfContact.VIDEO]: {
        bg: "brand.red",
        icon: "video",
        label: "Video Call",
      },
      [MeansOfContact.CHAT]: {
        bg: "brand.lightBlue",
        icon: "chat",
        label: "Chat",
      },
    };

    return map[type ?? MeansOfContact.AUDIO];
  }, [type]);

  return (
    <HStack>
      <CircleIcon type={options.icon} bg={options.bg} boxSize="30px" />

      <Text fontSize="14px" fontWeight="400">
        {options.label}
      </Text>
    </HStack>
  );
}
