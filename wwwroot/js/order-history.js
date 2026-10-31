const $ = (id) => document.getElementById(id);
  const money = (n) => '₹' + n;

  /* ---------- Dark mode (same key as cart page) ---------- */
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

  /* ---------- Sample orders ---------- */
  const orders = [
    {
      id: 'Q10238',
      date: '27 Sep, 8:42 PM',
      status: 'delivered',
      items: [
        { name: 'Fresh tomatoes', qty: 2, price: 42, emoji: '🍅' },
        { name: 'Toned milk', qty: 1, price: 58, emoji: '🥛' },
        { name: 'Multigrain bread', qty: 1, price: 120, emoji: '🍞' }
      ],
      deliveryFee: 15, handling: 6,
      address: '204, Lakeview Apartments, 5th Cross, Singanallur, Coimbatore – 641005',
      payment: 'UPI · Paid via Google Pay'
    },
    {
      id: 'Q10221',
      date: '25 Sep, 6:10 PM',
      status: 'delivered',
      items: [
        { name: 'Bananas', qty: 1, price: 35, emoji: '🍌' },
        { name: 'Eggs (6)', qty: 2, price: 48, emoji: '🥚' }
      ],
      deliveryFee: 15, handling: 6,
      address: '204, Lakeview Apartments, 5th Cross, Singanallur, Coimbatore – 641005',
      payment: 'Cash on delivery'
    },
    {
      id: 'Q10199',
      date: '22 Sep, 1:05 PM',
      status: 'onway',
      items: [
        { name: 'Coffee 100g', qty: 1, price: 165, emoji: '☕' },
        { name: 'Cheese slices', qty: 1, price: 99, emoji: '🧀' },
        { name: 'Toned milk', qty: 2, price: 58, emoji: '🥛' }
      ],
      deliveryFee: 15, handling: 6,
      address: '12, Green Park Residency, Race Course Road, Coimbatore – 641018',
      payment: 'UPI · Paid via PhonePe'
    },
    {
      id: 'Q10176',
      date: '19 Sep, 9:30 AM',
      status: 'cancelled',
      items: [
        { name: 'Multigrain bread', qty: 1, price: 120, emoji: '🍞' }
      ],
      deliveryFee: 0, handling: 0,
      address: '204, Lakeview Apartments, 5th Cross, Singanallur, Coimbatore – 641005',
      payment: 'UPI · Refunded to Google Pay'
    },
    {
      id: 'Q10142',
      date: '14 Sep, 7:52 PM',
      status: 'delivered',
      items: [
        { name: 'Fresh tomatoes', qty: 1, price: 42, emoji: '🍅' },
        { name: 'Bananas', qty: 2, price: 35, emoji: '🍌' },
        { name: 'Eggs (6)', qty: 1, price: 48, emoji: '🥚' }
      ],
      deliveryFee: 15, handling: 6,
      address: '204, Lakeview Apartments, 5th Cross, Singanallur, Coimbatore – 641005',
      payment: 'UPI · Paid via Google Pay'
    }
  ];

  const statusMeta = {
    delivered: { label: 'Delivered', cls: 'status-delivered' },
    onway: { label: 'On the way', cls: 'status-onway' },
    cancelled: { label: 'Cancelled', cls: 'status-cancelled' }
  };

  function orderTotal(order) {
    const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
    return subtotal + order.deliveryFee + order.handling;
  }
  const itemSummary = (order) => order.items.map((i) => i.name).join(', ');

  /* ---------- Render list ---------- */
  function renderList() {
    const list = $('orderList');
    const has = orders.length > 0;
    $('orderCountLabel').textContent = `${orders.length} order${orders.length !== 1 ? 's' : ''}`;
    $('emptyState').classList.toggle('show', !has);
    list.style.display = has ? 'flex' : 'none';

    list.innerHTML = orders.map((order, idx) => {
      const meta = statusMeta[order.status];
      const thumbs = order.items.slice(0, 3).map((i) => `<span>${i.emoji}</span>`).join('');
      return `
        <div class="order-card" onclick="openOrder(${idx})">
          <div class="item-thumb-stack">${thumbs}</div>
          <div class="order-info">
            <div class="order-id-row">
              <span class="order-id">#${order.id}</span>
              <span class="order-date">${order.date}</span>
            </div>
            <div class="order-summary">${itemSummary(order)}</div>
          </div>
          <div class="order-right">
            <div class="order-total">${money(orderTotal(order))}</div>
            <span class="status-pill ${meta.cls}">${meta.label}</span>
          </div>
        </div>`;
    }).join('');

    // initial cart badge (kept in sync with other pages)
    updateCartBadge();
  }

  function updateCartBadge() {
    let count = 0;
    try {
      const raw = localStorage.getItem('grocery-cart');
      if (raw) {
        const cart = JSON.parse(raw);
        count = cart.reduce((s, i) => s + (i.qty || 1), 0);
      }
    } catch (e) {}
    const badge = $('navCartCount');
    badge.textContent = count;
    badge.style.display = count > 0 ? 'grid' : 'none';
  }

  /* ---------- Timeline ---------- */
  function buildTimeline(status) {
    const steps = ['Placed', 'Packed', 'Out for delivery', 'Delivered'];
    if (status === 'cancelled') {
      return `
        <div class="tl-step done"><div class="tl-dot">✓</div><div class="tl-label">Placed</div></div>
        <div class="tl-step cancelled"><div class="tl-dot">✕</div><div class="tl-label">Cancelled</div></div>`;
    }
    const doneCount = status === 'delivered' ? 4 : status === 'onway' ? 3 : 1;
    return steps.map((label, i) => {
      const done = i < doneCount;
      return `<div class="tl-step ${done ? 'done' : ''}"><div class="tl-dot">${done ? '✓' : ''}</div><div class="tl-label">${label}</div></div>`;
    }).join('');
  }

  /* ---------- Modal ---------- */
  let currentOrderIdx = null;

  function openOrder(idx) {
    currentOrderIdx = idx;
    const order = orders[idx];
    $('modalOrderId').textContent = `Order #${order.id}`;
    $('modalOrderDate').textContent = order.date;
    $('modalTimeline').innerHTML = buildTimeline(order.status);

    $('modalItems').innerHTML = order.items.map((i) => `
      <div class="detail-line-item">
        <div class="dli-thumb">${i.emoji}</div>
        <div class="dli-info">
          <div class="dli-name">${i.name}</div>
          <div class="dli-qty">Qty ${i.qty}</div>
        </div>
        <div class="dli-price">${money(i.price * i.qty)}</div>
      </div>`).join('');

    const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
    $('modalSubtotal').textContent = money(subtotal);
    $('modalDeliveryFee').textContent = money(order.deliveryFee);
    $('modalHandling').textContent = money(order.handling);
    $('modalTotal').textContent = money(orderTotal(order));
    $('modalAddress').textContent = order.address;
    $('modalPayment').textContent = order.payment;

    bootstrap.Modal.getOrCreateInstance($('orderModal')).show();
  }

  /* ---------- Reorder (sends items to cart page via localStorage) ---------- */
  function reorderFromModal() {
    if (currentOrderIdx === null) return;
    const order = orders[currentOrderIdx];
    const items = order.items.map((i) => ({
      id: i.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: i.name,
      meta: '',
      price: i.price,
      qty: i.qty,
      emoji: i.emoji
    }));
    try {
      localStorage.setItem('grocery-reorder', JSON.stringify(items));
    } catch (e) {}

    // show toast then go to cart
    showToast('Items added to your cart');
    setTimeout(() => { window.location.href = 'cart.html'; }, 900);
  }

  /* ---------- Toast ---------- */
  function showToast(message) {
    const toast = $('toast');
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  /* ---------- Init ---------- */
  renderList();
