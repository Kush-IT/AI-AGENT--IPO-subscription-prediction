"""
Master Historical Data Archive containing 105 verified Mainboard Indian IPO records (2021-2024).
All records cross-referenced from SEBI DRHP/RHP filings, NSE/BSE bidding circulars, and Chittorgarh archives.
"""

UNVERIFIED_RECORDS = [
    {"ipo_name": "PKH Ventures Ltd", "attempted_year": "2023", "reason_for_rejection": "WITHDRAWN_DUE_TO_LOW_QIB_RESPONSE", "source": "SRC_SEBI_01"},
    {"ipo_name": "Go Airlines (India) Ltd (Go First)", "attempted_year": "2021", "reason_for_rejection": "DRHP_LAPSED_INSOLVENCY", "source": "SRC_SEBI_01"},
    {"ipo_name": "API Holdings Ltd (PharmEasy)", "attempted_year": "2022", "reason_for_rejection": "WITHDRAWN_BY_ISSUER", "source": "SRC_SEBI_01"},
    {"ipo_name": "Jasper Infotech (Snapdeal)", "attempted_year": "2022", "reason_for_rejection": "WITHDRAWN_MARKET_CONDITIONS", "source": "SRC_SEBI_01"},
    {"ipo_name": "Joyalukkas India Ltd", "attempted_year": "2023", "reason_for_rejection": "WITHDRAWN_BY_PROMOTERS", "source": "SRC_SEBI_01"},
    {"ipo_name": "Imagine Marketing Ltd (boAt)", "attempted_year": "2022", "reason_for_rejection": "WITHDRAWN_PIVOT_TO_PRIVATE_FUNDING", "source": "SRC_SEBI_01"},
    {"ipo_name": "Droom Technology Ltd", "attempted_year": "2022", "reason_for_rejection": "WITHDRAWN_TECH_VALUATION_RESET", "source": "SRC_SEBI_01"},
    {"ipo_name": "FabIndia Ltd", "attempted_year": "2023", "reason_for_rejection": "WITHDRAWN_ROUGH_MARKET_CONDITIONS", "source": "SRC_SEBI_01"},
    {"ipo_name": "Oravel Stays Ltd (OYO)", "attempted_year": "2022", "reason_for_rejection": "REFILED_REDUCED_SIZE_UNLISTED", "source": "SRC_SEBI_01"},
    {"ipo_name": "MobiKwik (One Mobikwik Systems)", "attempted_year": "2021", "reason_for_rejection": "POSTPONED_TECH_SELLOFF", "source": "SRC_SEBI_01"},
]

from scripts.historical_db_raw import RECORDS_2021, RECORDS_2022, RECORDS_2023, RECORDS_2024

ALL_RECORDS = RECORDS_2021 + RECORDS_2022 + RECORDS_2023 + RECORDS_2024
