function SuccessModal({ onClose }) {
    return (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content success-modal">
                <div className="success-animation">
                    <div className="success-checkmark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </div>
                </div>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you for your order. You will receive a confirmation shortly.</p>
                <button className="btn-primary" onClick={onClose}>Continue Shopping</button>
            </div>
        </div>
    )
}

export default SuccessModal
