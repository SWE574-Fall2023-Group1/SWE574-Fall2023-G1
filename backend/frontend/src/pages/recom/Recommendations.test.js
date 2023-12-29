import React from 'react';
import { render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Recommendations from './Recommendations';

jest.mock('axios');

describe('Recommendations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading while recommendations page is being loaded', async () => {
        render(
            <MemoryRouter>
                <Recommendations/>
            </MemoryRouter>
        );
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });
});
