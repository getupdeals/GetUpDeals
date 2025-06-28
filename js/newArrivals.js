document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  if (params.get("section") !== "new") return;
  
  fetch("./data/products.json")
    .then(res => res.json())
    .then(products => {
      const filtered = products
        .filter(p => p.tags?.includes("new"))
        .sort(() => 0.5 - Math.random());
      
      renderViewAllList(filtered);
    });
});