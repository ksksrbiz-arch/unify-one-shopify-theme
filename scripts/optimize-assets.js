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

cssFiles.forEach(cssFile => {
  const cssFilePath = path.join(ASSETS_DIR, cssFile);
  let cssContent, cssFileSize;
  
  try {
    cssContent = fs.readFileSync(cssFilePath, 'utf8');
    cssFileSize = Buffer.byteLength(cssContent, 'utf8');
  } catch (error) {
    console.error(`  ❌ Error reading ${cssFile}: ${error.message}`);
    hasErrors = true;
    return;
  }
  
  console.log(`  ✓ ${cssFile}: ${cssFileSize} bytes`);
  
  // Check file size
  if (cssFileSize > MAX_CSS_SIZE) {
    console.warn(`  ⚠️  Warning: ${cssFile} exceeds recommended size (${cssFileSize} > ${MAX_CSS_SIZE} bytes)`);
    warnings.push(`${cssFile} is too large`);
  }
  
  // Check for Liquid syntax in CSS
  if (cssContent.includes('{{') || cssContent.includes('{%')) {
    console.warn(`  ⚠️  Warning: ${cssFile} contains Liquid syntax. Consider using CSS variables instead.`);
    warnings.push(`${cssFile} contains Liquid syntax`);
  }
  
  // Check for source maps
  if (cssContent.includes('sourceMappingURL')) {
    console.warn(`  ⚠️  Warning: ${cssFile} contains source map reference. Remove for production.`);
    warnings.push(`${cssFile} has source map`);
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

jsFiles.forEach(jsFile => {
  const jsFilePath = path.join(ASSETS_DIR, jsFile);
  let jsContent, jsFileSize;
  
  try {
    jsContent = fs.readFileSync(jsFilePath, 'utf8');
    jsFileSize = Buffer.byteLength(jsContent, 'utf8');
  } catch (error) {
    console.error(`  ❌ Error reading ${jsFile}: ${error.message}`);
    hasErrors = true;
    return;
  }
  
  console.log(`  ✓ ${jsFile}: ${jsFileSize} bytes`);
  
  // Check file size
  if (jsFileSize > MAX_JS_SIZE) {
    console.warn(`  ⚠️  Warning: ${jsFile} exceeds recommended size (${jsFileSize} > ${MAX_JS_SIZE} bytes)`);
    warnings.push(`${jsFile} is too large`);
  }
  
  // Check for console methods (console.log, console.warn, console.error, etc.)
  const consoleCallCount = (jsContent.match(/console\.\w+/g) || []).length;
  if (consoleCallCount > 0) {
    console.warn(`  ⚠️  Warning: ${jsFile} contains ${consoleCallCount} console method calls`);
    warnings.push(`${jsFile} has ${consoleCallCount} console calls`);
  }
  
  // Check for source maps
  if (jsContent.includes('sourceMappingURL')) {
    console.warn(`  ⚠️  Warning: ${jsFile} contains source map reference. Remove for production.`);
    warnings.push(`${jsFile} has source map`);
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
const subdirectories = items.filter(item => item.isDirectory() && !ignoredDirs.includes(item.name));

if (subdirectories.length > 0) {
  console.error('❌ Error: Subdirectories found in assets/. Shopify requires all assets in root.');
  subdirectories.forEach(directory => console.error(`  - ${directory.name}/`));
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
