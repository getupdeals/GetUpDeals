// ✅ Declare early so other scripts don't crash
window.GetUpDeals = {
  version: "1.0",
  state: {} // initialize empty
};

// Hour-based shuffle key
function getShuffleHour() {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
}

// Clear homepage shuffle if more than 1 hour old
function clearOldShuffleCache() {
  const lastShuffle = localStorage.getItem("lastShuffleHour");
  const currentShuffle = getShuffleHour();
  if (lastShuffle !== currentShuffle) {
    localStorage.removeItem("trendingDeals");
    localStorage.removeItem("hotPicks");
    localStorage.removeItem("newArrivals");
    localStorage.setItem("lastShuffleHour", currentShuffle);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 GetUpDeals Initialized");
  
  clearOldShuffleCache();
  
  document.body.classList.toggle('dark-mode', localStorage.getItem('theme') === 'dark');
  
  // ✅ Fill in state AFTER DOM ready
  window.GetUpDeals.state = {
    searchActive: false,
    products: [],
    filteredProducts: [],
    wishlist: [],
  };
  
  window.GetUpDeals.shuffleHour = getShuffleHour();
});