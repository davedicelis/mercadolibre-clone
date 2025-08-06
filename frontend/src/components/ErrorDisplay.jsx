import React from 'react'

const ErrorDisplay = ({ error, onRetry, title = "Error al cargar datos" }) => {
    const getErrorMessage = (error) => {
        if (typeof error === 'string') return error
        if (error?.message) return error.message
        if (error?.detail) return error.detail
        return "Ha ocurrido un error inesperado"
    }

    const getErrorCode = (error) => {
        if (error?.status) return error.status
        if (error?.status_code) return error.status_code
        if (error?.message && error.message.includes(':')) {
            const code = error.message.split(':')[0]
            if (!isNaN(code)) return parseInt(code)
        }
        return null
    }

    const errorMessage = getErrorMessage(error)
    const errorCode = getErrorCode(error)

    return (
        <div className="card">
            <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                    {errorMessage}
                </p>
                
                {errorCode && (
                    <p className="text-sm text-gray-500 mb-4">
                        Código de error: {errorCode}
                    </p>
                )}
                
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Intentar nuevamente
                    </button>
                )}
            </div>
        </div>
    )
}

export default ErrorDisplay