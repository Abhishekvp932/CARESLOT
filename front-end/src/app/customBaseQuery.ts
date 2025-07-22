// src/features/api/customBaseQuery.ts

import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

import { logOut as userLogOut } from "@/features/auth/authSlice";
import { logOut as doctorLogOut } from "@/features/docotr/doctorSlice";
import { logOut as adminLogOut } from "@/features/admin/adminSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api",
  credentials: "include",
});

export const customBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("Access token expired. Trying refresh...");

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      console.log("Refresh successful. Retrying original request.");

      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log("Refresh failed. Logging out.");

      const state: any = api.getState();
      if (state?.user?.token) {
        api.dispatch(userLogOut());
      } else if (state?.doctor?.token) {
        api.dispatch(doctorLogOut());
      } else if (state?.admin?.token) {
        api.dispatch(adminLogOut());
      }
    }
  }

  return result;
};
