/* ================================================
   js/data.js  — feature/ui-base
   Central product data store. All other modules
   import from window.STORE
   ================================================ */

window.STORE = {
  products: [
    {
      id: 1,
      name: "MacBook Air M3",
      category: "mac",
      subcategory: "macbook-air",
      price: 1299,
      emoji: "💻",
      badge: "new",
      desc: "Supercharged by M3. Up to 18 hours battery life.",
      tags: ["laptop", "mac", "portable"]
    },
    {
      id: 2,
      name: "MacBook Pro 14\"",
      category: "mac",
      subcategory: "macbook-pro",
      price: 1999,
      originalPrice: 2199,
      emoji: "💻",
      badge: "sale",
      desc: "The most powerful MacBook Pro ever. M3 Pro chip.",
      tags: ["laptop", "pro", "mac"]
    },
    {
      id: 3,
      name: "iPhone 16 Pro",
      category: "iphone",
      subcategory: "iphone-16-pro",
      price: 999,
      emoji: "📱",
      badge: "new",
      desc: "Titanium. So strong. So light. So Pro.",
      tags: ["phone", "iphone", "pro"]
    },
    {
      id: 4,
      name: "iPhone 16",
      category: "iphone",
      subcategory: "iphone-16",
      price: 799,
      emoji: "📱",
      desc: "All-new Camera Control. A18 chip.",
      tags: ["phone", "iphone"]
    },
    {
      id: 5,
      name: "AirLuma Pro",
      category: "audio",
      subcategory: "airpods",
      price: 249,
      emoji: "🎧",
      badge: "new",
      desc: "Spatial audio. Adaptive transparency. All-day battery.",
      tags: ["audio", "airpods", "wireless"]
    },
    {
      id: 6,
      name: "AirLuma Max",
      category: "audio",
      subcategory: "headphones",
      price: 549,
      emoji: "🎧",
      desc: "Premium over-ear headphones with 40hr battery.",
      tags: ["audio", "headphones", "premium"]
    },
    {
      id: 7,
      name: "iMac 24\"",
      category: "mac",
      subcategory: "imac",
      price: 1299,
      emoji: "🖥️",
      desc: "Strikingly thin. Strikingly powerful. M3 chip.",
      tags: ["desktop", "mac", "imac"]
    },
    {
      id: 8,
      name: "MagSafe Charger",
      category: "accessories",
      subcategory: "accessories",
      price: 39,
      emoji: "🔌",
      desc: "Attach. Charge. Perfectly aligned every time.",
      tags: ["accessories", "charger", "magsafe"]
    },
    {
      id: 9,
      name: "LumaCase Pro",
      category: "accessories",
      subcategory: "iphone-cases",
      price: 59,
      emoji: "📦",
      badge: "new",
      desc: "FineWoven material. Precise cutouts. MagSafe compatible.",
      tags: ["accessories", "case", "iphone"]
    },
    {
      id: 10,
      name: "Mac Mini M3",
      category: "mac",
      subcategory: "mac-mini",
      price: 599,
      emoji: "🖥️",
      desc: "More ports. More performance. M3 chip inside.",
      tags: ["desktop", "mac", "compact"]
    },
    {
      id: 11,
      name: "LumaSpeaker",
      category: "audio",
      subcategory: "speakers",
      price: 299,
      emoji: "🔊",
      desc: "360° spatial audio fills any room perfectly.",
      tags: ["audio", "speaker", "home"]
    },
    {
      id: 12,
      name: "iPhone 15",
      category: "iphone",
      subcategory: "iphone-15",
      price: 699,
      originalPrice: 799,
      emoji: "📱",
      badge: "sale",
      desc: "Dynamic Island. 48MP camera. USB-C.",
      tags: ["phone", "iphone"]
    }
  ],

  getFeatured() {
    return this.products.filter(p => p.badge === "new").slice(0, 4);
  },

  getByCategory(cat) {
    if (!cat) return this.products;
    return this.products.filter(p =>
      p.category === cat || p.subcategory === cat
    );
  },

  getById(id) {
    return this.products.find(p => p.id === Number(id));
  },

  search(query) {
    const q = query.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    );
  },

  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  }
};
