import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

function DeliveryModal({ product, quantity, onClose, onSuccess }) {
    const { savedLocations, placeOrder } = useApp()
    const [formData, setFormData] = useState({
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        saveAsDefault: false
    })

    useEffect(() => {
        // Pre-fill with default location if exists
        const defaultLocation = savedLocations.find(loc => loc.isDefault)
        if (defaultLocation) {
            setFormData({
                addressLine1: defaultLocation.addressLine1 || '',
                addressLine2: defaultLocation.addressLine2 || '',
                city: defaultLocation.city || '',
                state: defaultLocation.state || '',
                postalCode: defaultLocation.postalCode || '',
                country: defaultLocation.country || '',
                saveAsDefault: false
            })
        }
    }, [savedLocations])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleLocationSelect = (location) => {
        setFormData({
            addressLine1: location.addressLine1 || '',
            addressLine2: location.addressLine2 || '',
            city: location.city || '',
            state: location.state || '',
            postalCode: location.postalCode || '',
            country: location.country || '',
            saveAsDefault: false
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const location = {
            ...formData,
            isDefault: formData.saveAsDefault
        }

        placeOrder(product, quantity, location)
        onSuccess()
    }

    const total = product.price * quantity

    return (
        <div className="modal" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-content delivery-modal">
                <button className="modal-close" onClick={onClose}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                <div className="delivery-header">
                    <svg className="delivery-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <h2>Delivery Location</h2>
                    <p>Choose where you want your order delivered</p>
                </div>

                {savedLocations.length > 0 && (
                    <div className="saved-locations-section">
                        <h3>Saved Locations</h3>
                        <div className="saved-locations-list">
                            {savedLocations.map((loc, index) => (
                                <div
                                    key={index}
                                    className={`saved-location-item ${loc.isDefault ? 'default' : ''}`}
                                    onClick={() => handleLocationSelect(loc)}
                                >
                                    <svg className="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                        <circle cx="12" cy="10" r="3"></circle>
                                    </svg>
                                    <span className="location-text">{loc.addressLine1}, {loc.city}, {loc.country}</span>
                                    {loc.isDefault && <span className="default-badge">Default</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <form className="delivery-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="addressLine1">Address Line 1 *</label>
                        <input
                            type="text"
                            id="addressLine1"
                            name="addressLine1"
                            placeholder="Street address"
                            value={formData.addressLine1}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="addressLine2">Address Line 2</label>
                        <input
                            type="text"
                            id="addressLine2"
                            name="addressLine2"
                            placeholder="Apartment, suite, unit, etc."
                            value={formData.addressLine2}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="city">City *</label>
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
                            <label htmlFor="state">State/Province *</label>
                            <input
                                type="text"
                                id="state"
                                name="state"
                                placeholder="State"
                                value={formData.state}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="postalCode">Postal Code *</label>
                            <input
                                type="text"
                                id="postalCode"
                                name="postalCode"
                                placeholder="Postal code"
                                value={formData.postalCode}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="country">Country *</label>
                            <input
                                type="text"
                                id="country"
                                name="country"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="saveAsDefault"
                            name="saveAsDefault"
                            checked={formData.saveAsDefault}
                            onChange={handleChange}
                        />
                        <label htmlFor="saveAsDefault">Save as default delivery location</label>
                    </div>

                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Product:</span>
                            <span>{product.name}</span>
                        </div>
                        <div className="summary-row">
                            <span>Quantity:</span>
                            <span>{quantity}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary btn-full">
                        <span>Place Order</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default DeliveryModal
