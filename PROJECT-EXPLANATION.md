# StyleKart — Project Explanation (Review 2)

A Myntra-style clothing e-commerce site with an AI Super Agent chatbot (StyleBot). Everything runs in the browser on dummy data — no backend, no internet needed. Open `index.html` and it works.

---

## 1. The problem (from slide 1)

- Shopping across many products and sellers takes time.
- Support and order information sits in different places — one page for tracking, another for returns, another for prices.
- The user does all the jumping around themselves.

## 2. The solution

- One chatbot (the **Super Agent**) sits in front of six specialized agents.
- The user types one message. The Super Agent reads it, figures out the intent, and hands it to the right agent.
- Each agent is an expert at exactly one job and answers from the store's live dataset.

## 3. The website (Myntra-style)

- **Shop screen** — 20 clothing products across Men / Women / Kids / Footwear / Accessories, each with a brand, MRP, discount %, rating pill and stock status. Product images are drawn in code (SVG), so nothing needs the internet.
- **Filter sidebar** — categories with counts, brand checkboxes, price bands, discount bands, rating. Plus a sort dropdown (price, rating, discount, popularity).
- **Search bar** — live search by brand, product or category.
- **Wishlist** — heart on every card, wishlist page, count in the header.
- **Size selection** — "Add to bag" opens a size chooser (S–XXL, waist sizes, shoe sizes), like a real fashion site.
- **Bag** — Myntra-style price details: Total MRP, Discount on MRP, Delivery fee, Total. Checkout creates a real order id the chatbot can track.
- **StyleBot drawer** — the assistant slides in from the right (like Myntra's chat), opened by a floating button or the sale banner. It works on top of every screen.

## 4. The six agents

| Agent | Job | Example message |
|---|---|---|
| 🔎 Product Discovery | finds products by name, brand or category | "show me jeans" |
| ⭐ Recommendation | best picks, understands budgets | "suggest shoes under 2000" |
| 💰 Price Comparison | compares 3 platforms, finds today's offers | "compare prices for the denim jacket", "any offers today?" |
| 📦 Order Tracking | status timeline for any order | "track ORD1001" |
| 🎧 Customer Support | returns, size exchanges, cancellations, payments | "my t-shirt doesn't fit" |
| 📊 Inventory | stock, sizes, suggests alternatives when sold out | "is the denim jacket in stock?" |

## 5. How the Super Agent works (also an in-app page: "How it works")

- Every message goes through one function: `superAgentRoute()` in `agents.js`.
- **Step 1 — read the message.** It scans for keywords, an order id (ORD1001), and any product / brand / category mentioned.
- **Step 2 — route by priority.** Rules are checked top to bottom, first match wins:
  1. return / refund / cancel / exchange / wrong size → Support (these win even when an order id is present)
  2. order id or tracking words → Order Tracking
  3. price / compare / cheapest / offer / sale → Price Comparison
  4. recommend / suggest / best → Recommendation
  5. stock / available / how many → Inventory
  6. a product, brand or category was named → Product Discovery
  7. help / contact → Support
  8. greeting or nothing recognizable → the Super Agent answers itself
- **Step 3 — answer from the data.** The chosen agent reads the dataset at that moment and builds the reply.
- Product matching is **whole-word** (so "headphones" can never match "phone") and **scored** — the phrase "denim jacket" outranks the single word "denim", so the jacket beats the jeans.
- Every reply shows the **routing tag** ("Super Agent → Price Comparison Agent"), the **intent trace**, and the **dataset version** it answered from.

## 6. The editable dataset (Data Studio) — proof the agent reads live data

- Data Studio (top strip) shows the exact table the agents read: price, MRP, stock, rating for all 20 products.
- Every cell is editable. Each edit bumps the dataset version (v1 → v2 → …) and is written to an edit log.
- Every chat reply prints which version it answered from — so you can show cause and effect.
- **Live demo for your sir:** ask StyleBot "is the denim jacket in stock?" (it says "Only 3 left"). Go to Data Studio, set that stock to 0. Ask the same question again — the same agent now says "Out of stock" and suggests an alternative, and the reply says "answered from dataset v2". One question, two answers, and the only thing that changed is the data.
- A Reset button restores the original values.

## 7. The accuracy evaluation (Agent Lab)

- The Agent Lab holds a fixed **test dataset of 31 real user queries**, each labelled with the agent it should route to (the labels are in `data.js` as `TEST_SET`).
- Press "Run accuracy test": each query goes through the live router and the result is compared with the label.
- Current score: **29/31 ≈ 93.5%**, with a per-agent breakdown.
- The two failures are left in **on purpose** — they're genuine vocabulary gaps ("how much is the summer dress", "my package hasn't arrived") and are marked "KNOWN LIMITATION" in the table. A 100% score would just mean the test set was written to flatter the router.
- Below the table, three **data-grounding checks** compare what the agent says against what the dataset holds right now (stock, best price, order status). Edit the data and re-run — the checks follow the new values.

## 8. Limitations (honest ones — good viva material)

- **Vocabulary gaps.** Routing is keyword-based; phrasings outside the keyword lists fall to the fallback. The two Agent Lab failures demonstrate this.
- **No conversation memory.** Each message routes on its own; "which is cheapest?" after "show me jeans" won't remember jeans.
- **First-match ambiguity.** When a sentence fits two intents, the priority table decides mechanically.
- **English keywords only.** Hinglish and typos aren't understood.
- **Session-only data.** The dataset lives in the browser; refresh resets Data Studio edits.
- All of these are what the LLM + cloud phase (slide 3) fixes.

## 9. What each file does

- `index.html` — all screens: shop, wishlist, bag, Agent Lab, Data Studio, How it works, chat drawer
- `style.css` — the Myntra-style design
- `art.js` — SVG drawings for every product type (no image files needed)
- `data.js` — the live dataset: 20 products × 3 platform prices, orders, the 31-query test set, dataset version + edit log
- `agents.js` — `superAgentRoute()` and the six agents
- `app.js` — filters, grid, wishlist, size modal, bag, chat drawer, Data Studio, Agent Lab

## 10. How each Review 2 requirement is met

1. **Dummy frontend with product cards** — 20 branded clothing products with MRP, discount, rating, stock.
2. **Search, cart, chatbot screen** — live search + full filter sidebar; bag with price details; StyleBot drawer on every screen.
3. **Super Agent routing logic** — `superAgentRoute()` with a priority table, visible on screen through the routing tag and trace.
4. **Recommendations + price comparison** — budget-aware recommendations; 3-platform price tables; "today's offers" by discount.
5. **Order tracking, support, inventory** — 5-step timelines; returns / size exchange / cancellation flows; stock with sizes and alternatives.
6. **Tested** — 31-query accuracy run (93.5%), 3 grounding checks, and every UI flow exercised in the browser with zero console errors.

## 11. Demo script for the review (7 minutes)

1. Open `index.html`. Point at the header: categories, search, wishlist, bag — and the review strip on top.
2. Click **Men**, tick a brand filter, change sort to "Better Discount" — the grid reacts.
3. Heart two products → open **Wishlist**.
4. "Add to bag" on the jeans → size chooser → pick 32 → open **Bag** → show the price-details box → **Place order** → order id appears.
5. Click **Track it with StyleBot** → the drawer opens and the Order Agent draws the timeline for the order you just placed.
6. In the drawer, fire one message per agent: "Recommend a dress" · "Any offers today?" · "Compare prices for the denim jacket" · "Is the denim jacket in stock?" · "My t-shirt doesn't fit". Point at the routing tag each time.
7. **The closer:** open **Data Studio**, set the jacket's stock to 0, ask the stock question again — the answer flips and the dataset version in the reply proves why. Reset after.
8. Open **Agent Lab**, press run — 93.5%, show the two known failures and say why they're kept.
9. If asked about internals, open **How it works** — the pipeline, the routing table and the limitations are all on screen.

## 12. Questions they might ask, with answers

- **Where is the AI?** This review demonstrates the architecture. The routing brain is rule-based (keyword intent detection) — deterministic and easy to evaluate. In the final version the same `superAgentRoute()` function becomes an LLM API call; the six agents and the UI don't change.
- **How do you know the bot isn't hardcoded?** Data Studio. Change any number and the same question gets a different, correct answer — the reply even names the dataset version it used.
- **How accurate is it?** 93.5% routing accuracy on a 31-query labelled test set, reproducible live in the Agent Lab. The failures are analyzed, not hidden.
- **Why is it not 100%?** Keyword routing has vocabulary gaps — "how much" isn't in the price list, "package" isn't in the order list. Fixing them by adding keywords is easy; fixing the general problem is what the LLM upgrade is for.
- **Where does cloud come in?** (slide 3) Host the site, move the dataset to a cloud database so edits persist for all users, and put the agents behind an API.
- **What's the data flow?** Message → Super Agent (intent detection) → priority routing → specialized agent → live dataset read → reply with routing tag + trace + dataset version.

## 13. How to run it

- Double-click `index.html` — opens in any browser, nothing to install, works offline.
- Or from the folder: `python3 -m http.server 8080` and open `http://localhost:8080`.
