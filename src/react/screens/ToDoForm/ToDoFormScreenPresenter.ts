import { inject, injectable } from 'inversify';
import { action, makeAutoObservable } from 'mobx';

import { AlertUIGateway } from '../../../gateways/AlertUIGateway';
import {
  createDependencyContext,
  useNewDependency,
} from '../../../ioc/useDependency.react';
import { ToDoStore } from '../../../stores/ToDoStore';
import { ToDoItemViewModel } from '../todoViewModel';

export type ToDoFormData = {
  id?: string;
  title: string;
  description?: string;
  isDone: boolean;
};

export type ToDoFormErrors = {
  title: string[];
  hasErrors?: boolean;
};

const getDefaultFormErrorsValue = (): ToDoFormErrors => ({
  title: [],
});

@injectable()
export class ToDoFormScreenPresenter {
  formData: ToDoFormData = {
    id: undefined,
    title: '',
    description: '',
    isDone: false,
  };

  formErrors: ToDoFormErrors = getDefaultFormErrorsValue();

  private _id?: string = undefined;

  // TODO: declare the store dependency as interface
  constructor(
    @inject(ToDoStore) private _toDoStore: ToDoStore,
    @inject(AlertUIGateway)
    private _alertGateway: Pick<AlertUIGateway, 'alert'>,
  ) {
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

  get formHasErrors() {
    return this.formErrors.title.length > 0;
  }

  validate() {
    this.formErrors = getDefaultFormErrorsValue();
    if (!this.formData.title) {
      this.formErrors.title.push('Title is required');
    }
  }

  // TODO this conversion here should be done in ViewModel?
  async onSubmit() {
    this.validate();
    if (this.formHasErrors) {
      return false;
    }

    try {
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
    } catch {
      this._alertGateway.alert('Error', 'Failed to save task');
      return false;
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
