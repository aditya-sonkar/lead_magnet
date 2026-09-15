import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');

try {
  const db = new Database(dbPath);
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Tables:", tables.map(t => t.name));

  const pageTables = tables.filter(t => t.name.includes('page'));
  console.log("Page tables:", pageTables);

  for (const t of pageTables) {
    console.log(`--- Table ${t.name} ---`);
    const rows = db.prepare(`SELECT * FROM "${t.name}"`).all();
    console.log(rows);
  }
} catch (err) {
  console.error("DB Error:", err);
}
