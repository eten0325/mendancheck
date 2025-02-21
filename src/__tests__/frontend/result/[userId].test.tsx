{
  "code": "import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useRouter, useSearchParams } from 'next/navigation';
import { jest } from '@jest/globals';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

// Mock the data fetching function
const mockHealthCheckResults = [
    { id: '1', bmi: 22.5, systolic_blood_pressure: 120, diastolic_blood_pressure: 80, blood_sugar: 90, hba1c: 5.5, ldl_cholesterol: 120, tg: 150, ast: 25, alt: 30, gamma_gtp: 35, bmi_evaluation: 'A', blood_pressure_evaluation: 'B', blood_sugar_evaluation: 'A', lipid_evaluation: 'C', liver_function_evaluation: 'A' },
    { id: '2', bmi: 24.0, systolic_blood_pressure: 130, diastolic_blood_pressure: 85, blood_sugar: 100, hba1c: 6.0, ldl_cholesterol: 130, tg: 160, ast: 30, alt: 35, gamma_gtp: 40, bmi_evaluation: 'B', blood_pressure_evaluation: 'C', blood_sugar_evaluation: 'B', lipid_evaluation: 'D', liver_function_evaluation: 'B' },
];

const mockFetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockHealthCheckResults),
        ok: true,
    })
);

global.fetch = mockFetch;

// Mock common components
const MockHeader = () => <header data-testid=\"header\">ヘッダー</header>;
const MockFooter = () => <footer data-testid=\"footer\">フッター</footer>;

// 詳細データ画面 コンポーネント
const ResultUserId = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId') || 'defaultUserId';

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/health_check_results?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('データの取得に失敗しました');
                }
                const jsonData = await response.json();
                setData(jsonData);
                setLoading(false);
            } catch (err) {
                setError(err);
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!data || data.length === 0) {
        return <div>データがありません</div>;
    }

    return (
        <>
            <MockHeader />
            <div data-testid=\"detail-data-screen\">
                <h2>詳細データ</h2>
                {data.map((item) => (
                    <div key={item.id}>
                        <p>BMI: {item.bmi}</p>
                        <p>収縮期血圧: {item.systolic_blood_pressure}</p>
                        <p>拡張期血圧: {item.diastolic_blood_pressure}</p>
                        <p>血糖値: {item.blood_sugar}</p>
                        <p>HbA1c: {item.hba1c}</p>
                        <p>LDLコレステロール: {item.ldl_cholesterol}</p>
                        <p>TG: {item.tg}</p>
                        <p>AST: {item.ast}</p>
                        <p>ALT: {item.alt}</p>
                        <p>γ-GTP: {item.gamma_gtp}</p>
                        <p>BMI評価: {item.bmi_evaluation}</p>
                        <p>血圧評価: {item.blood_pressure_evaluation}</p>
                        <p>血糖値評価: {item.blood_sugar_evaluation}</p>
                        <p>脂質評価: {item.lipid_evaluation}</p>
                        <p>肝機能評価: {item.liver_function_evaluation}</p>
                    </div>
                ))}
            </div>
            <MockFooter />
        </>
    );
};\


// テストケース
describe('ResultUserId コンポーネント', () => {
    beforeEach(() => {
        useRouter.mockReturnValue({
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        });
    });

    it('データの読み込み中はLoading...と表示する', () => {
        useSearchParams.mockReturnValue({
            get: jest.fn().mockReturnValue('testUserId'),
            has: jest.fn(),
            keys: jest.fn(),
            entries: jest.fn(),
            values: jest.fn(),
        });

        render(<ResultUserId />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('データ取得が成功した場合、詳細データが表示される', async () => {
        useSearchParams.mockReturnValue({
            get: jest.fn().mockReturnValue('testUserId'),
            has: jest.fn(),
            keys: jest.fn(),
            entries: jest.fn(),
            values: jest.fn(),
        });

        render(<ResultUserId />);
        // Wait for the data to load
        await screen.findByTestId('detail-data-screen');
        expect(screen.getByText('BMI: 22.5')).toBeInTheDocument();
        expect(screen.getByText('収縮期血圧: 120')).toBeInTheDocument();
        expect(screen.getByText('拡張期血圧: 80')).toBeInTheDocument();

        // Check for other data points
        expect(screen.getByText('血糖値: 90')).toBeInTheDocument();
        expect(screen.getByText('HbA1c: 5.5')).toBeInTheDocument();
    });

    it('データ取得に失敗した場合、エラーメッセージが表示される', async () => {
        useSearchParams.mockReturnValue({
            get: jest.fn().mockReturnValue('testUserId'),
            has: jest.fn(),
            keys: jest.fn(),
            entries: jest.fn(),
            values: jest.fn(),
        });

        mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.reject(new Error('データの取得に失敗しました')),
                ok: false,
            })
        );

        render(<ResultUserId />);

        // Wait for the error message to appear
        await screen.findByText('Error: データの取得に失敗しました');

        expect(screen.getByText('Error: データの取得に失敗しました')).toBeInTheDocument();
    });

    it('データが空の場合、「データがありません」と表示する', async () => {
        useSearchParams.mockReturnValue({
            get: jest.fn().mockReturnValue('testUserId'),
            has: jest.fn(),
            keys: jest.fn(),
            entries: jest.fn(),
            values: jest.fn(),
        });

        mockFetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
                ok: true,
            })
        );

        render(<ResultUserId />);
        await screen.findByText('データがありません');
        expect(screen.getByText('データがありません')).toBeInTheDocument();
    });

    it('ヘッダーとフッターが表示される', async () => {
        useSearchParams.mockReturnValue({
            get: jest.fn().mockReturnValue('testUserId'),
            has: jest.fn(),
            keys: jest.fn(),
            entries: jest.fn(),
            values: jest.fn(),
        });
        render(<ResultUserId />);
        await screen.findByTestId('detail-data-screen');
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });
});"
}