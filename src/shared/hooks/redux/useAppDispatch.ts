import { useDispatch } from 'react-redux';

import type { TAppDispatch } from '@/redux/store';

export const useAppDispatch = () => useDispatch<TAppDispatch>();
