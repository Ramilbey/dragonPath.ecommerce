import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

function ProductCard({ product, onClick }) {
    const navigate = useNavigate()
    const { categories, wishlist, addToWishlist, removeFromWishlist } = useApp()

    const isInWishlist = wishlist.some(item => item.id === product.id)

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId)
        return category ? category.name : categoryId
    }

    const stockClass = product.stock <= 3 ? 'low' : product.stock === 0 ? 'out' : 'in'
    const stockText = product.stock <= 3 ? `Only ${product.stock} left!` : `${product.stock} in stock`

    const handleWishlistClick = (e) => {
        e.stopPropagation() // Prevent opening product modal
        if (isInWishlist) {
            removeFromWishlist(product.id)
        } else {
            addToWishlist(product)
        }
    }

    const handleCardClick = () => {
        // Navigate to product detail page
        navigate(`/product/${product.id}`)
    }

    return (
        <div className="product-card" onClick={handleCardClick}>
            <div className="product-image-wrapper">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                />
                <span className={`stock-badge ${stockClass}`}>{stockText}</span>

                {/* Wishlist Heart Button */}
                <button
                    className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
                    onClick={handleWishlistClick}
                    title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <svg viewBox="0 0 24 24" fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div className="product-details">
                <div className="product-category">{getCategoryName(product.category)}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price-row">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button className="view-btn">View Details</button>
                </div>
            </div>
        </div>
    )
}

export default ProductCard

