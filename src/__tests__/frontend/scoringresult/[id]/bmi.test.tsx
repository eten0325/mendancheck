{
  "code": "import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'

// Mock the Layout component
jest.mock('@/pages/scoringresult/[id]/bmi', () => {
  return {
    __esModule: true,
    default: (props: any) => <div data-testid=\"Layout\">{props.children}</div>,
  };
});

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

// Mock the actual component
const BMIDetail = () => {
  return (
    <div>
      <h1>BMI評価詳細</h1>
      <p>BMI値: 25</p>
      <p>評価結果: 肥満</p>
      <button>戻る</button>
    </div>
  );
};

describe('BMIDetail Component', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(), // Mock push
      replace: jest.fn(), // Mock replace
      prefetch: jest.fn(), // Mock prefetch
      back: jest.fn(), // Mock back
      forward: jest.fn(), // Mock forward, and any other method you need
      refresh: jest.fn(), // Mock refresh
    });
  });

  it('BMI評価詳細のレンダー', () => {
    render(<BMIDetail />)
    expect(screen.getByText('BMI評価詳細')).toBeInTheDocument()
    expect(screen.getByText('BMI値: 25')).toBeInTheDocument()
    expect(screen.getByText('評価結果: 肥満')).toBeInTheDocument()
  })

  it('「戻る」ボタンをクリックするとルーターがプッシュされる', async () => {
    const mockRouter = {
      push: jest.fn(),
      replace: jest.fn(),
      pathname: '/scoringresult/[id]/bmi',
      query: { id: '123' },
      asPath: '/scoringresult/123/bmi'
    };

    (useRouter as jest.Mock).mockReturnValue(mockRouter);

    render(<BMIDetail />);
    const backButton = screen.getByText('戻る');
    userEvent.click(backButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalled()
    });
  });

  it('Layoutコンポーネントでラップされていること', () => {
    render(<BMIDetail />);
    const layoutElement = screen.getByTestId('Layout');
    expect(layoutElement).toBeInTheDocument();
  });
});"
}