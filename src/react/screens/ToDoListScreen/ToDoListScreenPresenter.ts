import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';

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
    makeAutoObservable(this);
  }

  get toDoList(): ToDoItemViewModel[] {
    return this._todoStore.todos;
  }

  onDoneChange = (id: string, newState: boolean) => {
    const item = this._todoStore.todos.find((item) => item.id === id);
    if (item) {
      item.isDone = newState;
    }
  };
}

export function useToDoListScreenPresenter() {
  return useInject(ToDoListScreenPresenter);
}

export const ToDoListScreenPresenterContext =
  createContext<ToDoListScreenPresenter | null>(null);

export function useToDoListScreenPresenterContext() {
  const presenter = useContext(ToDoListScreenPresenterContext);
  if (!presenter) {
    throw new Error(
      ['Context Value was not found', 'ToDoListScreenPresenterContext'].join(
        ' : ',
      ),
    );
  }

  return presenter;
}
