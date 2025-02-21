{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, RequestMethod } from 'node-mocks-http';
import calculate from '@/pages/api/score/calculate';
import { jest } from '@jest/globals';
import axios from 'axios';

interface MockResponse extends NextApiResponse {
    _getStatusCode(): number;
    _get_data(): string;
}


// モックデータの定義
const mockHealthData = {
    bmi: 25.0,
    systolic_blood_pressure: 130,
    diastolic_blood_pressure: 85,
    blood_sugar: 110,
    hba1c: 6.5,
    ldl_cholesterol: 120,
    tg: 150,
    ast: 35,
    alt: 40,
    gamma_gtp: 50,
};






// テストスイートの定義
describe('/api/score/calculate', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('POSTリクエストを処理し、ステータスコード200を返す', async () => {
        const { req, res } = createMocks<NextApiRequest, MockResponse>({ //変更
            method: 'POST',
            body: mockHealthData,
        });

        await calculate(req, res);

        expect(res._getStatusCode()).toBe(200);
    });

    it('無効なメソッドが使用された場合、ステータスコード405を返す', async () => {
        const { req, res } = createMocks<NextApiRequest, MockResponse>({ //変更
            method: 'GET' as RequestMethod,
        });

        await calculate(req, res);

        expect(res._getStatusCode()).toBe(405);
    });

    it('リクエストボディが存在しない場合、ステータスコード400を返す', async () => {
        const { req, res } = createMocks<NextApiRequest, MockResponse>({ //変更
            method: 'POST',
            body: null,
        });

        await calculate(req, res);

        expect(res._getStatusCode()).toBe(400);
    });

    it('リクエストボディが無効なJSONの場合、ステータスコード400を返す', async () => {
        const { req, res } = createMocks<NextApiRequest, MockResponse>({ //変更
            method: 'POST',
            body: 'invalid json',
        });

        await calculate(req, res);

        expect(res._getStatusCode()).toBe(400);
    });

    it('不正なデータ型のリクエストボディの場合、ステータスコード400を返す', async () => {
        const { req, res } = createMocks<NextApiRequest, MockResponse>({ //変更
            method: 'POST',
            body: {
                bmi: 'invalid',
                systolic_blood_pressure: 130,
                diastolic_blood_pressure: 85,
                blood_sugar: 110,
                hba1c: 6.5,
                ldl_cholesterol: 120,
                tg: 150,
                ast: 35,
                alt: 40,
                gamma_gtp: 50,
            },
        });
    
        await calculate(req, res);
    
        expect(res._getStatusCode()).toBe(400);
    });

    it('欠損したプロパティのリクエストボディの場合、ステータスコード400を返す', async () => {
        const { req, res } = createMocks<NextApiRequest, MockResponse>({ //変更
            method: 'POST',
            body: {
                systolic_blood_pressure: 130,
                diastolic_blood_pressure: 85,
                blood_sugar: 110,
                hba1c: 6.5,
                ldl_cholesterol: 120,
                tg: 150,
                ast: 35,
                alt: 40,
                gamma_gtp: 50,
            },
        });

        await calculate(req, res);

        expect(res._getStatusCode()).toBe(400);
    });

    it('提供されたデータに基づいて、成功した場合にJSONレスポンスを返す', async () => {
        const { req, res } = createMocks<NextApiRequest, MockResponse>({ //変更
            method: 'POST',
            body: mockHealthData,
        });
    
        await calculate(req, res);
    
        expect(res._getStatusCode()).toBe(200);
        try {
            const data = JSON.parse(res._get_data());
            expect(typeof data).toBe('object');
            expect(data).toHaveProperty('bmi_score');
             expect(data).toHaveProperty('blood_pressure_score');
            expect(data).toHaveProperty('blood_sugar_score');
            expect(data).toHaveProperty('lipid_score');
            expect(data).toHaveProperty('liver_function_score');
            expect(data).toHaveProperty('total_score');
        } catch (error) {
            console.error('JSON解析エラー:', error);
            throw error; // テストを失敗させるためにエラーを再スロー
        }
    });

    it('計算ロジックが正しいスコアを生成することを確認', async () => {
        const { req, res } = createMocks<NextApiRequest, MockResponse>({ //変更
            method: 'POST',
            body: mockHealthData,
        });
    
        await calculate(req, res);
        const data = JSON.parse(res._get_data());

        expect(data.bmi_score).toBeGreaterThanOrEqual(0);
        expect(data.blood_pressure_score).toBeGreaterThanOrEqual(0);
        expect(data.blood_sugar_score).toBeGreaterThanOrEqual(0);
        expect(data.lipid_score).toBeGreaterThanOrEqual(0);
        expect(data.liver_function_score).toBeGreaterThanOrEqual(0);
    
        const totalScore = data.bmi_score + data.blood_pressure_score + data.blood_sugar_score + data.lipid_score + data.liver_function_score;
        expect(data.total_score).toBe(totalScore);
    });
});

"
}