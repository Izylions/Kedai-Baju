# Kedai-Baju

# ◈ Izylions Store — Apple-style E-Commerce

A sleek, Apple.com-inspired e-commerce site with scroll-zoom hero, dropdown nav, user auth, cart, and wishlist.

---

## 📁 Project Structure

```
lumastore/
├── index.html              ← Homepage
├── pages/
│   └── products.html       ← Product listing page
├── css/
│   ├── base.css            ← Design tokens, reset, typography, utilities
│   ├── navbar.css          ← Frosted-glass navbar + dropdowns
│   ├── hero.css            ← Scroll-zoom hero section
│   ├── products.css        ← Product cards & grid
│   ├── cart.css            ← Slide-in cart sidebar
│   └── auth.css            ← Login/Register + Wishlist modals
└── js/
    ├── data.js             ← Product data store (window.STORE)
    ├── auth.js             ← Register/Login/Logout (window.AUTH)
    ├── cart.js             ← Cart state + sidebar (window.CART)
    ├── wishlist.js         ← Per-user wishlist (window.WISHLIST)
    ├── navbar.js           ← Scroll behavior + search (window.NAVBAR)
    ├── scroll-zoom.js      ← Hero scroll-zoom + card reveal (window.SCROLL_ZOOM)
    ├── products.js         ← Card rendering + page (window.PRODUCTS)
    └── app.js              ← Main boot orchestrator
```

---

## 🌿 GitHub Branch Strategy

Each feature lives in its own branch. Merge into `main` when ready.

```
main
├── feature/ui-base       → base.css, hero.css, products.css, data.js, scroll-zoom.js, products.js
├── feature/navbar        → navbar.css, navbar.js (dropdown menus, scroll behavior, search)
├── feature/auth          → auth.css, auth.js (register, login, session)
├── feature/cart          → cart.css, cart.js (add/remove, qty, sidebar)
└── feature/wishlist      → wishlist.js portion of auth.css (auth-gated wishlist)
```

### 🚀 Quick Setup on GitHub

```bash
# 1. Initialize repo
git init
git remote add origin https://github.com/YOUR_USERNAME/lumastore.git

# 2. Create and push main
git checkout -b main
git add .
git commit -m "chore: initial project scaffold"
git push -u origin main

# 3. Create feature branches
git checkout -b feature/ui-base
# add base.css, hero.css, products.css, data.js, scroll-zoom.js, products.js
git add css/base.css css/hero.css css/products.css js/data.js js/scroll-zoom.js js/products.js
git commit -m "feat(ui-base): Apple-style design system + hero scroll zoom"
git push -u origin feature/ui-base

git checkout main
git checkout -b feature/navbar
# add navbar.css, navbar.js
git add css/navbar.css js/navbar.js
git commit -m "feat(navbar): frosted glass navbar with dropdown menus + search"
git push -u origin feature/navbar

git checkout main
git checkout -b feature/auth
# add auth.css, auth.js
git add css/auth.css js/auth.js
git commit -m "feat(auth): user register/login/logout with localStorage sessions"
git push -u origin feature/auth

git checkout main
git checkout -b feature/cart
# add cart.css, cart.js
git add css/cart.css js/cart.js
git commit -m "feat(cart): add-to-cart, qty controls, slide-in sidebar"
git push -u origin feature/cart

git checkout main
git checkout -b feature/wishlist
# wishlist.js (uses auth.css modal)
git add js/wishlist.js
git commit -m "feat(wishlist): per-user auth-gated wishlist with localStorage"
git push -u origin feature/wishlist
```

### 🔀 Merging Branches into Main

```bash
git checkout main

# Merge each feature branch
git merge feature/ui-base   --no-ff -m "merge: ui-base → main"
git merge feature/navbar    --no-ff -m "merge: navbar → main"
git merge feature/auth      --no-ff -m "merge: auth → main"
git merge feature/cart      --no-ff -m "merge: cart → main"
git merge feature/wishlist  --no-ff -m "merge: wishlist → main"

git push origin main
```

> **Tip:** Use GitHub Pull Requests instead of direct merges for code review workflow.

---

## ✨ Features

| Feature | Branch | Files |
|---|---|---|
| Apple-style design system | `feature/ui-base` | `css/base.css`, `css/hero.css` |
| Scroll-zoom hero | `feature/ui-base` | `js/scroll-zoom.js` |
| Dropdown navbar | `feature/navbar` | `css/navbar.css`, `js/navbar.js` |
| Search overlay | `feature/navbar` | `js/navbar.js` |
| User Register & Login | `feature/auth` | `js/auth.js`, `css/auth.css` |
| Add to Cart + Sidebar | `feature/cart` | `js/cart.js`, `css/cart.css` |
| Wishlist (auth-gated) | `feature/wishlist` | `js/wishlist.js` |
| Product filtering | `feature/ui-base` | `js/products.js` |

---

## 🌐 Deployment (GitHub Pages)

1. Go to your repo → **Settings → Pages**
2. Source: `main` branch, `/ (root)` folder
3. Your site will be live at: `https://YOUR_USERNAME.github.io/lumastore/`

---

## 🛠️ Tech Stack

- **Vanilla HTML/CSS/JS** — zero dependencies, zero build tools
- **localStorage** — user sessions, cart persistence, per-user wishlists
- **CSS Custom Properties** — full design token system
- **IntersectionObserver** — scroll-triggered card reveals
- **requestAnimationFrame** — smooth scroll-zoom performance

---

## 📐 Design Decisions

- **Dark-first** — deep blacks like Apple.com at night
- **Instrument Serif + DM Sans** — editorial serif meets clean sans
- **Modular JS** — each feature is a self-contained `window.FEATURE` object
- **No framework** — pure JS means any branch works without build step
- **localStorage** — no backend needed; swap with real API later
