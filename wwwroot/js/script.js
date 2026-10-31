const products = [
  { id: 1, offer: 15, hotDeal: true, dealText: "Fresh deal", name: "Banana", unit: "Fresh & Ripe", price: 0.59, category: "Fruits & Vegetables", emoji: "🍌",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=700&q=85",
    rating: "4.5", reviews: "(128 reviews)", netQty: "1 kg (approx. 6–7 pcs)",
    description: "Fresh, naturally sweet bananas selected for excellent taste and texture. Perfect for breakfast, smoothies, snacks, or baking.",
    highlights: [["Brand", "FreshFarm"], ["Type", "Organic"], ["Variety", "Cavendish"], ["Country of Origin", "India"], ["Storage", "Room temperature"], ["Ingredients", "100% Natural"], ["Shelf Life", "4–5 days"]] },
  { id: 2, offer: 10, hotDeal: false, dealText: "Daily essential", name: "Whole Milk", unit: "1 Gallon", price: 3.49, category: "Dairy & Eggs", emoji: "🥛",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=700&q=85",
    rating: "4.7", reviews: "(94 reviews)", netQty: "3.78 L (1 Gallon)",
    description: "Rich and creamy whole milk made from quality dairy. A versatile everyday essential for your refrigerator.",
    highlights: [["Brand", "DairyPure"], ["Type", "Pasteurized"], ["Fat Content", "3.25%"], ["Country of Origin", "USA"], ["Storage", "Refrigerate below 4°C"], ["Ingredients", "Milk, Vitamin D"], ["Shelf Life", "7 days after opening"], ["Packaging", "Recyclable carton"]] },
  { id: 3, offer: 20, hotDeal: true, dealText: "Bakery deal", name: "Whole Wheat Bread", unit: "1 Loaf", price: 2.99, category: "Bakery", emoji: "🍞",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=85",
    rating: "4.6", reviews: "(76 reviews)", netQty: "400 g",
    description: "Soft, fresh whole wheat bread baked for everyday sandwiches, toast, and breakfast.",
    highlights: [["Brand", "BakeHouse"], ["Type", "Whole wheat"], ["Country of Origin", "USA"], ["Storage", "Cool, dry place"], ["Ingredients", "Whole wheat flour, yeast, salt"], ["Shelf Life", "5 days"], ["Allergens", "Contains gluten"]] },
  { id: 4, offer: 12, hotDeal: false, dealText: "Breakfast pick", name: "Eggs", unit: "12 Count", price: 2.49, category: "Dairy & Eggs", emoji: "🥚",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=700&q=85",
    rating: "4.8", reviews: "(156 reviews)", netQty: "12 pcs (approx. 600 g)",
    description: "Fresh farm eggs with a naturally rich yolk. Great for breakfast, baking, and everyday cooking.",
    highlights: [["Brand", "FarmNest"], ["Type", "Free-range"], ["Grade", "A"], ["Country of Origin", "USA"], ["Storage", "Refrigerate"], ["Shelf Life", "21 days"]] },
  { id: 5, offer: 18, hotDeal: true, dealText: "Hot pick", name: "Tomato", unit: "Fresh & Juicy", price: 1.99, category: "Fruits & Vegetables", emoji: "🍅",
    image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=85",
    rating: "4.4", reviews: "(82 reviews)", netQty: "1 kg",
    description: "Bright, juicy tomatoes with a fresh garden flavor. Ideal for salads, sauces, sandwiches, and cooking.",
    highlights: [["Brand", "FreshFarm"], ["Type", "Vine-ripened"], ["Country of Origin", "India"], ["Storage", "Room temperature"], ["Ingredients", "100% Natural"], ["Shelf Life", "5–6 days"]] },
  { id: 6, offer: 15, hotDeal: false, dealText: "Fruit deal", name: "Apple", unit: "Fresh", price: 1.29, category: "Fruits & Vegetables", emoji: "🍎",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=85",
    rating: "4.7", reviews: "(110 reviews)", netQty: "1 kg",
    description: "Crisp and refreshing apples selected for a naturally sweet flavor and satisfying crunch.",
    highlights: [["Brand", "OrchardFresh"], ["Type", "Royal Gala"], ["Country of Origin", "USA"], ["Storage", "Refrigerate"], ["Ingredients", "100% Natural"], ["Shelf Life", "2–3 weeks"]] },
  { id: 7, offer: 25, hotDeal: true, dealText: "Fresh today", name: "Spinach", unit: "Fresh", price: 1.49, category: "Fruits & Vegetables", emoji: "🥬",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=85",
    rating: "4.5", reviews: "(61 reviews)", netQty: "250 g",
    description: "Fresh leafy spinach, carefully packed to preserve its crisp texture and natural flavor.",
    highlights: [["Brand", "GreenLeaf"], ["Type", "Organic"], ["Country of Origin", "India"], ["Storage", "Refrigerate"], ["Ingredients", "100% Natural"], ["Shelf Life", "3–4 days"]] },
  { id: 8, offer: 10, hotDeal: false, dealText: "Dairy deal", name: "Cheddar Cheese", unit: "8 oz", price: 3.99, category: "Dairy & Eggs", emoji: "🧀",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=85",
    rating: "4.8", reviews: "(73 reviews)", netQty: "227 g (8 oz)",
    description: "Smooth and flavorful cheddar cheese, perfect for sandwiches, burgers, snacks, and cooking.",
    highlights: [["Brand", "DairyPure"], ["Type", "Aged Cheddar"], ["Fat Content", "33%"], ["Country of Origin", "USA"], ["Storage", "Refrigerate"], ["Ingredients", "Milk, salt, enzymes, culture"], ["Shelf Life", "3 weeks after opening"], ["Packaging", "Resealable pack"]] },
  { id: 9, offer: 20, hotDeal: true, dealText: "Value deal", name: "Potato", unit: "Fresh", price: 0.79, category: "Fruits & Vegetables", emoji: "🥔",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=700&q=85",
    rating: "4.6", reviews: "(88 reviews)", netQty: "1 kg",
    description: "Fresh everyday potatoes that are great for roasting, mashing, frying, soups, and curries.",
    highlights: [["Brand", "FreshFarm"], ["Type", "Russet"], ["Country of Origin", "India"], ["Storage", "Cool, dry place"], ["Ingredients", "100% Natural"], ["Shelf Life", "3–4 weeks"]] },
  { id: 10, offer: 15, hotDeal: false, dealText: "Protein pick", name: "Chicken Breast", unit: "1 lb", price: 4.99, category: "Pantry", emoji: "🍗",
    image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=700&q=85",
    rating: "4.6", reviews: "(54 reviews)", netQty: "454 g (1 lb)",
    description: "Tender boneless chicken breast, ideal for quick weekday meals, grilling, roasting, and stir-fry.",
    highlights: [["Brand", "FarmNest"], ["Type", "Boneless, skinless"], ["Protein", "23 g per 100 g"], ["Country of Origin", "USA"], ["Storage", "Refrigerate or freeze"], ["Shelf Life", "2 days refrigerated"], ["Packaging", "Vacuum sealed"]] },
  { id: 11, offer: 12, hotDeal: true, dealText: "Pantry deal", name: "Pasta", unit: "16 oz", price: 1.99, category: "Pantry", emoji: "🍝",
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=700&q=85",
    rating: "4.5", reviews: "(47 reviews)", netQty: "454 g (16 oz)",
    description: "Classic pasta for quick and delicious meals. Pair with your favorite sauce, vegetables, or protein.",
    highlights: [["Brand", "BellaPasta"], ["Type", "Durum wheat semolina"], ["Country of Origin", "Italy"], ["Storage", "Cool, dry place"], ["Ingredients", "Durum wheat semolina, water"], ["Shelf Life", "24 months"]] },
  { id: 12, offer: 20, hotDeal: true, dealText: "Citrus deal", name: "Orange", unit: "Fresh", price: 0.99, category: "Fruits & Vegetables", emoji: "🍊",
    image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=700&q=85",
    rating: "4.7", reviews: "(91 reviews)", netQty: "1 kg",
    description: "Juicy, refreshing oranges packed with natural citrus flavor. Great for snacking or fresh juice.",
    highlights: [["Brand", "OrchardFresh"], ["Type", "Navel"], ["Country of Origin", "South Africa"], ["Storage", "Refrigerate"], ["Ingredients", "100% Natural"], ["Shelf Life", "2 weeks"]] }
];

