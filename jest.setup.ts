import { jest } from '@jest/globals';
import axios from 'axios';
import { NextRouter } from 'next/router';

// Fetch のモック
global.fetch = jest.fn(
  (input: RequestInfo | URL, init?: RequestInit) =>
    Promise.resolve({
      json: () => Promise.resolve({}),
      text: () => Promise.resolve(""),
      ok: true,
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      redirected: false,
      type: 'default' as ResponseType,
      url: '',
      body: null,
      bodyUsed: false,
      clone: () => Promise.resolve({} as Response),
      arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
      blob: () => Promise.resolve(new Blob()),
      formData: () => Promise.resolve(new FormData()),
    } as unknown as Response)
) as jest.MockedFunction<typeof fetch>;

// Axios のモック
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Next.js の Router モック
type PushMock = (url: string, as?: string, options?: Record<string, unknown>) => Promise<boolean>;
type PrefetchMock = (url: string, as?: string, options?: Record<string, unknown>) => Promise<void>;

interface MockedNextRouter extends NextRouter {
  pathname: string;
}

const mockRouter: MockedNextRouter = {
  push: jest.fn<PushMock>().mockResolvedValue(true),
  replace: jest.fn<PushMock>().mockResolvedValue(true),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn<PrefetchMock>().mockResolvedValue(undefined),
  pathname: '/test-path',
  basePath: '',
  route: '/',
  asPath: '/',
  query: {},
  isLocaleDomain: false,
  isReady: true,
  locale: 'ja',
  locales: ['ja'],
  defaultLocale: 'ja',
  events: { emit: jest.fn(), off: jest.fn(), on: jest.fn() },
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