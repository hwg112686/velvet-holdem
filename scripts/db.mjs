import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
export function localDB(path=':memory:') {
  const db=new DatabaseSync(path);
  db.exec(fs.readFileSync(new URL('../drizzle/0000_rooms.sql',import.meta.url),'utf8').replace('CREATE TABLE rooms','CREATE TABLE IF NOT EXISTS rooms'));
  return {prepare(sql) {
    return {bind(...args) {
      return {
        async first(){return db.prepare(sql).get(...args)},
        async run(){const r=db.prepare(sql).run(...args);return {meta:{changes:Number(r.changes)}}}
      };
    }};
  }};
}
