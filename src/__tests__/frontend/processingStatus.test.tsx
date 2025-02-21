{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        back: jest.fn(),
        forward: jest.fn(),
        refresh: jest.fn(),
        prefetch: jest.fn(),
    }),
    usePathname: jest.fn(),
    useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mock axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Header Component
const MockHeader = () => <header data-testid=\"header\">ヘッダー</header>;

// Mock Footer Component
const MockFooter = () => <footer data-testid=\"footer\">フッター</footer>;

const ProcessingStatus = () => {
    const [status, setStatus] = React.useState('処理中...');
    const [progress, setProgress] = React.useState(50);

    const handleCancel = () => {
        setStatus('キャンセルされました');
        setProgress(0);
    };

    return (
        <div>
            <MockHeader />
            <h1>処理状況画面</h1>
            <p>状態: {status}</p>
            <progress data-testid=\"progress-bar\" value={progress} max=\"100\"></progress>
            <button data-testid=\"cancel-button\" onClick={handleCancel}>キャンセル</button>
            <MockFooter />
        </div>
    );
};

describe('ProcessingStatus Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ヘッダーとフッターが表示されること', () => {
        render(<ProcessingStatus />);
        const headerElement = screen.getByTestId('header');
        const footerElement = screen.getByTestId('footer');
        expect(headerElement).toBeInTheDocument();
        expect(footerElement).toBeInTheDocument();
    });

    it('初期状態では「処理中...」と表示されること', () => {
        render(<ProcessingStatus />);
        const statusElement = screen.getByText(/状態:/);
        expect(statusElement).toHaveTextContent('状態: 処理中...');
    });

    it('初期状態ではプログレスバーが50%であること', () => {
        render(<ProcessingStatus />);
        const progressBarElement = screen.getByTestId('progress-bar') as HTMLProgressElement;
        expect(progressBarElement.value).toBe(50);
    });

    it('キャンセルボタンをクリックすると状態が「キャンセルされました」に変わり、プログレスバーが0%になること', () => {
        render(<ProcessingStatus />);
        const cancelButtonElement = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButtonElement);
        const statusElement = screen.getByText(/状態:/);
        expect(statusElement).toHaveTextContent('状態: キャンセルされました');
        const progressBarElement = screen.getByTestId('progress-bar') as HTMLProgressElement;
        expect(progressBarElement.value).toBe(0);
    });
});"
}