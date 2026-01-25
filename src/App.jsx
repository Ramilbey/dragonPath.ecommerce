import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AppProvider } from './context/AppContext'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'
import CartPage from './pages/CartPage'
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

    return (
        <AppProvider>
            {showAuth && <AuthModal onLogin={handleLogin} />}
            {user && (
                <Routes>
                    <Route path="/" element={<HomePage user={user} />} />
                    <Route path="/cart" element={<CartPage user={user} />} />
                    <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} onLogout={handleLogout} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            )}
        </AppProvider>
    )
}

export default App
