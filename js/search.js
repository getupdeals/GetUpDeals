// ✅ Load All Products from All Categories
let allProducts = [];

async function loadAllProducts() {
  const categoryList = ['electronics', 'fashion', 'beauty']; // Add real category keys
  const promises = categoryList.map(cat =>
    fetch(`./data/${cat}.json`).then(res => res.json().then(data => data.map(p => ({ ...p, category: cat }))))
  );
  const results = await Promise.all(promises);
  allProducts = results.flat();
}

function renderMiniCards(containerId, products) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'mini-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <span>${p.title}</span>
    `;
    card.onclick = () => location.href = `./product/product.html?id=${p.id}&category=${p.category}`;
    container.appendChild(card);
  });
}

function shuffle(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

function renderPopularProducts() {
  const shuffled = shuffle([...allProducts]).slice(0, 18);
  renderMiniCards('popularProducts', shuffled);
}

function renderRecommended() {
  const recentTags = JSON.parse(localStorage.getItem('recentTags') || '[]');
  const matched = allProducts.filter(p =>
    recentTags.some(tag => p.tags?.includes(tag))
  );
  const products = matched.length ? shuffle(matched).slice(0, 18) : shuffle(allProducts).slice(0, 18);
  renderMiniCards('recommendedSearches', products);
}

function saveSearchTag(tag) {
  let tags = JSON.parse(localStorage.getItem('recentTags') || '[]');
  if (!tags.includes(tag)) {
    tags.unshift(tag);
    if (tags.length > 10) tags.pop();
    localStorage.setItem('recentTags', JSON.stringify(tags));
  }
}

function loadRecentSearches() {
  const recent = JSON.parse(localStorage.getItem('recentTags') || '[]');
  const container = document.getElementById('recentSearches');
  container.innerHTML = '';
  const matched = allProducts.filter(p =>
    recent.some(tag => p.tags?.includes(tag))
  ).slice(0, 18);
  matched.forEach(p => {
    const card = document.createElement('div');
    card.className = 'mini-card';
    card.innerHTML = `<img src="${p.image}" alt="${p.title}"><span>${p.title}</span>`;
    card.onclick = () => location.href = `./product/product.html?id=${p.id}&category=${p.category}`;
    container.appendChild(card);
  });
}

function showSearchOverlay() {
  document.getElementById('homepage').classList.add('hidden');
  document.getElementById('search-overlay').classList.remove('hidden');
  document.getElementById('search-focus-overlay').classList.add('hidden');
}

function showFocusOverlay() {
  document.getElementById('homepage').classList.add('hidden');
  document.getElementById('search-focus-overlay').classList.remove('hidden');
  document.getElementById('search-overlay').classList.add('hidden');
}

function hideAllOverlays() {
  document.getElementById('homepage').classList.remove('hidden');
  document.getElementById('search-focus-overlay').classList.add('hidden');
  document.getElementById('search-overlay').classList.add('hidden');
}

function setupLiveSuggestions() {
  const input = document.getElementById('searchInput');
  const textSuggestions = document.getElementById('textSuggestions');
  const productSuggestions = document.getElementById('productSuggestions');
  
  input.addEventListener('focus', () => {
    if (!input.value.trim()) showFocusOverlay();
  });
  
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    
    if (!q) {
      textSuggestions.innerHTML = '';
      productSuggestions.innerHTML = '';
      return showFocusOverlay();
    }
    
    const matches = allProducts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.tags?.some(t => t.toLowerCase().includes(q))
    ).slice(0, 10);
    
    textSuggestions.innerHTML = '';
    matches.forEach(p => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = p.title;
      div.onclick = () => {
        saveSearchTag(p.tags?.[0] || p.title);
        location.href = `./search/search.html?tag=${encodeURIComponent(p.tags?.[0] || p.title)}`;
      };
      textSuggestions.appendChild(div);
    });
    
    renderMiniCards('productSuggestions', matches);
    showSearchOverlay();
  });
  
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value.trim();
      if (val) {
        saveSearchTag(val);
        location.href = `./search/search.html?tag=${encodeURIComponent(val)}`;
      }
    }
  });
  
  document.body.addEventListener('click', e => {
    if (!document.getElementById('searchBarWrapper').contains(e.target)) {
      hideAllOverlays();
    }
  });
}

async function initSearchPage() {
  await loadAllProducts();
  loadRecentSearches();
  renderRecommended();
  renderPopularProducts();
  setupLiveSuggestions();
  setInterval(renderPopularProducts, 10 * 60 * 1000); // every 10 min
}

initSearchPage();