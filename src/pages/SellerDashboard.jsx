// DragonPath E-commerce - Seller Dashboard
// FR-04: Verified sellers may add, edit, or deactivate products
// FR-05: Each product listing must include high-quality images/videos, description, origin country, material, compliance info

import { useState, useEffect } from 'react'
import { products as initialProducts, categories } from '../data/products'
import { getUserOrders, ORDER_STATUS } from '../data/orders'
import Header from '../components/Header'
import Footer from '../components/Footer'

function SellerDashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [showProductModal, setShowProductModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [productForm, setProductForm] = useState({
        name: '',
        category: 'electronics',
        price: '',
        stock: '',
        description: '',
        originCountry: 'Uzbekistan',
        material: '',
        complianceInfo: '',
        images: [],
        videos: []
    })

    useEffect(() => {
        // Load seller's products (mock - in real app this would filter by seller ID)
        setProducts(initialProducts.slice(0, 6))
        // Load seller's orders
        setOrders(getUserOrders(user.id, 'seller'))
    }, [user])

    // Seller stats
    const stats = {
        totalProducts: products.length,
        activeProducts: products.filter(p => p.stock > 0).length,
        outOfStock: products.filter(p => p.stock === 0).length,
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => [ORDER_STATUS.PAYMENT_RECEIVED, ORDER_STATUS.PREPARING].includes(o.status)).length,
        shippedOrders: orders.filter(o => [ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.PICKED_UP].includes(o.status)).length,
        totalRevenue: orders.filter(o => o.status === ORDER_STATUS.CONFIRMED).reduce((sum, o) => sum + (o.payment?.escrow?.sellerAmount || 0), 0),
        escrowHeld: orders.filter(o => o.payment?.status === 'held_in_escrow').reduce((sum, o) => sum + (o.payment?.escrow?.sellerAmount || 0), 0)
    }

    const handleAddProduct = () => {
        setEditingProduct(null)
        setProductForm({
            name: '',
            category: 'electronics',
            price: '',
            stock: '',
            description: '',
            originCountry: 'Uzbekistan',
            material: '',
            complianceInfo: '',
            images: [],
            videos: []
        })
        setShowProductModal(true)
    }

    const handleEditProduct = (product) => {
        setEditingProduct(product)
        setProductForm({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            stock: product.stock.toString(),
            description: product.description,
            originCountry: product.originCountry || 'Uzbekistan',
            material: product.material || '',
            complianceInfo: product.complianceInfo || '',
            images: product.images || [product.image],
            videos: product.videos || []
        })
        setShowProductModal(true)
    }

    const handleSaveProduct = (e) => {
        e.preventDefault()

        const newProduct = {
            id: editingProduct?.id || Date.now(),
            name: productForm.name,
            category: productForm.category,
            price: parseFloat(productForm.price),
            stock: parseInt(productForm.stock),
            description: productForm.description,
            originCountry: productForm.originCountry,
            material: productForm.material,
            complianceInfo: productForm.complianceInfo,
            image: productForm.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            images: productForm.images,
            videos: productForm.videos,
            sellerId: user.id
        }

        if (editingProduct) {
            setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p))
        } else {
            setProducts([...products, newProduct])
        }

        setShowProductModal(false)
    }

    const handleDeactivateProduct = (productId) => {
        setProducts(products.map(p =>
            p.id === productId ? { ...p, isActive: false, stock: 0 } : p
        ))
    }

    const handleActivateProduct = (productId) => {
        setProducts(products.map(p =>
            p.id === productId ? { ...p, isActive: true } : p
        ))
    }

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊' },
        { id: 'products', name: 'Products', icon: '📦' },
        { id: 'orders', name: 'Orders', icon: '🛒' },
        { id: 'earnings', name: 'Earnings', icon: '💰' },
        { id: 'messages', name: 'Messages', icon: '💬' },
        { id: 'settings', name: 'Settings', icon: '⚙️' }
    ]

    return (
        <div className="seller-dashboard">
            <Header user={user} onLogout={onLogout} />

            <div className="dashboard-container">
                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <div className="seller-profile">
                        <div className="profile-avatar">{user.name?.charAt(0)}</div>
                        <div className="profile-info">
                            <span className="seller-name">{user.sellerProfile?.businessName || user.name}</span>
                            <span className="seller-status">
                                {user.isVerified ? '✓ Verified Seller' : '⏳ Pending Verification'}
                            </span>
                        </div>
                    </div>
                    <nav className="dashboard-nav">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="nav-icon">{tab.icon}</span>
                                <span className="nav-label">{tab.name}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="dashboard-main">
                    {/* Verification Banner */}
                    {!user.isVerified && (
                        <div className="verification-banner">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <div>
                                <strong>Verification Pending</strong>
                                <p>Complete your profile to start selling. Upload your business documents and identity verification.</p>
                            </div>
                            <button className="btn-primary">Complete Setup</button>
                        </div>
                    )}

                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className="seller-dashboard-content">
                            <h1>Seller Dashboard</h1>

                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon products">📦</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stats.totalProducts}</span>
                                        <span className="stat-label">Total Products</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon orders">🛒</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stats.totalOrders}</span>
                                        <span className="stat-label">Total Orders</span>
                                    </div>
                                </div>
                                <div className="stat-card warning">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stats.pendingOrders}</span>
                                        <span className="stat-label">Pending Orders</span>
                                    </div>
                                </div>
                                <div className="stat-card success">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <span className="stat-value">${stats.totalRevenue.toFixed(2)}</span>
                                        <span className="stat-label">Total Earnings</span>
                                    </div>
                                </div>
                            </div>

                            {/* Escrow Info */}
                            <div className="escrow-section">
                                <h3>Escrow Balance</h3>
                                <div className="escrow-card">
                                    <div className="escrow-amount">
                                        <span className="amount">${stats.escrowHeld.toFixed(2)}</span>
                                        <span className="label">Held in Escrow</span>
                                    </div>
                                    <div className="escrow-info">
                                        <p>Funds are released when buyers confirm delivery</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="actions-grid">
                                    <button className="action-card" onClick={handleAddProduct}>
                                        <span className="action-icon">➕</span>
                                        <span>Add Product</span>
                                    </button>
                                    <button className="action-card" onClick={() => setActiveTab('orders')}>
                                        <span className="action-icon">📋</span>
                                        <span>View Orders</span>
                                    </button>
                                    <button className="action-card" onClick={() => setActiveTab('messages')}>
                                        <span className="action-icon">💬</span>
                                        <span>Messages</span>
                                    </button>
                                    <button className="action-card">
                                        <span className="action-icon">📊</span>
                                        <span>Analytics</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Tab (FR-04, FR-05) */}
                    {activeTab === 'products' && (
                        <div className="seller-products">
                            <div className="section-header">
                                <h1>My Products</h1>
                                <button className="btn-primary" onClick={handleAddProduct}>
                                    <span>➕</span> Add Product
                                </button>
                            </div>

                            <div className="products-grid seller-products-grid">
                                {products.map(product => (
                                    <div key={product.id} className={`product-card seller-card ${product.isActive === false ? 'inactive' : ''}`}>
                                        <div className="product-image">
                                            <img src={product.image} alt={product.name} />
                                            {product.stock === 0 && (
                                                <span className="out-of-stock-badge">Out of Stock</span>
                                            )}
                                            {product.isActive === false && (
                                                <span className="inactive-badge">Inactive</span>
                                            )}
                                        </div>
                                        <div className="product-info">
                                            <h3>{product.name}</h3>
                                            <div className="product-meta">
                                                <span className="price">${product.price}</span>
                                                <span className="stock">Stock: {product.stock}</span>
                                            </div>
                                            <p className="product-description">{product.description?.substring(0, 60)}...</p>
                                        </div>
                                        <div className="product-actions">
                                            <button className="btn-edit" onClick={() => handleEditProduct(product)}>
                                                ✏️ Edit
                                            </button>
                                            {product.isActive !== false ? (
                                                <button className="btn-deactivate" onClick={() => handleDeactivateProduct(product.id)}>
                                                    🚫 Deactivate
                                                </button>
                                            ) : (
                                                <button className="btn-activate" onClick={() => handleActivateProduct(product.id)}>
                                                    ✓ Activate
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="seller-orders">
                            <h1>Orders</h1>

                            <div className="orders-list">
                                {orders.length === 0 ? (
                                    <div className="no-orders">
                                        <p>No orders yet. Products will appear here when customers place orders.</p>
                                    </div>
                                ) : (
                                    orders.map(order => (
                                        <div key={order.id} className="order-card seller-order">
                                            <div className="order-header">
                                                <div className="order-id">
                                                    <span className="label">Order ID:</span>
                                                    <span className="value">{order.id}</span>
                                                </div>
                                                <span className={`order-status ${order.status}`}>{order.status}</span>
                                            </div>

                                            <div className="order-items">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="order-item">
                                                        <img src={item.image} alt={item.name} />
                                                        <div className="item-details">
                                                            <span className="item-name">{item.name}</span>
                                                            <span className="item-qty">Qty: {item.quantity}</span>
                                                        </div>
                                                        <span className="item-price">${item.price.toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="order-footer">
                                                <div className="order-escrow">
                                                    <span className="label">Escrow Status:</span>
                                                    <span className={`escrow-badge ${order.payment?.status}`}>
                                                        {order.payment?.status}
                                                    </span>
                                                </div>
                                                <div className="order-earning">
                                                    <span className="label">Your Earning:</span>
                                                    <span className="value">${order.payment?.escrow?.sellerAmount?.toFixed(2) || '0.00'}</span>
                                                </div>
                                            </div>

                                            {/* Product Condition Upload (FR-15) */}
                                            {order.status === ORDER_STATUS.PREPARING && (
                                                <div className="condition-upload">
                                                    <h4>📸 Upload Product Condition Photos</h4>
                                                    <p>Required before shipping. This protects you if damage claims are made.</p>
                                                    <div className="upload-area">
                                                        <button className="btn-secondary">
                                                            <span>📷</span> Upload Photos
                                                        </button>
                                                        <button className="btn-secondary">
                                                            <span>🎥</span> Upload Video
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="order-actions">
                                                {order.status === ORDER_STATUS.PAYMENT_RECEIVED && (
                                                    <button className="btn-primary">Start Preparing</button>
                                                )}
                                                {order.status === ORDER_STATUS.PREPARING && (
                                                    <button className="btn-primary">Mark Ready for Pickup</button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Earnings Tab */}
                    {activeTab === 'earnings' && (
                        <div className="seller-earnings">
                            <h1>Earnings</h1>

                            <div className="earnings-summary">
                                <div className="earnings-card total">
                                    <h3>Total Earnings</h3>
                                    <span className="amount">${stats.totalRevenue.toFixed(2)}</span>
                                </div>
                                <div className="earnings-card escrow">
                                    <h3>In Escrow</h3>
                                    <span className="amount">${stats.escrowHeld.toFixed(2)}</span>
                                    <span className="note">Released upon delivery confirmation</span>
                                </div>
                                <div className="earnings-card available">
                                    <h3>Available for Withdrawal</h3>
                                    <span className="amount">${stats.totalRevenue.toFixed(2)}</span>
                                    <button className="btn-primary">Withdraw</button>
                                </div>
                            </div>

                            <div className="earnings-breakdown">
                                <h3>How Earnings Work</h3>
                                <div className="breakdown-list">
                                    <div className="breakdown-item">
                                        <span className="step">1</span>
                                        <div className="breakdown-info">
                                            <h4>Customer Pays</h4>
                                            <p>Payment is held in secure escrow</p>
                                        </div>
                                    </div>
                                    <div className="breakdown-item">
                                        <span className="step">2</span>
                                        <div className="breakdown-info">
                                            <h4>You Ship the Product</h4>
                                            <p>Upload condition photos and hand over to logistics</p>
                                        </div>
                                    </div>
                                    <div className="breakdown-item">
                                        <span className="step">3</span>
                                        <div className="breakdown-info">
                                            <h4>Customer Confirms Delivery</h4>
                                            <p>Funds are released to your account</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="seller-settings">
                            <h1>Seller Settings</h1>

                            <div className="settings-section">
                                <h3>Business Profile</h3>
                                <div className="form-group">
                                    <label>Business Name</label>
                                    <input type="text" defaultValue={user.sellerProfile?.businessName} />
                                </div>
                                <div className="form-group">
                                    <label>Business Registration</label>
                                    <input type="text" defaultValue={user.sellerProfile?.businessRegistration} />
                                </div>
                            </div>

                            <div className="settings-section">
                                <h3>Store Settings</h3>
                                <div className="form-group">
                                    <label>Default Shipping Fee</label>
                                    <input type="number" defaultValue="10.00" />
                                </div>
                                <div className="form-group">
                                    <label>Auto-translate product descriptions</label>
                                    <input type="checkbox" defaultChecked />
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Add/Edit Product Modal */}
            {showProductModal && (
                <div className="modal">
                    <div className="modal-content product-modal">
                        <div className="modal-header">
                            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button className="close-btn" onClick={() => setShowProductModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleSaveProduct}>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name *</label>
                                    <input
                                        type="text"
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Category *</label>
                                    <select
                                        value={productForm.category}
                                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Price ($) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Stock Quantity *</label>
                                    <input
                                        type="number"
                                        value={productForm.stock}
                                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    value={productForm.description}
                                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                                    rows={4}
                                    required
                                    placeholder="Describe your product in detail..."
                                />
                                <span className="helper-text">This will be auto-translated for international buyers</span>
                            </div>

                            {/* FR-05: Origin, Material, Compliance */}
                            <div className="form-section">
                                <h4>Product Details (Required for Compliance)</h4>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Origin Country *</label>
                                        <select
                                            value={productForm.originCountry}
                                            onChange={(e) => setProductForm({ ...productForm, originCountry: e.target.value })}
                                            required
                                        >
                                            <option value="Uzbekistan">Uzbekistan</option>
                                            <option value="China">China</option>
                                            <option value="Kazakhstan">Kazakhstan</option>
                                            <option value="Tajikistan">Tajikistan</option>
                                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Material</label>
                                        <input
                                            type="text"
                                            value={productForm.material}
                                            onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                                            placeholder="e.g., Cotton, Leather, Ceramic"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Compliance Information</label>
                                    <input
                                        type="text"
                                        value={productForm.complianceInfo}
                                        onChange={(e) => setProductForm({ ...productForm, complianceInfo: e.target.value })}
                                        placeholder="e.g., CE certified, ISO 9001, Halal certified"
                                    />
                                </div>
                            </div>

                            {/* FR-05: Images/Videos */}
                            <div className="form-section">
                                <h4>Media (High-quality images required)</h4>
                                <div className="media-upload-grid">
                                    <div className="upload-box">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                            <polyline points="21 15 16 10 5 21"></polyline>
                                        </svg>
                                        <span>Add Images</span>
                                    </div>
                                    <div className="upload-box">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                                        </svg>
                                        <span>Add Video</span>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowProductModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingProduct ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default SellerDashboard
