import * as SQLite from 'expo-sqlite';

function openDatabase() {
  return SQLite.openDatabase('myDatabaseName.db');
}

export const toDoDb = openDatabase();
