import { inject, injectable } from 'inversify';
import { makeAutoObservable } from 'mobx';

import { AlertUIGateway } from '../../../gateways/AlertUIGateway';
import {
  createDependencyContext,
  useNewDependency,
} from '../../../ioc/useDependency.react';
import { ToDoStore } from '../../../stores/ToDoStore';
import { ToDoItem } from '../../../stores/todoModel';
import { ToDoItemViewModel } from '../todoViewModel';

type IToDoStore = Pick<ToDoStore, 'todos' | 'updateTodo'>;
type IAlertUIGateway = Pick<AlertUIGateway, 'alert'>;

@injectable()
export class ToDoListScreenPresenter {
  constructor(
    @inject(ToDoStore) private _todoStore: IToDoStore,
    @inject(AlertUIGateway) private _alertGateway: IAlertUIGateway,
  ) {
    makeAutoObservable(this);
  }

  get toDoList(): ToDoItemViewModel[] {
    return this._todoStore.todos;
  }

  onDoneChange = async (id: string, newState: boolean) => {
    const item = this._todoStore.todos.find((item) => item.id === id);
    try {
      await this._todoStore.updateTodo({
        ...item,
        isDone: newState,
      } as ToDoItem);
    } catch {
      this._alertGateway.alert('Error', 'Failed to update task');
    }
  };
}

export const ToDoListScreenPresenterContext =
  createDependencyContext<ToDoListScreenPresenter>();

export function useToDoListScreenPresenter() {
  return useNewDependency(ToDoListScreenPresenter);
}
