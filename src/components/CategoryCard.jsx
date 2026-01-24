function CategoryCard({ category, isActive, onClick }) {
    return (
        <div
            className={`category-card ${isActive ? 'active' : ''}`}
            onClick={onClick}
        >
            <img
                src={category.image}
                alt={category.name}
                className="category-image"
                loading="lazy"
            />
            <div className="category-name">{category.name}</div>
        </div>
    )
}

export default CategoryCard
