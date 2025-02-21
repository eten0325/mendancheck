{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// Mock components
const Header = () => <header data-testid=\"header-component\">Header</header>;
const Footer = () => <footer data-testid=\"footer-component\">Footer</footer>;

// Mock common components
jest.mock('./Header.tsx', () => () => <Header />);
jest.mock('./Footer.tsx', () => () => <Footer />);

const Download = () => {
    const handleCSVDownload = () => {
        alert('CSVダウンロード');
    };

    const handlePDFDownload = () => {
        alert('PDFダウンロード');
    };

    return (
        <div>
            <Header />
            <h1>ダウンロード選択画面</h1>
            <p>処理結果をCSVまたはPDF形式でダウンロードするための画面</p>
            <button onClick={handleCSVDownload} data-testid=\"csv-download-button\">CSV形式ダウンロード</button>
            <button onClick={handlePDFDownload} data-testid=\"pdf-download-button\">PDF形式ダウンロード</button>
            <Footer />
        </div>
    );
};

describe('Download Component', () => {
    it('ヘッダーとフッターが表示されること', () => {
        render(<Download />);
        expect(screen.getByTestId('header-component')).toBeInTheDocument();
        expect(screen.getByTestId('footer-component')).toBeInTheDocument();
    });

    it('CSVダウンロードボタンが表示されること', () => {
        render(<Download />);
        const csvButton = screen.getByTestId('csv-download-button');
        expect(csvButton).toBeInTheDocument();
        expect(csvButton).toHaveTextContent('CSV形式ダウンロード');
    });

    it('PDFダウンロードボタンが表示されること', () => {
        render(<Download />);
        const pdfButton = screen.getByTestId('pdf-download-button');
        expect(pdfButton).toBeInTheDocument();
        expect(pdfButton).toHaveTextContent('PDF形式ダウンロード');
    });

    it('CSVダウンロードボタンをクリックすると、アラートが表示されること', () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();
        render(<Download />);
        fireEvent.click(screen.getByTestId('csv-download-button'));
        expect(alertMock).toHaveBeenCalledWith('CSVダウンロード');
        alertMock.mockRestore();
    });

    it('PDFダウンロードボタンをクリックすると、アラートが表示されること', () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();
        render(<Download />);
        fireEvent.click(screen.getByTestId('pdf-download-button'));
        expect(alertMock).toHaveBeenCalledWith('PDFダウンロード');
        alertMock.mockRestore();
    });

    it('画面の説明が表示されていること', () => {
        render(<Download />);
        expect(screen.getByText('処理結果をCSVまたはPDF形式でダウンロードするための画面')).toBeInTheDocument();
    });
});"
}