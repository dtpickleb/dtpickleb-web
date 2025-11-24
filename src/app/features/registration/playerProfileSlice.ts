import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchPlayerProfile } from "./api";
import type { PlayerProfile } from "./types";

export interface PlayerProfileState {
  profile: PlayerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlayerProfileState = {
  profile: null,
  loading: false,
  error: null,
};

// Async thunk to fetch player profile
export const loadPlayerProfile = createAsyncThunk(
  "playerProfile/load",
  async () => {
    try {
      const profile = await fetchPlayerProfile();
      return profile;
    } catch (error: unknown) {
      console.error(error);
      return null;
    }
  }
);

const playerProfileSlice = createSlice({
  name: "playerProfile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.loading = false;
      state.error = null;
    },
    setProfile: (state, action: PayloadAction<PlayerProfile | null>) => {
      state.profile = action.payload;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPlayerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadPlayerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(loadPlayerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProfile, setProfile } = playerProfileSlice.actions;
export default playerProfileSlice.reducer;
