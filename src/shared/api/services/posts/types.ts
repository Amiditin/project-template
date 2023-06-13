import type { IModelId, IDefaultModel, TAxiosRequest } from '@/shared/api/services/types';

export interface IPostModel extends IDefaultModel {
  title: string;
  text: string;
}

export type TPostCreate = Omit<IPostModel, keyof IDefaultModel>;

export type TPostUpdate = IModelId & Partial<TPostCreate>;

export interface IPostsService {
  findAll: TAxiosRequest<void, IPostModel[]>;

  findById: TAxiosRequest<IModelId, IPostModel>;

  create: TAxiosRequest<TPostCreate, IPostModel>;

  update: TAxiosRequest<TPostUpdate, undefined>;

  remove: TAxiosRequest<IModelId, undefined>;
}
