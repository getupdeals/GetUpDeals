// trustbadges.js

document.addEventListener("DOMContentLoaded", () => {
  const trustbadgesSection = document.getElementById("trustbadges-section");

  if (!trustbadgesSection) return;

  const badges = [
    { icon: "🔒", label: "Secure Checkout" },
    { icon: "✅", label: "Verified Sellers" },
    { icon: "💬", label: "24/7 Support" },
    { icon: "🚚", label: "Fast Shipping" },
    { icon: "💳", label: "Trusted Payments" }
  ];

  trustbadgesSection.innerHTML = badges
    .map(
      badge => `<div class="badge">${badge.icon} ${badge.label}</div>`
    )
    .join("");
});