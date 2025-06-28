function loadSubcategories(categoryId) {
  fetch('./data/subcategories.json')
    .then(res => res.json())
    .then(subcategories => {
      const filtered = subcategories.filter(sub => sub.categoryId === categoryId);
      const container = document.getElementById('subcategory-container');
      container.innerHTML = '';
      
      // Clear subsubcategories
      const subsubContainer = document.getElementById('subsubcategory-container');
      if (subsubContainer) subsubContainer.innerHTML = '';
      
      if (filtered.length === 0) {
        container.innerHTML = '<p class="empty-message">No subcategories found.</p>';
        return;
      }
      
      filtered.forEach(sub => {
        const div = document.createElement('div');
        div.className = 'subcategory-item';
        div.innerHTML = `
          <img src="${sub.image}" alt="${sub.name}" />
          <span>${sub.name}</span>
        `;
        div.onclick = () => {
          loadSubsubcategories(sub.id);
          loadProductsBySubcategory(sub.id);
        };
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Error loading subcategories:', err);
      document.getElementById('subcategory-container').innerHTML =
        '<p class="error">Failed to load subcategories.</p>';
    });
}