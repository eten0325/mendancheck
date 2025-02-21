{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import axios from 'axios';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock Axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Component
const Header = () => <div>Header</div>;
const Footer = () => <div>Footer</div>;

const Upload = () => {
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = React.useState('');

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setUploadStatus('ファイルを選択してください。');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            mockedAxios.post.mockResolvedValueOnce({ data: { message: 'アップロード成功' } });
            const response = await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus(response.data.message);
        } catch (error: any) {
            setUploadStatus(`アップロード失敗: ${error.message}`);
        }
    };

    return (
        <div>
            <Header />
            <h1>健康診断データアップロード画面</h1>
            <input type=\"file\" onChange={handleFileSelect} data-testid=\"file-input\" />
            <button onClick={handleFileUpload} disabled={!selectedFile} data-testid=\"upload-button\">
                アップロード
            </button>
            {uploadStatus && <div data-testid=\"upload-status\">{uploadStatus}</div>}
            <Footer />
        </div>
    );
};



describe('Upload Component', () => {
  beforeEach(() => {
    mockedAxios.post.mockClear();
  });

  it('renders successfully', () => {
    render(<Upload />);
    expect(screen.getByText('健康診断データアップロード画面')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'アップロード' })).toBeInTheDocument();
  });

  it('allows file selection', () => {
    render(<Upload />);
    const fileInput = screen.getByTestId('file-input');
    const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect((fileInput as HTMLInputElement).files?.[0]).toBe(file);
  });

  it('displays a message when no file is selected and upload is attempted', async () => {
      render(<Upload />);
      const uploadButton = screen.getByTestId('upload-button');
      fireEvent.click(uploadButton);

      await waitFor(() => {
          expect(screen.getByTestId('upload-status')).toHaveTextContent('ファイルを選択してください。');
      });
  });

  it('calls axios post on upload', async () => {
    render(<Upload />);
    const fileInput = screen.getByTestId('file-input');
    const uploadButton = screen.getByTestId('upload-button');
    const file = new File(['test content'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    mockedAxios.post.mockResolvedValueOnce({ data: { message: 'アップロード成功' } });

    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/upload',
        expect.any(FormData),
        expect.objectContaining({
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
      );
    });
  });

  it('displays success message on successful upload', async () => {
      render(<Upload />);
      const fileInput = screen.getByTestId('file-input');
      const uploadButton = screen.getByTestId('upload-button');
      const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

      fireEvent.change(fileInput, { target: { files: [file] } });
      mockedAxios.post.mockResolvedValueOnce({ data: { message: 'アップロード成功' } });

      fireEvent.click(uploadButton);

      await waitFor(() => {
          expect(screen.getByTestId('upload-status')).toHaveTextContent('アップロード成功');
      });
  });

  it('displays error message on failed upload', async () => {
      render(<Upload />);
      const fileInput = screen.getByTestId('file-input');
      const uploadButton = screen.getByTestId('upload-button');
      const file = new File(['test content'], 'test.csv', { type: 'text/csv' });

      fireEvent.change(fileInput, { target: { files: [file] } });
      mockedAxios.post.mockRejectedValueOnce(new Error('Server error'));

      fireEvent.click(uploadButton);

      await waitFor(() => {
          expect(screen.getByTestId('upload-status')).toHaveTextContent('アップロード失敗: Server error');
      });
  });

  it('Header component included', () => {
    const { container } = render(<Upload />);
    expect(container).toContainHTML('<div>Header</div>');
  });

    it('Footer component included', () => {
        const { container } = render(<Upload />);
        expect(container).toContainHTML('<div>Footer</div>');
    });
});"
}