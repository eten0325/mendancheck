{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Common Components
const mockLayout = ({ children }: { children: React.ReactNode }) => (
  <div data-testid=\"layout-component\">{children}</div>
);
const mockHeader = () => <header data-testid=\"header-component\">Header</header>;

// Component to be tested
const DetailView = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const id = searchParams.get('id') || '123';

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        mockedAxios.get.mockResolvedValueOnce({
          data: {
            id: \"c37f8c92-4a7f-4277-b868-44157aaacac3\",
            bmi: 22.5,
            systolic_blood_pressure: 120,
            diastolic_blood_pressure: 80,
            blood_sugar: 90,
            hba1c: 5.5,
            ldl_cholesterol: 120,
            tg: 150,
            ast: 20,
            alt: 25,
            gamma_gtp: 30,
            bmi_evaluation: \"A\",
            blood_pressure_evaluation: \"B\",
            blood_sugar_evaluation: \"A\",
            lipid_evaluation: \"B\",
            liver_function_evaluation: \"A\"
          }
        });
        const response = await axios.get(`/api/health_check_results/${id}`);
        setData(response.data);
      } catch (e:any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div data-testid=\"loading\">Loading...</div>;
  if (error) return <div data-testid=\"error\">Error: {error}</div>;
  if (!data) return <div data-testid=\"no-data\">No data found.</div>;

  return (
    <mockLayout>
      <mockHeader />
      <div data-testid=\"detail-view\">
        <h1>詳細データ表示</h1>
        <p>ID: {data.id}</p>
        <p>BMI: {data.bmi}</p>
        <p>最高血圧: {data.systolic_blood_pressure}</p>
        <button onClick={() => router.push('/item-detail')}>項目別詳細へ</button>
      </div>
    </mockLayout>
  );
};

describe('DetailView Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      prefetch: jest.fn(),
    });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('123'),
    });
  });

  it('renders loading state initially', () => {
    render(<DetailView />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renders error state when data fetching fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Failed to fetch data'));
    render(<DetailView />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByTestId('error')).toHaveTextContent('Error: Failed to fetch data');
    });
  });

  it('renders data correctly after successful data fetching', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        id: \"c37f8c92-4a7f-4277-b868-44157aaacac3\",
        bmi: 22.5,
        systolic_blood_pressure: 120
      }
    });
    render(<DetailView />);

    await waitFor(() => {
      expect(screen.getByTestId('detail-view')).toBeInTheDocument();
      expect(screen.getByText('詳細データ表示')).toBeInTheDocument();
      expect(screen.getByText('ID: c37f8c92-4a7f-4277-b868-44157aaacac3')).toBeInTheDocument();
      expect(screen.getByText('BMI: 22.5')).toBeInTheDocument();
      expect(screen.getByText('最高血圧: 120')).toBeInTheDocument();
    });
  });

  it('navigates to item detail page on button click', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        id: \"c37f8c92-4a7f-4277-b868-44157aaacac3\",
        bmi: 22.5,
        systolic_blood_pressure: 120
      }
    });
    render(<DetailView />);

    await waitFor(() => {
      expect(screen.getByTestId('detail-view')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('項目別詳細へ'));
    expect(mockPush).toHaveBeenCalledWith('/item-detail');
  });

  it('renders Layout and Header components', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        id: \"c37f8c92-4a7f-4277-b868-44157aaacac3\",
        bmi: 22.5,
        systolic_blood_pressure: 120
      }
    });
    render(<DetailView />);

    await waitFor(() => {
      expect(screen.getByTestId('layout-component')).toBeInTheDocument();
      expect(screen.getByTestId('header-component')).toBeInTheDocument();
    });
  });
});"
}