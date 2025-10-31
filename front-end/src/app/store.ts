    // src/app/store.ts

    import { configureStore, combineReducers } from "@reduxjs/toolkit";
    import { api } from "./api";
    import authReducer from "../features/auth/authSlice";
    import storage from "redux-persist/lib/storage";
    import doctorReducer from '../features/docotr/doctorSlice'
    import adminReducer from '../features/admin/adminSlice'
    import {
      persistStore,
      persistReducer,
      FLUSH,
      REHYDRATE,
      PAUSE,
      PERSIST,
      PURGE,
      REGISTER,
    } from "redux-persist";

    const rootReducer = combineReducers({
      [api.reducerPath]: api.reducer,
      auth: authReducer,
      doctor:doctorReducer,
      admin:adminReducer,
    });

    const persistConfig = {
      key: "root",
      storage,
      whitelist: ["auth","doctor","admin"],
    };

    const persistedReducer = persistReducer(persistConfig, rootReducer);

    export const store = configureStore({
      reducer: persistedReducer,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          },
        }).concat(api.middleware),
    });

    export const persistor = persistStore(store);

    export type RootState = ReturnType<typeof store.getState>;
    export type AppDispatch = typeof store.dispatch;
