// DragonPath E-commerce - Product Detail Page
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Header from '../components/Header'
import Footer from '../components/Footer'
import ProductReviews from '../components/ProductReviews'

function ProductPage({ user, onLogout }) {
    const { productId } = useParams()
    const navigate = useNavigate()
    const { products, categories, addToCart, addToWishlist, wishlist } = useApp()

    const [product, setProduct] = useState(null)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [showFullReviews, setShowFullReviews] = useState(false)
    const [addedToCart, setAddedToCart] = useState(false)
    const [suggestedProducts, setSuggestedProducts] = useState([])

    useEffect(() => {
        // Find the product by ID
        const foundProduct = products.find(p => p.id === parseInt(productId))
        if (foundProduct) {
            setProduct(foundProduct)
            // Generate product images (mock multiple images)
            const images = foundProduct.images || [
                foundProduct.image,
                foundProduct.image.replace('w=500', 'w=600'),
                foundProduct.image.replace('w=500', 'w=700'),
                foundProduct.image.replace('w=500', 'w=800')
            ]
            foundProduct.galleryImages = images

            // Find suggested products (same category, excluding current)
            const suggested = products
                .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
                .slice(0, 4)

            // If not enough from same category, add random products
            if (suggested.length < 4) {
                const additional = products
                    .filter(p => p.id !== foundProduct.id && !suggested.includes(p))
                    .slice(0, 4 - suggested.length)
                suggested.push(...additional)
            }

            setSuggestedProducts(suggested)
        } else {
            navigate('/')
        }

        // Reset state when product changes
        setSelectedImage(0)
        setQuantity(1)
        setAddedToCart(false)

        // Scroll to top
        window.scrollTo(0, 0)
    }, [productId, products, navigate])

    const handleAddToCart = () => {
        if (product && !user?.isGuest) {
            addToCart(product, quantity)
            setAddedToCart(true)
            setTimeout(() => setAddedToCart(false), 2000)
        }
    }

    const handleBuyNow = () => {
        if (product && !user?.isGuest) {
            addToCart(product, quantity)
            navigate('/cart')
        }
    }

    const isInWishlist = product && wishlist.some(item => item.id === product.id)

    if (!product) {
        return (
            <div className="product-page">
                <Header user={user} onLogout={onLogout} />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading product...</p>
                </div>
                <Footer />
            </div>
        )
    }

    const categoryInfo = categories.find(c => c.id === product.category)

    return (
        <div className="product-page">
            <Header user={user} onLogout={onLogout} />

            <main className="product-detail-container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="separator">/</span>
                    <Link to={`/?category=${product.category}`}>{categoryInfo?.name || product.category}</Link>
                    <span className="separator">/</span>
                    <span className="current">{product.name}</span>
                </nav>

                {/* Product Main Section */}
                <div className="product-main">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image-container">
                            <img
                                src={product.galleryImages?.[selectedImage] || product.image}
                                alt={product.name}
                                className="main-image"
                            />
                            {product.stock === 0 && (
                                <div className="out-of-stock-overlay">Out of Stock</div>
                            )}
                            {product.stock > 0 && product.stock <= 5 && (
                                <div className="low-stock-badge">Only {product.stock} left!</div>
                            )}
                        </div>
                        <div className="thumbnail-gallery">
                            {(product.galleryImages || [product.image]).map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img src={img} alt={`${product.name} view ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="product-info-section">
                        <div className="product-header">
                            <span className="product-category">{categoryInfo?.icon} {categoryInfo?.name}</span>
                            <h1 className="product-title">{product.name}</h1>

                            {/* Rating Summary */}
                            <div className="rating-summary">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} className={`star ${star <= 4.5 ? 'filled' : ''}`}>★</span>
                                    ))}
                                </div>
                                <span className="rating-text">4.5 (128 reviews)</span>
                                <button
                                    className="view-reviews-link"
                                    onClick={() => setShowFullReviews(true)}
                                >
                                    View all reviews →
                                </button>
                            </div>
                        </div>

                        {/* Price Section */}
                        <div className="price-section">
                            <span className="current-price">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <>
                                    <span className="original-price">${product.originalPrice.toFixed(2)}</span>
                                    <span className="discount-badge">
                                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Stock Status */}
                        <div className="stock-status">
                            {product.stock > 10 ? (
                                <span className="in-stock">✓ In Stock</span>
                            ) : product.stock > 0 ? (
                                <span className="low-stock">⚠ Only {product.stock} left in stock</span>
                            ) : (
                                <span className="out-of-stock">✕ Out of Stock</span>
                            )}
                        </div>

                        {/* Description */}
                        <div className="product-description">
                            <h3>Description</h3>
                            <p>{product.description}</p>
                        </div>

                        {/* Product Details */}
                        <div className="product-details">
                            <h3>Product Details</h3>
                            <ul>
                                <li><strong>Category:</strong> {categoryInfo?.name}</li>
                                <li><strong>Origin:</strong> {product.originCountry || 'China'}</li>
                                {product.material && <li><strong>Material:</strong> {product.material}</li>}
                                {product.complianceInfo && <li><strong>Certifications:</strong> {product.complianceInfo}</li>}
                                <li><strong>SKU:</strong> DP-{product.id.toString().padStart(6, '0')}</li>
                            </ul>
                        </div>

                        {/* Quantity & Actions */}
                        {product.stock > 0 && !user?.isGuest && (
                            <div className="purchase-section">
                                <div className="quantity-selector">
                                    <span className="qty-label">Quantity:</span>
                                    <div className="qty-controls">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            disabled={quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="qty-value">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                            disabled={quantity >= product.stock}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="total-price">
                                        Total: <strong>${(product.price * quantity).toFixed(2)}</strong>
                                    </span>
                                </div>

                                <div className="action-buttons">
                                    <button
                                        className={`btn-add-cart ${addedToCart ? 'added' : ''}`}
                                        onClick={handleAddToCart}
                                    >
                                        {addedToCart ? (
                                            <>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                Added to Cart
                                            </>
                                        ) : (
                                            <>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="9" cy="21" r="1"></circle>
                                                    <circle cx="20" cy="21" r="1"></circle>
                                                    <path d="m1 1 4 4h16l-1.5 9H6L4 4"></path>
                                                </svg>
                                                Add to Cart
                                            </>
                                        )}
                                    </button>
                                    <button className="btn-buy-now" onClick={handleBuyNow}>
                                        Buy Now
                                    </button>
                                </div>

                                <button
                                    className={`btn-wishlist ${isInWishlist ? 'in-wishlist' : ''}`}
                                    onClick={() => addToWishlist(product)}
                                >
                                    <svg viewBox="0 0 24 24" fill={isInWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                    </svg>
                                    {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                                </button>
                            </div>
                        )}

                        {user?.isGuest && (
                            <div className="guest-notice-product">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="12"></line>
                                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                </svg>
                                <p>Sign in to purchase this product</p>
                                <button className="btn-primary" onClick={() => navigate('/')}>
                                    Sign In
                                </button>
                            </div>
                        )}

                        {/* Seller Info */}
                        <div className="seller-info-card">
                            <div className="seller-header">
                                <div className="seller-avatar">S</div>
                                <div className="seller-details">
                                    <span className="seller-name">Verified Seller</span>
                                    <span className="seller-badge">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        Verified
                                    </span>
                                </div>
                            </div>
                            <button className="btn-contact-seller">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                </svg>
                                Contact Seller
                            </button>
                        </div>

                        {/* Escrow Protection */}
                        <div className="escrow-protection-badge">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                            </svg>
                            <div>
                                <strong>Buyer Protection</strong>
                                <span>Payment held in escrow until delivery confirmed</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section Preview */}
                <section className="reviews-preview-section">
                    <div className="section-header">
                        <h2>Customer Reviews</h2>
                        <button
                            className="view-all-btn"
                            onClick={() => navigate(`/product/${productId}/reviews`)}
                        >
                            View All Reviews →
                        </button>
                    </div>

                    <ProductReviews
                        productId={product.id}
                        user={user}
                        previewMode={true}
                        maxReviews={3}
                    />
                </section>

                {/* Suggested Products */}
                <section className="suggested-products-section">
                    <h2>You Might Also Like</h2>
                    <div className="suggested-products-grid">
                        {suggestedProducts.map(suggestedProduct => (
                            <Link
                                key={suggestedProduct.id}
                                to={`/product/${suggestedProduct.id}`}
                                className="suggested-product-card"
                            >
                                <div className="suggested-product-image">
                                    <img src={suggestedProduct.image} alt={suggestedProduct.name} />
                                </div>
                                <div className="suggested-product-info">
                                    <h4>{suggestedProduct.name}</h4>
                                    <span className="suggested-product-price">
                                        ${suggestedProduct.price.toFixed(2)}
                                    </span>
                                    <div className="suggested-product-rating">
                                        <span className="stars">★★★★☆</span>
                                        <span className="count">(45)</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            {/* Full Reviews Modal */}
            {showFullReviews && (
                <div className="modal">
                    <div className="modal-content reviews-modal">
                        <button
                            className="modal-close"
                            onClick={() => setShowFullReviews(false)}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <ProductReviews
                            productId={product.id}
                            user={user}
                            previewMode={false}
                        />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default ProductPage
