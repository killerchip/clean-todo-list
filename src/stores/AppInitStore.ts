import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction, when } from 'mobx';

import { ToDoStore } from './ToDoStore';
import { ToDoGateway } from '../gateways/ToDoGateway';
import { useNewDependency } from '../ioc/useDependency.react';

type ITodoGateway = Pick<ToDoGateway, 'isReady'>;
type ITodoStore = Pick<ToDoStore, 'load'>;

@injectable()
export class AppInitStore {
  constructor(
    @inject(ToDoGateway) private todoGateway: ITodoGateway,
    @inject(ToDoStore) private todoStore: ITodoStore,
  ) {
    makeAutoObservable(this);
  }

  get isReady() {
    return this.todoGateway.isReady;
  }

  async init() {
    await when(() => this.isReady);
    runInAction(() => {
      this.todoStore.load();
    });
  }
}

export function useInitStore() {
  return useNewDependency<AppInitStore>(AppInitStore);
}
