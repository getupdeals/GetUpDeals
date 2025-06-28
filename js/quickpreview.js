// quickpreview.js

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("quickPreviewModal");

  window.openQuickPreview = function (productId) {
    const product = window.GetUpDeals.state.products.find(p => p.id === productId);
    if (!product) return;

    modal.innerHTML = `
      <div class="modal-content">
        <button class="close-btn" onclick="closeQuickPreview()">×</button>
        <img src="${product.image}" alt="${product.title}" />
        <h2>${product.title}</h2>
        <p>${product.offer}</p>
        <p><strong>Price:</strong> ₹${product.price} <s>₹${product.originalPrice}</s></p>
        <p><strong>Rating:</strong> ⭐ ${product.rating} (${product.sold} sold)</p>
        <a href="${product.affiliateLink}" target="_blank" class="cta-button">View Deal 🔗</a>
      </div>
    `;

    modal.classList.remove("hidden");
    document.body.classList.add("no-scroll");
  };

  window.closeQuickPreview = function () {
    modal.classList.add("hidden");
    document.body.classList.remove("no-scroll");
  };
});