// Every product has one hero photo; this builds three distinct, guaranteed-valid
// crops of that same photo so the gallery has real thumbnails to swipe through.
function buildGallery(url) {
  const base = url.split("?")[0];
  return [
    `${base}?auto=format&fit=crop&w=700&h=700&q=85`,
    `${base}?auto=format&fit=crop&crop=entropy&w=700&h=860&q=85`,
    `${base}?auto=format&fit=crop&crop=focalpoint&fp-z=1.4&w=700&h=560&q=85`
  ];
}

const HL_ICONS = {
  "brand": "bi-award",
  "type": "bi-tag",
  "variety": "bi-flower1",
  "country of origin": "bi-geo-alt",
  "storage": "bi-thermometer-snow",
  "ingredients": "bi-egg-fried",
  "shelf life": "bi-hourglass-split",
  "fat content": "bi-droplet-half",
  "allergens": "bi-exclamation-triangle",
  "grade": "bi-patch-check",
  "packaging": "bi-box-seam",
  "protein": "bi-lightning-charge"
};
const highlightIcon = (label) => HL_ICONS[label.toLowerCase()] || "bi-info-circle";

let selectedProduct = null;
let quantity = 1;
let cartCount = 0;
let currentImageIndex = 0;
const favorites = new Set();

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const noResults = document.getElementById("noResults");
const cartCountEl = document.getElementById("cartCount");

