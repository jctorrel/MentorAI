// tests/hooks/useChatSession.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useChatSession } from '../../src/hooks/useChatSession';
import { apiFetch } from '../../src/utils/api';
    
vi.mock('../../src/utils/api');

describe('useChatSession', () => {
    const mockEmail = 'test@example.com';
    const initialMessages = [
        { id: 1, sender: 'mentor', content: 'Hello' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with provided messages', () => {
        const { result } = renderHook(() => 
            useChatSession(mockEmail, initialMessages)
        );
        
        expect(result.current.messages).toEqual(initialMessages);
        expect(result.current.isTyping).toBe(false);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe('');
    });

    it('should add user message', () => {
        const { result } = renderHook(() => 
            useChatSession(mockEmail, initialMessages)
        );
        
        act(() => {
            result.current.addUserMessage('Test message');
        });
        
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[1].sender).toBe('user');
        expect(result.current.messages[1].content).toBe('Test message');
    });

    it('should add mentor message', () => {
        const { result } = renderHook(() => 
            useChatSession(mockEmail, initialMessages)
        );
        
        act(() => {
            result.current.addMentorMessage('Mentor response');
        });
        
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[1].sender).toBe('mentor');
        expect(result.current.messages[1].content).toBe('Mentor response');
    });

    it('should send message and receive response', async () => {
        apiFetch.mockResolvedValue({ mentorReply: 'Great question!' });
        
        const { result } = renderHook(() => 
            useChatSession(mockEmail, initialMessages)
        );
        
        await act(async () => {
            await result.current.sendMessage('Hello mentor');
        });
        
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[1].content).toBe('Great question!');
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isTyping).toBe(false);
        
        expect(apiFetch).toHaveBeenCalledWith('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                email: mockEmail,
                message: 'Hello mentor',
                programID: 'A1',
                mode: 'guided'
            }),
        });
    });

    it('should handle API errors gracefully', async () => {
        apiFetch.mockRejectedValue(new Error('Network error'));
        
        const { result } = renderHook(() => 
            useChatSession(mockEmail, initialMessages)
        );
        
        await act(async () => {
            await result.current.sendMessage('Test');
        });
        
        expect(result.current.error).toContain('Impossible de contacter le mentor');
        expect(result.current.messages).toHaveLength(2);
        expect(result.current.messages[1].content).toContain('Une erreur est survenue');
    });

    it('should handle missing mentorReply in response', async () => {
        apiFetch.mockResolvedValue({});
        
        const { result } = renderHook(() => 
            useChatSession(mockEmail, initialMessages)
        );
        
        await act(async () => {
            await result.current.sendMessage('Test');
        });
        
        expect(result.current.messages[1].content).toContain('Une erreur est survenue');
    });

    it('should not send empty messages', async () => {
        const { result } = renderHook(() => 
            useChatSession(mockEmail, initialMessages)
        );
        
        await act(async () => {
            await result.current.handleUserMessage('   ');
        });
        
        expect(result.current.messages).toHaveLength(1);
        expect(apiFetch).not.toHaveBeenCalled();
    });

    it('should not send while loading', async () => {
        apiFetch.mockImplementation(() => 
            new Promise(resolve => setTimeout(resolve, 100))
        );
        
        const { result } = renderHook(() => 
            useChatSession(mockEmail, initialMessages)
        );
        
        act(() => {
            result.current.handleUserMessage('First message');
        });
        
        // Try to send another message while loading
        await act(async () => {
            await result.current.handleUserMessage('Second message');
        });
        
        // Only one API call should have been made
        expect(apiFetch).toHaveBeenCalledTimes(1);
    });

    it('should set typing and loading states correctly', async () => {
        let resolvePromise;
        apiFetch.mockImplementation(() => 
            new Promise(resolve => { resolvePromise = resolve; })
        );
        
        const { result } = renderHook(() => 
            useChatSession(mockEmail, initialMessages)
        );
        
        act(() => {
            result.current.sendMessage('Test');
        });
        
        // Should be loading and typing
        await waitFor(() => {
            expect(result.current.isLoading).toBe(true);
            expect(result.current.isTyping).toBe(true);
        });
        
        // Resolve the promise
        await act(async () => {
            resolvePromise({ mentorReply: 'Response' });
            await new Promise(resolve => setTimeout(resolve, 0));
        });
        
        // Should no longer be loading or typing
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isTyping).toBe(false);
    });
});