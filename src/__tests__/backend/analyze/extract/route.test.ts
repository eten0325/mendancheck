{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import analyzeExtractHandler from '@/pages/api/analyze/extract';
import { jest } from '@jest/globals';
import axios from 'axios';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


// Mock Supabase client and its methods
jest.mock('@supabase/supabase-js', () => {
  const mockSupabaseClient = {
    from: jest.fn(() => mockSupabaseClient),
    select: jest.fn(() => mockSupabaseClient),
    insert: jest.fn(() => mockSupabaseClient),
    update: jest.fn(() => mockSupabaseClient),
    delete: jest.fn(() => mockSupabaseClient),
    eq: jest.fn(() => mockSupabaseClient),
    single: jest.fn(() => Promise.resolve({ data: {}, error: null })),
    auth: {
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
  };

  return {
    createClient: jest.fn(() => mockSupabaseClient),
  };
});


describe('/api/analyze/extract', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GETリクエストを処理し、成功レスポンスを返す', async () => {
    const { req, res } = createMocks<NextApiRequest, MockResponse>({ method: 'GET' });

    await analyzeExtractHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._get_data()).toBe(JSON.stringify({ message: '上位抽出処理が実行されました。' }));
  });

  it('POSTリクエストを処理し、成功レスポンスを返す', async () => {
    const { req, res } = createMocks<NextApiRequest, MockResponse>({ method: 'POST', body: { percentage: 0.1 } });

    await analyzeExtractHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._get_data()).toBe(JSON.stringify({ message: '上位抽出処理が実行されました。' }));
  });

  it('PUTリクエストを処理し、許可されないメソッドとしてエラーを返す', async () => {
    const { req, res } = createMocks<NextApiRequest, MockResponse>({ method: 'PUT' });

    await analyzeExtractHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._get_data()).toBe(JSON.stringify({ message: '許可されていないメソッドです' }));
  });

  it('DELETEリクエストを処理し、許可されないメソッドとしてエラーを返す', async () => {
    const { req, res } = createMocks<NextApiRequest, MockResponse>({ method: 'DELETE' });

    await analyzeExtractHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._get_data()).toBe(JSON.stringify({ message: '許可されていないメソッドです' }));
  });

  it('POSTリクエストで不正なペイロードを処理し、エラーレスポンスを返す', async () => {
    const { req, res } = createMocks<NextApiRequest, MockResponse>({ method: 'POST', body: { invalid: 'data' } });

    await analyzeExtractHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._get_data()).toBe(JSON.stringify({ message: '上位抽出割合が指定されていません' }));
  });

  it('POSTリクエストで上位抽出割合が数値でない場合、エラーレスポンスを返す', async () => {
    const { req, res } = createMocks<NextApiRequest, MockResponse>({ method: 'POST', body: { percentage: 'string' } });

    await analyzeExtractHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._get_data()).toBe(JSON.stringify({ message: '上位抽出割合は数値で指定してください' }));
  });

  it('POSTリクエストで上位抽出割合が0より小さい場合、エラーレスポンスを返す', async () => {
      const { req, res } = createMocks<NextApiRequest, MockResponse>({ method: 'POST', body: { percentage: -0.1 } });

      await analyzeExtractHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._get_data()).toBe(JSON.stringify({ message: '上位抽出割合は0から1の間の数値を指定してください' }));
  });

  it('POSTリクエストで上位抽出割合が1より大きい場合、エラーレスポンスを返す', async () => {
      const { req, res } = createMocks<NextApiRequest, MockResponse>({ method: 'POST', body: { percentage: 1.1 } });

      await analyzeExtractHandler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._get_data()).toBe(JSON.stringify({ message: '上位抽出割合は0から1の間の数値を指定してください' }));
  });
});
"
}