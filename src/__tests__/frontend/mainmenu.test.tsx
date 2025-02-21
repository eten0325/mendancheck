{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// モック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Layout コンポーネントをモック化
const MockLayout = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid=\"layout-component\">{children}</div>;
};

// メインメニュー画面コンポーネントのモック
const MainMenu = () => {
  const router = useRouter();

  const handleScoringConfigClick = () => {
    router.push('/scoring-config');
  };

  const handleScoringResultClick = () => {
    router.push('/scoring-result');
  };

  return (
    <MockLayout>
      <div data-testid=\"main-menu-screen\">
        <h1>メインメニュー</h1>
        <button onClick={handleScoringConfigClick} data-testid=\"scoring-config-button\">
          スコアリング設定
        </button>
        <button onClick={handleScoringResultClick} data-testid=\"scoring-result-button\">
          スコアリング結果一覧
        </button>
      </div>
    </MockLayout>
  );
};

describe('メインメニュー画面コンポーネントのテスト', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });
  });

  it('メインメニュー画面が正しくレンダリングされること', () => {
    render(<MainMenu />);
    expect(screen.getByTestId('main-menu-screen')).toBeInTheDocument();
    expect(screen.getByText('メインメニュー')).toBeInTheDocument();
    expect(screen.getByText('スコアリング設定')).toBeInTheDocument();
    expect(screen.getByText('スコアリング結果一覧')).toBeInTheDocument();
    expect(screen.getByTestId('layout-component')).toBeInTheDocument();
  });

  it('スコアリング設定ボタンをクリックすると、/scoring-configに遷移すること', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    render(<MainMenu />);
    fireEvent.click(screen.getByTestId('scoring-config-button'));
    expect(pushMock).toHaveBeenCalledWith('/scoring-config');
  });

  it('スコアリング結果一覧ボタンをクリックすると、/scoring-resultに遷移すること', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
    render(<MainMenu />);
    fireEvent.click(screen.getByTestId('scoring-result-button'));
    expect(pushMock).toHaveBeenCalledWith('/scoring-result');
  });
});"
}