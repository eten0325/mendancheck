{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import uploadHandler from '@/pages/api/file/upload';
import { jest } from '@jest/globals';
import { SupabaseClient } from '@supabase/supabase-js';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

// Mock Supabase
jest.mock('@supabase/supabase-js', () => {
  const mockSupabaseClient = {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: { path: 'mocked-path' }, error: null }),
      })),
    },
  };
  return {
    createClient: jest.fn(() => mockSupabaseClient),
  };
});


describe('CSVファイルアップロード処理 API', () => {
  let req: NextApiRequest;
  let res: MockResponse;
  let supabaseMock: jest.Mocked<SupabaseClient>;

  beforeEach(() => {
    const { req: mockReq, res: mockRes } = createMocks<NextApiRequest, NextApiResponse>();
    req = mockReq;
    res = mockRes as MockResponse;

    // Supabaseのモックをセットアップ
    supabaseMock = {
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn().mockResolvedValue({ data: { path: 'mocked-path' }, error: null }),
        })) as jest.Mock,
      },
    } as unknown as jest.Mocked<SupabaseClient>;

  });

  it('POSTリクエストを受け付ける', async () => {
    req.method = 'POST';
    req.body = { file: 'mock-file-content' };

    await uploadHandler(req, res);

    expect(res._getStatusCode()).not.toBe(405);
  });

  it('ファイルを受け取り、一時ストレージに保存する', async () => {
    req.method = 'POST';
    req.body = { file: 'mock-file-content', filename: 'test.csv' };

    (req as any).supabase = supabaseMock;

    await uploadHandler(req, res);

    expect(supabaseMock.storage.from).toHaveBeenCalledWith('healthcheck');
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual({ filePath: 'mocked-path' });
  });

  it('ファイルの種類とサイズを検証する', async () => {
    req.method = 'POST';
    req.body = { file: 'invalid-file-content', filename: 'test.txt' };

    await uploadHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._get_data())).toEqual({ error: '無効なファイル形式です。CSVファイルのみアップロード可能です。' });
  });

  it('ファイル保存時にエラーが発生した場合、500エラーを返す', async () => {
    req.method = 'POST';
    req.body = { file: 'mock-file-content', filename: 'test.csv' };

    const mockSupabaseClient = {
      storage: {
        from: jest.fn(() => ({
          upload: jest.fn().mockResolvedValue({ data: null, error: { message: 'upload error' } }),
        })),
      },
    };

    (req as any).supabase = mockSupabaseClient as any;

    await uploadHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({ error: 'ファイルのアップロードに失敗しました。' });
  });

  it('POST以外のリクエストに対して405エラーを返す', async () => {
    req.method = 'GET';

    await uploadHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('ファイル名がない場合、400エラーを返す', async () => {
        req.method = 'POST';
        req.body = { file: 'mock-file-content' };

        await uploadHandler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._get_data())).toEqual({ error: 'ファイル名がありません。' });
    });

    it('ファイル内容がない場合、400エラーを返す', async () => {
        req.method = 'POST';
        req.body = { filename: 'test.csv' };

        await uploadHandler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(JSON.parse(res._get_data())).toEqual({ error: 'ファイル内容がありません。' });
    });
});
"
}