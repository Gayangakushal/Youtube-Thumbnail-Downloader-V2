chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getVideoId') {
      const videoId = extractVideoIdFromUrl(sender.tab.url);
      sendResponse({ videoId: videoId });
    }
  });
  
  // Extract video ID from YouTube URL
  function extractVideoIdFromUrl(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  }