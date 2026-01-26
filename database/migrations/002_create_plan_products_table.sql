-- Migration: Create plan_products table
-- Created: 2026-01-26
-- Description: Maps Shopify products to plan tiers for subscription billing

-- Create plan_products table to track Shopify product mappings
CREATE TABLE IF NOT EXISTS plan_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_tier TEXT NOT NULL,
  shopify_product_id TEXT NOT NULL,
  shopify_variant_id TEXT,
  features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_plan_products_plan_tier ON plan_products(plan_tier);
CREATE INDEX IF NOT EXISTS idx_plan_products_shopify_product_id ON plan_products(shopify_product_id);
CREATE INDEX IF NOT EXISTS idx_plan_products_shopify_variant_id ON plan_products(shopify_variant_id);

-- Add comments for documentation
COMMENT ON TABLE plan_products IS 'Maps Shopify products/variants to internal plan tiers';
COMMENT ON COLUMN plan_products.id IS 'Unique identifier for the plan-product mapping';
COMMENT ON COLUMN plan_products.plan_tier IS 'Internal plan tier name (e.g., BASIC, PRO, ENTERPRISE)';
COMMENT ON COLUMN plan_products.shopify_product_id IS 'Shopify product ID';
COMMENT ON COLUMN plan_products.shopify_variant_id IS 'Optional Shopify product variant ID';
COMMENT ON COLUMN plan_products.features IS 'JSON array of features included in this plan';
COMMENT ON COLUMN plan_products.created_at IS 'Timestamp when mapping was created';
