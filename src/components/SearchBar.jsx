import { useState, useRef, useEffect } from 'react'
import { useApp } from '../context/AppContext'

function SearchBar({ onProductSelect }) {
    const { products, categories } = useApp()
    const [query, setQuery] = useState('')
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [suggestions, setSuggestions] = useState([])
    const containerRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowSuggestions(false)
            }
        }
        document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [])

    const getCategoryName = (categoryId) => {
        const category = categories.find(c => c.id === categoryId)
        return category ? category.name : categoryId
    }

    const handleSearch = (e) => {
        const value = e.target.value
        setQuery(value)

        if (value.trim().length < 2) {
            setShowSuggestions(false)
            setSuggestions([])
            return
        }

        const matches = products.filter(p =>
            p.name.toLowerCase().includes(value.toLowerCase()) ||
            p.category.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 6)

        if (matches.length > 0) {
            setSuggestions(matches)
            setShowSuggestions(true)
        } else {
            setShowSuggestions(false)
        }
    }

    const handleSelect = (product) => {
        setQuery('')
        setShowSuggestions(false)
        onProductSelect(product)
    }

    const highlightMatch = (text, query) => {
        const regex = new RegExp(`(${query})`, 'gi')
        const parts = text.split(regex)
        return parts.map((part, i) =>
            regex.test(part) ? <strong key={i}>{part}</strong> : part
        )
    }

    return (
        <div className="search-section" ref={containerRef}>
            <div className="search-container">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for products..."
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => query.trim().length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                />

                {showSuggestions && (
                    <div className="search-suggestions">
                        {suggestions.map(product => (
                            <div
                                key={product.id}
                                className="suggestion-item"
                                onClick={() => handleSelect(product)}
                            >
                                <img src={product.image} alt={product.name} className="suggestion-image" />
                                <div className="suggestion-info">
                                    <div className="suggestion-name">{highlightMatch(product.name, query)}</div>
                                    <div className="suggestion-category">{getCategoryName(product.category)}</div>
                                </div>
                                <div className="suggestion-price">${product.price.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchBar
