import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Toast from '../components/Toast'

function ProfilePage({ user, setUser, onLogout }) {
    const { orders, wishlist, removeFromWishlist, addToCart } = useApp()
    const [activeSection, setActiveSection] = useState('personal')
    const [toast, setToast] = useState(null)

    // Form states
    const [personalInfo, setPersonalInfo] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        dob: user?.dob || '',
        gender: user?.gender || ''
    })

    const [shippingAddresses, setShippingAddresses] = useState([])
    const [billingAddresses, setBillingAddresses] = useState([])
    const [paymentMethods, setPaymentMethods] = useState([])
    const [orderFilter, setOrderFilter] = useState('all')

    useEffect(() => {
        // Load addresses
        const savedShipping = localStorage.getItem('dragonPathShipping')
        if (savedShipping) setShippingAddresses(JSON.parse(savedShipping))

        const savedBilling = localStorage.getItem('dragonPathBilling')
        if (savedBilling) setBillingAddresses(JSON.parse(savedBilling))

        const savedPayments = localStorage.getItem('dragonPathPayments')
        if (savedPayments) setPaymentMethods(JSON.parse(savedPayments))
    }, [])

    const showToast = (message, type = 'success') => {
        setToast({ message, type })
    }

    const hideToast = () => {
        setToast(null)
    }

    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target
        setPersonalInfo(prev => ({ ...prev, [name]: value }))
    }

    const handleSavePersonalInfo = (e) => {
        e.preventDefault()
        const updatedUser = { ...user, ...personalInfo }
        setUser(updatedUser)
        localStorage.setItem('dragonPathUser', JSON.stringify(updatedUser))
        showToast('Personal information updated!')
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    const filteredOrders = orderFilter === 'all'
        ? orders
        : orders.filter(o => o.status === orderFilter)

    const sections = [
        { id: 'personal', label: 'Personal Info', icon: 'user' },
        { id: 'addresses', label: 'Addresses', icon: 'location' },
        { id: 'orders', label: 'Order History', icon: 'orders' },
        { id: 'wishlist', label: 'Wishlist', icon: 'heart' },
        { id: 'payments', label: 'Payment Methods', icon: 'card' },
        { id: 'security', label: 'Security', icon: 'shield' },
        { id: 'notifications', label: 'Notifications', icon: 'bell' },
        { id: 'rewards', label: 'Rewards', icon: 'medal' },
        { id: 'preferences', label: 'Preferences', icon: 'settings' },
        { id: 'account', label: 'Account Settings', icon: 'danger', danger: true }
    ]

    const getIcon = (iconName) => {
        const icons = {
            user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></>,
            location: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></>,
            orders: <><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></>,
            heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>,
            card: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></>,
            shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>,
            bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></>,
            medal: <><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></>,
            settings: <><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></>,
            danger: <><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></>
        }
        return icons[iconName] || icons.user
    }

    const handleLogout = () => {
        if (confirm('Are you sure you want to log out?')) {
            onLogout()
        }
    }

    const handleDeleteAccount = () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            localStorage.clear()
            onLogout()
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

                    <nav className="nav-links">
                        <Link to="/" className="nav-link">Shop</Link>
                        <Link to="/profile" className="nav-link active">My Profile</Link>
                    </nav>

                    <div className="user-section">
                        <div className="user-avatar">
                            <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Profile Content */}
            <main className="profile-main">
                <div className="profile-container">
                    {/* Sidebar */}
                    <aside className="profile-sidebar">
                        <div className="profile-card">
                            <div className="avatar-section">
                                <div className="avatar-large">
                                    <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                                </div>
                            </div>
                            <h2 className="profile-name">{user?.name || 'User Name'}</h2>
                            <p className="profile-email">{user?.email || 'user@email.com'}</p>
                            <div className="loyalty-badge">
                                <span className="badge-icon">⭐</span>
                                <span>Gold Member</span>
                            </div>
                        </div>

                        <nav className="profile-nav">
                            {sections.map(section => (
                                <button
                                    key={section.id}
                                    className={`nav-item ${activeSection === section.id ? 'active' : ''} ${section.danger ? 'danger' : ''}`}
                                    onClick={() => setActiveSection(section.id)}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        {getIcon(section.icon)}
                                    </svg>
                                    <span>{section.label}</span>
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <div className="profile-content">
                        {/* Personal Information Section */}
                        {activeSection === 'personal' && (
                            <section className="content-section active">
                                <div className="section-header">
                                    <h1>Personal Information</h1>
                                    <p>Manage your personal details and account information</p>
                                </div>
                                <form className="profile-form" onSubmit={handleSavePersonalInfo}>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="fullName">Full Name</label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                name="name"
                                                placeholder="Enter your full name"
                                                value={personalInfo.name}
                                                onChange={handlePersonalInfoChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="Enter your email"
                                                value={personalInfo.email}
                                                onChange={handlePersonalInfoChange}
                                            />
                                            <span className="input-hint">We'll send order updates to this email</span>
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="phone">Phone Number</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                placeholder="Enter your phone number"
                                                value={personalInfo.phone}
                                                onChange={handlePersonalInfoChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="dob">Date of Birth</label>
                                            <input
                                                type="date"
                                                id="dob"
                                                name="dob"
                                                value={personalInfo.dob}
                                                onChange={handlePersonalInfoChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Gender</label>
                                            <div className="radio-group">
                                                <label className="radio-option">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="male"
                                                        checked={personalInfo.gender === 'male'}
                                                        onChange={handlePersonalInfoChange}
                                                    />
                                                    <span className="radio-custom"></span>
                                                    <span>Male</span>
                                                </label>
                                                <label className="radio-option">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="female"
                                                        checked={personalInfo.gender === 'female'}
                                                        onChange={handlePersonalInfoChange}
                                                    />
                                                    <span className="radio-custom"></span>
                                                    <span>Female</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="btn-primary">Save Changes</button>
                                        <button type="button" className="btn-secondary">Cancel</button>
                                    </div>
                                </form>
                            </section>
                        )}

                        {/* Addresses Section */}
                        {activeSection === 'addresses' && (
                            <section className="content-section active">
                                <div className="section-header">
                                    <h1>Shipping & Billing Addresses</h1>
                                    <p>Manage your delivery and billing locations</p>
                                </div>

                                <div className="address-category">
                                    <div className="category-header">
                                        <h2>📦 Shipping Addresses</h2>
                                        <button className="btn-add">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                            Add New
                                        </button>
                                    </div>
                                    <div className="address-list">
                                        {shippingAddresses.length === 0 ? (
                                            <div className="empty-state" style={{ padding: '2rem' }}>
                                                <p style={{ color: 'var(--text-tertiary)' }}>No shipping addresses saved yet.</p>
                                            </div>
                                        ) : (
                                            shippingAddresses.map((addr, index) => (
                                                <div key={index} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                                                    {addr.isDefault && <span className="default-tag">Default</span>}
                                                    <div className="address-name">{addr.fullName}</div>
                                                    <div className="address-text">
                                                        {addr.street}<br />
                                                        {addr.city}, {addr.state} {addr.postal}<br />
                                                        {addr.country}<br />
                                                        📞 {addr.phone}
                                                    </div>
                                                    <div className="address-actions">
                                                        <button className="action-btn">Edit</button>
                                                        {!addr.isDefault && <button className="action-btn">Set Default</button>}
                                                        <button className="action-btn delete">Delete</button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div className="address-category">
                                    <div className="category-header">
                                        <h2>💳 Billing Addresses</h2>
                                        <button className="btn-add">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                            </svg>
                                            Add New
                                        </button>
                                    </div>
                                    <div className="address-list">
                                        {billingAddresses.length === 0 ? (
                                            <div className="empty-state" style={{ padding: '2rem' }}>
                                                <p style={{ color: 'var(--text-tertiary)' }}>No billing addresses saved yet.</p>
                                            </div>
                                        ) : (
                                            billingAddresses.map((addr, index) => (
                                                <div key={index} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
                                                    {addr.isDefault && <span className="default-tag">Default</span>}
                                                    <div className="address-name">{addr.fullName}</div>
                                                    <div className="address-text">
                                                        {addr.street}<br />
                                                        {addr.city}, {addr.state} {addr.postal}<br />
                                                        {addr.country}
                                                    </div>
                                                    <div className="address-actions">
                                                        <button className="action-btn">Edit</button>
                                                        <button className="action-btn delete">Delete</button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Orders Section */}
                        {activeSection === 'orders' && (
                            <section className="content-section active">
                                <div className="section-header">
                                    <h1>Order History & Tracking</h1>
                                    <p>View and manage your past orders</p>
                                </div>
                                <div className="orders-filter">
                                    {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map(filter => (
                                        <button
                                            key={filter}
                                            className={`filter-btn ${orderFilter === filter ? 'active' : ''}`}
                                            onClick={() => setOrderFilter(filter)}
                                        >
                                            {filter === 'all' ? 'All Orders' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <div className="orders-list">
                                    {filteredOrders.length === 0 ? (
                                        <div className="empty-state">
                                            <div className="empty-icon">📦</div>
                                            <h3>No orders found</h3>
                                            <p>You haven't placed any {orderFilter !== 'all' ? orderFilter : ''} orders yet.</p>
                                        </div>
                                    ) : (
                                        filteredOrders.map(order => (
                                            <div key={order.id} className="order-card">
                                                <div className="order-header">
                                                    <div className="order-info">
                                                        <div className="order-info-item">
                                                            <span className="order-info-label">Order Number</span>
                                                            <span className="order-info-value">{order.id}</span>
                                                        </div>
                                                        <div className="order-info-item">
                                                            <span className="order-info-label">Date</span>
                                                            <span className="order-info-value">{formatDate(order.date)}</span>
                                                        </div>
                                                        <div className="order-info-item">
                                                            <span className="order-info-label">Total</span>
                                                            <span className="order-info-value">${order.total.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`order-status ${order.status}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </div>
                                                <div className="order-items">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="order-item">
                                                            <img src={item.image} alt={item.name} className="order-item-image" />
                                                            <div className="order-item-details">
                                                                <div className="order-item-name">{item.name}</div>
                                                                <div className="order-item-meta">Qty: {item.quantity}</div>
                                                            </div>
                                                            <div className="order-item-price">${item.price.toFixed(2)}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="order-footer">
                                                    <div className="order-total">Total: ${order.total.toFixed(2)}</div>
                                                    <div className="order-actions">
                                                        {order.status === 'delivered' && (
                                                            <button className="btn-secondary">Reorder</button>
                                                        )}
                                                        {order.status === 'shipped' && (
                                                            <button className="btn-primary">Track Order</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Wishlist Section */}
                        {activeSection === 'wishlist' && (
                            <section className="content-section active">
                                <div className="section-header">
                                    <h1>Wishlist & Saved Items</h1>
                                    <p>Items you've saved for later</p>
                                </div>
                                {wishlist.length === 0 ? (
                                    <div className="empty-state">
                                        <div className="empty-icon">💜</div>
                                        <h3>Your wishlist is empty</h3>
                                        <p>Save items you love by clicking the heart icon on products</p>
                                        <Link to="/" className="btn-primary">Start Shopping</Link>
                                    </div>
                                ) : (
                                    <div className="wishlist-grid">
                                        {wishlist.map((item, index) => (
                                            <div key={item.id} className="wishlist-item">
                                                <div className="wishlist-image">
                                                    <img src={item.image} alt={item.name} />
                                                </div>
                                                <div className="wishlist-details">
                                                    <div className="wishlist-name">{item.name}</div>
                                                    <div className="wishlist-price">${item.price.toFixed(2)}</div>
                                                    <div className="wishlist-actions">
                                                        <button
                                                            className="btn-primary"
                                                            onClick={() => {
                                                                addToCart(item)
                                                                showToast(`${item.name} added to cart!`)
                                                            }}
                                                        >
                                                            Add to Cart
                                                        </button>
                                                        <button
                                                            className="btn-secondary"
                                                            onClick={() => {
                                                                removeFromWishlist(item.id)
                                                                showToast('Item removed from wishlist.')
                                                            }}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Payments Section */}
                        {activeSection === 'payments' && (
                            <section className="content-section active">
                                <div className="section-header">
                                    <h1>Payment Methods</h1>
                                    <p>Manage your saved payment options</p>
                                </div>
                                <div className="security-notice" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem', background: 'rgba(0, 245, 160, 0.1)', border: '1px solid rgba(0, 245, 160, 0.2)', borderRadius: '16px', marginBottom: '1.5rem' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-success)" strokeWidth="2" style={{ width: '24px', height: '24px', flexShrink: 0 }}>
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                    </svg>
                                    <div>
                                        <strong>Your payment info is secure</strong>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>We use industry-standard encryption and never store full card numbers.</p>
                                    </div>
                                </div>
                                <button className="btn-add" style={{ width: '100%', padding: '1.5rem', border: '2px dashed var(--border-color)', background: 'var(--bg-glass)', marginBottom: '1rem' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '20px', height: '20px' }}>
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    Add Payment Method
                                </button>
                                {paymentMethods.length === 0 ? (
                                    <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem' }}>No payment methods saved.</p>
                                ) : (
                                    <div className="payments-list">
                                        {paymentMethods.map((payment, index) => (
                                            <div key={index} className="payment-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                                                <div className="payment-icon" style={{ fontSize: '1.5rem' }}>
                                                    {payment.type === 'card' ? '💳' : payment.type === 'paypal' ? '🅿️' : '🍎'}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 600 }}>{payment.name}</div>
                                                    <div style={{ color: 'var(--text-tertiary)' }}>
                                                        {payment.type === 'card' ? `•••• •••• •••• ${payment.lastFour}` : payment.email || 'Connected'}
                                                    </div>
                                                </div>
                                                <button className="action-btn delete">Remove</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Security Section */}
                        {activeSection === 'security' && (
                            <section className="content-section active">
                                <div className="section-header">
                                    <h1>Account Security</h1>
                                    <p>Keep your account safe and secure</p>
                                </div>

                                <div className="security-card">
                                    <div className="security-card-header">
                                        <div className="security-icon">🔒</div>
                                        <div>
                                            <h3>Change Password</h3>
                                            <p>Update your password regularly for better security</p>
                                        </div>
                                    </div>
                                    <form className="profile-form" style={{ padding: 0, background: 'transparent', border: 'none' }}>
                                        <div className="form-group">
                                            <label htmlFor="currentPassword">Current Password</label>
                                            <input type="password" id="currentPassword" placeholder="Enter current password" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="newPassword">New Password</label>
                                            <input type="password" id="newPassword" placeholder="Enter new password" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="confirmPassword">Confirm New Password</label>
                                            <input type="password" id="confirmPassword" placeholder="Confirm new password" />
                                        </div>
                                        <button type="submit" className="btn-primary" onClick={(e) => { e.preventDefault(); showToast('Password updated successfully!') }}>
                                            Update Password
                                        </button>
                                    </form>
                                </div>

                                <div className="security-card">
                                    <div className="security-card-header">
                                        <div className="security-icon">📱</div>
                                        <div style={{ flex: 1 }}>
                                            <h3>Two-Factor Authentication (2FA)</h3>
                                            <p>Add an extra layer of security to your account</p>
                                        </div>
                                        <label className="toggle-switch">
                                            <input type="checkbox" />
                                            <span className="toggle-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Notifications Section */}
                        {activeSection === 'notifications' && (
                            <section className="content-section active">
                                <div className="section-header">
                                    <h1>Communication Preferences</h1>
                                    <p>Choose how you want to hear from us</p>
                                </div>

                                <div className="notification-category">
                                    <h3>Email Notifications</h3>
                                    <div className="notification-options">
                                        <label className="notification-option">
                                            <div className="option-info">
                                                <strong>Order Updates</strong>
                                                <p>Get notified about order status changes</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" defaultChecked />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </label>
                                        <label className="notification-option">
                                            <div className="option-info">
                                                <strong>Marketing Emails</strong>
                                                <p>Receive promotions and special offers</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </label>
                                        <label className="notification-option">
                                            <div className="option-info">
                                                <strong>Personalized Recommendations</strong>
                                                <p>Product suggestions based on your interests</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </label>
                                    </div>
                                </div>

                                <div className="notification-category">
                                    <h3>SMS Notifications</h3>
                                    <div className="notification-options">
                                        <label className="notification-option">
                                            <div className="option-info">
                                                <strong>Order Updates via SMS</strong>
                                                <p>Receive text messages about your orders</p>
                                            </div>
                                            <label className="toggle-switch">
                                                <input type="checkbox" />
                                                <span className="toggle-slider"></span>
                                            </label>
                                        </label>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button className="btn-primary" onClick={() => showToast('Notification preferences saved!')}>
                                        Save Preferences
                                    </button>
                                </div>
                            </section>
                        )}

                        {/* Rewards Section */}
                        {activeSection === 'rewards' && (
                            <section className="content-section active">
                                <div className="section-header">
                                    <h1>Loyalty & Rewards</h1>
                                    <p>Your rewards program status and history</p>
                                </div>

                                <div className="rewards-overview">
                                    <div className="reward-card points">
                                        <div className="reward-icon">💎</div>
                                        <div className="reward-value">2,450</div>
                                        <div className="reward-label">Available Points</div>
                                    </div>
                                    <div className="reward-card tier">
                                        <div className="reward-icon">⭐</div>
                                        <div className="reward-value">Gold</div>
                                        <div className="reward-label">Member Tier</div>
                                    </div>
                                    <div className="reward-card savings">
                                        <div className="reward-icon">💰</div>
                                        <div className="reward-value">$124.50</div>
                                        <div className="reward-label">Total Savings</div>
                                    </div>
                                </div>

                                <div className="tier-progress-card">
                                    <h3>Progress to Platinum</h3>
                                    <div className="tier-progress-bar">
                                        <div className="tier-progress-fill" style={{ width: '65%' }}></div>
                                    </div>
                                    <p>Spend <strong>$350.50</strong> more to reach Platinum status</p>
                                </div>

                                <div className="points-history">
                                    <h3>Points History</h3>
                                    <div className="points-list">
                                        {[
                                            { description: 'Purchase: Order #DP-2026-001234', date: 'Jan 20, 2026', amount: '+550', type: 'earned' },
                                            { description: 'Redeemed: $10 discount', date: 'Jan 18, 2026', amount: '-500', type: 'redeemed' },
                                            { description: 'Purchase: Order #DP-2026-001189', date: 'Jan 15, 2026', amount: '+180', type: 'earned' },
                                            { description: 'Birthday Bonus', date: 'Jan 1, 2026', amount: '+200', type: 'earned' }
                                        ].map((item, idx) => (
                                            <div key={idx} className="points-item">
                                                <div className="points-info">
                                                    <div className="points-description">{item.description}</div>
                                                    <div className="points-date">{item.date}</div>
                                                </div>
                                                <div className={`points-amount ${item.type}`}>{item.amount}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Preferences Section */}
                        {activeSection === 'preferences' && (
                            <section className="content-section active">
                                <div className="section-header">
                                    <h1>Language & Currency</h1>
                                    <p>Customize your shopping experience</p>
                                </div>

                                <div className="profile-form">
                                    <div className="form-group">
                                        <label htmlFor="languageSelect">Preferred Language</label>
                                        <select id="languageSelect">
                                            <option value="en">English</option>
                                            <option value="es">Español</option>
                                            <option value="fr">Français</option>
                                            <option value="de">Deutsch</option>
                                            <option value="zh">中文</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="currencySelect">Preferred Currency</label>
                                        <select id="currencySelect">
                                            <option value="USD">USD ($) - US Dollar</option>
                                            <option value="EUR">EUR (€) - Euro</option>
                                            <option value="GBP">GBP (£) - British Pound</option>
                                            <option value="JPY">JPY (¥) - Japanese Yen</option>
                                        </select>
                                    </div>
                                    <button className="btn-primary" onClick={() => showToast('Preferences saved!')}>
                                        Save Preferences
                                    </button>
                                </div>
                            </section>
                        )}

                        {/* Account Settings Section */}
                        {activeSection === 'account' && (
                            <section className="content-section active">
                                <div className="section-header">
                                    <h1>Account Settings</h1>
                                    <p>Manage your account status</p>
                                </div>

                                <div className="danger-zone">
                                    <h3>⚠️ Danger Zone</h3>

                                    <div className="danger-card">
                                        <div className="danger-info">
                                            <h4>Log Out</h4>
                                            <p>Sign out of your account on this device.</p>
                                        </div>
                                        <button className="btn-warning" onClick={handleLogout}>Log Out</button>
                                    </div>

                                    <div className="danger-card">
                                        <div className="danger-info">
                                            <h4>Delete Account</h4>
                                            <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                                        </div>
                                        <button className="btn-danger" onClick={handleDeleteAccount}>Delete Account</button>
                                    </div>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>

            {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
        </div>
    )
}

export default ProfilePage
