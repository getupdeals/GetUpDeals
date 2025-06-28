// filters.js

document.addEventListener("DOMContentLoaded", () => {
  const filtersSection = document.getElementById("filters-section");
  if (!filtersSection) return;

  const state = window.GetUpDeals?.state;
  if (!state || !state.products) {
    console.warn("⚠️ GetUpDeals.state.products not available yet.");
    return;
  }

  // Generate unique categories, subcategories, and subsubcategories from products
  const categories = new Set();
  const subcategories = new Set();
  const subsubcategories = new Set();

  state.products.forEach(product => {
    categories.add(product.category);
    subcategories.add(product.subcategory);
    subsubcategories.add(product.subsubcategory);
  });

  // Create filter dropdowns
  const createSelect = (labelText, options, id) => {
    const label = document.createElement("label");
    label.textContent = labelText;
    const select = document.createElement("select");
    select.id = id;
    select.innerHTML = `<option value="">All</option>` +
      [...options].sort().map(option =>
        `<option value="${option}">${option}</option>`
      ).join("");
    label.appendChild(select);
    return label;
  };

  filtersSection.innerHTML = "";
  filtersSection.appendChild(createSelect("Category:", categories, "filter-category"));
  filtersSection.appendChild(createSelect("Subcategory:", subcategories, "filter-subcategory"));
  filtersSection.appendChild(createSelect("Sub-subcategory:", subsubcategories, "filter-subsubcategory"));

  // Filtering logic
  const filterProducts = () => {
    const cat = document.getElementById("filter-category").value;
    const sub = document.getElementById("filter-subcategory").value;
    const subsub = document.getElementById("filter-subsubcategory").value;

    state.filteredProducts = state.products.filter(product => {
      return (!cat || product.category === cat)
          && (!sub || product.subcategory === sub)
          && (!subsub || product.subsubcategory === subsub);
    });

    // Hide homepage sections if filters are active
    const homepageSection = document.getElementById("homepage-section");
    homepageSection.style.display = (cat || sub || subsub) ? "none" : "block";

    // Dispatch custom event to update product view
    document.dispatchEvent(new CustomEvent("productsFiltered"));
  };

  // Add event listeners
  ["filter-category", "filter-subcategory", "filter-subsubcategory"].forEach(id => {
    document.getElementById(id).addEventListener("change", filterProducts);
  });
});