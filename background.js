// Background script for global key detection and logging
console.log('Ctrl+Y Key Logger background script started');

// Keep track of the last active tab for navigation
let lastActiveTabId = null;
let currentActiveTabId = null;

// Listen for tab activation changes to track previous tab
browser.tabs.onActivated.addListener((activeInfo) => {
  lastActiveTabId = currentActiveTabId;
  currentActiveTabId = activeInfo.tabId;
  console.log('📋 Tab switched - Previous:', lastActiveTabId, 'Current:', currentActiveTabId);
});

// Initialize current tab on startup
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  if (tabs[0]) {
    currentActiveTabId = tabs[0].id;
    console.log('🚀 Initial active tab:', currentActiveTabId);
  }
});

// Listen for the keyboard shortcut command (works everywhere in Firefox)
browser.commands.onCommand.addListener((command) => {
  if (command === 'ctrl-y-shortcut') {
    const timestamp = new Date().toISOString();
    
    // Get information about the current tab
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      const currentTab = tabs[0];
      const tabInfo = {
        timestamp: timestamp,
        tabId: currentTab ? currentTab.id : 'unknown',
        url: currentTab ? currentTab.url : 'unknown',
        title: currentTab ? currentTab.title : 'unknown',
        isNewTab: currentTab ? currentTab.url.startsWith('about:') : false,
        isSettings: currentTab ? currentTab.url.includes('about:preferences') : false
      };
      
      console.log('🎯 CTRL+Y DETECTED - Switching to previous tab:', {
        current: tabInfo,
        previousTabId: lastActiveTabId
      });
      
      // Navigate to previous tab if we have one
      if (lastActiveTabId !== null) {
        // Check if the previous tab still exists
        browser.tabs.get(lastActiveTabId).then((previousTab) => {
          console.log('⬅️ Switching to previous tab:', previousTab.title);
          browser.tabs.update(lastActiveTabId, { active: true });
        }).catch((error) => {
          console.log('❌ Previous tab no longer exists, finding alternative...');
          // If previous tab is gone, switch to the next available tab
          browser.tabs.query({ currentWindow: true }).then((allTabs) => {
            if (allTabs.length > 1) {
              // Find a different tab (not the current one)
              const otherTab = allTabs.find(tab => tab.id !== currentTab.id);
              if (otherTab) {
                console.log('� Switching to alternative tab:', otherTab.title);
                browser.tabs.update(otherTab.id, { active: true });
              }
            } else {
              console.log('📝 Only one tab open, cannot switch');
            }
          });
        });
      } else {
        console.log('📝 No previous tab recorded, finding last tab...');
        // If no previous tab tracked, switch to the last tab in the window
        browser.tabs.query({ currentWindow: true }).then((allTabs) => {
          if (allTabs.length > 1) {
            // Get the tab that was most recently accessed (excluding current)
            const otherTabs = allTabs.filter(tab => tab.id !== currentTab.id);
            if (otherTabs.length > 0) {
              // Switch to the last tab in the list
              const targetTab = otherTabs[otherTabs.length - 1];
              console.log('🔄 Switching to last available tab:', targetTab.title);
              browser.tabs.update(targetTab.id, { active: true });
            }
          } else {
            console.log('📝 Only one tab open, cannot switch');
          }
        });
      }
      
    }).catch((error) => {
      console.log('🎯 CTRL+Y DETECTED (could not get tab info):', { timestamp, error });
    });
  }
});

// Listen for messages from content scripts (for websites)
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'CTRL_Y_PRESSED') {
    console.log('🌐 CTRL+Y FROM CONTENT SCRIPT:', {
      timestamp: message.timestamp,
      url: message.url,
      title: message.title,
      tabId: sender.tab ? sender.tab.id : 'unknown'
    });
    
    sendResponse({ received: true });
  }
});

// Optional: Log when the extension starts up
browser.runtime.onStartup.addListener(() => {
  console.log('🚀 Ctrl+Y Key Logger extension started up');
});

// Optional: Log when extension is installed
browser.runtime.onInstalled.addListener((details) => {
  console.log('📦 Ctrl+Y Key Logger extension installed/updated:', details.reason);
  
  // Show a notification that the extension is ready
  if (details.reason === 'install') {
    console.log('✅ Extension ready! Ctrl+Y will now be logged everywhere in Firefox.');
  }
});
