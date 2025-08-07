// src/features/api/api.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { customBaseQuery } from "./customBaseQuery";
export const api = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["Patient", "Doctor", "Slot", "Admin", "Appointment"],
  endpoints: () => ({}),
});
