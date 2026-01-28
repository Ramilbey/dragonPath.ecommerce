// DragonPath E-commerce - Product Reviews Component
// FR-06: Buyers may submit reviews with text, photos, or video after delivery confirmation
// FR-07: Content moderation
// FR-08: Automatic translation

import { useState } from 'react'
import { mockReviews, moderateContent, addReview, getProductReviews } from '../data/reviews'

function ProductReviews({ productId, user, onClose }) {
    const [reviews, setReviews] = useState(getProductReviews(productId))
    const [showAddReview, setShowAddReview] = useState(false)
    const [selectedLanguage, setSelectedLanguage] = useState('en')
    const [newReview, setNewReview] = useState({
        rating: 5,
        title: '',
        text: '',
        media: []
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'zh', name: '中文', flag: '🇨🇳' }
    ]

    const handleSubmitReview = (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        // Check if user can submit review (must have purchased and received item)
        if (!user || user.isGuest) {
            setError('You must be logged in to submit a review.')
            return
        }

        // Moderate content (FR-07)
        const moderation = moderateContent(newReview.text)
        if (!moderation.approved) {
            setError(moderation.reason)
            return
        }

        const titleModeration = moderateContent(newReview.title)
        if (!titleModeration.approved) {
            setError('Review title: ' + titleModeration.reason)
            return
        }

        // Add review
        const result = addReview({
            productId,
            userId: user.id,
            userName: user.name?.split(' ')[0] + ' ' + (user.name?.split(' ')[1]?.[0] || '') + '.',
            rating: newReview.rating,
            title: newReview.title,
            text: newReview.text,
            originalLanguage: selectedLanguage,
            media: newReview.media,
            purchaseVerified: true,
            deliveryConfirmed: true
        })

        if (result.success) {
            setSuccess('Thank you! Your review has been submitted successfully.')
            setReviews(getProductReviews(productId))
            setNewReview({ rating: 5, title: '', text: '', media: [] })
            setShowAddReview(false)
        } else {
            setError(result.error)
        }
    }

    const getTranslatedText = (review) => {
        if (review.originalLanguage === selectedLanguage) {
            return review.text
        }
        return review.translations?.[selectedLanguage] || review.text
    }

    const renderStars = (rating, interactive = false, onSelect = null) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map(star => (
                    <button
                        key={star}
                        type="button"
                        className={`star ${star <= rating ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
                        onClick={() => interactive && onSelect && onSelect(star)}
                    >
                        ★
                    </button>
                ))}
            </div>
        )
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0

    return (
        <div className="reviews-section">
            <div className="reviews-header">
                <div className="reviews-title">
                    <h3>Customer Reviews</h3>
                    <div className="reviews-summary">
                        <span className="average-rating">{averageRating}</span>
                        {renderStars(Math.round(averageRating))}
                        <span className="review-count">({reviews.length} reviews)</span>
                    </div>
                </div>

                {/* Language Selector (FR-08) */}
                <div className="language-selector">
                    <label>View in:</label>
                    <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                    >
                        {languages.map(lang => (
                            <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Add Review Button */}
            {user && !user.isGuest && !showAddReview && (
                <button
                    className="btn-secondary add-review-btn"
                    onClick={() => setShowAddReview(true)}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Write a Review
                </button>
            )}

            {/* Add Review Form */}
            {showAddReview && (
                <div className="add-review-form">
                    <div className="form-header">
                        <h4>Write Your Review</h4>
                        <button className="close-btn" onClick={() => setShowAddReview(false)}>×</button>
                    </div>

                    {error && <div className="review-error">{error}</div>}
                    {success && <div className="review-success">{success}</div>}

                    <form onSubmit={handleSubmitReview}>
                        <div className="form-group">
                            <label>Your Rating</label>
                            {renderStars(newReview.rating, true, (star) => setNewReview({ ...newReview, rating: star }))}
                        </div>

                        <div className="form-group">
                            <label htmlFor="reviewTitle">Review Title</label>
                            <input
                                type="text"
                                id="reviewTitle"
                                value={newReview.title}
                                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                                placeholder="Summarize your experience"
                                required
                                maxLength={100}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reviewText">Your Review</label>
                            <textarea
                                id="reviewText"
                                value={newReview.text}
                                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                                placeholder="Share your experience with this product..."
                                required
                                rows={4}
                                maxLength={1000}
                            />
                            <span className="char-count">{newReview.text.length}/1000</span>
                        </div>

                        {/* Media Upload (FR-06) */}
                        <div className="form-group media-upload">
                            <label>Add Photos/Videos (Optional)</label>
                            <div className="media-dropzone">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <polyline points="21 15 16 10 5 21"></polyline>
                                </svg>
                                <p>Drag & drop images or videos here</p>
                                <span>or click to browse</span>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn-secondary" onClick={() => setShowAddReview(false)}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-primary">
                                Submit Review
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <div className="no-reviews">
                        <p>No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <div className="reviewer-avatar">
                                        {review.userName.charAt(0)}
                                    </div>
                                    <div className="reviewer-details">
                                        <span className="reviewer-name">{review.userName}</span>
                                        <div className="review-meta">
                                            {renderStars(review.rating)}
                                            <span className="review-date">{review.createdAt}</span>
                                        </div>
                                    </div>
                                </div>
                                {review.purchaseVerified && (
                                    <span className="verified-badge">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                        Verified Purchase
                                    </span>
                                )}
                            </div>

                            <h4 className="review-title">{review.title}</h4>
                            <p className="review-text">{getTranslatedText(review)}</p>

                            {/* Translation indicator */}
                            {review.originalLanguage !== selectedLanguage && review.translations?.[selectedLanguage] && (
                                <span className="translated-indicator">
                                    🌐 Translated from {languages.find(l => l.code === review.originalLanguage)?.name}
                                </span>
                            )}

                            {/* Media Gallery */}
                            {review.media && review.media.length > 0 && (
                                <div className="review-media">
                                    {review.media.map((media, idx) => (
                                        <div key={idx} className="media-item">
                                            {media.type === 'image' ? (
                                                <img src={media.url} alt={`Review media ${idx + 1}`} />
                                            ) : (
                                                <div className="video-thumbnail">
                                                    <img src={media.thumbnail} alt="Video thumbnail" />
                                                    <span className="play-icon">▶</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="review-footer">
                                <button className="helpful-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                    </svg>
                                    Helpful ({review.helpful})
                                </button>
                                <button className="report-btn">
                                    Report
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ProductReviews
