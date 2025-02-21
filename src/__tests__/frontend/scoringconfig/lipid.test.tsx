{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import axios from 'axios';

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
    useSearchParams: () => new URLSearchParams(),
}));

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Layout component
const MockLayout = ({ children }: { children: React.ReactNode }) => <div data-testid=\"layout\">{children}</div>;

// Component to be tested
const LipidScoringRuleSetting = () => {
    const [ldlRange, setLdlRange] = React.useState({
        min: '',
        max: '',
    });
    const [tgRange, setTgRange] = React.useState({
        min: '',
        max: '',
    });
    const [score, setScore] = React.useState('');

    const handleLdlChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        setLdlRange({ ...ldlRange, [type]: e.target.value });
    };

    const handleTgChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
        setTgRange({ ...tgRange, [type]: e.target.value });
    };

    const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScore(e.target.value);
    };

    const handleSave = async () => {
        try {
            mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
            const response = await axios.post('/api/settings', {
                ldlRange,
                tgRange,
                score,
            });
            if (response.data.success) {
                alert('保存成功');
            }
        } catch (error) {
            console.error('保存エラー:', error);
            alert('保存エラー');
        }
    };

    return (
        <MockLayout>
            <div data-testid=\"lipid-scoring-rule-setting\">
                <div>
                    <label htmlFor=\"ldl-min\">LDLコレステロール 最小値:</label>
                    <input
                        type=\"number\"
                        id=\"ldl-min\"
                        value={ldlRange.min}
                        onChange={(e) => handleLdlChange(e, 'min')}
                    />
                    <label htmlFor=\"ldl-max\">最大値:</label>
                    <input
                        type=\"number\"
                        id=\"ldl-max\"
                        value={ldlRange.max}
                        onChange={(e) => handleLdlChange(e, 'max')}
                    />
                </div>
                <div>
                    <label htmlFor=\"tg-min\">TG 最小値:</label>
                    <input
                        type=\"number\"
                        id=\"tg-min\"
                        value={tgRange.min}
                        onChange={(e) => handleTgChange(e, 'min')}
                    />
                    <label htmlFor=\"tg-max\">最大値:</label>
                    <input
                        type=\"number\"
                        id=\"tg-max\"
                        value={tgRange.max}
                        onChange={(e) => handleTgChange(e, 'max')}
                    />
                </div>
                <div>
                    <label htmlFor=\"score\">スコア:</label>
                    <input
                        type=\"number\"
                        id=\"score\"
                        value={score}
                        onChange={handleScoreChange}
                    />
                </div>
                <button onClick={handleSave}>保存</button>
            </div>
        </MockLayout>
    );
};

describe('脂質スコアリングルール設定コンポーネント', () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
    });

    it('レイアウトコンポーネントでラップされていること', () => {
        render(<LipidScoringRuleSetting />);
        const layoutElement = screen.getByTestId('layout');
        expect(layoutElement).toBeInTheDocument();
    });

    it('LDLコレステロール、TG、スコアの入力フィールドが存在すること', () => {
        render(<LipidScoringRuleSetting />);
        expect(screen.getByLabelText('LDLコレステロール 最小値:')).toBeInTheDocument();
        expect(screen.getByLabelText('TG 最小値:')).toBeInTheDocument();
        expect(screen.getByLabelText('スコア:')).toBeInTheDocument();
    });

    it('入力フィールドへの変更がstateに反映されること', () => {
        render(<LipidScoringRuleSetting />);
        const ldlMinInput = screen.getByLabelText('LDLコレステロール 最小値:');
        fireEvent.change(ldlMinInput, { target: { value: '100' } });
        expect((ldlMinInput as HTMLInputElement).value).toBe('100');

        const tgMinInput = screen.getByLabelText('TG 最小値:');
        fireEvent.change(tgMinInput, { target: { value: '50' } });
        expect((tgMinInput as HTMLInputElement).value).toBe('50');

        const scoreInput = screen.getByLabelText('スコア:');
        fireEvent.change(scoreInput, { target: { value: '5' } });
        expect((scoreInput as HTMLInputElement).value).toBe('5');
    });

    it('保存ボタンをクリックすると、APIが呼ばれること', async () => {
        mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
        render(<LipidScoringRuleSetting />);
        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledTimes(1);
        });
    });

    it('APIが成功した場合、成功アラートが表示されること', async () => {
        const alertMock = jest.spyOn(window, 'alert');
        alertMock.mockImplementation(() => {});
        mockedAxios.post.mockResolvedValueOnce({ data: { success: true } });
        render(<LipidScoringRuleSetting />);
        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('保存成功');
        });
        alertMock.mockRestore();
    });

    it('APIが失敗した場合、エラーアラートが表示されること', async () => {
        const alertMock = jest.spyOn(window, 'alert');
        alertMock.mockImplementation(() => {});
        mockedAxios.post.mockRejectedValueOnce(new Error('APIエラー'));
        render(<LipidScoringRuleSetting />);
        const saveButton = screen.getByText('保存');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('保存エラー');
        });
        alertMock.mockRestore();
    });
});"
}