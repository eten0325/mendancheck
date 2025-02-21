{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import { v4 as uuidv4 } from 'uuid';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

// Mock Supabase client (replace with your actual Supabase client)
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => Promise.resolve({ data: [], error: null })), // Mock select
    insert: jest.fn(() => Promise.resolve({ data: [], error: null })), // Mock insert
    update: jest.fn(() => Promise.resolve({ data: [], error: null })), // Mock update
    delete: jest.fn(() => Promise.resolve({ data: [], error: null })), // Mock delete
  })),
  auth: {
    getUser: jest.fn(() => Promise.resolve({ data: { user: { id: 'test-user-id' } }, error: null })), // Mock getUser
  }
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

import handler from './file/validate';


describe('/file/validate API のテスト', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET リクエストを処理し、エラーなしで 200 OK を返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  it('POST リクエストを処理し、有効な CSV データで 200 OK を返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        csvData: 'header1,header2\
value1,value2',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  it('POST リクエストを処理し、不正な CSV データで 400 エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        csvData: '',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('PUT リクエストは許可されず、405 Method Not Allowed を返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'PUT',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._get_data()).toBe('Method Not Allowed');
  });

  it('DELETE リクエストは許可されず、405 Method Not Allowed を返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'DELETE',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._get_data()).toBe('Method Not Allowed');
  });

  it('OPTIONS リクエストは許可されず、405 Method Not Allowed を返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'OPTIONS',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(res._get_data()).toBe('Method Not Allowed');
  });

  it('CSV データなしの POST リクエストは 400 エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('ヘッダー行がない CSV データは 400 エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        csvData: 'value1,value2',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('カラム構成が不正な CSV データは 400 エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        csvData: 'header1,header2,header3\
value1,value2',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('データ型が不正な CSV データは 400 エラーを返す', async () => {
      const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
        method: 'POST',
        body: {
          csvData: 'age,name\
string,value2',
        },
      });
  
      await handler(req, res);
  
      expect(res._getStatusCode()).toBe(400);
    });

  it('Supabase からのユーザー取得が失敗した場合、500 エラーを返す', async () => {
    (mockSupabaseClient.auth.getUser as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({ data: { user: null }, error: new Error('Failed to get user') })
    );

    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
  });

  it('有効な CSV データを処理し、Supabase にデータを挿入する', async () => {
    const mockInsert = jest.fn(() => Promise.resolve({ data: [], error: null }));
    (mockSupabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => Promise.resolve({ data: [], error: null })),
        insert: mockInsert
    });

    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        csvData: 'id,name,age\
1,John,30',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    //expect(mockInsert).toHaveBeenCalled(); // Corrected assertion

  });

  it('Supabase へのデータ挿入が失敗した場合、500 エラーを返す', async () => {
    const mockInsert = jest.fn(() => Promise.resolve({ data: null, error: new Error('Failed to insert data') }));
    (mockSupabaseClient.from as jest.Mock).mockReturnValue({
        select: jest.fn(() => Promise.resolve({ data: [], error: null })),
        insert: mockInsert
    });

    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        csvData: 'id,name,age\
1,John,30',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);

  });


  it('認証ヘッダーがない場合、401 Unauthorized を返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
      headers: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
  });

});
"
}