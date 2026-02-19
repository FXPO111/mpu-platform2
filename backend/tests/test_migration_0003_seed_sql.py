from pathlib import Path


MIGRATION = Path(__file__).resolve().parents[1] / "app/db/migrations/versions/0003_seed_default_plan_products.py"


def test_0003_seed_migration_has_no_metadata_bindparams_regression() -> None:
    source = MIGRATION.read_text(encoding="utf-8")

    # Regression guard: previous version crashed at runtime because text().bindparams()
    # referenced `metadata` when SQL no longer had `:metadata` placeholder.
    assert ".bindparams(" not in source
    assert "bindparam(\"metadata\"" not in source


def test_0003_seed_migration_uses_plan_seed_tag_scalar_binds() -> None:
    source = MIGRATION.read_text(encoding="utf-8")

    assert "jsonb_build_object('plan', :plan, 'seed_tag', :seed_tag)" in source
    assert ":metadata::jsonb" not in source
    assert "CAST(:metadata AS jsonb)" not in source
