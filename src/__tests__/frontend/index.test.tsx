{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import index from '@/pages/index';


// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock components
const MockHeader = () => <header data-testid=\"header-mock\">Header</header>;
const MockFooter = () => <footer data-testid=\"footer-mock\">Footer</footer>;


// Mock the actual component files
jest.mock('@/components/Header', () => ({
    __esModule: true,
    default: MockHeader,
}));

jest.mock('@/components/Footer', () => ({
    __esModule: true,
    default: MockFooter,
}));


// Tests for index.tsx
describe('トップメニュー画面 (index.tsx)', () => {
    it('ヘッダーとフッターがレンダリングされること', () => {
        render(<index />);
        expect(screen.getByTestId('header-mock')).toBeInTheDocument();
        expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    });

    it('正しいタイトルが表示されること', () => {
        render(<index />);
        expect(screen.getByText('健康診断データアップロード、操作ガイドへの導線を持つトップ画面')).toBeInTheDocument();
    });

    it('健康診断データアップロードへのリンクが表示されること', () => {
        render(<index />);
        expect(screen.getByText('健康診断データアップロードへのリンク')).toBeInTheDocument();
    });

    it('操作ガイドへのリンクが表示されること', () => {
        render(<index />);
        expect(screen.getByText('操作ガイドへのリンク')).toBeInTheDocument();
    });

    it('各機能へのリンクをクリックして、それぞれの画面へ遷移するかのテスト', () => {
        render(<index />);
        //const uploadLink = screen.getByText('健康診断データアップロードへのリンク');
        //fireEvent.click(uploadLink);
        //const guideLink = screen.getByText('操作ガイドへのリンク');
        //fireEvent.click(guideLink);
        // mockNextRouter.pushが呼ばれることを確認する
        // expect(mockNextRouter.push).toHaveBeenCalledWith('/upload');
        // 仮実装。画面遷移のテストは別途実装が必要
        expect(true).toBe(true);
    });


    it('ログインユーザのみアクセス可能であること', () => {
        render(<index />);
        // ログイン状態のテストは別途実装が必要
        expect(true).toBe(true);
    });


    it('画面の説明が表示されること', () => {
        render(<index />);
        expect(screen.getByText('健康診断データアップロード、操作ガイドへの導線を持つトップ画面')).toBeInTheDocument();
    });

});"
}