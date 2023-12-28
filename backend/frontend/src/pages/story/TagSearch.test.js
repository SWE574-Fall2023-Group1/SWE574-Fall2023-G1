import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TagSearch from './TagSearch';

jest.mock('axios');

const mockOnTagSelect = jest.fn();

describe('TagSearch Component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: { tags: [{ label: 'Sample Tag', id: 'tag1', description: 'Description for Sample Tag' }] } });
    });

    it('renders without crashing', () => {
        render(<TagSearch onTagSelect={mockOnTagSelect} currentTheme="light" />);
    });

    it('handles input changes and suggestions', async () => {
        render(<TagSearch onTagSelect={mockOnTagSelect} currentTheme="light" />);
        const searchInput = screen.getByLabelText('Search tags');
        fireEvent.change(searchInput, { target: { value: 'Sa' } });
        expect(axios.get).not.toHaveBeenCalled();
        fireEvent.change(searchInput, { target: { value: 'Sample' } });
        await waitFor(() => expect(axios.get).toHaveBeenCalled());
    });

    it('adds a tag when button is clicked', async () => {
        render(<TagSearch onTagSelect={mockOnTagSelect} currentTheme="light" />);

        const searchInput = screen.getByLabelText('Search tags');
        const labelInput = screen.getByLabelText('Label');
        const addButton = screen.getByText('Add Tag');

        fireEvent.change(searchInput, { target: { value: 'Sample' } });
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        const option = await screen.findByText('Sample Tag');
        fireEvent.click(option);

        fireEvent.change(labelInput, { target: { value: 'User Label' } });

        fireEvent.click(addButton);

        await waitFor(() => expect(mockOnTagSelect).toHaveBeenCalledWith({
            name: 'Sample Tag',
            label: 'User Label',
            wikidata_id: 'tag1',
            description: 'Description for Sample Tag',
            id: 'tag1'
        }));
    });
});
