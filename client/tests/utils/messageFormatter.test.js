// tests/utils/messageFormatter.test.js
import { describe, it, expect } from 'vitest';
import { buildInitMessage, createMessage, getDefaultErrorMessage } from '../../src/utils/messageFormatter';

describe('messageFormatter', () => {
    describe('buildInitMessage', () => {
        it('should return default message for empty array', () => {
            const result = buildInitMessage([]);
            expect(result).toContain('Sur quoi souhaites-tu travailler aujourd\'hui');
        });

        it('should return default message for null', () => {
            const result = buildInitMessage(null);
            expect(result).toContain('Sur quoi souhaites-tu travailler aujourd\'hui');
        });

        it('should format single module correctly', () => {
            const modules = [
                { label: 'React Basics', end_month: 6, content: ['Hooks', 'Components'] }
            ];
            
            const result = buildInitMessage(modules);
            
            expect(result).toContain('React Basics');
            expect(result).toContain('juin');
            expect(result).toContain('Hooks, Components');
        });

        it('should format multiple modules', () => {
            const modules = [
                { label: 'Module 1', end_month: 3, content: ['Topic A'] },
                { label: 'Module 2', end_month: 9, content: ['Topic B'] }
            ];
            
            const result = buildInitMessage(modules);
            
            expect(result).toContain('Module 1');
            expect(result).toContain('mars');
            expect(result).toContain('Module 2');
            expect(result).toContain('septembre');
        });

        it('should handle missing label', () => {
            const modules = [
                { end_month: 6, content: ['Test'] }
            ];
            
            const result = buildInitMessage(modules);
            
            expect(result).toContain('Module sans nom');
        });

        it('should handle missing content', () => {
            const modules = [
                { label: 'Test Module', end_month: 6 }
            ];
            
            const result = buildInitMessage(modules);
            
            expect(result).toContain('Test Module');
        });

        it('should handle invalid month', () => {
            const modules = [
                { label: 'Test', end_month: 99, content: [] }
            ];
            
            const result = buildInitMessage(modules);
            
            expect(result).toContain('une date inconnue');
        });
    });

    describe('createMessage', () => {
        it('should create message with correct structure', () => {
            const message = createMessage(1, 'user', 'Hello');
            
            expect(message).toEqual({
                id: 1,
                sender: 'user',
                content: 'Hello'
            });
        });

        it('should create mentor message', () => {
            const message = createMessage(2, 'mentor', 'Hi there');
            
            expect(message.sender).toBe('mentor');
            expect(message.content).toBe('Hi there');
        });
    });

    describe('getDefaultErrorMessage', () => {
        it('should return error message', () => {
            const message = getDefaultErrorMessage();
            expect(message).toContain('Une erreur est survenue');
        });
    });
});