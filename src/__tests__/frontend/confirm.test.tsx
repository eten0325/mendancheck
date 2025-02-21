{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { useRouter } from 'next/navigation';

// モック
jest.mock('next/navigation');

// テスト対象コンポーネント
const Confirm = () => {
  const router = useRouter();

  const handleConfirm = () => {
    // 確認処理のロジック（実際にはAPIリクエストなど）
    alert('設定変更を確定しました！');
    router.push('/complete'); // 完了画面へ遷移
  };

  const handleBack = () => {
    router.back(); // 前の画面に戻る
  };

  return (
    <div>
      <h1>設定変更確認画面</h1>
      <p>変更内容を確認してください。</p>
      <button onClick={handleConfirm}>確定</button>
      <button onClick={handleBack}>戻る</button>
      <Header />
      <Footer />
    </div>
  );
};

const Header = () => (
  <header>
    <h2>ヘッダー</h2>
  </header>
);

const Footer = () => (
  <footer>
    <p>フッター</p>
  </footer>
);


// useRouterのモックをセットアップ
const mockedUseRouter = useRouter as jest.Mock;


describe('Confirmコンポーネント', () => {
  beforeEach(() => {
    mockedUseRouter.mockReturnValue({
      push: jest.fn(),
      back: jest.fn(),
    });
  });

  it('「設定変更確認画面」というテキストが表示されること', () => {
    render(<Confirm />);
    expect(screen.getByText('設定変更確認画面')).toBeInTheDocument();
  });

  it('「変更内容を確認してください。」というテキストが表示されること', () => {
    render(<Confirm />);
    expect(screen.getByText('変更内容を確認してください。')).toBeInTheDocument();
  });

  it('確定ボタンをクリックすると、alertが表示され、router.pushが呼び出されること', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation();
    render(<Confirm />);
    const confirmButton = screen.getByText('確定');
    fireEvent.click(confirmButton);
    expect(alertMock).toHaveBeenCalledWith('設定変更を確定しました！');
    expect(mockedUseRouter().push).toHaveBeenCalledWith('/complete');
    alertMock.mockRestore();
  });

  it('戻るボタンをクリックすると、router.backが呼び出されること', () => {
    render(<Confirm />);
    const backButton = screen.getByText('戻る');
    fireEvent.click(backButton);
    expect(mockedUseRouter().back).toHaveBeenCalled();
  });

  it('ヘッダーコンポーネントが表示されること', () => {
    render(<Confirm />);
    expect(screen.getByText('ヘッダー')).toBeInTheDocument();
  });

  it('フッターコンポーネントが表示されること', () => {
    render(<Confirm />);
    expect(screen.getByText('フッター')).toBeInTheDocument();
  });
});"
}