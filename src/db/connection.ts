import { openDatabaseSync } from "expo-sqlite";

export const db = openDatabaseSync("encounters.db");
db.execSync("PRAGMA foreign_keys = ON;");

db.execSync(`
    CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY,
        file_path TEXT NOT NULL,
        taken_at TEXT,
        latitude REAL,
        longitude REAL
    )
`);

db.execSync(`
    CREATE TABLE IF NOT EXISTS encounters (
        id INTEGER PRIMARY KEY,
        simplified TEXT NOT NULL,
        photo_id INTEGER REFERENCES photos(id),
        crop_x REAL,
        crop_y REAL,
        crop_width REAL,
        crop_height REAL,
        sentence TEXT,
        note TEXT,
        logged_at TEXT NOT NULL
    )
`);
