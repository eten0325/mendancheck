{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import updateHandler from '@/pages/api/config/update';

import { jest } from '@jest/globals';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

// Supabaseクライアントのモック
const mockSupabaseClient = {
  from: jest.fn(() => ({
    update: jest.fn(() => ({
      eq: jest.fn(() => Promise.resolve({ data: [{ id: 'mock-id' }], error: null }))
    }))
  }))
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

describe('/api/config/update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('PUTリクエストを処理し、パラメータを正常に更新する', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: {
        id: 'mock-id',
        setting_key: 'top_extraction_ratio',
        setting_value: '0.1'
      },
    });

    await updateHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual(expect.objectContaining({ message: 'パラメータが更新されました' }));
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('settings');
    expect(mockSupabaseClient.from('settings').update).toHaveBeenCalled();
    expect(mockSupabaseClient.from('settings').update().eq).toHaveBeenCalledWith('id', 'mock-id');
  });

  it('PUTリクエストでIDが存在しない場合に400エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: {
        setting_key: 'top_extraction_ratio',
        setting_value: '0.1'
      },
    });

    await updateHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._get_data())).toEqual(expect.objectContaining({ error: 'IDが提供されていません' }));
  });

  it('PUTリクエストでContent-Typeヘッダーがない場合に400エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'PUT',
      body: {
        id: 'mock-id',
        setting_key: 'top_extraction_ratio',
        setting_value: '0.1'
      },
    });

    await updateHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._get_data())).toEqual(expect.objectContaining({ error: 'Content-Typeヘッダーがapplication/jsonではありません' }));
  });

  it('PUTリクエストで設定キーと設定値が存在しない場合に400エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: {
        id: 'mock-id',
      },
    });

    await updateHandler(req, res);

    expect(res._getStatusCode()).toBe(400);

    const responseData = JSON.parse(res._get_data());
    expect(responseData).toEqual(expect.objectContaining({ error: '設定キーと設定値が提供されていません' }));

  });

  it('Supabaseからエラーが返された場合に500エラーを返す', async () => {
    (mockSupabaseClient.from('settings').update().eq as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: null, error: new Error('Supabase error') })
    );

    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: {
        id: 'mock-id',
        setting_key: 'top_extraction_ratio',
        setting_value: '0.1'
      },
    });

    await updateHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual(expect.objectContaining({ error: 'パラメータの更新に失敗しました' }));
  });

  it('サポートされていないHTTPメソッドで405エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
    });

    await updateHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
"
}