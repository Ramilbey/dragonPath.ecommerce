// DragonPath E-commerce - Product Reviews Page
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductReviews from '../components/ProductReviews'

function ProductReviewsPage({ user, onLogout }) {
    const { productId } = useParams()
    const navigate = useNavigate()
    const { products, categories } = useApp()
    const [product, setProduct] = useState(null)

    useEffect(() => {
        const foundProduct = products.find(p => p.id === parseInt(productId))
        if (foundProduct) {
            setProduct(foundProduct)
        } else {
            navigate('/')
        }
        window.scrollTo(0, 0)
    }, [productId, products, navigate])

    if (!product) {
        return (
            <div className="reviews-page">
                <Header user={user} onLogout={onLogout} />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading reviews...</p>
                </div>
                <Footer />
            </div>
        )
    }

    const categoryInfo = categories.find(c => c.id === product.category)

    return (
        <div className="reviews-page">
            <Header user={user} onLogout={onLogout} />

            <main className="reviews-page-container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="separator">/</span>
                    <Link to={`/product/${product.id}`}>{product.name}</Link>
                    <span className="separator">/</span>
                    <span className="current">Reviews</span>
                </nav>

                {/* Product Summary Card */}
                <div className="product-summary-card">
                    <img src={product.image} alt={product.name} className="product-thumb" />
                    <div className="product-summary-info">
                        <span className="category">{categoryInfo?.icon} {categoryInfo?.name}</span>
                        <h1>{product.name}</h1>
                        <span className="price">${product.price.toFixed(2)}</span>
                    </div>
                    <Link to={`/product/${product.id}`} className="btn-back-to-product">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Back to Product
                    </Link>
                </div>

                {/* Full Reviews Section */}
                <div className="full-reviews-section">
                    <ProductReviews
                        productId={product.id}
                        user={user}
                        previewMode={false}
                    />
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default ProductReviewsPage
