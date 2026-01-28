import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import { USER_ROLES } from './data/users'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import CartPage from './pages/CartPage'
import AdminPage from './pages/AdminPage'
import SellerDashboard from './pages/SellerDashboard'
import ProductPage from './pages/ProductPage'
import ProductReviewsPage from './pages/ProductReviewsPage'
import AuthModal from './components/AuthModal'

function App() {
    const [user, setUser] = useState(null)
    const [showAuth, setShowAuth] = useState(false)

    useEffect(() => {
        const savedUser = localStorage.getItem('dragonPathUser')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        } else {
            setShowAuth(true)
        }
    }, [])

    const handleLogin = (userData) => {
        setUser(userData)
        localStorage.setItem('dragonPathUser', JSON.stringify(userData))
        setShowAuth(false)
    }

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem('dragonPathUser')
        setShowAuth(true)
    }

    // Role-based routing helper
    const getDefaultRoute = () => {
        if (!user) return '/'
        switch (user.role) {
            case USER_ROLES.ADMIN:
                return '/admin'
            case USER_ROLES.SELLER:
                return '/seller'
            default:
                return '/'
        }
    }

    return (
        <AppProvider>
            {showAuth && <AuthModal onLogin={handleLogin} />}
            {user && (
                <Routes>
                    {/* Public/Buyer Routes */}
                    <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
                    <Route path="/cart" element={<CartPage user={user} onLogout={handleLogout} />} />
                    <Route path="/profile" element={
                        user.isGuest ? (
                            <Navigate to="/" replace />
                        ) : (
                            <ProfilePage user={user} setUser={setUser} onLogout={handleLogout} />
                        )
                    } />

                    {/* Product Routes */}
                    <Route path="/product/:productId" element={<ProductPage user={user} onLogout={handleLogout} />} />
                    <Route path="/product/:productId/reviews" element={<ProductReviewsPage user={user} onLogout={handleLogout} />} />

                    {/* Seller Routes (FR-04) */}
                    <Route path="/seller" element={
                        user.role === USER_ROLES.SELLER ? (
                            <SellerDashboard user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    } />
                    <Route path="/seller/*" element={
                        user.role === USER_ROLES.SELLER ? (
                            <SellerDashboard user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    } />

                    {/* Admin Routes (FR-17, FR-18) */}
                    <Route path="/admin" element={
                        user.role === USER_ROLES.ADMIN ? (
                            <AdminPage user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    } />
                    <Route path="/admin/*" element={
                        user.role === USER_ROLES.ADMIN ? (
                            <AdminPage user={user} onLogout={handleLogout} />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    } />

                    {/* Catch-all redirect */}
                    <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
                </Routes>
            )}
        </AppProvider>
    )
}

export default App

