// __tests__/hooks/useBackendHealth.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useBackendHealth } from '../../src/hooks/useBackendHealth';
import { apiFetch } from '../../src/utils/api';

vi.mock('../../src/utils/api');

describe('useBackendHealth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with checking state', () => {
        apiFetch.mockImplementation(() => new Promise(() => {}));
        
        const { result } = renderHook(() => useBackendHealth());
        
        expect(result.current.online).toBe(false);
        expect(result.current.statusLabel).toBe('Vérification...');
    });

    it('should detect online backend', async () => {
        apiFetch.mockResolvedValue({ ok: true });
        
        const { result } = renderHook(() => useBackendHealth());
        
        await waitFor(() => {
            expect(result.current.online).toBe(true);
            expect(result.current.statusLabel).toBe('En ligne');
        });
    });

    it('should detect offline backend on server error', async () => {
        apiFetch.mockResolvedValue({ ok: false });
        
        const { result } = renderHook(() => useBackendHealth());
        
        await waitFor(() => {
            expect(result.current.online).toBe(false);
            expect(result.current.statusLabel).toBe('Hors ligne (erreur serveur)');
        });
    });

    it('should detect offline backend on network error', async () => {
        apiFetch.mockRejectedValue(new Error('Network error'));
        
        const { result } = renderHook(() => useBackendHealth());
        
        await waitFor(() => {
            expect(result.current.online).toBe(false);
            expect(result.current.statusLabel).toBe('Hors ligne (serveur injoignable)');
        });
    });

    it('should respond to browser online event', async () => {
        apiFetch.mockResolvedValue({ ok: true });
        
        const { result } = renderHook(() => useBackendHealth());
        
        await waitFor(() => {
            expect(result.current.online).toBe(true);
        });
        
        // Simulate going offline
        apiFetch.mockRejectedValue(new Error('Network error'));
        window.dispatchEvent(new Event('offline'));
        
        await waitFor(() => {
            expect(result.current.online).toBe(false);
            expect(result.current.statusLabel).toBe('Hors ligne');
        });
    });

    it('should cleanup event listeners on unmount', () => {
        const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
        
        const { unmount } = renderHook(() => useBackendHealth());
        
        unmount();
        
        expect(removeEventListenerSpy).toHaveBeenCalledWith('online', expect.any(Function));
        expect(removeEventListenerSpy).toHaveBeenCalledWith('offline', expect.any(Function));
        
        removeEventListenerSpy.mockRestore();
    });
});