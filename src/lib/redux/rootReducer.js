import { recordingsSlice } from './slices/index.js';
import { camerasSlice } from './slices/index.js';

export const rootReducer = {
    recordings: recordingsSlice.reducer,
    cameras: camerasSlice.reducer,
}
