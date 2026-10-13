// ============================================================
// app.js — UI logic: screens, filters, grid, wishlist, bag,
//          chat drawer, Data Studio, Agent Lab
// ============================================================

// a pristine copy of the dataset, for the "Reset to original" button
const ORIGINAL = JSON.parse(JSON.stringify(PRODUCTS));

// ---------- state ----------
const cart = {};                 // { "productId|size": qty }
const wishlist = new Set();      // product ids
let activeCategory = "All";
let searchTerm = "";
let sortMode = "popular";
const filters = { brands: new Set(), price: null, minDiscount: 0, minRating: 0 };

const CATEGORIES = ["All", "Men", "Women", "Kids", "Footwear", "Accessories"];
const PRICE_BANDS = [
  { label: "Under ₹500",      min: 0,    max: 499 },
  { label: "₹500 – ₹999",     min: 500,  max: 999 },
  { label: "₹1,000 – ₹1,999", min: 1000, max: 1999 },
  { label: "₹2,000 and above", min: 2000, max: Infinity }
];

// ============================================================
// SCREENS
// ============================================================
const SCREENS = ["shop", "wishlist", "cart", "lab", "data", "how"];

function switchScreen(name) {
  SCREENS.forEach(s => {
    const el = document.getElementById("screen-" + s);
    if (el) el.style.display = (s === name) ? "" : "none";
  });
  document.getElementById("nav-wishlist").style.color = name === "wishlist" ? "var(--pink)" : "";
  document.getElementById("nav-cart").style.color = name === "cart" ? "var(--pink)" : "";
  ["data", "lab", "how"].forEach(s =>
    document.getElementById("strip-" + s).classList.toggle("active", s === name));

  if (name === "cart") renderCart();
  if (name === "wishlist") renderWishlist();
  if (name === "data") renderDataStudio();
  window.scrollTo(0, 0);
}

function goShop(cat) {
  activeCategory = cat;
  switchScreen("shop");
  renderFilters();
  renderProducts();
}

function askDeals() {
  openChat();
  sendMessage("Any offers today?");
}

// ============================================================
// FILTER SIDEBAR
// ============================================================
function renderFilters() {
  // categories (radio)
  document.getElementById("filterCats").innerHTML = CATEGORIES.map(c => `
    <label class="f-row">
      <input type="radio" name="fcat" ${c === activeCategory ? "checked" : ""}
             onchange="activeCategory='${c}'; renderCatNav(); renderProducts()">
      ${c} <small>(${c === "All" ? PRODUCTS.length : PRODUCTS.filter(p => p.category === c).length})</small>
    </label>`).join("");

  // brands (checkboxes)
  const brands = [...new Set(PRODUCTS.map(p => p.brand))].sort();
  document.getElementById("filterBrands").innerHTML = brands.map(b => `
    <label class="f-row">
      <input type="checkbox" ${filters.brands.has(b) ? "checked" : ""}
             onchange="toggleBrand('${b}')"> ${b}
    </label>`).join("");

  // price bands (radio)
  document.getElementById("filterPrice").innerHTML =
    `<label class="f-row"><input type="radio" name="fprice" ${filters.price === null ? "checked" : ""}
       onchange="filters.price=null; renderProducts()"> Any price</label>` +
    PRICE_BANDS.map((b, i) => `
    <label class="f-row">
      <input type="radio" name="fprice" ${filters.price === i ? "checked" : ""}
             onchange="filters.price=${i}; renderProducts()"> ${b.label}
    </label>`).join("");

  // discount
  document.getElementById("filterDiscount").innerHTML = [0, 30, 40, 50].map(d => `
    <label class="f-row">
      <input type="radio" name="fdisc" ${filters.minDiscount === d ? "checked" : ""}
             onchange="filters.minDiscount=${d}; renderProducts()">
      ${d === 0 ? "Any discount" : d + "% and above"}
    </label>`).join("");

  // rating
  document.getElementById("filterRating").innerHTML = [0, 4, 4.5].map(r => `
    <label class="f-row">
      <input type="radio" name="frate" ${filters.minRating === r ? "checked" : ""}
             onchange="filters.minRating=${r}; renderProducts()">
      ${r === 0 ? "Any rating" : "⭐ " + r + " and above"}
    </label>`).join("");
}

