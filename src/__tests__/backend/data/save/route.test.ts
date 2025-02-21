{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, RequestMethod } from 'node-mocks-http';
import handler from '@/pages/api/data/save';
import { jest } from '@jest/globals';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

jest.mock('@supabase/supabase-js', () => {
  const mockSupabaseClient = {
    from: jest.fn(() => ({
      insert: jest.fn(() => Promise.resolve({ data: [{}], error: null })), // 成功時のモック
      select: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
      update: jest.fn(() => Promise.resolve({ data: [{}], error: null })), 
      delete: jest.fn(() => Promise.resolve({ data: [{}], error: null })), 
    })),
    auth: {
      getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'mockUserId' } }, error: null })), // 認証成功時のモック
    }
  };

  return {
    createClient: jest.fn(() => mockSupabaseClient),
  };
});


describe('/api/data/save', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POSTリクエストを処理し、データを保存する', async () => {
    const mockBody = {
      id: 'some-uuid',
      userId: 'user123',
      bmi: 22.5,
      systolic_blood_pressure: 120,
      diastolic_blood_pressure: 80,
      blood_sugar: 90,
      hba1c: 5.5,
      ldl_cholesterol: 100,
      tg: 150,
      ast: 25,
      alt: 30,
      gamma_gtp: 40,
      bmi_score: 80,
      blood_pressure_score: 90,
      blood_sugar_score: 75,
      lipid_score: 85,
      liver_function_score: 95,
      total_score: 425,
      bmi_evaluation: 'A',
      blood_pressure_evaluation: 'B',
      blood_sugar_evaluation: 'A',
      lipid_evaluation: 'B',
      liver_function_evaluation: 'A',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: mockBody,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual({
      message: 'データは正常に保存されました。',
    });
  });

  it('GETリクエストに対して405エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._get_data())).toEqual({
      error: '許可されていないメソッドです',
    });
  });

  it('認証エラーが発生した場合、401エラーを返す', async () => {
    jest.mock('@supabase/supabase-js', () => {
      const mockSupabaseClient = {
        from: jest.fn(() => ({
          insert: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
          select: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
          update: jest.fn(() => Promise.resolve({ data: [{}], error: null })), 
          delete: jest.fn(() => Promise.resolve({ data: [{}], error: null })), 
        })),
        auth: {
          getUser: jest.fn(() => Promise.resolve({ data: { user: null }, error: new Error('認証エラー') })), // 認証失敗時のモック
        }
      };
    
      return {
        createClient: jest.fn(() => mockSupabaseClient),
      };
    });

    const mockBody = {
        id: 'some-uuid',
        userId: 'user123',
        bmi: 22.5,
        systolic_blood_pressure: 120,
        diastolic_blood_pressure: 80,
        blood_sugar: 90,
        hba1c: 5.5,
        ldl_cholesterol: 100,
        tg: 150,
        ast: 25,
        alt: 30,
        gamma_gtp: 40,
        bmi_score: 80,
        blood_pressure_score: 90,
        blood_sugar_score: 75,
        lipid_score: 85,
        liver_function_score: 95,
        total_score: 425,
        bmi_evaluation: 'A',
        blood_pressure_evaluation: 'B',
        blood_sugar_evaluation: 'A',
        lipid_evaluation: 'B',
        liver_function_evaluation: 'A',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: mockBody,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._get_data())).toEqual({
      error: '認証が必要です',
    });
  });

  it('不正なJSONデータが提供された場合、400エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '不正なJSON',
    });
  
    await handler(req, res);
  
    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._get_data())).toEqual({
      error: '無効なJSON形式です',
    });
  });
  
  it('必須フィールドが欠落している場合、400エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}), 
    });
  
    await handler(req, res);
  
    expect(res._getStatusCode()).toBe(400);

  });

  it('Supabaseへの挿入が失敗した場合、500エラーを返す', async () => {
    jest.mock('@supabase/supabase-js', () => {
      const mockSupabaseClient = {
        from: jest.fn(() => ({
          insert: jest.fn(() => Promise.resolve({ data: null, error: new Error('データベースエラー') })),
          select: jest.fn(() => Promise.resolve({ data: [{}], error: null })),
          update: jest.fn(() => Promise.resolve({ data: [{}], error: null })), 
          delete: jest.fn(() => Promise.resolve({ data: [{}], error: null })), 
        })),
        auth: {
          getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'mockUserId' } }, error: null })), // 認証成功時のモック
        }
      };
    
      return {
        createClient: jest.fn(() => mockSupabaseClient),
      };
    });

    const mockBody = {
        id: 'some-uuid',
        userId: 'user123',
        bmi: 22.5,
        systolic_blood_pressure: 120,
        diastolic_blood_pressure: 80,
        blood_sugar: 90,
        hba1c: 5.5,
        ldl_cholesterol: 100,
        tg: 150,
        ast: 25,
        alt: 30,
        gamma_gtp: 40,
        bmi_score: 80,
        blood_pressure_score: 90,
        blood_sugar_score: 75,
        lipid_score: 85,
        liver_function_score: 95,
        total_score: 425,
        bmi_evaluation: 'A',
        blood_pressure_evaluation: 'B',
        blood_sugar_evaluation: 'A',
        lipid_evaluation: 'B',
        liver_function_evaluation: 'A',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: mockBody,
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({
      error: 'データベースエラーが発生しました',
    });
  });

});"
}