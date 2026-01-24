import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import SearchBar from '../components/SearchBar'
import CategoryCard from '../components/CategoryCard'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import DeliveryModal from '../components/DeliveryModal'
import SuccessModal from '../components/SuccessModal'

function HomePage({ user }) {
    const { products, categories } = useApp()
    const [activeCategory, setActiveCategory] = useState(null)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [showProductModal, setShowProductModal] = useState(false)
    const [showDeliveryModal, setShowDeliveryModal] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [orderQuantity, setOrderQuantity] = useState(1)

    const filteredProducts = activeCategory
        ? products.filter(p => p.category === activeCategory)
        : products

    const getProductsTitle = () => {
        if (activeCategory) {
            const category = categories.find(c => c.id === activeCategory)
            return category ? category.name : 'Products'
        }
        return 'All Products'
    }

    const handleCategoryClick = (categoryId) => {
        setActiveCategory(categoryId === activeCategory ? null : categoryId)
    }

    const handleProductClick = (product) => {
        setSelectedProduct(product)
        setShowProductModal(true)
    }

    const handleOrder = (product, quantity) => {
        setSelectedProduct(product)
        setOrderQuantity(quantity)
        setShowProductModal(false)
        setShowDeliveryModal(true)
    }

    const handleOrderSuccess = () => {
        setShowDeliveryModal(false)
        setShowSuccessModal(true)
    }

    const handleContinueShopping = () => {
        setShowSuccessModal(false)
        setSelectedProduct(null)
    }

    return (
        <div className="app">
            <header className="header">
                <div className="header-container">
                    <Link to="/" className="logo-section">
                        <div className="dragon-icon small">🐉</div>
                        <span className="brand-name">DragonPath</span>
                    </Link>

                    <SearchBar onProductSelect={handleProductClick} />

                    <div className="user-section">
                        <div className="cart-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="9" cy="21" r="1"></circle>
                                <circle cx="20" cy="21" r="1"></circle>
                                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                            <span className="cart-count">0</span>
                        </div>

                        <Link to="/profile" className="user-avatar" title="My Profile">
                            <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="main-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Discover <span className="gradient-text">Extraordinary</span> Products
                        </h1>
                        <p className="hero-subtitle">
                            Shop the finest collection with exclusive deals and lightning-fast delivery
                        </p>
                    </div>
                    <div className="hero-decoration">
                        <div className="floating-shape shape-1"></div>
                        <div className="floating-shape shape-2"></div>
                        <div className="floating-shape shape-3"></div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="categories-section">
                    <h2 className="section-title">Shop by Category</h2>
                    <div className="categories-grid">
                        {categories.map(category => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                isActive={activeCategory === category.id}
                                onClick={() => handleCategoryClick(category.id)}
                            />
                        ))}
                    </div>
                </section>

                {/* Products Section */}
                <section className="products-section">
                    <div className="products-header">
                        <h2 className="section-title">{getProductsTitle()}</h2>
                        {activeCategory && (
                            <button
                                className="btn-secondary"
                                onClick={() => setActiveCategory(null)}
                            >
                                Show All
                            </button>
                        )}
                    </div>
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => handleProductClick(product)}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <Footer />

            {/* Modals */}
            {showProductModal && selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    onClose={() => setShowProductModal(false)}
                    onOrder={handleOrder}
                />
            )}

            {showDeliveryModal && selectedProduct && (
                <DeliveryModal
                    product={selectedProduct}
                    quantity={orderQuantity}
                    onClose={() => setShowDeliveryModal(false)}
                    onSuccess={handleOrderSuccess}
                />
            )}

            {showSuccessModal && (
                <SuccessModal onClose={handleContinueShopping} />
            )}
        </div>
    )
}

export default HomePage
