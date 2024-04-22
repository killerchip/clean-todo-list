import { inject, injectable } from 'inversify';
import { action, makeAutoObservable } from 'mobx';

import { AlertUIGateway } from '../../../gateways/AlertUIGateway';
import { useNewDependency } from '../../../ioc/useDependency.react';
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

  constructor(
    @inject(ToDoStore)
    private _toDoStore: Pick<ToDoStore, 'todos' | 'createTodo' | 'updateTodo'>,
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

export function useToDoListScreenPresenter(id?: string) {
  return useNewDependency(
    ToDoFormScreenPresenter,
    action((presenter) => presenter.init(id)),
  );
}
