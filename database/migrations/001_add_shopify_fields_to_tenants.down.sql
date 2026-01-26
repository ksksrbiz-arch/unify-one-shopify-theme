-- Rollback Migration: Remove Shopify connection fields from tenants table
-- Created: 2026-01-26
-- Description: Rollback for 001_add_shopify_fields_to_tenants.sql

-- Remove columns added for Shopify integration
ALTER TABLE tenants DROP COLUMN IF EXISTS shopify_customer_id;
ALTER TABLE tenants DROP COLUMN IF EXISTS shopify_subscription_id;
ALTER TABLE tenants DROP COLUMN IF EXISTS billing_status;
