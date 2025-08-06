import React from 'react'

const SectionCard = ({ children, className = '', title, noPadding = false, ...props }) => {
  const baseClasses = noPadding ? 'card !p-0' : 'card'
  const combinedClasses = `${baseClasses} ${className}`.trim()

  return (
    <div className={combinedClasses} {...props}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 mb-4 px-6 pt-6">
          {title}
        </h2>
      )}
      {noPadding ? (
        children
      ) : (
        <div className="space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default SectionCard