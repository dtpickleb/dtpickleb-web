import { createSlice } from "@reduxjs/toolkit";
import { AllEnums } from "./api";

export interface EnumsState {
  data: AllEnums["data"] | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: EnumsState = {
  data: null,
  loading: false,
  error: null,
  initialized: false,
};

// Async thunk to fetch all enums
// TODO: Re-enable this after backend caching is implemented
// export const fetchAllEnums = createAsyncThunk(
//   "enums/fetchAll",
//   async (_, { rejectWithValue }) => {
//     try {
//       const data = await enumsApi.getAll();

//       return data?.data ?? [];
//     } catch (error: any) {
//       return rejectWithValue(error.message || "Failed to fetch enums");
//     }
//   }
// );

const enumsSlice = createSlice({
  name: "enums",
  initialState,
  reducers: {
    clearEnums: (state) => {
      state.data = null;
      state.initialized = false;
      state.error = null;
    },
  },
  // TODO: Re-enable this after backend caching is implemented
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchAllEnums.pending, (state) => {
  //       state.loading = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchAllEnums.fulfilled, (state, action) => {
  //       state.loading = false;
  //       state.data = action.payload;
  //       state.initialized = true;
  //       state.error = null;
  //     })
  //     .addCase(fetchAllEnums.rejected, (state, action) => {
  //       state.loading = false;
  //       state.error = action.payload as string;
  //       state.initialized = true;
  //     });
  // },
});

export const { clearEnums } = enumsSlice.actions;
export default enumsSlice.reducer;
