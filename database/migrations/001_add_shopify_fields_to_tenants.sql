-- Migration: Add Shopify connection fields to tenants table
-- Created: 2026-01-26
-- Description: Adds columns to track Shopify customer, subscription, and billing status

-- Add shopify_customer_id column to track Shopify customer association
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS shopify_customer_id TEXT;

-- Add shopify_subscription_id column to track active Shopify subscription
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS shopify_subscription_id TEXT;

-- Add billing_status column to track current billing state
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS billing_status TEXT DEFAULT 'ACTIVE';

-- Add comments for documentation
COMMENT ON COLUMN tenants.shopify_customer_id IS 'Shopify customer ID for billing integration';
COMMENT ON COLUMN tenants.shopify_subscription_id IS 'Active Shopify subscription contract ID';
COMMENT ON COLUMN tenants.billing_status IS 'Current billing status (ACTIVE, SUSPENDED, CANCELLED, etc.)';
