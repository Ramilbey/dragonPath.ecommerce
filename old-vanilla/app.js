// DragonPath E-commerce - Main Application

// State Management
let currentUser = null;
let selectedProduct = null;
let selectedQuantity = 1;
let activeCategory = null;
let savedLocations = [];

// DOM Elements
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const mainApp = document.getElementById('mainApp');
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');
const categoriesGrid = document.getElementById('categoriesGrid');
const productsGrid = document.getElementById('productsGrid');
const productsTitle = document.getElementById('productsTitle');
const showAllBtn = document.getElementById('showAllBtn');
const productModal = document.getElementById('productModal');
const deliveryModal = document.getElementById('deliveryModal');
const successModal = document.getElementById('successModal');

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    checkExistingUser();
    setupEventListeners();
});

// Check for existing user in localStorage
function checkExistingUser() {
    const savedUser = localStorage.getItem('dragonPathUser');
    const savedLocs = localStorage.getItem('dragonPathLocations');

    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        if (savedLocs) {
            savedLocations = JSON.parse(savedLocs);
        }
        showMainApp();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Auth Form
    authForm.addEventListener('submit', handleAuth);

    // Search
    searchInput.addEventListener('input', handleSearch);
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim()) {
            handleSearch({ target: searchInput });
        }
    });
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) {
            searchSuggestions.classList.add('hidden');
        }
    });

    // Show All Products
    showAllBtn.addEventListener('click', () => {
        activeCategory = null;
        renderProducts();
        document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
    });

    // Product Modal
    document.getElementById('closeProductModal').addEventListener('click', closeProductModal);
    document.getElementById('qtyMinus').addEventListener('click', () => updateQuantity(-1));
    document.getElementById('qtyPlus').addEventListener('click', () => updateQuantity(1));
    document.getElementById('quantityInput').addEventListener('change', handleQuantityChange);
    document.getElementById('orderNowBtn').addEventListener('click', openDeliveryModal);

    // Delivery Modal
    document.getElementById('closeDeliveryModal').addEventListener('click', closeDeliveryModal);
    document.getElementById('deliveryForm').addEventListener('submit', handleOrder);

    // Success Modal
    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
        successModal.classList.add('hidden');
    });

    // Close modals on backdrop click
    [productModal, deliveryModal, successModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

// Handle Authentication
function handleAuth(e) {
    e.preventDefault();

    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();

    if (name && email && phone) {
        currentUser = { name, email, phone };
        localStorage.setItem('dragonPathUser', JSON.stringify(currentUser));
        showMainApp();
    }
}

// Show Main Application
function showMainApp() {
    authModal.classList.add('hidden');
    mainApp.classList.remove('hidden');

    // Update user initial
    document.getElementById('userInitial').textContent = currentUser.name.charAt(0).toUpperCase();

    // Render content
    renderCategories();
    renderProducts();
}

// Render Categories
function renderCategories() {
    categoriesGrid.innerHTML = categories.map(cat => `
        <div class="category-card" data-category="${cat.id}">
            <img src="${cat.image}" alt="${cat.name}" class="category-image" loading="lazy">
            <div class="category-name">${cat.name}</div>
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            const categoryId = card.dataset.category;
            activeCategory = categoryId;

            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            renderProducts(categoryId);
        });
    });
}

// Render Products
function renderProducts(categoryFilter = null) {
    let filteredProducts = products;

    if (categoryFilter) {
        filteredProducts = products.filter(p => p.category === categoryFilter);
        const category = categories.find(c => c.id === categoryFilter);
        productsTitle.textContent = category ? category.name : 'Products';
    } else {
        productsTitle.textContent = 'All Products';
    }

    productsGrid.innerHTML = filteredProducts.map(product => {
        const stockClass = product.stock <= 3 ? 'low' : product.stock === 0 ? 'out' : 'in';
        const stockText = product.stock <= 3 ? `Only ${product.stock} left!` : `${product.stock} in stock`;

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
                    <span class="stock-badge ${stockClass}">${stockText}</span>
                </div>
                <div class="product-details">
                    <div class="product-category">${getCategoryName(product.category)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price-row">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="view-btn">View Details</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add click listeners
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
            const productId = parseInt(card.dataset.productId);
            openProductModal(productId);
        });
    });
}

// Get Category Name
function getCategoryName(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
}

// Handle Search
function handleSearch(e) {
    const query = e.target.value.trim().toLowerCase();

    if (query.length < 2) {
        searchSuggestions.classList.add('hidden');
        return;
    }

    const matches = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    ).slice(0, 6);

    if (matches.length === 0) {
        searchSuggestions.classList.add('hidden');
        return;
    }

    searchSuggestions.innerHTML = matches.map(product => `
        <div class="suggestion-item" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="suggestion-image">
            <div class="suggestion-info">
                <div class="suggestion-name">${highlightMatch(product.name, query)}</div>
                <div class="suggestion-category">${getCategoryName(product.category)}</div>
            </div>
            <div class="suggestion-price">$${product.price.toFixed(2)}</div>
        </div>
    `).join('');

    searchSuggestions.classList.remove('hidden');

    // Add click listeners
    document.querySelectorAll('.suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const productId = parseInt(item.dataset.productId);
            searchSuggestions.classList.add('hidden');
            searchInput.value = '';
            openProductModal(productId);
        });
    });
}

// Highlight search match
function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
}

// Open Product Modal
function openProductModal(productId) {
    selectedProduct = products.find(p => p.id === productId);
    if (!selectedProduct) return;

    selectedQuantity = 1;

    const stockClass = selectedProduct.stock <= 3 ? 'low' : selectedProduct.stock === 0 ? 'out' : 'in';

    document.getElementById('modalProductImage').src = selectedProduct.image;
    document.getElementById('modalProductName').textContent = selectedProduct.name;
    document.getElementById('modalProductCategory').textContent = getCategoryName(selectedProduct.category);
    document.getElementById('modalProductPrice').textContent = `$${selectedProduct.price.toFixed(2)}`;
    document.getElementById('modalProductStock').textContent = `${selectedProduct.stock} units`;
    document.getElementById('modalProductStock').className = `stock-count ${stockClass}`;
    document.getElementById('modalProductDescription').textContent = selectedProduct.description;
    document.getElementById('quantityInput').value = 1;
    document.getElementById('quantityInput').max = selectedProduct.stock;

    updateTotalPrice();

    productModal.classList.remove('hidden');
}

// Close Product Modal
function closeProductModal() {
    productModal.classList.add('hidden');
    selectedProduct = null;
}

// Update Quantity
function updateQuantity(delta) {
    const input = document.getElementById('quantityInput');
    let newValue = selectedQuantity + delta;

    if (newValue < 1) newValue = 1;
    if (newValue > selectedProduct.stock) newValue = selectedProduct.stock;

    selectedQuantity = newValue;
    input.value = newValue;
    updateTotalPrice();
}

// Handle quantity input change
function handleQuantityChange(e) {
    let value = parseInt(e.target.value) || 1;

    if (value < 1) value = 1;
    if (value > selectedProduct.stock) value = selectedProduct.stock;

    selectedQuantity = value;
    e.target.value = value;
    updateTotalPrice();
}

// Update Total Price
function updateTotalPrice() {
    const total = selectedProduct.price * selectedQuantity;
    document.getElementById('modalTotalPrice').textContent = `$${total.toFixed(2)}`;
}

// Open Delivery Modal
function openDeliveryModal() {
    if (!selectedProduct) return;

    // Update order summary
    document.getElementById('summaryProductName').textContent = selectedProduct.name;
    document.getElementById('summaryQuantity').textContent = selectedQuantity;
    document.getElementById('summaryTotal').textContent = `$${(selectedProduct.price * selectedQuantity).toFixed(2)}`;

    // Show saved locations if any
    renderSavedLocations();

    // Pre-fill default location if exists
    const defaultLocation = savedLocations.find(loc => loc.isDefault);
    if (defaultLocation) {
        fillLocationForm(defaultLocation);
    }

    closeProductModal();
    deliveryModal.classList.remove('hidden');
}

// Render Saved Locations
function renderSavedLocations() {
    const section = document.getElementById('savedLocationsSection');
    const list = document.getElementById('savedLocationsList');

    if (savedLocations.length === 0) {
        section.classList.add('hidden');
        return;
    }

    section.classList.remove('hidden');
    list.innerHTML = savedLocations.map((loc, index) => `
        <div class="saved-location-item ${loc.isDefault ? 'default' : ''}" data-location-index="${index}">
            <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span class="location-text">${loc.addressLine1}, ${loc.city}, ${loc.country}</span>
            ${loc.isDefault ? '<span class="default-badge">Default</span>' : ''}
        </div>
    `).join('');

    // Add click listeners
    document.querySelectorAll('.saved-location-item').forEach(item => {
        item.addEventListener('click', () => {
            const index = parseInt(item.dataset.locationIndex);
            fillLocationForm(savedLocations[index]);
        });
    });
}

// Fill location form
function fillLocationForm(location) {
    document.getElementById('addressLine1').value = location.addressLine1 || '';
    document.getElementById('addressLine2').value = location.addressLine2 || '';
    document.getElementById('city').value = location.city || '';
    document.getElementById('state').value = location.state || '';
    document.getElementById('postalCode').value = location.postalCode || '';
    document.getElementById('country').value = location.country || '';
}

// Close Delivery Modal
function closeDeliveryModal() {
    deliveryModal.classList.add('hidden');
}

// Handle Order
function handleOrder(e) {
    e.preventDefault();

    const location = {
        addressLine1: document.getElementById('addressLine1').value.trim(),
        addressLine2: document.getElementById('addressLine2').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        postalCode: document.getElementById('postalCode').value.trim(),
        country: document.getElementById('country').value.trim(),
        isDefault: document.getElementById('saveAsDefault').checked
    };

    // Save location if checkbox is checked
    if (location.isDefault) {
        // Remove default from other locations
        savedLocations.forEach(loc => loc.isDefault = false);

        // Check if this location already exists
        const existingIndex = savedLocations.findIndex(loc =>
            loc.addressLine1 === location.addressLine1 && loc.city === location.city
        );

        if (existingIndex >= 0) {
            savedLocations[existingIndex] = location;
        } else {
            savedLocations.push(location);
        }

        localStorage.setItem('dragonPathLocations', JSON.stringify(savedLocations));
    }

    // Update product stock (simulate)
    const productIndex = products.findIndex(p => p.id === selectedProduct.id);
    if (productIndex >= 0) {
        products[productIndex].stock -= selectedQuantity;
    }

    // Reset form
    document.getElementById('deliveryForm').reset();

    // Close delivery modal and show success
    closeDeliveryModal();
    successModal.classList.remove('hidden');

    // Re-render products to update stock
    renderProducts(activeCategory);
}
