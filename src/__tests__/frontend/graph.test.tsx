{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';

// モック化
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// テスト対象コンポーネント
const GraphScreen = () => {
  return (
    <div>
      <Header />
      <Footer />
      <h1>グラフ表示画面</h1>
      <div data-testid=\"graph-component\">グラフコンポーネント</div>
      <button onClick={() => alert('設定画面へ遷移')}>設定画面へ</button>
    </div>
  );
};

// ヘッダーコンポーネントのモック
const Header = () => <div data-testid=\"header\">ヘッダー</div>;

// フッターコンポーネントのモック
const Footer = () => <div data-testid=\"footer\">フッター</div>;

// GraphScreenのテスト
describe('GraphScreenコンポーネント', () => {
  it('ヘッダーとフッターが表示されていること', () => {
    render(<GraphScreen />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('グラフ表示画面というタイトルが表示されていること', () => {
    render(<GraphScreen />);
    expect(screen.getByText('グラフ表示画面')).toBeInTheDocument();
  });

  it('グラフコンポーネントが表示されていること', () => {
    render(<GraphScreen />);
    expect(screen.getByTestId('graph-component')).toBeInTheDocument();
  });

  it('設定画面へのボタンをクリックするとアラートが表示されること', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    render(<GraphScreen />);
    fireEvent.click(screen.getByText('設定画面へ'));
    expect(alertMock).toHaveBeenCalledWith('設定画面へ遷移');
    alertMock.mockRestore();
  });
});"
}