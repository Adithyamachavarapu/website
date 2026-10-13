# StyleKart — E-commerce with an AI Super Agent

A Myntra-style clothing store where one **Super Agent** chatbot routes every request to the right specialized agent — product discovery, recommendations, price comparison, order tracking, customer support and inventory. Built as a working prototype for my Review 2 project.

**Live demo:** https://adithyamachavarapu.github.io/stylekart-super-agent/

No backend, no frameworks, no build step. Pure HTML + CSS + JavaScript on dummy data — clone it, open `index.html`, done.

## What's inside

**The store (Myntra-style)**
- 20 branded clothing products across Men / Women / Kids / Footwear / Accessories
- Filter sidebar (brand, price, discount, rating), sort, live search
- Wishlist, size chooser, bag with MRP/discount price details
- Checkout creates a real order id the chatbot can track
- Product images are drawn in code (SVG) — works fully offline

**StyleBot — the Super Agent (slide-in chat drawer)**
- One function, `superAgentRoute()` in [`agents.js`](agents.js), reads every message and routes it through a priority table to one of six agents
- Every reply shows the routing tag ("Super Agent → Price Comparison Agent"), the detected intent, and the dataset version it answered from
- Whole-word, score-ranked product matching ("denim jacket" beats "denim")

**Review tools (top strip)**
- **Data Studio** — the live dataset, fully editable. Change a price or stock and the agent's next answer reflects it; every edit bumps the dataset version and lands in an edit log
- **Agent Lab** — a 31-query labelled test set runs through the live router: **93.5% routing accuracy**, per-agent breakdown, plus data-grounding checks. The two failures are kept on purpose as documented vocabulary gaps
- **How it works** — the routing pipeline, the priority table, and an honest limitations list

## Try these in the chat

```
Recommend a dress
Any offers today?
Compare prices for the denim jacket
Track order ORD1001
Is the denim jacket in stock?
My t-shirt doesn't fit
```

## The grounding demo

1. Ask StyleBot: *"Is the denim jacket in stock?"* → "Only 3 left"
2. Open **Data Studio**, set that stock to **0**
3. Ask again → "Out of stock", with an alternative — and the reply names the new dataset version

Same question, different data, different answer. That's how you know nothing is hardcoded.

## Files

| File | What it does |
|---|---|
| `index.html` | all screens: shop, wishlist, bag, Agent Lab, Data Studio, How it works, chat drawer |
| `style.css` | the Myntra-style design |
| `art.js` | SVG product illustrations (no image files) |
| `data.js` | the live dataset: products, platform prices, orders, the 31-query test set |
| `agents.js` | `superAgentRoute()` + the six agents |
| `app.js` | filters, grid, wishlist, bag, chat drawer, Data Studio, Agent Lab |
| `PROJECT-EXPLANATION.md` | point-wise explanation, demo script, viva Q&A |

## Run it locally

```bash
git clone https://github.com/AdithyaMachavarapu/stylekart-super-agent.git
cd stylekart-super-agent
open index.html
```

Or just download the ZIP and double-click `index.html`.

## Roadmap (the cloud phase)

- Swap the keyword router for an LLM API call — same six agents, same UI
- Move the dataset to a cloud database so edits persist for everyone
- Host the agents behind an API for scale

---

Built by **Adithya Machavarapu** · VIT-AP
