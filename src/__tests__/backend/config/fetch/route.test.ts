{
  "code": "import { NextApiRequest, NextApiResponse } from 'next';
import { createMocks } from 'node-mocks-http';
import configFetchHandler from './config/fetch';
import { jest } from '@jest/globals';

interface MockResponse extends NextApiResponse {
  _getStatusCode(): number;
  _get_data(): string;
}

jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  headers: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue(null),
  }),
}));

describe('/config/fetch API Endpoint', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a 200 status code', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    await configFetchHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  it('should return a 405 status code for POST requests', async () => {
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'POST',
    });

    await configFetchHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('should handle errors and return a 500 status code', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    jest.spyOn(global, 'fetch').mockImplementation(() => {
        throw new Error('Failed to fetch data');
    });

    await configFetchHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._get_data()).toContain('Internal Server Error');
  });

  it('should return a 500 status code when fetch returns an error', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.reject('error'),
      text: () => Promise.reject('error'),
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as any);

    await configFetchHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
  });


  it('should return a 500 status code if JSON parsing fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const { req, res }: { req: NextApiRequest; res: MockResponse } = createMocks({
      method: 'GET',
    });

    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: () => Promise.reject(new Error('JSON parse error')),
      text: () => Promise.resolve('invalid json'),
      ok: true,
      status: 200,
      statusText: 'OK',
    } as any);

    await configFetchHandler(req, res);

    expect(res._getStatusCode()).toBe(500);
  });

});"
}