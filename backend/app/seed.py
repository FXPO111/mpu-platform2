from __future__ import annotations

import argparse

from app.db.seeds.seed_data import seed_products
from app.db.session import SessionLocal


def main() -> None:
    parser = argparse.ArgumentParser(description="Seed backend reference data")
    parser.add_argument("--only-missing", action="store_true", help="Fill only missing fields for seeded products")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        stats = seed_products(db, only_missing=args.only_missing)
        db.commit()
        print(
            "seed_products completed "
            f"created={stats['created']} updated={stats['updated']} skipped={stats['skipped']}"
        )
    finally:
        db.close()


if __name__ == "__main__":
    main()
