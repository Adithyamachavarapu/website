// ============================================================
// data.js — the LIVE DATASET the agents read from
//
// Everything the agents say comes from here. The Data Studio
// screen edits these objects in place, so the very next agent
// reply reflects the change (DATA_VERSION proves it).
// ============================================================

// our store is "StyleKart"; prices are also listed on two rival
// platforms so the Price Comparison Agent has something to compare
function mkSellers(base, diff1, diff2, d1, d2, d3) {
  return [
    { name: "StyleKart", price: base,         delivery: d1 },
    { name: "FashNest",  price: base + diff1, delivery: d2 },
    { name: "TrendBay",  price: base + diff2, delivery: d3 }
  ];
}

const SIZES_APPAREL = ["S", "M", "L", "XL", "XXL"];
const SIZES_SHOES   = ["6", "7", "8", "9", "10", "11"];
const SIZES_ONE     = ["One Size"];

const PRODUCTS = [
  // ---------------- MEN ----------------
  {
    id: 1, brand: "Urban Loom", name: "Slim Fit Denim Jacket", type: "jacket", color: "#5b7fa6",
    category: "Men", price: 2199, mrp: 3599, rating: 4.4, reviews: 2310, stock: 3,
    sizes: SIZES_APPAREL, desc: "Mid-wash denim, button front, two chest pockets.",
    keywords: ["jacket", "jackets", "denim jacket"],
    sellers: mkSellers(2199, 150, -100, "2 days", "3 days", "5 days")
  },
  {
    id: 2, brand: "Roadside Supply", name: "Graphic Print T-shirt", type: "tshirt", color: "#2f3542",
    category: "Men", price: 699, mrp: 1299, rating: 4.2, reviews: 5120, stock: 42,
    sizes: SIZES_APPAREL, desc: "100% cotton, oversized fit, front graphic print.",
    keywords: ["t-shirt", "tshirt", "t shirt", "tee", "t-shirts", "tshirts", "tees", "graphic tee"],
    sellers: mkSellers(699, 100, 51, "1 day", "2 days", "3 days")
  },
  {
    id: 3, brand: "DapperDen", name: "Oxford Cotton Shirt", type: "shirt", color: "#a8c6e8",
    category: "Men", price: 1399, mrp: 2499, rating: 4.5, reviews: 1870, stock: 18,
    sizes: SIZES_APPAREL, desc: "Classic oxford weave, button-down collar, regular fit.",
    keywords: ["shirt", "shirts", "oxford", "formal shirt"],
    sellers: mkSellers(1399, -80, 120, "2 days", "4 days", "2 days")
  },
  {
    id: 4, brand: "HiStreet", name: "Slim Fit Stretch Jeans", type: "jeans", color: "#3b4a6b",
    category: "Men", price: 1499, mrp: 2999, rating: 4.3, reviews: 3400, stock: 25,
    sizes: ["28", "30", "32", "34", "36"], desc: "Mid-rise, stretchable denim, slim through the leg.",
    keywords: ["jeans", "denim", "slim fit"],
    sellers: mkSellers(1499, 200, 100, "2 days", "3 days", "4 days")
  },
  {
    id: 5, brand: "Breeze & Co", name: "Linen Blend Kurta", type: "kurta", color: "#d9c7a7",
    category: "Men", price: 1099, mrp: 1999, rating: 4.1, reviews: 940, stock: 12,
    sizes: SIZES_APPAREL, desc: "Breathable linen blend, band collar, side slits.",
    keywords: ["kurta", "kurtas", "linen kurta", "ethnic wear"],
    sellers: mkSellers(1099, 120, 60, "3 days", "3 days", "5 days")
  },

  // ---------------- WOMEN ----------------
  {
    id: 6, brand: "Lushh", name: "Floral Summer Dress", type: "dress", color: "#e86f8e",
    category: "Women", price: 1799, mrp: 3199, rating: 4.6, reviews: 2750, stock: 16,
    sizes: ["XS", "S", "M", "L", "XL"], desc: "A-line fit, floral print, flowy knee-length skirt.",
    keywords: ["dress", "dresses", "floral dress", "summer dress", "gown"],
    sellers: mkSellers(1799, 150, -120, "2 days", "2 days", "4 days")
  },
  {
    id: 7, brand: "Veda", name: "Ethnic Printed Kurti", type: "kurta", color: "#4f9e97",
    category: "Women", price: 899, mrp: 1799, rating: 4.4, reviews: 4100, stock: 30,
    sizes: SIZES_APPAREL, desc: "Straight cut, block print, three-quarter sleeves.",
    keywords: ["kurti", "kurtis"],
    sellers: mkSellers(899, 80, 150, "1 day", "3 days", "3 days")
  },
  {
    id: 8, brand: "HiStreet", name: "High-Rise Skinny Jeans", type: "jeans", color: "#23262e",
    category: "Women", price: 1599, mrp: 3199, rating: 4.5, reviews: 2900, stock: 20,
    sizes: ["26", "28", "30", "32", "34"], desc: "High-rise waist, ankle length, soft stretch denim.",
    keywords: ["jeans", "denim", "high rise", "skinny jeans"],
    sellers: mkSellers(1599, 100, 200, "2 days", "2 days", "5 days")
  },
  {
    id: 9, brand: "Breeze & Co", name: "Ribbed Knit Top", type: "tshirt", color: "#b9a7e0",
    category: "Women", price: 549, mrp: 1099, rating: 4.0, reviews: 1650, stock: 35,
    sizes: ["XS", "S", "M", "L"], desc: "Fitted ribbed knit, round neck, everyday basic.",
    keywords: ["top", "tops", "ribbed top", "knit top"],
    sellers: mkSellers(549, 50, 100, "2 days", "3 days", "3 days")
  },
  {
    id: 10, brand: "Urban Loom", name: "Oversized Fleece Hoodie", type: "hoodie", color: "#9db39a",
    category: "Women", price: 1299, mrp: 2599, rating: 4.7, reviews: 3900, stock: 8,
    sizes: SIZES_APPAREL, desc: "Brushed fleece inside, drop shoulders, kangaroo pocket.",
    keywords: ["hoodie", "hoodies", "sweatshirt"],
    sellers: mkSellers(1299, -60, 140, "2 days", "4 days", "2 days")
  },

  // ---------------- KIDS ----------------
  {
    id: 11, brand: "MiniHi", name: "Cartoon Print Tee", type: "tshirt", color: "#f5c242",
    category: "Kids", price: 399, mrp: 799, rating: 4.3, reviews: 2100, stock: 48,
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], desc: "Soft cotton, fun cartoon print, easy wash.",
    keywords: ["t-shirt", "tshirt", "tee", "kids tee", "cartoon"],
    sellers: mkSellers(399, 50, 30, "2 days", "2 days", "3 days")
  },
  {
    id: 12, brand: "MiniHi", name: "Denim Dungaree Set", type: "jeans", color: "#7191b8",
    category: "Kids", price: 999, mrp: 1899, rating: 4.2, reviews: 860, stock: 14,
    sizes: ["2-3Y", "4-5Y", "6-7Y"], desc: "Dungaree with tee, adjustable straps, side buttons.",
    keywords: ["dungaree", "dungarees", "overalls"],
    sellers: mkSellers(999, 100, 150, "3 days", "3 days", "4 days")
  },

  // ---------------- FOOTWEAR ----------------
  {
    id: 13, brand: "StrideMax", name: "Flex Running Shoes", type: "sneaker", color: "#d94f4f",
    category: "Footwear", price: 2799, mrp: 4999, rating: 4.4, reviews: 6200, stock: 22,
    sizes: SIZES_SHOES, desc: "Lightweight mesh, cushioned midsole, daily running.",
    keywords: ["shoes", "shoe", "sneakers", "sneaker", "running shoes"],
    sellers: mkSellers(2799, 200, -150, "2 days", "3 days", "4 days")
  },
  {
    id: 14, brand: "DapperDen", name: "Leather Penny Loafers", type: "sneaker", color: "#7a5230",
    category: "Footwear", price: 2499, mrp: 4499, rating: 4.3, reviews: 1400, stock: 10,
    sizes: SIZES_SHOES, desc: "Genuine leather upper, cushioned insole, office ready.",
    keywords: ["loafers", "loafer", "leather shoes", "formal shoes", "shoes"],
    sellers: mkSellers(2499, 250, 100, "3 days", "3 days", "5 days")
  },
  {
    id: 15, brand: "Lushh", name: "Block Heel Sandals", type: "heel", color: "#d98aa8",
    category: "Footwear", price: 1899, mrp: 3499, rating: 4.5, reviews: 2240, stock: 0,
    sizes: ["4", "5", "6", "7", "8"], desc: "2.5 inch block heel, ankle strap, party wear.",
    keywords: ["heels", "heel", "block heels", "sandals"],
    sellers: mkSellers(1899, 150, 200, "2 days", "4 days", "3 days")
  },
  {
    id: 16, brand: "MiniHi", name: "Velcro Play Sneakers", type: "sneaker", color: "#58a4d6",
    category: "Footwear", price: 1199, mrp: 2199, rating: 4.1, reviews: 780, stock: 26,
    sizes: ["8C", "9C", "10C", "11C", "12C"], desc: "No-lace velcro, anti-skid sole, playground proof.",
    keywords: ["sneakers", "kids shoes", "velcro"],
    sellers: mkSellers(1199, 100, 80, "2 days", "2 days", "4 days")
  },

  // ---------------- ACCESSORIES ----------------
  {
    id: 17, brand: "TickTock", name: "Classic Analog Watch", type: "watch", color: "#6b4a2f",
    category: "Accessories", price: 2299, mrp: 4599, rating: 4.6, reviews: 3100, stock: 15,
    sizes: SIZES_ONE, desc: "Leather strap, minimal dial, splash resistant.",
    keywords: ["watch", "watches", "analog watch"],
    sellers: mkSellers(2299, -100, 250, "2 days", "4 days", "3 days")
  },
  {
    id: 18, brand: "Urban Loom", name: "Canvas Laptop Backpack", type: "backpack", color: "#6f7f5a",
    category: "Accessories", price: 1599, mrp: 2999, rating: 4.4, reviews: 2500, stock: 19,
    sizes: SIZES_ONE, desc: "25 L, padded 15\" laptop sleeve, water repellent.",
    keywords: ["backpack", "backpacks", "bag", "bags", "laptop bag"],
    sellers: mkSellers(1599, 120, 60, "2 days", "3 days", "3 days")
  },
  {
    id: 19, brand: "Lushh", name: "Everyday Tote Bag", type: "tote", color: "#c9a05a",
    category: "Accessories", price: 1299, mrp: 2399, rating: 4.2, reviews: 1300, stock: 21,
    sizes: SIZES_ONE, desc: "Vegan leather, roomy main pocket, magnetic snap.",
    keywords: ["tote", "tote bag", "handbag", "bag", "bags"],
    sellers: mkSellers(1299, 100, 150, "2 days", "2 days", "4 days")
  },
  {
    id: 20, brand: "HiStreet", name: "Classic Baseball Cap", type: "cap", color: "#2d3f63",
    category: "Accessories", price: 499, mrp: 999, rating: 4.0, reviews: 950, stock: 40,
    sizes: SIZES_ONE, desc: "Cotton twill, curved brim, adjustable strap.",
    keywords: ["cap", "caps", "hat", "hats"],
    sellers: mkSellers(499, 60, 30, "1 day", "2 days", "3 days")
  }
];

