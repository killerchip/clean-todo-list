import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { useInject } from '../../../ioc/useDependency.react';
import { ToDoStore } from '../../../stores/ToDoStore';
import { ToDoItem } from '../../../stores/todoModel';
import { ToDoItemViewModel } from '../todoViewModel';

interface IToDoStore {
  todos: ToDoItem[];
}

@injectable()
export class ToDoListScreenPresenter {
  constructor(@inject(ToDoStore) private _todoStore: IToDoStore) {
    console.log('making New ToDoListScreenPresenter');
    makeAutoObservable(this);
  }

  get toDoList(): ToDoItemViewModel[] {
    return this._todoStore.todos;
  }
}

export function useToDoListScreenPresenter() {
  return useInject(ToDoListScreenPresenter);
}
