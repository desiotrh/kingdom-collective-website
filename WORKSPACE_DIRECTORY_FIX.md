# Workspace Directory Fix

## Problem

You were experiencing an error where commands were trying to `cd kingdom-website` from the wrong directory:

```
cd : Cannot find path 'C:\Users\dezme\kingdom-website' because it does not exist.
```

This happened because the terminal was starting in `C:\Users\dezme\` instead of the workspace root `D:\Kingdom Studios App`.

## What Was Fixed

### 1. Updated `package.json`

**Before:**

```json
"build": "cd kingdom-website && npm run build"
```

**After:**

```json
"build": "npm --prefix kingdom-website run build"
```

### 2. Updated `vercel.json`

**Before:**

```json
"buildCommand": "cd kingdom-website && npm run build",
"installCommand": "cd kingdom-website && npm install"
```

**After:**

```json
"buildCommand": "npm --prefix kingdom-website run build",
"installCommand": "npm --prefix kingdom-website install"
```

### 3. Created Helper Scripts

- `start-workspace.ps1` - PowerShell script to navigate to workspace
- `start-workspace.bat` - Batch script to navigate to workspace

## How to Prevent This Issue

### Option 1: Use the Startup Scripts

Always start your terminal using one of these scripts:

```powershell
# PowerShell
.\start-workspace.ps1

# Or CMD
start-workspace.bat
```

### Option 2: Always Navigate to Workspace First

If you open a terminal, always run:

```powershell
cd "D:\Kingdom Studios App"
```

### Option 3: Set Cursor/VSCode to Always Start in Workspace

The workspace path is already set to `D:\Kingdom Studios App`, but if your terminal doesn't respect this, you can:

1. Open Cursor/VSCode Settings
2. Search for "terminal.integrated.cwd"
3. Set it to: `D:\Kingdom Studios App`

## Using npm --prefix

The `npm --prefix` flag allows you to run npm commands in a specific directory without needing to `cd` first.

**Examples:**

```powershell
# Install dependencies
npm --prefix kingdom-website install

# Run dev server
npm --prefix kingdom-website run dev

# Build for production
npm --prefix kingdom-website run build
```

## Verification

To verify you're in the correct directory, run:

```powershell
# PowerShell
Get-Location
Test-Path "kingdom-website"  # Should return True

# CMD
cd
dir kingdom-website  # Should list the directory
```

## Why This Happened

The error occurred because:

1. Some process was running npm scripts from your user directory (`C:\Users\dezme\`)
2. The scripts used relative paths (`cd kingdom-website`)
3. The relative path was incorrect from that starting location

The fix ensures commands work regardless of where the terminal starts, but you should still ensure you're in the workspace directory for best results.