// ---------- dummy orders (for the Order Tracking Agent) ----------
const ORDERS = [
  {
    id: "ORD1001",
    items: ["Urban Loom Slim Fit Denim Jacket (M)"],
    total: 2199,
    placed: "10 Oct 2026",
    eta: "15 Oct 2026",
    status: "Out for delivery",
    steps: [
      { label: "Order placed · 10 Oct", done: true },
      { label: "Packed · 11 Oct", done: true },
      { label: "Shipped · 12 Oct", done: true },
      { label: "Out for delivery · 14 Oct", done: true },
      { label: "Delivered (expected 15 Oct)", done: false }
    ]
  },
  {
    id: "ORD1002",
    items: ["StrideMax Flex Running Shoes (8)", "HiStreet Baseball Cap"],
    total: 3298,
    placed: "11 Oct 2026",
    eta: "17 Oct 2026",
    status: "Shipped",
    steps: [
      { label: "Order placed · 11 Oct", done: true },
      { label: "Packed · 12 Oct", done: true },
      { label: "Shipped · 13 Oct", done: true },
      { label: "Out for delivery", done: false },
      { label: "Delivered (expected 17 Oct)", done: false }
    ]
  },
  {
    id: "ORD1003",
    items: ["Lushh Floral Summer Dress (S)"],
    total: 1799,
    placed: "2 Oct 2026",
    eta: "6 Oct 2026",
    status: "Delivered",
    steps: [
      { label: "Order placed · 2 Oct", done: true },
      { label: "Packed · 3 Oct", done: true },
      { label: "Shipped · 4 Oct", done: true },
      { label: "Out for delivery · 6 Oct", done: true },
      { label: "Delivered · 6 Oct", done: true }
    ]
  }
];

