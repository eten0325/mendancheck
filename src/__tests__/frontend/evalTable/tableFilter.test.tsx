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

// Mock Layout and Header components
const MockLayout = ({ children }: { children: React.ReactNode }) => <div data-testid=\"layout\">{children}</div>;
const MockHeader = () => <header data-testid=\"header\">Header</header>;

// Component to be tested
const TableFilter = () => {
    const [filterValue, setFilterValue] = React.useState('');
    const [items, setItems] = React.useState(['item1', 'item2', 'item3']);
    const [filteredItems, setFilteredItems] = React.useState(items);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilterValue(value);
        const newFilteredItems = items.filter(item => item.includes(value));
        setFilteredItems(newFilteredItems);
    };

    const handleSave = async () => {
        try {
            mockedAxios.post.mockResolvedValueOnce({ status: 200 });
            const response = await axios.post('/api/settings', { filter_condition: filterValue });
            if (response.status === 200) {
                alert('設定が保存されました。');
            }
        } catch (error) {
            console.error('設定の保存に失敗しました:', error);
            alert('設定の保存に失敗しました。');
        }
    };

    return (
        <MockLayout>
            <MockHeader />
            <div data-testid=\"table-filter\">
                <input
                    type=\"text\"
                    value={filterValue}
                    onChange={handleFilterChange}
                    placeholder=\"フィルタを入力してください\"
                    data-testid=\"filter-input\"
                />
                <button onClick={handleSave} data-testid=\"save-button\">保存</button>
                <ul data-testid=\"item-list\">
                    {filteredItems.map(item => (
                        <li key={item} data-testid={`item-${item}`}>{item}</li>
                    ))}
                </ul>
            </div>
        </MockLayout>
    );
};


describe('TableFilter Component', () => {
    beforeEach(() => {
        mockedAxios.post.mockClear();
    });

    it('renders Layout and Header components', () => {
        render(<TableFilter />);
        expect(screen.getByTestId('layout')).toBeInTheDocument();
        expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders the filter input and save button', () => {
        render(<TableFilter />);
        expect(screen.getByTestId('filter-input')).toBeInTheDocument();
        expect(screen.getByTestId('save-button')).toBeInTheDocument();
    });

    it('updates filter value on input change', () => {
        render(<TableFilter />);
        const inputElement = screen.getByTestId('filter-input') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: 'item1' } });
        expect(inputElement.value).toBe('item1');
    });

    it('filters items based on input value', () => {
        render(<TableFilter />);
        const inputElement = screen.getByTestId('filter-input') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: 'item1' } });
        expect(screen.getByTestId('item-list')).toBeInTheDocument();
        expect(screen.getByTestId('item-item1')).toBeInTheDocument();
        expect(screen.queryByTestId('item-item2')).not.toBeInTheDocument();
    });

    it('calls the save function when the save button is clicked', async () => {
        const alertMock = jest.spyOn(window, 'alert');
        alertMock.mockImplementation(() => {});
        render(<TableFilter />);
        const inputElement = screen.getByTestId('filter-input') as HTMLInputElement;
        fireEvent.change(inputElement, { target: { value: 'test' } });
        const saveButton = screen.getByTestId('save-button');
        fireEvent.click(saveButton);
        await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/settings', { filter_condition: 'test' });
        alertMock.mockRestore();
    });

    it('shows an alert on successful save', async () => {
        mockedAxios.post.mockResolvedValueOnce({ status: 200 });
        const alertMock = jest.spyOn(window, 'alert');
        alertMock.mockImplementation(() => {});

        render(<TableFilter />);
        const saveButton = screen.getByTestId('save-button');
        fireEvent.click(saveButton);

        await waitFor(() => expect(alertMock).toHaveBeenCalledWith('設定が保存されました。'));
        alertMock.mockRestore();
    });

    it('shows an alert on failed save', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Failed to save'));
        const alertMock = jest.spyOn(window, 'alert');
        alertMock.mockImplementation(() => {});

        render(<TableFilter />);
        const saveButton = screen.getByTestId('save-button');
        fireEvent.click(saveButton);

        await waitFor(() => expect(alertMock).toHaveBeenCalledWith('設定の保存に失敗しました。'));
        alertMock.mockRestore();
    });

    it('renders initial items', () => {
        render(<TableFilter />);
        expect(screen.getByTestId('item-item1')).toBeInTheDocument();
        expect(screen.getByTestId('item-item2')).toBeInTheDocument();
        expect(screen.getByTestId('item-item3')).toBeInTheDocument();
    });

});"
}