const modalEl = document.getElementById("productModal");
const modalMain = document.getElementById("modalMain");
const modalTrack = document.getElementById("modalTrack");
const modalDots = document.getElementById("modalDots");
const modalThumbs = document.getElementById("modalThumbs");

const $ = (id) => document.getElementById(id);
const formatPrice = (price) => `$${price.toFixed(2)}`;
const oldPriceOf = (p) => (p.offer ? p.price / (1 - p.offer / 100) : null);

/* ---------------------------
   Product grid
--------------------------- */
function productCard(product) {
  const old = oldPriceOf(product);
  const fav = favorites.has(product.id);

  return `
    <div class="col-6 col-md-3 col-xl-2 product-col">
      <article class="product-card" data-id="${product.id}" tabindex="0" role="button" aria-label="View ${product.name}">
        <div class="product-image-wrap">
          ${product.offer ? `<span class="offer-badge">${product.offer}% OFF</span>` : ""}
          ${product.hotDeal ? `<span class="hot-deal-badge"><i class="bi bi-fire"></i> HOT DEAL</span>` : ""}
          <button class="favorite ${fav ? "active" : ""}" data-fav="${product.id}" aria-label="Save ${product.name}" aria-pressed="${fav}">
            <i class="bi ${fav ? "bi-heart-fill" : "bi-heart"}"></i>
          </button>
          <img class="product-image" src="${product.image}" alt="${product.name}" loading="lazy" data-emoji="${product.emoji}">
        </div>
        <div class="product-info">
          <div class="product-name">${product.name}</div>
          <div class="product-unit">${product.unit}</div>
          <div class="deal-line">${product.dealText ? `<i class="bi bi-lightning-charge-fill"></i> ${product.dealText}` : ""}</div>
          <div class="price-row">
            <span class="product-price">${formatPrice(product.price)}</span>
            ${old ? `<del>${formatPrice(old)}</del>` : ""}
          </div>
          <button class="btn-add-card" data-open="${product.id}" aria-label="Add ${product.name}">
            <span class="bac-icon"><i class="bi bi-plus-lg"></i></span>
            <span class="bac-label">Add</span>
          </button>
        </div>
      </article>
    </div>`;
}

