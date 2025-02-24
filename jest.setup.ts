import '@testing-library/jest-dom';
import { NextRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

type MockedNextRouter = NextRouter & {
  // ほかに拡張したいプロパティがあれば追加
};

// Next.jsのrouterのモック
const createMockRouter = (props: Partial<MockedNextRouter> = {}): MockedNextRouter => ({
  basePath: '',
  pathname: '/test-path',
  route: '/test-path',
  asPath: '/test-path',
  query: {} as ParsedUrlQuery,
  push: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(() => Promise.resolve()),
  beforePopState: jest.fn(),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
  locale: undefined,
  locales: undefined,
  defaultLocale: undefined,
  domainLocales: undefined,
  ...props,
});

// Next.jsのrouterモックを設定
jest.mock('next/router', () => ({
  useRouter: () => createMockRouter(),
}));

// Supabaseのモック
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn(() => Promise.resolve({ data: { session: null }, error: null })),
      signIn: jest.fn(),
      signOut: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => ({
          limit: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
    })),
  })),
}));