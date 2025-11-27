// __tests__/hooks/usePrompts.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { usePrompts } from '../../src/hooks/usePrompts';
import { apiFetch } from '../../src/utils/api';

vi.mock('../../src/utils/api');

describe('usePrompts', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with loading state', () => {
        apiFetch.mockImplementation(() => new Promise(() => {}));
        
        const { result } = renderHook(() => usePrompts());
        
        expect(result.current.loading).toBe(true);
        expect(result.current.prompts).toEqual([]);
        expect(result.current.selectedPrompt).toBe(null);
        expect(result.current.error).toBe(null);
    });

    it('should load prompts and select first by default', async () => {
        const mockPrompts = [
            { key: 'system', label: 'System Prompt', content: 'You are a mentor' },
            { key: 'user', label: 'User Prompt', content: 'Help me' },
        ];
        
        apiFetch.mockResolvedValue(mockPrompts);
        
        const { result } = renderHook(() => usePrompts());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        expect(result.current.prompts).toEqual(mockPrompts);
        expect(result.current.selectedPrompt).toEqual(mockPrompts[0]);
        expect(result.current.error).toBe(null);
    });

    it('should handle empty prompts list', async () => {
        apiFetch.mockResolvedValue([]);
        
        const { result } = renderHook(() => usePrompts());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        expect(result.current.prompts).toEqual([]);
        expect(result.current.selectedPrompt).toBe(null);
    });

    it('should handle API errors', async () => {
        apiFetch.mockRejectedValue(new Error('Network error'));
        
        const { result } = renderHook(() => usePrompts());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        expect(result.current.prompts).toEqual([]);
        expect(result.current.error).toBe('Network error');
        expect(result.current.selectedPrompt).toBe(null);
    });

    it('should select prompt by key', async () => {
        const mockPrompts = [
            { key: 'system', label: 'System', content: 'Content 1' },
            { key: 'user', label: 'User', content: 'Content 2' },
            { key: 'assistant', label: 'Assistant', content: 'Content 3' },
        ];
        
        apiFetch.mockResolvedValue(mockPrompts);
        
        const { result } = renderHook(() => usePrompts());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        // Initially selects first
        expect(result.current.selectedPrompt.key).toBe('system');
        
        // Select different prompt
        act(() => {
            result.current.selectPrompt('assistant');
        });
        
        expect(result.current.selectedPrompt).toEqual(mockPrompts[2]);
    });

    it('should handle selecting non-existent key', async () => {
        const mockPrompts = [
            { key: 'system', label: 'System', content: 'Content' },
        ];
        
        apiFetch.mockResolvedValue(mockPrompts);
        
        const { result } = renderHook(() => usePrompts());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        const previousSelection = result.current.selectedPrompt;
        
        act(() => {
            result.current.selectPrompt('non-existent');
        });
        
        // Selection should not change
        expect(result.current.selectedPrompt).toEqual(previousSelection);
    });

    it('should update prompt in list', async () => {
        const mockPrompts = [
            { key: 'system', label: 'System', content: 'Original content' },
            { key: 'user', label: 'User', content: 'User content' },
        ];
        
        apiFetch.mockResolvedValue(mockPrompts);
        
        const { result } = renderHook(() => usePrompts());
        
        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });
        
        const updatedPrompt = {
            key: 'system',
            label: 'Updated System',
            content: 'Updated content',
        };
        
        act(() => {
            result.current.updatePrompt(updatedPrompt);
        });
        
        expect(result.current.prompts[0]).toEqual(updatedPrompt);
        expect(result.current.selectedPrompt).toEqual(updatedPrompt);
    });

    it('should cleanup on unmount', async () => {
        apiFetch.mockImplementation(() => 
            new Promise(resolve => setTimeout(() => resolve([]), 100))
        );
        
        const { unmount, result } = renderHook(() => usePrompts());
        
        unmount();
        
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Should still be in loading state (not updated after unmount)
        expect(result.current.loading).toBe(true);
    });
});