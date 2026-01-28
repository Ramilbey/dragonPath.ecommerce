// DragonPath E-commerce - Secure Messaging System
// FR-09: Buyers and sellers may message each other in real time
// FR-10: All messages shall be auto-translated between users' languages
// FR-11: Messages containing prohibited content shall be blocked at send time

import { prohibitedWords } from './reviews'

// Message statuses
export const MESSAGE_STATUS = {
    SENT: 'sent',
    DELIVERED: 'delivered',
    READ: 'read',
    BLOCKED: 'blocked'
}

// Conversation statuses
export const CONVERSATION_STATUS = {
    ACTIVE: 'active',
    ARCHIVED: 'archived',
    BLOCKED: 'blocked'
}

// Mock conversations database
export const mockConversations = [
    {
        id: 'conv-001',
        participants: [
            { userId: 'user-001', name: 'John Buyer', role: 'buyer', language: 'en' },
            { userId: 'seller-001', name: 'Silk Road Artisans', role: 'seller', language: 'uz' }
        ],
        productId: 1, // Related product
        orderId: 'DP-2026-001234',
        status: CONVERSATION_STATUS.ACTIVE,
        createdAt: '2026-01-20T10:00:00Z',
        lastMessageAt: '2026-01-22T14:30:00Z',
        unreadCount: { 'user-001': 0, 'seller-001': 1 }
    },
    {
        id: 'conv-002',
        participants: [
            { userId: 'user-001', name: 'John Buyer', role: 'buyer', language: 'en' },
            { userId: 'seller-002', name: 'Dragon Ceramics', role: 'seller', language: 'zh' }
        ],
        productId: 9,
        orderId: null,
        status: CONVERSATION_STATUS.ACTIVE,
        createdAt: '2026-01-25T08:00:00Z',
        lastMessageAt: '2026-01-25T09:15:00Z',
        unreadCount: { 'user-001': 2, 'seller-002': 0 }
    }
]

// Mock messages database
export const mockMessages = [
    {
        id: 'msg-001',
        conversationId: 'conv-001',
        senderId: 'user-001',
        senderName: 'John Buyer',
        originalText: 'Hi! I received my order but I have a question about the warranty. How long does it last?',
        originalLanguage: 'en',
        translations: {
            uz: 'Salom! Men buyurtmamni oldim, lekin kafolat haqida savolim bor. U qancha davom etadi?',
            ru: 'Привет! Я получил свой заказ, но у меня вопрос о гарантии. Как долго она действует?',
            zh: '你好！我收到了订单，但我有关于保修的问题。保修期多长？'
        },
        status: MESSAGE_STATUS.READ,
        createdAt: '2026-01-22T10:15:00Z',
        readAt: '2026-01-22T10:20:00Z'
    },
    {
        id: 'msg-002',
        conversationId: 'conv-001',
        senderId: 'seller-001',
        senderName: 'Silk Road Artisans',
        originalText: 'Assalomu alaykum! Kafolat muddati 2 yil. Agar biror muammo bo\'lsa, bizga murojaat qiling.',
        originalLanguage: 'uz',
        translations: {
            en: 'Hello! The warranty period is 2 years. If you have any issues, please contact us.',
            ru: 'Здравствуйте! Гарантийный срок - 2 года. Если будут проблемы, обращайтесь к нам.',
            zh: '您好！保修期为2年。如有任何问题，请联系我们。'
        },
        status: MESSAGE_STATUS.READ,
        createdAt: '2026-01-22T10:25:00Z',
        readAt: '2026-01-22T10:30:00Z'
    },
    {
        id: 'msg-003',
        conversationId: 'conv-001',
        senderId: 'user-001',
        senderName: 'John Buyer',
        originalText: 'Thank you so much! Great customer service.',
        originalLanguage: 'en',
        translations: {
            uz: 'Katta rahmat! Ajoyib mijozlarga xizmat ko\'rsatish.',
            ru: 'Большое спасибо! Отличное обслуживание клиентов.',
            zh: '非常感谢！服务很棒。'
        },
        status: MESSAGE_STATUS.DELIVERED,
        createdAt: '2026-01-22T14:30:00Z',
        readAt: null
    },
    {
        id: 'msg-004',
        conversationId: 'conv-002',
        senderId: 'seller-002',
        senderName: 'Dragon Ceramics',
        originalText: '您好！我们的陶瓷花瓶采用传统工艺手工制作，每件都是独一无二的。',
        originalLanguage: 'zh',
        translations: {
            en: 'Hello! Our ceramic vases are handcrafted using traditional techniques, each piece is unique.',
            uz: 'Salom! Bizning keramika guldonlari an\'anaviy texnika yordamida qo\'lda tayyorlanadi, har bir parcha noyobdir.',
            ru: 'Здравствуйте! Наши керамические вазы изготовлены вручную по традиционной технике, каждое изделие уникально.'
        },
        status: MESSAGE_STATUS.DELIVERED,
        createdAt: '2026-01-25T08:30:00Z',
        readAt: null
    },
    {
        id: 'msg-005',
        conversationId: 'conv-002',
        senderId: 'seller-002',
        senderName: 'Dragon Ceramics',
        originalText: '我们可以为您提供批量购买折扣。请问您需要多少件？',
        originalLanguage: 'zh',
        translations: {
            en: 'We can offer you a bulk purchase discount. How many pieces do you need?',
            uz: 'Biz sizga ulgurji xarid uchun chegirma taklif qilishimiz mumkin. Sizga qancha dona kerak?',
            ru: 'Мы можем предложить вам скидку на оптовую покупку. Сколько штук вам нужно?'
        },
        status: MESSAGE_STATUS.DELIVERED,
        createdAt: '2026-01-25T09:15:00Z',
        readAt: null
    }
]

