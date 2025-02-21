{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import Layout from './Layout';
import Header from './Header';

// モックデータの定義
const mockSortConditions = [
  { id: '1', label: 'スコア', value: 'score' },
  { id: '2', label: '名前', value: 'name' },
];

// モックのonChange関数
const mockOnChange = jest.fn();

// テスト対象コンポーネントの定義（ソート条件選択UI）
const SortConditionSelector = ({ sortConditions, onChange }: { sortConditions: any, onChange: any }) => {
  return (
    <div>
      <label htmlFor=\"sortCondition\">ソート条件:</label>
      <select id=\"sortCondition\" onChange={onChange}>
        {sortConditions.map((condition: any) => (
          <option key={condition.id} value={condition.value}>
            {condition.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Layoutコンポーネントのモック
jest.mock('./Layout', () => {
  return function MockedLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid=\"layout\">{children}</div>;
  };
});

// Headerコンポーネントのモック
jest.mock('./Header', () => {
  return function MockedHeader() {
    return <div data-testid=\"header\">Header</div>;
  };
});

// evalTable/tableSort.tsxコンポーネント
const TableSort = () => {
  const [selectedSortCondition, setSelectedSortCondition] = React.useState('');

  const handleSortConditionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSortCondition(event.target.value);
  };

  return (
    <>
      <Layout>
        <Header />
        <div>ソート設定画面</div>
        <SortConditionSelector
          sortConditions={mockSortConditions}
          onChange={handleSortConditionChange}
        />
        <div>選択されたソート条件: {selectedSortCondition}</div>
      </Layout>
    </>
  );
};

describe('TableSortコンポーネント', () => {
  it('LayoutとHeaderコンポーネントがレンダリングされること', () => {
    render(<TableSort />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('ソート設定画面の文字が表示されること', () => {
    render(<TableSort />);
    expect(screen.getByText('ソート設定画面')).toBeInTheDocument();
  });

  it('ソート条件選択UIがレンダリングされること', () => {
    render(<TableSort />);
    expect(screen.getByLabelText('ソート条件:')).toBeInTheDocument();
  });

  it('ソート条件が正しく表示されること', () => {
    render(<TableSort />);
    expect(screen.getByText('スコア')).toBeInTheDocument();
    expect(screen.getByText('名前')).toBeInTheDocument();
  });

  it('ソート条件を選択できること', () => {
    render(<TableSort />);
    const selectElement = screen.getByLabelText('ソート条件:');
    fireEvent.change(selectElement, { target: { value: 'name' } });
    expect(selectElement).toHaveValue('name');
  });

  it('選択されたソート条件が表示されること', () => {
    render(<TableSort />);
    const selectElement = screen.getByLabelText('ソート条件:');
    fireEvent.change(selectElement, { target: { value: 'name' } });
    expect(screen.getByText('選択されたソート条件: name')).toBeInTheDocument();
  });
});"
}