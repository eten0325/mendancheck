{
  "code": "import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Layout コンポーネントのモック
const MockLayout = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid=\"layout-component\">{children}</div>;
};

// useRouter のモックをセットアップ
const setupMockRouter = () => {
  (useRouter as jest.Mock).mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  });

  (usePathname as jest.Mock).mockReturnValue('/');
  (useSearchParams as jest.Mock).mockReturnValue({
    get: jest.fn(),
  });
};

// コンポーネントの定義
const ScoringConfigScreen = () => {
  const router = useRouter();

  const handleBMIScoringClick = () => {
    router.push('/bmi-scoring');
  };

  const handleBloodPressureScoringClick = () => {
    router.push('/blood-pressure-scoring');
  };

  const handleBloodSugarScoringClick = () => {
    router.push('/blood-sugar-scoring');
  };

  const handleLipidScoringClick = () => {
    router.push('/lipid-scoring');
  };

  const handleLiverFunctionScoringClick = () => {
    router.push('/liver-function-scoring');
  };

  return (
    <MockLayout>
      <div>
        <h1>スコアリング設定画面</h1>
        <button onClick={handleBMIScoringClick} data-testid=\"bmi-button\">BMIスコアリングルール設定</button>
        <button onClick={handleBloodPressureScoringClick} data-testid=\"blood-pressure-button\">血圧スコアリングルール設定</button>
        <button onClick={handleBloodSugarScoringClick} data-testid=\"blood-sugar-button\">血糖値スコアリングルール設定</button>
        <button onClick={handleLipidScoringClick} data-testid=\"lipid-button\">脂質スコアリングルール設定</button>
        <button onClick={handleLiverFunctionScoringClick} data-testid=\"liver-function-button\">肝機能スコアリングルール設定</button>
      </div>
    </MockLayout>
  );
};




describe('ScoringConfigScreen コンポーネント', () => {
  beforeEach(() => {
    setupMockRouter();
  });

  it('Layout コンポーネントでラップされていること', () => {
    render(<ScoringConfigScreen />);
    const layoutElement = screen.getByTestId('layout-component');
    expect(layoutElement).toBeInTheDocument();
  });

  it('画面が表示されること', () => {
    render(<ScoringConfigScreen />);
    expect(screen.getByText('スコアリング設定画面')).toBeInTheDocument();
  });

  it('BMIスコアリングルール設定ボタンをクリックすると、/bmi-scoring に遷移すること', () => {
    render(<ScoringConfigScreen />);
    const bmiButton = screen.getByTestId('bmi-button');
    fireEvent.click(bmiButton);
    expect(useRouter().push).toHaveBeenCalledWith('/bmi-scoring');
  });

  it('血圧スコアリングルール設定ボタンをクリックすると、/blood-pressure-scoring に遷移すること', () => {
    render(<ScoringConfigScreen />);
    const bloodPressureButton = screen.getByTestId('blood-pressure-button');
    fireEvent.click(bloodPressureButton);
    expect(useRouter().push).toHaveBeenCalledWith('/blood-pressure-scoring');
  });

  it('血糖値スコアリングルール設定ボタンをクリックすると、/blood-sugar-scoring に遷移すること', () => {
    render(<ScoringConfigScreen />);
    const bloodSugarButton = screen.getByTestId('blood-sugar-button');
    fireEvent.click(bloodSugarButton);
    expect(useRouter().push).toHaveBeenCalledWith('/blood-sugar-scoring');
  });

  it('脂質スコアリングルール設定ボタンをクリックすると、/lipid-scoring に遷移すること', () => {
    render(<ScoringConfigScreen />);
    const lipidButton = screen.getByTestId('lipid-button');
    fireEvent.click(lipidButton);
    expect(useRouter().push).toHaveBeenCalledWith('/lipid-scoring');
  });

  it('肝機能スコアリングルール設定ボタンをクリックすると、/liver-function-scoring に遷移すること', () => {
    render(<ScoringConfigScreen />);
    const liverFunctionButton = screen.getByTestId('liver-function-button');
    fireEvent.click(liverFunctionButton);
    expect(useRouter().push).toHaveBeenCalledWith('/liver-function-scoring');
  });
});"
}