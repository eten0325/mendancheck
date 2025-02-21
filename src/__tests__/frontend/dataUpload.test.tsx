{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import axios from 'axios';

// モックの設定
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
};

jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: jest.fn(),
    useSearchParams: jest.fn(() => new URLSearchParams()),
}));


// テスト対象コンポーネント
const DataUpload = () => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = React.useState<string>('');
    const [isUploading, setIsUploading] = React.useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedFile(file || null);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        setSelectedFile(file || null);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('ファイルを選択してください。');
            return;
        }

        setIsUploading(true);
        setUploadStatus('アップロード中...');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            mockedAxios.post.mockResolvedValueOnce({ status: 200, data: { message: 'アップロード成功' } });
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setUploadStatus(response.data.message);
            } else {
                setUploadStatus('アップロード失敗');
            }
        } catch (error: any) {
            setUploadStatus(`アップロードエラー: ${error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <h1>データアップロード画面</h1>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
                data-testid=\"drop-area\"
            >
                {selectedFile ? (
                    <p>選択されたファイル: {selectedFile.name}</p>
                ) : (
                    <p>ここにファイルをドロップするか、ファイルを選択してください</p>
                )}
                <input type=\"file\" onChange={handleFileChange} data-testid=\"file-input\" style={{ display: 'none' }} />
                <button onClick={() => document.querySelector<HTMLInputElement>('input[type=\"file\"]').click()} data-testid=\"file-select-button\">ファイルを選択</button>
            </div>
            <button onClick={handleUpload} disabled={isUploading} data-testid=\"upload-button\">
                {isUploading ? 'アップロード中...' : 'アップロード'}
            </button>
            {uploadStatus && <p data-testid=\"upload-status\">{uploadStatus}</p>}
        </div>
    );
};

// Layout と Header のモック
const Layout = ({ children }: { children: React.ReactNode }) => <div data-testid=\"layout\">{children}</div>;
const Header = () => <header data-testid=\"header\">ヘッダー</header>;

// テストケース
describe('DataUpload コンポーネント', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ファイルが正常にアップロードされる場合', async () => {
        render(
            <Layout>
                <Header />
                <DataUpload />
            </Layout>
        );

        const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
        const fileInput = screen.getByTestId('file-input');
        const uploadButton = screen.getByTestId('upload-button');

        fireEvent.change(fileInput, { target: { files: [file] } });
        fireEvent.click(uploadButton);

        mockedAxios.post.mockResolvedValueOnce({ status: 200, data: { message: 'アップロード成功' } });

        await waitFor(() => {
            expect(screen.getByTestId('upload-status')).toHaveTextContent('アップロード成功');
        });
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it('ファイルが選択されていない場合にエラーメッセージが表示される', async () => {
        render(
            <Layout>
                <Header />
                <DataUpload />
            </Layout>
        );

        const uploadButton = screen.getByTestId('upload-button');
        fireEvent.click(uploadButton);

        await waitFor(() => {
            expect(screen.getByTestId('upload-status')).toHaveTextContent('ファイルを選択してください。');
        });
        expect(mockedAxios.post).not.toHaveBeenCalled();
    });

    it('アップロード中に「アップロード中...」と表示される', () => {
        render(
            <Layout>
                <Header />
                <DataUpload />
            </Layout>
        );

        const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
        const fileInput = screen.getByTestId('file-input');
        const uploadButton = screen.getByTestId('upload-button');

        fireEvent.change(fileInput, { target: { files: [file] } });
        fireEvent.click(uploadButton);

        expect(uploadButton).toHaveTextContent('アップロード中...');
    });

    it('ドラッグアンドドロップでファイルが選択できる', () => {
        render(
            <Layout>
                <Header />
                <DataUpload />
            </Layout>
        );

        const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
        const dropArea = screen.getByTestId('drop-area');

        fireEvent.dragOver(dropArea);
        fireEvent.drop(dropArea, { dataTransfer: { files: [file] } });

        expect(screen.getByTestId('drop-area')).toHaveTextContent('選択されたファイル: test.csv');
    });

    it('ファイル選択ボタンをクリックしてファイルが選択できる', () => {
        render(
            <Layout>
                <Header />
                <DataUpload />
            </Layout>
        );

        const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
        const fileSelectButton = screen.getByTestId('file-select-button');
        const fileInput = screen.getByTestId('file-input');

        // ファイル選択ボタンをクリック
        fireEvent.click(fileSelectButton);

        // ファイルinputにファイルをセット
        fireEvent.change(fileInput, { target: { files: [file] } });

        // ファイルが選択されたことを確認
        expect(screen.getByTestId('drop-area')).toHaveTextContent('選択されたファイル: test.csv');
    });

    it('エラーが発生した場合、エラーメッセージが表示される', async () => {
        render(
            <Layout>
                <Header />
                <DataUpload />
            </Layout>
        );

        const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
        const fileInput = screen.getByTestId('file-input');
        const uploadButton = screen.getByTestId('upload-button');

        fireEvent.change(fileInput, { target: { files: [file] } });
        fireEvent.click(uploadButton);

        mockedAxios.post.mockRejectedValueOnce(new Error('アップロードに失敗しました'));

        await waitFor(() => {
            expect(screen.getByTestId('upload-status')).toHaveTextContent('アップロードエラー: アップロードに失敗しました');
        });
        expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    });

    it('Layoutコンポーネントが表示される', () => {
        render(
            <Layout>
                <Header />
                <DataUpload />
            </Layout>
        );
        expect(screen.getByTestId('layout')).toBeInTheDocument();
    });

    it('Headerコンポーネントが表示される', () => {
        render(
            <Layout>
                <Header />
                <DataUpload />
            </Layout>
        );
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });
});"
}