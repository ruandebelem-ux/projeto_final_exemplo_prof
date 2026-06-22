// ================================
// CONTADOR ANIMADO
// ================================

const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {

    const updateCounter = () => {

        const target = +counter.dataset.target;
        const count = +counter.innerText;

        const increment = target / 100;

        if (count < target) {

            counter.innerText =
                Math.ceil(count + increment);

            setTimeout(updateCounter, 20);

        } else {

            counter.innerText = target;

        }

    }

    updateCounter();

});

// ================================
// SCROLL ANIMATION
// ================================

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add('show');

        }

    });

});

document.querySelectorAll('section').forEach(section => {

    section.classList.add('fade-in');

    observer.observe(section);

});

// ================================
// NAVBAR SCROLL
// ================================

window.addEventListener('scroll', () => {

    const nav =
        document.querySelector('.custom-navbar');

    if (window.scrollY > 50) {

        nav.style.background =
            "#8d2d00";

    } else {

        nav.style.background =
            "rgba(24,13,8,.85)";

    }

});

/* ================================
   Simple cart + product filters
   ================================ */

// Cart implementation (persists in localStorage)
const cartKey = 'cozybean_cart_v1';
let cart = JSON.parse(localStorage.getItem(cartKey) || '{}');

const formatCurrency = (value) => {
    return 'R$ ' + Number(value).toFixed(2).replace('.', ',');
}

function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
}

function updateCartCount() {
    const count = Object.values(cart).reduce((s, item) => s + item.quantity, 0);
    const el = document.getElementById('cartCount');
    if (el) el.innerText = count;
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    if (!container || !totalEl) return;
    container.innerHTML = '';
    let total = 0;
    for (const id in cart) {
        const item = cart[id];
        const li = document.createElement('div');
        li.className = 'list-group-item';
        li.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="fw-semibold">${item.name}</div>
            </div>
            <div class="text-end">
                <div class="small text-muted">${formatCurrency(item.price)}</div>
                <div class="mt-1">Qty: ${item.quantity} <button class="btn btn-link btn-sm text-danger remove-item" data-id="${id}">Remover</button></div>
            </div>
        `;
        container.appendChild(li);
        total += item.price * item.quantity;
    }
    totalEl.innerText = formatCurrency(total);
}

function addToCart(id, name, price) {
    if (!cart[id]) cart[id] = { id, name, price: Number(price), quantity: 0 };
    cart[id].quantity += 1;
    saveCart();
    updateCartCount();
    renderCartItems();
}

function removeFromCart(id) {
    if (!cart[id]) return;
    delete cart[id];
    saveCart();
    updateCartCount();
    renderCartItems();
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart')) {
        const btn = e.target.closest('.add-to-cart');
        addToCart(btn.dataset.id, btn.dataset.name, btn.dataset.price);
    }
    if (e.target.closest('.remove-item')) {
        const id = e.target.closest('.remove-item').dataset.id;
        removeFromCart(id);
    }
});

// Filters for products page
document.addEventListener('DOMContentLoaded', () => {
    // init cart & UI
    updateCartCount();
    renderCartItems();

    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => btn.addEventListener('click', (ev) => {
        const filter = btn.dataset.filter;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.product-item').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }));
});