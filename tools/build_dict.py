import re
import sqlite3


def parse_line(line):
    """Parses one CC-CEDICT entry into (traditional, simplified, pinyin, definitions).
    Returns None if the line does not match the expected format.
    """
    match = re.match(r"(.+) (.+) \[(.+)\] /(.+)/", line)
    if match:
        return match.groups()
    return None

def parse_file(path):
    entries = []
    failures = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            if line.startswith("#"):
                continue
            result = parse_line(line)
            if result:
                traditional, simplified, pinyin, definition = result
                pinyin_search = normalize_pinyin(pinyin)
                entries.append((traditional, simplified, pinyin, pinyin_search, definition))
            else:
                failures.append(line)
    return entries, failures

def normalize_pinyin(pinyin):
    normalized = re.sub(r"\d", "",pinyin).replace(" ", "").lower()
    return normalized

def create_database(path):
    connection = sqlite3.connect(path)
    cursor = connection.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY,
            traditional TEXT,
            simplified TEXT,
            pinyin TEXT,
            pinyin_search TEXT,
            definition TEXT
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_simplified ON words (simplified)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_pinyin_search ON words (pinyin_search)")
    connection.commit()
    connection.close()

def insert_entries(path, entries):
    connection = sqlite3.connect(path)
    cursor = connection.cursor()
    cursor.executemany(
        "INSERT INTO words (traditional, simplified, pinyin, pinyin_search, definition) VALUES (?, ?, ?, ?, ?)",
        entries
    )
    inserted = cursor.rowcount
    connection.commit()
    connection.close()
    return inserted

if __name__ == "__main__":
    entries, failures = parse_file("tools/data/cedict_1_0_ts_utf-8_mdbg.txt")
    create_database("tools/data/words.db")
    inserted = insert_entries("tools/data/words.db", entries)
    print(f"Inserted {inserted} entries")