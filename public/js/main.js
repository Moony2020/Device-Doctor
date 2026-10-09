// Hamburger Menu Logic
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Fetch and Display Products
const productGrid = document.getElementById('productGrid');

async function loadProducts() {
    if (!productGrid) return;

    try {
        const res = await fetch('/api/products');
        const products = await res.json();

        productGrid.innerHTML = ''; // Clear loading text

        if (products.length === 0) {
            productGrid.innerHTML = '<p>Inga produkter tillgängliga just nu.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            // Use placeholder if image fails or empty
            const imgUrl = product.image || 'images/img1.png';

            card.innerHTML = `
                <img src="${imgUrl}" alt="${product.name}">
                <div class="product-info">
                    <div>
                        <div class="product-title">${product.name}</div>
                        <p style="font-size: 0.9rem; color: #666;">${product.category}</p>
                    </div>
                    <div class="product-price">${product.price} SEK</div>
                </div>
            `;
            productGrid.appendChild(card);
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        productGrid.innerHTML = '<p>Kunde inte ladda produkter.</p>';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});
