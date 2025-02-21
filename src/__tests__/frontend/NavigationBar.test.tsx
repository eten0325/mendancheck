{
  "code": "import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavigationBar from '@/pages/NavigationBar';




describe('NavigationBarコンポーネント', () => {
  it('NavigationBarコンポーネントがレンダリングされること', () => {
    render(<NavigationBar />);

    const navigationBarElement = screen.getByRole('navigation');
    expect(navigationBarElement).toBeInTheDocument();
  });

  it('NavigationBarコンポーネントにナビゲーションリンクが存在すること', () => {
    render(<NavigationBar />);

    // ナビゲーションリンクのテキストに基づいて要素を取得
    const link1 = screen.getByText('リンク1');
    const link2 = screen.getByText('リンク2');
    const link3 = screen.getByText('リンク3');

    expect(link1).toBeInTheDocument();
    expect(link2).toBeInTheDocument();
    expect(link3).toBeInTheDocument();
  });

  it('各ナビゲーションリンクが正しいURLを指していること', () => {
    render(<NavigationBar />);

    const link1 = screen.getByText('リンク1');
    const link2 = screen.getByText('リンク2');
    const link3 = screen.getByText('リンク3');

    expect(link1).toHaveAttribute('href', '#link1');
    expect(link2).toHaveAttribute('href', '#link2');
    expect(link3).toHaveAttribute('href', '#link3');
  });
});
"
}