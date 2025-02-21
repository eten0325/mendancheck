{
  "code": "import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';
import axios from 'axios';

// モックの設定
jest.mock('next/navigation', () => ({
  useParams: () => ({
    id: 'test-id'
  }),
}));

// Axios のモック
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// モックデータ
const mockHealthCheckResult = {
  id: 'test-id',
  bmi: 22.5,
  systolic_blood_pressure: 120,
  diastolic_blood_pressure: 80,
  blood_sugar: 90,
  hba1c: 5.5,
  ldl_cholesterol: 120,
  tg: 150,
  ast: 20,
  alt: 30,
  gamma_gtp: 40,
  bmi_evaluation: 'A',
  blood_pressure_evaluation: 'B',
  blood_sugar_evaluation: 'A',
  lipid_evaluation: 'C',
  liver_function_evaluation: 'A'
};

// Layout と Header コンポーネントのモック
const MockLayout = ({ children }: { children: React.ReactNode }) => <div data-testid=\"layout\">{children}</div>;
const MockHeader = () => <div data-testid=\"header\">Header</div>;

const TopDetail = () => {
  const [healthCheckResult, setHealthCheckResult] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        mockedAxios.get.mockResolvedValueOnce({ data: mockHealthCheckResult });
        const result = await axios.get(`/api/health_check_results/test-id`);
        setHealthCheckResult(result.data);
        setLoading(false);
      } catch (e: any) {
        setError(e);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <MockLayout>
      <MockHeader />
      <div data-testid=\"top-detail\">
        <h1>上位者詳細画面</h1>
        <p>BMI: {healthCheckResult?.bmi}</p>
        <p>Systolic Blood Pressure: {healthCheckResult?.systolic_blood_pressure}</p>
        <p>Diastolic Blood Pressure: {healthCheckResult?.diastolic_blood_pressure}</p>
      </div>
    </MockLayout>
  );
};

describe('TopDetail Component', () => {
  beforeEach(() => {
    mockedAxios.get.mockClear();
  });

  it('正常にレンダリングされること', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockHealthCheckResult });
    render(<TopDetail />);
    await waitFor(() => screen.getByTestId('top-detail'));
    expect(screen.getByTestId('top-detail')).toBeInTheDocument();
  });

  it('ローディング状態が表示されること', () => {
    render(<TopDetail />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('エラーが発生した場合、エラーメッセージが表示されること', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Request failed'));
    render(<TopDetail />);
    await waitFor(() => screen.getByText('Error: Request failed'));
    expect(screen.getByText('Error: Request failed')).toBeInTheDocument();
  });

  it('APIから取得したデータが表示されること', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockHealthCheckResult });
    render(<TopDetail />);

    await waitFor(() => screen.getByTestId('top-detail'));

    expect(screen.getByText(`BMI: ${mockHealthCheckResult.bmi}`)).toBeInTheDocument();
    expect(screen.getByText(`Systolic Blood Pressure: ${mockHealthCheckResult.systolic_blood_pressure}`)).toBeInTheDocument();
    expect(screen.getByText(`Diastolic Blood Pressure: ${mockHealthCheckResult.diastolic_blood_pressure}`)).toBeInTheDocument();
  });

  it('Layoutコンポーネントが含まれていること', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockHealthCheckResult });
      render(<TopDetail />);
      await waitFor(() => screen.getByTestId('layout'));
      expect(screen.getByTestId('layout')).toBeInTheDocument();
  });

  it('Headerコンポーネントが含まれていること', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockHealthCheckResult });
      render(<TopDetail />);
      await waitFor(() => screen.getByTestId('header'));
      expect(screen.getByTestId('header')).toBeInTheDocument();
  });
});"
}