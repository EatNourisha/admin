import { useMemo } from "react";
import { HStack, Text, BoxProps } from "@chakra-ui/react";
import { IconNames } from "components/Icon/Icon";
import CircleIcon from "components/Icon/CircleIcon";

interface MeansProps extends BoxProps {
  type: "audio" | "video" | "chat";
}

type OptionMapType = Record<
  MeansProps["type"],
  { bg: string; icon: IconNames; label: string }
>;

export default function Means(props: MeansProps) {
  const { type } = props;

  const options = useMemo(() => {
    const map: OptionMapType = {
      audio: {
        bg: "brand.lightGreen",
        icon: "audio",
        label: "Audio Call",
      },
      video: { bg: "brand.red", icon: "video", label: "Video Call" },
      chat: { bg: "brand.lightBlue", icon: "chat", label: "Chat" },
    };

    return map[type];
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
