import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extender Vitest con matchers de testing-library
expect.extend(matchers)

// Limpiar después de cada test
afterEach(() => {
    cleanup()
})