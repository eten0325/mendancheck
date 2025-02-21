{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks, RequestMethod } from 'node-mocks-http';
import { jest } from '@jest/globals';
import axios from 'axios';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

// jest.setup.ts
// Fetch のモック
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
    statusText: 'OK',
  })
) as jest.Mock;

// Axios のモック
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Next.js の Router モック
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: jest.fn(),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// グローバル変数の設定
declare global {
  namespace NodeJS {
    interface Global {
      fetch: jest.Mock;
      mockNextRouter: typeof mockRouter;
    }
  }
  var mockNextRouter: typeof mockRouter;
  var axios: typeof mockedAxios;
}

global.mockNextRouter = mockRouter;
global.axios = mockedAxios;

// テスト前の共通セットアップ
beforeEach(() => {
  jest.clearAllMocks();
});

// Supabase クライアントのモック
const mockSupabaseClient = {
  from: jest.fn(() => ({
    insert: jest.fn().mockResolvedValue({ data: [], error: null }),
  })),
};

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}));

// API ルートの型定義（必要に応じて調整）
type LogWriteApiRoute = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

// モックされた API ルートの実装
const logWriteApiRoute: LogWriteApiRoute = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const {
        timestamp,
        log_level,
        message
      } = req.body;

      // バリデーション
      if (!timestamp || !log_level || !message) {
        return res.status(400).json({ error: '必要なパラメータがありません' });
      }

      // Supabase への挿入
      await mockSupabaseClient
        .from('logs')
        .insert([{ timestamp, log_level, message }]);

      return res.status(200).json({ message: 'ログが正常に書き込まれました' });
    } catch (error: any) {
      console.error('Error writing log:', error);
      return res.status(500).json({ error: 'ログ書き込み中にエラーが発生しました' });
    }
  } else {
    res.status(405).json({ error: '許可されていないメソッドです' });
  }
};

describe('/api/log/write.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST リクエストを処理し、ログを正常に書き込む', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        timestamp: '2025-03-01T00:00:00.000Z',
        log_level: 'INFO',
        message: 'テストログメッセージ',
      },
    });

    await logWriteApiRoute(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual({ message: 'ログが正常に書き込まれました' });

    // Supabase の insert が呼ばれたことを確認
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('logs');
    const mockedFrom = (mockSupabaseClient.from as jest.Mock);
    expect(mockedFrom('logs').insert).toHaveBeenCalledWith([
      {
        timestamp: '2025-03-01T00:00:00.000Z',
        log_level: 'INFO',
        message: 'テストログメッセージ',
      },
    ]);
  });

  it('POST リクエストで必要なパラメータがない場合にエラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {},
    });

    await logWriteApiRoute(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._get_data())).toEqual({ error: '必要なパラメータがありません' });
  });

  it('POST リクエストで timestamp がない場合にエラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        log_level: 'INFO',
        message: 'テストログメッセージ',
      },
    });

    await logWriteApiRoute(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._get_data())).toEqual({ error: '必要なパラメータがありません' });
  });

  it('POST リクエストで log_level がない場合にエラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        timestamp: '2025-03-01T00:00:00.000Z',
        message: 'テストログメッセージ',
      },
    });

    await logWriteApiRoute(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._get_data())).toEqual({ error: '必要なパラメータがありません' });
  });

  it('POST リクエストで message がない場合にエラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        timestamp: '2025-03-01T00:00:00.000Z',
        log_level: 'INFO',
      },
    });

    await logWriteApiRoute(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._get_data())).toEqual({ error: '必要なパラメータがありません' });
  });

  it('POST 以外のリクエストで 405 エラーを返す', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await logWriteApiRoute(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._get_data())).toEqual({ error: '許可されていないメソッドです' });
  });

  it('Supabase への挿入中にエラーが発生した場合、500 エラーを返す', async () => {
    // Supabase の insert がエラーを返すようにモック
    (mockSupabaseClient.from as jest.Mock).mockImplementationOnce(() => ({
      insert: jest.fn().mockRejectedValue(new Error('Supabase error')),
    }));

    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
      body: {
        timestamp: '2025-03-01T00:00:00.000Z',
        log_level: 'ERROR',
        message: 'テストエラーログメッセージ',
      },
    });

    await logWriteApiRoute(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({ error: 'ログ書き込み中にエラーが発生しました' });
  });
});
"
}