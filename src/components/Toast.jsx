import { useState, useEffect } from 'react'

function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose()
        }, 3000)
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className={`toast show ${type}`}>
            <span>{message}</span>
        </div>
    )
}

export default Toast
