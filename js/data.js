/* ================================================
   js/data.js  — feature/ui-base
   Central product data store. All other modules
   import from window.STORE
   ================================================ */

window.STORE = {
  products: [
    {
      id: 1,
      name: "Classic Cotton T-Shirt",
      category: "tops",
      subcategory: "t-shirts",
      price: 89,
      emoji: "👕",
      badge: "new",
      desc: "Premium 100% cotton. Breathable and perfect for everyday wear.",
      tags: ["casual", "cotton", "top"]
    },
    {
      id: 2,
      name: "Vintage Denim Jacket",
      category: "outerwear",
      subcategory: "jackets",
      price: 299,
      originalPrice: 350,
      emoji: "🧥",
      badge: "sale",
      desc: "Timeless denim jacket with a rugged vintage wash.",
      tags: ["denim", "jacket", "vintage"]
    },
    {
      id: 3,
      name: "Summer Floral Dress",
      category: "dresses",
      subcategory: "casual-dresses",
      price: 159,
      emoji: "👗",
      badge: "new",
      desc: "Light and breezy. Perfect for warm summer days.",
      tags: ["floral", "dress", "summer"]
    },
    {
      id: 4,
      name: "Comfort Fit Jeans",
      category: "bottoms",
      subcategory: "jeans",
      price: 199,
      emoji: "👖",
      desc: "Stretch denim for all-day comfort. Classic straight fit.",
      tags: ["jeans", "denim", "bottoms"]
    },
    {
      id: 5,
      name: "Athletic Running Shoes",
      category: "shoes",
      subcategory: "sneakers",
      price: 359,
      emoji: "👟",
      badge: "new",
      desc: "Lightweight and responsive for your daily miles.",
      tags: ["shoes", "running", "athletic"]
    },
    {
      id: 6,
      name: "Classic Leather Backpack",
      category: "accessories",
      subcategory: "bags",
      price: 450,
      emoji: "🎒",
      desc: "Premium leather. Spacious with dedicated laptop sleeve.",
      tags: ["bag", "leather", "backpack"]
    },
    {
      id: 7,
      name: "Cozy Knit Sweater",
      category: "tops",
      subcategory: "sweaters",
      price: 229,
      emoji: "🧶",
      desc: "Chunky knit sweater for chilly evenings.",
      tags: ["sweater", "knit", "warm"]
    },
    {
      id: 8,
      name: "Silk Scarf",
      category: "accessories",
      subcategory: "scarves",
      price: 89,
      emoji: "🧣",
      desc: "100% silk. Adds a pop of color to any outfit.",
      tags: ["accessory", "silk", "scarf"]
    },
    {
      id: 9,
      name: "Urban Cargo Pants",
      category: "bottoms",
      subcategory: "pants",
      price: 179,
      emoji: "👖",
      badge: "new",
      desc: "Durable and stylish with multiple pockets.",
      tags: ["pants", "cargo", "urban"]
    },
    {
      id: 10,
      name: "Minimalist Baseball Cap",
      category: "accessories",
      subcategory: "hats",
      price: 59,
      emoji: "🧢",
      desc: "Cotton twill cap with adjustable strap.",
      tags: ["hat", "cap", "minimal"]
    },
    {
      id: 11,
      name: "Elegant Evening Gown",
      category: "dresses",
      subcategory: "formal",
      price: 599,
      emoji: "💃",
      desc: "Stunning silhouette for your most special occasions.",
      tags: ["dress", "formal", "elegant"]
    },
    {
      id: 12,
      name: "Graphic Print Hoodie",
      category: "outerwear",
      subcategory: "hoodies",
      price: 189,
      originalPrice: 220,
      emoji: "🧥",
      badge: "sale",
      desc: "Soft fleece lining with unique street-style graphic.",
      tags: ["hoodie", "graphic", "streetwear"]
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
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0
    }).format(price);
  }
};
