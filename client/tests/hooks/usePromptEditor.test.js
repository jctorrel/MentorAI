// __tests__/hooks/usePromptEditor.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePromptEditor } from '../../src/hooks/usePromptEditor';
import { apiFetch } from '../../src/utils/api';

vi.mock('../../src/utils/api');
    
describe('usePromptEditor', () => {
    const mockPrompt = {
        key: 'system',
        label: 'System Prompt',
        type: 'system',
        content: 'You are a helpful assistant',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.runOnlyPendingTimers();
        vi.useRealTimers();
    });

    it('should initialize form with prompt data', () => {
        const { result } = renderHook(() => 
            usePromptEditor(mockPrompt, vi.fn())
        );
        
        expect(result.current.form).toEqual({
            key: 'system',
            label: 'System Prompt',
            type: 'system',
            content: 'You are a helpful assistant',
        });
        expect(result.current.saving).toBe(false);
        expect(result.current.saveMessage).toBe('');
        expect(result.current.error).toBe(null);
    });

    it('should update form when prompt changes', () => {
        const { result, rerender } = renderHook(
            ({ prompt }) => usePromptEditor(prompt, vi.fn()),
            { initialProps: { prompt: mockPrompt } }
        );
        
        const newPrompt = {
            key: 'user',
            label: 'User Prompt',
            type: 'user',
            content: 'Different content',
        };
        
        rerender({ prompt: newPrompt });
        
        expect(result.current.form.key).toBe('user');
        expect(result.current.form.content).toBe('Different content');
    });

    it('should update field correctly', () => {
        const { result } = renderHook(() => 
            usePromptEditor(mockPrompt, vi.fn())
        );
        
        act(() => {
            result.current.updateField('content', 'New content');
        });
        
        expect(result.current.form.content).toBe('New content');
        expect(result.current.form.key).toBe('system'); // Other fields unchanged
    });

    it('should clear messages when updating field', () => {
        const { result } = renderHook(() => 
            usePromptEditor(mockPrompt, vi.fn())
        );
        
        // Set some messages first
        act(() => {
            result.current.save();
        });
        
        // Update a field
        act(() => {
            result.current.updateField('label', 'New label');
        });
        
        expect(result.current.saveMessage).toBe('');
        expect(result.current.error).toBe(null);
    });

    it('should validate empty key', async () => {
        const emptyKeyPrompt = { ...mockPrompt, key: '' };
        const { result } = renderHook(() => 
            usePromptEditor(emptyKeyPrompt, vi.fn())
        );
        
        await act(async () => {
            await result.current.save();
        });
        
        expect(result.current.error).toBe('Aucune clé de prompt sélectionnée.');
        expect(apiFetch).not.toHaveBeenCalled();
    });

    it('should validate empty content', async () => {
        const emptyContentPrompt = { ...mockPrompt, content: '' };
        const { result } = renderHook(() => 
            usePromptEditor(emptyContentPrompt, vi.fn())
        );
        
        await act(async () => {
            await result.current.save();
        });
        
        expect(result.current.error).toBe(
            'Le contenu du prompt ne peut pas être vide.'
        );
        expect(apiFetch).not.toHaveBeenCalled();
    });

    it('should validate whitespace-only content', async () => {
        const { result } = renderHook(() => 
            usePromptEditor(mockPrompt, vi.fn())
        );
        
        act(() => {
            result.current.updateField('content', '   ');
        });
        
        await act(async () => {
            await result.current.save();
        });
        
        expect(result.current.error).toBe(
            'Le contenu du prompt ne peut pas être vide.'
        );
    });

    it('should save successfully', async () => {
        const savedPrompt = { ...mockPrompt, content: 'Updated content' };
        apiFetch.mockResolvedValue(savedPrompt);
        
        const onSave = vi.fn();
        const { result } = renderHook(() => 
            usePromptEditor(mockPrompt, onSave)
        );
        
        await act(async () => {
            await result.current.save();
        });
        
        expect(result.current.saving).toBe(false);
        expect(result.current.saveMessage).toBe('Prompt sauvegardé ✔');
        expect(result.current.error).toBe(null);
        expect(onSave).toHaveBeenCalledWith(savedPrompt);
        
        expect(apiFetch).toHaveBeenCalledWith(
            '/api/admin/prompts/system',
            {
                method: 'PUT',
                body: JSON.stringify({
                    content: mockPrompt.content,
                    label: mockPrompt.label,
                    type: mockPrompt.type,
                }),
            }
        );
    });

    it('should handle save errors', async () => {
        apiFetch.mockRejectedValue(new Error('Save failed'));
        
        const { result } = renderHook(() => 
            usePromptEditor(mockPrompt, vi.fn())
        );
        
        await act(async () => {
            await result.current.save();
        });
        
        expect(result.current.saving).toBe(false);
        expect(result.current.error).toBe('Save failed');
        expect(result.current.saveMessage).toBe('');
    });

    it('should auto-clear success message after 3 seconds', async () => {
        apiFetch.mockResolvedValue(mockPrompt);
        
        const { result } = renderHook(() => 
            usePromptEditor(mockPrompt, vi.fn())
        );
        
        await act(async () => {
            await result.current.save();
        });
        
        expect(result.current.saveMessage).toBe('Prompt sauvegardé ✔');
        
        act(() => {
            vi.advanceTimersByTime(3000);
        });
        
        expect(result.current.saveMessage).toBe('');
    });

    it('should omit undefined fields from API call', async () => {
        const minimalPrompt = {
            key: 'test',
            label: '',
            type: '',
            content: 'Test content',
        };
        
        apiFetch.mockResolvedValue(minimalPrompt);
        
        const { result } = renderHook(() => 
            usePromptEditor(minimalPrompt, vi.fn())
        );
        
        await act(async () => {
            await result.current.save();
        });
        
        const callBody = JSON.parse(apiFetch.mock.calls[0][1].body);
        expect(callBody).toEqual({
            content: 'Test content',
            label: undefined,
            type: undefined,
        });
    });
});