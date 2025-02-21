{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import axios from 'axios';
import ScoringConfigBP from '@/pages/scoringconfig/bp';

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(() => ({
        push: jest.fn(),
    })),
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Layout component
const MockLayout = ({ children }: { children: React.ReactNode }) => <div data-testid=\"layout-component\">{children}</div>;

// Mock the data fetching function
const mockSettingsData = [
    { id: '1', setting_key: 'systolic_range_1', setting_value: '120-130' },
    { id: '2', setting_key: 'diastolic_range_1', setting_value: '80-90' },
    { id: '3', setting_key: 'score_1', setting_value: '1' },
];


describe('ScoringConfigBP Component', () => {
    beforeEach(() => {
        mockedAxios.get.mockResolvedValue({
            data: mockSettingsData,
        });
        mockedAxios.post.mockResolvedValue({ data: { message: '保存成功' } });
    });

    it('レンダリング時に血圧スコアリングルール設定画面が表示されること', async () => {
        render(<MockLayout><ScoringConfigBP /></MockLayout>);
        await waitFor(() => {
            expect(screen.getByText('血圧スコアリングルール設定')).toBeInTheDocument();
        });
        expect(screen.getByTestId('layout-component')).toBeInTheDocument();
    });

    it('初期表示時に設定値がフォームに表示されること', async () => {
        render(<MockLayout><ScoringConfigBP /></MockLayout>);

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        });

        expect(screen.getByDisplayValue('120-130')).toBeInTheDocument();
        expect(screen.getByDisplayValue('80-90')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });

    it('保存ボタンをクリックすると、APIが呼ばれること', async () => {
        render(<MockLayout><ScoringConfigBP /></MockLayout>);
        await waitFor(() => {
          expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      });
        const saveButton = screen.getByRole('button', { name: '保存' });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });
    });

    it('フォームの値を変更して保存できること', async () => {
        render(<MockLayout><ScoringConfigBP /></MockLayout>);
        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        });

        const systolicInput = screen.getByDisplayValue('120-130');
        fireEvent.change(systolicInput, { target: { value: '130-140' } });

        const diastolicInput = screen.getByDisplayValue('80-90');
        fireEvent.change(diastolicInput, { target: { value: '90-100' } });

        const scoreInput = screen.getByDisplayValue('1');
        fireEvent.change(scoreInput, { target: { value: '2' } });

        const saveButton = screen.getByRole('button', { name: '保存' });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });

        // Check if the updated values are sent to the API
        expect(mockedAxios.post).toHaveBeenCalledWith(
            '/api/settings',
            expect.arrayContaining([
                expect.objectContaining({
                    setting_key: 'systolic_range_1',
                    setting_value: '130-140',
                }),
                expect.objectContaining({
                    setting_key: 'diastolic_range_1',
                    setting_value: '90-100',
                }),
                expect.objectContaining({
                    setting_key: 'score_1',
                    setting_value: '2',
                }),
            ])
        );
    });

    it('APIエラー時にエラーメッセージが表示されること', async () => {
        mockedAxios.post.mockRejectedValue(new Error('APIエラー'));
        render(<MockLayout><ScoringConfigBP /></MockLayout>);
        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        });
        const saveButton = screen.getByRole('button', { name: '保存' });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('APIエラー')).toBeInTheDocument();
        });
    });

    it('データ取得時にエラーが発生した場合、エラーメッセージが表示されること', async () => {
        mockedAxios.get.mockRejectedValue(new Error('データ取得エラー'));
        render(<MockLayout><ScoringConfigBP /></MockLayout>);

        await waitFor(() => {
            expect(screen.getByText('データ取得エラー')).toBeInTheDocument();
        });
    });
});"
}