import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { ToDoGateway } from '../gateways/ToDoGateway';
import { useInject } from '../ioc/useDependency.react';

interface ITodoGateway {
  isReady: boolean;
}

@injectable()
export class AppInitStore {
  constructor(@inject(ToDoGateway) private todoGateway: ITodoGateway) {
    makeAutoObservable(this);
  }

  get isReady() {
    return this.todoGateway.isReady;
  }
}

export function useInitStore() {
  return useInject<AppInitStore>(AppInitStore);
}
