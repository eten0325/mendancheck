import '@testing-library/jest-dom';
import { ParsedUrlQuery } from 'querystring';

type MockedNextRouter = NextRouter & {
  // ほかに拡張したいプロパティがあれば追加
};

// jest.setup.ts
import { jest } from '@jest/globals';
import { NextRouter } from 'next/router';

// Next.js の router のモック
const mockRouter: NextRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  reload: jest.fn(),
  beforePopState: jest.fn(),
  isFallback: false,
  isPreview: false,
  isLocaleDomain: false, // 追加
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  pathname: '/test-path',
  route: '/test-path',
  query: {},
  asPath: '/test-path',
  basePath: '',
};

if (process.env.NODE_ENV === 'test') {
  jest.mock('next/router', () => ({
    useRouter: () => mockRouter,
    usePathname: jest.fn(),
    useSearchParams: jest.fn(),
    useParams: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    reload: jest.fn(),
    beforePopState: jest.fn(),
    isFallback: false,
    isPreview: false,
    isLocaleDomain: false,
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),    
    },
    pathname: '/test-path',
    route: '/test-path',
    query: {},
    asPath: '/test-path',
    basePath: '',
  }));
}     

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