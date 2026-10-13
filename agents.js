// ============================================================
// agents.js — the SUPER AGENT and the 6 specialized agents
//
// Flow:  user message → superAgentRoute()
//        1. detect the intent from keywords
//        2. pick the right specialized agent
//        3. that agent answers from the LIVE dataset (data.js)
// Every reply returns: { agent, trace, html }
// ============================================================

const AGENTS = {
  product:   { name: "Product Discovery Agent", icon: "🔎" },
  recommend: { name: "Recommendation Agent",    icon: "⭐" },
  price:     { name: "Price Comparison Agent",  icon: "💰" },
  order:     { name: "Order Tracking Agent",    icon: "📦" },
  support:   { name: "Customer Support Agent",  icon: "🎧" },
  inventory: { name: "Inventory Agent",         icon: "📊" },
  super:     { name: "Super Agent",             icon: "🤖" }
};

// ---------- helpers ----------

const fmtINR = n => "₹" + n.toLocaleString("en-IN");
const discPct = p => Math.round((1 - p.price / p.mrp) * 100);

// whole-word matching, so "headphones" never matches a "phone" keyword
function hasWord(text, word) {
  return new RegExp("\\b" + word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(text);
}

// find products mentioned in the message, best match first.
// Scoring matters: "denim jacket" must rank the jacket (phrase match)
// above the jeans (which only match the single word "denim").
function findProducts(text) {
  const t = text.toLowerCase();
  const scored = PRODUCTS.map(p => {
    let score = 0;
    if (t.includes(p.name.toLowerCase())) score += 5;
    p.keywords.forEach(k => {
      if (hasWord(t, k)) score += k.includes(" ") || k.includes("-") ? 3 : 2;
    });
    if (hasWord(t, p.category)) score += 1;
    if (hasWord(t, p.brand)) score += 3;
    return { p, score };
  }).filter(x => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.map(x => x.p);
}

// find an order id like ORD1001 in the message
function findOrder(text) {
  const m = text.match(/ord[-\s]?(\d{3,})/i);
  if (!m) return null;
  return ORDERS.find(o => o.id.toLowerCase() === ("ord" + m[1])) || "unknown";
}

// small product card used inside chat replies
function miniCard(p, reason) {
  const disabled = p.stock === 0 ? "disabled" : "";
  const btnLabel = p.stock === 0 ? "Out of stock" : "Add to bag";
  return `
    <div class="mini-card">
      <span class="mini-art">${productArt(p)}</span>
      <div class="mini-info">
        <b>${p.brand} ${p.name}</b>
        <small>${reason || p.desc}</small>
      </div>
      <span class="mini-price">${fmtINR(p.price)}<em>${discPct(p)}% off</em></span>
      <button class="mini-add" ${disabled} onclick="addToCartFromChat(${p.id})">${btnLabel}</button>
    </div>`;
}

// ============================================================
// THE SUPER AGENT — request routing logic
// ============================================================
function superAgentRoute(message) {
  const text = message.toLowerCase().trim();
  const products = findProducts(text);
  const order = findOrder(text);

  // 1. STRONG SUPPORT words — returns / refunds / cancellations / exchanges
  //    beat everything else ("cancel my order ORD1002" must go to Support,
  //    which still receives the order id for context)
  if (/\b(return|refund|cancel|exchange|damaged|broken|complaint|replace|payment failed|not working)\b|wrong size|doesn't fit|does not fit|too small|too big/.test(text)) {
    return supportAgent(text, order, products);
  }

  // 2. ORDER TRACKING — an order id or tracking words
  if (order || /\b(track|order status|where is my order|my order|delivery status)\b/.test(text)) {
    return orderAgent(text, order);
  }

  // 3. PRICE COMPARISON + OFFERS
  if (/\b(price|prices|compare|cheapest|cheaper|cost|deal|deals|offer|offers|sale|discount|discounts)\b/.test(text)) {
    return priceAgent(text, products);
  }

  // 4. RECOMMENDATIONS
  if (/\b(recommend|suggest|suggestion|best|gift|which one|what should)\b/.test(text)) {
    return recommendAgent(text, products);
  }

  // 5. INVENTORY / STOCK
  if (/\b(stock|in stock|available|availability|inventory|how many|left)\b/.test(text)) {
    return inventoryAgent(text, products);
  }

  // 6. PRODUCT SEARCH — a product / brand / category was mentioned
  if (products.length > 0) {
    return productAgent(text, products);
  }

  // 7. WEAK SUPPORT words — general help with no product mentioned
  if (/\b(help|support|contact|human|talk to|agent|customer care)\b/.test(text)) {
    return supportAgent(text, null, []);
  }

  // 8. GREETING
  if (/^(hi|hii|hello|hey|hola|good morning|good evening)\b/.test(text)) {
    return greetingReply();
  }

  // 9. FALLBACK
  return fallbackReply();
}

// ============================================================
// 🔎 PRODUCT DISCOVERY AGENT
// ============================================================
function productAgent(text, products) {
  const shown = products.slice(0, 4);
  let html = `<h4>🔎 Found ${products.length} match${products.length > 1 ? "es" : ""} in the catalog:</h4>`;
  shown.forEach(p => {
    html += miniCard(p, `${p.category} · ⭐ ${p.rating} (${p.reviews.toLocaleString("en-IN")}) · ${p.stock > 0 ? p.stock + " in stock" : "out of stock"}`);
  });
  html += `<small>Ask me to <b>compare prices</b> or <b>check sizes & stock</b> for any of these.</small>`;
  return {
    agent: "product",
    trace: `intent = product search · matched: ${shown.map(p => p.name).join(", ")}`,
    html
  };
}

// ============================================================
// ⭐ RECOMMENDATION AGENT
// ============================================================
function recommendAgent(text, products) {
  // optional budget: "under 2000", "below ₹1,500"
  let budget = null;
  const bm = text.match(/(?:under|below|less than|within)\s*₹?\s*([\d,]+)/);
  if (bm) budget = parseInt(bm[1].replace(/,/g, ""), 10);

  let pool = products.length > 0 ? [...products] : [...PRODUCTS];
  if (budget) pool = pool.filter(p => p.price <= budget);

  // prefer things the customer can actually buy
  const inStock = pool.filter(p => p.stock > 0);
  if (inStock.length > 0) pool = inStock;

  if (pool.length === 0) {
    return {
      agent: "recommend",
      trace: `intent = recommendation · budget ${budget ? fmtINR(budget) : "-"} · no match`,
      html: `<h4>⭐ Nothing fits that budget in this range.</h4>
             <p>The closest option is below — or try a slightly higher budget.</p>` +
             miniCard([...PRODUCTS].filter(p => p.stock > 0).sort((a, b) => a.price - b.price)[0])
    };
  }

  pool.sort((a, b) => b.rating - a.rating);
  const picks = pool.slice(0, 3);

  let html = `<h4>⭐ My top pick${picks.length > 1 ? "s" : ""}${budget ? " under " + fmtINR(budget) : ""}:</h4>`;
  picks.forEach((p, i) => {
    const why = i === 0
      ? `Best rated: ⭐ ${p.rating} from ${p.reviews.toLocaleString("en-IN")} reviews · ${discPct(p)}% off`
      : `⭐ ${p.rating} · ${p.reviews.toLocaleString("en-IN")} reviews · ${discPct(p)}% off`;
    html += miniCard(p, why);
  });
  return {
    agent: "recommend",
    trace: `intent = recommendation · ranked by rating${budget ? " · budget " + fmtINR(budget) : ""}`,
    html
  };
}

// ============================================================
// 💰 PRICE COMPARISON AGENT (also handles offers & sale queries)
// ============================================================
function priceAgent(text, products) {
  // "any offers today?" / "what's on sale?" with no product named → top deals
  if (products.length === 0 && /\b(offer|offers|sale|deal|deals|discount|discounts)\b/.test(text)) {
    const deals = [...PRODUCTS].filter(p => p.stock > 0)
                               .sort((a, b) => discPct(b) - discPct(a)).slice(0, 4);
    let html = `<h4>💰 Today's biggest discounts:</h4>`;
    deals.forEach(p => {
      html += miniCard(p, `${discPct(p)}% off · was ${fmtINR(p.mrp)}, now ${fmtINR(p.price)}`);
    });
    return {
      agent: "price",
      trace: `intent = offers · top ${deals.length} by discount %`,
      html
    };
  }

  if (products.length === 0) {
    return {
      agent: "price",
      trace: "intent = price comparison · no product named",
      html: `<h4>💰 Which product should I compare?</h4>
             <p>Try: <i>"Compare prices for the denim jacket"</i> or <i>"Cheapest running shoes"</i>.</p>`
    };
  }

  const p = products[0];
  const sorted = [...p.sellers].sort((a, b) => a.price - b.price);
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

  let rows = sorted.map((s, i) => `
    <tr class="${i === 0 ? "best-row" : ""}">
      <td>${s.name}${s.name === "StyleKart" ? " (us)" : ""}${i === 0 ? " 🏆" : ""}</td>
      <td>${fmtINR(s.price)}</td>
      <td>${s.delivery}</td>
    </tr>`).join("");

  const html = `
    <h4>💰 ${p.brand} ${p.name} — across 3 platforms</h4>
    <table>
      <tr><th>Platform</th><th>Price</th><th>Delivery</th></tr>
      ${rows}
    </table>
    <p><b>${best.name}</b> has the best price at <b>${fmtINR(best.price)}</b> —
    that's <b>${fmtINR(worst.price - best.price)}</b> less than the costliest listing,
    and <b>${discPct(p)}% below MRP</b> (${fmtINR(p.mrp)}).</p>`;

  return {
    agent: "price",
    trace: `intent = price comparison · product: ${p.name} · ${p.sellers.length} platforms compared`,
    html
  };
}

// ============================================================
// 📦 ORDER TRACKING AGENT
// ============================================================
function orderAgent(text, order) {
  if (order === "unknown") {
    return {
      agent: "order",
      trace: "intent = order tracking · order id not found",
      html: `<h4>📦 I couldn't find that order.</h4>
             <p>Your recent orders are: <b>${ORDERS.map(o => o.id).join(", ")}</b>. Try one of these.</p>`
    };
  }

  if (!order) {
    let html = `<h4>📦 Your recent orders:</h4><ul>`;
    ORDERS.forEach(o => {
      html += `<li><b>${o.id}</b> — ${o.items.join(", ")} — <b>${o.status}</b></li>`;
    });
    html += `</ul><small>Say an order id (like "Track ORD1001") for the full timeline.</small>`;
    return { agent: "order", trace: "intent = order tracking · listed all orders", html };
  }

  let timeline = `<div class="timeline">`;
  order.steps.forEach((s, i) => {
    timeline += `<div class="t-step ${s.done ? "done" : ""}">
                   <div class="t-dot"></div><div class="t-label">${s.label}</div>
                 </div>`;
    if (i < order.steps.length - 1) timeline += `<div class="t-line"></div>`;
  });
  timeline += `</div>`;

  const html = `
    <h4>📦 ${order.id} — ${order.status}</h4>
    <p>${order.items.join(" + ")} · ${fmtINR(order.total)} · placed ${order.placed}</p>
    ${timeline}
    <p><b>${order.status === "Delivered" ? "Delivered ✅" : "Expected by " + order.eta}</b></p>`;

  return {
    agent: "order",
    trace: `intent = order tracking · order: ${order.id}`,
    html
  };
}

// ============================================================
// 🎧 CUSTOMER SUPPORT AGENT
// ============================================================
function supportAgent(text, order, products) {
  // size exchange — very common for a clothing store
  if (/wrong size|doesn't fit|does not fit|too small|too big|\bexchange\b/.test(text)) {
    const sizeLine = products.length > 0
      ? `<p>For the <b>${products[0].brand} ${products[0].name}</b>, available sizes right now: <b>${products[0].sizes.join(", ")}</b>.</p>`
      : "";
    return {
      agent: "support",
      trace: "intent = support · topic: size exchange",
      html: `<h4>🎧 Size exchange — free within 7 days:</h4>
             <ul>
               <li><b>Step 1:</b> Pick "Exchange" against the item in your orders.</li>
               <li><b>Step 2:</b> Choose the new size — we block it for you instantly.</li>
               <li><b>Step 3:</b> Delivery partner brings the new one and takes the old one back in a single visit.</li>
             </ul>${sizeLine}`
    };
  }

  // returns / refunds / damaged
  if (/\b(return|refund|damaged|broken|replace)\b/.test(text)) {
    const orderLine = order && order !== "unknown"
      ? `<p>I can start this for <b>${order.id}</b> (${order.items.join(", ")}).</p>`
      : `<p>Tell me the order id (e.g. ORD1003) and I'll schedule the pickup.</p>`;
    return {
      agent: "support",
      trace: "intent = support · topic: return / refund",
      html: `<h4>🎧 Returns & refunds — here's how it works:</h4>
             <ul>
               <li><b>Step 1:</b> Raise a return within <b>7 days</b> of delivery (tags intact).</li>
               <li><b>Step 2:</b> Free doorstep pickup gets scheduled.</li>
               <li><b>Step 3:</b> Refund reaches your account in <b>3–5 working days</b>.</li>
             </ul>${orderLine}`
    };
  }

  // cancellations
  if (/\bcancel\b/.test(text)) {
    const note = order && order !== "unknown"
      ? (order.status === "Order placed" || order.status === "Packed"
          ? `<p>Good news — <b>${order.id}</b> is still "${order.status}", so it <b>can be cancelled</b> with a full refund.</p>`
          : `<p><b>${order.id}</b> is already "${order.status}", so it can't be cancelled now — but you can refuse delivery or return it after it arrives.</p>`)
      : `<p>Orders can be cancelled any time before they're shipped. Tell me the order id and I'll check.</p>`;
    return { agent: "support", trace: "intent = support · topic: cancellation", html: `<h4>🎧 Cancellation</h4>${note}` };
  }

  // payment issues
  if (/\bpayment\b/.test(text)) {
    return {
      agent: "support",
      trace: "intent = support · topic: payment",
      html: `<h4>🎧 Payment issue</h4>
             <ul>
               <li>If money was deducted but the order failed, it auto-refunds in <b>5–7 days</b>.</li>
               <li>You'll get an SMS + email once the refund is processed.</li>
             </ul>`
    };
  }

  // generic help / talk to a human
  return {
    agent: "support",
    trace: "intent = support · topic: general help",
    html: `<h4>🎧 Happy to help! Here's what I can do:</h4>
           <ul>
             <li>🔎 Find products — <i>"show me jeans"</i></li>
             <li>⭐ Recommend — <i>"recommend a dress under 2000"</i></li>
             <li>💰 Compare prices & offers — <i>"compare prices for the denim jacket"</i></li>
             <li>📦 Track orders — <i>"track ORD1001"</i></li>
             <li>📊 Check sizes & stock — <i>"is the denim jacket in stock?"</i></li>
             <li>↩️ Returns, exchanges & refunds — <i>"my t-shirt doesn't fit"</i></li>
           </ul>
           <p>Need a human? Call <b>1800-000-DEMO</b> or mail <b>care@stylekart.demo</b> (24×7).</p>`
  };
}

// ============================================================
// 📊 INVENTORY AGENT
// ============================================================
function inventoryAgent(text, products) {
  if (products.length > 0) {
    const p = products[0];
    let statusLine, extra = "";
    if (p.stock === 0) {
      statusLine = `❌ <b>Out of stock</b> right now.`;
      const alt = PRODUCTS.filter(x => x.category === p.category && x.stock > 0)
                          .sort((a, b) => b.rating - a.rating)[0];
      if (alt) extra = `<p>A similar in-stock option:</p>` + miniCard(alt);
    } else if (p.stock <= 5) {
      statusLine = `⚠️ <b>Only ${p.stock} left</b> — selling fast!`;
      extra = `<p>Sizes: <b>${p.sizes.join(", ")}</b></p>` + miniCard(p, "Low stock — grab it before it's gone");
    } else {
      statusLine = `✅ <b>In stock</b> — ${p.stock} units available.`;
      extra = `<p>Sizes: <b>${p.sizes.join(", ")}</b></p>` + miniCard(p);
    }
    return {
      agent: "inventory",
      trace: `intent = stock check · product: ${p.name} · stock = ${p.stock}`,
      html: `<h4>📊 ${p.brand} ${p.name}</h4><p>${statusLine}</p>${extra}`
    };
  }

  // no product named → overall inventory snapshot
  const low = PRODUCTS.filter(p => p.stock > 0 && p.stock <= 10);
  const out = PRODUCTS.filter(p => p.stock === 0);
  let html = `<h4>📊 Inventory snapshot</h4>
              <ul>
                <li>Styles listed: <b>${PRODUCTS.length}</b></li>
                <li>Low stock (≤ 10 units): <b>${low.map(p => `${p.name} (${p.stock})`).join(", ") || "none"}</b></li>
                <li>Out of stock: <b>${out.map(p => p.name).join(", ") || "none"}</b></li>
              </ul>
              <small>Ask about a specific product, like "is the denim jacket in stock?"</small>`;
  return { agent: "inventory", trace: "intent = stock check · full inventory summary", html };
}

// ============================================================
// greeting + fallback (handled by the Super Agent itself)
// ============================================================
function greetingReply() {
  return {
    agent: "super",
    trace: "intent = greeting · handled directly",
    html: `<h4>👋 Hi! I'm StyleBot, your shopping Super Agent.</h4>
           <p>One chat, six specialized agents working behind me. Try:</p>
           <ul>
             <li><i>"Recommend a dress"</i></li>
             <li><i>"Compare prices for the denim jacket"</i></li>
             <li><i>"Any offers today?"</i></li>
             <li><i>"Track order ORD1001"</i></li>
             <li><i>"Is the denim jacket in stock?"</i></li>
             <li><i>"My t-shirt doesn't fit"</i></li>
           </ul>`
  };
}

function fallbackReply() {
  return {
    agent: "super",
    trace: "intent = unknown · fallback",
    html: `<h4>🤔 I didn't quite get that.</h4>
           <p>I can <b>find products</b>, <b>recommend</b>, <b>compare prices & offers</b>, <b>track orders</b>,
           <b>check sizes & stock</b> and handle <b>returns, exchanges & support</b>. Try one of the quick buttons below.</p>`
  };
}
