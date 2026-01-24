// DragonPath E-commerce - Product Data

const categories = [
    {
        id: 'electronics',
        name: 'Electronics',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&h=200&fit=crop',
        icon: '📱'
    },
    {
        id: 'fashion',
        name: 'Fashion',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&h=200&fit=crop',
        icon: '👗'
    },
    {
        id: 'home',
        name: 'Home & Living',
        image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=200&h=200&fit=crop',
        icon: '🏠'
    },
    {
        id: 'sports',
        name: 'Sports & Fitness',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop',
        icon: '🏋️'
    },
    {
        id: 'beauty',
        name: 'Beauty & Care',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop',
        icon: '💄'
    },
    {
        id: 'books',
        name: 'Books & Media',
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop',
        icon: '📚'
    }
];

const products = [
    {
        id: 1,
        name: 'Premium Wireless Headphones Pro',
        category: 'electronics',
        price: 299.99,
        stock: 25,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
        description: 'Experience crystal-clear audio with our flagship wireless headphones featuring active noise cancellation, 40-hour battery life, and premium comfort ear cushions.'
    },
    {
        id: 2,
        name: 'Smart Watch Series X',
        category: 'electronics',
        price: 449.99,
        stock: 15,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
        description: 'Stay connected with advanced health monitoring, GPS tracking, and seamless smartphone integration. Water-resistant design perfect for any lifestyle.'
    },
    {
        id: 3,
        name: 'Ultra-Slim Laptop 15"',
        category: 'electronics',
        price: 1299.99,
        stock: 8,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&h=500&fit=crop',
        description: 'Powerful performance in an ultra-portable design. Features 16GB RAM, 512GB SSD, and stunning 4K display for professionals on the go.'
    },
    {
        id: 4,
        name: 'Designer Leather Jacket',
        category: 'fashion',
        price: 389.99,
        stock: 12,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
        description: 'Handcrafted genuine leather jacket with premium stitching and timeless design. Perfect for making a statement in any season.'
    },
    {
        id: 5,
        name: 'Classic Denim Collection',
        category: 'fashion',
        price: 129.99,
        stock: 45,
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop',
        description: 'Premium Japanese denim jeans with perfect fit and exceptional durability. Available in multiple washes and styles.'
    },
    {
        id: 6,
        name: 'Luxury Silk Scarf',
        category: 'fashion',
        price: 89.99,
        stock: 30,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&h=500&fit=crop',
        description: 'Elegant 100% silk scarf with exclusive print design. Versatile accessory that elevates any outfit.'
    },
    {
        id: 7,
        name: 'Modern Minimalist Sofa',
        category: 'home',
        price: 899.99,
        stock: 5,
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
        description: 'Scandinavian-inspired design with premium fabric and solid wood legs. Perfect centerpiece for modern living spaces.'
    },
    {
        id: 8,
        name: 'Smart Home Speaker',
        category: 'home',
        price: 199.99,
        stock: 35,
        image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&h=500&fit=crop',
        description: 'Voice-controlled smart speaker with premium 360° sound. Control your smart home devices with ease.'
    },
    {
        id: 9,
        name: 'Artisan Ceramic Vase Set',
        category: 'home',
        price: 79.99,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500&h=500&fit=crop',
        description: 'Handcrafted ceramic vases in contemporary design. Set of 3 pieces perfect for fresh or dried arrangements.'
    },
    {
        id: 10,
        name: 'Professional Yoga Mat',
        category: 'sports',
        price: 89.99,
        stock: 40,
        image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop',
        description: 'Extra-thick eco-friendly yoga mat with superior grip and cushioning. Includes carrying strap and alignment guides.'
    },
    {
        id: 11,
        name: 'Adjustable Dumbbell Set',
        category: 'sports',
        price: 349.99,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&h=500&fit=crop',
        description: 'Space-saving adjustable dumbbells ranging from 5-52.5 lbs. Quick-change weight system for efficient workouts.'
    },
    {
        id: 12,
        name: 'Running Shoes Elite',
        category: 'sports',
        price: 179.99,
        stock: 28,
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
        description: 'Lightweight performance running shoes with responsive cushioning and breathable mesh upper. Designed for serious runners.'
    },
    {
        id: 13,
        name: 'Luxury Skincare Set',
        category: 'beauty',
        price: 249.99,
        stock: 18,
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop',
        description: 'Complete anti-aging skincare routine featuring vitamin C serum, retinol cream, and hyaluronic acid moisturizer.'
    },
    {
        id: 14,
        name: 'Professional Makeup Palette',
        category: 'beauty',
        price: 69.99,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&h=500&fit=crop',
        description: '36 highly pigmented eyeshadow colors from matte to shimmer. Cruelty-free and long-lasting formula.'
    },
    {
        id: 15,
        name: 'Premium Fragrance Collection',
        category: 'beauty',
        stock: 3,
        price: 159.99,
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop',
        description: 'Exclusive fragrance featuring notes of bergamot, jasmine, and sandalwood. Long-lasting scent for special occasions.'
    },
    {
        id: 16,
        name: 'Bestseller Book Collection',
        category: 'books',
        price: 49.99,
        stock: 60,
        image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
        description: 'Curated collection of 5 award-winning novels. Beautiful hardcover editions perfect for your library.'
    },
    {
        id: 17,
        name: 'Vinyl Record Player',
        category: 'books',
        price: 199.99,
        stock: 14,
        image: 'https://images.unsplash.com/photo-1539795830366-e371e95cf3c5?w=500&h=500&fit=crop',
        description: 'Vintage-style turntable with modern features including Bluetooth connectivity and built-in speakers.'
    },
    {
        id: 18,
        name: 'Wireless Earbuds Pro',
        category: 'electronics',
        price: 199.99,
        stock: 42,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop',
        description: 'True wireless earbuds with active noise cancellation, transparent mode, and up to 24 hours battery life with case.'
    }
];
