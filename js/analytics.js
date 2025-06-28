// analytics.js

(function() {
  // Utility to log user events for personalization & gamification
  const logEvent = (type, data = {}) => {
    const event = {
      type,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    
    // Log to localStorage for now (can be replaced with Firebase/Server)
    let events = JSON.parse(localStorage.getItem('gud_analytics')) || [];
    events.push(event);
    localStorage.setItem('gud_analytics', JSON.stringify(events));
    
    // Optional: trigger badge/reward update
    document.dispatchEvent(new CustomEvent('userEventLogged', { detail: event }));
  };
  
  // Log page view
  logEvent('page_view', { page: window.location.pathname });
  
  // Track clicks
  document.addEventListener('click', e => {
    const target = e.target.closest('[data-track]');
    if (target) {
      logEvent('click', {
        label: target.getAttribute('data-track'),
        id: target.id || null,
        tag: target.tagName,
      });
    }
  });
  
  // Track search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      logEvent('search_input', { query: e.target.value });
    });
  }
  
  // Expose logEvent globally if needed
  window.gudLogEvent = logEvent;
})();