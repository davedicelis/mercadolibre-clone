import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import ProductDetail from '../src/components/ProductDetail'
import { productApi } from '../src/services/api'

// Mock del servicio API
vi.mock('../src/services/api', () => ({
  productApi: {
    getProduct: vi.fn(),
    getRelatedProducts: vi.fn()
  }
}))

const mockProduct = {
  id: 'test-product',
  title: 'Test Samsung Galaxy',
  price: 439.00,
  currency: 'USD',
  condition: 'Nuevo',
  available_quantity: 25,
  sold_quantity: 847,
  rating: 4.5,
  reviews_count: 892,
  images: [
    {
      id: 'img1',
      url: 'https://example.com/image1.jpg',
      alt: 'Test image'
    }
  ],
  description: 'Test description',
  features: [
    { name: 'RAM', value: '8 GB' },
    { name: 'Storage', value: '256 GB' }
  ],
  payment_methods: [
    {
      type: 'credit_card',
      name: 'Tarjeta de crédito',
      logo: '💳',
      installments: 12
    }
  ],
  seller: {
    id: 'test-seller',
    name: 'Test Seller',
    reputation: 'Platino',
    rating: 4.8,
    sales_count: 1500,
    location: 'Test City',
    is_mercado_lider: true
  },
  shipping: {
    free: true,
    type: 'Envío gratis',
    estimated_days: '2-4 días hábiles'
  }
}

const mockRelatedProducts = [
  {
    id: 'related-1',
    title: 'Related Product 1',
    price: 350.00,
    currency: 'USD',
    thumbnail: 'https://example.com/thumb1.jpg',
    rating: 4.2,
    reviews_count: 156,
    seller_name: 'Test Seller'
  }
]

describe('ProductDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state initially', () => {
    productApi.getProduct.mockImplementation(() => new Promise(() => {}))
    productApi.getRelatedProducts.mockImplementation(() => new Promise(() => {}))

    render(<ProductDetail />)
    
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('renders product details when data is loaded', async () => {
    productApi.getProduct.mockResolvedValue(mockProduct)
    productApi.getRelatedProducts.mockResolvedValue(mockRelatedProducts)

    render(<ProductDetail />)

    await waitFor(() => {
      expect(screen.getByText('Test Samsung Galaxy')).toBeInTheDocument()
    })

    expect(screen.getByText('$439.00')).toBeInTheDocument()
    expect(screen.getByText('Nuevo')).toBeInTheDocument()
    expect(screen.getByText('Test Seller')).toBeInTheDocument()
  })

  it('renders error state when API fails', async () => {
    productApi.getProduct.mockRejectedValue(new Error('API Error'))
    productApi.getRelatedProducts.mockRejectedValue(new Error('API Error'))

    render(<ProductDetail />)

    await waitFor(() => {
      expect(screen.getByText('Oops! Algo salió mal')).toBeInTheDocument()
    })

    expect(screen.getByText('API Error')).toBeInTheDocument()
    expect(screen.getByText('Intentar nuevamente')).toBeInTheDocument()
  })

  it('displays product images correctly', async () => {
    productApi.getProduct.mockResolvedValue(mockProduct)
    productApi.getRelatedProducts.mockResolvedValue(mockRelatedProducts)

    render(<ProductDetail />)

    await waitFor(() => {
      const image = screen.getByAltText('Test image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg')
    })
  })

  it('shows payment methods', async () => {
    productApi.getProduct.mockResolvedValue(mockProduct)
    productApi.getRelatedProducts.mockResolvedValue(mockRelatedProducts)

    render(<ProductDetail />)

    await waitFor(() => {
      expect(screen.getByText('Medios de pago')).toBeInTheDocument()
      expect(screen.getByText('Tarjeta de crédito')).toBeInTheDocument()
    })
  })

  it('displays seller information', async () => {
    productApi.getProduct.mockResolvedValue(mockProduct)
    productApi.getRelatedProducts.mockResolvedValue(mockRelatedProducts)

    render(<ProductDetail />)

    await waitFor(() => {
      expect(screen.getByText('Información del vendedor')).toBeInTheDocument()
      expect(screen.getByText('Test Seller')).toBeInTheDocument()
      expect(screen.getByText('Platino')).toBeInTheDocument()
      expect(screen.getByText('MercadoLíder')).toBeInTheDocument()
    })
  })

  it('shows product features', async () => {
    productApi.getProduct.mockResolvedValue(mockProduct)
    productApi.getRelatedProducts.mockResolvedValue(mockRelatedProducts)

    render(<ProductDetail />)

    await waitFor(() => {
      expect(screen.getByText('RAM:')).toBeInTheDocument()
      expect(screen.getByText('8 GB')).toBeInTheDocument()
      expect(screen.getByText('Storage:')).toBeInTheDocument()
      expect(screen.getByText('256 GB')).toBeInTheDocument()
    })
  })

  it('displays related products', async () => {
    productApi.getProduct.mockResolvedValue(mockProduct)
    productApi.getRelatedProducts.mockResolvedValue(mockRelatedProducts)

    render(<ProductDetail />)

    await waitFor(() => {
      expect(screen.getByText('Productos que te pueden interesar')).toBeInTheDocument()
      expect(screen.getByText('Related Product 1')).toBeInTheDocument()
    })
  })

  it('handles out of stock products', async () => {
    const outOfStockProduct = { ...mockProduct, available_quantity: 0 }
    productApi.getProduct.mockResolvedValue(outOfStockProduct)
    productApi.getRelatedProducts.mockResolvedValue(mockRelatedProducts)

    render(<ProductDetail />)

    await waitFor(() => {
      expect(screen.getAllByText('Sin stock')).toHaveLength(2) // Botones desktop y mobile
    })
  })

  it('shows discount information when available', async () => {
    const discountProduct = {
      ...mockProduct,
      original_price: 519.00,
      discount_percentage: 15
    }
    productApi.getProduct.mockResolvedValue(discountProduct)
    productApi.getRelatedProducts.mockResolvedValue(mockRelatedProducts)

    render(<ProductDetail />)

    await waitFor(() => {
      expect(screen.getByText('$519.00')).toBeInTheDocument()
      expect(screen.getByText('15% OFF')).toBeInTheDocument()
    })
  })

  it('displays shipping information', async () => {
    productApi.getProduct.mockResolvedValue(mockProduct)
    productApi.getRelatedProducts.mockResolvedValue(mockRelatedProducts)

    render(<ProductDetail />)

    await waitFor(() => {
      expect(screen.getByText('🚚 Envío gratis')).toBeInTheDocument()
      expect(screen.getByText('Llegada estimada: 2-4 días hábiles')).toBeInTheDocument()
    })
  })
})