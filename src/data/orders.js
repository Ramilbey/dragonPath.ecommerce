// DragonPath E-commerce - Order & Escrow Payment System
// FR-12: Buyers must pay before order fulfillment via local or international payment gateways
// FR-13: Supported payment methods include local (Payme, Click, UzCard, Kaspi, Alipay) and international (Visa, Mastercard)
// FR-14: Funds are held in escrow until delivery milestones are met
// FR-15: Product condition must be documented
// FR-16: Buyers may cancel orders within 10 days if logistics hasn't picked up

// Order statuses aligned with escrow flow
export const ORDER_STATUS = {
    PENDING_PAYMENT: 'pending_payment',
    PAYMENT_RECEIVED: 'payment_received',
    PREPARING: 'preparing',
    READY_FOR_PICKUP: 'ready_for_pickup',
    PICKED_UP: 'picked_up',
    IN_TRANSIT: 'in_transit',
    OUT_FOR_DELIVERY: 'out_for_delivery',
    DELIVERED: 'delivered',
    CONFIRMED: 'confirmed', // Buyer confirmed receipt
    CANCELLED: 'cancelled',
    REFUNDED: 'refunded',
    DISPUTED: 'disputed'
}

// Payment statuses for escrow
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    HELD_IN_ESCROW: 'held_in_escrow',
    RELEASED_TO_SELLER: 'released_to_seller',
    RELEASED_TO_LOGISTICS: 'released_to_logistics',
    REFUNDED: 'refunded'
}

// Supported payment methods (FR-13)
export const PAYMENT_METHODS = {
    // Local payment methods
    PAYME: { id: 'payme', name: 'Payme', icon: '💳', region: 'UZ', type: 'local' },
    CLICK: { id: 'click', name: 'Click', icon: '📱', region: 'UZ', type: 'local' },
    UZCARD: { id: 'uzcard', name: 'UzCard', icon: '💳', region: 'UZ', type: 'local' },
    KASPI: { id: 'kaspi', name: 'Kaspi', icon: '💰', region: 'KZ', type: 'local' },
    ALIPAY: { id: 'alipay', name: 'Alipay', icon: '💙', region: 'CN', type: 'local' },
    WECHAT_PAY: { id: 'wechat', name: 'WeChat Pay', icon: '💚', region: 'CN', type: 'local' },
    // International payment methods
    VISA: { id: 'visa', name: 'Visa', icon: '💳', region: 'INTL', type: 'international' },
    MASTERCARD: { id: 'mastercard', name: 'Mastercard', icon: '💳', region: 'INTL', type: 'international' }
}

// Cancellation window in days (FR-16)
export const CANCELLATION_WINDOW_DAYS = 10