function toggleBrand(b) {
  filters.brands.has(b) ? filters.brands.delete(b) : filters.brands.add(b);
  renderProducts();
}

function clearFilters() {
  filters.brands.clear();
  filters.price = null;
  filters.minDiscount = 0;
  filters.minRating = 0;
  activeCategory = "All";
  searchTerm = "";
  document.getElementById("searchInput").value = "";
  renderCatNav();
  renderFilters();
  renderProducts();
}

function renderCatNav() {
  document.querySelectorAll(".cat-nav button").forEach(b =>
    b.classList.toggle("active", b.textContent.trim() === activeCategory));
}

// ============================================================
// PRODUCT GRID
// ============================================================
function onSearch(value) {
  searchTerm = value.toLowerCase().trim();
  switchScreen("shop");
  renderProducts();
}

function onSort(mode) {
  sortMode = mode;
  renderProducts();
}

function matchesSearch(p) {
  if (!searchTerm) return true;
  return p.name.toLowerCase().includes(searchTerm) ||
         p.brand.toLowerCase().includes(searchTerm) ||
         p.category.toLowerCase().includes(searchTerm) ||
         p.keywords.some(k => k.includes(searchTerm));
}

function visibleProducts() {
  let list = PRODUCTS.filter(p =>
    (activeCategory === "All" || p.category === activeCategory) &&
    matchesSearch(p) &&
    (filters.brands.size === 0 || filters.brands.has(p.brand)) &&
    (filters.price === null ||
      (p.price >= PRICE_BANDS[filters.price].min && p.price <= PRICE_BANDS[filters.price].max)) &&
    discPct(p) >= filters.minDiscount &&
    p.rating >= filters.minRating
  );
  const by = {
    "price-asc":  (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    "rating":     (a, b) => b.rating - a.rating,
    "discount":   (a, b) => discPct(b) - discPct(a),
    "popular":    (a, b) => b.reviews - a.reviews
  };
  return list.sort(by[sortMode] || by.popular);
}

function stockNote(p) {
  if (p.stock === 0) return `<div class="stock-note out">Out of stock</div>`;
  if (p.stock <= 5) return `<div class="stock-note low">Only ${p.stock} left!</div>`;
  return "";
}

function fmtCount(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(".0", "") + "k" : n;
}

function productCard(p) {
  const wished = wishlist.has(p.id);
  return `
    <div class="card">
      <div class="card-art">
        ${productArt(p)}
        <button class="heart-btn" title="Wishlist" onclick="toggleWish(${p.id})">${wished ? "❤️" : "🤍"}</button>
        <div class="rating-pill"><span class="star">★</span>${p.rating}<small>| ${fmtCount(p.reviews)}</small></div>
        ${p.stock === 0 ? `<div class="oos-ribbon"><b>OUT OF STOCK</b></div>` : ""}
      </div>
      <div class="card-body">
        <div class="card-brand">${p.brand}</div>
        <div class="card-name">${p.name}</div>
        <div class="price-row">
          <span class="price">${fmtINR(p.price)}</span>
          <span class="mrp">${fmtINR(p.mrp)}</span>
          <span class="disc">(${discPct(p)}% OFF)</span>
        </div>
        ${stockNote(p)}
        <button class="add-btn" ${p.stock === 0 ? "disabled" : ""} onclick="openSizeModal(${p.id})">
          ${p.stock === 0 ? "Unavailable" : "Add to bag"}
        </button>
      </div>
    </div>`;
}

function renderProducts() {
  const list = visibleProducts();
  document.getElementById("noResults").style.display = list.length ? "none" : "";
  document.getElementById("resultInfo").innerHTML =
    `Home / <b>${activeCategory}</b> — ${list.length} product${list.length === 1 ? "" : "s"}`;
  document.getElementById("productGrid").innerHTML = list.map(productCard).join("");
}

// ============================================================
// WISHLIST
// ============================================================
function toggleWish(id) {
  if (wishlist.has(id)) { wishlist.delete(id); }
  else {
    wishlist.add(id);
    const p = PRODUCTS.find(x => x.id === id);
    showToast(`❤️ ${p.brand} ${p.name} saved to wishlist`);
  }
  document.getElementById("wishBadge").textContent = wishlist.size;
  renderProducts();
  if (document.getElementById("screen-wishlist").style.display !== "none") renderWishlist();
}

function renderWishlist() {
  const items = PRODUCTS.filter(p => wishlist.has(p.id));
  document.getElementById("wishCount").textContent = items.length ? `${items.length} item${items.length > 1 ? "s" : ""}` : "";
  document.getElementById("wishEmpty").style.display = items.length ? "none" : "";
  document.getElementById("wishlistGrid").innerHTML = items.map(productCard).join("");
}

// ============================================================
// SIZE MODAL → BAG
// ============================================================
let modalProductId = null;
let modalSize = null;

function openSizeModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || p.stock === 0) return;
  modalProductId = id;
  // single-size products skip the chooser
  if (p.sizes.length === 1) { addToCart(id, p.sizes[0]); return; }
  modalSize = null;
  document.getElementById("sizeModalBody").innerHTML = `
    <h3>${p.brand} ${p.name}</h3>
    <div class="m-sub">${fmtINR(p.price)} · select a size</div>
    <div class="size-chips">
      ${p.sizes.map(s => `<button class="size-chip" onclick="pickSize(this,'${s}')">${s}</button>`).join("")}
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeSizeModal()">Cancel</button>
      <button class="btn btn-primary" id="sizeConfirm" disabled onclick="confirmSize()">Add to bag</button>
    </div>`;
  document.getElementById("sizeModal").style.display = "flex";
}

