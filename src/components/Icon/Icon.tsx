import { Box, BoxProps } from "@chakra-ui/layout";

import { ReactComponent as DashboardIcon } from "assets/svgs/dashboard.svg";
import { ReactComponent as AppointmentsIcon } from "assets/svgs/appointments.svg";
import { ReactComponent as PatientsIcon } from "assets/svgs/patients.svg";
import { ReactComponent as DoctorsIcon } from "assets/svgs/doctors.svg";
import { ReactComponent as CalendarIcon } from "assets/svgs/calendar.svg";
import { ReactComponent as ProfileIcon } from "assets/svgs/profile.svg";
import { ReactComponent as AdminIcon } from "assets/svgs/adminstrators.svg";
import { ReactComponent as LogoutIcon } from "assets/svgs/logout.svg";
import { ReactComponent as SearchIcon } from "assets/svgs/search.svg";
import { ReactComponent as NotificationsIcon } from "assets/svgs/notifications.svg";
import { ReactComponent as AudioIcon } from "assets/svgs/audio.svg";
import { ReactComponent as VideoIcon } from "assets/svgs/video.svg";
import { ReactComponent as ChatIcon } from "assets/svgs/chat.svg";
import { useMemo } from "react";

export type IconNames =
  | "dashboard"
  | "appointments"
  | "patients"
  | "doctors"
  | "calendar"
  | "profile"
  | "admin"
  | "logout"
  | "notifications"
  | "search"
  | "audio"
  | "video"
  | "chat";

export interface IconProps extends BoxProps {
  type: IconNames;
}

type MapType = Record<
  IconNames,
  React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & {
      title?: string | undefined;
    }
  >
>;

export default function Icon(props: IconProps) {
  const { type, ...xprops } = props;

  const MappedIcon = useMemo(() => {
    const map: MapType = {
      dashboard: DashboardIcon,
      appointments: AppointmentsIcon,
      patients: PatientsIcon,
      doctors: DoctorsIcon,
      calendar: CalendarIcon,
      profile: ProfileIcon,
      admin: AdminIcon,
      logout: LogoutIcon,
      search: SearchIcon,
      audio: AudioIcon,
      video: VideoIcon,
      chat: ChatIcon,
      notifications: NotificationsIcon,
    };

    return map[type];
  }, [type]);

  return <Box as={MappedIcon} {...xprops} />;
}
