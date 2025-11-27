// __tests__/hooks/useAdminAuth.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAdminAuth } from '../../src/hooks/useAdminAuth';
import { apiFetch } from '../../src/utils/api';

vi.mock('../../src/utils/api');

describe('useAdminAuth', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with loading state', () => {
        apiFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
        
        const { result } = renderHook(() => useAdminAuth());
        
        expect(result.current.loading).toBe(true);
        expect(result.current.isAdmin).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should load config successfully and set isAdmin to true', async () => {
        const mockConfig = {
            school_name: 'Test School',
            tone: 'professional',
            rules: 'Be nice',
        };
        
        apiFetch.mockResolvedValue(mockConfig);
        
        const { result } = renderHook(() => useAdminAuth());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        expect(result.current.isAdmin).toBe(true);
        expect(result.current.error).toBe(null);
        expect(result.current.config).toEqual(mockConfig);
    });

    it('should handle authorization errors', async () => {
        apiFetch.mockRejectedValue(new Error('not_authorized'));
        
        const { result } = renderHook(() => useAdminAuth());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        expect(result.current.isAdmin).toBe(false);
        expect(result.current.error).toBe('not_authorized');
    });

    it('should handle generic errors', async () => {
        apiFetch.mockRejectedValue(new Error('Network error'));
        
        const { result } = renderHook(() => useAdminAuth());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        expect(result.current.isAdmin).toBe(false);
        expect(result.current.error).toBe('Network error');
    });

    it('should cleanup on unmount', async () => {
        const mockConfig = {
            school_name: 'Test School',
            tone: 'professional',
            rules: 'Be nice',
        };
        
        // Delay the API response
        apiFetch.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve(mockConfig), 100))
        );
        
        const { unmount, result } = renderHook(() => useAdminAuth());
        
        // Unmount before API resolves
        unmount();
        
        // Wait a bit to ensure cleanup worked
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // State should not have been updated after unmount
        expect(result.current.loading).toBe(true);
    });
});
