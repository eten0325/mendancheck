import { NextRouter } from 'next/router';

const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {}, // ← これを追加
  push: jest.fn(),
  replace: jest.fn(),
  // ...
};