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
import { ReactComponent as ViewIcon } from "assets/svgs/view.svg";
import { ReactComponent as LeftArrowIcon } from "assets/svgs/arrow_left.svg";
import { ReactComponent as EditIcon } from "assets/svgs/edit.svg";
import { ReactComponent as EmailIcon } from "assets/svgs/mail.svg";
import { ReactComponent as PhoneIcon } from "assets/svgs/phone.svg";
import { ReactComponent as FileIcon } from "assets/svgs/file.svg";
import { ReactComponent as FolderIcon } from "assets/svgs/folder.svg";
import { ReactComponent as HashIcon } from "assets/svgs/hash.svg";
import { ReactComponent as CheckedIcon } from "assets/svgs/checked.svg";
import { ReactComponent as CancelIcon } from "assets/svgs/cancel.svg";
import { ReactComponent as AddIcon } from "assets/svgs/add.svg";
import { ReactComponent as DeleteIcon } from "assets/svgs/delete.svg";
import { ReactComponent as DateIcon } from "assets/svgs/date.svg";
import { ReactComponent as TimeIcon } from "assets/svgs/time.svg";
import { ReactComponent as PlusSquareIcon } from "assets/svgs/plus.svg";
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
  | "chat"
  | "view"
  | "edit"
  | "email"
  | "phone"
  | "file"
  | "folder"
  | "hash"
  | "checked"
  | "cancel"
  | "leftArrow"
  | "add"
  | "delete"
  | "date"
  | "time"
  | "plus";

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
      add: AddIcon,
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
      view: ViewIcon,
      edit: EditIcon,
      email: EmailIcon,
      phone: PhoneIcon,
      file: FileIcon,
      folder: FolderIcon,
      hash: HashIcon,
      checked: CheckedIcon,
      cancel: CancelIcon,
      leftArrow: LeftArrowIcon,
      notifications: NotificationsIcon,
      delete: DeleteIcon,
      date: DateIcon,
      time: TimeIcon,
      plus: PlusSquareIcon,
    };

    return map[type];
  }, [type]);

  return <Box as={MappedIcon} {...xprops} />;
}
