import '@testing-library/jest-dom';
import { NextRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';

type MockedNextRouter = NextRouter & {
  // ほかに拡張したいプロパティがあれば追加
};

// Next.jsのrouterのモック
const mockRouter: NextRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  reload: jest.fn(),
  beforePopState: jest.fn(),
  isFallback: false,
  isPreview: false,
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  pathname: '/test-path',
  route: '/test-path',
  asPath: '/test-path',
  basePath: '',
  query: {}, // ここを追加
};


// Next.jsのrouterモックを設定
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
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