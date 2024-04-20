import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { ToDoItem } from './todoModel';
import { ToDoGateway } from '../gateways/ToDoGateway';

interface ITodoGateway {
  getAll(): Promise<ToDoItem[]>;
  update(todo: ToDoItem): Promise<void>;
}

@injectable()
export class ToDoStore {
  todos: ToDoItem[] = [];

  constructor(@inject(ToDoGateway) private _todoGateway: ITodoGateway) {
    makeAutoObservable(this);
    this.load().then();
  }

  async load() {
    const all = await this._todoGateway.getAll();
    runInAction(() => {
      this.todos = all;
    });
  }

  updateTodo = async (newTodo: ToDoItem) => {
    const index = this.todos.findIndex((todo) => todo.id === newTodo.id);
    if (index === -1) {
      return;
    }
    this.todos[index] = newTodo;
    await this._todoGateway.update(newTodo);
  };
}
