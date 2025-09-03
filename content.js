// Content script that runs on websites (supplements the global shortcuts)
console.log('Vim Tab Navigator content script loaded on:', window.location.href);

// Listen for keydown events on websites
document.addEventListener('keydown', function(event) {
  // Check for Ctrl+Y (previous tab) or Ctrl+E (next tab)
  const isCtrlY = event.ctrlKey && (event.key === 'y' || event.key === 'Y');
  const isCtrlE = event.ctrlKey && (event.key === 'e' || event.key === 'E');
  
  if (isCtrlY || isCtrlE) {
    // Note: We don't prevent default here since the global shortcut handles it
    
    // Log the key press with detailed website info
    const timestamp = new Date().toISOString();
    const pageUrl = window.location.href;
    const pageTitle = document.title;
    const shortcut = isCtrlY ? 'Ctrl+Y' : 'Ctrl+E';
    const action = isCtrlY ? 'previous tab' : 'next tab';
    
    console.log(`🔑 ${shortcut} detected on website (${action})!`, {
      timestamp: timestamp,
      url: pageUrl,
      title: pageTitle,
      domain: window.location.hostname,
      path: window.location.pathname
    });
    
    // Send message to background script for centralized logging
    if (typeof browser !== 'undefined' && browser.runtime) {
      browser.runtime.sendMessage({
        type: isCtrlY ? 'CTRL_Y_PRESSED' : 'CTRL_E_PRESSED',
        timestamp: timestamp,
        url: pageUrl,
        title: pageTitle,
        domain: window.location.hostname,
        path: window.location.pathname,
        shortcut: shortcut,
        action: action
      });
    }
  }
}, true); // Use capture phase to catch events early

// Log when the content script loads on a new page
console.log('📄 Content script ready for Ctrl+Y/Ctrl+E detection on:', document.title || 'Untitled page');