function renderProducts(list = products) {
  resultCount.textContent = `(${list.length})`;
  noResults.classList.toggle("d-none", list.length !== 0);
  productGrid.innerHTML = list.map(productCard).join("");
  guardImages(productGrid);
}

// Swap broken images for the product emoji (replaces the old inline onerror, whose nested quotes broke the HTML)
function guardImages(root) {
  root.querySelectorAll("img.product-image").forEach((img) => {
    const swap = () => {
      const span = document.createElement("span");
      span.className = "fallback-emoji";
      span.textContent = img.dataset.emoji;
      img.replaceWith(span);
    };
    img.addEventListener("error", swap, { once: true });
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) swap();
  });
}

productGrid.addEventListener("click", (e) => {
  const favBtn = e.target.closest("[data-fav]");
  if (favBtn) { toggleFavorite(Number(favBtn.dataset.fav)); return; }

  const openBtn = e.target.closest("[data-open]");
  if (openBtn) { openProduct(Number(openBtn.dataset.open)); return; }

  const card = e.target.closest(".product-card");
  if (card) openProduct(Number(card.dataset.id));
});

productGrid.addEventListener("keydown", (e) => {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("product-card")) {
    e.preventDefault();
    openProduct(Number(e.target.dataset.id));
  }
});

/* ---------------------------
   Favorites
--------------------------- */
function toggleFavorite(id) {
  favorites.has(id) ? favorites.delete(id) : favorites.add(id);
  syncFavorites();
}

function syncFavorites() {
  document.querySelectorAll("[data-fav]").forEach((btn) => {
    const on = favorites.has(Number(btn.dataset.fav));
    btn.classList.toggle("active", on);
    btn.setAttribute("aria-pressed", on);
    btn.querySelector("i").className = on ? "bi bi-heart-fill" : "bi bi-heart";
  });

  if (selectedProduct) {
    const on = favorites.has(selectedProduct.id);
    $("modalFav").classList.toggle("active", on);
    $("modalFav").querySelector("i").className = on ? "bi bi-heart-fill" : "bi bi-heart";
  }
}

$("modalFav").addEventListener("click", () => {
  if (selectedProduct) toggleFavorite(selectedProduct.id);
});

