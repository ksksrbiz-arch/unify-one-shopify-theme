-- Combined Migration: Add Shopify Connection Tracking
-- Created: 2026-01-26
-- Description: Complete migration for Shopify billing integration
-- 
-- This file combines all necessary schema changes for tracking Shopify
-- connections, subscriptions, and product-to-plan mappings.
--
-- Run this migration to apply all changes at once, or use the individual
-- numbered migration files in the migrations/ directory.

-- =============================================================================
-- SECTION 1: Add Shopify fields to tenants table
-- =============================================================================

-- Add to tenants table
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS shopify_customer_id TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS shopify_subscription_id TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS billing_status TEXT DEFAULT 'ACTIVE';

-- Add comments for documentation
COMMENT ON COLUMN tenants.shopify_customer_id IS 'Shopify customer ID for billing integration';
COMMENT ON COLUMN tenants.shopify_subscription_id IS 'Active Shopify subscription contract ID';
COMMENT ON COLUMN tenants.billing_status IS 'Current billing status (ACTIVE, SUSPENDED, CANCELLED, etc.)';

-- =============================================================================
-- SECTION 2: Create plan_products mapping table
-- =============================================================================

-- Track which Shopify products map to which tiers
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

-- =============================================================================
-- Migration complete
-- =============================================================================

-- Verify the changes (optional - remove these lines if they cause issues)
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'tenants' 
-- AND column_name IN ('shopify_customer_id', 'shopify_subscription_id', 'billing_status');
--
-- SELECT table_name FROM information_schema.tables WHERE table_name = 'plan_products';
