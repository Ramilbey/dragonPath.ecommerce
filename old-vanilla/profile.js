// DragonPath - Profile Page JavaScript

// ===== State Management =====
let currentUser = null;
let shippingAddresses = [];
let billingAddresses = [];
let paymentMethods = [];
let orders = [];
let wishlist = [];
let loginActivity = [];
let pointsHistory = [];
let preferences = {};

// ===== DOM Elements =====
const profileSections = document.querySelectorAll('.content-section');
const navItems = document.querySelectorAll('.nav-item');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupNavigation();
    setupEventListeners();
    loadMockData();
    renderAllSections();
});

// ===== Load User Data =====
function loadUserData() {
    const savedUser = localStorage.getItem('dragonPathUser');
    if (!savedUser) {
        window.location.href = 'index.html';
        return;
    }
    currentUser = JSON.parse(savedUser);

    // Load saved preferences
    const savedPrefs = localStorage.getItem('dragonPathPreferences');
    if (savedPrefs) preferences = JSON.parse(savedPrefs);

    // Load addresses
    const savedShipping = localStorage.getItem('dragonPathShipping');
    if (savedShipping) shippingAddresses = JSON.parse(savedShipping);

    const savedBilling = localStorage.getItem('dragonPathBilling');
    if (savedBilling) billingAddresses = JSON.parse(savedBilling);

    // Load payment methods
    const savedPayments = localStorage.getItem('dragonPathPayments');
    if (savedPayments) paymentMethods = JSON.parse(savedPayments);

    // Load wishlist
    const savedWishlist = localStorage.getItem('dragonPathWishlist');
    if (savedWishlist) wishlist = JSON.parse(savedWishlist);

    // Update header
    updateHeader();
}

// ===== Update Header =====
function updateHeader() {
    document.getElementById('userInitial').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('avatarInitial').textContent = currentUser.name.charAt(0).toUpperCase();
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;

    // Fill personal info form
    document.getElementById('fullName').value = currentUser.name || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('dob').value = currentUser.dob || '';

    if (currentUser.gender) {
        document.querySelector(`input[name="gender"][value="${currentUser.gender}"]`).checked = true;
    }
}

