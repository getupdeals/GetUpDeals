// product-card.js

function createProductCard(product) {
  const card = document.createElement('a');
  card.className = 'product-card';
  card.href = `./product/product.html?id=${product.id}`;
  card.innerHTML = `
    <img src="${product.image}" alt="${product.title}">
    <h4 class="product-title">${product.title}</h4>
    <div class="price-section">
      <span class="price">₹${product.price}</span>
      <span class="original-price">₹${product.originalPrice}</span>
    </div>
  `;
  return card;
}
