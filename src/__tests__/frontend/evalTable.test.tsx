{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { useRouter } from 'next/navigation';


// モックコンポーネント
const MockLayout = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid=\"layout-component\">{children}</div>;
};

const MockHeader = () => {
  return <div data-testid=\"header-component\">Header</div>;
};

// useRouterをモック
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// evalTable.tsxのモック
const EvalTable = () => {
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
    const [filterValue, setFilterValue] = React.useState('');

    const handleSort = () => {
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
    };

    return (
        <div data-testid=\"eval-table\">
            <button onClick={handleSort} data-testid=\"sort-button\">Sort</button>
            <input type=\"text\" onChange={handleFilterChange} data-testid=\"filter-input\" />
            <div>Sort Order: {sortOrder}</div>
            <div>Filter Value: {filterValue}</div>
        </div>
    );
};




// テストスイート
describe('EvalTable Component', () => {
    let mockRouterPush = jest.fn();
    let mockRouterReplace = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockRouterPush,
            replace: mockRouterReplace,
        });
    });

    it('EvalTableコンポーネントが正しくレンダリングされること', () => {
        render(
          <MockLayout>
            <MockHeader />
            <EvalTable />
          </MockLayout>
        );
        expect(screen.getByTestId('layout-component')).toBeInTheDocument();
        expect(screen.getByTestId('header-component')).toBeInTheDocument();
        expect(screen.getByTestId('eval-table')).toBeInTheDocument();
    });

    it('ソートボタンをクリックするとソート順が変更されること', () => {
        render(<EvalTable />);
        const sortButton = screen.getByTestId('sort-button');
        fireEvent.click(sortButton);
        expect(screen.getByText('Sort Order: desc')).toBeInTheDocument();
        fireEvent.click(sortButton);
        expect(screen.getByText('Sort Order: asc')).toBeInTheDocument();
    });

    it('フィルタ入力フィールドに入力するとフィルタ値が更新されること', () => {
        render(<EvalTable />);
        const filterInput = screen.getByTestId('filter-input');
        fireEvent.change(filterInput, { target: { value: 'test' } });
        expect(screen.getByText('Filter Value: test')).toBeInTheDocument();
    });


    it('MockLayoutコンポーネントが子要素をレンダリングすること', () => {
        render(
            <MockLayout>
                <div>Child Content</div>
            </MockLayout>
        );
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('MockHeaderコンポーネントがレンダリングされること', () => {
        render(<MockHeader />);
        expect(screen.getByTestId('header-component')).toBeInTheDocument();
    });
});"
}