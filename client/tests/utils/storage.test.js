// __tests__/utils/storage.test.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getCurrentUser, getCurrentUserEmail } from '../../src/utils/storage';

describe('storage utils', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    describe('getCurrentUser', () => {
        it('should return user object when valid data exists', () => {
            const mockUser = { email: 'test@example.com', name: 'Test User' };
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            const user = getCurrentUser();
            
            expect(user).toEqual(mockUser);
        });

        it('should return null when no data exists', () => {
            const user = getCurrentUser();
            
            expect(user).toBe(null);
        });

        it('should return null when JSON is invalid', () => {
            localStorage.setItem('user', 'invalid json{');
            
            const user = getCurrentUser();
            
            expect(user).toBe(null);
        });

        it('should log error when JSON parsing fails', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            localStorage.setItem('user', 'invalid json{');
            
            getCurrentUser();
            
            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });
    });

    describe('getCurrentUserEmail', () => {
        it('should return email when user exists', () => {
            const mockUser = { email: 'test@example.com', name: 'Test User' };
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            const email = getCurrentUserEmail();
            
            expect(email).toBe('test@example.com');
        });

        it('should return empty string when user has no email', () => {
            const mockUser = { name: 'Test User' };
            localStorage.setItem('user', JSON.stringify(mockUser));
            
            const email = getCurrentUserEmail();
            
            expect(email).toBe('');
        });

        it('should return empty string when no user exists', () => {
            const email = getCurrentUserEmail();
            
            expect(email).toBe('');
        });
    });
});
