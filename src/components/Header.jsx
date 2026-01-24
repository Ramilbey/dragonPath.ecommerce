import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function Header({ user, showSearch = true }) {
    const { cart } = useApp()
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="logo-section">
                    <div className="dragon-icon small">🐉</div>
                    <span className="brand-name">DragonPath</span>
                </Link>

                {showSearch && (
                    <nav className="nav-links">
                        <Link to="/" className="nav-link">Shop</Link>
                        <Link to="/profile" className="nav-link">My Profile</Link>
                    </nav>
                )}

                <div className="user-section">
                    <div className="cart-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                        <span className="cart-count">{cartCount}</span>
                    </div>

                    <Link to="/profile" className="user-avatar" title="My Profile">
                        <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header
