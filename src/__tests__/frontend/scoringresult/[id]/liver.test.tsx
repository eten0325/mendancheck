{
  "code": "import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

import Liver from '@/pages/scoringresult/[id]/liver';

// Mock the useRouter hook
jest.mock('next/router', () => ({
    useRouter: jest.fn().mockReturnValue({
        query: { id: '123' },
    }),
}));

// Mock the Layout component
jest.mock('@/components/Layout', () => {
    return ({ children }: { children: React.ReactNode }) => <div data-testid=\"layout-mock\">{children}</div>;
});

const mockHealthCheckResults = [
    {
        id: '1',
        user_id: 'user1',
        bmi: 22.5,
        systolic_blood_pressure: 120,
        diastolic_blood_pressure: 80,
        blood_sugar: 90,
        hba1c: 5.5,
        ldl_cholesterol: 120,
        tg: 150,
        ast: 25,
        alt: 30,
        gamma_gtp: 40,
        bmi_score: 80,
        blood_pressure_score: 90,
        blood_sugar_score: 85,
        lipid_score: 75,
        liver_function_score: 95,
        total_score: 425,
        bmi_evaluation: 'A',
        blood_pressure_evaluation: 'B',
        blood_sugar_evaluation: 'A',
        lipid_evaluation: 'C',
        liver_function_evaluation: 'A',
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z',
    },
];

// Mock the fetch function
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockHealthCheckResults),
        ok: true,
    })
) as jest.Mock;

describe('Liver Component', () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it('画面が正しくレンダリングされること', async () => {
        render(<Liver />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByTestId('layout-mock')).toBeInTheDocument();

        expect(screen.getByText('AST')).toBeInTheDocument();
        expect(screen.getByText('ALT')).toBeInTheDocument();
        expect(screen.getByText('γGTP')).toBeInTheDocument();

        expect(screen.getByText(mockHealthCheckResults[0].ast.toString())).toBeInTheDocument();
        expect(screen.getByText(mockHealthCheckResults[0].alt.toString())).toBeInTheDocument();
        expect(screen.getByText(mockHealthCheckResults[0].gamma_gtp.toString())).toBeInTheDocument();

    });

    it('データ取得が失敗した場合のエラーメッセージが表示されること', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            })
        );

        render(<Liver />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('肝機能評価情報の取得に失敗しました。')).toBeInTheDocument();
    });

    it('データが空の場合にメッセージが表示されること', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
                ok: true,
            })
        );

        render(<Liver />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('肝機能評価情報はありません。')).toBeInTheDocument();
    });

    it('リトライボタンが動作すること', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                statusText: 'Internal Server Error',
            })
        );

        render(<Liver />);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText('肝機能評価情報の取得に失敗しました。')).toBeInTheDocument();

        (global.fetch as jest.Mock).mockClear();
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockHealthCheckResults),
                ok: true,
            })
        );

        const retryButton = screen.getByRole('button', { name: 'リトライ' });
        fireEvent.click(retryButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByText(mockHealthCheckResults[0].ast.toString())).toBeInTheDocument();
    });
});"
}