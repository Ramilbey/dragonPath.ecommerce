// DragonPath E-commerce - Reviews & Feedback System
// FR-06: Buyers may submit reviews with text, photos, or video after delivery confirmation
// FR-07: All user-generated content shall be scanned for prohibited content
// FR-08: Reviews shall be automatically translated

// Prohibited words list for content moderation
export const prohibitedWords = [
    // Common profanity (basic list - in production this would be more comprehensive)
    'scam', 'fake', 'fraud', // Trust-related
    // In production, this would include multi-language profanity lists
]

// Mock reviews database
export const mockReviews = [
    {
        id: 'review-001',
        productId: 1,
        userId: 'user-001',
        userName: 'John B.',
        rating: 5,
        title: 'Excellent sound quality!',
        text: 'These headphones exceeded my expectations. The noise cancellation is top-notch and the battery life is amazing. Highly recommend!',
        originalLanguage: 'en',
        translations: {
            uz: 'Bu quloqchinlar mening kutishlarimdan oshib ketdi. Shovqinni bekor qilish eng yuqori darajada va batareya umri ajoyib. Juda tavsiya qilaman!',
            ru: 'Эти наушники превзошли мои ожидания. Шумоподавление на высшем уровне, а время работы от батареи потрясающее. Очень рекомендую!',
            zh: '这款耳机超出了我的预期。降噪效果一流，电池续航令人惊叹。强烈推荐！'
        },
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' }
        ],
        purchaseVerified: true,
        deliveryConfirmed: true,
        createdAt: '2026-01-22',
        helpful: 24,
        reported: false,
        moderationStatus: 'approved'
    },
    {
        id: 'review-002',
        productId: 2,
        userId: 'user-002',
        userName: 'Sarah M.',
        rating: 4,
        title: 'Great smartwatch, minor issues',
        text: 'Love the health monitoring features. The GPS tracking is accurate. Only giving 4 stars because the battery could be better when using GPS continuously.',
        originalLanguage: 'en',
        translations: {
            uz: 'Sog\'liqni kuzatish xususiyatlarini yaxshi ko\'raman. GPS kuzatuvi aniq. Faqat 4 yulduz beraman, chunki GPS doimiy ishlatilganda batareya yaxshiroq bo\'lishi mumkin edi.',
            ru: 'Люблю функции мониторинга здоровья. GPS-трекинг точный. Ставлю только 4 звезды, потому что батарея могла бы быть лучше при постоянном использовании GPS.',
            zh: '喜欢健康监测功能。GPS追踪很准确。只给4星是因为持续使用GPS时电池续航可以更好。'
        },
        media: [],
        purchaseVerified: true,
        deliveryConfirmed: true,
        createdAt: '2026-01-20',
        helpful: 12,
        reported: false,
        moderationStatus: 'approved'
    },
    {
        id: 'review-003',
        productId: 4,
        userId: 'user-003',
        userName: 'Alex K.',
        rating: 5,
        title: 'Premium quality leather',
        text: 'The craftsmanship is incredible. You can tell this is genuine leather. The fit is perfect and it looks even better in person than in the photos.',
        originalLanguage: 'en',
        translations: {},
        media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
            { type: 'video', url: '/videos/review-003-unboxing.mp4', thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200' }
        ],
        purchaseVerified: true,
        deliveryConfirmed: true,
        createdAt: '2026-01-18',
        helpful: 35,
        reported: false,
        moderationStatus: 'approved'
    }
]

// Content moderation function (FR-07)
export const moderateContent = (text) => {
    const lowerText = text.toLowerCase()

    // Check for prohibited words
    for (const word of prohibitedWords) {
        if (lowerText.includes(word.toLowerCase())) {
            return {
                approved: false,
                reason: 'Content contains prohibited terms. Please revise and resubmit.',
                flaggedWord: word
            }
        }
    }

    // In production, this would integrate with AI content moderation APIs
    // to detect hate speech, adult content, etc.

    return {
        approved: true,
        reason: null,
        flaggedWord: null
    }
}

// Translation function (FR-08)
// In production, this would use Google Translate API, DeepL, or similar
export const translateReview = async (text, fromLang, toLang) => {
    // Mock translation - in production this would call a translation API
    const mockTranslations = {
        'hello': {
            uz: 'salom',
            ru: 'привет',
            zh: '你好',
            en: 'hello'
        }
    }

    // Simulating async translation
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                translatedText: text, // In production, this would be actual translation
                fromLang,
                toLang
            })
        }, 100)
    })
}

// Add new review
export const addReview = (reviewData) => {
    // Moderate content first
    const moderation = moderateContent(reviewData.text)
    if (!moderation.approved) {
        return {
            success: false,
            error: moderation.reason
        }
    }

    const newReview = {
        id: `review-${Date.now()}`,
        ...reviewData,
        translations: {},
        helpful: 0,
        reported: false,
        moderationStatus: 'approved',
        createdAt: new Date().toISOString().split('T')[0]
    }

    mockReviews.push(newReview)
    return {
        success: true,
        review: newReview
    }
}

// Get reviews for a product
export const getProductReviews = (productId) => {
    return mockReviews.filter(r => r.productId === productId && r.moderationStatus === 'approved')
}
