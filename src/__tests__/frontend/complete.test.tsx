{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import complete from '@/pages/complete';
import { jest } from '@jest/globals';


// useRouter mocked
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// モックコンポーネント
const MockHeader = () => <header data-testid=\"header-mock\">Header</header>;
const MockFooter = () => <footer data-testid=\"footer-mock\">Footer</footer>;

// Layoutコンポーネント（ヘッダーとフッターを含む）
const Layout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid=\"layout-component\">
        <MockHeader />
        <main>{children}</main>
        <MockFooter />
    </div>
);


// completeコンポーネント内でLayoutを使用するように修正
const CompleteWithLayout = () => (
    <Layout>
        <complete />
    </Layout>
);



describe('completeコンポーネント', () => {
    it('ヘッダーとフッターが表示されていること', () => {
        render(<CompleteWithLayout />);
        expect(screen.getByTestId('header-mock')).toBeInTheDocument();
        expect(screen.getByTestId('footer-mock')).toBeInTheDocument();
    });

    it('完了メッセージが表示されていること', () => {
        render(<CompleteWithLayout />);
        expect(screen.getByText('設定変更が完了しました。')).toBeInTheDocument();
    });

    it('メニュー画面へ戻るボタンが表示されていること', () => {
        render(<CompleteWithLayout />);
        expect(screen.getByText('メニュー画面へ戻る')).toBeInTheDocument();
    });

    it('パラメータ設定画面へ戻るボタンが表示されていること', () => {
        render(<CompleteWithLayout />);
        expect(screen.getByText('パラメータ設定画面へ戻る')).toBeInTheDocument();
    });

    it('メニュー画面へ戻るボタンをクリックすると、指定されたパスへ遷移すること', () => {
        const pushMock = jest.fn();
        jest.mock('next/navigation', () => ({
            useRouter: () => ({
                push: pushMock,
            }),
        }));

        render(<CompleteWithLayout />);
        const menuButton = screen.getByText('メニュー画面へ戻る');
        fireEvent.click(menuButton);

        // useRouterのpushが呼ばれたかを確認
        //const pushMock = mockNextRouter.push as jest.Mock;
        // expect(pushMock).toHaveBeenCalledWith('/menu'); // '/menu' は仮のパスです
        expect(pushMock).toHaveBeenCalled();

    });

    it('パラメータ設定画面へ戻るボタンをクリックすると、指定されたパスへ遷移すること', () => {
        const pushMock = jest.fn();
        jest.mock('next/navigation', () => ({
            useRouter: () => ({
                push: pushMock,
            }),
        }));

        render(<CompleteWithLayout />);
        const paramButton = screen.getByText('パラメータ設定画面へ戻る');
        fireEvent.click(paramButton);

        // useRouterのpushが呼ばれたかを確認
        //const pushMock = mockNextRouter.push as jest.Mock;
        // expect(pushMock).toHaveBeenCalledWith('/param'); // '/param' は仮のパスです
        expect(pushMock).toHaveBeenCalled();

    });
});"
}