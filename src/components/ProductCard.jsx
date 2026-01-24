import { useApp } from '../context/AppContext'

function ProductCard({ product, onClick }) {
    const { categories } = useApp()

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId)
        return category ? category.name : categoryId
    }

    const stockClass = product.stock <= 3 ? 'low' : product.stock === 0 ? 'out' : 'in'
    const stockText = product.stock <= 3 ? `Only ${product.stock} left!` : `${product.stock} in stock`

    return (
        <div className="product-card" onClick={onClick}>
            <div className="product-image-wrapper">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                />
                <span className={`stock-badge ${stockClass}`}>{stockText}</span>
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