function pickSize(btn, s) {
  modalSize = s;
  document.querySelectorAll(".size-chip").forEach(b => b.classList.remove("sel"));
  btn.classList.add("sel");
  document.getElementById("sizeConfirm").disabled = false;
}

function confirmSize() {
  addToCart(modalProductId, modalSize);
  closeSizeModal();
}

function closeSizeModal() {
  document.getElementById("sizeModal").style.display = "none";
}

// ============================================================
// BAG (cart)
// ============================================================
function addToCart(id, size) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || p.stock === 0) return;
  const key = id + "|" + size;
  cart[key] = (cart[key] || 0) + 1;
  updateCartBadge();
  showToast(`👜 ${p.brand} ${p.name} (${size}) added to bag`);
}

// used by buttons inside chat bubbles — picks the first size
function addToCartFromChat(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || p.stock === 0) return;
  addToCart(id, p.sizes[0]);
}

function changeQty(key, delta) {
  cart[key] = (cart[key] || 0) + delta;
  if (cart[key] <= 0) delete cart[key];
  updateCartBadge();
  renderCart();
}

function removeFromCart(key) {
  delete cart[key];
  updateCartBadge();
  renderCart();
}

function cartCount() {
  return Object.values(cart).reduce((a, b) => a + b, 0);
}

function updateCartBadge() {
  document.getElementById("cartBadge").textContent = cartCount();
}

function renderCart() {
  const box = document.getElementById("cartContent");
  document.getElementById("orderConfirm").style.display = "none";
  const keys = Object.keys(cart);

  if (keys.length === 0) {
    box.innerHTML = `<p class="empty-note">Your bag is empty. 👜<br><br>
      <button class="btn btn-primary" onclick="goShop('All')">Continue shopping</button></p>`;
    return;
  }

  let mrpTotal = 0, priceTotal = 0;
  let rows = "";
  keys.forEach(key => {
    const [id, size] = key.split("|");
    const p = PRODUCTS.find(x => x.id === +id);
    const qty = cart[key];
    mrpTotal += p.mrp * qty;
    priceTotal += p.price * qty;
    rows += `
      <div class="cart-item">
        <div class="cart-art">${productArt(p)}</div>
        <div class="cart-info">
          <b>${p.brand} ${p.name}</b>
          <small>Size: <span class="size-tag">${size}</span> · ${fmtINR(p.price)} <s>${fmtINR(p.mrp)}</s></small>
        </div>
        <div class="qty-ctrl">
          <button class="qty-btn" onclick="changeQty('${key}', -1)">−</button>
          <b>${qty}</b>
          <button class="qty-btn" onclick="changeQty('${key}', 1)">+</button>
        </div>
        <div class="line-price">${fmtINR(p.price * qty)}</div>
        <button class="remove-btn" title="Remove" onclick="removeFromCart('${key}')">✕</button>
      </div>`;
  });

  const delivery = priceTotal >= 999 ? 0 : 79;
  const total = priceTotal + delivery;

  box.innerHTML = rows + `
    <div class="cart-summary">
      <h4>Price details (${cartCount()} items)</h4>
      <div class="sum-row"><span>Total MRP</span><span>${fmtINR(mrpTotal)}</span></div>
      <div class="sum-row"><span>Discount on MRP</span><span class="pos">− ${fmtINR(mrpTotal - priceTotal)}</span></div>
      <div class="sum-row"><span>Delivery fee</span><span>${delivery === 0 ? '<span class="pos">FREE</span>' : fmtINR(delivery)}</span></div>
      <div class="sum-row sum-total"><span>Total amount</span><span>${fmtINR(total)}</span></div>
      <button class="btn btn-primary checkout-btn" onclick="checkout(${total})">Place order (demo)</button>
    </div>`;
}