let NEXT_ORDER_NUM = 1004;

// ---------- dataset versioning ----------
// bumped on every Data Studio edit; shown in every agent trace,
// which proves the agents read the dataset LIVE, not a copy
let DATA_VERSION = 1;
const EDIT_LOG = [];

// ============================================================
// TEST_SET — the agent evaluation dataset (used by Agent Lab)
// 31 real user queries with the agent each SHOULD route to.
// Two are intentionally kept as known failures (vocabulary gaps)
// so the accuracy score is honest — they're discussed under
// Limitations on the How It Works screen.
// ============================================================
const TEST_SET = [
  // product discovery
  { q: "show me jeans",                         expect: "product" },
  { q: "I am looking for a denim jacket",       expect: "product" },
  { q: "do you have kurtas",                    expect: "product" },
  { q: "show me something for women",           expect: "product" },
  { q: "search sneakers",                       expect: "product" },
  // recommendations
  { q: "recommend a dress",                     expect: "recommend" },
  { q: "suggest shoes under 2000",              expect: "recommend" },
  { q: "best jacket for winter",                expect: "recommend" },
  { q: "what should I wear to a party",         expect: "recommend" },
  { q: "recommend me a watch",                  expect: "recommend" },
  // price comparison / offers
  { q: "compare prices for the denim jacket",   expect: "price" },
  { q: "cheapest running shoes",                expect: "price" },
  { q: "price of the floral dress",             expect: "price" },
  { q: "any offers today",                      expect: "price" },
  { q: "show me deals on t-shirts",             expect: "price" },
  // order tracking
  { q: "track my order ORD1001",                expect: "order" },
  { q: "where is my order",                     expect: "order" },
  { q: "order status of ORD1002",               expect: "order" },
  { q: "track ORD9999",                         expect: "order" },
  // inventory
  { q: "is the denim jacket in stock",          expect: "inventory" },
  { q: "how many block heels are left",         expect: "inventory" },
  { q: "stock report",                          expect: "inventory" },
  { q: "is size M available for the oxford shirt", expect: "inventory" },
  // support
  { q: "I want to return my jeans",             expect: "support" },
  { q: "cancel order ORD1003",                  expect: "support" },
  { q: "my payment failed",                     expect: "support" },
  { q: "the t-shirt doesn't fit, exchange it",  expect: "support" },
  { q: "I need help",                           expect: "support" },
  // greeting / fallback
  { q: "hello",                                 expect: "super" },
  // known limitations (vocabulary gaps — expected to FAIL)
  { q: "my package hasn't arrived yet",         expect: "order",  knownLimit: true },
  { q: "how much is the summer dress",          expect: "price",  knownLimit: true }
];
