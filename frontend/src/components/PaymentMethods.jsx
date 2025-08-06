import React from 'react'

const PaymentMethods = ({ paymentMethods = [], price = 0, currency = 'COP' }) => {
  const formatPrice = (amount, curr = 'COP') => {
    return `$ ${amount.toLocaleString()}`
  }

  const calculateInstallment = (price, installments) => {
    return price / installments
  }

  const getPaymentIcon = (type) => {
    const icons = {
      'credit_card': '💳',
      'debit_card': '💳',
      'mercado_pago': '💰',
      'bank_transfer': '🏦',
      'cash': '💵',
      'paypal': '📱'
    }
    return icons[type] || '💳'
  }

  const getPaymentDescription = (method) => {
    switch (method.type) {
      case 'credit_card':
        return 'Acepta todas las tarjetas'
      case 'debit_card':
        return 'Pago inmediato'
      case 'mercado_pago':
        return 'Pago digital seguro'
      case 'bank_transfer':
        return 'Transferencia directa'
      case 'cash':
        return 'Efectivo al recibir'
      default:
        return 'Método de pago disponible'
    }
  }

  if (!paymentMethods || paymentMethods.length === 0) {
    return (
      <div className="card">
        <h3 className="font-medium text-gray-900 mb-4">Medios de pago</h3>
        <p className="text-gray-500 text-sm">No hay información de medios de pago disponible</p>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="font-medium text-gray-900 mb-4">Medios de pago</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method, index) => (
          <div key={index} className="payment-method">
            <div className="flex items-center flex-1">
              <span className="text-2xl mr-3">
                {method.logo || getPaymentIcon(method.type)}
              </span>
              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {method.name}
                </div>
                <div className="text-sm text-gray-600">
                  {getPaymentDescription(method)}
                </div>
              </div>
            </div>
            
            {/* Información de cuotas para tarjetas de crédito */}
            {method.installments && method.type === 'credit_card' && (
              <div className="text-right text-sm">
                <div className="text-mercado-green font-medium">
                  Hasta {method.installments} cuotas
                </div>
                <div className="text-gray-600">
                  {formatPrice(calculateInstallment(price, method.installments), currency)} por mes
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Información adicional sobre cuotas */}
      {paymentMethods.some(method => method.installments) && (
        <div className="mt-4 p-3 bg-mercado-light-blue rounded-lg">
          <div className="text-sm text-mercado-blue">
            <div className="font-medium mb-1">💡 Cuotas sin interés</div>
            <div>
              Con tarjetas de crédito seleccionadas. 
              Ver términos y condiciones en el checkout.
            </div>
          </div>
        </div>
      )}

      {/* Opciones de financiamiento destacadas */}
      <div className="mt-4 space-y-2">
        {paymentMethods
          .filter(method => method.installments && method.installments >= 12)
          .map((method, index) => (
            <div key={`financing-${index}`} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm text-gray-700">
                {method.installments}x {formatPrice(calculateInstallment(price, method.installments), currency)}
              </span>
              <span className="text-xs text-mercado-green font-medium">
                Sin interés
              </span>
            </div>
          ))
        }
      </div>

      {/* Seguridad y garantías */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <span>🔒</span>
            <span>Compra segura</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🛡️</span>
            <span>Protección al comprador</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>↩️</span>
            <span>Devolución gratis</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethods