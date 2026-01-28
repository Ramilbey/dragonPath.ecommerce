// DragonPath E-commerce - Payment & Checkout Component
// FR-12: Buyers must pay before order fulfillment via local or international payment gateways
// FR-13: Supported payment methods (Payme, Click, UzCard, Kaspi, Alipay, Visa, Mastercard)
// FR-14: Funds held in escrow until delivery milestones
// FR-15: Product condition documentation
// FR-16: Cancellation within 10 days if not picked up

import { useState } from 'react'
import { PAYMENT_METHODS, createOrder, confirmPayment, ORDER_STATUS } from '../data/orders'

function PaymentModal({ user, cart, shippingAddress, onSuccess, onClose }) {
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [step, setStep] = useState('select') // 'select' | 'processing' | 'success'
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    })
    const [error, setError] = useState('')

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingFee = subtotal > 100 ? 15.00 : 10.00
    const total = subtotal + shippingFee

    // Group payment methods by region
    const paymentMethods = Object.values(PAYMENT_METHODS)
    const localMethods = paymentMethods.filter(m => m.type === 'local')
    const internationalMethods = paymentMethods.filter(m => m.type === 'international')

    const handlePayment = async () => {
        setError('')
        setStep('processing')

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Validate card details for international payments
        if (selectedMethod.type === 'international') {
            if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
                setError('Please fill in all card details')
                setStep('select')
                return
            }
        }

        // Create order with escrow
        const orderItems = cart.map(item => ({
            productId: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image
        }))

        const orderResult = createOrder(
            user.id,
            orderItems,
            shippingAddress,
            selectedMethod,
            'seller-001' // In real app, this would be the actual seller ID
        )

        if (orderResult.success) {
            // Confirm payment and move to escrow
            const paymentResult = confirmPayment(
                orderResult.order.id,
                `TXN-${Date.now()}`
            )

            if (paymentResult.success) {
                setStep('success')
                setTimeout(() => {
                    onSuccess(paymentResult.order)
                }, 2000)
            } else {
                setError(paymentResult.error)
                setStep('select')
            }
        } else {
            setError(orderResult.error)
            setStep('select')
        }
    }

    if (step === 'processing') {
        return (
            <div className="modal">
                <div className="modal-content payment-modal">
                    <div className="payment-processing">
                        <div className="processing-spinner"></div>
                        <h3>Processing Payment</h3>
                        <p>Please wait while we securely process your payment...</p>
                        <div className="escrow-info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span>Your payment will be held in secure escrow</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (step === 'success') {
        return (
            <div className="modal">
                <div className="modal-content payment-modal">
                    <div className="payment-success">
                        <div className="success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <h3>Payment Successful!</h3>
                        <p>Your order has been placed and payment is held in escrow.</p>
                        <div className="escrow-explanation">
                            <h4>How Escrow Works:</h4>
                            <ul>
                                <li>✓ Your payment is securely held by DragonPath</li>
                                <li>✓ Seller ships when payment is confirmed</li>
                                <li>✓ Seller gets paid when you confirm delivery</li>
                                <li>✓ Full refund if cancelled before pickup</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="modal">
            <div className="modal-content payment-modal">
                <div className="modal-header">
                    <h2>Secure Checkout</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                {error && (
                    <div className="payment-error">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <div className="payment-content">
                    <div className="payment-left">
                        {/* Order Summary */}
                        <div className="order-summary-section">
                            <h3>Order Summary</h3>
                            <div className="order-items">
                                {cart.map(item => (
                                    <div key={item.id} className="order-item">
                                        <img src={item.image} alt={item.name} />
                                        <div className="item-details">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-qty">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-totals">
                                <div className="total-row">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Shipping</span>
                                    <span>${shippingFee.toFixed(2)}</span>
                                </div>
                                <div className="total-row final">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Escrow Info */}
                        <div className="escrow-info-box">
                            <div className="escrow-header">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                </svg>
                                <h4>Secure Escrow Payment</h4>
                            </div>
                            <ul className="escrow-benefits">
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Payment held until delivery confirmed
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Cancel within 10 days for full refund
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    Condition documented before shipping
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="payment-right">
                        {/* Payment Methods */}
                        <div className="payment-methods">
                            <h3>Select Payment Method</h3>

                            <div className="method-group">
                                <h4>Local Payment Methods</h4>
                                <div className="methods-grid">
                                    {localMethods.map(method => (
                                        <button
                                            key={method.id}
                                            className={`method-btn ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedMethod(method)}
                                        >
                                            <span className="method-icon">{method.icon}</span>
                                            <span className="method-name">{method.name}</span>
                                            <span className="method-region">{method.region}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="method-group">
                                <h4>International Cards</h4>
                                <div className="methods-grid">
                                    {internationalMethods.map(method => (
                                        <button
                                            key={method.id}
                                            className={`method-btn ${selectedMethod?.id === method.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedMethod(method)}
                                        >
                                            <span className="method-icon">{method.icon}</span>
                                            <span className="method-name">{method.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Card Details Form (for international payments) */}
                            {selectedMethod?.type === 'international' && (
                                <div className="card-details-form">
                                    <div className="form-group">
                                        <label>Card Number</label>
                                        <input
                                            type="text"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardDetails.number}
                                            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                            maxLength={19}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Expiry</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                value={cardDetails.expiry}
                                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                                maxLength={5}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>CVV</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                value={cardDetails.cvv}
                                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                                maxLength={4}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Cardholder Name</label>
                                        <input
                                            type="text"
                                            placeholder="Name on card"
                                            value={cardDetails.name}
                                            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="pci-notice">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                        </svg>
                                        <span>Payments processed via PCI-DSS compliant gateway. Card data is never stored.</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className="btn-primary btn-full pay-btn"
                            onClick={handlePayment}
                            disabled={!selectedMethod}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <span>Pay ${total.toFixed(2)} Securely</span>
                        </button>
                    </div>
                </div>

                <div className="payment-footer">
                    <div className="security-badges">
                        <span>🔒 SSL Encrypted</span>
                        <span>🛡️ PCI-DSS Compliant</span>
                        <span>✓ Escrow Protected</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentModal
