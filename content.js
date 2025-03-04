(function() {
    // Listen for right-click events on video thumbnails
    document.addEventListener('contextmenu', function(e) {
      // Check if the clicked element is a thumbnail
      const thumbnailElem = e.target.closest('img[src*="ytimg.com"]');
      
      if (thumbnailElem) {
        // Find the closest link (which should contain the video ID)
        const linkElem = thumbnailElem.closest('a[href*="/watch"]');
        
        if (linkElem) {
          const href = linkElem.getAttribute('href');
          const videoIdMatch = href.match(/[?&]v=([^&]+)/);
          
          if (videoIdMatch && videoIdMatch[1]) {
            const videoId = videoIdMatch[1];
            
            // Send message to background script about the available thumbnail
            chrome.runtime.sendMessage({
              action: 'foundThumbnail',
              videoId: videoId
            });
          }
        }
      }
    });
  })();