import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("todo.db");
  }
  return db;
}

export type Priority = "urgent" | "medium" | "low";

export type Todo = {
  id?: number;
  text: string;
  done: number;
  priority: Priority;
  created_at?: string;
  finished_at?: string | null;
};

export async function initDB(): Promise<void> {
  const db = await getDB();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'medium',
      finished_at DATETIME,
      created_at DATETIME DEFAULT (datetime('now'))
    );
  `);
}

export async function getTodos(): Promise<Todo[]> {
  const db = await getDB();

  return await db.getAllAsync<Todo>(`
    SELECT * FROM todos
    ORDER BY 
      CASE priority
        WHEN 'urgent' THEN 1
        WHEN 'medium' THEN 2
        WHEN 'low' THEN 3
      END,
      id DESC;
  `);
}

export async function addTodo(text: string, priority: Priority): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    "INSERT INTO todos (text, priority, done) VALUES (?, ?, 0);",
    [text, priority]
  );
}

export async function updateTodo(
  id: number,
  fields: Partial<Omit<Todo, "id" | "created_at">>
): Promise<void> {
  const db = await getDB();

  const sets: string[] = [];
  const params: any[] = [];

  Object.entries(fields).forEach(([key, value]) => {
    sets.push(`${key} = ?`);
    params.push(value);
  });

  if (!sets.length) return;

  params.push(id);

  await db.runAsync(
    `UPDATE todos SET ${sets.join(", ")} WHERE id = ?;`,
    params
  );
}

export async function deleteTodo(id: number): Promise<void> {
  const db = await getDB();
  await db.runAsync("DELETE FROM todos WHERE id = ?;", [id]);
}
