{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import axios from 'axios';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
    useSearchParams: () => new URLSearchParams(),
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Define a mock Layout component
const MockLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div data-testid=\"layout\">
            <header data-testid=\"header\">ヘッダー</header>
            <main data-testid=\"main\">{children}</main>
            <footer data-testid=\"footer\">フッター</footer>
        </div>
    );
};

const LiverFunctionScoringRuleSetting = () => {
    const [astRange, setAstRange] = React.useState({
        min: '',
        max: '',
        score: '',
    });
    const [altRange, setAltRange] = React.useState({
        min: '',
        max: '',
        score: '',
    });
    const [gammaGtpRange, setGammaGtpRange] = React.useState({
        min: '',
        max: '',
        score: '',
    });

    const handleAstChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAstRange(prev => ({ ...prev, [name]: value }));
    };

    const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAltRange(prev => ({ ...prev, [name]: value }));
    };

    const handleGammaGtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setGammaGtpRange(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            // Mock API call
            mockedAxios.post.mockResolvedValue({ status: 200 });

            const response = await axios.post('/api/settings', {
                astRange,
                altRange,
                gammaGtpRange,
            });

            if (response.status === 200) {
                alert('設定が保存されました。');
            } else {
                alert('設定の保存に失敗しました。');
            }
        } catch (error) {
            console.error('設定の保存エラー:', error);
            alert('設定の保存中にエラーが発生しました。');
        }
    };

    return (
        <MockLayout>
            <div>
                <h1>肝機能スコアリングルール設定</h1>

                <div>
                    <h2>AST範囲</h2>
                    <input
                        type=\"number\"
                        name=\"min\"
                        value={astRange.min}
                        onChange={handleAstChange}
                        placeholder=\"最小値\"
                        data-testid=\"ast-min\"
                    />
                    <input
                        type=\"number\"
                        name=\"max\"
                        value={astRange.max}
                        onChange={handleAstChange}
                        placeholder=\"最大値\"
                        data-testid=\"ast-max\"
                    />
                    <input
                        type=\"number\"
                        name=\"score\"
                        value={astRange.score}
                        onChange={handleAstChange}
                        placeholder=\"スコア\"
                        data-testid=\"ast-score\"
                    />
                </div>

                <div>
                    <h2>ALT範囲</h2>
                    <input
                        type=\"number\"
                        name=\"min\"
                        value={altRange.min}
                        onChange={handleAltChange}
                        placeholder=\"最小値\"
                        data-testid=\"alt-min\"
                    />
                    <input
                        type=\"number\"
                        name=\"max\"
                        value={altRange.max}
                        onChange={handleAltChange}
                        placeholder=\"最大値\"
                        data-testid=\"alt-max\"
                    />
                    <input
                        type=\"number\"
                        name=\"score\"
                        value={altRange.score}
                        onChange={handleAltChange}
                        placeholder=\"スコア\"
                        data-testid=\"alt-score\"
                    />
                </div>

                <div>
                    <h2>γGTP範囲</h2>
                    <input
                        type=\"number\"
                        name=\"min\"
                        value={gammaGtpRange.min}
                        onChange={handleGammaGtpChange}
                        placeholder=\"最小値\"
                        data-testid=\"gamma-gtp-min\"
                    />
                    <input
                        type=\"number\"
                        name=\"max\"
                        value={gammaGtpRange.max}
                        onChange={handleGammaGtpChange}
                        placeholder=\"最大値\"
                        data-testid=\"gamma-gtp-max\"
                    />
                    <input
                        type=\"number\"
                        name=\"score\"
                        value={gammaGtpRange.score}
                        onChange={handleGammaGtpChange}
                        placeholder=\"スコア\"
                        data-testid=\"gamma-gtp-score\"
                    />
                </div>

                <button onClick={handleSubmit} data-testid=\"save-button\">保存</button>
            </div>
        </MockLayout>
    );
};

describe('LiverFunctionScoringRuleSetting', () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
        jest.clearAllMocks();
    });

    it('レイアウトコンポーネントが表示されること', () => {
        render(<LiverFunctionScoringRuleSetting />);
        expect(screen.getByTestId('layout')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('main')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('AST、ALT、γGTPの入力フィールドが存在すること', () => {
        render(<LiverFunctionScoringRuleSetting />);

        expect(screen.getByTestId('ast-min')).toBeInTheDocument();
        expect(screen.getByTestId('ast-max')).toBeInTheDocument();
        expect(screen.getByTestId('ast-score')).toBeInTheDocument();

        expect(screen.getByTestId('alt-min')).toBeInTheDocument();
        expect(screen.getByTestId('alt-max')).toBeInTheDocument();
        expect(screen.getByTestId('alt-score')).toBeInTheDocument();

        expect(screen.getByTestId('gamma-gtp-min')).toBeInTheDocument();
        expect(screen.getByTestId('gamma-gtp-max')).toBeInTheDocument();
        expect(screen.getByTestId('gamma-gtp-score')).toBeInTheDocument();
    });

    it('入力フィールドに値を入力できること', () => {
        render(<LiverFunctionScoringRuleSetting />);

        fireEvent.change(screen.getByTestId('ast-min'), { target: { value: '10' } });
        expect((screen.getByTestId('ast-min') as HTMLInputElement).value).toBe('10');

        fireEvent.change(screen.getByTestId('alt-max'), { target: { value: '100' } });
        expect((screen.getByTestId('alt-max') as HTMLInputElement).value).toBe('100');

        fireEvent.change(screen.getByTestId('gamma-gtp-score'), { target: { value: '5' } });
        expect((screen.getByTestId('gamma-gtp-score') as HTMLInputElement).value).toBe('5');
    });

    it('保存ボタンをクリックすると、APIが呼び出されること', async () => {
        render(<LiverFunctionScoringRuleSetting />);

        fireEvent.change(screen.getByTestId('ast-min'), { target: { value: '10' } });
        fireEvent.change(screen.getByTestId('ast-max'), { target: { value: '50' } });
        fireEvent.change(screen.getByTestId('ast-score'), { target: { value: '1' } });

        fireEvent.click(screen.getByTestId('save-button'));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });
    });

    it('APIが成功した場合、成功アラートが表示されること', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        mockedAxios.post.mockResolvedValue({ status: 200 });

        render(<LiverFunctionScoringRuleSetting />);

        fireEvent.change(screen.getByTestId('ast-min'), { target: { value: '10' } });
        fireEvent.change(screen.getByTestId('ast-max'), { target: { value: '50' } });
        fireEvent.change(screen.getByTestId('ast-score'), { target: { value: '1' } });

        fireEvent.click(screen.getByTestId('save-button'));

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('設定が保存されました。');
        });

        alertMock.mockRestore();
    });

    it('APIが失敗した場合、失敗アラートが表示されること', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        mockedAxios.post.mockRejectedValue(new Error('APIエラー'));

        render(<LiverFunctionScoringRuleSetting />);

        fireEvent.click(screen.getByTestId('save-button'));

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('設定の保存中にエラーが発生しました。');
        });

        alertMock.mockRestore();
    });
});"
}