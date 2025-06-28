// ui.js

document.addEventListener("DOMContentLoaded", () => {
  // Close modal on outside click
  document.addEventListener("click", (e) => {
    const modal = document.querySelector(".modal");
    if (modal && !modal.classList.contains("hidden")) {
      if (!modal.contains(e.target) && !e.target.closest(".product-card")) {
        modal.classList.add("hidden");
      }
    }
  });

  // Hide sections on scroll during search mode
  const searchInput = document.getElementById("searchInput");
  searchInput?.addEventListener("focus", () => {
    document.body.classList.add("search-mode");
  });

  searchInput?.addEventListener("blur", () => {
    if (searchInput.value.trim() === "") {
      document.body.classList.remove("search-mode");
    }
  });

  // Simple back-to-top button logic (optional enhancement)
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.style.display = window.scrollY > 300 ? "block" : "none";
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

let lastScrollTop = 0;
const header = document.getElementById("main-header");

window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > lastScrollTop && scrollTop > 80) {
    // Scrolling down
    header.classList.add("hide");
  } else {
    // Scrolling up
    header.classList.remove("hide");
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});