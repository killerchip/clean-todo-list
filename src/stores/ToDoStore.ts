import { inject, injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { ToDoItem } from './todoModel';
import { ToDoGateway } from '../gateways/ToDoGateway';

type ITodoGateway = Pick<ToDoGateway, 'getAll' | 'create' | 'update'>;

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

  createTodo = async (newTodo: Omit<ToDoItem, 'id'>) => {
    const newId = await this._todoGateway.create(newTodo);
    const todo = { ...newTodo, id: newId };
    runInAction(() => {
      this.todos.push(todo);
    });
  };
}
