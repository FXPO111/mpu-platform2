# Backend

## Default public plan products

Seed command:

```bash
python -m app.seed --only-missing
```

It guarantees presence of:
- `PLAN_START` (`23000` cents, EUR)
- `PLAN_PRO` (`70000` cents, EUR)
- `PLAN_INTENSIVE` (`150000` cents, EUR)

The seed is idempotent and only fills missing fields for existing products (does not overwrite custom prices).

## Dev auto-seed

In `infra/docker-compose.yml`, backend supports:

- `AUTO_SEED=1` -> runs `python -m app.seed --only-missing` after `alembic upgrade head`
- default is `AUTO_SEED=0`

## Checkout behavior

`POST /api/public/checkout` errors:
- `PRODUCT_NOT_FOUND` (404)
- `STRIPE_NOT_CONFIGURED` (503)
- `CHECKOUT_FAILED` (502)

## Test plan

```bash
docker compose -f infra/docker-compose.yml up -d --build
curl -s http://localhost:8000/api/public/products
curl -s -X POST http://localhost:8000/api/public/checkout \
  -H 'Content-Type: application/json' \
  -d '{"plan":"start","email":"demo@example.com"}'
```

Expected:
- `/api/public/products` contains `PLAN_START`, `PLAN_PRO`, `PLAN_INTENSIVE`
- checkout is not `404 PRODUCT_NOT_FOUND` (can be `200`, `503`, or `502` depending on Stripe config)
- with empty/placeholder Stripe key -> `503 STRIPE_NOT_CONFIGURED`
- repeated `python -m app.seed --only-missing` does not create duplicates
