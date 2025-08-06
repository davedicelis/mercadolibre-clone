import React from 'react';
import { CreditCard, Truck, Shield, X, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Sección de características principales */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Pago con tarjeta */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                <img 
                  src="https://http2.mlstatic.com/storage/homes-korriban/assets/images/ecosystem/payment.svg" 
                  alt="Pagos" 
                  className="w-8 h-8"
                />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Paga con tarjeta o en efectivo
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Con Mercado Pago, paga en cuotas y aprovecha la comodidad de financiación que te da tu banco, o hazlo con efectivo en puntos de pago. ¡Y siempre es seguro!
            </p>
            <a href="#" className="text-blue-500 text-sm hover:underline">
              Cómo pagar con Mercado Pago
            </a>
          </div>

          {/* Envío gratis */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                <img 
                  src="https://http2.mlstatic.com/storage/homes-korriban/assets/images/ecosystem/shipping.svg" 
                  alt="Envíos" 
                  className="w-8 h-8"
                />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Envío gratis desde $ 60.000
            </h3>
            <p className="text-sm text-gray-600">
              Con solo estar registrado en Mercado Libre, tienes envíos gratis en miles de productos seleccionados.
            </p>
          </div>

          {/* Seguridad */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
                <img 
                  src="https://http2.mlstatic.com/storage/homes-korriban/assets/images/ecosystem/protected.svg" 
                  alt="Seguridad" 
                  className="w-8 h-8"
                />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Seguridad, de principio a fin
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              ¿No te gusta? ¡Devuélvelo! En Mercado Libre, no hay nada que no puedas hacer, porque estás siempre protegido.
            </p>
            <a href="#" className="text-blue-500 text-sm hover:underline">
              Cómo te protegemos
            </a>
          </div>
        </div>

        {/* Botón de más información */}
        <div className="text-center mb-12">
          <button className="text-blue-500 text-sm hover:underline flex items-center justify-center mx-auto">
            Más información
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Enlaces del footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 text-sm">
          {/* Acerca de */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Acerca de</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Mercado Libre</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Investor relations</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Tendencias</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Sustentabilidad</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Blog</a></li>
            </ul>
          </div>

          {/* Otros sitios */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Otros sitios</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Developers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Mercado Pago</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Envíos</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Mercado Shops</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Mercado Ads</a></li>
            </ul>
          </div>

          {/* Ayuda / PQR */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Ayuda / PQR</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Comprar</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Vender</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Resolución de problemas</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Centro de seguridad</a></li>
            </ul>
          </div>

          {/* Redes sociales */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Redes sociales</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500 flex items-center">
                <X className="w-4 h-4 mr-2" />
                X
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 flex items-center">
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500 flex items-center">
                <Youtube className="w-4 h-4 mr-2" />
                YouTube
              </a></li>
            </ul>
          </div>

          {/* Mi cuenta */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Mi cuenta</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Resumen</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Favoritos</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Vender</a></li>
            </ul>
          </div>

          {/* Mercado Puntos */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Mercado Puntos</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Nivel 6</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Disney+</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">HBO Max</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Paramount+</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">ViX Premium</a></li>
            </ul>
          </div>

          {/* Temporadas */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Temporadas</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Black Friday</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Hot Sale</a></li>
              <li><a href="#" className="text-gray-600 hover:text-blue-500">Descuentazos</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer inferior */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between text-xs text-gray-500">
            <div className="flex flex-wrap items-center space-x-4 mb-2 md:mb-0">
              <a href="#" className="hover:text-blue-500">Trabaja con nosotros</a>
              <a href="#" className="hover:text-blue-500">Términos y condiciones</a>
              <a href="#" className="hover:text-blue-500">Promociones</a>
              <a href="#" className="hover:text-blue-500">Cómo cuidamos tu privacidad</a>
              <a href="#" className="hover:text-blue-500">Accesibilidad</a>
              <a href="#" className="hover:text-blue-500">Ayuda / PQR</a>
              <a href="#" className="hover:text-blue-500">Navidad</a>
              <a href="#" className="hover:text-blue-500">www.sic.gov.co</a>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-4">
            <p>Copyright © 1999-2025 MercadoLibre Colombia LTDA.</p>
            <p>Calle 100 #7-33, Torre I, Piso 16, Bogotá D.C., Colombia</p>
          </div>
          
          {/* Logos al final */}
          <div className="flex items-center justify-center mt-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-xs text-gray-500">
                <img 
                  src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadolibre/sic.png" 
                  alt="SIC" 
                  className="w-auto h-6 mr-2"
                />
              </div>
              <div className="flex items-center text-xs text-red-500">
                <img 
                  src="https://http2.mlstatic.com/frontend-assets/ml-web-navigation/ui-navigation/5.21.22/mercadolibre/pum.png" 
                  alt="PUM" 
                  className="w-auto h-6 mr-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;