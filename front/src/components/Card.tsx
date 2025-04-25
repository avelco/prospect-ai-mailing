import React from 'react'

interface CardProps {
    children: React.ReactNode;
  }

export const Card = ({ children }: CardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden my-2 mx-3">
        {children}
    </div>
  )
}
