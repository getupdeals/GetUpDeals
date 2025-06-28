// loaders.js

document.addEventListener("DOMContentLoaded", () => {
  preloadData();
});

const CATEGORY_FILES = [
  "./data/fashion.json",
  "./data/electronics.json",
  "./data/beauty.json" // home.json removed
];

function preloadData() {
  Promise.all([
      ...CATEGORY_FILES.map(url => fetchJSON(url)),
      fetchJSON("./data/categories.json"),
      fetchJSON("./data/subcategories.json"),
      fetchJSON("./data/subsubcategories.json")
    ])
    .then((responses) => {
      const allProducts = responses.slice(0, CATEGORY_FILES.length).flat();
      const categories = responses[CATEGORY_FILES.length];
      const subcategories = responses[CATEGORY_FILES.length + 1];
      const subsubcategories = responses[CATEGORY_FILES.length + 2];
      
      window.GetUpDeals = window.GetUpDeals || {};
      window.GetUpDeals.data = {
        products: allProducts,
        categories,
        subcategories,
        subsubcategories
      };
      
      window.GetUpDeals.state = window.GetUpDeals.state || {};
      window.GetUpDeals.state.products = allProducts;
      
      document.dispatchEvent(new Event("dataLoaded"));
    })
    .catch((err) => {
      console.error("❌ Error loading initial data:", err);
    });
}

function fetchJSON(path) {
  return fetch(path).then((res) => {
    if (!res.ok) throw new Error(`Failed to load: ${path}`);
    return res.json();
  });
}