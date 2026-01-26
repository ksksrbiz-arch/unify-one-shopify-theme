-- Rollback Migration: Drop plan_products table
-- Created: 2026-01-26
-- Description: Rollback for 002_create_plan_products_table.sql

-- Drop indexes first
DROP INDEX IF EXISTS idx_plan_products_shopify_variant_id;
DROP INDEX IF EXISTS idx_plan_products_shopify_product_id;
DROP INDEX IF EXISTS idx_plan_products_plan_tier;

-- Drop the table
DROP TABLE IF EXISTS plan_products;
