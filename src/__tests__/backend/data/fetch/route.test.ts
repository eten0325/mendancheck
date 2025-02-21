{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, MockResponse } from 'node-mocks-http';
import { v4 as uuidv4 } from 'uuid';

// Mock Supabase client
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => Promise.resolve({ data: [], error: null })),
    insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
    update: jest.fn(() => Promise.resolve({ data: [], error: null })),
    delete: jest.fn(() => Promise.resolve({ data: [], error: null })),
  })),
  auth: {
    getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } }, error: null })),
  },
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabase),
}));

// Import the API route (assuming it's in pages/api/data/fetch.ts)
import handler from '@/pages/api/data/fetch';


describe('/api/data/fetch', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET: データを正常に取得できる', async () => {
    const mockData = [{ id: uuidv4(), name: 'テストデータ1' }, { id: uuidv4(), name: 'テストデータ2' }];
    (mockSupabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => Promise.resolve({ data: mockData, error: null })),
    });

    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual(mockData);
    expect(mockSupabase.from).toHaveBeenCalledTimes(1);
  });

  it('GET: データ取得時にエラーが発生した場合、500エラーを返す', async () => {
    (mockSupabase.from as jest.Mock).mockReturnValueOnce({
      select: jest.fn(() => Promise.resolve({ data: null, error: new Error('データベースエラー') })),
    });

    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({ error: 'データベースエラー' });
  });

  it('POST: データを正常に作成できる', async () => {
    const mockInsertData = { name: '新規テストデータ' };
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: mockInsertData,
    });

    (mockSupabase.from as jest.Mock).mockReturnValueOnce({
      insert: jest.fn(() => Promise.resolve({ data: [mockInsertData], error: null })),
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._get_data())).toEqual([mockInsertData]);
    expect(mockSupabase.from).toHaveBeenCalledTimes(1);
  });

  it('POST: データ作成時にエラーが発生した場合、500エラーを返す', async () => {
    const mockInsertData = { name: '新規テストデータ' };
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: mockInsertData,
    });

    (mockSupabase.from as jest.Mock).mockReturnValueOnce({
      insert: jest.fn(() => Promise.resolve({ data: null, error: new Error('挿入エラー') })),
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({ error: '挿入エラー' });
  });

  it('PUT: データを正常に更新できる', async () => {
    const mockUpdateData = { id: uuidv4(), name: '更新されたテストデータ' };
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'PUT',
      body: mockUpdateData,
    });

    (mockSupabase.from as jest.Mock).mockReturnValueOnce({
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [mockUpdateData], error: null }))
      }))
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual([mockUpdateData]);
    expect(mockSupabase.from).toHaveBeenCalledTimes(1);
  });

  it('PUT: データ更新時にエラーが発生した場合、500エラーを返す', async () => {
    const mockUpdateData = { id: uuidv4(), name: '更新されたテストデータ' };
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'PUT',
      body: mockUpdateData,
    });

    (mockSupabase.from as jest.Mock).mockReturnValueOnce({
      update: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: new Error('更新エラー') }))
      }))
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({ error: '更新エラー' });
  });

  it('DELETE: データを正常に削除できる', async () => {
    const mockDeleteId = uuidv4();
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'DELETE',
      query: { id: mockDeleteId },
    });

    (mockSupabase.from as jest.Mock).mockReturnValueOnce({
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [{ id: mockDeleteId }], error: null }))
      }))
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual([{ id: mockDeleteId }]);
    expect(mockSupabase.from).toHaveBeenCalledTimes(1);
  });

  it('DELETE: データ削除時にエラーが発生した場合、500エラーを返す', async () => {
    const mockDeleteId = uuidv4();
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'DELETE',
      query: { id: mockDeleteId },
    });

    (mockSupabase.from as jest.Mock).mockReturnValueOnce({
      delete: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: null, error: new Error('削除エラー') }))
      }))
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({ error: '削除エラー' });
  });

  it('認証エラーが発生した場合、401エラーを返す', async () => {
    (mockSupabase.auth.getUser as jest.Mock).mockResolvedValueOnce({ data: { user: null }, error: new Error('認証エラー') });

    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(JSON.parse(res._get_data())).toEqual({ error: '認証が必要です' });
  });

  it('サポートされていないHTTPメソッドの場合、405エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'PATCH',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._get_data())).toEqual({ error: '許可されていないメソッドです' });
  });
});"
}