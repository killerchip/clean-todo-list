import { inject, injectable } from 'inversify';
import { action, makeAutoObservable } from 'mobx';

import {
  createDependencyContext,
  useNewDependency,
} from '../../../ioc/useDependency.react';
import { ToDoStore } from '../../../stores/ToDoStore';
import { ToDoFormData, ToDoItemViewModel } from '../todoViewModel';

@injectable()
export class ToDoFormScreenPresenter {
  formData: ToDoFormData = {
    id: undefined,
    title: '',
    description: '',
    isDone: false,
  };

  private _id?: string = undefined;

  // TODO: declare the store dependency as interface
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

  // TODO this conversion here should be done in ViewModel?
  async onSubmit() {
    if (this.isNewTodo) {
      await this._toDoStore.createTodo({
        title: this.formData.title,
        description: this.formData.description ?? '',
        isDone: this.formData.isDone,
      });
    } else {
      await this._toDoStore.updateTodo({
        id: this._id!,
        title: this.formData.title,
        description: this.formData.description ?? '',
        isDone: this.formData.isDone,
      });
    }

    return true;
  }

  updateFormData(data: Partial<ToDoFormData>) {
    this.formData = {
      ...this.formData,
      ...data,
    };
  }

  init(id?: string) {
    this._id = id;
    if (id) {
      const todo = this.todo;
      if (todo) {
        this.formData = {
          id: todo.id,
          title: todo.title,
          description: todo.description,
          isDone: todo.isDone,
        };
      }
    }
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

// TODO wire in item update
// -make a create todo on the gateway
// -make sure the store has an new store method
// -presenter calls the method
