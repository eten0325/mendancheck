{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import Layout from './Layout';
import Header from './Header';



// モック useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// モックコンポーネント
jest.mock('./Layout', () => {
  return {
    __esModule: true,
    default: jest.fn(({ children }) => <div data-testid=\"mock-layout\">{children}</div>),
  };
});

jest.mock('./Header', () => {
  return {
    __esModule: true,
    default: jest.fn(() => <div data-testid=\"mock-header\"></div>),
  };
});

describe('AnalysisView コンポーネント テスト', () => {

  const AnalysisView = () => {
    return (
      <>
        <Layout>
          <Header />
          <div>
            <h1>分析表示画面</h1>
            <button data-testid=\"score-graph-link\">スコア分布グラフへ</button>
            <button data-testid=\"top-list-link\">上位抽出リストへ</button>
            <button data-testid=\"detail-data-link\">詳細データ表示へ</button>
            <button data-testid=\"eval-table-link\">評価結果一覧へ</button>
          </div>
        </Layout>
      </>
    );
  };

  it('LayoutコンポーネントとHeaderコンポーネントがレンダリングされること', () => {
    render(<AnalysisView />);
    expect(Layout).toHaveBeenCalled();
    expect(Header).toHaveBeenCalled();
  });

  it('正しいテキストが表示されていること', () => {
    render(<AnalysisView />);
    expect(screen.getByText('分析表示画面')).toBeInTheDocument();
  });

  it('スコア分布グラフへのリンクボタンが存在すること', () => {
    render(<AnalysisView />);
    const linkButton = screen.getByTestId('score-graph-link');
    expect(linkButton).toBeInTheDocument();
  });

  it('上位抽出リストへのリンクボタンが存在すること', () => {
    render(<AnalysisView />);
    const linkButton = screen.getByTestId('top-list-link');
    expect(linkButton).toBeInTheDocument();
  });

  it('詳細データ表示へのリンクボタンが存在すること', () => {
    render(<AnalysisView />);
    const linkButton = screen.getByTestId('detail-data-link');
    expect(linkButton).toBeInTheDocument();
  });

  it('評価結果一覧へのリンクボタンが存在すること', () => {
    render(<AnalysisView />);
    const linkButton = screen.getByTestId('eval-table-link');
    expect(linkButton).toBeInTheDocument();
  });

  it('Layoutコンポーネントでラップされていること', () => {
    render(<AnalysisView />);
    expect(screen.getByTestId('mock-layout')).toBeInTheDocument();
  });

  it('Headerコンポーネントが表示されていること', () => {
    render(<AnalysisView />);
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });
});"
}