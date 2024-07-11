import dynamic from 'next/dynamic';
const ProtectedRoute = dynamic(() => import('@/components/ProtectedRoute'), {ssr: false})
import React from 'react'

export default function Reminders() {
  return (
    <ProtectedRoute>
        <div className="">Still building...</div>
    </ProtectedRoute>
  )
}