// ===== Load Mock Data =====
function loadMockData() {
    // Mock orders if empty
    if (!localStorage.getItem('dragonPathOrders')) {
        orders = [
            {
                id: 'DP-2026-001234',
                date: '2026-01-20',
                status: 'delivered',
                total: 549.98,
                items: [
                    { productId: 1, name: 'Premium Wireless Headphones Pro', quantity: 1, price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
                    { productId: 13, name: 'Luxury Skincare Set', quantity: 1, price: 249.99, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100' }
                ]
            },
            {
                id: 'DP-2026-001189',
                date: '2026-01-15',
                status: 'shipped',
                total: 179.99,
                items: [
                    { productId: 12, name: 'Running Shoes Elite', quantity: 1, price: 179.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' }
                ]
            },
            {
                id: 'DP-2026-001145',
                date: '2026-01-10',
                status: 'processing',
                total: 449.99,
                items: [
                    { productId: 2, name: 'Smart Watch Series X', quantity: 1, price: 449.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' }
                ]
            },
            {
                id: 'DP-2025-009876',
                date: '2025-12-25',
                status: 'cancelled',
                total: 89.99,
                items: [
                    { productId: 10, name: 'Professional Yoga Mat', quantity: 1, price: 89.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=100' }
                ]
            }
        ];
        localStorage.setItem('dragonPathOrders', JSON.stringify(orders));
    } else {
        orders = JSON.parse(localStorage.getItem('dragonPathOrders'));
    }

    // Mock login activity
    loginActivity = [
        { device: '💻', deviceName: 'Chrome on Windows', location: 'New York, USA', time: 'Now', current: true },
        { device: '📱', deviceName: 'Safari on iPhone', location: 'New York, USA', time: '2 hours ago', current: false },
        { device: '💻', deviceName: 'Firefox on Mac', location: 'Brooklyn, USA', time: 'Yesterday', current: false }
    ];

    // Mock points history
    pointsHistory = [
        { description: 'Purchase: Order #DP-2026-001234', date: 'Jan 20, 2026', amount: '+550', type: 'earned' },
        { description: 'Redeemed: $10 discount', date: 'Jan 18, 2026', amount: '-500', type: 'redeemed' },
        { description: 'Purchase: Order #DP-2026-001189', date: 'Jan 15, 2026', amount: '+180', type: 'earned' },
        { description: 'Birthday Bonus', date: 'Jan 1, 2026', amount: '+200', type: 'earned' },
        { description: 'Referral Bonus', date: 'Dec 20, 2025', amount: '+300', type: 'earned' }
    ];

    // Mock wishlist if empty
    if (wishlist.length === 0 && typeof products !== 'undefined') {
        wishlist = [products[2], products[6], products[11]].filter(p => p);
        localStorage.setItem('dragonPathWishlist', JSON.stringify(wishlist));
    }
}

// ===== Setup Navigation =====
function setupNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.dataset.section;

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');

            // Show corresponding section
            profileSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// ===== Setup Event Listeners =====
function setupEventListeners() {
    // Personal Info Form
    document.getElementById('personalInfoForm').addEventListener('submit', savePersonalInfo);

    // Address buttons
    document.getElementById('addShippingBtn').addEventListener('click', () => openAddressModal('shipping'));
    document.getElementById('addBillingBtn').addEventListener('click', () => openAddressModal('billing'));
    document.getElementById('closeAddressModal').addEventListener('click', closeAddressModal);
    document.getElementById('cancelAddress').addEventListener('click', closeAddressModal);
    document.getElementById('addressForm').addEventListener('submit', saveAddress);

    // Order filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderOrders(btn.dataset.filter);
        });
    });

    // Payment modal
    document.getElementById('addPaymentBtn').addEventListener('click', openPaymentModal);
    document.getElementById('closePaymentModal').addEventListener('click', closePaymentModal);
    document.getElementById('paymentForm').addEventListener('submit', savePayment);
    document.querySelectorAll('.payment-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.payment-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Card number formatting
    document.getElementById('cardNumber').addEventListener('input', formatCardNumber);
    document.getElementById('cardExpiry').addEventListener('input', formatExpiry);

    // Avatar modal
    document.getElementById('editAvatarBtn').addEventListener('click', openAvatarModal);
    document.getElementById('closeAvatarModal').addEventListener('click', closeAvatarModal);
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', () => selectAvatar(option.dataset.avatar));
    });
    document.getElementById('uploadAvatarBtn').addEventListener('click', () => {
        document.getElementById('avatarUpload').click();
    });
    document.getElementById('avatarUpload').addEventListener('change', handleAvatarUpload);

    // Password form
    document.getElementById('passwordForm').addEventListener('submit', changePassword);
    document.getElementById('newPassword').addEventListener('input', checkPasswordStrength);

    // Two-factor toggle
    document.getElementById('twoFactorToggle').addEventListener('change', toggleTwoFactor);

    // Logout all devices
    document.getElementById('logoutAllBtn').addEventListener('click', logoutAllDevices);

    // Notification preferences
    document.getElementById('saveNotifications').addEventListener('click', saveNotifications);

    // Language/Currency preferences
    document.getElementById('savePreferences').addEventListener('click', savePreferencesSettings);

    // Account actions
    document.getElementById('deactivateBtn').addEventListener('click', () => showConfirmModal('deactivate'));
    document.getElementById('deleteAccountBtn').addEventListener('click', () => showConfirmModal('delete'));
    document.getElementById('confirmCancel').addEventListener('click', closeConfirmModal);

    // Close modals on backdrop
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    });
}

// ===== Render All Sections =====
function renderAllSections() {
    renderAddresses();
    renderOrders('all');
    renderWishlist();
    renderPayments();
    renderLoginActivity();
    renderPointsHistory();
}

