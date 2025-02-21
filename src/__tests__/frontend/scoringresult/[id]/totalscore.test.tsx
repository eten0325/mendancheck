{
  "code": "import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TotalScorePage from '@/pages/scoringresult/[id]/totalscore';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Layout component
const MockLayout = ({ children }: { children: React.ReactNode }) => <div data-testid=\"layout\">{children}</div>;

// Component test
describe('TotalScorePage Component', () => {

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        });

        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn(),
        });
    });

    it('renders without crashing', () => {
        render(
            <MockLayout>
                <TotalScorePage />
            </MockLayout>
        );
        expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('fetches and displays health check results on mount', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                total_score: 90,
                bmi_score: 25,
                blood_pressure_score: 20,
                blood_sugar_score: 15,
                lipid_score: 10,
                liver_function_score: 20,
            },
        });

        render(
            <MockLayout>
                <TotalScorePage />
            </MockLayout>
        );

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(screen.getByText('総スコア: 90')).toBeInTheDocument();
            expect(screen.getByText('BMIスコア: 25')).toBeInTheDocument();
        });
    });

    it('displays error message when data fetching fails', async () => {
        mockedAxios.get.mockRejectedValue(new Error('Failed to fetch'));

        render(
            <MockLayout>
                <TotalScorePage />
            </MockLayout>
        );

        await waitFor(() => {
            expect(screen.getByText('データ取得に失敗しました。')).toBeInTheDocument();
        });
    });

    it('displays " 
     }