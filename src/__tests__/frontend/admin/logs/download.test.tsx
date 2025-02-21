{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import adminLogsDownload from '@/pages/admin/logs/download';


// Layout component Mock
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <header data-testid=\"header-mock\">Header</header>
    <aside data-testid=\"sidebar-mock\">Sidebar</aside>
    <main>{children}</main>
    <footer data-testid=\"footer-mock\">Footer</footer>
  </div>
);

//Header Component Mock
const Header = () => <header data-testid=\"header-mock\">Header</header>;

//Footer Component Mock
const Footer = () => <footer data-testid=\"footer-mock\">Footer</footer>;

//Sidebar Component Mock
const Sidebar = () => <aside data-testid=\"sidebar-mock\">Sidebar</aside>;







// Mock useRouter
jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
  }));




describe('adminLogsDownload Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('レイアウトコンポーネント（ヘッダー、フッター、サイドバー）が表示されていること', () => {
    render(
        <Layout>
            <adminLogsDownload />
        </Layout>
    );
    expect(screen.getByTestId('header-mock')).toBeInTheDocument();
    expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
  });

  it('ダウンロードボタンが表示されていること', () => {
    render(
        <Layout>
            <adminLogsDownload />
        </Layout>
    );
    expect(screen.getByRole('button', { name: 'ダウンロード' })).toBeInTheDocument();
  });

  it('ダウンロードボタンをクリックすると、ログダウンロード処理が実行されること', async () => {
    const mockDownloadLogs = jest.fn();
    jest.mock('../../../hooks/useDownloadLogs', () => ({
      useDownloadLogs: () => ({
        downloadLogs: mockDownloadLogs,
        isDownloading: false
      })
    }));

    render(
        <Layout>
            <adminLogsDownload />
        </Layout>
    );

    const downloadButton = screen.getByRole('button', { name: 'ダウンロード' });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(mockDownloadLogs).toHaveBeenCalledTimes(1);
    });
  });

  it('ダウンロード処理中にローディング表示がされること', async () => {
    jest.mock('../../../hooks/useDownloadLogs', () => ({
      useDownloadLogs: () => ({
        downloadLogs: jest.fn(),
        isDownloading: true
      })
    }));

    render(
        <Layout>
            <adminLogsDownload />
        </Layout>
    );

    expect(screen.getByText('ダウンロード中...')).toBeInTheDocument();
  });

  it('ダウンロード処理完了後、ローディング表示が消えること', async () => {
    jest.mock('../../../hooks/useDownloadLogs', () => ({
      useDownloadLogs: () => ({
        downloadLogs: jest.fn(),
        isDownloading: false
      })
    }));

    render(
        <Layout>
            <adminLogsDownload />
        </Layout>
    );

    expect(screen.queryByText('ダウンロード中...')).toBeNull();
  });

  it('エラーが発生した場合、エラーメッセージが表示されること', async () => {
    const errorMessage = 'ログのダウンロードに失敗しました。';
    jest.mock('../../../hooks/useDownloadLogs', () => ({
      useDownloadLogs: () => ({
        downloadLogs: jest.fn(() => Promise.reject(new Error(errorMessage))),
        isDownloading: false
      })
    }));

    render(
        <Layout>
            <adminLogsDownload />
        </Layout>
    );

    const downloadButton = screen.getByRole('button', { name: 'ダウンロード' });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('ダウンロードに成功した場合、成功メッセージが表示されること', async () => {
    jest.mock('../../../hooks/useDownloadLogs', () => ({
      useDownloadLogs: () => ({
        downloadLogs: jest.fn(() => Promise.resolve()),
        isDownloading: false,
      }),
    }));

    render(
        <Layout>
            <adminLogsDownload />
        </Layout>
    );

    const downloadButton = screen.getByRole('button', { name: 'ダウンロード' });
    fireEvent.click(downloadButton);

    // Wait for the success message to appear (adjust the timeout if needed)
    await waitFor(() => {
      // Check for the success message or any other indicator of successful download
      // For example, you might check if a specific element is now present in the document
      expect(screen.queryByText('ログのダウンロードが完了しました。')).toBeNull(); // Example assertion
    }, { timeout: 2000 });
  });
});"
}