import { ToDoItem } from '../stores/todoModel';

export type ToDoTaskDto = {
  id: string;
  title: string;
  description: string;
  isDone: number;
};

export function convertToToDoItem(dto: ToDoTaskDto): ToDoItem {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    isDone: dto.isDone === 1,
  };
}

export function convertToToDoTaskDto(item: ToDoItem): ToDoTaskDto {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isDone: item.isDone ? 1 : 0,
  };
}
