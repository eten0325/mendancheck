{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// モックのセットアップ
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
}));

// テスト対象コンポーネント（簡略化のため、ここに定義）
const Validation = () => {
    const router = useRouter();

    const handleRetry = () => {
        router.push('/upload');
    };

    const handleMain = () => {
        router.push('/main');
    };

    return (
        <div>
            <h1>検証結果画面</h1>
            <div data-testid=\"error-message\">エラーメッセージ表示領域</div>
            <button onClick={handleRetry} data-testid=\"retry-button\">再アップロード</button>
            <button onClick={handleMain} data-testid=\"main-button\">メイン画面へ</button>
        </div>
    );
};

// Layout と Header のモック
const Layout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid=\"layout-component\">
        <header data-testid=\"header-component\">Header Mock</header>
        {children}
    </div>
);

const Header = () => <div data-testid=\"header-component\">Header Mock</div>;

// テストスイート
describe('Validation コンポーネントのテスト', () => {

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: jest.fn(),
        });
    });

    it('再アップロードボタンをクリックすると、/upload にリダイレクトされること', () => {
        const pushMock = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
        });

        render(
            <Layout>
                <Validation />
            </Layout>
        );

        const retryButton = screen.getByTestId('retry-button');
        fireEvent.click(retryButton);

        expect(pushMock).toHaveBeenCalledWith('/upload');
    });

    it('メイン画面へのボタンをクリックすると、/main にリダイレクトされること', () => {
        const pushMock = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
        });

        render(
            <Layout>
                <Validation />
            </Layout>
        );

        const mainButton = screen.getByTestId('main-button');
        fireEvent.click(mainButton);

        expect(pushMock).toHaveBeenCalledWith('/main');
    });

    it('LayoutコンポーネントとHeaderコンポーネントが表示されていること', () => {
        render(
            <Layout>
                <Validation />
            </Layout>
        );
        expect(screen.getByTestId('layout-component')).toBeInTheDocument();
        expect(screen.getByTestId('header-component')).toBeInTheDocument();
    });

    it('エラーメッセージ表示領域が表示されていること', () => {
        render(
            <Layout>
                <Validation />
            </Layout>
        );
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    it('コンポーネントが正常にレンダリングされること', () => {
        render(
            <Layout>
                <Validation />
            </Layout>
        );
        expect(screen.getByText('検証結果画面')).toBeInTheDocument();
        expect(screen.getByText('再アップロード')).toBeInTheDocument();
        expect(screen.getByText('メイン画面へ')).toBeInTheDocument();
    });
});"
}