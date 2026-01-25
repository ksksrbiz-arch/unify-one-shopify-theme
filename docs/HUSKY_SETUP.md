# Husky Configuration Guide

## What is Husky?

Husky is a tool that helps enforce code quality by running scripts before Git operations (like commits and pushes).

## Installation

To enable pre-commit hooks for this project:

```bash
npm install --save-dev husky lint-staged
npm pkg set scripts.prepare="husky install"
npm run prepare
npx husky add .husky/pre-commit "npx lint-staged"
```

## Configuration

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{js,liquid}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.liquid": [
      "shopify theme check"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## What It Does

Before every commit, Husky will:
1. Format code with Prettier
2. Lint JavaScript with ESLint
3. Check Liquid templates with Shopify Theme Check
4. Only commit if all checks pass

## Benefits

- ✅ Consistent code formatting
- ✅ Catch errors before they're committed
- ✅ Enforce team coding standards
- ✅ Reduce code review time

## Bypassing Hooks (Use Sparingly)

In emergencies only:
```bash
git commit --no-verify -m "Emergency fix"
```

## Troubleshooting

If hooks aren't working:
```bash
chmod +x .husky/pre-commit
npx husky install
```
