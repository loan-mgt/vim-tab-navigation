// Background script for vim-style tab navigation
console.log('Vim Tab Navigation extension started');

// Keep track of the last active tab for navigation
let lastActiveTabId = null;
let currentActiveTabId = null;

// Tab tracking functionality
const TabTracker = {
  updateActiveTab: (activeInfo) => {
    lastActiveTabId = currentActiveTabId;
    currentActiveTabId = activeInfo.tabId;
    console.log('📋 Tab switched - Previous:', lastActiveTabId, 'Current:', currentActiveTabId);
  },

  initialize: async () => {
    try {
      const tabs = await browser.tabs.query({ active: true, currentWindow: true });
      if (tabs[0]) {
        currentActiveTabId = tabs[0].id;
        console.log('🚀 Initial active tab:', currentActiveTabId);
      }
    } catch (error) {
      console.error('Error initializing tab tracker:', error);
    }
  }
};

// Tab navigation functionality
const TabNavigator = {
  switchToPreviousTab: async () => {
    try {
      const currentTab = await TabNavigator.getCurrentTab();
      const allTabs = await browser.tabs.query({ currentWindow: true });
      
      console.log('🎯 CTRL+Y - Switching to previous tab by index');
      
      if (allTabs.length <= 1) {
        console.log('📝 Only one tab open, cannot switch to previous');
        return;
      }

      const currentIndex = allTabs.findIndex(tab => tab.id === currentTab.id);
      const previousIndex = currentIndex === 0 ? allTabs.length - 1 : currentIndex - 1;
      const previousTab = allTabs[previousIndex];
      
      console.log('⬅️ Switching to previous tab:', previousTab.title);
      await browser.tabs.update(previousTab.id, { active: true });
    } catch (error) {
      console.error('Error switching to previous tab:', error);
    }
  },

  switchToNextTab: async () => {
    try {
      const currentTab = await TabNavigator.getCurrentTab();
      const allTabs = await browser.tabs.query({ currentWindow: true });
      
      console.log('🎯 CTRL+E - Switching to next tab');
      
      if (allTabs.length <= 1) {
        console.log('📝 Only one tab open, cannot switch to next');
        return;
      }

      const currentIndex = allTabs.findIndex(tab => tab.id === currentTab.id);
      const nextIndex = (currentIndex + 1) % allTabs.length;
      const nextTab = allTabs[nextIndex];
      
      console.log('➡️ Switching to next tab:', nextTab.title);
      await browser.tabs.update(nextTab.id, { active: true });
    } catch (error) {
      console.error('Error switching to next tab:', error);
    }
  },

  getCurrentTab: async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
  },

  switchToTabById: async (tabId, direction) => {
    try {
      const targetTab = await browser.tabs.get(tabId);
      console.log(`⬅️ Switching to ${direction} tab:`, targetTab.title);
      await browser.tabs.update(tabId, { active: true });
    } catch (error) {
      console.log(`❌ ${direction} tab no longer exists, finding alternative...`);
      const currentTab = await TabNavigator.getCurrentTab();
      await TabNavigator.switchToAlternativeTab(currentTab, 'alternative');
    }
  },

  switchToAlternativeTab: async (currentTab, type) => {
    const allTabs = await browser.tabs.query({ currentWindow: true });
    
    if (allTabs.length <= 1) {
      console.log('📝 Only one tab open, cannot switch');
      return;
    }

    const otherTabs = allTabs.filter(tab => tab.id !== currentTab.id);
    if (otherTabs.length === 0) return;

    const targetTab = type === 'last' 
      ? otherTabs[otherTabs.length - 1]
      : otherTabs[0];
    
    console.log(`🔄 Switching to ${type} available tab:`, targetTab.title);
    await browser.tabs.update(targetTab.id, { active: true });
  }
};

// Command handler
const CommandHandler = {
  handleCommand: (command) => {
    const timestamp = new Date().toISOString();
    console.log(`⌨️ Command received: ${command} at ${timestamp}`);
    
    switch (command) {
      case 'ctrl-y-shortcut':
        TabNavigator.switchToPreviousTab();
        break;
      case 'ctrl-e-shortcut':
        TabNavigator.switchToNextTab();
        break;
      default:
        console.log('Unknown command:', command);
    }
  }
};

// Event listeners
browser.tabs.onActivated.addListener(TabTracker.updateActiveTab);
browser.commands.onCommand.addListener(CommandHandler.handleCommand);

// Initialize the extension
TabTracker.initialize();

// Listen for messages from content scripts
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CTRL_Y_PRESSED' || message.type === 'CTRL_E_PRESSED') {
    console.log(`🌐 ${message.shortcut || message.type} FROM CONTENT SCRIPT:`, {
      timestamp: message.timestamp,
      url: message.url,
      title: message.title,
      tabId: sender.tab ? sender.tab.id : 'unknown',
      action: message.action || 'navigation'
    });
    
    sendResponse({ received: true });
  }
});

// Startup and installation handlers
browser.runtime.onStartup.addListener(() => {
  console.log('🚀 Vim Tab Navigation extension started up');
});

browser.runtime.onInstalled.addListener((details) => {
  console.log('📦 Vim Tab Navigation extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    console.log('✅ Extension ready! Ctrl+Y (previous tab) and Ctrl+E (next tab) are now available.');
  }
});
