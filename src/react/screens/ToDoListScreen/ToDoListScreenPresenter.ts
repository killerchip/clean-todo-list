import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import {
  createDependencyContext,
  useNewDependency,
} from '../../../ioc/useDependency.react';
import { ToDoStore } from '../../../stores/ToDoStore';
import { ToDoItem } from '../../../stores/todoModel';
import { ToDoItemViewModel } from '../todoViewModel';

interface IToDoStore {
  todos: ToDoItem[];
  updateTodo: (newTodo: ToDoItem) => void;
}

@injectable()
export class ToDoListScreenPresenter {
  constructor(@inject(ToDoStore) private _todoStore: IToDoStore) {
    makeAutoObservable(this);
  }

  get toDoList(): ToDoItemViewModel[] {
    return this._todoStore.todos;
  }

  onDoneChange = (id: string, newState: boolean) => {
    const item = this._todoStore.todos.find((item) => item.id === id);
    this._todoStore.updateTodo({
      ...item,
      isDone: newState,
    } as ToDoItem);
  };
}

export const ToDoListScreenPresenterContext =
  createDependencyContext<ToDoListScreenPresenter>();

export function useToDoListScreenPresenter() {
  return useNewDependency(ToDoListScreenPresenter);
}
