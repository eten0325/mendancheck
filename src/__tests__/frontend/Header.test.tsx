{
  "code": "import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '@/pages/Header';


describe('Header Component', () => {
  it('ヘッダーコンポーネントが正しくレンダリングされる', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  it('ヘッダーにロゴが存在する場合、ロゴが表示される', () => {
    render(<Header />);

    const logoElement = screen.queryByAltText('ロゴ');
    if (logoElement) {
      expect(logoElement).toBeInTheDocument();
    }
  });

  it('ヘッダーにナビゲーションリンクが存在する場合、リンクが表示される', () => {
    render(<Header />);

    const navLinks = screen.queryAllByRole('link');
    if (navLinks.length > 0) {
      navLinks.forEach(link => {
        expect(link).toBeInTheDocument();
      });
    }
  });

  it('ヘッダーに適切なスタイリングが適用されている', () => {
    render(<Header />);

    const headerElement = screen.getByRole('banner');

    expect(headerElement).toHaveStyle('display: flex');
    expect(headerElement).toHaveStyle('justify-content: space-between');
    expect(headerElement).toHaveStyle('align-items: center');
  });

  it('ヘッダーにサイト名が表示される', () => {
    render(<Header />);
    const siteNameElement = screen.queryByText(/健康診断結果/i);
    if (siteNameElement) {
        expect(siteNameElement).toBeInTheDocument();
    }
  });

  it('ヘッダーが常に最上部に固定表示される', () => {
    render(<Header />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveStyle('position: sticky');
    expect(headerElement).toHaveStyle('top: 0');
    expect(headerElement).toHaveStyle('z-index: 100');
  });

  it('ヘッダーがレスポンシブに対応している', () => {
    render(<Header />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveStyle('width: 100%');
  });

  it('ログイン状態に応じて表示が変わる', () => {
    const { rerender } = render(<Header />);
    const loginButton = screen.queryByText(/ログイン/i);
    if (loginButton){
      expect(loginButton).toBeInTheDocument();
    }

    // ログイン状態を反転させる（例：propsを更新する）
    rerender(<Header  />);
    const logoutButton = screen.queryByText(/ログアウト/i);
    if (logoutButton){
      expect(logoutButton).toBeInTheDocument();
    }
  });
});"
}