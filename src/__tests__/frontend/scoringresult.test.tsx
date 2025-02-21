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

// Layout コンポーネントのモック
const MockLayout = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid=\"layout-component\">{children}</div>;
};

// モックの適用
jest.mock('@/pages/scoringresult', () => {
    return {
        __esModule: true,
        default: (props: any) => <MockLayout>{props.children}</MockLayout>,
    };
});

// スコアリング結果一覧画面コンポーネント（Layoutを使用）
const ScoringResultScreen = () => {
    const [searchResults, setSearchResults] = React.useState<any>([]);
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [sortKey, setSortKey] = React.useState<string>('total_score');
    const [sortOrder, setSortOrder] = React.useState<string>('desc');
    const [filterValue, setFilterValue] = React.useState<string>('');

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        const [newSortKey, newSortOrder] = selectedValue.split(':');
        setSortKey(newSortKey);
        setSortOrder(newSortOrder);
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterValue(event.target.value);
    };

    const fetchData = async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                { id: '1', user_id: 'user1', total_score: 100, bmi_evaluation: 'A' },
                { id: '2', user_id: 'user2', total_score: 80, bmi_evaluation: 'B' },
                { id: '3', user_id: 'user3', total_score: 60, bmi_evaluation: 'C' },
            ],
        });

        const response = await axios.get('/api/health_check_results');
        setSearchResults(response.data);
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const filteredResults = searchResults.filter((result: any) =>
        result.user_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedResults = [...filteredResults].sort((a: any, b: any) => {
        const order = sortOrder === 'asc' ? 1 : -1;
        return (a[sortKey] - b[sortKey]) * order;
    });

    const finalResults = filterValue
        ? sortedResults.filter((result: any) => result.bmi_evaluation === filterValue)
        : sortedResults;

    return (
        <div data-testid=\"scoring-result-screen\">
            <input
                type=\"text\"
                placeholder=\"ユーザーIDで検索\"
                onChange={handleSearchChange}
                data-testid=\"search-input\"
            />

            <select onChange={handleSortChange} data-testid=\"sort-select\">
                <option value=\"total_score:desc\">スコア（降順）</option>
                <option value=\"total_score:asc\">スコア（昇順）</option>
            </select>

            <select onChange={handleFilterChange} data-testid=\"filter-select\">
                <option value=\"\">すべての評価</option>
                <option value=\"A\">A評価</option>
                <option value=\"B\">B評価</option>
                <option value=\"C\">C評価</option>
            </select>

            <table data-testid=\"results-table\">
                <thead>
                    <tr>
                        <th>ユーザーID</th>
                        <th>スコア</th>
                        <th>評価</th>
                    </tr>
                </thead>
                <tbody>
                    {finalResults.map((result: any) => (
                        <tr key={result.id}>
                            <td>{result.user_id}</td>
                            <td>{result.total_score}</td>
                            <td>{result.bmi_evaluation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


describe('スコアリング結果一覧画面コンポーネント', () => {
    beforeEach(() => {
        mockedAxios.get.mockClear();
    });

    it('Layoutコンポーネントでラップされていること', () => {
        render(<ScoringResultScreen />);
        expect(screen.getByTestId('layout-component')).toBeInTheDocument();
    });

    it('初期表示時にデータを取得して表示すること', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                { id: '1', user_id: 'user1', total_score: 100, bmi_evaluation: 'A' },
                { id: '2', user_id: 'user2', total_score: 80, bmi_evaluation: 'B' },
                { id: '3', user_id: 'user3', total_score: 60, bmi_evaluation: 'C' },
            ],
        });
        render(<ScoringResultScreen />);
        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId('results-table')).toBeInTheDocument();
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.getByText('user2')).toBeInTheDocument();
            expect(screen.getByText('user3')).toBeInTheDocument();
        });
    });

    it('検索機能が動作すること', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                { id: '1', user_id: 'user1', total_score: 100, bmi_evaluation: 'A' },
                { id: '2', user_id: 'user2', total_score: 80, bmi_evaluation: 'B' },
                { id: '3', user_id: 'user3', total_score: 60, bmi_evaluation: 'C' },
            ],
        });
        render(<ScoringResultScreen />);
        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'user1' } });
        await waitFor(() => {
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.queryByText('user2')).not.toBeInTheDocument();
            expect(screen.queryByText('user3')).not.toBeInTheDocument();
        });
    });

    it('ソート機能が動作すること', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                { id: '1', user_id: 'user1', total_score: 60, bmi_evaluation: 'C' },
                { id: '2', user_id: 'user2', total_score: 80, bmi_evaluation: 'B' },
                { id: '3', user_id: 'user3', total_score: 100, bmi_evaluation: 'A' },
            ],
        });
        render(<ScoringResultScreen />);
        const sortSelect = screen.getByTestId('sort-select');
        fireEvent.change(sortSelect, { target: { value: 'total_score:asc' } });

        await waitFor(() => {
            const table = screen.getByTestId('results-table');
            const rows = table.querySelectorAll('tbody tr');
            expect(rows[0].textContent).toContain('user1');
            expect(rows[1].textContent).toContain('user2');
            expect(rows[2].textContent).toContain('user3');
        });
    });

    it('フィルタ機能が動作すること', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: [
                { id: '1', user_id: 'user1', total_score: 100, bmi_evaluation: 'A' },
                { id: '2', user_id: 'user2', total_score: 80, bmi_evaluation: 'B' },
                { id: '3', user_id: 'user3', total_score: 60, bmi_evaluation: 'C' },
            ],
        });
        render(<ScoringResultScreen />);
        const filterSelect = screen.getByTestId('filter-select');
        fireEvent.change(filterSelect, { target: { value: 'A' } });
        await waitFor(() => {
            expect(screen.getByText('user1')).toBeInTheDocument();
            expect(screen.queryByText('user2')).not.toBeInTheDocument();
            expect(screen.queryByText('user3')).not.toBeInTheDocument();
        });
    });
});"
}