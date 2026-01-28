// DragonPath E-commerce - Admin Panel
// FR-17: Admins may ban users (not delete) for fraud, scams, or policy violations
// FR-18: Banned users are added to a risk registry
// FR-19: No user data is ever sold to third parties

import { useState, useEffect } from 'react'
import { mockUsers, riskRegistry, VERIFICATION_STATUS, USER_ROLES } from '../data/users'
import { mockOrders, ORDER_STATUS } from '../data/orders'
import Header from '../components/Header'
import Footer from '../components/Footer'

function AdminPage({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [users, setUsers] = useState([])
    const [orders, setOrders] = useState([])
    const [riskUsers, setRiskUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [banReason, setBanReason] = useState('')
    const [showBanModal, setShowBanModal] = useState(false)
    const [filterRole, setFilterRole] = useState('all')
    const [filterStatus, setFilterStatus] = useState('all')

    useEffect(() => {
        // Load data
        setUsers(mockUsers.filter(u => u.role !== USER_ROLES.ADMIN))
        setOrders(mockOrders)
        setRiskUsers(riskRegistry)
    }, [])

    // Dashboard Stats
    const stats = {
        totalUsers: users.length,
        totalBuyers: users.filter(u => u.role === USER_ROLES.BUYER).length,
        totalSellers: users.filter(u => u.role === USER_ROLES.SELLER).length,
        pendingSellers: users.filter(u => u.role === USER_ROLES.SELLER && u.sellerProfile?.verificationStatus === VERIFICATION_STATUS.PENDING).length,
        totalOrders: orders.length,
        activeOrders: orders.filter(o => [ORDER_STATUS.PREPARING, ORDER_STATUS.IN_TRANSIT, ORDER_STATUS.OUT_FOR_DELIVERY].includes(o.status)).length,
        completedOrders: orders.filter(o => o.status === ORDER_STATUS.DELIVERED || o.status === ORDER_STATUS.CONFIRMED).length,
        totalRevenue: orders.filter(o => o.status === ORDER_STATUS.CONFIRMED).reduce((sum, o) => sum + o.total, 0),
        bannedUsers: riskUsers.length
    }

    const handleBanUser = (userId) => {
        const userToBan = users.find(u => u.id === userId)
        setSelectedUser(userToBan)
        setShowBanModal(true)
    }

    const confirmBan = () => {
        if (!selectedUser || !banReason) return

        // Add to risk registry (FR-18)
        const newRiskEntry = {
            id: `banned-${Date.now()}`,
            userId: selectedUser.id,
            email: selectedUser.email,
            name: selectedUser.name,
            reason: banReason,
            bannedAt: new Date().toISOString(),
            bannedBy: user.id,
            behaviorPatterns: ['manual_ban'],
            riskScore: 80,
            previousViolations: 0
        }

        setRiskUsers([...riskUsers, newRiskEntry])

        // Update user status
        setUsers(users.map(u =>
            u.id === selectedUser.id
                ? { ...u, isBanned: true }
                : u
        ))

        setShowBanModal(false)
        setSelectedUser(null)
        setBanReason('')
    }

    const handleVerifySeller = (userId) => {
        setUsers(users.map(u => {
            if (u.id === userId && u.sellerProfile) {
                return {
                    ...u,
                    isVerified: true,
                    sellerProfile: {
                        ...u.sellerProfile,
                        verificationStatus: VERIFICATION_STATUS.VERIFIED,
                        verifiedAt: new Date().toISOString()
                    }
                }
            }
            return u
        }))
    }

    const handleRejectSeller = (userId) => {
        setUsers(users.map(u => {
            if (u.id === userId && u.sellerProfile) {
                return {
                    ...u,
                    sellerProfile: {
                        ...u.sellerProfile,
                        verificationStatus: VERIFICATION_STATUS.REJECTED
                    }
                }
            }
            return u
        }))
    }

    const filteredUsers = users.filter(u => {
        if (filterRole !== 'all' && u.role !== filterRole) return false
        if (filterStatus === 'pending' && u.sellerProfile?.verificationStatus !== VERIFICATION_STATUS.PENDING) return false
        if (filterStatus === 'verified' && !u.isVerified) return false
        if (filterStatus === 'banned' && !u.isBanned) return false
        return true
    })

    const tabs = [
        { id: 'dashboard', name: 'Dashboard', icon: '📊' },
        { id: 'users', name: 'User Management', icon: '👥' },
        { id: 'sellers', name: 'Seller Verification', icon: '✓' },
        { id: 'orders', name: 'Orders', icon: '📦' },
        { id: 'risk', name: 'Risk Registry', icon: '⚠️' },
        { id: 'settings', name: 'Settings', icon: '⚙️' }
    ]

    return (
        <div className="admin-page">
            <Header user={user} onLogout={onLogout} />

            <div className="admin-container">
                {/* Sidebar */}
                <aside className="admin-sidebar">
                    <div className="admin-brand">
                        <span className="dragon-icon">🐉</span>
                        <span>Admin Panel</span>
                    </div>
                    <nav className="admin-nav">
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
                <main className="admin-main">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className="admin-dashboard">
                            <h1>Dashboard</h1>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon users">👥</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stats.totalUsers}</span>
                                        <span className="stat-label">Total Users</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon sellers">🏪</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stats.totalSellers}</span>
                                        <span className="stat-label">Sellers</span>
                                    </div>
                                </div>
                                <div className="stat-card warning">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stats.pendingSellers}</span>
                                        <span className="stat-label">Pending Verification</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon orders">📦</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stats.totalOrders}</span>
                                        <span className="stat-label">Total Orders</span>
                                    </div>
                                </div>
                                <div className="stat-card success">
                                    <div className="stat-icon">✓</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stats.completedOrders}</span>
                                        <span className="stat-label">Completed Orders</span>
                                    </div>
                                </div>
                                <div className="stat-card revenue">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <span className="stat-value">${stats.totalRevenue.toFixed(2)}</span>
                                        <span className="stat-label">Total Revenue</span>
                                    </div>
                                </div>
                                <div className="stat-card danger">
                                    <div className="stat-icon">⚠️</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stats.bannedUsers}</span>
                                        <span className="stat-label">Banned Users</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon active">🔄</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{stats.activeOrders}</span>
                                        <span className="stat-label">Active Orders</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="recent-activity">
                                <h3>Recent Activity</h3>
                                <div className="activity-list">
                                    <div className="activity-item">
                                        <span className="activity-icon">📦</span>
                                        <span className="activity-text">New order #DP-2026-001234 placed</span>
                                        <span className="activity-time">2 hours ago</span>
                                    </div>
                                    <div className="activity-item">
                                        <span className="activity-icon">🏪</span>
                                        <span className="activity-text">New seller registration pending</span>
                                        <span className="activity-time">5 hours ago</span>
                                    </div>
                                    <div className="activity-item">
                                        <span className="activity-icon">✓</span>
                                        <span className="activity-text">Order delivered successfully</span>
                                        <span className="activity-time">1 day ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="admin-users">
                            <div className="section-header">
                                <h1>User Management</h1>
                                <div className="filters">
                                    <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                                        <option value="all">All Roles</option>
                                        <option value="buyer">Buyers</option>
                                        <option value="seller">Sellers</option>
                                    </select>
                                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                        <option value="all">All Status</option>
                                        <option value="verified">Verified</option>
                                        <option value="pending">Pending</option>
                                        <option value="banned">Banned</option>
                                    </select>
                                </div>
                            </div>

                            <div className="users-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(u => (
                                            <tr key={u.id} className={u.isBanned ? 'banned' : ''}>
                                                <td>
                                                    <div className="user-cell">
                                                        <span className="user-avatar">{u.name.charAt(0)}</span>
                                                        <span>{u.name}</span>
                                                    </div>
                                                </td>
                                                <td>{u.email}</td>
                                                <td>
                                                    <span className={`role-badge ${u.role}`}>{u.role}</span>
                                                </td>
                                                <td>
                                                    {u.isBanned ? (
                                                        <span className="status-badge banned">Banned</span>
                                                    ) : u.isVerified ? (
                                                        <span className="status-badge verified">Verified</span>
                                                    ) : (
                                                        <span className="status-badge pending">Pending</span>
                                                    )}
                                                </td>
                                                <td>{u.createdAt}</td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button className="view-btn" title="View Details">👁️</button>
                                                        {!u.isBanned && (
                                                            <button
                                                                className="ban-btn"
                                                                title="Ban User"
                                                                onClick={() => handleBanUser(u.id)}
                                                            >
                                                                🚫
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Seller Verification Tab */}
                    {activeTab === 'sellers' && (
                        <div className="admin-sellers">
                            <h1>Seller Verification</h1>
                            <p className="section-desc">Review and verify seller applications (FR-02)</p>

                            <div className="pending-sellers">
                                {users.filter(u =>
                                    u.role === USER_ROLES.SELLER &&
                                    u.sellerProfile?.verificationStatus === VERIFICATION_STATUS.PENDING
                                ).map(seller => (
                                    <div key={seller.id} className="seller-verification-card">
                                        <div className="seller-header">
                                            <div className="seller-avatar">{seller.name.charAt(0)}</div>
                                            <div className="seller-info">
                                                <h3>{seller.sellerProfile?.businessName || seller.name}</h3>
                                                <span className="seller-email">{seller.email}</span>
                                            </div>
                                            <span className="pending-badge">Pending Review</span>
                                        </div>

                                        <div className="verification-checklist">
                                            <h4>Verification Documents</h4>
                                            <div className="checklist-item">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                <span>Business Registration: {seller.sellerProfile?.businessRegistration || 'Not provided'}</span>
                                            </div>
                                            <div className="checklist-item">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                <span>Physical Address: {seller.sellerProfile?.physicalAddress?.city || 'Not provided'}, {seller.sellerProfile?.physicalAddress?.country}</span>
                                            </div>
                                            <div className="checklist-item pending">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                </svg>
                                                <span>Identity Verification (KYC): Pending upload</span>
                                            </div>
                                            <div className="checklist-item pending">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                </svg>
                                                <span>Product Photos: Pending upload</span>
                                            </div>
                                        </div>

                                        <div className="verification-actions">
                                            <button
                                                className="btn-reject"
                                                onClick={() => handleRejectSeller(seller.id)}
                                            >
                                                Reject
                                            </button>
                                            <button
                                                className="btn-approve"
                                                onClick={() => handleVerifySeller(seller.id)}
                                            >
                                                Approve Seller
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {users.filter(u =>
                                    u.role === USER_ROLES.SELLER &&
                                    u.sellerProfile?.verificationStatus === VERIFICATION_STATUS.PENDING
                                ).length === 0 && (
                                        <div className="no-pending">
                                            <span>✓</span>
                                            <p>No pending seller verifications</p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}

                    {/* Risk Registry Tab (FR-18) */}
                    {activeTab === 'risk' && (
                        <div className="admin-risk">
                            <h1>Risk Registry</h1>
                            <p className="section-desc">
                                Banned users and fraud patterns for behavioral analysis and prevention (FR-18)
                            </p>

                            <div className="risk-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Email</th>
                                            <th>Reason</th>
                                            <th>Risk Score</th>
                                            <th>Patterns</th>
                                            <th>Banned Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {riskUsers.map(entry => (
                                            <tr key={entry.id}>
                                                <td>{entry.name}</td>
                                                <td>{entry.email}</td>
                                                <td>{entry.reason}</td>
                                                <td>
                                                    <div className={`risk-score ${entry.riskScore >= 80 ? 'high' : entry.riskScore >= 50 ? 'medium' : 'low'}`}>
                                                        {entry.riskScore}%
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="pattern-tags">
                                                        {entry.behaviorPatterns.map((pattern, idx) => (
                                                            <span key={idx} className="pattern-tag">{pattern}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>{new Date(entry.bannedAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="privacy-notice">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <div>
                                    <h4>Privacy Policy (FR-19)</h4>
                                    <p>No user data is ever sold to third parties. Risk registry data is used solely for platform security and fraud prevention.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="admin-orders">
                            <h1>Order Management</h1>
                            <div className="orders-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Buyer</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Escrow</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.buyerId}</td>
                                                <td>{order.items.length} item(s)</td>
                                                <td>${order.total.toFixed(2)}</td>
                                                <td>
                                                    <span className={`order-status ${order.status}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`escrow-status ${order.payment?.status}`}>
                                                        {order.payment?.status}
                                                    </span>
                                                </td>
                                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="admin-settings">
                            <h1>Platform Settings</h1>
                            <div className="settings-groups">
                                <div className="settings-group">
                                    <h3>Content Moderation</h3>
                                    <div className="setting-item">
                                        <label>Auto-block prohibited content</label>
                                        <input type="checkbox" defaultChecked />
                                    </div>
                                    <div className="setting-item">
                                        <label>Block external links in messages</label>
                                        <input type="checkbox" defaultChecked />
                                    </div>
                                    <div className="setting-item">
                                        <label>Block GIFs and stickers</label>
                                        <input type="checkbox" defaultChecked />
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3>Escrow Settings</h3>
                                    <div className="setting-item">
                                        <label>Cancellation window (days)</label>
                                        <input type="number" defaultValue={10} />
                                    </div>
                                    <div className="setting-item">
                                        <label>Platform fee (%)</label>
                                        <input type="number" defaultValue={5} />
                                    </div>
                                </div>

                                <div className="settings-group">
                                    <h3>Compliance</h3>
                                    <div className="setting-item">
                                        <label>Require seller KYC verification</label>
                                        <input type="checkbox" defaultChecked />
                                    </div>
                                    <div className="setting-item">
                                        <label>Require business registration</label>
                                        <input type="checkbox" defaultChecked />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Ban User Modal */}
            {showBanModal && (
                <div className="modal">
                    <div className="modal-content ban-modal">
                        <h2>Ban User</h2>
                        <p>You are about to ban <strong>{selectedUser?.name}</strong>. This action will:</p>
                        <ul>
                            <li>Prevent the user from logging in</li>
                            <li>Add them to the Risk Registry</li>
                            <li>Preserve all historical data for analysis</li>
                        </ul>

                        <div className="form-group">
                            <label>Reason for ban:</label>
                            <select value={banReason} onChange={(e) => setBanReason(e.target.value)}>
                                <option value="">Select reason...</option>
                                <option value="Fraud - selling counterfeit products">Fraud - Selling counterfeit products</option>
                                <option value="Scam - payment fraud">Scam - Payment fraud</option>
                                <option value="Policy violation - prohibited content">Policy violation - Prohibited content</option>
                                <option value="Multiple accounts">Multiple accounts</option>
                                <option value="Harassment">Harassment</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowBanModal(false)}>Cancel</button>
                            <button
                                className="btn-danger"
                                onClick={confirmBan}
                                disabled={!banReason}
                            >
                                Confirm Ban
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default AdminPage
