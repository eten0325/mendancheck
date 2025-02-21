{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import axios from 'axios';

// Mocks
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

// Component to test
const LipidEvaluationDetail = () => {
    const [lipidData, setLipidData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await axios.get('/api/health_check_results/123');
                setLipidData(result.data);
            } catch (e: any) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>ローディング中...</div>;
    }

    if (error) {
        return <div>エラー: {error.message}</div>;
    }

    if (!lipidData) {
        return <div>データがありません。</div>;
    }

    return (
        <div>
            <h1>脂質評価詳細</h1>
            <p>LDLコレステロール: {lipidData.ldl_cholesterol}</p>
            <p>TG: {lipidData.tg}</p>
            <p>評価結果: {lipidData.lipid_evaluation}</p>
            <p>詳細情報: {lipidData.additional_info || 'なし'}</p>
        </div>
    );
};

const Layout = ({ children }: { children: React.ReactNode }) => (
    <div>
        <header>ヘッダー</header>
        <main>{children}</main>
        <footer>フッター</footer>
    </div>
);


describe('脂質評価詳細コンポーネントテスト', () => {
    beforeEach(() => {
        mockedAxios.get.mockClear();
    });

    it('データのローディング状態を表示する', () => {
        mockedAxios.get.mockResolvedValueOnce({ data: {} });
        render(
            <Layout>
                <LipidEvaluationDetail />
            </Layout>
        );
        expect(screen.getByText('ローディング中...')).toBeInTheDocument();
    });

    it('APIから脂質データを取得して表示する', async () => {
        const mockData = {
            ldl_cholesterol: 120,
            tg: 150,
            lipid_evaluation: '要経過観察',
            additional_info: '食事改善が必要です。',
        };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });

        render(
            <Layout>
                <LipidEvaluationDetail />
            </Layout>
        );

        await waitFor(() => {
            expect(screen.getByText('脂質評価詳細')).toBeInTheDocument();
            expect(screen.getByText('LDLコレステロール: 120')).toBeInTheDocument();
            expect(screen.getByText('TG: 150')).toBeInTheDocument();
            expect(screen.getByText('評価結果: 要経過観察')).toBeInTheDocument();
            expect(screen.getByText('詳細情報: 食事改善が必要です。')).toBeInTheDocument();
        });

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        expect(mockedAxios.get).toHaveBeenCalledWith('/api/health_check_results/123');
    });

    it('追加情報がない場合、「なし」と表示する', async () => {
        const mockData = {
            ldl_cholesterol: 120,
            tg: 150,
            lipid_evaluation: '要経過観察',
            additional_info: null,
        };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });

        render(
            <Layout>
                <LipidEvaluationDetail />
            </Layout>
        );

        await waitFor(() => {
            expect(screen.getByText('詳細情報: なし')).toBeInTheDocument();
        });
    });

    it('APIエラー発生時にエラーメッセージを表示する', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('APIエラー'));

        render(
            <Layout>
                <LipidEvaluationDetail />
            </Layout>
        );

        await waitFor(() => {
            expect(screen.getByText('エラー: APIエラー')).toBeInTheDocument();
        });
    });

    it('データが取得できなかった場合にメッセージを表示する', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: null });

        render(
            <Layout>
                <LipidEvaluationDetail />
            </Layout>
        );

        await waitFor(() => {
            expect(screen.getByText('データがありません。')).toBeInTheDocument();
        });
    });

    it('Layout コンポーネントでラップされていること', async () => {
        const mockData = {
            ldl_cholesterol: 120,
            tg: 150,
            lipid_evaluation: '要経過観察',
            additional_info: '食事改善が必要です。',
        };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });

        render(
            <Layout>
                <LipidEvaluationDetail />
            </Layout>
        );

        await waitFor(() => {
            expect(screen.getByText('ヘッダー')).toBeInTheDocument();
            expect(screen.getByText('フッター')).toBeInTheDocument();
            expect(screen.getByText('脂質評価詳細')).toBeInTheDocument();
        });
    });
});"
}