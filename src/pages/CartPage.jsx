import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function CartPage({ user }) {
    const { cart, removeFromCart, updateCartQuantity } = useApp()
    const [promoCode, setPromoCode] = useState('')
    const [discount, setDiscount] = useState(0)

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

                                <button className="btn-primary btn-full btn-checkout">
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
