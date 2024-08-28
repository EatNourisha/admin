import { Icon } from "@iconify/react/dist/iconify.js";
import Loader from "components/Loader/Loader";
import moment from "moment";
import { useEffect, useState } from "react";
import { IReport } from "types";
import { get } from "utils";

function ReportModal({
  userId,
  isFollowUp,
  close,
}: {
  isFollowUp?: boolean;
  close: () => void;
  userId: string;
}) {
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

  const onDelete =()=>{
  }

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

          <div className="grid grid-cols-2 gap-[0.75rem]">
            {data?.data.map((data, index) => (
              <div
                key={`index_report_${index}`}
                className="flex-1 flex items-start"
              >
                <div>
                  <div className="rounded-[0.5rem] p-3 border-[1px] border-[#D9D9D9]">
                    <h4 className="text-black font-inter font-bold text-sm">
                      {data?.by?.first_name + " " + data?.by?.last_name}
                    </h4>

                    <div className="text-[#303237] text-[0.75rem] ">
                      {data?.text}
                    </div>
                  </div>
                  <p className="text-[0.75rem] text-right">
                    {moment(data?.createdAt).format("D/M/y")}
                  </p>
                </div>
                <Icon
                onClick={onDelete}
                  color="#FF0000"
                  icon="uiw:delete"
                  className="w-24 h-w-24 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportModal;
