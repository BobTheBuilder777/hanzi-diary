import re


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
                entries.append(result)
            else:
                failures.append(line)
    return len(entries), len(failures)

if __name__ == "__main__":
    parsed, failed = parse_file("tools/data/cedict_1_0_ts_utf-8_mdbg.txt")
    print(f"Parsed: {parsed}")
    print(f"Failed: {failed}")