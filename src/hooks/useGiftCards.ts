import { ApiResponse,  } from "interfaces";
import { GetGiftCardRo } from "interfaces/auth.interface";
import useSWR from "swr";
import { get } from "utils/makeRequest";
import toQueryString from "utils/toQueryString";

interface IUseUsersFilter {
  // Roles not-in the user's role array field
  nin_roles?: string; // superadmin | customer | superadmin,customer
  roles?: string;
  searchPhrase?: string;
  has_lineup?: boolean;
  has_subscription?: boolean;

  limit?: number;
  page?: number;
}

export default function useGiftCard(filter: IUseUsersFilter) {
  const queries = toQueryString(filter);
  const key = `gift?${queries}`;
  const { data, error,  } = useSWR<ApiResponse<GetGiftCardRo>>(key, get);

  // console.log("USERS", data);

  return {
    key,
    data: data?.data,
    isLoading: !error && !data,
    error,
  };
}
