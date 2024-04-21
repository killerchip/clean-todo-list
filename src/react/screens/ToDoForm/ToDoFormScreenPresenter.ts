import { inject, injectable } from 'inversify';
import { action, makeAutoObservable } from 'mobx';

import {
  createDependencyContext,
  useNewDependency,
} from '../../../ioc/useDependency.react';
import { ToDoStore } from '../../../stores/ToDoStore';
import { ToDoItemViewModel } from '../todoViewModel';

@injectable()
export class ToDoFormScreenPresenter {
  private _id?: string = undefined;

  constructor(@inject(ToDoStore) private _toDoStore: ToDoStore) {
    makeAutoObservable(this);
  }

  get isNewTodo() {
    return this._id === undefined;
  }

  get todo(): ToDoItemViewModel | undefined {
    return this._toDoStore.todos.find((todo) => todo.id === this._id);
  }

  get pageTitle() {
    return this.isNewTodo ? 'New Task' : this.todo?.title;
  }

  init(id?: string) {
    this._id = id;
  }
}

export const ToDoFormScreenPresenterContext =
  createDependencyContext<ToDoFormScreenPresenter>();

export function useToDoListScreenPresenter(id?: string) {
  return useNewDependency(
    ToDoFormScreenPresenter,
    action((presenter) => presenter.init(id)),
  );
}