// demo checkout — creates a dummy order the Order Agent can track
function checkout(total) {
  const items = Object.keys(cart).map(key => {
    const [id, size] = key.split("|");
    const p = PRODUCTS.find(x => x.id === +id);
    return `${p.brand} ${p.name} (${size})`;
  });
  const newId = "ORD" + NEXT_ORDER_NUM++;

  ORDERS.unshift({
    id: newId,
    items,
    total,
    placed: "14 Oct 2026",
    eta: "18 Oct 2026",
    status: "Order placed",
    steps: [
      { label: "Order placed · 14 Oct", done: true },
      { label: "Packed", done: false },
      { label: "Shipped", done: false },
      { label: "Out for delivery", done: false },
      { label: "Delivered (expected 18 Oct)", done: false }
    ]
  });

  Object.keys(cart).forEach(k => delete cart[k]);
  updateCartBadge();

  document.getElementById("cartContent").innerHTML = "";
  const confirmBox = document.getElementById("orderConfirm");
  confirmBox.style.display = "";
  confirmBox.innerHTML = `
    <div class="order-confirm">
      <h3>🎉 Order placed successfully!</h3>
      <p>Order id <b>${newId}</b> · Total ${fmtINR(total)} · Expected delivery 18 Oct 2026.<br>
      This is a demo order — no real payment happened.</p>
      <button class="btn btn-primary" onclick="trackNewOrder('${newId}')">🤖 Track it with StyleBot</button>
    </div>`;
  showToast(`Order ${newId} placed 🎉`);
}

function trackNewOrder(orderId) {
  openChat();
  sendMessage("Track order " + orderId);
}

// ============================================================
// CHAT DRAWER
// ============================================================
function openChat() {
  document.getElementById("chatDrawer").classList.add("open");
  document.getElementById("chatOverlay").classList.add("open");
  document.getElementById("chatFab").classList.add("hidden");
  const win = document.getElementById("chatWindow");
  if (win.children.length === 0) botReply(greetingReply());
  document.getElementById("chatInput").focus();
}

function closeChat() {
  document.getElementById("chatDrawer").classList.remove("open");
  document.getElementById("chatOverlay").classList.remove("open");
  document.getElementById("chatFab").classList.remove("hidden");
}

function sendMessage(preset) {
  const input = document.getElementById("chatInput");
  const text = (preset !== undefined ? preset : input.value).trim();
  if (!text) return;
  if (preset === undefined) input.value = "";

  appendUserMessage(text);

  const typing = appendTyping();
  setTimeout(() => {
    typing.remove();
    botReply(superAgentRoute(text));
  }, 550);
}

