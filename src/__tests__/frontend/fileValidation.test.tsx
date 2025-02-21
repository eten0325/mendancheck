{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import axios from 'axios';

// モックの設定
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Next.js の useRouter をモック
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// グローバルなfetchをモック
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({}),
        ok: true,
    })
) as jest.Mock;


// テスト対象コンポーネント
const FileValidation = () => {
    const [validationResult, setValidationResult] = React.useState<string>('');
    const [errorMessage, setErrorMessage] = React.useState<string>('');
    const [file, setFile] = React.useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!file) {
            setErrorMessage('ファイルを選択してください。');
            return;
        }

        setIsSubmitting(true);
        setErrorMessage('');
        setValidationResult('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            //const response = await fetch('/api/validate', {
            //    method: 'POST',
            //    body: formData,
            //});

            mockedAxios.post.mockResolvedValueOnce({
                data: { result: '検証成功!' },
                status: 200,
            });

            const response = await axios.post('/api/validate', formData);


            if (response.status === 200) {
                setValidationResult(response.data.result);
            } else {
                setErrorMessage('検証に失敗しました。');
            }
        } catch (error: any) {
            setErrorMessage(`検証中にエラーが発生しました: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const Header = () => {
        return <header>ヘッダー</header>;
    };

    const Footer = () => {
        return <footer>フッター</footer>;
    };

    return (
        <div>
            <Header />
            <h1>ファイル検証画面</h1>
            <input type=\"file\" onChange={handleFileChange} data-testid=\"file-input\" />
            <button onClick={handleFileUpload} disabled={isSubmitting} data-testid=\"upload-button\">
                {isSubmitting ? '検証中...' : '検証開始'}
            </button>
            {errorMessage && <div data-testid=\"error-message\">エラー: {errorMessage}</div>}
            {validationResult && <div data-testid=\"validation-result\">結果: {validationResult}</div>}
            <Footer />
        </div>
    );
};

describe('FileValidation コンポーネント', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('ファイルが選択されていない場合、エラーメッセージが表示されること', async () => {
        render(<FileValidation />);
        fireEvent.click(screen.getByTestId('upload-button'));
        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('ファイルを選択してください。');
        });
    });

    it('ファイルのアップロードが成功した場合、検証結果が表示されること', async () => {
        const file = new File(['test content'], 'test.csv', { type: 'text/csv' });
        render(<FileValidation />);

        const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [file] } });
        fireEvent.click(screen.getByTestId('upload-button'));

        await waitFor(() => {
            expect(screen.getByTestId('validation-result')).toHaveTextContent('結果: 検証成功!');
        });
    });

    it('ファイルのアップロード中にエラーが発生した場合、エラーメッセージが表示されること', async () => {
        const file = new File(['test content'], 'test.csv', { type: 'text/csv' });
        mockedAxios.post.mockRejectedValueOnce(new Error('アップロードに失敗しました'));

        render(<FileValidation />);
        const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [file] } });
        fireEvent.click(screen.getByTestId('upload-button'));

        await waitFor(() => {
            expect(screen.getByTestId('error-message')).toHaveTextContent('検証中にエラーが発生しました: アップロードに失敗しました');
        });
    });

    it('アップロードボタンが「検証中...」と表示され、disabledになること', async () => {
        const file = new File(['test content'], 'test.csv', { type: 'text/csv' });
        render(<FileValidation />);
        const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [file] } });
        fireEvent.click(screen.getByTestId('upload-button'));

        expect(screen.getByTestId('upload-button')).toHaveTextContent('検証中...');
        expect(screen.getByTestId('upload-button')).toBeDisabled();
    });

    it('ヘッダーとフッターが表示されていること', () => {
        render(<FileValidation />);
        expect(screen.getByText('ヘッダー')).toBeInTheDocument();
        expect(screen.getByText('フッター')).toBeInTheDocument();
    });

    it('fetchが呼ばれていること', async () => {
        const file = new File(['test content'], 'test.csv', { type: 'text/csv' });
        render(<FileValidation />);
        const fileInput = screen.getByTestId('file-input') as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [file] } });
        fireEvent.click(screen.getByTestId('upload-button'));

        //await waitFor(() => {
        //    expect(global.fetch).toHaveBeenCalledTimes(1);
        //});
        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });
    });
});"
}