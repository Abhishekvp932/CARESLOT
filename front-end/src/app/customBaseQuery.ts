// src/features/api/customBaseQuery.ts
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

import { logOut as userLogOut } from "@/features/auth/authSlice";
import { logOut as doctorLogOut } from "@/features/docotr/doctorSlice";
import { AdminlogOut as adminLogOut } from "@/features/admin/adminSlice";
import type { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === "production"
      ? "https://www.careslot.site/api"
      : "http://localhost:3000/api",
  credentials: "include",
});

export const customBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  // 🧠 If Unauthorized, handle refresh logic carefully
  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;

    const hasLoggedInUser =
      state?.auth?.user || state?.doctor?.doctor || state?.admin?.admin;

    // ❌ Skip refresh if no one is logged in (public route)
    if (!hasLoggedInUser) {
      return result;
    }

    // ✅ Try refresh token if user exists
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult?.data) {
      // Retry the original query after refresh
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed → force logout
      if (state?.auth?.user) {
        api.dispatch(userLogOut());
      } else if (state?.doctor?.doctor) {
        api.dispatch(doctorLogOut());
      } else if (state?.admin?.admin) {
        api.dispatch(adminLogOut());
      }
    }
  }

  return result;
};
