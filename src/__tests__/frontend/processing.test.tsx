{
  "code": "import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import processing from '@/pages/processing';

// モックコンポーネント
const Header = () => <header data-testid=\"header-mock\">Header</header>;
const Footer = () => <footer data-testid=\"footer-mock\">Footer</footer>;

// モック useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// モック common components
jest.mock('@/components/Header', () => ({ default: Header }));
jest.mock('@/components/Footer', () => ({ default: Footer }));


describe('処理中画面コンポーネントテスト', () => {
  it('ヘッダーとフッターが表示されていること', () => {
    render(<processing />);
    expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
  });

  it('プログレスバーが存在すること', () => {
    render(<processing />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('初期の処理状況メッセージが表示されること', () => {
    render(<processing />);
    expect(screen.getByText(/処理状況：初期化中.../i)).toBeInTheDocument();
  });

  it('一定時間後に処理状況メッセージが更新されること', async () => {
    jest.useFakeTimers();
    render(<processing />);

    // 初期メッセージの確認
    expect(screen.getByText(/処理状況：初期化中.../i)).toBeInTheDocument();

    // タイマーを進めてメッセージが更新されることを確認
    jest.advanceTimersByTime(5000); // 5秒経過

    await waitFor(() => {
      expect(screen.getByText(/処理状況：データ読み込み中.../i)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('エラーが発生した場合にエラーメッセージが表示されること', async () => {
    jest.useFakeTimers();
    render(<processing />);

    // エラー発生状態にする
    const originalSetTimeout = setTimeout;
    jest.spyOn(window, 'setTimeout').mockImplementation((fn, timer) => {
      if (timer === 30000) { // 30秒後にエラーを発生させる
        fn(); // エラー発生
      }
      return originalSetTimeout(fn, timer) as any;
    });

    jest.advanceTimersByTime(30000);

    await waitFor(() => {
      expect(screen.getByText(/処理中にエラーが発生しました。/i)).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  it('リトライボタンが表示され、クリックできること', async () => {
    jest.useFakeTimers();
    render(<processing />);

    const originalSetTimeout = setTimeout;
    jest.spyOn(window, 'setTimeout').mockImplementation((fn, timer) => {
      if (timer === 30000) {
        fn();
      }
      return originalSetTimeout(fn, timer) as any;
    });

    jest.advanceTimersByTime(30000);

    await waitFor(() => {
      expect(screen.getByText(/処理中にエラーが発生しました。/i)).toBeInTheDocument();
    });

    const retryButton = screen.getByRole('button', { name: /リトライ/i });
    expect(retryButton).toBeInTheDocument();

    fireEvent.click(retryButton);
    // mockNextRouter.pushが呼ばれたかどうかを確認 (router.pushはmockされてる)
    jest.useRealTimers();
  });
});"
}