// DragonPath E-commerce - User Data & Roles
// FR-01: System shall support four user roles: Guest, Buyer, Seller, Admin

export const USER_ROLES = {
    GUEST: 'guest',
    BUYER: 'buyer',
    SELLER: 'seller',
    ADMIN: 'admin'
}

export const VERIFICATION_STATUS = {
    PENDING: 'pending',
    VERIFIED: 'verified',
    REJECTED: 'rejected',
    BANNED: 'banned'
}

// Mock users database
export const mockUsers = [
    {
        id: 'user-001',
        email: 'buyer@dragonpath.com',
        password: 'buyer123', // In real app, this would be hashed
        name: 'John Buyer',
        phone: '+998901234567',
        role: USER_ROLES.BUYER,
        createdAt: '2026-01-01',
        isVerified: true,
        preferredLanguage: 'en'
    },
    {
        id: 'seller-001',
        email: 'seller@dragonpath.com',
        password: 'seller123',
        name: 'Silk Road Artisans',
        phone: '+998907654321',
        role: USER_ROLES.SELLER,
        createdAt: '2025-12-15',
        isVerified: true,
        preferredLanguage: 'uz',
        // FR-02: Seller verification data
        sellerProfile: {
            businessName: 'Silk Road Artisans LLC',
            businessRegistration: 'REG-2025-12345',
            registrationDocument: '/docs/seller-001/registration.pdf',
            physicalAddress: {
                street: '123 Chorsu Bazaar',
                city: 'Tashkent',
                country: 'Uzbekistan',
                postalCode: '100000',
                coordinates: { lat: 41.3275, lng: 69.2300 }
            },
            identityDocument: '/docs/seller-001/kyc.pdf',
            productPhotos: ['/docs/seller-001/products-proof.jpg'],
            verificationStatus: VERIFICATION_STATUS.VERIFIED,
            verifiedAt: '2025-12-20',
            rating: 4.8,
            totalSales: 156,
            totalRevenue: 45670.00
        }
    },
    {
        id: 'seller-002',
        email: 'merchant@dragonpath.com',
        password: 'merchant123',
        name: 'Dragon Ceramics',
        phone: '+8613812345678',
        role: USER_ROLES.SELLER,
        createdAt: '2026-01-10',
        isVerified: false,
        preferredLanguage: 'zh',
        sellerProfile: {
            businessName: 'Dragon Ceramics Co.',
            businessRegistration: 'CN-2026-78901',
            registrationDocument: null,
            physicalAddress: {
                street: '456 Yiwu Market',
                city: 'Yiwu',
                country: 'China',
                postalCode: '322000',
                coordinates: null
            },
            identityDocument: null,
            productPhotos: [],
            verificationStatus: VERIFICATION_STATUS.PENDING,
            verifiedAt: null,
            rating: 0,
            totalSales: 0,
            totalRevenue: 0
        }
    },
    {
        id: 'admin-001',
        email: 'admin@dragonpath.com',
        password: 'admin123',
        name: 'DragonPath Admin',
        phone: '+998901111111',
        role: USER_ROLES.ADMIN,
        createdAt: '2025-01-01',
        isVerified: true,
        preferredLanguage: 'en',
        adminProfile: {
            permissions: ['manage_users', 'manage_products', 'manage_orders', 'view_analytics', 'manage_risk_registry'],
            lastLogin: '2026-01-28'
        }
    }
]

// Risk Registry for banned users (FR-18)
export const riskRegistry = [
    {
        id: 'banned-001',
        userId: 'user-banned-001',
        email: 'scammer@fake.com',
        name: 'Fake Seller',
        reason: 'Fraud - selling counterfeit products',
        bannedAt: '2026-01-15',
        bannedBy: 'admin-001',
        behaviorPatterns: ['multiple_accounts', 'fake_reviews', 'counterfeit_products'],
        riskScore: 95,
        previousViolations: 3
    }
]

// Authentication helper functions
export const authenticateUser = (email, password) => {
    const user = mockUsers.find(u => u.email === email && u.password === password)
    if (user) {
        const { password: _, ...userWithoutPassword } = user
        return { success: true, user: userWithoutPassword }
    }
    return { success: false, error: 'Invalid email or password' }
}

export const registerUser = (userData, role = USER_ROLES.BUYER) => {
    const existingUser = mockUsers.find(u => u.email === userData.email)
    if (existingUser) {
        return { success: false, error: 'Email already registered' }
    }

    const newUser = {
        id: `user-${Date.now()}`,
        ...userData,
        role,
        createdAt: new Date().toISOString().split('T')[0],
        isVerified: role === USER_ROLES.BUYER, // Buyers auto-verified, sellers need manual verification
        preferredLanguage: 'en'
    }

    // In a real app, this would save to database
    mockUsers.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    return { success: true, user: userWithoutPassword }
}

export const isUserBanned = (email) => {
    return riskRegistry.some(entry => entry.email === email)
}
