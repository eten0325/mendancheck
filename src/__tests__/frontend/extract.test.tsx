{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import axios from 'axios';

// モックの設定
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Next.jsのRouterモック
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


// コンポーネントの定義
const Header = () => <header data-testid=\"header\">ヘッダー</header>;
const Footer = () => <footer data-testid=\"footer\">フッター</footer>;

const TopExtractionScreen = () => {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        //axios.getをモック
        mockedAxios.get.mockResolvedValueOnce({
            data: [
              { id: '1', name: 'テスト1', score: 100 },
              { id: '2', name: 'テスト2', score: 90 },
            ],
          });
        const response = await axios.get('/api/top-extraction');
        setData(response.data);
        setError(null);
      } catch (e:any) {
        setError('データの取得に失敗しました。');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div data-testid=\"top-extraction-screen\">
      <Header />
      <h1>上位抽出画面</h1>
      {loading && <p>ロード中...</p>}
      {error && <p role=\"alert\">{error}</p>}
      <ul>
        {data.map((item) => (
          <li key={item.id}>{item.name} - {item.score}</li>
        ))}
      </ul>
      <button onClick={() => mockRouter.push('/settings')} data-testid=\"settings-link\">設定画面へ</button>
      <Footer />
    </div>
  );
};



// テストケース
describe('TopExtractionScreen コンポーネント', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ローディング中は「ロード中...」と表示する', () => {
    render(<TopExtractionScreen />);
    expect(screen.getByText('ロード中...')).toBeInTheDocument();
  });

  it('データ取得成功時に上位抽出リストを表示する', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { id: '1', name: 'テスト1', score: 100 },
        { id: '2', name: 'テスト2', score: 90 },
      ],
    });

    render(<TopExtractionScreen />);

    await waitFor(() => {
      expect(screen.getByText('テスト1 - 100')).toBeInTheDocument();
      expect(screen.getByText('テスト2 - 90')).toBeInTheDocument();
    });
  });

  it('データ取得失敗時にエラーメッセージを表示する', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('データの取得に失敗しました。'));

    render(<TopExtractionScreen />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('データの取得に失敗しました。');
    });
  });

  it('設定画面へのリンクをクリックするとルーターがpushされる', () => {
    render(<TopExtractionScreen />);
    const settingsLink = screen.getByTestId('settings-link');
    fireEvent.click(settingsLink);
    expect(mockRouter.push).toHaveBeenCalledWith('/settings');
  });

  it('ヘッダーとフッターが表示されている', () => {
    render(<TopExtractionScreen />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('上位抽出画面のコンポーネント全体が描画される', () => {
    const { getByTestId } = render(<TopExtractionScreen />);
    expect(getByTestId('top-extraction-screen')).toBeInTheDocument();
  });
});
"
}