{
  "code": "import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '@/pages/Layout';


describe('Layout コンポーネントのテスト', () => {
  it('Layout コンポーネントが正しくレンダリングされること', () => {
    render(
      <Layout>
        <div>コンテンツ</div>
      </Layout>
    );

    expect(screen.getByText('コンテンツ')).toBeInTheDocument();
  });
});
"
}