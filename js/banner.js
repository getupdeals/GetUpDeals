document.addEventListener("DOMContentLoaded", () => {
  const bannerSection = document.getElementById("banner-section");
  if (!bannerSection) return;

  const banners = [
    {
      image: "./assets/banner/banner1.jpg",
      headline: "🔥 Limited-Time Mega Deals!",
      subtext: "Save big before time runs out",
      cta: "Explore Deals",
      link: "#products-section",
    },
    {
      image: "./assets/banner/banner2.jpg",
      headline: "💎 New Arrivals Just Dropped!",
      subtext: "Discover the latest trending picks",
      cta: "Shop New",
      link: "#homepage-section",
    },
    {
      image: "./assets/banner/banner3.jpg",
      headline: "🎁 Unlock Reward Points",
      subtext: "Earn with every click & purchase",
      cta: "View Rewards",
      link: "#rewards-section",
    },
  ];

  // Render banner slides
  const carousel = document.createElement("div");
  carousel.className = "banner-carousel";
  
  banners.forEach(({ image, headline, subtext, cta, link }) => {
  const slide = document.createElement("div");
  slide.className = "banner-slide";
  slide.innerHTML = `
    <img src="${image}" alt="${headline}" />
    <div class="banner-content">
      <h2>${headline}</h2>
      <p>${subtext}</p>
      <a href="${link}" class="banner-cta">${cta}</a>
    </div>
  `;

  // Make entire slide clickable except for CTA
  slide.addEventListener("click", (event) => {
    if (!event.target.closest(".banner-cta")) {
      window.location.href = link;
    }
  });

  carousel.appendChild(slide);
});

  bannerSection.innerHTML = "";
  bannerSection.appendChild(carousel);

  const slides = carousel.querySelectorAll(".banner-slide");

  // Dots setup
  const dotContainer = document.createElement("div");
  dotContainer.className = "banner-dots";
  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.className = "banner-dot" + (index === 0 ? " active" : "");
    dot.dataset.index = index;
    dot.addEventListener("click", () => {
      currentIndex = index;
      scrollToSlide(currentIndex);
    });
    dotContainer.appendChild(dot);
  });
  bannerSection.appendChild(dotContainer);

  let currentIndex = 0;
  let isUserScrolling = false;
  let scrollTimeout;

  // Scroll to slide
  function scrollToSlide(index) {
    carousel.scrollTo({
      left: slides[index].offsetLeft,
      behavior: "smooth",
    });
    updateDots(index);
  }

  // Update dots
  function updateDots(index) {
    const dots = dotContainer.querySelectorAll(".banner-dot");
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  // Sync dot with scroll
  carousel.addEventListener("scroll", () => {
    isUserScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isUserScrolling = false;
    }, 1000);

    const scrollLeft = carousel.scrollLeft;
    const slideWidth = slides[0].offsetWidth;
    const newIndex = Math.round(scrollLeft / slideWidth);
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      updateDots(currentIndex);
    }
  });

  // Auto-scroll
  setInterval(() => {
    if (isUserScrolling) return;
    currentIndex = (currentIndex + 1) % slides.length;
    scrollToSlide(currentIndex);
  }, 4000);
});