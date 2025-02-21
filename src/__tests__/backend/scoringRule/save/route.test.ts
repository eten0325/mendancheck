{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, RequestMethod } from 'node-mocks-http';
import { createClient } from '@supabase/supabase-js';
import save from '@/pages/api/scoringRule/save';
import { jest } from '@jest/globals';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

// Supabase クライアントのモック
jest.mock('@supabase/supabase-js', () => {
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  };
  return {
    createClient: jest.fn(() => mockSupabase),
  };
});

const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  upsert: jest.fn().mockResolvedValue({ data: null, error: null }),
  select: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
};



describe('/api/scoringRule/save', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  it('POSTメソッドで、正常にスコアリングルールを保存できること', async () => {
    const scoringRule = { id: '1', name: 'Test Rule' };
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: scoringRule,
    });

    await save(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual({ message: 'スコアリングルールを保存しました。' });
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('settings');
    expect(mockSupabaseClient.upsert).toHaveBeenCalledWith(scoringRule);
  });

  it('PUTメソッドは許可されないこと', async () => {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'PUT',
    });

    await save(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._get_data()).toBe('Method Not Allowed');
  });

  it('POSTメソッドで、リクエストボディがない場合、エラーが返されること', async () => {
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: null,
    });

    await save(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._get_data())).toEqual({ error: 'リクエストボディがありません。' });
  });

  it('POSTメソッドで、Supabaseへの保存でエラーが発生した場合、500エラーが返されること', async () => {
    (mockSupabaseClient.upsert as jest.Mock).mockRejectedValue(new Error('Database error'));

    const scoringRule = { id: '1', name: 'Test Rule' };
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: scoringRule,
    });

    await save(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({ error: 'スコアリングルールの保存中にエラーが発生しました。' });
  });

  it('POSTメソッドで、スコアリングルールのIDが存在しない場合、エラーが返されること', async () => {
    const scoringRule = { name: 'Test Rule' };
    const {
      req,
      res,
    }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: scoringRule,
    });

    await save(req, res);

    expect(res._getStatusCode()).toBe(400);
  });
});"
}