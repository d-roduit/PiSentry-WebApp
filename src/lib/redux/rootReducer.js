import { recordingsSlice } from './slices/index.js';

export const rootReducer = {
    recordings: recordingsSlice.reducer,
}
