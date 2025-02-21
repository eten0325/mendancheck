{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import fileParseHandler from '@/pages/api/file/parse';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: jest.fn().mockImplementation((data) => ({
      data: JSON.stringify(data),
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    })),
    error: jest.fn().mockImplementation((message, status) => ({
      message,  
      status: status || 500, 
      headers: {},
    })),
  },
}));

describe('/api/file/parse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POSTリクエストを処理し、成功レスポンスを返す', async () => {
    const { req, res } = createMocks<NextApiRequest, MockResponse>({
      method: 'POST',
      body: { fileData: 'test,data\
1,2' },
    });

    await fileParseHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._get_data())).toEqual({
      message: 'CSVファイルの解析に成功しました。',
      data: [
        { test: '1', data: '2' }
      ],
    });
  });

  it('POSTリクエストでファイルデータが空の場合、エラーレスポンスを返す', async () => {
    const { req, res } = createMocks<NextApiRequest, MockResponse>({ method: 'POST', body: {} });

    await fileParseHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._get_data())).toEqual({ message: 'ファイルデータがありません。' });
  });

  it('無効なHTTPメソッドの場合、405エラーを返す', async () => {
    const { req, res } = createMocks<NextApiRequest, MockResponse>({ method: 'GET' });

    await fileParseHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('CSV解析中にエラーが発生した場合、500エラーを返す', async () => {
    const { req, res } = createMocks<NextApiRequest, MockResponse>({method: 'POST',body: { fileData: 'test,data\
1,2,3' }});

    await fileParseHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._get_data())).toEqual({ message: 'CSVファイルの解析中にエラーが発生しました。' });
  });
});
"
}