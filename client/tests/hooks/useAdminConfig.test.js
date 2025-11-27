// __tests__/hooks/useAdminConfig.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAdminConfig } from '../../src/hooks/useAdminConfig';
import { apiFetch } from '../../src/utils/api';

vi.mock('../../src/utils/api');

describe('useAdminConfig', () => {
    const initialConfig = {
        school_name: 'Test School',
        tone: 'professional',
        rules: 'Be nice',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('should initialize with provided config', () => {
        const { result } = renderHook(() => useAdminConfig(initialConfig));
        
        expect(result.current.config).toEqual(initialConfig);
        expect(result.current.saving).toBe(false);
        expect(result.current.saveMessage).toBe('');
        expect(result.current.error).toBe(null);
    });

    it('should update field correctly', () => {
        const { result } = renderHook(() => useAdminConfig(initialConfig));
        
        act(() => {
            result.current.updateField('school_name', 'New School');
        });
        
        expect(result.current.config.school_name).toBe('New School');
        expect(result.current.config.tone).toBe('professional'); // Others unchanged
    });

    it('should clear messages when updating field', () => {
        const { result } = renderHook(() => useAdminConfig(initialConfig));
        
        // Set some messages
        act(() => {
            result.current.saveConfig();
        });
        
        // Update a field
        act(() => {
            result.current.updateField('tone', 'friendly');
        });
        
        expect(result.current.saveMessage).toBe('');
        expect(result.current.error).toBe(null);
    });

    it('should save config successfully', async () => {
        const savedConfig = {
            school_name: 'Updated School',
            tone: 'friendly',
            rules: 'New rules',
        };
        
        apiFetch.mockResolvedValue(savedConfig);
        
        const { result } = renderHook(() => useAdminConfig(initialConfig));
        
        await act(async () => {
            await result.current.saveConfig();
        });
        
        expect(result.current.saving).toBe(false);
        expect(result.current.saveMessage).toBe('Configuration sauvegardée ✔');
        expect(result.current.error).toBe(null);
        expect(result.current.config).toEqual(savedConfig);
        
        expect(apiFetch).toHaveBeenCalledWith('/api/admin/config', {
            method: 'PUT',
            body: JSON.stringify(initialConfig),
        });
    });

    it('should handle save errors', async () => {
        apiFetch.mockRejectedValue(new Error('Save failed'));
        
        const { result } = renderHook(() => useAdminConfig(initialConfig));
        
        await act(async () => {
            await result.current.saveConfig();
        });
        
        expect(result.current.saving).toBe(false);
        expect(result.current.saveMessage).toBe('');
        expect(result.current.error).toBe('Save failed');
    });

    it('should auto-clear success message after 3 seconds', async () => {
        apiFetch.mockResolvedValue(initialConfig);
        
        const { result } = renderHook(() => useAdminConfig(initialConfig));
        
        await act(async () => {
            await result.current.saveConfig();
        });
        
        expect(result.current.saveMessage).toBe('Configuration sauvegardée ✔');
        
        // Fast-forward time
        act(() => {
            vi.advanceTimersByTime(3000);
        });
        
        expect(result.current.saveMessage).toBe('');
    });
});