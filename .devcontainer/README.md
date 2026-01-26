# Dev Container Configuration

This directory contains the configuration for GitHub Codespaces and VS Code Dev Containers.

## What's Configured

- **Base Image:** Node.js 18 (Official Microsoft Dev Container)
- **Shopify CLI:** Pre-installed globally
- **VS Code Extensions:**
  - ESLint (code linting)
  - Prettier (code formatting)
  - Shopify Theme Check (Liquid linting)
  - Shopify Liquid (syntax highlighting)
  - GitHub Copilot (AI pair programming)

## Features

- ✅ Automatic dependency installation on container creation
- ✅ Port 9000 forwarding for Shopify dev server
- ✅ Shopify CLI configuration persistence
- ✅ Format on save enabled by default
- ✅ Liquid file type associations

## Usage

### GitHub Codespaces
1. Click "Code" → "Codespaces" → "Create codespace on main"
2. Wait for container to build (~2-3 minutes)
3. Start coding!

### VS Code Dev Containers (Local)
1. Install "Dev Containers" extension in VS Code
2. Open repository in VS Code
3. Click "Reopen in Container" when prompted
4. Wait for container to build

## Customization

To modify the configuration:
1. Edit `devcontainer.json`
2. Rebuild container: Command Palette → "Dev Containers: Rebuild Container"

## Resources

- [Dev Containers Documentation](https://containers.dev/)
- [GitHub Codespaces Docs](https://docs.github.com/en/codespaces)
