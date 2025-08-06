import React, { useState, useEffect } from 'react';
import { useProduct } from '../hooks/useProduct';
import { productApi } from '../services/api';
import { LoadingProductDetail, LoadingCard } from './LoadingSpinner';
import SectionCard from './SectionCard';


const ProductDetail = ({ productId }) => {
  const { product, relatedProducts, loading, error, refreshProduct } = useProduct(productId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);
  const [carouselPosition, setCarouselPosition] = useState(0);
  const [sellerCarouselPosition, setSellerCarouselPosition] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState(null);
  const [isMobile, setIsMobile] = useState(false);


  // Cargar medios de pago cuando se monta el componente
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const methods = await productApi.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error loading payment methods:', error);
        // Fallback a null para mostrar las imágenes hardcodeadas si falla
        setPaymentMethods(null);
      }
    };

    loadPaymentMethods();
  }, []);

  // Detectar tamaño de pantalla para carrusel responsivo
  useEffect(() => {
    const checkMobile = () => {
      const newIsMobile = window.innerWidth < 1024; // lg breakpoint de Tailwind
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile);
        setCarouselPosition(0); // Reset posición cuando cambie el tamaño
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  // Error state
  if (error) {
    return (
      <div className="min-h-96 center-flex">
        <div className="text-center space-y-4">
          <div className="text-6xl">😞</div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Oops! Algo salió mal
          </h2>
          <p className="text-gray-600 max-w-md">
            {error}
          </p>
          <button 
            onClick={refreshProduct}
            className="px-6 py-3 bg-mercado-blue text-white rounded hover:opacity-90 transition-opacity"
          >
            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="fade-in">
        <LoadingProductDetail />
        
        {/* Loading para secciones adicionales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <LoadingCard />
          <LoadingCard />
        </div>
        
        {/* Loading para productos relacionados */}
        <div className="mt-12">
          <div className="h-6 bg-gray-200 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <LoadingCard key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-96 center-flex">
        <div className="text-center space-y-4">
          <div className="text-6xl">🔍</div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Producto no encontrado
          </h2>
          <p className="text-gray-600 max-w-md">
            El producto que buscas no existe o ha sido removido.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-mercado-blue text-white rounded hover:opacity-90 transition-opacity"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return `$ ${price.toLocaleString('es-CO')}`;
  };

  // Usar productos relacionados reales del backend
  const displayProducts = relatedProducts && relatedProducts.length > 0 ? relatedProducts : [];
  
  // Filtrar productos del mismo vendedor (excluyendo el producto actual)
  const sellerProducts = displayProducts.filter(p => {
    if (!product?.seller?.name) return false;
    const productSellerName = product.seller.name.trim();
    const pSellerName = (p.seller_name || '').trim(); // Los productos relacionados usan seller_name (string)
    console.log('Comparing sellers:', {
      productSeller: productSellerName,
      relatedProductSeller: pSellerName,
      productId: p.id,
      match: pSellerName === productSellerName
    });
    return pSellerName === productSellerName && p.id !== product.id;
  });
  
  // Debug log
  console.log('ProductDetail Debug:', {
    productLoaded: !!product,
    currentProductId: product?.id,
    currentSeller: product?.seller?.name,
    relatedProductsCount: relatedProducts?.length || 0,
    displayProductsCount: displayProducts.length,
    sellerProductsCount: sellerProducts.length,
    firstFewProducts: displayProducts.slice(0, 3).map(p => ({
      id: p.id, 
      seller: p.seller_name || p.seller?.name,
      title: p.title?.substring(0, 30)
    })),
    sellerProducts: sellerProducts.map(p => ({
      id: p.id,
      seller: p.seller_name || p.seller?.name,
      title: p.title?.substring(0, 30)
    })),
    showSellerSection: sellerProducts && sellerProducts.length > 0
  });
  
  // Configuración del carrusel de productos relacionados (responsivo)
  const itemsPerPage = isMobile ? 1 : 3; // 1 en móvil, 3 en desktop
  const maxPosition = Math.max(0, displayProducts.length - itemsPerPage);
  const showNavButtons = displayProducts.length > itemsPerPage;
  
  const nextSlide = () => {
    setCarouselPosition(prev => Math.min(prev + 1, maxPosition));
  };

  const prevSlide = () => {
    setCarouselPosition(prev => Math.max(prev - 1, 0));
  };
  
  // Calcular el porcentaje de desplazamiento para productos relacionados
  const getTranslateX = () => {
    if (displayProducts.length === 0) return 0;
    // En móvil: cada posición desplaza 100% (1 producto), en desktop: 33.333% (1/3 del ancho)
    const percentage = isMobile ? 100 : (100 / 3);
    return `translateX(-${carouselPosition * percentage}%)`;
  };

  // Configuración del carrusel de productos del vendedor
  const sellerItemsPerPage = 2; // Mostrar 2 productos del vendedor por página
  const sellerMaxPosition = Math.max(0, sellerProducts.length - sellerItemsPerPage);
  
  const nextSellerSlide = () => {
    setSellerCarouselPosition(prev => Math.min(prev + 1, sellerMaxPosition));
  };

  const prevSellerSlide = () => {
    setSellerCarouselPosition(prev => Math.max(prev - 1, 0));
  };
  
  // Calcular el porcentaje de desplazamiento para productos del vendedor
  const getSellerTranslateX = () => {
    if (sellerProducts.length === 0) return 0;
    // Cada posición desplaza 50% (1/2 del ancho)
    return `translateX(-${sellerCarouselPosition * (100 / sellerItemsPerPage)}%)`;
  };

  // Función para hacer scroll a la sección de medios de pago
  const scrollToPaymentMethods = () => {
    const element = document.getElementById('medios-de-pago');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen fade-in">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb */}
        <div className="text-sm text-mercado-blue mb-4 flex flex-wrap items-center">
          <span className="link-primary" onClick={() => window.location.href = '/'}>
            Volver al inicio
          </span>
          <span className="mx-2">|</span>
          <span className="link-primary" onClick={() => window.location.href = '/celulares'}>
            {product.category?.main || 'Celulares y Telefonía'}
          </span>
          <span className="mx-2">&gt;</span>
          <span className="link-primary">
            {product.category?.sub || 'Celulares y Smartphones'}
          </span>
          <span className="mx-2">&gt;</span>
          <span className="link-primary">
            {product.category?.brand || (product.title?.includes('Samsung') ? 'Samsung' : 
             product.title?.includes('Motorola') ? 'Motorola' : 
             product.title?.includes('iPhone') ? 'Apple' : 'Marca')}
          </span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-600">
            {product.category?.series || 'Modelo'}
          </span>
        </div>

        <div className="flex justify-end mb-4 text-sm">
          <span className="link-primary mr-4">Vender uno igual</span>
          <span className="link-primary">Compartir</span>
        </div>

        {/* Layout principal */}
        <div className="flex flex-col lg:flex-row gap-6" onClick={() => setShowQuantityDropdown(false)}>
          
          {/* Contenido principal izquierdo */}
          <div className="flex-1 lg:max-w-4xl" onClick={(e) => e.stopPropagation()}>
            
            {/* Primera fila: Galería e Información del producto unificada */}
            <SectionCard className="mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Columna izquierda - Galería de imágenes (3/5) */}
                <div className="lg:col-span-3">
                  <div className="flex gap-3">
                    {/* Thumbnails a la izquierda */}
                    <div className="flex flex-col gap-2 overflow-y-auto">
                      {product.images && product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-16 h-16 border-2 rounded-md overflow-hidden flex-shrink-0 ${
                            selectedImage === index ? 'border-mercado-blue' : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={image.url || image}
                            alt={image.alt || `Vista ${index + 1}`}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://placehold.co/64x64/f0f0f0/ccc?text=X';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                    
                    {/* Imagen principal a la derecha */}
                    <div className="flex-1 aspect-square bg-white rounded-lg overflow-hidden relative border border-gray-200">
                      <img
                        src={product.images?.[selectedImage]?.url || product.images?.[0]?.url || product.images?.[selectedImage] || product.images?.[0] || 'https://placehold.co/600x600/ccc/333?text=Sin+Imagen'}
                        alt={product.images?.[selectedImage]?.alt || product.title}
                        className="w-full h-full object-contain p-4"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://placehold.co/600x600/f0f0f0/ccc?text=Error';
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Columna derecha - Información del producto (2/5) */}
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <span className="text-gray-600">{product.condition || 'Nuevo'}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-600">+{product.sold_quantity || 100} vendidos</span>
                  </div>

                  {/* Título */}
                  <h1 className="text-xl text-gray-900 mb-4 leading-tight">
                    {product.title}
                  </h1>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                      <div className="flex text-mercado-blue">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={`text-sm ${i < Math.round(product.rating) ? 'text-mercado-blue' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews_count || 0})</span>
                    </div>
                  )}

                  {/* Precio */}
                  <div className="mb-6">
                    <div className="text-3xl text-gray-900 font-light mb-2">
                      {formatPrice(product.price)}
                    </div>
                    <div className="text-base text-gray-800 mb-2">
                      12 cuotas de {formatPrice(product.price / 12)} sin interés
                    </div>
                    <button 
                      onClick={scrollToPaymentMethods}
                      className="text-sm link-primary"
                    >
                      Ver los medios de pago
                    </button>
                  </div>

                  {/* Lo que tienes que saber */}
                  {product.features && product.features.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Lo que tienes que saber de este producto
                      </h3>
                      <ul className="text-sm text-gray-700 space-y-1">
                        {product.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            <span><strong>{typeof feature === 'object' ? feature.name : feature}:</strong> {typeof feature === 'object' ? feature.value : 'Incluido'}</span>
                          </li>
                        ))}
                      </ul>
                      <a href="#caracteristicas-detalladas" className="text-sm link-primary mt-2">
                        Ver características
                      </a>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Borde inferior divisorio */}
              <div className="border-b border-gray-200 mt-6"></div>
            </SectionCard>

            {/* Segunda fila: Productos relacionados con carrusel funcional */}
            {displayProducts && displayProducts.length > 0 && (
              <SectionCard className="mb-6">
                <h2 className="text-xl font-medium text-gray-900 mb-1">Productos relacionados</h2>
                <p className="text-sm text-gray-600 mb-6">Promocionado</p>

                {/* Carrusel */}
                <div className="relative">
                  {/* Botón anterior */}
                  {showNavButtons && (
                    <button
                      onClick={prevSlide}
                      disabled={carouselPosition === 0}
                      aria-label="Anterior"
                      className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow center-flex transition ${
                        carouselPosition === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Contenedor del carrusel */}
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-300 ease-in-out gap-4"
                      style={{
                        transform: getTranslateX(),
                      }}
                    >
                      {displayProducts.map((relatedProduct) => (
                        <div
                          key={relatedProduct.id}
                          className="w-full lg:w-1/3 flex-shrink-0"
                          onClick={() => {
                            if (relatedProduct.id?.toString().startsWith('sample-')) {
                              alert(`Navegando a: ${relatedProduct.title}`);
                            } else {
                              window.location.assign(`/producto/${relatedProduct.id}`);
                            }
                          }}
                        >
                          <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white h-full flex flex-col">
                            {/* Imagen del producto */}
                            <div className="w-full h-48 bg-gray-50 overflow-hidden p-4 center-flex">
                              <img
                                src={relatedProduct.thumbnail}
                                alt={relatedProduct.title}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://placehold.co/300x300/f0f0f0/ccc?text=Error';
                                }}
                              />
                            </div>

                            {/* Información del producto */}
                            <div className="p-4 flex-grow flex flex-col">
                              <div className="mb-2">
                                {relatedProduct.original_price &&
                                  relatedProduct.original_price > relatedProduct.price && (
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm text-gray-500 line-through">
                                        {formatPrice(relatedProduct.original_price)}
                                      </span>
                                      <span className="text-xs font-medium text-green-600 bg-green-100 px-1 py-0.5 rounded">
                                        {Math.round(
                                          ((relatedProduct.original_price - relatedProduct.price) /
                                            relatedProduct.original_price) *
                                            100
                                        )}
                                        % OFF
                                      </span>
                                    </div>
                                  )}
                                <div className="text-lg font-normal text-gray-900 mb-1">
                                  {formatPrice(relatedProduct.price)}
                                </div>
                              </div>

                              <div className="text-sm text-green-600 mb-2">
                                12 cuotas de {formatPrice(relatedProduct.price / 12)}
                              </div>

                              <h3 className="text-sm text-gray-700 leading-tight line-clamp-2 mt-auto">
                                {relatedProduct.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Botón siguiente */}
                  {showNavButtons && (
                    <button
                      onClick={nextSlide}
                      disabled={carouselPosition >= maxPosition}
                      aria-label="Siguiente"
                      className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full shadow center-flex transition ${
                        carouselPosition >= maxPosition
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Indicadores de posición */}
                {displayProducts.length > itemsPerPage && (
                  <div className="center-flex mt-4 space-x-2">
                    {Array.from(
                      { length: maxPosition + 1 },
                      (_, index) => (
                        <button
                          key={index}
                          onClick={() => setCarouselPosition(index)}
                          aria-label={`Ir a la página ${index + 1}`}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            carouselPosition === index ? 'bg-mercado-blue' : 'bg-gray-300'
                          }`}
                        />
                      )
                    )}
                  </div>
                )}
              </SectionCard>
            )}

            {/* Sección de productos del vendedor - CARRUSEL SIN PAGINACIÓN */}
            {sellerProducts && sellerProducts.length > 0 && (
              <SectionCard className="mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-medium text-gray-900 mb-1">
                      Productos del vendedor
                    </h2>
                    <p className="text-sm text-gray-600">
                      Otros productos de {product?.seller?.name || 'este vendedor'}
                    </p>
                  </div>
                  <button 
                    onClick={() => alert('Navegando a la página del vendedor')}
                    className="text-sm link-primary font-medium"
                  >
                    Ver más productos
                  </button>
                </div>

                {/* Carrusel de productos del vendedor */}
                <div className="relative">
                  <div className="overflow-hidden">
                    <div 
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{ transform: getSellerTranslateX() }}
                    >
                      {sellerProducts.map((sellerProduct) => (
                        <div
                          key={sellerProduct.id}
                          className="w-1/2 flex-shrink-0 px-2"
                        >
                          <div
                            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer bg-white flex h-32"
                            onClick={() => {
                              if (sellerProduct.id?.toString().startsWith('sample-')) {
                                alert(`Navegando a: ${sellerProduct.title}`);
                              } else {
                                window.location.assign(`/producto/${sellerProduct.id}`);
                              }
                            }}
                          >
                            {/* Imagen del producto - lado izquierdo */}
                            <div className="w-28 h-full bg-gray-50 overflow-hidden p-2 center-flex flex-shrink-0">
                              <img
                                src={sellerProduct.thumbnail || sellerProduct.image}
                                alt={sellerProduct.title}
                                className="max-w-full max-h-full object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = 'https://placehold.co/100x100/f0f0f0/ccc?text=Error';
                                }}
                              />
                            </div>

                            {/* Información del producto - lado derecho */}
                            <div className="flex-1 p-3 flex flex-col justify-between">
                              {/* Precio */}
                              <div className="mb-2">
                                <div className="text-lg font-normal text-gray-900">
                                  {formatPrice(sellerProduct.price)}
                                </div>
                                <div className="text-sm text-green-600">
                                  12 cuotas de {formatPrice(sellerProduct.price / 12)}
                                </div>
                              </div>

                              {/* Título */}
                              <h3 className="text-sm text-gray-700 leading-tight line-clamp-2">
                                {sellerProduct.title}
                              </h3>

                              {/* Envío gratis si aplica */}
                              {sellerProduct.shipping?.free && (
                                <div className="text-xs text-green-600 flex items-center mt-2">
                                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path d="M3 4a1 1 0 00-1 1v1h16V5a1 1 0 00-1-1H3zM19 8H1v8a1 1 0 001 1h14a1 1 0 001-1V8z" />
                                  </svg>
                                  Envío gratis
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Auto-advance cada 5 segundos si hay más de 2 productos */}
                  {sellerProducts.length > sellerItemsPerPage && (
                    <div className="mt-4">
                      <div className="flex justify-center space-x-2">
                        {Array.from({ length: Math.ceil(sellerProducts.length / sellerItemsPerPage) }).map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === sellerCarouselPosition ? 'bg-mercado-blue' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mostrar enlace si hay más productos */}
                {sellerProducts.length > 2 && (
                  <div className="text-center mt-6">
                    <button 
                      onClick={() => alert('Navegando a todos los productos del vendedor')}
                      className="link-primary font-medium"
                    >
                      Ver todos los productos de {product?.seller?.name} ({sellerProducts.length} productos)
                    </button>
                  </div>
                )}
              </SectionCard>
            )}

            {/* Características detalladas */}
            {product.features && product.features.length > 0 && (
              <SectionCard id="caracteristicas-detalladas" className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-6">
                  Características técnicas completas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        {typeof feature === 'object' ? feature.name : feature}:
                      </span>
                      <span className="text-gray-900">
                        {typeof feature === 'object' ? feature.value : 'Incluido'}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            )}

            {/* Descripción del producto */}
            {product.description && (
              <SectionCard className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-6">
                  Descripción del producto
                </h3>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </SectionCard>
            )}

          </div>

          {/* Sidebar derecho */}
          <div className="lg:w-80 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-4 space-y-4">
              
              {/* Envío */}
              <SectionCard className="!p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                      <path d="M3 4a1 1 0 00-1 1v1h16V5a1 1 0 00-1-1H3zM19 8H1v8a1 1 0 001 1h14a1 1 0 001-1V8z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {product.shipping?.free ? 'Llega gratis el martes' : 'Envío disponible'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2 pl-7">
                  Retira gratis a partir del martes en una agencia.
                </div>
                <button 
                  onClick={() => alert('Mostrando ubicaciones cercanas: Agencia Centro - Calle 10 #5-25, Agencia Norte - Carrera 15 #80-30')}
                  className="text-sm link-primary pl-7"
                >
                  Ver en el mapa
                </button>
              </SectionCard>

              {/* Stock y Compra */}
              <SectionCard className="!p-4">
                <div className="text-lg font-semibold text-gray-800 mb-3">Stock disponible</div>
                
                <div className="relative mb-4">
                  <label className="text-sm text-gray-600 mb-2 block">Cantidad:</label>
                  <button
                    onClick={() => setShowQuantityDropdown(!showQuantityDropdown)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-left bg-white hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{selectedQuantity} unidad{selectedQuantity > 1 ? 'es' : ''}</span>
                    <svg className={`w-4 h-4 transition-transform ${showQuantityDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {showQuantityDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {Array.from({ length: Math.min(product.available_quantity || 6, 10) }, (_, i) => i + 1).map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setSelectedQuantity(q);
                            setShowQuantityDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 hover:bg-blue-50 ${
                            selectedQuantity === q ? 'bg-blue-50' : ''
                          }`}
                        >
                          {q} unidad{q > 1 ? 'es' : ''}
                        </button>
                      ))}
                    </div>
                  )}
                  <div className="text-sm text-gray-500 mt-1">
                    ({product.available_quantity} disponibles)
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => alert('¡Compra realizada exitosamente! Tu producto será enviado pronto.')}
                    className="w-full bg-mercado-original-blue hover:bg-mercado-blue-hover text-white py-3 rounded-md font-semibold transition-colors"
                  >
                    Comprar ahora
                  </button>
                  <button 
                    onClick={() => alert('¡Producto agregado al carrito! Puedes continuar comprando o ir al carrito.')}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-mercado-blue py-3 rounded-md font-semibold transition-colors"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </SectionCard>

              {/* Vendedor */}
              <SectionCard className="!p-4">
                <div className="text-sm text-gray-600 mb-3">
                  Vendido por <span className="text-mercado-blue font-medium">{product.seller?.name || 'MUNGOSSAS'}</span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {product.seller?.reputation || 'MercadoLíder'} | <span className="font-medium">+{product.seller?.sales_count || 1500} ventas</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-900">
                    Agrega y recibe gratis los productos de este vendedor en tu carrito.
                  </span>
                </div>
                <button 
                  onClick={() => alert('¡Producto agregado a tu lista de deseos! Ahora puedes encontrarlo en "Mis Listas".')}
                  className="text-sm link-primary"
                >
                  Agregar a una lista
                </button>
              </SectionCard>

              {/* Medios de pago */}
              <SectionCard id="medios-de-pago" className="!p-4">
                <h3 className="font-medium text-gray-900 mb-4">Medios de pago</h3>

                {/* Banner de cuotas */}
                <div className="bg-green-600 text-white p-3 rounded-md mb-4 center-flex text-sm font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 6a2 2 0 012-2h16a2 2 0 012 2v3H2V6zm0 5h20v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7zm4 3h4v2H6v-2z" />
                  </svg>
                  ¡Paga en hasta 12 cuotas con 0% interés!
                </div>

                {/* Tarjetas de crédito */}
                <h4 className="text-sm font-medium text-gray-900 mb-2">Tarjetas de crédito</h4>
                <div className="flex gap-2 mb-4">
                  {paymentMethods?.credit_cards?.map((method) => (
                    <img 
                      key={method.id}
                      src={method.logo} 
                      alt={method.name} 
                      className="h-6"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )) || (
                    // Fallback si no hay datos del backend
                    <>
                      <img src="https://http2.mlstatic.com/storage/logos-api-admin/a5f047d0-9be0-11ec-aad4-c3381f368aaf-m.svg" alt="Visa" className="h-6"/>
                      <img src="https://http2.mlstatic.com/storage/logos-api-admin/aa2b8f70-5c85-11ec-ae75-df2bef173be2-m.svg " alt="Mastercard" className="h-6"/>
                      <img src="https://http2.mlstatic.com/storage/logos-api-admin/b2c93a40-f3be-11eb-9984-b7076edb0bb7-m.svg " alt="American Express" className="h-6"/>
                      <img src="https://http2.mlstatic.com/storage/logos-api-admin/f1fc5b20-f39b-11eb-a186-1134488bf456-m.svg" alt="Codensa" className="h-6"/>
                    </>
                  )}
                </div>

                {/* Tarjetas de débito */}
                <h4 className="text-sm font-medium text-gray-900 mb-2">Tarjetas de débito</h4>
                <div className="flex gap-2 mb-4">
                  {paymentMethods?.debit_cards?.map((method) => (
                    <img 
                      key={method.id}
                      src={method.logo} 
                      alt={method.name} 
                      className="h-6"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )) || (
                    // Fallback si no hay datos del backend
                    <>
                      <img src="https://http2.mlstatic.com/storage/logos-api-admin/312238e0-571b-11e8-823a-758d95db88db-m.svg" alt="Visa Débito" className="h-6"/>
                      <img src="https://http2.mlstatic.com/storage/logos-api-admin/157dce60-571b-11e8-95d8-631c1a9a92a9-m.svg" alt="Mastercard Débito" className="h-6"/>
                    </>
                  )}
                </div>

                {/* Efectivo */}
                <h4 className="text-sm font-medium text-gray-900 mb-2">Efectivo</h4>
                <div className="flex items-center mb-4">
                  {paymentMethods?.cash?.map((method) => (
                    <img 
                      key={method.id}
                      src={method.logo} 
                      alt={method.name} 
                      className="h-6"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )) || (
                    // Fallback si no hay datos del backend
                    <img src="https://http2.mlstatic.com/storage/logos-api-admin/e5ee1d00-f39b-11eb-8e0d-6f4af49bf82e-m.svg" alt="Efecty" className="h-6"/>
                  )}
                </div>

                {/* Enlace a más métodos */}
                <button 
                  onClick={() => alert('Medios de pago adicionales: PSE, Baloto, Gana, Su Red, Via Baloto, Pago Fácil y más opciones disponibles.')}
                  className="text-sm link-primary"
                >
                  Conoce otros medios de pago
                </button>
              </SectionCard>

              {/* Productos relacionados en sidebar */}
              {displayProducts && displayProducts.length > 0 && (
                <SectionCard className="!p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Otros productos relacionados</h3>
                  
                  <div className="space-y-3">
                    {displayProducts.slice(0, 3).map((relatedProduct) => {
                      // Convertir a string para usar startsWith sin errores
                      const idStr = relatedProduct.id.toString();
                      return (
                        <div 
                          key={relatedProduct.id} 
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            if (idStr.startsWith('sample-')) {
                              alert(`Navegando a producto: ${relatedProduct.title}`);
                            } else {
                              // Navegación normal
                              window.location.href = `/producto/${relatedProduct.id}`;
                            }
                          }}
                        >
                          <div className="flex">
                            <div className="w-16 h-16 bg-gray-100 overflow-hidden flex-shrink-0">
                              <img
                                src={relatedProduct.thumbnail}
                                alt={relatedProduct.title}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => {
                                  e.target.src = 'https://placehold.co/64x64/f0f0f0/ccc?text=Error';
                                }}
                              />
                            </div>
                            
                            <div className="p-2 flex-1">
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                {formatPrice(relatedProduct.price)}
                              </div>
                              <div className="text-xs text-green-600 mb-1">
                                12 cuotas sin interés
                              </div>
                              <h4 className="text-xs text-gray-700 line-clamp-2">
                                {relatedProduct.title}
                              </h4>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </SectionCard>
              )}

            </div>
          </div>
        </div>

        {/* Botón flotante para móvil */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden z-40">
          <div className="flex space-x-3">
            <button 
              onClick={() => alert('¡Producto agregado al carrito! Puedes continuar comprando o ir al carrito.')}
              className="flex-1 bg-blue-100 hover:bg-blue-200 text-mercado-blue py-3 px-6 rounded font-medium transition-colors"
              disabled={!product.available_quantity || product.available_quantity === 0}
            >
              Agregar al carrito
            </button>
            <button 
              onClick={() => alert('¡Compra realizada exitosamente! Tu producto será enviado pronto.')}
              className="flex-1 bg-mercado-original-blue hover:bg-blue-600 text-white py-3 px-6 rounded font-medium transition-colors"
              disabled={!product.available_quantity || product.available_quantity === 0}
            >
              {product.available_quantity && product.available_quantity > 0 ? 'Comprar' : 'Sin stock'}
            </button>
          </div>
        </div>

        {/* Espaciado adicional para el botón flotante en móvil */}
        <div className="h-20 md:hidden"></div>
      </div>
    </div>
  );
};

export default ProductDetail;