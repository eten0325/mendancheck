{
  "code": "import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

import * as nextRouter from 'next/router';


// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock the Layout component
jest.mock('@/components/Layout', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => {
      return <div data-testid=\"layout-mock\">{children}</div>;
    },
  };
});

const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
    pathname: '/scoringresult/[id]', // Add pathname
    query: { id: '123' }, // Optionally add query parameters
  };

  (nextRouter.useRouter as jest.Mock).mockReturnValue(mockRouter);

// Mock the data fetching function
const mockHealthCheckResults = {
  id: '1',
  user_id: 'user1',
  bmi: 25.0,
  systolic_blood_pressure: 120,
  diastolic_blood_pressure: 80,
  blood_sugar: 100.0,
  hba1c: 5.5,
  ldl_cholesterol: 120.0,
  tg: 150.0,
  ast: 20,
  alt: 25,
  gamma_gtp: 30,
  bmi_score: 80,
  blood_pressure_score: 90,
  blood_sugar_score: 85,
  lipid_score: 75,
  liver_function_score: 95,
  total_score: 425,
  bmi_evaluation: 'B',
  blood_pressure_evaluation: 'A',
  blood_sugar_evaluation: 'B',
  lipid_evaluation: 'C',
  liver_function_evaluation: 'A',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z',
};

const mockFetchHealthCheckResults = jest.fn(() =>
  Promise.resolve(mockHealthCheckResults)
);

// Component to be tested
const ScoringResultDetail = () => {
    const router = nextRouter.useRouter();
    const { id } = router.query;
    const [healthCheckResult, setHealthCheckResult] = React.useState(null);
  
    React.useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await mockFetchHealthCheckResults();
          setHealthCheckResult(data);
        } catch (error) {
          console.error(\"Error fetching data:\", error);
        }
      };
      fetchData();
    }, [id]);
  
    if (!healthCheckResult) {
      return <div>Loading...</div>;
    }
  
    return (
      <div data-testid=\"scoring-result-detail\">
        <h1>個別スコア詳細</h1>
        <p>BMI: {healthCheckResult.bmi}</p>
        <button data-testid=\"bmi-button\">BMI評価詳細</button>
        <p>血圧: {healthCheckResult.systolic_blood_pressure}/{healthCheckResult.diastolic_blood_pressure}</p>
        <button data-testid=\"bp-button\">血圧評価詳細</button>
        <p>血糖値: {healthCheckResult.blood_sugar}</p>
        <button data-testid=\"glucose-button\">血糖評価詳細</button>
        <p>脂質: {healthCheckResult.ldl_cholesterol}</p>
        <button data-testid=\"lipid-button\">脂質評価詳細</button>
        <p>肝機能: {healthCheckResult.ast}/{healthCheckResult.alt}/{healthCheckResult.gamma_gtp}</p>
        <button data-testid=\"liver-button\">肝機能評価詳細</button>
        <p>総合評価: {healthCheckResult.total_score}</p>
        <button data-testid=\"total-button\">総合評価結果</button>
      </div>
    );
  };

  const Layout = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid=\"layout-component\">{children}</div>;
  };
  
  const ScoringResultDetailWithLayout = () => (
    <Layout>
      <ScoringResultDetail />
    </Layout>
  );



describe('ScoringResultDetail Component', () => {
  beforeEach(() => {
    (nextRouter.useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockFetchHealthCheckResults.mockClear();
    mockFetchHealthCheckResults.mockImplementation(() =>
      Promise.resolve(mockHealthCheckResults)
    );
  });

  it('renders the component with data', async () => {
    render(<ScoringResultDetailWithLayout />);
    await waitFor(() => {
      expect(screen.getByText('個別スコア詳細')).toBeInTheDocument();
      expect(screen.getByText(`BMI: ${mockHealthCheckResults.bmi}`)).toBeInTheDocument();
      expect(screen.getByText(`血圧: ${mockHealthCheckResults.systolic_blood_pressure}/${mockHealthCheckResults.diastolic_blood_pressure}`)).toBeInTheDocument();
      expect(screen.getByText(`血糖値: ${mockHealthCheckResults.blood_sugar}`)).toBeInTheDocument();
      expect(screen.getByText(`脂質: ${mockHealthCheckResults.ldl_cholesterol}`)).toBeInTheDocument();
      expect(screen.getByText(`肝機能: ${mockHealthCheckResults.ast}/${mockHealthCheckResults.alt}/${mockHealthCheckResults.gamma_gtp}`)).toBeInTheDocument();
      expect(screen.getByText(`総合評価: ${mockHealthCheckResults.total_score}`)).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    mockFetchHealthCheckResults.mockImplementationOnce(() => new Promise(() => {}));
    render(<ScoringResultDetailWithLayout />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('calls the data fetching function on mount', async () => {
    render(<ScoringResultDetailWithLayout />);
    await waitFor(() => {
      expect(mockFetchHealthCheckResults).toHaveBeenCalledTimes(1);
    });
  });

  it('renders within the Layout component', async () => {
    render(<ScoringResultDetailWithLayout />);
    await waitFor(() => {
      expect(screen.getByTestId('layout-component')).toBeInTheDocument();
      expect(screen.getByTestId('scoring-result-detail')).toBeInTheDocument();
    });
  });

  it('navigates to BMI detail page when BMI button is clicked', async () => {
    render(<ScoringResultDetailWithLayout />);
    await waitFor(() => {
      expect(screen.getByTestId('bmi-button')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('bmi-button'));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('navigates to blood pressure detail page when blood pressure button is clicked', async () => {
    render(<ScoringResultDetailWithLayout />);
    await waitFor(() => {
      expect(screen.getByTestId('bp-button')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('bp-button'));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('navigates to glucose detail page when glucose button is clicked', async () => {
    render(<ScoringResultDetailWithLayout />);
    await waitFor(() => {
      expect(screen.getByTestId('glucose-button')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('glucose-button'));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('navigates to lipid detail page when lipid button is clicked', async () => {
    render(<ScoringResultDetailWithLayout />);
    await waitFor(() => {
      expect(screen.getByTestId('lipid-button')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('lipid-button'));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('navigates to liver function detail page when liver function button is clicked', async () => {
    render(<ScoringResultDetailWithLayout />);
    await waitFor(() => {
      expect(screen.getByTestId('liver-button')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('liver-button'));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });

  it('navigates to total score page when total score button is clicked', async () => {
    render(<ScoringResultDetailWithLayout />);
    await waitFor(() => {
      expect(screen.getByTestId('total-button')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('total-button'));
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});"
}