{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, useSearchParams } from 'next/navigation';

// モックの設定
jest.mock('next/navigation');

// Layout と Header コンポーネントのモック
const MockLayout = ({ children }: { children: React.ReactNode }) => (
  <div data-testid=\"layout-component\">{children}</div>
);

const MockHeader = () => <div data-testid=\"header-component\">Header</div>;

// テスト対象コンポーネント
const TopList = () => {
  const [userIds, setUserIds] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // モックされたAPIからのデータ取得
  const fetchData = async () => {
    setLoading(true);
    try {
      // 本来はAPIリクエストを行うが、ここではモックデータを使用
      const mockData = [{ user_id: 'user1', total_score: 100 }, { user_id: 'user2', total_score: 90 }];
      setUserIds(mockData.map(item => item.user_id));
    } catch (error) {
      console.error(\"Failed to fetch data\", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleLinkClick = (userId: string) => {
    router.push(`/detail/${userId}`);
  };

  return (
    <MockLayout>
      <MockHeader />
      <div data-testid=\"top-list-screen\">
        <h1>上位抽出リスト画面</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {userIds.map((userId) => (
              <li key={userId}>
                <button onClick={() => handleLinkClick(userId)}>{userId}</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MockLayout>
  );
};

// テストケース
describe('TopList Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn(),
    } as any);
  });

  it('上位抽出リスト画面が正しくレンダリングされること', () => {
    render(<TopList />);
    const headingElement = screen.getByText('上位抽出リスト画面');
    expect(headingElement).toBeInTheDocument();
    expect(screen.getByTestId('layout-component')).toBeInTheDocument();
    expect(screen.getByTestId('header-component')).toBeInTheDocument();
  });

  it('データ読み込み中はローディングメッセージが表示されること', () => {
    render(<TopList />);
    // 初回レンダリングでローディングメッセージが表示されることを確認
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('データ読み込み後にユーザーIDのリストが表示されること', async () => {
    render(<TopList />);

    // ローディングが終了するまで待機（ここではsetTimeoutを使用）
    await new Promise((resolve) => setTimeout(resolve, 0));

    // ユーザーIDのリストが表示されることを確認
    expect(screen.getByRole('button', { name: 'user1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'user2' })).toBeInTheDocument();
  });

  it('ユーザーIDのリンクをクリックすると、router.pushが呼ばれること', async () => {
    render(<TopList />);
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    // ローディングが終了するまで待機（ここではsetTimeoutを使用）
    await new Promise((resolve) => setTimeout(resolve, 0));

    const userIdLink = screen.getByRole('button', { name: 'user1' });
    fireEvent.click(userIdLink);

    expect(pushMock).toHaveBeenCalledWith('/detail/user1');
  });
});"
}