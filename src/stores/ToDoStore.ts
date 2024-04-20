import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { ToDoItem } from './todoModel';
import { ToDoGateway } from '../gateways/ToDoGateway';

interface ITodoGateway {
  getAll(): Promise<ToDoItem[]>;
}

@injectable()
export class ToDoStore {
  todos: ToDoItem[] = [];

  constructor(@inject(ToDoGateway) private _todoGateway: ITodoGateway) {
    makeAutoObservable(this);
  }

  async load() {
    const all = await this._todoGateway.getAll();
    runInAction(() => {
      console.log(all);
      this.todos = all;
    });
  }
}
