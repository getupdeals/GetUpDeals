document.addEventListener("DOMContentLoaded", () => {
  loadCategories();
});

function loadCategories() {
  fetch('./data/categories.json')
    .then(res => res.json())
    .then(categories => {
      const container = document.getElementById('category-container');
      container.innerHTML = '';
      
      categories.forEach(category => {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `
          <img src="${category.image}" alt="${category.name}" />
          <span>${category.name}</span>
        `;
        
        // ⬇️ Open category-specific page (e.g., category.html?id=fashion)
        div.onclick = () => {
          window.location.href = `category.html?id=${encodeURIComponent(category.id)}`;
        };
        
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Error loading categories:', err);
    });
}