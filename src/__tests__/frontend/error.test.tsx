{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import Layout from '../app/Layout';
import Header from '../app/Header';

// モック用のRouter
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


const ErrorPage = () => {
  return (
    <Layout>
      <Header/>
      <div>
        <h1>エラーが発生しました</h1>
        <p>システムエラーが発生しました。もう一度お試しください。</p>
        <button onClick={() => {}}>再試行</button>
        <a href=\"/\">メイン画面へ</a>
      </div>
    </Layout>
  );
};








describe('ErrorPage コンポーネント', () => {
  it('エラーメッセージが表示されること', () => {
    render(<ErrorPage />);
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    expect(screen.getByText('システムエラーが発生しました。もう一度お試しください。')).toBeInTheDocument();
  });

  it('再試行ボタンが存在すること', () => {
    render(<ErrorPage />);
    expect(screen.getByText('再試行')).toBeInTheDocument();
  });

  it('メイン画面へのリンクが存在すること', () => {
    render(<ErrorPage />);
    const mainPageLink = screen.getByText('メイン画面へ');
    expect(mainPageLink).toBeInTheDocument();
    expect(mainPageLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('再試行ボタンをクリックできること', () => {
    render(<ErrorPage />);
    const retryButton = screen.getByText('再試行');
    fireEvent.click(retryButton);
    // ここで再試行の処理が適切に呼び出されることを確認するテストを追加できます。
  });

  it('Layoutコンポーネントがレンダリングされること', () => {
    render(<ErrorPage />);
    expect(screen.getByTestId('layout-container')).toBeInTheDocument();
  });

  it('Headerコンポーネントがレンダリングされること', () => {
    render(<ErrorPage />);
    expect(screen.getByTestId('header-container')).toBeInTheDocument();
  });
});"
}