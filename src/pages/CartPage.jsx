import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import PaymentModal from '../components/PaymentModal'

function CartPage({ user, onLogout }) {
    const navigate = useNavigate()
    const { cart, removeFromCart, updateCartQuantity, clearCart, addOrder } = useApp()
    const [promoCode, setPromoCode] = useState('')
    const [discount, setDiscount] = useState(0)
    const [checkoutStep, setCheckoutStep] = useState('cart') // 'cart' | 'shipping' | 'payment' | 'success'
    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Uzbekistan'
    })
    const [savedAddresses] = useState([
        {
            id: 1,
            label: 'Home',
            fullName: 'John Doe',
            phone: '+998 90 123 4567',
            addressLine1: '123 Amir Temur Street',
            addressLine2: 'Apartment 45',
            city: 'Tashkent',
            state: 'Tashkent Region',
            postalCode: '100000',
            country: 'Uzbekistan'
        },
        {
            id: 2,
            label: 'Office',
            fullName: 'John Doe',
            phone: '+998 90 123 4567',
            addressLine1: '456 Navoi Street',
            addressLine2: 'Floor 3, Office 12',
            city: 'Tashkent',
            state: 'Tashkent Region',
            postalCode: '100100',
            country: 'Uzbekistan'
        }
    ])
    const [completedOrder, setCompletedOrder] = useState(null)

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shipping = subtotal > 100 ? 0 : 9.99
    const total = subtotal - discount + shipping

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return
        updateCartQuantity(productId, newQuantity)
    }

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'SAVE20') {
            setDiscount(subtotal * 0.2)
        } else if (promoCode.toUpperCase() === 'SAVE10') {
            setDiscount(subtotal * 0.1)
        } else {
            setDiscount(0)
            alert('Invalid promo code')
        }
    }

    const handleProceedToShipping = () => {
        if (cart.length === 0) return
        setCheckoutStep('shipping')
        window.scrollTo(0, 0)
    }

    const handleProceedToPayment = (e) => {
        e.preventDefault()
        // Validate shipping address
        if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.addressLine1 ||
            !shippingAddress.city || !shippingAddress.postalCode) {
            alert('Please fill in all required fields')
            return
        }
        setCheckoutStep('payment')
    }

    const handleSelectSavedAddress = (address) => {
        setShippingAddress({
            fullName: address.fullName,
            phone: address.phone,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country
        })
    }

    const handlePaymentSuccess = (order) => {
        setCompletedOrder(order)
        addOrder({
            ...order,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            shippingAddress,
            total,
            date: new Date().toISOString()
        })
        clearCart()
        setCheckoutStep('success')
    }

    const handleBackToCart = () => {
        setCheckoutStep('cart')
    }

    // Success Screen
    if (checkoutStep === 'success') {
        return (
            <div className="app">
                <header className="header">
                    <div className="header-container">
                        <Link to="/" className="logo-section">
                            <div className="dragon-icon small">🐉</div>
                            <span className="brand-name">DragonPath</span>
                        </Link>
                    </div>
                </header>

                <main className="checkout-success">
                    <div className="success-container">
                        <div className="success-icon-large">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h1>Order Confirmed!</h1>
                        <p className="order-id">Order #{completedOrder?.id || `DP-${Date.now()}`}</p>

                        <div className="success-details">
                            <div className="detail-card">
                                <h3>📦 Shipping Address</h3>
                                <p>{shippingAddress.fullName}</p>
                                <p>{shippingAddress.addressLine1}</p>
                                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                                <p>{shippingAddress.country}</p>
                            </div>

                            <div className="detail-card">
                                <h3>🛡️ Escrow Protection</h3>
                                <p>Your payment of <strong>${total.toFixed(2)}</strong> is securely held in escrow.</p>
                                <ul>
                                    <li>✓ Funds released to seller after delivery</li>
                                    <li>✓ Full refund if cancelled before pickup</li>
                                    <li>✓ Product condition documented</li>
                                </ul>
                            </div>
                        </div>

                        <div className="success-actions">
                            <Link to="/profile" className="btn-secondary">View Order Status</Link>
                            <Link to="/" className="btn-primary">Continue Shopping</Link>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Payment Screen
    if (checkoutStep === 'payment') {
        return (
            <PaymentModal
                user={user}
                cart={cart}
                shippingAddress={shippingAddress}
                onSuccess={handlePaymentSuccess}
                onClose={() => setCheckoutStep('shipping')}
            />
        )
    }

    // Shipping Address Screen
    if (checkoutStep === 'shipping') {
        return (
            <div className="app">
                <header className="header">
                    <div className="header-container">
                        <Link to="/" className="logo-section">
                            <div className="dragon-icon small">🐉</div>
                            <span className="brand-name">DragonPath</span>
                        </Link>

                        <nav className="nav-links desktop-only">
                            <Link to="/" className="nav-link">Shop</Link>
                            <Link to="/cart" className="nav-link active">Checkout</Link>
                        </nav>
                    </div>
                </header>

                <main className="checkout-main">
                    <div className="checkout-container">
                        {/* Progress Steps */}
                        <div className="checkout-progress">
                            <div className="progress-step completed">
                                <div className="step-icon">✓</div>
                                <span>Cart</span>
                            </div>
                            <div className="progress-line completed"></div>
                            <div className="progress-step active">
                                <div className="step-icon">2</div>
                                <span>Shipping</span>
                            </div>
                            <div className="progress-line"></div>
                            <div className="progress-step">
                                <div className="step-icon">3</div>
                                <span>Payment</span>
                            </div>
                        </div>

                        <div className="checkout-content">
                            <div className="shipping-form-section">
                                <button className="back-btn" onClick={handleBackToCart}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="19" y1="12" x2="5" y2="12"></line>
                                        <polyline points="12 19 5 12 12 5"></polyline>
                                    </svg>
                                    Back to Cart
                                </button>

                                <h2>Shipping Address</h2>

                                {/* Saved Addresses */}
                                {savedAddresses.length > 0 && (
                                    <div className="saved-addresses">
                                        <h3>Saved Addresses</h3>
                                        <div className="saved-addresses-grid">
                                            {savedAddresses.map(addr => (
                                                <button
                                                    key={addr.id}
                                                    className={`saved-address-card ${shippingAddress.addressLine1 === addr.addressLine1 ? 'selected' : ''}`}
                                                    onClick={() => handleSelectSavedAddress(addr)}
                                                >
                                                    <span className="address-label">{addr.label}</span>
                                                    <span className="address-text">{addr.addressLine1}</span>
                                                    <span className="address-city">{addr.city}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleProceedToPayment} className="shipping-form">
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="fullName">Full Name *</label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                value={shippingAddress.fullName}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone Number *</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                value={shippingAddress.phone}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                                placeholder="+998 XX XXX XXXX"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="addressLine1">Address Line 1 *</label>
                                        <input
                                            type="text"
                                            id="addressLine1"
                                            value={shippingAddress.addressLine1}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                                            placeholder="Street address"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="addressLine2">Address Line 2</label>
                                        <input
                                            type="text"
                                            id="addressLine2"
                                            value={shippingAddress.addressLine2}
                                            onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                                            placeholder="Apartment, floor, etc. (optional)"
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="city">City *</label>
                                            <input
                                                type="text"
                                                id="city"
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="state">State/Region</label>
                                            <input
                                                type="text"
                                                id="state"
                                                value={shippingAddress.state}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="postalCode">Postal Code *</label>
                                            <input
                                                type="text"
                                                id="postalCode"
                                                value={shippingAddress.postalCode}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="country">Country *</label>
                                            <select
                                                id="country"
                                                value={shippingAddress.country}
                                                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                                            >
                                                <option value="Uzbekistan">🇺🇿 Uzbekistan</option>
                                                <option value="Kazakhstan">🇰🇿 Kazakhstan</option>
                                                <option value="Kyrgyzstan">🇰🇬 Kyrgyzstan</option>
                                                <option value="Tajikistan">🇹🇯 Tajikistan</option>
                                                <option value="Turkmenistan">🇹🇲 Turkmenistan</option>
                                                <option value="Russia">🇷🇺 Russia</option>
                                                <option value="China">🇨🇳 China</option>
                                            </select>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-primary btn-full">
                                        Continue to Payment
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                            <polyline points="12 5 19 12 12 19"></polyline>
                                        </svg>
                                    </button>
                                </form>
                            </div>

                            {/* Order Summary Sidebar */}
                            <div className="checkout-sidebar">
                                <h3>Order Summary</h3>
                                <div className="checkout-items">
                                    {cart.map(item => (
                                        <div key={item.id} className="checkout-item">
                                            <img src={item.image} alt={item.name} />
                                            <div className="item-info">
                                                <span className="item-name">{item.name}</span>
                                                <span className="item-qty">Qty: {item.quantity}</span>
                                            </div>
                                            <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="checkout-totals">
                                    <div className="total-row">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="total-row discount">
                                            <span>Discount</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="total-row">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="total-row final">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Cart Screen (default)
    return (
        <div className="app">
            {/* Header */}
            <header className="header">
                <div className="header-container">
                    <Link to="/" className="logo-section">
                        <div className="dragon-icon small">🐉</div>
                        <span className="brand-name">DragonPath</span>
                    </Link>

                    <nav className="nav-links desktop-only">
                        <Link to="/" className="nav-link">Shop</Link>
                        <Link to="/cart" className="nav-link active">Cart</Link>
                        <Link to="/profile" className="nav-link">My Profile</Link>
                    </nav>

                    <div className="user-section">
                        <Link to="/profile" className="user-avatar" title="My Profile">
                            <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="cart-main">
                <div className="cart-container">
                    {/* Progress Steps */}
                    <div className="checkout-progress">
                        <div className="progress-step active">
                            <div className="step-icon">1</div>
                            <span>Cart</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div className="step-icon">2</div>
                            <span>Shipping</span>
                        </div>
                        <div className="progress-line"></div>
                        <div className="progress-step">
                            <div className="step-icon">3</div>
                            <span>Payment</span>
                        </div>
                    </div>

                    <div className="cart-header">
                        <h1>Shopping Cart</h1>
                        <p>{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
                    </div>

                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <div className="empty-icon">🛒</div>
                            <h2>Your cart is empty</h2>
                            <p>Looks like you haven't added anything to your cart yet.</p>
                            <Link to="/" className="btn-primary">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="cart-content">
                            <div className="cart-items">
                                {cart.map(item => (
                                    <div key={item.id} className="cart-item">
                                        <div className="cart-item-image">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="cart-item-details">
                                            <h3 className="cart-item-name">{item.name}</h3>
                                            <p className="cart-item-category">{item.category}</p>
                                            <div className="cart-item-price-mobile">${item.price.toFixed(2)}</div>
                                        </div>
                                        <div className="cart-item-quantity">
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            >
                                                −
                                            </button>
                                            <span className="qty-value">{item.quantity}</span>
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="cart-item-price">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                        <button
                                            className="cart-item-remove"
                                            onClick={() => removeFromCart(item.id)}
                                            title="Remove item"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="3 6 5 6 21 6"></polyline>
                                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                                <line x1="14" y1="11" x2="14" y2="17"></line>
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-summary">
                                <h2>Order Summary</h2>

                                <div className="promo-section">
                                    <input
                                        type="text"
                                        placeholder="Promo code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                    <button className="btn-secondary" onClick={handleApplyPromo}>Apply</button>
                                </div>

                                <div className="summary-rows">
                                    <div className="summary-row">
                                        <span>Subtotal</span>
                                        <span>${subtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div className="summary-row discount">
                                            <span>Discount</span>
                                            <span>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="summary-row">
                                        <span>Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                    </div>
                                    {subtotal < 100 && (
                                        <div className="shipping-note">
                                            Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                                        </div>
                                    )}
                                    <div className="summary-row total">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    className="btn-primary btn-full btn-checkout"
                                    onClick={handleProceedToShipping}
                                >
                                    <span>Proceed to Checkout</span>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </button>

                                <div className="secure-checkout">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                    </svg>
                                    <span>Secure checkout with SSL encryption</span>
                                </div>

                                <Link to="/" className="continue-shopping">
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default CartPage

