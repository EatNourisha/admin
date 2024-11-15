import { useToast } from "@chakra-ui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Loader from "components/Loader/Loader";
import { Loader2, Trash2 } from "lucide-react";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { IReport } from "types";
import { destroy, get } from "utils";

function ReportModal({
  userId,
  isFollowUp,
  close,
}: {
  isFollowUp?: boolean;
  close: () => void;
  userId?: string;
}) {
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();
  const [data, setData] = useState<{ data: IReport[]; loading: boolean }>({
    data: [],
    loading: true,
  });

  const getData = useCallback(async () => {
    const data = await get(
      `${isFollowUp ? `cs/followup/${userId}` : `cs/report/${userId}`}`
    );
    //@ts-ignore
    setData({ loading: false, data: data?.data });
  }, [isFollowUp, userId]);

  const handleDelete = async (reportId: string) => {
    setDeleting(true);

    try {
      await destroy(`${isFollowUp ? "cs/followup" : "cs/report"}/${reportId}`);

      const newData = data.data.filter((report) => report._id !== reportId);
      setData({ loading: false, data: newData });

      toast({
        position: "top-right",
        title: "Deleted",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        position: "top-right",
        title: "Error",
        description: "Failed to delete",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);
  return (
    <div className="w-full bg-white px-8 py-6 rounded-[0.75rem] flex flex-col gap-8 max-h-[40rem] overflow-y-scroll">
      <div className="flex justify-between items-center">
        <h4 className="font-inter text-2xl text-[#303237]">
          {isFollowUp ? "Follow up History" : "Report History"}
        </h4>
        <Icon
          className="w-8 h-8 cursor-pointer"
          onClick={close}
          color="#303237"
          icon="iconoir:cancel"
        />
      </div>
      {data.loading ? (
        <Loader />
      ) : (
        <div className="flex flex-col gap-3 w-full">
          {/* <h4 className="text-sm text-black font-inter">13 AUGUST, 2024</h4> */}

          {!!data?.data.length ? (
            <div className="grid grid-cols-2 gap-[0.75rem]">
              {data?.data.map((rpt, index) => (
                <div
                  key={`index_report_${index}`}
                  className="flex-1 flex items-start"
                >
                  <div className="flex-1 w-full mr-2">
                    <div className="rounded-[0.5rem] p-3 border-[1px] border-[#D9D9D9]">
                      <h4 className="text-black font-inter font-bold text-sm">
                        {rpt?.by?.first_name + " " + rpt?.by?.last_name}
                      </h4>

                      <div className="text-[#303237] text-[0.75rem] ">
                        {rpt?.text}
                      </div>
                    </div>
                    <p className="text-[0.75rem] text-right">
                      {moment(rpt?.createdAt).format("D/M/y")}
                    </p>
                  </div>
                  {deleting ? (
                    <Loader2 className="h-4 w-4 cursor-pointer text-[#FF0000] animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 cursor-pointer text-[#FF0000]"  onClick={() => handleDelete(rpt._id)}/>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              No {isFollowUp ? "Follow up's" : "Reports"} yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportModal;
