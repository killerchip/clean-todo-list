import { SQLError, SQLiteDatabase, SQLResultSet } from 'expo-sqlite';
import { injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { toDoDb } from './database';
import {
  convertToToDoItem,
  convertToToDoTaskDto,
  ToDoTaskDto,
} from './dtoModels';
import { getRandomId } from './randomId';
import { ToDoItem } from '../stores/todoModel';

@injectable()
export class ToDoGateway {
  isReady: boolean = false;
  private db: SQLiteDatabase;

  constructor() {
    this.db = toDoDb;
    this.initializeDb();
    makeAutoObservable(this);
  }

  async getAll(): Promise<ToDoItem[]> {
    const errors: SQLError[] = [];
    const result = await new Promise<SQLResultSet>((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'SELECT * FROM Todo',
            [],
            (_, resultSet) => {
              resolve(resultSet);
            },
            (_, error) => {
              errors.push(error);
              reject(error);
              return true;
            },
          );
        },
        undefined,
        () => {
          if (errors.length > 0) {
            throw new Error('Failed to get tasks');
          }
        },
      );
    });

    const rows: ToDoTaskDto[] = result.rows._array;
    return rows.map(convertToToDoItem);
  }

  async create(todo: Omit<ToDoItem, 'id'>) {
    const errors: SQLError[] = [];
    const newId = getRandomId();
    const dto = convertToToDoTaskDto({ ...todo, id: newId });

    return new Promise<string>((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'INSERT INTO Todo (id, title, description, isDone) VALUES (?, ?, ?, ?)',
            [dto.id, dto.title, dto.description, dto.isDone ? 1 : 0],
            (_) => {
              resolve(newId);
            },
            (_, error) => {
              errors.push(error);
              reject(error);
              return true;
            },
          );
        },
        undefined,
        () => {
          if (errors.length > 0) {
            throw new Error('Failed to create task');
          }
        },
      );
    });
  }

  async update(todo: ToDoItem): Promise<void> {
    const errors: SQLError[] = [];

    const dto = convertToToDoTaskDto(todo);

    return new Promise((resolve, reject) => {
      this.db.transaction(
        (tx) => {
          tx.executeSql(
            'UPDATE Todo SET title = ?, description = ?, isDone = ? WHERE id = ?',
            [dto.title, dto.description, dto.isDone ? 1 : 0, dto.id],
            () => {
              resolve();
            },
            (_, error) => {
              errors.push(error);
              reject(error);
              return true;
            },
          );
        },
        undefined,
        () => {
          if (errors.length > 0) {
            throw new Error('Failed to update task');
          }
        },
      );
    });
  }

  private initializeDb() {
    const errors: SQLError[] = [];

    this.db.transaction(
      (tx) => {
        tx.executeSql(
          "SELECT name FROM sqlite_master WHERE type='table' AND name='Todo';",
          [],
          (_, resultSet: SQLResultSet) => {
            if (resultSet.rows.length === 0) {
              // Table does not exist, create it and insert a sample row
              const randomId = getRandomId();
              tx.executeSql(
                `CREATE TABLE IF NOT EXISTS Todo (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            isDone INTEGER NOT NULL
          );`,
                [],
                () => {
                  tx.executeSql(
                    `INSERT INTO Todo (id, title, description, isDone)
               SELECT '${randomId}', 'Sample Task', 'This is a sample task.', 0
               WHERE NOT EXISTS (SELECT 1 FROM Todo WHERE id = '${randomId}');`,
                    [],
                    () => {
                      console.log('Sample record inserted successfully');
                    },
                    (_, error: SQLError) => {
                      console.log('Failed to insert sample record', error);
                      return true; // Rollback transaction in case of error
                    },
                  );
                  runInAction(() => {
                    this.isReady = true;
                  });
                },
                (_, error: SQLError) => {
                  errors.push(error);
                  console.log('Failed to create table', error);
                  return true; // Rollback transaction in case of error
                },
              );
            } else {
              // Table exists, do nothing
              runInAction(() => {
                this.isReady = true;
              });
            }
          },
          (_, error: SQLError) => {
            errors.push(error);
            console.log('Failed to check if table exists', error);
            return true; // Rollback transaction in case of error
          },
        );
      },
      undefined,
      () => {
        if (errors.length > 0) {
          throw new Error('Failed to initialize database');
        }
      },
    );
  }
}
