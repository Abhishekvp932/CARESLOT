import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {RootState}  from './store';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['User', 'Doctor', 'Appointment'],
  endpoints: () => ({}), 
});
