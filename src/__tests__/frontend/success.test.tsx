{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';

// モックコンポーネントの定義
const MockLayout = ({ children }: { children: React.ReactNode }) => (
  <div data-testid=\"layout-component\">
    <header data-testid=\"header-component\">Header</header>
    <main>{children}</main>
  </div>
);

const MockHeader = () => <header data-testid=\"header-component\">Header</header>;

// モックコンポーネントのオーバーライド（必要に応じて）
jest.mock('@/pages/Layout', () => ({__esModule: true, default: MockLayout}));
jest.mock('@/pages/Header', () => ({__esModule: true, default: MockHeader}));

// テスト対象のコンポーネント
const SuccessScreen = () => {
  return (
    <div data-testid=\"success-screen\">
      <h1>処理完了</h1>
      <p>CSVファイルの処理が完了しました。</p>
      <a href=\"/result\" data-testid=\"result-link\">結果表示画面へ</a>
      <a href=\"/main\" data-testid=\"main-link\">メイン画面へ</a>
    </div>
  );
};



describe('SuccessScreen コンポーネント', () => {
  it('画面が正しくレンダリングされること', () => {
    render(<SuccessScreen />);
    expect(screen.getByTestId('success-screen')).toBeInTheDocument();
    expect(screen.getByText('処理完了')).toBeInTheDocument();
    expect(screen.getByText('CSVファイルの処理が完了しました。')).toBeInTheDocument();
    expect(screen.getByTestId('result-link')).toBeInTheDocument();
    expect(screen.getByTestId('main-link')).toBeInTheDocument();
  });

  it('LayoutコンポーネントとHeaderコンポーネントがレンダリングされること', () => {
    render(<SuccessScreen />);
    expect(screen.getByTestId('layout-component')).toBeInTheDocument();
    expect(screen.getByTestId('header-component')).toBeInTheDocument();
  });

  it('結果表示画面へのリンクをクリックできること', () => {
    const pushMock = jest.fn();
    global.mockNextRouter = { push: pushMock, replace: jest.fn(), back: jest.fn(), forward: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() };
    render(<SuccessScreen />);
    const resultLink = screen.getByTestId('result-link');
    fireEvent.click(resultLink);
    // @ts-ignore
    expect(global.mockNextRouter.push).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(global.mockNextRouter.push).toHaveBeenCalledWith('/result');
  });

  it('メイン画面へのリンクをクリックできること', () => {
    const pushMock = jest.fn();
    global.mockNextRouter = { push: pushMock, replace: jest.fn(), back: jest.fn(), forward: jest.fn(), refresh: jest.fn(), prefetch: jest.fn() };
    render(<SuccessScreen />);
    const mainLink = screen.getByTestId('main-link');
    fireEvent.click(mainLink);
    // @ts-ignore
    expect(global.mockNextRouter.push).toHaveBeenCalledTimes(1);
    // @ts-ignore
    expect(global.mockNextRouter.push).toHaveBeenCalledWith('/main');
  });
});"
}