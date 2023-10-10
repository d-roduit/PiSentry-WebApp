import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedRecording: null,
};

export const recordingsSlice = createSlice({
  name: 'recordings',
  initialState,
  reducers: {
    setSelectedRecording: (state, action) => {
      state.selectedRecording = action.payload;
    },
  },
});
