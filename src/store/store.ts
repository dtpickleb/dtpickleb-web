import { configureStore } from "@reduxjs/toolkit";
import enumsReducer from "@/app/features/enums/enumsSlice";
import playerProfileReducer from "@/app/features/registration/playerProfileSlice";

export const store = configureStore({
  reducer: {
    enums: enumsReducer,
    playerProfile: playerProfileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
