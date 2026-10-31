const $ = (id) => document.getElementById(id);

  /* ---------- Dark mode (same key as every other page) ---------- */
  const themeToggle = $('themeToggle');
  let savedTheme = null;
  try { savedTheme = localStorage.getItem('grocery-theme'); } catch (e) {}
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme ? savedTheme === 'dark' : prefersDark) document.body.classList.add('dark-mode');

  function updateThemeIcon() {
    themeToggle.innerHTML = document.body.classList.contains('dark-mode')
      ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
  }
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    try { localStorage.setItem('grocery-theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light'); } catch (e) {}
    updateThemeIcon();
  });
  updateThemeIcon();

  /* ---------- Config + data ---------- */
  const CURRENCY = '₹';          // change to '$' to match the homepage prices
  const DELIVERY_FEE = 15;
  const HANDLING = 6;
  const TOTAL_SECONDS = 600;
  const money = (n) => CURRENCY + n;

  const DEFAULT_ITEMS = [
    { id: 'tomato', name: 'Fresh tomatoes', meta: '500 g pack', price: 42, qty: 2, emoji: '🍅' },
    { id: 'milk', name: 'Toned milk', meta: '1 L carton', price: 58, qty: 1, emoji: '🥛' },
    { id: 'bread', name: 'Multigrain bread', meta: '400 g loaf', price: 120, was: 140, qty: 1, emoji: '🍞' }
  ];
  const ADDONS = [
    { id: 'eggs', name: 'Eggs (6)', meta: 'Pack of 6', price: 48, emoji: '🥚' },
    { id: 'banana', name: 'Bananas', meta: '6 pcs', price: 35, emoji: '🍌' },
    { id: 'coffee', name: 'Coffee 100g', meta: '100 g jar', price: 165, emoji: '☕' },
    { id: 'cheese', name: 'Cheese slices', meta: '200 g pack', price: 99, emoji: '🧀' }
  ];

  let cart = DEFAULT_ITEMS.map((i) => ({ ...i }));
  let fromReorder = false;
  try {
    const raw = localStorage.getItem('grocery-reorder');   // set by the Order history page
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) { cart = parsed; fromReorder = true; }
      localStorage.removeItem('grocery-reorder');
    }
  } catch (e) {}

  /* ---------- Rendering ---------- */
  function itemCard(it, extraClass = '') {
    return `
      <div class="item-card ${extraClass}" data-id="${it.id}">
        <div class="item-thumb">${it.emoji}</div>
        <div class="item-info">
          <div class="item-top">
            <div>
              <p class="item-name">${it.name}</p>
              <p class="item-meta">${it.meta ? it.meta + ' · ' : ''}${money(it.price)} each</p>
            </div>
            <button class="remove-btn" data-remove aria-label="Remove ${it.name}"><i class="bi bi-trash3"></i></button>
          </div>
          <div class="item-row">
            <div class="item-price">${priceHtml(it)}</div>
            <div class="stepper">
              <button data-dec aria-label="Decrease quantity">−</button>
              <span class="qty">${it.qty}</span>
              <button data-inc aria-label="Increase quantity">+</button>
            </div>
          </div>
        </div>
      </div>`;
  }
  const priceHtml = (it) => `${money(it.price * it.qty)}${it.was ? `<span class="was">${money(it.was * it.qty)}</span>` : ''}`;

  function renderItems() { $('cartItems').innerHTML = cart.map((i) => itemCard(i)).join(''); }

  function renderAddons() {
    $('addonList').innerHTML = ADDONS.map((a) => `
      <div class="addon-card">
        <div class="addon-thumb">${a.emoji}</div>
        <p class="addon-name">${a.name}</p>
        <p class="addon-price">${money(a.price)}</p>
        <button class="addon-add" data-addon="${a.id}"><i class="bi bi-plus-lg"></i> Add</button>
      </div>`).join('');
  }

  function syncEmpty() {
    $('emptyState').classList.toggle('show', cart.length === 0);
  }

  function recalc() {
    let subtotal = 0, count = 0, savings = 0;
    cart.forEach((i) => {
      subtotal += i.price * i.qty;
      count += i.qty;
      if (i.was) savings += (i.was - i.price) * i.qty;
    });
    const has = count > 0;
    const total = subtotal + (has ? DELIVERY_FEE + HANDLING : 0);

    $('billSubtotal').textContent = money(subtotal);
    $('billDelivery').textContent = money(has ? DELIVERY_FEE : 0);
    $('billHandling').textContent = money(has ? HANDLING : 0);
    $('billTotal').textContent = money(total);
    $('stickyTotal').textContent = money(total);
    $('stickyCount').textContent = count;
    $('modalTotal').textContent = money(total);
    $('itemCountLabel').textContent = has ? `${count} item${count > 1 ? 's' : ''}` : 'Empty';

    $('savingsChip').classList.toggle('show', savings > 0);
    $('savingsText').textContent = `You're saving ${money(savings)} on this order`;

    $('placeOrderDesktop').disabled = !has;
    $('placeOrderMobile').disabled = !has;

    const badge = $('navCartCount');
    badge.textContent = count;
    badge.style.display = has ? 'grid' : 'none';
    badge.classList.remove('bump'); void badge.offsetWidth; badge.classList.add('bump');
  }

  /* ---------- Cart actions ---------- */
  const cardEl = (id) => $('cartItems').querySelector(`[data-id="${id}"]`);

  function updateCard(id) {
    const it = cart.find((i) => i.id === id), card = cardEl(id);
    if (!it || !card) return;
    const q = card.querySelector('.qty');
    q.textContent = it.qty;
    q.classList.remove('bump'); void q.offsetWidth; q.classList.add('bump');
    card.querySelector('.item-price').innerHTML = priceHtml(it);
  }

  function changeQty(id, delta) {
    const it = cart.find((i) => i.id === id);
    if (!it) return;
    if (it.qty + delta < 1) return removeItem(id);
    it.qty += delta;
    updateCard(id);
    recalc();
  }

  function removeItem(id) {
    const card = cardEl(id);
    cart = cart.filter((i) => i.id !== id);
    recalc();
    if (!card) return syncEmpty();
    card.style.maxHeight = card.offsetHeight + 'px';
    requestAnimationFrame(() => { card.classList.add('removing'); card.style.maxHeight = '0px'; });
    setTimeout(() => { card.remove(); syncEmpty(); }, 320);
  }

  function addAddon(id, btn) {
    const a = ADDONS.find((x) => x.id === id);
    const existing = cart.find((i) => i.id === id);
    if (existing) {
      existing.qty += 1;
      updateCard(id);
    } else {
      const item = { ...a, qty: 1 };
      cart.push(item);
      $('cartItems').insertAdjacentHTML('beforeend', itemCard(item, 'enter'));
    }
    syncEmpty();
    recalc();
    showToast(`${a.name} added to cart`);

    btn.classList.add('added');
    btn.innerHTML = '<i class="bi bi-check-lg"></i> Added';
    clearTimeout(btn._t);
    btn._t = setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = '<i class="bi bi-plus-lg"></i> Add'; }, 1100);
  }

  $('cartItems').addEventListener('click', (e) => {
    const card = e.target.closest('.item-card');
    if (!card) return;
    const id = card.dataset.id;
    if (e.target.closest('[data-inc]')) changeQty(id, 1);
    else if (e.target.closest('[data-dec]')) changeQty(id, -1);
    else if (e.target.closest('[data-remove]')) removeItem(id);
  });

  $('addonList').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-addon]');
    if (btn) addAddon(btn.dataset.addon, btn);
  });

  function showToast(message) {
    const toast = $('toast');
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- Countdown ring ---------- */
  const RING = 2 * Math.PI * 36;
  const etaBar = $('etaBar'), etaClock = $('etaClock');
  let secondsLeft = TOTAL_SECONDS;
  function tick() {
    const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
    const s = String(secondsLeft % 60).padStart(2, '0');
    etaClock.textContent = `${m}:${s}`;
    etaBar.style.strokeDashoffset = RING * (1 - secondsLeft / TOTAL_SECONDS);
  }
  tick();
  setInterval(() => { if (secondsLeft > 0) { secondsLeft--; tick(); } }, 1000);

  /* ---------- Delivery details (prefilled from the profile page when available) ---------- */
  let profile = {};
  try { profile = JSON.parse(localStorage.getItem('grocery-profile')) || {}; } catch (e) {}
  $('nameDisplay').textContent = profile.name || 'Aarav Mehta';
  $('addressDisplay').textContent = $('addressInput').value = '204, Lakeview Apartments, 5th Cross, Singanallur, Coimbatore – 641005';
  $('phoneDisplay').textContent = $('phoneInput').value = profile.phone || '+91 98765 43210';

  function isEditing(field) { return !$(field + 'Input').classList.contains('d-none'); }

  function toggleEdit(field) {
    if (isEditing(field)) return commitEdit(field);
    $(field + 'Display').classList.add('d-none');
    const input = $(field + 'Input');
    input.classList.remove('d-none');
    input.focus();
    input.select();
    const btn = $(field + 'Btn');
    btn.classList.add('editing');
    btn.innerHTML = '<i class="bi bi-check-lg"></i>';
    btn.setAttribute('aria-label', 'Save ' + field);
  }

  function commitEdit(field) {
    if (!isEditing(field)) return;
    const display = $(field + 'Display'), input = $(field + 'Input'), btn = $(field + 'Btn');
    const value = input.value.trim();
    if (value) display.textContent = value; else input.value = display.textContent;
    input.classList.add('d-none');
    display.classList.remove('d-none');
    btn.classList.remove('editing');
    btn.innerHTML = '<i class="bi bi-pencil"></i>';
    btn.setAttribute('aria-label', 'Edit ' + field);
  }

  ['address', 'phone'].forEach((field) => {
    $(field + 'Input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); commitEdit(field); }
    });
  });

  function confirmOrder() {
    commitEdit('address');
    commitEdit('phone');
    $('deliveryFormView').classList.add('d-none');
    $('modalFooterView').classList.add('d-none');
    $('orderSuccessView').classList.remove('d-none');
    setTimeout(() => bootstrap.Modal.getOrCreateInstance($('deliveryModal')).hide(), 1900);
  }

  $('deliveryModal').addEventListener('hidden.bs.modal', () => {
    $('orderSuccessView').classList.add('d-none');
    $('deliveryFormView').classList.remove('d-none');
    $('modalFooterView').classList.remove('d-none');
  });

  /* ---------- Init ---------- */
  renderItems();
  renderAddons();
  syncEmpty();
  recalc();
  if (fromReorder) showToast('Items from your past order are in the cart');
