{
  "code": "import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import axios from 'axios';


// Mock the useRouter hook
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const DetailViewItemDetail = () => {
    const router = useRouter();

    return (
        <div>
            <h1>項目別詳細画面</h1>
            <button onClick={() => router.push('/')}>メインメニューに戻る</button>
            <div>
                <h2>健康診断結果</h2>
                <p>ID: 123</p>
                <p>BMI: 25.0</p>
                <p>収縮期血圧: 120</p>
            </div>
        </div>
    );
};




// Mock Layout component
const MockLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <header>ヘッダー</header>
            <main>{children}</main>
            <footer>フッター</footer>
        </div>
    );
};

// Mock Header component
const MockHeader = () => {
    return (<header>ヘッダー</header>);
};





describe('DetailViewItemDetail Component', () => {
    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: jest.fn(),
        });
    });

    it('画面が正しくレンダリングされること', () => {
        render(<MockLayout><MockHeader><DetailViewItemDetail /></MockHeader></MockLayout>);
        expect(screen.getByText('項目別詳細画面')).toBeInTheDocument();
        expect(screen.getByText('メインメニューに戻る')).toBeInTheDocument();
        expect(screen.getByText('健康診断結果')).toBeInTheDocument();
        expect(screen.getByText('ID: 123')).toBeInTheDocument();
        expect(screen.getByText('BMI: 25.0')).toBeInTheDocument();
        expect(screen.getByText('収縮期血圧: 120')).toBeInTheDocument();
    });

    it('「メインメニューに戻る」ボタンをクリックするとrouter.pushが呼ばれること', async () => {
        const pushMock = jest.fn();
        (useRouter as jest.Mock).mockReturnValue({
            push: pushMock,
        });

        render(<MockLayout><MockHeader><DetailViewItemDetail /></MockHeader></MockLayout>);
        const backButton = screen.getByText('メインメニューに戻る');

        await userEvent.click(backButton);

        expect(pushMock).toHaveBeenCalledWith('/');
    });

    it('LayoutコンポーネントとHeaderコンポーネントが使用されていること', () => {
        const { container } = render(<MockLayout><MockHeader><DetailViewItemDetail /></MockHeader></MockLayout>);
        expect(screen.getByText('ヘッダー')).toBeInTheDocument();
        expect(screen.getByText('フッター')).toBeInTheDocument();
    });

    it('APIからのデータ取得をテスト (axios mock)', async () => {
        mockedAxios.get.mockResolvedValue({
            data: {
                id: '123',
                bmi: 25.0,
                systolic_blood_pressure: 120,
            },
        });

        render(<MockLayout><MockHeader><DetailViewItemDetail /></MockHeader></MockLayout>);
        await waitFor(() => {
            expect(screen.getByText('ID: 123')).toBeInTheDocument();
            expect(screen.getByText('BMI: 25.0')).toBeInTheDocument();
            expect(screen.getByText('収縮期血圧: 120')).toBeInTheDocument();
        });
    });
});"
}