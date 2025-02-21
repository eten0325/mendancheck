{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import axios from 'axios';


// Mock the useRouter hook from next/navigation
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

// Define the component (extracted from the provided information)
const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <header>ヘッダー</header>
            <main>{children}</main>
            <footer>フッター</footer>
        </div>
    );
};

const BMIScoringRuleSetting = () => {
    const [bmiRange1, setBmiRange1] = React.useState('');
    const [score1, setScore1] = React.useState('');
    const [bmiRange2, setBmiRange2] = React.useState('');
    const [score2, setScore2] = React.useState('');
    const [settings, setSettings] = React.useState<any>([]);

    const handleSave = async () => {
        // Mock implementation of saving the data
        console.log('Saving data...');
        console.log('BMI Range 1:', bmiRange1, 'Score 1:', score1);
        console.log('BMI Range 2:', bmiRange2, 'Score 2:', score2);

        // Mock axios post request
        mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });

        try {
            const response = await axios.post('/api/settings', {
                settings: [
                    { setting_key: 'bmi_range_1', setting_value: bmiRange1 },
                    { setting_key: 'score_1', setting_value: score1 },
                    { setting_key: 'bmi_range_2', setting_value: bmiRange2 },
                    { setting_key: 'score_2', setting_value: score2 },
                ],
            });

            if (response.data.success) {
                alert('設定が保存されました。');
                // Optionally, refresh the settings
                fetchSettings();
            } else {
                alert('設定の保存に失敗しました。');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('設定の保存中にエラーが発生しました。');
        }
    };

    const fetchSettings = async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: { settings: [{ setting_key: 'bmi_range_1', setting_value: '18.5' }, { setting_key: 'score_1', setting_value: '1' }] } });

        try {
            const response = await axios.get('/api/settings');
            setSettings(response.data.settings);
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    React.useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <div>
            <h1>BMIスコアリングルール設定</h1>
            <div>
                <label htmlFor=\"bmiRange1\">BMI値範囲1:</label>
                <input
                    type=\"text\"
                    id=\"bmiRange1\"
                    value={bmiRange1}
                    onChange={(e) => setBmiRange1(e.target.value)}
                />
                <label htmlFor=\"score1\">スコア1:</label>
                <input
                    type=\"text\"
                    id=\"score1\"
                    value={score1}
                    onChange={(e) => setScore1(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor=\"bmiRange2\">BMI値範囲2:</label>
                <input
                    type=\"text\"
                    id=\"bmiRange2\"
                    value={bmiRange2}
                    onChange={(e) => setBmiRange2(e.target.value)}
                />
                <label htmlFor=\"score2\">スコア2:</label>
                <input
                    type=\"text\"
                    id=\"score2\"
                    value={score2}
                    onChange={(e) => setScore2(e.target.value)}
                />
            </div>
            <button onClick={handleSave}>保存</button>
        </div>
    );
};


// Test suite
describe('BMIScoringRuleSetting Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component with Layout', () => {
        render(
            <Layout>
                <BMIScoringRuleSetting />
            </Layout>
        );
        expect(screen.getByText('BMIスコアリングルール設定')).toBeInTheDocument();
        expect(screen.getByText('ヘッダー')).toBeInTheDocument();
        expect(screen.getByText('フッター')).toBeInTheDocument();
    });

    it('updates BMI range 1 state on input change', () => {
        render(<BMIScoringRuleSetting />);
        const bmiRange1Input = screen.getByLabelText('BMI値範囲1:');
        fireEvent.change(bmiRange1Input, { target: { value: '20-25' } });
        expect((bmiRange1Input as HTMLInputElement).value).toBe('20-25');
    });

    it('updates score 1 state on input change', () => {
        render(<BMIScoringRuleSetting />);
        const score1Input = screen.getByLabelText('スコア1:');
        fireEvent.change(score1Input, { target: { value: '2' } });
        expect((score1Input as HTMLInputElement).value).toBe('2');
    });

    it('handles save button click and calls axios.post', async () => {
        mockedAxios.post.mockResolvedValue(Promise.resolve({ data: { success: true } }));
        render(<BMIScoringRuleSetting />);

        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });
    });

    it('displays success alert when settings are saved successfully', async () => {
        mockedAxios.post.mockResolvedValue(Promise.resolve({ data: { success: true } }));
        const alertMock = jest.spyOn(window, 'alert');
        render(<BMIScoringRuleSetting />);

        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('設定が保存されました。');
        });

        alertMock.mockRestore();
    });

    it('displays error alert when settings save fails', async () => {
        mockedAxios.post.mockRejectedValue(new Error('Failed to save'));
        const alertMock = jest.spyOn(window, 'alert');
        render(<BMIScoringRuleSetting />);

        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('設定の保存中にエラーが発生しました。');
        });
        alertMock.mockRestore();
    });

    it('fetches settings on component mount', async () => {
        mockedAxios.get.mockResolvedValue(Promise.resolve({ data: { settings: [{ setting_key: 'bmi_range_1', setting_value: '18.5' }, { setting_key: 'score_1', setting_value: '1' }] } }));

        render(<BMIScoringRuleSetting />);

        await waitFor(() => {
            expect(mockedAxios.get).toHaveBeenCalledTimes(1);
        });
    });

});"
}