import type { IPostModel } from '@/shared/api/models';
import type { TRequestStatuses } from '@/redux/types';

export interface IPostsState {
  items: IPostModel[];
  status: TRequestStatuses;
}
