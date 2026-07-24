import re


def parse_line(line):
    """Parses one CC-CEDICT entry into (traditional, simplified, pinyin, definitions).
    Returns None if the line does not match the expected format.
    """
    match = re.match(r"(.+) (.+) \[(.+)\] /(.+)/", line)
    if match:
        return match.groups()
    return None

if __name__ == "__main__":
    samples = [
        "辣椒 辣椒 [la4 jiao1] /chili pepper/hot pepper/",
        "3C 3C [san1 C] /computers, communications, and consumer electronics/China Compulsory Certificate (CCC)/",
        "21三體綜合症 21三体综合症 [21 san1 ti3 zong1 he2 zheng4] /trisomy; Down's syndrome/",
        "# CC-CEDICT",
    ]
    for s in samples:
        print (parse_line(s))