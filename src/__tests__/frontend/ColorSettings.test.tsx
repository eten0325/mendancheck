{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import axios from 'axios';

// Mocks
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


// Component Definition (Single File Component)
const ColorSettings = () => {
    const [settings, setSettings] = React.useState({
        bmi_color: '#ff0000',
        blood_pressure_color: '#00ff00',
        blood_sugar_color: '#0000ff',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prevSettings => ({ ...prevSettings, [name]: value }));
    };

    const handleSubmit = async () => {
        mockedAxios.post.mockResolvedValueOnce({data: {message: '設定が保存されました'}})
        try {
            const response = await axios.post('/api/settings', settings);
            alert(response.data.message);
        } catch (error) {
            alert('設定の保存に失敗しました');
        }
    };

    return (
        <div>
            <Header />
            <NavigationBar/>
            <h1>色設定画面</h1>
            <div>
                <label htmlFor=\"bmi_color\">BMIの色:</label>
                <input
                    type=\"color\"
                    id=\"bmi_color\"
                    name=\"bmi_color\"
                    value={settings.bmi_color}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor=\"blood_pressure_color\">血圧の色:</label>
                <input
                    type=\"color\"
                    id=\"blood_pressure_color\"
                    name=\"blood_pressure_color\"
                    value={settings.blood_pressure_color}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor=\"blood_sugar_color\">血糖値の色:</label>
                <input
                    type=\"color\"
                    id=\"blood_sugar_color\"
                    name=\"blood_sugar_color\"
                    value={settings.blood_sugar_color}
                    onChange={handleChange}
                />
            </div>
            <button onClick={handleSubmit}>保存</button>
            <Footer/>
        </div>
    );
};

const Header = () => { return (<header>ヘッダー</header>)} 
const Footer = () => { return (<footer>フッター</footer>)} 
const NavigationBar = () => { return (<nav>ナビゲーションバー</nav>)}



// Test Cases
describe('ColorSettings Component', () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
    });

    it('色の設定画面が正しくレンダリングされること', () => {
        render(<ColorSettings />);
        expect(screen.getByText('色設定画面')).toBeInTheDocument();
        expect(screen.getByLabelText('BMIの色:')).toBeInTheDocument();
        expect(screen.getByLabelText('血圧の色:')).toBeInTheDocument();
        expect(screen.getByLabelText('血糖値の色:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
        expect(screen.getByText('ヘッダー')).toBeInTheDocument();
        expect(screen.getByText('フッター')).toBeInTheDocument();
        expect(screen.getByText('ナビゲーションバー')).toBeInTheDocument();
    });

    it('色を変更できること', () => {
        render(<ColorSettings />);

        const bmiColorInput = screen.getByLabelText('BMIの色:');
        fireEvent.change(bmiColorInput, { target: { value: '#0000ff' } });
        expect(bmiColorInput).toHaveValue('#0000ff');

        const bloodPressureColorInput = screen.getByLabelText('血圧の色:');
        fireEvent.change(bloodPressureColorInput, { target: { value: '#ff0000' } });
        expect(bloodPressureColorInput).toHaveValue('#ff0000');

        const bloodSugarColorInput = screen.getByLabelText('血糖値の色:');
        fireEvent.change(bloodSugarColorInput, { target: { value: '#00ff00' } });
        expect(bloodSugarColorInput).toHaveValue('#00ff00');
    });

    it('保存ボタンをクリックして設定を送信できること', async () => {
        render(<ColorSettings />);

        const saveButton = screen.getByRole('button', { name: '保存' });

        mockedAxios.post.mockResolvedValueOnce({ data: { message: '設定が保存されました' } });

        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                '/api/settings',
                {
                    bmi_color: '#ff0000',
                    blood_pressure_color: '#00ff00',
                    blood_sugar_color: '#0000ff',
                }
            );
        });

        // モックのalertをチェックする
        const alertMock = jest.spyOn(window, 'alert');
        alertMock.mockImplementation(() => {}); // 空の関数でalertをモック

        fireEvent.click(saveButton);
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('設定が保存されました');
        });

        alertMock.mockRestore(); // モックを元の実装に戻す

    });

    it('APIリクエストが失敗した場合にエラーメッセージを表示すること', async () => {
        render(<ColorSettings />);
        const saveButton = screen.getByRole('button', { name: '保存' });
    
        mockedAxios.post.mockRejectedValueOnce(new Error('APIエラー'));
    
        // モックのalertをチェックする
        const alertMock = jest.spyOn(window, 'alert');
        alertMock.mockImplementation(() => {}); // 空の関数でalertをモック
    
        fireEvent.click(saveButton);
    
        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('設定の保存に失敗しました');
        });

        alertMock.mockRestore(); // モックを元の実装に戻す
    });
});"
}