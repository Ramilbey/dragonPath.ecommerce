import { createContext, useContext, useState, useEffect } from 'react'
import { products as initialProducts, categories } from '../data/products'

const AppContext = createContext()

export function AppProvider({ children }) {
    const [products, setProducts] = useState(initialProducts)
    const [cart, setCart] = useState([])
    const [wishlist, setWishlist] = useState([])
    const [savedLocations, setSavedLocations] = useState([])
    const [orders, setOrders] = useState([])

    useEffect(() => {
        // Load data from localStorage
        const savedCart = localStorage.getItem('dragonPathCart')
        if (savedCart) setCart(JSON.parse(savedCart))

        const savedWishlist = localStorage.getItem('dragonPathWishlist')
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist))

        const savedLocs = localStorage.getItem('dragonPathLocations')
        if (savedLocs) setSavedLocations(JSON.parse(savedLocs))

        const savedOrders = localStorage.getItem('dragonPathOrders')
        if (savedOrders) {
            setOrders(JSON.parse(savedOrders))
        } else {
            // Initialize with mock orders
            const mockOrders = [
                {
                    id: 'DP-2026-001234',
                    date: '2026-01-20',
                    status: 'delivered',
                    total: 549.98,
                    items: [
                        { productId: 1, name: 'Premium Wireless Headphones Pro', quantity: 1, price: 299.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100' },
                        { productId: 13, name: 'Luxury Skincare Set', quantity: 1, price: 249.99, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100' }
                    ]
                },
                {
                    id: 'DP-2026-001189',
                    date: '2026-01-15',
                    status: 'shipped',
                    total: 179.99,
                    items: [
                        { productId: 12, name: 'Running Shoes Elite', quantity: 1, price: 179.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100' }
                    ]
                },
                {
                    id: 'DP-2026-001145',
                    date: '2026-01-10',
                    status: 'processing',
                    total: 449.99,
                    items: [
                        { productId: 2, name: 'Smart Watch Series X', quantity: 1, price: 449.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100' }
                    ]
                }
            ]
            setOrders(mockOrders)
            localStorage.setItem('dragonPathOrders', JSON.stringify(mockOrders))
        }
    }, [])

    const addToCart = (product, quantity = 1) => {
        const newCart = [...cart]
        const existingIndex = newCart.findIndex(item => item.id === product.id)
        if (existingIndex >= 0) {
            newCart[existingIndex].quantity += quantity
        } else {
            newCart.push({ ...product, quantity })
        }
        setCart(newCart)
        localStorage.setItem('dragonPathCart', JSON.stringify(newCart))
    }

    const removeFromCart = (productId) => {
        const newCart = cart.filter(item => item.id !== productId)
        setCart(newCart)
        localStorage.setItem('dragonPathCart', JSON.stringify(newCart))
    }

    const addToWishlist = (product) => {
        if (!wishlist.find(item => item.id === product.id)) {
            const newWishlist = [...wishlist, product]
            setWishlist(newWishlist)
            localStorage.setItem('dragonPathWishlist', JSON.stringify(newWishlist))
        }
    }

    const removeFromWishlist = (productId) => {
        const newWishlist = wishlist.filter(item => item.id !== productId)
        setWishlist(newWishlist)
        localStorage.setItem('dragonPathWishlist', JSON.stringify(newWishlist))
    }

    const placeOrder = (product, quantity, location) => {
        // Update product stock
        const newProducts = products.map(p =>
            p.id === product.id ? { ...p, stock: p.stock - quantity } : p
        )
        setProducts(newProducts)

        // Create order
        const newOrder = {
            id: `DP-2026-${String(orders.length + 1).padStart(6, '0')}`,
            date: new Date().toISOString().split('T')[0],
            status: 'processing',
            total: product.price * quantity,
            items: [{
                productId: product.id,
                name: product.name,
                quantity,
                price: product.price,
                image: product.image
            }]
        }
        const newOrders = [newOrder, ...orders]
        setOrders(newOrders)
        localStorage.setItem('dragonPathOrders', JSON.stringify(newOrders))

        // Save location if needed
        if (location.isDefault) {
            const newLocations = savedLocations.map(loc => ({ ...loc, isDefault: false }))
            const existingIndex = newLocations.findIndex(loc =>
                loc.addressLine1 === location.addressLine1 && loc.city === location.city
            )
            if (existingIndex >= 0) {
                newLocations[existingIndex] = location
            } else {
                newLocations.push(location)
            }
            setSavedLocations(newLocations)
            localStorage.setItem('dragonPathLocations', JSON.stringify(newLocations))
        }

        return newOrder
    }

    return (
        <AppContext.Provider value={{
            products,
            categories,
            cart,
            wishlist,
            orders,
            savedLocations,
            addToCart,
            removeFromCart,
            addToWishlist,
            removeFromWishlist,
            placeOrder
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
