import { useCallback } from "react";
// import useErrorStore from "stores/error";
import usePartialState from "./usePartialState";
import { ApiResponse } from "interfaces";
import { post } from "utils/makeRequest";
import { useSWRConfig } from "swr";
interface IState {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
}

interface SendMail {
    subscriptionStatus: string;
    subject: string;
    message: string;
}
export default function SendEmail(keys?: string[]) {
    const { mutate } = useSWRConfig();
    const [state, set] = usePartialState<IState>({
        isLoading: false,
        isSuccess: false,
        isError: false,
    });


    const activeUser = useCallback(
        async (data: SendMail) => {
            set({ isLoading: true, isSuccess: false });
            try {
                const res = (await post<ApiResponse<SendMail>, SendMail>(`/customers/send_mail`, data)).data as SendMail
                keys?.forEach(async (key) => await mutate(key));

                set({ isSuccess: true, isLoading: false });

                return res;
            } catch (error) {
                set({ isError: true });
            }
            set({ isLoading: false });
        },
        [set, keys, mutate]
    )

    return {
        activeUser,
        ...state
    }
}