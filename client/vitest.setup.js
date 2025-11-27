// vitest.setup.js
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock localStorage
class LocalStorageMock {
  constructor() {
    this.store = {};  // Stockage en mémoire
  }

  getItem(key) {
    return this.store[key] || null;  // Retourne la valeur stockée
  }

  setItem(key, value) {
    this.store[key] = String(value);  // Stocke vraiment
  }

  clear() {
    this.store = {};  // Vide le stockage
  }

  removeItem(key) {
    delete this.store[key];  // Supprime la clé
  }
}

global.localStorage = new LocalStorageMock();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});