// Mock orders with escrow data
export const mockOrders = [
    {
        id: 'DP-2026-001234',
        buyerId: 'user-001',
        sellerId: 'seller-001',
        createdAt: '2026-01-20T10:00:00Z',
        status: ORDER_STATUS.DELIVERED,
        items: [
            {
                productId: 1,
                name: 'Premium Wireless Headphones Pro',
                quantity: 1,
                price: 299.99,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'
            },
            {
                productId: 13,
                name: 'Luxury Skincare Set',
                quantity: 1,
                price: 249.99,
                image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=100'
            }
        ],
        subtotal: 549.98,
        shippingFee: 15.00,
        total: 564.98,
        shippingAddress: {
            name: 'John Buyer',
            addressLine1: '123 Main Street',
            addressLine2: 'Apt 4B',
            city: 'Tashkent',
            state: 'Tashkent',
            postalCode: '100000',
            country: 'Uzbekistan',
            phone: '+998901234567'
        },
        // Payment & Escrow data (FR-14)
        payment: {
            method: PAYMENT_METHODS.PAYME.id,
            methodName: PAYMENT_METHODS.PAYME.name,
            transactionId: 'TXN-2026-78901234',
            paidAt: '2026-01-20T10:05:00Z',
            status: PAYMENT_STATUS.RELEASED_TO_SELLER,
            escrow: {
                heldAt: '2026-01-20T10:05:00Z',
                sellerReleasedAt: '2026-01-24T14:00:00Z',
                logisticsReleasedAt: '2026-01-24T14:00:00Z',
                sellerAmount: 522.98, // Total - platform fee - logistics
                logisticsAmount: 15.00,
                platformFee: 27.00 // ~5% platform fee
            }
        },
        // Product condition documentation (FR-15)
        productCondition: {
            sellerPhotos: [
                { url: '/docs/orders/DP-2026-001234/seller-packing-1.jpg', uploadedAt: '2026-01-21T09:00:00Z' }
            ],
            sellerVideoUrl: '/docs/orders/DP-2026-001234/seller-packing.mp4',
            logisticsConfirmedAt: '2026-01-21T11:00:00Z',
            logisticsNotes: 'Package received in good condition, sealed properly'
        },
        // Tracking & milestones
        tracking: {
            trackingId: 'DPSHIP-78901234',
            carrier: 'DragonPath Express',
            milestones: [
                { status: ORDER_STATUS.PAYMENT_RECEIVED, timestamp: '2026-01-20T10:05:00Z' },
                { status: ORDER_STATUS.PREPARING, timestamp: '2026-01-21T08:00:00Z' },
                { status: ORDER_STATUS.READY_FOR_PICKUP, timestamp: '2026-01-21T10:00:00Z' },
                { status: ORDER_STATUS.PICKED_UP, timestamp: '2026-01-21T11:00:00Z' },
                { status: ORDER_STATUS.IN_TRANSIT, timestamp: '2026-01-22T09:00:00Z' },
                { status: ORDER_STATUS.OUT_FOR_DELIVERY, timestamp: '2026-01-24T08:00:00Z' },
                { status: ORDER_STATUS.DELIVERED, timestamp: '2026-01-24T14:00:00Z' }
            ]
        },
        deliveredAt: '2026-01-24T14:00:00Z',
        buyerConfirmedAt: '2026-01-24T15:00:00Z'
    },
    {
        id: 'DP-2026-001189',
        buyerId: 'user-001',
        sellerId: 'seller-001',
        createdAt: '2026-01-15T08:00:00Z',
        status: ORDER_STATUS.IN_TRANSIT,
        items: [
            {
                productId: 12,
                name: 'Running Shoes Elite',
                quantity: 1,
                price: 179.99,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'
            }
        ],
        subtotal: 179.99,
        shippingFee: 10.00,
        total: 189.99,
        shippingAddress: {
            name: 'John Buyer',
            addressLine1: '123 Main Street',
            city: 'Tashkent',
            state: 'Tashkent',
            postalCode: '100000',
            country: 'Uzbekistan',
            phone: '+998901234567'
        },
        payment: {
            method: PAYMENT_METHODS.CLICK.id,
            methodName: PAYMENT_METHODS.CLICK.name,
            transactionId: 'TXN-2026-56789012',
            paidAt: '2026-01-15T08:10:00Z',
            status: PAYMENT_STATUS.HELD_IN_ESCROW,
            escrow: {
                heldAt: '2026-01-15T08:10:00Z',
                sellerReleasedAt: null,
                logisticsReleasedAt: null,
                sellerAmount: 170.99,
                logisticsAmount: 10.00,
                platformFee: 9.00
            }
        },
        productCondition: {
            sellerPhotos: [
                { url: '/docs/orders/DP-2026-001189/seller-packing-1.jpg', uploadedAt: '2026-01-16T10:00:00Z' }
            ],
            sellerVideoUrl: null,
            logisticsConfirmedAt: '2026-01-16T14:00:00Z',
            logisticsNotes: 'Package sealed and ready for transit'
        },
        tracking: {
            trackingId: 'DPSHIP-56789012',
            carrier: 'DragonPath Express',
            milestones: [
                { status: ORDER_STATUS.PAYMENT_RECEIVED, timestamp: '2026-01-15T08:10:00Z' },
                { status: ORDER_STATUS.PREPARING, timestamp: '2026-01-16T09:00:00Z' },
                { status: ORDER_STATUS.READY_FOR_PICKUP, timestamp: '2026-01-16T12:00:00Z' },
                { status: ORDER_STATUS.PICKED_UP, timestamp: '2026-01-16T14:00:00Z' },
                { status: ORDER_STATUS.IN_TRANSIT, timestamp: '2026-01-17T08:00:00Z' }
            ]
        },
        deliveredAt: null,
        buyerConfirmedAt: null
    },
    {
        id: 'DP-2026-001145',
        buyerId: 'user-001',
        sellerId: 'seller-002',
        createdAt: '2026-01-10T14:00:00Z',
        status: ORDER_STATUS.PREPARING,
        items: [
            {
                productId: 2,
                name: 'Smart Watch Series X',
                quantity: 1,
                price: 449.99,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'
            }
        ],
        subtotal: 449.99,
        shippingFee: 20.00,
        total: 469.99,
        shippingAddress: {
            name: 'John Buyer',
            addressLine1: '123 Main Street',
            city: 'Tashkent',
            state: 'Tashkent',
            postalCode: '100000',
            country: 'Uzbekistan',
            phone: '+998901234567'
        },
        payment: {
            method: PAYMENT_METHODS.VISA.id,
            methodName: PAYMENT_METHODS.VISA.name,
            transactionId: 'TXN-2026-34567890',
            paidAt: '2026-01-10T14:10:00Z',
            status: PAYMENT_STATUS.HELD_IN_ESCROW,
            escrow: {
                heldAt: '2026-01-10T14:10:00Z',
                sellerReleasedAt: null,
                logisticsReleasedAt: null,
                sellerAmount: 427.49,
                logisticsAmount: 20.00,
                platformFee: 22.50
            }
        },
        productCondition: {
            sellerPhotos: [],
            sellerVideoUrl: null,
            logisticsConfirmedAt: null,
            logisticsNotes: null
        },
        tracking: {
            trackingId: null,
            carrier: null,
            milestones: [
                { status: ORDER_STATUS.PAYMENT_RECEIVED, timestamp: '2026-01-10T14:10:00Z' },
                { status: ORDER_STATUS.PREPARING, timestamp: '2026-01-11T09:00:00Z' }
            ]
        },
        deliveredAt: null,
        buyerConfirmedAt: null
    }
]