/* ---------------------------
   Product modal
--------------------------- */
function openProduct(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;

  selectedProduct = p;
  quantity = 1;
  const old = oldPriceOf(p);

  renderGallery(p);

  // Text
  $("modalCategory").textContent = p.category;
  $("modalName").textContent = p.name;
  $("modalUnit").textContent = p.unit;
  $("modalNetQty").textContent = p.netQty;
  $("modalRating").textContent = p.rating;
  $("modalReviews").textContent = p.reviews;
  $("modalDescription").textContent = p.description;
  $("modalStars").style.width = `${(parseFloat(p.rating) / 5) * 100}%`;

  // Price + savings
  $("modalPrice").innerHTML =
    `<span class="pm-now">${formatPrice(p.price)}</span>${old ? `<del>${formatPrice(old)}</del>` : ""}`;
  $("modalSave").textContent = old ? `You save ${formatPrice(old - p.price)}` : "";

  // Image badges
  $("modalOffer").textContent = p.offer ? `${p.offer}% OFF` : "";
  $("modalHot").innerHTML = p.hotDeal ? `<i class="bi bi-fire"></i> ${p.dealText}` : "";

  renderHighlights(p);
  updateQuantityUI();
  syncFavorites();

  // Restart the entrance animation (also when swapping between products)
  modalEl.querySelector(".pm-body").scrollTop = 0;
  modalEl.querySelectorAll(".pm-info").forEach((el) => {
    el.classList.remove("swap");
    void el.offsetWidth;
    el.classList.add("swap");
  });

  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

/* ---------------------------
   Image gallery — draggable track (mouse + touch) with dots and thumbnails
--------------------------- */
function renderGallery(product) {
  currentImageIndex = 0;
  const images = buildGallery(product.image);
  product.images = images;

  modalTrack.style.transition = "none";
  modalTrack.innerHTML = images.map(() => `
    <div class="pm-slide">
      <img src="" alt="${product.name}">
      <span class="pm-emoji">${product.emoji}</span>
    </div>`).join("");

  modalTrack.querySelectorAll(".pm-slide img").forEach((img, i) => {
    const slide = img.closest(".pm-slide");
    img.onerror = () => slide.classList.add("no-img");
    img.src = images[i];
  });

  modalDots.innerHTML = images.map((_, i) => `
    <button type="button" class="pm-dot ${i === 0 ? "active" : ""}" data-idx="${i}" aria-label="Go to image ${i + 1}"></button>`).join("");
  modalDots.querySelectorAll(".pm-dot").forEach((dot) => {
    dot.addEventListener("click", () => { currentImageIndex = Number(dot.dataset.idx); setMainImage(); });
  });

  modalThumbs.innerHTML = images.map((src, i) => `
    <button type="button" class="pm-thumb ${i === 0 ? "active" : ""}" data-idx="${i}" aria-label="Image ${i + 1} of ${product.name}">
      <img src="${src}" alt="">
    </button>`).join("");
  modalThumbs.querySelectorAll(".pm-thumb").forEach((btn) => {
    btn.addEventListener("click", () => { currentImageIndex = Number(btn.dataset.idx); setMainImage(); });
  });

  requestAnimationFrame(() => { modalTrack.style.transition = ""; });
  setMainImage();
}

function setMainImage() {
  if (!selectedProduct?.images) return;

  modalTrack.style.transform = `translateX(${-currentImageIndex * 100}%)`;

  modalDots.querySelectorAll(".pm-dot").forEach((d, i) => d.classList.toggle("active", i === currentImageIndex));
  modalThumbs.querySelectorAll(".pm-thumb").forEach((t, i) => t.classList.toggle("active", i === currentImageIndex));
  modalThumbs.querySelector(".pm-thumb.active")?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
}

function stepImage(dir) {
  if (!selectedProduct?.images) return;
  const total = selectedProduct.images.length;
  currentImageIndex = (currentImageIndex + dir + total) % total;
  setMainImage();
}

// Drag/swipe the track itself — works the same for mouse, touch and pen
let dragStartX = 0;
let dragDeltaX = 0;
let isDragging = false;

modalTrack.addEventListener("pointerdown", (e) => {
  if (!selectedProduct?.images?.length) return;
  isDragging = true;
  dragStartX = e.clientX;
  dragDeltaX = 0;
  modalTrack.classList.add("dragging");
  modalTrack.setPointerCapture(e.pointerId);
});

modalTrack.addEventListener("pointermove", (e) => {
  if (!isDragging) return;
  dragDeltaX = e.clientX - dragStartX;
  const percent = (dragDeltaX / modalMain.clientWidth) * 100;
  modalTrack.style.transform = `translateX(${-currentImageIndex * 100 + percent}%)`;
});

function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  modalTrack.classList.remove("dragging");

  const threshold = modalMain.clientWidth * 0.18;
  if (Math.abs(dragDeltaX) > threshold) {
    stepImage(dragDeltaX < 0 ? 1 : -1);
  } else {
    setMainImage();
  }
  dragDeltaX = 0;
}
modalTrack.addEventListener("pointerup", endDrag);
modalTrack.addEventListener("pointercancel", endDrag);

