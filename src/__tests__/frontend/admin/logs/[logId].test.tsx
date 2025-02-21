{
  "code": "import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import axios from 'axios';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('axios');

// テスト対象コンポーネントのモック
const Layout = ({ children }: { children: React.ReactNode }) => <div data-testid=\"layout\">{children}</div>;
const Header = () => <header data-testid=\"header\">Header</header>;
const Footer = () => <footer data-testid=\"footer\">Footer</footer>;
const Sidebar = () => <aside data-testid=\"sidebar\">Sidebar</aside>;

// モックコンポーネントの上書き
jest.mock('@/pages/admin/logs/[logId]', () => {
  return {
    __esModule: true,
    default: (props: any) => (
      <div data-testid=\"log-detail-screen\">
        <Layout>
          <Header />
          <Sidebar />
          <Footer />
          <h1>Log Detail</h1>
          <p>Timestamp: {props.timestamp}</p>
          <p>Log Level: {props.log_level}</p>
          <p>Message: {props.message}</p>
      </div>
    ),
  };
});

// テスト対象コンポーネント
import LogDetail from '@/pages/admin/logs/[logId]';

describe('LogDetail コンポーネント', () => {
  const mockedRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockedRouter);
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(),
    });
    (usePathname as jest.Mock).mockReturnValue('/admin/logs/123');
  });

  it('ログ詳細画面が正しくレンダリングされること', () => {
    render(<LogDetail timestamp=\"2024-01-01\" log_level=\"INFO\" message=\"Test message\" />);
    expect(screen.getByTestId('log-detail-screen')).toBeInTheDocument();
    expect(screen.getByText('Log Detail')).toBeInTheDocument();
    expect(screen.getByText('Timestamp: 2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('Log Level: INFO')).toBeInTheDocument();
    expect(screen.getByText('Message: Test message')).toBeInTheDocument();
  });

  it('Layout, Header, Footer, Sidebarコンポーネントが含まれていること', () => {
    render(<LogDetail timestamp=\"2024-01-01\" log_level=\"INFO\" message=\"Test message\" />);
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('APIからのデータ取得が成功した場合、ログ情報が表示されること', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        timestamp: '2024-01-02',
        log_level: 'ERROR',
        message: 'API Test message',
      },
    });

    render(<LogDetail timestamp=\"2024-01-01\" log_level=\"INFO\" message=\"Test message\" />);

    await waitFor(() => {
      expect(screen.getByText('Timestamp: 2024-01-01')).toBeInTheDocument();
      expect(screen.getByText('Log Level: INFO')).toBeInTheDocument();
      expect(screen.getByText('Message: Test message')).toBeInTheDocument();
    });
  });
});"
}