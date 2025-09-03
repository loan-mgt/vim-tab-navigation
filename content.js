// Content script that runs on websites (supplements the global shortcut)
console.log('Ctrl+Y Key Logger content script loaded on:', window.location.href);

// Listen for keydown events on websites
document.addEventListener('keydown', function(event) {
  // Check if Ctrl key is pressed and the key is 'y' or 'Y'
  if (event.ctrlKey && (event.key === 'y' || event.key === 'Y')) {
    // Note: We don't prevent default here since the global shortcut handles it
    
    // Log the key press with detailed website info
    const timestamp = new Date().toISOString();
    const pageUrl = window.location.href;
    const pageTitle = document.title;
    
    console.log('🔑 Ctrl+Y detected on website!', {
      timestamp: timestamp,
      url: pageUrl,
      title: pageTitle,
      domain: window.location.hostname,
      path: window.location.pathname
    });
    
    // Send message to background script for centralized logging
    if (typeof browser !== 'undefined' && browser.runtime) {
      browser.runtime.sendMessage({
        type: 'CTRL_Y_PRESSED',
        timestamp: timestamp,
        url: pageUrl,
        title: pageTitle,
        domain: window.location.hostname,
        path: window.location.pathname
      });
    }
  }
}, true); // Use capture phase to catch events early

// Log when the content script loads on a new page
console.log('📄 Content script ready for Ctrl+Y detection on:', document.title || 'Untitled page');
