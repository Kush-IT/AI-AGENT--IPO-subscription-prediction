import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

# Build comprehensive verified list
# Let's generate the file content programmatically
OUTPUT_FILE = Path(__file__).parent / "historical_db.py"

def generate():
    from scripts.ipo_data_source_archive import ALL_RECORDS, UNVERIFIED_RECORDS
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write('"""\n')
        f.write('Historical Indian Mainboard IPO Database (2021 - 2024).\n')
        f.write(f'Comprehensive repository of {len(ALL_RECORDS)} verified Mainboard IPOs from official SEBI, NSE, and BSE filings.\n')
        f.write('Also contains catalog of unverified/withdrawn IPOs for negative verification audit.\n')
        f.write('"""\n\n')
        f.write("UNVERIFIED_OR_WITHDRAWN_IPOS = [\n")
        for u in UNVERIFIED_RECORDS:
            f.write(f"    {repr(u)},\n")
        f.write("]\n\n")
        f.write("ALL_VERIFIED_MAINBOARD_IPOS = [\n")
        for r in ALL_RECORDS:
            f.write(f"    {repr(r)},\n")
        f.write("]\n")
    print(f"Generated {len(ALL_RECORDS)} verified IPO records in {OUTPUT_FILE}")

if __name__ == "__main__":
    generate()
