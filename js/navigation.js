// navigation.js

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll("#main-nav a");

  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const text = link.textContent.trim();

      switch (text) {
        case "🏠 Home":
          scrollToSection("homepage-section");
          break;
        case "🔥 Trending":
          scrollToSection("products-section");
          break;
        case "🎯 Rewards":
          scrollToSection("rewards-section");
          break;
        case "❤️ Wishlist":
          scrollToSection("wishlist-section");
          break;
        case "👤 Account":
          alert("Login & Profile coming soon! 🚀");
          break;
      }

      setActiveNav(link);
    });
  });

  function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function setActiveNav(activeLink) {
    navLinks.forEach(link => link.classList.remove("active"));
    activeLink.classList.add("active");
  }
});