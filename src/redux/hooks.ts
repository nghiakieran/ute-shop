/**
 * Redux Typed Hooks
 * File này export typed hooks để sử dụng trong toàn bộ app
 */

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Sử dụng typed hooks thay vì plain useDispatch và useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

