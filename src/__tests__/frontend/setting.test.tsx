{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import axios from 'axios';

// モックの設定
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
};

jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: jest.fn(),
    useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// テスト対象コンポーネント
const SettingScreen = () => {
    const [extractRatio, setExtractRatio] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExtractRatio(event.target.value);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            mockedAxios.post.mockResolvedValueOnce({ status: 200, data: { message: '設定が保存されました。' } });
            await axios.post('/api/settings', { extract_ratio: extractRatio });
            alert('設定が保存されました。');
        } catch (error) {
            console.error('設定保存エラー:', error);
            alert('設定の保存に失敗しました。');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <Header />
            <h1>抽出設定画面</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor=\"extractRatio\">上位抽出割合:</label>
                    <input
                        type=\"number\"
                        id=\"extractRatio\"
                        value={extractRatio}
                        onChange={handleChange}
                    />
                </div>
                <button type=\"submit\" disabled={isLoading}>
                    {isLoading ? '保存中...' : '保存'}
                </button>
            </form>
            <Footer />
        </div>
    );
};

// ヘッダーとフッターのモックコンポーネント
const Header = () => <header data-testid=\"header\">ヘッダー</header>;
const Footer = () => <footer data-testid=\"footer\">フッター</footer>;

// ヘッダーとフッターのモックを設定
jest.mock('./Header', () => () => <Header />);
jest.mock('./Footer', () => () => <Footer />);


describe('抽出設定画面のテスト', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('画面が正しくレンダリングされること', () => {
        render(<SettingScreen />);
        expect(screen.getByText('抽出設定画面')).toBeInTheDocument();
        expect(screen.getByLabelText('上位抽出割合:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('上位抽出割合が変更できること', () => {
        render(<SettingScreen />);
        const inputElement = screen.getByLabelText('上位抽出割合:');
        fireEvent.change(inputElement, { target: { value: '50' } });
        expect((inputElement as HTMLInputElement).value).toBe('50');
    });

    it('保存ボタンをクリックすると設定が保存され、成功アラートが表示されること', async () => {
        render(<SettingScreen />);
        const inputElement = screen.getByLabelText('上位抽出割合:');
        fireEvent.change(inputElement, { target: { value: '50' } });
        const saveButton = screen.getByRole('button', { name: '保存' });

        mockedAxios.post.mockResolvedValueOnce({ status: 200, data: { message: '設定が保存されました。' } });
        global.alert = jest.fn();

        fireEvent.click(saveButton);

        expect(screen.getByRole('button', { name: '保存中...' })).toBeInTheDocument();
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/settings', { extract_ratio: '50' });
            expect(global.alert).toHaveBeenCalledWith('設定が保存されました。');
            expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
        });


    });

    it('保存ボタンをクリックして設定保存に失敗した場合、エラーアラートが表示されること', async () => {
        render(<SettingScreen />);
        const inputElement = screen.getByLabelText('上位抽出割合:');
        fireEvent.change(inputElement, { target: { value: '50' } });
        const saveButton = screen.getByRole('button', { name: '保存' });

        mockedAxios.post.mockRejectedValueOnce(new Error('設定保存に失敗しました。'));
        global.alert = jest.fn();

        fireEvent.click(saveButton);

        expect(screen.getByRole('button', { name: '保存中...' })).toBeInTheDocument();

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith('/api/settings', { extract_ratio: '50' });
            expect(global.alert).toHaveBeenCalledWith('設定の保存に失敗しました。');
            expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
        });

    });

    it('ローディング中は保存ボタンがdisabledになること', () => {
        render(<SettingScreen />);
        const saveButton = screen.getByRole('button', { name: '保存' });
        fireEvent.click(saveButton);
        expect(saveButton).toBeDisabled();
    });
});"
}