import sys
from pathlib import Path

ROOT_DIR = Path(__file__).parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

DATA_RECORDS_PATH = Path(__file__).parent / "historical_db_raw.py"

# We define the comprehensive dataset tuples/dictionaries
# Let's write the generation code

def run():
    # Write Python file with RECORDS_2021, RECORDS_2022, RECORDS_2023, RECORDS_2024
    from scripts.records_builder import get_all_records
    r2021, r2022, r2023, r2024 = get_all_records()
    
    with open(DATA_RECORDS_PATH, "w", encoding="utf-8") as f:
        f.write("# Auto-generated comprehensive verified Indian Mainboard IPO archive (2021-2024)\n\n")
        f.write(f"RECORDS_2021 = {repr(r2021)}\n\n")
        f.write(f"RECORDS_2022 = {repr(r2022)}\n\n")
        f.write(f"RECORDS_2023 = {repr(r2023)}\n\n")
        f.write(f"RECORDS_2024 = {repr(r2024)}\n\n")
    print(f"Generated historical_db_raw.py: 2021={len(r2021)}, 2022={len(r2022)}, 2023={len(r2023)}, 2024={len(r2024)}, Total={len(r2021)+len(r2022)+len(r2023)+len(r2024)}")

if __name__ == "__main__":
    run()
