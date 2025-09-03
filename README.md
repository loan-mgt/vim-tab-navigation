# Ctrl+Y Tab Navigator Firefox Extension

A Firefox extension that allows you to navigate to the previous tab using Ctrl+Y shortcut - works everywhere in Firefox including new tabs, settings pages, and all websites.

## Features

- ✅ **Previous tab navigation** - Press Ctrl+Y to switch to the previously active tab
- ✅ **Global shortcut** - Works on new tabs, settings, about: pages, and all websites
- ✅ **Smart fallback** - If previous tab is closed, switches to another available tab
- ✅ **Tab tracking** - Automatically tracks tab switching to remember previous tab
- ✅ **Detailed logging** - Console logs show tab switching activity

## Installation

1. Open Firefox
2. Go to `about:debugging`
3. Click "This Firefox" in the left sidebar
4. Click "Load Temporary Add-on"
5. Navigate to this folder and select `manifest.json`

## Usage

1. **Open multiple tabs** in Firefox
2. **Switch between tabs** normally (click on tabs or use Ctrl+Tab)
3. **Press Ctrl+Y** to return to the previously active tab
4. **Press Ctrl+Y again** to switch back (like Alt+Tab behavior)

## Testing

Try this workflow:
1. Open Tab A (e.g., google.com)
2. Open Tab B (e.g., github.com) 
3. Switch to Tab A
4. Press **Ctrl+Y** → Should switch back to Tab B
5. Press **Ctrl+Y** again → Should switch back to Tab A

Works on:
- ✅ New tab page (about:newtab)
- ✅ Settings page (about:preferences)
- ✅ Any website
- ✅ Extension pages
- ✅ Any Firefox internal page

## Viewing Logs

### Background Script Logs (recommended):
1. Go to `about:debugging`
2. Find your extension and click "Inspect"
3. Go to the Console tab in the new window
4. You'll see logs for:
   - Tab switches: `📋 Tab switched - Previous: X Current: Y`
   - Ctrl+Y presses: `🎯 CTRL+Y DETECTED - Switching to previous tab`
   - Tab navigation: `⬅️ Switching to previous tab: [Tab Title]`

## How It Works

1. **Tab Tracking**: The extension listens to `tabs.onActivated` events to track which tab was previously active
2. **Global Shortcut**: Uses Firefox's `commands` API to register Ctrl+Y globally
3. **Smart Switching**: When Ctrl+Y is pressed:
   - Switches to the last active tab if it exists
   - Falls back to another available tab if the previous tab was closed
   - Handles single-tab scenarios gracefully

## Files

- `manifest.json` - Extension configuration with global shortcut and tab permissions
- `background.js` - Tab tracking and navigation logic
- `content.js` - Website-specific detection (supplementary)
- `README.md` - This file

## Permissions

- `activeTab` - Access to the currently active tab
- `<all_urls>` - Access to all websites
- `tabs` - Required for tab switching and tracking tab changes

## Development

To modify the extension:
1. Edit the JavaScript files
2. Go to `about:debugging`
3. Click "Reload" next to your extension
4. Test the changes with multiple tabs

## Similar to Vim/Terminal Behavior

This extension mimics the "previous buffer" behavior found in:
- **Vim**: `:b#` or `Ctrl+^` to switch to previous buffer
- **Terminal**: `cd -` to return to previous directory
- **IDEs**: "Go to last edit location" or "Navigate back"
