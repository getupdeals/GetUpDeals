function loadSubsubcategories(subcategoryId) {
  fetch('./data/subsubcategories.json')
    .then(res => res.json())
    .then(subsubsData => {
      const subsubs = subsubsData[subcategoryId] || [];
      const container = document.getElementById('subsubcategory-container');
      container.innerHTML = '';

      if (subsubs.length === 0) {
        container.innerHTML = '<p class="no-items">No sub-subcategories found.</p>';
        return;
      }

      subsubs.forEach(ss => {
        const div = document.createElement('div');
        div.className = 'subsubcategory-item';
        div.textContent = ss.name;
        div.onclick = () => {
          loadProductsBySubsubcategory(ss.id);
        };
        container.appendChild(div);
      });
    })
    .catch(err => {
      console.error('Error loading subsubcategories:', err);
    });
}