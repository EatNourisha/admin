import { FormControl, Switch } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { NotificationButton } from "components/Topbar/Topbar";
import { destroy, get, post } from "utils";

const CSStatus = ({ adminId }: { adminId: string }) => {
  const [isCS, setIsCS] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const checkCSStatus = useCallback(async () => {
    await get(`cs/get/cs/${adminId}`)
      .then(() => {
        setIsCS(true);
      })
      .catch(() => {
        setIsCS(false);
      });

    setLoading(false);
  }, [adminId]);

  const onUpdateCSStatus = useCallback(() => {
    setLoading(true);
    if (isCS) {
      destroy(`cs/${adminId}`);
    } else {
      post(`cs/${adminId}`, {});
    }
    setIsCS(!isCS);
    setLoading(false);
  }, [adminId, isCS]);

  useEffect(() => {
    checkCSStatus();
  }, [checkCSStatus]);

  return (
    <FormControl display="flex" w="fit-content" justifyContent="center">
      {isLoading ? (
        <div
          className="rotate"
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <NotificationButton hasNewNotifications={false} isLoading={true} />
        </div>
      ) : (
        <Switch
          ml="8px"
          w="fit-content"
          aria-label="switch meal availability"
          disabled={isLoading}
          isChecked={isCS}
          onChange={onUpdateCSStatus}
          sx={{
            "--switch-track-width": "26px",
            ".chakra-switch__track": {
              bg: "brand.neutral400",
              padding: "3px",
              borderRadius: "26px",
            },
            ".chakra-switch__track[data-checked]": {
              bg: "#03CCAA",
              padding: "3px",
            },
            ".chakra-switch__thumb": {
              shadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
            },
          }}
        />
      )}
    </FormControl>
  );
};

export default CSStatus;
