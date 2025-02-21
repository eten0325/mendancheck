{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import Header from \"./Header\";
import Footer from \"./Footer\";


// モックの設定
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));



// テスト対象コンポーネント: 設定画面
const SettingsScreen = () => {
    const [extractionRatio, setExtractionRatio] = React.useState('');
    const [colors, setColors] = React.useState({
        A: '#38A169',
        B: '#4299E1',
        C: '#DD6B20',
        D: '#E53E3E',
    });

    const handleRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setExtractionRatio(event.target.value);
    };

    const handleColorChange = (key: string, value: string) => {
        setColors(prevColors => ({
            ...prevColors,
            [key]: value,
        }));
    };

    const handleSubmit = () => {
        // 保存処理を実装（ここではconsole.log）
        console.log('上位抽出割合:', extractionRatio);
        console.log('色の設定:', colors);
    };

    const handleCancel = () => {
        // キャンセル処理を実装（ここではアラート表示）
        alert('キャンセルしました。');
    };

    return (
        <>
            <Header />
            <div>
                <h2>設定画面</h2>
                <div>
                    <label htmlFor=\"extractionRatio\">上位抽出割合:</label>
                    <input
                        type=\"number\"
                        id=\"extractionRatio\"
                        value={extractionRatio}
                        onChange={handleRatioChange}
                    />
                </div>
                <div>
                    <label>評価結果の色設定:</label>
                    <div>
                        <label htmlFor=\"colorA\">A:</label>
                        <input
                            type=\"color\"
                            id=\"colorA\"
                            value={colors.A}
                            onChange={(e) => handleColorChange('A', e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor=\"colorB\">B:</label>
                        <input
                            type=\"color\"
                            id=\"colorB\"
                            value={colors.B}
                            onChange={(e) => handleColorChange('B', e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor=\"colorC\">C:</label>
                        <input
                            type=\"color\"
                            id=\"colorC\"
                            value={colors.C}
                            onChange={(e) => handleColorChange('C', e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor=\"colorD\">D:</label>
                        <input
                            type=\"color\"
                            id=\"colorD\"
                            value={colors.D}
                            onChange={(e) => handleColorChange('D', e.target.value)}
                        />
                    </div>
                </div>
                <button onClick={handleSubmit}>保存</button>
                <button onClick={handleCancel}>キャンセル</button>
            </div>
            <Footer/>
        </>
    );
};



// テストケース
describe('SettingsScreen コンポーネント', () => {
    it('上位抽出割合の入力フィールドが存在すること', () => {
        render(<SettingsScreen />);
        const extractionRatioInput = screen.getByLabelText('上位抽出割合:');
        expect(extractionRatioInput).toBeInTheDocument();
    });

    it('色の設定UIが存在すること', () => {
        render(<SettingsScreen />);
        expect(screen.getByLabelText('A:')).toBeInTheDocument();
        expect(screen.getByLabelText('B:')).toBeInTheDocument();
        expect(screen.getByLabelText('C:')).toBeInTheDocument();
        expect(screen.getByLabelText('D:')).toBeInTheDocument();
    });

    it('上位抽出割合の入力フィールドに値を入力できること', () => {
        render(<SettingsScreen />);
        const extractionRatioInput = screen.getByLabelText('上位抽出割合:') as HTMLInputElement;
        fireEvent.change(extractionRatioInput, { target: { value: '50' } });
        expect(extractionRatioInput.value).toBe('50');
    });

    it('色の設定を変更できること', () => {
        render(<SettingsScreen />);
        const colorAInput = screen.getByLabelText('A:') as HTMLInputElement;
        fireEvent.change(colorAInput, { target: { value: '#000000' } });
        expect(colorAInput.value).toBe('#000000');
    });

    it('保存ボタンをクリックできること', () => {
        const consoleLogMock = jest.spyOn(console, 'log');
        render(<SettingsScreen />);
        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);
        expect(consoleLogMock).toHaveBeenCalled();
    });

    it('キャンセルボタンをクリックできること', () => {
        const alertMock = jest.spyOn(window, 'alert');
        render(<SettingsScreen />);
        const cancelButton = screen.getByText('キャンセル');
        fireEvent.click(cancelButton);
        expect(alertMock).toHaveBeenCalledWith('キャンセルしました。');
    });

    it('ヘッダーコンポーネントが表示されていること', () => {
        render(<SettingsScreen />);
        expect(screen.getByRole('banner')).toBeInTheDocument(); // ヘッダーが適切なロールを持っていることを確認
    });

    it('フッターコンポーネントが表示されていること', () => {
        render(<SettingsScreen />);
        expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // フッターが適切なロールを持っていることを確認
    });
});"
}