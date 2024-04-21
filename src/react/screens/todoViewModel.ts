import { ToDoItem } from '../../stores/todoModel';

export type ToDoItemViewModel = ToDoItem;

export type ToDoFormData = {
  id?: string;
  title: string;
  description?: string;
  isDone: boolean;
};
