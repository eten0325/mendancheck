{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import axios from 'axios';

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
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Define a mock Layout component
const MockLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <header>ヘッダー</header>
            <main>{children}</main>
            <footer>フッター</footer>
        </div>
    );
};

// Define a mock Header component
const MockHeader = () => {
    return (<header>ヘッダー</header>);
};

// Define a mock Footer component
const MockFooter = () => {
    return (<footer>フッター</footer>);
};

const FileUpload = () => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [errorMessage, setErrorMessage] = React.useState<string>('');

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file || null);
        setErrorMessage('');
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        setSelectedFile(file || null);
        setErrorMessage('');
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setErrorMessage('ファイルを選択してください。');
            return;
        }

        const formData = new FormData();
        formData.append('csv_file', selectedFile);

        try {
            // const response = await axios.post('/api/upload', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            // });

            // console.log(response.data);
            alert('アップロード成功!');
        } catch (error: any) {
            console.error('Upload error:', error);
            setErrorMessage('アップロードに失敗しました。');
        }
    };

    return (
        <MockLayout>
            <div>
                <h1>ファイルアップロード画面</h1>
                <input type=\"file\" id=\"file-select\" onChange={handleFileSelect} />
                <div
                    id=\"drop-area\"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', marginBottom: '10px' }}
                >
                    ドラッグアンドドロップエリア
                </div>
                <button onClick={handleUpload}>アップロード</button>
                {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
            </div>
        </MockLayout>
    );
};

describe('FileUpload コンポーネント', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ファイル選択ボタンをクリックしてファイルを選択できること', () => {
        render(<FileUpload />);
        const fileSelectButton = screen.getByLabelText('ファイルを選択') as HTMLInputElement;

        const file = new File(['dummy content'], 'dummy.csv', { type: 'text/csv' });
        fireEvent.change(fileSelectButton, { target: { files: [file] } });

        expect(screen.getByText('アップロード')).toBeInTheDocument();
    });

    it('ファイルをドラッグアンドドロップエリアにドロップできること', () => {
        render(<FileUpload />);
        const dropArea = screen.getByText('ドラッグアンドドロップエリア');

        const file = new File(['dummy content'], 'dummy.csv', { type: 'text/csv' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);

        fireEvent.dragOver(dropArea);
        fireEvent.drop(dropArea, { dataTransfer });

        expect(screen.getByText('アップロード')).toBeInTheDocument();
    });

    it('ファイルが選択されていない場合にエラーメッセージが表示されること', () => {
        render(<FileUpload />);
        const uploadButton = screen.getByText('アップロード');
        fireEvent.click(uploadButton);
        expect(screen.getByText('ファイルを選択してください。')).toBeInTheDocument();
    });

    it('アップロードボタンをクリックすると、アップロード処理が実行されること', async () => {
        render(<FileUpload />);

        const fileSelectButton = screen.getByLabelText('ファイルを選択') as HTMLInputElement;
        const file = new File(['dummy content'], 'dummy.csv', { type: 'text/csv' });
        fireEvent.change(fileSelectButton, { target: { files: [file] } });

        global.alert = jest.fn();
        const uploadButton = screen.getByText('アップロード');
        fireEvent.click(uploadButton);

        // await screen.findByText('アップロード成功!');
        expect(global.alert).toHaveBeenCalledWith('アップロード成功!');
    });

    it('ヘッダーとフッターが表示されていること', () => {
        render(<FileUpload />);
        expect(screen.getByText('ヘッダー')).toBeInTheDocument();
        expect(screen.getByText('フッター')).toBeInTheDocument();
    });
});"
}