# Database Migrations

This directory contains PostgreSQL database migration files for the UnifyOne backend API.

## Overview

The backend API uses PostgreSQL to store tenant information, subscription data, and Shopify integration mappings. These migrations track the database schema changes over time.

## Migration Files

Migrations are numbered sequentially and follow this naming convention:
- `XXX_description.sql` - Forward migration (applies changes)
- `XXX_description.down.sql` - Rollback migration (reverts changes)

### Available Migrations

#### 001 - Add Shopify Fields to Tenants Table
**File**: `001_add_shopify_fields_to_tenants.sql`

Adds columns to track Shopify connection information:
- `shopify_customer_id` (TEXT) - Shopify customer ID for billing
- `shopify_subscription_id` (TEXT) - Active subscription contract ID
- `billing_status` (TEXT) - Current billing state (default: 'ACTIVE')

**Rollback**: `001_add_shopify_fields_to_tenants.down.sql`

#### 002 - Create Plan Products Table
**File**: `002_create_plan_products_table.sql`

Creates a new table to map Shopify products to internal plan tiers:
- `id` (UUID) - Primary key
- `plan_tier` (TEXT) - Internal tier name (BASIC, PRO, ENTERPRISE, etc.)
- `shopify_product_id` (TEXT) - Shopify product ID
- `shopify_variant_id` (TEXT) - Optional variant ID
- `features` (JSONB) - Array of included features
- `created_at` (TIMESTAMPTZ) - Creation timestamp

Includes indexes on `plan_tier`, `shopify_product_id`, and `shopify_variant_id` for query performance.

**Rollback**: `002_create_plan_products_table.down.sql`

## Running Migrations

### Prerequisites

1. PostgreSQL database connection configured
2. `uuid-ossp` extension enabled for UUID generation:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

### Manual Execution

Connect to your PostgreSQL database and run migrations in order:

```bash
# Apply migrations
psql -h <host> -U <user> -d <database> -f database/migrations/001_add_shopify_fields_to_tenants.sql
psql -h <host> -U <user> -d <database> -f database/migrations/002_create_plan_products_table.sql

# Rollback migrations (in reverse order)
psql -h <host> -U <user> -d <database> -f database/migrations/002_create_plan_products_table.down.sql
psql -h <host> -U <user> -d <database> -f database/migrations/001_add_shopify_fields_to_tenants.down.sql
```

### Using Migration Tools

If you're using a migration tool like [node-pg-migrate](https://github.com/salsita/node-pg-migrate), [Flyway](https://flywaydb.org/), or [Liquibase](https://www.liquibase.org/), configure it to read from this directory.

#### Example with node-pg-migrate

```bash
npm install node-pg-migrate
DATABASE_URL=postgresql://user:password@host:5432/database npx node-pg-migrate up
```

## Schema Assumptions

These migrations assume the following base schema exists:

### Tenants Table (Pre-existing)
The migrations assume a `tenants` table already exists with at least:
- `id` (UUID or similar)
- Other tenant-specific fields

If the `tenants` table doesn't exist, create it first:

```sql
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Environment Setup

For local development, staging, and production environments:

1. **Development**:
   ```bash
   export DATABASE_URL=postgresql://localhost:5432/unify_dev
   ```

2. **Staging**:
   ```bash
   export DATABASE_URL=postgresql://staging-db.1commercesolutions.shop:5432/unify_staging
   ```

3. **Production**:
   ```bash
   export DATABASE_URL=postgresql://prod-db.1commercesolutions.shop:5432/unify_production
   ```

## Testing Migrations

Before applying to production, test migrations in a development environment:

```bash
# Create test database
createdb unify_test

# Run migrations
psql -d unify_test -f database/migrations/001_add_shopify_fields_to_tenants.sql
psql -d unify_test -f database/migrations/002_create_plan_products_table.sql

# Verify schema
psql -d unify_test -c "\d tenants"
psql -d unify_test -c "\d plan_products"

# Test rollback
psql -d unify_test -f database/migrations/002_create_plan_products_table.down.sql
psql -d unify_test -f database/migrations/001_add_shopify_fields_to_tenants.down.sql

# Cleanup
dropdb unify_test
```

## Best Practices

1. **Never modify existing migrations** - Create new ones instead
2. **Always test rollbacks** - Ensure down migrations work correctly
3. **Use transactions** - Wrap migrations in transactions when possible:
   ```sql
   BEGIN;
   -- migration SQL here
   COMMIT;
   ```
4. **Backup before production** - Always backup production database before applying migrations
5. **Version control** - Keep migrations in Git for team synchronization

## Troubleshooting

### UUID Extension Not Found

If you get an error about `uuid_generate_v4()`:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Permission Denied

Ensure your database user has necessary permissions:

```sql
GRANT ALL PRIVILEGES ON DATABASE your_database TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
```

### Column Already Exists

The migrations use `IF NOT EXISTS` and `IF EXISTS` clauses to be idempotent. Running them multiple times is safe.

## Support

For questions or issues with migrations:
- Review the [BACKEND_INTEGRATION.md](../BACKEND_INTEGRATION.md) documentation
- Check PostgreSQL logs for specific error messages
- Ensure database connection credentials are correct

---

**Last Updated**: January 26, 2026  
**Maintained By**: PNW Enterprises Development Team
