{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import ExtractionSettings from '@/pages/ExtractionSettings';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock common components
const MockHeader = () => <div data-testid=\"header\">Header</div>;
const MockFooter = () => <div data-testid=\"footer\">Footer</div>;
const MockNavigationBar = () => <div data-testid=\"navigation-bar\">NavigationBar</div>;

// Mock API calls (fetch)
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({
            setting_key: 'extraction_percentage',
            setting_value: '75',
        }),
        ok: true,
    })
) as jest.Mock;


describe('ExtractionSettings Component', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it('画面が正常にレンダリングされること', async () => {
        render(
            <>
                <MockHeader />
                <MockNavigationBar />
                <ExtractionSettings />
                <MockFooter />
            </>
        );
        expect(screen.getByText('Header')).toBeInTheDocument();
        expect(screen.getByText('NavigationBar')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByLabelText('上位抽出割合:')).toBeInTheDocument();
        });
        expect(screen.getByText('Footer')).toBeInTheDocument();
    });

    it('初期データが正常にロードされること', async () => {
        render(
            <>
                <MockHeader />
                <MockNavigationBar />
                <ExtractionSettings />
                <MockFooter />
            </>
        );

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(1);
        });

        await waitFor(() => {
            expect(screen.getByDisplayValue('75')).toBeInTheDocument();
        });
    });

    it('フォームの入力値を変更できること', async () => {
        render(
            <>
                <MockHeader />
                <MockNavigationBar />
                <ExtractionSettings />
                <MockFooter />
            </>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('上位抽出割合:')).toBeInTheDocument();
        });

        const inputElement = screen.getByLabelText('上位抽出割合:');
        fireEvent.change(inputElement, { target: { value: '80' } });
        expect(inputElement.value).toBe('80');
    });

    it('保存ボタンをクリックしてAPIが呼び出されること', async () => {
        render(
            <>
                <MockHeader />
                <MockNavigationBar />
                <ExtractionSettings />
                <MockFooter />
            </>
        );

        await waitFor(() => {
            expect(screen.getByLabelText('上位抽出割合:')).toBeInTheDocument();
        });

        const inputElement = screen.getByLabelText('上位抽出割合:');
        fireEvent.change(inputElement, { target: { value: '90' } });

        const saveButton = screen.getByText('保存');
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: () => Promise.resolve({ message: '設定が保存されました' }),
            ok: true,
        });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledTimes(2);
        });
    });

    it('エラーが発生した場合にエラーメッセージが表示されること', async () => {
        render(
            <>
                <MockHeader />
                <MockNavigationBar />
                <ExtractionSettings />
                <MockFooter />
            </>
        );
        (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('APIエラー'));

        await waitFor(() => {
            expect(screen.getByLabelText('上位抽出割合:')).toBeInTheDocument();
        });

        const saveButton = screen.getByText('保存');

        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('APIエラー')).toBeInTheDocument();
        });
    });

    it('APIからエラーレスポンスが返された場合にエラーメッセージが表示されること', async () => {
        render(
            <>
                <MockHeader />
                <MockNavigationBar />
                <ExtractionSettings />
                <MockFooter />
            </>
        );

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: () => Promise.resolve({ message: '設定が保存されました' }),
            ok: false,
            status: 400,
            statusText: 'Bad Request',
        });

        await waitFor(() => {
            expect(screen.getByLabelText('上位抽出割合:')).toBeInTheDocument();
        });

        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('設定の保存に失敗しました')).toBeInTheDocument();
        });
    });

    it('APIから成功レスポンスが返された場合に成功メッセージが表示されること', async () => {
        render(
            <>
                <MockHeader />
                <MockNavigationBar />
                <ExtractionSettings />
                <MockFooter />
            </>
        );

        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: () => Promise.resolve({ message: '設定が保存されました' }),
            ok: true,
        });

        await waitFor(() => {
            expect(screen.getByLabelText('上位抽出割合:')).toBeInTheDocument();
        });

        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('設定が保存されました')).toBeInTheDocument();
        });
    });
});"
}