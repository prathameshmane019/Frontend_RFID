'use client'

import React, { useState } from 'react'

export default function AttendanceActions() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendAbsenceNotifications = async () => {
    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/attendance/absent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to send notifications')
      }

      const data = await response.json()
      setMessage(data.message)
    } catch (error) {
      setMessage('Error: Failed to send notifications. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="attendance-actions">
      <h2>Attendance Actions</h2>
      <button onClick={sendAbsenceNotifications} disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Absence Notifications'}
      </button>
      {message && (
        <div className={`message ${message.startsWith('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <style jsx>{`
        .attendance-actions {
          max-width: 300px;
          margin: 0 auto;
          text-align: center;
        }
        h2 {
          margin-bottom: 1rem;
        }
        button {
          padding: 0.5rem 1rem;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:disabled {
          background-color: #cccccc;
          cursor: not-allowed;
        }
        .message {
          margin-top: 1rem;
          padding: 0.5rem;
          border-radius: 4px;
        }
        .success {
          background-color: #d4edda;
          color: #155724;
        }
        .error {
          background-color: #f8d7da;
          color: #721c24;
        }
      `}</style>
    </div>
  )
}