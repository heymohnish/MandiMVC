const $ = (id) => document.getElementById(id);
  const money = (n) => `₹${Math.round(n)}`;

  /* ---------- Dark mode ---------- */
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

  /* ============================================================
     FIX 5: proper body scroll lock (desktop + iOS)
     ============================================================ */
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (isIOS) document.body.classList.add('is-ios');

  let savedScrollY = 0;

  function lockBodyScroll() {
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.classList.add('modal-open');
    if (isIOS) {
      // iOS needs position:fixed to actually freeze the background
      document.body.style.top = `-${savedScrollY}px`;
    }
  }

  function unlockBodyScroll() {
    document.body.classList.remove('modal-open');
    document.body.style.top = '';
    if (isIOS) {
      // restore exact scroll position after un-fixing the body
      window.scrollTo(0, savedScrollY);
    }
  }

  /* ---------- Delivery details ---------- */
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
    input.focus(); input.select();
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

  /* ---------- Order constants ---------- */
  const ITEM_SUBTOTAL = 482;
  const DELIVERY_FEE = 15;
  const HANDLING = 6;

  /* ---------- Coupons ---------- */
  const coupons = [
    { id: 'fresh25',   code: 'FRESH25',    title: '25% off fruits & veggies', emoji: '🥬', type: 'percent', value: 25, maxDiscount: 100, minOrder: 299, expiry: '15 Oct', tag: null },
    { id: 'flat50',    code: 'FLAT50',     title: 'Flat ₹50 off your order',  emoji: '💸', type: 'flat',    value: 50, minOrder: 199, expiry: '20 Oct', tag: null },
    { id: 'freedel',   code: 'FREEDEL',    title: 'Zero delivery fee',        emoji: '🛵', type: 'freedel', value: 0,  minOrder: 149, expiry: '31 Oct', tag: null },
    { id: 'welcome100',code: 'WELCOME100', title: 'Flat ₹100 off — first order', emoji: '🎉', type: 'flat', value: 100, minOrder: 499, expiry: '30 Nov', tag: 'New here' },
    { id: 'save15',    code: 'SAVE15',     title: '15% off daily essentials', emoji: '🛒', type: 'percent', value: 15, maxDiscount: 60, minOrder: 249, expiry: '18 Oct', tag: null },
    { id: 'weekend30', code: 'WEEKEND30',  title: '30% off this weekend',     emoji: '🎈', type: 'percent', value: 30, maxDiscount: 150, minOrder: 399, expiry: '5 Oct', tag: 'Expiring soon' }
  ];

  const sheet = $('couponSheet');
  const backdrop = $('sheetBackdrop');
  const listEl = $('couponList');
  const searchInput = $('couponSearch');
  const applyBtn = $('applySelectedBtn');

  let appliedId = null;
  let selectedId = null;

  /* ---------- Helpers ---------- */
  const isEligible = (c) => ITEM_SUBTOTAL >= c.minOrder;

  function discountFor(c) {
    if (c.type === 'percent') return Math.min(Math.round(ITEM_SUBTOTAL * c.value / 100), c.maxDiscount ?? Infinity);
    if (c.type === 'flat') return c.value;
    return 0;
  }
  function savingsFor(c) { return c.type === 'freedel' ? DELIVERY_FEE : discountFor(c); }

  const eligibleCoupons = coupons.filter(isEligible);
  const bestId = eligibleCoupons.length
    ? eligibleCoupons.reduce((a, b) => (savingsFor(b) > savingsFor(a) ? b : a)).id
    : null;
  const maxSaving = eligibleCoupons.length ? Math.max(...eligibleCoupons.map(savingsFor)) : 0;

  /* ---------- Modal list rendering ---------- */
  function itemHTML(c) {
    const eligible = isEligible(c);
    const selected = selectedId === c.id;
    const disc = c.type === 'percent' ? `${c.value}%` : c.type === 'flat' ? money(c.value) : 'FREE';
    const off = c.type === 'freedel' ? 'DELIVERY' : 'OFF';

    let badge = '';
    if (c.id === bestId) badge = '<span class="ci-badge best">Best value</span>';
    else if (c.tag) badge = `<span class="ci-badge">${c.tag}</span>`;

    const warn = eligible ? '' : `<span class="ci-warn">Add ${money(c.minOrder - ITEM_SUBTOTAL)} more</span>`;

    return `
      <div class="coupon-item ${selected ? 'selected' : ''} ${eligible ? '' : 'locked'}"
           data-id="${c.id}" role="button" tabindex="${eligible ? '0' : '-1'}"
           aria-pressed="${selected}" aria-disabled="${!eligible}">
        <span class="ci-check"><i class="bi bi-check-lg"></i></span>
        <span class="ci-emoji">${c.emoji}</span>
        <span class="ci-body">
          <span class="ci-code">${c.code}
            <button type="button" class="ci-copy" data-copy="${c.code}" aria-label="Copy code ${c.code}"><i class="bi bi-copy"></i></button>
          </span>${badge}
          <span class="ci-title">${c.title}</span>
          <span class="ci-meta">
            <span><i class="bi bi-bag-check"></i> Min ${money(c.minOrder)}</span>
            <span><i class="bi bi-calendar-event"></i> Till ${c.expiry}</span>
            ${warn}
          </span>
        </span>
        <span class="ci-right">
          <span class="ci-disc">${disc}</span>
          <span class="ci-off">${off}</span>
        </span>
      </div>`;
  }

  function renderList() {
    const q = (searchInput.value || '').trim().toLowerCase();
    const filtered = coupons.filter(
      (c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    );
    listEl.innerHTML = filtered.map(itemHTML).join('');
    $('noCoupons').classList.toggle('show', filtered.length === 0);
  }

  function updateFoot() {
    const c = coupons.find((x) => x.id === selectedId);
    if (!c) {
      $('footLabel').textContent = 'Select a coupon to apply';
      $('footValue').textContent = '—';
      applyBtn.disabled = true;
      return;
    }
    $('footLabel').textContent = `${c.code} selected`;
    $('footValue').textContent = `Save ${money(savingsFor(c))}`;
    applyBtn.disabled = false;
  }

  /* ---------- Open / close (uses lockBodyScroll/unlockBodyScroll) ---------- */
  function openSheet() {
    selectedId = appliedId;
    searchInput.value = '';
    renderList();
    updateFoot();
    backdrop.classList.add('show');
    sheet.classList.add('show');
    sheet.setAttribute('aria-hidden', 'false');
    lockBodyScroll();                                  // ← replaces overflow:hidden
    setTimeout(() => { if (window.innerWidth >= 576) searchInput.focus(); }, 320);
  }

  function closeSheet() {
    backdrop.classList.remove('show');
    sheet.classList.remove('show');
    sheet.setAttribute('aria-hidden', 'true');
    unlockBodyScroll();                                // ← replaces overflow:''
  }

  /* ---------- Apply / remove ---------- */
  function applySelected() {
    if (!selectedId) return;
    const c = coupons.find((x) => x.id === selectedId);
    if (!c || !isEligible(c)) return;

    const changed = appliedId !== c.id;
    appliedId = c.id;
    closeSheet();
    renderWallet(changed);
    recalc();

    if (changed) {
      showToast(c.type === 'freedel'
        ? `${c.code} applied — delivery is free!`
        : `${c.code} applied — you saved ${money(savingsFor(c))}!`);
    }
  }

  function removeCoupon() {
    const c = coupons.find((x) => x.id === appliedId);
    appliedId = null;
    renderWallet(false);
    recalc();
    showToast(c ? `${c.code} removed` : 'Coupon removed');
  }

  /* ---------- Wallet card ---------- */
  function renderWallet(animate) {
    const c = coupons.find((x) => x.id === appliedId);
    const wallet = $('wallet');

    if (!c) {
      wallet.classList.add('is-empty');
      $('walletEmpty').classList.remove('d-none');
      $('walletApplied').classList.add('d-none');
      return;
    }

    wallet.classList.remove('is-empty');
    $('walletEmpty').classList.add('d-none');
    $('walletApplied').classList.remove('d-none');

    $('stubEmoji').textContent = c.emoji;
    $('stubAmount').textContent = money(savingsFor(c));
    $('ticketCode').textContent = c.code;
    $('ticketTitle').textContent = c.title;
    $('ticketNote').textContent = c.type === 'freedel'
      ? 'Delivery fee waived on this order'
      : `Instant discount of ${money(discountFor(c))} applied`;

    const ticket = $('appliedTicket');
    if (animate) {
      ticket.classList.remove('pop');
      void ticket.offsetWidth;
      ticket.classList.add('pop');
      setTimeout(() => burstConfetti(ticket), 80);
    }
  }

  /* ---------- Bill ---------- */
  function flashBillRows() {
    document.querySelectorAll('.bill-row').forEach((row) => {
      row.classList.remove('flash');
      void row.offsetWidth;
      row.classList.add('flash');
    });
  }

  function recalc(animate = true) {
    const c = coupons.find((x) => x.id === appliedId);
    const freeDel = !!c && c.type === 'freedel';
    const delivery = freeDel ? 0 : DELIVERY_FEE;
    const discount = c ? discountFor(c) : 0;
    const total = Math.max(0, ITEM_SUBTOTAL - discount + delivery + HANDLING);

    $('billSubtotal').textContent = money(ITEM_SUBTOTAL);
    $('billDelivery').textContent = freeDel ? 'FREE' : money(delivery);
    $('billHandling').textContent = money(HANDLING);
    $('billTotal').textContent = money(total);

    const row = $('couponRow');
    const banner = $('savedBanner');
    const cta = $('billCouponBtn');

    if (c) {
      row.style.display = 'flex';
      row.className = 'bill-row coupon-row';
      const amount = freeDel ? 'Free delivery' : `-${money(discount)}`;
      row.innerHTML = `<span>Coupon <strong>${c.code}</strong>
          <button type="button" class="remove-coupon" id="removeCoupon">Remove</button></span>
        <span>${amount}</span>`;
      $('removeCoupon').addEventListener('click', removeCoupon);

      $('savedBannerText').textContent = `You're saving ${money(savingsFor(c))} on this order 🎉`;
      banner.classList.add('show');
      cta.style.display = 'none';
    } else {
      row.style.display = 'none';
      row.innerHTML = '';
      banner.classList.remove('show');
      cta.style.display = 'flex';
    }

    if (animate) flashBillRows();
  }

  /* ---------- Confetti ---------- */
  function burstConfetti(originEl) {
    const colors = ['#C6F135', '#FFFFFF', '#FF6B4A', '#B5E71C'];
    for (let i = 0; i < 18; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      const angle = Math.random() * Math.PI * 2;
      const dist = 55 + Math.random() * 70;
      piece.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      piece.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      piece.style.setProperty('--rot', `${(Math.random() * 360 - 180)}deg`);
      piece.style.background = colors[i % colors.length];
      originEl.appendChild(piece);
      setTimeout(() => piece.remove(), 1000);
    }
  }

  /* ---------- Toast ---------- */
  function showToast(message, isError = false) {
    const toast = $('toast');
    toast.classList.toggle('error', isError);
    toast.querySelector('i').className = isError ? 'bi bi-exclamation-circle-fill' : 'bi bi-check-circle-fill';
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ---------- Copy code ---------- */
  function copyCode(code, btn) {
    navigator.clipboard?.writeText(code).catch(() => {});
    if (btn) {
      const icon = btn.querySelector('i');
      if (icon) {
        const prev = icon.className;
        icon.className = 'bi bi-check2';
        setTimeout(() => { icon.className = prev; }, 1200);
      }
    }
    showToast(`Copied ${code}`);
  }

  /* ---------- Events ---------- */
  $('openCouponBtn').addEventListener('click', openSheet);
  $('billCouponBtn').addEventListener('click', openSheet);
  $('changeCouponBtn').addEventListener('click', openSheet);
  $('sheetClose').addEventListener('click', closeSheet);
  backdrop.addEventListener('click', closeSheet);
  applyBtn.addEventListener('click', applySelected);

  $('ticketRemove').addEventListener('click', removeCoupon);
  $('ticketCopy').addEventListener('click', () => {
    const c = coupons.find((x) => x.id === appliedId);
    if (c) copyCode(c.code, $('ticketCopy'));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sheet.classList.contains('show')) closeSheet();
  });

  listEl.addEventListener('click', (e) => {
    const copyBtn = e.target.closest('[data-copy]');
    if (copyBtn) {
      e.stopPropagation();
      copyCode(copyBtn.dataset.copy, copyBtn);
      return;
    }
    const item = e.target.closest('.coupon-item');
    if (!item) return;
    selectItem(item);
  });

  listEl.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const item = e.target.closest('.coupon-item');
    if (!item) return;
    e.preventDefault();
    selectItem(item);
  });

  function selectItem(item) {
    const c = coupons.find((x) => x.id === item.dataset.id);
    if (!c) return;

    if (!isEligible(c)) {
      item.classList.remove('shake');
      void item.offsetWidth;
      item.classList.add('shake');
      showToast(`Add ${money(c.minOrder - ITEM_SUBTOTAL)} more to unlock ${c.code}`, true);
      return;
    }

    selectedId = selectedId === c.id ? null : c.id;
    renderList();
    updateFoot();
  }

  searchInput.addEventListener('input', renderList);

  /* ---------- Init ---------- */
  $('couponCountLabel').textContent = `${coupons.length} available`;
  $('sheetCount').textContent = coupons.length;
  $('availCount').textContent = coupons.length;
  $('maxSave').textContent = money(maxSaving);
  $('sheetMax').textContent = `${Math.max(...coupons.filter(c => c.type === 'percent').map(c => c.value))}%`;

  renderWallet(false);
  recalc(false);
