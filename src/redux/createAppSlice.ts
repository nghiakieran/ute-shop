/**
 * Create App Slice Helper
 * Giống như source code AVN_PMS, hỗ trợ async thunks
 */

import { asyncThunkCreator, buildCreateSlice } from '@reduxjs/toolkit';

// `buildCreateSlice` cho phép tạo slice với async thunks
export const createAppSlice = buildCreateSlice({
  creators: { asyncThunk: asyncThunkCreator }
});

