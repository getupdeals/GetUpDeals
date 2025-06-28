const container = document.getElementById('viewAllContainer');
const filterPrice = document.getElementById('filterPrice');
const filterBrand = document.getElementById('filterBrand');
const sortSelect = document.getElementById('sortSelect');
const productCount = document.getElementById('productCount');
const backToTop = document.getElementById('backToTopBtn');

// Query Params
const params = new URLSearchParams(location.search);
const sectionParam = params.get('section');
const subcategoryParam = params.get('subcategory');
const tagsParam = params.get('tags');
const categoryParam = params.get('category');
const tagsArray = tagsParam ? tagsParam.split(',').map(t => t.trim().toLowerCase()) : [];

let products = [];
let filteredProducts = [];
let currentIndex = 0;
const ITEMS_PER_LOAD = 12;

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderProductsChunk() {
  const chunk = filteredProducts.slice(currentIndex, currentIndex + ITEMS_PER_LOAD);
  chunk.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <a href="../product/product.html?id=${product.id}&category=${product.category}">
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
  currentIndex += ITEMS_PER_LOAD;
}

function onScroll() {
  if (window.scrollY > 300) backToTop.style.display = 'block';
  else backToTop.style.display = 'none';
  
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    renderProductsChunk();
  }
}

function applyFilters() {
  const price = filterPrice.value;
  const brand = filterBrand.value.toLowerCase();
  const sortBy = sortSelect.value;
  
  filteredProducts = products.filter(p => {
    const matchPrice =
      price === 'all' ||
      (price === 'under500' && p.price <= 500) ||
      (price === '500to1000' && p.price > 500 && p.price <= 1000) ||
      (price === 'above1000' && p.price > 1000);
    
    const matchBrand = brand === '' || p.title.toLowerCase().includes(brand);
    return matchPrice && matchBrand;
  });
  
  if (sortBy === 'lowtohigh') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'hightolow') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'toprated') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }
  
  productCount.textContent = `Showing ${filteredProducts.length} product(s)`;
  container.innerHTML = '';
  currentIndex = 0;
  renderProductsChunk();
  updateURL();
}

function updateURL() {
  const updatedParams = new URLSearchParams();
  if (sectionParam) updatedParams.set('section', sectionParam);
  if (subcategoryParam) updatedParams.set('subcategory', subcategoryParam);
  if (tagsParam) updatedParams.set('tags', tagsParam);
  if (categoryParam) updatedParams.set('category', categoryParam);
  
  if (filterPrice.value !== 'all') updatedParams.set('price', filterPrice.value);
  if (filterBrand.value.trim() !== '') updatedParams.set('brand', filterBrand.value.trim());
  if (sortSelect.value !== 'default') updatedParams.set('sort', sortSelect.value);
  
  history.replaceState(null, '', '?' + updatedParams.toString());
}

function restoreFiltersFromURL() {
  const urlParams = new URLSearchParams(location.search);
  filterPrice.value = urlParams.get('price') || 'all';
  filterBrand.value = urlParams.get('brand') || '';
  sortSelect.value = urlParams.get('sort') || 'default';
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

const dataFiles = ['fashion.json', 'electronics.json', 'beauty.json '];

Promise.all(dataFiles.map(file => fetch(`../data/${file}`).then(r => r.json())))
  .then(results => {
    const allProducts = results.flat();
    
    // Filter by params
    products = allProducts.filter(p => {
      const matchSection = sectionParam ? p.tags?.includes(sectionParam.toLowerCase()) : true;
      const matchSubcat = subcategoryParam ? p.subcategory === subcategoryParam : true;
      const matchTags = tagsArray.length > 0 ?
        p.tags?.some(tag => tagsArray.includes(tag.toLowerCase())) : true;
      return matchSection && matchSubcat && matchTags;
    });
    
    const titleEl = document.getElementById('sectionTitle');
    if (sectionParam) {
      titleEl.textContent = `${capitalize(sectionParam)} Deals`;
    } else if (subcategoryParam && tagsArray.length > 0) {
      titleEl.textContent = `Similar Products`;
    } else if (subcategoryParam) {
      titleEl.textContent = `Top Rated in Subcategory`;
    } else {
      titleEl.textContent = `All Deals`;
    }
    
    restoreFiltersFromURL();
    applyFilters();
    
    window.addEventListener('scroll', onScroll);
    filterPrice.addEventListener('change', applyFilters);
    filterBrand.addEventListener('input', applyFilters);
    sortSelect.addEventListener('change', applyFilters);
  })
  .catch(() => {
    container.innerHTML = '<p>❌ Failed to load products.</p>';
  });