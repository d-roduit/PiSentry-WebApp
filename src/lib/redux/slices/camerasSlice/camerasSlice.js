import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCamera: null,
};

export const camerasSlice = createSlice({
  name: 'cameras',
  initialState,
  reducers: {
    setSelectedCamera: (state, action) => {
      state.selectedCamera = action.payload;
    },
  },
});