/* ---------------------------
   Highlights (contained expand/scroll, never resizes the modal)
--------------------------- */
function renderHighlights(product) {
  const wrap = $("modalHighlights");
  const rows = product.highlights || [];
  const threshold = 5;
  const many = rows.length > threshold;

  wrap.innerHTML = `
    <div class="pm-hl-table ${many ? "collapsed" : ""}" id="hlTable">
      ${rows.map(([label, value]) => `
        <div class="pm-hl-row">
          <div class="pm-hl-key"><i class="bi ${highlightIcon(label)}"></i>${label}</div>
          <div class="pm-hl-val">${value}</div>
        </div>`).join("")}
    </div>
    ${many ? `<button type="button" class="pm-hl-toggle" id="hlToggle">View all details <i class="bi bi-chevron-down"></i></button>` : ""}
  `;

  const toggle = $("hlToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const table = $("hlTable");
      const expanded = table.classList.toggle("expanded");
      table.classList.toggle("collapsed", !expanded);
      toggle.innerHTML = expanded
        ? 'Show less <i class="bi bi-chevron-up"></i>'
        : 'View all details <i class="bi bi-chevron-down"></i>';
    });
  }
}

function changeQuantity(amount) {
  quantity = Math.min(20, Math.max(1, quantity + amount));
  updateQuantityUI(true);
}

function updateQuantityUI(animate = false) {
  const q = $("quantity");
  q.textContent = quantity;
  $("modalTotal").textContent = selectedProduct ? formatPrice(selectedProduct.price * quantity) : "$0.00";

  if (animate) {
    q.classList.remove("bump");
    void q.offsetWidth;
    q.classList.add("bump");
  }
}

function addFromModal() {
  if (!selectedProduct) return;

  cartCount += quantity;
  updateCart();
  showToast(`${quantity} × ${selectedProduct.name} added to cart`);

  bootstrap.Modal.getInstance(modalEl)?.hide();
}

/* ---------------------------
   Cart + toast
--------------------------- */
function updateCart() {
  cartCountEl.textContent = cartCount;
  cartCountEl.style.display = cartCount > 0 ? "grid" : "none";
  cartCountEl.classList.remove("bump");
  void cartCountEl.offsetWidth;
  cartCountEl.classList.add("bump");
}

function showToast(message) {
  const toast = $("toast");
  toast.querySelector("span").textContent = message;
  toast.classList.add("show");

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------------------------
   Filters
--------------------------- */
function filterProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const activeCategory = document.querySelector(".category-card.active")?.dataset.category || "all";

  const filtered = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search) ||
      product.category.toLowerCase().includes(search);
    const matchesCategory = activeCategory === "all" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  renderProducts(filtered);
}

document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".category-card").forEach((c) => c.classList.remove("active"));
    card.classList.add("active");
    filterProducts();
  });
});

searchInput.addEventListener("input", filterProducts);

function resetFilters() {
  searchInput.value = "";
  document.querySelectorAll(".category-card").forEach((c) => c.classList.remove("active"));
  document.querySelector('[data-category="all"]').classList.add("active");
  renderProducts();
}

// "View All" now expands the category row into a wrapped grid (and collapses it again)
function showAllCategories() {
  const scroller = document.querySelector(".category-scroller");
  const expanded = scroller.classList.toggle("expanded");
  const btn = $("categoriesToggle");
  btn.querySelector("span").textContent = expanded ? "Show less" : "View All";
  btn.querySelector("i").className = expanded ? "bi bi-chevron-up" : "bi bi-grid";
  scroller.scrollTo({ left: 0 });
}

/* ---------------------------
   Dark mode
--------------------------- */
const themeToggle = $("themeToggle");
let savedTheme = null;
try { savedTheme = localStorage.getItem("grocery-theme"); } catch (e) {}

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (savedTheme ? savedTheme === "dark" : prefersDark) document.body.classList.add("dark-mode");

function updateThemeIcon() {
  if (!themeToggle) return;
  themeToggle.innerHTML = document.body.classList.contains("dark-mode")
    ? '<i class="bi bi-sun"></i>'
    : '<i class="bi bi-moon-stars"></i>';
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  try {
    localStorage.setItem("grocery-theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
  } catch (e) {}
  updateThemeIcon();
});

/* ---------------------------
   Init
--------------------------- */
renderProducts();
updateCart();
updateThemeIcon();
