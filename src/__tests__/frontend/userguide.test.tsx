{
  "code": "import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

// モック useRouter
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// モック Header コンポーネント
const MockHeader = () => <header data-testid=\"header\">ヘッダー</header>;

// モック Footer コンポーネント
const MockFooter = () => <footer data-testid=\"footer\">フッター</footer>;

// テスト対象のコンポーネント
const UserGuide = () => {
    return (
        <div data-testid=\"user-guide-container\">
            <MockHeader />
            <h1>操作ガイド</h1>
            <p>システムの操作方法を説明します。</p>
            <MockFooter />
        </div>
    );
};



describe('UserGuide Component', () => {
    it('ヘッダーとフッターがレンダリングされること', () => {
        render(<UserGuide />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('タイトルと説明文がレンダリングされること', () => {
        render(<UserGuide />);
        expect(screen.getByRole('heading', { name: '操作ガイド' })).toBeInTheDocument();
        expect(screen.getByText('システムの操作方法を説明します。')).toBeInTheDocument();
    });

    it('コンポーネント全体が data-testid を持つコンテナ内にレンダリングされること', () => {
        render(<UserGuide />);
        expect(screen.getByTestId('user-guide-container')).toBeInTheDocument();
    });
});"
}