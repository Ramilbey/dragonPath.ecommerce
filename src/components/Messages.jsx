// DragonPath E-commerce - Messaging Component
// FR-09: Buyers and sellers may message each other in real time
// FR-10: All messages shall be auto-translated between users' languages
// FR-11: Messages containing prohibited content shall be blocked at send time

import { useState, useEffect, useRef } from 'react'
import {
    getUserConversations,
    getConversationMessages,
    sendMessage,
    startConversation,
    checkMessageContent
} from '../data/messages'

function Messages({ user, sellerId, sellerName, productId, onClose }) {
    const [conversations, setConversations] = useState([])
    const [activeConversation, setActiveConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [error, setError] = useState('')
    const [userLanguage, setUserLanguage] = useState(user?.preferredLanguage || 'en')
    const messagesEndRef = useRef(null)

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'zh', name: '中文', flag: '🇨🇳' }
    ]

    useEffect(() => {
        if (user && !user.isGuest) {
            loadConversations()
        }
    }, [user])

    useEffect(() => {
        // If sellerId is provided, start/load that conversation
        if (sellerId && productId) {
            const conv = startConversation(user.id, user.name, sellerId, sellerName, productId)
            if (conv.success) {
                setActiveConversation(conv.conversation)
                loadMessages(conv.conversation.id)
            }
        }
    }, [sellerId, productId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const loadConversations = () => {
        const userConversations = getUserConversations(user.id)
        setConversations(userConversations)
        if (userConversations.length > 0 && !activeConversation) {
            setActiveConversation(userConversations[0])
            loadMessages(userConversations[0].id)
        }
    }

    const loadMessages = (conversationId) => {
        const convMessages = getConversationMessages(conversationId, userLanguage)
        setMessages(convMessages)
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        setError('')

        if (!newMessage.trim()) return

        // Check content before sending (FR-11)
        const contentCheck = checkMessageContent(newMessage)
        if (!contentCheck.allowed) {
            setError(contentCheck.reason)
            return
        }

        const result = sendMessage(
            activeConversation.id,
            user.id,
            user.name,
            newMessage,
            userLanguage
        )

        if (result.success) {
            setNewMessage('')
            loadMessages(activeConversation.id)
        } else {
            setError(result.error)
        }
    }

    const handleConversationSelect = (conversation) => {
        setActiveConversation(conversation)
        loadMessages(conversation.id)
        setError('')
    }

    const getOtherParticipant = (conversation) => {
        return conversation.participants.find(p => p.userId !== user.id)
    }

    const formatTime = (timestamp) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diff = now - date

        if (diff < 86400000) { // Less than 24 hours
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } else if (diff < 604800000) { // Less than 7 days
            return date.toLocaleDateString([], { weekday: 'short' })
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }

    if (user?.isGuest) {
        return (
            <div className="messages-container guest-message">
                <div className="guest-notice">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <h3>Login Required</h3>
                    <p>Please log in to message sellers and view your conversations.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="messages-container">
            {/* Conversations Sidebar */}
            <div className="conversations-sidebar">
                <div className="sidebar-header">
                    <h3>Messages</h3>
                    <div className="language-selector compact">
                        <select
                            value={userLanguage}
                            onChange={(e) => {
                                setUserLanguage(e.target.value)
                                if (activeConversation) {
                                    loadMessages(activeConversation.id)
                                }
                            }}
                        >
                            {languages.map(lang => (
                                <option key={lang.code} value={lang.code}>
                                    {lang.flag}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="conversations-list">
                    {conversations.length === 0 ? (
                        <div className="no-conversations">
                            <p>No conversations yet</p>
                        </div>
                    ) : (
                        conversations.map(conv => {
                            const other = getOtherParticipant(conv)
                            const unread = conv.unreadCount[user.id] || 0
                            return (
                                <div
                                    key={conv.id}
                                    className={`conversation-item ${activeConversation?.id === conv.id ? 'active' : ''}`}
                                    onClick={() => handleConversationSelect(conv)}
                                >
                                    <div className="conversation-avatar">
                                        {other.name.charAt(0)}
                                    </div>
                                    <div className="conversation-info">
                                        <div className="conversation-name">
                                            {other.name}
                                            {other.role === 'seller' && (
                                                <span className="seller-badge">Seller</span>
                                            )}
                                        </div>
                                        <div className="conversation-preview">
                                            Product inquiry
                                        </div>
                                    </div>
                                    <div className="conversation-meta">
                                        <span className="conversation-time">{formatTime(conv.lastMessageAt)}</span>
                                        {unread > 0 && (
                                            <span className="unread-badge">{unread}</span>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="chat-area">
                {activeConversation ? (
                    <>
                        <div className="chat-header">
                            <div className="chat-participant">
                                <div className="participant-avatar">
                                    {getOtherParticipant(activeConversation)?.name.charAt(0)}
                                </div>
                                <div className="participant-info">
                                    <span className="participant-name">
                                        {getOtherParticipant(activeConversation)?.name}
                                    </span>
                                    <span className="participant-status">
                                        🌐 Auto-translation enabled
                                    </span>
                                </div>
                            </div>
                            <button className="close-chat-btn" onClick={onClose}>
                                ×
                            </button>
                        </div>

                        <div className="chat-messages">
                            {messages.map(msg => (
                                <div
                                    key={msg.id}
                                    className={`message ${msg.senderId === user.id ? 'sent' : 'received'}`}
                                >
                                    <div className="message-content">
                                        <p>{msg.displayText}</p>
                                        {msg.originalLanguage !== userLanguage && msg.senderId !== user.id && (
                                            <span className="translated-label">
                                                🌐 Translated
                                            </span>
                                        )}
                                    </div>
                                    <div className="message-meta">
                                        <span className="message-time">{formatTime(msg.createdAt)}</span>
                                        {msg.senderId === user.id && (
                                            <span className={`message-status ${msg.status}`}>
                                                {msg.status === 'read' && '✓✓'}
                                                {msg.status === 'delivered' && '✓✓'}
                                                {msg.status === 'sent' && '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {error && (
                            <div className="message-error">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="15" y1="9" x2="9" y2="15"></line>
                                    <line x1="9" y1="9" x2="15" y2="15"></line>
                                </svg>
                                <span>{error}</span>
                                <button onClick={() => setError('')}>×</button>
                            </div>
                        )}

                        <form className="chat-input" onSubmit={handleSendMessage}>
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                maxLength={1000}
                            />
                            <button type="submit" className="send-btn" disabled={!newMessage.trim()}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </form>

                        <div className="chat-notice">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            </svg>
                            <span>Messages are moderated. External links, GIFs, and stickers are not allowed.</span>
                        </div>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        <h3>Select a conversation</h3>
                        <p>Choose a conversation from the list or start a new one</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Messages
