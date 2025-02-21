{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { useRouter, useSearchParams } from 'next/navigation';


// モックの設定
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

const Header = () => <h1>ヘッダー</h1>;
const Footer = () => <p>フッター</p>;

const EditParam = () => {
    const [percentage, setPercentage] = React.useState('');
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPercentage(e.target.value);
    };

    const handleConfirm = () => {
        router.push('/confirm');
    };

    const handleCancel = () => {
        setPercentage('');
    };

    return (
        <div>
            <Header />
            <h2>上位抽出割合編集画面</h2>
            <label htmlFor=\"percentage\">上位抽出割合:</label>
            <input
                type=\"number\"
                id=\"percentage\"
                value={percentage}
                onChange={handleChange}
            />
            <button onClick={handleConfirm}>設定変更確認</button>
            <button onClick={handleCancel}>キャンセル</button>
            <Footer />
        </div>
    );
};


describe('EditParam Component', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: jest.fn(),
        });
    });

    it('レンダリングされること', () => {
        render(<EditParam />);
        expect(screen.getByText('上位抽出割合編集画面')).toBeInTheDocument();
    });

    it('上位抽出割合が変更できること', () => {
        render(<EditParam />);
        const inputElement = screen.getByLabelText('上位抽出割合:') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: '50' } });
        expect(inputElement.value).toBe('50');
    });

    it('設定変更確認ボタンがクリックされた際にルーターが呼ばれること', () => {
        const pushMock = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
        });

        render(<EditParam />);
        const confirmButton = screen.getByText('設定変更確認');
        fireEvent.click(confirmButton);
        expect(pushMock).toHaveBeenCalledWith('/confirm');
    });

    it('キャンセルボタンがクリックされた際に割合がクリアされること', () => {
        render(<EditParam />);
        const inputElement = screen.getByLabelText('上位抽出割合:') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: '50' } });
        expect(inputElement.value).toBe('50');
        const cancelButton = screen.getByText('キャンセル');
        fireEvent.click(cancelButton);
        expect(inputElement.value).toBe('');
    });

    it('ヘッダーとフッターが表示されていること', () => {
        render(<EditParam />);
        expect(screen.getByText('ヘッダー')).toBeInTheDocument();
        expect(screen.getByText('フッター')).toBeInTheDocument();
    });
});"
}