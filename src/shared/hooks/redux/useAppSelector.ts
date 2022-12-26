import { useSelector, TypedUseSelectorHook } from 'react-redux';

import type { TRootState } from '@/redux/store';

export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;
