{
  "code": "import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import axios from 'axios';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
    usePathname: jest.fn(),
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Common Components
const MockLayout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid=\"layout\">{children}</div>
);
const MockHeader = () => <div data-testid=\"header\">Header</div>;

// Component to be tested
const ScoreDetail = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [scoreData, setScoreData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const id = searchParams.get('id');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await mockedAxios.get(`/api/health_check_results/${id}`);
                setScoreData(response.data);
            } catch (e: any) {
                setError(e.message || 'データの取得に失敗しました');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!scoreData) {
        return <div>No data found.</div>;
    }

    return (
        <MockLayout>
            <MockHeader />
            <div data-testid=\"score-detail\">
                <h1>スコア詳細</h1>
                <p>ID: {scoreData.id}</p>
                <p>BMIスコア: {scoreData.bmi_score}</p>
                <p>血圧スコア: {scoreData.blood_pressure_score}</p>
                <p>血糖値スコア: {scoreData.blood_sugar_score}</p>
                <p>脂質スコア: {scoreData.lipid_score}</p>
                <p>肝機能スコア: {scoreData.liver_function_score}</p>
                <p>合計スコア: {scoreData.total_score}</p>
                <button onClick={() => router.back()}>戻る</button>
            </div>
        </MockLayout>
    );
};

describe('ScoreDetail Component', () => {
    const mockRouterPush = jest.fn();
    const mockRouterBack = jest.fn();

    (useRouter as jest.Mock).mockReturnValue({
        push: mockRouterPush,
        back: mockRouterBack,
    });

    (useSearchParams as jest.Mock).mockReturnValue({
        get: jest.fn((key) => (key === 'id' ? '123' : null)),
    });

    (usePathname as jest.Mock).mockReturnValue('/evalTable/scoreDetail/[id]');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('正しくレンダリングされること', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                id: '123',
                bmi_score: 80,
                blood_pressure_score: 70,
                blood_sugar_score: 60,
                lipid_score: 50,
                liver_function_score: 40,
                total_score: 300,
            },
        });

        render(<ScoreDetail />);

        await waitFor(() => {
            expect(screen.getByTestId('layout')).toBeInTheDocument();
            expect(screen.getByTestId('header')).toBeInTheDocument();
            expect(screen.getByTestId('score-detail')).toBeInTheDocument();
            expect(screen.getByText('スコア詳細')).toBeInTheDocument();
            expect(screen.getByText('合計スコア: 300')).toBeInTheDocument();
        });
    });

    it('ローディング状態を表示すること', () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn((key) => (key === 'id' ? '123' : null)),
        });

        mockedAxios.get.mockImplementation(() => new Promise(() => {}));

        render(<ScoreDetail />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('エラー発生時にエラーメッセージを表示すること', async () => {
        mockedAxios.get.mockRejectedValue(new Error('データの取得に失敗しました'));

        render(<ScoreDetail />);

        await waitFor(() => {
            expect(screen.getByText('Error: データの取得に失敗しました')).toBeInTheDocument();
        });
    });

    it('データが存在しない場合にメッセージを表示すること', async () => {
        mockedAxios.get.mockResolvedValue({ data: null });

        render(<ScoreDetail />);

        await waitFor(() => {
            expect(screen.getByText('No data found.')).toBeInTheDocument();
        });
    });

    it('「戻る」ボタンをクリックした際にルーターがback関数を実行すること', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                id: '123',
                bmi_score: 80,
                blood_pressure_score: 70,
                blood_sugar_score: 60,
                lipid_score: 50,
                liver_function_score: 40,
                total_score: 300,
            },
        });

        render(<ScoreDetail />);

        await waitFor(() => {
            const backButton = screen.getByText('戻る');
            fireEvent.click(backButton);
            expect(mockRouterBack).toHaveBeenCalledTimes(1);
        });
    });
});"
}