// Prohibited content patterns for messages (FR-11)
const prohibitedPatterns = [
    // External links to avoid scams
    /https?:\/\/(?!dragonpath\.com)/i,
    // Adult content keywords
    /\b(18\+|xxx|adult|nsfw)\b/i,
    // Hate speech patterns (simplified)
    /\b(hate|kill|die)\b/i
]

// Check if message contains prohibited content
export const checkMessageContent = (text) => {
    const lowerText = text.toLowerCase()

    // Check prohibited words
    for (const word of prohibitedWords) {
        if (lowerText.includes(word.toLowerCase())) {
            return {
                allowed: false,
                reason: 'Message contains prohibited content. Please revise your message.'
            }
        }
    }

    // Check prohibited patterns
    for (const pattern of prohibitedPatterns) {
        if (pattern.test(text)) {
            return {
                allowed: false,
                reason: 'Message contains prohibited content or external links. Please revise your message.'
            }
        }
    }

    // Check for GIFs/stickers (FR-11)
    if (/\.(gif|sticker)/i.test(text) || /\[gif\]|\[sticker\]/i.test(text)) {
        return {
            allowed: false,
            reason: 'GIFs and stickers are not allowed in messages for security reasons.'
        }
    }

    return { allowed: true, reason: null }
}

// Send a message with content moderation
export const sendMessage = (conversationId, senderId, senderName, text, senderLanguage) => {
    // Check content first (FR-11)
    const contentCheck = checkMessageContent(text)
    if (!contentCheck.allowed) {
        return {
            success: false,
            error: contentCheck.reason,
            status: MESSAGE_STATUS.BLOCKED
        }
    }

    const newMessage = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId,
        senderName,
        originalText: text,
        originalLanguage: senderLanguage,
        translations: {}, // Would be populated by translation service
        status: MESSAGE_STATUS.SENT,
        createdAt: new Date().toISOString(),
        readAt: null
    }

    mockMessages.push(newMessage)

    // Update conversation last message time
    const conversation = mockConversations.find(c => c.id === conversationId)
    if (conversation) {
        conversation.lastMessageAt = newMessage.createdAt
        // Increment unread count for other participants
        conversation.participants.forEach(p => {
            if (p.userId !== senderId) {
                conversation.unreadCount[p.userId] = (conversation.unreadCount[p.userId] || 0) + 1
            }
        })
    }

    return {
        success: true,
        message: newMessage
    }
}

// Get messages for a conversation with optional translation
export const getConversationMessages = (conversationId, userLanguage = 'en') => {
    const messages = mockMessages.filter(m => m.conversationId === conversationId)

    return messages.map(msg => ({
        ...msg,
        displayText: msg.originalLanguage === userLanguage
            ? msg.originalText
            : (msg.translations[userLanguage] || msg.originalText)
    }))
}

// Get user's conversations
export const getUserConversations = (userId) => {
    return mockConversations.filter(c =>
        c.participants.some(p => p.userId === userId) &&
        c.status !== CONVERSATION_STATUS.BLOCKED
    )
}

// Start a new conversation
export const startConversation = (buyerId, buyerName, sellerId, sellerName, productId) => {
    // Check if conversation exists
    const existingConv = mockConversations.find(c =>
        c.productId === productId &&
        c.participants.some(p => p.userId === buyerId) &&
        c.participants.some(p => p.userId === sellerId)
    )

    if (existingConv) {
        return { success: true, conversation: existingConv, existing: true }
    }

    const newConversation = {
        id: `conv-${Date.now()}`,
        participants: [
            { userId: buyerId, name: buyerName, role: 'buyer', language: 'en' },
            { userId: sellerId, name: sellerName, role: 'seller', language: 'en' }
        ],
        productId,
        orderId: null,
        status: CONVERSATION_STATUS.ACTIVE,
        createdAt: new Date().toISOString(),
        lastMessageAt: new Date().toISOString(),
        unreadCount: { [buyerId]: 0, [sellerId]: 0 }
    }

    mockConversations.push(newConversation)
    return { success: true, conversation: newConversation, existing: false }
}
