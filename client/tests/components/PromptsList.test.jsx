// __tests__/components/PromptsList.test.js
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PromptsList from '../../src/components/admin/PromptsList';

describe('PromptsList', () => {
    const mockPrompts = [
        { key: 'system', label: 'System Prompt', content: 'Content 1' },
        { key: 'user', label: 'User Prompt', content: 'Content 2' },
        { key: 'assistant', label: '', content: 'Content 3' },
    ];

    it('should render prompts list', () => {
        const onSelect = vi.fn();
        
        render(
            <PromptsList
                prompts={mockPrompts}
                selectedKey="system"
                onSelect={onSelect}
            />
        );
        
        expect(screen.getByText('system')).toBeInTheDocument();
        expect(screen.getByText('System Prompt')).toBeInTheDocument();
        expect(screen.getByText('user')).toBeInTheDocument();
        expect(screen.getByText('assistant')).toBeInTheDocument();
    });

    it('should handle empty prompts', () => {
        render(
            <PromptsList
                prompts={[]}
                selectedKey={null}
                onSelect={vi.fn()}
            />
        );
        
        expect(screen.getByText('Aucun prompt trouvé.')).toBeInTheDocument();
    });

    it('should call onSelect when clicking a prompt', () => {
        const onSelect = vi.fn();
        
        render(
            <PromptsList
                prompts={mockPrompts}
                selectedKey="system"
                onSelect={onSelect}
            />
        );
        
        fireEvent.click(screen.getByText('user'));
        
        expect(onSelect).toHaveBeenCalledWith('user');
    });

    it('should highlight selected prompt', () => {
        render(
            <PromptsList
                prompts={mockPrompts}
                selectedKey="user"
                onSelect={vi.fn()}
            />
        );
        
        const userItem = screen.getByText('user').closest('li');
        expect(userItem).toHaveStyle({ backgroundColor: '#e0f2fe' });
    });

    it('should not render label if empty', () => {
        render(
            <PromptsList
                prompts={mockPrompts}
                selectedKey="assistant"
                onSelect={vi.fn()}
            />
        );
        
        // The assistant prompt has no label, so it shouldn't be rendered
        const assistantLabels = screen.queryAllByText('Assistant Prompt');
        expect(assistantLabels).toHaveLength(0);
    });
});
