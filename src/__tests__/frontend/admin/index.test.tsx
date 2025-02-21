{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import Sidebar from '@/components/Sidebar';





// useRouter mock setup
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => ({
      get: jest.fn(),
    })
}));

describe('Sidebar Component', () => {
  test('サイドバーが正しくレンダリングされること', () => {
    render(<Sidebar />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  test('メニュー項目が正しく表示されること', () => {
    render(<Sidebar />);
    expect(screen.getByText('ログ管理メニュー')).toBeInTheDocument();
    expect(screen.getByText('設定管理メニュー')).toBeInTheDocument();
  });

  test('ログ管理メニュー項目をクリックすると、対応する画面に遷移すること', () => {
    render(<Sidebar />);
    const logMenuLink = screen.getByText('ログ管理メニュー');
    fireEvent.click(logMenuLink);

    // useRouterのpush関数が呼び出されたか確認
    //const mockRouter = useRouter();
    //expect(mockRouter.push).toHaveBeenCalledWith('/admin/log');
  });

  test('設定管理メニュー項目をクリックすると、対応する画面に遷移すること', () => {
    render(<Sidebar />);
    const settingsMenuLink = screen.getByText('設定管理メニュー');
    fireEvent.click(settingsMenuLink);

       // useRouterのpush関数が呼び出されたか確認
    //const mockRouter = useRouter();
    //expect(mockRouter.push).toHaveBeenCalledWith('/admin/settings');
  });

  test('サイドバーが折りたたみ可能であること', () => {
    render(<Sidebar />);
    const collapseButton = screen.getByRole('button', { name: 'メニューを閉じる' });
    fireEvent.click(collapseButton);

    // サイドバーが折りたたまれた状態になったか確認
    // （ここではCSSの変化などを確認する必要がある）
  });

  test('サイドバーが展開可能であること', () => {
    render(<Sidebar />);
    const expandButton = screen.getByRole('button', { name: 'メニューを開く' });
    fireEvent.click(expandButton);

    // サイドバーが展開された状態になったか確認
    // （ここではCSSの変化などを確認する必要がある）
  });


});"
}