// Check if order can be cancelled (FR-16)
export const canCancelOrder = (order) => {
    // Can only cancel if logistics hasn't picked up
    const pickedUpMilestone = order.tracking?.milestones?.find(
        m => m.status === ORDER_STATUS.PICKED_UP
    )

    if (pickedUpMilestone) {
        return {
            canCancel: false,
            reason: 'Order cannot be cancelled after logistics pickup.'
        }
    }

    // Check if within 10-day window
    const orderDate = new Date(order.createdAt)
    const daysSinceOrder = Math.floor((new Date() - orderDate) / (1000 * 60 * 60 * 24))

    if (daysSinceOrder > CANCELLATION_WINDOW_DAYS) {
        return {
            canCancel: false,
            reason: `Cancellation window of ${CANCELLATION_WINDOW_DAYS} days has expired.`
        }
    }

    return {
        canCancel: true,
        reason: null
    }
}

// Process order cancellation with refund (FR-16)
export const cancelOrder = (orderId) => {
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) {
        return { success: false, error: 'Order not found' }
    }

    const cancelCheck = canCancelOrder(order)
    if (!cancelCheck.canCancel) {
        return { success: false, error: cancelCheck.reason }
    }

    // Update order status
    order.status = ORDER_STATUS.CANCELLED
    order.payment.status = PAYMENT_STATUS.REFUNDED
    order.cancelledAt = new Date().toISOString()
    order.refundedAt = new Date().toISOString()

    return {
        success: true,
        message: 'Order cancelled. Full refund will be processed within 3-5 business days.',
        order
    }
}

// Create new order with escrow
export const createOrder = (buyerId, items, shippingAddress, paymentMethod, sellerId) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingFee = subtotal > 100 ? 15.00 : 10.00
    const total = subtotal + shippingFee
    const platformFee = Math.round(subtotal * 0.05 * 100) / 100 // 5% platform fee

    const newOrder = {
        id: `DP-2026-${String(Date.now()).slice(-6)}`,
        buyerId,
        sellerId,
        createdAt: new Date().toISOString(),
        status: ORDER_STATUS.PENDING_PAYMENT,
        items,
        subtotal,
        shippingFee,
        total,
        shippingAddress,
        payment: {
            method: paymentMethod.id,
            methodName: paymentMethod.name,
            transactionId: null,
            paidAt: null,
            status: PAYMENT_STATUS.PENDING,
            escrow: {
                heldAt: null,
                sellerReleasedAt: null,
                logisticsReleasedAt: null,
                sellerAmount: subtotal - platformFee,
                logisticsAmount: shippingFee,
                platformFee
            }
        },
        productCondition: {
            sellerPhotos: [],
            sellerVideoUrl: null,
            logisticsConfirmedAt: null,
            logisticsNotes: null
        },
        tracking: {
            trackingId: null,
            carrier: null,
            milestones: []
        },
        deliveredAt: null,
        buyerConfirmedAt: null
    }

    mockOrders.push(newOrder)
    return { success: true, order: newOrder }
}

// Confirm payment and move to escrow
export const confirmPayment = (orderId, transactionId) => {
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) {
        return { success: false, error: 'Order not found' }
    }

    order.payment.transactionId = transactionId
    order.payment.paidAt = new Date().toISOString()
    order.payment.status = PAYMENT_STATUS.HELD_IN_ESCROW
    order.payment.escrow.heldAt = new Date().toISOString()
    order.status = ORDER_STATUS.PAYMENT_RECEIVED
    order.tracking.milestones.push({
        status: ORDER_STATUS.PAYMENT_RECEIVED,
        timestamp: new Date().toISOString()
    })

    return { success: true, order }
}

// Release escrow to seller (after buyer confirms delivery)
export const releaseEscrow = (orderId) => {
    const order = mockOrders.find(o => o.id === orderId)
    if (!order) {
        return { success: false, error: 'Order not found' }
    }

    if (order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CONFIRMED) {
        return { success: false, error: 'Order must be delivered before escrow can be released' }
    }

    order.status = ORDER_STATUS.CONFIRMED
    order.buyerConfirmedAt = new Date().toISOString()
    order.payment.status = PAYMENT_STATUS.RELEASED_TO_SELLER
    order.payment.escrow.sellerReleasedAt = new Date().toISOString()
    order.payment.escrow.logisticsReleasedAt = new Date().toISOString()

    return { success: true, order }
}

// Get orders for a user
export const getUserOrders = (userId, role = 'buyer') => {
    if (role === 'buyer') {
        return mockOrders.filter(o => o.buyerId === userId)
    } else if (role === 'seller') {
        return mockOrders.filter(o => o.sellerId === userId)
    }
    return mockOrders
}
