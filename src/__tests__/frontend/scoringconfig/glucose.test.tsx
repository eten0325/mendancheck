{
  "code": "import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { jest } from '@jest/globals';
import Layout from '../app/Layout';
import ScoringConfigGlucose from '../app/scoringconfig/glucose/page';


// モック useRouter
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// モック axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;


// Layout のモック
jest.mock('../app/Layout', () => {
    return {
        __esModule: true,
        default: ({ children }: { children: React.ReactNode }) => {
            return <div data-testid=\"layout-mock\">{children}</div>;
        },
    };
});


describe('ScoringConfigGlucose コンポーネント', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Layoutコンポーネントでラップされていること', () => {
        render(<ScoringConfigGlucose />);
        expect(screen.getByTestId('layout-mock')).toBeInTheDocument();
    });

    it('初期表示時に設定をAPIから取得し、フォームに表示すること', async () => {
        const mockSettings = [
            { setting_key: 'glucose_range_1', setting_value: '{\\"   } 