function appendUserMessage(text) {
  const win = document.getElementById("chatWindow");
  const div = document.createElement("div");
  div.className = "msg msg-user";
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;          // textContent = safe against HTML injection
  div.appendChild(bubble);
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

function appendTyping() {
  const win = document.getElementById("chatWindow");
  const div = document.createElement("div");
  div.className = "msg msg-bot";
  div.innerHTML = `<div class="bubble typing">Super Agent is routing your request…</div>`;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
  return div;
}

function botReply(route) {
  const win = document.getElementById("chatWindow");
  const a = AGENTS[route.agent];
  const div = document.createElement("div");
  div.className = "msg msg-bot";
  div.innerHTML = `
    <div class="route-tag">🤖 Super Agent → ${a.icon} ${a.name}</div>
    <div class="route-trace">${route.trace} · answered from dataset v${DATA_VERSION}</div>
    <div class="bubble">${route.html}</div>`;
  win.appendChild(div);
  win.scrollTop = win.scrollHeight;
}

// ============================================================
// DATA STUDIO — the editable live dataset
// ============================================================
function renderDataStudio() {
  const rows = PRODUCTS.map(p => `
    <tr>
      <td class="d-prod"><b>${p.brand} ${p.name}</b><small>${p.category} · id ${p.id}</small></td>
      <td><input type="number" min="1" value="${p.price}"  onchange="onDataEdit(${p.id}, 'price',  this)"></td>
      <td><input type="number" min="1" value="${p.mrp}"    onchange="onDataEdit(${p.id}, 'mrp',    this)"></td>
      <td class="d-disc">${discPct(p)}%</td>
      <td><input type="number" min="0" value="${p.stock}"  onchange="onDataEdit(${p.id}, 'stock',  this)">
          ${p.stock === 0 ? '<span class="d-stock-out">OUT</span>' : ""}</td>
      <td><input type="number" min="0" max="5" step="0.1" value="${p.rating}" onchange="onDataEdit(${p.id}, 'rating', this)"></td>
    </tr>`).join("");

  document.getElementById("dataTable").innerHTML = `
    <tr><th>Product</th><th>Price (₹)</th><th>MRP (₹)</th><th>Discount</th><th>Stock</th><th>Rating</th></tr>
    ${rows}`;
  renderVersionBadges();
}

function onDataEdit(id, field, input) {
  const p = PRODUCTS.find(x => x.id === id);
  const value = field === "rating" ? parseFloat(input.value) : parseInt(input.value, 10);
  if (isNaN(value) || value < 0) { input.value = p[field]; return; }
  const old = p[field];
  if (old === value) return;

  p[field] = value;
  // our own listed price must stay in sync with the StyleKart seller row
  if (field === "price") {
    const s = p.sellers.find(x => x.name === "StyleKart");
    if (s) s.price = value;
  }

  DATA_VERSION++;
  const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  EDIT_LOG.unshift(`${time} — ${field} of ${p.brand} ${p.name}: ${old} → ${value}  (now dataset v${DATA_VERSION})`);

  renderDataStudio();
  renderEditLog();
  renderProducts();          // the shop reflects the change too
  showToast(`🗂️ Dataset updated to v${DATA_VERSION} — the agents see it immediately`);
}

function renderEditLog() {
  const el = document.getElementById("editLog");
  el.innerHTML = EDIT_LOG.length
    ? EDIT_LOG.slice(0, 20).map(e => `<li>${e}</li>`).join("")
    : `<li class="log-empty">No edits yet this session.</li>`;
}

function resetDataset() {
  ORIGINAL.forEach(o => {
    const p = PRODUCTS.find(x => x.id === o.id);
    Object.assign(p, JSON.parse(JSON.stringify(o)));
  });
  DATA_VERSION++;
  const time = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  EDIT_LOG.unshift(`${time} — dataset reset to original values (now dataset v${DATA_VERSION})`);
  renderDataStudio();
  renderEditLog();
  renderProducts();
  showToast(`↩ Dataset reset — now v${DATA_VERSION}`);
}

function renderVersionBadges() {
  ["dvBadge", "dvBadgeStrip", "dvBadgeChat"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "v" + DATA_VERSION;
  });
}

