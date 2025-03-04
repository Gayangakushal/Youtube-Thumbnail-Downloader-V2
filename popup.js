document.addEventListener('DOMContentLoaded', function() {
    const youtubeUrlInput = document.getElementById('youtube-url');
    const fetchButton = document.getElementById('fetch-btn');
    const statusMessage = document.getElementById('status-message');
    const thumbnailsContainer = document.getElementById('thumbnails-container');
    
    // Check if we're on a YouTube page when popup opens
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentUrl = tabs[0].url;
      if (currentUrl.includes('youtube.com/watch')) {
        youtubeUrlInput.value = currentUrl;
        // Automatically fetch thumbnails if on a YouTube video page
        fetchThumbnails(currentUrl);
      }
    });
    
    fetchButton.addEventListener('click', function() {
      const url = youtubeUrlInput.value.trim();
      if (!url) {
        showStatus('Please enter a YouTube URL', 'error');
        return;
      }
      
      fetchThumbnails(url);
    });
    
    function fetchThumbnails(url) {
      showStatus('Fetching thumbnails...', 'info');
      thumbnailsContainer.innerHTML = '';
      
      // Extract video ID from YouTube URL
      const videoId = extractVideoId(url);
      
      if (!videoId) {
        showStatus('Invalid YouTube URL', 'error');
        return;
      }
      
      // Generate thumbnail URLs for different qualities
      const thumbnails = [
        {
          url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          quality: 'Maximum Resolution (1280x720)',
          id: 'maxres'
        },
        {
          url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          quality: 'Standard Definition (640x480)',
          id: 'sd'
        },
        {
          url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          quality: 'High Quality (480x360)',
          id: 'hq'
        },
        {
          url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          quality: 'Medium Quality (320x180)',
          id: 'mq'
        },
        {
          url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
          quality: 'Default Quality (120x90)',
          id: 'default'
        }
      ];
      
      // Display thumbnails
      thumbnails.forEach(thumbnail => {
        const thumbnailItem = document.createElement('div');
        thumbnailItem.className = 'thumbnail-item';
        
        const img = document.createElement('img');
        img.src = thumbnail.url;
        img.alt = `${thumbnail.quality} thumbnail`;
        img.onerror = function() {
          // Remove the thumbnail item if image fails to load
          thumbnailItem.remove();
        };
        
        const thumbnailInfo = document.createElement('div');
        thumbnailInfo.className = 'thumbnail-info';
        
        const qualitySpan = document.createElement('span');
        qualitySpan.className = 'thumbnail-quality';
        qualitySpan.textContent = thumbnail.quality;
        
        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.textContent = 'Download';
        downloadBtn.addEventListener('click', function() {
          downloadThumbnail(thumbnail.url, `youtube-thumbnail-${videoId}-${thumbnail.id}.jpg`);
        });
        
        thumbnailInfo.appendChild(qualitySpan);
        thumbnailInfo.appendChild(downloadBtn);
        
        thumbnailItem.appendChild(img);
        thumbnailItem.appendChild(thumbnailInfo);
        
        thumbnailsContainer.appendChild(thumbnailItem);
      });
      
      showStatus('Thumbnails loaded successfully', 'success');
    }
    
    function extractVideoId(url) {
      const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[7].length === 11) ? match[7] : null;
    }
    
    function downloadThumbnail(url, filename) {
      chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: true
      });
    }
    
    function showStatus(message, type) {
      statusMessage.textContent = message;
      statusMessage.className = 'status ' + type;
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.className = 'status';
      }, 5000);
    }
  });