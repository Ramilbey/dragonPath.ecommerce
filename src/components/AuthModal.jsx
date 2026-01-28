import { useState } from 'react'
import { USER_ROLES, authenticateUser, registerUser, isUserBanned } from '../data/users'

function AuthModal({ onLogin }) {
    const [mode, setMode] = useState('login') // 'login' | 'register' | 'seller-register'
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        // Seller fields
        businessName: '',
        businessRegistration: '',
        street: '',
        city: '',
        country: 'Uzbekistan'
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        // Check if user is banned
        if (isUserBanned(formData.email)) {
            setError('This account has been suspended due to policy violations.')
            setLoading(false)
            return
        }

        if (mode === 'login') {
            // Login flow
            const result = authenticateUser(formData.email, formData.password)
            if (result.success) {
                onLogin(result.user)
            } else {
                setError(result.error)
            }
        } else {
            // Registration flow
            if (formData.password !== formData.confirmPassword) {
                setError('Passwords do not match')
                setLoading(false)
                return
            }

            const role = mode === 'seller-register' ? USER_ROLES.SELLER : USER_ROLES.BUYER
            const userData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password
            }

            if (mode === 'seller-register') {
                userData.sellerProfile = {
                    businessName: formData.businessName,
                    businessRegistration: formData.businessRegistration,
                    physicalAddress: {
                        street: formData.street,
                        city: formData.city,
                        country: formData.country
                    },
                    verificationStatus: 'pending'
                }
            }

            const result = registerUser(userData, role)
            if (result.success) {
                if (mode === 'seller-register') {
                    // Show pending verification message
                    setError('')
                    setMode('pending')
                } else {
                    onLogin(result.user)
                }
            } else {
                setError(result.error)
            }
        }
        setLoading(false)
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError('')
    }

    // Continue as Guest (FR-03)
    const handleGuestContinue = () => {
        onLogin({
            id: 'guest',
            name: 'Guest',
            email: '',
            role: USER_ROLES.GUEST,
            isGuest: true
        })
    }

    if (mode === 'pending') {
        return (
            <div className="modal">
                <div className="modal-content auth-modal">
                    <div className="auth-header">
                        <div className="logo-container">
                            <div className="dragon-icon">🐉</div>
                            <h1 className="brand-name">DragonPath</h1>
                        </div>
                    </div>
                    <div className="verification-pending">
                        <div className="pending-icon">⏳</div>
                        <h2>Application Submitted!</h2>
                        <p>Thank you for registering as a seller. Your application is under review.</p>
                        <p className="pending-details">
                            Our team will verify your business documents and contact you within 2-3 business days.
                        </p>
                        <button
                            className="btn-secondary"
                            onClick={() => setMode('login')}
                        >
                            Back to Login
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="modal">
            <div className="modal-content auth-modal">
                <div className="auth-header">
                    <div className="logo-container">
                        <div className="dragon-icon">🐉</div>
                        <h1 className="brand-name">DragonPath</h1>
                    </div>
                    <p className="auth-subtitle">
                        {mode === 'login' && 'Welcome back! Sign in to continue'}
                        {mode === 'register' && 'Create your buyer account'}
                        {mode === 'seller-register' && 'Register as a verified seller'}
                    </p>
                </div>

                {/* Role Selection Tabs */}
                {mode !== 'login' && (
                    <div className="auth-role-tabs">
                        <button
                            className={`role-tab ${mode === 'register' ? 'active' : ''}`}
                            onClick={() => setMode('register')}
                            type="button"
                        >
                            <span className="role-icon">🛒</span>
                            <span>Buyer</span>
                        </button>
                        <button
                            className={`role-tab ${mode === 'seller-register' ? 'active' : ''}`}
                            onClick={() => setMode('seller-register')}
                            type="button"
                        >
                            <span className="role-icon">🏪</span>
                            <span>Seller</span>
                        </button>
                    </div>
                )}

                {error && (
                    <div className="auth-error">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* Common Fields */}
                    {mode !== 'login' && (
                        <div className="form-group">
                            <label htmlFor="userName">Full Name</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                <input
                                    type="text"
                                    id="userName"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="userEmail">Email Address</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <input
                                type="email"
                                id="userEmail"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {mode !== 'login' && (
                        <div className="form-group">
                            <label htmlFor="userPhone">Phone Number</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                                </svg>
                                <input
                                    type="tel"
                                    id="userPhone"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="userPassword">Password</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input
                                type="password"
                                id="userPassword"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {mode !== 'login' && (
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Seller-specific fields (FR-02) */}
                    {mode === 'seller-register' && (
                        <>
                            <div className="form-section-divider">
                                <span>Business Information</span>
                            </div>

                            <div className="form-group">
                                <label htmlFor="businessName">Business Name</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                                    </svg>
                                    <input
                                        type="text"
                                        id="businessName"
                                        name="businessName"
                                        placeholder="Enter your business name"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="businessRegistration">Business Registration Number</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                    </svg>
                                    <input
                                        type="text"
                                        id="businessRegistration"
                                        name="businessRegistration"
                                        placeholder="Government-issued registration number"
                                        value={formData.businessRegistration}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="street">Business Address</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <input
                                        type="text"
                                        id="street"
                                        name="street"
                                        placeholder="Street address"
                                        value={formData.street}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">City</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        placeholder="City"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="country">Country</label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Uzbekistan">Uzbekistan</option>
                                        <option value="Kazakhstan">Kazakhstan</option>
                                        <option value="China">China</option>
                                        <option value="Tajikistan">Tajikistan</option>
                                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                                        <option value="Turkmenistan">Turkmenistan</option>
                                    </select>
                                </div>
                            </div>

                            <div className="seller-notice">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="16" x2="12" y2="12"></line>
                                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                </svg>
                                <p>
                                    <strong>Note:</strong> After registration, you'll need to upload your business documents,
                                    identity verification (KYC), and product photos for verification.
                                </p>
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn-primary btn-full" disabled={loading}>
                        <span>
                            {loading ? 'Processing...' : (
                                mode === 'login' ? 'Sign In' :
                                    mode === 'register' ? 'Create Account' :
                                        'Submit Application'
                            )}
                        </span>
                        {!loading && (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    {mode === 'login' ? (
                        <>
                            <p>Don't have an account? <button onClick={() => setMode('register')}>Register</button></p>
                            <div className="auth-divider">
                                <span>or</span>
                            </div>
                            <button className="btn-secondary btn-full" onClick={handleGuestContinue}>
                                <span>👤</span>
                                <span>Continue as Guest</span>
                            </button>
                        </>
                    ) : (
                        <p>Already have an account? <button onClick={() => setMode('login')}>Sign In</button></p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AuthModal
