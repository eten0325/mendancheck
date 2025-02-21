{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import LogSearchForm from '@/pages/components/LogSearchForm';

// モック useRouter
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// モック fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([]), // 初期値として空の配列を返す
        ok: true,
        status: 200,
        headers: {
            get: () => 'application/json',
        },
    })
) as jest.Mock;

describe('LogSearchFormコンポーネント', () => {
    beforeEach(() => {
        (global.fetch as jest.Mock).mockClear();
    });

    it('コンポーネントが正しくレンダリングされること', () => {
        render(<LogSearchForm />);
        expect(screen.getByText('ログレベル:')).toBeInTheDocument();
        expect(screen.getByText('メッセージ:')).toBeInTheDocument();
        expect(screen.getByText('検索')).toBeInTheDocument();
    });

    it('日付が変更されたときにstateが更新されること', () => {
        render(<LogSearchForm />);
        const startDateInput = screen.getByLabelText('開始日:');
        const endDateInput = screen.getByLabelText('終了日:');

        fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
        fireEvent.change(endDateInput, { target: { value: '2024-01-02' } });

        expect(startDateInput).toHaveValue('2024-01-01');
        expect(endDateInput).toHaveValue('2024-01-02');
    });

    it('ログレベルが変更されたときにstateが更新されること', () => {
        render(<LogSearchForm />);
        const logLevelSelect = screen.getByLabelText('ログレベル:');

        fireEvent.change(logLevelSelect, { target: { value: 'ERROR' } });

        expect(logLevelSelect).toHaveValue('ERROR');
    });

    it('メッセージが変更されたときにstateが更新されること', () => {
        render(<LogSearchForm />);
        const messageInput = screen.getByLabelText('メッセージ:');

        fireEvent.change(messageInput, { target: { value: 'テストメッセージ' } });

        expect(messageInput).toHaveValue('テストメッセージ');
    });

    it('検索ボタンがクリックされたときにfetchが呼ばれること', async () => {
        render(<LogSearchForm />);
        const searchButton = screen.getByText('検索');
        fireEvent.click(searchButton);

        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('検索ボタンがクリックされたときに、指定されたURLにfetchが呼ばれること', async () => {
        render(<LogSearchForm />);
        const startDateInput = screen.getByLabelText('開始日:');
        const endDateInput = screen.getByLabelText('終了日:');
        const logLevelSelect = screen.getByLabelText('ログレベル:');
        const messageInput = screen.getByLabelText('メッセージ:');
        const searchButton = screen.getByText('検索');

        fireEvent.change(startDateInput, { target: { value: '2024-01-01' } });
        fireEvent.change(endDateInput, { target: { value: '2024-01-02' } });
        fireEvent.change(logLevelSelect, { target: { value: 'ERROR' } });
        fireEvent.change(messageInput, { target: { value: 'テストメッセージ' } });

        fireEvent.click(searchButton);

        // URLSearchParamsを使い、URLを生成して比較
        const expectedParams = new URLSearchParams({
            startDate: '2024-01-01',
            endDate: '2024-01-02',
            logLevel: 'ERROR',
            message: 'テストメッセージ',
        }).toString();

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(`?${expectedParams}`), expect.any(Object));
    });

    it('検索結果がない場合にメッセージが表示されること', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve([]), // 空の配列を返す
                ok: true,
                status: 200,
                headers: {
                    get: () => 'application/json',
                },
            })
        );

        render(<LogSearchForm />);
        const searchButton = screen.getByText('検索');
        fireEvent.click(searchButton);

        // setTimeoutで非同期処理を待つ
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(screen.getByText('ログが見つかりませんでした。')).toBeInTheDocument();
    });

    it('エラーが発生した場合にエラーメッセージが表示されること', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.reject(new Error('APIエラー'))
        );

        render(<LogSearchForm />);
        const searchButton = screen.getByText('検索');
        fireEvent.click(searchButton);

        // setTimeoutで非同期処理を待つ
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(screen.getByText('エラーが発生しました: APIエラー')).toBeInTheDocument();
    });

    it('APIがエラーレスポンスを返した場合にエラーメッセージが表示されること', async () => {
        (global.fetch as jest.Mock).mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({ message: 'APIからのエラー' }),
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                headers: {
                    get: () => 'application/json',
                },
            })
        );

        render(<LogSearchForm />);
        const searchButton = screen.getByText('検索');
        fireEvent.click(searchButton);

        // setTimeoutで非同期処理を待つ
        await new Promise((resolve) => setTimeout(resolve, 0));

        expect(screen.getByText('エラーが発生しました: APIからのエラー')).toBeInTheDocument();
    });
});"
}