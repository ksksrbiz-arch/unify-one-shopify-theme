#!/usr/bin/env node

/**
 * Asset Optimization Script for UnifyOne Shopify Theme
 * 
 * This script optimizes theme assets for production deployment:
 * - Validates CSS and JS file sizes
 * - Checks for common issues (Liquid syntax in CSS, etc.)
 * - Reports on asset optimization opportunities
 * 
 * Usage: node scripts/optimize-assets.js
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const MAX_CSS_SIZE = 102400; // 100KB
const MAX_JS_SIZE = 51200;   // 50KB

let hasErrors = false;
let warnings = [];

console.log('🔍 Starting asset optimization checks...\n');

/**
 * Check if assets directory exists
 */
if (!fs.existsSync(ASSETS_DIR)) {
  console.error('❌ Error: assets/ directory not found');
  process.exit(1);
}

/**
 * Analyze CSS files
 */
console.log('📝 Analyzing CSS files...');
let cssFiles = [];
try {
  cssFiles = fs.readdirSync(ASSETS_DIR).filter(file => file.endsWith('.css'));
} catch (error) {
  console.error(`❌ Error reading assets directory: ${error.message}`);
  process.exit(1);
}

if (cssFiles.length === 0) {
  console.warn('⚠️  Warning: No CSS files found in assets/');
  warnings.push('No CSS files found');
}

cssFiles.forEach(file => {
  const filePath = path.join(ASSETS_DIR, file);
  let content, size;
  
  try {
    content = fs.readFileSync(filePath, 'utf8');
    size = Buffer.byteLength(content, 'utf8');
  } catch (error) {
    console.error(`  ❌ Error reading ${file}: ${error.message}`);
    hasErrors = true;
    return;
  }
  
  console.log(`  ✓ ${file}: ${size} bytes`);
  
  // Check file size
  if (size > MAX_CSS_SIZE) {
    console.warn(`  ⚠️  Warning: ${file} exceeds recommended size (${size} > ${MAX_CSS_SIZE} bytes)`);
    warnings.push(`${file} is too large`);
  }
  
  // Check for Liquid syntax in CSS
  if (content.includes('{{') || content.includes('{%')) {
    console.warn(`  ⚠️  Warning: ${file} contains Liquid syntax. Consider using CSS variables instead.`);
    warnings.push(`${file} contains Liquid syntax`);
  }
  
  // Check for source maps
  if (content.includes('sourceMappingURL')) {
    console.warn(`  ⚠️  Warning: ${file} contains source map reference. Remove for production.`);
    warnings.push(`${file} has source map`);
  }
});

/**
 * Analyze JavaScript files
 */
console.log('\n📝 Analyzing JavaScript files...');
let jsFiles = [];
try {
  jsFiles = fs.readdirSync(ASSETS_DIR).filter(file => file.endsWith('.js'));
} catch (error) {
  console.error(`❌ Error reading assets directory: ${error.message}`);
  process.exit(1);
}

if (jsFiles.length === 0) {
  console.warn('⚠️  Warning: No JavaScript files found in assets/');
  warnings.push('No JavaScript files found');
}

jsFiles.forEach(file => {
  const filePath = path.join(ASSETS_DIR, file);
  let content, size;
  
  try {
    content = fs.readFileSync(filePath, 'utf8');
    size = Buffer.byteLength(content, 'utf8');
  } catch (error) {
    console.error(`  ❌ Error reading ${file}: ${error.message}`);
    hasErrors = true;
    return;
  }
  
  console.log(`  ✓ ${file}: ${size} bytes`);
  
  // Check file size
  if (size > MAX_JS_SIZE) {
    console.warn(`  ⚠️  Warning: ${file} exceeds recommended size (${size} > ${MAX_JS_SIZE} bytes)`);
    warnings.push(`${file} is too large`);
  }
  
  // Check for console methods (console.log, console.warn, console.error, etc.)
  const consoleCallCount = (content.match(/console\.\w+/g) || []).length;
  if (consoleCallCount > 0) {
    console.warn(`  ⚠️  Warning: ${file} contains ${consoleCallCount} console method calls`);
    warnings.push(`${file} has ${consoleCallCount} console calls`);
  }
  
  // Check for source maps
  if (content.includes('sourceMappingURL')) {
    console.warn(`  ⚠️  Warning: ${file} contains source map reference. Remove for production.`);
    warnings.push(`${file} has source map`);
  }
});

/**
 * Check for subdirectories in assets (Shopify doesn't support them)
 */
console.log('\n📁 Checking directory structure...');
let items = [];
try {
  items = fs.readdirSync(ASSETS_DIR, { withFileTypes: true });
} catch (error) {
  console.error(`❌ Error reading assets directory: ${error.message}`);
  process.exit(1);
}

const ignoredDirs = ['__tests__', 'tests', '.git'];
const subdirs = items.filter(item => item.isDirectory() && !ignoredDirs.includes(item.name));

if (subdirs.length > 0) {
  console.error('❌ Error: Subdirectories found in assets/. Shopify requires all assets in root.');
  subdirs.forEach(dir => console.error(`  - ${dir.name}/`));
  hasErrors = true;
} else {
  console.log('  ✓ No problematic subdirectories found');
}

/**
 * Summary
 */
console.log('\n' + '='.repeat(50));
console.log('📊 Optimization Summary:');
console.log('='.repeat(50));
console.log(`CSS files: ${cssFiles.length}`);
console.log(`JS files: ${jsFiles.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Errors: ${hasErrors ? 'YES' : 'NO'}`);

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings (non-blocking):');
  warnings.forEach((warning, i) => console.log(`  ${i + 1}. ${warning}`));
}

if (hasErrors) {
  console.log('\n❌ Optimization failed with errors!');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('\n✅ Optimization complete with warnings (non-blocking)');
  process.exit(0);
} else {
  console.log('\n✅ All asset optimization checks passed!');
  process.exit(0);
}
