import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import TagSearch from './TagSearch'; // Adjust the import path as necessary

// Mocking axios
jest.mock('axios');

// Mocking the onTagSelect prop
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

        // Simulate user input for search
        fireEvent.change(searchInput, { target: { value: 'Sample' } });
        await waitFor(() => expect(axios.get).toHaveBeenCalled());

        // Simulate selection from autocomplete
        const option = await screen.findByText('Sample Tag'); // Assuming this is the text of the option
        fireEvent.click(option);

        // Simulate user input for label
        fireEvent.change(labelInput, { target: { value: 'User Label' } });

        // Click the "Add Tag" button
        fireEvent.click(addButton);

        // Wait for the async operations to complete
        await waitFor(() => expect(mockOnTagSelect).toHaveBeenCalledWith({
            name: 'Sample Tag',
            label: 'User Label',
            wikidata_id: 'tag1',
            description: 'Description for Sample Tag',
            id: 'tag1' // Add the additional expected properties
        }));
    });



});
