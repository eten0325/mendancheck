{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';

// モック useRouter
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

// モックコンポーネント
const Header = () => <header data-testid=\"header\">ヘッダー</header>;
const Footer = () => <footer data-testid=\"footer\">フッター</footer>;

// モック Layout
const Layout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid=\"layout\">
        <Header />
        {children}
        <Footer />
    </div>
);

// モックコンポーネントを定義
jest.mock('./Header', () => ({ default: Header }));
jest.mock('./Footer', () => ({ default: Footer }));
jest.mock('../components/Layout', () => ({ default: Layout }));


// テスト対象のコンポーネント
const UploadResult = () => {
    const [resultMessage, setResultMessage] = React.useState('');

    const handleSuccess = () => {
        setResultMessage('アップロード成功！');
    };

    const handleFailure = () => {
        setResultMessage('アップロード失敗...');
    };

    return (
        <Layout>
            <div data-testid=\"upload-result\">
                <h1>アップロード結果画面</h1>
                <p data-testid=\"result-message\">{resultMessage}</p>
                <button onClick={handleSuccess} data-testid=\"success-button\">成功</button>
                <button onClick={handleFailure} data-testid=\"failure-button\">失敗</button>
                <button data-testid=\"processing-button\">処理状況画面へ</button>
                <button data-testid=\"reupload-button\">再アップロード</button>
            </div>
        </Layout>
    );
};


// テストケース
describe('UploadResult コンポーネント', () => {
    it('ヘッダーとフッターが表示されていること', () => {
        render(<UploadResult />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('初期状態では結果メッセージが空であること', () => {
        render(<UploadResult />);
        expect(screen.getByTestId('result-message')).toHaveTextContent('');
    });

    it('「成功」ボタンをクリックすると成功メッセージが表示されること', () => {
        render(<UploadResult />);
        fireEvent.click(screen.getByTestId('success-button'));
        expect(screen.getByTestId('result-message')).toHaveTextContent('アップロード成功！');
    });

    it('「失敗」ボタンをクリックすると失敗メッセージが表示されること', () => {
        render(<UploadResult />);
        fireEvent.click(screen.getByTestId('failure-button'));
        expect(screen.getByTestId('result-message')).toHaveTextContent('アップロード失敗...');
    });

    it('処理状況画面への遷移ボタンと再アップロードボタンが存在すること', () => {
        render(<UploadResult />);
        expect(screen.getByTestId('processing-button')).toBeInTheDocument();
        expect(screen.getByTestId('reupload-button')).toBeInTheDocument();
    });

    it('画面タイトルが正しく表示されること', () => {
        render(<UploadResult />);
        expect(screen.getByRole('heading', { name: 'アップロード結果画面' })).toBeInTheDocument();
    });
});
"
}