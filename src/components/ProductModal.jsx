import { useState } from 'react'
import { useApp } from '../context/AppContext'

function ProductModal({ product, onClose, onOrder }) {
    const { categories } = useApp()
    const [quantity, setQuantity] = useState(1)

    if (!product) return null

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId)
        return category ? category.name : categoryId
    }

    const stockClass = product.stock <= 3 ? 'low' : product.stock === 0 ? 'out' : 'in'
    const total = product.price * quantity

    const updateQuantity = (delta) => {
        let newValue = quantity + delta
        if (newValue < 1) newValue = 1
        if (newValue > product.stock) newValue = product.stock
        setQuantity(newValue)
    }

    const handleQuantityChange = (e) => {
        let value = parseInt(e.target.value) || 1
        if (value < 1) value = 1
        if (value > product.stock) value = product.stock
        setQuantity(value)
    }

    const handleOrder = () => {
        onOrder(product, quantity)
    }

    return (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content product-modal">
                <button className="modal-close" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="product-detail">
                    <div className="product-image-container">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="product-detail-image"
                        />
                    </div>

                    <div className="product-info">
                        <h2 className="product-detail-name">{product.name}</h2>
                        <p className="product-detail-category">{getCategoryName(product.category)}</p>

                        <div className="product-detail-price">
                            <span className="price-main">${product.price.toFixed(2)}</span>
                        </div>

                        <div className="stock-info">
                            <span className="stock-label">In Stock:</span>
                            <span className={`stock-count ${stockClass}`}>{product.stock} units</span>
                        </div>

                        <p className="product-description">{product.description}</p>

                        <div className="quantity-section">
                            <label>Quantity:</label>
                            <div className="quantity-controls">
                                <button className="qty-btn" onClick={() => updateQuantity(-1)}>−</button>
                                <input
                                    type="number"
                                    value={quantity}
                                    min="1"
                                    max={product.stock}
                                    onChange={handleQuantityChange}
                                />
                                <button className="qty-btn" onClick={() => updateQuantity(1)}>+</button>
                            </div>
                        </div>

                        <div className="total-section">
                            <span className="total-label">Total:</span>
                            <span className="total-price">${total.toFixed(2)}</span>
                        </div>

                        <button className="btn-primary btn-full" onClick={handleOrder}>
                            <span>Order Now</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductModal
