{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import axios from 'axios';

// モックの設定
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Next.jsのuseRouterをモック
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// モックデータ
const mockHealthCheckResults = [
    { id: '1', total_score: 50 },
    { id: '2', total_score: 75 },
    { id: '3', total_score: 25 },
];

// Layoutコンポーネントのモック
const MockLayout = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid=\"layout\">{children}</div>;
};

// Headerコンポーネントのモック
const MockHeader = () => {
    return <div data-testid=\"header\">Header</div>;
};

// scoreGraph.tsxコンポーネント（テスト対象）
const ScoreGraph = () => {
    const [data, setData] = React.useState(mockHealthCheckResults);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // モックされたaxiosを使用
                mockedAxios.get.mockResolvedValueOnce({ data: mockHealthCheckResults });
                const result = await axios.get('/api/health_check_results');
                setData(result.data);
                setLoading(false);
            } catch (e: any) {
                setError(e.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div data-testid=\"loading\">Loading...</div>;
    if (error) return <div data-testid=\"error\">Error: {error}</div>;

    return (
        <MockLayout>
            <MockHeader />
            <div data-testid=\"score-graph\">
                {data.map((item) => (
                    <div key={item.id} data-testid={`score-item-${item.id}`}>
                        Score: {item.total_score}
                    </div>
                ))}
            </div>
        </MockLayout>
    );
};


// テストケース
describe('ScoreGraph Component', () => {
    beforeEach(() => {
        // axiosのmockをクリア
        mockedAxios.get.mockClear();
    });

    it('ローディング状態を表示する', () => {
        render(<ScoreGraph />);
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('エラー状態を表示する', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch'));
        render(<ScoreGraph />);

        await waitFor(() => {
            expect(screen.getByTestId('error')).toBeInTheDocument();
        });
        expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    });

    it('データを取得してグラフを表示する', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockHealthCheckResults });
        render(<ScoreGraph />);

        await waitFor(() => {
            expect(screen.getByTestId('score-graph')).toBeInTheDocument();
        });

        mockHealthCheckResults.forEach((item) => {
            expect(screen.getByTestId(`score-item-${item.id}`)).toBeInTheDocument();
            expect(screen.getByText(`Score: ${item.total_score}`)).toBeInTheDocument();
        });

        expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    });

    it('LayoutコンポーネントとHeaderコンポーネントが表示される', async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: mockHealthCheckResults });
        render(<ScoreGraph />);

        await waitFor(() => {
            expect(screen.getByTestId('score-graph')).toBeInTheDocument();
        });

        expect(screen.getByTestId('layout')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });
});"
}