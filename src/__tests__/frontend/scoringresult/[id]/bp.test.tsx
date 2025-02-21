{
  "code": "import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { jest } from '@jest/globals';

import * as nextRouter from 'next/navigation';

// モックの設定
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

// Layout コンポーネントのモック
const MockLayout = ({ children }: { children: React.ReactNode }) => (
  <div data-testid=\"layout-component\">
    <header data-testid=\"header\">ヘッダー</header>
    <main>{children}</main>
    <footer data-testid=\"footer\">フッター</footer>
  </div>
);

// テスト対象コンポーネントのモック
const MockBPDetails = () => {
  const [systolic, setSystolic] = React.useState('120');
  const [diastolic, setDiastolic] = React.useState('80');
  const [evaluation, setEvaluation] = React.useState('正常');

  const handleChangeSystolic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSystolic(event.target.value);
  };

  const handleChangeDiastolic = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiastolic(event.target.value);
  };

  return (
    <div data-testid=\"bp-details\">
      <div>収縮期血圧: <input type=\"text\" value={systolic} onChange={handleChangeSystolic} data-testid=\"systolic\" /></div>
      <div>拡張期血圧: <input type=\"text\" value={diastolic} onChange={handleChangeDiastolic} data-testid=\"diastolic\" /></div>
      <div data-testid=\"evaluation\">評価結果: {evaluation}</div>
    </div>
  );
};

// useRouterのモック
const useRouterMock = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

// テスト対象コンポーネント（Layoutでラップ）
const TestComponent = () => (
  <MockLayout>
    <MockBPDetails />
  </MockLayout>
);

describe('血圧評価詳細コンポーネントのテスト', () => {

  beforeEach(() => {
    (nextRouter.useRouter as jest.Mock).mockReturnValue(useRouterMock);
  });

  it('Layoutコンポーネントでラップされていること', () => {
    render(<TestComponent />);
    const layoutElement = screen.getByTestId('layout-component');
    expect(layoutElement).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('収縮期血圧と拡張期血圧が表示されていること', () => {
    render(<TestComponent />);
    const systolicElement = screen.getByTestId('systolic');
    const diastolicElement = screen.getByTestId('diastolic');
    expect(systolicElement).toBeInTheDocument();
    expect(diastolicElement).toBeInTheDocument();
  });

  it('収縮期血圧の値を変更できること', async () => {
    render(<TestComponent />);
    const systolicElement = screen.getByTestId('systolic') as HTMLInputElement;
    userEvent.clear(systolicElement);
    await userEvent.type(systolicElement, '130');
    expect(systolicElement.value).toBe('130');
  });

  it('拡張期血圧の値を変更できること', async () => {
    render(<TestComponent />);
    const diastolicElement = screen.getByTestId('diastolic') as HTMLInputElement;
    userEvent.clear(diastolicElement);
    await userEvent.type(diastolicElement, '90');
    expect(diastolicElement.value).toBe('90');
  });

  it('評価結果が表示されていること', () => {
    render(<TestComponent />);
    const evaluationElement = screen.getByTestId('evaluation');
    expect(evaluationElement).toBeInTheDocument();
    expect(evaluationElement).toHaveTextContent('評価結果: 正常');
  });

  it('useRouterがモックされていること', () => {
    render(<TestComponent />);
    expect(nextRouter.useRouter).toHaveBeenCalled();
  });

  it('画面遷移関数が呼び出せること', () => {
    render(<TestComponent />);
    const { push, replace, prefetch } = nextRouter.useRouter();

    expect(push).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
    expect(prefetch).not.toHaveBeenCalled();
  });
});"
}