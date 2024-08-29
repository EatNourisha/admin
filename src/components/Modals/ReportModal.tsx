import { useToast } from "@chakra-ui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Loader from "components/Loader/Loader";
import moment from "moment";
import { useEffect, useState } from "react";
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
  const getData = async () => {
    const data = await get(
      `${isFollowUp ? `cs/followup/${userId}` : `cs/report/${userId}`}`
    );
    //@ts-ignore
    setData({ loading: false, data: data?.data });
  };

  const onDelete = async (id: string) => {
    setDeleting(true);
    await destroy(isFollowUp ? `cs/followup/${id}` : `cs/report/${id}`);
    setDeleting(false);
    const newData = data.data.filter((d) => d._id !== id);
    setData({
      loading: false,
      data: newData,
    });
    toast({
      position: "bottom-right",
      title: "Deleted",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  useEffect(() => {
    getData();
  }, []);
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
                  <div className="flex-1 w-full">
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
                    <Loader size="15px" />
                  ) : (
                    <Icon
                      onClick={() => onDelete(rpt._id)}
                      color="#FF0000"
                      icon="uiw:delete"
                      className="h-w-24 cursor-pointer  w-[10%]"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">No {isFollowUp ? "Follow up's" : "Reports"} yet</div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportModal;