// ===== Personal Info =====
function savePersonalInfo(e) {
    e.preventDefault();

    currentUser.name = document.getElementById('fullName').value;
    currentUser.email = document.getElementById('email').value;
    currentUser.phone = document.getElementById('phone').value;
    currentUser.dob = document.getElementById('dob').value;
    currentUser.gender = document.querySelector('input[name="gender"]:checked')?.value;

    localStorage.setItem('dragonPathUser', JSON.stringify(currentUser));
    updateHeader();
    showToast('Personal information updated!', 'success');
}

// ===== Addresses =====
function renderAddresses() {
    renderAddressList('shippingAddressList', shippingAddresses, 'shipping');
    renderAddressList('billingAddressList', billingAddresses, 'billing');
}

function renderAddressList(containerId, addresses, type) {
    const container = document.getElementById(containerId);

    if (addresses.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="padding: 2rem;">
                <p style="color: var(--text-tertiary);">No ${type} addresses saved yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = addresses.map((addr, index) => `
        <div class="address-card ${addr.isDefault ? 'default' : ''}">
            ${addr.isDefault ? '<span class="default-tag">Default</span>' : ''}
            <div class="address-name">${addr.fullName}</div>
            <div class="address-text">
                ${addr.street}<br>
                ${addr.city}, ${addr.state} ${addr.postal}<br>
                ${addr.country}<br>
                📞 ${addr.phone}
            </div>
            <div class="address-actions">
                <button class="action-btn" onclick="editAddress('${type}', ${index})">Edit</button>
                ${!addr.isDefault ? `<button class="action-btn" onclick="setDefaultAddress('${type}', ${index})">Set Default</button>` : ''}
                <button class="action-btn delete" onclick="deleteAddress('${type}', ${index})">Delete</button>
            </div>
        </div>
    `).join('');
}

function openAddressModal(type, index = null) {
    const modal = document.getElementById('addressModal');
    const title = document.getElementById('addressModalTitle');
    const form = document.getElementById('addressForm');

    document.getElementById('addressType').value = type;

    if (index !== null) {
        const addresses = type === 'shipping' ? shippingAddresses : billingAddresses;
        const addr = addresses[index];
        title.textContent = 'Edit Address';
        document.getElementById('addressId').value = index;
        document.getElementById('addrFullName').value = addr.fullName;
        document.getElementById('addrStreet').value = addr.street;
        document.getElementById('addrCity').value = addr.city;
        document.getElementById('addrState').value = addr.state;
        document.getElementById('addrPostal').value = addr.postal;
        document.getElementById('addrCountry').value = addr.country;
        document.getElementById('addrPhone').value = addr.phone;
        document.getElementById('addrDefault').checked = addr.isDefault;
    } else {
        title.textContent = 'Add New Address';
        document.getElementById('addressId').value = '';
        form.reset();
    }

    modal.classList.remove('hidden');
}

function closeAddressModal() {
    document.getElementById('addressModal').classList.add('hidden');
}

function saveAddress(e) {
    e.preventDefault();

    const type = document.getElementById('addressType').value;
    const id = document.getElementById('addressId').value;
    const addresses = type === 'shipping' ? shippingAddresses : billingAddresses;

    const address = {
        fullName: document.getElementById('addrFullName').value,
        street: document.getElementById('addrStreet').value,
        city: document.getElementById('addrCity').value,
        state: document.getElementById('addrState').value,
        postal: document.getElementById('addrPostal').value,
        country: document.getElementById('addrCountry').value,
        phone: document.getElementById('addrPhone').value,
        isDefault: document.getElementById('addrDefault').checked
    };

    // If setting as default, remove default from others
    if (address.isDefault) {
        addresses.forEach(a => a.isDefault = false);
    }

    if (id !== '') {
        addresses[parseInt(id)] = address;
    } else {
        addresses.push(address);
    }

    // Save to localStorage
    localStorage.setItem(type === 'shipping' ? 'dragonPathShipping' : 'dragonPathBilling', JSON.stringify(addresses));

    closeAddressModal();
    renderAddresses();
    showToast('Address saved successfully!', 'success');
}

window.editAddress = function (type, index) {
    openAddressModal(type, index);
};

window.setDefaultAddress = function (type, index) {
    const addresses = type === 'shipping' ? shippingAddresses : billingAddresses;
    addresses.forEach((a, i) => a.isDefault = i === index);
    localStorage.setItem(type === 'shipping' ? 'dragonPathShipping' : 'dragonPathBilling', JSON.stringify(addresses));
    renderAddresses();
    showToast('Default address updated!', 'success');
};

window.deleteAddress = function (type, index) {
    const addresses = type === 'shipping' ? shippingAddresses : billingAddresses;
    addresses.splice(index, 1);
    localStorage.setItem(type === 'shipping' ? 'dragonPathShipping' : 'dragonPathBilling', JSON.stringify(addresses));
    renderAddresses();
    showToast('Address deleted.', 'success');
};

// ===== Orders =====
function renderOrders(filter = 'all') {
    const container = document.getElementById('ordersList');
    let filteredOrders = orders;

    if (filter !== 'all') {
        filteredOrders = orders.filter(o => o.status === filter);
    }

    if (filteredOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📦</div>
                <h3>No orders found</h3>
                <p>You haven't placed any ${filter !== 'all' ? filter : ''} orders yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info">
                    <div class="order-info-item">
                        <span class="order-info-label">Order Number</span>
                        <span class="order-info-value">${order.id}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="order-info-label">Date</span>
                        <span class="order-info-value">${formatDate(order.date)}</span>
                    </div>
                    <div class="order-info-item">
                        <span class="order-info-label">Total</span>
                        <span class="order-info-value">$${order.total.toFixed(2)}</span>
                    </div>
                </div>
                <span class="order-status ${order.status}">${capitalizeFirst(order.status)}</span>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="order-item-image">
                        <div class="order-item-details">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-meta">Qty: ${item.quantity}</div>
                        </div>
                        <div class="order-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                `).join('')}
            </div>
            <div class="order-footer">
                <div class="order-total">Total: $${order.total.toFixed(2)}</div>
                <div class="order-actions">
                    ${order.status === 'delivered' ? `<button class="btn-secondary" onclick="reorder('${order.id}')">Reorder</button>` : ''}
                    ${order.status === 'shipped' ? `<button class="btn-primary" onclick="trackOrder('${order.id}')">Track Order</button>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

window.reorder = function (orderId) {
    showToast(`Reordering items from ${orderId}...`, 'success');
};

window.trackOrder = function (orderId) {
    showToast(`Opening tracking for ${orderId}...`, 'success');
};

// ===== Wishlist =====
function renderWishlist() {
    const container = document.getElementById('wishlistGrid');
    const emptyState = document.getElementById('emptyWishlist');

    if (wishlist.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    emptyState.classList.add('hidden');

    container.innerHTML = wishlist.map((item, index) => `
        <div class="wishlist-item">
            <div class="wishlist-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="wishlist-details">
                <div class="wishlist-name">${item.name}</div>
                <div class="wishlist-price">$${item.price.toFixed(2)}</div>
                <div class="wishlist-actions">
                    <button class="btn-primary" onclick="addToCart(${index})">Add to Cart</button>
                    <button class="btn-secondary" onclick="removeFromWishlist(${index})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

window.addToCart = function (index) {
    const item = wishlist[index];
    showToast(`${item.name} added to cart!`, 'success');
};

window.removeFromWishlist = function (index) {
    wishlist.splice(index, 1);
    localStorage.setItem('dragonPathWishlist', JSON.stringify(wishlist));
    renderWishlist();
    showToast('Item removed from wishlist.', 'success');
};

// ===== Payment Methods =====
function renderPayments() {
    const container = document.getElementById('paymentsList');

    if (paymentMethods.length === 0) {
        container.innerHTML = '<p style="color: var(--text-tertiary); text-align: center; padding: 2rem;">No payment methods saved.</p>';
        return;
    }

    container.innerHTML = paymentMethods.map((payment, index) => `
        <div class="payment-card">
            <div class="payment-icon">${payment.type === 'card' ? '💳' : payment.type === 'paypal' ? '🅿️' : '🍎'}</div>
            <div class="payment-details">
                <div class="payment-name">${payment.name}</div>
                <div class="payment-number">${payment.type === 'card' ? `•••• •••• •••• ${payment.lastFour}` : payment.email || 'Connected'}</div>
            </div>
            <button class="action-btn delete" onclick="deletePayment(${index})">Remove</button>
        </div>
    `).join('');
}

function openPaymentModal() {
    document.getElementById('paymentModal').classList.remove('hidden');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hidden');
    document.getElementById('paymentForm').reset();
}

function savePayment(e) {
    e.preventDefault();

    const activeType = document.querySelector('.payment-type-btn.active').dataset.type;

    if (activeType === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const payment = {
            type: 'card',
            name: document.getElementById('cardName').value,
            lastFour: cardNumber.slice(-4),
            token: 'tok_' + Math.random().toString(36).substr(2, 9) // Simulated token
        };
        paymentMethods.push(payment);
    } else {
        paymentMethods.push({
            type: activeType,
            name: activeType === 'paypal' ? 'PayPal' : 'Apple Pay',
            email: currentUser.email
        });
    }

    localStorage.setItem('dragonPathPayments', JSON.stringify(paymentMethods));
    closePaymentModal();
    renderPayments();
    showToast('Payment method added!', 'success');
}

window.deletePayment = function (index) {
    if (confirm('Are you sure you want to remove this payment method?')) {
        paymentMethods.splice(index, 1);
        localStorage.setItem('dragonPathPayments', JSON.stringify(paymentMethods));
        renderPayments();
        showToast('Payment method removed.', 'success');
    }
};

function formatCardNumber(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = value.substring(0, 19);
}

function formatExpiry(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

// ===== Security =====
function changePassword(e) {
    e.preventDefault();
    const current = document.getElementById('currentPassword').value;
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    if (newPass !== confirm) {
        showToast('Passwords do not match!', 'error');
        return;
    }

    if (newPass.length < 8) {
        showToast('Password must be at least 8 characters!', 'error');
        return;
    }

    showToast('Password updated successfully!', 'success');
    document.getElementById('passwordForm').reset();
    document.getElementById('passwordStrength').className = 'password-strength';
}

function checkPasswordStrength(e) {
    const password = e.target.value;
    const strengthEl = document.getElementById('passwordStrength');

    if (password.length < 6) {
        strengthEl.className = 'password-strength weak';
    } else if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        strengthEl.className = 'password-strength medium';
    } else {
        strengthEl.className = 'password-strength strong';
    }
}

function toggleTwoFactor(e) {
    const setup = document.getElementById('twoFactorSetup');
    if (e.target.checked) {
        setup.classList.remove('hidden');
        showToast('2FA setup started. Scan the QR code with your authenticator app.', 'success');
    } else {
        setup.classList.add('hidden');
        showToast('2FA has been disabled.', 'success');
    }
}

function renderLoginActivity() {
    const container = document.getElementById('loginActivityList');

    container.innerHTML = loginActivity.map(activity => `
        <div class="login-activity-item">
            <div class="activity-device">${activity.device}</div>
            <div class="activity-info">
                <div class="activity-device-name">${activity.deviceName}</div>
                <div class="activity-location">${activity.location}</div>
            </div>
            <div class="activity-time">${activity.time}</div>
            ${activity.current ? '<span class="activity-current">Current</span>' : ''}
        </div>
    `).join('');
}

function logoutAllDevices() {
    if (confirm('This will log you out of all devices except this one. Continue?')) {
        showToast('Logged out of all other devices.', 'success');
    }
}

// ===== Notifications =====
function saveNotifications() {
    const prefs = {
        emailOrders: document.getElementById('emailOrders').checked,
        emailMarketing: document.getElementById('emailMarketing').checked,
        emailRecommendations: document.getElementById('emailRecommendations').checked,
        smsOrders: document.getElementById('smsOrders').checked,
        smsMarketing: document.getElementById('smsMarketing').checked
    };

    localStorage.setItem('dragonPathNotifications', JSON.stringify(prefs));
    showToast('Notification preferences saved!', 'success');
}

// ===== Rewards =====
function renderPointsHistory() {
    const container = document.getElementById('pointsHistoryList');

    container.innerHTML = pointsHistory.map(item => `
        <div class="points-item">
            <div class="points-info">
                <div class="points-description">${item.description}</div>
                <div class="points-date">${item.date}</div>
            </div>
            <div class="points-amount ${item.type}">${item.amount}</div>
        </div>
    `).join('');
}

// ===== Preferences =====
function savePreferencesSettings() {
    preferences.language = document.getElementById('languageSelect').value;
    preferences.currency = document.getElementById('currencySelect').value;

    localStorage.setItem('dragonPathPreferences', JSON.stringify(preferences));
    showToast('Preferences saved!', 'success');
}

// ===== Avatar =====
function openAvatarModal() {
    document.getElementById('avatarModal').classList.remove('hidden');
}

function closeAvatarModal() {
    document.getElementById('avatarModal').classList.add('hidden');
}

function selectAvatar(emoji) {
    document.getElementById('avatarInitial').textContent = emoji;
    currentUser.avatar = emoji;
    localStorage.setItem('dragonPathUser', JSON.stringify(currentUser));
    closeAvatarModal();
    showToast('Avatar updated!', 'success');
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (ev) {
            const img = document.getElementById('avatarImage');
            img.src = ev.target.result;
            img.classList.remove('hidden');
            document.getElementById('avatarInitial').classList.add('hidden');
            currentUser.avatarImage = ev.target.result;
            localStorage.setItem('dragonPathUser', JSON.stringify(currentUser));
            closeAvatarModal();
            showToast('Avatar uploaded!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

// ===== Account Actions =====
let pendingAction = null;

function showConfirmModal(action) {
    pendingAction = action;
    const modal = document.getElementById('confirmModal');
    const title = document.getElementById('confirmTitle');
    const message = document.getElementById('confirmMessage');
    const icon = document.getElementById('confirmIcon');
    const confirmBtn = document.getElementById('confirmAction');

    if (action === 'deactivate') {
        icon.textContent = '⏸️';
        title.textContent = 'Deactivate Account?';
        message.textContent = 'Your account will be temporarily disabled. You can reactivate it by logging in.';
        confirmBtn.textContent = 'Deactivate';
        confirmBtn.className = 'btn-warning';
    } else {
        icon.textContent = '⚠️';
        title.textContent = 'Delete Account Permanently?';
        message.textContent = 'This will permanently delete your account and all associated data. This action cannot be undone.';
        confirmBtn.textContent = 'Delete Forever';
        confirmBtn.className = 'btn-danger';
    }

    confirmBtn.onclick = executeAccountAction;
    modal.classList.remove('hidden');
}

function closeConfirmModal() {
    document.getElementById('confirmModal').classList.add('hidden');
    pendingAction = null;
}

function executeAccountAction() {
    if (pendingAction === 'deactivate') {
        localStorage.clear();
        showToast('Account deactivated. Redirecting...', 'success');
        setTimeout(() => window.location.href = 'index.html', 2000);
    } else if (pendingAction === 'delete') {
        localStorage.clear();
        showToast('Account deleted. Redirecting...', 'success');
        setTimeout(() => window.location.href = 'index.html', 2000);
    }
    closeConfirmModal();
}

// ===== Utility Functions =====
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    toastMessage.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
