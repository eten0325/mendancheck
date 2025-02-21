{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
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

// Define the component to be tested
const Config = () => {
    const [extractionRate, setExtractionRate] = React.useState('');
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/settings', {
                setting_key: 'extraction_rate',
                setting_value: extractionRate,
            });
            if (response.status === 200) {
                router.push('/main');
            }
        } catch (error) {
            console.error('設定保存エラー:', error);
        }
    };

    return (
        <div>
            <h1>上位抽出割合設定</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor=\"extractionRate\">割合 (%):</label>
                <input
                    type=\"number\"
                    id=\"extractionRate\"
                    value={extractionRate}
                    onChange={(e) => setExtractionRate(e.target.value)}
                />
                <button type=\"submit\">保存</button>
            </form>
        </div>
    );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <header>ヘッダー</header>
            <main>{children}</main>
            <footer>フッター</footer>
        </div>
    );
};

// Test the Config component
describe('Config Component', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: jest.fn(),
        });
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn(),
        });
        mockedAxios.post.mockResolvedValue({ status: 200 });
    });

    it('抽出割合の入力フィールドと保存ボタンが表示されること', () => {
        render(<Layout><Config /></Layout>);
        expect(screen.getByLabelText('割合 (%):')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    });

    it('抽出割合が入力フィールドで変更できること', () => {
        render(<Layout><Config /></Layout>);
        const inputElement = screen.getByLabelText('割合 (%):') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: '20' } });
        expect(inputElement.value).toBe('20');
    });

    it('フォームが送信されたときに、axios.postが正しいパラメータで呼ばれること', async () => {
        render(<Layout><Config /></Layout>);
        const inputElement = screen.getByLabelText('割合 (%):') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: '20' } });
        const saveButton = screen.getByRole('button', { name: '保存' });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/settings',
                {
                    setting_key: 'extraction_rate',
                    setting_value: '20',
                }
            );
        });
    });

    it('フォーム送信成功時にルーターがpushされること', async () => {
        const pushMock = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
        });
        render(<Layout><Config /></Layout>);
        const inputElement = screen.getByLabelText('割合 (%):') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: '20' } });
        const saveButton = screen.getByRole('button', { name: '保存' });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/main');
        });
    });

    it('APIリクエストが失敗した場合、コンソールにエラーが記録されること', async () => {
        const consoleErrorSpy = jest.spyOn(console, 'error');
        mockedAxios.post.mockRejectedValue(new Error('APIエラー'));
        render(<Layout><Config /></Layout>);
        const inputElement = screen.getByLabelText('割合 (%):') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: '20' } });
        const saveButton = screen.getByRole('button', { name: '保存' });
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(consoleErrorSpy).toHaveBeenCalledWith('設定保存エラー:', new Error('APIエラー'));
        });

        consoleErrorSpy.mockRestore();
    });
});"
}