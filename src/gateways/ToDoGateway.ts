import { SQLiteDatabase, SQLError, SQLResultSet } from 'expo-sqlite';
import { injectable } from 'inversify';
import { makeAutoObservable, runInAction } from 'mobx';

import { toDoDb } from './database';
import { getRandomId } from './randomId';

@injectable()
export class ToDoGateway {
  isReady: boolean = false;
  private db: SQLiteDatabase;

  constructor() {
    this.db = toDoDb;
    this.initializeDb();
    makeAutoObservable(this);
  }

  async getAll() {
    const result = await new Promise<SQLResultSet>((resolve, reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          'SELECT * FROM Todo',
          [],
          (_, resultSet) => {
            resolve(resultSet);
          },
          (_, error) => {
            reject(error);
            return true;
          },
        );
      });
    });

    console.log(result.rows);
    return result.rows;
  }

  private initializeDb() {
    this.db.transaction((tx) => {
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
              (_, resultSet: SQLResultSet) => {
                tx.executeSql(
                  `INSERT INTO Todo (id, title, description, isDone)
               SELECT '${randomId}', 'Sample Task', 'This is a sample task.', 0
               WHERE NOT EXISTS (SELECT 1 FROM Todo WHERE id = '${randomId}');`,
                  [],
                  (_, resultSet: SQLResultSet) => {
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
          console.log('Failed to check if table exists', error);
          return true; // Rollback transaction in case of error
        },
      );
    });
  }
}