// ============================================================
// AGENT LAB — routing accuracy on the TEST_SET
// ============================================================
function runAccuracyTest() {
  const results = TEST_SET.map(t => {
    const r = superAgentRoute(t.q);
    return { ...t, actual: r.agent, pass: r.agent === t.expect };
  });
  const passed = results.filter(r => r.pass).length;
  const failed = results.length - passed;
  const pct = ((passed / results.length) * 100).toFixed(1);

  // per-agent accuracy
  const byAgent = {};
  results.forEach(r => {
    byAgent[r.expect] = byAgent[r.expect] || { total: 0, ok: 0 };
    byAgent[r.expect].total++;
    if (r.pass) byAgent[r.expect].ok++;
  });
  const accChips = Object.entries(byAgent).map(([k, v]) =>
    `<span class="acc-chip">${AGENTS[k].icon} ${AGENTS[k].name}: <b>${v.ok}/${v.total}</b></span>`).join("");

  const rows = results.map((r, i) => `
    <tr class="${r.pass ? "" : "fail-row"}">
      <td>${i + 1}</td>
      <td>"${r.q}"${r.knownLimit ? '<span class="limit-tag">KNOWN LIMITATION</span>' : ""}</td>
      <td>${AGENTS[r.expect].icon} ${AGENTS[r.expect].name}</td>
      <td>${AGENTS[r.actual].icon} ${AGENTS[r.actual].name}</td>
      <td class="${r.pass ? "lab-pass" : "lab-fail"}">${r.pass ? "✓ PASS" : "✗ FAIL"}</td>
    </tr>`).join("");

  // data-grounding checks: the agent's words vs the dataset, live
  const grounding = groundingChecks();

  document.getElementById("labResults").innerHTML = `
    <div class="lab-summary">
      <div class="lab-stat"><b>${results.length}</b><small>test queries</small></div>
      <div class="lab-stat good"><b>${passed}</b><small>routed correctly</small></div>
      <div class="lab-stat bad"><b>${failed}</b><small>misrouted</small></div>
      <div class="lab-stat score"><b>${pct}%</b><small>routing accuracy</small></div>
    </div>
    <div class="agent-acc">${accChips}</div>
    <table class="lab-table">
      <tr><th>#</th><th>Query</th><th>Expected agent</th><th>Actual agent</th><th>Result</th></tr>
      ${rows}
    </table>
    <div class="ground-box">
      <h3>🔗 Data-grounding checks (dataset v${DATA_VERSION})</h3>
      <p class="gdesc">These compare what the agent SAYS against what the dataset HOLDS, right now.
      Edit the dataset in Data Studio and re-run — the checks follow the new values.</p>
      ${grounding}
    </div>`;
}

function groundingChecks() {
  const checks = [];

  // 1. stock grounding
  const jacket = PRODUCTS.find(p => p.id === 1);
  const r1 = superAgentRoute("is the denim jacket in stock?");
  const ok1 = jacket.stock === 0 ? r1.html.includes("Out of stock") : r1.html.includes(String(jacket.stock));
  checks.push({ name: "Stock check", data: `dataset says stock = ${jacket.stock}`, ok: ok1 });

  // 2. price grounding
  const dress = PRODUCTS.find(p => p.id === 6);
  const best = [...dress.sellers].sort((a, b) => a.price - b.price)[0];
  const r2 = superAgentRoute("compare prices for the floral dress");
  const ok2 = r2.html.includes(fmtINR(best.price));
  checks.push({ name: "Best-price check", data: `dataset says best price = ${fmtINR(best.price)} (${best.name})`, ok: ok2 });

  // 3. order-status grounding
  const o = ORDERS.find(x => x.id === "ORD1001");
  const r3 = superAgentRoute("track ORD1001");
  const ok3 = r3.html.includes(o.status);
  checks.push({ name: "Order-status check", data: `dataset says ORD1001 = "${o.status}"`, ok: ok3 });

  return checks.map(c => `
    <div class="ground-row">
      <b class="gname">${c.name}</b>
      <span class="gdata">${c.data}</span>
      <span class="${c.ok ? "lab-pass" : "lab-fail"}">${c.ok ? "✓ agent reply matches the data" : "✗ mismatch"}</span>
    </div>`).join("");
}

// ============================================================
// TOAST
// ============================================================
let toastTimer = null;
function showToast(text) {
  const t = document.getElementById("toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
}

// ============================================================
// INIT
// ============================================================
renderCatNav();
renderFilters();
renderProducts();
updateCartBadge();
renderVersionBadges();
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { closeSizeModal(); closeChat(); }
});
