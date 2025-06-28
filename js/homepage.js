const STORAGE_KEY = 'homepageShuffleCache';
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const homepageCategoryFiles = [
  './data/fashion.json',
  './data/electronics.json',
  './data/beauty.json' // removed home.json
];

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function getCachedData() {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (!cached) return null;
  const { timestamp, data } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) return null;
  return data;
}

function setCachedData(data) {
  const payload = {
    timestamp: Date.now(),
    data
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function renderSection(products, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="./product/product.html?id=${product.id}&category=${product.category}">
        <img src="${product.image}" alt="${product.title}">
        <h4>${product.title}</h4>
        <div class="price-section">
          <span class="price">₹${product.price}</span>
          <span class="original-price">₹${product.originalPrice}</span>
        </div>
      </a>
    `;
    container.appendChild(card);
  });
}

function setupViewAllLinks() {
  const viewAllLinks = document.querySelectorAll('.view-all');
  viewAllLinks.forEach(link => {
    const sectionHeader = link.closest('.section-header')?.querySelector('h2')?.textContent.toLowerCase();
    if (sectionHeader?.includes('trending')) {
      link.href = './product/viewall.html?section=trending';
    } else if (sectionHeader?.includes('hot')) {
      link.href = './product/viewall.html?section=hot';
    } else if (sectionHeader?.includes('new')) {
      link.href = './product/viewall.html?section=new';
    }
  });
}

function loadAllCategoryFiles() {
  return Promise.all(
    homepageCategoryFiles.map(url => fetch(url).then(res => res.json()))
  );
}

loadAllCategoryFiles().then(fileGroups => {
  const allProducts = fileGroups.flat();
  
  let sections = getCachedData();
  
  if (!sections) {
    sections = {
      trending: shuffleArray(allProducts.filter(p => p.tags?.includes('trending'))).slice(0, 10),
      hot: shuffleArray(allProducts.filter(p => p.tags?.includes('hot'))).slice(0, 10),
      new: shuffleArray(allProducts.filter(p => p.tags?.includes('new'))).slice(0, 10),
    };
    setCachedData(sections);
  }
  
  renderSection(sections.trending, 'trendingDealsContainer');
  renderSection(sections.hot, 'hotPicksContainer');
  renderSection(sections.new, 'newArrivalsContainer');
  
  setupViewAllLinks();
});